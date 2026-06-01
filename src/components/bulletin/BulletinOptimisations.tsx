import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCoachFeed, type CoachRecommendation } from '@/lib/coachService';
import { formatCurrency } from '@/lib/dashboardService';

export const BulletinOptimisations = () => {
  const { user } = useAuth();
  const [recos, setRecos] = useState<CoachRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      try {
        const feed = await getCoachFeed(user.id);
        if (!cancelled) setRecos(feed.pending.slice(0, 3));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="px-5 py-3">
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Analyse de tes optimisations…</span>
        </div>
      </div>
    );
  }

  if (recos.length === 0) return null;

  return (
    <div className="px-5 py-3 space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-secondary uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" /> Optimisations
        </span>
        <Link
          to="/profil/mes-optimisations"
          className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Voir toutes <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {recos.map((r) => (
        <Link
          key={r.id}
          to="/profil/mes-optimisations"
          className="block bg-card border border-border rounded-xl p-3.5 hover:shadow-sm hover:border-coral-500/30 transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.description}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-bold text-success">+{formatCurrency(r.gain)}</span>
              <span className="text-[10px] text-muted-foreground">/an</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
