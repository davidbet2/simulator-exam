import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Building2, Loader2 } from 'lucide-react'
import { Trans, useLingui } from '@lingui/react/macro'
import { createCheckoutSession } from '@invertase/firestore-stripe-payments'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { AppShell } from '../../../components/layout/AppShell'
import { SEOHead } from '../../../components/SEOHead'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { payments } from '../../../core/stripe/stripePayments'

const FREE_FEATURES = [
  '3 exámenes por mes',
  'Acceso a certificaciones oficiales',
  'Resultados básicos',
  'Modo estudio',
]

const PRO_FEATURES = [
  'Exámenes ilimitados',
  'Historial completo de intentos',
  'Análisis por dominio y categoría',
  'Crea y comparte tus propios sets',
  'Acceso anticipado a nuevas certs',
  'Sin anuncios',
]

function PlanCard({ title, price, period, badge, features, cta, onClick, highlighted }) {
  return (
    <Card className={highlighted ? 'border-brand-500 ring-1 ring-brand-500/50' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          {badge && <Badge variant={highlighted ? 'brand' : 'default'}>{badge}</Badge>}
        </div>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-ink">{price}</span>
          {period && <span className="text-ink-soft text-sm mb-1">/{period}</span>}
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <ul className="space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <Check size={15} className="text-success-500 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <Button
          variant={highlighted ? 'primary' : 'outline'}
          className="w-full"
          onClick={onClick}
        >
          {cta}
        </Button>
      </CardBody>
    </Card>
  )
}

export function PricingPage() {
  const { t } = useLingui()
  const { isPro } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const FREE_FEATURES_I18N = [
    t`3 exámenes por mes`,
    t`Acceso a certificaciones oficiales`,
    t`Resultados básicos`,
    t`Modo estudio`,
  ]
  const PRO_FEATURES_I18N = [
    t`Exámenes ilimitados`,
    t`Historial completo de intentos`,
    t`Análisis por dominio y categoría`,
    t`Crea y comparte tus propios sets`,
    t`Acceso anticipado a nuevas certs`,
    t`Sin anuncios`,
  ]

  const handleUpgrade = async () => {
    const priceId = import.meta.env.VITE_STRIPE_PRO_PRICE_ID
    if (!priceId) {
      window.open('https://buy.stripe.com/placeholder', '_blank', 'noopener,noreferrer')
      return
    }
    try {
      setLoading(true)
      setError(null)
      const session = await createCheckoutSession(payments, {
        price: priceId,
        success_url: `${window.location.origin}/pricing?success=true`,
        cancel_url: `${window.location.origin}/pricing`,
      })
      window.location.assign(session.url)
    } catch (err) {
      console.error('Checkout error', err)
      setError(t`No se pudo iniciar el pago. Intenta de nuevo.`)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      setLoading(true)
      setError(null)
      const functions = getFunctions(getApp())
      const portalLinkFn = httpsCallable(functions, 'ext-firestore-stripe-payments-createPortalLink')
      const { data } = await portalLinkFn({
        returnUrl: `${window.location.origin}/pricing`,
      })
      window.location.assign(data.url)
    } catch (err) {
      console.error('Portal error', err)
      setError(t`No se pudo abrir el portal de suscripción.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <SEOHead
        title={t`Planes y precios`}
        description={t`Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado.`}
        path="/pricing"
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <Badge variant="brand"><Zap size={11} /><Trans>Planes CertZen</Trans></Badge>
          <h1 className="text-3xl font-bold text-ink">
            <Trans>Elige el plan que te lleva a la certificación</Trans>
          </h1>
          <p className="text-ink-soft max-w-lg mx-auto">
            <Trans>Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado.</Trans>
          </p>
        </motion.div>

        {error && (
          <p className="text-center text-sm text-error-600 bg-error-50 rounded-lg py-2 px-4 max-w-sm mx-auto">
            {error}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <PlanCard
            title={t`Free`}
            price="$0"
            badge={t`Gratis`}
            features={FREE_FEATURES_I18N}
            cta={isPro ? t`Plan básico` : t`Tu plan actual`}
            onClick={() => {}}
          />
          <PlanCard
            title={t`Pro`}
            price="$9.99"
            period={t`mes`}
            badge={<><Star size={10} /> <Trans>Recomendado</Trans></>}
            features={PRO_FEATURES_I18N}
            cta={
              loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /><Trans>Procesando...</Trans></span>
                : isPro
                ? t`Administrar suscripción`
                : t`Actualizar a Pro →`
            }
            onClick={isPro ? handleManageSubscription : handleUpgrade}
            highlighted
          />
        </motion.div>

        {isPro && (
          <p className="text-center text-sm text-success-600">
            <Trans>✓ Eres usuario Pro — gracias por tu apoyo.</Trans>
          </p>
        )}
      </div>
    </AppShell>
  )
}
