import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElioFox, type ElioFoxAnimation } from '@/components/brand/ElioFox';

interface BulletinHeaderProps {
  userName: string;
  currentStreak: number;
}

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Bonjour, ${name}.`;
  if (hour >= 12 && hour < 18) return `${name}, le bulletin t'attend.`;
  return `Bonsoir, ${name}.`;
}

function getWeekendGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Bon week-end, ${name}.`;
  return `Ton week-end, côté admin.`;
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

function formatDateFr(): string {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Taille responsive ElioFox : 80px < lg, 96px ≥ lg.
 * Initial state lu synchroniquement depuis matchMedia (SPA Vite, pas de SSR).
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

export const BulletinHeader = ({ userName, currentStreak }: BulletinHeaderProps) => {
  const dateStr = formatDateFr();
  const weekend = isWeekend();
  const greeting = weekend ? getWeekendGreeting(userName || 'toi') : getGreeting(userName || 'toi');
  const foxSize = useResponsiveFoxSize();

  // D2/D6 — state machine α inline : wave intro one-shot → idle-breathe loop.
  const [anim, setAnim] = useState<ElioFoxAnimation>('wave');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-5 pt-8 pb-4 lg:px-8 lg:pt-12 lg:pb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex-1 min-w-0 order-2 lg:order-1">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
            {currentStreak >= 3 && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-1.5 bg-coral-100 text-coral-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                <Flame className="h-3.5 w-3.5" />
                {currentStreak} jours de suite
              </motion.span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mt-2">
            {greeting}
          </h1>
        </div>
        <div className="flex justify-center lg:justify-end order-1 lg:order-2 lg:flex-shrink-0">
          <ElioFox
            animation={anim}
            onComplete={() => anim === 'wave' && setAnim('idle-breathe')}
            size={foxSize}
            ariaLabel="Élio te salue"
          />
        </div>
      </div>
    </motion.div>
  );
};
