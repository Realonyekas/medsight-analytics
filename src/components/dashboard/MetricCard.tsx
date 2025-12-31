import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricData } from '@/types';

interface MetricCardProps {
  metric: MetricData;
  icon?: React.ReactNode;
}

export function MetricCard({ metric, icon }: MetricCardProps) {
  const { label, value, change, changeType, unit } = metric;

  const ChangeIcon = changeType === 'positive' ? TrendingDown : changeType === 'negative' ? TrendingUp : Minus;

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="stat-label">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="stat-value">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <ChangeIcon className={cn(
                'h-3.5 w-3.5',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-xs font-medium',
                changeType === 'positive' && 'stat-change-positive',
                changeType === 'negative' && 'stat-change-negative',
                changeType === 'neutral' && 'text-muted-foreground'
              )}>
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
