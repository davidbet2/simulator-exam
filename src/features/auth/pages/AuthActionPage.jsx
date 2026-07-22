/**
 * AuthActionPage — Custom Firebase email action handler
 *
 * Firebase emails (verification, password reset, email recovery) link here
 * instead of the default firebaseapp.com handler.
 *
 * Configure in Firebase Console → Authentication → Templates →
 * "Customize action URL" → https://certzen.app/auth/action
 *
 * Supported modes:
 *   ?mode=verifyEmail&oobCode=...    → applies code, redirects to /home
 *   ?mode=resetPassword&oobCode=...  → shows new password form
 *   ?mode=recoverEmail&oobCode=...   → restores old email, informs user
 */
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '../../../core/firebase/firebase'
import { CheckCircle, XCircle, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react'
import { GlassButton } from '../../../components/glass/GlassButton'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassInput } from '../../../components/glass/GlassInput'
import { PublicLayout } from '../../../components/layout/PublicLayout'
import { SEOHead } from '../../../components/SEOHead'

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="mb-8 inline-flex items-center gap-2.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zen-brand">
        <Sparkles size={20} className="text-white" />
      </div>
      <span className="text-3xl font-bold tracking-tight">CertZen</span>
    </div>
  )
}

function StatusCard({ icon: Icon, iconClass, title, body, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm text-center"
    >
      <Logo />
      <GlassCard className="space-y-5 p-8">
        <div className="flex justify-center">
          <Icon size={40} className={iconClass} />
        </div>
        <div>
          <h1 className="mb-2 text-xl font-bold">{title}</h1>
          <p className="text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">{body}</p>
        </div>
        {action}
      </GlassCard>
    </motion.div>
  )
}

// ─── mode handlers ────────────────────────────────────────────────────────────

function VerifyEmailHandler({ oobCode }) {
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus('success')
        // Refresh auth user so emailVerified reflects the new state
        auth.currentUser?.reload()
        setTimeout(() => navigate('/', { replace: true }), 3000)
      })
      .catch(() => setStatus('error'))
  }, [oobCode, navigate])

  if (status === 'loading') {
    return (
      <StatusCard
        icon={Loader2}
        iconClass="text-zen animate-spin dark:text-indigo-300"
        title="Verificando…"
        body="Estamos confirmando tu dirección de correo."
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-emerald-600 dark:text-zen-success"
        title="¡Correo verificado!"
        body="Tu cuenta está confirmada. En unos segundos te redirigimos."
        action={
          <GlassButton className="w-full" onClick={() => navigate('/', { replace: true })}>
            Ir a CertZen
          </GlassButton>
        }
      />
    )
  }

  return (
    <StatusCard
      icon={XCircle}
      iconClass="text-zen-danger"
      title="Enlace inválido"
      body="El enlace ya fue usado o expiró. Solicita uno nuevo desde la aplicación."
      action={
        <Link to="/verify-email">
          <GlassButton className="w-full">Solicitar nuevo enlace</GlassButton>
        </Link>
      }
    />
  )
}

