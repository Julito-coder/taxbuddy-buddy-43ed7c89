import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePhoneTilt } from './hooks/usePhoneTilt';

const SIGNUP_HREF = '/quiz';

export function LandingHero() {
  const phoneTiltRef = usePhoneTilt<HTMLDivElement>();
  return (
    <section className="lp-hero" id="hero">
      <div className="lp-hero-inner">
        <div className="lp-hero-content">
          <span className="lp-hero-badge">
            Le pro que tu n'avais pas les moyens de payer.
          </span>

          <h1 className="lp-hero-h1">
            Combien <span className="lp-accent-text">tu perds</span> chaque année sans le savoir&nbsp;?
          </h1>

          <p className="lp-hero-description">
            Élio détecte ce que tu peux récupérer en 90 secondes. Aides oubliées,
            optimisations fiscales, contrats sous-optimisés — <strong>tout, sans
            expert-comptable.</strong>
          </p>

          <div className="lp-hero-actions">
            <Link to={SIGNUP_HREF} className="ds-btn ds-btn-coral">
              Faire mon diagnostic
              <ArrowRight aria-hidden="true" />
            </Link>
            <a href="#how" className="ds-btn ds-btn-secondary">
              Comment ça marche
            </a>
          </div>

          <p className="lp-hero-subtext">Sans CB · Diagnostic offert · 2 minutes</p>
        </div>

        <div
          className="lp-hero-visual"
          role="img"
          aria-label="Aperçu de l'application Élio : action du jour, score Élio et montant récupérable"
        >
          <div ref={phoneTiltRef} className="lp-phone-wrap" aria-hidden="true">
            <div className="lp-phone-frame">
              <div className="lp-phone-notch" />
              <div className="lp-phone-screen">
                <div className="lp-phone-greeting">
                  <p className="lp-phone-date">Aujourd'hui</p>
                  <p className="lp-phone-name">Bonjour Léa</p>
                </div>

                <div className="lp-phone-action">
                  <p className="lp-phone-action-eyebrow">Tu peux récupérer</p>
                  <p className="lp-phone-action-title">1 240 € de prime d'activité</p>
                  <p className="lp-phone-action-desc">Demande à faire avant le 15 mai.</p>
                  <span className="lp-phone-action-cta">Lancer la démarche →</span>
                </div>

                <div className="lp-phone-stats">
                  <div className="lp-phone-stat">
                    <p className="lp-phone-stat-label">Score Élio</p>
                    <p className="lp-phone-stat-value">72</p>
                  </div>
                  <div className="lp-phone-stat">
                    <p className="lp-phone-stat-label">Récupérable</p>
                    <p className="lp-phone-stat-value coral">2 140 €</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-floating-card top">
              <span className="lp-floating-dot green" />
              +420 € détectés
            </div>
            <div className="lp-floating-card bottom">
              <span className="lp-floating-dot coral" />
              3 nouvelles aides éligibles
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
