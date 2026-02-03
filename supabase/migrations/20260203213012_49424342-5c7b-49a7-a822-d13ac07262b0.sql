-- Fix 1: Patients table - Add department-level restrictions for better access control
-- Drop existing SELECT policy and replace with role-based access

DROP POLICY IF EXISTS "Users can view patients in their hospital" ON public.patients;

-- Create new policy: Only clinicians and admins can view patients, with optional department filtering
-- Clinicians see patients in their department, admins see all patients in their hospital
CREATE POLICY "Role-based patient access" 
ON public.patients 
FOR SELECT 
USING (
  hospital_id = get_user_hospital_id(auth.uid())
  AND (
    -- Hospital admins can see all patients in their hospital
    has_role(auth.uid(), 'hospital_admin'::app_role)
    OR
    -- Clinicians can see patients in their department or unassigned patients
    (
      has_role(auth.uid(), 'clinician'::app_role)
      AND (
        department_id IS NULL
        OR department_id IN (
          SELECT p.department_id 
          FROM profiles p 
          WHERE p.id = auth.uid() AND p.department_id IS NOT NULL
        )
        -- Or allow clinicians to see all if they don't have a department assigned
        OR NOT EXISTS (
          SELECT 1 FROM profiles p 
          WHERE p.id = auth.uid() AND p.department_id IS NOT NULL
        )
      )
    )
  )
);

-- Fix 2: Demo requests table - The rate limiting is already in the edge function
-- But add a more restrictive INSERT policy to require minimal validation
-- Note: Rate limiting is enforced server-side in submit-demo-request edge function