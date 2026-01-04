import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_reference: string | null;
  plan: string | null;
  created_at: string;
}

export function usePaymentHistory(hospitalId: string | undefined) {
  return useQuery({
    queryKey: ['payments', hospitalId],
    queryFn: async () => {
      if (!hospitalId) return [];
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('hospital_id', hospitalId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!hospitalId,
  });
}
