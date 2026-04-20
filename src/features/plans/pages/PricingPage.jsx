import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Loader2 } from 'lucide-react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { AppShell } from '../../../components/layout/AppShell'
import { SEOHead } from '../../../components/SEOHead'
import { useAuthStore } from '../../../core/store/useAuthStore'

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
  const { isPro } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Ask Cloud Function to create a Dodo checkout session
      const fns       = getFunctions(getApp())
      const createCheckout = httpsCallable(fns, 'createDodoCheckout')
      const { data } = await createCheckout({
        productId: import.meta.env.VITE_DODO_PRO_PRODUCT_ID,
      })

      if (!data?.checkoutUrl) throw new Error('No checkout URL returned')

      // 2. Initialize Dodo SDK then open overlay
      const { DodoPayments } = await import('dodopayments-checkout')
      DodoPayments.Initialize({
        mode: import.meta.env.PROD ? 'live' : 'test',
        displayType: 'overlay',
        onEvent: (event) => {
          if (event?.event_type === 'checkout.closed') setLoading(false)
          if (event?.event_type === 'checkout.redirect') {
            window.location.reload()
          }
        },
      })
      DodoPayments.Checkout.open({
        checkoutUrl: data.checkoutUrl,
      })
    } catch (err) {
      console.error('Checkout error', err)
      setError('No se pudo iniciar el pago. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const handleManageSubscription = () => {
    navigate('/profile')
  }

  return (
    <AppShell>
      <SEOHead
        title="Planes y precios"
        description="Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado."
        path="/pricing"
      />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <Badge variant="brand"><Zap size={11} /> Planes CertZen</Badge>
          <h1 className="text-3xl font-bold text-ink">
            Elige el plan que te lleva a la certificación
          </h1>
          <p className="text-ink-soft max-w-lg mx-auto">
            Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado.
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
            title="Free"
            price="$0"
            badge="Gratis"
            features={FREE_FEATURES}
            cta={isPro ? 'Plan básico' : 'Tu plan actual'}
            onClick={() => {}}
          />
          <PlanCard
            title="Pro"
            price="$9.99"
            period="mes"
            badge={<><Star size={10} /> Recomendado</>}
            features={PRO_FEATURES}
            cta={
              loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 size={14} className="animate-spin" /> Procesando...</span>
                : isPro
                ? 'Administrar suscripción'
                : 'Actualizar a Pro →'
            }
            onClick={isPro ? handleManageSubscription : handleUpgrade}
            highlighted
          />
        </motion.div>

        {isPro && (
          <p className="text-center text-sm text-success-600">
            ✓ Eres usuario Pro — gracias por tu apoyo.
          </p>
        )}
      </div>
    </AppShell>
  )
}
