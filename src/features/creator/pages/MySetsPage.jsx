import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { collection, query, where, orderBy, limit, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Plus, Pencil, Trash2, BookOpen, Loader2, Users } from 'lucide-react'
import { Trans, useLingui } from '@lingui/react/macro'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { db } from '../../../core/firebase/firebase'
import { AppShell } from '../../../components/layout/AppShell'
import { Card, CardBody } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { SEOHead } from '../../../components/SEOHead'
import { AdBanner } from '../../ads/components/AdBanner'

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

  return (
    <AppShell>
      <SEOHead title={t`Mis sets`} description={t`Sets de examen que has creado.`} path="/my-sets" noindex />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink"><Trans>Mis sets</Trans></h1>
            <p className="text-ink-soft text-sm mt-1"><Trans>Sets de examen que has creado.</Trans></p>
          </div>
          <Button onClick={() => navigate('/create-exam')}>
            <Plus size={16} /><Trans>Crear set</Trans>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-brand-500" />
          </div>
        ) : sets.length === 0 ? (
          <div className="text-center py-16 space-y-4 border-2 border-dashed border-surface-border rounded-2xl">
            <BookOpen size={40} className="text-ink-muted mx-auto" />
            <p className="text-ink-soft"><Trans>Aún no has creado ningún set.</Trans></p>
            <Button onClick={() => navigate('/create-exam')} variant="secondary" size="sm">
              <Plus size={14} /><Trans>Crear mi primer set</Trans>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sets.map((s) => (
              <Card key={s.id}>
                <CardBody className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/exam-sets/${s.id}`}
                        className="font-semibold text-ink hover:text-brand-600 transition-colors truncate block"
                      >
                        {s.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-ink-muted flex-wrap">
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} />{s.questionCount ?? 0} <Trans>preguntas</Trans>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={11} />{s.attempts ?? 0} <Trans>intentos</Trans>
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                          s.published
                            ? 'bg-success-50 text-success-700 border-success-200'
                            : 'bg-surface-muted text-ink-muted border-surface-border'
                        }`}>
                          {s.published ? t`Publicado` : t`Borrador`}
                        </span>
                      </div>
                      {s.description && (
                        <p className="text-xs text-ink-soft mt-1.5 line-clamp-1">{s.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/edit-exam/${s.id}`)}
                      >
                        <Pencil size={13} /><Trans>Editar</Trans>
                      </Button>

                      {confirmId === s.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDelete(s.id)}
                            disabled={deletingId === s.id}
                            className="px-3 py-1.5 bg-danger-500 hover:bg-danger-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {deletingId === s.id
                              ? <Loader2 size={12} className="animate-spin" />
                              : <Trans>Confirmar</Trans>
                            }
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-3 py-1.5 border border-surface-border text-ink-soft text-xs font-semibold rounded-lg hover:bg-surface-muted transition-colors"
                          >
                            <Trans>Cancelar</Trans>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(s.id)}
                          className="p-2 text-ink-muted hover:text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                          aria-label={t`Eliminar`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <AdBanner
          placementId="my-sets-bottom"
          adSlot={import.meta.env.VITE_ADSENSE_SLOT}
          className="mt-4"
        />
      </div>
    </AppShell>
  )
}
