import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useFeatureFlags } from '../../../core/hooks/useFeatureFlags';

const SUGGESTION_COOLDOWN_MS = 5 * 60 * 1000;

/**
 * useSuggestionBox — combines the `suggestionsBoxEnabled` flag with auth
 * state and the current route to decide whether the suggestion FAB should
 * render, and exposes submit() to call the sendSuggestionEmail function.
 * The cooldown enforced here is UX-only (disables the submit button before
 * even trying) — the authoritative check happens server-side.
 */
export function useSuggestionBox() {
  const { flags } = useFeatureFlags();
  const { user } = useAuthStore();
  const { pathname } = useLocation();

  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const shouldShow =
    flags.suggestionsBoxEnabled && !!user && !pathname.startsWith('/exam');

  const cooldownActive = !!cooldownUntil && Date.now() < cooldownUntil;

  async function submit({ message, rating }) {
    setSubmitting(true);
    try {
      const fn = httpsCallable(getFunctions(), 'sendSuggestionEmail');
      const { data } = await fn({ message, rating: rating ?? null });
      const createdAtMs = data?.createdAt ? new Date(data.createdAt).getTime() : Date.now();
      setCooldownUntil(createdAtMs + SUGGESTION_COOLDOWN_MS);
      return { ok: true };
    } finally {
      setSubmitting(false);
    }
  }

  return {
    shouldShow,
    submitting,
    cooldownActive,
    submit,
  };
}
