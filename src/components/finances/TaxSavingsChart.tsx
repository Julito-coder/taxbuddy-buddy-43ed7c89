import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import type { MonthlyTaxSavingsRow } from '@/lib/financesService';
import { formatCents } from '@/lib/financesService';

interface Props {
  months: MonthlyTaxSavingsRow[];
  totalCentsYTD: number;
  totalCentsCurrentMonth: number;
  totalCentsPrevMonth: number;
  loading?: boolean;
}

const MONTH_LABELS = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

function buildSeries(months: MonthlyTaxSavingsRow[]): Array<{ key: string; label: string; cents: number; isCurrent: boolean }> {
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const buckets: Array<{ key: string; label: string; cents: number; isCurrent: boolean }> = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const row = months.find((m) => m.month === key);
    buckets.push({
      key,
      label: MONTH_LABELS[d.getMonth()],
      cents: row?.total_savings_cents ?? 0,
      isCurrent: key === currentKey,
    });
  }
  return buckets;
}

export const TaxSavingsChart = ({ months, totalCentsYTD, totalCentsCurrentMonth, totalCentsPrevMonth, loading }: Props) => {
  const series = buildSeries(months);
  const delta = totalCentsCurrentMonth - totalCentsPrevMonth;
  const trendingUp = delta >= 0;

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Économie d'impôt potentielle</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {loading ? '—' : formatCents(totalCentsYTD)}
            </p>
            <p className="text-xs text-muted-foreground">
              cumulée sur l'année {new Date().getFullYear()}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            <p className="text-xl font-semibold text-foreground">
              {loading ? '—' : formatCents(totalCentsCurrentMonth)}
            </p>
            <div className={`inline-flex items-center gap-1 text-xs font-medium ${trendingUp ? 'text-success' : 'text-destructive'}`}>
              {trendingUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {formatCents(Math.abs(delta))} vs M-1
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="h-44"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v: number) => (v >= 100 ? `${Math.round(v / 100)}€` : '')}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [formatCents(v), 'Économie potentielle']}
                labelFormatter={(l) => `Mois : ${l}`}
              />
              <Bar dataKey="cents" radius={[6, 6, 0, 0]}>
                {series.map((b, i) => (
                  <Cell key={i} fill={b.isCurrent ? '#0F1E33' : 'rgba(15, 30, 51, 0.35)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <p className="text-[11px] text-muted-foreground">
          Estimation calculée à partir de tes transactions catégorisées et de ta TMI. Confirme une optimisation pour la verrouiller.
        </p>
      </CardContent>
    </Card>
  );
};
