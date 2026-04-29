// Standards bancaires & fiscaux 2025 pour les calculs immobiliers
// Source unique pour HCSF, normes banque, abattements plus-value (CGI art. 150 VC).

// ============= HCSF / Banque =============
export const HCSF = {
  /** Taux d'effort maximum (DTI) — 35% assurance comprise */
  MAX_DTI_PCT: 35,
  /** Tolérance dérogation HCSF (20% des dossiers banque) */
  MAX_DTI_DEROGATION_PCT: 40,
  /** Durée maximale du prêt (en mois) */
  MAX_LOAN_DURATION_MONTHS: 25 * 12,
  /** Pondération du loyer net pour le calcul du taux d'effort en Locatif (70%) */
  RENTAL_INCOME_WEIGHTING: 0.70,
};

// ============= Reste à vivre minimum =============
// Standards bancaires : varie selon composition du foyer.
// Source : pratiques HSBC/CA/BNP/SG 2024-2025 (médiane).
export const RESTE_A_VIVRE = {
  ADULT_1: 900,   // adulte 1 (référent)
  ADULT_2: 500,   // adulte 2 (conjoint)
  CHILD: 400,     // par enfant à charge
  /** Seuil "danger" sous lequel le dossier est rejeté */
  DANGER_FACTOR: 0.6, // 60% du minimum requis
};

/**
 * Calcule le reste à vivre minimum requis selon la composition du foyer.
 */
export function getMinResteAVivre(adults: number, children: number): number {
  const a = Math.max(1, adults);
  const c = Math.max(0, children);
  return RESTE_A_VIVRE.ADULT_1
    + RESTE_A_VIVRE.ADULT_2 * (a - 1)
    + RESTE_A_VIVRE.CHILD * c;
}

// ============= Plus-value immobilière 2025 =============
// CGI art. 150 VC. Abattements pour durée de détention.
// Pour la résidence secondaire / locatif (la RP est exonérée).

/**
 * Abattement IR (impôt sur le revenu, taux 19%).
 * - 0% les 5 premières années
 * - 6%/an de l'année 6 à 21
 * - 4% à l'année 22
 * - Exonération totale après 22 ans
 */
export function getCapitalGainAbatementIR(holdingYears: number): number {
  if (holdingYears < 6) return 0;
  if (holdingYears >= 22) return 1;
  let abatement = 0;
  for (let y = 6; y <= Math.min(21, holdingYears); y++) abatement += 0.06;
  if (holdingYears >= 22) abatement += 0.04;
  return Math.min(1, abatement);
}

/**
 * Abattement Prélèvements sociaux (taux 17,2%).
 * - 0% les 5 premières années
 * - 1,65%/an années 6 à 21
 * - 1,60% année 22
 * - 9%/an années 23 à 30
 * - Exonération totale après 30 ans
 */
export function getCapitalGainAbatementPS(holdingYears: number): number {
  if (holdingYears < 6) return 0;
  if (holdingYears >= 30) return 1;
  let abatement = 0;
  for (let y = 6; y <= Math.min(21, holdingYears); y++) abatement += 0.0165;
  if (holdingYears >= 22) abatement += 0.016;
  for (let y = 23; y <= Math.min(30, holdingYears); y++) abatement += 0.09;
  return Math.min(1, abatement);
}

export const CAPITAL_GAIN_RATES = {
  IR: 0.19,
  PS: 0.172,
};

export interface CapitalGainTaxBreakdown {
  ir: number;
  ps: number;
  total: number;
  abatement_ir_pct: number;
  abatement_ps_pct: number;
  taxable_base_ir: number;
  taxable_base_ps: number;
}

/**
 * Calcule l'impôt sur la plus-value immobilière (résidence secondaire / locatif).
 * Applique abattements IR + PS selon durée de détention.
 */
export function calculateCapitalGainTax(
  grossGain: number,
  holdingYears: number,
): CapitalGainTaxBreakdown {
  if (grossGain <= 0) {
    return { ir: 0, ps: 0, total: 0, abatement_ir_pct: 0, abatement_ps_pct: 0, taxable_base_ir: 0, taxable_base_ps: 0 };
  }
  const abIR = getCapitalGainAbatementIR(holdingYears);
  const abPS = getCapitalGainAbatementPS(holdingYears);
  const baseIR = grossGain * (1 - abIR);
  const basePS = grossGain * (1 - abPS);
  const ir = baseIR * CAPITAL_GAIN_RATES.IR;
  const ps = basePS * CAPITAL_GAIN_RATES.PS;
  return {
    ir: Math.round(ir),
    ps: Math.round(ps),
    total: Math.round(ir + ps),
    abatement_ir_pct: Math.round(abIR * 1000) / 10,
    abatement_ps_pct: Math.round(abPS * 1000) / 10,
    taxable_base_ir: Math.round(baseIR),
    taxable_base_ps: Math.round(basePS),
  };
}
