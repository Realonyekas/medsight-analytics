import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, TrendingDown, Zap, CheckCircle, ArrowRight, Send, Building2, User, Mail, Phone, MessageSquare, Play, Monitor, BarChart3, Users, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import medsightLogo from '@/assets/medsight-logo.jpg';

type TourTab = 'patients' | 'analytics' | 'alerts';

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hospital: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTourTab, setActiveTourTab] = useState<TourTab>('patients');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 500px (approximately past hero section)
      setShowStickyCta(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Sticky CTA Bar */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[60] bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                <div className="flex items-center gap-3">
                  <img 
                    src={medsightLogo} 
                    alt="MedSight Analytics" 
                    className="h-8 w-auto object-contain"
                  />
                  <span className="hidden sm:block text-sm text-sidebar-foreground/80">
                    Smarter decisions. Better outcomes. Lower costs.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a href="#value" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                      See the Value
                    </Button>
                  </a>
                  <a href="#demo" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                      Request Demo
                    </Button>
                  </a>
                  <Link to="/login?signup=true">
                    <Button size="sm" className="font-semibold shadow-lg shadow-primary/30">
                      Sign Up
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <Link to="/pricing">
                <Button variant="ghost" className="font-medium">
                  Pricing
                </Button>
              </Link>
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
              Built for Nigerian Mid-Sized Hospitals & Clinics
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight mb-6">
              The Best Health Data Tools
              <br />
              <span className="text-primary">For Hospitals</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              MedSight Analytics transforms your existing patient data into clear, actionable intelligence. Reduce admin workload, flag high-risk patients early, improve clinical decision-making, and cut avoidable costs—all with explainable AI that works with your current systems.
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
              <span className="text-sm font-medium text-muted-foreground">HIPAA-Aligned & Compliance-Focused</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Integrates With Your Existing Systems</span>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-warning" />
              <span className="text-sm font-medium text-muted-foreground">See Value Within 72 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="value" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Fast Time to Value
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Purpose-built for Nigerian mid-sized hospitals and clinics. No infrastructure overhaul required—MedSight works with the data you already collect to deliver measurable results within days, not months.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reduce Admin Workload</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automated analysis replaces manual data gathering and reporting. Your staff spends less time on paperwork, more time with patients.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <Activity className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Flag High-Risk Patients Early</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Identify patients at risk of deterioration or readmission before complications occur. Early intervention saves lives and resources.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 group-hover:bg-success/20 transition-colors">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Improve Decision-Making</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Explainable AI provides clear, evidence-based recommendations. Every insight shows its reasoning so clinicians remain in control.
              </p>
            </div>
            
            <div className="card-healthcare group">
              <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:bg-warning/20 transition-colors">
                <Shield className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Cut Avoidable Costs</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Surface operational inefficiencies and resource waste. Most hospitals see measurable cost reductions within the first 90 days.
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
              Works With Your Existing Systems
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No lengthy implementations. No IT overhauls. MedSight integrates with your current EMR and hospital systems, delivering actionable insights within 72 hours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure Integration</h3>
              <p className="text-muted-foreground text-sm">
                Connect your EMR, HMS, or clinical databases through our encrypted integration layer. Your data stays in your control—no migration required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Explainable AI Analysis</h3>
              <p className="text-muted-foreground text-sm">
                Our AI continuously analyzes patient and operational data, surfacing patterns and risks with clear explanations for every recommendation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Immediate Value</h3>
              <p className="text-muted-foreground text-sm">
                Receive clear, prioritized alerts and recommendations through dashboards designed for busy clinical teams.
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
              Interactive Tour
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Experience the Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore how MedSight Analytics transforms raw hospital data into clear, actionable insights—click the tabs below to see different views.
            </p>
          </div>
          
          {/* Interactive Dashboard Container */}
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-muted/50 rounded-xl p-1.5 gap-1">
                <button
                  onClick={() => setActiveTourTab('patients')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTourTab === 'patients'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Patients</span>
                </button>
                <button
                  onClick={() => setActiveTourTab('analytics')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTourTab === 'analytics'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTourTab('alerts')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTourTab === 'alerts'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Alerts</span>
                </button>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sidebar via-sidebar to-primary/30 shadow-2xl shadow-primary/10">
              {/* Aspect Ratio Container */}
              <div className="aspect-video relative">
                {/* Mock Dashboard Preview */}
                <div className="absolute inset-0 p-4 sm:p-6">
                  <div className="h-full w-full rounded-xl bg-background/95 backdrop-blur-sm border border-border/50 overflow-hidden flex flex-col">
                    {/* Mock Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          key={activeTourTab}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center"
                        >
                          {activeTourTab === 'patients' && <Users className="h-4 w-4 text-primary" />}
                          {activeTourTab === 'analytics' && <BarChart3 className="h-4 w-4 text-primary" />}
                          {activeTourTab === 'alerts' && <Activity className="h-4 w-4 text-primary" />}
                        </motion.div>
                        <div>
                          <motion.div 
                            key={`title-${activeTourTab}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="text-sm font-semibold text-foreground"
                          >
                            {activeTourTab === 'patients' && 'Patient Management'}
                            {activeTourTab === 'analytics' && 'Analytics Dashboard'}
                            {activeTourTab === 'alerts' && 'Risk Alerts'}
                          </motion.div>
                          <div className="text-xs text-muted-foreground">Lagos General Hospital</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content with AnimatePresence */}
                    <AnimatePresence mode="wait">
                      {/* Patients View */}
                      {activeTourTab === 'patients' && (
                        <motion.div 
                          key="patients"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex-1 p-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-medium text-muted-foreground">Active Patients (247)</div>
                            <div className="flex gap-2">
                              <div className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">All</div>
                              <div className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs">High Risk</div>
                              <div className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs hidden sm:block">ICU</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {[
                              { name: 'Adaora Okonkwo', age: 67, risk: 'high', diagnosis: 'Cardiac Arrhythmia', stay: '5 days' },
                              { name: 'Emeka Nwosu', age: 45, risk: 'medium', diagnosis: 'Post-Op Recovery', stay: '3 days' },
                              { name: 'Fatima Ibrahim', age: 34, risk: 'low', diagnosis: 'Routine Checkup', stay: '1 day' },
                              { name: 'Chinedu Eze', age: 52, risk: 'high', diagnosis: 'Diabetic Complications', stay: '7 days' },
                            ].map((patient, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                    patient.risk === 'high' ? 'bg-destructive/20 text-destructive' :
                                    patient.risk === 'medium' ? 'bg-warning/20 text-warning' :
                                    'bg-success/20 text-success'
                                  }`}>
                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-foreground">{patient.name}</div>
                                    <div className="text-xs text-muted-foreground">{patient.diagnosis}</div>
                                  </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                  <div className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    patient.risk === 'high' ? 'bg-destructive/10 text-destructive' :
                                    patient.risk === 'medium' ? 'bg-warning/10 text-warning' :
                                    'bg-success/10 text-success'
                                  }`}>
                                    {patient.risk} risk
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">{patient.stay}</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Analytics View */}
                      {activeTourTab === 'analytics' && (
                        <motion.div 
                          key="analytics"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex-1 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                          {[
                            { label: 'Bed Occupancy', value: '87%', change: 'Optimal', icon: TrendingDown },
                            { label: 'Avg LOS', value: '4.2d', change: '-12%', icon: TrendingDown },
                            { label: 'Readmissions', value: '8.4%', change: '-5%', icon: TrendingDown },
                            { label: 'Cost Saved', value: '₦2.4M', change: 'This month', icon: Zap },
                          ].map((metric, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              className="col-span-1 rounded-lg bg-card border border-border p-3"
                            >
                              <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                              <div className="text-xl font-bold text-foreground">{metric.value}</div>
                              <div className="text-xs text-success flex items-center gap-1">
                                <metric.icon className="h-3 w-3" /> {metric.change}
                              </div>
                            </motion.div>
                          ))}
                          <motion.div 
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            style={{ transformOrigin: 'bottom' }}
                            className="col-span-2 sm:col-span-4 rounded-lg bg-card border border-border p-3"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-muted-foreground">Weekly Admissions vs Discharges</span>
                              <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /> Admissions</span>
                                <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-success" /> Discharges</span>
                              </div>
                            </div>
                            <div className="flex items-end gap-2 h-20">
                              {[
                                { a: 45, d: 42 }, { a: 52, d: 48 }, { a: 38, d: 45 }, { a: 65, d: 55 },
                                { a: 48, d: 52 }, { a: 72, d: 68 }, { a: 55, d: 58 }
                              ].map((day, i) => (
                                <motion.div 
                                  key={i} 
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: 1 }}
                                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                                  style={{ transformOrigin: 'bottom' }}
                                  className="flex-1 flex gap-0.5 h-full"
                                >
                                  <div className="flex-1 rounded-t bg-primary/60" style={{ height: `${day.a}%` }} />
                                  <div className="flex-1 rounded-t bg-success/60" style={{ height: `${day.d}%` }} />
                                </motion.div>
                              ))}
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                      
                      {/* Alerts View */}
                      {activeTourTab === 'alerts' && (
                        <motion.div 
                          key="alerts"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="flex-1 p-4 overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-medium text-muted-foreground">Active Alerts (12)</div>
                            <div className="flex gap-2">
                              <motion.div 
                                initial={{ scale: 0.8 }}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-medium"
                              >
                                3 Critical
                              </motion.div>
                              <div className="px-2 py-1 rounded bg-warning/10 text-warning text-xs font-medium">5 Warning</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {[
                              { type: 'critical', title: 'Deterioration Risk Detected', patient: 'Adaora Okonkwo', time: '2 min ago', desc: 'Vital signs trending down, SpO2 at 91%' },
                              { type: 'critical', title: 'High Readmission Risk', patient: 'Chinedu Eze', time: '15 min ago', desc: 'Predicted 78% readmission probability' },
                              { type: 'warning', title: 'Extended Length of Stay', patient: 'ICU Ward', time: '1 hr ago', desc: '3 patients exceeding predicted LOS' },
                              { type: 'info', title: 'Discharge Ready', patient: 'Fatima Ibrahim', time: '2 hrs ago', desc: 'All criteria met for safe discharge' },
                            ].map((alert, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${
                                  alert.type === 'critical' ? 'bg-destructive/5 border-destructive/20' :
                                  alert.type === 'warning' ? 'bg-warning/5 border-warning/20' :
                                  'bg-card border-border'
                                }`}
                              >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  alert.type === 'critical' ? 'bg-destructive/20' :
                                  alert.type === 'warning' ? 'bg-warning/20' :
                                  'bg-success/20'
                                }`}>
                                  <Activity className={`h-4 w-4 ${
                                    alert.type === 'critical' ? 'text-destructive' :
                                    alert.type === 'warning' ? 'text-warning' :
                                    'text-success'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm font-medium text-foreground truncate">{alert.title}</div>
                                    <div className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">{alert.patient}</div>
                                  <div className="text-xs text-muted-foreground/70 mt-1 hidden sm:block">{alert.desc}</div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tour Feature Descriptions */}
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <button
                onClick={() => setActiveTourTab('patients')}
                className={`text-center p-4 rounded-xl transition-all ${
                  activeTourTab === 'patients' ? 'bg-primary/10 ring-2 ring-primary/20' : 'hover:bg-muted/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  activeTourTab === 'patients' ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Patient Overview</h3>
                <p className="text-sm text-muted-foreground">Track every patient with real-time risk scoring and predictive insights.</p>
              </button>
              <button
                onClick={() => setActiveTourTab('analytics')}
                className={`text-center p-4 rounded-xl transition-all ${
                  activeTourTab === 'analytics' ? 'bg-success/10 ring-2 ring-success/20' : 'hover:bg-muted/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  activeTourTab === 'analytics' ? 'bg-success/20' : 'bg-success/10'
                }`}>
                  <BarChart3 className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Operational Analytics</h3>
                <p className="text-sm text-muted-foreground">Monitor KPIs, track cost savings, and identify optimization opportunities.</p>
              </button>
              <button
                onClick={() => setActiveTourTab('alerts')}
                className={`text-center p-4 rounded-xl transition-all ${
                  activeTourTab === 'alerts' ? 'bg-destructive/10 ring-2 ring-destructive/20' : 'hover:bg-muted/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  activeTourTab === 'alerts' ? 'bg-destructive/20' : 'bg-destructive/10'
                }`}>
                  <Activity className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Smart Alerts</h3>
                <p className="text-sm text-muted-foreground">AI-powered early warnings for deterioration and readmission risks.</p>
              </button>
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
                  HIPAA-Aligned. Compliance-Focused.
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Patient data demands the highest protection. MedSight Analytics implements HIPAA-aligned security controls at every layer—encryption, access management, and complete audit trails. Your data stays under your control, always.
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

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/30 to-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HelpCircle className="h-4 w-4" />
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about MedSight Analytics implementation, security, and integration.
            </p>
          </div>
          
          <div className="space-y-3">
            {[
              {
                question: "How long does implementation take?",
                answer: "Most hospitals are fully operational within 72 hours. Our integration layer connects to your existing EMR or hospital management system without requiring data migration. We handle the technical setup while your team continues normal operations."
              },
              {
                question: "What systems does MedSight integrate with?",
                answer: "MedSight Analytics integrates with all major hospital management systems and EMRs used in Nigeria, including proprietary solutions. Our API-based integration works with any system that can export patient and operational data. We also support manual data uploads for facilities transitioning to digital records."
              },
              {
                question: "How is patient data protected?",
                answer: "We implement HIPAA-aligned security controls including AES-256 encryption for data at rest and in transit, role-based access control, comprehensive audit trails, and zero third-party data sharing. Nigerian data residency options are available, and we undergo annual third-party security audits."
              },
              {
                question: "Do we need IT staff to manage MedSight?",
                answer: "No dedicated IT staff required. MedSight is a fully managed cloud solution with an intuitive interface designed for clinical and administrative users. Our support team handles all technical maintenance, updates, and monitoring."
              },
              {
                question: "What kind of training is provided?",
                answer: "We provide comprehensive onboarding including live training sessions for your team, video tutorials, and 24/7 access to our support team. Most staff become proficient within a single training session—the interface is designed to feel familiar to anyone who uses modern software."
              },
              {
                question: "How does the AI explain its recommendations?",
                answer: "Every AI-generated insight includes clear explanations showing which data points contributed to the recommendation. Clinicians can see the reasoning behind risk scores, predicted outcomes, and suggested actions—making it easy to validate and act on insights with confidence."
              },
              {
                question: "What's the pricing model?",
                answer: "We offer flexible plans based on hospital size and feature requirements. Enterprise plans start at ₦1.2M/month and include dedicated support, custom integrations, and unlimited users. Contact us for a personalized quote based on your specific needs."
              },
              {
                question: "Can we try before we commit?",
                answer: "Yes. We offer a hands-on demo with sample data so you can explore the platform's capabilities. We can also run a pilot program with a subset of your departments before full deployment."
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={false}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <a href="#demo">
              <Button variant="outline" className="font-semibold">
                Talk to Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
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
