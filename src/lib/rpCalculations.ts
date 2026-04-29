// RP (Résidence Principale) - Centralized calculation functions
// These functions are used by both RPResultsDashboard and rpPdfExport to ensure consistency

import { FullProjectData } from './realEstateTypes';
import { calculateTotalProjectCost } from './simulationEngine';
import { HCSF, getMinResteAVivre } from './realEstate/standards';

export interface HouseholdMember {
  id?: string;
  firstName: string;
  relation: string;
  professionalStatus: string;
  netMonthlySalary: number;
  contractType: string;
  existingCredits: number;
}

export interface HouseholdData {
  primaryIncome: number;
  primaryExistingCredits: number;
  members: HouseholdMember[];
  otherChargesMonthly: number;
}

export interface RPMetrics {
  // Income totals
  totalHouseholdIncome: number;
  totalExistingCredits: number;
  memberCount: number;
  
  // Housing costs
  monthlyPayment: number;
  monthlyPropertyTax: number;
  monthlyCondoCharges: number;
  monthlyInsurance: number;
  totalHousingCostMonthly: number;
  
  // Banking metrics
  totalCreditsAfterProject: number;
  debtRatio: number; // DTI percentage
  resteAVivre: number;
  monthlyEffort: number;
  ltv: number;
  
  // Patrimony
  totalProjectCost: number;
  netPatrimonyAtHorizon: number;
  propertyValueAtHorizon: number;
  remainingDebtAtHorizon: number;
  totalCreditCost: number;
  
  // Status
  isViable: boolean;
  statusLevel: 'success' | 'warning' | 'danger';
  statusMessage: string;
}

/**
 * Calculate all RP metrics from project data and household configuration
 * This is the single source of truth for RP calculations
 */
export function calculateRPMetrics(
  data: FullProjectData,
  household: HouseholdData
): RPMetrics {
  const { project, acquisition, financing, operating_costs, owner_occupier, results } = data;
  
  // === INCOME TOTALS ===
  const primaryIncome = household.primaryIncome || 0;
  const membersIncome = (household.members || []).reduce((sum, m) => sum + (m.netMonthlySalary || 0), 0);
  const totalHouseholdIncome = primaryIncome + membersIncome;
  
  const primaryCredits = household.primaryExistingCredits || 0;
  const membersCredits = (household.members || []).reduce((sum, m) => sum + (m.existingCredits || 0), 0);
  const totalExistingCredits = primaryCredits + membersCredits;
  
  const memberCount = 1 + (household.members || []).length;
  
  // === HOUSING COSTS ===
  const monthlyPayment = financing.monthly_payment || 0;
  const monthlyPropertyTax = (operating_costs.property_tax_annual || 0) / 12;
  const monthlyCondoCharges = (operating_costs.condo_nonrecoverable_annual || 0) / 12;
  const monthlyInsurance = (operating_costs.insurance_annual || 0) / 12;
  const totalHousingCostMonthly = monthlyPayment + monthlyPropertyTax + monthlyCondoCharges + monthlyInsurance;
  
  // === BANKING METRICS ===
  // Total credits = existing + new loan payment
  const totalCreditsAfterProject = totalExistingCredits + monthlyPayment;

  // Debt-to-Income ratio (HCSF) : (crédits totaux / revenus) * 100
  const debtRatio = totalHouseholdIncome > 0
    ? (totalCreditsAfterProject / totalHouseholdIncome) * 100
    : 0;

  // Reste à vivre : revenus - crédits - autres charges
  const otherCharges = household.otherChargesMonthly || 0;
  const resteAVivre = totalHouseholdIncome - totalCreditsAfterProject - otherCharges;

  // Monthly effort vs avoided rent
  const avoidedRent = owner_occupier?.avoided_rent_monthly || 0;
  const monthlyEffort = totalHousingCostMonthly - avoidedRent;

  // BUG FIX #10 : LTV = prêt / (prix + notaire) — pratique bancaire standard
  const ltvBase = (acquisition.price_net_seller || 0) + (acquisition.notary_fee_amount || 0);
  const ltv = ltvBase > 0
    ? (financing.loan_amount / ltvBase) * 100
    : 0;

  // === PATRIMONY ===
  // BUG FIX #9 : source unique du coût total (cohérent avec simulationEngine)
  const totalProjectCost = calculateTotalProjectCost(acquisition);

  const horizonYears = project.horizon_years || 20;
  const lastPatrimony = results?.patrimony_series?.[results.patrimony_series.length - 1];
  const netPatrimonyAtHorizon = lastPatrimony?.net_patrimony || results?.net_patrimony || 0;
  const propertyValueAtHorizon = lastPatrimony?.property_value || acquisition.price_net_seller;
  const remainingDebtAtHorizon = lastPatrimony?.remaining_debt || 0;

  const totalCreditCost = (financing.total_interest || 0) + (financing.total_insurance || 0);

  // === STATUS EVALUATION ===
  // BUG FIX #2 : reste à vivre par typologie (adulte 1 / adulte 2 / enfant)
  // Adultes = référent + membres marqués comme conjoint/co-emprunteur ; enfants = autres
  const adultRelations = ['conjoint', 'co_emprunteur', 'partenaire', 'concubin'];
  const adults = 1 + (household.members || []).filter(m =>
    adultRelations.includes((m.relation || '').toLowerCase())
  ).length;
  const children = Math.max(0, memberCount - adults);
  const minResteAVivre = getMinResteAVivre(adults, children);
  const dangerResteAVivre = minResteAVivre * 0.6;

  let statusLevel: 'success' | 'warning' | 'danger';
  let statusMessage: string;
  let isViable: boolean;

  if (debtRatio > HCSF.MAX_DTI_DEROGATION_PCT || resteAVivre < dangerResteAVivre) {
    statusLevel = 'danger';
    statusMessage = 'Dossier sous tension';
    isViable = false;
  } else if (debtRatio > HCSF.MAX_DTI_PCT || resteAVivre < minResteAVivre) {
    statusLevel = 'warning';
    statusMessage = 'Dossier sous vigilance (dérogation HCSF possible)';
    isViable = false;
  } else {
    statusLevel = 'success';
    statusMessage = 'Dossier équilibré';
    isViable = true;
  }

  return {
    // Income totals
    totalHouseholdIncome,
    totalExistingCredits,
    memberCount,
    
    // Housing costs
    monthlyPayment,
    monthlyPropertyTax,
    monthlyCondoCharges,
    monthlyInsurance,
    totalHousingCostMonthly,
    
    // Banking metrics
    totalCreditsAfterProject,
    debtRatio,
    resteAVivre,
    monthlyEffort,
    ltv,
    
    // Patrimony
    totalProjectCost,
    netPatrimonyAtHorizon,
    propertyValueAtHorizon,
    remainingDebtAtHorizon,
    totalCreditCost,
    
    // Status
    isViable,
    statusLevel,
    statusMessage,
  };
}

