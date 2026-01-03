import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, CreditCard, Check, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import medsightLogo from '@/assets/medsight-logo.jpg';

interface HospitalData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

interface DepartmentData {
  name: string;
  description: string;
}

type SubscriptionPlan = 'starter' | 'growth' | 'enterprise';

const PLAN_DETAILS = {
  starter: {
    name: 'Starter',
    price: 499,
    maxPatients: 500,
    maxUsers: 5,
    features: ['Core analytics', 'Risk flags', 'Basic dashboards', 'Email support'],
  },
  growth: {
    name: 'Growth',
    price: 1200,
    maxPatients: 2000,
    maxUsers: 20,
    features: ['Advanced AI recommendations', 'Outcome & cost tracking', 'Monthly insights review', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 3000,
    maxPatients: 10000,
    maxUsers: 100,
    features: ['Custom integrations', 'Dedicated account manager', 'SLA guarantees', 'On-premise deployment option'],
  },
};

const STEPS = [
  { id: 'hospital', title: 'Hospital Details', icon: Building2 },
  { id: 'departments', title: 'Departments', icon: Users },
  { id: 'subscription', title: 'Choose Plan', icon: CreditCard },
  { id: 'review', title: 'Review & Finish', icon: Check },
];

const DEMO_HOSPITAL_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

export default function SetupPage() {
  const navigate = useNavigate();
  const { session, profile, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoiningDemo, setIsJoiningDemo] = useState(false);
  
  const [hospitalData, setHospitalData] = useState<HospitalData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
  });
  
  const [departments, setDepartments] = useState<DepartmentData[]>([
    { name: 'General Medicine', description: 'General medical services' },
  ]);
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('starter');

  // Redirect if already has hospital
  useEffect(() => {
    if (!isLoading && profile?.hospital_id) {
      navigate('/dashboard');
    }
  }, [isLoading, profile, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !session) {
      navigate('/login');
    }
  }, [isLoading, session, navigate]);

  const handleJoinDemoHospital = async () => {
    if (!session) {
      toast.error('You must be logged in');
      return;
    }

    setIsJoiningDemo(true);
    try {
      const { data, error } = await supabase.functions.invoke('link-demo-hospital');
      
      if (error) throw error;
      
      if (data?.success) {
        toast.success('Joined demo hospital successfully!');
        window.location.href = '/dashboard';
      } else {
        throw new Error(data?.error || 'Failed to join demo hospital');
      }
    } catch (error: any) {
      console.error('Join demo error:', error);
      toast.error(error.message || 'Failed to join demo hospital');
    } finally {
      setIsJoiningDemo(false);
    }
  };

  const handleHospitalChange = (field: keyof HospitalData, value: string) => {
    setHospitalData(prev => ({ ...prev, [field]: value }));
  };

  const addDepartment = () => {
    setDepartments(prev => [...prev, { name: '', description: '' }]);
  };

  const removeDepartment = (index: number) => {
    if (departments.length > 1) {
      setDepartments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateDepartment = (index: number, field: keyof DepartmentData, value: string) => {
    setDepartments(prev => prev.map((dept, i) => 
      i === index ? { ...dept, [field]: value } : dept
    ));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!hospitalData.name.trim()) {
          toast.error('Hospital name is required');
          return false;
        }
        return true;
      case 1:
        if (!departments.some(d => d.name.trim())) {
          toast.error('At least one department is required');
          return false;
        }
        return true;
      case 2:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      toast.error('You must be logged in to complete setup');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create hospital
      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .insert({
          name: hospitalData.name,
          address: hospitalData.address || null,
          city: hospitalData.city || null,
          state: hospitalData.state || null,
          zip_code: hospitalData.zipCode || null,
          phone: hospitalData.phone || null,
          email: hospitalData.email || null,
        })
        .select()
        .single();

      if (hospitalError) throw hospitalError;

      // 2. Update user profile with hospital_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ hospital_id: hospital.id })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      // 3. Assign hospital_admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: session.user.id,
          role: 'hospital_admin',
        });

      if (roleError) throw roleError;

      // 4. Create subscription
      const plan = PLAN_DETAILS[selectedPlan];
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          hospital_id: hospital.id,
          plan: selectedPlan,
          price_monthly: plan.price,
          max_patients: plan.maxPatients,
          max_users: plan.maxUsers,
          features: plan.features,
        });

      if (subscriptionError) throw subscriptionError;

      // 5. Create departments
      const validDepartments = departments.filter(d => d.name.trim());
      if (validDepartments.length > 0) {
        const { error: deptError } = await supabase
          .from('departments')
          .insert(
            validDepartments.map(d => ({
              hospital_id: hospital.id,
              name: d.name,
              description: d.description || null,
            }))
          );

        if (deptError) throw deptError;
      }

      toast.success('Hospital setup complete!');
      
      // Force refresh auth context
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Setup error:', error);
      toast.error(error.message || 'Failed to complete setup');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={medsightLogo} alt="MedSight Analytics" className="h-10 w-auto" />
          <span className="text-sm text-muted-foreground">Hospital Onboarding</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Demo Hospital Quick Join */}
        <Card className="mb-6 border-dashed border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">Want to explore the demo?</h3>
                <p className="text-sm text-muted-foreground">
                  Join our demo hospital with sample data to see MedSight in action.
                </p>
              </div>
              <Button
                onClick={handleJoinDemoHospital}
                disabled={isJoiningDemo}
                variant="outline"
                className="whitespace-nowrap"
              >
                {isJoiningDemo ? 'Joining...' : 'Join Demo Hospital'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                        isCompleted && 'bg-primary border-primary text-primary-foreground',
                        isActive && 'border-primary text-primary',
                        !isActive && !isCompleted && 'border-muted text-muted-foreground'
                      )}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={cn(
                        'mt-2 text-xs font-medium hidden sm:block',
                        isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 w-8 sm:w-16 md:w-24 mx-2',
                        index < currentStep ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{STEPS[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Enter your hospital or clinic information'}
              {currentStep === 1 && 'Add the departments in your facility'}
              {currentStep === 2 && 'Select the subscription plan that fits your needs'}
              {currentStep === 3 && 'Review your information before completing setup'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 0: Hospital Details */}
            {currentStep === 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="hospitalName">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    value={hospitalData.name}
                    onChange={(e) => handleHospitalChange('name', e.target.value)}
                    placeholder="Lagos General Hospital"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={hospitalData.address}
                    onChange={(e) => handleHospitalChange('address', e.target.value)}
                    placeholder="123 Medical Drive"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={hospitalData.city}
                    onChange={(e) => handleHospitalChange('city', e.target.value)}
                    placeholder="Lagos"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={hospitalData.state}
                    onChange={(e) => handleHospitalChange('state', e.target.value)}
                    placeholder="Lagos State"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={hospitalData.zipCode}
                    onChange={(e) => handleHospitalChange('zipCode', e.target.value)}
                    placeholder="100001"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={hospitalData.phone}
                    onChange={(e) => handleHospitalChange('phone', e.target.value)}
                    placeholder="+234 800 123 4567"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={hospitalData.email}
                    onChange={(e) => handleHospitalChange('email', e.target.value)}
                    placeholder="info@hospital.ng"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 1: Departments */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 border rounded-lg bg-muted/30">
                    <div className="flex-1 grid gap-3 md:grid-cols-2">
                      <div>
                        <Label>Department Name *</Label>
                        <Input
                          value={dept.name}
                          onChange={(e) => updateDepartment(index, 'name', e.target.value)}
                          placeholder="Cardiology"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={dept.description}
                          onChange={(e) => updateDepartment(index, 'description', e.target.value)}
                          placeholder="Heart and cardiovascular care"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDepartment(index)}
                      disabled={departments.length <= 1}
                      className="mt-6"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addDepartment} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            )}

            {/* Step 2: Subscription */}
            {currentStep === 2 && (
              <RadioGroup
                value={selectedPlan}
                onValueChange={(value) => setSelectedPlan(value as SubscriptionPlan)}
                className="grid gap-4 md:grid-cols-3"
              >
                {Object.entries(PLAN_DETAILS).map(([key, plan]) => (
                  <Label
                    key={key}
                    htmlFor={key}
                    className={cn(
                      'cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50',
                      selectedPlan === key ? 'border-primary bg-primary/5' : 'border-muted'
                    )}
                  >
                    <RadioGroupItem value={key} id={key} className="sr-only" />
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <p className="text-2xl font-bold text-primary">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">/mo</span>
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Up to {plan.maxPatients.toLocaleString()} patients</p>
                        <p>Up to {plan.maxUsers} users</p>
                      </div>
                      <ul className="text-sm space-y-1">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Hospital
                  </h4>
                  <p className="font-semibold">{hospitalData.name}</p>
                  {hospitalData.address && (
                    <p className="text-sm text-muted-foreground">
                      {hospitalData.address}, {hospitalData.city}, {hospitalData.state}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Departments ({departments.filter(d => d.name.trim()).length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {departments
                      .filter(d => d.name.trim())
                      .map((dept, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full bg-muted text-sm"
                        >
                          {dept.name}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Subscription Plan
                  </h4>
                  <p className="font-semibold">
                    {PLAN_DETAILS[selectedPlan].name} - ${PLAN_DETAILS[selectedPlan].price}/month
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {PLAN_DETAILS[selectedPlan].maxPatients.toLocaleString()} patients, {PLAN_DETAILS[selectedPlan].maxUsers} users
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Setting up...' : 'Complete Setup'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
