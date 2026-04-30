import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserProfile, calculateDashboardMetrics } from '@/lib/dashboardService';

interface Chip {
  id: string;
  label: string;
  prompt: string;
}

const FALLBACK_CHIPS: Chip[] = [
  { id: 'tmi', label: 'C\'est quoi ma TMI ?', prompt: 'Explique-moi ma tranche marginale d\'imposition' },
  { id: 'taxe-fonciere', label: 'Quand je paie ma taxe foncière ?', prompt: 'Quand dois-je payer ma taxe foncière ?' },
  { id: 'declaration', label: 'Date limite déclaration ?', prompt: 'Quelle est la date limite de ma déclaration de revenus ?' },
];

interface Props {
  onSelect?: (prompt: string) => void;
}

export const ContextualChips = ({ onSelect }: Props) => {
  const { user } = useAuth();
  const reduce = useReducedMotion();
  const [chips, setChips] = useState<Chip[]>(FALLBACK_CHIPS);

  useEffect(() => {
    if (!user) {
      setChips(FALLBACK_CHIPS);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const profile = await loadUserProfile(user.id);
        if (cancelled || !profile) return;

        const dynamic: Chip[] = [];

        // PER detected
        if (profile.percoAmount > 0 || (profile.netMonthlySalary > 0 && profile.isEmployee)) {
          dynamic.push({
            id: 'per-2000',
            label: 'Combien je gagne en versant 2 000€ sur mon PER ?',
            prompt: 'Combien je gagne fiscalement en versant 2 000€ sur mon PER ?',
          });
        }

        // Frais réels possible (employee with significant salary)
        if (profile.isEmployee && profile.netMonthlySalary > 1500) {
          dynamic.push({
            id: 'frais-reels',
            label: 'Frais réels vs forfait, qu\'est-ce qui me convient ?',
            prompt: 'Frais réels vs forfait 10%, qu\'est-ce qui me convient ?',
          });
        }

        // Revenus locatifs
        if (profile.rentalPropertiesCount > 0) {
          dynamic.push({
            id: 'micro-foncier',
            label: 'Micro-foncier ou réel pour mon T3 ?',
            prompt: 'Dois-je choisir le micro-foncier ou le régime réel pour mon locatif ?',
          });
        }

        // Take metrics-driven recommendations as inspiration if room
        const metrics = calculateDashboardMetrics(profile);
        for (const reco of metrics.recommendations.slice(0, 2)) {
          if (dynamic.length >= 4) break;
          dynamic.push({
            id: `reco-${reco.id}`,
            label: reco.title,
            prompt: `${reco.title} — explique-moi`,
          });
        }

        // Always merge fallbacks at the end (limit total 7)
        const merged = [...dynamic, ...FALLBACK_CHIPS].slice(0, 7);
        setChips(merged);
      } catch {
        setChips(FALLBACK_CHIPS);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div
      className="-mx-4 overflow-x-auto px-4"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style>{`
        .elio-chips-strip::-webkit-scrollbar { display: none; }
      `}</style>
      <div className="elio-chips-strip flex gap-2 pb-1">
        {chips.map((chip, idx) => (
          <motion.button
            key={chip.id}
            type="button"
            onClick={() => onSelect?.(chip.prompt)}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.4 + idx * 0.03,
            }}
            className="shrink-0 rounded-full border bg-muted text-foreground transition-colors duration-200 hover:text-primary"
            style={{
              height: 36,
              padding: '0 14px',
              fontSize: '13px',
              fontWeight: 500,
              borderColor: 'hsl(var(--border) / 0.5)',
              backgroundColor: 'hsl(var(--muted))',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--coral-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(var(--muted))';
            }}
          >
            {chip.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
