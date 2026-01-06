import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Zap, Building2, Rocket, HelpCircle, ArrowLeft, Calculator, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import medsightLogo from '@/assets/medsight-logo.jpg';

interface PlanFeature {
  name: string;
  starter: boolean | string;
  growth: boolean | string;
  enterprise: boolean | string;
  tooltip?: string;
}

const plans = [
  {
    name: 'Starter',
    subtitle: 'Pilot Program',
    price: 499,
    icon: Zap,
    description: 'Perfect for hospitals beginning their analytics journey',
    highlight: false,
    cta: 'Start Pilot',
    features: [
      'Core analytics dashboard',
      'Risk flags & alerts',
      'Basic patient dashboards',
      'Email support',
      'Up to 500 patients',
      'Up to 5 users',
      'Cancel anytime',
    ],
  },
  {
    name: 'Growth',
    subtitle: 'Most Popular',
    price: 1200,
    icon: Rocket,
    description: 'For hospitals ready to leverage AI-powered insights',
    highlight: true,
    cta: 'Get Started',
    features: [
      'Everything in Starter',
      'Advanced AI recommendations',
      'Outcome & cost tracking',
      'Monthly insights review',
      'Priority support',
      'Up to 2,000 patients',
      'Up to 20 users',
      'Custom alerts',
    ],
  },
  {
    name: 'Enterprise',
    subtitle: 'Custom',
    price: 3000,
    pricePrefix: 'From',
    icon: Building2,
    description: 'Tailored solutions for large healthcare organizations',
    highlight: false,
    cta: 'Contact Sales',
    features: [
      'Everything in Growth',
      'Predictive analytics',
      'Custom AI models',
      'Dedicated success manager',
      'Compliance & reporting support',
      'Unlimited patients',
      'Unlimited users',
      'API access',
      'SLA guarantee',
    ],
  },
];

const featureComparison: PlanFeature[] = [
  { name: 'Patient Risk Scoring', starter: true, growth: true, enterprise: true },
  { name: 'Real-time Dashboards', starter: true, growth: true, enterprise: true },
  { name: 'Risk Flags & Alerts', starter: true, growth: true, enterprise: true },
  { name: 'Basic Analytics', starter: true, growth: true, enterprise: true },
  { name: 'Email Support', starter: true, growth: true, enterprise: true },
  { name: 'AI-Powered Recommendations', starter: false, growth: true, enterprise: true, tooltip: 'Machine learning models that suggest interventions' },
  { name: 'Outcome Tracking', starter: false, growth: true, enterprise: true },
  { name: 'Cost Analysis', starter: false, growth: true, enterprise: true },
  { name: 'Monthly Insights Review', starter: false, growth: true, enterprise: true, tooltip: 'Scheduled review sessions with our analytics team' },
  { name: 'Priority Support', starter: false, growth: true, enterprise: true },
  { name: 'Custom Alerts', starter: false, growth: true, enterprise: true },
  { name: 'Predictive Analytics', starter: false, growth: false, enterprise: true, tooltip: 'Forecast patient outcomes and resource needs' },
  { name: 'Custom AI Models', starter: false, growth: false, enterprise: true, tooltip: 'Models trained on your specific patient population' },
  { name: 'Dedicated Success Manager', starter: false, growth: false, enterprise: true },
  { name: 'Compliance Reporting', starter: false, growth: false, enterprise: true },
  { name: 'API Access', starter: false, growth: false, enterprise: true },
  { name: 'SLA Guarantee', starter: false, growth: false, enterprise: true },
  { name: 'Patient Limit', starter: '500', growth: '2,000', enterprise: 'Unlimited' },
  { name: 'User Seats', starter: '5', growth: '20', enterprise: 'Unlimited' },
  { name: 'Data Retention', starter: '1 year', growth: '3 years', enterprise: 'Unlimited' },
];

