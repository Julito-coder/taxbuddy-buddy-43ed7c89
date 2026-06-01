/**
 * FinancesEmptyState — État vide réutilisable pour la page Finances.
 *
 * Variants V1 :
 * - 'no-bank' (consommé en V1) : aucune banque connectée, CTA Powens
 * - 'no-data' (placeholder V2) : pas de tags fiscaux après synchro
 * - 'no-recurring' (placeholder V2) : pas de prélèvements récurrents détectés
 */

import { Building2, Sparkles, Calendar, Plug, Loader2, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type FinancesEmptyStateVariant = 'no-bank' | 'no-data' | 'no-recurring';

interface FinancesEmptyStateProps {
  variant: FinancesEmptyStateVariant;
  onConnect?: () => void;
  busy?: boolean;
}

interface VariantConfig {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  accentTop: boolean;
}

const VARIANT_CONFIG: Record<FinancesEmptyStateVariant, VariantConfig> = {
  'no-bank': {
    icon: Building2,
    title: 'Aucune banque connectée',
    subtitle: 'La connexion est sécurisée et conforme DSP2. Tu peux te déconnecter à tout moment.',
    ctaLabel: 'Connecter ma banque',
    accentTop: true,
  },
  'no-data': {
    icon: Sparkles,
    title: 'Aucune donnée pour le moment',
    subtitle: 'Synchronise ta banque pour voir tes optimisations détectées.',
    accentTop: false,
  },
  'no-recurring': {
    icon: Calendar,
    title: 'Aucun prélèvement détecté',
    subtitle: 'Lance la détection après une synchronisation pour identifier tes prélèvements récurrents.',
    accentTop: false,
  },
};

export const FinancesEmptyState = ({ variant, onConnect, busy = false }: FinancesEmptyStateProps) => {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const accentClass = config.accentTop ? 'border-t-coral-500/10' : '';

  return (
    <div className={`bg-card rounded-xl border border-border ${accentClass} p-8 text-center`}>
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-foreground">{config.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{config.subtitle}</p>
      {config.ctaLabel && onConnect && (
        <Button onClick={onConnect} disabled={busy} className="mt-6 w-full sm:w-auto">
          {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plug className="h-4 w-4 mr-2" />}
          {config.ctaLabel}
        </Button>
      )}
    </div>
  );
};
