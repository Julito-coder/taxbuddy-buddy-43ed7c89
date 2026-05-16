import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HandCoins, AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AideCard } from '@/components/aides/AideCard';
import { AidesEmptyState, type AidesEmptyStateVariant } from '@/components/aides/AidesEmptyState';
import { AidesResult, loadAidesForUser } from '@/lib/aidesService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const AidesDetector = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [result, setResult] = useState<AidesResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await loadAidesForUser(user.id);
        setResult(data);
      } catch {
        toast({ title: 'Erreur', description: 'Impossible de charger les aides.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64" />
            <div className="h-24 bg-muted rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-xl" />)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!result) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto py-12">
          <AidesEmptyState variant="no-profile" />
        </div>
      </AppLayout>
    );
  }

  const { eligible, toVerify, notEligible, totalEligibleAnnual, profileComplete } = result;

  const renderColumn = (items: typeof eligible, emptyVariant: AidesEmptyStateVariant) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <AidesEmptyState variant={emptyVariant} />
      ) : (
        items.map((item, i) => <AideCard key={item.aide.key} item={item} index={i} />)
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/*
         * Hero Aides — carte success doux englobante (tier 3 charte v4).
         * Pattern : bg-success/5 + border-success/20 + shadow-sm cohérent
         * Coach Batch 7 + Finances Batch 8 (mêmes shadow + rounded + padding),
         * teinte success (vert) sémantique "gain monétaire à activer".
         */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success/5 border border-success/20 rounded-2xl shadow-sm p-6 lg:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
              <HandCoins className="h-6 w-6 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Détecteur d'aides</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Découvre les aides auxquelles tu as droit selon ta situation.
              </p>
            </div>
          </div>

          {totalEligibleAnnual > 0 && (
            <div className="mt-5 pt-5 border-t border-success/20 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Tu pourrais récupérer jusqu'à</p>
              <p className="text-3xl md:text-4xl font-bold text-success mt-1">
                {formatCurrency(totalEligibleAnnual)}<span className="text-base font-normal">/an</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {eligible.length} aide{eligible.length > 1 ? 's' : ''} identifiée{eligible.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </motion.div>

        {/* Banner profil incomplet */}
        {!profileComplete && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Profil incomplet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complète ton profil fiscal pour que le détecteur soit plus précis.
              </p>
              <Button size="sm" variant="outline" className="mt-2 text-xs" onClick={() => navigate('/profil/fiscal')}>
                Compléter mon profil
              </Button>
            </div>
          </motion.div>
        )}

        {/* Kanban / Tabs */}
        {isMobile ? (
          <Tabs defaultValue="eligible" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="eligible" className="text-xs gap-1">
                <CheckCircle2 className="h-3 w-3" /> Éligible ({eligible.length})
              </TabsTrigger>
              <TabsTrigger value="verify" className="text-xs gap-1">
                <HelpCircle className="h-3 w-3" /> À vérifier ({toVerify.length})
              </TabsTrigger>
              <TabsTrigger value="no" className="text-xs gap-1">
                <XCircle className="h-3 w-3" /> Non ({notEligible.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="eligible">{renderColumn(eligible, 'no-eligible')}</TabsContent>
            <TabsContent value="verify">{renderColumn(toVerify, 'no-verify')}</TabsContent>
            <TabsContent value="no">{renderColumn(notEligible, 'all-analyzed')}</TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {/* Eligible */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-success" />
                <h2 className="text-sm font-semibold text-foreground">Éligible ({eligible.length})</h2>
              </div>
              {renderColumn(eligible, 'no-eligible')}
            </div>
            {/* À vérifier */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <h2 className="text-sm font-semibold text-foreground">À vérifier ({toVerify.length})</h2>
              </div>
              {renderColumn(toVerify, 'no-verify')}
            </div>
            {/* Non concerné */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Non concerné ({notEligible.length})</h2>
              </div>
              {renderColumn(notEligible, 'all-analyzed')}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground text-center pt-4">
          Élio fournit des estimations à titre indicatif. Pour toute décision fiscale, consulte un professionnel habilité.
        </p>
      </div>
    </AppLayout>
  );
};

export default AidesDetector;
