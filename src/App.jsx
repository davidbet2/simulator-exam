import { useEffect } from 'react';
import { AppRouter } from './core/router/AppRouter';
import { useAuthStore } from './core/store/useAuthStore';

function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return <AppRouter />;
}

export default App;
