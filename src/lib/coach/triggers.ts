// Triggers Coach : couche qui transforme les signaux produit (transactions
// bancaires taggées, échéances, profil) en cartes d'action Coach avec
// deep-link vers le bon outil pré-rempli.
//
// La logique est volontairement pure et lisible côté client : les sources
// (transactions, tags, deadlines, profil) sont chargées par le hook qui
// consomme ce module. C'est la « glu » entre les piliers du produit.

import { supabase } from '@/integrations/supabase/client';
import type { FiscalCategory } from '@/lib/fiscalCategorization';

export type CoachActionKind =
  | 'rent_to_buy'
  | 'per_top_up'
  | 'donation_declare'
  | 'employment_at_home'
  | 'childcare_credit'
  | 'tax_return_due'
  | 'simulate_freelance';

export interface CoachAction {
  /** Stable, par utilisateur, pour persistance dans user_recommendations */
  key: string;
  kind: CoachActionKind;
  /** Score d'urgence : 0..1 (0 = informatif, 1 = critique) */
  urgency: number;
  /** Économie / impact estimé en centimes */
  estimatedSavingsCents: number;
  title: string;
  description: string;
  cta: string;
  /** Route + query params pour pré-remplir le tool cible. La page cible lit
   *  searchParams pour pré-remplir et tracker `from=coach`. */
  deepLink: string;
  /** Payload structuré (utilisable côté tool si on veut éviter la sérialisation URL) */
  prefill?: Record<string, string | number>;
}

interface BankTxRow {
  id: string;
  label: string | null;
  amount: number;
  tx_date: string;
}

interface FiscalTagRow {
  category: FiscalCategory;
  estimated_savings_cents: number;
  confirmed: boolean;
  transaction_id: string;
}

interface ProfileRow {
  user_id: string;
  family_status?: string | null;
  children_count?: number | null;
  is_employee?: boolean | null;
  annual_revenue_ht?: number | null;
}

const sb = supabase as unknown as { from: (t: string) => any };

function inferRent(txs: BankTxRow[]): { monthlyEur: number; lastTxId: string | null } {
  const candidates = txs.filter((t) => Number(t.amount) < 0 && /LOYER|FONCIA|SCI |CITYA|NEXITY|SYNDIC|BAILLEUR/i.test(t.label || ''));
  if (candidates.length < 2) return { monthlyEur: 0, lastTxId: null };
  const amounts = candidates.map((t) => Math.abs(Number(t.amount)));
  amounts.sort((a, b) => a - b);
  const median = amounts[Math.floor(amounts.length / 2)];
  return { monthlyEur: Math.round(median), lastTxId: candidates[0].id };
}

function buildDeepLink(path: string, params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams({ from: 'coach' });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') usp.set(k, String(v));
  }
  return `${path}?${usp.toString()}`;
}

