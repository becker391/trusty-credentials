import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/credentials/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { HashDisplay } from '@/components/credentials/HashDisplay';
import * as verificationService from '@/services/verificationService';
import type { VerificationRequest } from '@/types';
import { Clock, Building2 } from 'lucide-react';

export default function VerificationHistoryPage() {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificationService.getVerificationRequests('user-3').then(reqs => {
      setRequests(reqs);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Verification History</h1>

      {requests.length === 0 ? (
        <EmptyState title="No history" message="Your verification history will appear here." />
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <Card key={req.id} className="glow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{req.verifierOrg}</span>
                  </div>
                  <StatusBadge status={req.result === 'valid' ? 'valid' : req.result === 'pending' ? 'pending' : 'invalid'} />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Credential Hash</p>
                    <HashDisplay hash={req.credentialHash} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {req.requestDate}
                    </div>
                    {req.responseTime && <span>Response: {req.responseTime.toFixed(1)}s</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
