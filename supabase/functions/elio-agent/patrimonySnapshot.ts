// Patrimony Snapshot — agrège les données patrimoniales détaillées
// (crypto, immo, etc.) en parallèle du profil pour les exposer au LLM.
//
// Objectif : qu'Élio ne pose JAMAIS une question dont la réponse existe
// déjà en base. Notamment pour la déclaration crypto 2086, l'agent doit
// voir directement combien de comptes, de transactions, et le calcul
// fiscal en cours s'il existe.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export interface CryptoSnapshot {
  has_data: boolean;
  accounts_count: number;
  has_foreign_account: boolean;
  transactions_count: number;
  taxable_transactions_count: number;
  current_tax_year: number;
  // Calcul 2086 le plus récent pour l'année en cours, s'il existe
  computation: {
    status: string;
    method: string;
    total_cessions_eur: number;
    total_acquisitions_eur: number;
    portfolio_value_eur: number;
    net_gain_eur: number;
    gains_eur: number;
    losses_eur: number;
    updated_at: string;
  } | null;
  // Estimation simple si pas de calcul officiel : somme fiat_value_eur des cessions
  estimated_cessions_eur: number;
}

export interface RealEstateSnapshot {
  has_data: boolean;
  projects_count: number;
  active_projects_count: number;
}

export interface PatrimonySnapshot {
  crypto: CryptoSnapshot;
  real_estate: RealEstateSnapshot;
}

export async function loadPatrimonySnapshot(
  adminClient: ReturnType<typeof createClient>,
  userId: string,
): Promise<PatrimonySnapshot> {
  const currentYear = new Date().getFullYear();

  const [
    accountsRes,
    txCountRes,
    txTaxableRes,
    computationRes,
    cessionsAggRes,
    projectsRes,
  ] = await Promise.all([
    adminClient
      .from('crypto_accounts')
      .select('id, is_foreign_account')
      .eq('user_id', userId),
    adminClient
      .from('crypto_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    adminClient
      .from('crypto_transactions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_taxable', true),
    adminClient
      .from('crypto_tax_computations')
      .select('*')
      .eq('user_id', userId)
      .eq('tax_year', currentYear)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    // Estimation des cessions à partir des transactions classées crypto_to_fiat
    adminClient
      .from('crypto_transactions')
      .select('fiat_value_eur')
      .eq('user_id', userId)
      .eq('is_taxable', true)
      .eq('classification', 'crypto_to_fiat'),
    adminClient
      .from('real_estate_projects')
      .select('id, status')
      .eq('user_id', userId),
  ]);

  const accounts = (accountsRes.data ?? []) as Array<{ id: string; is_foreign_account: boolean | null }>;
  const computation = (computationRes.data ?? null) as any;
  const cessions = (cessionsAggRes.data ?? []) as Array<{ fiat_value_eur: number | null }>;
  const projects = (projectsRes.data ?? []) as Array<{ id: string; status: string | null }>;

  const estimated_cessions_eur = cessions.reduce(
    (sum, t) => sum + (Number(t.fiat_value_eur) || 0),
    0,
  );

  const txTotal = txCountRes.count ?? 0;
  const txTaxable = txTaxableRes.count ?? 0;

  const crypto: CryptoSnapshot = {
    has_data: accounts.length > 0 || txTotal > 0 || !!computation,
    accounts_count: accounts.length,
    has_foreign_account: accounts.some((a) => a.is_foreign_account === true),
    transactions_count: txTotal,
    taxable_transactions_count: txTaxable,
    current_tax_year: currentYear,
    computation: computation
      ? {
          status: String(computation.status ?? 'draft'),
          method: String(computation.method ?? 'FR_150_VH_bis'),
          total_cessions_eur: Number(computation.total_cessions_eur) || 0,
          total_acquisitions_eur: Number(computation.total_acquisitions_eur) || 0,
          portfolio_value_eur: Number(computation.portfolio_value_eur) || 0,
          net_gain_eur: Number(computation.net_gain_eur) || 0,
          gains_eur: Number(computation.gains_eur) || 0,
          losses_eur: Number(computation.losses_eur) || 0,
          updated_at: String(computation.updated_at ?? ''),
        }
      : null,
    estimated_cessions_eur: Math.round(estimated_cessions_eur),
  };

  const real_estate: RealEstateSnapshot = {
    has_data: projects.length > 0,
    projects_count: projects.length,
    active_projects_count: projects.filter((p) => p.status && p.status !== 'archived').length,
  };

  return { crypto, real_estate };
}

// ===== Helpers d'affichage =====

function fmtEuro(v: number | null | undefined): string {
  if (v == null || isNaN(Number(v))) return 'Non renseigné';
  return `${Number(v).toLocaleString('fr-FR')}€`;
}

export function buildPatrimonyBlock(
  snap: PatrimonySnapshot,
  rawCrypto: { crypto_pnl_2025?: number | null; crypto_wallet_address?: string | null },
): string {
  const lines: string[] = [];

  // ----- CRYPTO -----
  if (snap.crypto.has_data || rawCrypto.crypto_pnl_2025 || rawCrypto.crypto_wallet_address) {
    lines.push('CRYPTO :');
    lines.push(`- Comptes/wallets enregistrés : ${snap.crypto.accounts_count}`);
    if (snap.crypto.has_foreign_account) {
      lines.push("- Au moins un compte à l'étranger → formulaire 3916-bis OBLIGATOIRE");
    }
    lines.push(
      `- Transactions saisies : ${snap.crypto.transactions_count} (dont ${snap.crypto.taxable_transactions_count} taxables)`,
    );
    if (snap.crypto.computation) {
      const c = snap.crypto.computation;
      lines.push(
        `- Calcul fiscal ${snap.crypto.current_tax_year} (méthode ${c.method}, statut ${c.status}) :`,
      );
      lines.push(`  • Total cessions : ${fmtEuro(c.total_cessions_eur)}`);
      lines.push(`  • Total acquisitions : ${fmtEuro(c.total_acquisitions_eur)}`);
      lines.push(`  • Plus-value nette imposable : ${fmtEuro(c.net_gain_eur)}`);
      lines.push(`  • Valorisation portefeuille : ${fmtEuro(c.portfolio_value_eur)}`);
    } else if (snap.crypto.estimated_cessions_eur > 0) {
      lines.push(
        `- Estimation cessions ${snap.crypto.current_tax_year} (calcul officiel non lancé) : ${fmtEuro(snap.crypto.estimated_cessions_eur)}`,
      );
    }
    if (rawCrypto.crypto_pnl_2025) {
      lines.push(`- Plus/moins-value crypto déclarée dans le profil : ${fmtEuro(Number(rawCrypto.crypto_pnl_2025))}`);
    }
    if (rawCrypto.crypto_wallet_address) {
      lines.push(`- Adresse wallet renseignée : oui`);
    }
  } else {
    lines.push('CRYPTO : aucune donnée enregistrée.');
  }

  // ----- IMMO -----
  if (snap.real_estate.has_data) {
    lines.push('');
    lines.push('IMMOBILIER :');
    lines.push(
      `- Projets enregistrés : ${snap.real_estate.projects_count} (${snap.real_estate.active_projects_count} actifs)`,
    );
  }

  return lines.join('\n');
}
