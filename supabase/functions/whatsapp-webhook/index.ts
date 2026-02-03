import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; caption?: string };
  document?: { id: string; filename: string };
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: { display_phone_number: string; phone_number_id: string };
        contacts?: Array<{ profile: { name: string }; wa_id: string }>;
        messages?: WhatsAppMessage[];
        statuses?: Array<{ id: string; status: string; timestamp: string }>;
      };
      field: string;
    }>;
  }>;
}

const MEDSIGHT_CONTEXT = `You are MedSight AI, an intelligent assistant for MedSight Analytics - a healthcare analytics platform for Nigerian hospitals.

About MedSight Analytics:
- AI-powered predictive analytics for patient risk assessment
- Real-time hospital performance monitoring
- Readmission risk prediction and length-of-stay forecasting
- Revenue optimization and operational insights
- Designed specifically for Nigerian healthcare facilities

Your role:
- Answer questions about MedSight Analytics features and benefits
- Help potential customers understand how MedSight can help their hospital
- Collect information from interested hospitals for demo scheduling
- Be professional, helpful, and concise
- Use Nigerian English when appropriate
- Keep responses under 300 characters for WhatsApp readability

If someone wants a demo, collect: Hospital name, Contact person, Email, and preferred time.
If you don't know something specific, offer to connect them with our sales team.`;

async function generateAIResponse(
  message: string,
  conversationContext: Array<{ role: string; content: string }>
): Promise<string> {
  const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
  
  if (!lovableApiKey) {
    console.error("LOVABLE_API_KEY not configured");
    return "Thank you for your message! Our team will get back to you shortly. For immediate assistance, email us at hello@medsight.ng";
  }

  try {
    const messages = [
      { role: "system", content: MEDSIGHT_CONTEXT },
      ...conversationContext.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai-proxy.lovable.dev/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      return "Thanks for reaching out! I'll have our team respond to you shortly.";
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Thanks for your message! Our team will assist you soon.";
  } catch (error) {
    console.error("AI generation error:", error);
    return "Thanks for reaching out! Our team will respond shortly.";
  }
}

async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");

  if (!accessToken || !phoneNumberId) {
    console.error("WhatsApp credentials not configured");
    return false;
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
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("WhatsApp send error:", errorText);
      return false;
    }

    console.log("Message sent successfully to:", to);
    return true;
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Webhook verification (GET request from Meta)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    
    const verifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified successfully");
      return new Response(challenge, { status: 200 });
    }

    console.error("Webhook verification failed");
    return new Response("Verification failed", { status: 403 });
  }

  // Handle incoming messages (POST request)
  if (req.method === "POST") {
    try {
      const payload: WhatsAppWebhookPayload = await req.json();
      console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Process each entry
      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // Handle incoming messages
          if (value.messages && value.messages.length > 0) {
            for (const message of value.messages) {
              const senderPhone = message.from;
              const contactName = value.contacts?.[0]?.profile?.name || "Unknown";
              
              let messageContent = "";
              if (message.type === "text" && message.text) {
                messageContent = message.text.body;
              } else if (message.type === "image") {
                messageContent = message.image?.caption || "[Image received]";
              } else {
                messageContent = `[${message.type} message received]`;
              }

              console.log(`Message from ${senderPhone} (${contactName}): ${messageContent}`);

              // Get or create conversation
              let { data: conversation } = await supabase
                .from("whatsapp_conversations")
                .select("*")
                .eq("phone_number", senderPhone)
                .single();

              if (!conversation) {
                const { data: newConversation, error: createError } = await supabase
                  .from("whatsapp_conversations")
                  .insert({
                    phone_number: senderPhone,
                    contact_name: contactName,
                    last_message: messageContent,
                    context: [],
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error("Failed to create conversation:", createError);
                  continue;
                }
                conversation = newConversation;
              } else {
                // Update existing conversation
                await supabase
                  .from("whatsapp_conversations")
                  .update({
                    last_message: messageContent,
                    last_message_at: new Date().toISOString(),
                    contact_name: contactName,
                  })
                  .eq("id", conversation.id);
              }

              // Store inbound message
              await supabase
                .from("whatsapp_messages")
                .insert({
                  conversation_id: conversation.id,
                  whatsapp_message_id: message.id,
                  direction: "inbound",
                  message_type: message.type,
                  content: messageContent,
                });

              // Get conversation context for AI
              const conversationContext = (conversation.context as Array<{ role: string; content: string }>) || [];
              
              // Generate AI response
              const aiResponse = await generateAIResponse(messageContent, conversationContext);

              // Update conversation context
              const updatedContext = [
                ...conversationContext,
                { role: "user", content: messageContent },
                { role: "assistant", content: aiResponse },
              ].slice(-20); // Keep last 20 messages

              await supabase
                .from("whatsapp_conversations")
                .update({ context: updatedContext })
                .eq("id", conversation.id);

              // Send AI response
              const sent = await sendWhatsAppMessage(senderPhone, aiResponse);

              // Store outbound message
              await supabase
                .from("whatsapp_messages")
                .insert({
                  conversation_id: conversation.id,
                  direction: "outbound",
                  message_type: "text",
                  content: aiResponse,
                  ai_generated: true,
                  status: sent ? "sent" : "failed",
                });
            }
          }

          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log(`Message ${status.id} status: ${status.status}`);
              await supabase
                .from("whatsapp_messages")
                .update({ status: status.status })
                .eq("whatsapp_message_id", status.id);
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response(JSON.stringify({ error: "Processing failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
};

serve(handler);
