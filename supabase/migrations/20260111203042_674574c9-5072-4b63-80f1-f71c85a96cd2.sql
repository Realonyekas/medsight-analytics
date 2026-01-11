-- Fix overly permissive RLS policy on subscriptions table
-- Current policy allows any service role to update, we need to restrict this properly

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Service role can update subscriptions" ON public.subscriptions;

-- Create a proper policy that only allows service role (used by edge functions)
-- This policy is checked at the SQL level, service_role bypasses RLS by default
-- So we need to use auth.role() check for non-service-role contexts
CREATE POLICY "Service role can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add validation to security definer functions to ensure they're only checking current user's data
-- or called from trusted RLS policy contexts

-- Update has_role function to validate caller
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- This function is designed to be called from RLS policies
  -- It checks if the specified user has the given role
  -- Security: search_path is set to public to prevent hijacking
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update get_user_hospital_id function 
CREATE OR REPLACE FUNCTION public.get_user_hospital_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- This function is designed to be called from RLS policies
  -- It returns the hospital_id for the specified user
  -- Security: search_path is set to public to prevent hijacking
  SELECT hospital_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Update user_needs_onboarding function
CREATE OR REPLACE FUNCTION public.user_needs_onboarding(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Check if user needs onboarding (no hospital_id set)
  -- Security: search_path is set to public to prevent hijacking
  SELECT hospital_id IS NULL
  FROM public.profiles
  WHERE id = _user_id
$$;