-- Fix 1: Demo requests - Ensure SELECT is restricted to hospital admins and service role
-- The existing policy already does this but let's verify it's in place

-- Fix 2: Profiles - The existing policies are actually secure
-- "Users can view profiles in their hospital" uses get_user_hospital_id(auth.uid()) which validates hospital membership
-- "Users can view their own profile" uses id = auth.uid()
-- No action needed - policies are correctly scoped

-- Fix 3: Patients - Tighten the clinician access policy
-- Remove the "NOT EXISTS" clause that grants broad access to clinicians without department
DROP POLICY IF EXISTS "Role-based patient access" ON public.patients;

CREATE POLICY "Role-based patient access" 
ON public.patients 
FOR SELECT 
USING (
  hospital_id = get_user_hospital_id(auth.uid())
  AND (
    -- Hospital admins can see all patients in their hospital
    has_role(auth.uid(), 'hospital_admin'::app_role)
    OR
    -- Clinicians can only see patients in their department
    -- If clinician has no department assigned, they can see unassigned patients only
    (
      has_role(auth.uid(), 'clinician'::app_role)
      AND (
        -- Patient has no department (unassigned patients visible to all clinicians)
        department_id IS NULL
        OR
        -- Patient is in clinician's department
        department_id IN (
          SELECT p.department_id 
          FROM profiles p 
          WHERE p.id = auth.uid() AND p.department_id IS NOT NULL
        )
      )
    )
  )
);

-- Fix 4: Payments - Restrict viewing to hospital admins only
DROP POLICY IF EXISTS "Users can view their hospital payments" ON public.payments;

CREATE POLICY "Hospital admins can view their hospital payments" 
ON public.payments 
FOR SELECT 
USING (
  hospital_id = get_user_hospital_id(auth.uid())
  AND has_role(auth.uid(), 'hospital_admin'::app_role)
);