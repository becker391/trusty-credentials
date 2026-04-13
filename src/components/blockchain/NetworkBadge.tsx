import { Badge } from '@/components/ui/badge';

export function NetworkBadge({ network }: { network: string }) {
  const isEth = network.toLowerCase().includes('ethereum');
  return (
    <Badge variant="outline" className={isEth ? 'border-secondary/40 text-secondary' : 'border-accent/40 text-accent'}>
      {network}
    </Badge>
  );
}
