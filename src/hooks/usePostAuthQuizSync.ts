import { useEffect, useRef } from 'react';
import { saveModernOnboarding, loadOnboardingStatus } from '@/lib/modernOnboardingService';
import { ModernOnboardingData } from '@/data/modernOnboardingTypes';

const QUIZ_STORAGE_KEY = 'elio_quiz_data';

export interface StoredQuizData {
  data: ModernOnboardingData;
  score: number;
  totalLoss: number;
}

export const storeQuizData = (quizData: StoredQuizData): void => {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizData));
};

export const getStoredQuizData = (): StoredQuizData | null => {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredQuizData;
  } catch {
    return null;
  }
};

export const clearStoredQuizData = (): void => {
  localStorage.removeItem(QUIZ_STORAGE_KEY);
};

/**
 * After auth, sync any cached quiz data to the user's profile — ONCE.
 *
 * Garde-fous :
 * - Si onboarding_completed = true en DB → skip + clear localStorage.
 *   Empêche tout rejeu après que l'utilisateur a enrichi son profil.
 * - Le localStorage est nettoyé EN AMONT de la sync pour éviter qu'un
 *   re-mount du ProtectedRoute pendant l'écriture relance une 2e sync.
 */
export const usePostAuthQuizSync = (userId: string | undefined): boolean => {
  const syncing = useRef(false);
  const synced = useRef(false);

  useEffect(() => {
    if (!userId || synced.current || syncing.current) return;

    const quizData = getStoredQuizData();
    if (!quizData) {
      synced.current = true;
      return;
    }

    syncing.current = true;

    (async () => {
      try {
        // Vérification serveur : si onboarding déjà complété, on ne touche à rien
        const status = await loadOnboardingStatus(userId);
        if (status.completed) {
          clearStoredQuizData();
          return;
        }

        // Clear EN AMONT pour qu'un re-mount ne relance pas la sync
        clearStoredQuizData();

        const result = await saveModernOnboarding(userId, quizData.data, false);
        if (result.success) {
          window.dispatchEvent(
            new CustomEvent('elio:profile-updated', { detail: { source: 'modern_onboarding' } })
          );
        }
      } finally {
        synced.current = true;
        syncing.current = false;
      }
    })();
  }, [userId]);

  return syncing.current;
};
