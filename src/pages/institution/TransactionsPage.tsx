import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/credentials/StatusBadge';
import { TxHashLink } from '@/components/blockchain/TxHashLink';
import { NetworkBadge } from '@/components/blockchain/NetworkBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as mockApi from '@/api/mockApi';
import type { Transaction } from '@/types';
import { Activity, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

const typeIcons: Record<string, typeof ArrowUpRight> = {
  issue: ArrowUpRight,
  revoke: ArrowDownRight,
  verify: Search,
};

const typeLabels: Record<string, string> = {
  issue: 'Issued',
  revoke: 'Revoked',
  verify: 'Verified',
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    mockApi.mockGetTransactions().then(txns => {
      setTransactions(txns);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="issue">Issues</TabsTrigger>
          <TabsTrigger value="revoke">Revocations</TabsTrigger>
          <TabsTrigger value="verify">Verifications</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState title="No transactions" message="No transactions found for this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map(tx => {
            const Icon = typeIcons[tx.type] || Activity;
            return (
              <Card key={tx.id} className="glow-card">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'issue' ? 'bg-success/10' : tx.type === 'revoke' ? 'bg-destructive/10' : 'bg-accent/10'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        tx.type === 'issue' ? 'text-success' : tx.type === 'revoke' ? 'text-destructive' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{typeLabels[tx.type]}</p>
                      <TxHashLink txHash={tx.txHash} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <NetworkBadge network={tx.network} />
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Block #{tx.blockNumber}</p>
                      <p className="text-xs text-muted-foreground">Gas: {tx.gasUsed.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
