import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { buildDynamicCoachActions } from '@/lib/coach/triggers';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  className?: string;
}

export const CoachInlineBadge = ({ className }: Props) => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      try {
        const actions = await buildDynamicCoachActions(user.id);
        if (!cancelled) setCount(actions.length);
      } catch {
        if (!cancelled) setCount(0);
      }
    };
    load();

    const ch = supabase
      .channel('coach-inline-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transaction_fiscal_tags', filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user]);

  if (count === 0) return null;

  return (
    <Link
      to="/coach"
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/15 px-2.5 py-1 rounded-full transition-colors ${className ?? ''}`}
      title="Voir mes actions Coach"
    >
      <Compass className="h-3 w-3" />
      <span>{count} action{count > 1 ? 's' : ''} Coach</span>
    </Link>
  );
};
