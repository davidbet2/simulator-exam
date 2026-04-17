import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from '@lingui/react';
import { AppRouter } from './core/router/AppRouter';
import { useAuthStore } from './core/store/useAuthStore';
import { useThemeStore } from './core/store/useThemeStore';
import { i18n } from './core/i18n';

function App() {
  const init = useAuthStore((s) => s.init);
  const initTheme = useThemeStore((s) => s.init);

  useEffect(() => {
    const unsubscribe = init();
    const unsubscribeTheme = initTheme();
    return () => {
      unsubscribe?.();
      unsubscribeTheme?.();
    };
  }, [init, initTheme]);

  return (
    <I18nProvider i18n={i18n}>
      <HelmetProvider>
        {/* Skip to content — accessibility (fixed off-screen, visible on focus) */}
        <a
          href="#main-content"
          className="fixed top-[-100px] left-4 z-[9999] focus:top-4 transition-[top] duration-100 bg-brand-600 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-glow-brand"
        >
          Saltar al contenido
        </a>
        <AppRouter />
      </HelmetProvider>
    </I18nProvider>
  );
}

export default App;
