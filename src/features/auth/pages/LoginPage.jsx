import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
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
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
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
  const { login, loginWithGoogle, user, isLoading, error, clearError } = useAuthStore()

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (user) navigate('/', { replace: true })
    return () => clearError()
  }, [user, navigate, clearError])

  const onSubmit = async ({ email, password, captchaToken }) => {
    if (TURNSTILE_KEY && captchaToken) {
      try {
        const resp = await fetch(VERIFY_TURNSTILE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: captchaToken }),
        })
        if (!resp.ok) return
      } catch {
        return
      }
    }
    await login(email, password)
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <SEOHead title={t`Iniciar sesión`} description={t`Accede a CertZen para continuar tu preparación.`} path="/login" noindex />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
              CertZen
            </span>
          </div>
          <p className="text-ink-soft text-sm"><Trans>Domina tu certificación</Trans></p>
        </div>

        <div className="rounded-2xl border border-surface-border bg-surface-soft p-6 space-y-5">
          <h1 className="text-xl font-semibold text-ink"><Trans>Iniciar sesión</Trans></h1>

          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 px-4 py-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label={t`Correo electrónico`}
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t`Contraseña`}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                <Trans>¿Olvidaste tu contraseña?</Trans>
              </Link>
            </div>

            {TURNSTILE_KEY && (
              <div>
                <Controller
                  name="captchaToken"
                  control={control}
                  render={({ field }) => (
                    <Turnstile
                      siteKey={TURNSTILE_KEY}
                      onSuccess={(token) => field.onChange(token)}
                      onExpire={() => field.onChange('')}
                      onError={() => field.onChange('')}
                      options={{ theme: 'auto', size: 'normal', language: 'auto' }}
                    />
                  )}
                />
                {errors.captchaToken && (
                  <p className="text-xs text-danger-400 mt-1">{errors.captchaToken.message}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn size={16} />
              {isLoading ? t`Ingresando…` : t`Ingresar`}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-xs text-ink-soft">
              <span className="bg-surface-soft px-2"><Trans>o continúa con</Trans></span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={loginWithGoogle}
            disabled={isLoading}
            aria-label={t`Ingresar con Google`}
          >
            <GoogleIcon />
            <span>Google</span>
          </Button>

          <p className="text-center text-sm text-ink-soft">
            <Trans>¿No tienes cuenta?</Trans>{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
              <Trans>Regístrate gratis</Trans>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
