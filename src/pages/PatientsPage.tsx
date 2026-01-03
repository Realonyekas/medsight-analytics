import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle, ChevronRight, User, UserPlus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { usePatients } from '@/hooks/useHospitalData';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Patient } from '@/types';

export default function PatientsPage() {
  const navigate = useNavigate();
  const { hospital } = useAuth();
  const { data: dbPatients, isLoading } = usePatients(hospital?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Transform database patients to UI format
  const patients: Patient[] = dbPatients?.map(p => ({
    id: p.id,
    patientId: p.mrn,
    name: `${p.first_name} ${p.last_name}`,
    age: p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 0,
    gender: (p.gender as 'male' | 'female') || 'male',
    department: '', // Would need department lookup
    admissionDate: p.admission_date || '',
    riskLevel: p.risk_level === 'critical' ? 'high' : p.risk_level,
    riskScore: p.risk_score || 0,
    conditions: p.conditions || [],
    lastVisit: p.updated_at,
    flags: p.ai_flags || [],
  })) || [];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const riskConfig = {
    high: { label: 'High Risk', className: 'risk-badge-high', bgClass: 'bg-risk-high/10', textClass: 'text-risk-high' },
    medium: { label: 'Medium Risk', className: 'risk-badge-medium', bgClass: 'bg-risk-medium/10', textClass: 'text-risk-medium' },
    low: { label: 'Low Risk', className: 'risk-badge-low', bgClass: 'bg-risk-low/10', textClass: 'text-risk-low' },
  };

  const highCount = patients.filter(p => p.riskLevel === 'high').length;
  const mediumCount = patients.filter(p => p.riskLevel === 'medium').length;
  const lowCount = patients.filter(p => p.riskLevel === 'low').length;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header 
          title="Patient Insights" 
          subtitle="Loading patient data..." 
        />
        <div className="p-6 space-y-6">
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Patient Insights" 
        subtitle="AI-powered risk assessment and patient monitoring" 
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setRiskFilter(filter)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    riskFilter === filter
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="metric-card">
            <p className="stat-label">High Risk</p>
            <p className="stat-value text-risk-high">{highCount}</p>
          </div>
          <div className="metric-card">
            <p className="stat-label">Medium Risk</p>
            <p className="stat-value text-risk-medium">{mediumCount}</p>
          </div>
          <div className="metric-card">
            <p className="stat-label">Low Risk</p>
            <p className="stat-value text-risk-low">{lowCount}</p>
          </div>
        </div>

        {/* Patients List */}
        <div className="card-healthcare">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Patient List</h2>
            <span className="text-sm text-muted-foreground">{filteredPatients.length} patients</span>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No patients found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {patients.length === 0 
                  ? "Your hospital doesn't have any patients yet. Patients will appear here once they're added to the system."
                  : "No patients match your search criteria. Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPatients.map((patient) => {
                const config = riskConfig[patient.riskLevel];
                return (
                  <button
                    key={patient.id}
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors text-left"
                  >
                    <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', config.bgClass)}>
                      <User className={cn('h-5 w-5', config.textClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{patient.name}</h4>
                        <span className={config.className}>{config.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.patientId} • {patient.department || 'No department'} • {patient.age} years
                      </p>
                      {patient.flags.length > 0 && (
                        <p className="text-sm text-foreground/80 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                          {patient.flags.length} flag{patient.flags.length > 1 ? 's' : ''} requiring attention
                        </p>
                      )}
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                      <p className={cn('text-lg font-semibold', config.textClass)}>{patient.riskScore}%</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
