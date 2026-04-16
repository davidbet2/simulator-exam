import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI-level preferences (persisted in localStorage).
 * - sidebarCollapsed: desktop sidebar in icon-only mode.
 */
export const useUIStore = create(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: !!v }),
    }),
    {
      name: 'certzen:ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
);
