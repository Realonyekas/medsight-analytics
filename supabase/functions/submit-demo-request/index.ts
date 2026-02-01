import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DemoRequest {
  name: string;
  email: string;
  phone?: string;
  hospital: string;
  message?: string;
}

// Rate limiting: max requests per email within time window
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;

const checkRateLimit = async (supabase: any, email: string): Promise<{ allowed: boolean; message?: string }> => {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  
  // Check how many requests this email has made in the time window
  const { count, error } = await supabase
    .from('demo_requests')
    .select('id', { count: 'exact', head: true })
    .eq('email', email.trim().toLowerCase())
    .gte('created_at', windowStart);
  
  if (error) {
    console.error("Rate limit check error:", error);
    // Allow on error to avoid blocking legitimate requests
    return { allowed: true };
  }
  
  if (count && count >= RATE_LIMIT_MAX_REQUESTS) {
    return { 
      allowed: false, 
      message: `Too many requests. Please try again in ${RATE_LIMIT_WINDOW_HOURS} hour(s).`
    };
  }
  
  return { allowed: true };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, hospital, message }: DemoRequest = await req.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !hospital?.trim()) {
      return new Response(
        JSON.stringify({ error: "Name, email, and hospital are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs - limit lengths and strip potential harmful content
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 255);
    const sanitizedPhone = phone?.trim().slice(0, 20) || null;
    const sanitizedHospital = hospital.trim().slice(0, 200);
    const sanitizedMessage = message?.trim().slice(0, 1000) || null;

    console.log("Processing demo request from:", sanitizedEmail, "for hospital:", sanitizedHospital);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check rate limit before proceeding
    const rateLimitResult = await checkRateLimit(supabase, sanitizedEmail);
    if (!rateLimitResult.allowed) {
      console.warn("Rate limit exceeded for:", sanitizedEmail);
      return new Response(
        JSON.stringify({ error: rateLimitResult.message }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Store in database
    const { data: demoRequest, error: dbError } = await supabase
      .from("demo_requests")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        hospital: sanitizedHospital,
        message: sanitizedMessage,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save request" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Demo request saved with ID:", demoRequest.id);

    // Send notification emails using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const resendUrl = "https://api.resend.com/emails";
      const headers = {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      };

      // Send internal notification to personal email
      try {
        await fetch(resendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "MedSight Analytics <onboarding@resend.dev>",
            to: ["onwumastanley24@gmail.com"],
            subject: `🏥 New Demo Request from ${sanitizedHospital}`,
            html: `
              <h2>New Demo Request</h2>
              <p><strong>Name:</strong> ${sanitizedName}</p>
              <p><strong>Email:</strong> ${sanitizedEmail}</p>
              <p><strong>Phone:</strong> ${sanitizedPhone || "Not provided"}</p>
              <p><strong>Hospital:</strong> ${sanitizedHospital}</p>
              <p><strong>Message:</strong> ${sanitizedMessage || "No message"}</p>
              <hr>
              <p><small>Submitted at ${new Date().toISOString()}</small></p>
            `,
          }),
        });
        console.log("Internal notification email sent to personal email");
      } catch (emailError) {
        console.error("Failed to send internal notification:", emailError);
      }

      // Send WhatsApp notification via CallMeBot API
      const whatsappNumber = "2347030788968";
      const whatsappMessage = encodeURIComponent(
        `🏥 *New Demo Request*\n\n` +
        `*Name:* ${sanitizedName}\n` +
        `*Email:* ${sanitizedEmail}\n` +
        `*Phone:* ${sanitizedPhone || "Not provided"}\n` +
        `*Hospital:* ${sanitizedHospital}\n` +
        `*Message:* ${sanitizedMessage || "No message"}\n\n` +
        `_Submitted: ${new Date().toLocaleString()}_`
      );
      
      // Using WhatsApp Business API through CallMeBot (free service)
      const callMeBotApiKey = Deno.env.get("CALLMEBOT_API_KEY");
      if (callMeBotApiKey) {
        try {
          const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappNumber}&text=${whatsappMessage}&apikey=${callMeBotApiKey}`;
          await fetch(whatsappUrl);
          console.log("WhatsApp notification sent");
        } catch (whatsappError) {
          console.error("Failed to send WhatsApp notification:", whatsappError);
        }
      } else {
        console.warn("CALLMEBOT_API_KEY not configured, skipping WhatsApp notification");
      }

      // Send confirmation to requester
      try {
        await fetch(resendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "MedSight Analytics <onboarding@resend.dev>",
            to: [sanitizedEmail],
            subject: "We received your demo request",
            html: `
              <h1>Thank you for your interest, ${sanitizedName}!</h1>
              <p>We've received your demo request for <strong>${sanitizedHospital}</strong>.</p>
              <p>A member of our team will reach out to you within 24 hours to schedule a personalized walkthrough of MedSight Analytics.</p>
              <p>In the meantime, feel free to explore our platform at <a href="https://medsight.ng">medsight.ng</a>.</p>
              <br>
              <p>Best regards,</p>
              <p><strong>The MedSight Analytics Team</strong></p>
            `,
          }),
        });
        console.log("Confirmation email sent to:", sanitizedEmail);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email notifications");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error processing demo request:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
