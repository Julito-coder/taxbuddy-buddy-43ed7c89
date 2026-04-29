import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { categoryDisplay } from '@/lib/fiscalCategorization';
import {
  formatCents,
  setTagConfirmed,
  type OptimisationItem,
} from '@/lib/financesService';

interface Props {
  optimisations: OptimisationItem[];
  onCategorize: () => Promise<void>;
  onChange: () => void;
  busy?: boolean;
}

export const OptimisationsFeed = ({ optimisations, onCategorize, onChange, busy }: Props) => {
  const [confirming, setConfirming] = useState<string | null>(null);

  const handleConfirm = async (item: OptimisationItem) => {
    setConfirming(item.tagId);
    try {
      await setTagConfirmed(item.tagId, true);
      toast.success(`Optimisation confirmée · ${formatCents(item.estimatedSavingsCents)}`);
      onChange();
    } catch {
      toast.error('Impossible de confirmer cette optimisation.');
    } finally {
      setConfirming(null);
    }
  };

  if (optimisations.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-8 text-center space-y-4">
          <Sparkles className="h-10 w-10 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-foreground">Aucune optimisation détectée</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Lance l'analyse pour qu'Élio scanne tes opérations à la recherche de dons, versements PER, frais pro, gardes d'enfants…
            </p>
          </div>
          <Button onClick={onCategorize} disabled={busy} variant="outline" size="sm">
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Lancer l'analyse fiscale
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {optimisations.length} optimisation(s) détectée(s) — confirme celles qui s'appliquent à toi
        </p>
        <Button onClick={onCategorize} disabled={busy} variant="ghost" size="sm">
          {busy ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 mr-1" />}
          Réanalyser
        </Button>
      </div>

      {optimisations.map((item, i) => {
        const display = categoryDisplay(item.category);
        return (
          <motion.div
            key={item.transactionId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card className="shadow-sm hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg ${display.color} flex items-center justify-center shrink-0`}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                    <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${display.color}`}>
                      {display.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.txDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
                    {(item.amountCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs">
                    <span className="text-muted-foreground">Économie estimée : </span>
                    <span className="font-semibold text-success">{formatCents(item.estimatedSavingsCents)}</span>
                    {item.confidence < 0.7 && (
                      <span className="ml-2 text-[10px] text-muted-foreground">(à vérifier)</span>
                    )}
                  </p>
                </div>
                <div className="shrink-0">
                  {item.confirmed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 rounded-full px-2 py-1">
                      <Check className="h-3 w-3" /> Confirmée
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConfirm(item)}
                      disabled={confirming === item.tagId}
                    >
                      {confirming === item.tagId ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirmer'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
