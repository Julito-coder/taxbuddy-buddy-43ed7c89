import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function LandingFinalCTA() {
  return (
    <section className="lp-final-cta">
      <div className="lp-final-cta-inner">
        <div className="lp-final-cta-text">
          <h2 className="lp-final-cta-h2">
            Combien <span className="lp-accent-text">tu perds</span> chaque année sans le savoir&nbsp;?
          </h2>
          <p className="lp-final-cta-paragraph">
            Le diagnostic Élio te donne ton bilan en 90 secondes. Gratuit, sans carte bancaire,
            et tu sauras ce que tu peux récupérer immédiatement.
          </p>
        </div>
        <div className="lp-final-cta-actions">
          <Link to="/quiz" className="ds-btn ds-btn-coral lp-final-cta-primary">
            Faire mon diagnostic
            <ArrowRight className="lp-final-cta-primary-icon" aria-hidden="true" />
          </Link>
          <a href="#pricing" className="ds-btn lp-final-cta-ghost">
            Voir les tarifs
          </a>
        </div>
      </div>
    </section>
  );
}
