import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, description }: Props) {
  return (
    <Card className="glow-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          {trend !== undefined && (
            <span className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </CardContent>
    </Card>
  );
}
