import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AlertTriangle, Activity, Calendar, FileText, Heart, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { usePatient, usePatientInsights } from '@/hooks/usePatientDetail';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const riskConfig = {
  critical: { label: 'Critical', className: 'risk-badge-high', bgClass: 'bg-risk-high/10', textClass: 'text-risk-high' },
  high: { label: 'High Risk', className: 'risk-badge-high', bgClass: 'bg-risk-high/10', textClass: 'text-risk-high' },
  medium: { label: 'Medium Risk', className: 'risk-badge-medium', bgClass: 'bg-risk-medium/10', textClass: 'text-risk-medium' },
  low: { label: 'Low Risk', className: 'risk-badge-low', bgClass: 'bg-risk-low/10', textClass: 'text-risk-low' },
};

const flagTypeIcons = {
  readmission_risk: TrendingUp,
  medication_adherence: Heart,
  follow_up_required: Calendar,
  cost_optimization: FileText,
  vital_alert: Activity,
};

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { hospital } = useAuth();
  
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: insights, isLoading: insightsLoading } = usePatientInsights(patientId, hospital?.id);

  const isLoading = patientLoading || insightsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Patient Details" subtitle="Loading..." />
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 lg:col-span-1" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen">
        <Header title="Patient Not Found" subtitle="The requested patient could not be found" />
        <div className="p-6">
          <Button variant="outline" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  const riskLevel = patient.risk_level || 'low';
  const config = riskConfig[riskLevel];
  const age = patient.date_of_birth 
    ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() 
    : null;

  return (
    <div className="min-h-screen">
      <Header 
        title={`${patient.first_name} ${patient.last_name}`}
        subtitle={`MRN: ${patient.mrn}`}
      />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/patients')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>

        {/* Top Section: Patient Info + Risk Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', config.bgClass)}>
                  <User className={cn('h-6 w-6', config.textClass)} />
                </div>
                <div>
                  <span className="block">{patient.first_name} {patient.last_name}</span>
                  <span className={cn('text-sm', config.className)}>{config.label}</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Patient ID</p>
                  <p className="font-medium text-foreground">{patient.mrn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Age</p>
                  <p className="font-medium text-foreground">{age ? `${age} years` : 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Gender</p>
                  <p className="font-medium text-foreground capitalize">{patient.gender || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                  <p className="font-medium text-foreground">
                    {patient.date_of_birth ? format(new Date(patient.date_of_birth), 'MMM d, yyyy') : 'Unknown'}
                  </p>
                </div>
              </div>

              {patient.primary_diagnosis && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Primary Diagnosis</p>
                  <p className="font-medium text-foreground">{patient.primary_diagnosis}</p>
                </div>
              )}

              {patient.admission_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Admitted: {format(new Date(patient.admission_date), 'MMM d, yyyy')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk & Predictions Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Assessment & Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Overall Risk Score</p>
                  <p className={cn('text-3xl font-bold', config.textClass)}>
                    {patient.risk_score ? `${patient.risk_score}%` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Readmission Risk</p>
                  <p className="text-3xl font-bold text-foreground">
                    {patient.readmission_risk ? `${patient.readmission_risk}%` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">LOS Prediction</p>
                  <p className="text-3xl font-bold text-foreground">
                    {patient.los_prediction ? `${patient.los_prediction} days` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Risk Level</p>
                  <p className={cn('text-xl font-bold capitalize', config.textClass)}>{riskLevel}</p>
                </div>
              </div>

              {/* Conditions */}
              {patient.conditions && patient.conditions.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-foreground mb-2">Medical Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((condition: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Flags Section */}
        {patient.ai_flags && patient.ai_flags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                AI-Generated Risk Flags
                <span className="text-sm font-normal text-muted-foreground">
                  ({patient.ai_flags.length} flag{patient.ai_flags.length !== 1 ? 's' : ''})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {patient.ai_flags.map((flag: any) => {
                  const FlagIcon = flagTypeIcons[flag.type as keyof typeof flagTypeIcons] || AlertTriangle;
                  const severityConfig = riskConfig[flag.severity as keyof typeof riskConfig] || riskConfig.medium;
                  
                  return (
                    <div key={flag.id} className="p-4 rounded-lg border border-border bg-card hover:bg-accent/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', severityConfig.bgClass)}>
                          <FlagIcon className={cn('h-5 w-5', severityConfig.textClass)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{flag.title}</h4>
                            <span className={severityConfig.className}>{flag.severity}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{flag.description}</p>
                          
                          {/* Why flagged */}
                          <div className="p-3 bg-muted/50 rounded-lg mb-2">
                            <p className="text-xs font-medium text-foreground mb-1">Why this patient was flagged:</p>
                            <p className="text-sm text-muted-foreground">{flag.description}</p>
                          </div>
                          
                          {/* Recommendation */}
                          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-xs font-medium text-primary mb-1">Recommended Action</p>
                            <p className="text-sm text-foreground">{flag.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient Insights from Database */}
        {insights && insights.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Patient Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      insight.type === 'alert' && 'bg-risk-high/10',
                      insight.type === 'trend' && 'bg-primary/10',
                      insight.type === 'recommendation' && 'bg-accent',
                      insight.type === 'prediction' && 'bg-muted'
                    )}>
                      {insight.type === 'alert' && <AlertTriangle className="h-5 w-5 text-risk-high" />}
                      {insight.type === 'trend' && <TrendingUp className="h-5 w-5 text-primary" />}
                      {insight.type === 'recommendation' && <FileText className="h-5 w-5 text-accent-foreground" />}
                      {insight.type === 'prediction' && <Activity className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground capitalize">
                          {insight.category}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      {insight.action_label && (
                        <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                          {insight.action_label}
                        </Button>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(insight.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="p-4 bg-muted rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Important:</strong> These AI-generated insights are for decision support only. 
            All clinical decisions should be made by qualified healthcare professionals based on comprehensive patient assessment.
          </p>
        </div>
      </div>
    </div>
  );
}