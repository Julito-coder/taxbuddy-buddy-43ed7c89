import { TrendingUp, Minus } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ElioFox, type ElioFoxAnimation } from '@/components/brand/ElioFox';

interface GainCumuleProps {
  totalCents: number;
  weeklyDeltaCents: number;
}

function formatEuros(cents: number): string {
  const euros = Math.round(cents / 100);
  return euros.toLocaleString('fr-FR') + ' €';
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayed, setDisplayed] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayed(value);
      return;
    }
    hasAnimated.current = true;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplayed(Math.round(v)),
    });
    return controls.stop;
  }, [value]);

  return <>{displayed.toLocaleString('fr-FR')} €</>;
};

/**
 * Taille responsive ElioFox dans la carte hero : 80px < lg, 100px ≥ lg.
 */
function useResponsiveFoxSize(): number {
  const getSize = () => {
    if (typeof window === 'undefined') return 80;
    return window.matchMedia('(min-width: 1024px)').matches ? 100 : 80;
  };
  const [size, setSize] = useState(getSize);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = () => setSize(mq.matches ? 100 : 80);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return size;
}

export const GainCumule = ({ totalCents, weeklyDeltaCents }: GainCumuleProps) => {
  const isPositiveDelta = weeklyDeltaCents > 0;
  const foxSize = useResponsiveFoxSize();

  // State machine α inline : wave intro one-shot → idle-breathe loop.
  const [anim, setAnim] = useState<ElioFoxAnimation>('wave');

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          className="bg-ds-primary rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 lg:p-8 mx-5 lg:mx-8 cursor-pointer min-h-[140px] lg:min-h-[160px]"
        >
          <div className="flex flex-row items-center gap-4 lg:gap-6 h-full">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 font-medium">Élio t'a fait gagner</p>
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
                className="text-5xl lg:text-6xl font-bold text-coral-500 mt-2"
              >
                <AnimatedNumber value={Math.round(totalCents / 100)} />
              </motion.p>
              <p className="text-sm text-white/60 mt-1">cette année</p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-1.5 mt-3"
              >
                {isPositiveDelta ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">
                      + {formatEuros(weeklyDeltaCents)} cette semaine
                    </span>
                  </>
                ) : (
                  <>
                    <Minus className="h-4 w-4 text-white/60" />
                    <span className="text-sm font-medium text-white/60">
                      stable cette semaine
                    </span>
                  </>
                )}
              </motion.div>
            </div>

            <div className="flex-shrink-0">
              <ElioFox
                animation={anim}
                onComplete={() => anim === 'wave' && setAnim('idle-breathe')}
                size={foxSize}
                ariaLabel="Élio te salue"
              />
            </div>
          </div>
        </motion.div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Détail de tes gains</DrawerTitle>
        </DrawerHeader>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Optimisations fiscales</span>
            <span className="font-semibold text-foreground">{formatEuros(Math.round(totalCents * 0.5))}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-sm text-muted-foreground">Aides réclamées</span>
            <span className="font-semibold text-foreground">{formatEuros(Math.round(totalCents * 0.3))}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-sm text-muted-foreground">Contrats optimisés</span>
            <span className="font-semibold text-foreground">{formatEuros(Math.round(totalCents * 0.2))}</span>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
