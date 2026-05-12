/**
 * ElioFox — Mascot d'Élio, 9 expressions canoniques + 8 animations Lottie.
 *
 * Spec : Charte graphique Élio v1.0, section 07 (Compagnon de marque).
 * V frontal, truffe et contour restent constants entre les expressions.
 * Seuls yeux, sourcils et bouche varient.
 *
 * Couleurs hardcoded — brand fixées par la charte, ne thèment jamais :
 *   #F06449  corail (corps, oreilles)
 *   #0F1E33  navy (yeux, truffe, traits)
 *   #FFFFFF  blanc (V frontal, ventre, reflet œil)
 *   #FFE4DB  peach light (intérieur oreilles)
 *   #FF3D17  corail saturé (joues, cœurs love)
 *
 * Usage:
 *   <ElioFox expression="happy" size={96} />       // SVG statique
 *   <ElioFox animation="bounce" size={96} />       // Lottie lazy-loaded
 *   <ElioFox animation="wave" expression="hi" />   // Suspense fallback explicite
 *
 * Mode statique vs animé :
 * - Si `animation` est défini → prend la priorité sur `expression` et
 *   déclenche le lazy-load du runtime Lottie (chunk séparé ~180 kB).
 *   Pendant le download, fallback SVG = `expression` si fournie, sinon
 *   mapping FALLBACK_EXPRESSION interne.
 * - Sinon → rendu SVG statique (chunk principal, zéro fetch).
 */

import { lazy, Suspense, type ReactNode } from 'react';

export type ElioFoxExpression =
  | 'neutral'    // idle · défaut
  | 'happy'      // gain détecté
  | 'focused'    // calcul en cours
  | 'surprised'  // alerte · découverte
  | 'worried'    // échéance · risque
  | 'proud'      // objectif atteint
  | 'hi'         // clin d'œil · first-open
  | 'sleep'      // off-hours
  | 'love';      // favori ajouté

export type ElioFoxAnimation =
  | 'idle-breathe'
  | 'blink'
  | 'ear-wiggle'
  | 'head-tilt'
  | 'bounce'
  | 'wave'
  | 'thinking'
  | 'sleeping';

export interface ElioFoxProps {
  /** Expression rendue (mode statique ou fallback Suspense). Défaut : `neutral`. */
  expression?: ElioFoxExpression;
  /**
   * Animation Lottie. Si défini, prend la priorité sur `expression` et déclenche
   * le lazy-load du runtime Lottie. Sinon, rendu SVG statique.
   */
  animation?: ElioFoxAnimation;
  /** Taille en pixels (carré). Défaut : `64`. */
  size?: number;
  /** Loop de l'animation. Ignoré si `animation` undefined. */
  loop?: boolean | number;
  /** Autoplay de l'animation. Défaut : `true`. Ignoré si `animation` undefined. */
  autoplay?: boolean;
  /** Callback fin d'animation. Ignoré si `animation` undefined. */
  onComplete?: () => void;
  /** Classes additionnelles. */
  className?: string;
  /** Label accessibilité. Défaut : `'Élio'`. */
  ariaLabel?: string;
}

