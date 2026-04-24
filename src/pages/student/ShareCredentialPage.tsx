import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { HashDisplay } from '@/components/credentials/HashDisplay';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import * as credentialService from '@/services/credentialService';
import type { Credential } from '@/types';
import { toast } from 'sonner';
import { Copy, Download, Link2, QrCode } from 'lucide-react';

export default function ShareCredentialPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [useExpiry, setUseExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (user?.id) {
      credentialService.getCredentialsByStudent(user.id)
        .then(response => {
          const creds = response.data || [];
          setCredentials(creds.filter(c => c.status === 'active'));
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch student credentials:', error);
          setCredentials([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const selected = credentials.find(c => c.id === selectedId);
  const shareUrl = selected ? `${window.location.origin}/credential/${selected.id}?hash=${selected.credentialHash.slice(0, 16)}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Share Credential</h1>

      <Card className="glow-card">
        <CardHeader><CardTitle className="text-sm">Select Credential</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Choose a credential..." /></SelectTrigger>
            <SelectContent>
              {credentials.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.course} — {c.institutionName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected && (
            <>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Shareable Link</p>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly className="font-mono text-xs" />
                    <Button size="icon" variant="outline" onClick={copyLink}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Credential Hash</p>
                  <HashDisplay hash={selected.credentialHash} truncate={false} />
                </div>

                {/* QR Placeholder */}
                <div className="flex items-center justify-center p-8 rounded-lg border border-dashed border-accent/30 bg-accent/5">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-accent/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">QR Code Preview</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch checked={useExpiry} onCheckedChange={setUseExpiry} />
                  <span className="text-sm">Set link expiry</span>
                  {useExpiry && <Input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-40" />}
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyLink} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link2 className="h-4 w-4 mr-2" /> Copy Link
                  </Button>
                  <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download QR</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
