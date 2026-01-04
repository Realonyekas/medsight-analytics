import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InitializePaymentRequest {
  email: string;
  plan: string;
  hospital_id: string;
  callback_url: string;
}

// Server-side pricing - single source of truth
const PLAN_PRICES_USD: Record<string, number> = {
  starter: 499,
  growth: 1200,
  enterprise: 3000,
};

const NGN_RATE = 1500; // 1 USD = 1500 NGN

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      throw new Error("Payment system not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      console.error("Auth error:", authError);
      throw new Error("Unauthorized");
    }

    const { email, plan, hospital_id, callback_url }: InitializePaymentRequest = await req.json();

    // Validate plan and calculate amount server-side
    const priceUsd = PLAN_PRICES_USD[plan];
    if (!priceUsd) {
      console.error("Invalid plan:", plan);
      throw new Error(`Invalid plan: ${plan}. Valid plans are: starter, growth, enterprise`);
    }

    // Calculate amount in kobo (NGN smallest unit)
    const amount = Math.round(priceUsd * NGN_RATE * 100);

    console.log("Initializing payment:", { email, plan, priceUsd, amount, hospital_id });

    // Generate unique reference
    const reference = `MS_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Initialize transaction with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount, // Paystack expects amount in kobo
        reference,
        callback_url,
        metadata: {
          hospital_id,
          plan,
          custom_fields: [
            {
              display_name: "Hospital ID",
              variable_name: "hospital_id",
              value: hospital_id,
            },
            {
              display_name: "Plan",
              variable_name: "plan",
              value: plan,
            },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    // Create payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      hospital_id,
      amount: amount / 100, // Convert from kobo to naira for storage
      currency: "NGN",
      status: "pending",
      payment_reference: reference,
      plan,
      metadata: {
        paystack_access_code: paystackData.data.access_code,
        initialized_at: new Date().toISOString(),
      },
    });

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
      // Continue anyway - payment can still proceed
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error initializing payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
