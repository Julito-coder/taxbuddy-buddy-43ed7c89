/**
 * BottomNav — Navigation principale mobile (< lg breakpoint, 1024px).
 *
 * Structure 4 entrées + FAB central :
 *   1. Bulletin (NavLink /bulletin)
 *   2. FAB central Élio (NavLink /agent, ElioFox idle-breathe 48px, pattern Option B "élevé notch")
 *   3. Outils (button → ouvre MobileToolsOverlay)
 *   4. Profil (NavLink /profil)
 */

import { NavLink, useLocation } from 'react-router-dom';
import { Newspaper, LayoutGrid, UserCircle, type LucideIcon } from 'lucide-react';
import { ElioFox } from '@/components/brand/ElioFox';

interface Props {
  toolsOpen: boolean;
  onToolsOpenChange: (open: boolean) => void;
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

interface NavEntryProps {
  to: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}

const NavEntry = ({ to, icon: Icon, label, active }: NavEntryProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (active) {
      e.preventDefault();
      scrollToTop();
    }
  };
  return (
    <NavLink
      to={to}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-1 px-3 h-full border-t-2 transition-colors duration-150 ${
        active
          ? 'border-coral-500 text-coral-700'
          : 'border-transparent text-muted-foreground'
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
};

export const BottomNav = ({ toolsOpen, onToolsOpenChange }: Props) => {
  const location = useLocation();

  const isPathActive = (path: string): boolean => {
    if (toolsOpen) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const bulletinActive = isPathActive('/bulletin');
  const agentActive = isPathActive('/agent');
  const profilActive = isPathActive('/profil');

  const handleFabClick = (e: React.MouseEvent) => {
    if (agentActive) {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch justify-around" style={{ height: '68px' }}>
        <NavEntry to="/bulletin" icon={Newspaper} label="Bulletin" active={bulletinActive} />

        <div className="relative w-16 h-full flex items-center justify-center">
          <NavLink
            to="/agent"
            onClick={handleFabClick}
            aria-label="Élio"
            className={`absolute -top-5 left-1/2 -translate-x-1/2 h-16 w-16 rounded-full bg-card flex items-center justify-center transition-all duration-200 z-10 ${
              agentActive
                ? 'ring-4 ring-coral-500/20 shadow-lg shadow-coral-500/30'
                : 'border-2 border-coral-500/30 shadow-md'
            }`}
          >
            <ElioFox animation="ear-wiggle" size={48} />
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => onToolsOpenChange(true)}
          aria-label="Ouvrir tous les outils"
          aria-expanded={toolsOpen}
          className={`flex flex-col items-center justify-center gap-1 px-3 h-full border-t-2 transition-colors duration-150 ${
            toolsOpen
              ? 'border-coral-500 text-coral-700'
              : 'border-transparent text-muted-foreground'
          }`}
        >
          <LayoutGrid className="h-5 w-5" strokeWidth={toolsOpen ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Outils</span>
        </button>

        <NavEntry to="/profil" icon={UserCircle} label="Profil" active={profilActive} />
      </div>
    </nav>
  );
};
