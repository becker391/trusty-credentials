import { useState, useCallback, useRef } from 'react';
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
import { ClipboardPaste, Upload, FileText, X } from 'lucide-react';

interface HistoryItem {
  hash: string;
  valid: boolean;
  message: string;
  credential?: Credential;
  timestamp: string;
  extractedHash?: string;
}

export default function VerifyCredentialPage() {
  const [hash, setHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<{ valid: boolean; credential?: Credential; message: string; extractedHash?: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const verifyFile = useCallback(async () => {
    if (!selectedFile) return;
    setVerifying(true);
    setResult(null);
    setStep(0);

    // Animated steps
    await new Promise(r => setTimeout(r, 800));
    setStep(1);
    await new Promise(r => setTimeout(r, 1200));
    setStep(2);
    await new Promise(r => setTimeout(r, 800));

    try {
      const res = await credentialService.verifyCredentialByFile(selectedFile);
      setStep(3);
      setResult(res);
      setHistory(prev => [{ 
        hash: res.extractedHash || 'File Upload', 
        ...res, 
        timestamp: new Date().toLocaleTimeString(),
        extractedHash: res.extractedHash
      }, ...prev]);
      toast(res.valid ? 'Credential verified from file!' : 'File verification failed');
    } catch (error: any) {
      setStep(3);
      toast.error(error.message || 'Error during file verification');
    }
    setVerifying(false);
  }, [selectedFile]);

  const fillSample = () => {
    const hashes = getCredentialHashes();
    setHash(hashes[0] || '');
    toast.success('Sample hash filled');
  };

  const handleFileSelect = (file: File) => {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check file type
    const allowedTypes = ['.json', '.txt', '.csv', '.pdf'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedTypes.some(type => fileName.endsWith(type));
    
    if (!isAllowed) {
      toast.error(`Unsupported file type. Allowed: ${allowedTypes.join(', ')}`);
      return;
    }

    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Verify Credential</h1>

      <Tabs defaultValue="hash">
        <TabsList>
          <TabsTrigger value="hash">Verify by Hash</TabsTrigger>
          <TabsTrigger value="upload">Verify by File</TabsTrigger>
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
            <CardContent className="p-6 space-y-4">
              {!selectedFile ? (
                <div 
                  className={`flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                    dragOver 
                      ? 'border-accent bg-accent/10' 
                      : 'border-accent/30 bg-accent/5 hover:border-accent/50 hover:bg-accent/8'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className={`h-12 w-12 mb-4 ${dragOver ? 'text-accent' : 'text-accent/40'}`} />
                  <p className="text-sm text-muted-foreground mb-2 text-center">
                    {dragOver ? 'Drop file here' : 'Upload a credential file to verify'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4 text-center">
                    Supports: PDF certificates, JSON, Text files (max 10MB)
                  </p>
                  <Button variant="outline">Select File</Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".json,.txt,.csv,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </div>
              ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-accent/20 rounded-lg bg-accent/5">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-accent" />
                        <div>
                          <p className="font-medium text-sm">{selectedFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={verifyFile} 
                        disabled={verifying} 
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        Verify File
                      </Button>
                      <Button variant="outline" onClick={removeFile}>
                        Choose Different File
                      </Button>
                    </div>
                  </div>
              )}

              {verifying && <VerifySteps currentStep={step} />}
              {result && !verifying && (
                <div className="space-y-2">
                  {result.extractedHash && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">Extracted Hash:</p>
                      <p className="font-mono text-xs break-all">{result.extractedHash}</p>
                    </div>
                  )}
                  <VerificationResult {...result} />
                </div>
              )}

              {/* File format help */}
              <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Supported File Formats:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <strong>PDF certificates:</strong> Extracts text to find credential hashes automatically</li>
                  <li>• <strong>JSON files:</strong> Must contain a "credential_hash" field</li>
                  <li>• <strong>Text files:</strong> Should contain a 64-character hexadecimal hash</li>
                  <li>• <strong>Note:</strong> Image files are not supported in this PDF-focused system</li>
                </ul>
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
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs truncate block max-w-[200px]">
                      {h.extractedHash ? `File: ${h.extractedHash}` : h.hash}
                    </span>
                    {h.extractedHash && (
                      <span className="text-xs text-muted-foreground">From file upload</span>
                    )}
                  </div>
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
