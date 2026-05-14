/**
 * CoachEmptyState — État vide réutilisable pour les 3 tabs Coach.
 *
 * Variants :
 * - 'idle'      (défaut, tab Todo vide)        — Sparkles coral-500, signal brand subtil
 * - 'done'      (tab Done vide)                 — CheckCircle2 success
 * - 'dismissed' (tab Dismissed vide)            — XCircle muted-foreground
 *
 * Bord supérieur subtle border-t-coral-500/10 pour marquer la zone Coach
 * sans dominer visuellement.
 */

import { Sparkles, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';

export type CoachEmptyStateVariant = 'idle' | 'done' | 'dismissed';

interface CoachEmptyStateProps {
  title: string;
  subtitle: string;
  variant?: CoachEmptyStateVariant;
}

const VARIANT_CONFIG: Record<CoachEmptyStateVariant, { icon: LucideIcon; iconClass: string }> = {
  idle: { icon: Sparkles, iconClass: 'text-coral-500' },
  done: { icon: CheckCircle2, iconClass: 'text-success' },
  dismissed: { icon: XCircle, iconClass: 'text-muted-foreground' },
};

export const CoachEmptyState = ({ title, subtitle, variant = 'idle' }: CoachEmptyStateProps) => {
  const { icon: Icon, iconClass } = VARIANT_CONFIG[variant];
  return (
    <div className="bg-card rounded-xl border border-border border-t-coral-500/10 p-8 text-center">
      <Icon className={`h-8 w-8 ${iconClass} mx-auto mb-3`} />
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
};
