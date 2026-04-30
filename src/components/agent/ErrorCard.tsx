import { AlertCircle, WifiOff, Sparkles, UserCog, RotateCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type AgentErrorKind = 'network' | 'quota' | 'profile_incomplete' | 'generic';

export interface AgentErrorMeta {
  /** Champs manquants pour le cas profile_incomplete */
  missingFields?: string[];
  /** Code HTTP ou code interne pour debug */
  code?: string;
  /** Message brut renvoyé par le serveur */
  rawMessage?: string;
}

interface Props {
  kind: AgentErrorKind;
  message: string;
  meta?: AgentErrorMeta;
  onRetry?: () => void;
}

const COPY: Record<AgentErrorKind, { title: string; body: (m: AgentErrorMeta | undefined) => string; icon: typeof AlertCircle; tone: 'warn' | 'info' | 'error' }> = {
  network: {
    title: 'Connexion interrompue',
    body: () =>
      "Élio n'a pas pu joindre nos serveurs. Vérifie ta connexion internet, puis réessaie ton message.",
    icon: WifiOff,
    tone: 'warn',
  },
  quota: {
    title: 'Limite quotidienne atteinte',
    body: () =>
      "Tu as utilisé tous tes crédits Élio gratuits pour aujourd'hui. Passe à Premium pour continuer sans limite, ou reviens demain.",
    icon: Sparkles,
    tone: 'info',
  },
  profile_incomplete: {
    title: 'Profil fiscal incomplet',
    body: (m) => {
      const fields = m?.missingFields ?? [];
      if (fields.length === 0) {
        return 'Pour répondre précisément, Élio a besoin de quelques infos supplémentaires sur ton profil fiscal.';
      }
      return `Pour répondre précisément, Élio a besoin de : ${fields.slice(0, 3).join(', ')}${fields.length > 3 ? '…' : ''}.`;
    },
    icon: UserCog,
    tone: 'info',
  },
  generic: {
    title: 'Une erreur est survenue',
    body: () => "Élio est momentanément indisponible. Réessaie dans un instant.",
    icon: AlertCircle,
    tone: 'error',
  },
};

const TONE_STYLES: Record<'warn' | 'info' | 'error', { bg: string; border: string; iconColor: string }> = {
  warn: {
    bg: 'rgba(240, 100, 73, 0.06)',
    border: 'rgba(240, 100, 73, 0.25)',
    iconColor: 'var(--coral-600)',
  },
  info: {
    bg: 'hsl(var(--muted))',
    border: 'hsl(var(--border))',
    iconColor: 'hsl(var(--primary))',
  },
  error: {
    bg: 'hsl(var(--destructive) / 0.08)',
    border: 'hsl(var(--destructive) / 0.25)',
    iconColor: 'hsl(var(--destructive))',
  },
};

export const ErrorCard = ({ kind, message, meta, onRetry }: Props) => {
  const navigate = useNavigate();
  const config = COPY[kind] ?? COPY.generic;
  const tone = TONE_STYLES[config.tone];
  const Icon = config.icon;
  const body = message?.trim() ? message : config.body(meta);

  return (
    <div
      className="rounded-[var(--radius)] border p-4"
      style={{
        backgroundColor: tone.bg,
        borderColor: tone.border,
        maxWidth: '90%',
      }}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon size={20} style={{ color: tone.iconColor }} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p
            className="text-foreground"
            style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.4 }}
          >
            {config.title}
          </p>
          <p
            className="mt-1 text-foreground/80"
            style={{ fontSize: '14px', fontWeight: 450, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}
          >
            {body}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {kind === 'network' && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--coral-500)' }}
              >
                <RotateCw size={15} aria-hidden="true" />
                Réessayer
              </button>
            )}

            {kind === 'quota' && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/profil?tab=abonnement')}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--coral-500)' }}
                >
                  <Sparkles size={15} aria-hidden="true" />
                  Passer à Premium
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/bulletin')}
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  Retour à l'accueil
                </button>
              </>
            )}

            {kind === 'profile_incomplete' && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/profil')}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--coral-500)' }}
                >
                  <UserCog size={15} aria-hidden="true" />
                  Compléter mon profil
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    style={{ borderColor: 'hsl(var(--border))' }}
                  >
                    Réessayer
                  </button>
                )}
              </>
            )}

            {kind === 'generic' && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: 'var(--coral-500)' }}
              >
                <RotateCw size={15} aria-hidden="true" />
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
