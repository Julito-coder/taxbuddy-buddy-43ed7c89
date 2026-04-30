import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { ElioMascot3D } from './ElioMascot3D';
import { RichViewRenderer } from '@/components/elio-agent/RichViewRenderer';
import type { AgentMessage } from '@/hooks/useElioAgent';

export interface UIMessage extends AgentMessage {
  id: string;
  status?: 'ok' | 'error';
  errorKind?: 'network' | 'limit';
}

interface Props {
  messages: UIMessage[];
  isStreaming: boolean;
  onRunPrompt?: (prompt: string) => void;
  onConfirmProfileUpdate?: (updates: Array<{ field: string; value: any }>) => void;
}

export const MessageThread = ({
  messages,
  isStreaming,
  onRunPrompt,
  onConfirmProfileUpdate,
}: Props) => {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 379px)');
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Track manual scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setStickToBottom(distanceFromBottom < 80);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!stickToBottom) return;
    bottomRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isStreaming, stickToBottom, reduce]);

  const mascotSize = isNarrow ? 36 : 40;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="mx-auto w-full max-w-[760px] px-3 py-4 sm:px-4">
        <div className="flex flex-col gap-4">
          {messages.map((m) => {
            if (m.role === 'user') {
              return (
                <div key={m.id} className="flex justify-end">
                  <div
                    className="text-white"
                    style={{
                      maxWidth: '85%',
                      backgroundColor: 'hsl(var(--primary))',
                      borderRadius: 'var(--radius)',
                      borderBottomRightRadius: 4,
                      padding: '10px 14px',
                      fontSize: '15px',
                      fontWeight: 450,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            }

            // Assistant
            if (m.status === 'error') {
              return (
                <div key={m.id} className="flex items-start gap-2">
                  <ElioMascot3D state="idle" size={mascotSize} />
                  <div
                    className="rounded-[var(--radius)] border p-3 text-sm"
                    style={{
                      maxWidth: '90%',
                      backgroundColor: 'hsl(var(--destructive) / 0.1)',
                      borderColor: 'hsl(var(--destructive) / 0.3)',
                      color: 'hsl(var(--destructive))',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <p style={{ fontSize: '15px', lineHeight: 1.5 }}>{m.content}</p>
                        {m.errorKind === 'limit' && (
                          <button
                            type="button"
                            onClick={() => navigate('/profil')}
                            className="mt-2 text-sm font-medium underline underline-offset-4"
                          >
                            Voir mon abonnement
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className="flex items-start gap-2">
                <div className="shrink-0 pt-0.5">
                  <ElioMascot3D state="idle" size={mascotSize} />
                </div>
                <div className="min-w-0 flex-1" style={{ maxWidth: '90%' }}>
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
                <ElioMascot3D state="thinking" size={mascotSize} />
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
