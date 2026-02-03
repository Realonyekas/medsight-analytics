-- Create whatsapp_conversations table to track message history
CREATE TABLE public.whatsapp_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  contact_name TEXT,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  context JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whatsapp_messages table to store all messages
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  whatsapp_message_id TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  media_url TEXT,
  template_name TEXT,
  status TEXT DEFAULT 'sent',
  ai_generated BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whatsapp_notification_recipients for team notifications
CREATE TABLE public.whatsapp_notification_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  notification_types TEXT[] DEFAULT ARRAY['demo_request', 'inquiry']::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_notification_recipients ENABLE ROW LEVEL SECURITY;

-- Policies for whatsapp_conversations
CREATE POLICY "Service role can manage conversations"
ON public.whatsapp_conversations
FOR ALL
USING (auth.role() = 'service_role');

-- Policies for whatsapp_messages
CREATE POLICY "Service role can manage messages"
ON public.whatsapp_messages
FOR ALL
USING (auth.role() = 'service_role');

-- Policies for whatsapp_notification_recipients
CREATE POLICY "Service role can manage recipients"
ON public.whatsapp_notification_recipients
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Hospital admins can view recipients"
ON public.whatsapp_notification_recipients
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'hospital_admin'
));

-- Create indexes for performance
CREATE INDEX idx_whatsapp_conversations_phone ON public.whatsapp_conversations(phone_number);
CREATE INDEX idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX idx_whatsapp_messages_created ON public.whatsapp_messages(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_whatsapp_conversations_updated_at
BEFORE UPDATE ON public.whatsapp_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_recipients_updated_at
BEFORE UPDATE ON public.whatsapp_notification_recipients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default notification recipient (your number)
INSERT INTO public.whatsapp_notification_recipients (phone_number, name, role, notification_types)
VALUES ('2347030788968', 'Admin', 'owner', ARRAY['demo_request', 'inquiry', 'alert']::text[]);