import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle, Sparkles, Calendar, CreditCard, ArrowRight, ShieldAlert } from 'lucide-react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'
import { Card, CardBody } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { AppShell } from '../../../components/layout/AppShell'
import { SEOHead } from '../../../components/SEOHead'
import { useAuthStore } from '../../../core/store/useAuthStore'

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = typeof iso === 'string' ? new Date(iso) : iso.toDate ? iso.toDate() : new Date(iso)
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
  } catch {
    return '—'
  }
}

// Possible verification states:
// 'verifying' → calling sync (initial)
// 'verified'  → user has active subscription (success view)
// 'not_found' → no active subscription found in Dodo (exploit-prevention)
// 'error'     → sync failed but user IS already Pro (still show success) OR network error
export function PaymentSuccessPage() {
  const { user, isPro, subscriptionStatus, subscriptionRenewsAt, refreshProfile } = useAuthStore()
  const [status, setStatus] = useState(isPro ? 'verified' : 'verifying')
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    // If user is already Pro from store hydration, no sync needed
    // (initial useState already set status to 'verified')
    if (isPro) return

    let cancelled = false
    const verify = async () => {
      // Small delay to let webhook arrive first if it's going to
      await new Promise((r) => setTimeout(r, 1500))
      if (cancelled) return
      try {
        const fns = getFunctions(getApp())
        const sync = httpsCallable(fns, 'syncDodoSubscription')
        const result = await sync({})
        if (cancelled) return
        const data = result?.data ?? {}
        if (data.synced) {
          // Re-pull profile so UI updates reactively (plan, isPro, renewsAt)
          await refreshProfile()
          if (!cancelled) setStatus('verified')
        } else {
          // No active subscription found in Dodo → block exploit
          setStatus('not_found')
        }
      } catch (err) {
        if (cancelled) return
        setErrorMsg(err?.message || 'Error al verificar el pago')
        setStatus('error')
      }
    }
    verify()
    return () => { cancelled = true }
  }, [isPro, refreshProfile])

  // Must be logged in to access (defense in depth — ProtectedRoute also enforces)
  if (!user) return <Navigate to="/login" replace />

  // ───────────────────────── NOT FOUND (exploit prevention) ─────────────────────────
  if (status === 'not_found') {
    return (
      <AppShell>
        <SEOHead title="Verificación de pago" description="No encontramos un pago activo." path="/payment-success" noindex />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-warning-500/10 border border-warning-500/30">
              <ShieldAlert size={40} className="text-warning-600" />
            </div>
            <h1 className="text-3xl font-bold text-ink">No encontramos un pago activo</h1>
            <p className="text-ink-soft">
              Esta página solo es accesible después de completar un pago.
            </p>
          </motion.div>

          <Card>
            <CardBody className="p-6 space-y-4">
              <p className="text-sm text-ink-soft">
                Si acabas de completar el pago, espera unos segundos y recarga la página.
                Si crees que esto es un error, contáctanos en{' '}
                <a href="mailto:hola@certzen.app" className="text-brand-500 underline">hola@certzen.app</a>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to="/pricing">
                  <Button variant="primary" className="w-full">
                    Ver planes
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Ir al dashboard
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </AppShell>
    )
  }

  // ───────────────────────── VERIFYING ─────────────────────────
  if (status === 'verifying') {
    return (
      <AppShell>
        <SEOHead title="Verificando pago" description="Estamos confirmando tu pago." path="/payment-success" noindex />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/30">
              <Loader2 size={40} className="text-brand-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-ink">Verificando tu pago…</h1>
            <p className="text-ink-soft text-sm">
              Esto puede tardar unos segundos. No cierres esta ventana.
            </p>
          </motion.div>
        </div>
      </AppShell>
    )
  }

  // ───────────────────────── VERIFIED / ERROR (still show but flag) ─────────────────────────
  return (
    <AppShell>
      <SEOHead title="Pago exitoso" description="Tu suscripción Pro está activa." path="/payment-success" />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-500/10 border border-success-500/30">
            <CheckCircle2 size={40} className="text-success-500" />
          </div>
          <h1 className="text-3xl font-bold text-ink">¡Pago exitoso!</h1>
          <p className="text-ink-soft">Gracias por unirte a CertZen Pro.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <Card>
            <CardBody className="space-y-5 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-soft mb-1">Tu plan</p>
                  <p className="text-xl font-semibold text-ink flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-500" />
                    CertZen Pro
                  </p>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard size={16} className="text-ink-soft mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-ink-soft">Email de facturación</p>
                    <p className="text-sm text-ink">{user?.email ?? '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-ink-soft mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-ink-soft">Próxima renovación</p>
                    <p className="text-sm text-ink">{formatDate(subscriptionRenewsAt)}</p>
                  </div>
                </div>

                {subscriptionStatus && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-ink-soft mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-ink-soft">Estado de la suscripción</p>
                      <p className="text-sm text-ink capitalize">{subscriptionStatus}</p>
                    </div>
                  </div>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning-500/5 border border-warning-500/20">
                  <AlertCircle size={14} className="text-warning-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-ink">No pudimos confirmar la sincronización automática.</p>
                    <p className="text-xs text-ink-soft mt-1">
                      {errorMsg}. Si tu plan no aparece como Pro en unos minutos, contáctanos en{' '}
                      <a href="mailto:hola@certzen.app" className="text-brand-500 underline">hola@certzen.app</a>.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link to="/dashboard">
                  <Button variant="primary" className="w-full">
                    Ir a mi dashboard
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full">
                    Ver mi plan
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center text-xs text-ink-soft mt-6"
        >
          Recibirás un email de confirmación con tu recibo en{' '}
          <span className="text-ink">{user?.email ?? 'tu correo'}</span>.
        </motion.p>
      </div>
    </AppShell>
  )
}
