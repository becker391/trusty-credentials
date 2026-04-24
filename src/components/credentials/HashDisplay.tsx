import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function HashDisplay({ hash, truncate = true }: { hash?: string; truncate?: boolean }) {
  const [copied, setCopied] = useState(false);
  
  // Handle undefined or null hash
  if (!hash) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <span className="font-mono text-xs">No hash available</span>
      </span>
    );
  }
  
  const display = truncate ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;

  const copy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={copy} className="hash-display inline-flex items-center gap-1.5 hover:bg-muted transition-colors cursor-pointer">
          <span className="font-mono text-xs">{display}</span>
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
        </button>
      </TooltipTrigger>
      <TooltipContent><p className="font-mono text-xs break-all max-w-xs">{hash}</p></TooltipContent>
    </Tooltip>
  );
}
