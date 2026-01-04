import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, hospital, message }: DemoRequest = await req.json();

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !hospital?.trim()) {
      console.error("Missing required fields:", { name, email, hospital });
      return new Response(
        JSON.stringify({ error: "Name, email, and hospital are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Processing demo request from:", email, "for hospital:", hospital);

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store in database
    const { data: demoRequest, error: dbError } = await supabase
      .from("demo_requests")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        hospital: hospital.trim(),
        message: message?.trim() || null,
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

      // Send internal notification
      try {
        await fetch(resendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "MedSight Analytics <onboarding@resend.dev>",
            to: ["sales@medsight.ng"],
            subject: `New Demo Request from ${hospital}`,
            html: `
              <h2>New Demo Request</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Hospital:</strong> ${hospital}</p>
              <p><strong>Message:</strong> ${message || "No message"}</p>
              <hr>
              <p><small>Submitted at ${new Date().toISOString()}</small></p>
            `,
          }),
        });
        console.log("Internal notification email sent");
      } catch (emailError) {
        console.error("Failed to send internal notification:", emailError);
      }

      // Send confirmation to requester
      try {
        await fetch(resendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            from: "MedSight Analytics <onboarding@resend.dev>",
            to: [email],
            subject: "We received your demo request",
            html: `
              <h1>Thank you for your interest, ${name}!</h1>
              <p>We've received your demo request for <strong>${hospital}</strong>.</p>
              <p>A member of our team will reach out to you within 24 hours to schedule a personalized walkthrough of MedSight Analytics.</p>
              <p>In the meantime, feel free to explore our platform at <a href="https://medsight.ng">medsight.ng</a>.</p>
              <br>
              <p>Best regards,</p>
              <p><strong>The MedSight Analytics Team</strong></p>
            `,
          }),
        });
        console.log("Confirmation email sent to:", email);
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email notifications");
    }

    return new Response(
      JSON.stringify({ success: true, id: demoRequest.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error processing demo request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
