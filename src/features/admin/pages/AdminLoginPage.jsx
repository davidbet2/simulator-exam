import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../../core/store/useAuthStore';

// Optional obscurity gate: if VITE_ADMIN_ACCESS_KEY is set at build time,
// the login page is only reachable via /admin/login?k=<key>. Otherwise the
// gate is a no-op (keeps local dev ergonomic).
const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY ?? '';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already admin
  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true });
  }, [isAdmin, navigate]);

  // Silently redirect away if the obscurity key is required but not matched.
  if (ADMIN_ACCESS_KEY && searchParams.get('k') !== ADMIN_ACCESS_KEY) {
    return <Navigate to="/" replace />;
  }

  // Authenticated non-admin users should not see this page.
  if (user && !isAdmin && !isLoading) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    clearError();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register(email, password);
    }
  }

  return (
    <div className="min-h-screen bg-appian-bg flex items-center justify-center px-4">
      <Helmet>
        <title>Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md px-8 py-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl">🔐</span>
          <h1 className="text-xl font-bold text-appian-blue mt-2">Panel Administrador</h1>
          <p className="text-appian-muted text-xs mt-1">Panel CertZen</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-appian-error-light text-appian-error text-sm rounded p-3 mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-appian-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-appian-blue"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-appian-blue hover:bg-appian-blue-dark disabled:bg-gray-300 text-white font-bold py-2.5 rounded transition-colors text-sm"
          >
            {isLoading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarme'}
          </button>
        </form>

        {/* Mode switch */}
        <div className="text-center mt-4">
          {mode === 'login' ? (
            <p className="text-xs text-appian-muted">
              ¿Tienes una invitación de admin?{' '}
              <button
                onClick={() => { setMode('register'); clearError(); }}
                className="text-appian-blue font-semibold hover:underline"
              >
                Regístrate
              </button>
            </p>
          ) : (
            <p className="text-xs text-appian-muted">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => { setMode('login'); clearError(); }}
                className="text-appian-blue font-semibold hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-gray-400 hover:text-appian-muted underline">
            ← Volver al simulador
          </a>
        </div>
      </div>
    </div>
  );
}
