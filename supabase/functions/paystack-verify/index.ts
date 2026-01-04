import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
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
      throw new Error("Unauthorized");
    }

    const { reference } = await req.json();
    console.log("Verifying payment:", reference);

    // Verify with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
        },
      }
    );

    const paystackData = await paystackResponse.json();
    console.log("Paystack verification response:", paystackData.status, paystackData.data?.status);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Verification failed");
    }

    const paymentStatus = paystackData.data.status;
    const isSuccess = paymentStatus === "success";

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: isSuccess ? "success" : "failed",
        paystack_reference: paystackData.data.id?.toString(),
        metadata: {
          verified_at: new Date().toISOString(),
          paystack_data: paystackData.data,
        },
      })
      .eq("payment_reference", reference);

    if (updateError) {
      console.error("Error updating payment:", updateError);
    }

    // If successful, update subscription
    if (isSuccess && paystackData.data.metadata) {
      const { hospital_id, plan } = paystackData.data.metadata;

      if (hospital_id && plan) {
        const planConfig: Record<string, { max_patients: number; max_users: number; price: number }> = {
          starter: { max_patients: 500, max_users: 5, price: 499 },
          growth: { max_patients: 2000, max_users: 20, price: 1200 },
          enterprise: { max_patients: 10000, max_users: 100, price: 3000 },
        };

        const config = planConfig[plan] || planConfig.starter;

        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .update({
            plan,
            is_active: true,
            max_patients: config.max_patients,
            max_users: config.max_users,
            price_monthly: config.price,
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("hospital_id", hospital_id);

        if (subscriptionError) {
          console.error("Error updating subscription:", subscriptionError);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: isSuccess,
        status: paymentStatus,
        data: paystackData.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
