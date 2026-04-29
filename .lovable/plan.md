## Contexte

Le moteur de calcul immobilier vit dans deux fichiers principaux : `src/lib/simulationEngine.ts` (Locatif + base RP) et `src/lib/rpCalculations.ts` (solvabilité ménage RP). En les comparant aux normes HCSF 2025 et aux pratiques bancaires courantes, plusieurs incohérences expliquent les écarts visibles dans le dashboard.

## Bugs identifiés

### A. Solvabilité (RP & Locatif)

1. **DTI sans pondération locative** (`rpCalculations.ts` L86-92, et absence côté Locatif dans `simulationEngine.ts`)
   - Aujourd'hui : `(crédits + nouvelle mensualité) / revenus`
   - Norme HCSF / banque : pour un investissement Locatif, le loyer net est intégré côté revenus à **70 %** (pondération vacance + impayés) avant calcul du taux d'effort. Aucun module ne le fait.
   - Conséquence : DTI surévalué pour Locatif, DTI correct pour RP mais **non-cohérent inter-modules**.

2. **Reste à vivre — seuils non standards** (`rpCalculations.ts` L122-141)
   - Seuils actuels : 400 €/pers (cible) et 300 €/pers (danger), comptés à plat.
   - Standard bancaire : ~**900 € adulte 1**, **500 € adulte 2**, **400 €/enfant**. Le calcul "à plat × memberCount" sous-estime le besoin pour un couple avec enfants.

3. **Charges logement incomplètes pour Locatif** : la solvabilité côté Locatif n'est pas calculée ; on n'expose que `monthly_cashflow_after_tax`. Pas de DTI ni reste à vivre Locatif → incohérence dans le dashboard quand l'utilisateur a un projet RP + Locatif.

### B. Rendements (Locatif)

4. **NOI utilise `annualRent` brut** (`simulationEngine.ts` L424-426)
   - `noi = annualRent * (1 - vacancy) - firstYearCosts`
   - Manque l'impayé (`default_rate`) et n'utilise pas `calculateAdjustedRentalIncome` (qui gère meublé saisonnier, croissance, etc.). Pour un meublé saisonnier, le NOI est faux.

5. **Rendement net-net sur moyenne des cashflows après impôt** (L428-431)
   - `netNetYield = avgCashflowAfterTax / totalCost`
   - Définition usuelle : `(loyer net - charges - impôts) / coût total` SANS le service de la dette (sinon on confond rendement et levier). Aujourd'hui le cashflow inclut `loan_payment`, ce qui transforme le "net-net" en "rendement après dette" → confusion utilisateur.

6. **DSCR ne prend pas l'assurance** (L440-441)
   - `annualDebtService = monthlyPayment * 12` ; or `monthlyPayment` du mois 1 inclut déjà l'assurance dans `generateAmortizationTable` (L84). OK pour mois normal, mais **pas** pour différé partiel/total → DSCR faussé en différé.
   - Plus critique : `noi` ici est calculé sans `default_rate`, donc DSCR optimiste.

### C. IRR

7. **Down payment != cash investi** (L319)
   - `irrCashflows[0] = -financing.down_payment`
   - Le cash investi à T0 = apport + frais notaire + frais agence + frais bancaires + frais de courtage + meubles + travaux **non financés**. Aujourd'hui on ne compte que l'apport → IRR systématiquement surévalué.