const FACE_PATHS: Record<ElioFoxExpression, ReactNode> = {
  neutral: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <ellipse cx="158" cy="195" rx="9" ry="13" fill="#0F1E33" />
      <ellipse cx="222" cy="195" rx="9" ry="13" fill="#0F1E33" />
      <circle cx="161" cy="190" r="3" fill="#FFFFFF" />
      <circle cx="225" cy="190" r="3" fill="#FFFFFF" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 190 240 Q 178 256 168 250" stroke="#0F1E33" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 190 240 Q 202 256 212 250" stroke="#0F1E33" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  happy: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <path d="M 145 196 Q 158 184 171 196" stroke="#0F1E33" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 209 196 Q 222 184 235 196" stroke="#0F1E33" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="125" cy="220" rx="14" ry="6" fill="#FF3D17" opacity="0.3" />
      <ellipse cx="255" cy="220" rx="14" ry="6" fill="#FF3D17" opacity="0.3" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 168 250 Q 190 270 212 250" stroke="#0F1E33" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 178 252 Q 190 262 202 252" fill="#FF3D17" opacity="0.5" />
    </>
  ),
  focused: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <ellipse cx="158" cy="198" rx="8" ry="10" fill="#0F1E33" />
      <ellipse cx="222" cy="198" rx="8" ry="10" fill="#0F1E33" />
      <line x1="142" y1="172" x2="172" y2="180" stroke="#0F1E33" strokeWidth="4" strokeLinecap="round" />
      <line x1="208" y1="180" x2="238" y2="172" stroke="#0F1E33" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <line x1="178" y1="252" x2="202" y2="252" stroke="#0F1E33" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  surprised: (
    <>
      <path d="M 100 122 L 78 48 L 142 100 Z" fill="#F06449" />
      <path d="M 280 122 L 302 48 L 238 100 Z" fill="#F06449" />
      <path d="M 110 114 L 100 70 L 132 97 Z" fill="#FFE4DB" />
      <path d="M 270 114 L 280 70 L 248 97 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="212" rx="124" ry="118" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <circle cx="158" cy="195" r="14" fill="#FFFFFF" />
      <circle cx="222" cy="195" r="14" fill="#FFFFFF" />
      <circle cx="158" cy="195" r="11" fill="#0F1E33" />
      <circle cx="222" cy="195" r="11" fill="#0F1E33" />
      <circle cx="161" cy="190" r="3.5" fill="#FFFFFF" />
      <circle cx="225" cy="190" r="3.5" fill="#FFFFFF" />
      <path d="M 144 168 Q 158 162 172 168" stroke="#0F1E33" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 208 168 Q 222 162 236 168" stroke="#0F1E33" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <ellipse cx="190" cy="258" rx="9" ry="11" fill="#0F1E33" opacity="0.85" />
    </>
  ),
  worried: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <ellipse cx="158" cy="198" rx="9" ry="13" fill="#0F1E33" />
      <ellipse cx="222" cy="198" rx="9" ry="13" fill="#0F1E33" />
      <circle cx="161" cy="193" r="3" fill="#FFFFFF" />
      <circle cx="225" cy="193" r="3" fill="#FFFFFF" />
      <line x1="140" y1="170" x2="172" y2="180" stroke="#0F1E33" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="208" y1="180" x2="240" y2="170" stroke="#0F1E33" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 174 256 Q 190 246 206 256" stroke="#0F1E33" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </>
  ),
  proud: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <path d="M 145 200 Q 158 188 171 200" stroke="#0F1E33" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M 209 200 Q 222 188 235 200" stroke="#0F1E33" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 175 252 Q 190 264 205 252" stroke="#0F1E33" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g fill="#F06449">
        <path d="M 100 110 l 3 -8 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 z" />
        <path d="M 290 130 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" />
        <path d="M 320 200 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" />
      </g>
    </>
  ),
  hi: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <ellipse cx="158" cy="195" rx="9" ry="13" fill="#0F1E33" />
      <circle cx="161" cy="190" r="3" fill="#FFFFFF" />
      <path d="M 209 200 Q 222 190 235 200" stroke="#0F1E33" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 178 252 Q 190 262 202 252" stroke="#0F1E33" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  sleep: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" opacity="0.85" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" opacity="0.85" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="220" rx="120" ry="110" fill="#F06449" />
      <path d="M 150 140 Q 190 185 230 140 Q 220 120 190 142 Q 160 120 150 140 Z" fill="#FFFFFF" />
      <path d="M 110 228 Q 110 295 190 305 Q 270 295 270 228 Q 270 255 190 255 Q 110 255 110 228 Z" fill="#FFFFFF" />
      <path d="M 142 200 Q 158 192 174 200" stroke="#0F1E33" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M 206 200 Q 222 192 238 200" stroke="#0F1E33" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="190" cy="240" rx="10" ry="7" fill="#0F1E33" />
      <line x1="178" y1="262" x2="202" y2="262" stroke="#0F1E33" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  love: (
    <>
      <path d="M 100 130 L 78 56 L 142 108 Z" fill="#F06449" />
      <path d="M 280 130 L 302 56 L 238 108 Z" fill="#F06449" />
      <path d="M 110 122 L 100 78 L 132 105 Z" fill="#FFE4DB" />
      <path d="M 270 122 L 280 78 L 248 105 Z" fill="#FFE4DB" />
      <ellipse cx="190" cy="210" rx="120" ry="115" fill="#F06449" />
      <path d="M 150 130 Q 190 175 230 130 Q 220 110 190 132 Q 160 110 150 130 Z" fill="#FFFFFF" />
      <path d="M 110 218 Q 110 285 190 295 Q 270 285 270 218 Q 270 245 190 245 Q 110 245 110 218 Z" fill="#FFFFFF" />
      <path d="M 158 195 c -8 -8 -16 0 -8 8 c 4 4 8 8 8 8 c 0 0 4 -4 8 -8 c 8 -8 0 -16 -8 -8 z" fill="#FF3D17" />
      <path d="M 222 195 c -8 -8 -16 0 -8 8 c 4 4 8 8 8 8 c 0 0 4 -4 8 -8 c 8 -8 0 -16 -8 -8 z" fill="#FF3D17" />
      <ellipse cx="125" cy="222" rx="14" ry="6" fill="#FF3D17" opacity="0.35" />
      <ellipse cx="255" cy="222" rx="14" ry="6" fill="#FF3D17" opacity="0.35" />
      <ellipse cx="190" cy="232" rx="10" ry="7" fill="#0F1E33" />
      <path d="M 168 250 Q 190 270 212 250" stroke="#0F1E33" strokeWidth="4" strokeLinecap="round" fill="none" />
    </>
  ),
};

const FALLBACK_EXPRESSION: Record<ElioFoxAnimation, ElioFoxExpression> = {
  'idle-breathe': 'neutral',
  'blink': 'neutral',
  'ear-wiggle': 'neutral',
  'head-tilt': 'focused',
  'bounce': 'happy',
  'wave': 'hi',
  'thinking': 'focused',
  'sleeping': 'sleep',
};

interface StaticElioFoxProps {
  expression: ElioFoxExpression;
  size: number;
  className?: string;
  ariaLabel?: string;
}

const StaticElioFox = ({
  expression,
  size,
  className,
  ariaLabel,
}: StaticElioFoxProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 380 380"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={ariaLabel}
  >
    {FACE_PATHS[expression]}
  </svg>
);

const ElioFoxAnimated = lazy(() => import('./ElioFoxAnimated'));

export const ElioFox = ({
  expression,
  animation,
  size = 64,
  loop,
  autoplay,
  onComplete,
  className,
  ariaLabel = 'Élio',
}: ElioFoxProps) => {
  if (animation) {
    const fallbackExpr = expression ?? FALLBACK_EXPRESSION[animation];
    return (
      <Suspense
        fallback={
          <StaticElioFox
            expression={fallbackExpr}
            size={size}
            className={className}
            ariaLabel={ariaLabel}
          />
        }
      >
        <ElioFoxAnimated
          animation={animation}
          size={size}
          loop={loop}
          autoplay={autoplay}
          onComplete={onComplete}
          className={className}
          ariaLabel={ariaLabel}
        />
      </Suspense>
    );
  }

  return (
    <StaticElioFox
      expression={expression ?? 'neutral'}
      size={size}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
};

export default ElioFox;
