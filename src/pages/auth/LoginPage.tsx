import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Wallet, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { UserRole } from '@/types';
import { toast } from 'sonner';

const demoUsers: { role: UserRole; label: string; email: string; password: string; path: string }[] = [
  { role: 'institution', label: 'Institution', email: 'registrar@mit.edu', password: 'mit123', path: '/institution/dashboard' },
  { role: 'student', label: 'Student', email: 'john.doe@student.mit.edu', password: 'student123', path: '/student/dashboard' },
  { role: 'employer', label: 'Employer', email: 'hr@techcorp.com', password: 'employer123', path: '/verifier/dashboard' },
  { role: 'government', label: 'Government', email: 'gov@education.gov', password: 'gov123', path: '/government/dashboard' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    // Just populate the form fields instead of logging in directly
    setEmail(d.email);
    setPassword(d.password);
    setActiveTab(d.role);
    toast.info(`Demo credentials loaded for ${d.label}. Click "Sign In" to login.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md glow-card">
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
            <div className="relative">
              <Input 
                placeholder="Password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Load Demo Credentials</span></div>
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

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <Link to="/forgot-password" className="text-accent hover:underline font-medium">Forgot password?</Link>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:underline font-medium">Create one</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
