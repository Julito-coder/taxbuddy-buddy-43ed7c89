/**
 * AidesEmptyState — État vide réutilisable pour la page Aides.
 *
 * 4 variants V1 :
 * - 'no-profile'   : profil utilisateur non chargé (fallback !result)
 * - 'no-eligible'  : aucune aide éligible détectée (tab/colonne Éligible)
 * - 'no-verify'    : aucune aide à vérifier (tab/colonne À vérifier)
 * - 'all-analyzed' : toutes les aides traitées (tab/colonne Non concerné)
 *
 * Style aligné CoachEmptyState Batch 7 + FinancesEmptyState Batch 8 :
 * bg-card rounded-xl border border-border p-8 text-center.
 * Accent border-t-success/10 sur 'no-profile' uniquement (tier 3 brand
 * accent — signal d'invitation à compléter le profil).
 */

import { HandCoins, AlertTriangle, CheckCircle2, ArrowRight, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export type AidesEmptyStateVariant = 'no-profile' | 'no-eligible' | 'no-verify' | 'all-analyzed';

interface AidesEmptyStateProps {
  variant: AidesEmptyStateVariant;
}

interface VariantConfig {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaTarget?: string;
  accentTop: boolean;
}

const VARIANT_CONFIG: Record<AidesEmptyStateVariant, VariantConfig> = {
  'no-profile': {
    icon: HandCoins,
    iconClass: 'text-muted-foreground',
    title: 'Impossible de charger ton profil.',
    subtitle: 'Configure-le pour découvrir tes aides éligibles.',
    ctaLabel: 'Compléter mon profil',
    ctaTarget: '/profil/fiscal',
    accentTop: true,
  },
  'no-eligible': {
    icon: AlertTriangle,
    iconClass: 'text-warning',
    title: 'Aucune aide éligible détectée pour le moment.',
    subtitle: 'Complète ton profil ou reviens dans 1 mois.',
    ctaLabel: 'Compléter mon profil',
    ctaTarget: '/profil/fiscal',
    accentTop: false,
  },
  'no-verify': {
    icon: CheckCircle2,
    iconClass: 'text-success',
    title: 'Aucune aide à vérifier.',
    subtitle: 'Toutes les aides détectées sont éligibles ou non concernées.',
    accentTop: false,
  },
  'all-analyzed': {
    icon: CheckCircle2,
    iconClass: 'text-success',
    title: 'Toutes les aides ont été analysées.',
    subtitle: 'Élio surveille ton profil pour détecter de nouvelles aides automatiquement.',
    accentTop: false,
  },
};

export const AidesEmptyState = ({ variant }: AidesEmptyStateProps) => {
  const navigate = useNavigate();
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const accentClass = config.accentTop ? 'border-t-success/10' : '';

  return (
    <div className={`bg-card rounded-xl border border-border ${accentClass} p-8 text-center`}>
      <Icon className={`h-10 w-10 ${config.iconClass} mx-auto mb-3`} />
      <p className="font-medium text-foreground">{config.title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{config.subtitle}</p>
      {config.ctaLabel && config.ctaTarget && (
        <Button
          onClick={() => navigate(config.ctaTarget!)}
          className="mt-6"
          size="sm"
        >
          {config.ctaLabel}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};
