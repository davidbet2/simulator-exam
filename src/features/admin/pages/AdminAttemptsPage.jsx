import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Activity, Loader2, User, CheckCircle2, XCircle, ChevronRight, X } from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAdmin } from '../hooks/useAdmin';
import Button from '../../../components/ui/Button';
import { GlassCard } from '../../../components/glass/GlassCard';

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}

function scorePct(a) {
  if (!a.total) return 0;
  return Math.round((a.score / a.total) * 100);
}

export function AdminAttemptsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const uidFilter = searchParams.get('uid');
  const { fetchAttempts, fetchUserById } = useAdmin();

  const [attempts, setAttempts] = useState([]);
  const [lastDoc, setLastDoc]   = useState(null);
  const [hasMore, setHasMore]   = useState(true);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const { attempts: list, lastDoc: last } = await fetchAttempts({
      pageSize: 30,
      uid: uidFilter,
    });
    setAttempts(list);
    setLastDoc(last);
    setHasMore(list.length === 30);
    setLoading(false);
  }, [fetchAttempts, uidFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadInitial(); }, [loadInitial]);

  useEffect(() => {
    if (uidFilter) {
      fetchUserById(uidFilter).then(setUserInfo);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserInfo(null);
    }
  }, [uidFilter, fetchUserById]);

  async function loadMore() {
    if (!lastDoc) return;
    setLoadingMore(true);
    const { attempts: more, lastDoc: next } = await fetchAttempts({
      pageSize: 30, afterDoc: lastDoc, uid: uidFilter,
    });
    setAttempts((prev) => [...prev, ...more]);
    setLastDoc(next);
    setHasMore(more.length === 30);
    setLoadingMore(false);
  }

  function clearUidFilter() {
    searchParams.delete('uid');
    setSearchParams(searchParams);
  }

  return (
    <AdminShell
      title="Intentos"
      subtitle={uidFilter
        ? 'Intentos filtrados por usuario.'
        : 'Explora los intentos de examen de todos los usuarios. Útil para soporte y auditoría.'}
    >
      {uidFilter && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zen/20 bg-zen/5 p-3">
          <div className="flex items-center gap-2">
            <User size={14} className="text-zen" />
            <span className="text-sm">
              Filtrando por: <span className="font-semibold">{userInfo?.email ?? uidFilter}</span>
            </span>
          </div>
          <button
            onClick={clearUidFilter}
            className="inline-flex items-center gap-1 text-xs text-zen-ink/60 hover:text-zen-ink dark:text-white/60 dark:hover:text-white"
          >
            <X size={12} /> Quitar filtro
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-zen-ink/60 dark:text-white/60">
          <Loader2 size={24} className="mr-2 inline animate-spin text-zen" />
          Cargando intentos…
        </div>
      ) : attempts.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <Activity size={32} className="mx-auto mb-2 text-zen-ink/40 dark:text-white/40" />
          <p className="text-sm text-zen-ink/60 dark:text-white/60">Sin intentos registrados{uidFilter ? ' para este usuario' : ''}.</p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="overflow-hidden">
            <div className="border-b border-glass-light-border px-5 py-3 dark:border-glass-dark-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/50">
                {attempts.length} intento{attempts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
              {attempts.map((a) => {
                const pct = scorePct(a);
                const passed = pct >= (a.passPercent ?? 72);
                return (
                  <li key={a.id} className="px-5 py-3 transition-colors hover:bg-glass-light-2 dark:hover:bg-glass-dark-2">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        passed ? 'bg-zen-success/15 text-emerald-600 dark:text-zen-success' : 'bg-zen-danger/15 text-rose-600 dark:text-zen-danger'
                      }`}>
                        {passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {a.certTitle ?? a.certId ?? a.setTitle ?? '(examen sin título)'}
                          </p>
                          <span className={`text-xs font-bold tabular-nums ${passed ? 'text-emerald-600 dark:text-zen-success' : 'text-rose-600 dark:text-zen-danger'}`}>
                            {pct}%
                          </span>
                          <span className="text-xs text-zen-ink/50 dark:text-white/50">
                            {a.score}/{a.total}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zen-ink/50 dark:text-white/50">
                          {a.userEmail ?? a.uid} · {formatDate(a.createdAt)}
                          {a.durationSec != null && ` · ${Math.round(a.durationSec / 60)} min`}
                        </p>
                      </div>
                      {!uidFilter && a.uid && (
                        <Link
                          to={`/admin/attempts?uid=${a.uid}`}
                          className="shrink-0 text-xs font-semibold text-zen hover:text-zen-violet"
                          title="Filtrar por este usuario"
                        >
                          <ChevronRight size={14} className="inline" />
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
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
