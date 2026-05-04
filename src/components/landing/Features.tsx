import { memo, type ComponentType, type SVGProps } from 'react';
import { ScanLine, HandCoins, CalendarClock, Bell } from 'lucide-react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useCountUp } from './hooks/useCountUp';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

type CardCommon = { id: string; title: string; desc: string };
type IconCard = CardCommon & { kind: 'icon'; icon: LucideIcon; iconBg: 'coral' | 'navy' };
type WideCard = CardCommon & { kind: 'wide' };

const CARDS = {
  scanner: {
    id: 'scanner',
    kind: 'icon',
    icon: ScanLine,
    iconBg: 'coral',
    title: 'Scanner fiscal IA',
    desc: "Photo de ton avis d'imposition, Élio détecte les erreurs et les optimisations en quelques secondes.",
  } as IconCard,
  aides: {
    id: 'aides',
    kind: 'icon',
    icon: HandCoins,
    iconBg: 'navy',
    title: "Détecteur d'aides",
    desc: "Élio croise ta situation avec toutes les aides nationales et locales. Tu vois immédiatement ce que tu peux réclamer.",
  } as IconCard,
  calendrier: {
    id: 'calendrier',
    kind: 'icon',
    icon: CalendarClock,
    iconBg: 'coral',
    title: 'Calendrier prédictif',
    desc: "Tu ne rates plus aucune deadline fiscale. Élio anticipe et te prévient au bon moment.",
  } as IconCard,
  agent: {
    id: 'agent',
    kind: 'wide',
    title: 'Agent IA Élio',
    desc: "Pose-lui n'importe quelle question fiscale ou administrative. Réponse claire, en français, adaptée à ta situation.",
  } as WideCard,
};

function AgentPreview() {
  return (
    <div className="lp-bento-preview lp-bento-preview-qa">
      <div className="lp-bento-preview-bubble lp-bento-preview-bubble-q">
        <span className="lp-bento-preview-label">Question</span>
        <p className="lp-bento-preview-text">Combien ça me coûte de passer en SAS&nbsp;?</p>
      </div>
      <div className="lp-bento-preview-bubble lp-bento-preview-bubble-a">
        <span className="lp-bento-preview-label">Élio</span>
        <p className="lp-bento-preview-text">
          Pour ton CA actuel, environ 2 800 € de plus par an en charges, mais tu gagnes en flexibilité statutaire.
        </p>
      </div>
    </div>
  );
}

const FeaturedCardEl = ({ index }: { index: number }) => {
  const { ref: stackRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });
  const countValue = useCountUp(1240, { duration: 1500, start: isVisible });

  return (
    <article
      className="lp-bento-card lp-bento-card-featured lp-reveal-scale"
      data-cascade={index + 1}
      data-revealed={isVisible || undefined}
    >
      <div className="lp-bento-featured-icon" aria-hidden="true">
        <Bell />
      </div>
      <h3 className="lp-bento-title">Ton bulletin quotidien</h3>
      <p className="lp-bento-desc">
        Chaque matin, une action concrète à faire en moins de 60 secondes.
        Élio te dit quoi prioriser, sans te noyer.
      </p>

      <div
        ref={stackRef}
        className={`lp-bulletin-stack${isVisible ? ' is-revealed' : ''}`}
      >
        <div className="lp-bulletin-card lp-bulletin-card-deep">
          <span className="lp-bulletin-label">VENDREDI</span>
          <span className="lp-bulletin-content">Échéance taxe foncière</span>
        </div>

        <div className="lp-bulletin-card lp-bulletin-card-mid">
          <span className="lp-bulletin-label">DEMAIN</span>
          <span className="lp-bulletin-content">Préparer dossier APL</span>
        </div>

        <div className="lp-bulletin-card lp-bulletin-card-hero">
          <div className="lp-bulletin-card-header">
            <span className="lp-bulletin-dot" aria-hidden="true" />
            <span className="lp-bulletin-label-coral">AUJOURD'HUI</span>
          </div>
          <div className="lp-bulletin-amount">
            {Math.round(countValue).toLocaleString('fr-FR')} €
          </div>
          <p className="lp-bulletin-context">à récupérer en prime d'activité</p>
          <span className="lp-bulletin-action">Lancer →</span>
        </div>
      </div>
    </article>
  );
};

function IconCardEl({ card, index, start }: { card: IconCard; index: number; start: boolean }) {
  const Icon = card.icon;
  return (
    <article
      className="lp-bento-card lp-bento-card-single lp-reveal-scale"
      data-cascade={index + 1}
      data-revealed={start || undefined}
    >
      <div className={`lp-bento-icon lp-bento-icon-${card.iconBg}`} aria-hidden="true">
        <Icon className="lp-bento-icon-svg" />
      </div>
      <h3 className="lp-bento-title">{card.title}</h3>
      <p className="lp-bento-desc">{card.desc}</p>
    </article>
  );
}

function WideCardEl({ card, index, start }: { card: WideCard; index: number; start: boolean }) {
  return (
    <article
      className="lp-bento-card lp-bento-card-wide lp-reveal-scale"
      data-cascade={index + 1}
      data-revealed={start || undefined}
    >
      <div className="lp-bento-card-wide-text">
        <h3 className="lp-bento-title">{card.title}</h3>
        <p className="lp-bento-desc">{card.desc}</p>
      </div>
      <AgentPreview />
    </article>
  );
}

function LandingFeaturesBase() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} className="lp-features" id="features" aria-labelledby="lp-features-title">
      <div
        className="lp-features-header lp-reveal"
        data-revealed={isVisible || undefined}
      >
        <p className="lp-features-label">Fonctionnalités</p>
        <h2 id="lp-features-title" className="lp-features-h2">
          Tout ce qu'il faut pour ne plus rien laisser passer.
        </h2>
        <p className="lp-features-subtitle">
          Un copilote complet qui scanne, détecte, alerte et t'accompagne — sans paperasse, sans expert-comptable.
        </p>
      </div>
      <div className="lp-bento">
        <FeaturedCardEl                         index={0} />
        <IconCardEl     card={CARDS.scanner}    index={1} start={isVisible} />
        <IconCardEl     card={CARDS.aides}      index={2} start={isVisible} />
        <IconCardEl     card={CARDS.calendrier} index={3} start={isVisible} />
        <WideCardEl     card={CARDS.agent}      index={4} start={isVisible} />
      </div>
    </section>
  );
}

export const LandingFeatures = memo(LandingFeaturesBase);
