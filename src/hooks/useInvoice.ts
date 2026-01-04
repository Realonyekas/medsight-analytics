import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInvoice() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();

  const downloadInvoice = async (paymentId: string) => {
    setIsGenerating(paymentId);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-invoice', {
        body: { payment_id: paymentId },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate invoice');
      }

      // Convert base64 to blob and download
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Invoice Downloaded',
        description: 'Your invoice has been downloaded successfully.',
      });
    } catch (error: any) {
      console.error('Invoice download error:', error);
      toast({
        title: 'Download Failed',
        description: error.message || 'Failed to download invoice',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  return {
    downloadInvoice,
    isGenerating,
  };
}
