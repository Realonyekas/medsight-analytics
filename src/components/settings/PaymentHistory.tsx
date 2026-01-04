import { format } from 'date-fns';
import { Receipt, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { usePaymentHistory } from '@/hooks/usePaymentHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PaymentHistoryProps {
  hospitalId: string | undefined;
}

export function PaymentHistory({ hospitalId }: PaymentHistoryProps) {
  const { data: payments, isLoading } = usePaymentHistory(hospitalId);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Successful' };
      case 'failed':
        return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Failed' };
      default:
        return { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' };
    }
  };

  const getPlanLabel = (plan: string | null) => {
    if (!plan) return 'Unknown';
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No payment history yet</p>
        <p className="text-sm mt-1">Your payments will appear here after your first transaction</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => {
        const status = getStatusConfig(payment.status);
        const StatusIcon = status.icon;

        return (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn('p-2 rounded-full', status.bg)}>
                <StatusIcon className={cn('h-5 w-5', status.color)} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{getPlanLabel(payment.plan)} Plan</p>
                  <Badge variant="outline" className={cn('text-xs', status.color)}>
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.created_at), 'MMM d, yyyy · h:mm a')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatNaira(payment.amount)}</p>
              {payment.payment_reference && (
                <p className="text-xs text-muted-foreground font-mono">
                  {payment.payment_reference.slice(0, 15)}...
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
