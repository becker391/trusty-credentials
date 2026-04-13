import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Wallet, Loader2 } from 'lucide-react';
import type { UserRole } from '@/types';
import { toast } from 'sonner';

const demoUsers: { role: UserRole; label: string; email: string; path: string }[] = [
  { role: 'institution', label: 'Institution', email: 'admin@machakos.ac.ke', path: '/institution/dashboard' },
  { role: 'student', label: 'Student', email: 'john.gachuru@student.mksu.ac.ke', path: '/student/dashboard' },
  { role: 'employer', label: 'Employer', email: 'grace@techcorp.co.ke', path: '/verifier/dashboard' },
  { role: 'government', label: 'Government', email: 'admin@education.go.ke', path: '/government/dashboard' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, activeTab);
      const target = demoUsers.find(d => d.role === activeTab)?.path || '/';
      navigate(target);
      toast.success('Logged in successfully');
    } catch { toast.error('Login failed'); }
    finally { setLoading(false); }
  };

  const handleDemoLogin = async (d: typeof demoUsers[0]) => {
    setLoading(true);
    try {
      await login(d.email, 'demo', d.role);
      navigate(d.path);
      toast.success(`Logged in as ${d.label}`);
    } catch { toast.error('Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md glow-card">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
            <GraduationCap className="h-6 w-6 text-accent" />
          </div>
          <CardTitle className="text-2xl">Sign in to DACS</CardTitle>
          <p className="text-sm text-muted-foreground">Decentralized Academic Credential System</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as UserRole)}>
            <TabsList className="grid grid-cols-4 w-full">
              {demoUsers.map(d => (
                <TabsTrigger key={d.role} value={d.role} className="text-xs">{d.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Quick Demo Login</span></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {demoUsers.map(d => (
              <Button key={d.role} variant="outline" size="sm" className="text-xs" onClick={() => handleDemoLogin(d)} disabled={loading}>
                {d.label}
              </Button>
            ))}
          </div>

          <Button variant="outline" className="w-full" disabled>
            <Wallet className="h-4 w-4 mr-2" /> Connect Wallet (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
