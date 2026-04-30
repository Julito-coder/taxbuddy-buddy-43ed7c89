import { AppLayout } from '@/components/layout/AppLayout';
import { AgentHeader } from '@/components/agent/AgentHeader';
import { AgentHero } from '@/components/agent/AgentHero';
import { ContextualChips } from '@/components/agent/ContextualChips';
import { QuickActionsGrid } from '@/components/agent/QuickActionsGrid';

const PlaceholderZone = ({ label, minHeight }: { label: string; minHeight: number }) => (
  <div
    className="rounded-2xl flex items-center justify-center text-sm font-medium"
    style={{
      minHeight,
      border: '1.5px dashed var(--coral-500)',
      color: 'var(--coral-500)',
      background: 'var(--coral-50)',
    }}
  >
    {label}
  </div>
);

const AgentPage = () => {
  // TODO Batch 4 : câbler onSelect au composer
  const handlePromptSelect = (prompt: string) => {
    // eslint-disable-next-line no-console
    console.debug('[Agent] prompt selected:', prompt);
  };

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

        {/* Zone scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[760px] px-4 py-4">
            <AgentHero />
            <div className="mt-4 mb-6">
              <ContextualChips onSelect={handlePromptSelect} />
            </div>
            <div className="mb-8">
              <QuickActionsGrid onSelect={handlePromptSelect} />
            </div>
            <PlaceholderZone label="Zone Chat — batch 4" minHeight={320} />
          </div>
        </div>

        {/* Composer fixe en bas */}
        <div
          className="sticky bottom-0 border-t border-border bg-background"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mx-auto w-full max-w-[760px] px-4 py-3">
            <PlaceholderZone label="Composer — batch 4" minHeight={56} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AgentPage;
