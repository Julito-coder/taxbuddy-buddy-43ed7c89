import {
  UserCircle,
  Users,
  Briefcase,
  Banknote,
  Building2,
  TrendingUp,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { FiscalProfileData } from '@/lib/fiscalProfileService';

export type ModuleId =
  | 'identity'
  | 'family'
  | 'professional'
  | 'income'
  | 'real_estate'
  | 'financial'
  | 'consents';

export type ModuleStatus = 'empty' | 'partial' | 'complete';

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  shortDescription: string;
  why: string;
  whyBullets: string[];
  icon: LucideIcon;
  /** Estimation du gain annuel débloqué quand le module est rempli (€). */
  estimatedAnnualGain: number;
  /** Le module est-il visible compte tenu du profil ? */
  isVisible: (data: FiscalProfileData) => boolean;
  /** Liste des champs essentiels comptés pour la complétion. */
  requiredFields: (data: FiscalProfileData) => Array<boolean>;
}

const filledStr = (v?: string | null) => !!v && v.trim().length > 0;
const filledNum = (v?: number | null) => typeof v === 'number' && v > 0;

export const MODULES: ModuleMeta[] = [
  {
    id: 'identity',
    title: 'Identité',
    shortDescription: 'Tes coordonnées fiscales de base.',
    why: 'Indispensable pour générer tes documents pré-remplis et tes courriers à l’administration.',
    whyBullets: [
      'Pré-remplit tes formulaires Cerfa et lettres types.',
      'Permet de calculer ta tranche marginale d’imposition au plus juste.',
    ],
    icon: UserCircle,
    estimatedAnnualGain: 0,
    isVisible: () => true,
    requiredFields: (d) => [
      filledStr(d.fullName),
      filledStr(d.nif),
      d.birthYear > 1900 && d.birthYear !== 1985,
      filledStr(d.addressCity),
      filledStr(d.addressPostalCode),
    ],
  },
  {
    id: 'family',
    title: 'Foyer fiscal',
    shortDescription: 'Situation familiale et personnes à charge.',
    why: 'Le quotient familial peut faire varier ton impôt de plusieurs centaines d’euros.',
    whyBullets: [
      'Calcul exact du nombre de parts fiscales.',
      'Détection automatique des crédits d’impôt liés aux enfants.',
    ],
    icon: Users,
    estimatedAnnualGain: 420,
    isVisible: () => true,
    requiredFields: (d) => [
      filledStr(d.familyStatus),
      d.childrenCount >= 0,
    ],
  },
  {
    id: 'professional',
    title: 'Activité professionnelle',
    shortDescription: 'Salarié, indépendant, retraité ou investisseur.',
    why: 'Mes recommandations changent radicalement selon ton statut.',
    whyBullets: [
      'Active les modules de revenus adaptés à ton activité.',
      'Débloque les leviers d’optimisation propres à ton statut.',
    ],
    icon: Briefcase,
    estimatedAnnualGain: 0,
    isVisible: () => true,
    requiredFields: (d) => [d.profileTypes.length > 0],
  },
  {
    id: 'income',
    title: 'Revenus',
    shortDescription: 'Le détail de ce que tu gagnes par an.',
    why: 'Sans tes revenus précis, je ne peux pas chiffrer en euros tes optimisations.',
    whyBullets: [
      'Estimation fine de ton impôt sur le revenu.',
      'Détection des plafonds non atteints (PER, dons, frais réels).',
    ],
    icon: Banknote,
    estimatedAnnualGain: 1200,
    isVisible: (d) => d.profileTypes.length > 0,
    requiredFields: (d) => {
      const checks: boolean[] = [];
      if (d.profileTypes.includes('employee')) {
        checks.push(filledNum(d.netMonthlySalary));
        checks.push(filledStr(d.contractType));
      }
      if (d.profileTypes.includes('self_employed')) {
        checks.push(filledStr(d.siret));
        checks.push(filledNum(d.annualRevenueHt));
        checks.push(filledStr(d.fiscalStatus));
      }
      if (d.profileTypes.includes('retired')) {
        checks.push(filledNum(d.mainPensionAnnual));
      }
      if (checks.length === 0) checks.push(false);
      return checks;
    },
  },
  {
    id: 'real_estate',
    title: 'Patrimoine immobilier',
    shortDescription: 'Résidence principale et biens locatifs.',
    why: 'L’immobilier ouvre des leviers fiscaux puissants (déficit foncier, LMNP, IFI).',
    whyBullets: [
      'Choix optimal du régime locatif (nu, meublé, LMNP).',
      'Vérification du seuil IFI et des stratégies de démembrement.',
    ],
    icon: Building2,
    estimatedAnnualGain: 800,
    isVisible: () => true,
    requiredFields: (d) => {
      const checks: boolean[] = [typeof d.isHomeowner === 'boolean'];
      if (d.hasRentalIncome) {
        checks.push(filledStr(d.rentalScheme));
      }
      return checks;
    },
  },
  {
    id: 'financial',
    title: 'Patrimoine financier',
    shortDescription: 'PEA, assurance vie, CTO, SCPI, crypto.',
    why: 'Chaque enveloppe a sa fiscalité. Mal allouée, tu paies inutilement.',
    whyBullets: [
      'Comparaison PEA / CTO / Assurance vie sur tes encours réels.',
      'Détection des plus-values à purger ou à compenser.',
    ],
    icon: TrendingUp,
    estimatedAnnualGain: 600,
    isVisible: () => true,
    requiredFields: (d) => [
      filledNum(d.peaBalance) ||
        filledNum(d.lifeInsuranceBalance) ||
        filledNum(d.scpiInvestments) ||
        filledNum(d.crowdfundingInvestments) ||
        d.cryptoPnl2025 !== 0 ||
        filledNum(d.ctoDividends) ||
        filledNum(d.ctoCapitalGains),
    ],
  },
  {
    id: 'consents',
    title: 'Préférences & consentements',
    shortDescription: 'Cadre légal du traitement de tes données.',
    why: 'Obligatoire pour activer l’analyse personnalisée par mon agent.',
    whyBullets: [
      'Active les recommandations IA adaptées à ton dossier.',
      'Conforme RGPD, révocable à tout moment.',
    ],
    icon: Shield,
    estimatedAnnualGain: 0,
    isVisible: () => true,
    requiredFields: (d) => [d.gdprConsent],
  },
];

