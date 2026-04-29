import { NavLink, useLocation } from 'react-router-dom';
import { Newspaper, Compass, Wallet, Sparkles, UserCircle } from 'lucide-react';

const tabs = [
  { path: '/bulletin', icon: Newspaper, label: 'Bulletin' },
  { path: '/coach', icon: Compass, label: 'Coach' },
  { path: '/finances', icon: Wallet, label: 'Finances' },
  { path: '/agent', icon: Sparkles, label: 'Élio' },
  { path: '/profil', icon: UserCircle, label: 'Profil' },
];

export const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
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
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
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
      </div>
    </nav>
  );
};
