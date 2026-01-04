-- Create demo_requests table for lead tracking
CREATE TABLE public.demo_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  hospital TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for demo requests)
CREATE POLICY "Anyone can submit demo requests"
ON public.demo_requests
FOR INSERT
WITH CHECK (true);

-- Only service role can read/update (for admin purposes)
CREATE POLICY "Service role can manage demo requests"
ON public.demo_requests
FOR ALL
USING (auth.role() = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_demo_requests_updated_at
BEFORE UPDATE ON public.demo_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();