export interface ModuleProgress {
  id: ModuleId;
  filled: number;
  total: number;
  percentage: number;
  status: ModuleStatus;
  estimatedGain: number;
}

export const computeModuleProgress = (
  module: ModuleMeta,
  data: FiscalProfileData
): ModuleProgress => {
  const checks = module.requiredFields(data);
  const total = Math.max(checks.length, 1);
  const filled = checks.filter(Boolean).length;
  const percentage = Math.round((filled / total) * 100);
  let status: ModuleStatus = 'empty';
  if (percentage >= 100) status = 'complete';
  else if (filled > 0) status = 'partial';
  return {
    id: module.id,
    filled,
    total,
    percentage,
    status,
    estimatedGain: module.estimatedAnnualGain,
  };
};

export const getVisibleModules = (data: FiscalProfileData): ModuleMeta[] =>
  MODULES.filter((m) => m.isVisible(data));

export const computeOverallProgress = (data: FiscalProfileData) => {
  const modules = getVisibleModules(data);
  const progresses = modules.map((m) => computeModuleProgress(m, data));
  const totalFields = progresses.reduce((acc, p) => acc + p.total, 0);
  const filledFields = progresses.reduce((acc, p) => acc + p.filled, 0);
  const percentage = totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);

  // Gain restant = somme des gains des modules incomplets
  const remainingGain = progresses
    .filter((p) => p.status !== 'complete')
    .reduce((acc, p) => {
      const meta = MODULES.find((m) => m.id === p.id);
      return acc + (meta?.estimatedAnnualGain || 0);
    }, 0);

  // Module suivant : score composite = (gain potentiel restant) + bonus "presque fini"
  // - On pondère le gain par la part non remplie (1 - filled/total)
  // - On ajoute un bonus si le module est déjà entamé (partial) pour favoriser la finalisation
  // - Les modules sans gain estimé (identité, consents) reçoivent un poids minimal
  //   pour ne passer en tête que si tout le reste est complet.
  const scoreModule = (p: ModuleProgress): number => {
    const meta = MODULES.find((m) => m.id === p.id);
    const gain = meta?.estimatedAnnualGain || 0;
    const incompleteness = 1 - p.filled / Math.max(p.total, 1);
    const impact = gain * incompleteness;
    const partialBonus = p.status === 'partial' ? gain * 0.25 + 50 : 0;
    const baseline = gain === 0 ? 1 : 100; // modules sans gain € passent en dernier
    return impact + partialBonus + baseline;
  };

  const nextModule = progresses
    .filter((p) => p.status !== 'complete')
    .map((p) => ({ p, score: scoreModule(p) }))
    .sort((a, b) => b.score - a.score)[0]?.p;

  const nextModuleMeta = nextModule ? MODULES.find((m) => m.id === nextModule.id) : undefined;

  let qualitativeLabel = 'À démarrer';
  if (percentage >= 90) qualitativeLabel = 'Profil expert';
  else if (percentage >= 65) qualitativeLabel = 'Profil optimisé';
  else if (percentage >= 35) qualitativeLabel = 'Profil intermédiaire';
  else if (percentage > 0) qualitativeLabel = 'Profil basique';

  return {
    percentage,
    qualitativeLabel,
    remainingGain,
    nextModuleId: nextModule?.id,
    progresses,
  };
};

export const formatEuros = (value: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
