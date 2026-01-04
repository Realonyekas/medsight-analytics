import { Link } from 'react-router-dom';
import { Shield, Activity, TrendingDown, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import medsightLogo from '@/assets/medsight-logo.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img 
              src={medsightLogo} 
              alt="MedSight Analytics" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/login?signup=true">
                <Button className="font-semibold shadow-lg shadow-primary/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-success/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="text-lg">🇳🇬</span>
              Built for Nigerian Healthcare
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Smarter Insights.
              <br />
              <span className="text-primary">Better Care.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              MedSight Analytics transforms your existing patient and operational data into actionable intelligence. Reduce admin workload, flag high-risk patients early, and cut avoidable costs—all with explainable AI your team can trust.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login?signup=true">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#value">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold px-8 h-12">
                  See the Value
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-success" />
              <span className="text-sm font-medium text-muted-foreground">HIPAA-Aligned Data Handling</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Works With Your Existing Systems</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Go Live in Days, Not Months</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="value" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Decision Support That Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for mid-sized Nigerian hospitals and clinics. No complex setup. No IT overhaul. Just actionable insights from data you already collect.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reduce Admin Workload</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automate routine data analysis and surface what matters. Your staff focuses on patients, not spreadsheets.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <Activity className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Flag High-Risk Patients</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Early warning alerts for deteriorating patients. Identify readmission risks before they become emergencies.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Improve Decisions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Data-driven recommendations for clinical and operational choices. Explainable AI that supports—never replaces—your judgment.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cut Avoidable Costs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Identify operational inefficiencies and cost leaks. See exactly where resources are being lost and how to recover them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Fast Time to Value
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get up and running quickly. MedSight integrates with your existing hospital management system—no data migration headaches.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Data</h3>
              <p className="text-muted-foreground text-sm">
                Secure integration with your existing EMR or hospital management system. We work with what you have.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Analyzes Patterns</h3>
              <p className="text-muted-foreground text-sm">
                Our explainable AI surfaces insights from your operational and patient data automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Act on Insights</h3>
              <p className="text-muted-foreground text-sm">
                Clear dashboards and alerts help your team make better decisions—faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="card-healthcare bg-sidebar/5 border-sidebar/20 p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="h-16 w-16 rounded-2xl bg-success/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-success" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
                  Compliance-First Data Handling
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We take data security as seriously as you do. MedSight Analytics is built with HIPAA-aligned security practices from the ground up. Your patient data is encrypted at rest and in transit, with strict access controls and comprehensive audit logging.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Role-based access control
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Complete audit trails
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    No third-party data sharing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Nigerian data residency options
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Regular security assessments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-success/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Ready to Transform Your Hospital Operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join forward-thinking Nigerian healthcare providers already using MedSight Analytics to deliver better patient outcomes with fewer resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?signup=true">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-12 shadow-lg shadow-primary/20">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#value">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold px-8 h-12">
                See the Value
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              HIPAA-Aligned Data Security
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
