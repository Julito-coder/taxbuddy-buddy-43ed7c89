import { NavLink, useLocation } from 'react-router-dom';
import {
  Newspaper, Sparkles, Wallet, Calendar, UserCircle, HandCoins,
  Calculator, Settings, LogOut, Compass, Building2, PiggyBank,
  Heart, Briefcase, ScanSearch, FolderLock, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { ElioLogo } from './ElioLogo';

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

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const close = () => onOpenChange(false);

  const renderLink = (item: NavItem) => {
    const active = isActive(item.path, item.exact);
    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={close}
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
      <SheetContent
        side="left"
        className="w-[85vw] max-w-[340px] p-0 flex flex-col bg-background"
      >
        <SheetHeader className="p-5 border-b border-border text-left space-y-0">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <ElioLogo />
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto py-4 space-y-5">
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
            onClick={close}
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
      </SheetContent>
    </Sheet>
  );
};
