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
    if (isPro) return

    let cancelled = false
    const MAX_ATTEMPTS = 6
    const RETRY_DELAY_MS = 2500

    const verify = async () => {
      // Small initial delay to let webhook arrive first
      await new Promise((r) => setTimeout(r, 1500))
      if (cancelled) return

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        if (cancelled) return

        // Check if webhook already updated Firestore (fastest path)
        await refreshProfile()
        if (cancelled) return
        if (useAuthStore.getState().isPro) {
          setStatus('verified')
          return
        }

        // Try manual sync with Dodo API
        try {
          const fns = getFunctions(getApp())
          const sync = httpsCallable(fns, 'syncDodoSubscription')
          const result = await sync({})
          if (cancelled) return
          const data = result?.data ?? {}
          if (data.synced) {
            await refreshProfile()
            if (!cancelled) setStatus('verified')
            return
          }
        } catch (err) {
          if (cancelled) return
          // On final attempt show error
          if (attempt === MAX_ATTEMPTS - 1) {
            setErrorMsg(err?.message || 'Error al verificar el pago')
            setStatus('error')
            return
          }
        }

        // Wait before next retry (skip delay on last attempt)
        if (attempt < MAX_ATTEMPTS - 1) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
        }
      }

      // All attempts exhausted without an active subscription
      if (!cancelled) setStatus('not_found')
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zen-warning/10 border border-zen-warning/30">
              <ShieldAlert size={40} className="text-amber-600 dark:text-zen-warning" />
            </div>
            <h1 className="text-3xl font-bold">No encontramos un pago activo</h1>
            <p className="text-zen-ink/60 dark:text-white/60">
              Esta página solo es accesible después de completar un pago.
            </p>
          </motion.div>

          <Card>
            <CardBody className="p-6 space-y-4">
              <p className="text-sm text-zen-ink/60 dark:text-white/60">
                Si acabas de completar el pago, espera unos segundos y recarga la página.
                Si crees que esto es un error, contáctanos en{' '}
                <a href="mailto:hola@certzen.app" className="text-zen underline">hola@certzen.app</a>.
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zen/10 border border-zen/30">
              <Loader2 size={40} className="text-zen animate-spin" />
            </div>
            <h1 className="text-2xl font-bold">Verificando tu pago…</h1>
            <p className="text-zen-ink/60 dark:text-white/60 text-sm">
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zen-success/10 border border-zen-success/30">
            <CheckCircle2 size={40} className="text-emerald-600 dark:text-zen-success" />
          </div>
          <h1 className="text-3xl font-bold">¡Pago exitoso!</h1>
          <p className="text-zen-ink/60 dark:text-white/60">Gracias por unirte a CertZen Pro.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <Card>
            <CardBody className="space-y-5 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-glass-light-border dark:border-glass-dark-border">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zen-ink/60 dark:text-white/60 mb-1">Tu plan</p>
                  <p className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles size={18} className="text-zen" />
                    CertZen Pro
                  </p>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CreditCard size={16} className="text-zen-ink/60 dark:text-white/60 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-zen-ink/60 dark:text-white/60">Email de facturación</p>
                    <p className="text-sm">{user?.email ?? '—'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar size={16} className="text-zen-ink/60 dark:text-white/60 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-zen-ink/60 dark:text-white/60">Próxima renovación</p>
                    <p className="text-sm">{formatDate(subscriptionRenewsAt)}</p>
                  </div>
                </div>

                {subscriptionStatus && (
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-zen-ink/60 dark:text-white/60 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-zen-ink/60 dark:text-white/60">Estado de la suscripción</p>
                      <p className="text-sm capitalize">{subscriptionStatus}</p>
                    </div>
                  </div>
                )}
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-zen-warning/5 border border-zen-warning/20">
                  <AlertCircle size={14} className="text-amber-600 dark:text-zen-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs">No pudimos confirmar la sincronización automática.</p>
                    <p className="text-xs text-zen-ink/60 dark:text-white/60 mt-1">
                      {errorMsg}. Si tu plan no aparece como Pro en unos minutos, contáctanos en{' '}
                      <a href="mailto:hola@certzen.app" className="text-zen underline">hola@certzen.app</a>.
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
          className="text-center text-xs text-zen-ink/60 dark:text-white/60 mt-6"
        >
          Recibirás un email de confirmación con tu recibo en{' '}
          <span>{user?.email ?? 'tu correo'}</span>.
        </motion.p>
      </div>
    </AppShell>
  )
}
