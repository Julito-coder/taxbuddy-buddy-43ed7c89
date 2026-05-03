import { useState, useId, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from './hooks/useScrollReveal';

type FAQItem = { q: string; a: ReactNode };

const ITEMS: FAQItem[] = [
  {
    q: 'Mes données fiscales sont-elles en sécurité ?',
    a: "Oui. Élio est hébergé en France sur des serveurs Supabase conformes RGPD. Tes données sont chiffrées au repos et en transit. Tu restes propriétaire de tes informations à 100% : tu peux les exporter ou les supprimer à tout moment depuis ton espace personnel. Élio ne vend jamais tes données, ne les partage avec aucun tiers commercial, et ne les utilise pas pour de la publicité.",
  },
  {
    q: "Comment je sais que les chiffres d'Élio sont corrects ?",
    a: "Élio ne calcule pas les montants au pif. Tous les chiffres affichés (impôt sur le revenu, aides, cotisations) sont calculés par des moteurs déterministes basés sur les barèmes officiels de la DGFiP, l'URSSAF et les CAF. Aucun algorithme propriétaire qui te raconte n'importe quoi. Tu peux toujours vérifier la source de chaque calcul dans le détail. Si tu trouves une erreur, on la corrige et on te rembourse l'année en cours.",
  },
  {
    q: "C'est quoi la différence avec Mes Aides, Mon Compte Formation ou un expert-comptable ?",
    a: "Mes Aides et Mon Compte Formation sont des outils gouvernementaux excellents — mais chacun couvre une partie du sujet. Élio les agrège tous, croise tes données, et te dit où tu perds le plus. Un expert-comptable t'apporte une expertise humaine (que rien ne remplace pour les cas complexes) mais coûte 1 200 € à 3 000 € par an. Élio te coûte 79 € par an et couvre 90% des situations courantes en France. Quand un cas dépasse Élio, on te recommande un vrai expert humain.",
  },
  {
    q: 'Pourquoi payer alors que ces infos sont déjà gratuites en ligne ?',
    a: "Parce que trouver l'info, la croiser avec ta situation, et passer à l'action prend des heures. Le diagnostic Élio te donne ton bilan complet en 90 secondes. Le plan gratuit Découverte te montre déjà tes principales aides — c'est la meilleure façon de tester avant de t'engager. Élio + (9,90 €/mois ou 79 €/an) ajoute la détection des optimisations fiscales, les démarches automatisées et l'agent IA. La promesse est simple : si Élio + ne te fait pas gagner au moins son prix annuel, le plan gratuit suffit pour toi.",
  },
  {
    q: 'Élio fait les démarches à ma place ou il me dit juste quoi faire ?',
    a: (
      <>
        Les deux, selon la démarche. Pour les actions simples (déclaration de changement de situation, demande de prime d'activité, simulation logement), Élio remplit les formulaires officiels avec tes données et te les soumet en un clic. Pour les actions qui nécessitent ton accord explicite ou une signature (déclaration d'impôt, demande de prêt étudiant), Élio te guide pas à pas avec les bons liens et te prépare les documents — tu valides toi-même.{' '}
        <strong>Tu restes toujours en contrôle de ce qui est envoyé en ton nom.</strong>
      </>
    ),
  },
];

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section ref={ref} className="lp-faq" id="faq">
      <div className="lp-faq-inner">
        <div
          className="lp-faq-header lp-reveal"
          data-revealed={isVisible || undefined}
        >
          <p className="lp-faq-label">Questions</p>
          <h2 className="lp-faq-h2">Tout ce que tu te demandes avant de te lancer.</h2>
          <p className="lp-faq-subtitle">
            Les réponses honnêtes aux 5 questions qu'on nous pose le plus souvent.
          </p>
        </div>
        <ul className="lp-faq-list">
          {ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            const triggerId = `${baseId}-trigger-${i}`;
            const contentId = `${baseId}-content-${i}`;
            return (
              <li
                key={item.q}
                className="lp-faq-item lp-reveal"
                data-cascade={i + 1}
                data-revealed={isVisible || undefined}
              >
                <h3 className="lp-faq-heading">
                  <button
                    type="button"
                    id={triggerId}
                    className="lp-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    data-state={isOpen ? 'open' : 'closed'}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="lp-faq-question">{item.q}</span>
                    <span className="lp-faq-chevron" aria-hidden="true">
                      <ChevronDown />
                    </span>
                  </button>
                </h3>
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="lp-faq-content"
                  data-state={isOpen ? 'open' : 'closed'}
                >
                  <div className="lp-faq-content-inner">
                    <p className="lp-faq-answer">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
