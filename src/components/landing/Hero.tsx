import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

const SIGNUP_HREF = '/quiz';

export function LandingHero() {
  return (
    <section className="lp-hero" id="hero">
      <div className="lp-hero-inner">
        <div className="lp-hero-content">
          <span className="lp-hero-badge">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Diagnostic en 90 secondes
          </span>

          <h1 className="lp-hero-h1">
            Combien <span className="lp-accent-text">tu perds</span> chaque année sans le savoir&nbsp;?
          </h1>

          <p className="lp-hero-description">
            Élio scanne tes impôts, tes aides oubliées et tes contrats pour te montrer{' '}
            <strong>combien tu peux récupérer</strong>. Sans expertise comptable, sans paperasse.
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

        <div className="lp-hero-visual" aria-hidden="true">
          {/* Phone mockup 3D — Batch 4 */}
        </div>
      </div>
    </section>
  );
}
