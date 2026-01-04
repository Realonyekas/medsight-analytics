import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { payment_id } = await req.json();
    console.log("Generating invoice for payment:", payment_id);

    // Fetch payment details
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, hospital:hospitals(name, address, city, state, email)")
      .eq("id", payment_id)
      .maybeSingle();

    if (paymentError || !payment) {
      throw new Error("Payment not found");
    }

    // Verify user has access to this payment
    const { data: profile } = await supabase
      .from("profiles")
      .select("hospital_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.hospital_id !== payment.hospital_id) {
      throw new Error("Unauthorized access to payment");
    }

    // Generate PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(34, 139, 34);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MedSight Analytics", 20, 25);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", pageWidth - 20, 25, { align: "right" });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${payment.payment_reference || payment.id.slice(0, 8).toUpperCase()}`, 20, 55);
    doc.text(`Date: ${new Date(payment.created_at).toLocaleDateString("en-NG", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })}`, 20, 62);
    doc.text(`Status: ${payment.status.toUpperCase()}`, 20, 69);

    // Bill To
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 20, 85);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const hospital = payment.hospital as any;
    doc.text(hospital?.name || "N/A", 20, 93);
    if (hospital?.address) doc.text(hospital.address, 20, 100);
    if (hospital?.city) doc.text(`${hospital.city}, ${hospital.state || ""}`, 20, 107);
    if (hospital?.email) doc.text(hospital.email, 20, 114);

    // Items table header
    const tableTop = 135;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, tableTop, pageWidth - 40, 10, "F");
    
    doc.setFont("helvetica", "bold");
    doc.text("Description", 25, tableTop + 7);
    doc.text("Amount", pageWidth - 25, tableTop + 7, { align: "right" });

    // Item row
    doc.setFont("helvetica", "normal");
    const planName = payment.plan 
      ? `${payment.plan.charAt(0).toUpperCase() + payment.plan.slice(1)} Plan - Monthly Subscription`
      : "Subscription Payment";
    doc.text(planName, 25, tableTop + 20);
    
    const formattedAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: payment.currency || "NGN",
      minimumFractionDigits: 0,
    }).format(payment.amount);
    doc.text(formattedAmount, pageWidth - 25, tableTop + 20, { align: "right" });

    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, tableTop + 28, pageWidth - 20, tableTop + 28);

    // Total
    doc.setFont("helvetica", "bold");
    doc.text("Total:", pageWidth - 70, tableTop + 40);
    doc.text(formattedAmount, pageWidth - 25, tableTop + 40, { align: "right" });

    // Payment info
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Payment Method: Paystack (Card/Bank Transfer/USSD)", 20, tableTop + 60);
    if (payment.paystack_reference) {
      doc.text(`Transaction Reference: ${payment.paystack_reference}`, 20, tableTop + 67);
    }

    // Footer
    doc.setFontSize(8);
    doc.text("Thank you for your business!", pageWidth / 2, 270, { align: "center" });
    doc.text("MedSight Analytics - Healthcare Decision Intelligence", pageWidth / 2, 277, { align: "center" });
    doc.text("support@medsight.com | www.medsight.com", pageWidth / 2, 284, { align: "center" });

    // Generate PDF as base64
    const pdfBase64 = doc.output("datauristring").split(",")[1];

    return new Response(
      JSON.stringify({
        success: true,
        pdf: pdfBase64,
        filename: `invoice-${payment.payment_reference || payment.id.slice(0, 8)}.pdf`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Invoice generation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
