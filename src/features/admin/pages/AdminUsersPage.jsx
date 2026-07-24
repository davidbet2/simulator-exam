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
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassInput } from '../../../components/glass/GlassInput';
import { GlassBadge } from '../../../components/glass/GlassBadge';

function formatDate(v) {
  if (!v) return '—';
  const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds * 1000 : v);
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

function PlanBadge({ plan }) {
  if (plan === 'pro') {
    return <GlassBadge tone="warning"><Crown size={10} /> Pro</GlassBadge>;
  }
  return <GlassBadge tone="neutral">Free</GlassBadge>;
}

function StatusBadge({ banned }) {
  if (banned) {
    return <GlassBadge tone="danger"><Ban size={10} /> Baneado</GlassBadge>;
  }
  return <GlassBadge tone="success"><CheckCircle2 size={10} /> Activo</GlassBadge>;
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
      <form onSubmit={handleSearch} className="mb-5 flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zen-ink/40 dark:text-white/40" />
          <GlassInput
            type="search"
            placeholder="Buscar por email exacto (ej: user@example.com)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" size="md">Buscar</Button>
        {searchMode && (
          <Button type="button" variant="ghost" size="md" onClick={clearSearch}>Limpiar</Button>
        )}
      </form>

      {/* Loading */}
      {loading ? (
        <div className="py-16 text-center text-zen-ink/60 dark:text-white/60">
          <Loader2 size={24} className="mr-2 inline animate-spin text-zen" />
          Cargando usuarios…
        </div>
      ) : users.length === 0 ? (
        <GlassCard className="py-16 text-center">
          <UserRound size={32} className="mx-auto mb-2 text-zen-ink/40 dark:text-white/40" />
          <p className="text-sm text-zen-ink/60 dark:text-white/60">
            {searchMode ? 'No se encontraron usuarios con ese email.' : 'No hay usuarios registrados.'}
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-glass-light-border px-5 py-3 dark:border-glass-dark-border">
              <span className="text-xs font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/50">
                {users.length} {searchMode ? 'resultado(s)' : 'usuarios'}
              </span>
            </div>
            <ul className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
              {users.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => openDetail(u)}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-glass-light-2 dark:hover:bg-glass-dark-2"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zen-brand text-xs font-bold text-white">
                      {(u.displayName ?? u.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {u.displayName ?? u.email}
                      </p>
                      <p className="truncate text-xs text-zen-ink/50 dark:text-white/50">{u.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <PlanBadge plan={u.plan ?? 'free'} />
                      {u.banned && <StatusBadge banned />}
                      <ChevronRight size={15} className="text-zen-ink/40 dark:text-white/40" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </GlassCard>

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
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zen-brand text-base font-bold text-white">
                {(detailUser.displayName ?? detailUser.email ?? 'U').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold">
                  {detailUser.displayName ?? detailUser.email}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zen-ink/60 dark:text-white/60">
                  <Mail size={11} />
                  <span className="truncate">{detailUser.email}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <PlanBadge plan={detailUser.plan ?? 'free'} />
                  <StatusBadge banned={detailUser.banned === true} />
                </div>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-glass-light-border bg-glass-light-1 p-3 dark:border-glass-dark-border dark:bg-glass-dark-1">
                <p className="flex items-center gap-1 text-zen-ink/50 dark:text-white/50"><Calendar size={11} />Registrado</p>
                <p className="mt-0.5 font-semibold">{formatDate(detailUser.createdAt)}</p>
              </div>
              <div className="rounded-lg border border-glass-light-border bg-glass-light-1 p-3 dark:border-glass-dark-border dark:bg-glass-dark-1">
                <p className="flex items-center gap-1 text-zen-ink/50 dark:text-white/50"><Activity size={11} />Intentos totales</p>
                <p className="mt-0.5 font-semibold">
                  {attemptCount === null ? '…' : attemptCount}
                </p>
              </div>
              {detailUser.planChangedBy && (
                <div className="col-span-2 rounded-lg border border-glass-light-border bg-glass-light-1 p-3 dark:border-glass-dark-border dark:bg-glass-dark-1">
                  <p className="text-zen-ink/50 dark:text-white/50">Plan cambiado por</p>
                  <p className="mt-0.5 truncate font-medium">
                    {detailUser.planChangedBy} — {formatDate(detailUser.planChangedAt)}
                  </p>
                </div>
              )}
              {detailUser.banned && detailUser.bannedReason && (
                <div className="col-span-2 rounded-lg border border-zen-danger/30 bg-zen-danger/10 p-3">
                  <p className="flex items-center gap-1 font-semibold text-zen-danger">
                    <ShieldAlert size={11} /> Razón del ban
                  </p>
                  <p className="mt-1">{detailUser.bannedReason}</p>
                  {detailUser.bannedBy && (
                    <p className="mt-1 text-xs text-zen-ink/50 dark:text-white/50">Por: {detailUser.bannedBy}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {actionError && (
              <div className="rounded-lg border border-zen-danger/30 bg-zen-danger/10 px-3 py-2 text-xs text-zen-danger">
                {actionError}
              </div>
            )}

            <div className="flex flex-wrap gap-2 border-t border-glass-light-border pt-2 dark:border-glass-dark-border">
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
                <div className="flex w-full flex-col gap-2 rounded-lg border border-zen-danger/30 bg-zen-danger/10 p-3">
                  <label className="text-xs font-semibold text-zen-danger">
                    {detailUser.banned ? '¿Revertir ban?' : 'Razón del ban:'}
                  </label>
                  {!detailUser.banned && (
                    <GlassInput
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      placeholder="Ej: conducta abusiva, spam…"
                      className="min-h-9 text-sm"
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
