import { useCallback, useEffect, useState } from 'react';
import {
  ScrollText, Loader2, Filter, ChevronRight, ChevronDown,
  UserCog, Library, Flag, ShieldCheck, FileQuestion, GraduationCap,
} from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAudit } from '../hooks/useAudit';
import Button from '../../../components/ui/Button';

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
}

// Map action prefix → icon + color + human label
const ACTION_META = {
  'user':         { icon: UserCog,      color: 'text-brand-700 bg-brand-500/10',    label: 'Usuario' },
  'examSet':      { icon: Library,      color: 'text-violet-700 bg-violet-500/10', label: 'Set' },
  'featureFlags': { icon: Flag,         color: 'text-amber-700 bg-amber-500/10',   label: 'Flag' },
  'admin':        { icon: ShieldCheck,  color: 'text-emerald-700 bg-emerald-500/10', label: 'Admin' },
  'question':     { icon: FileQuestion, color: 'text-brand-700 bg-brand-500/10',   label: 'Pregunta' },
  'certification':{ icon: GraduationCap, color: 'text-brand-700 bg-brand-500/10',  label: 'Cert' },
};

function metaFor(action) {
  const prefix = action?.split('.')[0] ?? '';
  return ACTION_META[prefix] ?? { icon: ScrollText, color: 'text-ink-soft bg-surface-muted', label: 'Otro' };
}

function EntryCard({ entry }) {
  const meta = metaFor(entry.action);
  const Icon = meta.icon;
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.diff || entry.note;

  return (
    <li className="px-4 py-3 hover:bg-surface-muted/60 transition-colors">
      <button
        onClick={() => hasDetails && setExpanded((e) => !e)}
        disabled={!hasDetails}
        className="w-full text-left flex items-start gap-3"
      >
        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs font-semibold text-ink bg-surface-muted px-1.5 py-0.5 rounded">
              {entry.action}
            </code>
            <span className="text-xs text-ink-muted">
              {entry.target}/{entry.targetId}
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">
            {entry.actorEmail} · {formatDate(entry.createdAt)}
          </p>
          {entry.note && !expanded && (
            <p className="text-xs text-ink-muted mt-0.5 italic line-clamp-1">"{entry.note}"</p>
          )}
        </div>
        {hasDetails && (
          <div className="text-ink-muted shrink-0">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </button>

      {expanded && hasDetails && (
        <div className="mt-3 pl-11 space-y-2">
          {entry.note && (
            <div className="text-xs bg-surface-soft border border-surface-border rounded-lg px-3 py-2">
              <p className="text-ink-muted font-semibold mb-0.5">Nota</p>
              <p className="text-ink">{entry.note}</p>
            </div>
          )}
          {entry.diff && (
            <div className="text-xs bg-surface-soft border border-surface-border rounded-lg px-3 py-2">
              <p className="text-ink-muted font-semibold mb-1">Cambios</p>
              <pre className="font-mono text-[11px] whitespace-pre-wrap text-ink">
                {JSON.stringify(entry.diff, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

const ACTION_FILTERS = [
  { value: '',                       label: 'Todas' },
  { value: 'user.plan.update',       label: 'Cambio de plan' },
  { value: 'user.ban',               label: 'Ban' },
  { value: 'user.unban',             label: 'Unban' },
  { value: 'examSet.publish',        label: 'Publicar set' },
  { value: 'examSet.unpublish',      label: 'Despublicar set' },
  { value: 'examSet.softDelete',     label: 'Eliminar set' },
  { value: 'examSet.feature',        label: 'Destacar set' },
  { value: 'featureFlags.update',    label: 'Flags' },
];

export function AdminAuditLogPage() {
  const { fetchLog } = useAudit();
  const [entries, setEntries] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionFilter, setActionFilter] = useState('');

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const { entries: list, lastDoc: last } = await fetchLog({
      pageSize: 30,
      actionFilter: actionFilter || null,
    });
    setEntries(list);
    setLastDoc(last);
    setHasMore(list.length === 30);
    setLoading(false);
  }, [fetchLog, actionFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadInitial(); }, [loadInitial]);

  async function loadMore() {
    if (!lastDoc) return;
    setLoadingMore(true);
    const { entries: more, lastDoc: next } = await fetchLog({
      pageSize: 30,
      afterDoc: lastDoc,
      actionFilter: actionFilter || null,
    });
    setEntries((prev) => [...prev, ...more]);
    setLastDoc(next);
    setHasMore(more.length === 30);
    setLoadingMore(false);
  }

  return (
    <AdminShell
      title="Audit log"
      subtitle="Historial append-only de todas las acciones administrativas. No se puede editar ni borrar."
    >
      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter size={14} className="text-ink-muted" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="h-9 rounded-lg bg-white border border-surface-border text-sm text-ink px-3 focus:outline-none focus:border-brand-500"
        >
          {ACTION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-ink-soft">
          <Loader2 size={24} className="inline animate-spin text-brand-500 mr-2" />
          Cargando log…
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-border">
          <ScrollText size={32} className="mx-auto text-ink-muted mb-2" />
          <p className="text-sm text-ink-soft">Sin entradas en el log.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-border">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                {entries.length} entrada{entries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-surface-border">
              {entries.map((e) => <EntryCard key={e.id} entry={e} />)}
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
    </AdminShell>
  );
}
