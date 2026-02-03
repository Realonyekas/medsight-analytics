import { motion } from 'framer-motion';
import { 
  Palette, Globe, Building2, Shield, CheckCircle,
  Paintbrush, Link2, Lock, Crown
} from 'lucide-react';
import { DemoHospitalConfig } from '@/lib/demoDataGenerator';
import { useState, useEffect } from 'react';
import medsightLogo from '@/assets/medsight-logo.jpg';

interface Scene5OwnershipProps {
  config: DemoHospitalConfig;
}

export function Scene5Ownership({ config }: Scene5OwnershipProps) {
  const [showBranding, setShowBranding] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [showPortal, setShowPortal] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowBranding(true), 500);
    const timer2 = setTimeout(() => setShowDomain(true), 1500);
    const timer3 = setTimeout(() => setShowPortal(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Generate a mock hospital domain
  const hospitalDomain = config.name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '') + '.medsight.ng';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 pt-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Crown className="h-4 w-4" />
            White-Label Platform
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Hospital. Your Brand.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MedSight becomes invisible. Your hospital's identity takes center stage.
          </p>
        </motion.div>

        {/* Branding Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showBranding ? { opacity: 1, y: 0 } : {}}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <Paintbrush className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Custom Branding</h3>
                <p className="text-sm text-muted-foreground">Your logo, your colors, your identity</p>
              </div>
            </div>

            {/* Mock Dashboard Header with Custom Branding */}
            <div className="rounded-xl overflow-hidden border border-border">
              {/* Simulated Dashboard Header */}
              <div className="bg-sidebar p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-lg font-bold text-sidebar-foreground"
                  >
                    {config.name}
                  </motion.span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-sidebar-foreground/60">Powered by</span>
                  <img src={medsightLogo} alt="MedSight" className="h-6 w-auto opacity-50" />
                </motion.div>
              </div>

              {/* Simulated Dashboard Content */}
              <div className="bg-background/50 p-6">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="h-20 rounded-xl bg-muted/50 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <Palette className="h-5 w-5" />, label: 'Custom Colors', desc: 'Match your brand guidelines' },
                { icon: <Building2 className="h-5 w-5" />, label: 'Your Logo', desc: 'Displayed throughout the platform' },
                { icon: <Paintbrush className="h-5 w-5" />, label: 'Theme Options', desc: 'Light, dark, or custom themes' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Custom Domain */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showDomain ? { opacity: 1, y: 0 } : {}}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-success/10">
                <Globe className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Custom Domain</h3>
                <p className="text-sm text-muted-foreground">Your own web address</p>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 rounded-xl bg-muted/30 flex items-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-background border border-border flex-1">
                <Lock className="h-4 w-4 text-success" />
                <span className="text-foreground font-mono text-lg">https://{hospitalDomain}</span>
              </div>
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">SSL Secured</span>
              </div>
            </motion.div>

            <p className="mt-4 text-sm text-muted-foreground text-center">
              Your staff and patients see your domain — not ours
            </p>
          </div>
        </motion.div>

        {/* Branded Portal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showPortal ? { opacity: 1, y: 0 } : {}}
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-success/10 border-2 border-primary/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Complete Ownership</h3>
                <p className="text-sm text-muted-foreground">This is YOUR hospital's system</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="h-5 w-5 text-success" />, text: 'Your data stays in your control' },
                  { icon: <CheckCircle className="h-5 w-5 text-success" />, text: 'Staff login with hospital credentials' },
                  { icon: <CheckCircle className="h-5 w-5 text-success" />, text: 'Custom reports with your letterhead' },
                  { icon: <CheckCircle className="h-5 w-5 text-success" />, text: 'Patient portal with your branding' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {item.icon}
                    <span className="text-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="p-6 rounded-xl bg-background/80 border border-border text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{config.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">Healthcare Intelligence Platform</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Fully Branded
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
