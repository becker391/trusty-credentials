import { useState, Copy, Check } from 'react';

export function WalletAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const display = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={copy} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-mono hover:bg-muted/80 transition-colors">
      <span className="h-2 w-2 rounded-full bg-success" />
      {display}
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}
