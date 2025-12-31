import { useState } from 'react';
import { Search, Filter, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { mockPatients } from '@/data/mockData';
import { Patient } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = mockPatients.filter(patient => {
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
            <p className="stat-value text-risk-high">{mockPatients.filter(p => p.riskLevel === 'high').length}</p>
          </div>
          <div className="metric-card">
            <p className="stat-label">Medium Risk</p>
            <p className="stat-value text-risk-medium">{mockPatients.filter(p => p.riskLevel === 'medium').length}</p>
          </div>
          <div className="metric-card">
            <p className="stat-label">Low Risk</p>
            <p className="stat-value text-risk-low">{mockPatients.filter(p => p.riskLevel === 'low').length}</p>
          </div>
        </div>

        {/* Patients List */}
        <div className="card-healthcare">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Patient List</h2>
            <span className="text-sm text-muted-foreground">{filteredPatients.length} patients</span>
          </div>
          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const config = riskConfig[patient.riskLevel];
              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
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
                      {patient.patientId} • {patient.department} • {patient.age} years
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
        </div>
      </div>

      {/* Patient Detail Modal */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    riskConfig[selectedPatient.riskLevel].bgClass
                  )}>
                    <User className={cn('h-5 w-5', riskConfig[selectedPatient.riskLevel].textClass)} />
                  </div>
                  <div>
                    <span className="text-xl">{selectedPatient.name}</span>
                    <span className={cn('ml-3', riskConfig[selectedPatient.riskLevel].className)}>
                      {riskConfig[selectedPatient.riskLevel].label}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Patient Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient ID</p>
                    <p className="font-medium">{selectedPatient.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedPatient.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age / Gender</p>
                    <p className="font-medium">{selectedPatient.age} years / {selectedPatient.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <p className={cn('font-semibold text-lg', riskConfig[selectedPatient.riskLevel].textClass)}>
                      {selectedPatient.riskScore}%
                    </p>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Conditions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.conditions.map((condition, i) => (
                      <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                {selectedPatient.flags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">AI-Generated Flags</p>
                    <div className="space-y-3">
                      {selectedPatient.flags.map((flag) => (
                        <div key={flag.id} className="p-4 rounded-lg border border-border bg-accent/30">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className={cn(
                              'h-4 w-4',
                              flag.severity === 'high' && 'text-risk-high',
                              flag.severity === 'medium' && 'text-risk-medium',
                              flag.severity === 'low' && 'text-risk-low'
                            )} />
                            <h5 className="font-medium text-foreground">{flag.title}</h5>
                            <span className={riskConfig[flag.severity].className}>{flag.severity}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{flag.description}</p>
                          <div className="p-3 bg-background rounded-lg border border-border">
                            <p className="text-xs font-medium text-accent-foreground mb-1">Recommended Action</p>
                            <p className="text-sm text-foreground">{flag.recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> These insights are AI-generated for decision support only. 
                    All clinical decisions should be made by qualified healthcare professionals.
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedPatient(null)}>Close</Button>
                  <Button>Schedule Follow-up</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
