import { supabase } from '@/integrations/supabase/client';
import { ModernOnboardingData } from '@/data/modernOnboardingTypes';

/**
 * Sauvegarde non destructive du quiz d'onboarding.
 *
 * Règles :
 * - On ne pousse une clé que si la valeur du quiz est "réelle" (non vide).
 * - On NE remplace PAS un champ déjà renseigné en DB par une valeur du quiz
 *   (le quiz ne fait que combler les trous).
 * - Les booléens dérivés (is_employee/...) ne sont écrits que si
 *   `professional_status` n'était pas encore défini en DB.
 */
export const saveModernOnboarding = async (
  userId: string,
  data: ModernOnboardingData,
  isPartial: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Charger l'état actuel pour ne rien écraser
    const { data: existing } = await supabase
      .from('profiles')
      .select(
        'full_name, professional_status, is_employee, is_self_employed, is_retired, is_homeowner, family_status, age_range, income_range, children_count, patrimony_range, housing_status, onboarding_completed'
      )
      .eq('user_id', userId)
      .maybeSingle();

    const existingRow = (existing ?? {}) as Record<string, unknown>;
    const isEmpty = (v: unknown) =>
      v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v));

    const updatePayload: Record<string, unknown> = {
      // On marque toujours le timestamp
      updated_at: new Date().toISOString(),
      onboarding_completed: true,
      onboarding_partial: isPartial,
      onboarding_completed_at: new Date().toISOString(),
    };

    // full_name : seulement si quiz a une valeur ET DB est vide
    if (data.fullName && isEmpty(existingRow.full_name)) {
      updatePayload.full_name = data.fullName;
    }

    // professional_status (+ booléens dérivés) : seulement si DB vide
    if (data.professionalStatus && isEmpty(existingRow.professional_status)) {
      updatePayload.professional_status = data.professionalStatus;
      updatePayload.is_employee = data.professionalStatus === 'employee';
      updatePayload.is_self_employed = data.professionalStatus === 'self_employed';
      updatePayload.is_retired = data.professionalStatus === 'retired';
    }

    // is_homeowner dérivé du housingStatus, seulement si DB n'a pas déjà housingStatus
    if (data.housingStatus && isEmpty(existingRow.housing_status)) {
      const isHomeowner =
        data.housingStatus === 'owner_mortgage' || data.housingStatus === 'owner_paid';
      updatePayload.housing_status = data.housingStatus;
      // is_homeowner n'écrase que s'il était à false/null par défaut
      if (isEmpty(existingRow.is_homeowner) || existingRow.is_homeowner === false) {
        updatePayload.is_homeowner = isHomeowner;
      }
    }

    // family_status : ne pas forcer 'single' si déjà défini
    if (data.familyStatus && isEmpty(existingRow.family_status)) {
      updatePayload.family_status = data.familyStatus;
    }

    // children_count : ne remplacer que si vide ou 0 par défaut
    if (data.childrenRange && (isEmpty(existingRow.children_count) || existingRow.children_count === 0)) {
      const childrenCountMap: Record<string, number> = {
        none: 0,
        '1': 1,
        '2': 2,
        '3_or_more': 3,
      };
      const childrenCount = childrenCountMap[data.childrenRange] ?? 0;
      // On n'écrit que si on apporte de l'info (>0) ou si la DB est vraiment vide
      if (childrenCount > 0 || isEmpty(existingRow.children_count)) {
        updatePayload.children_count = childrenCount;
      }
    }

    // age_range / income_range / patrimony_range : combler si vide
    if (data.ageRange && isEmpty(existingRow.age_range)) {
      updatePayload.age_range = data.ageRange;
    }
    if (data.incomeRange && isEmpty(existingRow.income_range)) {
      updatePayload.income_range = data.incomeRange;
    }
    if (data.savingsRange && isEmpty(existingRow.patrimony_range)) {
      updatePayload.patrimony_range = data.savingsRange;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload as Record<string, unknown>)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Une erreur est survenue' };
  }
};

export const loadOnboardingStatus = async (
  userId: string
): Promise<{ completed: boolean; partial: boolean; fullName: string | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_partial, full_name')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return { completed: false, partial: false, fullName: null };

    return {
      completed: data.onboarding_completed || false,
      partial: data.onboarding_partial || false,
      fullName: data.full_name || null,
    };
  } catch {
    return { completed: false, partial: false, fullName: null };
  }
};
