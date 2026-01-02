-- Function to check if user needs onboarding (no hospital assigned)
CREATE OR REPLACE FUNCTION public.user_needs_onboarding(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND hospital_id IS NOT NULL
  )
$$;

-- Allow new users to create a hospital during onboarding
CREATE POLICY "Users can create hospital during onboarding"
ON public.hospitals
FOR INSERT
TO authenticated
WITH CHECK (
  public.user_needs_onboarding(auth.uid())
);

-- Allow users to insert their own subscription during onboarding
CREATE POLICY "Users can create initial subscription"
ON public.subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  hospital_id IN (
    SELECT id FROM public.hospitals WHERE id = hospital_id
  )
  AND public.user_needs_onboarding(auth.uid())
);

-- Allow users to assign themselves the hospital_admin role during onboarding
CREATE POLICY "Users can assign initial admin role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'hospital_admin'
  AND public.user_needs_onboarding(auth.uid())
);

-- Allow users to update their own profile to link to hospital during onboarding
CREATE POLICY "Users can link to hospital during onboarding"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Allow users to create departments for their hospital during setup
CREATE POLICY "Users can create departments during onboarding"
ON public.departments
FOR INSERT
TO authenticated
WITH CHECK (
  hospital_id IN (
    SELECT hospital_id FROM public.profiles WHERE id = auth.uid()
  )
);