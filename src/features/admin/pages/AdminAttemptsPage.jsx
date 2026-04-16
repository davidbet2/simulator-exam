import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Activity, Loader2, User, CheckCircle2, XCircle, ChevronRight, X } from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAdmin } from '../hooks/useAdmin';
import Button from '../../../components/ui/Button';

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
        <div className="mb-5 p-3 rounded-xl bg-brand-500/5 border border-brand-500/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <User size={14} className="text-brand-700" />
            <span className="text-sm text-ink">
              Filtrando por: <span className="font-semibold">{userInfo?.email ?? uidFilter}</span>
            </span>
          </div>
          <button
            onClick={clearUidFilter}
            className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
          >
            <X size={12} /> Quitar filtro
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-ink-soft">
          <Loader2 size={24} className="inline animate-spin text-brand-500 mr-2" />
          Cargando intentos…
        </div>
      ) : attempts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-border">
          <Activity size={32} className="mx-auto text-ink-muted mb-2" />
          <p className="text-sm text-ink-soft">Sin intentos registrados{uidFilter ? ' para este usuario' : ''}.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-border">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                {attempts.length} intento{attempts.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ul className="divide-y divide-surface-border">
              {attempts.map((a) => {
                const pct = scorePct(a);
                const passed = pct >= (a.passPercent ?? 72);
                return (
                  <li key={a.id} className="px-5 py-3 hover:bg-surface-muted/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        passed ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
                      }`}>
                        {passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-ink truncate">
                            {a.certTitle ?? a.certId ?? a.setTitle ?? '(examen sin título)'}
                          </p>
                          <span className={`text-xs font-bold tabular-nums ${passed ? 'text-success-600' : 'text-danger-600'}`}>
                            {pct}%
                          </span>
                          <span className="text-xs text-ink-muted">
                            {a.score}/{a.total}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted mt-0.5 truncate">
                          {a.userEmail ?? a.uid} · {formatDate(a.createdAt)}
                          {a.durationSec != null && ` · ${Math.round(a.durationSec / 60)} min`}
                        </p>
                      </div>
                      {!uidFilter && a.uid && (
                        <Link
                          to={`/admin/attempts?uid=${a.uid}`}
                          className="text-xs text-brand-600 hover:text-brand-700 font-semibold shrink-0"
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
