import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import medsightLogo from '@/assets/medsight-logo.jpg';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
});

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(searchParams.get('signup') === 'true');
  const isDemo = searchParams.get('demo') === 'true';
  
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUp(searchParams.get('signup') === 'true');
  }, [searchParams]);

  const joinDemoHospital = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('link-demo-hospital');
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to join demo');
      return true;
    } catch (err) {
      console.error('Failed to join demo hospital:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        const validation = signUpSchema.safeParse({ email, password, fullName });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          return;
        }
      } else {
        const validation = loginSchema.safeParse({ email, password });
        if (!validation.success) {
          setError(validation.error.errors[0].message);
          return;
        }
      }
    } catch {
      setError('Invalid input');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error);
        } else {
          // If demo mode, join demo hospital after signup
          if (isDemo) {
            await joinDemoHospital();
          }
          window.location.href = '/dashboard';
        }
      } else {
        const { error } = await login(email, password);
        if (error) {
          setError(error);
        } else {
          // If demo mode, join demo hospital after login
          if (isDemo) {
            await joinDemoHospital();
          }
          window.location.href = '/dashboard';
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sidebar via-sidebar to-primary/20 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="space-y-8 relative z-10">
          <img 
            src={medsightLogo} 
            alt="MedSight Analytics" 
            className="h-16 w-auto object-contain"
          />
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight tracking-tight">
            {isSignUp ? (
              <>Clinical Intelligence<br />That Drives Results</>
            ) : (
              <>Your Insights<br />Await</>
            )}
          </h1>
          <p className="text-lg text-sidebar-foreground/80 leading-relaxed max-w-md">
            {isSignUp 
              ? 'Join Nigerian healthcare leaders using explainable AI to reduce admin workload by 40%, flag high-risk patients earlier, and cut avoidable costs.'
              : 'Continue leveraging data-driven insights to improve patient outcomes and operational efficiency.'
            }
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium backdrop-blur-sm">
              Early Risk Detection
            </span>
            <span className="px-4 py-2 rounded-full bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium backdrop-blur-sm">
              Explainable AI
            </span>
            <span className="px-4 py-2 rounded-full bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium backdrop-blur-sm">
              72-Hour Setup
            </span>
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3 text-sidebar-foreground/70 text-sm">
            <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-success" />
            </div>
            <span className="font-medium">HIPAA-Aligned Security Standards</span>
          </div>
          <p className="text-xs text-sidebar-foreground/50 pl-11">
            AES-256 encryption, role-based access control, and complete audit trails. Your data stays in your control.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-background to-accent/20">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo & Navigation */}
          <div className="lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex flex-col items-center mb-8">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-14 w-auto object-contain"
              />
              <p className="text-[11px] font-semibold tracking-[0.2em] text-primary/70 mt-3 uppercase">
                Decision Intelligence for Healthcare
              </p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {isDemo ? 'Explore the Platform' : (isSignUp ? 'Get Started Today' : 'Welcome Back')}
            </h2>
            <p className="text-muted-foreground mt-2 text-base">
              {isDemo
                ? 'Create an account to experience MedSight Analytics with real sample data.'
                : (isSignUp 
                  ? 'Create your account to start transforming patient data into actionable insights.' 
                  : "Access your hospital's analytics dashboard and continue improving outcomes.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. John Doe"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:border-ring/50"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hospital.ng"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:border-ring/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                {!isSignUp && (
                  <button type="button" className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 hover:border-ring/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-destructive text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200" disabled={isLoading}>
              {isLoading 
                ? (isSignUp ? 'Creating account...' : 'Signing in...') 
                : (isDemo 
                  ? (isSignUp ? 'Create Account & Try Demo' : 'Sign In & Try Demo')
                  : (isSignUp ? 'Sign Up' : 'Sign In'))}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
