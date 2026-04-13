import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerifySteps } from '@/components/verification/VerifySteps';
import { VerificationResult } from '@/components/verification/VerificationResult';
import { StatusBadge } from '@/components/credentials/StatusBadge';
import * as credentialService from '@/services/credentialService';
import { getCredentialHashes } from '@/api/mockApi';
import type { Credential } from '@/types';
import { toast } from 'sonner';
import { ClipboardPaste, Upload } from 'lucide-react';

interface HistoryItem {
  hash: string;
  valid: boolean;
  message: string;
  credential?: Credential;
  timestamp: string;
}

export default function VerifyCredentialPage() {
  const [hash, setHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<{ valid: boolean; credential?: Credential; message: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const verify = useCallback(async () => {
    if (!hash) return;
    setVerifying(true);
    setResult(null);
    setStep(0);

    // Animated steps
    await new Promise(r => setTimeout(r, 800));
    setStep(1);
    await new Promise(r => setTimeout(r, 1000));
    setStep(2);
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await credentialService.verifyCredentialByHash(hash);
      setStep(3);
      setResult(res);
      setHistory(prev => [{ hash, ...res, timestamp: new Date().toLocaleTimeString() }, ...prev]);
      toast(res.valid ? 'Credential verified!' : 'Verification failed');
    } catch {
      setStep(3);
      toast.error('Error during verification');
    }
    setVerifying(false);
  }, [hash]);

  const fillSample = () => {
    const hashes = getCredentialHashes();
    setHash(hashes[0] || '');
    toast.success('Sample hash filled');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Verify Credential</h1>

      <Tabs defaultValue="hash">
        <TabsList>
          <TabsTrigger value="hash">Verify by Hash</TabsTrigger>
          <TabsTrigger value="upload">Verify by Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="hash" className="space-y-4 mt-4">
          <Card className="glow-card">
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Paste credential hash..." value={hash} onChange={e => setHash(e.target.value)} className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.readText().then(setHash)}>
                  <ClipboardPaste className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={verify} disabled={!hash || verifying} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Verify
                </Button>
                <Button variant="outline" onClick={fillSample}>Use Sample Hash</Button>
              </div>

              {verifying && <VerifySteps currentStep={step} />}
              {result && !verifying && <VerificationResult {...result} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card className="glow-card">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-accent/30 rounded-lg bg-accent/5">
                <Upload className="h-12 w-12 text-accent/40 mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Upload a credential file to verify</p>
                <Button variant="outline" disabled>Select File (Coming Soon)</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {history.length > 0 && (
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Session History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                  <span className="font-mono text-xs truncate max-w-[200px]">{h.hash}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{h.timestamp}</span>
                    <StatusBadge status={h.valid ? 'valid' : 'invalid'} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
