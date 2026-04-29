import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SidebarSectionProps {
  label: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: ReactNode;
}

export const SidebarSection = ({
  label,
  defaultOpen = true,
  collapsible = false,
  children,
}: SidebarSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className="space-y-1">
        <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </p>
        {children}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="space-y-1">{children}</div>}
    </div>
  );
};
