import { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ElioFox, type ElioFoxAnimation } from '@/components/brand/ElioFox';

export type BulletinEmptyStateVariant = 'E1' | 'E2' | 'E3';

interface BulletinEmptyStateProps {
  state: BulletinEmptyStateVariant;
  completionPct?: number;
  onRefresh?: () => void;
}

/**
 * Taille responsive ElioFox cohérente avec BulletinHeader pour E2/E3 split.
 */
function useResponsiveFoxSize(): number {
  const getSize = () => {
    if (typeof window === 'undefined') return 80;
    return window.matchMedia('(min-width: 1024px)').matches ? 96 : 80;
  };
  const [size, setSize] = useState(getSize);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => setSize(mq.matches ? 96 : 80);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return size;
}

interface VariantConfig {
  intro: ElioFoxAnimation;
  idle: ElioFoxAnimation;
  title: (pct: number) => string;
  body: string;
  ctaLabel?: string;
  ctaTarget?: string;
  showRefresh?: boolean;
}

const VARIANT_CONFIG: Record<BulletinEmptyStateVariant, VariantConfig> = {
  E1: {
    intro: 'wave',
    idle: 'idle-breathe',
    title: () => 'Bienvenue chez Élio !',
    body: "Avant qu'on s'attaque à tout ce que tu peux récupérer, j'ai 5 questions à te poser. Pas plus.",
    ctaLabel: 'Configurer mon profil',
    ctaTarget: '/profil/fiscal',
  },
  E2: {
    intro: 'wave',
    idle: 'idle-breathe',
    title: (pct: number) => `Ton profil est à ${pct}%.`,
    body: 'Encore quelques questions et je peux te dire ce que tu rates chaque année.',
    ctaLabel: 'Compléter mon profil',
    ctaTarget: '/profil/fiscal',
  },
  E3: {
    intro: 'thinking',
    idle: 'thinking',
    title: () => 'Je compile ton premier bulletin…',
    body: 'Cela peut prendre quelques secondes.',
    showRefresh: true,
  },
};

const E1Layout = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
    className="mx-5 lg:mx-8 mt-8 lg:mt-12 bg-card rounded-2xl border border-border shadow-sm p-6 lg:p-10 text-center"
  >
    {children}
  </motion.div>
);

const SplitLayout = ({
  children,
  foxSlot,
}: {
  children: React.ReactNode;
  foxSlot: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
    className="mx-5 lg:mx-8 mt-8 lg:mt-12 bg-card rounded-2xl border border-border shadow-sm p-6 lg:p-8"
  >
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
      <div className="flex justify-center lg:justify-start order-1 lg:order-2 lg:flex-shrink-0">
        {foxSlot}
      </div>
      <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
        {children}
      </div>
    </div>
  </motion.div>
);

export const BulletinEmptyState = ({
  state,
  completionPct = 0,
  onRefresh,
}: BulletinEmptyStateProps) => {
  const navigate = useNavigate();
  const config = VARIANT_CONFIG[state];
  const foxSize = useResponsiveFoxSize();

  // State machine α inline : intro one-shot → idle loop (sauf E3 qui boucle thinking).
  const [anim, setAnim] = useState<ElioFoxAnimation>(config.intro);

  const handleAnimComplete = () => {
    if (anim === config.intro && config.intro !== config.idle) {
      setAnim(config.idle);
    }
  };

  const title = config.title(completionPct);

  const CTA = config.ctaLabel && config.ctaTarget ? (
    <button
      onClick={() => navigate(config.ctaTarget!)}
      className="inline-flex items-center justify-center gap-2 mt-6 h-11 px-6 rounded-xl bg-coral-500 text-white font-semibold hover:bg-coral-700 transition-colors"
    >
      {config.ctaLabel}
      <ArrowRight className="h-4 w-4" />
    </button>
  ) : null;

  const RefreshBtn = config.showRefresh && onRefresh ? (
    <button
      onClick={onRefresh}
      className="inline-flex items-center justify-center gap-2 mt-6 h-11 px-6 rounded-xl border border-border bg-background text-foreground font-semibold hover:bg-muted/50 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      Rafraîchir
    </button>
  ) : null;

  // E1 — centré pleine largeur (D8) : ElioFox 120px sur mobile, 140px sur desktop.
  if (state === 'E1') {
    return (
      <E1Layout>
        <div className="flex justify-center mb-2">
          <ElioFox
            animation={anim}
            onComplete={handleAnimComplete}
            size={foxSize === 96 ? 140 : 120}
            ariaLabel="Élio te salue"
          />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-4">{title}</h2>
        <p className="text-sm lg:text-base text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          {config.body}
        </p>
        {CTA}
      </E1Layout>
    );
  }

  // E2/E3 — split layout cohérent avec hero (ElioFox à droite desktop, en-dessous mobile).
  return (
    <SplitLayout
      foxSlot={
        <ElioFox
          animation={anim}
          onComplete={handleAnimComplete}
          size={foxSize}
          ariaLabel={state === 'E3' ? 'Élio réfléchit' : 'Élio te salue'}
        />
      }
    >
      <h2 className="text-2xl lg:text-3xl font-bold text-foreground">{title}</h2>
      <p className="text-sm lg:text-base text-muted-foreground mt-3 leading-relaxed">
        {config.body}
      </p>
      {CTA}
      {RefreshBtn}
    </SplitLayout>
  );
};
