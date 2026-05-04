import { useScrollReveal } from './hooks/useScrollReveal';
import { useCountUp } from './hooks/useCountUp';

const STATS = [
  {
    target: 10,
    unit: 'Md€',
    label: "d'aides non réclamées chaque année en France",
  },
  {
    target: 2000,
    unit: '€',
    label: 'récupérables en moyenne par foyer chaque année',
  },
  {
    target: 90,
    unit: 's',
    label: 'pour faire ton diagnostic',
  },
];

function StatCard({
  target,
  unit,
  label,
  index,
  start,
}: {
  target: number;
  unit: string;
  label: string;
  index: number;
  start: boolean;
}) {
  const value = useCountUp(target, { start, duration: 1500 });
  const formatted = target >= 1000 ? value.toLocaleString('fr-FR') : String(value);
  return (
    <div
      className="lp-stat lp-reveal"
      data-cascade={index + 1}
      data-revealed={start || undefined}
    >
      <p className="lp-stat-value">
        {formatted}
        <span className="lp-stat-unit">&nbsp;{unit}</span>
      </p>
      <p className="lp-stat-label">{label}</p>
    </div>
  );
}

export function LandingStats() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} className="lp-stats" aria-label="Chiffres clés">
      <div className="lp-stats-inner">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} index={i} start={isVisible} />
        ))}
      </div>
    </section>
  );
}
