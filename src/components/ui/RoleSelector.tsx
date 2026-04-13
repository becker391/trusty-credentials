import { useNavigate } from 'react-router-dom';
import type { UserRole } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Wallet, Search, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const roles: { role: UserRole; label: string; desc: string; icon: typeof GraduationCap; email: string; path: string }[] = [
  { role: 'institution', label: 'Institution', desc: 'Issue & manage credentials', icon: GraduationCap, email: 'admin@machakos.ac.ke', path: '/institution/dashboard' },
  { role: 'student', label: 'Student', desc: 'View your digital wallet', icon: Wallet, email: 'john.gachuru@student.mksu.ac.ke', path: '/student/dashboard' },
  { role: 'employer', label: 'Employer / Verifier', desc: 'Verify credentials instantly', icon: Search, email: 'grace@techcorp.co.ke', path: '/verifier/dashboard' },
  { role: 'government', label: 'Government', desc: 'System oversight & analytics', icon: Building2, email: 'admin@education.go.ke', path: '/government/dashboard' },
];

export function RoleSelector() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSelect = async (r: typeof roles[0]) => {
    await login(r.email, 'demo', r.role);
    navigate(r.path);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map(r => (
        <Card key={r.role} className="glow-card cursor-pointer group" onClick={() => handleSelect(r)}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <r.icon className="h-7 w-7 text-accent" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">{r.label}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
