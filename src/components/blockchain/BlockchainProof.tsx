import { TxHashLink } from './TxHashLink';
import { NetworkBadge } from './NetworkBadge';
import { Link2 } from 'lucide-react';

export function BlockchainProof({ txHash, blockNumber, network }: { txHash: string; blockNumber: number; network: string }) {
  return (
    <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Link2 className="h-4 w-4" />
        Blockchain Proof
      </div>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transaction:</span>
          <TxHashLink txHash={txHash} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Block:</span>
          <span className="font-mono text-xs">#{blockNumber.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Network:</span>
          <NetworkBadge network={network} />
        </div>
      </div>
    </div>
  );
}
