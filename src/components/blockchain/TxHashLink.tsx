import { ExternalLink } from 'lucide-react';

export function TxHashLink({ txHash }: { txHash: string }) {
  const display = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline cursor-pointer">
      {display}
      <ExternalLink className="h-3 w-3" />
    </span>
  );
}
