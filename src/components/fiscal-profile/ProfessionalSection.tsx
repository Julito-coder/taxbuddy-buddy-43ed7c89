import { Briefcase, Laptop, Sun, TrendingUp, Check } from 'lucide-react';
import { FiscalProfileData } from '@/lib/fiscalProfileService';
import { ProfileType } from '@/data/onboardingTypes';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
}

const TYPES: Array<{ id: ProfileType; label: string; description: string; icon: typeof Briefcase }> = [
  {
    id: 'employee',
    label: 'Salarié',
    description: 'CDI, CDD, intérim, fonction publique.',
    icon: Briefcase,
  },
  {
    id: 'self_employed',
    label: 'Indépendant',
    description: 'Micro, EI, EURL, freelance, profession libérale.',
    icon: Laptop,
  },
  {
    id: 'retired',
    label: 'Retraité',
    description: 'Pensions, rentes et retraites complémentaires.',
    icon: Sun,
  },
  {
    id: 'investor',
    label: 'Investisseur',
    description: 'Revenus du patrimoine financier ou immobilier.',
    icon: TrendingUp,
  },
];

export const ProfessionalSection = ({ data, onChange }: Props) => {
  const toggle = (type: ProfileType) => {
    const current = [...data.profileTypes];
    const idx = current.indexOf(type);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(type);
    onChange({ profileTypes: current });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Plusieurs choix possibles. Tes modules de revenus s’ajustent automatiquement.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TYPES.map((type) => {
          const Icon = type.icon;
          const selected = data.profileTypes.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => toggle(type.id)}
              className={`text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                  selected ? 'bg-primary/10' : 'bg-muted'
                }`}
              >
                {selected ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <Icon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
