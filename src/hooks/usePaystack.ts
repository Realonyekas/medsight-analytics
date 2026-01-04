import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaystackInitResponse {
  success: boolean;
  authorization_url?: string;
  access_code?: string;
  reference?: string;
  error?: string;
}

export function usePaystack() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initializePayment = async (
    email: string,
    plan: string,
    hospitalId: string
  ): Promise<PaystackInitResponse | null> => {
    setIsLoading(true);
    
    try {
      const callbackUrl = `${window.location.origin}/settings?payment=callback`;

      // Server calculates amount based on plan - prevents price manipulation
      const { data, error } = await supabase.functions.invoke('paystack-initialize', {
        body: {
          email,
          plan,
          hospital_id: hospitalId,
          callback_url: callbackUrl,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      return data;
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('paystack-verify', {
        body: { reference },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast({
          title: 'Payment Successful',
          description: 'Your subscription has been activated!',
        });
      } else {
        throw new Error('Payment verification failed');
      }

      return data;
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Error',
        description: error.message || 'Failed to verify payment',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    verifyPayment,
    isLoading,
  };
}
