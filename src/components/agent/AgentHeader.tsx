import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

export const AgentHeader = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) window.history.back();
    else navigate('/bulletin');
  };

  return (
    <header
      className="sticky top-0 z-30 h-[60px] border-b border-border"
      style={{
        backgroundColor: scrolled ? 'hsl(var(--background) / 0.85)' : 'hsl(var(--background))',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        transition: 'background-color var(--duration) var(--ease), backdrop-filter var(--duration) var(--ease)',
      }}
    >
      <div className="mx-auto flex h-full max-w-[760px] items-center justify-between px-2 sm:px-4">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Retour"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        </button>

        <h1
          className="text-foreground"
          style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}
        >
          Élio Agent
        </h1>

        <button
          type="button"
          aria-label="Menu"
          aria-disabled="true"
          tabIndex={-1}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};
