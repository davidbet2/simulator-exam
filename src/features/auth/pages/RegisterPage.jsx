import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11.01 11.01 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.6.23 2.78.11 3.08.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
    <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
    <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
    <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
  </svg>
)
import { useAuthStore } from '../../../core/store/useAuthStore'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { Trans, useLingui } from '@lingui/react/macro'
import { SEOHead } from '../../../components/SEOHead'

const schema = z.object({
  displayName: z.string().min(2, 'Mínimo 2 caracteres').max(40, 'Máximo 40 caracteres'),
  email:       z.string().email('Correo electrónico inválido'),
  password:    z.string().min(6, 'Mínimo 6 caracteres'),
  confirm:     z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})

export function RegisterPage() {
  const navigate = useNavigate()
  const { t } = useLingui()
  const { register: registerUser, loginWithGoogle, loginWithGithub, loginWithMicrosoft, user, isLoading, error, clearError } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (user) navigate('/', { replace: true })
    return () => clearError()
  }, [user, navigate, clearError])

  const onSubmit = ({ email, password, displayName }) =>
    registerUser(email, password, displayName)

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <SEOHead title={t`Crear cuenta gratis`} description={t`Regístrate en CertZen para acceder a simuladores ilimitados.`} path="/register" noindex />
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
          <h1 className="text-xl font-semibold text-ink"><Trans>Crear cuenta gratis</Trans></h1>

          {error && (
            <div className="rounded-lg bg-danger-500/10 border border-danger-500/30 px-4 py-3 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label={t`Nombre`}
              type="text"
              autoComplete="name"
              placeholder={t`Tu nombre`}
              error={errors.displayName?.message}
              {...register('displayName')}
            />
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
              autoComplete="new-password"
              placeholder="••••••••"
              hint={t`Mínimo 6 caracteres`}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label={t`Confirmar contraseña`}
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              error={errors.confirm?.message}
              {...register('confirm')}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              <UserPlus size={16} />
              {isLoading ? t`Creando cuenta…` : t`Crear cuenta`}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-xs text-ink-soft">
              <span className="bg-surface-soft px-2"><Trans>o regístrate con</Trans></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={loginWithGoogle}
              disabled={isLoading}
              aria-label={t`Registrarse con Google`}
            >
              <GoogleIcon />
              <span className="hidden sm:inline">Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={loginWithGithub}
              disabled={isLoading}
              aria-label={t`Registrarse con GitHub`}
            >
              <GitHubIcon />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={loginWithMicrosoft}
              disabled={isLoading}
              aria-label={t`Registrarse con Microsoft`}
            >
              <MicrosoftIcon />
              <span className="hidden sm:inline">Microsoft</span>
            </Button>
          </div>

          <p className="text-center text-sm text-ink-soft">
            <Trans>¿Ya tienes cuenta?</Trans>{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              <Trans>Inicia sesión</Trans>
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
