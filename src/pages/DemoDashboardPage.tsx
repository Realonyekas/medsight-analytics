import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Activity, DollarSign, Bed, AlertTriangle, ArrowRight, 
  TrendingUp, Brain, BarChart3, FileText, Shield, Zap, Crown,
  CheckCircle, Lock, Star, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RiskAlertCard } from '@/components/dashboard/RiskAlertCard';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { 
  mockPatients, 
  mockInsights, 
  mockDashboardMetrics, 
  mockOperationalMetrics,
  mockTrendData, 
  mockCostTrendData,
  subscriptionPlans 
} from '@/data/mockData';
import { ScheduleCard, mockScheduleData } from '@/components/dashboard/ScheduleCard';
import medsightLogo from '@/assets/medsight-logo.jpg';

type PlanTier = 'starter' | 'growth' | 'enterprise';

const planFeatures = {
  starter: {
    name: 'Starter',
    price: '$499/month',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-blue-500',
    features: [
      { name: 'Core Analytics Dashboard', available: true },
      { name: 'Patient Risk Flags', available: true },
      { name: 'Basic Trend Charts', available: true },
      { name: 'Up to 500 Patients', available: true },
      { name: 'Email Support', available: true },
      { name: 'Advanced AI Recommendations', available: false },
      { name: 'Predictive Analytics', available: false },
      { name: 'Custom AI Models', available: false },
    ]
  },
  growth: {
    name: 'Growth',
    price: '$1,200/month',
    icon: <Star className="h-5 w-5" />,
    color: 'bg-primary',
    popular: true,
    features: [
      { name: 'Core Analytics Dashboard', available: true },
      { name: 'Patient Risk Flags', available: true },
      { name: 'Advanced Trend Charts', available: true },
      { name: 'Up to 2,000 Patients', available: true },
      { name: 'Priority Support', available: true },
      { name: 'Advanced AI Recommendations', available: true },
      { name: 'Outcome & Cost Tracking', available: true },
      { name: 'Custom AI Models', available: false },
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: '$3,000+/month',
    icon: <Crown className="h-5 w-5" />,
    color: 'bg-amber-500',
    features: [
      { name: 'Everything in Growth', available: true },
      { name: 'Predictive Analytics', available: true },
      { name: 'Custom AI Models', available: true },
      { name: 'Unlimited Patients & Users', available: true },
      { name: 'Dedicated Success Manager', available: true },
      { name: 'Compliance & Reporting', available: true },
      { name: 'EHR Integration Support', available: true },
      { name: 'White-glove Onboarding', available: true },
    ]
  }
};

export default function DemoDashboardPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('growth');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'medium');
  const topInsights = mockInsights.slice(0, 3);
  
  const metricIcons = [
    <Users className="h-5 w-5" />,
    <Activity className="h-5 w-5" />,
    <Bed className="h-5 w-5" />,
    <DollarSign className="h-5 w-5" />,
  ];

  const currentPlan = planFeatures[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-8 w-auto object-contain"
              />
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="h-3 w-3 mr-1" />
                Live Demo
              </Badge>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/#demo">
                <Button variant="outline" size="sm">Request Demo</Button>
              </Link>
              <Link to="/login?signup=true">
                <Button size="sm">
                  Sign Up Free
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-success/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Interactive Dashboard Preview</h1>
                <p className="text-sm text-muted-foreground">Explore all features available in each subscription plan</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Viewing as:</span>
              <div className="flex bg-muted rounded-lg p-1">
                {(Object.keys(planFeatures) as PlanTier[]).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      selectedPlan === plan 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {planFeatures[plan].name}
                    {plan === 'growth' && (
                      <Badge variant="default" className="ml-1.5 text-[10px] px-1 py-0">Popular</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan Info Card */}
        <motion.div 
          key={selectedPlan}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl border border-border bg-card shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-xl ${currentPlan.color} flex items-center justify-center text-white`}>
                {currentPlan.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{currentPlan.name} Plan</h2>
                  {'popular' in currentPlan && currentPlan.popular && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">Most Popular</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-primary mt-1">{currentPlan.price}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPlan.features.slice(0, showAllFeatures ? undefined : 4).map((feature, index) => (
                <Badge 
                  key={index} 
                  variant={feature.available ? "default" : "secondary"}
                  className={`${feature.available ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}`}
                >
                  {feature.available ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <Lock className="h-3 w-3 mr-1" />
                  )}
                  {feature.name}
                </Badge>
              ))}
              {currentPlan.features.length > 4 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="text-xs"
                >
                  {showAllFeatures ? (
                    <>Show Less <ChevronUp className="h-3 w-3 ml-1" /></>
                  ) : (
                    <>+{currentPlan.features.length - 4} more <ChevronDown className="h-3 w-3 ml-1" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Key Metrics */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Key Metrics</h2>
                <p className="text-sm text-muted-foreground">Overview of hospital performance</p>
              </div>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live Sample Data
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {mockDashboardMetrics.map((metric, index) => (
                <MetricCard 
                  key={metric.label} 
                  metric={metric} 
                  icon={metricIcons[index]} 
                />
              ))}
            </div>
          </section>

          {/* Staff Schedule */}
          <ScheduleCard entries={mockScheduleData} />

          {/* High-Risk Patients */}
          <section className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-destructive/5 to-transparent border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Patients Requiring Attention</h2>
                  <p className="text-sm text-muted-foreground">{highRiskPatients.length} patients flagged for review</p>
                </div>
              </div>
              <Badge variant="secondary">
                {selectedPlan === 'starter' ? 'Basic Alerts' : 'AI-Powered Insights'}
              </Badge>
            </div>
            <div className="p-5 space-y-3">
              {highRiskPatients.slice(0, 3).map((patient) => (
                <RiskAlertCard 
                  key={patient.id} 
                  patient={patient} 
                  onView={() => {}}
                />
              ))}
            </div>
          </section>

          {/* Insights & Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <section className="lg:col-span-1">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-foreground">AI Insights</h2>
                {selectedPlan !== 'starter' && (
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Brain className="h-3 w-3 mr-1" />
                    Advanced AI
                  </Badge>
                )}
              </div>
              <div className="space-y-4">
                {topInsights.map((insight, index) => (
                  <div key={insight.id} className="relative">
                    {selectedPlan === 'starter' && index > 0 && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <Lock className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">Upgrade to Growth</p>
                        </div>
                      </div>
                    )}
                    <InsightCard insight={insight} compact />
                  </div>
                ))}
              </div>
            </section>

            {/* Trend Charts */}
            <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TrendChart 
                data={mockTrendData} 
                title="High-Risk Patients"
                subtitle="Last 6 months"
                color="destructive"
                unit=""
              />
              <div className="relative">
                {selectedPlan === 'starter' && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                    <div className="text-center p-4">
                      <Lock className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Cost Analytics</p>
                      <p className="text-xs text-muted-foreground mt-1">Available in Growth plan</p>
                    </div>
                  </div>
                )}
                <TrendChart 
                  data={mockCostTrendData} 
                  title="Cost per Patient (₦K)"
                  subtitle="Last 6 months"
                  color="primary"
                  unit=""
                />
              </div>
            </section>
          </div>

          {/* Enterprise Features Preview */}
          {selectedPlan === 'enterprise' && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-white">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Enterprise Features</h3>
                  <p className="text-sm text-muted-foreground">Exclusive capabilities for large hospital networks</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: <Brain className="h-5 w-5" />, label: 'Custom AI Models', desc: 'Tailored predictions' },
                  { icon: <BarChart3 className="h-5 w-5" />, label: 'Predictive Analytics', desc: 'Future forecasting' },
                  { icon: <FileText className="h-5 w-5" />, label: 'Compliance Reports', desc: 'Regulatory support' },
                  { icon: <Shield className="h-5 w-5" />, label: 'EHR Integration', desc: 'Seamless data flow' },
                ].map((feature, index) => (
                  <div key={index} className="bg-background/60 rounded-lg p-4 text-center">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mx-auto mb-2 text-amber-600">
                      {feature.icon}
                    </div>
                    <p className="font-medium text-sm text-foreground">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* CTA Section */}
          <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border border-primary/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Ready to Transform Your Hospital?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start making data-driven decisions today. See value within 72 hours of onboarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Request Live Demo
                </Button>
              </Link>
              <Link to="/login?signup=true">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={medsightLogo} 
              alt="MedSight Analytics" 
              className="h-6 w-auto object-contain"
            />
            <span className="text-sm text-muted-foreground">
              © 2025 MedSight Analytics
            </span>
          </div>
          <Link to="/" className="text-sm text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
