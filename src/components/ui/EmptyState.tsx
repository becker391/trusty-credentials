import { FileX } from 'lucide-react';

export function EmptyState({ title = 'No data found', message = 'There are no items to display.' }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
