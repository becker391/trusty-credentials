import type { Credential } from '@/types';
import { StatusBadge } from './StatusBadge';
import { HashDisplay } from './HashDisplay';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
  credentials: Credential[];
  onRowClick?: (cred: Credential) => void;
  showActions?: boolean;
  actionRenderer?: (cred: Credential) => React.ReactNode;
}

export function CredentialTable({ credentials, onRowClick, actionRenderer }: Props) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hash</TableHead>
            {actionRenderer && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {credentials.map(cred => (
            <TableRow key={cred.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onRowClick?.(cred)}>
              <TableCell className="font-medium">{cred.studentName}</TableCell>
              <TableCell>{cred.course}</TableCell>
              <TableCell>{cred.certificateType}</TableCell>
              <TableCell>{cred.grade}</TableCell>
              <TableCell>{cred.issueDate}</TableCell>
              <TableCell><StatusBadge status={cred.status} /></TableCell>
              <TableCell><HashDisplay hash={cred.credentialHash} /></TableCell>
              {actionRenderer && <TableCell onClick={e => e.stopPropagation()}>{actionRenderer(cred)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
