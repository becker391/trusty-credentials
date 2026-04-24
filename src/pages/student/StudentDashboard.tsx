import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/stats/StatsCard';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { CredentialCard } from '@/components/credentials/CredentialCard';
import { CredentialModal } from '@/components/credentials/CredentialModal';
import { WalletAddress } from '@/components/ui/WalletAddress';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as credentialService from '@/services/credentialService';
import type { Credential } from '@/types';
import { FileText, CheckCircle2, Share2, Activity } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Credential | null>(null);

  useEffect(() => {
    if (user?.id) {
      credentialService.getCredentialsByStudent(user.id)
        .then(response => {
          setCredentials(response.data || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch student credentials:', error);
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-sm text-muted-foreground">Your Digital Credential Wallet</p>
        </div>
        {user && <WalletAddress address={user.walletAddress} />}
      </div>

      <StatsGrid>
        <StatsCard title="Total Credentials" value={credentials.length} icon={FileText} />
        <StatsCard title="Active" value={credentials.filter(c => c.status === 'active').length} icon={CheckCircle2} />
        <StatsCard title="Shared" value={3} icon={Share2} />
        <StatsCard title="Verifications" value={5} icon={Activity} />
      </StatsGrid>

      <Card className="glow-card">
        <CardHeader><CardTitle className="text-sm">My Credentials</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map(cred => (
              <CredentialCard key={cred.id} credential={cred} onClick={() => setSelected(cred)} />
            ))}
          </div>
        </CardContent>
      </Card>

      <CredentialModal credential={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
