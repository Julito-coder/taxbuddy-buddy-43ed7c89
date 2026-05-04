import { useEffect, useState } from 'react';

type Options = {
  duration?: number;
  start?: boolean;
};

const DEFAULTS = { duration: 1500, start: false };

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 4);

export function useCountUp(target: number, opts: Options = {}): number {
  const { duration, start } = { ...DEFAULTS, ...opts };
  const [value, setValue] = useState<number>(() =>
    !start ? 0 : prefersReducedMotion() ? target : 0,
  );

  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      setValue(Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
