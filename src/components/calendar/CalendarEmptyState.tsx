/**
 * CalendarEmptyState — État vide réutilisable pour la page Calendrier.
 *
 * 4 variants V1 :
 * - 'no-profile'  (consommé) : profil incomplet, CTA /profil/fiscal
 * - 'no-active'   (consommé) : aucune échéance active pour la période/profil
 * - 'no-personal' (consommé) : aucun prélèvement récurrent, CTA onAdd optionnel
 * - 'no-tracking' (placeholder) : aucune action marquée fait (future tab)
 */

import { Calendar, CheckCircle2, Repeat, Plus, ArrowRight, type LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export type CalendarEmptyStateVariant = 'no-profile' | 'no-active' | 'no-personal' | 'no-tracking';

interface CalendarEmptyStateProps {
  variant: CalendarEmptyStateVariant;
  onAdd?: () => void;
}

interface VariantConfig {
  icon: LucideIcon;
  iconClass: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaTarget?: string;
  ctaAction?: 'navigate' | 'onAdd';
}

const VARIANT_CONFIG: Record<CalendarEmptyStateVariant, VariantConfig> = {
  'no-profile': {
    icon: Calendar,
    iconClass: 'text-muted-foreground',
    title: 'Complète ton profil pour découvrir tes échéances.',
    subtitle: 'Élio détectera automatiquement les échéances fiscales qui te concernent.',
    ctaLabel: 'Compléter mon profil',
    ctaTarget: '/profil/fiscal',
    ctaAction: 'navigate',
  },
  'no-active': {
    icon: CheckCircle2,
    iconClass: 'text-success',
    title: 'Aucune échéance active pour le moment.',
    subtitle: 'Aucune échéance fiscale ne s\'applique à ton profil actuel.',
  },
  'no-personal': {
    icon: Repeat,
    iconClass: 'text-muted-foreground',
    title: 'Aucun prélèvement récurrent enregistré.',
    subtitle: 'Ajoute un prélèvement manuel ou connecte ta banque pour détection automatique.',
    ctaLabel: 'Ajouter',
    ctaAction: 'onAdd',
  },
  'no-tracking': {
    icon: CheckCircle2,
    iconClass: 'text-success',
    title: 'Aucune action marquée fait pour le moment.',
    subtitle: 'Marque tes échéances comme traitées au fil de l\'année.',
  },
};

export const CalendarEmptyState = ({ variant, onAdd }: CalendarEmptyStateProps) => {
  const navigate = useNavigate();
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  const handleClick = () => {
    if (config.ctaAction === 'navigate' && config.ctaTarget) {
      navigate(config.ctaTarget);
    } else if (config.ctaAction === 'onAdd' && onAdd) {
      onAdd();
    }
  };

  const showCta =
    (config.ctaAction === 'navigate' && config.ctaTarget) ||
    (config.ctaAction === 'onAdd' && onAdd);

  return (
    <div className="bg-card rounded-xl border border-border p-8 text-center">
      <Icon className={`h-10 w-10 ${config.iconClass} mx-auto mb-3`} />
      <p className="font-medium text-foreground">{config.title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{config.subtitle}</p>
      {showCta && (
        <Button onClick={handleClick} className="mt-6" size="sm">
          {config.ctaAction === 'onAdd' && <Plus className="h-4 w-4 mr-1" />}
          {config.ctaLabel}
          {config.ctaAction === 'navigate' && <ArrowRight className="h-4 w-4 ml-2" />}
        </Button>
      )}
    </div>
  );
};
