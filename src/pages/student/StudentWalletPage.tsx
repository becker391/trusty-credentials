import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CredentialCard } from '@/components/credentials/CredentialCard';
import { CredentialModal } from '@/components/credentials/CredentialModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as credentialService from '@/services/credentialService';
import type { Credential } from '@/types';

export default function StudentWalletPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Credential | null>(null);
  const [filter, setFilter] = useState('all');

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

  const filtered = filter === 'all' ? credentials : (credentials || []).filter(c => c.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="revoked">Revoked</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {(filtered || []).length === 0 ? <EmptyState /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filtered || []).map(cred => (
            <CredentialCard key={cred.id} credential={cred} onClick={() => setSelected(cred)} />
          ))}
        </div>
      )}

      <CredentialModal credential={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
