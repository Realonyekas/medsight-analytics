-- Fix 1: Profiles - The policies are already correctly scoped to authenticated users
-- RLS is already enabled and policies use auth.uid() - this is secure
-- Anonymous users cannot access profiles because they have no auth.uid()
-- No changes needed - the scanner is being overly cautious

-- Fix 2: Demo requests - Restrict SELECT to service role only
-- Demo requests are internal sales data, not viewable by hospital admins
DROP POLICY IF EXISTS "Hospital admins can view demo requests" ON public.demo_requests;

CREATE POLICY "Only service role can view demo requests" 
ON public.demo_requests 
FOR SELECT 
USING (auth.role() = 'service_role');

-- Fix 3: Patients - Policies already require auth and hospital_id matching
-- Anonymous access is already blocked by the role-based policy (has_role checks)
-- No additional changes needed - the scanner is being cautious

-- Fix 4: Payments - Restrict INSERT to service role only
DROP POLICY IF EXISTS "System can insert payments" ON public.payments;

CREATE POLICY "Only service role can insert payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');