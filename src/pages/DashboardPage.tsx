import { useNavigate } from 'react-router-dom';
import { Users, Activity, DollarSign, Bed, AlertTriangle, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RiskAlertCard } from '@/components/dashboard/RiskAlertCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { useAuth } from '@/contexts/AuthContext';
import { mockDashboardMetrics, mockOperationalMetrics, mockInsights, mockPatients, mockTrendData, mockCostTrendData } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'hospital_admin';
  const isClinician = user?.role === 'clinician';
  const isOperations = user?.role === 'operations';

  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'medium');
  const topInsights = mockInsights.slice(0, 3);

  const clinicalMetrics = mockDashboardMetrics;
  const operationalMetrics = mockOperationalMetrics;

  const metricsToShow = isOperations ? operationalMetrics : clinicalMetrics;
  const metricIcons = [
    <Users className="h-5 w-5" />,
    <Activity className="h-5 w-5" />,
    <Bed className="h-5 w-5" />,
    <DollarSign className="h-5 w-5" />,
  ];

  return (
    <div className="min-h-screen">
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.name.split(' ')[0]}. Here's your hospital's overview.`} 
      />

      <div className="p-6 space-y-6">
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
              {topInsights.map((insight) => (
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
