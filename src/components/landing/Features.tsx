import { memo, type ComponentType, type SVGProps } from 'react';
import { ScanLine, HandCoins, CalendarClock } from 'lucide-react';

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

type CardCommon = { id: string; title: string; desc: string };
type IconCard = CardCommon & { kind: 'icon'; icon: LucideIcon; iconBg: 'coral' | 'navy' };
type FeaturedCard = CardCommon & { kind: 'featured' };
type WideCard = CardCommon & { kind: 'wide' };

const CARDS = {
  bulletin: {
    id: 'bulletin',
    kind: 'featured',
    title: 'Ton bulletin quotidien',
    desc: "Chaque matin, une action concrète à faire en moins de 60 secondes. Élio te dit quoi prioriser, sans te noyer.",
  } as FeaturedCard,
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

function BulletinPreview() {
  const rows = [
    { label: "Aujourd'hui",   value: '1 240 € à récupérer' },
    { label: 'Demain',        value: 'Demande APL' },
    { label: 'Cette semaine', value: 'Rappel échéance' },
  ];
  return (
    <div className="lp-bento-preview lp-bento-preview-rows">
      {rows.map((r) => (
        <div key={r.label} className="lp-bento-preview-row">
          <span className="lp-bento-preview-label">{r.label}</span>
          <span className="lp-bento-preview-value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

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

function FeaturedCardEl({ card }: { card: FeaturedCard }) {
  return (
    <article className="lp-bento-card lp-bento-card-featured">
      <h3 className="lp-bento-title">{card.title}</h3>
      <p className="lp-bento-desc">{card.desc}</p>
      <BulletinPreview />
    </article>
  );
}

function IconCardEl({ card }: { card: IconCard }) {
  const Icon = card.icon;
  return (
    <article className="lp-bento-card lp-bento-card-single">
      <div className={`lp-bento-icon lp-bento-icon-${card.iconBg}`} aria-hidden="true">
        <Icon className="lp-bento-icon-svg" />
      </div>
      <h3 className="lp-bento-title">{card.title}</h3>
      <p className="lp-bento-desc">{card.desc}</p>
    </article>
  );
}

function WideCardEl({ card }: { card: WideCard }) {
  return (
    <article className="lp-bento-card lp-bento-card-wide">
      <div className="lp-bento-card-wide-text">
        <h3 className="lp-bento-title">{card.title}</h3>
        <p className="lp-bento-desc">{card.desc}</p>
      </div>
      <AgentPreview />
    </article>
  );
}

function LandingFeaturesBase() {
  return (
    <section className="lp-features" id="features" aria-labelledby="lp-features-title">
      <div className="lp-features-header">
        <p className="lp-features-label">Fonctionnalités</p>
        <h2 id="lp-features-title" className="lp-features-h2">
          Tout ce qu'il faut pour ne plus rien laisser passer.
        </h2>
        <p className="lp-features-subtitle">
          Un copilote complet qui scanne, détecte, alerte et t'accompagne — sans paperasse, sans expert-comptable.
        </p>
      </div>
      <div className="lp-bento">
        <FeaturedCardEl card={CARDS.bulletin} />
        <IconCardEl     card={CARDS.scanner} />
        <IconCardEl     card={CARDS.aides} />
        <IconCardEl     card={CARDS.calendrier} />
        <WideCardEl     card={CARDS.agent} />
      </div>
    </section>
  );
}

export const LandingFeatures = memo(LandingFeaturesBase);
