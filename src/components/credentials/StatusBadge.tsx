import { Badge } from '@/components/ui/badge';
import type { CredentialStatus, VerificationResult } from '@/types';

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-success/20 text-success border-success/30' },
  revoked: { label: 'Revoked', className: 'bg-destructive/20 text-destructive border-destructive/30' },
  pending: { label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' },
  valid: { label: 'Valid', className: 'bg-success/20 text-success border-success/30' },
  invalid: { label: 'Invalid', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

export function StatusBadge({ status }: { status: CredentialStatus | VerificationResult | string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}
