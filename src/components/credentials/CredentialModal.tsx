import type { Credential } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { HashDisplay } from './HashDisplay';
import { BlockchainProof } from '@/components/blockchain/BlockchainProof';
import { GraduationCap } from 'lucide-react';

export function CredentialModal({ credential, open, onClose }: { credential: Credential | null; open: boolean; onClose: () => void }) {
  if (!credential) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            Credential Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{credential.course}</h3>
              <p className="text-sm text-muted-foreground">{credential.institutionName}</p>
            </div>
            <StatusBadge status={credential.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{credential.studentName}</span></div>
            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{credential.certificateType}</span></div>
            <div><span className="text-muted-foreground">Grade:</span> <span className="font-medium">{credential.grade}</span></div>
            <div><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{credential.issueDate}</span></div>
            <div><span className="text-muted-foreground">Issued By:</span> <span className="font-medium">{credential.issuedBy}</span></div>
            {credential.nftTokenId && <div><span className="text-muted-foreground">NFT Token:</span> <span className="font-medium">#{credential.nftTokenId}</span></div>}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Credential Hash:</span>
            <div className="mt-1"><HashDisplay hash={credential.credentialHash} truncate={false} /></div>
          </div>
          <BlockchainProof txHash={credential.txHash} blockNumber={credential.blockNumber} network={credential.networkName} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
