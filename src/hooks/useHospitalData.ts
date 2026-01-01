import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbHospital, DbSubscription, DbDepartment, DbProfile, DbUserRole, DbPatient, DbInsight, DbMetric, AppRole, PatientFlag } from '@/types/database';

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      return data as DbProfile | null;
    },
    enabled: !!userId,
  });
}

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: ['user_roles', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      if (error) throw error;
      return (data || []) as DbUserRole[];
    },
    enabled: !!userId,
  });
}

export function useHospital(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['hospital', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return null;
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', hospitalId)
        .maybeSingle();
      if (error) throw error;
      return data as DbHospital | null;
    },
    enabled: !!hospitalId,
  });
}

export function useSubscription(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['subscription', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('hospital_id', hospitalId)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      return data as DbSubscription | null;
    },
    enabled: !!hospitalId,
  });
}

export function useDepartments(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['departments', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return [];
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('name');
      if (error) throw error;
      return (data || []) as DbDepartment[];
    },
    enabled: !!hospitalId,
  });
}

export function usePatients(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['patients', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return [];
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('risk_score', { ascending: false });
      if (error) throw error;
      // Transform the data to match our types
      return (data || []).map(p => ({
        ...p,
        conditions: (p.conditions || []) as unknown as string[],
        ai_flags: (p.ai_flags || []) as unknown as PatientFlag[],
      })) as DbPatient[];
    },
    enabled: !!hospitalId,
  });
}

export function useInsights(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['insights', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return [];
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as DbInsight[];
    },
    enabled: !!hospitalId,
  });
}

export function useMetrics(hospitalId: string | undefined, category?: string) {
  return useQuery({
    queryKey: ['metrics', hospitalId, category],
    queryFn: async () => {
      if (!hospitalId) return [];
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('recorded_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return (data || []) as DbMetric[];
    },
    enabled: !!hospitalId,
  });
}

// Helper function to get primary role
export function getPrimaryRole(roles: DbUserRole[]): AppRole | null {
  if (!roles.length) return null;
  // Priority: hospital_admin > clinician > operations
  if (roles.some(r => r.role === 'hospital_admin')) return 'hospital_admin';
  if (roles.some(r => r.role === 'clinician')) return 'clinician';
  if (roles.some(r => r.role === 'operations')) return 'operations';
  return roles[0].role;
}
