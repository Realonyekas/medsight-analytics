import { useNavigate } from 'react-router-dom';
import { Users, Activity, DollarSign, Bed, AlertTriangle, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RiskAlertCard } from '@/components/dashboard/RiskAlertCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients, useInsights, useMetrics } from '@/hooks/useHospitalData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDashboardMetrics, mockOperationalMetrics, mockTrendData, mockCostTrendData } from '@/data/mockData';
import type { Patient, Insight, MetricData } from '@/types';

export default function DashboardPage() {
  const { user, hospital } = useAuth();
  const navigate = useNavigate();

  const { data: dbPatients, isLoading: patientsLoading } = usePatients(hospital?.id);
  const { data: dbInsights, isLoading: insightsLoading } = useInsights(hospital?.id);
  const { data: dbMetrics, isLoading: metricsLoading } = useMetrics(hospital?.id);

  const isAdmin = user?.role === 'hospital_admin';
  const isClinician = user?.role === 'clinician';
  const isOperations = user?.role === 'operations';

  // Transform database patients to UI format
  const patients: Patient[] = dbPatients?.map(p => ({
    id: p.id,
    patientId: p.mrn,
    name: `${p.first_name} ${p.last_name}`,
    age: p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 0,
    gender: (p.gender as 'male' | 'female') || 'male',
    department: '', // Would need department lookup
    admissionDate: p.admission_date || '',
    riskLevel: p.risk_level === 'critical' ? 'high' : p.risk_level,
    riskScore: p.risk_score || 0,
    conditions: p.conditions || [],
    lastVisit: p.updated_at,
    flags: p.ai_flags || [],
  })) || [];

  // Transform database insights to UI format
  const insights: Insight[] = dbInsights?.map(i => ({
    id: i.id,
    type: i.type === 'prediction' ? 'trend' : i.type as 'alert' | 'recommendation' | 'trend',
    title: i.title,
    description: i.description,
    action: i.action_label || undefined,
    priority: i.priority as 'high' | 'medium' | 'low',
    category: i.category as 'clinical' | 'operational' | 'financial',
    createdAt: i.created_at,
    affectedPatients: (i.metadata as { affectedPatients?: number })?.affectedPatients,
  })) || [];

  // Transform database metrics to UI format
  const metricsFromDb: MetricData[] = dbMetrics?.slice(0, 4).map(m => ({
    label: m.name,
    value: m.value,
    change: m.trend || undefined,
    changeType: m.trend_direction === 'up' 
      ? 'positive' 
      : m.trend_direction === 'down' 
        ? 'negative' 
        : 'neutral',
    unit: m.unit || undefined,
  })) || [];

  // Use database data if available, otherwise fall back to mock data
  const hasRealData = (dbPatients?.length || 0) > 0 || (dbInsights?.length || 0) > 0 || (dbMetrics?.length || 0) > 0;
  
  const highRiskPatients = patients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'medium');
  const topInsights = insights.slice(0, 3);

  // Use mock data as fallback
  const clinicalMetrics = metricsFromDb.length > 0 ? metricsFromDb : mockDashboardMetrics;
  const operationalMetrics = mockOperationalMetrics;

  const metricsToShow = isOperations ? operationalMetrics : clinicalMetrics;
  const metricIcons = [
    <Users className="h-5 w-5" />,
    <Activity className="h-5 w-5" />,
    <Bed className="h-5 w-5" />,
    <DollarSign className="h-5 w-5" />,
  ];

  const isLoading = patientsLoading || insightsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Dashboard" 
          subtitle="Loading your hospital's overview..." 
        />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}. Here's your hospital's overview.`} 
      />

      <div className="p-6 space-y-6">
        {/* No Data Message */}
        {!hasRealData && hospital && (
          <div className="bg-accent/50 border border-accent rounded-lg p-4 mb-4">
            <p className="text-sm text-accent-foreground">
              <strong>Getting Started:</strong> Your hospital doesn't have any data yet. The dashboard is showing sample data. 
              Add patients and insights to see your real analytics.
            </p>
          </div>
        )}

        {/* Key Metrics */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">
              {isOperations ? 'Operational Metrics' : 'Key Metrics'}
            </h2>
            <span className="text-xs text-muted-foreground">Updated 2 hours ago</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricsToShow.map((metric, index) => (
              <MetricCard 
                key={metric.label} 
                metric={metric} 
                icon={metricIcons[index]} 
              />
            ))}
          </div>
        </section>

        {/* High-Risk Patients Alert - Only for Admins and Clinicians */}
        {(isAdmin || isClinician) && highRiskPatients.length > 0 && (
          <section className="card-healthcare border-l-4 border-l-risk-high">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h2 className="section-title">Patients Requiring Attention</h2>
                  <p className="section-subtitle">{highRiskPatients.length} patients flagged for review</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/patients')} className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {highRiskPatients.slice(0, 3).map((patient) => (
                <RiskAlertCard 
                  key={patient.id} 
                  patient={patient} 
                  onView={() => navigate(`/patients/${patient.id}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Insights & Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <section className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">AI Insights</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recommendations')} className="gap-1 text-primary">
                See all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {(topInsights.length > 0 ? topInsights : mockDashboardMetrics.slice(0, 3).map((_, i) => ({
                id: `mock-${i}`,
                type: 'recommendation' as const,
                title: 'No insights yet',
                description: 'Insights will appear here once you have patient data.',
                priority: 'low' as const,
                category: 'clinical' as const,
                createdAt: new Date().toISOString(),
              }))).map((insight) => (
                <InsightCard key={insight.id} insight={insight} compact />
              ))}
            </div>
          </section>

          {/* Trend Charts */}
          <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrendChart 
              data={mockTrendData} 
              title={isOperations ? "Task Completion Trend" : "High-Risk Patients"}
              subtitle="Last 6 months"
              color={isOperations ? "success" : "destructive"}
              unit=""
            />
            <TrendChart 
              data={mockCostTrendData} 
              title={isOperations ? "Efficiency Score" : "Cost per Patient (₦K)"}
              subtitle="Last 6 months"
              color="primary"
              unit={isOperations ? "%" : ""}
            />
          </section>
        </div>

        {/* Quick Actions */}
        <section className="card-healthcare bg-accent/30">
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(isAdmin || isClinician) && (
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/patients')}>
                <Users className="h-5 w-5" />
                <span className="text-sm">View Patients</span>
              </Button>
            )}
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/analytics')}>
              <Activity className="h-5 w-5" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/recommendations')}>
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">Recommendations</span>
            </Button>
            {(isAdmin || isOperations) && (
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => navigate('/reports')}>
                <DollarSign className="h-5 w-5" />
                <span className="text-sm">Reports</span>
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
