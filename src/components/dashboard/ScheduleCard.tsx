import { Calendar, Clock, User, Stethoscope, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ScheduleEntry {
  id: string;
  staffName: string;
  role: 'doctor' | 'nurse' | 'specialist';
  department: string;
  appointmentType: string;
  patientName: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface ScheduleCardProps {
  entries: ScheduleEntry[];
  className?: string;
}

const roleIcons = {
  doctor: <Stethoscope className="h-4 w-4" />,
  nurse: <UserCheck className="h-4 w-4" />,
  specialist: <User className="h-4 w-4" />,
};

const roleColors = {
  doctor: 'bg-primary/10 text-primary border-primary/20',
  nurse: 'bg-success/10 text-success border-success/20',
  specialist: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const statusColors = {
  scheduled: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  completed: 'bg-success/10 text-success border-success/20',
};

const roleLabels = {
  doctor: 'Doctor',
  nurse: 'Senior Nurse',
  specialist: 'Specialist',
};

export function ScheduleCard({ entries, className }: ScheduleCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary/5 to-transparent border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Staff Schedule</h2>
            <p className="text-sm text-muted-foreground">Today's appointments & rounds</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Live Schedule
        </Badge>
      </div>
      
      <div className="divide-y divide-border">
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className="p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Staff Info */}
              <div className="flex items-start gap-3 flex-1">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                  roleColors[entry.role].split(' ')[0]
                )}>
                  {roleIcons[entry.role]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-foreground text-base">{entry.staffName}</h3>
                    <Badge variant="outline" className={cn("text-xs", roleColors[entry.role])}>
                      {roleLabels[entry.role]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{entry.department}</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="flex flex-col sm:items-end gap-1 sm:text-right">
                <p className="font-bold text-foreground text-sm uppercase tracking-wide">
                  {entry.appointmentType}
                </p>
                <p className="text-sm text-muted-foreground">
                  Patient: <span className="font-medium text-foreground">{entry.patientName}</span>
                </p>
              </div>

              {/* Time & Status */}
              <div className="flex items-center gap-3 sm:min-w-[160px] justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{entry.time}</span>
                  <span className="text-muted-foreground">({entry.duration})</span>
                </div>
                <Badge variant="outline" className={cn("text-xs capitalize", statusColors[entry.status])}>
                  {entry.status === 'in-progress' ? 'In Progress' : entry.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sample schedule data for demo
export const mockScheduleData: ScheduleEntry[] = [
  {
    id: '1',
    staffName: 'Dr. Adebayo Okonkwo',
    role: 'doctor',
    department: 'Cardiology',
    appointmentType: 'CARDIAC CONSULTATION',
    patientName: 'Chinedu Nwankwo',
    time: '09:00',
    duration: '45min',
    status: 'completed',
  },
  {
    id: '2',
    staffName: 'Sr. Nurse Amara Eze',
    role: 'nurse',
    department: 'ICU',
    appointmentType: 'PATIENT ROUNDS',
    patientName: 'Multiple Patients',
    time: '10:30',
    duration: '2hrs',
    status: 'in-progress',
  },
  {
    id: '3',
    staffName: 'Dr. Funke Adeyemi',
    role: 'specialist',
    department: 'Oncology',
    appointmentType: 'CHEMOTHERAPY REVIEW',
    patientName: 'Oluwaseun Bakare',
    time: '13:00',
    duration: '1hr',
    status: 'scheduled',
  },
  {
    id: '4',
    staffName: 'Dr. Ibrahim Musa',
    role: 'doctor',
    department: 'Orthopedics',
    appointmentType: 'POST-OP FOLLOW-UP',
    patientName: 'Aisha Mohammed',
    time: '14:30',
    duration: '30min',
    status: 'scheduled',
  },
  {
    id: '5',
    staffName: 'Sr. Nurse Blessing Okoro',
    role: 'nurse',
    department: 'Pediatrics',
    appointmentType: 'VACCINATION CLINIC',
    patientName: 'Multiple Children',
    time: '15:00',
    duration: '3hrs',
    status: 'scheduled',
  },
  {
    id: '6',
    staffName: 'Dr. Ngozi Okafor',
    role: 'specialist',
    department: 'Neurology',
    appointmentType: 'EEG ASSESSMENT',
    patientName: 'Tunde Adeleke',
    time: '16:00',
    duration: '1hr',
    status: 'scheduled',
  },
];
