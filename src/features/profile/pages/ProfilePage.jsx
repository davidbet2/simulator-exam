import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';
import {
  Trophy, Star, Zap, Target, ArrowLeft, BookOpen,
  ChevronDown, ChevronUp, Plus, Search, Shield,
  Pencil, Check, X, Mail, Calendar, User, CreditCard,
  Receipt, AlertTriangle, RefreshCw, ExternalLink, Clock,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { Badge } from '../../../components/ui/Badge';
import { AppShell } from '../../../components/layout/AppShell';
import { Trans, useLingui } from '@lingui/react/macro';
import { SEOHead } from '../../../components/SEOHead';

// ── Date formatter ─────────────────────────────────────────────────────────
function formatDate(val) {
  if (!val) return '—';
  try {
    const d = typeof val === 'string' ? new Date(val) : val.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return '—';
  }
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function AvatarLetters({ name, size = 'lg' }) {
  const initials = (name ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const cls = size === 'lg'
    ? 'w-20 h-20 text-2xl'
    : 'w-10 h-10 text-sm';
  return (
    <div className={`${cls} rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-display font-bold text-white shadow-glow-brand shrink-0`}>
      {initials}
    </div>
  );
}

// ── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color = 'bg-brand-500/20 text-brand-300' }) {
  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl ${color} border border-white/5`}>
      <Icon size={18} className="opacity-80" />
      <span className="font-display font-bold text-xl tabular-nums">{value}</span>
      <span className="text-[10px] text-ink-soft uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ── Achievement badge ────────────────────────────────────────────────────────
function Achievement({ icon, label, unlocked }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
      unlocked
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
        : 'border-surface-border bg-surface-card text-slate-600 opacity-50 grayscale'
    }`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] text-center leading-tight">{label}</span>
    </div>
  );
}

