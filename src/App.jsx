import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AppRouter } from './core/router/AppRouter';
import { useAuthStore } from './core/store/useAuthStore';

function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return (
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
  );
}

export default App;
