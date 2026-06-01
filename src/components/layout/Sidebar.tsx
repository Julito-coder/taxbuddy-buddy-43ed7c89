/**
 * Sidebar — Shell de navigation desktop ≥ lg.
 *
 * Bâti sur la primitive shadcn (`@/components/ui/sidebar`) avec
 * collapsible="icon" : mode expanded 16rem ↔ mode collapsed 3rem (icon-only).
 * Toggle via SidebarRail (click) ou raccourci clavier ⌘B / Ctrl+B.
 * État persisté en cookie `sidebar:state` (comportement natif shadcn).
 *
 * 5 sections + footer Déconnexion + header ElioLogo (variant adapté à
 * l'état expanded/collapsed via useSidebar()).
 *
 * Active state coral charte v1.0 (D4 brief Batch 4) :
 * - bg-coral-500/10 sur le bouton
 * - text-coral-700 sur icône + label
 * - border-l-2 border-coral-500 (barre verticale gauche)
 *
 * Tooltips natifs shadcn affichés uniquement en mode collapsed
 * (gérés par TooltipContent.hidden au niveau du SidebarMenuButton).
 */

import { NavLink, useLocation } from 'react-router-dom';
import {
  Newspaper,
  Bot,
  Wallet,
  Calendar,
  FileText,
  HandCoins,
  Vault,
  Calculator,
  User,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { ElioLogo } from './ElioLogo';

interface NavEntry {
  path: string;
  icon: LucideIcon;
  label: string;
  exact?: boolean;
}

interface NavSection {
  label: string;
  items: NavEntry[];
}

const SECTIONS: NavSection[] = [
  {
    label: 'Accueil',
    items: [
      { path: '/bulletin', icon: Newspaper, label: 'Bulletin' },
      { path: '/agent', icon: Bot, label: 'Agent' },
    ],
  },
  {
    label: 'Mes finances',
    items: [{ path: '/finances', icon: Wallet, label: 'Mes finances' }],
  },
  {
    label: 'Pilotage',
    items: [
      { path: '/calendrier', icon: Calendar, label: 'Calendrier' },
      { path: '/profil/fiscal', icon: FileText, label: 'Profil fiscal' },
      { path: '/aides', icon: HandCoins, label: 'Aides' },
      { path: '/coffre', icon: Vault, label: 'Coffre' },
    ],
  },
  {
    label: 'Outils',
    items: [{ path: '/simulations', icon: Calculator, label: 'Simulations' }],
  },
  {
    label: 'Mon compte',
    items: [
      { path: '/profil', icon: User, label: 'Profil', exact: true },
      { path: '/profil/parametres', icon: Settings, label: 'Paramètres' },
    ],
  },
];

/**
 * /profil → exact pour ne pas s'activer sur /profil/fiscal ou /profil/parametres.
 * /simulations → startsWith par défaut pour s'activer sur les sous-routes
 * /simulations/immobilier, /simulations/scanner, etc.
 */
const isPathActive = (currentPath: string, entryPath: string, exact?: boolean): boolean => {
  if (exact) return currentPath === entryPath;
  if (currentPath === entryPath) return true;
  return currentPath.startsWith(entryPath + '/');
};

/**
 * Override des styles cva par défaut du SidebarMenuButton actif (sidebar-accent)
 * par le pattern coral charte. Modifiers `data-[active=true]:*` ciblent l'attribut
 * data-active="true" posé par shadcn quand isActive prop est true.
 */
const ACTIVE_OVERRIDE =
  'data-[active=true]:bg-coral-500/10 ' +
  'data-[active=true]:text-coral-700 ' +
  'data-[active=true]:hover:bg-coral-500/10 ' +
  'data-[active=true]:hover:text-coral-700 ' +
  'data-[active=true]:border-l-2 ' +
  'data-[active=true]:border-coral-500 ' +
  'data-[active=true]:rounded-l-none';

const SidebarBranding = () => {
  const { state } = useSidebar();
  if (state === 'collapsed') {
    return <ElioLogo variant="symbol" mode="light" size={32} />;
  }
  return <ElioLogo variant="horizontal" mode="light" size={40} />;
};

export const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="h-16 flex flex-row items-center justify-center px-2 group-data-[collapsible=icon]:px-0">
        <SidebarBranding />
      </SidebarHeader>

      <SidebarContent>
        {SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className="uppercase tracking-wider text-xs">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isPathActive(location.pathname, item.path, item.exact);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={ACTIVE_OVERRIDE}
                      >
                        <NavLink to={item.path}>
                          <Icon strokeWidth={active ? 2.5 : 2} />
                          <span>{item.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Déconnexion"
              onClick={signOut}
              className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  );
};
