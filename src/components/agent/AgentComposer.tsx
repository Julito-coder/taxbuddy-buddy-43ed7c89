import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Square } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export const AgentComposer = ({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 379px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Auto-resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 22;
    const maxLines = isNarrow ? 3 : 4;
    const maxHeight = lineHeight * maxLines + 20;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, isNarrow]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim() && !isStreaming) onSend();
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div
      className="shrink-0 border-t border-border bg-background"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto w-full max-w-[760px] min-w-0 px-3 py-3 sm:px-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pose ta question à Élio…"
            rows={1}
            disabled={disabled}
            aria-label="Message à Élio"
            className="flex-1 resize-none rounded-[var(--radius)] border border-border bg-muted/50 px-3.5 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
            style={{
              fontSize: '15px',
              fontWeight: 450,
              lineHeight: 1.5,
              minHeight: 44,
              fontFamily: 'inherit',
              transition: 'border-color 200ms var(--ease), box-shadow 200ms var(--ease)',
            }}
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Arrêter la réponse"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-200 active:scale-95"
              style={{ backgroundColor: 'var(--coral-500)' }}
            >
              <Square size={16} strokeWidth={2.5} fill="currentColor" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => canSend && onSend()}
              disabled={!canSend}
              aria-label="Envoyer le message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all duration-200 active:scale-95 disabled:cursor-not-allowed"
              style={{
                backgroundColor: canSend ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                color: canSend ? '#fff' : 'hsl(var(--muted-foreground))',
              }}
            >
              <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
