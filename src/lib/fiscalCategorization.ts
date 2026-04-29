// Moteur de tagging fiscal des transactions bancaires.
// Pure (pas de dépendance Supabase / env) afin d'être réutilisable :
// - dans le client (preview live au moment où l'utilisateur scroll ses opérations)
// - dans la edge function categorize-transaction (batch lors d'une synchro Powens)
//
// Chaque règle reconnaît un libellé Powens et propose une catégorie fiscale,
// un type de réduction (déduction du revenu vs réduction d'impôt), un taux,
// et un score de confiance. Le calcul des centimes économisés est ensuite
// fait via un taux marginal d'imposition (TMI) injecté en paramètre.

export type FiscalCategory =
  | 'frais_pro'
  | 'ik'
  | 'fbe'
  | 'don_66'
  | 'don_75'
  | 'per'
  | 'mecenat'
  | 'scpi'
  | 'pinel'
  | 'csg_deductible'
  | 'pension_alim'
  | 'frais_garde'
  | 'emploi_domicile';

export type DeductionType = 'reduction' | 'deduction_revenu' | 'credit';

export interface FiscalRule {
  category: FiscalCategory;
  /** Étiquette FR pour l'UI */
  label: string;
  /** reduction = pourcentage du montant directement retiré de l'impôt
   *  deduction_revenu = montant déduit du revenu imposable (gain = montant × TMI)
   *  credit = crédit d'impôt même si non imposable
   */
  type: DeductionType;
  /** Taux appliqué : 0.66 pour un don 66 %, 0.50 pour un emploi à domicile, 1.0 pour le PER (déduction totale du revenu) */
  rate: number;
  /** Regex testée contre le libellé en MAJUSCULES (sans accents) */
  pattern: RegExp;
  /** Confiance par défaut de la règle (0..1) */
  confidence: number;
  /** Direction du flux requise. -1 = sortie d'argent, 0 = peu importe */
  direction: -1 | 0 | 1;
}

export interface FiscalTag {
  category: FiscalCategory;
  label: string;
  type: DeductionType;
  rate: number;
  confidence: number;
  estimatedSavingsCents: number;
}

const RULES: FiscalRule[] = [
  // Dons 66 % : associations d'intérêt général
  {
    category: 'don_66',
    label: 'Don 66 %',
    type: 'reduction',
    rate: 0.66,
    pattern: /MEDECINS DU MONDE|MSF|MEDECINS SANS FRONTIERES|UNICEF|CROIX ROUGE|SECOURS POPULAIRE|SECOURS CATHOLIQUE|FONDATION ABBE PIERRE|WWF|GREENPEACE|HANDICAP INTERNATIONAL|ACTION CONTRE LA FAIM|TELETHON|PASTEUR|FONDATION DE FRANCE|HELLOASSO|ENFOIRES/,
    confidence: 0.9,
    direction: -1,
  },
  // Dons 75 % : aide aux personnes en difficulté (Coluche)
  {
    category: 'don_75',
    label: 'Don 75 % (Coluche)',
    type: 'reduction',
    rate: 0.75,
    pattern: /RESTOS DU COEUR|RESTOS COEUR|EMMAUS|BANQUE ALIMENTAIRE|FONDATION ARMEE DU SALUT/,
    confidence: 0.92,
    direction: -1,
  },
  // PER : versements déductibles du revenu (gain ≈ montant × TMI)
  {
    category: 'per',
    label: 'Versement PER',
    type: 'deduction_revenu',
    rate: 1.0,
    pattern: /\bPER\b|PLAN EPARGNE RETRAITE|PERIN|LINXEA PER|YOMONI PER|RAMIFY PER|NALO PER|GOODVEST/,
    confidence: 0.85,
    direction: -1,
  },
  // Mécénat d'entreprise
  {
    category: 'mecenat',
    label: 'Mécénat',
    type: 'reduction',
    rate: 0.6,
    pattern: /MECENAT|FONDATION ENTREPRISE/,
    confidence: 0.7,
    direction: -1,
  },
  // Frais professionnels (carburant, péages, restos pro)
  {
    category: 'ik',
    label: 'Indemnité kilométrique',
    type: 'deduction_revenu',
    rate: 1.0,
    pattern: /TOTAL ENERGIES|TOTAL ACCESS|SHELL|BP |ESSO|AVIA|LECLERC CARBURANT|CARREFOUR CARBURANT|VINCI AUTOROUTE|APRR |SANEF|ASF |COFIROUTE|ULYS/,
    confidence: 0.55,
    direction: -1,
  },
  // Frais réels — restauration midi pro
  {
    category: 'fbe',
    label: 'Frais de bouche pro',
    type: 'deduction_revenu',
    rate: 1.0,
    pattern: /TICKET RESTAURANT|SWILE|EDENRED|UP DEJEUNER|PLUXEE/,
    confidence: 0.45,
    direction: -1,
  },
  // SCPI souscriptions
  {
    category: 'scpi',
    label: 'Souscription SCPI',
    type: 'deduction_revenu',
    rate: 0.0,
    pattern: /SCPI |CORUM|LA FRANCAISE REM|PRIMONIAL|PERIAL|SOFIDY|EURYALE|REMAKE/,
    confidence: 0.6,
    direction: -1,
  },
  // Emploi à domicile (crédit d'impôt 50 %)
  {
    category: 'emploi_domicile',
    label: 'Emploi à domicile (crédit 50 %)',
    type: 'credit',
    rate: 0.5,
    pattern: /CESU|URSSAF.*CESU|PAJEMPLOI|SHIVA|O2 SERVICES|FAMILY SPHERE|YOOPIES|WECASA|AXEO/,
    confidence: 0.85,
    direction: -1,
  },
  // Frais de garde d'enfant (crédit d'impôt 50 %)
  {
    category: 'frais_garde',
    label: 'Frais de garde (crédit 50 %)',
    type: 'credit',
    rate: 0.5,
    pattern: /CRECHE|MICRO CRECHE|PEOPLE AND BABY|BABILOU|LES PETITS CHAPERONS|ASSISTANTE MATERNELLE|NOURRICE/,
    confidence: 0.85,
    direction: -1,
  },
  // Pension alimentaire (déduction du revenu)
  {
    category: 'pension_alim',
    label: 'Pension alimentaire',
    type: 'deduction_revenu',
    rate: 1.0,
    pattern: /PENSION ALIMENTAIRE|ARIPA|CAF.*PENSION/,
    confidence: 0.8,
    direction: -1,
  },
];

