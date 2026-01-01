// Database types that match our Supabase schema
export type AppRole = 'hospital_admin' | 'clinician' | 'operations';
export type SubscriptionPlan = 'starter' | 'growth' | 'enterprise';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type InsightType = 'alert' | 'trend' | 'recommendation' | 'prediction';
export type InsightCategory = 'clinical' | 'operational' | 'financial' | 'quality';

export interface DbHospital {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSubscription {
  id: string;
  hospital_id: string;
  plan: SubscriptionPlan;
  price_monthly: number;
  max_users: number;
  max_patients: number;
  features: string[];
  started_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbDepartment {
  id: string;
  hospital_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  hospital_id: string | null;
  department_id: string | null;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbUserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface DbPatient {
  id: string;
  hospital_id: string;
  department_id: string | null;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string | null;
  gender: string | null;
  admission_date: string | null;
  discharge_date: string | null;
  primary_diagnosis: string | null;
  conditions: string[];
  risk_level: RiskLevel;
  risk_score: number | null;
  readmission_risk: number | null;
  los_prediction: number | null;
  ai_flags: PatientFlag[];
  created_at: string;
  updated_at: string;
}

export interface PatientFlag {
  id: string;
  type: 'readmission_risk' | 'medication_adherence' | 'follow_up_required' | 'cost_optimization' | 'vital_alert';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  createdAt: string;
}

export interface DbInsight {
  id: string;
  hospital_id: string;
  patient_id: string | null;
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  priority: string;
  is_actionable: boolean;
  action_label: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMetric {
  id: string;
  hospital_id: string;
  name: string;
  value: number;
  unit: string | null;
  trend: number | null;
  trend_direction: string | null;
  category: string | null;
  recorded_at: string;
  created_at: string;
}
