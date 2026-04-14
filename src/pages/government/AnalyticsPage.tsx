import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { StatsCard } from '@/components/stats/StatsCard';
import { IssuanceLineChart } from '@/components/charts/LineChart';
import { IssuanceBarChart } from '@/components/charts/BarChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import * as dashboardService from '@/services/dashboardService';
import type { DashboardStats } from '@/types';
import { BarChart3, TrendingUp, Users, Shield } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboardStats('government').then(s => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <StatsGrid>
        <StatsCard title="Total Credentials" value={stats.totalCredentials} icon={BarChart3} trend={12} />
        <StatsCard title="Monthly Growth" value="18%" icon={TrendingUp} trend={3} />
        <StatsCard title="Active Students" value={stats.totalStudents} icon={Users} trend={8} />
        <StatsCard title="Avg Verification Time" value={`${stats.avgVerificationTime}s`} icon={Shield} />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="text-sm">Credential Issuance Trend (12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <IssuanceLineChart />
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="text-sm">Monthly Issuance (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <IssuanceBarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
