/**
 * useThemeStore — theme preference (light / dark / auto) with persistence.
 *
 * Applies `.dark` class to <html> based on resolved mode.
 * 'auto' follows the OS `prefers-color-scheme` media query.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'certzen:theme';

function systemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function resolveMode(mode) {
  if (mode === 'auto') return systemPrefersDark() ? 'dark' : 'light';
  return mode;
}

function applyClass(resolved) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // 'light' | 'dark' | 'auto'
      mode: 'auto',

      setMode: (mode) => {
        set({ mode });
        applyClass(resolveMode(mode));
      },

      /** Returns the resolved theme ('light' | 'dark') accounting for 'auto'. */
      resolved: () => resolveMode(get().mode),

      /** Apply stored theme on app boot + subscribe to system changes when 'auto'. */
      init: () => {
        applyClass(resolveMode(get().mode));
        if (typeof window !== 'undefined' && window.matchMedia) {
          const mql = window.matchMedia('(prefers-color-scheme: dark)');
          const listener = () => {
            if (get().mode === 'auto') applyClass(resolveMode('auto'));
          };
          mql.addEventListener?.('change', listener);
          return () => mql.removeEventListener?.('change', listener);
        }
        return () => {};
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
