import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';
import { LandingLogo } from './Logo';

const PRODUIT_LINKS = [
  { label: 'Comment ça marche', href: '#how' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

type ResourceLink = { label: string; href?: string; to?: string };

const RESSOURCES_LINKS: ResourceLink[] = [
  { label: 'Sources officielles', href: '#trust' },
  { label: 'Blog', to: '/blog' },
  { label: 'Glossaire fiscal', to: '/glossaire' },
  { label: 'Contact', href: 'mailto:contact@eliotax.fr' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', to: '/legal/mentions-legales' },
  { label: 'Politique de confidentialité', to: '/legal/confidentialite' },
  { label: 'CGU', to: '/legal/cgu' },
];

const LINKEDIN_URL = 'https://www.linkedin.com/in/jules-peron-08b3b8255';

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-grid">
          {/* Col 1 — Brand */}
          <div className="lp-footer-brand">
            <div className="lp-footer-brand-logo">
              <LandingLogo to="/" />
            </div>
            <p className="lp-footer-brand-tagline">
              Le copilote administratif et financier des Français. Récupère ce qui te revient en 90 secondes.
            </p>
          </div>

          {/* Col 2 — Produit */}
          <nav aria-label="Produit">
            <p className="lp-footer-col-title">Produit</p>
            <ul className="lp-footer-col-list">
              {PRODUIT_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="lp-footer-col-link">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Ressources */}
          <nav aria-label="Ressources">
            <p className="lp-footer-col-title">Ressources</p>
            <ul className="lp-footer-col-list">
              {RESSOURCES_LINKS.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link to={l.to} className="lp-footer-col-link">{l.label}</Link>
                  ) : (
                    <a href={l.href} className="lp-footer-col-link">{l.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4 — Légal */}
          <nav aria-label="Légal">
            <p className="lp-footer-col-title">Légal</p>
            <ul className="lp-footer-col-list">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="lp-footer-col-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="lp-footer-bottom">
          <p className="lp-footer-copyright">© {year} Élio</p>
          <p className="lp-footer-mention">Hébergé en France · Données 100% sécurisées</p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Jules Peron, fondateur d'Élio"
            className="lp-footer-social-link"
          >
            <Linkedin aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
