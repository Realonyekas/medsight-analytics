import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Checking for expiring subscriptions...");

    // Find subscriptions expiring within 7 days
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: expiringSubscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select(`
        *,
        hospital:hospitals(id, name, email)
      `)
      .eq("is_active", true)
      .lte("expires_at", sevenDaysFromNow.toISOString())
      .gt("expires_at", now.toISOString());

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      throw subError;
    }

    console.log(`Found ${expiringSubscriptions?.length || 0} expiring subscriptions`);

    const emailResults = [];

    for (const subscription of expiringSubscriptions || []) {
      const hospital = subscription.hospital as any;
      if (!hospital?.email) {
        console.log(`Skipping hospital ${hospital?.name} - no email`);
        continue;
      }

      const expiryDate = new Date(subscription.expires_at);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);

      try {
        const { data, error } = await resend.emails.send({
          from: "MedSight Analytics <noreply@resend.dev>",
          to: [hospital.email],
          subject: `⚠️ Your ${planName} subscription expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #228B22 0%, #2E8B57 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">MedSight Analytics</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Healthcare Decision Intelligence</p>
              </div>
              
              <div style="background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="color: #333; margin-top: 0;">Subscription Expiring Soon</h2>
                
                <p>Hello <strong>${hospital.name}</strong>,</p>
                
                <p>Your <strong>${planName}</strong> subscription will expire on <strong>${expiryDate.toLocaleDateString("en-NG", { 
                  weekday: "long",
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}</strong>.</p>
                
                <div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #856404;">
                    <strong>⏰ ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""} remaining</strong><br>
                    Renew now to ensure uninterrupted access to all your healthcare analytics features.
                  </p>
                </div>
                
                <p>To renew your subscription:</p>
                <ol style="padding-left: 20px;">
                  <li>Log in to your MedSight Analytics dashboard</li>
                  <li>Navigate to Settings → Subscription Plans</li>
                  <li>Click "Upgrade" or renew your current plan</li>
                </ol>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="#" style="background: #228B22; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Renew Subscription</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">
                  If you have any questions about your subscription, please contact our support team.
                </p>
                
                <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                  You're receiving this email because you have an active subscription with MedSight Analytics.<br>
                  © ${new Date().getFullYear()} MedSight Analytics. All rights reserved.
                </p>
              </div>
            </body>
            </html>
          `,
        });

        if (error) {
          console.error(`Failed to send email to ${hospital.email}:`, error);
          emailResults.push({ hospital: hospital.name, success: false, error: error.message });
        } else {
          console.log(`Email sent to ${hospital.email}`);
          emailResults.push({ hospital: hospital.name, success: true });
        }
      } catch (emailError: any) {
        console.error(`Email error for ${hospital.email}:`, emailError);
        emailResults.push({ hospital: hospital.name, success: false, error: emailError.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiringSubscriptions?.length || 0,
        results: emailResults,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Subscription reminder error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
