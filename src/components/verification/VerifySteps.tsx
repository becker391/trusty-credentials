import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const steps = [
  'Checking hash format',
  'Querying blockchain',
  'Validating smart contract',
  'Result',
];

export function VerifySteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          {i < currentStep ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : i === currentStep ? (
            <Loader2 className="h-5 w-5 text-accent animate-spin" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground/30" />
          )}
          <span className={`text-sm ${i <= currentStep ? 'text-foreground' : 'text-muted-foreground/50'}`}>{step}</span>
        </div>
      ))}
    </div>
  );
}
