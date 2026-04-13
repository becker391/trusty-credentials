import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/stats/StatsCard';
import { StatsGrid } from '@/components/stats/StatsGrid';
import { VerifyInput } from '@/components/verification/VerifyInput';
import { VerificationResult } from '@/components/verification/VerificationResult';
import { StatusBadge } from '@/components/credentials/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as verificationService from '@/services/verificationService';
import * as credentialService from '@/services/credentialService';
import type { VerificationRequest, Credential } from '@/types';
import { Search, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifierDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; credential?: Credential; message: string } | null>(null);

  useEffect(() => {
    verificationService.getVerificationRequests(user?.id).then(r => {
      setRequests(r);
      setLoading(false);
    });
  }, [user]);

  const handleVerify = async (hash: string) => {
    setVerifying(true);
    setResult(null);
    try {
      const res = await credentialService.verifyCredentialByHash(hash);
      setResult(res);
      toast(res.valid ? 'Credential verified!' : 'Verification failed');
    } catch { toast.error('Verification error'); }
    finally { setVerifying(false); }
  };

  if (loading) return <LoadingSpinner />;

  const valid = requests.filter(r => r.result === 'valid').length;
  const invalid = requests.filter(r => r.result === 'invalid').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Verifier Dashboard</h1>

      <Card className="glow-card">
        <CardHeader><CardTitle className="text-sm">Quick Verify</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <VerifyInput onVerify={handleVerify} loading={verifying} />
          {result && <VerificationResult {...result} />}
        </CardContent>
      </Card>

      <StatsGrid>
        <StatsCard title="Total Verifications" value={requests.length} icon={Search} />
        <StatsCard title="Valid" value={valid} icon={CheckCircle2} />
        <StatsCard title="Invalid" value={invalid} icon={XCircle} />
        <StatsCard title="Avg Response Time" value="1.2s" icon={Clock} />
      </StatsGrid>

      <Card className="glow-card">
        <CardHeader><CardTitle className="text-sm">Recent Verifications</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Credential ID</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Response Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{r.requestDate}</TableCell>
                  <TableCell className="font-mono text-xs">{r.credentialId || 'N/A'}</TableCell>
                  <TableCell><StatusBadge status={r.result} /></TableCell>
                  <TableCell>{r.responseTime ? `${r.responseTime.toFixed(1)}s` : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
