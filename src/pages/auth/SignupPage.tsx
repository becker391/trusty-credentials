import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { GraduationCap, Wallet, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@/types';
import { toast } from 'sonner';
import { useState } from 'react';
import { signup } from '@/services/authService';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup({ name, email, password, role, institution: institution || undefined });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-16 bg-background">
      <Card className="w-full max-w-lg glow-card">
        <CardHeader className="text-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="mx-auto h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <p className="text-sm text-muted-foreground">Join the Decentralized Academic Credential System</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password *</Label>
                <Input id="confirm" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Type *</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="institution">Institution Admin</SelectItem>
                  <SelectItem value="employer">Employer / Verifier</SelectItem>
                  <SelectItem value="government">Government Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(role === 'student' || role === 'institution') && (
              <div className="space-y-2">
                <Label htmlFor="institution">Institution Name</Label>
                <Input id="institution" placeholder="e.g. Machakos University" value={institution} onChange={e => setInstitution(e.target.value)} />
              </div>
            )}
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4 ml-1" /></>}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <Button variant="outline" className="w-full" disabled>
            <Wallet className="h-4 w-4 mr-2" /> Connect Wallet (Coming Soon)
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