8. **Plus-value : abattements pour durée de détention non appliqués** (L408-410)
   - `capitalGainTax = capitalGain * tax_rate` à plat.
   - Code 2025 : abattement progressif IR (6 %/an de l'année 6 à 21, puis 4 % en 22) et PS (1,65 %/an années 6-21, 1,60 % an 22, 9 % années 23-30). Surévalue largement l'impôt en sortie longue → IRR sous-évalué pour horizon > 6 ans. Incohérent avec le bug #7 (qui surévalue l'IRR).

### D. Cohérence inter-modules

9. **`totalCost` divergent** : `simulationEngine` (L289-298) somme 8 postes ; `rpCalculations` (L108-110) en somme 4. Pour un même projet RP, le coût total affiché côté KPI ≠ celui utilisé pour LTV/patrimoine.

10. **LTV (`rpCalculations` L103-105)** : calculée sur `price_net_seller` seulement. Standard bancaire : LTV = `loan / (price + frais notaire)` ou `loan / valeur de gage`. Diverge de ce que la banque calcule.

11. **Break-even rent (L506-509)** : `taxFactor = 1 - tmi*0.7` est une approximation grossière qui ignore le régime fiscal réel (micro vs réel, déductibilité intérêts, amortissement LMNP). Résultat incohérent avec `calculateAnnualTax`.

## Plan de correction

### Étape 1 — Constantes fiscales & normes (nouveau fichier)
Créer `src/lib/realEstate/standards.ts` :
- Seuils HCSF 2025 (DTI 35 %, durée max 25 ans, dérogation 20 %).
- Reste à vivre par typologie (adulte 1, adulte 2, enfant).
- Pondération loyer Locatif (70 %).
- Barème abattements plus-value IR + PS (durée détention).

### Étape 2 — Refactor `simulationEngine.ts`
- **Bug #4** : NOI = `calculateAdjustedRentalIncome(rental, 1) - firstYearCosts` (intègre vacance + impayés + saisonnier).
- **Bug #5** : `netNetYield = (NOI - tax_year1) / totalCost` (sans service dette). Renommer l'ancien indicateur en `cash_on_cash_yield` (rendement sur cash investi après dette).
- **Bug #6** : DSCR = NOI corrigé / (capital + intérêts annuels du tableau d'amortissement, hors assurance).
- **Bug #7** : `cashInvested` = down_payment + notaire + agence + frais bancaires + courtage + garantie + (meubles/travaux non financés). Utiliser pour IRR L0 et pour cash-on-cash.
- **Bug #8** : nouvelle fonction `calculateCapitalGainTax(gain, holdingYears)` appliquant les abattements 2025.
- **Bug #11** : break-even rent recalculé en réutilisant `calculateAnnualTax` par dichotomie (au lieu de l'approximation `tmi*0.7`).

### Étape 3 — Refactor `rpCalculations.ts`
- **Bug #2** : `minResteAVivre = 900 + 500*(adultes-1) + 400*enfants` (récupérer composition foyer depuis profile / `members`).
- **Bug #9 & #10** : importer `calculateTotalProjectCost()` depuis `simulationEngine` (source unique). LTV = `loan / (price + notaire)`.
- Aligner les seuils status sur HCSF (35 % cible, 40 % danger reste OK, mais expliciter la dérogation 20 %).

### Étape 4 — Étendre la solvabilité au Locatif
Ajouter dans `simulationEngine.ts` une fonction `calculateLocatifSolvency(data, household)` qui :
- Pondère le loyer net à 70 % côté revenus.
- Calcule DTI Locatif = `(crédits existants + nouvelle mensualité) / (revenus + 0.7*loyer_net_mensuel)`.
- Expose dans `SimulationResults` : `dti_bank`, `reste_a_vivre`, pour cohérence inter-modules.

### Étape 5 — Tests & QA
- Vérifier sur un cas RP : couple 1 enfant, 4 500 €/mois, prêt 250 k€/25 ans → DTI ~33 %, RAV ~1 100 € → status `success`.
- Cas Locatif : T2 800 €/mois, prêt 180 k€/20 ans, TMI 30 % → NOI cohérent avec vacance 8 %, IRR 10 ans avec abattement plus-value.
- Comparer les KPI affichés dans `RPResultsDashboard.tsx` et `KPICardsGrid.tsx` avant/après pour valider la non-régression.

### Détails techniques

```text
SimulationResults (nouveaux champs)
├── cash_invested          // T0 réel
├── cash_on_cash_yield     // ancien net_net renommé
├── net_net_yield          // recalculé sans service dette
├── dti_bank               // taux d'effort bancaire (Locatif)
├── reste_a_vivre          // RAV mensuel ménage (Locatif)
└── capital_gain_tax_detail // {ir, ps, abattement_ir_pct, abattement_ps_pct}
```

Fichiers touchés :
- `src/lib/simulationEngine.ts` (refactor majeur)
- `src/lib/rpCalculations.ts` (refactor moyen)
- `src/lib/realEstate/standards.ts` (nouveau)
- `src/lib/realEstateTypes.ts` (extension `SimulationResults`)
- `src/components/simulator/results/KPICardsGrid.tsx` + `RPResultsDashboard.tsx` (afficher nouveaux KPI, renommer `net_net`)

Aucun changement de schéma DB nécessaire (les `simulation_results.results_jsonb` sont stockés en JSONB libre).
