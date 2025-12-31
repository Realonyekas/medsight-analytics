import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Activity } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockTrendData, mockCostTrendData, mockDashboardMetrics, mockOperationalMetrics } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const departmentData = [
  { name: 'Cardiology', patients: 45, cost: 12.5 },
  { name: 'Oncology', patients: 32, cost: 18.2 },
  { name: 'Emergency', patients: 78, cost: 8.4 },
  { name: 'Orthopedics', patients: 28, cost: 15.1 },
  { name: 'Pediatrics', patients: 52, cost: 6.8 },
];

const riskDistribution = [
  { name: 'High Risk', value: 12, color: 'hsl(8, 75%, 56%)' },
  { name: 'Medium Risk', value: 28, color: 'hsl(38, 92%, 50%)' },
  { name: 'Low Risk', value: 60, color: 'hsl(152, 55%, 40%)' },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const isOperations = user?.role === 'operations';
  const metrics = isOperations ? mockOperationalMetrics : mockDashboardMetrics;

  const metricIcons = [
    <Users className="h-5 w-5" />,
    <Activity className="h-5 w-5" />,
    <Clock className="h-5 w-5" />,
    <DollarSign className="h-5 w-5" />,
  ];

  return (
    <div className="min-h-screen">
      <Header 
        title="Analytics" 
        subtitle="Comprehensive performance insights and trend analysis" 
      />

      <div className="p-6 space-y-6">
        {/* Time Range Filter */}
        <div className="flex items-center justify-between">
          <h2 className="section-title flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Overview
          </h2>
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  timeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} icon={metricIcons[index]} />
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChart 
            data={mockTrendData} 
            title={isOperations ? "Weekly Task Completion" : "Patient Risk Trends"}
            subtitle="Last 6 months"
            color={isOperations ? "success" : "destructive"}
          />
          <TrendChart 
            data={mockCostTrendData} 
            title={isOperations ? "Efficiency Score" : "Cost per Patient (₦K)"}
            subtitle="Last 6 months"
            color="primary"
          />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance */}
          <div className="lg:col-span-2 card-healthcare">
            <div className="mb-4">
              <h3 className="section-title">Department Performance</h3>
              <p className="section-subtitle">Patient volume and cost analysis by department</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 88%)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(210, 12%, 45%)' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'hsl(210, 12%, 45%)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(210, 20%, 88%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="patients" fill="hsl(175, 45%, 28%)" radius={[4, 4, 0, 0]} name="Patients" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="card-healthcare">
            <div className="mb-4">
              <h3 className="section-title">Risk Distribution</h3>
              <p className="section-subtitle">Current patient risk levels</p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)', 
                      border: '1px solid hsl(210, 20%, 88%)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Benchmarks */}
        <div className="card-healthcare">
          <div className="mb-4">
            <h3 className="section-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Internal Benchmarks
            </h3>
            <p className="section-subtitle">How you compare to your own historical performance</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Readmission Rate</p>
              <p className="text-2xl font-bold text-foreground">8.2%</p>
              <p className="text-xs text-success mt-1">↓ 2.1% vs last quarter</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-foreground">24 min</p>
              <p className="text-xs text-success mt-1">↓ 8 min vs last quarter</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
              <p className="text-2xl font-bold text-foreground">4.2/5</p>
              <p className="text-xs text-success mt-1">↑ 0.3 vs last quarter</p>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Cost Efficiency</p>
              <p className="text-2xl font-bold text-foreground">₦36.8K</p>
              <p className="text-xs text-success mt-1">↓ ₦5.7K vs last quarter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
