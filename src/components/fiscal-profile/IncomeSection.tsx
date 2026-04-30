import { Briefcase, Laptop, Sun, Info } from 'lucide-react';
import { FiscalProfileData } from '@/lib/fiscalProfileService';
import { EmployeeSection } from './EmployeeSection';
import { SelfEmployedSection } from './SelfEmployedSection';
import { RetiredSection } from './RetiredSection';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
  onCloseDrawer?: () => void;
}

export const IncomeSection = ({ data, onChange, onCloseDrawer }: Props) => {
  const navigate = useNavigate();
  const isEmployee = data.profileTypes.includes('employee');
  const isSelfEmployed = data.profileTypes.includes('self_employed');
  const isRetired = data.profileTypes.includes('retired');
  const hasAnyStatus = isEmployee || isSelfEmployed || isRetired;

  if (!hasAnyStatus) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-3">
        <div className="h-12 w-12 rounded-xl bg-muted mx-auto flex items-center justify-center">
          <Info className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          Choisis d’abord ton activité professionnelle.
        </p>
        <p className="text-xs text-muted-foreground">
          Le détail des revenus s’adapte à ton statut (salarié, indépendant, retraité).
        </p>
        <Button
          variant="outline"
          onClick={() => {
            onCloseDrawer?.();
            // léger délai pour laisser le drawer se fermer
            setTimeout(() => {
              const el = document.querySelector('[data-module-id="professional"]') as HTMLButtonElement | null;
              el?.click();
            }, 200);
          }}
        >
          Ouvrir « Activité professionnelle »
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isEmployee && (
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Salaire</h3>
          </header>
          <EmployeeSection data={data} onChange={onChange} />
        </section>
      )}
      {isSelfEmployed && (
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <Laptop className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Activité indépendante</h3>
          </header>
          <SelfEmployedSection data={data} onChange={onChange} />
        </section>
      )}
      {isRetired && (
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Retraite</h3>
          </header>
          <RetiredSection data={data} onChange={onChange} />
        </section>
      )}
    </div>
  );
};
