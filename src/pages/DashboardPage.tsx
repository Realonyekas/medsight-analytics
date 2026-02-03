import { useNavigate } from 'react-router-dom';
import { Users, Activity, DollarSign, Bed, AlertTriangle, ArrowRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RiskAlertCard } from '@/components/dashboard/RiskAlertCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients, useInsights, useMetrics } from '@/hooks/useHospitalData';
import { useSalesDemoTrigger } from '@/hooks/useSalesDemoTrigger';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { mockDashboardMetrics, mockOperationalMetrics, mockTrendData, mockCostTrendData } from '@/data/mockData';
import type { Patient, Insight, MetricData } from '@/types';
import { SalesDemoMode } from '@/components/sales-demo';

export default function DashboardPage() {
  const { user, hospital } = useAuth();
  const navigate = useNavigate();
  const { shouldShowDemo, isChecking: demoChecking, markDemoAsSeen, triggerDemoManually } = useSalesDemoTrigger();

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

  const isLoading = patientsLoading || insightsLoading || metricsLoading || demoChecking;

  // Show Sales Demo Mode for first-time users
  if (shouldShowDemo) {
    return <SalesDemoMode onExit={markDemoAsSeen} />;
  }

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}. Here's your hospital's overview.`} 
      />

      <div className="p-6 lg:p-8 space-y-8">
        {/* No Data Message */}
        {!hasRealData && hospital && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Your hospital doesn't have any data yet. The dashboard is showing sample data. 
                Add patients and insights to see your real analytics.
              </p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">
                {isOperations ? 'Operational Metrics' : 'Key Metrics'}
              </h2>
              <p className="section-subtitle mt-0.5">Overview of your hospital performance</p>
            </div>
            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">Updated 2h ago</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <section className="card-healthcare border-l-4 border-l-risk-high !p-0 overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-destructive/5 to-transparent border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h2 className="section-title">Patients Requiring Attention</h2>
                  <p className="section-subtitle">{highRiskPatients.length} patients flagged for review</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/patients')} className="gap-2 rounded-lg hover:bg-accent">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-5 space-y-3">
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
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">AI Insights</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recommendations')} className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-lg">
                See all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
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
          <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <section className="card-healthcare bg-gradient-to-br from-accent/50 to-accent/20">
          <h2 className="section-title mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(isAdmin || isClinician) && (
              <Button variant="outline" className="h-auto py-5 flex-col gap-3 rounded-xl bg-background/80 hover:bg-background hover:shadow-md transition-all duration-200" onClick={() => navigate('/patients')}>
                <Users className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">View Patients</span>
              </Button>
            )}
            <Button variant="outline" className="h-auto py-5 flex-col gap-3 rounded-xl bg-background/80 hover:bg-background hover:shadow-md transition-all duration-200" onClick={() => navigate('/analytics')}>
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto py-5 flex-col gap-3 rounded-xl bg-background/80 hover:bg-background hover:shadow-md transition-all duration-200" onClick={() => navigate('/recommendations')}>
              <AlertTriangle className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Recommendations</span>
            </Button>
            {(isAdmin || isOperations) && (
              <Button variant="outline" className="h-auto py-5 flex-col gap-3 rounded-xl bg-background/80 hover:bg-background hover:shadow-md transition-all duration-200" onClick={() => navigate('/reports')}>
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Reports</span>
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
