import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Sparkles,
  ScanLine,
  Calendar,
  Calculator,
  HandCoins,
  Bot,
  Newspaper,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { ElioLogo } from '@/components/layout/ElioLogo';
import { Loader2 } from 'lucide-react';

const SIGNUP_HREF = '/quiz';
const LOGIN_HREF = '/auth?mode=login&from=welcome';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' as const },
} as const;

// ─────────────────────────────────────── Nav
function LandingNav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl transition-[border-color] duration-200 ${
        scrolled ? 'border-b border-ds-border-light' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/welcome" className="flex items-center" aria-label="Élio — Accueil">
          <ElioLogo variant="compact" size={32} className="sm:hidden" />
          <ElioLogo variant="compact" size={36} className="hidden sm:inline-flex" />
        </Link>
        <nav className="hidden items-center gap-ds-2 md:flex" aria-label="Navigation principale">
          <a href="#features" className="ds-nav-link">Fonctionnalités</a>
          <a href="#pricing" className="ds-nav-link">Tarifs</a>
          <a href="#faq" className="ds-nav-link">FAQ</a>
        </nav>
        <div className="hidden items-center gap-ds-3 md:flex">
          <Link to={LOGIN_HREF} className="ds-btn ds-btn-ghost">
            Se connecter
          </Link>
          <Link to={SIGNUP_HREF} className="ds-btn ds-btn-primary">
            Commencer gratuitement
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <button
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ds-border-light bg-background">
          <div className="flex flex-col gap-ds-1 px-ds-4 py-ds-3">
            <a href="#features" onClick={() => setOpen(false)} className="ds-nav-link justify-start">Fonctionnalités</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="ds-nav-link justify-start">Tarifs</a>
            <a href="#faq" onClick={() => setOpen(false)} className="ds-nav-link justify-start">FAQ</a>
            <div className="mt-ds-2 flex flex-col gap-ds-2 border-t border-ds-border-light pt-ds-3">
              <Link to={LOGIN_HREF} className="ds-btn ds-btn-secondary w-full">Se connecter</Link>
              <Link to={SIGNUP_HREF} className="ds-btn ds-btn-primary w-full">Commencer gratuitement</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────── Hero
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 80% 0%, hsl(37 55% 51% / 0.18), transparent 60%), radial-gradient(60% 50% at 10% 20%, hsl(210 53% 23% / 0.12), transparent 60%)',
        }}
      />
      <div className="relative mx-auto grid max-w-7xl gap-ds-12 px-ds-4 py-ds-16 sm:px-ds-6 sm:py-ds-20 lg:grid-cols-2 lg:gap-ds-16 lg:py-ds-24">
        <motion.div {...fadeUp} className="flex flex-col justify-center">
          <span
            className="inline-flex w-fit items-center gap-ds-2 rounded-ds-pill border border-ds-accent/30 bg-ds-accent/10 px-ds-3 py-ds-1 text-ds-xs font-medium"
            style={{ color: 'var(--ds-color-accent)' }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Diagnostic gratuit en 90 secondes
          </span>
          <h1
            className="mt-ds-6 text-ds-4xl font-bold tracking-tight text-ds-text-primary"
            style={{ lineHeight: 'var(--ds-lh-tight)' }}
          >
            Ne perds plus un euro par{' '}
            <span className="gradient-text">manque d'information.</span>
          </h1>
          <p className="mt-ds-5 max-w-xl text-ds-lg text-ds-text-secondary">
            Élio est ton copilote administratif et financier. Aides oubliées, erreurs fiscales, contrats sous-optimisés — on récupère en moyenne{' '}
            <strong className="text-ds-text-primary font-semibold">2 000 € par an</strong> pour toi.
          </p>
          <div className="mt-ds-8 flex flex-col gap-ds-3 sm:flex-row sm:items-center">
            <Link to={SIGNUP_HREF} className="ds-btn ds-btn-primary w-full sm:w-auto">
              Créer mon compte gratuit
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="#how" className="ds-btn ds-btn-ghost w-full sm:w-auto">
              Voir comment ça marche →
            </a>
          </div>
          <div className="mt-ds-5 flex flex-wrap items-center gap-x-ds-4 gap-y-ds-2 text-ds-xs text-ds-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-ds-success" aria-hidden="true" />
              Sans CB
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-ds-success" aria-hidden="true" />
              Diagnostic offert
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-ds-success" aria-hidden="true" />
              2 minutes
            </span>
          </div>
          <p className="mt-ds-4 text-ds-xs text-ds-text-tertiary">
            Déjà <strong className="text-ds-text-secondary font-semibold">1 200+ diagnostics</strong> réalisés ce mois-ci.
          </p>
        </motion.div>

        {/* Mockup — décoratif, exposé comme image unique aux lecteurs d'écran */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="relative flex items-center justify-center"
          role="img"
          aria-label="Aperçu de l'interface Élio : tableau de bord personnalisé avec score, action du jour et montant récupérable"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/20 blur-2xl" aria-hidden="true" />
          <div aria-hidden="true" className="w-full max-w-sm rounded-[2rem] border border-ds-border-light bg-ds-bg-tertiary p-ds-4 shadow-2xl">
            <div className="rounded-2xl bg-ds-bg-primary p-ds-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-ds-xs font-medium text-ds-text-tertiary">Mardi 29 avril</p>
                  <p className="text-ds-lg font-bold text-ds-text-primary">Bonjour Léa</p>
                </div>
                <div className="rounded-ds-pill bg-ds-success/15 px-ds-3 py-ds-1 text-ds-xs font-semibold" style={{ color: 'var(--ds-color-success)' }}>
                  +420 €
                </div>
              </div>
              <div className="mt-ds-4 rounded-ds-md border border-ds-border-light bg-ds-bg-tertiary p-ds-4">
                <p className="text-ds-xs font-medium uppercase tracking-wider" style={{ color: 'var(--ds-color-accent)' }}>Action du jour</p>
                <p className="mt-ds-1 font-semibold text-ds-text-primary">Demande l'APL étudiant</p>
                <p className="mt-ds-1 text-ds-xs text-ds-text-secondary">Tu as droit à environ 220 €/mois.</p>
                <div className="mt-ds-3 flex h-9 items-center justify-center rounded-ds-pill bg-ds-primary text-ds-text-inverse text-ds-xs font-medium">
                  Faire la démarche
                </div>
              </div>
              <div className="mt-ds-3 grid grid-cols-2 gap-ds-2">
                <div className="rounded-ds-md border border-ds-border-light bg-ds-bg-tertiary p-ds-3">
                  <p className="text-[10px] font-medium uppercase text-ds-text-tertiary">Score Élio</p>
                  <p className="text-ds-2xl font-bold text-ds-primary">72</p>
                </div>
                <div className="rounded-ds-md border border-ds-border-light bg-ds-bg-tertiary p-ds-3">
                  <p className="text-[10px] font-medium uppercase text-ds-text-tertiary">Récupérable</p>
                  <p className="text-ds-2xl font-bold" style={{ color: 'var(--ds-color-accent)' }}>2 140 €</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────── Social proof
function SocialProof() {
  const stats = [
    { value: '10 Md€', label: "d'aides non réclamées chaque année en France" },
    { value: '2 000 €', label: 'récupérables en moyenne par foyer' },
    { value: '90 s', label: 'pour ton premier diagnostic' },
  ];
  return (
    <section className="border-y border-ds-border-light bg-ds-bg-secondary/50">
      <div className="mx-auto grid max-w-7xl gap-ds-8 px-ds-4 py-ds-12 sm:grid-cols-3 sm:px-ds-6">
        {stats.map((s, i) => (
          <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }} className="text-center">
            <p className="text-ds-3xl font-bold text-ds-primary">{s.value}</p>
            <p className="mt-ds-2 text-ds-sm text-ds-text-secondary">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────── How it works
function HowItWorks() {
  const steps = [
    { n: 1, title: 'Réponds au quiz', desc: '5 à 7 questions, en swipe. Pas de formulaire interminable.' },
    { n: 2, title: 'Reçois ton Score Élio', desc: 'Un score de 0 à 100, ton montant récupérable et le top 3 des actions.' },
    { n: 3, title: 'Agis chaque matin', desc: 'Ton bulletin quotidien : une action concrète, en 60 secondes.' },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-ds-4 py-ds-24 sm:px-ds-6">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-ds-3xl font-bold text-ds-text-primary">Comment ça marche</h2>
        <p className="mt-ds-4 text-ds-base text-ds-text-secondary">
          Trois étapes pour transformer l'admin en habitude qui rapporte.
        </p>
      </motion.div>
      <div className="mt-ds-12 grid gap-ds-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div key={s.n} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
            <div className="ds-card h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-ds-pill bg-ds-primary text-ds-text-inverse font-bold">
                {s.n}
              </div>
              <h3 className="mt-ds-4 text-ds-2xl font-semibold text-ds-text-primary">{s.title}</h3>
              <p className="mt-ds-2 text-ds-base text-ds-text-secondary">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────── Features
function FeaturesGrid() {
  const features = [
    { icon: Newspaper, title: 'Bulletin quotidien', desc: "L'habitude qui rapporte. Une action, un gain en euros, chaque matin." },
    { icon: ScanLine, title: 'Scanner fiscal IA', desc: 'Détecte les erreurs et optimisations sur ton avis ou ta déclaration.' },
    { icon: HandCoins, title: 'Détecteur d\'aides', desc: "APL, prime d'activité, MaPrimeRénov', chèque énergie… on vérifie pour toi." },
    { icon: Calendar, title: 'Calendrier prédictif', desc: 'Toutes tes échéances et prélèvements estimés sur 12 mois.' },
    { icon: Calculator, title: 'Simulateurs', desc: 'Immobilier, PACS, freelance, épargne longue. Avec PDF exportable.' },
    { icon: Bot, title: 'Agent IA Élio', desc: 'Pose tes questions. Réponses chiffrées avec les vrais barèmes français.' },
  ];
  return (
    <section id="features" className="bg-ds-bg-secondary/40 py-ds-24">
      <div className="mx-auto max-w-7xl px-ds-4 sm:px-ds-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-ds-3xl font-bold text-ds-text-primary">Tout ce qu'il te faut, dans une seule app</h2>
          <p className="mt-ds-4 text-ds-base text-ds-text-secondary">
            Élio remplace 25 plateformes administratives. On a tout pensé pour toi.
          </p>
        </motion.div>
        <div className="mt-ds-12 grid gap-ds-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div key={f.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
              <div className="ds-card h-full">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-ds-md bg-ds-primary/10"
                  style={{ color: 'var(--ds-color-primary)' }}
                >
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-ds-4 text-ds-xl font-semibold text-ds-text-primary">{f.title}</h3>
                <p className="mt-ds-2 text-ds-base text-ds-text-secondary">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────── Pricing
function Pricing() {
  const free = [
    'Diagnostic complet + Score Élio',
    'Top 3 actions personnalisées',
    'Calendrier sans montants',
    '1 scan fiscal par mois',
    'Agent IA limité (5 requêtes/jour)',
  ];
  const premium = [
    'Tout le plan Gratuit',
    'Calendrier avec montants + trésorerie',
    'Scans fiscaux illimités',
    'Agent IA illimité + actions + exports',
    'Simulateurs complets + PDF',
    'Coffre-fort 5 Go',
    'Coach fiscal proactif',
  ];
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-ds-4 py-ds-24 sm:px-ds-6">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="text-ds-3xl font-bold text-ds-text-primary">Des tarifs simples</h2>
        <p className="mt-ds-4 text-ds-base text-ds-text-secondary">
          Commence gratuitement. Passe en Premium quand Élio te rapporte.
        </p>
      </motion.div>
      <div className="mx-auto mt-ds-12 grid max-w-4xl items-stretch gap-ds-6 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <div className="ds-card flex h-full flex-col p-ds-8">
            <h3 className="text-ds-xl font-semibold text-ds-text-primary">Gratuit</h3>
            <p className="mt-ds-1 text-ds-sm text-ds-text-secondary">Pour découvrir Élio</p>
            <p className="mt-ds-6 text-ds-4xl font-bold text-ds-text-primary">
              0 €<span className="text-ds-base font-normal text-ds-text-tertiary">/mois</span>
            </p>
            <ul className="mt-ds-6 flex-1 space-y-ds-3">
              {free.map((f) => (
                <li key={f} className="flex items-start gap-ds-2 text-ds-base text-ds-text-primary">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ds-success" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to={SIGNUP_HREF} className="ds-btn ds-btn-secondary w-full mt-ds-8">
              Commencer gratuitement
            </Link>
          </div>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <div className="ds-card-elevated relative flex h-full flex-col">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-ds-pill px-ds-3 py-ds-1 text-ds-xs font-semibold uppercase tracking-wider"
              style={{ background: 'var(--ds-color-accent)', color: 'var(--ds-color-text-inverse)' }}
            >
              Le plus populaire
            </div>
            <h3 className="text-ds-xl font-semibold text-ds-text-primary">Premium</h3>
            <p className="mt-ds-1 text-ds-sm text-ds-text-secondary">Pour récupérer chaque euro</p>
            <p className="mt-ds-6 text-ds-4xl font-bold text-ds-text-primary">
              9,99 €<span className="text-ds-base font-normal text-ds-text-tertiary">/mois</span>
            </p>
            <p className="text-ds-xs text-ds-text-tertiary">ou 99 €/an (2 mois offerts)</p>
            <ul className="mt-ds-6 flex-1 space-y-ds-3">
              {premium.map((f) => (
                <li key={f} className="flex items-start gap-ds-2 text-ds-base text-ds-text-primary">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ds-success" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <Link to={SIGNUP_HREF} className="ds-btn ds-btn-primary w-full mt-ds-8">
              Commencer gratuitement
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

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
  const [scrolled, setScrolled] = useState(false);

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

  // Header sticky : ajoute une fine bordure dès qu'on scrolle.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <LandingNav scrolled={scrolled} />
      <main id="main-content">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <FeaturesGrid />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Welcome;
