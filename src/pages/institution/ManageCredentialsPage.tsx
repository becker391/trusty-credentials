import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CredentialTable } from '@/components/credentials/CredentialTable';
import { CredentialModal } from '@/components/credentials/CredentialModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import * as credentialService from '@/services/credentialService';
import type { Credential } from '@/types';
import { toast } from 'sonner';
import { Search, Download, XCircle } from 'lucide-react';

export default function ManageCredentialsPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filtered, setFiltered] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Credential | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<Credential | null>(null);

  useEffect(() => {
    credentialService.getCredentialsByInstitution(user?.institution === 'Machakos University' ? 'inst-1' : 'inst-2')
      .then(creds => { setCredentials(creds); setFiltered(creds); setLoading(false); });
  }, [user]);

  useEffect(() => {
    let result = credentials;
    if (statusFilter !== 'all') result = result.filter(c => c.status === statusFilter);
    if (search) result = result.filter(c => c.studentName.toLowerCase().includes(search.toLowerCase()) || c.course.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, statusFilter, credentials]);

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    try {
      await credentialService.revokeCredential(revokeTarget.id, 'Revoked by admin');
      setCredentials(prev => prev.map(c => c.id === revokeTarget.id ? { ...c, status: 'revoked' as const } : c));
      toast.success('Credential revoked');
    } catch { toast.error('Failed to revoke'); }
    setRevokeTarget(null);
  };

  const exportCsv = () => {
    const csv = ['Student,Course,Type,Grade,Date,Status,Hash', ...filtered.map(c => `${c.studentName},${c.course},${c.certificateType},${c.grade},${c.issueDate},${c.status},${c.credentialHash}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'credentials.csv'; a.click();
    toast.success('CSV exported');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Credentials</h1>
        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by student or course..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? <EmptyState /> : (
        <CredentialTable
          credentials={filtered}
          onRowClick={setSelected}
          actionRenderer={(cred) => cred.status === 'active' ? (
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRevokeTarget(cred)}>
              <XCircle className="h-4 w-4 mr-1" /> Revoke
            </Button>
          ) : null}
        />
      )}

      <CredentialModal credential={selected} open={!!selected} onClose={() => setSelected(null)} />
      <ConfirmModal open={!!revokeTarget} title="Revoke Credential" description={`Are you sure you want to revoke the credential for ${revokeTarget?.studentName}?`} onConfirm={handleRevoke} onCancel={() => setRevokeTarget(null)} />
    </div>
  );
}
