import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartDataPoint } from '@/types';

interface TrendChartProps {
  data: ChartDataPoint[];
  title: string;
  subtitle?: string;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  unit?: string;
}

export function TrendChart({ data, title, subtitle, color = 'primary', unit }: TrendChartProps) {
  const colorMap = {
    primary: { stroke: 'hsl(175, 45%, 28%)', fill: 'hsl(175, 45%, 28%)' },
    success: { stroke: 'hsl(152, 55%, 40%)', fill: 'hsl(152, 55%, 40%)' },
    warning: { stroke: 'hsl(38, 92%, 50%)', fill: 'hsl(38, 92%, 50%)' },
    destructive: { stroke: 'hsl(8, 75%, 56%)', fill: 'hsl(8, 75%, 56%)' },
  };

  const chartColor = colorMap[color];

  return (
    <div className="card-healthcare">
      <div className="mb-4">
        <h3 className="section-title">{title}</h3>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor.fill} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartColor.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 20%, 88%)" vertical={false} />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(210, 12%, 45%)' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(210, 12%, 45%)' }}
              tickFormatter={(value) => unit ? `${value}${unit}` : value}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 100%)', 
                border: '1px solid hsl(210, 20%, 88%)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
              labelStyle={{ color: 'hsl(210, 25%, 15%)', fontWeight: 500 }}
              formatter={(value: number) => [unit ? `${value}${unit}` : value, title]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
