-- Allow hospital admins to view demo requests
CREATE POLICY "Hospital admins can view demo requests"
ON public.demo_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'hospital_admin'
  )
);

-- Allow hospital admins to update demo request status
CREATE POLICY "Hospital admins can update demo requests"
ON public.demo_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'hospital_admin'
  )
);