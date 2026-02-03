import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendMessageRequest {
  to: string | string[];
  message?: string;
  template?: {
    name: string;
    language: string;
    components?: Array<{
      type: string;
      parameters: Array<{ type: string; text?: string; image?: { link: string } }>;
    }>;
  };
  notificationType?: string;
}

interface TemplateMessage {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  template: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{ type: string; text?: string; image?: { link: string } }>;
    }>;
  };
}

interface TextMessage {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  text: { body: string };
}

async function sendToRecipient(
  to: string,
  payload: TemplateMessage | TextMessage
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!accessToken || !phoneNumberId) {
    return { success: false, error: "WhatsApp credentials not configured" };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return { success: false, error: data.error?.message || "Send failed" };
    }

    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error("Send error:", error);
    return { success: false, error: String(error) };
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { to, message, template, notificationType }: SendMessageRequest = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Determine recipients
    let recipients: string[] = [];

    if (to) {
      recipients = Array.isArray(to) ? to : [to];
    } else if (notificationType) {
      // Get recipients based on notification type
      const { data: recipientData } = await supabase
        .from("whatsapp_notification_recipients")
        .select("phone_number")
        .eq("is_active", true)
        .contains("notification_types", [notificationType]);

      recipients = recipientData?.map(r => r.phone_number) || [];
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients specified" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const results: Array<{ phone: string; success: boolean; messageId?: string; error?: string }> = [];

    for (const phone of recipients) {
      let payload: TemplateMessage | TextMessage;

      if (template) {
        payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "template",
          template: {
            name: template.name,
            language: { code: template.language },
            components: template.components,
          },
        };
      } else if (message) {
        payload = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "text",
          text: { body: message },
        };
      } else {
        results.push({ phone, success: false, error: "No message or template provided" });
        continue;
      }

      const result = await sendToRecipient(phone, payload);
      results.push({ phone, ...result });

      // Store outbound message if conversation exists
      if (result.success && message) {
        const { data: conversation } = await supabase
          .from("whatsapp_conversations")
          .select("id")
          .eq("phone_number", phone)
          .single();

        if (conversation) {
          await supabase
            .from("whatsapp_messages")
            .insert({
              conversation_id: conversation.id,
              whatsapp_message_id: result.messageId,
              direction: "outbound",
              message_type: template ? "template" : "text",
              content: message || `[Template: ${template?.name}]`,
              template_name: template?.name,
              status: "sent",
            });
        }
      }
    }

    const allSuccessful = results.every(r => r.success);

    return new Response(
      JSON.stringify({
        success: allSuccessful,
        results,
      }),
      {
        status: allSuccessful ? 200 : 207,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Handler error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
