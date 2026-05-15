import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ElioFox } from '@/components/brand/ElioFox';
import { ErrorCard } from './ErrorCard';
import { RichViewRenderer } from '@/components/elio-agent/RichViewRenderer';
import type { AgentMessage, AgentErrorPayload } from '@/hooks/useElioAgent';

export interface UIMessage extends AgentMessage {
  id: string;
  status?: 'ok' | 'error';
  /** Détails d'erreur structurés (network / quota / profile_incomplete / generic) */
  error?: AgentErrorPayload | null;
}

interface Props {
  messages: UIMessage[];
  isStreaming: boolean;
  onRunPrompt?: (prompt: string) => void;
  onConfirmProfileUpdate?: (updates: Array<{ field: string; value: any }>) => void;
  onRetry?: () => void;
}

export const MessageThread = ({
  messages,
  isStreaming,
  onRunPrompt,
  onConfirmProfileUpdate,
  onRetry,
}: Props) => {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [isNarrow, setIsNarrow] = useState(false);
  // Marqueur pour ignorer les changements de visibilité dus à un resize
  // (clavier mobile) plutôt qu'à un vrai scroll utilisateur.
  const ignoreVisibilityUntilRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 379px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // IntersectionObserver sur la sentinelle de fin :
  // - source de vérité pour "l'utilisateur est-il en bas ?"
  // - immunisée aux changements de scrollTop induits par le resize clavier,
  //   parce qu'elle observe la position relative de la sentinelle dans le viewport
  //   du conteneur, pas la valeur scrollTop.
  useEffect(() => {
    const root = containerRef.current;
    const target = bottomRef.current;
    if (!root || !target || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        // Si on vient de resize (clavier), on ignore une éventuelle entrée
        // pour ne pas marquer "stick" alors que l'utilisateur ne l'a pas demandé.
        if (Date.now() < ignoreVisibilityUntilRef.current) return;
        const entry = entries[0];
        if (!entry) return;
        stickToBottomRef.current = entry.isIntersecting;
      },
      {
        root,
        // ~ "presque en bas" = encore considéré comme stick
        rootMargin: '0px 0px 120px 0px',
        threshold: 0,
      },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Pause la mise à jour du flag pendant les resize de visualViewport
  // (apparition/disparition du clavier mobile).
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    const onResize = () => {
      ignoreVisibilityUntilRef.current = Date.now() + 350;
      // Si on était "collé" en bas, on y reste après le resize.
      if (stickToBottomRef.current) {
        // Double rAF pour laisser le layout se stabiliser après le resize.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
          });
        });
      }
    };
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  // Auto-scroll sur nouveaux messages : uniquement si l'utilisateur est en bas.
  useEffect(() => {
    if (!stickToBottomRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isStreaming, reduce]);

  const mascotSize = isNarrow ? 36 : 40;

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="mx-auto w-full max-w-[760px] min-w-0 px-3 py-4 sm:px-4">
        <div className="flex flex-col gap-4 min-w-0">
          {messages.map((m) => {
            if (m.role === 'user') {
              return (
                <div key={m.id} className="flex justify-end min-w-0">
                  <div
                    className="text-white max-w-[85%] sm:max-w-[520px] min-w-0"
                    style={{
                      backgroundColor: 'hsl(var(--primary))',
                      borderRadius: 'var(--radius)',
                      borderBottomRightRadius: 4,
                      padding: '10px 14px',
                      fontSize: '15px',
                      fontWeight: 450,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            }

            // Assistant — carte d'erreur structurée
            if (m.error) {
              return (
                <div key={m.id} className="flex items-start gap-2 min-w-0">
                  <div className="shrink-0 pt-0.5">
                    <ElioFox animation="ear-wiggle" size={mascotSize} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <ErrorCard
                      kind={m.error.kind}
                      message={m.error.message}
                      meta={m.error.meta}
                      onRetry={onRetry}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className="flex items-start gap-2 min-w-0">
                <div className="shrink-0 pt-0.5">
                  <ElioFox animation="ear-wiggle" size={mascotSize} />
                </div>
                <div className="min-w-0 flex-1">
                  {m.content && (
                    <p
                      className="text-foreground"
                      style={{
                        fontSize: '15px',
                        fontWeight: 450,
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {m.content}
                    </p>
                  )}
                  {m.rich_view && m.rich_view.type && (
                    <div
                      className="mt-3 rounded-[var(--radius)] border border-border bg-card p-4"
                    >
                      <RichViewRenderer
                        rich_view={m.rich_view}
                        onRunPrompt={onRunPrompt}
                        onConfirmProfileUpdate={onConfirmProfileUpdate}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isStreaming && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="shrink-0">
                <ElioFox animation="thinking" size={mascotSize} />
              </div>
              <div className="flex items-center gap-1.5 px-2">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    className="block rounded-full"
                    style={{ width: 7, height: 7, backgroundColor: 'var(--coral-500)' }}
                    animate={reduce ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.15,
                    }}
                  />
                ))}
                <span className="sr-only">Élio réfléchit</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};
