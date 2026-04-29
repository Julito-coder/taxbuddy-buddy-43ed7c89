-- Couche d'intelligence fiscale sur les transactions bancaires.
-- Chaque transaction Powens peut recevoir un (ou plusieurs ?) tag fiscal :
--   catégorie (frais_pro, ik, fbe, don_66, don_75, per, mecenat, scpi, …)
--   taux de déduction (0..1) et économie estimée en centimes (selon la TMI du foyer)
-- Une vue agrégée monthly_tax_savings expose le total par mois pour le hook
-- useMonthlyTaxSavings et le chart de la page Mes finances.

CREATE TABLE IF NOT EXISTS public.transaction_fiscal_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id UUID NOT NULL REFERENCES public.bank_transactions(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  deduction_type TEXT NOT NULL DEFAULT 'reduction',
  deduction_rate NUMERIC NOT NULL DEFAULT 0,
  estimated_savings_cents INTEGER NOT NULL DEFAULT 0,
  confidence NUMERIC NOT NULL DEFAULT 0.5,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'auto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (transaction_id)
);

CREATE INDEX IF NOT EXISTS idx_tft_user_id ON public.transaction_fiscal_tags (user_id);
CREATE INDEX IF NOT EXISTS idx_tft_category ON public.transaction_fiscal_tags (category);

ALTER TABLE public.transaction_fiscal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own fiscal tags"
  ON public.transaction_fiscal_tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own fiscal tags"
  ON public.transaction_fiscal_tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own fiscal tags"
  ON public.transaction_fiscal_tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own fiscal tags"
  ON public.transaction_fiscal_tags FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_transaction_fiscal_tags_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_tft_updated_at ON public.transaction_fiscal_tags;
CREATE TRIGGER trg_tft_updated_at
  BEFORE UPDATE ON public.transaction_fiscal_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_transaction_fiscal_tags_updated_at();

-- Vue agrégée : économie d'impôt potentielle par utilisateur et par mois.
CREATE OR REPLACE VIEW public.monthly_tax_savings AS
SELECT
  t.user_id,
  to_char(date_trunc('month', bt.tx_date), 'YYYY-MM') AS month,
  COUNT(*)::int AS transactions_count,
  COALESCE(SUM(t.estimated_savings_cents), 0)::int AS total_savings_cents,
  COUNT(*) FILTER (WHERE t.confirmed)::int AS confirmed_count,
  COALESCE(SUM(t.estimated_savings_cents) FILTER (WHERE t.confirmed), 0)::int AS confirmed_savings_cents
FROM public.transaction_fiscal_tags t
JOIN public.bank_transactions bt ON bt.id = t.transaction_id
GROUP BY t.user_id, date_trunc('month', bt.tx_date);

COMMENT ON VIEW public.monthly_tax_savings IS
  'Économie d''impôt potentielle agrégée par utilisateur et par mois (basée sur transaction_fiscal_tags).';
