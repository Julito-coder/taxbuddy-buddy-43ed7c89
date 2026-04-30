import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentHero } from '@/components/agent/AgentHero';
import { ContextualChips } from '@/components/agent/ContextualChips';
import { QuickActionsGrid } from '@/components/agent/QuickActionsGrid';
import { MessageThread, type UIMessage } from '@/components/agent/MessageThread';
import { AgentComposer } from '@/components/agent/AgentComposer';
import { useElioAgent } from '@/hooks/useElioAgent';

const AgentPage = () => {
  const reduce = useReducedMotion();
  const {
    messages,
    isLoading,
    sendMessage,
    confirmProfileUpdates,
  } = useElioAgent();

  const [input, setInput] = useState('');
  const idMapRef = useRef<WeakMap<object, string>>(new WeakMap());

  // Map hook messages → UIMessage with stable ids
  const uiMessages = useMemo<UIMessage[]>(() => {
    return messages.map((m, idx) => {
      let id = idMapRef.current.get(m as unknown as object);
      if (!id) {
        id = `${idx}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        idMapRef.current.set(m as unknown as object, id);
      }
      return { ...m, id, status: 'ok' as const };
    });
  }, [messages]);

  const hasMessages = uiMessages.length > 0;

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput('');
    sendMessage(msg);
  };

  const handlePromptSelect = (prompt: string) => {
    handleSend(prompt);
  };

  // Adjust scroll on viewport changes (mobile keyboard)
  useEffect(() => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    if (!vv) return;
    const onResize = () => {
      // Trigger reflow so sticky composer stays above keyboard
      document.documentElement.style.setProperty('--vv-height', `${vv.height}px`);
    };
    vv.addEventListener('resize', onResize);
    onResize();
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  const fadeDuration = reduce ? 0.001 : 0.25;
  const enterDelay = reduce ? 0 : 0.2;

  return (
    <AppLayout>
      <div
        className="flex flex-col"
        style={{
          height: '100dvh',
          background:
            'radial-gradient(120% 60% at 50% 0%, rgba(240, 100, 73, 0.06) 0%, rgba(240, 100, 73, 0) 60%), hsl(var(--background))',
        }}
      >
        <AgentHeader />

        {/* Welcome zone (hero + chips + grid) — visible when no messages */}
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <motion.div
              key="welcome"
              initial={false}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: fadeDuration, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 overflow-y-auto"
            >
              <div className="mx-auto w-full max-w-[760px] px-3 py-4 sm:px-4">
                <AgentHero />
                <div className="mt-4 mb-6">
                  <ContextualChips onSelect={handlePromptSelect} />
                </div>
                <div className="mb-8">
                  <QuickActionsGrid onSelect={handlePromptSelect} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="thread"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0.001 : 0.3,
                ease: [0.22, 1, 0.36, 1],
                delay: enterDelay,
              }}
              className="flex flex-1 min-h-0 flex-col"
            >
              <MessageThread
                messages={uiMessages}
                isStreaming={isLoading}
                onRunPrompt={handlePromptSelect}
                onConfirmProfileUpdate={confirmProfileUpdates}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AgentComposer
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          isStreaming={isLoading}
          disabled={false}
        />
      </div>
    </AppLayout>
  );
};

export default AgentPage;
