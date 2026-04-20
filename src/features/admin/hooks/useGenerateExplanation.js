import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../core/firebase/firebase';

/**
 * Hook for calling the `generateExplanation` Firebase Function.
 * Sends question data to Gemini 2.5 Flash and returns a 2-3 sentence
 * pedagogical explanation in Spanish.
 *
 * Usage:
 *   const { generate, loading, error } = useGenerateExplanation();
 *   const { explanation } = await generate({ question, options, answer, type });
 */
export function useGenerateExplanation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate({ question, options, answer, type }) {
    setLoading(true);
    setError(null);
    try {
      const fns = getFunctions(app);
      const fn  = httpsCallable(fns, 'generateExplanation');
      const result = await fn({ question, options, answer, type });
      return { explanation: result.data.explanation };
    } catch (err) {
      const msg = err?.message ?? 'Error al generar la explicación';
      setError(msg);
      return { explanation: null };
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
