import { motion } from 'framer-motion';
import { 
  User, FileText, Stethoscope, FlaskConical, Pill, 
  CheckCircle, Clock, AlertTriangle, LogOut, ChevronRight,
  Brain, Shield
} from 'lucide-react';
import { DemoPatient, DemoPatientEvent } from '@/lib/demoDataGenerator';
import { useState, useEffect } from 'react';

interface Scene2PatientStoryProps {
  patient: DemoPatient;
}

export function Scene2PatientStory({ patient }: Scene2PatientStoryProps) {
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [showAIInsight, setShowAIInsight] = useState(false);

  useEffect(() => {
    // Animate timeline events appearing one by one
    const eventTimer = setInterval(() => {
      setVisibleEvents(prev => {
        if (prev >= patient.timeline.length) {
          clearInterval(eventTimer);
          setTimeout(() => setShowAIInsight(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(eventTimer);
  }, [patient.timeline.length]);

  const getEventIcon = (type: DemoPatientEvent['type']) => {
    const icons = {
      registration: <FileText className="h-5 w-5" />,
      triage: <Stethoscope className="h-5 w-5" />,
      consultation: <User className="h-5 w-5" />,
      lab: <FlaskConical className="h-5 w-5" />,
      pharmacy: <Pill className="h-5 w-5" />,
      imaging: <Brain className="h-5 w-5" />,
      discharge: <LogOut className="h-5 w-5" />,
    };
    return icons[type] || <FileText className="h-5 w-5" />;
  };

  const getStatusIcon = (status: DemoPatientEvent['status']) => {
    if (status === 'completed') return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === 'in-progress') return <Clock className="h-4 w-4 text-warning animate-pulse" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getRiskColor = (level: string) => {
    if (level === 'critical') return 'bg-destructive text-destructive-foreground';
    if (level === 'high') return 'bg-destructive/80 text-white';
    if (level === 'medium') return 'bg-warning text-warning-foreground';
    return 'bg-success/80 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 pt-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Patient Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{patient.name}</h2>
                <p className="text-muted-foreground">
                  {patient.age} years • {patient.gender} • MRN: {patient.mrn}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className={`px-4 py-2 rounded-xl font-semibold ${getRiskColor(patient.riskLevel)}`}>
                Risk Score: {patient.riskScore}
              </div>
              <div className="px-4 py-2 rounded-xl bg-muted text-muted-foreground">
                {patient.department}
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Primary Diagnosis</p>
            <p className="font-semibold text-foreground">{patient.diagnosis}</p>
          </div>
        </motion.div>

        {/* Patient Journey Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-primary" />
            Patient Journey
          </h3>

          {/* Timeline */}
          <div className="relative pl-8 md:pl-0">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {patient.timeline.map((event, index) => {
              const isVisible = index < visibleEvents;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`relative mb-6 md:w-1/2 ${
                    isLeft ? 'md:pr-8 md:text-right' : 'md:ml-auto md:pl-8'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute top-2 ${
                    isLeft ? 'left-0 md:left-auto md:-right-4' : 'left-0 md:-left-4'
                  } w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center z-10`}>
                    {getEventIcon(event.type)}
                  </div>

                  {/* Event Card */}
                  <div className={`ml-12 md:ml-0 p-4 rounded-xl bg-card border border-border ${
                    event.alert ? 'ring-2 ring-warning/30' : ''
                  }`}>
                    <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      {getStatusIcon(event.status)}
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {event.status}
                      </span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{event.department}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </p>

                    {/* Alert Badge */}
                    {event.alert && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3 p-2 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
                        <span className="text-xs text-warning font-medium">{event.alert}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Insight Panel */}
        {showAIInsight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-success/10 border-2 border-primary/30"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-xl bg-primary/20"
              >
                <Brain className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  AI Risk Analysis
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">Live</span>
                </h4>
                <p className="text-muted-foreground mb-4">
                  Based on patient history, lab results, and similar cases, this patient has a 
                  <span className="font-bold text-destructive"> {patient.riskScore}% risk</span> of 
                  complications within 72 hours. Early intervention recommended.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-background/50">
                    <Shield className="h-5 w-5 text-success mb-2" />
                    <p className="text-sm font-medium text-foreground">Cross-Department Access</p>
                    <p className="text-xs text-muted-foreground">All departments see the same data</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50">
                    <AlertTriangle className="h-5 w-5 text-warning mb-2" />
                    <p className="text-sm font-medium text-foreground">Error Prevention</p>
                    <p className="text-xs text-muted-foreground">Drug interaction alerts active</p>
                  </div>
                  <div className="p-3 rounded-xl bg-background/50">
                    <Brain className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">Predictive Care</p>
                    <p className="text-xs text-muted-foreground">Proactive intervention enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