export interface CategorizeInput {
  label: string;
  amountCents: number;
  /** Direction inférée du signe du montant (-1 dépense, +1 entrée) */
  direction: -1 | 1;
  /** TMI 0..1 (ex 0.30 pour 30 %) — utilisé pour les déductions du revenu */
  marginalRate: number;
}

const NORMALIZE_RE = /[̀-ͯ]/g;

export function normalizeLabel(s: string): string {
  return (s || '')
    .normalize('NFD')
    .replace(NORMALIZE_RE, '')
    .toUpperCase();
}

export function categorize(input: CategorizeInput): FiscalTag | null {
  const label = normalizeLabel(input.label);
  const absCents = Math.abs(input.amountCents);
  if (absCents === 0) return null;

  for (const rule of RULES) {
    if (rule.direction !== 0 && rule.direction !== input.direction) continue;
    if (!rule.pattern.test(label)) continue;
    return {
      category: rule.category,
      label: rule.label,
      type: rule.type,
      rate: rule.rate,
      confidence: rule.confidence,
      estimatedSavingsCents: estimateSavingsCents(rule, absCents, input.marginalRate),
    };
  }
  return null;
}

export function estimateSavingsCents(
  rule: Pick<FiscalRule, 'type' | 'rate'>,
  amountCents: number,
  marginalRate: number,
): number {
  switch (rule.type) {
    case 'reduction':
    case 'credit':
      return Math.round(amountCents * rule.rate);
    case 'deduction_revenu':
      return Math.round(amountCents * marginalRate);
    default:
      return 0;
  }
}

export function categoryDisplay(cat: FiscalCategory): { label: string; color: string } {
  const map: Record<FiscalCategory, { label: string; color: string }> = {
    frais_pro: { label: 'Frais pro', color: 'text-blue-600 bg-blue-50' },
    ik: { label: 'IK', color: 'text-amber-600 bg-amber-50' },
    fbe: { label: 'Frais bouche', color: 'text-orange-600 bg-orange-50' },
    don_66: { label: 'Don 66 %', color: 'text-emerald-600 bg-emerald-50' },
    don_75: { label: 'Don 75 %', color: 'text-emerald-700 bg-emerald-100' },
    per: { label: 'PER', color: 'text-violet-600 bg-violet-50' },
    mecenat: { label: 'Mécénat', color: 'text-cyan-600 bg-cyan-50' },
    scpi: { label: 'SCPI', color: 'text-stone-700 bg-stone-100' },
    pinel: { label: 'Pinel', color: 'text-rose-600 bg-rose-50' },
    csg_deductible: { label: 'CSG ded.', color: 'text-slate-600 bg-slate-100' },
    pension_alim: { label: 'Pension alim.', color: 'text-indigo-600 bg-indigo-50' },
    frais_garde: { label: 'Garde enfant', color: 'text-pink-600 bg-pink-50' },
    emploi_domicile: { label: 'Emploi domicile', color: 'text-teal-600 bg-teal-50' },
  };
  return map[cat];
}
