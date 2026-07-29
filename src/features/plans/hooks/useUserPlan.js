import { useAuthStore } from '../../../core/store/useAuthStore'

/**
 * Returns { isPro, isLoading } for the current user's plan.
 * Free plan only unlocks Práctica Rápida (mode=quick) — every other mode
 * (Estudio Guiado, Modo Examen, Zona Débil, Repaso Inteligente, Apuesta tu
 * Confianza, Flashcards) requires Pro.
 */
export function useUserPlan() {
  const { isPro, isLoading } = useAuthStore()
  return { isPro, isLoading }
}
