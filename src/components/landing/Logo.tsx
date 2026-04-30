import { Link } from 'react-router-dom';

interface LandingLogoProps {
  to?: string;
}

export function LandingLogo({ to = '/welcome' }: LandingLogoProps) {
  return (
    <Link to={to} className="lp-logo" aria-label="Élio — Accueil">
      <span className="lp-logo-mark" aria-hidden="true">é</span>
      <span className="lp-logo-word">élio</span>
    </Link>
  );
}
