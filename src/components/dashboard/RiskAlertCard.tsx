import { AlertTriangle, Clock, Eye } from 'lucide-react';
import { Patient } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface RiskAlertCardProps {
  patient: Patient;
  onView?: () => void;
}

export function RiskAlertCard({ patient, onView }: RiskAlertCardProps) {
  const riskConfig = {
    high: { label: 'High Risk', className: 'risk-badge-high', dotClass: 'bg-risk-high' },
    medium: { label: 'Medium Risk', className: 'risk-badge-medium', dotClass: 'bg-risk-medium' },
    low: { label: 'Low Risk', className: 'risk-badge-low', dotClass: 'bg-risk-low' },
  };

  const config = riskConfig[patient.riskLevel];
  const primaryFlag = patient.flags[0];

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:shadow-card transition-shadow">
      {/* Risk Indicator */}
      <div className="flex-shrink-0">
        <div className={cn(
          'h-12 w-12 rounded-full flex items-center justify-center',
          patient.riskLevel === 'high' && 'bg-risk-high/10',
          patient.riskLevel === 'medium' && 'bg-risk-medium/10',
          patient.riskLevel === 'low' && 'bg-risk-low/10'
        )}>
          <AlertTriangle className={cn(
            'h-5 w-5',
            patient.riskLevel === 'high' && 'text-risk-high',
            patient.riskLevel === 'medium' && 'text-risk-medium',
            patient.riskLevel === 'low' && 'text-risk-low'
          )} />
        </div>
      </div>

      {/* Patient Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-semibold text-foreground">{patient.name}</h4>
          <span className={config.className}>{config.label}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {patient.patientId} • {patient.department} • {patient.age} years
        </p>
        {primaryFlag && (
          <p className="text-xs text-foreground/80 line-clamp-1">
            {primaryFlag.title}: {primaryFlag.description}
          </p>
        )}
      </div>

      {/* Last Visit */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{patient.lastVisit}</span>
      </div>

      {/* Action */}
      <Button variant="ghost" size="sm" onClick={onView} className="gap-1.5">
        <Eye className="h-4 w-4" />
        View
      </Button>
    </div>
  );
}
