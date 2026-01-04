-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Users can view insights for their hospital" ON public.insights;
DROP POLICY IF EXISTS "Users can update insights (mark as read)" ON public.insights;

-- Create new restrictive SELECT policy - only clinicians and admins can view clinical insights
CREATE POLICY "Clinicians and admins can view insights"
ON public.insights
FOR SELECT
USING (
  hospital_id = get_user_hospital_id(auth.uid())
  AND (
    has_role(auth.uid(), 'hospital_admin'::app_role)
    OR has_role(auth.uid(), 'clinician'::app_role)
  )
);

-- Create new restrictive UPDATE policy - only clinicians and admins can mark as read
CREATE POLICY "Clinicians and admins can update insights"
ON public.insights
FOR UPDATE
USING (
  hospital_id = get_user_hospital_id(auth.uid())
  AND (
    has_role(auth.uid(), 'hospital_admin'::app_role)
    OR has_role(auth.uid(), 'clinician'::app_role)
  )
);