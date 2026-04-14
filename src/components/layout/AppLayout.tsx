import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { NotificationPanel } from '@/components/ui/NotificationPanel';
import { WalletAddress } from '@/components/ui/WalletAddress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, User, ChevronRight, Home } from 'lucide-react';
import { GraduationCap, LayoutDashboard, FileText, Send, Wallet, Share2, Search, Building2, Settings, Activity, History, BarChart3, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from '@/components/NavLink';

const navByRole: Record<string, { label: string; path: string; icon: typeof LayoutDashboard }[]> = {
  institution: [
    { label: 'Dashboard', path: '/institution/dashboard', icon: LayoutDashboard },
    { label: 'Issue Credential', path: '/institution/issue', icon: Send },
    { label: 'Manage Credentials', path: '/institution/credentials', icon: FileText },
    { label: 'Transactions', path: '/institution/transactions', icon: Activity },
    { label: 'Settings', path: '/institution/settings', icon: Settings },
  ],
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Wallet', path: '/student/wallet', icon: Wallet },
    { label: 'Share Credential', path: '/student/share', icon: Share2 },
    { label: 'Activity', path: '/student/activity', icon: Activity },
    { label: 'Settings', path: '/student/settings', icon: Settings },
  ],
  employer: [
    { label: 'Dashboard', path: '/verifier/dashboard', icon: LayoutDashboard },
    { label: 'Verify Credential', path: '/verifier/verify', icon: Search },
    { label: 'History', path: '/verifier/history', icon: History },
    { label: 'Settings', path: '/verifier/settings', icon: Settings },
  ],
  government: [
    { label: 'Dashboard', path: '/government/dashboard', icon: LayoutDashboard },
    { label: 'Institutions', path: '/government/institutions', icon: Building2 },
    { label: 'Analytics', path: '/government/analytics', icon: BarChart3 },
    { label: 'Alerts', path: '/government/alerts', icon: AlertTriangle },
    { label: 'Settings', path: '/government/settings', icon: Settings },
  ],
};

const roleLabels: Record<string, string> = {
  institution: 'Institution Admin',
  student: 'Student',
  employer: 'Employer / Verifier',
  government: 'Government Admin',
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAuth();
  const location = useLocation();
  const items = navByRole[role || 'student'] || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-accent" />
          </div>
          <span className="font-bold text-lg">DACS</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-accent/10 text-accent font-medium' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              onClick={onNavigate}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/50 text-[10px] text-muted-foreground leading-relaxed">
        <p>DACS — Decentralized Academic Credential System</p>
        <p>John Muthui Gachuru | J17-1358-2022</p>
        <p>Machakos University — CIT Dept</p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="h-screen flex w-full overflow-hidden">
      {/* Desktop Sidebar — fixed, doesn't scroll with content */}
      <aside className="hidden lg:flex w-64 border-r border-border/50 bg-card flex-col shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Navbar — fixed */}
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <nav className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
              <button onClick={() => navigate('/')} className="hover:text-foreground"><Home className="h-3.5 w-3.5" /></button>
              {pathParts.map((part, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  <span className="capitalize">{part}</span>
                </span>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {role && <Badge variant="outline" className="hidden sm:inline-flex border-accent/30 text-accent text-xs">{roleLabels[role]}</Badge>}
            {user && <WalletAddress address={user.walletAddress} />}
            <NotificationPanel />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-muted-foreground">{user?.name}</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content — only this scrolls */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