function ResetPasswordHandler({ oobCode }) {
  const navigate = useNavigate()
  const [status, setStatus]     = useState('loading') // loading | form | success | error
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldError, setFieldError] = useState('')

  useEffect(() => {
    verifyPasswordResetCode(auth, oobCode)
      .then((emailFromCode) => {
        setEmail(emailFromCode)
        setStatus('form')
      })
      .catch(() => setStatus('error'))
  }, [oobCode])

  async function handleSubmit(e) {
    e.preventDefault()
    setFieldError('')
    if (password.length < 8) {
      setFieldError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setFieldError('Las contraseñas no coinciden.')
      return
    }
    setSubmitting(true)
    try {
      await confirmPasswordReset(auth, oobCode, password)
      setStatus('success')
      setTimeout(() => navigate('/login', { replace: true }), 3000)
    } catch {
      setFieldError('No se pudo cambiar la contraseña. El enlace puede haber expirado.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <StatusCard
        icon={Loader2}
        iconClass="text-zen animate-spin dark:text-indigo-300"
        title="Verificando enlace…"
        body=""
      />
    )
  }

  if (status === 'error') {
    return (
      <StatusCard
        icon={XCircle}
        iconClass="text-zen-danger"
        title="Enlace inválido"
        body="El enlace ya fue usado o expiró. Solicita uno nuevo."
        action={
          <Link to="/forgot-password">
            <GlassButton className="w-full">Olvidé mi contraseña</GlassButton>
          </Link>
        }
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-emerald-600 dark:text-zen-success"
        title="¡Contraseña actualizada!"
        body="Tu contraseña ha sido cambiada. En unos segundos te redirigimos al inicio de sesión."
        action={
          <GlassButton className="w-full" onClick={() => navigate('/login', { replace: true })}>
            Iniciar sesión
          </GlassButton>
        }
      />
    )
  }

  // status === 'form'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      <div className="text-center">
        <Logo />
      </div>
      <GlassCard className="space-y-5 p-8">
        <div>
          <h1 className="mb-1 text-xl font-bold">Nueva contraseña</h1>
          <p className="text-sm text-zen-ink/70 dark:text-white/60">Para <span className="font-medium text-zen-ink dark:text-white">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <GlassInput
              type={showPw ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="pr-11"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zen-ink/40 hover:text-zen-ink dark:text-white/40 dark:hover:text-white"
              aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <GlassInput
            type={showPw ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
          />

          {fieldError && (
            <p className="text-xs text-zen-danger">{fieldError}</p>
          )}

          <GlassButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Cambiar contraseña'}
          </GlassButton>
        </form>
      </GlassCard>
    </motion.div>
  )
}

function RecoverEmailHandler({ oobCode }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [oobCode])

  if (status === 'loading') {
    return (
      <StatusCard
        icon={Loader2}
        iconClass="text-zen animate-spin dark:text-indigo-300"
        title="Recuperando correo…"
        body=""
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-emerald-600 dark:text-zen-success"
        title="Correo recuperado"
        body="Tu dirección de correo anterior ha sido restaurada. Revisa tu bandeja para más información."
        action={
          <Link to="/login">
            <GlassButton className="w-full">Iniciar sesión</GlassButton>
          </Link>
        }
      />
    )
  }

  return (
    <StatusCard
      icon={XCircle}
      iconClass="text-zen-danger"
      title="Enlace inválido"
      body="El enlace ya fue usado o expiró."
      action={
        <Link to="/">
          <GlassButton className="w-full">Ir a inicio</GlassButton>
        </Link>
      }
    />
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export function AuthActionPage() {
  const [params] = useSearchParams()
  const mode    = params.get('mode')
  const oobCode = params.get('oobCode')

  function renderHandler() {
    if (!oobCode) {
      return (
        <StatusCard
          icon={XCircle}
          iconClass="text-zen-danger"
          title="Enlace inválido"
          body="Este enlace no es válido. Pide uno nuevo desde la aplicación."
          action={
            <Link to="/">
              <GlassButton className="w-full">Ir a inicio</GlassButton>
            </Link>
          }
        />
      )
    }

    switch (mode) {
      case 'verifyEmail':    return <VerifyEmailHandler  oobCode={oobCode} />
      case 'resetPassword':  return <ResetPasswordHandler oobCode={oobCode} />
      case 'recoverEmail':   return <RecoverEmailHandler  oobCode={oobCode} />
      default:
        return (
          <StatusCard
            icon={XCircle}
            iconClass="text-zen-danger"
            title="Acción desconocida"
            body="Este tipo de enlace no está soportado."
            action={
              <Link to="/">
                <GlassButton className="w-full">Ir a inicio</GlassButton>
              </Link>
            }
          />
        )
    }
  }

  return (
    <PublicLayout hideChrome>
      <div className="flex min-h-screen items-center justify-center p-4">
        <SEOHead title="CertZen" description="" path="/auth/action" noindex />
        {renderHandler()}
      </div>
    </PublicLayout>
  )
}