/**
 * Create household data from user profile
 */
export function createHouseholdFromProfile(profile: {
  net_monthly_salary?: number | null;
  spouse_income?: number | null;
  mortgage_remaining?: number | null;
  professional_status?: string | null;
  contract_type?: string | null;
  full_name?: string | null;
}): HouseholdData {
  const members: HouseholdMember[] = [];
  
  // Add spouse if income exists
  if (profile.spouse_income && profile.spouse_income > 0) {
    members.push({
      firstName: 'Conjoint(e)',
      relation: 'conjoint',
      professionalStatus: 'employee',
      netMonthlySalary: profile.spouse_income,
      contractType: 'cdi',
      existingCredits: 0,
    });
  }
  
  // Estimate monthly credit from remaining mortgage
  const estimatedMonthlyCredit = profile.mortgage_remaining 
    ? Math.round(profile.mortgage_remaining / 240) // Rough estimate over 20 years
    : 0;
  
  return {
    primaryIncome: profile.net_monthly_salary || 0,
    primaryExistingCredits: estimatedMonthlyCredit,
    members,
    otherChargesMonthly: 0,
  };
}

/**
 * Get debt ratio status badge properties
 */
export function getDebtRatioStatus(debtRatio: number): {
  status: 'success' | 'warning' | 'danger';
  label: string;
} {
  if (debtRatio <= 30) {
    return { status: 'success', label: 'Excellent' };
  } else if (debtRatio <= 35) {
    return { status: 'warning', label: 'Limite HCSF' };
  } else {
    return { status: 'danger', label: 'Hors normes' };
  }
}

/**
 * Get reste à vivre status
 */
export function getResteAVivreStatus(resteAVivre: number, memberCount: number): {
  status: 'success' | 'warning' | 'danger';
  label: string;
} {
  const perPerson = resteAVivre / memberCount;
  if (perPerson >= 500) {
    return { status: 'success', label: 'Confortable' };
  } else if (perPerson >= 300) {
    return { status: 'warning', label: 'Limite' };
  } else {
    return { status: 'danger', label: 'Insuffisant' };
  }
}
