import { useEffect, useRef } from 'react';

const TILT_AMPLITUDE = 15;
const MOBILE_BREAKPOINT = 1024;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useMousemoveTilt<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (prefersReducedMotion() || isMobile()) {
      node.style.setProperty('--tilt-x', '0deg');
      node.style.setProperty('--tilt-y', '0deg');
      return;
    }

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const apply = () => {
      node.style.setProperty('--tilt-x', `${pendingX}deg`);
      node.style.setProperty('--tilt-y', `${pendingY}deg`);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;
      pendingY = (xRatio - 0.5) * 2 * TILT_AMPLITUDE;
      pendingX = -(yRatio - 0.5) * 2 * TILT_AMPLITUDE;
      node.classList.remove('is-leaving');
      if (raf === 0) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      pendingX = 0;
      pendingY = 0;
      node.classList.add('is-leaving');
      if (raf === 0) raf = requestAnimationFrame(apply);
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);
    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
