import { Sparkles } from 'lucide-react';
import { categoryDisplay, type FiscalCategory } from '@/lib/fiscalCategorization';

interface Props {
  category: FiscalCategory;
  savingsCents: number;
  confirmed?: boolean;
  size?: 'sm' | 'md';
}

export const TransactionFiscalBadge = ({ category, savingsCents, confirmed, size = 'sm' }: Props) => {
  const display = categoryDisplay(category);
  const tight = size === 'sm';
  const eur = (savingsCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${display.color} ${tight ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
      title={confirmed ? 'Optimisation confirmée' : 'Optimisation détectée — à confirmer'}
    >
      <Sparkles className={tight ? 'h-2.5 w-2.5' : 'h-3 w-3'} />
      <span>{display.label}</span>
      {savingsCents > 0 && (
        <span className="opacity-80">· -{eur}</span>
      )}
      {confirmed && <span className="ml-0.5">✓</span>}
    </span>
  );
};
