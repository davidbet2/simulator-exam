import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Lock, Mail } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
const VERIFY_TURNSTILE_URL = `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/verifyTurnstile`

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

import { useAuthStore } from '../../../core/store/useAuthStore'
import { GlassButton } from '../../../components/glass/GlassButton'
import { AuthShell, GlassField, authLinkClass } from '../components/AuthShell'
import { Trans, useLingui } from '@lingui/react/macro'
import { SEOHead } from '../../../components/SEOHead'

const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

const schema = z.object({
  email:        z.string().email('Correo electrónico inválido'),
  password:     z.string().min(6, 'Mínimo 6 caracteres'),
  captchaToken: TURNSTILE_KEY ? z.string().min(1, 'Completa la verificación de seguridad') : z.string().optional(),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { t } = useLingui()
  const { login, loginWithGoogle, user, isLoading, error, clearError, sessionClosedMessage } = useAuthStore()
  const [turnstileReady, setTurnstileReady] = useState(!TURNSTILE_KEY)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    clearError()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const onSubmit = async ({ email, password, captchaToken }) => {
    if (TURNSTILE_KEY && captchaToken) {
      try {
        const resp = await fetch(VERIFY_TURNSTILE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken }),
        })
        if (!resp.ok) {
          useAuthStore.setState({ error: 'Verifica que eres humano e inténtalo de nuevo.', isLoading: false })
          return
        }
      } catch {
        useAuthStore.setState({ error: 'Error al verificar el captcha. Verifica tu conexión.', isLoading: false })
        return
      }
    }
    await login(email, password)
  }

  return (
    <AuthShell>
      <SEOHead title={t`Iniciar sesión`} description={t`Accede a CertZen para continuar tu preparación.`} path="/login" noindex />
      <h1 className="text-xl font-bold"><Trans>Iniciar sesión</Trans></h1>

      {sessionClosedMessage && (
        <div className="rounded-zen border border-zen-danger/30 bg-zen-danger/10 px-4 py-3 text-sm text-zen-danger" role="alert">
          {sessionClosedMessage}
        </div>
      )}

      {error && (
        <div className="rounded-zen border border-zen-danger/30 bg-zen-danger/10 px-4 py-3 text-sm text-zen-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <GlassField
          id="login-email"
          label={t`Correo electrónico`}
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <GlassField
          id="login-password"
          label={t`Contraseña`}
          icon={Lock}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="-mt-1 flex justify-end">
          <Link to="/forgot-password" className={`text-xs ${authLinkClass}`}>
            <Trans>¿Olvidaste tu contraseña?</Trans>
          </Link>
        </div>

        {TURNSTILE_KEY && (
          <div>
            {/* Widget "Verificación de seguridad" del diseño (Turnstile restylado) */}
            <div className="overflow-hidden rounded-zen border border-glass-light-border bg-glass-light-1 dark:border-glass-dark-border dark:bg-glass-dark-1 [&_iframe]:!w-full">
              <Controller
                name="captchaToken"
                control={control}
                render={({ field }) => (
                  <Turnstile
                    siteKey={TURNSTILE_KEY}
                    onSuccess={(token) => { field.onChange(token); setTurnstileReady(true) }}
                    onExpire={() => { field.onChange(''); setTurnstileReady(false) }}
                    onError={() => { field.onChange(''); setTurnstileReady(false) }}
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

        <GlassButton type="submit" className="w-full" disabled={isLoading || !turnstileReady}>
          <LogIn size={16} />
          {isLoading ? t`Ingresando…` : t`Ingresar`}
        </GlassButton>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-glass-light-border dark:border-glass-dark-border" />
        </div>
        <div className="relative flex justify-center text-xs text-zen-ink/60 dark:text-white/50">
          <span className="bg-transparent px-2 backdrop-blur-sm"><Trans>o continúa con</Trans></span>
        </div>
      </div>

      <GlassButton
        variant="secondary"
        className="w-full"
        type="button"
        onClick={loginWithGoogle}
        disabled={isLoading}
        aria-label={t`Ingresar con Google`}
      >
        <GoogleIcon />
        <span>Google</span>
      </GlassButton>

      <p className="text-center text-sm text-zen-ink/70 dark:text-white/60">
        <Trans>¿No tienes cuenta?</Trans>{' '}
        <Link to="/register" className={authLinkClass}>
          <Trans>Regístrate gratis</Trans>
        </Link>
      </p>
    </AuthShell>
  )
}
