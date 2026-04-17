import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle, Sparkles, Calendar, CreditCard, ArrowRight } from 'lucide-react'
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

export function PaymentSuccessPage() {
  const { user, isPro, subscriptionStatus, subscriptionRenewsAt } = useAuthStore()
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)

  // Manual sync — fallback if webhook hasn't arrived yet (eventual consistency)
  useEffect(() => {
    if (!user || isPro) return
    let cancelled = false
    const trySync = async () => {
      setSyncing(true)
      setSyncError(null)
      try {
        const fns = getFunctions(getApp())
        const sync = httpsCallable(fns, 'syncDodoSubscription')
        await sync({})
      } catch (err) {
        if (!cancelled) setSyncError(err.message || 'Error al sincronizar')
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }
    // Wait 2s, then sync (gives webhook time to arrive first)
    const t = setTimeout(trySync, 2000)
    return () => { cancelled = true; clearTimeout(t) }
  }, [user, isPro])

  return (
    <AppShell>
      <SEOHead
        title="Pago exitoso"
        description="Tu suscripción Pro está activa."
        path="/payment-success"
      />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-500/10 border border-success-500/30">
            <CheckCircle2 size={40} className="text-success-500" />
          </div>
          <h1 className="text-3xl font-bold text-ink">¡Pago exitoso!</h1>
          <p className="text-ink-soft">
            Gracias por unirte a CertZen Pro.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        >
          <Card>
            <CardBody className="space-y-5 p-6">
              {/* Estado de la cuenta */}
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-soft mb-1">Tu plan</p>
                  <p className="text-xl font-semibold text-ink flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-500" />
                    CertZen Pro
                  </p>
                </div>
                {isPro ? (
                  <Badge variant="success">Activo</Badge>
                ) : syncing ? (
                  <Badge variant="default">
                    <Loader2 size={11} className="animate-spin mr-1" />
                    Sincronizando
                  </Badge>
                ) : (
                  <Badge variant="warning">Procesando</Badge>
                )}
              </div>

              {/* Detalles */}
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

              {/* Mensaje de procesamiento */}
              {!isPro && !syncError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-500/5 border border-brand-500/20">
                  <Loader2 size={14} className="text-brand-500 animate-spin mt-0.5 shrink-0" />
                  <p className="text-xs text-ink-soft">
                    Estamos confirmando tu pago. Esto puede tardar unos segundos.
                    Si después de un minuto no aparece como activo, recarga la página.
                  </p>
                </div>
              )}

              {syncError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning-500/5 border border-warning-500/20">
                  <AlertCircle size={14} className="text-warning-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-ink">No pudimos sincronizar automáticamente.</p>
                    <p className="text-xs text-ink-soft mt-1">
                      Tu pago se procesó correctamente. Si tu plan no aparece como Pro en unos minutos, contáctanos en{' '}
                      <a href="mailto:hola@certzen.app" className="text-brand-500 underline">hola@certzen.app</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
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
