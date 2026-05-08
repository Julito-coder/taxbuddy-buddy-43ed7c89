/**
 * ElioLogo — Charte v1.0 Mai 2026 (pages 5-6, 17)
 *
 * - Wordmark "élio" + point coral en suffixe (Inter ExtraBold 800,
 *   tracking -0.045em, lowercase).
 * - Symbol carré arrondi (radius 22%) avec É majuscule + point coral.
 * - 5 variants × 4 modes pour couvrir light/dark/mono/on-coral.
 *
 * API rétro-compatible avec les 4 call sites existants
 * (Sidebar, Auth, Legal, WelcomeStep) — pas de prop variant="full"
 * en usage, le nouveau défaut "horizontal" reproduit le lockup
 * symbol + wordmark.
 */

export type ElioLogoVariant = 'horizontal' | 'symbol' | 'wordmark' | 'compact' | 'favicon';
export type ElioLogoMode = 'light' | 'dark' | 'mono-dark' | 'on-coral';

interface ElioLogoProps {
  variant?: ElioLogoVariant;
  mode?: ElioLogoMode;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

const NAVY = '#0F1E33';
const CREAM = '#F4F2EC';
const CORAL = '#F06449';

const DEFAULT_SIZE: Record<ElioLogoVariant, number> = {
  horizontal: 40,
  symbol: 48,
  wordmark: 32,
  compact: 24,
  favicon: 32,
};

const FONT_STACK = "'Inter', system-ui, -apple-system, sans-serif";

function paint(mode: ElioLogoMode): { letter: string; dot: string } {
  switch (mode) {
    case 'dark':
      return { letter: CREAM, dot: CORAL };
    case 'mono-dark':
      return { letter: CREAM, dot: CREAM };
    case 'on-coral':
      return { letter: CREAM, dot: CREAM };
    case 'light':
    default:
      return { letter: NAVY, dot: CORAL };
  }
}

function symbolBackground(mode: ElioLogoMode): string {
  switch (mode) {
    case 'dark':
    case 'mono-dark':
      return 'rgba(244, 242, 236, 0.06)';
    case 'on-coral':
      return 'transparent';
    case 'light':
    default:
      return CREAM;
  }
}

interface PartProps {
  size: number;
  mode: ElioLogoMode;
}

const Wordmark = ({ size, mode }: PartProps) => {
  const { letter, dot } = paint(mode);
  return (
    <span
      style={{
        fontFamily: FONT_STACK,
        fontWeight: 800,
        letterSpacing: '-0.045em',
        lineHeight: 1,
        fontSize: size * 0.55,
        color: letter,
        display: 'inline-flex',
        alignItems: 'baseline',
        whiteSpace: 'nowrap',
      }}
    >
      élio
      <span style={{ color: dot }} aria-hidden="true">.</span>
    </span>
  );
};

const Symbol = ({ size, mode }: PartProps) => {
  const { letter, dot } = paint(mode);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: symbolBackground(mode),
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontFamily: FONT_STACK,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          fontSize: size * 0.5,
          color: letter,
          display: 'inline-flex',
          alignItems: 'baseline',
        }}
      >
        É
        <span style={{ color: dot, marginLeft: -size * 0.04 }}>.</span>
      </span>
    </span>
  );
};

export const ElioLogo = ({
  variant = 'horizontal',
  mode = 'light',
  size,
  className,
  ariaLabel = 'Élio',
}: ElioLogoProps) => {
  const renderSize = size ?? DEFAULT_SIZE[variant];

  if (variant === 'symbol' || variant === 'favicon') {
    return (
      <span
        className={className}
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'inline-flex' }}
      >
        <Symbol size={renderSize} mode={mode} />
      </span>
    );
  }

  if (variant === 'wordmark' || variant === 'compact') {
    return (
      <span
        className={className}
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'inline-flex' }}
      >
        <Wordmark size={renderSize} mode={mode} />
      </span>
    );
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: renderSize * 0.3,
      }}
    >
      <Symbol size={renderSize} mode={mode} />
      <Wordmark size={renderSize} mode={mode} />
    </span>
  );
};
