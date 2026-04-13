import type { Credential } from '@/types';
import { StatusBadge } from './StatusBadge';
import { HashDisplay } from './HashDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export function CredentialCard({ credential, onClick }: { credential: Credential; onClick?: () => void }) {
  return (
    <Card className="glow-card credential-shimmer cursor-pointer group" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-accent" />
          </div>
          <StatusBadge status={credential.status} />
        </div>
        <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors">{credential.course}</h3>
        <p className="text-xs text-muted-foreground mb-2">{credential.institutionName}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{credential.certificateType} • {credential.grade}</span>
          <span>{credential.issueDate}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border/50">
          <HashDisplay hash={credential.credentialHash} />
        </div>
      </CardContent>
    </Card>
  );
}
