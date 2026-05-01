import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const FREE_FEATURES = [
  'Diagnostic en 90 secondes',
  'Score Élio personnalisé',
  'Détection des principales aides nationales',
  '1 action par jour dans ton bulletin',
  'Support communautaire',
];

type PlusFeature = { label: string; emphasis?: boolean };

const PLUS_FEATURES: PlusFeature[] = [
  { label: 'Tout Découverte', emphasis: true },
  { label: 'Détection complète : aides locales + optimisations fiscales' },
  { label: 'Scanner fiscal IA illimité' },
  { label: 'Calendrier prédictif avec rappels' },
  { label: 'Agent IA Élio (questions illimitées)' },
  { label: 'Démarches automatisées' },
  { label: 'Support prioritaire' },
];

const PRICES = {
  monthly: { display: '9,90 €', period: '/mois', complement: 'Soit 119 € par an' },
  annual:  { display: '79 €',   period: '/an',   complement: 'Soit 6,58 €/mois équivalent' },
} as const;

type Billing = keyof typeof PRICES;

function FeatureCheck() {
  return (
    <span className="lp-pricing-check" aria-hidden="true">
      <Check />
    </span>
  );
}

export function LandingPricing() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const plus = PRICES[billing];
  const plusHref = `/quiz?plan=plus&billing=${billing}`;

  return (
    <section className="lp-pricing" id="pricing">
      <div className="lp-pricing-header">
        <p className="lp-pricing-label">Tarifs</p>
        <h2 className="lp-pricing-h2">Choisis ton plan</h2>
        <p className="lp-pricing-subtitle">
          Commence gratuit. Passe à Élio + quand on te fait gagner plus.
        </p>
      </div>

      <div
        className="lp-pricing-toggle"
        role="radiogroup"
        aria-label="Choix de la fréquence de facturation"
      >
        <div className="lp-pricing-toggle-track">
          <button
            type="button"
            role="radio"
            aria-checked={billing === 'monthly'}
            className={`lp-pricing-toggle-option ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            Mensuel
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={billing === 'annual'}
            className={`lp-pricing-toggle-option ${billing === 'annual' ? 'active' : ''}`}
            onClick={() => setBilling('annual')}
          >
            Annuel
          </button>
        </div>
        <span className="lp-pricing-toggle-savings">
          {billing === 'monthly' ? (
            'Économise 20% en annuel'
          ) : (
            <>
              <Check className="lp-pricing-toggle-savings-check" aria-hidden="true" />
              20% économisés
            </>
          )}
        </span>
      </div>

      <div className="lp-pricing-grid">
        {/* Carte Découverte */}
        <article className="lp-pricing-card">
          <h3 className="lp-pricing-card-name">Découverte</h3>
          <p className="lp-pricing-card-tagline">Pour découvrir Élio</p>
          <p className="lp-pricing-card-price">
            0 €<span className="lp-pricing-card-price-suffix">/mois</span>
          </p>
          <p className="lp-pricing-card-price-yearly">Toujours gratuit</p>
          <ul className="lp-pricing-card-features">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="lp-pricing-card-feature">
                <FeatureCheck />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link to="/quiz" className="ds-btn ds-btn-secondary lp-pricing-card-cta">
            Commencer gratuitement
          </Link>
        </article>

        {/* Carte Élio + featured */}
        <article className="lp-pricing-card featured">
          <span className="lp-pricing-card-badge">Recommandé</span>
          <h3 className="lp-pricing-card-name">Élio +</h3>
          <p className="lp-pricing-card-tagline">Pour récupérer plus, plus vite</p>
          <p className="lp-pricing-card-price">
            {plus.display}
            <span className="lp-pricing-card-price-suffix">{plus.period}</span>
          </p>
          <p className="lp-pricing-card-price-yearly">{plus.complement}</p>
          <ul className="lp-pricing-card-features">
            {PLUS_FEATURES.map((f) => (
              <li key={f.label} className="lp-pricing-card-feature">
                <FeatureCheck />
                <span>{f.emphasis ? <strong>{f.label}</strong> : f.label}</span>
              </li>
            ))}
          </ul>
          <Link to={plusHref} className="ds-btn ds-btn-coral lp-pricing-card-cta">
            Choisir Élio +
          </Link>
        </article>
      </div>
    </section>
  );
}
