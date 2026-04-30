import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type MascotState = 'idle' | 'thinking' | 'speaking';

interface Props {
  state?: MascotState;
  size?: number;
}

export const ElioMascot3D = ({ state = 'idle', size }: Props) => {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const renderSize = size ?? (isMobile ? 160 : 200);

  // Float : géré par CSS keyframes (animate-elio-float) pour éviter toute
  // interruption due aux re-renders React/Framer Motion.

  // Eye animation (thinking state)
  const eyeAnim =
    state === 'thinking' && !reduce
      ? { scale: [1, 1.15, 1] }
      : { scale: 1 };
  const eyeTransition =
    state === 'thinking' && !reduce
      ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 0 };

  // Smile animation (speaking state)
  const smileAnim =
    state === 'speaking' && !reduce
      ? { opacity: [0.7, 1, 0.7] }
      : { opacity: 0.7 };
  const smileTransition =
    state === 'speaking' && !reduce
      ? { duration: 1, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 0 };

  return (
    <div
      className="relative inline-block overflow-visible"
      style={{
        width: renderSize,
        height: renderSize,
        perspective: 800,
        perspectiveOrigin: '50% 50%',
      }}
      role="img"
      aria-label="Élio, ton agent fiscal"
    >
      {/* Glow coral derrière — taille proportionnelle pour éviter de déborder
          du viewport sur mobile lorsque la mascotte est petite (40px). */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '50% 50% auto auto',
          transform: 'translate(50%, -50%)',
          width: Math.max(renderSize * 1.6, 80),
          height: Math.max(renderSize * 1.6, 80),
          background: 'radial-gradient(circle, var(--coral-500) 0%, rgba(240,100,73,0) 65%)',
          opacity: 0.4,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <div
        className={reduce ? '' : 'animate-elio-float'}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          filter:
            'drop-shadow(0 8px 24px rgba(28, 59, 90, 0.25)) drop-shadow(0 16px 48px rgba(240, 100, 73, 0.15))',
        }}
      >
        <svg
          viewBox="-50 -50 100 110"
          width="100%"
          height="100%"
          aria-hidden="true"
        >
          {/* Bulle navy */}
          <path
            d="M 0,-36 C 20,-36 36,-20 36,0 C 36,16 26,30 14,34 L 22,44 C 16,40 8,36 0,36 C -20,36 -36,20 -36,0 C -36,-20 -20,-36 0,-36 Z"
            fill="hsl(var(--primary))"
          />

          {/* Œil coral */}
          <motion.circle
            cx={10}
            cy={-8}
            r={6}
            fill="var(--coral-500)"
            animate={eyeAnim}
            transition={eyeTransition}
            style={{ transformOrigin: '10px -8px' }}
          />

          {/* Sourire arc */}
          <motion.path
            d="M -12,8 Q 0,18 12,8"
            stroke="var(--coral-400)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            animate={smileAnim}
            transition={smileTransition}
          />
        </svg>
      </motion.div>
    </div>
  );
};
