import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Heart, Shield, Users, Lightbulb } from "lucide-react";
import medsightLogo from "@/assets/medsight-logo.jpg";

const teamMembers = [
  {
    name: "Dr. Adaeze Okonkwo",
    role: "Chief Executive Officer",
    bio: "Former Chief Medical Officer at Lagos University Teaching Hospital with 15+ years in healthcare administration. Dr. Okonkwo leads MedSight's mission to transform Nigerian healthcare through accessible AI technology.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Chukwuemeka Nwosu",
    role: "Chief Technology Officer",
    bio: "AI researcher and former Google engineer specializing in healthcare machine learning. Emeka architects MedSight's explainable AI systems that integrate seamlessly with existing hospital infrastructure.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Folake Adeyemi",
    role: "Chief Operations Officer",
    bio: "Healthcare operations expert with experience scaling health-tech startups across West Africa. Folake ensures our platform delivers measurable value within 72 hours of deployment.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Dr. Olumide Bakare",
    role: "Chief Medical Officer",
    bio: "Board-certified internist and health informatics specialist. Dr. Bakare validates all clinical algorithms and ensures MedSight's recommendations align with Nigerian healthcare standards.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Amara Eze",
    role: "Head of Customer Success",
    bio: "Former hospital administrator who understands the daily challenges Nigerian healthcare facilities face. Amara leads our implementation team to ensure every client sees rapid time to value.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Tunde Olatunji",
    role: "Head of Data Security",
    bio: "Cybersecurity expert with certifications in healthcare data protection. Tunde ensures MedSight maintains HIPAA-aligned, compliance-focused data handling across all deployments.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  }
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every insight we deliver is grounded in rigorous analysis of your existing data, ensuring accuracy you can trust for critical decisions."
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Our explainable AI shows you exactly how conclusions are reached—no black boxes, just clear reasoning you can verify and act upon."
  },
  {
    icon: Heart,
    title: "Patient-Centered",
    description: "Behind every data point is a patient. We build technology that helps clinicians focus on what matters most: better outcomes."
  },
  {
    icon: Shield,
    title: "Trust",
    description: "Healthcare data demands the highest standards. We maintain HIPAA-aligned practices and compliance-focused protocols at every level."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-foreground">MedSight Analytics</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-foreground font-medium">
                About
              </Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/login?signup=true">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Transforming Nigerian Healthcare
            <span className="block text-primary mt-2">Through Intelligent Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            MedSight Analytics empowers mid-sized hospitals and clinics across Nigeria with AI-driven 
            decision intelligence—reducing costs, improving outcomes, and giving clinicians time back 
            for what matters most: patient care.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Lightbulb className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Making World-Class Healthcare Analytics Accessible
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Nigerian healthcare facilities generate vast amounts of data every day—patient records, 
                lab results, operational metrics. Yet most of this valuable information sits unused, 
                locked away in disparate systems.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                We founded MedSight Analytics to change that. Our mission is to unlock the insights 
                hidden in your existing data, delivering actionable intelligence that reduces administrative 
                burden, flags high-risk patients before complications arise, and identifies cost savings 
                you didn't know existed.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe every hospital—regardless of size or budget—deserves access to the same 
                decision-support tools that power the world's leading medical centres.
              </p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 lg:p-12">
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Connect Your Systems</h3>
                    <p className="text-muted-foreground">Seamless integration with existing EMR, billing, and lab systems—no data migration required.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">AI Analyzes Patterns</h3>
                    <p className="text-muted-foreground">Explainable algorithms identify risks, inefficiencies, and opportunities across your data.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Take Confident Action</h3>
                    <p className="text-muted-foreground">Clear recommendations with transparent reasoning—so you understand the "why" behind every insight.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-background rounded-xl p-6 shadow-sm border border-border/50">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Healthcare & Technology Experts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our leadership team combines decades of Nigerian healthcare experience with 
              world-class AI and engineering expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-muted/30 rounded-xl p-6 hover:bg-muted/50 transition-colors">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-background shadow-lg"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Hospital?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join leading Nigerian healthcare facilities already using MedSight Analytics 
            to improve outcomes and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="min-w-[180px]">
                See the Value
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login?signup=true">
              <Button size="lg" variant="outline" className="min-w-[180px] bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src={medsightLogo} 
                alt="MedSight Analytics" 
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="text-lg font-semibold text-foreground">MedSight Analytics</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} MedSight Analytics. HIPAA-Aligned. Compliance-Focused.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
