import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  {
    id: 'monthly-summary',
    title: 'Monthly Performance Summary',
    description: 'Comprehensive overview of key metrics, trends, and recommendations',
    icon: FileText,
    lastGenerated: '2024-12-28',
  },
  {
    id: 'patient-outcomes',
    title: 'Patient Outcomes Report',
    description: 'Readmission rates, risk flags, and clinical outcomes analysis',
    icon: Users,
    lastGenerated: '2024-12-25',
  },
  {
    id: 'cost-analysis',
    title: 'Cost Efficiency Report',
    description: 'Department-wise cost breakdown and optimization opportunities',
    icon: DollarSign,
    lastGenerated: '2024-12-20',
  },
  {
    id: 'operational',
    title: 'Operational Efficiency Report',
    description: 'Admin workload, task completion, and process efficiency metrics',
    icon: Clock,
    lastGenerated: '2024-12-22',
  },
];

const monthlySnapshots = [
  { month: 'December 2024', status: 'available', highlight: 'Readmission rate improved by 15%' },
  { month: 'November 2024', status: 'available', highlight: 'Cost per patient reduced by 8%' },
  { month: 'October 2024', status: 'available', highlight: 'New AI recommendations launched' },
  { month: 'September 2024', status: 'available', highlight: 'Baseline metrics established' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Report Download Started",
      description: `${reportTitle} is being prepared for download.`,
    });
    // Simulate download
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report has been downloaded successfully.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Reports" 
        subtitle="Performance reports and downloadable summaries" 
      />

      <div className="p-6 space-y-6">
        {/* Key Performance Indicators */}
        <section className="card-healthcare">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Tracking
              </h2>
              <p className="section-subtitle">Key indicators for December 2024</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => handleDownload('Performance Summary')}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Admin Workload Reduction</p>
              <p className="text-3xl font-bold text-foreground mt-1">23%</p>
              <p className="text-xs text-success mt-2">↑ 5% from last month</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Readmission Prevention</p>
              <p className="text-3xl font-bold text-foreground mt-1">18</p>
              <p className="text-xs text-muted-foreground mt-2">Patients flagged early</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Cost Savings Identified</p>
              <p className="text-3xl font-bold text-foreground mt-1">₦4.2M</p>
              <p className="text-xs text-success mt-2">From optimization insights</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Insights Generated</p>
              <p className="text-3xl font-bold text-foreground mt-1">156</p>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </div>
          </div>
        </section>

        {/* Report Types */}
        <section>
          <h2 className="section-title mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTypes.map((report) => (
              <div 
                key={report.id} 
                className={cn(
                  'card-healthcare cursor-pointer transition-all',
                  selectedReport === report.id && 'ring-2 ring-primary'
                )}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                    <report.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Last generated: {report.lastGenerated}</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(report.title);
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Monthly Snapshots */}
        <section className="card-healthcare">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="section-title">Monthly Snapshots</h2>
              <p className="section-subtitle">Historical performance summaries</p>
            </div>
          </div>
          <div className="space-y-3">
            {monthlySnapshots.map((snapshot, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{snapshot.month}</p>
                    <p className="text-sm text-muted-foreground">{snapshot.highlight}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownload(`${snapshot.month} Report`)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Report Request */}
        <section className="card-healthcare bg-accent/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground">Need a Custom Report?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise plan subscribers can request custom analytics reports tailored to specific needs.
              </p>
            </div>
            <Button>Request Custom Report</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
