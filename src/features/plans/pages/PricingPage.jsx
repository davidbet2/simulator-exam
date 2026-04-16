import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Zap, Star, Building2 } from 'lucide-react'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'

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
  // Stripe checkout would redirect to a Stripe payment link / session
  const handleUpgrade = () => {
    // TODO: integrate Firebase Extension "Run Payments with Stripe"
    // For now, open a placeholder
    window.open('https://buy.stripe.com/placeholder', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border bg-surface-soft/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            CertZen
          </Link>
          <Link to="/" className="text-sm text-ink-soft hover:text-ink">← Volver</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <Badge variant="brand"><Zap size={11} />Planes CertZen</Badge>
          <h1 className="text-3xl font-bold text-ink">
            Elige el plan que te lleva a la certificación
          </h1>
          <p className="text-ink-soft max-w-lg mx-auto">
            Empieza gratis. Actualiza cuando necesites más intentos o análisis avanzado.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          <PlanCard
            title="Free"
            price="$0"
            badge="Gratis"
            features={FREE_FEATURES}
            cta="Tu plan actual"
            onClick={() => {}}
          />
          <PlanCard
            title="Pro"
            price="$15"
            period="mes"
            badge={<><Star size={10} /> Recomendado</>}
            features={PRO_FEATURES}
            cta="Actualizar a Pro →"
            onClick={handleUpgrade}
            highlighted
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border-slate-600">
            <CardBody className="flex items-center gap-4 p-5">
              <div className="rounded-xl bg-surface-muted p-3 shrink-0">
                <Building2 size={20} className="text-ink-soft" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-ink">Empresas y equipos</h3>
                <p className="text-sm text-ink-soft mt-0.5">
                  Planes B2B con acceso para múltiples empleados, reportes y certificaciones personalizadas.
                </p>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                Contactar
              </Button>
            </CardBody>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
