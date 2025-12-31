import { Shield, Building2, Users, CreditCard, Bell, Database, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionPlans } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { hospital } = useAuth();

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Manage your hospital account and subscription" />

      <div className="p-6 space-y-6">
        {/* Hospital Info */}
        <section className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="section-title">Hospital Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Hospital Name</p><p className="font-medium">{hospital?.name}</p></div>
            <div><p className="text-sm text-muted-foreground">Departments</p><p className="font-medium">{hospital?.departments.length} Active</p></div>
          </div>
        </section>

        {/* Subscription */}
        <section className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="section-title">Subscription Plans</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.tier} className={cn(
                'p-5 rounded-lg border-2 transition-all',
                hospital?.subscriptionTier === plan.tier ? 'border-primary bg-accent/30' : 'border-border'
              )}>
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold mt-2">${plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></p>
                <ul className="mt-4 space-y-2">
                  {plan.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />{feature}
                    </li>
                  ))}
                </ul>
                <Button variant={hospital?.subscriptionTier === plan.tier ? "secondary" : "outline"} className="w-full mt-4">
                  {hospital?.subscriptionTier === plan.tier ? 'Current Plan' : 'Upgrade'}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="card-healthcare bg-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="section-title">Security & Compliance</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your data is protected with HIPAA-aligned security practices. All patient information is encrypted at rest and in transit.</p>
        </section>
      </div>
    </div>
  );
}