const faqs = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a cancel-anytime pilot program with our Starter plan. This allows you to evaluate the platform with no long-term commitment.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and can set up invoicing for Enterprise customers.',
  },
  {
    question: 'Do you offer discounts for annual billing?',
    answer: 'Yes, we offer a 15% discount for annual subscriptions. Contact our sales team for details.',
  },
];

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  
  // ROI Calculator state
  const [patientVolume, setPatientVolume] = useState(1000);
  const [avgLos, setAvgLos] = useState(5);
  const [readmissionRate, setReadmissionRate] = useState(15);

  // ROI calculations
  const roiCalculations = useMemo(() => {
    // Base assumptions (in Naira, converted from typical Nigerian hospital metrics)
    const avgDailyCostPerPatient = 150000; // ₦150,000 per day
    const avgReadmissionCost = 500000; // ₦500,000 per readmission
    const avgStaffHoursPerPatient = 4;
    const staffHourlyCost = 5000; // ₦5,000 per hour

    // MedSight impact rates (conservative estimates based on industry benchmarks)
    const losReductionRate = 0.12; // 12% reduction in length of stay
    const readmissionReductionRate = 0.18; // 18% reduction in readmissions
    const staffEfficiencyGain = 0.15; // 15% improvement in staff efficiency

    // Calculate current costs
    const currentLosCost = patientVolume * avgLos * avgDailyCostPerPatient;
    const currentReadmissionCost = patientVolume * (readmissionRate / 100) * avgReadmissionCost;
    const currentStaffCost = patientVolume * avgStaffHoursPerPatient * staffHourlyCost;

    // Calculate savings with MedSight
    const losSavings = currentLosCost * losReductionRate;
    const readmissionSavings = currentReadmissionCost * readmissionReductionRate;
    const staffSavings = currentStaffCost * staffEfficiencyGain;

    const totalAnnualSavings = losSavings + readmissionSavings + staffSavings;
    
    // Determine recommended plan based on patient volume
    let recommendedPlan = 'Starter';
    let planCost = 499 * 12; // Annual cost in USD
    if (patientVolume > 2000) {
      recommendedPlan = 'Enterprise';
      planCost = 3000 * 12;
    } else if (patientVolume > 500) {
      recommendedPlan = 'Growth';
      planCost = 1200 * 12;
    }

    // Convert plan cost to Naira (approximate exchange rate)
    const planCostNaira = planCost * 1500;
    
    const roi = ((totalAnnualSavings - planCostNaira) / planCostNaira) * 100;
    const paybackMonths = planCostNaira / (totalAnnualSavings / 12);

    return {
      losSavings,
      readmissionSavings,
      staffSavings,
      totalAnnualSavings,
      recommendedPlan,
      planCostNaira,
      roi: Math.max(0, roi),
      paybackMonths: Math.min(12, Math.max(0.5, paybackMonths)),
    };
  }, [patientVolume, avgLos, readmissionRate]);

  const formatNaira = (amount: number) => {
    if (amount >= 1000000000) {
      return `₦${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(0)}K`;
    }
    return `₦${amount.toFixed(0)}`;
  };

  const getPrice = (basePrice: number) => {
    if (billingPeriod === 'annual') {
      return Math.round(basePrice * 0.85);
    }
    return basePrice;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/login?signup=true">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Choose the Right Plan for Your Hospital
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Start with our pilot program and scale as you grow. No hidden fees, cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  billingPeriod === 'annual' ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-background rounded-full transition-transform shadow-md ${
                    billingPeriod === 'annual' ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
                <Badge variant="outline" className="ml-2 text-xs">Save 15%</Badge>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col ${
                  plan.highlight 
                    ? 'border-primary shadow-xl shadow-primary/10 scale-105' 
                    : 'border-border'
                }`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                      plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-1">
                        {plan.pricePrefix && (
                          <span className="text-sm text-muted-foreground">{plan.pricePrefix}</span>
                        )}
                        <span className="text-4xl font-bold text-foreground">
                          ${getPrice(plan.price).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      {billingPeriod === 'annual' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Billed annually (${(getPrice(plan.price) * 12).toLocaleString()}/year)
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to={plan.name === 'Enterprise' ? '/#demo' : '/login?signup=true'}>
                      <Button 
                        className="w-full" 
                        variant={plan.highlight ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Compare All Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A detailed breakdown of what's included in each plan
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-4 font-semibold text-foreground min-w-[200px]">
                        Feature
                      </th>
                      <th className="text-center p-4 font-semibold text-foreground min-w-[120px]">
                        Starter
                        <span className="block text-sm font-normal text-muted-foreground">$499/mo</span>
                      </th>
                      <th className="text-center p-4 font-semibold text-foreground min-w-[120px] bg-primary/5">
                        Growth
                        <span className="block text-sm font-normal text-muted-foreground">$1,200/mo</span>
                      </th>
                      <th className="text-center p-4 font-semibold text-foreground min-w-[120px]">
                        Enterprise
                        <span className="block text-sm font-normal text-muted-foreground">From $3,000/mo</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((feature, index) => (
                      <tr 
                        key={feature.name} 
                        className={`border-b border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                      >
                        <td className="p-4 text-foreground">
                          <div className="flex items-center gap-2">
                            {feature.name}
                            {feature.tooltip && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{feature.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.starter === 'boolean' ? (
                            feature.starter ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-foreground">{feature.starter}</span>
                          )}
                        </td>
                        <td className="p-4 text-center bg-primary/5">
                          {typeof feature.growth === 'boolean' ? (
                            feature.growth ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-foreground">{feature.growth}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                            )
                          ) : (
                            <span className="text-sm font-medium text-foreground">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Calculator className="h-3 w-3 mr-1" />
              ROI Calculator
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Calculate Your Potential Savings
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how MedSight can reduce costs and improve outcomes for your hospital
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Input Section */}
                  <div className="p-6 lg:p-8 bg-muted/30">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                      Your Hospital Metrics
                    </h3>
                    
                    <div className="space-y-8">
                      {/* Patient Volume Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            Annual Patient Volume
                          </Label>
                          <span className="text-lg font-semibold text-foreground">
                            {patientVolume.toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          value={[patientVolume]}
                          onValueChange={(value) => setPatientVolume(value[0])}
                          min={100}
                          max={10000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>100</span>
                          <span>10,000</span>
                        </div>
                      </div>

                      {/* Average Length of Stay Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            Avg. Length of Stay (days)
                          </Label>
                          <span className="text-lg font-semibold text-foreground">
                            {avgLos}
                          </span>
                        </div>
                        <Slider
                          value={[avgLos]}
                          onValueChange={(value) => setAvgLos(value[0])}
                          min={1}
                          max={14}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1 day</span>
                          <span>14 days</span>
                        </div>
                      </div>

                      {/* Readmission Rate Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            Current Readmission Rate
                          </Label>
                          <span className="text-lg font-semibold text-foreground">
                            {readmissionRate}%
                          </span>
                        </div>
                        <Slider
                          value={[readmissionRate]}
                          onValueChange={(value) => setReadmissionRate(value[0])}
                          min={5}
                          max={30}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>5%</span>
                          <span>30%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-6">
                      * Calculations based on industry benchmarks and conservative estimates
                    </p>
                  </div>

                  {/* Results Section */}
                  <div className="p-6 lg:p-8 bg-sidebar">
                    <h3 className="text-lg font-semibold text-sidebar-foreground mb-6">
                      Your Potential Savings
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-sidebar-accent/50">
                        <span className="text-sm text-sidebar-foreground/80">Length of Stay Reduction</span>
                        <span className="font-semibold text-sidebar-foreground">
                          {formatNaira(roiCalculations.losSavings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-sidebar-accent/50">
                        <span className="text-sm text-sidebar-foreground/80">Readmission Prevention</span>
                        <span className="font-semibold text-sidebar-foreground">
                          {formatNaira(roiCalculations.readmissionSavings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-lg bg-sidebar-accent/50">
                        <span className="text-sm text-sidebar-foreground/80">Staff Efficiency Gains</span>
                        <span className="font-semibold text-sidebar-foreground">
                          {formatNaira(roiCalculations.staffSavings)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-sidebar-border pt-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sidebar-foreground/80">Total Annual Savings</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatNaira(roiCalculations.totalAnnualSavings)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 rounded-lg bg-primary/10">
                          <div className="text-2xl font-bold text-primary">
                            {roiCalculations.roi.toFixed(0)}%
                          </div>
                          <div className="text-xs text-sidebar-foreground/70">ROI</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-primary/10">
                          <div className="text-2xl font-bold text-primary">
                            {roiCalculations.paybackMonths.toFixed(1)}
                          </div>
                          <div className="text-xs text-sidebar-foreground/70">Months to Payback</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-sidebar-accent/30 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-sidebar-foreground">
                          Recommended Plan
                        </span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {roiCalculations.recommendedPlan}
                      </p>
                      <p className="text-xs text-sidebar-foreground/70 mt-1">
                        Based on your patient volume
                      </p>
                    </div>

                    <Link to="/login?signup=true">
                      <Button className="w-full" size="lg">
                        Start Saving Today
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pricing FAQs
            </h2>
            <p className="text-muted-foreground">
              Common questions about our pricing and plans
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sidebar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-sidebar-foreground mb-4">
              Ready to Transform Your Hospital's Analytics?
            </h2>
            <p className="text-sidebar-foreground/80 mb-8 max-w-2xl mx-auto">
              Start with our pilot program today. No long-term commitment required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login?signup=true">
                <Button size="lg" className="font-semibold">
                  Start Free Pilot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/#demo">
                <Button size="lg" variant="outline" className="bg-transparent border-sidebar-foreground/30 text-sidebar-foreground hover:bg-sidebar-accent">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm text-muted-foreground">
                © 2024 MedSight Analytics. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
