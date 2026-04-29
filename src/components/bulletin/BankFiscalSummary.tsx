// Carte « Économies fiscales détectées via tes flux bancaires ».
// Affichée sur /bulletin uniquement si l'utilisateur a au moins un tag fiscal
// dans transaction_fiscal_tags. Source : useMonthlyTaxSavings (vue agrégée
// monthly_tax_savings + listOptimisations).

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useMonthlyTaxSavings } from '@/hooks/useMonthlyTaxSavings';

function formatEuros(cents: number): string {
  return Math.round(cents / 100).toLocaleString('fr-FR') + ' €';
}

export const BankFiscalSummary = () => {
  const { loading, totalCentsYTD, totalCentsCurrentMonth, optimisations } = useMonthlyTaxSavings();

  const unconfirmedCount = useMemo(
    () => optimisations.filter((o) => !o.confirmed).length,
    [optimisations],
  );
  const topUnconfirmed = useMemo(
    () => optimisations.find((o) => !o.confirmed),
    [optimisations],
  );

  // Tant que le hook charge, on évite tout flash de carte vide.
  if (loading) return null;
  // Pas de tag → pas d'affichage (la carte n'a rien à dire).
  if (totalCentsYTD === 0 && optimisations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45, ease: 'easeOut' }}
      className="mx-5 lg:mx-8 mt-4"
    >
      <Link
        to="/finances?tab=optimisations"
        className="block bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:border-secondary/40 transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-secondary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Détecté sur ton compte
              </p>
              <p className="text-sm font-semibold text-foreground">
                Optimisations fiscales
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Cumul {new Date().getFullYear()}</p>
            <p className="text-2xl font-bold text-primary mt-0.5">
              {formatEuros(totalCentsYTD)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            <p className="text-2xl font-bold text-foreground mt-0.5 flex items-center gap-1">
              {formatEuros(totalCentsCurrentMonth)}
              {totalCentsCurrentMonth > 0 && (
                <TrendingUp className="h-4 w-4 text-success" />
              )}
            </p>
          </div>
        </div>

        {unconfirmedCount > 0 && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground leading-snug">
              <span className="font-semibold">
                {unconfirmedCount} opération{unconfirmedCount > 1 ? 's' : ''} à confirmer
              </span>
              {topUnconfirmed && (
                <span className="text-muted-foreground">
                  {' '}— ex&nbsp;: {topUnconfirmed.label.length > 28
                    ? topUnconfirmed.label.slice(0, 28) + '…'
                    : topUnconfirmed.label}{' '}
                  ({formatEuros(topUnconfirmed.estimatedSavingsCents)} potentiels)
                </span>
              )}
            </p>
          </div>
        )}
      </Link>
    </motion.div>
  );
};
