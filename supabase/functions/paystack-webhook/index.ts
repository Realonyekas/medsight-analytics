import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.190.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      throw new Error("Webhook not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body and signature
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    console.log("Received webhook with signature:", signature?.substring(0, 20) + "...");

    // Verify webhook signature
    if (signature) {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(paystackSecretKey);
      const messageData = encoder.encode(body);
      
      const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-512" },
        false,
        ["sign"]
      );
      
      const signatureBuffer = await crypto.subtle.sign("HMAC", key, messageData);
      const expectedSignature = new TextDecoder().decode(encode(new Uint8Array(signatureBuffer)));

      if (signature !== expectedSignature) {
        console.error("Invalid webhook signature");
        throw new Error("Invalid signature");
      }
    }

    const event = JSON.parse(body);
    console.log("Webhook event:", event.event, event.data?.reference);

    if (event.event === "charge.success") {
      const { reference, metadata, amount } = event.data;
      const hospital_id = metadata?.hospital_id;
      const plan = metadata?.plan;

      console.log("Processing successful charge:", { reference, hospital_id, plan, amount });

      // Update payment status
      const { error: paymentError } = await supabase
        .from("payments")
        .update({
          status: "success",
          paystack_reference: event.data.id?.toString(),
          metadata: {
            ...event.data,
            completed_at: new Date().toISOString(),
          },
        })
        .eq("payment_reference", reference);

      if (paymentError) {
        console.error("Error updating payment:", paymentError);
      }

      // Update subscription if hospital_id and plan are available
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
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          })
          .eq("hospital_id", hospital_id);

        if (subscriptionError) {
          console.error("Error updating subscription:", subscriptionError);
        } else {
          console.log("Subscription updated successfully for hospital:", hospital_id);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
