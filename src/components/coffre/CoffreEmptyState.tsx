/**
 * CoffreEmptyState — État vide pour la page Coffre-fort.
 *
 * Variant V1 unique : 'no-document' (aucun document uploadé).
 *
 * Style aligné CoachEmptyState Batch 7 + FinancesEmptyState Batch 8 +
 * AidesEmptyState Batch 10 + CalendarEmptyState Batch 11 : bg-card
 * rounded-xl border border-border p-8 text-center. Accent subtil
 * border-t-primary/10 (signature brand discrète tier 4).
 */

import { FolderLock } from 'lucide-react';

export type CoffreEmptyStateVariant = 'no-document';

interface CoffreEmptyStateProps {
  variant: CoffreEmptyStateVariant;
}

export const CoffreEmptyState = ({ variant }: CoffreEmptyStateProps) => {
  // V1 : un seul variant, structure stable. Variants ultérieurs ajoutables ici.
  if (variant !== 'no-document') return null;

  return (
    <div className="bg-card rounded-xl border border-border border-t-primary/10 p-8 text-center">
      <FolderLock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <p className="font-medium text-foreground">Aucun document pour l'instant.</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
        Ajoute ton premier contrat ou avis d'imposition pour commencer.
      </p>
    </div>
  );
};
