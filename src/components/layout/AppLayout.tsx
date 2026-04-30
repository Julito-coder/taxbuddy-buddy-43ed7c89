import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileToolsOverlay } from './MobileToolsOverlay';

interface AppLayoutProps {
  children: ReactNode;
  /**
   * Layout mode.
   * - 'default' (par défaut): page scrollable avec padding et gradient décoratif.
   * - 'chat': pleine hauteur, sans padding ni gradient. Utilisée pour les
   *   interfaces de type chat (Élio Agent) où le contenu doit occuper
   *   exactement le viewport, avec sa propre zone de scroll interne.
   */
  variant?: 'default' | 'chat';
}

export const AppLayout = ({ children, variant = 'default' }: AppLayoutProps) => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const isChat = variant === 'chat';

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isChat ? (
        // Chat mode: <main> is a flex container that fills the dynamic
        // viewport height, leaves room for the mobile bottom nav, and gives
        // its child a flex column to occupy precisely.
        <main
          className="lg:ml-64 flex flex-col overflow-hidden pb-[68px] lg:pb-0"
          style={{ height: '100dvh' }}
        >
          <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">
            {children}
          </div>
        </main>
      ) : (
        <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0 overflow-x-hidden">
          <div className="relative overflow-x-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at top, rgba(27,58,92,0.08), transparent 50%)',
              }}
            />
            <div className="relative p-4 lg:p-8">{children}</div>
          </div>
        </main>
      )}

      <BottomNav toolsOpen={toolsOpen} onToolsOpenChange={setToolsOpen} />
      <MobileToolsOverlay open={toolsOpen} onOpenChange={setToolsOpen} />
    </div>
  );
};
