export type UserRole = 'hospital_admin' | 'clinician' | 'operations';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hospitalId: string;
  hospitalName: string;
  department?: string;
  avatar?: string;
}

export interface Hospital {
  id: string;
  name: string;
  departments: string[];
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'cancelled';
  trialEndsAt?: string;
}

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  department: string;
  admissionDate: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  conditions: string[];
  lastVisit: string;
  flags: PatientFlag[];
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

export interface Insight {
  id: string;
  type: 'alert' | 'recommendation' | 'trend' | 'efficiency';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'clinical' | 'operational' | 'financial';
  createdAt: string;
  affectedPatients?: number;
}

export interface MetricData {
  label: string;
  value: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  unit?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface Subscription {
  tier: 'starter' | 'growth' | 'enterprise';
  name: string;
  price: number;
  features: string[];
  limits: {
    patients?: number;
    users?: number;
    departments?: number;
  };
}
