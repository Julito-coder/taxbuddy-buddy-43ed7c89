/**
 * ElioFoxAnimated — Wrapper Lottie pour les 8 animations canoniques d'Élio.
 *
 * Composant chargé en lazy depuis ElioFox.tsx via React.lazy. Importe
 * `lottie-react` (≈180 kB) qui se retrouve donc dans un chunk séparé
 * du bundle principal.
 *
 * Charge dynamiquement le JSON Bodymovin correspondant à `animation`
 * via fetch (pas d'import statique → JSON restent en assets servis
 * depuis /public/lottie/, mis en cache par le navigateur).
 *
 * En cas d'échec fetch (404, network, JSON invalide), fallback silencieux :
 * appel d'onComplete et rendu null (le parent Suspense a déjà affiché
 * un SVG statique de fallback).
 */

import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import type { ElioFoxAnimation } from './ElioFox';

export interface ElioFoxAnimatedProps {
  animation: ElioFoxAnimation;
  size?: number;
  loop?: boolean | number;
  autoplay?: boolean;
  onComplete?: () => void;
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_LOOP: Record<ElioFoxAnimation, boolean> = {
  'idle-breathe': true,
  'blink': true,
  'ear-wiggle': true,
  'head-tilt': false,
  'bounce': false,
  'wave': false,
  'thinking': true,
  'sleeping': true,
};

export const ElioFoxAnimated = ({
  animation,
  size = 64,
  loop,
  autoplay = true,
  onComplete,
  className,
  ariaLabel = 'Élio',
}: ElioFoxAnimatedProps) => {
  const [data, setData] = useState<object | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    fetch(`/lottie/elio-${animation}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Lottie JSON unavailable');
        return res.json();
      })
      .then((json: object) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) onCompleteRef.current?.();
      });
    return () => {
      cancelled = true;
    };
  }, [animation]);

  if (!data) return null;

  return (
    <Lottie
      animationData={data}
      loop={loop ?? DEFAULT_LOOP[animation]}
      autoplay={autoplay}
      onComplete={onComplete}
      style={{ width: size, height: size }}
      aria-label={ariaLabel}
      className={className}
    />
  );
};

export default ElioFoxAnimated;
