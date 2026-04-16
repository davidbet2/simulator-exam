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

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ set }) {
  if (set.deleted) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-danger-50 text-danger-600 border border-danger-500/30">Eliminado</span>;
  }
  if (set.published) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-success-50 text-success-600 border border-success-500/30">Publicado</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-surface-muted text-ink-soft border border-surface-border">Borrador</span>;
}

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
      title="Sets de la comunidad"
      subtitle="Modera los exámenes creados por los usuarios. Publica, despublica, destaca o elimina."
    >
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'all',       label: 'Todos' },
          { id: 'published', label: 'Publicados' },
          { id: 'draft',     label: 'Borradores' },
          { id: 'deleted',   label: 'Eliminados' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === f.id
                ? 'bg-brand-500 text-white'
                : 'bg-white border border-surface-border text-ink-soft hover:text-ink hover:border-brand-500/40',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            placeholder="Filtrar por título o autor…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-surface-border text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-ink-soft">
          <Loader2 size={24} className="inline animate-spin text-brand-500 mr-2" />
          Cargando sets…
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-border">
          <Library size={32} className="mx-auto text-ink-muted mb-2" />
          <p className="text-sm text-ink-soft">No hay sets con el filtro actual.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-border">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                {visible.length} set{visible.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-surface-border">
              {visible.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => openDetail(s)}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-surface-muted/60 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-ink truncate">
                          {s.title ?? '(sin título)'}
                        </p>
                        {s.featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-xs text-ink-muted truncate">
                        {s.description ?? 'Sin descripción'} · por {s.ownerEmail ?? s.ownerUid ?? '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge set={s} />
                      <ChevronRight size={15} className="text-ink-muted" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

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
              <div className="flex items-start gap-3 mb-3">
                <Library size={22} className="text-brand-600 mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-ink">{detailSet.title ?? '(sin título)'}</h3>
                  {detailSet.description && (
                    <p className="text-sm text-ink-soft mt-0.5">{detailSet.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <StatusBadge set={detailSet} />
                    {detailSet.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 border border-amber-200">
                        <Star size={10} /> Destacado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-soft border border-surface-border">
                  <p className="text-ink-muted flex items-center gap-1"><User size={10} />Autor</p>
                  <p className="text-ink font-medium mt-0.5 truncate">{detailSet.ownerEmail ?? detailSet.ownerUid ?? '—'}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-soft border border-surface-border">
                  <p className="text-ink-muted flex items-center gap-1"><Calendar size={10} />Creado</p>
                  <p className="text-ink font-medium mt-0.5">{formatDate(detailSet.createdAt)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-soft border border-surface-border col-span-2">
                  <p className="text-ink-muted flex items-center gap-1"><Hash size={10} />Preguntas</p>
                  <p className="text-ink font-medium mt-0.5">
                    {detailLoading ? '…' : `${detailSet.questions?.length ?? 0} pregunta(s)`}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview first 5 questions */}
            {detailSet.questions && detailSet.questions.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-2">
                  Primeras preguntas
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detailSet.questions.slice(0, 5).map((q, idx) => (
                    <div key={q.id} className="p-2.5 rounded-lg bg-surface-soft border border-surface-border">
                      <p className="text-xs text-ink-muted">Pregunta {idx + 1}</p>
                      <p className="text-sm text-ink mt-0.5 line-clamp-2">{q.question}</p>
                    </div>
                  ))}
                  {detailSet.questions.length > 5 && (
                    <p className="text-xs text-ink-muted text-center">
                      + {detailSet.questions.length - 5} más…
                    </p>
                  )}
                </div>
              </div>
            )}

            {actionError && (
              <div className="text-xs text-danger-600 bg-danger-50 border border-danger-500/30 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <AlertCircle size={13} /> {actionError}
              </div>
            )}

            {confirmDelete ? (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-500/30 space-y-2">
                <p className="text-sm font-semibold text-danger-600">¿Eliminar este set?</p>
                <p className="text-xs text-ink-soft">El set se marca como eliminado (soft-delete). Los intentos existentes se conservan.</p>
                <input
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Razón (opcional)…"
                  className="w-full border border-surface-border rounded px-2 py-1 text-sm"
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
              <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
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
