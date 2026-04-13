import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function VerifyInput({ onVerify, loading }: { onVerify: (hash: string) => void; loading?: boolean }) {
  const [hash, setHash] = useState('');

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Paste credential hash..."
        value={hash}
        onChange={e => setHash(e.target.value)}
        className="font-mono text-sm"
      />
      <Button onClick={() => onVerify(hash)} disabled={!hash || loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Search className="h-4 w-4 mr-2" />
        Verify
      </Button>
    </div>
  );
}
