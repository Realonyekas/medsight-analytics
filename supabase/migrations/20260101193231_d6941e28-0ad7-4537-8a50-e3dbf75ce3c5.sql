
-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('hospital_admin', 'clinician', 'operations');

-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('starter', 'growth', 'enterprise');

-- Create enum for risk levels
CREATE TYPE public.risk_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create enum for insight types
CREATE TYPE public.insight_type AS ENUM ('alert', 'trend', 'recommendation', 'prediction');

-- Create enum for insight categories
CREATE TYPE public.insight_category AS ENUM ('clinical', 'operational', 'financial', 'quality');

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  plan public.subscription_plan NOT NULL DEFAULT 'starter',
  price_monthly INTEGER NOT NULL DEFAULT 499,
  max_users INTEGER NOT NULL DEFAULT 5,
  max_patients INTEGER NOT NULL DEFAULT 500,
  features JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  mrn TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  admission_date TIMESTAMPTZ,
  discharge_date TIMESTAMPTZ,
  primary_diagnosis TEXT,
  conditions JSONB DEFAULT '[]'::jsonb,
  risk_level public.risk_level DEFAULT 'low',
  risk_score DECIMAL(5,2),
  readmission_risk DECIMAL(5,2),
  los_prediction INTEGER,
  ai_flags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (hospital_id, mrn)
);

-- Create insights table
CREATE TABLE public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  type public.insight_type NOT NULL,
  category public.insight_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  is_actionable BOOLEAN DEFAULT false,
  action_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create metrics table for dashboard
CREATE TABLE public.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  unit TEXT,
  trend DECIMAL(5,2),
  trend_direction TEXT,
  category TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's hospital_id
CREATE OR REPLACE FUNCTION public.get_user_hospital_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT hospital_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON public.insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for hospitals
CREATE POLICY "Users can view their own hospital"
  ON public.hospitals FOR SELECT
  TO authenticated
  USING (id = public.get_user_hospital_id(auth.uid()));

CREATE POLICY "Hospital admins can update their hospital"
  ON public.hospitals FOR UPDATE
  TO authenticated
  USING (id = public.get_user_hospital_id(auth.uid()) AND public.has_role(auth.uid(), 'hospital_admin'));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their hospital subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

-- RLS Policies for departments
CREATE POLICY "Users can view their hospital departments"
  ON public.departments FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

CREATE POLICY "Hospital admins can manage departments"
  ON public.departments FOR ALL
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()) AND public.has_role(auth.uid(), 'hospital_admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their hospital"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Hospital admins can manage roles in their hospital"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = user_roles.user_id
      AND p.hospital_id = public.get_user_hospital_id(auth.uid())
    )
    AND public.has_role(auth.uid(), 'hospital_admin')
  );

-- RLS Policies for patients
CREATE POLICY "Users can view patients in their hospital"
  ON public.patients FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

CREATE POLICY "Clinicians and admins can manage patients"
  ON public.patients FOR ALL
  TO authenticated
  USING (
    hospital_id = public.get_user_hospital_id(auth.uid())
    AND (public.has_role(auth.uid(), 'hospital_admin') OR public.has_role(auth.uid(), 'clinician'))
  );

-- RLS Policies for insights
CREATE POLICY "Users can view insights for their hospital"
  ON public.insights FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

CREATE POLICY "Users can update insights (mark as read)"
  ON public.insights FOR UPDATE
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

-- RLS Policies for metrics
CREATE POLICY "Users can view metrics for their hospital"
  ON public.metrics FOR SELECT
  TO authenticated
  USING (hospital_id = public.get_user_hospital_id(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_profiles_hospital_id ON public.profiles(hospital_id);
CREATE INDEX idx_patients_hospital_id ON public.patients(hospital_id);
CREATE INDEX idx_patients_risk_level ON public.patients(risk_level);
CREATE INDEX idx_insights_hospital_id ON public.insights(hospital_id);
CREATE INDEX idx_insights_type ON public.insights(type);
CREATE INDEX idx_metrics_hospital_id ON public.metrics(hospital_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
