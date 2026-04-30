import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FiscalProfileData } from '@/lib/fiscalProfileService';

interface Props {
  data: FiscalProfileData;
  onChange: (updates: Partial<FiscalProfileData>) => void;
}

const Row = ({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4">
    <div className="min-w-0">
      <Label className="text-sm font-semibold">{title}</Label>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export const ConsentsSection = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-3">
      <Row
        title="Je déclare mes revenus en France"
        description="Permet de calibrer mes calculs sur le barème fiscal français."
        checked={data.declaresInFrance}
        onCheckedChange={(v) => onChange({ declaresInFrance: v })}
      />
      <Row
        title="Consentement RGPD"
        description="J’accepte le traitement de mes données personnelles conformément à la politique de confidentialité."
        checked={data.gdprConsent}
        onCheckedChange={(v) => onChange({ gdprConsent: v })}
      />
      <Row
        title="Analyse personnalisée par IA"
        description="J’autorise l’utilisation de mes données pour des recommandations adaptées à mon dossier."
        checked={data.aiAnalysisConsent}
        onCheckedChange={(v) => onChange({ aiAnalysisConsent: v })}
      />
    </div>
  );
};
