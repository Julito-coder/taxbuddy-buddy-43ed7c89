import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ScanLine,
  Calendar,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { LandingHeader } from '@/components/landing/Header';
import { LandingHero } from '@/components/landing/Hero';
import { Loader2 } from 'lucide-react';

const SIGNUP_HREF = '/quiz';
const LOGIN_HREF = '/auth?mode=login&from=welcome';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.4, ease: 'easeOut' as const },
} as const;

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

// ─────────────────────────────────────── Features (alternating image/text)
const featureBlocks = [
  {
    eyebrow: 'Bulletin quotidien',
    title: 'L\'habitude qui rapporte',
    desc: 'Chaque matin, une action concrète chiffrée en euros. 60 secondes pour récupérer ce qui t\'appartient — pas un formulaire de plus.',
    bullets: ['Action du jour ≤ 60 s', 'Streak quotidien', 'Gain cumulé visible'],
    illustration: 'bulletin' as const,
  },
  {
    eyebrow: 'Détecteur d\'aides',
    title: 'On vérifie pour toi 200+ aides',
    desc: 'APL, prime d\'activité, chèque énergie, MaPrimeRénov\', CMG… 10 milliards d\'euros d\'aides ne sont jamais réclamés chaque année. Élio scanne ta situation et te dit ce que tu peux récupérer.',
    bullets: ['200+ dispositifs nationaux', 'Calcul auto selon ta situation', 'Lien direct vers la démarche'],
    illustration: 'aides' as const,
  },
  {
    eyebrow: 'Agent IA Élio',
    title: 'Toutes tes questions, vraies réponses',
    desc: 'Plus besoin de chercher entre service-public.fr et impots.gouv.fr. Élio connaît les barèmes français à jour et te répond avec ton chiffre, ta situation, ton année fiscale.',
    bullets: ['Barèmes français à jour', 'Réponses chiffrées', '20+ scénarios pré-cadrés'],
    illustration: 'agent' as const,
  },
];

function IllustrationBulletin() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-auto" role="presentation">
      <rect width="320" height="240" rx="20" fill="var(--ds-color-bg-secondary)" />
      <rect x="24" y="24" width="272" height="56" rx="12" fill="var(--ds-color-bg-tertiary)" stroke="var(--ds-color-border-light)" />
      <circle cx="44" cy="52" r="10" fill="var(--ds-color-accent)" />
      <rect x="64" y="42" width="120" height="8" rx="4" fill="var(--ds-color-text-primary)" opacity="0.85" />
      <rect x="64" y="56" width="80" height="6" rx="3" fill="var(--ds-color-text-tertiary)" />
      <rect x="240" y="40" width="48" height="20" rx="10" fill="var(--ds-color-success)" opacity="0.18" />
      <text x="264" y="54" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ds-color-success)" fontFamily="Inter, sans-serif">+220 €</text>
      <rect x="24" y="96" width="272" height="76" rx="12" fill="var(--ds-color-bg-tertiary)" stroke="var(--ds-color-border-light)" />
      <rect x="40" y="112" width="80" height="8" rx="4" fill="var(--ds-color-accent)" />
      <rect x="40" y="128" width="180" height="10" rx="5" fill="var(--ds-color-text-primary)" />
      <rect x="40" y="146" width="140" height="6" rx="3" fill="var(--ds-color-text-tertiary)" />
      <rect x="40" y="184" width="240" height="32" rx="16" fill="var(--ds-color-primary)" />
      <text x="160" y="204" textAnchor="middle" fontSize="11" fontWeight="600" fill="white" fontFamily="Inter, sans-serif">Faire la démarche</text>
    </svg>
  );
}

function IllustrationAides() {
  const items = [
    { y: 30, label: 'APL étudiant', amount: '220 €/mois', color: 'var(--ds-color-success)' },
    { y: 86, label: 'Prime d\'activité', amount: '95 €/mois', color: 'var(--ds-color-success)' },
    { y: 142, label: 'Chèque énergie', amount: '194 €', color: 'var(--ds-color-accent)' },
    { y: 198, label: 'MaPrimeRénov\'', amount: 'À vérifier', color: 'var(--ds-color-text-tertiary)' },
  ];
  return (
    <svg viewBox="0 0 320 240" className="w-full h-auto" role="presentation">
      <rect width="320" height="240" rx="20" fill="var(--ds-color-bg-secondary)" />
      {items.map((it, i) => (
        <g key={i}>
          <rect x="20" y={it.y} width="280" height="44" rx="10" fill="var(--ds-color-bg-tertiary)" stroke="var(--ds-color-border-light)" />
          <circle cx="40" cy={it.y + 22} r="8" fill={it.color} opacity="0.2" />
          <circle cx="40" cy={it.y + 22} r="3" fill={it.color} />
          <text x="58" y={it.y + 20} fontSize="12" fontWeight="600" fill="var(--ds-color-text-primary)" fontFamily="Inter, sans-serif">{it.label}</text>
          <text x="58" y={it.y + 35} fontSize="10" fill="var(--ds-color-text-tertiary)" fontFamily="Inter, sans-serif">Éligible</text>
          <text x="285" y={it.y + 28} textAnchor="end" fontSize="12" fontWeight="700" fill={it.color} fontFamily="Inter, sans-serif">{it.amount}</text>
        </g>
      ))}
    </svg>
  );
}

