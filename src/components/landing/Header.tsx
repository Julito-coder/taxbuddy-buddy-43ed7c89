import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { LandingLogo } from './Logo';

const SIGNUP_HREF = '/quiz';
const LOGIN_HREF = '/auth?mode=login&from=welcome';

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lp-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="lp-header-inner">
        <LandingLogo />

        <nav className="lp-nav" aria-label="Navigation principale">
          <a href="#features" className="lp-nav-link">Fonctionnalités</a>
          <a href="#pricing" className="lp-nav-link">Tarifs</a>
          <a href="#faq" className="lp-nav-link">FAQ</a>
        </nav>

        <div className="lp-header-cta">
          <Link to={LOGIN_HREF} className="ds-btn ds-btn-sm ds-btn-ghost">
            Se connecter
          </Link>
          <Link to={SIGNUP_HREF} className="ds-btn ds-btn-sm ds-btn-primary">
            Commencer
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="lp-mobile-menu"
          className="lp-header-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div id="lp-mobile-menu" className="lp-mobile-menu">
          <a href="#features" onClick={() => setOpen(false)} className="lp-nav-link">Fonctionnalités</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="lp-nav-link">Tarifs</a>
          <a href="#faq" onClick={() => setOpen(false)} className="lp-nav-link">FAQ</a>
          <div className="lp-mobile-cta">
            <Link to={LOGIN_HREF} className="ds-btn ds-btn-secondary w-full">Se connecter</Link>
            <Link to={SIGNUP_HREF} className="ds-btn ds-btn-primary w-full">Commencer gratuitement</Link>
          </div>
        </div>
      )}
    </header>
  );
}
