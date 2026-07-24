import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, LogIn, AlertTriangle, Timer, Mail, Lock } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
const VERIFY_TURNSTILE_URL = import.meta.env.VITE_TURNSTILE_VERIFY_URL
  ?? `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/verifyTurnstile`;
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { AuthShell, GlassField } from '../../auth/components/AuthShell';
import { GlassButton } from '../../../components/glass/GlassButton';

// Admin login is protected server-side via Firestore rules (admins collection).
// Client-side: Turnstile CAPTCHA + progressive lockout after failed attempts.

const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

const schema = z.object({
  email:        z.string().email('Correo electrónico inválido'),
  password:     z.string().min(6, 'Mínimo 6 caracteres'),
  captchaToken: TURNSTILE_KEY
    ? z.string().min(1, 'Completa la verificación de seguridad')
    : z.string().optional(),
});

export function AdminLoginPage() {
  const navigate = useNavigate();
  const login     = useAuthStore((s) => s.login);
  const user      = useAuthStore((s) => s.user);
  const isAdmin   = useAuthStore((s) => s.isAdmin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error     = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [attempts, setAttempts]         = useState(0);
  const [locked, setLocked]             = useState(false);
  const [countdown, setCountdown]       = useState(0);
  const [turnstileKey, setTurnstileKey] = useState(0);


  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // Countdown ticker — Date.now() lives in effect body, not during render
  useEffect(() => {
    if (!locked) return;
    const endTime = Date.now() + LOCKOUT_SECONDS * 1000;
    const tick = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(tick);
        setLocked(false);
        setAttempts(0);
        setCountdown(0);
      } else {
        setCountdown(remaining);
      }
    }, 500);
    return () => clearInterval(tick);
  }, [locked]);

  useEffect(() => {
    if (isAdmin) navigate('/admin', { replace: true });
    return () => clearError();
  }, [isAdmin, navigate, clearError]);

  function resetTurnstile() {
    setTurnstileKey((k) => k + 1);
    setValue('captchaToken', '');
  }

  function startLockout() {
    setLocked(true);
    setCountdown(LOCKOUT_SECONDS);
  }

  const onSubmit = async ({ email, password, captchaToken }) => {
    if (locked) return;
    clearError();

    if (TURNSTILE_KEY && captchaToken) {
      try {
        const resp = await fetch(VERIFY_TURNSTILE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken }),
        });
        if (!resp.ok) {
          useAuthStore.setState({ error: 'Verifica que eres humano e inténtalo de nuevo.', isLoading: false });
          resetTurnstile();
          return;
        }
      } catch (_err) {
        useAuthStore.setState({ error: 'Error al verificar el captcha. Verifica tu conexión.', isLoading: false });
        resetTurnstile();
        return;
      }
    }

    await login(email, password);

    const currentError = useAuthStore.getState().error;
    if (currentError) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) startLockout();
      resetTurnstile();
    }
  };

  if (user && !isAdmin && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthShell>
      <Helmet>
        <title>Admin — CertZen</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300">
          <ShieldCheck size={18} />
        </span>
        <div>
          <h1 className="text-xl font-bold">Panel Administrador</h1>
          <p className="text-xs text-zen-ink/60 dark:text-white/50">Acceso restringido · CertZen</p>
        </div>
      </div>

      {/* Lockout banner */}
      {locked && (
        <div className="flex items-start gap-3 rounded-zen border border-zen-warning/30 bg-zen-warning/10 px-4 py-3 text-sm text-amber-700 dark:text-zen-warning">
          <Timer size={16} className="mt-0.5 shrink-0" />
          <span>
            Demasiados intentos fallidos. Espera <strong>{countdown}s</strong> antes de intentar de nuevo.
          </span>
        </div>
      )}

      {/* Remaining attempts warning */}
      {!locked && attempts > 0 && attempts < MAX_ATTEMPTS && (
        <div className="flex items-start gap-3 rounded-zen border border-zen-warning/30 bg-zen-warning/10 px-4 py-3 text-sm text-amber-700 dark:text-zen-warning">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            Intento {attempts} de {MAX_ATTEMPTS}. Tras {MAX_ATTEMPTS} fallos se bloqueará {LOCKOUT_SECONDS}s.
          </span>
        </div>
      )}

      {/* Auth error */}
      {error && !locked && (
        <div className="rounded-zen border border-zen-danger/30 bg-zen-danger/10 px-4 py-3 text-sm text-zen-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <GlassField
          id="admin-login-email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          autoComplete="username"
          placeholder="admin@empresa.com"
          error={errors.email?.message}
          disabled={locked}
          {...register('email')}
        />
        <GlassField
          id="admin-login-password"
          label="Contraseña"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={locked}
          {...register('password')}
        />

        {TURNSTILE_KEY && (
          <div>
            <div className="overflow-hidden rounded-zen border border-glass-light-border bg-glass-light-1 dark:border-glass-dark-border dark:bg-glass-dark-1 [&_iframe]:!w-full">
              <Controller
                name="captchaToken"
                control={control}
                render={({ field }) => (
                  <Turnstile
                    key={turnstileKey}
                    siteKey={TURNSTILE_KEY}
                    onSuccess={(token) => field.onChange(token)}
                    onExpire={() => field.onChange('')}
                    onError={() => field.onChange('')}
                    options={{ theme: 'auto', size: 'flexible', language: 'auto' }}
                  />
                )}
              />
            </div>
            {errors.captchaToken && (
              <p className="mt-1 text-xs text-zen-danger">{errors.captchaToken.message}</p>
            )}
          </div>
        )}

        <GlassButton type="submit" className="w-full" disabled={isLoading || locked}>
          <LogIn size={16} />
          {isLoading ? 'Verificando…' : 'Iniciar sesión'}
        </GlassButton>
      </form>

      <p className="text-center text-xs text-zen-ink/50 dark:text-white/40">
        <Link to="/" className="underline underline-offset-2 transition-colors hover:text-zen-ink dark:hover:text-white/70">
          ← Volver al simulador
        </Link>
      </p>
    </AuthShell>
  );
}
