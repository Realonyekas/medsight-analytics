import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: Track unlock attempts per user
const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const unlockAttempts = new Map<string, { count: number; firstAttempt: number }>();

const checkRateLimit = (userId: string): { allowed: boolean; message?: string } => {
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;
  const record = unlockAttempts.get(userId);

  if (!record || (now - record.firstAttempt) > windowMs) {
    // Reset or create new record
    unlockAttempts.set(userId, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    const remainingMs = windowMs - (now - record.firstAttempt);
    const remainingMinutes = Math.ceil(remainingMs / 60000);
    return { 
      allowed: false, 
      message: `Too many attempts. Please try again in ${remainingMinutes} minute(s).`
    };
  }

  record.count++;
  return { allowed: true };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const masterPassword = Deno.env.get("MEDSIGHT_MASTER_PASSWORD");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!masterPassword || !supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Service unavailable" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create authenticated client to get user
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit before processing
    const rateLimitResult = checkRateLimit(user.id);
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for user ${user.id}`);
      return new Response(
        JSON.stringify({ error: rateLimitResult.message }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user has hospital_admin role
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (rolesError || !roles?.some(r => r.role === "hospital_admin")) {
      console.warn(`User ${user.id} attempted master unlock without admin role`);
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the password from request body
    const { password } = await req.json();

    if (!password || password !== masterPassword) {
      console.warn(`Invalid master password attempt by user ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's hospital_id from profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("hospital_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.hospital_id) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if subscription exists
    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("hospital_id", profile.hospital_id)
      .single();

    const masterPlanData = {
      hospital_id: profile.hospital_id,
      plan: "master",
      is_active: true,
      max_patients: 999999,
      max_users: 999999,
      price_monthly: 0,
      started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100 years
      features: {
        unlimited_everything: true,
        all_analytics: true,
        predictive_models: true,
        custom_ai: true,
        api_access: true,
        priority_support: true,
      },
    };

    if (existingSub) {
      // Update existing subscription
      const { error: updateError } = await supabaseAdmin
        .from("subscriptions")
        .update(masterPlanData)
        .eq("hospital_id", profile.hospital_id);

      if (updateError) {
        console.error("Update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to unlock plan" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Insert new subscription
      const { error: insertError } = await supabaseAdmin
        .from("subscriptions")
        .insert(masterPlanData);

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to unlock plan" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Log successful unlock for audit purposes
    console.log(`Master plan unlocked by user ${user.id} for hospital ${profile.hospital_id}`);

    return new Response(
      JSON.stringify({ success: true, message: "Master plan unlocked successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
});
