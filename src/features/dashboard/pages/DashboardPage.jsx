import { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore'
import { Bookmark, Clock3, ChevronRight, BookOpen, ClipboardCheck, Star } from 'lucide-react'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { db } from '../../../core/firebase/firebase'
import { AppShell } from '../../../components/layout/AppShell'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassBadge } from '../../../components/glass/GlassBadge'
import { getDomain } from '../../../core/constants/domains'
import { Trans, useLingui } from '@lingui/react/macro'
import { SEOHead } from '../../../components/SEOHead'

const FILTERS = ['all', 'favorites', 'completed']

// ── Set card (saved sets) ──────────────────────────────────────────────────
function SetCard({ set }) {
  const domain = getDomain(set.domain)
  const ratingCount = set.ratingCount ?? 0
  const ratingAvg = ratingCount > 0 ? (set.ratingSum ?? 0) / ratingCount : 0
  return (
    <Link to={`/exam-sets/${set.id}`} className="block h-full">
      <GlassCard className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-zen/40">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-lg dark:bg-zen/25" aria-hidden>
            {domain.icon}
          </span>
          {set.official && <GlassBadge tone="warning"><Trans>Oficial</Trans></GlassBadge>}
        </div>
        <div className="mt-auto">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/40 mb-1">
            {domain.label}
          </p>
          <h3 className="text-sm font-bold text-zen-ink dark:text-white leading-snug line-clamp-2">
            {set.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-zen-ink/50 dark:text-white/40">
            <span className="inline-flex items-center gap-1"><BookOpen size={12} />{set.questionCount ?? '?'}</span>
            {ratingCount > 0 && (
              <span className="inline-flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500" />{ratingAvg.toFixed(1)}</span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ── Activity row ────────────────────────────────────────────────────────────
function AttemptRow({ attempt }) {
  const pct = Math.round((attempt.score / attempt.total) * 100)
  const passed = pct >= (attempt.passPercent ?? 72)
  const date = attempt.createdAt?.toDate?.()
  return (
    <div className="flex items-center gap-3 py-3 px-2 sm:px-3 border-b border-glass-light-border dark:border-glass-dark-border last:border-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300" aria-hidden>
        <ClipboardCheck size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zen-ink dark:text-white truncate">{attempt.certTitle ?? attempt.certId}</p>
        <p className="text-xs text-zen-ink/50 dark:text-white/50">
          {date ? date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
          {' · '}<Trans>{attempt.total} preguntas</Trans>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <GlassBadge tone={passed ? 'success' : 'danger'}>{pct}%</GlassBadge>
        <ChevronRight size={16} className="text-zen-ink/30 dark:text-white/30" />
      </div>
    </div>
  )
}

function SectionHeader({ title, icon: Icon, cta }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-lg font-bold text-zen-ink dark:text-white flex items-center gap-2">
        {Icon && <Icon size={18} className="text-zen dark:text-indigo-300" />}
        {title}
      </h2>
      {cta}
    </div>
  )
}

export function DashboardPage() {
  const { user, plan, isPro } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useLingui()
  const [attempts, setAttempts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    let cancelled = false
    ;(async () => {
      try {
        const attSnap = await getDocs(query(
          collection(db, 'attempts'),
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20),
        ))
        if (!cancelled) setAttempts(attSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

        const favSnap = await getDocs(collection(db, 'users', user.uid, 'favorites'))
        const favSlugs = favSnap.docs.map((d) => d.id)
        const favSets = await Promise.all(
          favSlugs.slice(0, 6).map(async (slug) => {
            const snap = await getDoc(doc(db, 'examSets', slug))
            return snap.exists() ? { id: snap.id, ...snap.data() } : null
          }),
        )
        if (!cancelled) setFavorites(favSets.filter(Boolean))
      } catch (err) {
        if (err.code === 'failed-precondition') {
          console.info('[Dashboard] index still building, will resolve automatically')
        } else {
          console.error('[Dashboard] load failed:', err)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [user, navigate])

  const completedAttempts = useMemo(
    () => attempts.filter((a) => Math.round((a.score / a.total) * 100) >= (a.passPercent ?? 72)),
    [attempts],
  )

  const showFavorites = filter === 'all' || filter === 'favorites'
  const showActivity = filter === 'all' || filter === 'completed'
  const activityList = filter === 'completed' ? completedAttempts : attempts

  const FILTER_LABELS = {
    all: t`Todos`,
    favorites: t`Favoritos`,
    completed: t`Completados`,
  }

  return (
    <AppShell>
      <SEOHead title={t`Tu biblioteca`} description={t`Tus sets guardados y tu actividad reciente.`} path="/dashboard" noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <h1 className="text-2xl font-bold text-zen-ink dark:text-white"><Trans>Tu biblioteca</Trans></h1>
            <p className="text-xs text-zen-ink/50 dark:text-white/50 mt-1">
              <Trans>Plan:</Trans> <span className="font-medium capitalize">{plan}</span>
              {!isPro && (
                <>
                  {' · '}
                  <Link to="/pricing" className="text-zen dark:text-indigo-300 hover:underline">
                    <Trans>Actualizar a Pro</Trans>
                  </Link>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-zen text-white shadow-zen'
                    : 'bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border text-zen-ink/70 dark:text-white/70 hover:text-zen-ink dark:hover:text-white'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-glass-light-2 dark:bg-glass-dark-2 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {showFavorites && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <SectionHeader title={<Trans>Tus sets guardados</Trans>} icon={Bookmark} />
                {favorites.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <Bookmark size={32} className="text-zen-ink/30 dark:text-white/30 mx-auto mb-2" />
                    <p className="text-sm text-zen-ink/60 dark:text-white/60">
                      <Trans>Aún no has guardado ningún set.</Trans>{' '}
                      <Link to="/explore" className="text-zen dark:text-indigo-300 hover:underline"><Trans>Explorar sets</Trans></Link>
                    </p>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((s) => <SetCard key={s.id} set={s} />)}
                  </div>
                )}
              </motion.section>
            )}

            {showActivity && (
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <SectionHeader title={<Trans>Actividad reciente</Trans>} icon={Clock3} />
                <GlassCard className="px-2 sm:px-3">
                  {activityList.length === 0 ? (
                    <p className="text-sm text-zen-ink/60 dark:text-white/60 text-center py-6">
                      <Trans>Aún no has tomado ningún examen.</Trans>{' '}
                      <Link to="/" className="text-zen dark:text-indigo-300 hover:underline"><Trans>¡Empieza ahora!</Trans></Link>
                    </p>
                  ) : (
                    activityList.map((a) => <AttemptRow key={a.id} attempt={a} />)
                  )}
                </GlassCard>
              </motion.section>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
