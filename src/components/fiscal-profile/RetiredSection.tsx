import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FiscalProfileData } from '@/lib/fiscalProfileService';
import { ProfileFieldGroup } from './ProfileFieldGroup';
import { AdvancedDetails } from './AdvancedDetails';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
}

export const RetiredSection = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <ProfileFieldGroup
        title="Pensions"
        description="Indispensable pour calculer la fiscalité de tes retraites."
      >
        <div className="space-y-2 md:col-span-2">
          <Label>Pension principale annuelle (€)</Label>
          <Input
            type="number"
            value={data.mainPensionAnnual || ''}
            onChange={(e) => onChange({ mainPensionAnnual: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </ProfileFieldGroup>

      <AdvancedDetails title="Revenus complémentaires (facultatif)">
        <div className="space-y-2">
          <Label>Date de liquidation</Label>
          <Input
            type="date"
            value={data.liquidationDate}
            onChange={(e) => onChange({ liquidationDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Revenus complémentaires (€/an)</Label>
          <Input
            type="number"
            value={data.supplementaryIncome || ''}
            onChange={(e) => onChange({ supplementaryIncome: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Plus-values 2025 (€)</Label>
          <Input
            type="number"
            value={data.capitalGains2025 || ''}
            onChange={(e) => onChange({ capitalGains2025: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </AdvancedDetails>
    </div>
  );
};
