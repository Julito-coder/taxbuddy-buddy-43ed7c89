import { NavLink, useLocation } from 'react-router-dom';
import {
  Newspaper, Sparkles, Wallet, Calendar, UserCircle, HandCoins,
  Calculator, Settings, LogOut, Compass, Building2, PiggyBank,
  Heart, Briefcase, ScanSearch, FolderLock, ChevronDown,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Sheet, SheetHeader, SheetTitle, SheetPortal } from '@/components/ui/sheet';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { ElioLogo } from './ElioLogo';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
}

const accueilNav: NavItem[] = [
  { path: '/bulletin', icon: Newspaper, label: 'Bulletin du jour' },
  { path: '/coach', icon: Compass, label: 'Coach' },
  { path: '/agent', icon: Sparkles, label: 'Élio Agent' },
];

const financesNav: NavItem[] = [
  { path: '/finances', icon: Wallet, label: 'Mes finances', exact: true },
];

const pilotageNav: NavItem[] = [
  { path: '/calendrier', icon: Calendar, label: 'Calendrier fiscal' },
  { path: '/profil', icon: UserCircle, label: 'Profil fiscal' },
  { path: '/aides', icon: HandCoins, label: 'Aides & dispositifs' },
];

const simulationsNav: NavItem[] = [
  { path: '/simulations', icon: Calculator, label: 'Toutes les simulations', exact: true },
  { path: '/simulations/immobilier', icon: Building2, label: 'Immobilier' },
  { path: '/simulations/epargne', icon: PiggyBank, label: 'Épargne PEA / PER' },
  { path: '/simulations/pacs', icon: Heart, label: 'PACS / Mariage' },
  { path: '/simulations/freelance', icon: Briefcase, label: 'CDI vs Freelance' },
  { path: '/simulations/scanner', icon: ScanSearch, label: 'Scanner fiscal' },
  { path: '/coffre', icon: FolderLock, label: 'Coffre-fort' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileMenuDrawer = ({ open, onOpenChange }: Props) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [simOpen, setSimOpen] = useState(
    location.pathname.startsWith('/simulations') || location.pathname.startsWith('/coffre')
  );
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const pushedHistoryRef = useRef(false);

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const close = () => onOpenChange(false);

  // Close on Android/iOS back gesture: push a history entry on open,
  // close the drawer on popstate instead of leaving the page.
  useEffect(() => {
    if (!open) return;
    const state = window.history.state;
    if (!state || !state.__elioMenu) {
      window.history.pushState({ ...state, __elioMenu: true }, '');
      pushedHistoryRef.current = true;
    }
    const onPop = () => {
      pushedHistoryRef.current = false;
      onOpenChange(false);
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // If the drawer is closed for another reason (link click, escape),
      // unwind the dummy history entry we pushed.
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
        if (window.history.state?.__elioMenu) {
          window.history.back();
        }
      }
    };
  }, [open, onOpenChange]);

  // Auto-close on route change (covers all NavLink clicks without per-link work)
  useEffect(() => {
    if (open) onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Swipe-left to close
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartXRef.current = t.clientX;
    touchStartYRef.current = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (startX == null || startY == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (dx < -60 && Math.abs(dy) < 50) {
      close();
    }
  };

  let firstLinkAssigned = false;
  const renderLink = (item: NavItem) => {
    const active = isActive(item.path, item.exact);
    const isFirst = !firstLinkAssigned;
    if (isFirst) firstLinkAssigned = true;
    return (
      <NavLink
        key={item.path}
        to={item.path}
        ref={isFirst ? firstLinkRef : undefined}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          active
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-foreground/80 hover:bg-muted'
        }`}
      >
        <item.icon
          className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
          strokeWidth={active ? 2.5 : 2}
        />
        <span className="font-medium text-sm">{item.label}</span>
      </NavLink>
    );
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="px-4 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetPortal>
        {/* Lighter overlay so the underlying content stays readable */}
        <SheetPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />
        <SheetPrimitive.Content
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onOpenAutoFocus={(e) => {
            // Focus the first nav link instead of the X close button
            e.preventDefault();
            firstLinkRef.current?.focus();
          }}
          className={cn(
            'fixed inset-y-0 left-0 z-50 h-full w-[85vw] max-w-[340px]',
            'bg-background border-r shadow-lg p-0 flex flex-col',
            'transition ease-in-out',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:duration-250 data-[state=open]:duration-300',
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
          )}
        >
          <SheetHeader className="p-5 border-b border-border text-left space-y-0 flex-row items-center justify-between">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <ElioLogo />
            <SheetPrimitive.Close
              className="h-9 w-9 inline-flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Fermer le menu"
            >
              <span className="sr-only">Fermer</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </SheetPrimitive.Close>
          </SheetHeader>

          <nav
            className="flex-1 overflow-y-auto py-4 space-y-5"
            style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
          >
            <div>
              <SectionLabel>Accueil</SectionLabel>
              <div className="px-2 space-y-1">{accueilNav.map(renderLink)}</div>
            </div>

            <div>
              <SectionLabel>Mes finances</SectionLabel>
              <div className="px-2 space-y-1">{financesNav.map(renderLink)}</div>
            </div>

            <div>
              <SectionLabel>Pilotage</SectionLabel>
              <div className="px-2 space-y-1">{pilotageNav.map(renderLink)}</div>
            </div>

            <div>
              <Collapsible open={simOpen} onOpenChange={setSimOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between px-4 pt-1 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Simulations & outils
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      simOpen ? 'rotate-180' : ''
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-2 space-y-1">
                  {simulationsNav.map(renderLink)}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </nav>

          <div className="p-3 border-t border-border space-y-1">
            <NavLink
              to="/profil/parametres"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Paramètres</span>
            </NavLink>
            <button
              onClick={() => {
                close();
                signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium text-sm">Déconnexion</span>
            </button>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
};

