import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center text-center p-4 py-32">
        <GraduationCap className="h-16 w-16 text-accent/30 mb-6" />
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Button onClick={() => navigate('/')} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Back to Home
        </Button>
      </div>
    </PublicLayout>
  );
}
