import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import * as dashboardService from '@/services/dashboardService';
import * as mockApi from '@/api/mockApi';
import type { DashboardStats } from '@/types';
import { BarChart3, TrendingUp, Users, Shield } from 'lucide-react';

const monthlyData = [
  { month: 'May', credentials: 32, verifications: 45 },
  { month: 'Jun', credentials: 41, verifications: 52 },
  { month: 'Jul', credentials: 28, verifications: 38 },
  { month: 'Aug', credentials: 55, verifications: 67 },
  { month: 'Sep', credentials: 38, verifications: 50 },
  { month: 'Oct', credentials: 47, verifications: 59 },
  { month: 'Nov', credentials: 62, verifications: 78 },
  { month: 'Dec', credentials: 51, verifications: 65 },
  { month: 'Jan', credentials: 69, verifications: 82 },
  { month: 'Feb', credentials: 74, verifications: 90 },
  { month: 'Mar', credentials: 58, verifications: 71 },
  { month: 'Apr', credentials: 66, verifications: 85 },
];

const regionData = [
  { name: 'Nairobi', value: 312 },
  { name: 'Central', value: 156 },
  { name: 'Coast', value: 98 },
  { name: 'Western', value: 67 },
  { name: 'Rift Valley', value: 45 },
];

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

      <StatsGrid stats={[
        { label: 'Total Credentials', value: stats.totalCredentials, icon: BarChart3, trend: '+12%' },
        { label: 'Monthly Growth', value: '18%', icon: TrendingUp, trend: '+3%' },
        { label: 'Active Students', value: stats.totalStudents, icon: Users, trend: '+8%' },
        { label: 'Avg Verification Time', value: `${stats.avgVerificationTime}s`, icon: Shield },
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="text-sm">Credentials vs Verifications (12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={monthlyData} xKey="month" yKey="credentials" secondYKey="verifications" />
          </CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader>
            <CardTitle className="text-sm">Credentials by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={regionData} xKey="name" yKey="value" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
