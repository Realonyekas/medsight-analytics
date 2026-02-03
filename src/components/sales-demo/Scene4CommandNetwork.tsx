import { motion } from 'framer-motion';
import { 
  Radio, Users, AlertTriangle, CheckCircle, Clock, 
  MessageSquare, ArrowRight, Bell, UserCheck, Building2
} from 'lucide-react';
import { DemoHospitalConfig } from '@/lib/demoDataGenerator';
import { useState, useEffect } from 'react';

interface Scene4CommandNetworkProps {
  config: DemoHospitalConfig;
}

interface DemoMessage {
  id: string;
  type: 'emergency' | 'handover' | 'coordination';
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export function Scene4CommandNetwork({ config }: Scene4CommandNetworkProps) {
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(0);
  const [totalToAcknowledge] = useState(Math.min(config.departments.length, 6));

  useEffect(() => {
    const demoMessages: DemoMessage[] = [
      {
        id: 'msg-1',
        type: 'handover',
        from: 'Dr. Adeyemi (Night Shift)',
        to: 'Dr. Okonkwo (Day Shift)',
        content: 'Patient in Bed 12 showing improvement. Continue current medication. Handover complete.',
        timestamp: new Date(),
        status: 'read',
      },
      {
        id: 'msg-2',
        type: 'coordination',
        from: 'Laboratory',
        to: 'Internal Medicine',
        content: 'Critical lab results ready for Patient MRN102847. Elevated markers detected.',
        timestamp: new Date(),
        status: 'delivered',
      },
      {
        id: 'msg-3',
        type: 'coordination',
        from: 'Pharmacy',
        to: 'ICU Ward',
        content: 'Medication prepared for Patient Fatima B. Ready for pickup at dispensary.',
        timestamp: new Date(),
        status: 'sent',
      },
    ];

    // Animate messages appearing one by one
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < demoMessages.length) {
        const msgToAdd = demoMessages[currentIndex];
        setMessages(prev => [...prev, msgToAdd]);
        currentIndex++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowEmergency(true), 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showEmergency) {
      // Simulate departments acknowledging the emergency
      const timer = setInterval(() => {
        setEmergencyAcknowledged(prev => {
          if (prev >= totalToAcknowledge) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [showEmergency, totalToAcknowledge]);

  const getStatusIcon = (status: string) => {
    if (status === 'read') return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === 'delivered') return <CheckCircle className="h-4 w-4 text-primary" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getTypeColor = (type: string) => {
    if (type === 'emergency') return 'destructive';
    if (type === 'handover') return 'primary';
    return 'warning';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 pt-24 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Radio className="h-4 w-4" />
            Command Network Active
          </div>
          <h2 className="text-2xl font-bold text-foreground">Hospital Communication Hub</h2>
          <p className="text-muted-foreground">{config.departments.length} departments connected</p>
        </motion.div>

        {/* Department Network Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-6 rounded-2xl bg-card border border-border"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Connected Departments
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {config.departments.map((dept, index) => (
              <motion.div
                key={dept}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  showEmergency && index < emergencyAcknowledged
                    ? 'bg-success/10 border-success text-success'
                    : 'bg-muted border-border text-muted-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  {showEmergency && index < emergencyAcknowledged && (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{dept}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Communication Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Live Communication Feed
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl bg-${getTypeColor(msg.type)}/5 border border-${getTypeColor(msg.type)}/20`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{msg.from}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowRight className="h-3 w-3" />
                        {msg.to}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(msg.status)}
                      <span className="text-xs text-muted-foreground">{msg.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Task Handover */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Task Handover Status
              </h3>
              <div className="space-y-3">
                {[
                  { from: 'Night Shift', to: 'Morning Shift', progress: 100 },
                  { from: 'Dr. Bello', to: 'Dr. Usman', progress: 75 },
                  { from: 'Ward A', to: 'Ward B', progress: 50 },
                ].map((handover, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.2 }}
                    className="p-3 rounded-xl bg-muted/50"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {handover.from} → {handover.to}
                      </span>
                      <span className={handover.progress === 100 ? 'text-success' : 'text-warning'}>
                        {handover.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${handover.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        className={`h-full ${handover.progress === 100 ? 'bg-success' : 'bg-warning'}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emergency Broadcast Simulation */}
            {showEmergency && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-destructive/10 to-destructive/5 border-2 border-destructive/30"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="p-3 rounded-xl bg-destructive/20"
                  >
                    <Bell className="h-6 w-6 text-destructive" />
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-bold text-destructive mb-1">EMERGENCY BROADCAST</h4>
                    <p className="text-sm text-foreground mb-3">
                      Code Blue - ICU Bed 4. All available personnel respond immediately.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-destructive/20 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(emergencyAcknowledged / totalToAcknowledge) * 100}%` }}
                          className="h-full bg-destructive"
                        />
                      </div>
                      <span className="text-sm font-medium text-destructive">
                        {emergencyAcknowledged}/{totalToAcknowledge} acknowledged
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
