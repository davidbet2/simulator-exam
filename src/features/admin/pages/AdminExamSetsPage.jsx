import { useCallback, useEffect, useState } from 'react';
import {
  Library, Search, Eye, EyeOff, Trash2, Star, StarOff,
  ChevronRight, Loader2, AlertCircle, User, Calendar, Hash,
} from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAdmin } from '../hooks/useAdmin';
import { useAudit } from '../hooks/useAudit';
import { Modal } from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassInput } from '../../../components/glass/GlassInput';
import { GlassBadge } from '../../../components/glass/GlassBadge';

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ set }) {
  if (set.deleted) return <GlassBadge tone="danger">Eliminado</GlassBadge>;
  if (set.published) return <GlassBadge tone="success">Publicado</GlassBadge>;
  return <GlassBadge tone="neutral">Borrador</GlassBadge>;
}

const FILTERS = [
  { id: 'all',       label: 'Todos' },
  { id: 'published', label: 'Publicados' },
  { id: 'draft',     label: 'Borradores' },
  { id: 'deleted',   label: 'Eliminados' },
];

export function AdminExamSetsPage() {
  const {
    fetchExamSets, fetchExamSetById,
    setExamSetPublished, softDeleteExamSet, setExamSetFeatured,
  } = useAdmin();
  const { logAction } = useAudit();

  const [sets, setSets]           = useState([]);
  const [lastDoc, setLastDoc]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]     = useState(true);
  const [filter, setFilter]       = useState('all'); // all | published | draft | deleted
  const [searchTerm, setSearchTerm] = useState('');

  const [detailSet, setDetailSet] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const { sets: list, lastDoc: last } = await fetchExamSets({ pageSize: 25 });
    setSets(list);
    setLastDoc(last);
    setHasMore(list.length === 25);
    setLoading(false);
  }, [fetchExamSets]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadInitial(); }, [loadInitial]);

  async function loadMore() {
    if (!lastDoc) return;
    setLoadingMore(true);
    const { sets: more, lastDoc: next } = await fetchExamSets({ pageSize: 25, afterDoc: lastDoc });
    setSets((prev) => [...prev, ...more]);
    setLastDoc(next);
    setHasMore(more.length === 25);
    setLoadingMore(false);
  }

  async function openDetail(s) {
    setDetailSet(s);
    setDetailLoading(true);
    setConfirmDelete(false);
    setActionError(null);
    const full = await fetchExamSetById(s.id);
    if (full) setDetailSet(full);
    setDetailLoading(false);
  }

  function closeDetail() {
    setDetailSet(null);
    setConfirmDelete(false);
    setDeleteReason('');
  }

  async function togglePublish() {
    if (!detailSet) return;
    const willPublish = !detailSet.published;
    setActionBusy(true); setActionError(null);
    const ok = await setExamSetPublished(detailSet.id, willPublish);
    if (ok) {
      await logAction({
        action: willPublish ? 'examSet.publish' : 'examSet.unpublish',
        target: 'examSets',
        targetId: detailSet.id,
      });
      setDetailSet((p) => ({ ...p, published: willPublish }));
      setSets((prev) => prev.map((s) => (s.id === detailSet.id ? { ...s, published: willPublish } : s)));
    } else {
      setActionError('No se pudo actualizar el estado.');
    }
    setActionBusy(false);
  }

  async function toggleFeatured() {
    if (!detailSet) return;
    const willFeature = !detailSet.featured;
    setActionBusy(true); setActionError(null);
    const ok = await setExamSetFeatured(detailSet.id, willFeature);
    if (ok) {
      await logAction({
        action: willFeature ? 'examSet.feature' : 'examSet.unfeature',
        target: 'examSets',
        targetId: detailSet.id,
      });
      setDetailSet((p) => ({ ...p, featured: willFeature }));
      setSets((prev) => prev.map((s) => (s.id === detailSet.id ? { ...s, featured: willFeature } : s)));
    } else {
      setActionError('No se pudo actualizar.');
    }
    setActionBusy(false);
  }

  async function confirmSoftDelete() {
    if (!detailSet) return;
    setActionBusy(true); setActionError(null);
    const ok = await softDeleteExamSet(detailSet.id, deleteReason || null);
    if (ok) {
      await logAction({
        action: 'examSet.softDelete',
        target: 'examSets',
        targetId: detailSet.id,
        note: deleteReason || null,
      });
      setDetailSet((p) => ({ ...p, deleted: true, published: false }));
      setSets((prev) => prev.map((s) => (s.id === detailSet.id ? { ...s, deleted: true, published: false } : s)));
      setConfirmDelete(false);
    } else {
      setActionError('No se pudo eliminar.');
    }
    setActionBusy(false);
  }

  // Filter in memory
  const visible = sets.filter((s) => {
    if (filter === 'published' && !(s.published && !s.deleted)) return false;
    if (filter === 'draft'     && (s.published || s.deleted))    return false;
    if (filter === 'deleted'   && !s.deleted)                    return false;
    if (searchTerm) {
      const haystack = `${s.title ?? ''} ${s.description ?? ''} ${s.ownerEmail ?? ''}`.toLowerCase();
      if (!haystack.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <AdminShell
      title="Sets comunidad"
      subtitle="Modera los sets públicos publicados por la comunidad."
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={[
              'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.id
                ? 'bg-zen-brand text-white shadow-zen'
                : 'border border-glass-light-border bg-glass-light-2 text-zen-ink/60 backdrop-blur-md hover:text-zen-ink dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white/60 dark:hover:text-white',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-ink/40 dark:text-white/40" />
          <GlassInput
            type="search"
            placeholder="Filtrar por título o autor…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-h-9 pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zen-ink/60 dark:text-white/60">
          <Loader2 size={24} className="mr-2 inline animate-spin text-zen" />
          Cargando sets…
        </div>
      ) : visible.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <Library size={32} className="mx-auto mb-2 text-zen-ink/40 dark:text-white/40" />
          <p className="text-sm text-zen-ink/60 dark:text-white/60">No hay sets con el filtro actual.</p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="overflow-hidden">
            <div className="border-b border-glass-light-border px-5 py-3 dark:border-glass-dark-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/50">
                {visible.length} set{visible.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
              {visible.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => openDetail(s)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-glass-light-2 dark:hover:bg-glass-dark-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {s.title ?? '(sin título)'}
                        </p>
                        {s.featured && <Star size={12} className="fill-zen-warning text-zen-warning" />}
                      </div>
                      <p className="truncate text-xs text-zen-ink/50 dark:text-white/50">
                        {s.description ?? 'Sin descripción'} · por {s.ownerEmail ?? s.ownerUid ?? '—'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <StatusBadge set={s} />
                      <ChevronRight size={15} className="text-zen-ink/40 dark:text-white/40" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </GlassCard>

          {hasMore && (
            <div className="mt-5 text-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Cargando…' : 'Cargar más'}
              </Button>
            </div>
          )}
        </>
      )}

      <Modal open={!!detailSet} onClose={closeDetail} title="Detalle del set" size="2xl">
        {detailSet && (
          <div className="space-y-5">
            <div>
              <div className="mb-3 flex items-start gap-3">
                <Library size={22} className="mt-0.5 shrink-0 text-zen" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold">{detailSet.title ?? '(sin título)'}</h3>
                  {detailSet.description && (
                    <p className="mt-0.5 text-sm text-zen-ink/60 dark:text-white/60">{detailSet.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <StatusBadge set={detailSet} />
                    {detailSet.featured && (
                      <GlassBadge tone="warning"><Star size={10} /> Destacado</GlassBadge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-glass-light-border bg-glass-light-1 p-2.5 dark:border-glass-dark-border dark:bg-glass-dark-1">
                  <p className="flex items-center gap-1 text-zen-ink/50 dark:text-white/50"><User size={10} />Autor</p>
                  <p className="mt-0.5 truncate font-medium">{detailSet.ownerEmail ?? detailSet.ownerUid ?? '—'}</p>
                </div>
                <div className="rounded-lg border border-glass-light-border bg-glass-light-1 p-2.5 dark:border-glass-dark-border dark:bg-glass-dark-1">
                  <p className="flex items-center gap-1 text-zen-ink/50 dark:text-white/50"><Calendar size={10} />Creado</p>
                  <p className="mt-0.5 font-medium">{formatDate(detailSet.createdAt)}</p>
                </div>
                <div className="col-span-2 rounded-lg border border-glass-light-border bg-glass-light-1 p-2.5 dark:border-glass-dark-border dark:bg-glass-dark-1">
                  <p className="flex items-center gap-1 text-zen-ink/50 dark:text-white/50"><Hash size={10} />Preguntas</p>
                  <p className="mt-0.5 font-medium">
                    {detailLoading ? '…' : `${detailSet.questions?.length ?? 0} pregunta(s)`}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview first 5 questions */}
            {detailSet.questions && detailSet.questions.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zen-ink/50 dark:text-white/50">
                  Primeras preguntas
                </p>
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {detailSet.questions.slice(0, 5).map((q, idx) => (
                    <div key={q.id} className="rounded-lg border border-glass-light-border bg-glass-light-1 p-2.5 dark:border-glass-dark-border dark:bg-glass-dark-1">
                      <p className="text-xs text-zen-ink/50 dark:text-white/50">Pregunta {idx + 1}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm">{q.question}</p>
                    </div>
                  ))}
                  {detailSet.questions.length > 5 && (
                    <p className="text-center text-xs text-zen-ink/50 dark:text-white/50">
                      + {detailSet.questions.length - 5} más…
                    </p>
                  )}
                </div>
              </div>
            )}

            {actionError && (
              <div className="flex items-center gap-1.5 rounded-lg border border-zen-danger/30 bg-zen-danger/10 px-3 py-2 text-xs text-zen-danger">
                <AlertCircle size={13} /> {actionError}
              </div>
            )}

            {confirmDelete ? (
              <div className="space-y-2 rounded-lg border border-zen-danger/30 bg-zen-danger/10 p-3">
                <p className="text-sm font-semibold text-zen-danger">¿Eliminar este set?</p>
                <p className="text-xs text-zen-ink/60 dark:text-white/60">El set se marca como eliminado (soft-delete). Los intentos existentes se conservan.</p>
                <GlassInput
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Razón (opcional)…"
                  className="min-h-9 text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="danger" onClick={confirmSoftDelete} disabled={actionBusy}>
                    {actionBusy ? '…' : 'Sí, eliminar'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 border-t border-glass-light-border pt-2 dark:border-glass-dark-border">
                <Button
                  variant={detailSet.published ? 'outline' : 'primary'}
                  size="sm"
                  disabled={actionBusy || detailSet.deleted}
                  onClick={togglePublish}
                  className="inline-flex items-center"
                >
                  {detailSet.published
                    ? <><EyeOff size={13} className="mr-1.5" />Despublicar</>
                    : <><Eye size={13} className="mr-1.5" />Publicar</>}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionBusy || detailSet.deleted}
                  onClick={toggleFeatured}
                  className="inline-flex items-center"
                >
                  {detailSet.featured
                    ? <><StarOff size={13} className="mr-1.5" />Quitar destacado</>
                    : <><Star size={13} className="mr-1.5" />Destacar</>}
                </Button>
                {!detailSet.deleted && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex items-center"
                  >
                    <Trash2 size={13} className="mr-1.5" />Eliminar
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
