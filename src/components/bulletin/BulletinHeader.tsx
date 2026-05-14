import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { ElioFox, type ElioFoxAnimation } from '@/components/brand/ElioFox';

interface BulletinHeaderProps {
  userName: string;
  currentStreak: number;
}

type GreetingParts = { textBefore: string; name: string; textAfter: string };

function getGreeting(name: string): GreetingParts {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { textBefore: 'Bonjour, ', name, textAfter: '.' };
  if (hour >= 12 && hour < 18) return { textBefore: '', name, textAfter: ", le bulletin t'attend." };
  return { textBefore: 'Bonsoir, ', name, textAfter: '.' };
}

function getWeekendGreeting(name: string): GreetingParts {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { textBefore: 'Bon week-end, ', name, textAfter: '.' };
  return { textBefore: "Ton week-end, côté admin.", name: '', textAfter: '' };
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
  const parts = weekend ? getWeekendGreeting(userName || 'toi') : getGreeting(userName || 'toi');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-5 pt-8 pb-4 lg:px-8 lg:pt-12 lg:pb-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
        {currentStreak >= 3 && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-1.5 text-coral-700 text-xs font-medium"
          >
            <Flame className="h-3.5 w-3.5" />
            {currentStreak} jours de suite
          </motion.span>
        )}
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-ds-text-primary mt-2">
        {parts.textBefore}
        {parts.name && <span className="capitalize">{parts.name.toLowerCase()}</span>}
        {parts.textAfter}
      </h1>
    </motion.div>
  );
};
