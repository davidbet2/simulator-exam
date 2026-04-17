import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { Trophy, Clock, Target, ChevronRight, BookOpen, Plus } from 'lucide-react'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { db } from '../../../core/firebase/firebase'
import { AppShell } from '../../../components/layout/AppShell'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Trans, useLingui } from '@lingui/react/macro'
import { SEOHead } from '../../../components/SEOHead'
import { AdBanner } from '../../ads/components/AdBanner'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-ink">{value}</p>
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
    </Card>
  )
}

function AttemptRow({ attempt }) {
  const pct = Math.round((attempt.score / attempt.total) * 100)
  const passed = pct >= (attempt.passPercent ?? 72)
  const date = attempt.createdAt?.toDate?.()
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{attempt.certTitle ?? attempt.certId}</p>
        <p className="text-xs text-ink-soft">
          {date ? date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </p>
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <span className="text-sm font-semibold text-ink">{pct}%</span>
        <Badge variant={passed ? 'success' : 'danger'}>{passed ? <Trans>Aprobado</Trans> : <Trans>No aprobado</Trans>}</Badge>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user, displayName, isPro, plan } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useLingui()
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    const q = query(
      collection(db, 'attempts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    getDocs(q).then((snap) => {
      setAttempts(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user, navigate])

  const total     = attempts.length
  const passed    = attempts.filter((a) => Math.round((a.score / a.total) * 100) >= (a.passPercent ?? 72)).length
  const avgScore  = total ? Math.round(attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0) / total) : 0

  return (
    <AppShell>
      <SEOHead title={t`Dashboard`} description={t`Tu panel con historial de exámenes y progreso.`} path="/dashboard" noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-ink">
            <Trans>Hola, {displayName} 👋</Trans>
          </h1>
          <p className="text-ink-soft mt-1">
            <Trans>Plan:</Trans> <span className="font-medium text-ink-soft capitalize">{plan}</span>
            {!isPro && (
              <>
                {' · '}
                <Link to="/pricing" className="text-brand-600 hover:text-brand-700">
                  <Trans>Actualizar a Pro</Trans>
                </Link>
              </>
            )}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          <StatCard icon={BookOpen} label={t`Exámenes tomados`} value={total} color="bg-brand-500" />
          <StatCard icon={Trophy}   label={t`Aprobados`}        value={passed} color="bg-success-500" />
          <StatCard icon={Target}   label={t`Promedio`}         value={`${avgScore}%`} color="bg-warning-500" />
        </motion.div>

        <AdBanner
          keywords="certification|developer|appian|cloud"
          placementId="dashboard-main"
        />

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3"
        >
          <Button onClick={() => navigate('/')} variant="primary">
            <ChevronRight size={16} />
            <Trans>Tomar examen</Trans>
          </Button>
          <Button onClick={() => navigate('/explore')} variant="secondary">
            <BookOpen size={16} />
            <Trans>Explorar sets</Trans>
          </Button>
          <Button onClick={() => navigate('/create-exam')} variant="ghost">
            <Plus size={16} />
            <Trans>Crear set</Trans>
          </Button>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                <Clock size={16} className="text-brand-600" />
                <Trans>Historial de intentos</Trans>
              </h2>
            </CardHeader>
            <CardBody>
              {loading ? (
                <p className="text-sm text-ink-soft text-center py-4"><Trans>Cargando…</Trans></p>
              ) : attempts.length === 0 ? (
                <p className="text-sm text-ink-soft text-center py-4">
                  <Trans>Aún no has tomado ningún examen.</Trans>{' '}
                  <Link to="/" className="text-brand-600 hover:text-brand-700"><Trans>¡Empieza ahora!</Trans></Link>
                </p>
              ) : (
                attempts.map((a) => <AttemptRow key={a.id} attempt={a} />)
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  )
}
