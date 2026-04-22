import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';

const navTabs = [
  { label: 'Home', path: '/' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Verify', path: '/verify' },
  { label: 'About', path: '/about' },
];

export function PublicLayout({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <span className="font-bold text-xl">DACS</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navTabs.map(tab => (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  location.pathname === tab.path
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          <Button onClick={() => navigate('/login')} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get Started <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/80">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-accent" />
                </div>
                <span className="font-bold text-lg">DACS</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Decentralized Academic Credential System — a blockchain-based platform for issuing, owning, and verifying tamper-proof academic credentials.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-foreground transition-colors">How It Works</button></li>
                <li><button onClick={() => navigate('/verify')} className="hover:text-foreground transition-colors">Verify Credentials</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-foreground transition-colors">About</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/login')} className="hover:text-foreground transition-colors">Sign In</button></li>
                <li><button onClick={() => navigate('/signup')} className="hover:text-foreground transition-colors">Create Account</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} DACS — Decentralized Academic Credential System. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/privacy')} className="hover:text-foreground transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-foreground transition-colors">Terms of Service</button>
              <button onClick={() => navigate('/contact')} className="hover:text-foreground transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
