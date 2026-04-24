import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HashDisplay } from '@/components/credentials/HashDisplay';
import { BlockchainProof } from '@/components/blockchain/BlockchainProof';
import * as credentialService from '@/services/credentialService';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function IssueCredentialPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hashing, setHashing] = useState(false);
  const [hashDisplay, setHashDisplay] = useState('');
  const [result, setResult] = useState<any>(null);
  const intervalRef = useRef<number | null>(null);

  const [form, setForm] = useState({
    studentName: '', studentId: '', studentEmail: '', course: '', grade: '', graduationDate: '',
    certificateType: 'Degree', issuerName: user?.name || '',
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  useEffect(() => {
    if (step === 3 && !hashing && !result) {
      setHashing(true);
      let count = 0;
      intervalRef.current = window.setInterval(() => {
        setHashDisplay(credentialService.generateCredentialHash({}));
        count++;
        if (count >= 10) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setHashing(false);
        }
      }, 200);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [step]);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const cred = await credentialService.issueCredential({
        studentName: form.studentName,
        studentEmail: form.studentEmail,
        studentId: form.studentId,
        course: form.course,
        grade: form.grade,
        graduationDate: form.graduationDate,
        certificateType: form.certificateType,
        issuedBy: form.issuerName,
        institutionName: user?.institution || 'Massachusetts Institute of Technology',
        institutionId: 'e56b14fc-f13a-4a35-9d3e-be6114660540', // MIT ID from backend
      } as any); // Use 'as any' to bypass type checking for now
      setResult(cred);
      setHashDisplay(cred.credential_hash_hex || "");
      toast.success('Credential issued successfully!');
    } catch { toast.error('Failed to issue credential'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold">Issue New Credential</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-12 ${step > s ? 'bg-accent' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Step 1 — Student Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Student Name" value={form.studentName} onChange={e => update('studentName', e.target.value)} />
            <Input placeholder="Student ID" value={form.studentId} onChange={e => update('studentId', e.target.value)} />
            <Input placeholder="Email" type="email" value={form.studentEmail} onChange={e => update('studentEmail', e.target.value)} />
            <Input placeholder="Course" value={form.course} onChange={e => update('course', e.target.value)} />
            <Input placeholder="Grade" value={form.grade} onChange={e => update('grade', e.target.value)} />
            <Input placeholder="Graduation Date" type="date" value={form.graduationDate} onChange={e => update('graduationDate', e.target.value)} />
            <Button onClick={() => setStep(2)} disabled={!form.studentName || !form.course} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Step 2 — Credential Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select value={form.certificateType} onValueChange={v => update('certificateType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Degree">Degree</SelectItem>
                <SelectItem value="Diploma">Diploma</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
            <Input value={user?.institution || 'Massachusetts Institute of Technology'} disabled />
            <Input placeholder="Issuer Name" value={form.issuerName} onChange={e => update('issuerName', e.target.value)} />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={() => setStep(3)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="glow-card">
          <CardHeader><CardTitle className="text-sm">Step 3 — Review & Sign</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {/* Preview Card */}
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-6 credential-shimmer">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-bold">{user?.institution || 'Massachusetts Institute of Technology'}</p>
                  <p className="text-xs text-muted-foreground">Digital Academic Credential</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Student:</span> {form.studentName}</div>
                <div><span className="text-muted-foreground">Course:</span> {form.course}</div>
                <div><span className="text-muted-foreground">Grade:</span> {form.grade}</div>
                <div><span className="text-muted-foreground">Type:</span> {form.certificateType}</div>
              </div>
            </div>

            {/* Hashing Animation */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground mb-2">Credential Hash (SHA-256):</p>
              <p className={`font-mono text-xs break-all ${hashing ? 'text-accent animate-pulse' : 'text-foreground'}`}>
                {hashDisplay || 'Generating...'}
              </p>
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Credential Published Successfully!</span>
                </div>
                <HashDisplay hash={result.credential_hash_hex} truncate={false} />
                {result.certificate_image && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Generated Certificate:</p>
                    <img 
                      src={`http://127.0.0.1:8000${result.certificate_image}`} 
                      alt="Generated Certificate" 
                      className="max-w-full h-auto border rounded-lg shadow-sm"
                    />
                  </div>
                )}
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Credential Details:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Status:</span> {result.status}</div>
                    <div><span className="text-muted-foreground">Student:</span> {result.metadata?.student_name}</div>
                    <div><span className="text-muted-foreground">Institution:</span> {result.institution_name}</div>
                    <div><span className="text-muted-foreground">Course:</span> {result.course}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button onClick={handlePublish} disabled={hashing || loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  Publish to Blockchain
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
