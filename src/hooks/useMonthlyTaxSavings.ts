import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  getMonthlyTaxSavings,
  listOptimisations,
  type MonthlyTaxSavingsRow,
  type OptimisationItem,
} from '@/lib/financesService';

interface State {
  loading: boolean;
  months: MonthlyTaxSavingsRow[];
  optimisations: OptimisationItem[];
  totalCentsYTD: number;
  totalCentsCurrentMonth: number;
  totalCentsPrevMonth: number;
}

const empty: State = {
  loading: true,
  months: [],
  optimisations: [],
  totalCentsYTD: 0,
  totalCentsCurrentMonth: 0,
  totalCentsPrevMonth: 0,
};

export function useMonthlyTaxSavings() {
  const { user } = useAuth();
  const [state, setState] = useState<State>(empty);

  const refresh = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const [months, optimisations] = await Promise.all([
        getMonthlyTaxSavings(user.id, 12),
        listOptimisations(user.id, 100),
      ]);
      const now = new Date();
      const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prev = new Date(now);
      prev.setMonth(prev.getMonth() - 1);
      const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
      const yearPrefix = `${now.getFullYear()}-`;

      const totalCentsYTD = months
        .filter((m) => m.month.startsWith(yearPrefix))
        .reduce((s, m) => s + (m.total_savings_cents || 0), 0);
      const currentRow = months.find((m) => m.month === currentKey);
      const prevRow = months.find((m) => m.month === prevKey);

      setState({
        loading: false,
        months,
        optimisations,
        totalCentsYTD,
        totalCentsCurrentMonth: currentRow?.total_savings_cents ?? 0,
        totalCentsPrevMonth: prevRow?.total_savings_cents ?? 0,
      });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime : refresh dès qu'un tag fiscal change pour cet utilisateur.
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel('finances-tax-tags')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transaction_fiscal_tags', filter: `user_id=eq.${user.id}` },
        () => refresh(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refresh]);

  return { ...state, refresh };
}