export async function buildDynamicCoachActions(userId: string): Promise<CoachAction[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - 12);
  const sinceISO = since.toISOString().slice(0, 10);

  const [txsRes, tagsRes, profileRes] = await Promise.all([
    sb.from('bank_transactions').select('id, label, amount, tx_date').eq('user_id', userId).gte('tx_date', sinceISO).limit(2000),
    sb.from('transaction_fiscal_tags').select('category, estimated_savings_cents, confirmed, transaction_id').eq('user_id', userId),
    sb.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
  ]);

  const txs: BankTxRow[] = txsRes.data ?? [];
  const tags: FiscalTagRow[] = tagsRes.data ?? [];
  const profile: ProfileRow | null = profileRes.data ?? null;

  const actions: CoachAction[] = [];

  // 1. Loyer élevé → simule un achat immobilier
  const { monthlyEur, lastTxId } = inferRent(txs);
  if (monthlyEur >= 1500) {
    const annual = monthlyEur * 12;
    actions.push({
      key: 'rent_to_buy',
      kind: 'rent_to_buy',
      urgency: 0.4,
      estimatedSavingsCents: 0,
      title: `Tu paies ${annual.toLocaleString('fr-FR')} €/an de loyer`,
      description: `Au lieu de financer un propriétaire, simule un achat avec ton apport et ton mensuel actuel pour voir ce que tu pourrais te payer.`,
      cta: 'Lancer le simulateur',
      deepLink: buildDeepLink('/simulations/immobilier', { prefill_monthly_rent: monthlyEur, source_tx: lastTxId ?? '' }),
      prefill: { monthlyRentEur: monthlyEur },
    });
  }

  // 2. Dons détectés mais non confirmés → rappel de déclaration
  const unconfirmedDonations = tags.filter((t) => (t.category === 'don_66' || t.category === 'don_75') && !t.confirmed);
  const donationGain = unconfirmedDonations.reduce((s, t) => s + (t.estimated_savings_cents || 0), 0);
  if (unconfirmedDonations.length >= 1 && donationGain > 0) {
    actions.push({
      key: 'donation_declare',
      kind: 'donation_declare',
      urgency: 0.6,
      estimatedSavingsCents: donationGain,
      title: `Tu as ${unconfirmedDonations.length} don(s) à déclarer`,
      description: `On a repéré ${unconfirmedDonations.length} dons sur ton compte (${(donationGain / 100).toLocaleString('fr-FR')} € d'économie d'impôt potentielle). N'oublie pas la case 7UF.`,
      cta: 'Vérifier sur le scanner',
      deepLink: buildDeepLink('/simulations/scanner', { focus: 'dons', amount_cents: donationGain }),
      prefill: { focus: 'dons', amountCents: donationGain },
    });
  }

  // 3. Versements PER détectés → confirme et déclare
  const perTags = tags.filter((t) => t.category === 'per' && !t.confirmed);
  const perGain = perTags.reduce((s, t) => s + (t.estimated_savings_cents || 0), 0);
  if (perTags.length >= 1 && perGain > 0) {
    actions.push({
      key: 'per_top_up',
      kind: 'per_top_up',
      urgency: 0.5,
      estimatedSavingsCents: perGain,
      title: `Versements PER : ${(perGain / 100).toLocaleString('fr-FR')} € à récupérer`,
      description: `Tes versements PER détectés cette année peuvent te faire économiser ${(perGain / 100).toLocaleString('fr-FR')} € d'impôt. Confirme-les pour les verrouiller.`,
      cta: 'Voir mes optimisations',
      deepLink: buildDeepLink('/finances', { tab: 'optimisations' }),
    });
  }

  // 4. Garde d'enfants détectée
  const garde = tags.filter((t) => t.category === 'frais_garde' || t.category === 'emploi_domicile');
  if (garde.length >= 1 && (profile?.children_count ?? 0) > 0) {
    const gain = garde.reduce((s, t) => s + (t.estimated_savings_cents || 0), 0);
    actions.push({
      key: 'childcare_credit',
      kind: 'childcare_credit',
      urgency: 0.5,
      estimatedSavingsCents: gain,
      title: `Crédit d'impôt garde d'enfant : ${(gain / 100).toLocaleString('fr-FR')} €`,
      description: `Élio a détecté tes frais de garde / emploi à domicile. Tu peux récupérer 50 % en crédit d'impôt.`,
      cta: 'Lancer le scanner fiscal',
      deepLink: buildDeepLink('/simulations/scanner', { focus: 'garde', amount_cents: gain }),
    });
  }

  // 5. Échéance déclaration < 30 jours
  const may31 = new Date(`${new Date().getFullYear()}-05-31`);
  const daysToMay = Math.ceil((may31.getTime() - Date.now()) / 86400000);
  if (daysToMay > 0 && daysToMay <= 30) {
    actions.push({
      key: 'tax_return_due',
      kind: 'tax_return_due',
      urgency: Math.min(1, 1 - daysToMay / 60),
      estimatedSavingsCents: 0,
      title: `Plus que ${daysToMay} jours avant la déclaration`,
      description: `Lance le scanner fiscal pour vérifier que tu n'oublies aucune optimisation détectable depuis tes flux.`,
      cta: 'Ouvrir le scanner',
      deepLink: buildDeepLink('/simulations/scanner', { source: 'deadline' }),
    });
  }

  return actions.sort((a, b) => {
    const urgencyDiff = b.urgency - a.urgency;
    if (Math.abs(urgencyDiff) > 0.05) return urgencyDiff;
    return b.estimatedSavingsCents - a.estimatedSavingsCents;
  });
}

export async function getTopCoachAction(userId: string): Promise<CoachAction | null> {
  const actions = await buildDynamicCoachActions(userId);
  return actions[0] ?? null;
}
