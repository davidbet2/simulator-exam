import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, LogIn, AlertTriangle, Timer } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
const VERIFY_TURNSTILE_URL = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/verifyTurnstile`;
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../../core/store/useAuthStore';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

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
          console.warn('Turnstile verification failed (non-blocking):', resp.status);
        }
      } catch (err) {
        // Turnstile is a secondary layer — Firebase Auth + Firestore rules are the real gate.
        console.warn('Turnstile verification failed (non-blocking):', err?.message);
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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Helmet>
        <title>Admin — CertZen</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-3">
            <ShieldCheck className="text-brand-400" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-ink">Panel Administrador</h1>
          <p className="text-ink-soft text-sm mt-1">Acceso restringido · CertZen</p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-soft p-6 space-y-5">

          {/* Lockout banner */}
          {locked && (
            <div className="flex items-start gap-3 rounded-lg bg-warning-500/10 border border-warning-500/30 px-4 py-3 text-sm text-yellow-400">
              <Timer size={16} className="mt-0.5 shrink-0" />
              <span>
                Demasiados intentos fallidos. Espera <strong>{countdown}s</strong> antes de intentar de nuevo.
              </span>
            </div>
          )}

          {/* Remaining attempts warning */}
          {!locked && attempts > 0 && attempts < MAX_ATTEMPTS && (
            <div className="flex items-start gap-3 rounded-lg bg-warning-500/10 border border-warning-500/30 px-4 py-3 text-sm text-yellow-400">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>
                Intento {attempts} de {MAX_ATTEMPTS}. Tras {MAX_ATTEMPTS} fallos se bloqueará {LOCKOUT_SECONDS}s.
              </span>
            </div>
          )}

          {/* Auth error */}
          {error && !locked && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 px-4 py-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Correo electrónico"
              type="email"
              autoComplete="username"
              placeholder="admin@empresa.com"
              error={errors.email?.message}
              disabled={locked}
              {...register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={locked}
              {...register('password')}
            />

            {TURNSTILE_KEY && (
              <div>
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
                      options={{ theme: 'dark', size: 'normal', language: 'auto' }}
                    />
                  )}
                />
                {errors.captchaToken && (
                  <p className="text-xs text-danger-400 mt-1">{errors.captchaToken.message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || locked}
            >
              <LogIn size={16} />
              {isLoading ? 'Verificando…' : 'Iniciar sesión'}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-ink-muted">
          <Link to="/" className="hover:text-ink-soft transition-colors underline underline-offset-2">
            ← Volver al simulador
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
