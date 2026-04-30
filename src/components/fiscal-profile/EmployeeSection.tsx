import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FiscalProfileData } from '@/lib/fiscalProfileService';
import { ProfileFieldGroup } from './ProfileFieldGroup';
import { AdvancedDetails } from './AdvancedDetails';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
}

export const EmployeeSection = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <ProfileFieldGroup
        title="Contrat et salaire"
        description="Le strict nécessaire pour estimer ton imposition."
      >
        <div className="space-y-2">
          <Label>Type de contrat</Label>
          <Select
            value={data.contractType}
            onValueChange={(v) => onChange({ contractType: v as FiscalProfileData['contractType'] })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cdi">CDI</SelectItem>
              <SelectItem value="cdd">CDD</SelectItem>
              <SelectItem value="interim">Intérim</SelectItem>
              <SelectItem value="freelance">Portage / Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Employeur</Label>
          <Input
            value={data.employerName}
            onChange={(e) => onChange({ employerName: e.target.value })}
            placeholder="Nom de l’entreprise"
          />
        </div>
        <div className="space-y-2">
          <Label>Salaire net mensuel (€)</Label>
          <Input
            type="number"
            value={data.netMonthlySalary || ''}
            onChange={(e) => onChange({ netMonthlySalary: parseFloat(e.target.value) || 0 })}
            placeholder="2 700"
          />
        </div>
        <div className="space-y-2">
          <Label>Salaire brut mensuel (€)</Label>
          <Input
            type="number"
            value={data.grossMonthlySalary || ''}
            onChange={(e) => onChange({ grossMonthlySalary: parseFloat(e.target.value) || 0 })}
            placeholder="3 500"
          />
        </div>
      </ProfileFieldGroup>

      <AdvancedDetails title="Primes, épargne salariale et frais réels (facultatif)">
        <div className="space-y-2">
          <Label>Prime annuelle (€)</Label>
          <Input
            type="number"
            value={data.annualBonus || ''}
            onChange={(e) => onChange({ annualBonus: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>13ème mois (€)</Label>
          <Input
            type="number"
            value={data.thirteenthMonth || ''}
            onChange={(e) => onChange({ thirteenthMonth: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Heures sup. annuelles (€)</Label>
          <Input
            type="number"
            value={data.overtimeAnnual || ''}
            onChange={(e) => onChange({ overtimeAnnual: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>PEE (€)</Label>
          <Input
            type="number"
            value={data.peeAmount || ''}
            onChange={(e) => onChange({ peeAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>PERCO (€)</Label>
          <Input
            type="number"
            value={data.percoAmount || ''}
            onChange={(e) => onChange({ percoAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Stock-options (€)</Label>
          <Input
            type="number"
            value={data.stockOptionsValue || ''}
            onChange={(e) => onChange({ stockOptionsValue: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <div>
            <Label className="text-sm">Frais réels</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Au lieu de l’abattement forfaitaire de 10 %.
            </p>
          </div>
          <Switch
            checked={data.hasRealExpenses}
            onCheckedChange={(v) => onChange({ hasRealExpenses: v })}
          />
        </div>
        {data.hasRealExpenses && (
          <div className="space-y-2 md:col-span-2">
            <Label>Montant des frais réels (€/an)</Label>
            <Input
              type="number"
              value={data.realExpensesAmount || ''}
              onChange={(e) =>
                onChange({ realExpensesAmount: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        )}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <Label className="text-sm">Mutuelle d’entreprise</Label>
          <Switch
            checked={data.hasCompanyHealthInsurance}
            onCheckedChange={(v) => onChange({ hasCompanyHealthInsurance: v })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <Label className="text-sm">Tickets restaurant</Label>
          <Switch
            checked={data.hasMealVouchers}
            onCheckedChange={(v) => onChange({ hasMealVouchers: v })}
          />
        </div>
      </AdvancedDetails>
    </div>
  );
};
