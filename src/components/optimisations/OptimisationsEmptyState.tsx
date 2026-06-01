import { Sparkles, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';

export type OptimisationsEmptyStateVariant = 'idle' | 'done' | 'dismissed';

interface Props {
  title: string;
  subtitle: string;
  variant?: OptimisationsEmptyStateVariant;
}

const VARIANT_CONFIG: Record<OptimisationsEmptyStateVariant, { icon: LucideIcon; iconClass: string }> = {
  idle: { icon: Sparkles, iconClass: 'text-coral-500' },
  done: { icon: CheckCircle2, iconClass: 'text-success' },
  dismissed: { icon: XCircle, iconClass: 'text-muted-foreground' },
};

export const OptimisationsEmptyState = ({ title, subtitle, variant = 'idle' }: Props) => {
  const { icon: Icon, iconClass } = VARIANT_CONFIG[variant];
  return (
    <div className="bg-card rounded-xl border border-border p-8 text-center">
      <Icon className={`h-8 w-8 ${iconClass} mx-auto mb-3`} />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
};
