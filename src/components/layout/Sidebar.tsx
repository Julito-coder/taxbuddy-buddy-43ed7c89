import { NavLink, useLocation } from 'react-router-dom';
import {
  Newspaper,
  Sparkles,
  Wallet,
  Calendar,
  UserCircle,
  HandCoins,
  Calculator,
  Settings,
  LogOut,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ElioLogo } from './ElioLogo';
import { SidebarSection } from './SidebarSection';

type NavItem = {
  path: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
};

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
];

export const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const renderLink = (item: NavItem) => {
    const active = isActive(item.path, item.exact);
    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          active
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
        }`}
      >
        <item.icon
          className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
          strokeWidth={active ? 2.5 : 2}
        />
        <span className="font-medium text-sm">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <ElioLogo />
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <SidebarSection label="Accueil">
          {accueilNav.map(renderLink)}
        </SidebarSection>

        <SidebarSection label="Mes finances">
          {financesNav.map(renderLink)}
        </SidebarSection>

        <SidebarSection label="Pilotage">
          {pilotageNav.map(renderLink)}
        </SidebarSection>

        <SidebarSection label="Simulations" collapsible defaultOpen={false}>
          {simulationsNav.map(renderLink)}
        </SidebarSection>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <NavLink
          to="/profil/parametres"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-sm">Paramètres</span>
        </NavLink>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
