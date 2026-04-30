import { memo } from 'react';

const STEPS = [
  {
    n: '01',
    title: 'Réponds en 90 secondes',
    desc: "Quelques questions sur ta situation : revenus, logement, situation familiale. Pas de paperasse, pas de comptes en banque à connecter.",
  },
  {
    n: '02',
    title: 'Vois ce que tu peux récupérer',
    desc: "Élio scanne tes impôts, tes aides oubliées et tes contrats. Tu reçois ton diagnostic personnalisé en clair.",
  },
  {
    n: '03',
    title: 'Lance les démarches en un clic',
    desc: "Pour chaque opportunité détectée, Élio te guide pas à pas. Formulaires pré-remplis, deadlines suivies, démarches simplifiées.",
  },
];

function LandingStepsBase() {
  return (
    <section className="lp-steps" id="how" aria-labelledby="lp-steps-title">
      <div className="lp-steps-header">
        <p className="lp-steps-label">Comment ça marche</p>
        <h2 id="lp-steps-title" className="lp-steps-h2">
          De la question au remboursement, en 3 étapes.
        </h2>
        <p className="lp-steps-subtitle">
          Pas d'expertise comptable, pas de paperasse. Élio fait le travail à ta place.
        </p>
      </div>
      <ol className="lp-steps-grid">
        {STEPS.map((s) => (
          <li key={s.n} className="lp-step-item">
            <article className="lp-step">
              <span className="lp-step-number" aria-hidden="true">{s.n}</span>
              <h3 className="lp-step-title">{s.title}</h3>
              <p className="lp-step-desc">{s.desc}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const LandingSteps = memo(LandingStepsBase);
