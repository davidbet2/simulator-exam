import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Plus, Pencil, Trash2, BookOpen, Loader2, ChevronRight, Layers, ClipboardList, Globe } from 'lucide-react'
import { Trans, useLingui } from '@lingui/react/macro'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { db } from '../../../core/firebase/firebase'
import { AppShell } from '../../../components/layout/AppShell'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassButton } from '../../../components/glass/GlassButton'
import { GlassBadge } from '../../../components/glass/GlassBadge'
import { getDomain } from '../../../core/constants/domains'
import { SEOHead } from '../../../components/SEOHead'

function timeAgo(date, t) {
  if (!date) return '—'
  const diffMs = Date.now() - date.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return t`justo ahora`
  if (mins < 60) return t`hace ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return t`hace ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 30) return t`hace ${days} d`
  const months = Math.round(days / 30)
  return t`hace ${months} m`
}

function StatPill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border px-3 py-1.5 text-xs font-semibold text-zen-ink dark:text-white">
      <Icon size={13} className="text-zen dark:text-indigo-300" />
      {label}
    </span>
  )
}

function SetRow({ set, onDelete, deleting, confirming, onAskDelete, onCancelDelete }) {
  const { t } = useLingui()
  const domain = getDomain(set.domain)
  const updated = set.updatedAt?.toDate?.() ?? set.createdAt?.toDate?.()

  return (
    <div className="flex items-center gap-3 py-3 px-2 sm:px-3 border-b border-glass-light-border dark:border-glass-dark-border last:border-0">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-lg dark:bg-zen/25" aria-hidden>
        {domain.icon}
      </span>
      <Link to={`/exam-sets/${set.id}`} className="flex-1 min-w-0 group">
        <p className="text-sm font-semibold text-zen-ink dark:text-white truncate group-hover:text-zen dark:group-hover:text-indigo-300 transition-colors">
          {set.title}
        </p>
        <p className="text-xs text-zen-ink/50 dark:text-white/50">
          <Trans>{set.questionCount ?? 0} preguntas</Trans> · <Trans>Editado {timeAgo(updated, t)}</Trans>
        </p>
      </Link>
      <div className="flex items-center gap-1.5 shrink-0">
        <GlassBadge tone={set.published ? 'success' : 'neutral'}>
          {set.published ? t`Publicado` : t`Borrador`}
        </GlassBadge>

        {confirming ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDelete(set.id)}
              disabled={deleting}
              className="px-3 py-1.5 bg-zen-danger hover:brightness-110 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trans>Confirmar</Trans>}
            </button>
            <button
              onClick={onCancelDelete}
              className="px-3 py-1.5 border border-glass-light-border dark:border-glass-dark-border text-zen-ink/70 dark:text-white/70 text-xs font-semibold rounded-lg hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
            >
              <Trans>Cancelar</Trans>
            </button>
          </div>
        ) : (
          <>
            <Link
              to={`/edit-exam/${set.id}`}
              className="h-8 w-8 flex items-center justify-center text-zen-ink/50 dark:text-white/50 hover:text-zen dark:hover:text-indigo-300 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 rounded-lg transition-colors"
              aria-label={t`Editar`}
            >
              <Pencil size={15} />
            </Link>
            <button
              onClick={() => onAskDelete(set.id)}
              className="h-8 w-8 flex items-center justify-center text-zen-ink/50 dark:text-white/50 hover:text-zen-danger hover:bg-zen-danger/10 rounded-lg transition-colors"
              aria-label={t`Eliminar`}
            >
              <Trash2 size={15} />
            </button>
            <Link to={`/exam-sets/${set.id}`} className="h-8 w-8 flex items-center justify-center text-zen-ink/30 dark:text-white/30" aria-hidden tabIndex={-1}>
              <ChevronRight size={16} />
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export function MySetsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useLingui()
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const loadSets = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const q = query(
        collection(db, 'examSets'),
        where('ownerUid', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(50)
      )
      const snap = await getDocs(q)
      setSets(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error('[MySets] load failed:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    loadSets()
  }, [user, navigate, loadSets])

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      const qSnap = await getDocs(collection(db, 'examSets', id, 'questions'))
      await Promise.all(qSnap.docs.map((d) => deleteDoc(d.ref)))
      await deleteDoc(doc(db, 'examSets', id))
      setSets((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error('[MySets] delete failed:', err)
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  const totals = useMemo(() => ({
    created: sets.length,
    questions: sets.reduce((s, set) => s + (set.questionCount ?? 0), 0),
    published: sets.filter((s) => s.published).length,
  }), [sets])

  return (
    <AppShell>
      <SEOHead title={t`Mis sets`} description={t`Sets de examen que has creado.`} path="/my-sets" noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zen-ink dark:text-white"><Trans>Mis sets</Trans></h1>
            <p className="text-zen-ink/60 dark:text-white/60 text-sm mt-1"><Trans>Crea, edita y publica tus propios sets de preguntas.</Trans></p>
          </div>
          <GlassButton onClick={() => navigate('/create-exam')}>
            <Plus size={16} /><Trans>Nuevo set</Trans>
          </GlassButton>
        </div>

        {!loading && sets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <StatPill icon={Layers} label={<Trans>{totals.created} sets creados</Trans>} />
            <StatPill icon={ClipboardList} label={<Trans>{totals.questions} preguntas en total</Trans>} />
            <StatPill icon={Globe} label={<Trans>{totals.published} publicados</Trans>} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-zen" />
          </div>
        ) : sets.length === 0 ? (
          <GlassCard className="text-center py-16 space-y-4 border-dashed">
            <BookOpen size={40} className="text-zen-ink/30 dark:text-white/30 mx-auto" />
            <p className="text-zen-ink/60 dark:text-white/60"><Trans>Aún no has creado ningún set.</Trans></p>
            <GlassButton onClick={() => navigate('/create-exam')} variant="secondary">
              <Plus size={14} /><Trans>Crear mi primer set</Trans>
            </GlassButton>
          </GlassCard>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-zen-ink/70 dark:text-white/60 mb-2 flex items-center gap-2">
              <BookOpen size={15} className="text-zen dark:text-indigo-300" />
              <Trans>Todos tus sets</Trans>
            </h2>
            <GlassCard className="px-2 sm:px-3">
              {sets.map((s) => (
                <SetRow
                  key={s.id}
                  set={s}
                  deleting={deletingId === s.id}
                  confirming={confirmId === s.id}
                  onAskDelete={setConfirmId}
                  onCancelDelete={() => setConfirmId(null)}
                  onDelete={handleDelete}
                />
              ))}
            </GlassCard>
          </div>
        )}
      </div>
    </AppShell>
  )
}
