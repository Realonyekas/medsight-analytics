import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Stethoscope, ClipboardList, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import medsightLogo from '@/assets/medsight-logo.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('hospital_admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'hospital_admin' as UserRole, 
      label: 'Hospital Admin', 
      description: 'Full access to all features',
      icon: Building2 
    },
    { 
      id: 'clinician' as UserRole, 
      label: 'Clinician', 
      description: 'Patient insights and recommendations',
      icon: Stethoscope 
    },
    { 
      id: 'operations' as UserRole, 
      label: 'Operations Staff', 
      description: 'Operational metrics and efficiency',
      icon: ClipboardList 
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email || 'demo@medsight.ng', password || 'demo123', selectedRole);
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div>
          <img 
            src={medsightLogo} 
            alt="MedSight Analytics" 
            className="h-16 w-auto object-contain"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-sidebar-foreground leading-tight tracking-wide">
            SMARTER INSIGHTS. BETTER CARE.
          </h1>
          <p className="text-lg text-sidebar-foreground/70 leading-relaxed">
            Reduce administrative workload, flag high-risk patients early, and identify operational inefficiencies — all in one platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              Risk Prediction
            </span>
            <span className="px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              Operational Analytics
            </span>
            <span className="px-3 py-1.5 rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm">
              Cost Optimization
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sidebar-foreground/60 text-sm">
            <Shield className="h-4 w-4" />
            <span>HIPAA-Aligned Data Security</span>
          </div>
          <p className="text-xs text-sidebar-foreground/40">
            Your data is encrypted and stored securely. We never share patient information with third parties.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img 
              src={medsightLogo} 
              alt="MedSight Analytics" 
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to access your hospital's analytics</p>
          </div>

          {/* Demo Notice */}
          <div className="bg-accent/50 border border-accent rounded-lg p-4">
            <p className="text-sm text-accent-foreground">
              <strong>Demo Mode:</strong> Select a role and click "Sign In" to explore the platform with sample data.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Select your role</label>
              <div className="grid gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left',
                      selectedRole === role.id
                        ? 'border-primary bg-accent/50'
                        : 'border-border hover:border-primary/30 hover:bg-accent/30'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      selectedRole === role.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <role.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hospital.ng"
                className="w-full h-11 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <button type="button" className="text-sm text-primary hover:text-primary/80">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button className="text-primary hover:text-primary/80 font-medium">
              Contact sales
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
