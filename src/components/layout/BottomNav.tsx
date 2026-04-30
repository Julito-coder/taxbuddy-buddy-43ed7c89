import { NavLink, useLocation } from 'react-router-dom';
import { Newspaper, Compass, Wallet, Sparkles, UserCircle, LayoutGrid } from 'lucide-react';

interface Tab {
  path: string;
  icon: React.ElementType;
  label: string;
}

const tabs: Tab[] = [
  { path: '/bulletin', icon: Newspaper, label: 'Bulletin' },
  { path: '/coach', icon: Compass, label: 'Coach' },
  { path: '/agent', icon: Sparkles, label: 'Élio' },
  { path: '/finances', icon: Wallet, label: 'Finances' },
  { path: '/profil', icon: UserCircle, label: 'Profil' },
];

interface Props {
  toolsOpen: boolean;
  onToolsOpenChange: (open: boolean) => void;
}

export const BottomNav = ({ toolsOpen, onToolsOpenChange }: Props) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (toolsOpen) return false;
    if (path === '/bulletin') return location.pathname === '/bulletin';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden">
      <div className="flex items-center justify-around" style={{ height: '68px' }}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon
                className={`h-5 w-5 ${active ? 'text-primary' : ''}`}
                strokeWidth={active ? 2.5 : 2}
                style={tab.path === '/agent' && active ? { color: 'hsl(37 55% 51%)' } : undefined}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={() => onToolsOpenChange(!toolsOpen)}
          aria-label="Ouvrir tous les outils"
          aria-expanded={toolsOpen}
          className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${
            toolsOpen ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <LayoutGrid
            className="h-5 w-5"
            strokeWidth={toolsOpen ? 2.5 : 2}
          />
          <span className="text-[10px] font-medium">Outils</span>
        </button>
      </div>
    </nav>
  );
};
