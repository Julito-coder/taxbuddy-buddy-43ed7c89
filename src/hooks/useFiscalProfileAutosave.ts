import { useCallback, useEffect, useRef, useState } from 'react';
import { saveFiscalProfile, FiscalProfileData } from '@/lib/fiscalProfileService';

export type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface Options {
  userId: string | undefined;
  debounceMs?: number;
}

/**
 * Auto-save hook for the fiscal profile.
 *
 * - Queues partial updates and persists them after `debounceMs` of inactivity.
 * - Flushes immediately on `flushNow()`, page hide / tab change, or unmount.
 * - Exposes a status for UI feedback.
 */
export const useFiscalProfileAutosave = ({ userId, debounceMs = 1200 }: Options) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastError, setLastError] = useState<string | null>(null);

  const pendingRef = useRef<Partial<FiscalProfileData>>({});
  const timerRef = useRef<number | null>(null);
  const inFlightRef = useRef<Promise<void> | null>(null);
  const userIdRef = useRef<string | undefined>(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  const performSave = useCallback(async () => {
    const uid = userIdRef.current;
    const updates = pendingRef.current;
    if (!uid || Object.keys(updates).length === 0) {
      return;
    }
    pendingRef.current = {};
    setStatus('saving');
    try {
      const result = await saveFiscalProfile(uid, updates);
      if (result.success) {
        setStatus('saved');
        setLastError(null);
        window.dispatchEvent(
          new CustomEvent('elio:profile-updated', { detail: { source: 'autosave' } })
        );
      } else {
        // Restore unsaved updates on top of any new pending ones
        pendingRef.current = { ...updates, ...pendingRef.current };
        setStatus('error');
        setLastError(result.error || 'Erreur de sauvegarde');
      }
    } catch (e: any) {
      pendingRef.current = { ...updates, ...pendingRef.current };
      setStatus('error');
      setLastError(e?.message || 'Erreur réseau');
    }
  }, []);

  const flushNow = useCallback(async () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (inFlightRef.current) {
      await inFlightRef.current;
    }
    if (Object.keys(pendingRef.current).length === 0) return;
    const p = performSave();
    inFlightRef.current = p.then(() => {
      inFlightRef.current = null;
    });
    await inFlightRef.current;
  }, [performSave]);

  const queueUpdate = useCallback(
    (updates: Partial<FiscalProfileData>) => {
      if (!updates || Object.keys(updates).length === 0) return;
      pendingRef.current = { ...pendingRef.current, ...updates };
      setStatus('pending');
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        void performSave();
      }, debounceMs);
    },
    [debounceMs, performSave]
  );

  // Flush on tab change / page hide / unmount
  useEffect(() => {
    const onHide = () => {
      if (Object.keys(pendingRef.current).length === 0) return;
      // Best-effort synchronous flush — fire-and-forget
      void flushNow();
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onHide();
    };
    window.addEventListener('pagehide', onHide);
    window.addEventListener('beforeunload', onHide);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('beforeunload', onHide);
      document.removeEventListener('visibilitychange', onVisibility);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      // Final flush on unmount
      void flushNow();
    };
  }, [flushNow]);

  const hasPending = Object.keys(pendingRef.current).length > 0 || status === 'pending' || status === 'saving';

  return {
    status,
    lastError,
    queueUpdate,
    flushNow,
    hasPending,
  };
};
