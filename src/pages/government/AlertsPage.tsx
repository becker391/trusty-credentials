import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/credentials/StatusBadge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import * as mockApi from '@/api/mockApi';
import type { Credential, VerificationRequest } from '@/types';
import { AlertTriangle, ShieldAlert, XCircle, Clock } from 'lucide-react';

interface AlertItem {
  id: string;
  type: 'revocation' | 'fraud' | 'invalid';
  title: string;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [creds, verifs] = await Promise.all([
        mockApi.mockGetAllCredentials({ status: 'revoked' }),
        mockApi.mockGetVerificationRequests(),
      ]);

      const items: AlertItem[] = [];

      creds.forEach(c => {
        items.push({
          id: `rev-${c.id}`,
          type: 'revocation',
          title: `Credential Revoked: ${c.course}`,
          description: `${c.studentName}'s ${c.certificateType} from ${c.institutionName} was revoked`,
          timestamp: c.issueDate,
          severity: 'high',
        });
      });

      verifs.filter(v => v.result === 'invalid').forEach(v => {
        items.push({
          id: `fraud-${v.id}`,
          type: 'fraud',
          title: 'Invalid Verification Attempt',
          description: `${v.verifierName} (${v.verifierOrg}) submitted an unrecognized credential hash`,
          timestamp: v.requestDate,
          severity: 'high',
        });
      });

      items.push({
        id: 'alert-sys-1',
        type: 'invalid',
        title: 'Suspicious Activity Detected',
        description: 'Multiple failed verification attempts from the same IP address within 5 minutes',
        timestamp: '2026-04-11',
        severity: 'medium',
      });

      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAlerts(items);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  const iconMap = {
    revocation: XCircle,
    fraud: ShieldAlert,
    invalid: AlertTriangle,
  };

  const colorMap = {
    high: 'text-destructive bg-destructive/10',
    medium: 'text-warning bg-warning/10',
    low: 'text-muted-foreground bg-muted/50',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Alerts</h1>

      {alerts.length === 0 ? (
        <EmptyState title="No alerts" message="No security alerts at this time." />
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => {
            const Icon = iconMap[alert.type];
            return (
              <Card key={alert.id} className="glow-card">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${colorMap[alert.severity]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
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
