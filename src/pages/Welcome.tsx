import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { LandingHeader } from '@/components/landing/Header';
import { LandingHero } from '@/components/landing/Hero';
import { LandingStats } from '@/components/landing/Stats';
import { LandingSteps } from '@/components/landing/Steps';
import { LandingFeatures } from '@/components/landing/Features';
import { LandingPricing } from '@/components/landing/Pricing';
import { Loader2 } from 'lucide-react';

const SIGNUP_HREF = '/quiz';
const LOGIN_HREF = '/auth?mode=login&from=welcome';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.4, ease: 'easeOut' as const },
} as const;


// ─────────────────────────────────────── Testimonials
function Testimonials() {
  const items = [
    { name: 'Léa, 22 ans', role: 'Étudiante', quote: "J'ai découvert que j'avais droit à 220 €/mois d'APL et à la prime d'activité. En 5 minutes.", initials: 'LM', avatarBg: 'var(--ds-color-primary)' },
    { name: 'Thomas, 29 ans', role: 'Développeur CDI', quote: "Élio m'a fait gagner 680 € sur ma déclaration grâce aux frais réels télétravail.", initials: 'TR', avatarBg: 'var(--ds-color-accent)' },
    { name: 'Sarah & Karim', role: 'Couple, 2 enfants', quote: "On a enfin compris notre quotient familial et optimisé la CMG. 1 200 €/an récupérés.", initials: 'SK', avatarBg: '#4B8264' },
  ];
  return (
    <section className="bg-ds-bg-secondary/40 py-ds-24">
      <div className="mx-auto max-w-7xl px-ds-4 sm:px-ds-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-ds-3xl font-bold text-ds-text-primary">Ils ont récupéré leur argent</h2>
        </motion.div>
        <div className="mt-ds-12 grid gap-ds-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.div key={t.name} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
              <div className="ds-card h-full">
                <div className="flex items-center gap-ds-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-ds-pill text-ds-base font-bold text-ds-text-inverse"
                    style={{ background: t.avatarBg }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-ds-base font-semibold text-ds-text-primary">{t.name}</p>
                    <p className="text-ds-xs text-ds-text-tertiary">{t.role}</p>
                  </div>
                </div>
                <p className="mt-ds-4 text-ds-base text-ds-text-secondary" style={{ lineHeight: 'var(--ds-lh-relaxed)' }}>
                  « {t.quote} »
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="mt-ds-6 text-center text-ds-xs text-ds-text-tertiary">
          Résultats basés sur des profils types représentatifs.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────── FAQ
function FAQ() {
  const items = [
    { q: 'Est-ce que c\'est vraiment gratuit ?', a: "Oui. Le diagnostic, le Score Élio et les actions essentielles sont gratuits, sans carte bancaire. Le plan Premium est optionnel pour débloquer les fonctionnalités avancées." },
    { q: 'Élio remplace-t-il mon comptable ?', a: "Non. Élio fournit des estimations à titre indicatif et te guide vers les bonnes démarches. Pour toute décision fiscale importante, consulte un professionnel habilité." },
    { q: 'Mes données sont-elles en sécurité ?', a: "Tes données sont chiffrées et hébergées en Europe. Tu peux exporter ou supprimer ton compte à tout moment depuis ton profil." },
    { q: 'Puis-je l\'utiliser sur mobile ?', a: "Oui. Élio est une application web installable (PWA) optimisée mobile. Tu peux l'ajouter à ton écran d'accueil iPhone ou Android en un clic." },
    { q: 'Quand passer en Premium ?', a: "Quand Élio t'a déjà fait gagner plus que le prix de l'abonnement. La plupart des utilisateurs récupèrent 10 à 20× le coût annuel." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-ds-4 py-ds-24 sm:px-ds-6">
      <motion.div {...fadeUp} className="text-center">
        <h2 className="text-ds-3xl font-bold text-ds-text-primary">Questions fréquentes</h2>
      </motion.div>
      <motion.div {...fadeUp} className="mt-ds-10">
        <Accordion type="single" collapsible className="space-y-ds-2">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-ds-md border border-ds-border-light bg-ds-bg-tertiary px-ds-4">
              <AccordionTrigger className="text-left text-ds-base font-semibold text-ds-text-primary hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-ds-base text-ds-text-secondary">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────── Final CTA
function FinalCTA() {
  return (
    <section className="px-ds-4 pb-ds-24 sm:px-ds-6">
      <motion.div
        {...fadeUp}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-ds-xl px-ds-8 py-ds-16 text-center sm:px-ds-16 sm:py-ds-20"
        style={{
          background: 'linear-gradient(135deg, var(--ds-color-primary) 0%, #1F4366 60%, var(--ds-color-accent-light) 130%)',
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(60% 60% at 50% 0%, white, transparent)' }} />
        <div className="relative">
          <h2 className="text-ds-3xl font-bold text-ds-text-inverse">
            Commence à récupérer ton argent dès aujourd'hui.
          </h2>
          <p className="mx-auto mt-ds-4 max-w-xl text-ds-base text-ds-text-inverse/85">
            Diagnostic gratuit en 90 secondes. Sans carte bancaire.
          </p>
          <Link to={SIGNUP_HREF} className="ds-btn ds-btn-inverse mt-ds-8">
            Créer mon compte gratuit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────── Footer
function LandingFooter() {
  const linkClass =
    'inline-flex items-center min-h-[44px] text-ds-base text-ds-text-secondary hover:text-ds-primary transition-colors';
  return (
    <footer className="border-t border-ds-border-light bg-ds-bg-secondary/40">
      <div className="mx-auto max-w-7xl px-ds-4 py-ds-16 sm:px-ds-6">
        <div className="grid gap-ds-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-ds-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-ds-md font-bold"
                style={{ background: 'var(--ds-color-primary)', color: 'var(--ds-color-text-inverse)' }}
              >
                É
              </div>
              <span className="text-ds-base font-bold text-ds-text-primary">Élio</span>
            </div>
            <p className="mt-ds-3 text-ds-sm text-ds-text-secondary">
              Le copilote administratif et financier des Français.
            </p>
          </div>
          <div>
            <p className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-primary">Produit</p>
            <ul className="mt-ds-3 space-y-ds-1">
              <li><a href="#features" className={linkClass}>Fonctionnalités</a></li>
              <li><a href="#pricing" className={linkClass}>Tarifs</a></li>
              <li><Link to="/auth" className={linkClass}>Se connecter</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-primary">Ressources</p>
            <ul className="mt-ds-3 space-y-ds-1">
              <li><a href="#faq" className={linkClass}>FAQ</a></li>
              <li><a href="mailto:contact@eliotax.fr" className={linkClass}>Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-ds-xs font-semibold uppercase tracking-wider text-ds-text-primary">Légal</p>
            <ul className="mt-ds-3 space-y-ds-1">
              <li><Link to="/legal/mentions-legales" className={linkClass}>Mentions légales</Link></li>
              <li><Link to="/legal/confidentialite" className={linkClass}>Confidentialité</Link></li>
              <li><Link to="/legal/cgu" className={linkClass}>CGU</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-ds-12 flex flex-col gap-ds-4 border-t border-ds-border-light pt-ds-6 text-ds-xs text-ds-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Élio. Tous droits réservés.</p>
          <p className="flex items-center gap-ds-2">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Élio fournit des estimations à titre indicatif. Pour toute décision fiscale, consulte un professionnel habilité.
          </p>
        </div>
      </div>
    </footer>
  );
}

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
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Welcome;
