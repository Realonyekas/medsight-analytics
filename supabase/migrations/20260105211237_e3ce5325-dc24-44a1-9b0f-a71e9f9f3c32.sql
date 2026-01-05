-- Fix the subscription policy to remove the redundant/tautological condition
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create initial subscription" ON public.subscriptions;

-- Create a cleaner policy that relies on RLS (users can only see their own hospital)
-- and the onboarding check
CREATE POLICY "Users can create initial subscription"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  -- Verify the hospital_id belongs to the user via their profile
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND hospital_id = subscriptions.hospital_id
  )
  AND public.user_needs_onboarding(auth.uid())
);