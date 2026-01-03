import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbPatient, DbInsight, PatientFlag } from '@/types/database';

export function usePatient(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      // Transform the data to match our types
      return {
        ...data,
        conditions: (data.conditions || []) as unknown as string[],
        ai_flags: (data.ai_flags || []) as unknown as PatientFlag[],
      } as DbPatient;
    },
    enabled: !!patientId,
  });
}

export function usePatientInsights(patientId: string | undefined, hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['patient_insights', patientId, hospitalId],
    queryFn: async () => {
      if (!patientId || !hospitalId) return [];
      const { data, error } = await supabase
        .from('insights')
        .select('*')
        .eq('patient_id', patientId)
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as DbInsight[];
    },
    enabled: !!patientId && !!hospitalId,
  });
}