import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type RichViewType =
  | 'tax_breakdown'
  | 'real_estate_cashflow'
  | 'deadlines_list'
  | 'recommendations_list'
  | 'aids_eligibility'
  | 'fiscal_concept'
  | 'profile_update_proposal'
  | null;

export interface RichView {
  type: RichViewType;
  data: any;
}

export type AgentErrorKind = 'network' | 'quota' | 'profile_incomplete' | 'generic';

export interface AgentErrorPayload {
  kind: AgentErrorKind;
  message: string;
  meta?: { missingFields?: string[]; code?: string; rawMessage?: string };
  /** Texte original que l'utilisateur a tenté d'envoyer, pour le retry */
  retryText?: string;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  rich_view?: RichView | null;
  /** Présent quand le message est une carte d'erreur affichée dans le thread */
  error?: AgentErrorPayload | null;
}

export const useElioAgent = () => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);

  const handleResponse = useCallback((data: any) => {
    if (data?.conversation_id) setConversationId(data.conversation_id);
    if (typeof data?.remaining_today === 'number') setRemainingToday(data.remaining_today);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: data?.message ?? '',
        rich_view: data?.rich_view ?? null,
      },
    ]);
  }, []);

  const lastUserTextRef = useRef<string | null>(null);

  const pushErrorCard = useCallback((payload: AgentErrorPayload) => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: '',
        rich_view: null,
        error: payload,
      },
    ]);
  }, []);

  const classifyError = useCallback(
    (error: unknown, fallbackMessage?: string): AgentErrorPayload => {
      const ctx = (error as any)?.context;
      const status = ctx?.status ?? (error as any)?.status;
      const serverMsg: string | undefined =
        ctx?.error?.message ?? ctx?.error ?? fallbackMessage;
      const serverCode: string | undefined = ctx?.error?.code ?? ctx?.code;
      const missingFields: string[] | undefined = ctx?.error?.missing_fields ?? ctx?.missing_fields;

      // Profil incomplet (renvoyé par l'edge function avec status 422 ou code dédié)
      if (status === 422 || serverCode === 'profile_incomplete' || (missingFields && missingFields.length)) {
        return {
          kind: 'profile_incomplete',
          message: serverMsg ?? '',
          meta: { code: String(status ?? serverCode ?? ''), missingFields, rawMessage: serverMsg },
        };
      }

      // Quota / paiement
      if (status === 402 || status === 429 || serverCode === 'quota_exceeded' || serverCode === 'free_tier_limit') {
        return {
          kind: 'quota',
          message: serverMsg ?? '',
          meta: { code: String(status ?? serverCode ?? '') },
        };
      }

      // Réseau : pas de réponse ou erreur de fetch
      const name = (error as any)?.name;
      const msg = (error as any)?.message ?? '';
      const isNetwork =
        name === 'TypeError' ||
        name === 'FetchError' ||
        /network|fetch|failed to fetch|load failed|offline/i.test(String(msg)) ||
        typeof status === 'undefined';
      if (isNetwork) {
        return {
          kind: 'network',
          message: '',
          meta: { code: status ? String(status) : 'no_response', rawMessage: serverMsg ?? msg },
        };
      }

      return {
        kind: 'generic',
        message: serverMsg ?? '',
        meta: { code: String(status ?? 'unknown'), rawMessage: serverMsg },
      };
    },
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      lastUserTextRef.current = trimmed;
      const userMsg: AgentMessage = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const { data, error } = await supabase.functions.invoke('elio-agent', {
          body: { type: 'message', message: trimmed, conversation_id: conversationId },
        });

        if (error) {
          pushErrorCard({ ...classifyError(error), retryText: trimmed });
          return;
        }

        handleResponse(data);
      } catch (e) {
        console.error('[useElioAgent] error', e);
        pushErrorCard({ ...classifyError(e), retryText: trimmed });
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, isLoading, handleResponse, pushErrorCard, classifyError],
  );

  /**
   * Réessaie le dernier message utilisateur. Retire la dernière carte d'erreur
   * puis renvoie le texte au backend.
   */
  const retryLastMessage = useCallback(() => {
    const text = lastUserTextRef.current;
    if (!text) return;
    setMessages((prev) => {
      // Retire la dernière carte d'erreur (en queue) ET le user msg associé pour éviter le doublon
      const out = [...prev];
      while (out.length && out[out.length - 1].role === 'assistant' && (out[out.length - 1] as AgentMessage).error) {
        out.pop();
      }
      if (out.length && out[out.length - 1].role === 'user' && out[out.length - 1].content === text) {
        out.pop();
      }
      return out;
    });
    sendMessage(text);
  }, [sendMessage]);

  /**
   * Confirme et applique les mises à jour de profil proposées par l'agent.
   * 1. Écrit en base via UPDATE sur public.profiles
   * 2. Notifie l'agent qui reprend la tâche en cours avec les nouvelles valeurs
   */
  const confirmProfileUpdates = useCallback(
    async (updates: Array<{ field: string; value: any }>) => {
      if (!updates.length) return;
      if (!conversationId) {
        toast({
          title: 'Erreur',
          description: 'Aucune conversation active.',
          variant: 'destructive',
        });
        return;
      }

      setIsLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        if (!userId) throw new Error('Utilisateur non authentifié');

        // Construit le payload en convertissant les valeurs proprement
        const payload: Record<string, any> = {};
        for (const u of updates) {
          payload[u.field] = u.value;
        }

        const { error: updateError } = await supabase
          .from('profiles')
          .update(payload)
          .eq('user_id', userId);

        if (updateError) {
          console.error('[useElioAgent] profile update error', updateError);
          toast({
            title: 'Erreur',
            description: "Impossible d'enregistrer les modifications.",
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Profil mis à jour',
          description: 'Élio reprend ton calcul avec les nouvelles infos.',
        });

        // Affiche un message user "fantôme" pour la lisibilité du fil
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: `J'ai confirmé : ${updates.map((u) => u.field).join(', ')}`,
          },
        ]);

        // Notifie l'agent pour qu'il reprenne la tâche
        const { data, error } = await supabase.functions.invoke('elio-agent', {
          body: {
            type: 'resume_after_confirmation',
            conversation_id: conversationId,
            confirmed_updates: updates,
          },
        });

        if (error) {
          toast({
            title: 'Erreur',
            description: "Élio n'a pas pu reprendre. Renvoie ton message.",
            variant: 'destructive',
          });
          return;
        }

        handleResponse(data);
      } catch (e) {
        console.error('[useElioAgent] confirmProfileUpdates error', e);
        toast({
          title: 'Erreur',
          description: 'Erreur lors de la confirmation.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, handleResponse],
  );

  const startNewConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  /**
   * Recharge une conversation existante depuis la base
   * (sans appeler l'agent — juste pour reprendre la lecture / continuer plus tard).
   */
  const loadExistingConversation = useCallback(
    (id: string, loadedMessages: AgentMessage[]) => {
      setConversationId(id);
      setMessages(loadedMessages);
    },
    [],
  );

  const notifyProfileUpdated = useCallback(() => {
    toast({
      title: 'Profil mis à jour',
      description: 'Élio prend en compte tes nouvelles infos au prochain message 🌤️',
    });
  }, []);

  // Écoute les sauvegardes manuelles de profil (FiscalProfileForm, onboarding sync)
  // pour notifier l'agent automatiquement.
  useEffect(() => {
    const handler = () => notifyProfileUpdated();
    window.addEventListener('elio:profile-updated', handler);
    return () => window.removeEventListener('elio:profile-updated', handler);
  }, [notifyProfileUpdated]);

  return {
    messages,
    isLoading,
    conversationId,
    remainingToday,
    sendMessage,
    confirmProfileUpdates,
    startNewConversation,
    loadExistingConversation,
    notifyProfileUpdated,
  };
};

