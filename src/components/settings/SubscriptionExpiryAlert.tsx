import { differenceInDays, format } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubscriptionExpiryAlertProps {
  expiresAt: string | null;
  isActive: boolean;
  onRenew?: () => void;
}

export function SubscriptionExpiryAlert({ expiresAt, isActive, onRenew }: SubscriptionExpiryAlertProps) {
  if (!expiresAt) return null;

  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, now);

  // Already expired
  if (daysUntilExpiry < 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Subscription Expired</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Your subscription expired on {format(expiryDate, 'MMMM d, yyyy')}. 
            Renew now to continue accessing all features.
          </span>
          {onRenew && (
            <Button size="sm" variant="destructive" onClick={onRenew} className="ml-4">
              Renew Now
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Expiring within 7 days - urgent warning
  if (daysUntilExpiry <= 7) {
    return (
      <Alert className="mb-6 border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <AlertTitle className="text-warning">Subscription Expiring Soon</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>
            Your subscription expires in <strong>{daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}</strong> 
            ({format(expiryDate, 'MMMM d, yyyy')}). Renew to avoid service interruption.
          </span>
          {onRenew && (
            <Button size="sm" variant="outline" onClick={onRenew} className="ml-4 border-warning text-warning hover:bg-warning hover:text-warning-foreground">
              Renew Now
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Expiring within 14 days - gentle reminder
  if (daysUntilExpiry <= 14) {
    return (
      <Alert className="mb-6 border-primary/50 bg-primary/5">
        <Clock className="h-4 w-4 text-primary" />
        <AlertTitle>Subscription Reminder</AlertTitle>
        <AlertDescription>
          Your subscription will expire in <strong>{daysUntilExpiry} days</strong> ({format(expiryDate, 'MMMM d, yyyy')}). 
          Consider renewing early to ensure uninterrupted access.
        </AlertDescription>
      </Alert>
    );
  }

  // Active with plenty of time - show status
  if (isActive && daysUntilExpiry > 14) {
    return (
      <Alert className="mb-6 border-success/50 bg-success/5">
        <CheckCircle className="h-4 w-4 text-success" />
        <AlertTitle className="text-success">Subscription Active</AlertTitle>
        <AlertDescription>
          Your subscription is active until {format(expiryDate, 'MMMM d, yyyy')} ({daysUntilExpiry} days remaining).
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
