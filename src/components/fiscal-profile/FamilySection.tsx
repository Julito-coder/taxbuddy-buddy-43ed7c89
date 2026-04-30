import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FiscalProfileData } from '@/lib/fiscalProfileService';
import { ProfileFieldGroup } from './ProfileFieldGroup';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
}

export const FamilySection = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-6">
      <ProfileFieldGroup
        title="Composition du foyer"
        description="Le quotient familial dépend directement de ces informations."
      >
        <div className="space-y-2">
          <Label>Situation familiale</Label>
          <Select
            value={data.familyStatus}
            onValueChange={(v) => onChange({ familyStatus: v as FiscalProfileData['familyStatus'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionne" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Célibataire</SelectItem>
              <SelectItem value="married">Marié(e)</SelectItem>
              <SelectItem value="pacs">Pacsé(e)</SelectItem>
              <SelectItem value="divorced">Divorcé(e)</SelectItem>
              <SelectItem value="widowed">Veuf / Veuve</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="childrenCount">Enfants à charge</Label>
          <Input
            id="childrenCount"
            type="number"
            min={0}
            value={data.childrenCount}
            onChange={(e) => onChange({ childrenCount: parseInt(e.target.value) || 0 })}
          />
        </div>
        {(data.familyStatus === 'married' || data.familyStatus === 'pacs') && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="spouseIncome">Revenu net annuel du conjoint (€)</Label>
            <Input
              id="spouseIncome"
              type="number"
              value={data.spouseIncome || ''}
              onChange={(e) => onChange({ spouseIncome: parseFloat(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        )}
      </ProfileFieldGroup>

      <ProfileFieldGroup title="Logement principal">
        <div className="flex items-center justify-between gap-3 md:col-span-2 rounded-xl border border-border p-3">
          <div>
            <Label className="text-sm">Propriétaire de ma résidence principale</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Active des leviers spécifiques (intérêts d’emprunt, travaux).
            </p>
          </div>
          <Switch
            checked={data.isHomeowner}
            onCheckedChange={(v) => onChange({ isHomeowner: v })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="residenceDuration">Durée d’occupation (années)</Label>
          <Input
            id="residenceDuration"
            type="number"
            min={0}
            value={data.residenceDurationYears || ''}
            onChange={(e) =>
              onChange({ residenceDurationYears: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </ProfileFieldGroup>
    </div>
  );
};
