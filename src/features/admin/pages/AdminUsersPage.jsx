import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, UserRound, ShieldAlert, Zap, Ban, CheckCircle2,
  ChevronRight, Loader2, Mail, Calendar, Crown, Activity,
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

function PlanBadge({ plan }) {
  if (plan === 'pro') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <Crown size={10} /> Pro
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-ink-soft border border-surface-border">
      Free
    </span>
  );
}

function StatusBadge({ banned }) {
  if (banned) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-danger-50 text-danger-600 border border-danger-500/30">
        <Ban size={10} /> Baneado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success-50 text-success-600 border border-success-500/30">
      <CheckCircle2 size={10} /> Activo
    </span>
  );
}

export function AdminUsersPage() {
  const {
    fetchUsers, searchUserByEmail, updateUserPlan, setUserBanned, fetchUserAttemptCount,
  } = useAdmin();
  const { logAction } = useAudit();

  const [users, setUsers]           = useState([]);
  const [lastDoc, setLastDoc]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const [detailUser, setDetailUser]   = useState(null);
  const [attemptCount, setAttemptCount] = useState(null);
  const [actionBusy, setActionBusy]   = useState(false);
  const [actionError, setActionError] = useState(null);
  const [confirmBan, setConfirmBan]   = useState(false);
  const [banReason, setBanReason]     = useState('');

  // ── Initial load ────────────────────────────────────────────────
  const loadInitial = useCallback(async () => {
    setLoading(true);
    const { users: list, lastDoc: last } = await fetchUsers({ pageSize: 25 });
    setUsers(list);
    setLastDoc(last);
    setHasMore(list.length === 25);
    setLoading(false);
  }, [fetchUsers]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadInitial(); }, [loadInitial]);

  async function loadMore() {
    if (!lastDoc) return;
    setLoadingMore(true);
    const { users: more, lastDoc: next } = await fetchUsers({ pageSize: 25, afterDoc: lastDoc });
    setUsers((prev) => [...prev, ...more]);
    setLastDoc(next);
    setHasMore(more.length === 25);
    setLoadingMore(false);
  }

  async function handleSearch(e) {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchMode(false);
      loadInitial();
      return;
    }
    setSearchMode(true);
    setLoading(true);
    const results = await searchUserByEmail(term);
    setUsers(results);
    setHasMore(false);
    setLoading(false);
  }

  function clearSearch() {
    setSearchTerm('');
    setSearchMode(false);
    loadInitial();
  }

  // ── Detail modal ────────────────────────────────────────────────
  async function openDetail(u) {
    setDetailUser(u);
    setAttemptCount(null);
    setActionError(null);
    setConfirmBan(false);
    setBanReason(u.bannedReason ?? '');
    const count = await fetchUserAttemptCount(u.id);
    setAttemptCount(count);
  }

  function closeDetail() {
    setDetailUser(null);
    setConfirmBan(false);
  }

  async function togglePlan() {
    if (!detailUser) return;
    const current = detailUser.plan ?? 'free';
    const next = current === 'pro' ? 'free' : 'pro';
    setActionBusy(true);
    setActionError(null);
    const ok = await updateUserPlan(detailUser.id, next);
    if (ok) {
      await logAction({
        action: 'user.plan.update',
        target: 'users',
        targetId: detailUser.id,
        diff: { plan: { from: current, to: next } },
      });
      setDetailUser((prev) => ({ ...prev, plan: next }));
      setUsers((prev) => prev.map((u) => (u.id === detailUser.id ? { ...u, plan: next } : u)));
    } else {
      setActionError('No se pudo actualizar el plan.');
    }
    setActionBusy(false);
  }

  async function toggleBan() {
    if (!detailUser) return;
    const willBan = !detailUser.banned;
    setActionBusy(true);
    setActionError(null);
    const ok = await setUserBanned(detailUser.id, willBan, banReason);
    if (ok) {
      await logAction({
        action: willBan ? 'user.ban' : 'user.unban',
        target: 'users',
        targetId: detailUser.id,
        note: willBan ? banReason : null,
      });
      setDetailUser((prev) => ({
        ...prev,
        banned: willBan,
        bannedReason: willBan ? banReason : null,
      }));
      setUsers((prev) => prev.map((u) => (u.id === detailUser.id ? { ...u, banned: willBan } : u)));
      setConfirmBan(false);
    } else {
      setActionError('No se pudo completar la acción.');
    }
    setActionBusy(false);
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <AdminShell
      title="Usuarios"
      subtitle="Busca, inspecciona y gestiona cuentas de usuarios finales."
    >
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            placeholder="Buscar por email exacto (ej: user@example.com)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-xl bg-white border border-surface-border text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <Button type="submit" size="md">Buscar</Button>
        {searchMode && (
          <Button type="button" variant="ghost" size="md" onClick={clearSearch}>Limpiar</Button>
        )}
      </form>

      {/* Loading */}
      {loading ? (
        <div className="py-16 text-center text-ink-soft">
          <Loader2 size={24} className="inline animate-spin text-brand-500 mr-2" />
          Cargando usuarios…
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-border">
          <UserRound size={32} className="mx-auto text-ink-muted mb-2" />
          <p className="text-sm text-ink-soft">
            {searchMode ? 'No se encontraron usuarios con ese email.' : 'No hay usuarios registrados.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-surface-border shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                {users.length} {searchMode ? 'resultado(s)' : 'usuarios'}
              </span>
            </div>
            <ul className="divide-y divide-surface-border">
              {users.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => openDetail(u)}
                    className="w-full px-5 py-3 flex items-center gap-3 hover:bg-surface-muted/60 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {(u.displayName ?? u.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">
                        {u.displayName ?? u.email}
                      </p>
                      <p className="text-xs text-ink-muted truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PlanBadge plan={u.plan ?? 'free'} />
                      {u.banned && <StatusBadge banned />}
                      <ChevronRight size={15} className="text-ink-muted" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {hasMore && !searchMode && (
            <div className="mt-5 text-center">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? 'Cargando…' : 'Cargar más'}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      <Modal
        open={!!detailUser}
        onClose={closeDetail}
        title="Detalle de usuario"
        size="lg"
      >
        {detailUser && (
          <div className="space-y-5">
            {/* Identity */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center font-bold text-base shrink-0">
                {(detailUser.displayName ?? detailUser.email ?? 'U').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-ink truncate">
                  {detailUser.displayName ?? detailUser.email}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-0.5">
                  <Mail size={11} />
                  <span className="truncate">{detailUser.email}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <PlanBadge plan={detailUser.plan ?? 'free'} />
                  <StatusBadge banned={detailUser.banned === true} />
                </div>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-soft border border-surface-border">
                <p className="text-ink-muted flex items-center gap-1"><Calendar size={11} />Registrado</p>
                <p className="font-semibold text-ink mt-0.5">{formatDate(detailUser.createdAt)}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-soft border border-surface-border">
                <p className="text-ink-muted flex items-center gap-1"><Activity size={11} />Intentos totales</p>
                <p className="font-semibold text-ink mt-0.5">
                  {attemptCount === null ? '…' : attemptCount}
                </p>
              </div>
              {detailUser.planChangedBy && (
                <div className="p-3 rounded-lg bg-surface-soft border border-surface-border col-span-2">
                  <p className="text-ink-muted">Plan cambiado por</p>
                  <p className="font-medium text-ink mt-0.5 truncate">
                    {detailUser.planChangedBy} — {formatDate(detailUser.planChangedAt)}
                  </p>
                </div>
              )}
              {detailUser.banned && detailUser.bannedReason && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-500/30 col-span-2">
                  <p className="text-danger-600 font-semibold flex items-center gap-1">
                    <ShieldAlert size={11} /> Razón del ban
                  </p>
                  <p className="text-ink mt-1">{detailUser.bannedReason}</p>
                  {detailUser.bannedBy && (
                    <p className="text-xs text-ink-muted mt-1">Por: {detailUser.bannedBy}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {actionError && (
              <div className="text-xs text-danger-600 bg-danger-50 border border-danger-500/30 rounded-lg px-3 py-2">
                {actionError}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-border">
              <Button
                variant={detailUser.plan === 'pro' ? 'outline' : 'primary'}
                size="sm"
                disabled={actionBusy}
                onClick={togglePlan}
                className="inline-flex items-center"
              >
                <Zap size={13} className="mr-1.5" />
                {detailUser.plan === 'pro' ? 'Degradar a Free' : 'Promover a Pro'}
              </Button>

              <Link to={`/admin/attempts?uid=${detailUser.id}`}>
                <Button variant="outline" size="sm" className="inline-flex items-center">
                  <Activity size={13} className="mr-1.5" /> Ver intentos
                </Button>
              </Link>

              {confirmBan ? (
                <div className="w-full flex flex-col gap-2 p-3 rounded-lg bg-danger-50 border border-danger-500/30">
                  <label className="text-xs font-semibold text-danger-600">
                    {detailUser.banned ? '¿Revertir ban?' : 'Razón del ban:'}
                  </label>
                  {!detailUser.banned && (
                    <input
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Ej: conducta abusiva, spam…"
                      className="w-full border border-surface-border rounded px-2 py-1 text-sm"
                    />
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" onClick={toggleBan} disabled={actionBusy}>
                      {actionBusy ? '…' : detailUser.banned ? 'Sí, revertir' : 'Sí, banear'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmBan(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant={detailUser.banned ? 'outline' : 'danger'}
                  size="sm"
                  onClick={() => setConfirmBan(true)}
                  className="inline-flex items-center"
                >
                  <Ban size={13} className="mr-1.5" />
                  {detailUser.banned ? 'Quitar ban' : 'Banear'}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
