import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getTopCoachAction, type CoachAction } from '@/lib/coach/triggers';
import { supabase } from '@/integrations/supabase/client';

export const CoachPinnedCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [action, setAction] = useState<CoachAction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      try {
        const a = await getTopCoachAction(user.id);
        if (!cancelled) setAction(a);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();

    // Refresh quand un tag fiscal change
    const ch = supabase
      .channel('bulletin-coach-pinned')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transaction_fiscal_tags', filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user]);

  if (loading) {
    return (
      <div className="px-5 py-4">
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Coach analyse tes flux…</span>
        </div>
      </div>
    );
  }

  if (!action) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="px-5 py-3"
    >
      <button
        onClick={() => navigate(action.deepLink)}
        className="w-full bg-gradient-to-br from-secondary/10 via-card to-card border border-secondary/30 rounded-2xl p-4 text-left hover:shadow-md transition-all group"
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
            <Compass className="h-5 w-5 text-secondary" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-secondary uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Coach
              </span>
              {action.estimatedSavingsCents > 0 && (
                <span className="text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                  -{(action.estimatedSavingsCents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                </span>
              )}
            </div>
            <p className="font-semibold text-foreground leading-tight">{action.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{action.description}</p>
            <div className="flex items-center gap-1 text-xs font-semibold text-secondary mt-1">
              {action.cta}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
};
