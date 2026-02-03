import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Heart, Brain, ArrowRight,
  CheckCircle, Users, Shield, Clock, Sparkles, MapPin
} from 'lucide-react';
import { DemoHospitalConfig, generateSavingsEstimate, formatCurrency } from '@/lib/demoDataGenerator';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Scene6DecisionProps {
  config: DemoHospitalConfig;
  onMapHospital: () => void;
}

export function Scene6Decision({ config, onMapHospital }: Scene6DecisionProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const savings = generateSavingsEstimate(config);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSummary(true), 500);
    const timer2 = setTimeout(() => setShowCTA(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const impactStats = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: 'Monthly Savings',
      value: formatCurrency(savings.monthlySavings),
      color: 'success',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      label: 'Lives Protected',
      value: `${Math.floor(config.dailyPatients * 0.12)}+`,
      sublabel: 'High-risk catches/month',
      color: 'destructive',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Hours Saved',
      value: `${Math.floor(config.staff * 2.5)}`,
      sublabel: 'Staff hours weekly',
      color: 'primary',
    },
    {
      icon: <Brain className="h-6 w-6" />,
      label: 'Better Decisions',
      value: '100%',
      sublabel: 'Data-driven insights',
      color: 'warning',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-success/5 p-6 pt-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-success/20 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="h-4 w-4" />
            The Decision
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Transform {config.name}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You've seen what MedSight can do. Here's what it means for your hospital.
          </p>
        </motion.div>

        {/* Impact Summary Grid */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-6 rounded-2xl bg-card border-2 border-${stat.color}/30 hover:border-${stat.color}/50 transition-all group`}
                >
                  <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <p className={`text-3xl font-bold text-${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {stat.sublabel && (
                    <p className="text-xs text-muted-foreground/70 mt-1">{stat.sublabel}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Cost vs Savings Calculator */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-card to-card/80 border border-border"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Monthly Investment vs. Returns
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Cost */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center p-6 rounded-2xl bg-muted/50"
              >
                <p className="text-sm text-muted-foreground mb-2">Platform Investment</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(savings.monthlyCost)}</p>
                <p className="text-xs text-muted-foreground mt-1">/month</p>
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="hidden md:flex justify-center"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-destructive/50 to-success rounded-full" />
                  <ArrowRight className="h-8 w-8 text-success" />
                </div>
              </motion.div>

              {/* Returns */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="text-center p-6 rounded-2xl bg-success/10 border-2 border-success/30"
              >
                <p className="text-sm text-success mb-2">Estimated Savings</p>
                <p className="text-3xl font-bold text-success">{formatCurrency(savings.monthlySavings)}</p>
                <p className="text-xs text-success/70 mt-1">/month</p>
              </motion.div>
            </div>

            {/* ROI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-success/20 to-primary/20 border border-success/30">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-lg font-bold text-foreground">
                  {savings.roi}% ROI
                </span>
                <span className="text-sm text-muted-foreground">within first month</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* What You Get */}
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Everything Included
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'AI Risk Detection',
                'Real-time Analytics',
                'Inventory Management',
                'Staff Coordination',
                'White-Label Branding',
                'Custom Domain',
                'Priority Support',
                'Compliance Reports',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6 + index * 0.05 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border"
                >
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-center"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-success/10 border-2 border-primary/30">
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(var(--primary), 0)',
                    '0 0 0 20px rgba(var(--primary), 0.1)',
                    '0 0 0 0 rgba(var(--primary), 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block rounded-3xl"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Ready to Transform Your Hospital?
                </h3>
              </motion.div>
              
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join leading Nigerian hospitals that have already modernized their operations 
                with MedSight Analytics. See results within 72 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/#demo">
                  <Button 
                    size="lg" 
                    onClick={onMapHospital}
                    className="text-lg px-8 py-6 rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Map My Hospital
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login?signup=true">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6 rounded-xl"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                No credit card required. Cancel anytime.
              </motion.p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
