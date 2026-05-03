import { memo, type ReactNode } from 'react';

type TrustLogo = { name: string; svg: ReactNode };

const LOGOS: TrustLogo[] = [
  {
    name: 'CAF',
    svg: (
      <svg viewBox="0 0 60 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="22" letterSpacing="0.02em" fill="currentColor">CAF</text>
      </svg>
    ),
  },
  {
    name: 'impots.gouv.fr',
    svg: (
      <svg viewBox="0 0 165 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="20" letterSpacing="0.01em" fill="currentColor">impots.gouv.fr</text>
      </svg>
    ),
  },
  {
    name: 'URSSAF',
    svg: (
      <svg viewBox="0 0 90 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="22" letterSpacing="0.02em" fill="currentColor">URSSAF</text>
      </svg>
    ),
  },
  {
    name: 'France Travail',
    svg: (
      <svg viewBox="0 0 145 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="20" letterSpacing="0" fill="currentColor">France Travail</text>
      </svg>
    ),
  },
  {
    name: 'service-public.fr',
    svg: (
      <svg viewBox="0 0 175 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="20" letterSpacing="0.01em" fill="currentColor">service-public.fr</text>
      </svg>
    ),
  },
  {
    name: 'Insee',
    svg: (
      <svg viewBox="0 0 70 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <text x="0" y="22" fontFamily="Inter, sans-serif" fontWeight="800"
              fontSize="22" letterSpacing="0.02em" fill="currentColor">Insee</text>
      </svg>
    ),
  },
];

function LandingTrustBase() {
  return (
    <section className="lp-trust" id="trust">
      <div className="lp-trust-inner">
        <div className="lp-trust-header">
          <p className="lp-trust-label">Sources officielles</p>
          <h2 className="lp-trust-h2">Élio s'appuie sur les sources officielles</h2>
          <p className="lp-trust-manifesto">
            Aucune approximation. Aucune donnée inventée. Élio puise directement dans les sources
            officielles de l'État français pour te donner des informations fiables — celles qui te
            concernent vraiment.
          </p>
        </div>
        <ul className="lp-trust-logos" aria-label="Sources de données officielles">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="lp-trust-logo" aria-label={logo.name}>
              {logo.svg}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export const LandingTrust = memo(LandingTrustBase);
