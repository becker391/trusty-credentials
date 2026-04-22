import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GraduationCap, ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
      toast.success('Password reset link sent');
    } catch {
      toast.error('Could not send reset link');
    } finally {
      setLoading(false);
    }
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
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            {sent ? 'Check your inbox for a reset link' : 'Enter your email to receive a password reset link'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Email sent to</p>
                <p className="text-sm text-muted-foreground font-mono">{email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                If an account exists with this email, you'll receive a password reset link shortly. Please check your spam folder as well.
              </p>
              <Button variant="outline" onClick={() => setSent(false)} className="w-full">
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
