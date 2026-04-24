import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/stats/StatsCard';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { IssuanceLineChart } from '@/components/charts/LineChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as dashboardService from '@/services/dashboardService';
import * as institutionService from '@/services/institutionService';
import type { DashboardStats, Institution } from '@/types';
import { Building2, FileText, Search, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function GovDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getDashboardStats('government'),
      institutionService.getInstitutions(),
    ]).then(([s, instResponse]) => {
      setStats(s);
      setInstitutions(instResponse.data || []); // Extract data array from response
      setLoading(false);
    }).catch(error => {
      console.error('Failed to fetch dashboard data:', error);
      setStats({
        totalCredentials: 0,
        totalInstitutions: 0,
        totalStudents: 0,
        totalVerifications: 0,
        fraudPrevented: 0,
        avgVerificationTime: 0,
      });
      setInstitutions([]);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Government Dashboard</h1>

      <StatsGrid>
        <StatsCard title="Total Institutions" value={stats?.totalInstitutions || 0} icon={Building2} />
        <StatsCard title="Total Credentials" value={stats?.totalCredentials || 0} icon={FileText} trend={15} />
        <StatsCard title="Total Verifications" value={stats?.totalVerifications || 0} icon={Search} trend={22} />
        <StatsCard title="Fraud Prevented" value={stats?.fraudPrevented || 0} icon={ShieldAlert} />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Monthly Issuance Trend</CardTitle></CardHeader>
          <CardContent><IssuanceLineChart /></CardContent>
        </Card>

        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Recent Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { msg: 'Invalid credential hash submitted for verification', time: '2 hours ago', type: 'warning' },
              { msg: 'Credential revoked: David Kimani — Certificate in Data Science', time: '5 hours ago', type: 'info' },
              { msg: 'Suspicious bulk verification attempt detected', time: '1 day ago', type: 'warning' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">{alert.msg}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glow-card">
        <CardHeader><CardTitle className="text-sm">Registered Institutions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Accreditation</TableHead>
                <TableHead>Total Issued</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(institutions || []).map(inst => (
                <TableRow key={inst.id}>
                  <TableCell className="font-medium">{inst.name}</TableCell>
                  <TableCell>{inst.country}</TableCell>
                  <TableCell className="font-mono text-xs">{inst.accreditationId}</TableCell>
                  <TableCell>{inst.totalIssued}</TableCell>
                  <TableCell>{inst.joinedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
