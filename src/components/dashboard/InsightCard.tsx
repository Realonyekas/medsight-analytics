import { AlertCircle, ArrowRight, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import { Insight } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InsightCardProps {
  insight: Insight;
  compact?: boolean;
}

export function InsightCard({ insight, compact = false }: InsightCardProps) {
  const typeConfig = {
    alert: { icon: AlertCircle, bgClass: 'bg-destructive/10', iconClass: 'text-destructive' },
    recommendation: { icon: Lightbulb, bgClass: 'bg-warning/10', iconClass: 'text-warning' },
    trend: { icon: TrendingUp, bgClass: 'bg-info/10', iconClass: 'text-info' },
    efficiency: { icon: Zap, bgClass: 'bg-success/10', iconClass: 'text-success' },
  };

  const priorityConfig = {
    high: 'risk-badge-high',
    medium: 'risk-badge-medium',
    low: 'risk-badge-low',
  };

  const config = typeConfig[insight.type];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', config.bgClass)}>
          <Icon className={cn('h-4 w-4', config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-1">{insight.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{insight.description}</p>
        </div>
        <span className={priorityConfig[insight.priority]}>
          {insight.priority}
        </span>
      </div>
    );
  }

  return (
    <div className="card-healthcare">
      <div className="flex items-start gap-4">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0', config.bgClass)}>
          <Icon className={cn('h-5 w-5', config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
            <span className={priorityConfig[insight.priority]}>
              {insight.priority}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
          {insight.action && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-accent-foreground bg-accent px-2 py-1 rounded">
                  Suggested Action
                </span>
                <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                  {insight.action}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