function IllustrationAgent() {
  return (
    <svg viewBox="0 0 320 240" className="w-full h-auto" role="presentation">
      <rect width="320" height="240" rx="20" fill="var(--ds-color-bg-secondary)" />
      <g>
        <rect x="20" y="24" width="200" height="48" rx="14" fill="var(--ds-color-bg-tertiary)" stroke="var(--ds-color-border-light)" />
        <text x="36" y="44" fontSize="11" fill="var(--ds-color-text-tertiary)" fontFamily="Inter, sans-serif">Toi</text>
        <text x="36" y="60" fontSize="12" fontWeight="500" fill="var(--ds-color-text-primary)" fontFamily="Inter, sans-serif">Combien je peux verser sur</text>
        <text x="36" y="76" fontSize="12" fontWeight="500" fill="var(--ds-color-text-primary)" fontFamily="Inter, sans-serif">mon PER cette année ?</text>
      </g>
      <g>
        <rect x="60" y="100" width="240" height="120" rx="14" fill="var(--ds-color-primary)" />
        <text x="80" y="122" fontSize="11" fill="white" opacity="0.7" fontFamily="Inter, sans-serif">Élio</text>
        <text x="80" y="142" fontSize="12" fontWeight="600" fill="white" fontFamily="Inter, sans-serif">Plafond 2025 : 35 194 €</text>
        <text x="80" y="160" fontSize="11" fill="white" opacity="0.85" fontFamily="Inter, sans-serif">Optimal pour ta TMI 30 % :</text>
        <text x="80" y="180" fontSize="16" fontWeight="700" fill="var(--ds-color-accent-light)" fontFamily="Inter, sans-serif">3 800 €</text>
        <text x="80" y="200" fontSize="11" fill="white" opacity="0.85" fontFamily="Inter, sans-serif">→ -1 140 € d'impôt</text>
      </g>
    </svg>
  );
}

function FeaturesGrid() {
  const ILLU = {
    bulletin: IllustrationBulletin,
    aides: IllustrationAides,
    agent: IllustrationAgent,
  };
  const sideFeatures = [
    { icon: ScanLine, title: 'Scanner fiscal IA', desc: 'Détecte les erreurs et optimisations sur ton avis ou ta déclaration.' },
    { icon: Calendar, title: 'Calendrier prédictif', desc: 'Toutes tes échéances et prélèvements estimés sur 12 mois.' },
    { icon: Calculator, title: 'Simulateurs', desc: 'Immobilier, PACS, freelance, épargne longue. Avec PDF exportable.' },
  ];
  return (
    <section id="features" className="bg-ds-bg-secondary/40 py-ds-24">
      <div className="mx-auto max-w-6xl px-ds-4 sm:px-ds-6">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-ds-3xl font-bold text-ds-text-primary">Tout ce qu'il te faut, dans une seule app</h2>
          <p className="mt-ds-4 text-ds-base text-ds-text-secondary">
            Élio remplace 25 plateformes administratives. On a tout pensé pour toi.
          </p>
        </motion.div>

        <div className="mt-ds-20 space-y-ds-24">
          {featureBlocks.map((f, i) => {
            const Illu = ILLU[f.illustration];
            const reverse = i % 2 === 1;
            return (
              <motion.div
                key={f.title}
                {...fadeUp}
                className={`grid items-center gap-ds-12 lg:grid-cols-2 lg:gap-ds-16 ${reverse ? 'lg:[direction:rtl]' : ''}`}
              >
                <div className="lg:[direction:ltr]">
                  <p
                    className="text-ds-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--ds-color-accent)' }}
                  >
                    {f.eyebrow}
                  </p>
                  <h3 className="mt-ds-3 text-ds-3xl font-bold text-ds-text-primary">{f.title}</h3>
                  <p className="mt-ds-4 text-ds-lg text-ds-text-secondary">{f.desc}</p>
                  <ul className="mt-ds-6 space-y-ds-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-ds-2 text-ds-base text-ds-text-primary">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-ds-success" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:[direction:ltr]" role="img" aria-label={`Illustration : ${f.title}`}>
                  <div className="rounded-ds-xl bg-ds-bg-tertiary p-ds-4 shadow-sm border border-ds-border-light" aria-hidden="true">
                    <Illu />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-ds-24">
          <p className="text-center text-ds-sm font-semibold uppercase tracking-wider text-ds-text-tertiary">
            Et aussi
          </p>
          <div className="mt-ds-6 grid gap-ds-5 sm:grid-cols-3">
            {sideFeatures.map((s, i) => (
              <motion.div key={s.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
                <div className="ds-card h-full">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-ds-md bg-ds-primary/10"
                    style={{ color: 'var(--ds-color-primary)' }}
                  >
                    <s.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h4 className="mt-ds-4 text-ds-lg font-semibold text-ds-text-primary">{s.title}</h4>
                  <p className="mt-ds-2 text-ds-base text-ds-text-secondary">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
