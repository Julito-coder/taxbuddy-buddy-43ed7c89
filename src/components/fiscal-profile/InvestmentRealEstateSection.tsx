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

export const InvestmentRealEstateSection = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <ProfileFieldGroup title="Revenus locatifs">
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <div>
            <Label className="text-sm">Je perçois des loyers</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active la détection des leviers fonciers (déficit, LMNP).
            </p>
          </div>
          <Switch
            checked={data.hasRentalIncome}
            onCheckedChange={(v) => onChange({ hasRentalIncome: v })}
          />
        </div>
        {data.hasRentalIncome && (
          <>
            <div className="space-y-2">
              <Label>Régime locatif</Label>
              <Select
                value={data.rentalScheme}
                onValueChange={(v) =>
                  onChange({ rentalScheme: v as FiscalProfileData['rentalScheme'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nu">Location nue</SelectItem>
                  <SelectItem value="meuble">Meublé</SelectItem>
                  <SelectItem value="lmnp">LMNP</SelectItem>
                  <SelectItem value="lmp">LMP</SelectItem>
                  <SelectItem value="pinel">Pinel</SelectItem>
                  <SelectItem value="denormandie">Denormandie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Travaux annuels (€)</Label>
              <Input
                type="number"
                value={data.annualRentalWorks || ''}
                onChange={(e) =>
                  onChange({ annualRentalWorks: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </>
        )}
      </ProfileFieldGroup>

      <AdvancedDetails title="Crédit immobilier et IFI (facultatif)">
        <div className="space-y-2">
          <Label>Capital restant dû du crédit (€)</Label>
          <Input
            type="number"
            value={data.mortgageRemaining || ''}
            onChange={(e) => onChange({ mortgageRemaining: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <div>
            <Label className="text-sm">Assujetti à l’IFI</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Patrimoine immobilier net &gt; 1,3 M€.
            </p>
          </div>
          <Switch
            checked={data.ifiLiable}
            onCheckedChange={(v) => onChange({ ifiLiable: v })}
          />
        </div>
      </AdvancedDetails>
    </div>
  );
};
