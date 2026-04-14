import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BlockchainProof } from '@/components/blockchain/BlockchainProof';
import { HashDisplay } from '@/components/credentials/HashDisplay';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PublicLayout } from '@/components/layout/PublicLayout';
import * as credentialService from '@/services/credentialService';
import type { Credential } from '@/types';
import { CheckCircle2, XCircle, GraduationCap, QrCode } from 'lucide-react';

export default function CredentialDetailPage() {
  const { id } = useParams();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      credentialService.getCredentialById(id).then(c => {
        setCredential(c || null);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <PublicLayout><div className="py-20"><LoadingSpinner /></div></PublicLayout>;
  if (!credential) return <PublicLayout><div className="text-center py-20"><h1 className="text-2xl font-bold">Credential Not Found</h1></div></PublicLayout>;

  const isValid = credential.status === 'active';

  return (
    <PublicLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className={`rounded-xl p-6 text-center ${isValid ? 'bg-success/10 border-2 border-success/30' : 'bg-destructive/10 border-2 border-destructive/30'}`}>
            <div className="flex items-center justify-center gap-3">
              {isValid ? <CheckCircle2 className="h-10 w-10 text-success" /> : <XCircle className="h-10 w-10 text-destructive" />}
              <h1 className={`text-2xl font-bold ${isValid ? 'text-success' : 'text-destructive'}`}>
                {isValid ? 'VERIFIED ON BLOCKCHAIN' : 'CREDENTIAL INVALID'}
              </h1>
            </div>
          </div>

          <Card className="glow-card credential-shimmer">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="h-8 w-8 text-accent" />
                <div>
                  <h2 className="font-bold text-xl">{credential.course}</h2>
                  <p className="text-sm text-muted-foreground">{credential.institutionName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{credential.studentName}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{credential.certificateType}</span></div>
                <div><span className="text-muted-foreground">Grade:</span> <span className="font-medium">{credential.grade}</span></div>
                <div><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{credential.issueDate}</span></div>
                <div><span className="text-muted-foreground">Issued By:</span> <span className="font-medium">{credential.issuedBy}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium capitalize">{credential.status}</span></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credential Hash</p>
                <HashDisplay hash={credential.credentialHash} truncate={false} />
              </div>
              <BlockchainProof txHash={credential.txHash} blockNumber={credential.blockNumber} network={credential.networkName} />
              <div className="flex items-center justify-center p-6 rounded-lg border border-dashed border-accent/30 bg-accent/5">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-accent/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Scan to verify</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
