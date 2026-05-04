import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LandingHeader } from '@/components/landing/Header';
import { LandingHero } from '@/components/landing/Hero';
import { LandingStats } from '@/components/landing/Stats';
import { LandingSteps } from '@/components/landing/Steps';
import { LandingFeatures } from '@/components/landing/Features';
import { LandingPricing } from '@/components/landing/Pricing';
import { LandingTrust } from '@/components/landing/Trust';
import { LandingFAQ } from '@/components/landing/FAQ';
import { LandingFinalCTA } from '@/components/landing/FinalCTA';
import { LandingFooter } from '@/components/landing/Footer';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────── Page
const Welcome = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Élio — Ne perds plus un euro par manque d\'information';
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute(
      'content',
      "Élio est ton copilote administratif et financier. Diagnostic gratuit en 90s. Récupère en moyenne 2 000 €/an d'aides, erreurs fiscales et contrats sous-optimisés.",
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/bulletin" replace />;
  }

  return (
    <div className="min-h-screen bg-ds-bg-primary font-sans text-ds-text-primary">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <LandingHeader />
      <main id="main-content">
        <LandingHero />
        <LandingStats />
        <LandingSteps />
        <LandingFeatures />
        <LandingPricing />
        <LandingTrust />
        <LandingFAQ />
        <LandingFinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Welcome;
