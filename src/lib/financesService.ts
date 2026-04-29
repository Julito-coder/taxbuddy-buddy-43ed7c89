// Service côté client pour la couche Mes finances :
// - lecture des tags fiscaux (jointure avec bank_transactions)
// - lecture de la vue monthly_tax_savings
// - déclenchement de la edge function categorize-transaction

import { supabase } from '@/integrations/supabase/client';
import type { FiscalCategory, DeductionType } from './fiscalCategorization';

// transaction_fiscal_tags et monthly_tax_savings ne sont pas (encore) dans
// les types générés ; on lit via le client générique.
const sb = supabase as unknown as {
  from: (t: string) => any;
  functions: { invoke: (n: string, opts?: { body?: unknown }) => Promise<{ data: unknown; error: { message: string } | null }> };
};

export interface TransactionFiscalTag {
  id: string;
  user_id: string;
  transaction_id: string;
  category: FiscalCategory;
  deduction_type: DeductionType;
  deduction_rate: number;
  estimated_savings_cents: number;
  confidence: number;
  confirmed: boolean;
  source: string;
}

export interface MonthlyTaxSavingsRow {
  user_id: string;
  month: string;
  transactions_count: number;
  total_savings_cents: number;
  confirmed_count: number;
  confirmed_savings_cents: number;
}

export interface OptimisationItem {
  tagId: string;
  transactionId: string;
  txDate: string;
  label: string;
  amountCents: number;
  category: FiscalCategory;
  estimatedSavingsCents: number;
  confidence: number;
  confirmed: boolean;
}

export async function getMonthlyTaxSavings(userId: string, months = 12): Promise<MonthlyTaxSavingsRow[]> {
  const sinceMonth = monthKey(addMonths(new Date(), -months + 1));
  const { data, error } = await sb
    .from('monthly_tax_savings')
    .select('*')
    .eq('user_id', userId)
    .gte('month', sinceMonth)
    .order('month', { ascending: true });
  if (error) throw error;
  return (data ?? []) as MonthlyTaxSavingsRow[];
}

export async function listTagsForUser(userId: string, limit = 200): Promise<Array<TransactionFiscalTag & { tx?: { tx_date: string; label: string | null; amount: number } }>> {
  const { data, error } = await sb
    .from('transaction_fiscal_tags')
    .select('*, tx:bank_transactions(tx_date, label, amount)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listOptimisations(userId: string, limit = 50): Promise<OptimisationItem[]> {
  const tags = await listTagsForUser(userId, limit);
  return tags
    .filter((t) => !!t.tx)
    .map((t) => ({
      tagId: t.id,
      transactionId: t.transaction_id,
      txDate: t.tx!.tx_date,
      label: t.tx!.label || 'Opération',
      amountCents: Math.round(Math.abs(Number(t.tx!.amount)) * 100),
      category: t.category,
      estimatedSavingsCents: t.estimated_savings_cents,
      confidence: t.confidence,
      confirmed: t.confirmed,
    }))
    .sort((a, b) => b.estimatedSavingsCents - a.estimatedSavingsCents);
}

export async function setTagConfirmed(tagId: string, confirmed: boolean): Promise<void> {
  const { error } = await sb
    .from('transaction_fiscal_tags')
    .update({ confirmed })
    .eq('id', tagId);
  if (error) throw error;
}

export interface CategorizeResult {
  analyzed: number;
  already_tagged: number;
  tagged: number;
  tmi: number;
}

export async function runCategorization(): Promise<CategorizeResult> {
  const { data, error } = await sb.functions.invoke('categorize-transaction', { body: {} });
  if (error) throw error;
  return data as CategorizeResult;
}

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
