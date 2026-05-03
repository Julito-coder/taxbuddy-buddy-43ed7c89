import { useEffect, useRef } from 'react';

const TILT_MIN = -8;
const TILT_MAX = 4;
const FACTOR = -0.015;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function usePhoneTilt<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion()) {
      node.style.setProperty('--tilt', '0deg');
      return;
    }

    let raf = 0;
    const update = () => {
      const tilt = Math.max(TILT_MIN, Math.min(TILT_MAX, window.scrollY * FACTOR + TILT_MAX));
      node.style.setProperty('--tilt', `${tilt}deg`);
      raf = 0;
    };
    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
