import { motion } from 'framer-motion';
import { 
  Users, Activity, DollarSign, Bed, AlertTriangle, 
  TrendingUp, TrendingDown, Minus, Building2, Clock
} from 'lucide-react';
import { DemoHospitalConfig, DemoMetric, formatCurrency } from '@/lib/demoDataGenerator';
import { useState, useEffect } from 'react';

interface Scene1ControlRoomProps {
  config: DemoHospitalConfig;
  metrics: DemoMetric[];
  showChaos: boolean;
  onToggleChaos: () => void;
}

export function Scene1ControlRoom({ 
  config, 
  metrics, 
  showChaos, 
  onToggleChaos 
}: Scene1ControlRoomProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    // Animate metrics counting up
    metrics.forEach((metric, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = metric.value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= metric.value) {
          current = metric.value;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({ ...prev, [metric.name]: Math.floor(current) }));
      }, duration / steps);
      
      return () => clearInterval(timer);
    });
  }, [metrics]);

  const getIcon = (category: string, name: string) => {
    if (name.includes('Patient')) return <Users className="h-6 w-6" />;
    if (name.includes('Bed') || name.includes('Occupancy')) return <Bed className="h-6 w-6" />;
    if (name.includes('Revenue') || name.includes('Cost') || name.includes('Saving')) return <DollarSign className="h-6 w-6" />;
    if (name.includes('Rate') || name.includes('Stay')) return <Activity className="h-6 w-6" />;
    return <Activity className="h-6 w-6" />;
  };

  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUp className="h-4 w-4" />;
    if (direction === 'down') return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const formatValue = (metric: DemoMetric, value: number) => {
    if (metric.unit === '₦') return formatCurrency(value);
    if (metric.unit === '%') return `${value}%`;
    if (metric.unit === 'days') return `${value.toFixed(1)} days`;
    return value.toLocaleString();
  };

  const chaosMetrics = [
    { name: 'Data Gaps', value: '47%', icon: <AlertTriangle className="h-5 w-5 text-destructive" /> },
    { name: 'Manual Reports', value: '12hrs/day', icon: <Clock className="h-5 w-5 text-warning" /> },
    { name: 'Missed Alerts', value: '23/week', icon: <Activity className="h-5 w-5 text-destructive" /> },
    { name: 'Revenue Leakage', value: '₦4.2M/mo', icon: <DollarSign className="h-5 w-5 text-destructive" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 pt-24 pb-32">
      {/* Hospital Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-card/80 backdrop-blur rounded-2xl border border-border mb-4">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">{config.name}</span>
        </div>
        <p className="text-muted-foreground">
          {config.totalBeds} Beds • {config.staff} Staff • {config.departments.length} Departments
        </p>
      </motion.div>

      {/* Toggle Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center mb-8"
      >
        <button
          onClick={onToggleChaos}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            showChaos 
              ? 'bg-destructive/10 text-destructive border-2 border-destructive/30' 
              : 'bg-success/10 text-success border-2 border-success/30'
          }`}
        >
          {showChaos ? '📊 Show Systemized View' : '⚠️ Show Before MedSight'}
        </button>
      </motion.div>

      {/* Metrics Grid */}
      <div className="max-w-6xl mx-auto">
        {showChaos ? (
          <motion.div
            key="chaos"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {chaosMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-destructive/5 border-2 border-destructive/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.03)_10px,rgba(239,68,68,0.03)_20px)]" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    {metric.icon}
                    <span className="text-sm text-muted-foreground">{metric.name}</span>
                  </div>
                  <p className="text-2xl font-bold text-destructive animate-pulse">{metric.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="systemized"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {metrics.slice(0, 8).map((metric, index) => {
              const value = animatedValues[metric.name] || 0;
              const isPositive = (metric.trendDirection === 'up' && !metric.name.includes('Cost') && !metric.name.includes('Stay') && !metric.name.includes('Readmission')) ||
                (metric.trendDirection === 'down' && (metric.name.includes('Cost') || metric.name.includes('Stay') || metric.name.includes('Readmission')));
              
              return (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${
                      metric.category === 'financial' ? 'bg-success/10 text-success' :
                      metric.category === 'clinical' ? 'bg-primary/10 text-primary' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {getIcon(metric.category, metric.name)}
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-success' : 'text-destructive'
                    }`}>
                      {getTrendIcon(metric.trendDirection)}
                      {Math.abs(metric.trend)}%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.name}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatValue(metric, value)}
                  </p>
                  
                  {/* Subtle pulse on high-value metrics */}
                  {metric.name.includes('Saving') && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-success/30"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Risk Alerts Panel */}
        {!showChaos && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-destructive/5 to-warning/5 border border-destructive/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-2 rounded-xl bg-destructive/10"
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground">Active Risk Alerts</h3>
                <p className="text-sm text-muted-foreground">AI-detected issues requiring attention</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Critical Patients', value: 3, color: 'destructive' },
                { label: 'High Risk', value: 12, color: 'warning' },
                { label: 'Follow-up Due', value: 28, color: 'primary' },
              ].map((alert, index) => (
                <motion.div
                  key={alert.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className={`p-4 rounded-xl bg-${alert.color}/10 border border-${alert.color}/20`}
                >
                  <p className={`text-2xl font-bold text-${alert.color}`}>{alert.value}</p>
                  <p className="text-sm text-muted-foreground">{alert.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
