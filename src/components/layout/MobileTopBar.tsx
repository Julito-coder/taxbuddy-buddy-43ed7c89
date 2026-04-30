import { useState } from 'react';
import { Menu } from 'lucide-react';
import { ElioLogo } from './ElioLogo';
import { MobileMenuDrawer } from './MobileMenuDrawer';

export const MobileTopBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        className="lg:hidden sticky top-0 z-40 h-14 bg-background/95 backdrop-blur-md border-b border-border flex items-center justify-between px-3"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        </button>

        <div className="flex items-center">
          <ElioLogo />
        </div>

        <div className="w-11" aria-hidden="true" />
      </header>

      <MobileMenuDrawer open={open} onOpenChange={setOpen} />
    </>
  );
};
