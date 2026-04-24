import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/stats/StatsCard';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { CredentialTable } from '@/components/credentials/CredentialTable';
import { CredentialModal } from '@/components/credentials/CredentialModal';
import { IssuanceBarChart } from '@/components/charts/BarChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import * as credentialService from '@/services/credentialService';
import * as dashboardService from '@/services/dashboardService';
import type { Credential, DashboardStats } from '@/types';
import { FileText, Users, Clock, XCircle, Plus } from 'lucide-react';

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Credential | null>(null);

  useEffect(() => {
    if (user?.institutionId) {
      Promise.all([
        credentialService.getCredentialsByInstitution(user.institutionId),
        dashboardService.getDashboardStats('institution', user?.id),
      ]).then(([credsResponse, s]) => {
        setCredentials(credsResponse.data || []); // Extract data array from response
        setStats(s);
        setLoading(false);
      }).catch(error => {
        console.error('Failed to fetch dashboard data:', error);
        setCredentials([]);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Institution Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user?.institution || 'Machakos University'}</p>
        </div>
        <Button onClick={() => navigate('/institution/issue')} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" /> Issue Credential
        </Button>
      </div>

      <StatsGrid>
        <StatsCard title="Total Credentials" value={stats?.totalCredentials || 0} icon={FileText} trend={12} />
        <StatsCard title="Total Students" value={stats?.totalStudents || 0} icon={Users} trend={8} />
        <StatsCard title="Pending Issuances" value={credentials.filter(c => c.status === 'pending').length} icon={Clock} />
        <StatsCard title="Revocations" value={credentials.filter(c => c.status === 'revoked').length} icon={XCircle} />
      </StatsGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Credentials Issued Per Month</CardTitle></CardHeader>
          <CardContent><IssuanceBarChart /></CardContent>
        </Card>
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Recent Credentials</CardTitle></CardHeader>
          <CardContent>
            <CredentialTable credentials={credentials.slice(0, 5)} onRowClick={setSelected} />
          </CardContent>
        </Card>
      </div>

      <CredentialModal credential={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
