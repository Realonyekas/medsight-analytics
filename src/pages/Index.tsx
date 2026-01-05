import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, TrendingDown, Zap, CheckCircle, ArrowRight, Send, Building2, User, Mail, Phone, MessageSquare, Play, Monitor, BarChart3, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import medsightLogo from '@/assets/medsight-logo.jpg';

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.hospital.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('submit-demo-request', {
        body: formData,
      });

      if (error) throw error;

      toast.success('Thank you! Our team will contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', hospital: '', message: '' });
    } catch (error) {
      console.error('Error submitting demo request:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Purpose-Built for Nigerian Healthcare
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              Clinical Intelligence
              <br />
              <span className="text-primary">You Can Act On.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              MedSight Analytics turns your existing hospital data into clear, actionable insights. Reduce administrative burden by 40%, identify high-risk patients before complications arise, and eliminate avoidable costs—powered by explainable AI that integrates with your current systems.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#value">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold px-8 h-12">
                  See the Value
                </Button>
              </a>
              <Link to="/login?signup=true">
                <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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
              <span className="text-sm font-medium text-muted-foreground">HIPAA-Aligned Security Standards</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Seamless EMR Integration</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">Operational in 72 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="value" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Measurable Impact From Day One
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for Nigerian hospitals and clinics. No infrastructure overhaul required—MedSight works with the data you already collect to deliver immediate, quantifiable results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">40% Less Admin Work</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automated data analysis eliminates manual reporting. Clinical staff reclaim hours each week for direct patient care.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <Activity className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Early Risk Detection</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AI-powered alerts identify deteriorating patients and readmission risks 24-48 hours earlier than traditional methods.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Confident Decisions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Evidence-based recommendations with full transparency. Every AI insight explains its reasoning so clinicians stay in control.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Recover Lost Revenue</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pinpoint operational inefficiencies and resource leakage. Hospitals typically recover 15-25% in avoidable costs within 90 days.
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
              From Setup to Insights in 72 Hours
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No lengthy implementations. No IT overhauls. MedSight connects to your existing systems and starts delivering value within days, not months.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure Connection</h3>
              <p className="text-muted-foreground text-sm">
                Connect your EMR, HMS, or clinical databases through our encrypted integration layer. No data migration required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Intelligent Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our AI continuously analyzes patient and operational data, surfacing patterns human review would miss.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Actionable Alerts</h3>
              <p className="text-muted-foreground text-sm">
                Receive clear, prioritized recommendations through dashboards designed for busy clinical environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tour Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Play className="h-4 w-4" />
              See It In Action
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Experience the Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch how MedSight Analytics transforms raw hospital data into clear, actionable insights—without requiring any technical expertise from your team.
            </p>
          </div>
          
          {/* Video Player Container */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-primary/30 shadow-2xl shadow-primary/10">
              {/* Aspect Ratio Container */}
              <div className="aspect-video relative">
                {/* Mock Dashboard Preview */}
                <div className="absolute inset-0 p-6 sm:p-8">
                  <div className="h-full w-full rounded-xl bg-background/95 backdrop-blur-sm border border-border/50 overflow-hidden flex flex-col">
                    {/* Mock Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="h-3 w-32 bg-foreground/80 rounded" />
                          <div className="h-2 w-20 bg-muted-foreground/40 rounded mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-success/20" />
                        <div className="h-8 w-8 rounded-full bg-warning/20" />
                      </div>
                    </div>
                    
                    {/* Mock Content */}
                    <div className="flex-1 p-4 grid grid-cols-3 gap-4">
                      {/* Metric Cards */}
                      <div className="col-span-3 sm:col-span-1 rounded-lg bg-card border border-border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">High-Risk Patients</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">23</div>
                        <div className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <Activity className="h-3 w-3" /> 5 require attention
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-1 rounded-lg bg-card border border-border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-4 w-4 text-success" />
                          <span className="text-xs font-medium text-muted-foreground">Avg Length of Stay</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">4.2d</div>
                        <div className="text-xs text-success flex items-center gap-1 mt-1">
                          <TrendingDown className="h-3 w-3" /> 12% improved
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-1 rounded-lg bg-card border border-border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="h-4 w-4 text-warning" />
                          <span className="text-xs font-medium text-muted-foreground">Readmission Risk</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">8.4%</div>
                        <div className="text-xs text-success flex items-center gap-1 mt-1">
                          <TrendingDown className="h-3 w-3" /> Below target
                        </div>
                      </div>
                      
                      {/* Chart Area */}
                      <div className="col-span-3 rounded-lg bg-card border border-border p-3 flex-1 hidden sm:block">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-muted-foreground">Patient Risk Trends</span>
                          <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <div className="h-2 w-2 rounded-full bg-success" />
                            <div className="h-2 w-2 rounded-full bg-warning" />
                          </div>
                        </div>
                        <div className="flex items-end gap-1 h-16">
                          {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 65, 90].map((height, i) => (
                            <div 
                              key={i} 
                              className="flex-1 rounded-t bg-gradient-to-t from-primary/60 to-primary/20"
                              style={{ height: `${height}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] group cursor-pointer hover:bg-black/30 transition-colors">
                  <div className="h-20 w-20 rounded-full bg-primary/90 flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tour Features */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Dashboard Overview</h3>
                <p className="text-sm text-muted-foreground">See how real-time metrics keep your team informed at a glance.</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Risk Alerts</h3>
                <p className="text-sm text-muted-foreground">Watch AI-powered early warning systems identify at-risk patients.</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Actionable Insights</h3>
                <p className="text-sm text-muted-foreground">Discover how explainable AI drives confident clinical decisions.</p>
              </div>
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
                  Healthcare-Grade Security, Built In
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Patient data demands the highest protection. MedSight Analytics implements HIPAA-aligned security controls throughout every layer—encryption, access management, and comprehensive audit trails. Your data never leaves your control.
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    AES-256 encryption at rest and in transit
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Granular role-based access control
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Complete audit trails for compliance
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Zero third-party data sharing
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Nigerian data residency available
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    Annual third-party security audits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Request Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                Enterprise & Custom Solutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
                Request a Demo
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Ready to see MedSight Analytics in action? Our team will walk you through the platform, answer your questions, and help you understand how we can support your hospital's unique needs.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Personalized walkthrough</p>
                    <p className="text-sm text-muted-foreground">See features tailored to your hospital size and specialty</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Integration assessment</p>
                    <p className="text-sm text-muted-foreground">We'll review compatibility with your current systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Custom pricing options</p>
                    <p className="text-sm text-muted-foreground">Enterprise plans starting at ₦1.2M/month with dedicated support</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-healthcare p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Talk to Our Team</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-1.5 block">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Dr. Amara Obi"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                      Work Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="amara@hospital.ng"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-foreground mb-1.5 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+234 801 234 5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hospital" className="text-sm font-medium text-foreground mb-1.5 block">
                      Hospital/Clinic <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="hospital"
                        name="hospital"
                        type="text"
                        placeholder="Lagos General Hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground mb-1.5 block">
                    How can we help?
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your hospital's needs, current challenges, or questions..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="pl-10 min-h-[100px] resize-none"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Request Demo
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  We'll respond within 24 hours. Your data is protected by our HIPAA-aligned security practices.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 via-background to-success/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Start Making Data-Driven Decisions Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Leading Nigerian hospitals trust MedSight Analytics to reduce costs, improve outcomes, and empower their clinical teams. See why in a personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#value">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold px-8 h-12">
                See the Value
              </Button>
            </a>
            <Link to="/login?signup=true">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 h-12 shadow-lg shadow-primary/20">
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
                © 2025 MedSight Analytics. All rights reserved.
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
