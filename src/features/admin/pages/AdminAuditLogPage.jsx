import { useCallback, useEffect, useState } from 'react';
import {
  ScrollText, Loader2, Filter, ChevronRight, ChevronDown,
  UserCog, Library, Flag, ShieldCheck, FileQuestion, GraduationCap,
} from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAudit } from '../hooks/useAudit';
import Button from '../../../components/ui/Button';
import { GlassCard } from '../../../components/glass/GlassCard';

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' });
}

// Map action prefix → icon + color + human label
const ACTION_META = {
  'user':         { icon: UserCog,      color: 'text-zen bg-zen/15',              label: 'Usuario' },
  'examSet':      { icon: Library,      color: 'text-zen-violet bg-zen-violet/15', label: 'Set' },
  'featureFlags': { icon: Flag,         color: 'text-amber-600 bg-zen-warning/15 dark:text-zen-warning', label: 'Flag' },
  'admin':        { icon: ShieldCheck,  color: 'text-emerald-600 bg-zen-success/15 dark:text-zen-success', label: 'Admin' },
  'question':     { icon: FileQuestion, color: 'text-zen bg-zen/15',              label: 'Pregunta' },
  'certification':{ icon: GraduationCap, color: 'text-zen bg-zen/15',             label: 'Cert' },
};

function metaFor(action) {
  const prefix = action?.split('.')[0] ?? '';
  return ACTION_META[prefix] ?? { icon: ScrollText, color: 'text-zen-ink/60 bg-glass-light-2 dark:text-white/60 dark:bg-glass-dark-2', label: 'Otro' };
}

function EntryCard({ entry }) {
  const meta = metaFor(entry.action);
  const Icon = meta.icon;
  const [expanded, setExpanded] = useState(false);
  const hasDetails = entry.diff || entry.note;

  return (
    <li className="px-4 py-3 transition-colors hover:bg-glass-light-2 dark:hover:bg-glass-dark-2">
      <button
        onClick={() => hasDetails && setExpanded((e) => !e)}
        disabled={!hasDetails}
        className="flex w-full items-start gap-3 text-left"
      >
        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.color}`}>
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-glass-light-2 px-1.5 py-0.5 text-xs font-semibold dark:bg-glass-dark-2">
              {entry.action}
            </code>
            <span className="text-xs text-zen-ink/50 dark:text-white/50">
              {entry.target}/{entry.targetId}
            </span>
          </div>
          <p className="mt-1 text-xs text-zen-ink/60 dark:text-white/60">
            {entry.actorEmail} · {formatDate(entry.createdAt)}
          </p>
          {entry.note && !expanded && (
            <p className="mt-0.5 line-clamp-1 text-xs italic text-zen-ink/50 dark:text-white/50">"{entry.note}"</p>
          )}
        </div>
        {hasDetails && (
          <div className="shrink-0 text-zen-ink/40 dark:text-white/40">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
        )}
      </button>

      {expanded && hasDetails && (
        <div className="mt-3 space-y-2 pl-11">
          {entry.note && (
            <div className="rounded-lg border border-glass-light-border bg-glass-light-1 px-3 py-2 text-xs dark:border-glass-dark-border dark:bg-glass-dark-1">
              <p className="mb-0.5 font-semibold text-zen-ink/50 dark:text-white/50">Nota</p>
              <p>{entry.note}</p>
            </div>
          )}
          {entry.diff && (
            <div className="rounded-lg border border-glass-light-border bg-glass-light-1 px-3 py-2 text-xs dark:border-glass-dark-border dark:bg-glass-dark-1">
              <p className="mb-1 font-semibold text-zen-ink/50 dark:text-white/50">Cambios</p>
              <pre className="whitespace-pre-wrap font-mono text-[11px]">
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
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-zen-ink/40 dark:text-white/40" />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="h-9 rounded-lg border border-glass-light-border bg-glass-light-2 px-3 text-sm backdrop-blur-md focus:border-zen focus:outline-none dark:border-glass-dark-border dark:bg-glass-dark-2"
        >
          {ACTION_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zen-ink/60 dark:text-white/60">
          <Loader2 size={24} className="mr-2 inline animate-spin text-zen" />
          Cargando log…
        </div>
      ) : entries.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <ScrollText size={32} className="mx-auto mb-2 text-zen-ink/40 dark:text-white/40" />
          <p className="text-sm text-zen-ink/60 dark:text-white/60">Sin entradas en el log.</p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="overflow-hidden">
            <div className="border-b border-glass-light-border px-5 py-3 dark:border-glass-dark-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/50">
                {entries.length} entrada{entries.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
              {entries.map((e) => <EntryCard key={e.id} entry={e} />)}
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
    </AdminShell>
  );
}
