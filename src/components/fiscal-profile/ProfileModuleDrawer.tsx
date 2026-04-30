import { ReactNode, useState } from 'react';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2, Lightbulb, ChevronDown, Check, CloudUpload, AlertCircle } from 'lucide-react';
import { ModuleMeta } from './moduleRegistry';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SaveStatus } from '@/hooks/useFiscalProfileAutosave';

interface Props {
  module: ModuleMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  saving: boolean;
  saveStatus?: SaveStatus;
  children: ReactNode;
}

export const ProfileModuleDrawer = ({
  module,
  open,
  onOpenChange,
  onSave,
  saving,
  saveStatus,
  children,
}: Props) => {
  const isMobile = useIsMobile();
  const [whyOpen, setWhyOpen] = useState(false);

  const renderStatus = () => {
    if (!saveStatus || saveStatus === 'idle') return null;
    if (saveStatus === 'pending')
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CloudUpload className="h-3.5 w-3.5" />
          Modifications en attente…
        </span>
      );
    if (saveStatus === 'saving')
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Enregistrement…
        </span>
      );
    if (saveStatus === 'saved')
      return (
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--green-500)' }}>
          <Check className="h-3.5 w-3.5" />
          Enregistré
        </span>
      );
    if (saveStatus === 'error')
      return (
        <span className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          Échec — nouvelle tentative au prochain changement
        </span>
      );
    return null;
  };

  if (!module) return null;
  const Icon = module.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className={
          isMobile
            ? 'h-[92vh] rounded-t-3xl p-0 flex flex-col'
            : 'w-full sm:max-w-xl p-0 flex flex-col'
        }
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Profil fiscal</p>
              <h2 className="text-lg font-bold text-foreground leading-tight">{module.title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWhyOpen((v) => !v)}
            className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            Pourquoi remplir cette section ?
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${whyOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {whyOpen && (
            <div className="rounded-xl bg-muted/50 p-3 space-y-2">
              <p className="text-xs text-foreground leading-relaxed">{module.why}</p>
              <ul className="space-y-1">
                {module.whyBullets.map((b, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground leading-relaxed flex gap-2"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        <footer className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-card">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="text-muted-foreground"
          >
            Fermer
          </Button>
          <Button onClick={onSave} disabled={saving} className="min-w-[140px]">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement
              </>
            ) : (
              'Enregistrer'
            )}
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
};
