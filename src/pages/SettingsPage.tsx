import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Building2, CreditCard, Check, Loader2, Receipt } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription, useDepartments } from '@/hooks/useHospitalData';
import { usePaystack } from '@/hooks/usePaystack';
import { subscriptionPlans } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentHistory } from '@/components/settings/PaymentHistory';
import { SubscriptionExpiryAlert } from '@/components/settings/SubscriptionExpiryAlert';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { hospital, user } = useAuth();
  const { data: subscription, isLoading: subLoading, refetch } = useSubscription(hospital?.id);
  const { data: departments, isLoading: deptLoading } = useDepartments(hospital?.id);
  const { initializePayment, verifyPayment, isLoading: paymentLoading } = usePaystack();
  const [searchParams, setSearchParams] = useSearchParams();
  const subscriptionRef = useRef<HTMLDivElement>(null);

  const isLoading = subLoading || deptLoading;

  // Handle payment callback
  useEffect(() => {
    const paymentCallback = searchParams.get('payment');
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (paymentCallback === 'callback' && reference) {
      verifyPayment(reference).then(() => {
        refetch();
        setSearchParams({});
      });
    }
  }, [searchParams, verifyPayment, refetch, setSearchParams]);

  const handleUpgrade = async (planTier: string, price: number) => {
    if (!user?.email || !hospital?.id) return;

    const result = await initializePayment(user.email, price, planTier, hospital.id);
    
    if (result?.authorization_url) {
      window.location.href = result.authorization_url;
    }
  };

  const scrollToPlans = () => {
    subscriptionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatNairaPrice = (usdPrice: number) => {
    const ngnRate = 1500;
    const ngnPrice = usdPrice * ngnRate;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(ngnPrice);
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Manage your hospital account and subscription" />

      <div className="p-6 space-y-6">
        {/* Subscription Expiry Alert */}
        {subscription && (
          <SubscriptionExpiryAlert 
            expiresAt={subscription.expires_at} 
            isActive={subscription.is_active}
            onRenew={scrollToPlans}
          />
        )}

        {/* Hospital Info */}
        <section className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="section-title">Hospital Information</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Hospital Name</p>
                <p className="font-medium">{hospital?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="font-medium">{departments?.length || 0} Active</p>
              </div>
              {hospital?.city && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{hospital.city}, {hospital.state}</p>
                </div>
              )}
              {hospital?.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{hospital.email}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Subscription Plans */}
        <section ref={subscriptionRef} className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="section-title">Subscription Plans</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Pay securely with Paystack - supports cards, bank transfers, and USSD
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => {
              const isCurrentPlan = subscription?.plan === plan.tier;
              
              return (
                <div key={plan.tier} className={cn(
                  'p-5 rounded-lg border-2 transition-all',
                  isCurrentPlan ? 'border-primary bg-accent/30' : 'border-border hover:border-primary/50'
                )}>
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">
                      {formatNairaPrice(plan.price)}
                      <span className="text-sm text-muted-foreground font-normal">/mo</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (${plan.price} USD)
                    </p>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success flex-shrink-0" />{feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={isCurrentPlan ? "secondary" : "default"} 
                    className="w-full mt-4"
                    disabled={isCurrentPlan || paymentLoading}
                    onClick={() => !isCurrentPlan && handleUpgrade(plan.tier, plan.price)}
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Payment History */}
        <section className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="h-5 w-5 text-primary" />
            <h2 className="section-title">Payment History</h2>
          </div>
          <PaymentHistory hospitalId={hospital?.id} />
        </section>

        {/* Payment Methods Info */}
        <section className="card-healthcare">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="section-title">Accepted Payment Methods</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-accent/20 rounded-lg">
              <p className="font-medium">💳 Cards</p>
              <p className="text-xs text-muted-foreground mt-1">Visa, Mastercard, Verve</p>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg">
              <p className="font-medium">🏦 Bank Transfer</p>
              <p className="text-xs text-muted-foreground mt-1">Direct bank payment</p>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg">
              <p className="font-medium">📱 USSD</p>
              <p className="text-xs text-muted-foreground mt-1">*737#, *966#, etc.</p>
            </div>
            <div className="text-center p-4 bg-accent/20 rounded-lg">
              <p className="font-medium">📲 Mobile Money</p>
              <p className="text-xs text-muted-foreground mt-1">Opay, Palmpay, etc.</p>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="card-healthcare bg-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="section-title">Security & Compliance</h2>
          </div>
          <p className="text-sm text-muted-foreground">Your data is protected with HIPAA-aligned security practices. All patient information is encrypted at rest and in transit. Payments are processed securely through Paystack, a PCI-DSS compliant payment gateway.</p>
        </section>
      </div>
    </div>
  );
}
