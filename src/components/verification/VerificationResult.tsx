import type { Credential } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { BlockchainProof } from '@/components/blockchain/BlockchainProof';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  valid: boolean;
  credential?: Credential;
  message: string;
}

export function VerificationResult({ valid, credential, message }: Props) {
  return (
    <Card className={`border-2 ${valid ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {valid ? <CheckCircle2 className="h-8 w-8 text-success" /> : <XCircle className="h-8 w-8 text-destructive" />}
          <div>
            <h3 className={`font-bold text-lg ${valid ? 'text-success' : 'text-destructive'}`}>
              {valid ? 'VERIFIED ON BLOCKCHAIN' : 'VERIFICATION FAILED'}
            </h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        {credential && (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{credential.studentName}</span></div>
              <div><span className="text-muted-foreground">Course:</span> <span className="font-medium">{credential.course}</span></div>
              <div><span className="text-muted-foreground">Institution:</span> <span className="font-medium">{credential.institutionName}</span></div>
              <div><span className="text-muted-foreground">Grade:</span> <span className="font-medium">{credential.grade}</span></div>
              <div><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{credential.issueDate}</span></div>
              <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{credential.certificateType}</span></div>
            </div>
            <BlockchainProof txHash={credential.txHash} blockNumber={credential.blockNumber} network={credential.networkName} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