export function ProfilePage() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { user, displayName, logout, isPro, isAdmin, updateDisplayName, subscriptionStatus, subscriptionRenewsAt, subscriptionStartedAt, dodoSubscriptionId } = useAuthStore();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllHistory, setShowAllHistory] = useState(false);

  // ── Billing state ─────────────────────────────────────────────────────────
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);
  const [showPayments, setShowPayments] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reactivating, setReactivating] = useState(false);
  const [reactivateError, setReactivateError] = useState(null);
  const [reactivateSuccess, setReactivateSuccess] = useState(false);

  const loadPayments = useCallback(async () => {
    if (paymentsLoading) return;
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const fns = getFunctions(getApp());
      const fn  = httpsCallable(fns, 'getDodoPayments');
      const res = await fn({});
      setPayments(res.data?.payments ?? []);
    } catch (err) {
      setPaymentsError(err.message || 'Error al cargar historial');
    } finally {
      setPaymentsLoading(false);
    }
  }, [paymentsLoading]);

  async function handleCancelRenewal() {
    if (!dodoSubscriptionId) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const fns = getFunctions(getApp());
      const fn  = httpsCallable(fns, 'cancelDodoSubscription');
      await fn({ subscriptionId: dodoSubscriptionId });
      setCancelSuccess(true);
      setReactivateSuccess(false);
      setConfirmCancel(false);
    } catch (err) {
      setCancelError(err.message || 'No se pudo cancelar la renovación');
    } finally {
      setCancelling(false);
    }
  }

  async function handleReactivateRenewal() {
    if (!dodoSubscriptionId) return;
    setReactivating(true);
    setReactivateError(null);
    try {
      const fns = getFunctions(getApp());
      const fn  = httpsCallable(fns, 'reactivateDodoSubscription');
      await fn({ subscriptionId: dodoSubscriptionId });
      setReactivateSuccess(true);
      setCancelSuccess(false);
    } catch (err) {
      setReactivateError(err.message || 'No se pudo reactivar la renovación');
    } finally {
      setReactivating(false);
    }
  }

  // ── Editable display name ──────────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);

  function startEdit() {
    setNameValue(displayName ?? '');
    setNameError(null);
    setEditingName(true);
  }

  async function saveName() {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed.length < 2) { setNameError(t`Mínimo 2 caracteres.`); return; }
    if (trimmed.length > 40) { setNameError(t`Máximo 40 caracteres.`); return; }
    setSavingName(true);
    try {
      await updateDisplayName(user.uid, trimmed);
      setEditingName(false);
    } catch {
      setNameError(t`No se pudo guardar. Inténtalo de nuevo.`);
    } finally {
      setSavingName(false);
    }
  }

  function cancelEdit() { setEditingName(false); setNameError(null); }

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    const q = query(
      collection(db, 'attempts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    getDocs(q)
      .then((snap) => setAttempts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.info('[Profile] index still building, will resolve automatically')
        } else {
          console.error('[Profile] attempts fetch failed:', err)
        }
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalExams     = attempts.length;
  const passed         = attempts.filter((a) => Math.round((a.score / a.total) * 100) >= (a.passPercent ?? 72)).length;
  const avgScore       = totalExams > 0
    ? Math.round(attempts.reduce((s, a) => s + Math.round((a.score / a.total) * 100), 0) / totalExams)
    : 0;
  const bestScore      = totalExams > 0
    ? Math.max(...attempts.map((a) => Math.round((a.score / a.total) * 100)))
    : 0;
  const passRate       = totalExams > 0 ? Math.round((passed / totalExams) * 100) : 0;

  // ── Per-certification breakdown ────────────────────────────────────────────
  const certStats = Object.values(
    attempts.reduce((acc, a) => {
      const key = a.certTitle ?? a.certId ?? 'Sin nombre';
      if (!acc[key]) acc[key] = { title: key, count: 0, passed: 0, totalPct: 0 };
      const pct = Math.round((a.score / a.total) * 100);
      acc[key].count++;
      acc[key].totalPct += pct;
      if (pct >= (a.passPercent ?? 72)) acc[key].passed++;
      return acc;
    }, {}),
  ).map((c) => ({ ...c, avgPct: Math.round(c.totalPct / c.count) }))
    .sort((a, b) => b.count - a.count);

  // ── History (expanded or collapsed) ────────────────────────────────────────
  const HISTORY_PREVIEW = 8;
  const visibleAttempts = showAllHistory ? attempts : attempts.slice(0, HISTORY_PREVIEW);

  // ── Achievements ───────────────────────────────────────────────────────────
  const achievements = [
    { icon: '🎯', label: t`Primer examen`,  unlocked: totalExams >= 1 },
    { icon: '🔥', label: t`5 exámenes`,     unlocked: totalExams >= 5 },
    { icon: '⚡', label: t`10 exámenes`,    unlocked: totalExams >= 10 },
    { icon: '🏆', label: t`Primer aprobado`, unlocked: passed >= 1 },
    { icon: '💎', label: t`Nota perfecta`,  unlocked: bestScore === 100 },
    { icon: '🌟', label: t`80%+ promedio`,  unlocked: avgScore >= 80 },
  ];

  return (
    <AppShell>
      <SEOHead title={t`Mi perfil`} description={t`Tu historial de exámenes, logros y progreso.`} path="/profile" noindex />
      <div className="relative">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-600/15 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-purple-600/10 blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 relative">
        {/* Back nav */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors">
          <ArrowLeft size={14} /> <Trans>Dashboard</Trans>
        </Link>

        {/* ── Passport card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-bright rounded-2xl border border-surface-border shadow-card overflow-hidden"
        >
          <div className="h-2 bg-gradient-to-r from-brand-500 via-purple-500 to-success-500" />

          <div className="px-6 py-6">
            <div className="flex items-center gap-5 mb-6">
              <AvatarLetters name={displayName} size="lg" />
              <div className="min-w-0 flex-1">
                <h1 className="font-display font-bold text-ink text-xl truncate">
                  {displayName ?? user.email}
                </h1>
                <p className="text-sm text-ink-soft truncate">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {isPro
                    ? <Badge variant="pro"><Zap size={10} />Pro</Badge>
                    : <Badge variant="default"><Trans>Free</Trans></Badge>
                  }
                  {isAdmin && <Badge variant="brand"><Shield size={10} />Admin</Badge>}
                  {passed > 0 && <Badge variant="success"><Trophy size={10} />{passed === 1 ? t`${passed} aprobado` : t`${passed} aprobados`}</Badge>}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              <StatPill icon={BookOpen} label={t`Exámenes`}   value={totalExams}        color="bg-brand-500/15 text-brand-300 border-brand-500/20" />
              <StatPill icon={Trophy}   label={t`Aprobados`}  value={passed}            color="bg-success-500/15 text-success-400 border-success-500/20" />
              <StatPill icon={Target}   label={t`Promedio`}   value={`${avgScore}%`}    color="bg-amber-500/15 text-amber-300 border-amber-500/20" />
              <StatPill icon={Star}     label={t`Mejor nota`} value={`${bestScore}%`}   color="bg-purple-500/15 text-purple-300 border-purple-500/20" />
            </div>

            {/* Pass rate bar */}
            {totalExams > 0 && (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-ink-soft mb-1.5">
                  <span><Trans>Tasa de aprobación</Trans></span>
                  <span className="font-semibold">{passRate}%</span>
                </div>
                <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passRate}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand-500 to-success-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Datos de cuenta ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl border border-surface-border p-5 space-y-4"
        >
          <h2 className="font-display font-bold text-ink text-sm"><Trans>Datos de cuenta</Trans></h2>

          {/* Nombre */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                <User size={15} className="text-brand-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ink-muted mb-0.5"><Trans>Nombre</Trans></p>
                {editingName ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      autoFocus
                      value={nameValue}
                      onChange={(e) => { setNameValue(e.target.value); setNameError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
                      maxLength={40}
                      className="h-8 text-sm border border-brand-500 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white text-ink w-48"
                    />
                    <button onClick={saveName} disabled={savingName}
                      className="w-8 h-8 rounded-lg bg-success-500/15 text-success-500 hover:bg-success-500/25 flex items-center justify-center transition-colors">
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEdit}
                      className="w-8 h-8 rounded-lg bg-surface-muted text-ink-muted hover:bg-danger-500/10 hover:text-danger-400 flex items-center justify-center transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-ink">{displayName}</p>
                )}
                {nameError && <p className="text-xs text-danger-500 mt-1">{nameError}</p>}
              </div>
            </div>
            {!editingName && (
              <button onClick={startEdit}
                className="shrink-0 w-8 h-8 rounded-lg border border-surface-border text-ink-muted hover:text-brand-500 hover:border-brand-500/40 flex items-center justify-center transition-all">
                <Pencil size={13} />
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-ink-muted mb-0.5"><Trans>Correo electrónico</Trans></p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-ink truncate">{user.email}</p>
                {user.emailVerified
                  ? <Badge variant="success"><Trans>Verificado</Trans></Badge>
                  : <Badge variant="warning"><Trans>Sin verificar</Trans></Badge>
                }
              </div>
            </div>
          </div>

          {/* Proveedor */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <Shield size={15} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-ink-muted mb-0.5"><Trans>Método de acceso</Trans></p>
              <p className="text-sm font-medium text-ink capitalize">
                {user.providerData?.[0]?.providerId === 'google.com' ? t`🔵 Google` : t`🔑 Email y contraseña`}
              </p>
            </div>
          </div>

          {/* Miembro desde */}
          {user.metadata?.creationTime && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success-500/10 flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-success-500" />
              </div>
              <div>
                <p className="text-xs text-ink-muted mb-0.5"><Trans>Miembro desde</Trans></p>
                <p className="text-sm font-medium text-ink">
                  {new Date(user.metadata.creationTime).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Facturación ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl border border-surface-border p-5 space-y-4"
        >
          <h2 className="font-display font-bold text-ink text-sm flex items-center gap-2">
            <CreditCard size={15} className="text-ink-muted" /> Suscripción y facturación
          </h2>

          {/* Plan header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPro ? 'bg-gradient-to-br from-brand-500 to-purple-600' : 'bg-surface-muted'
              }`}>
                <Zap size={17} className={isPro ? 'text-white' : 'text-ink-muted'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {isPro ? t`CertZen Pro` : t`Plan Gratuito`}
                </p>
                <p className="text-xs text-ink-soft capitalize">
                  {isPro ? t`Acceso completo · Sin restricciones` : t`3 exámenes/mes · Funciones básicas`}
                </p>
              </div>
            </div>
            <Badge variant={isPro ? 'pro' : 'default'}>
              {subscriptionStatus === 'past_due' ? 'Pago pendiente'
               : subscriptionStatus === 'on_hold'  ? 'En espera'
               : subscriptionStatus === 'cancelled' ? 'Cancelada'
               : isPro ? 'Activo' : 'Free'}
            </Badge>
          </div>

          {/* Features del plan */}
          <div className="rounded-xl border border-surface-border bg-surface-soft/50 p-4 space-y-2">
            {(isPro
              ? [t`Exámenes ilimitados`, t`Historial completo`, t`Análisis por dominio`, t`Crea y comparte sets`, t`Acceso anticipado a nuevas certs`]
              : [t`3 exámenes por mes`, t`Acceso a certificaciones oficiales`, t`Resultados básicos`]
            ).map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-ink-soft">
                <Check size={12} className="text-success-500 shrink-0" /> {f}
              </div>
            ))}
          </div>

          {/* Subscription dates (only for Pro) */}
          {isPro && (subscriptionStartedAt || subscriptionRenewsAt) && (
            <div className="grid grid-cols-2 gap-3">
              {subscriptionStartedAt && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-muted/40 border border-surface-border">
                  <Clock size={13} className="text-ink-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-ink-muted">Inicio</p>
                    <p className="text-xs font-medium text-ink">{formatDate(subscriptionStartedAt)}</p>
                  </div>
                </div>
              )}
              {subscriptionRenewsAt && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-muted/40 border border-surface-border">
                  <RefreshCw size={13} className="text-ink-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-ink-muted">Próxima renovación</p>
                    <p className="text-xs font-medium text-ink">{formatDate(subscriptionRenewsAt)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Past-due / on-hold warning */}
          {(subscriptionStatus === 'past_due' || subscriptionStatus === 'on_hold') && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-warning-500/5 border border-warning-500/20">
              <AlertTriangle size={13} className="text-warning-500 mt-0.5 shrink-0" />
              <p className="text-xs text-ink-soft">
                Hubo un problema con tu último pago. Tu acceso Pro sigue activo por ahora, pero actualiza tu método de pago para evitar interrupciones.
              </p>
            </div>
          )}

          {/* Payment history toggle */}
          {isPro && (
            <div>
              <button
                type="button"
                onClick={() => {
                  const next = !showPayments;
                  setShowPayments(next);
                  if (next && payments.length === 0) loadPayments();
                }}
                className="flex items-center gap-2 text-xs text-ink-soft hover:text-ink transition-colors"
              >
                <Receipt size={13} />
                Historial de pagos
                {showPayments ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              <AnimatePresence>
                {showPayments && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-xl border border-surface-border overflow-hidden">
                      {paymentsLoading ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-ink-muted text-xs">
                          <RefreshCw size={13} className="animate-spin" /> Cargando...
                        </div>
                      ) : paymentsError ? (
                        <div className="flex items-center gap-2 px-4 py-3 text-xs text-danger-400">
                          <AlertTriangle size={13} /> {paymentsError}
                        </div>
                      ) : payments.length === 0 ? (
                        <p className="px-4 py-3 text-xs text-ink-muted">No hay pagos registrados.</p>
                      ) : (
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-surface-border bg-surface-muted/30">
                              <th className="text-left px-4 py-2 font-medium text-ink-muted">Fecha</th>
                              <th className="text-left px-4 py-2 font-medium text-ink-muted">Monto</th>
                              <th className="text-left px-4 py-2 font-medium text-ink-muted">Estado</th>
                              <th className="px-4 py-2" />
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((p) => (
                              <tr key={p.payment_id} className="border-b border-surface-border/50 last:border-0 hover:bg-surface-muted/20 transition-colors">
                                <td className="px-4 py-2.5 text-ink-soft">{formatDate(p.created_at)}</td>
                                <td className="px-4 py-2.5 text-ink font-medium">
                                  {p.currency?.toUpperCase()} {((p.total_amount ?? 0) / 100).toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    p.status === 'succeeded' ? 'bg-success-500/10 text-success-600'
                                    : p.status === 'failed'   ? 'bg-danger-500/10 text-danger-500'
                                    : 'bg-surface-muted text-ink-muted'
                                  }`}>
                                    {p.status === 'succeeded' ? 'Exitoso'
                                     : p.status === 'failed'   ? 'Fallido'
                                     : p.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5">
                                  {p.receipt_url && (
                                    <a href={p.receipt_url} target="_blank" rel="noopener noreferrer"
                                       className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors">
                                      <ExternalLink size={11} /> Recibo
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Cancel renewal (only for active Pro, not already cancelled/reactivated) */}
          {isPro && dodoSubscriptionId && !cancelSuccess && !reactivateSuccess
           && subscriptionStatus !== 'cancelled' && (
            <div className="border-t border-surface-border/60 pt-4">
              {!confirmCancel ? (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs text-ink-muted hover:text-danger-400 transition-colors flex items-center gap-1.5"
                >
                  <X size={12} /> Cancelar renovación automática
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-ink-soft">
                    ¿Estás seguro? Tu plan Pro se mantendrá activo hasta{' '}
                    <strong>{formatDate(subscriptionRenewsAt)}</strong>,{' '}
                    pero no se renovará.
                  </p>
                  {cancelError && (
                    <p className="text-xs text-danger-400">{cancelError}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={handleCancelRenewal}
                      className="px-3 py-1.5 rounded-lg bg-danger-500/10 text-danger-500 text-xs font-medium hover:bg-danger-500/20 transition-colors disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setConfirmCancel(false); setCancelError(null); }}
                      className="px-3 py-1.5 rounded-lg border border-surface-border text-ink-soft text-xs hover:text-ink transition-colors"
                    >
                      Mantener plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancellation confirmed + reactivate option */}
          {(cancelSuccess || subscriptionStatus === 'cancelled') && !reactivateSuccess && (
            <div className="border-t border-surface-border/60 pt-4 space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-surface-muted/30 border border-surface-border">
                <AlertTriangle size={13} className="text-warning-500 mt-0.5 shrink-0" />
                <p className="text-xs text-ink-soft">
                  Renovación cancelada. Tu acceso Pro continúa hasta{' '}
                  <strong>{formatDate(subscriptionRenewsAt)}</strong>.
                </p>
              </div>
              {reactivateError && (
                <p className="text-xs text-danger-400">{reactivateError}</p>
              )}
              <button
                type="button"
                disabled={reactivating}
                onClick={handleReactivateRenewal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 text-brand-400 text-xs font-medium hover:bg-brand-500/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={reactivating ? 'animate-spin' : ''} />
                {reactivating ? 'Reactivando...' : 'Reactivar renovación automática'}
              </button>
            </div>
          )}

          {/* Reactivation confirmed */}
          {reactivateSuccess && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-success-500/5 border border-success-500/20">
              <Check size={13} className="text-success-500 mt-0.5 shrink-0" />
              <p className="text-xs text-ink-soft">
                ¡Renovación reactivada! Tu plan Pro se renovará el{' '}
                <strong>{formatDate(subscriptionRenewsAt)}</strong>.
              </p>
            </div>
          )}

          {/* Upgrade CTA for free users */}
          {!isPro && (
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-xl shadow-brand hover:opacity-90 transition-opacity"
            >
              <Zap size={14} /> <Trans>Ver planes y precios</Trans>
            </Link>
          )}
        </motion.div>

        {/* ── Quick actions ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-surface-border p-5"
        >
          <h2 className="font-display font-bold text-ink text-sm mb-3"><Trans>Acceso rápido</Trans></h2>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-surface-border bg-surface-muted/40 hover:bg-brand-500/10 hover:border-brand-500/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-brand-500/15 flex items-center justify-center group-hover:bg-brand-500/25 transition-colors">
                <Target size={17} className="text-brand-500" />
              </div>
              <span className="text-xs font-semibold text-ink-soft group-hover:text-ink leading-tight"><Trans>Tomar examen</Trans></span>
            </Link>
            <Link to="/explore" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-surface-border bg-surface-muted/40 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
                <Search size={17} className="text-purple-400" />
              </div>
              <span className="text-xs font-semibold text-ink-soft group-hover:text-ink leading-tight"><Trans>Explorar sets</Trans></span>
            </Link>
            <Link to="/create-exam" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-surface-border bg-surface-muted/40 hover:bg-success-500/10 hover:border-success-500/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-success-500/15 flex items-center justify-center group-hover:bg-success-500/25 transition-colors">
                <Plus size={17} className="text-success-500" />
              </div>
              <span className="text-xs font-semibold text-ink-soft group-hover:text-ink leading-tight"><Trans>Crear set</Trans></span>
            </Link>
          </div>
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl border border-surface-border p-5"
        >
          <h2 className="font-display font-bold text-ink text-sm mb-4 flex items-center gap-2"><Trophy size={15} className="text-amber-400" /> <Trans>Logros</Trans></h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {achievements.map((a) => (
              <Achievement key={a.label} {...a} />
            ))}
          </div>
        </motion.div>

        {/* ── Por certificación ── */}
        {certStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl border border-surface-border p-5"
          >
            <h2 className="font-display font-bold text-ink text-sm mb-4"><Trans>Rendimiento por certificación</Trans></h2>
            <div className="space-y-3">
              {certStats.map((c) => (
                <div key={c.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ink truncate pr-2">{c.title}</span>
                    <span className="text-ink-soft shrink-0">
                      {t`${c.avgPct}% prom · ${c.passed}/${c.count} aprobados`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.avgPct}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        c.avgPct >= 80 ? 'bg-success-500' :
                        c.avgPct >= 60 ? 'bg-brand-500' :
                        'bg-danger-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Historial completo ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-surface-border p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-ink text-sm"><Trans>Historial de exámenes</Trans></h2>
            {totalExams > 0 && (
              <span className="text-xs text-ink-soft">{totalExams === 1 ? t`${totalExams} examen` : t`${totalExams} exámenes`}</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-surface-muted animate-pulse" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-ink-soft"><Trans>Aún no has tomado ningún examen.</Trans></p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 font-semibold">
                <Target size={14} /> <Trans>Empezar ahora</Trans>
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-surface-border">
                {visibleAttempts.map((attempt) => {
                  const pct = Math.round((attempt.score / attempt.total) * 100);
                  const isPassed = pct >= (attempt.passPercent ?? 72);
                  const date = attempt.createdAt?.toDate?.();
                  return (
                    <div key={attempt.id} className="flex items-center justify-between py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{attempt.certTitle ?? attempt.certId}</p>
                        <p className="text-xs text-ink-soft">
                          {date ? date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          {attempt.total && <span className="ml-2 opacity-60">{t`${attempt.score}/${attempt.total} correctas`}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className="text-sm font-bold tabular-nums text-ink">{pct}%</span>
                        <Badge variant={isPassed ? 'success' : 'danger'}>{isPassed ? t`Aprobado` : t`No aprobado`}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {attempts.length > HISTORY_PREVIEW && (
                <button
                  onClick={() => setShowAllHistory((v) => !v)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft hover:text-ink py-2 border border-surface-border rounded-lg hover:bg-surface-muted/40 transition-all"
                >
                  {showAllHistory
                    ? <><ChevronUp size={13} /> <Trans>Ver menos</Trans></>
                    : <><ChevronDown size={13} /> {t`Ver todos (${attempts.length - HISTORY_PREVIEW} más)`}</>
                  }
                </button>
              )}
            </>
          )}
        </motion.div>

        {/* Sign out */}
        <div className="text-center pb-6">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-ink-soft hover:text-danger-400 transition-colors"
          >
            <Trans>Cerrar sesión</Trans>
          </button>
        </div>
      </div>
      </div>
    </AppShell>
  );
}
