import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { MobileToolsOverlay } from './MobileToolsOverlay';
import { SidebarProvider } from '@/components/ui/sidebar';

/**
 * Relit le cookie `sidebar:state` au mount pour restaurer l'état expanded/collapsed
 * de la sidebar entre rechargements (la primitive shadcn écrit le cookie mais ne
 * le relit pas — utile uniquement en SSR Next.js, pas en SPA Vite).
 * Synchrone (lu pendant le render, pas en useEffect) → pas de flash visuel au mount.
 */
const getInitialSidebarState = (): boolean => {
  if (typeof document === 'undefined') return true;
  const match = document.cookie.match(/sidebar:state=([^;]+)/);
  return match ? match[1] === 'true' : true;
};

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
    <SidebarProvider defaultOpen={getInitialSidebarState()} className="bg-background">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isChat ? (
        <main
          className="flex flex-1 flex-col overflow-hidden pb-[68px] lg:pb-0 min-w-0"
          style={{ height: '100dvh' }}
        >
          <div className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">
            {children}
          </div>
        </main>
      ) : (
        <main className="flex flex-1 flex-col min-h-screen pb-20 lg:pb-0 overflow-x-hidden min-w-0">
          <div className="relative flex-1 overflow-x-hidden">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[300px] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at top, rgba(15,30,51,0.08), transparent 50%)',
              }}
            />
            <div className="relative p-4 lg:p-8">{children}</div>
          </div>
        </main>
      )}

      <BottomNav toolsOpen={toolsOpen} onToolsOpenChange={setToolsOpen} />
      <MobileToolsOverlay open={toolsOpen} onOpenChange={setToolsOpen} />
    </SidebarProvider>
  );
};
