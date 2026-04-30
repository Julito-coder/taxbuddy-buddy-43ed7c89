const STATS = [
  {
    value: '10',
    unit: 'Md€',
    label: "d'aides non réclamées chaque année en France",
  },
  {
    value: '2 000',
    unit: '€',
    label: 'récupérables en moyenne par foyer chaque année',
  },
  {
    value: '90',
    unit: 's',
    label: 'pour faire ton diagnostic',
  },
];

export function LandingStats() {
  return (
    <section className="lp-stats" aria-label="Chiffres clés">
      <div className="lp-stats-inner">
        {STATS.map((s) => (
          <div key={s.label} className="lp-stat">
            <p className="lp-stat-value">
              {s.value}<span className="lp-stat-unit">&nbsp;{s.unit}</span>
            </p>
            <p className="lp-stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
