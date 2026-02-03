import { motion } from 'framer-motion';
import { 
  Package, AlertTriangle, DollarSign, TrendingUp, 
  Calendar, ShieldAlert, BarChart3, Trash2
} from 'lucide-react';
import { DemoInventoryItem, DemoHospitalConfig, formatCurrency } from '@/lib/demoDataGenerator';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface Scene3MoneyLeakProps {
  inventory: DemoInventoryItem[];
  config: DemoHospitalConfig;
}

export function Scene3MoneyLeak({ inventory, config }: Scene3MoneyLeakProps) {
  const [totalSaved, setTotalSaved] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const expiredItems = inventory.filter(i => i.status === 'expired');
  const theftItems = inventory.filter(i => i.status === 'theft-flagged');
  const lowStockItems = inventory.filter(i => i.status === 'low');

  const totalPotentialLoss = inventory.reduce((acc, item) => acc + (item.potentialLoss || 0), 0);
  const targetSavings = totalPotentialLoss * 0.85; // 85% of losses can be prevented

  useEffect(() => {
    // Animate the savings counter
    const duration = 3000;
    const steps = 100;
    const increment = targetSavings / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetSavings) {
        current = targetSavings;
        clearInterval(timer);
        setTimeout(() => setShowDetails(true), 500);
      }
      setTotalSaved(Math.floor(current));
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetSavings]);

  const getStatusColor = (status: string) => {
    if (status === 'expired') return 'destructive';
    if (status === 'theft-flagged') return 'warning';
    if (status === 'low') return 'primary';
    return 'success';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 p-6 pt-24 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Main Savings Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6"
          >
            <DollarSign className="h-4 w-4" />
            Cost Prevention Analysis
          </motion.div>

          <motion.div
            className="p-8 rounded-3xl bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/30 inline-block"
            animate={{ boxShadow: ['0 0 20px rgba(34, 197, 94, 0.2)', '0 0 40px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-sm text-success font-medium mb-2">Monthly Savings Potential</p>
            <motion.p
              className="text-5xl md:text-7xl font-bold text-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formatCurrency(totalSaved)}
            </motion.p>
            <p className="text-sm text-muted-foreground mt-2">Recoverable losses detected</p>
          </motion.div>
        </motion.div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Expired Drugs Alert */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-destructive/5 border-2 border-destructive/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="p-3 rounded-xl bg-destructive/10"
              >
                <Calendar className="h-6 w-6 text-destructive" />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground">Expired Drugs</h3>
                <p className="text-sm text-muted-foreground">{expiredItems.length} items detected</p>
              </div>
            </div>
            <div className="space-y-2">
              {expiredItems.slice(0, 2).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-3 rounded-xl bg-background/50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-destructive">
                      Expired {item.expiryDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-destructive">
                    {formatCurrency(item.potentialLoss || 0)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Theft/Loss Alert */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-warning/5 border-2 border-warning/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-3 rounded-xl bg-warning/10"
              >
                <ShieldAlert className="h-6 w-6 text-warning" />
              </motion.div>
              <div>
                <h3 className="font-bold text-foreground">Theft/Loss Flags</h3>
                <p className="text-sm text-muted-foreground">{theftItems.length} anomalies detected</p>
              </div>
            </div>
            <div className="space-y-2">
              {theftItems.slice(0, 2).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-3 rounded-xl bg-background/50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-warning">Inventory discrepancy</p>
                  </div>
                  <p className="text-sm font-bold text-warning">
                    {formatCurrency(item.potentialLoss || 0)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Demand Forecast */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 rounded-2xl bg-primary/5 border-2 border-primary/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Demand Forecast</h3>
                <p className="text-sm text-muted-foreground">Next 30 days prediction</p>
              </div>
            </div>
            <div className="space-y-3">
              {['Artemether-Lumefantrine', 'Paracetamol 500mg', 'Amoxicillin 500mg'].map((drug, index) => (
                <motion.div
                  key={drug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{drug}</span>
                    <span className="text-primary font-medium">
                      +{Math.floor(Math.random() * 30) + 20}%
                    </span>
                  </div>
                  <Progress value={Math.random() * 40 + 60} className="h-1.5" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stock Efficiency Meter */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Stock Efficiency Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Optimal Stock', value: 72, color: 'success' },
                { label: 'Low Stock', value: lowStockItems.length * 3, color: 'warning' },
                { label: 'Expired', value: expiredItems.length * 2, color: 'destructive' },
                { label: 'Flagged', value: theftItems.length * 2, color: 'warning' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`text-${item.color}`}
                        initial={{ strokeDasharray: '0 251.2' }}
                        animate={{ strokeDasharray: `${item.value * 2.512} 251.2` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xl font-bold text-${item.color}`}>{item.value}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-success/5 border border-success/20 text-center"
            >
              <p className="text-success font-medium">
                With MedSight, {config.name} can prevent up to <strong>{formatCurrency(targetSavings)}</strong> in monthly losses
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
