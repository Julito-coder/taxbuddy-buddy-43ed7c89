import { useEffect, useRef, useState } from 'react';

type Options = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

const DEFAULTS: Required<Options> = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
  once: true,
};

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useScrollReveal<T extends HTMLElement = HTMLElement>(opts: Options = {}) {
  const { threshold, rootMargin, once } = { ...DEFAULTS, ...opts };
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    // FIX Batch 17.bis : check visibilité immédiate au mount.
    // L'IntersectionObserver ne fire pas son callback initial de manière
    // fiable quand l'élément est déjà intersecting au mount (Hero above-the-fold).
    const rect = node.getBoundingClientRect();
    const inViewport =
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0;

    if (inViewport) {
      setIsVisible(true);
      if (once) return; // si once: true (défaut) et déjà visible, pas besoin d'observer
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
