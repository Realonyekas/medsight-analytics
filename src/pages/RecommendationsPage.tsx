import { useState } from 'react';
import { Lightbulb, AlertCircle, TrendingUp, Zap, Filter, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { mockInsights } from '@/data/mockData';
import { Insight } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function RecommendationsPage() {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'clinical' | 'operational' | 'financial'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const allInsights: Insight[] = [
    ...mockInsights,
    {
      id: 'ins-005',
      type: 'recommendation',
      title: 'Staffing Optimization',
      description: 'Night shift staffing in Emergency exceeds patient demand by 20%. Redistributing 2 nurses to day shift could improve response times during peak hours.',
      action: 'Review staffing schedule',
      priority: 'medium',
      category: 'operational',
      createdAt: '2024-12-27',
    },
    {
      id: 'ins-006',
      type: 'alert',
      title: 'Medication Stock Alert',
      description: 'Current insulin stock will deplete in 5 days based on usage patterns. Order placement recommended within 48 hours.',
      action: 'Place pharmacy order',
      priority: 'high',
      category: 'operational',
      createdAt: '2024-12-30',
    },
    {
      id: 'ins-007',
      type: 'efficiency',
      title: 'Discharge Process Improvement',
      description: 'Average discharge time has reduced to 2.3 hours following new protocol implementation. Continue current approach.',
      priority: 'low',
      category: 'operational',
      createdAt: '2024-12-28',
    },
  ];

  const filteredInsights = allInsights.filter(insight => {
    const matchesCategory = categoryFilter === 'all' || insight.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || insight.priority === priorityFilter;
    return matchesCategory && matchesPriority;
  });

  const categoryConfig = {
    clinical: { icon: AlertCircle, label: 'Clinical' },
    operational: { icon: Zap, label: 'Operational' },
    financial: { icon: TrendingUp, label: 'Financial' },
  };

  const stats = {
    total: allInsights.length,
    high: allInsights.filter(i => i.priority === 'high').length,
    actionable: allInsights.filter(i => i.action).length,
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Recommendations" 
        subtitle="AI-generated insights and actionable recommendations" 
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="metric-card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="stat-value">{stats.total}</p>
              <p className="stat-label">Total Insights</p>
            </div>
          </div>
          <div className="metric-card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="stat-value">{stats.high}</p>
              <p className="stat-label">High Priority</p>
            </div>
          </div>
          <div className="metric-card flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="stat-value">{stats.actionable}</p>
              <p className="stat-label">Actionable</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Category:</span>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(['all', 'clinical', 'operational', 'financial'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCategoryFilter(filter)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    categoryFilter === filter
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Priority:</span>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(['all', 'high', 'medium', 'low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriorityFilter(filter)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    priorityFilter === filter
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {filteredInsights.length > 0 ? (
            filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="card-healthcare text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">No insights match your filters</p>
              <p className="text-muted-foreground text-sm mt-1">Try adjusting your filter criteria</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> These recommendations are generated by AI analysis of your hospital's data patterns. 
            They are intended to support decision-making, not replace professional judgment. 
            All clinical decisions should be validated by qualified healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
}
