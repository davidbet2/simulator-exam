import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Loader2 } from 'lucide-react'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getApp } from 'firebase/app'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassBadge } from '../../../components/glass/GlassBadge'
import { GlassButton } from '../../../components/glass/GlassButton'
import { AppShell } from '../../../components/layout/AppShell'
import { PublicLayout } from '../../../components/layout/PublicLayout'
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
    <GlassCard className={`p-6 ${highlighted ? '!border-zen ring-1 ring-zen/50 shadow-zen' : ''}`}>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {badge && <GlassBadge tone={highlighted ? 'brand' : 'neutral'}>{badge}</GlassBadge>}
      </div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-extrabold">{price}</span>
        {period && <span className="mb-1 text-sm text-zen-ink/60 dark:text-white/50">/{period}</span>}
      </div>
      <div className="mt-5 space-y-4">
        <ul className="space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-zen-ink/70 dark:text-white/60">
              <Check size={15} className="mt-0.5 shrink-0 text-zen dark:text-indigo-300" />
              {f}
            </li>
          ))}
        </ul>
        <GlassButton
          variant={highlighted ? 'primary' : 'secondary'}
          className="w-full"
          onClick={onClick}
        >
          {cta}
        </GlassButton>
      </div>
    </GlassCard>
  )
}

export function PricingPage() {
  const { user, isPro } = useAuthStore()
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

  const Shell = user ? AppShell : PublicLayout

  return (
    <Shell>
      <SEOHead
        title="Planes y precios"
        description="Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado."
        path="/pricing"
      />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="space-y-3 text-center"
        >
          <GlassBadge tone="brand" className="border border-zen/20"><Zap size={11} /> Planes CertZen</GlassBadge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Elige el plan que te lleva a la certificación
          </h1>
          <p className="mx-auto max-w-lg text-zen-ink/70 dark:text-white/60">
            Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado.
          </p>
        </motion.div>

        {error && (
          <p className="mx-auto max-w-sm rounded-zen border border-zen-danger/30 bg-zen-danger/10 px-4 py-2 text-center text-sm text-zen-danger">
            {error}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mx-auto grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2"
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
          <p className="text-center text-sm text-emerald-600 dark:text-zen-success">
            ✓ Eres usuario Pro — gracias por tu apoyo.
          </p>
        )}
      </div>
    </Shell>
  )
}
