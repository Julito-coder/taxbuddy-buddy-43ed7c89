import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Newspaper, Compass, Sparkles, Wallet, Calendar as CalendarIcon,
  UserCircle, HandCoins, FolderLock, Settings, LogOut, ChevronDown, Check, Clock,
} from 'lucide-react';
import { sections as simulationSections, type SubItem, type Status } from '@/data/simulationsCatalog';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DirectLink {
  to: string;
  label: string;
  icon: React.ElementType;
  desc: string;
}

const directLinks: DirectLink[] = [
  { to: '/bulletin', label: 'Bulletin du jour', icon: Newspaper, desc: 'Ton brief fiscal quotidien' },
  { to: '/coach', label: 'Coach', icon: Compass, desc: 'Plan d\'action personnalisé' },
  { to: '/agent', label: 'Élio Agent', icon: Sparkles, desc: 'Pose une question fiscale' },
  { to: '/finances', label: 'Mes finances', icon: Wallet, desc: 'Vue d\'ensemble patrimoine' },
  { to: '/calendrier', label: 'Calendrier fiscal', icon: CalendarIcon, desc: 'Échéances à venir' },
  { to: '/profil', label: 'Profil fiscal', icon: UserCircle, desc: 'Tes données et formulaires' },
  { to: '/aides', label: 'Aides & dispositifs', icon: HandCoins, desc: 'Détecte les aides éligibles' },
  { to: '/coffre', label: 'Coffre-fort', icon: FolderLock, desc: 'Stocker tes documents' },
];

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === 'available') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4B8264] bg-[#4B8264]/10 px-2 py-0.5 rounded-full">
        <Check className="h-3 w-3" /> Disponible
      </span>
    );
  }
  if (status === 'agent') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#C8943E] bg-[#C8943E]/10 px-2 py-0.5 rounded-full">
        <Sparkles className="h-3 w-3" /> Via Élio
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
      <Clock className="h-3 w-3" /> Bientôt
    </span>
  );
};

export const MobileToolsOverlay = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pushedHistoryRef = useRef(false);

  const close = () => onOpenChange(false);

  // Close on route change
  useEffect(() => {
    if (open) onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Body scroll lock + back button support
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const state = window.history.state;
    if (!state || !state.__elioTools) {
      window.history.pushState({ ...state, __elioTools: true }, '');
      pushedHistoryRef.current = true;
    }
    const onPop = () => {
      pushedHistoryRef.current = false;
      onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('keydown', onKey);
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        if (window.history.state?.__elioTools) {
          window.history.back();
        }
      }
    };
  }, [open, onOpenChange]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const startY = touchStartYRef.current;
    touchStartYRef.current = null;
    if (startY == null) return;
    const dy = e.changedTouches[0].clientY - startY;
    if (dy > 80) close();
  };

  const handleSubItem = (item: SubItem) => {
    if (item.status === 'soon') return;
    close();
    if (item.to) {
      navigate(item.to);
    } else if (item.prompt) {
      navigate('/agent', { state: { initialPrompt: item.prompt } });
    }
  };

  const goTo = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay-bg"
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-[2px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            key="overlay-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Tous les outils"
            className="fixed inset-0 z-[61] bg-background lg:hidden flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Tous les outils</h2>
                <p className="text-[11px] text-muted-foreground">Navigation et simulations</p>
              </div>
              <button
                onClick={close}
                aria-label="Fermer"
                className="h-11 w-11 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Scroll body */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-8 space-y-6"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {/* Direct links grid */}
              <section>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Espaces
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {directLinks.map((l) => {
                    const Icon = l.icon;
                    return (
                      <button
                        key={l.to}
                        onClick={() => goTo(l.to)}
                        className="text-left bg-card border border-[#E5E7EB] rounded-xl p-3 hover:border-primary/30 hover:shadow-sm transition-all flex items-start gap-2.5"
                      >
                        <div className="h-9 w-9 rounded-lg bg-[#F8F5F0] flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-[#1B3A5C]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground leading-tight">{l.label}</p>
                          <p className="text-[10.5px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{l.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Simulations — titres uniquement, dépliables */}
              <section>
                <div className="flex items-center justify-between mb-2 px-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Simulations
                  </p>
                  <button
                    onClick={() => goTo('/simulations')}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Tout voir
                  </button>
                </div>
                <div className="space-y-2">
                  {simulationSections.map((section) => {
                    const Icon = section.icon;
                    const isOpen = expanded === section.title;
                    return (
                      <div
                        key={section.title}
                        className="bg-card border border-[#E5E7EB] rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpanded(isOpen ? null : section.title)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition-colors"
                        >
                          <div className={`h-10 w-10 rounded-xl ${section.accent} flex items-center justify-center shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-tight">
                              {section.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                              {section.subtitle}
                            </p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-border/60">
                                {section.items.map((item) => {
                                  const ItemIcon = item.icon;
                                  const disabled = item.status === 'soon';
                                  return (
                                    <button
                                      key={item.label}
                                      onClick={() => handleSubItem(item)}
                                      disabled={disabled}
                                      className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors ${
                                        disabled
                                          ? 'opacity-60 cursor-not-allowed'
                                          : 'hover:bg-muted'
                                      }`}
                                    >
                                      <div className="h-7 w-7 rounded-md bg-[#F8F5F0] flex items-center justify-center shrink-0">
                                        <ItemIcon className="h-3.5 w-3.5 text-[#1B3A5C]" />
                                      </div>
                                      <span className="flex-1 text-[13px] font-medium text-foreground leading-tight">
                                        {item.label}
                                      </span>
                                      <StatusBadge status={item.status} />
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Footer actions */}
              <section className="space-y-1 pt-2 border-t border-border">
                <button
                  onClick={() => goTo('/profil/parametres')}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-foreground/80 hover:bg-muted transition-colors"
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Paramètres</span>
                </button>
                <button
                  onClick={() => {
                    close();
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Déconnexion</span>
                </button>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
