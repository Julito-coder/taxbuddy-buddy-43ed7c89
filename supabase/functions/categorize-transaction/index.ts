// categorize-transaction
// Tagging fiscal en batch des bank_transactions d'un utilisateur.
// Applique les règles de fiscalCategorization (dupliquées ici pour Deno) et
// insère dans transaction_fiscal_tags. Idempotent grâce au UNIQUE(transaction_id).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type DeductionType = 'reduction' | 'deduction_revenu' | 'credit';

interface Rule {
  category: string;
  label: string;
  type: DeductionType;
  rate: number;
  pattern: RegExp;
  confidence: number;
  direction: -1 | 0 | 1;
}

const RULES: Rule[] = [
  { category: 'don_66', label: 'Don 66 %', type: 'reduction', rate: 0.66, confidence: 0.9, direction: -1,
    pattern: /MEDECINS DU MONDE|MSF|MEDECINS SANS FRONTIERES|UNICEF|CROIX ROUGE|SECOURS POPULAIRE|SECOURS CATHOLIQUE|FONDATION ABBE PIERRE|WWF|GREENPEACE|HANDICAP INTERNATIONAL|ACTION CONTRE LA FAIM|TELETHON|PASTEUR|FONDATION DE FRANCE|HELLOASSO|ENFOIRES/ },
  { category: 'don_75', label: 'Don 75 % (Coluche)', type: 'reduction', rate: 0.75, confidence: 0.92, direction: -1,
    pattern: /RESTOS DU COEUR|RESTOS COEUR|EMMAUS|BANQUE ALIMENTAIRE|FONDATION ARMEE DU SALUT/ },
  { category: 'per', label: 'Versement PER', type: 'deduction_revenu', rate: 1.0, confidence: 0.85, direction: -1,
    pattern: /\bPER\b|PLAN EPARGNE RETRAITE|PERIN|LINXEA PER|YOMONI PER|RAMIFY PER|NALO PER|GOODVEST/ },
  { category: 'mecenat', label: 'Mécénat', type: 'reduction', rate: 0.6, confidence: 0.7, direction: -1,
    pattern: /MECENAT|FONDATION ENTREPRISE/ },
  { category: 'ik', label: 'Indemnité kilométrique', type: 'deduction_revenu', rate: 1.0, confidence: 0.55, direction: -1,
    pattern: /TOTAL ENERGIES|TOTAL ACCESS|SHELL|BP |ESSO|AVIA|LECLERC CARBURANT|CARREFOUR CARBURANT|VINCI AUTOROUTE|APRR |SANEF|ASF |COFIROUTE|ULYS/ },
  { category: 'fbe', label: 'Frais de bouche pro', type: 'deduction_revenu', rate: 1.0, confidence: 0.45, direction: -1,
    pattern: /TICKET RESTAURANT|SWILE|EDENRED|UP DEJEUNER|PLUXEE/ },
  { category: 'scpi', label: 'Souscription SCPI', type: 'deduction_revenu', rate: 0.0, confidence: 0.6, direction: -1,
    pattern: /SCPI |CORUM|LA FRANCAISE REM|PRIMONIAL|PERIAL|SOFIDY|EURYALE|REMAKE/ },
  { category: 'emploi_domicile', label: 'Emploi à domicile (crédit 50 %)', type: 'credit', rate: 0.5, confidence: 0.85, direction: -1,
    pattern: /CESU|URSSAF.*CESU|PAJEMPLOI|SHIVA|O2 SERVICES|FAMILY SPHERE|YOOPIES|WECASA|AXEO/ },
  { category: 'frais_garde', label: 'Frais de garde (crédit 50 %)', type: 'credit', rate: 0.5, confidence: 0.85, direction: -1,
    pattern: /CRECHE|MICRO CRECHE|PEOPLE AND BABY|BABILOU|LES PETITS CHAPERONS|ASSISTANTE MATERNELLE|NOURRICE/ },
  { category: 'pension_alim', label: 'Pension alimentaire', type: 'deduction_revenu', rate: 1.0, confidence: 0.8, direction: -1,
    pattern: /PENSION ALIMENTAIRE|ARIPA|CAF.*PENSION/ },
];

function normalize(s: string): string {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
}

function inferMarginalRate(profile: Record<string, unknown> | null): number {
  const tmi = profile?.['tmi'] ?? profile?.['marginal_rate'] ?? profile?.['fiscal_tmi'];
  const n = typeof tmi === 'number' ? tmi : Number(tmi);
  if (Number.isFinite(n) && n > 0 && n <= 1) return n;
  if (Number.isFinite(n) && n > 1 && n <= 100) return n / 100;
  return 0.30; // défaut prudent
}

function estimateSavingsCents(type: DeductionType, rate: number, amountCents: number, tmi: number): number {
  if (type === 'reduction' || type === 'credit') return Math.round(amountCents * rate);
  if (type === 'deduction_revenu') return Math.round(amountCents * tmi);
  return 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  const userId = userData.user.id;

  // TMI utilisateur (depuis profiles)
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
  const tmi = inferMarginalRate(profile);

  // Transactions récentes non encore taggées
  const { data: txs, error: txErr } = await supabase
    .from('bank_transactions')
    .select('id, label, amount, tx_date')
    .eq('user_id', userId)
    .gte('tx_date', new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10))
    .limit(2000);

  if (txErr) {
    return new Response(JSON.stringify({ error: txErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const { data: existing } = await supabase
    .from('transaction_fiscal_tags')
    .select('transaction_id')
    .eq('user_id', userId);
  const tagged = new Set((existing ?? []).map((r: { transaction_id: string }) => r.transaction_id));

  const inserts: Array<Record<string, unknown>> = [];
  let skipped = 0;
  for (const t of (txs ?? [])) {
    if (tagged.has(t.id)) { skipped++; continue; }
    const direction: -1 | 1 = Number(t.amount) < 0 ? -1 : 1;
    const label = normalize(t.label || '');
    const absCents = Math.round(Math.abs(Number(t.amount)) * 100);
    if (absCents === 0) continue;

    const rule = RULES.find(r => (r.direction === 0 || r.direction === direction) && r.pattern.test(label));
    if (!rule) continue;
    const savings = estimateSavingsCents(rule.type, rule.rate, absCents, tmi);
    inserts.push({
      user_id: userId,
      transaction_id: t.id,
      category: rule.category,
      deduction_type: rule.type,
      deduction_rate: rule.rate,
      estimated_savings_cents: savings,
      confidence: rule.confidence,
      source: 'auto',
    });
  }

  let inserted = 0;
  if (inserts.length > 0) {
    const { error: insErr, count } = await supabase
      .from('transaction_fiscal_tags')
      .insert(inserts, { count: 'exact' });
    if (insErr) {
      return new Response(JSON.stringify({ error: insErr.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    inserted = count ?? inserts.length;
  }

  return new Response(
    JSON.stringify({ analyzed: (txs ?? []).length, already_tagged: skipped, tagged: inserted, tmi }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  );
});
