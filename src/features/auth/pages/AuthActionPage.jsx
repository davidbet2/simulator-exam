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
import { CheckCircle, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { SEOHead } from '../../../components/SEOHead'

// ─── tiny helpers ────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="inline-flex items-center gap-2 mb-8">
      <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand">
        <span className="text-white font-black text-xs leading-none">CZ</span>
      </div>
      <span className="text-xl font-display font-black text-ink tracking-tight">
        Cert<span className="text-brand-500">Zen</span>
      </span>
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
      <div className="rounded-2xl border border-surface-border bg-surface-soft p-8 space-y-5">
        <div className="flex justify-center">
          <Icon size={40} className={iconClass} />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-ink mb-2">{title}</h1>
          <p className="text-sm text-ink-soft leading-relaxed">{body}</p>
        </div>
        {action}
      </div>
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
        iconClass="text-brand-500 animate-spin"
        title="Verificando…"
        body="Estamos confirmando tu dirección de correo."
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-success-500"
        title="¡Correo verificado!"
        body="Tu cuenta está confirmada. En unos segundos te redirigimos."
        action={
          <Button variant="primary" className="w-full" onClick={() => navigate('/', { replace: true })}>
            Ir a CertZen
          </Button>
        }
      />
    )
  }

  return (
    <StatusCard
      icon={XCircle}
      iconClass="text-danger-500"
      title="Enlace inválido"
      body="El enlace ya fue usado o expiró. Solicita uno nuevo desde la aplicación."
      action={
        <Link to="/verify-email">
          <Button variant="primary" className="w-full">Solicitar nuevo enlace</Button>
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
        iconClass="text-brand-500 animate-spin"
        title="Verificando enlace…"
        body=""
      />
    )
  }

  if (status === 'error') {
    return (
      <StatusCard
        icon={XCircle}
        iconClass="text-danger-500"
        title="Enlace inválido"
        body="El enlace ya fue usado o expiró. Solicita uno nuevo."
        action={
          <Link to="/forgot-password">
            <Button variant="primary" className="w-full">Olvidé mi contraseña</Button>
          </Link>
        }
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-success-500"
        title="¡Contraseña actualizada!"
        body="Tu contraseña ha sido cambiada. En unos segundos te redirigimos al inicio de sesión."
        action={
          <Button variant="primary" className="w-full" onClick={() => navigate('/login', { replace: true })}>
            Iniciar sesión
          </Button>
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
      <div className="rounded-2xl border border-surface-border bg-surface-soft p-8 space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-ink mb-1">Nueva contraseña</h1>
          <p className="text-sm text-ink-soft">Para <span className="font-medium text-ink">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500 pr-11"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          {fieldError && (
            <p className="text-xs text-danger-500">{fieldError}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Cambiar contraseña'}
          </Button>
        </form>
      </div>
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
        iconClass="text-brand-500 animate-spin"
        title="Recuperando correo…"
        body=""
      />
    )
  }

  if (status === 'success') {
    return (
      <StatusCard
        icon={CheckCircle}
        iconClass="text-success-500"
        title="Correo recuperado"
        body="Tu dirección de correo anterior ha sido restaurada. Revisa tu bandeja para más información."
        action={
          <Link to="/login">
            <Button variant="primary" className="w-full">Iniciar sesión</Button>
          </Link>
        }
      />
    )
  }

  return (
    <StatusCard
      icon={XCircle}
      iconClass="text-danger-500"
      title="Enlace inválido"
      body="El enlace ya fue usado o expiró."
      action={
        <Link to="/">
          <Button variant="primary" className="w-full">Ir a inicio</Button>
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
          iconClass="text-danger-500"
          title="Enlace inválido"
          body="Este enlace no es válido. Pide uno nuevo desde la aplicación."
          action={
            <Link to="/">
              <Button variant="primary" className="w-full">Ir a inicio</Button>
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
            iconClass="text-danger-500"
            title="Acción desconocida"
            body="Este tipo de enlace no está soportado."
            action={
              <Link to="/">
                <Button variant="primary" className="w-full">Ir a inicio</Button>
              </Link>
            }
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <SEOHead title="CertZen" description="" path="/auth/action" noindex />
      {renderHandler()}
    </div>
  )
}
