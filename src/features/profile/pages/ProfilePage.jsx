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
import { AppShell } from '../../../components/layout/AppShell';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassBadge } from '../../../components/glass/GlassBadge';
import { GlassInput } from '../../../components/glass/GlassInput';
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
    <div className={`${cls} rounded-full bg-zen-brand flex items-center justify-center font-bold text-white shadow-zen shrink-0`}>
      {initials}
    </div>
  );
}

// ── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, tone }) {
  const TONES = {
    brand:   'bg-zen/15 text-zen dark:text-indigo-300',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    amber:   'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    violet:  'bg-violet-500/15 text-violet-600 dark:text-violet-300',
  };
  return (
    <div className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border border-glass-light-border dark:border-glass-dark-border ${TONES[tone] ?? TONES.brand}`}>
      <Icon size={18} className="opacity-80" />
      <span className="font-bold text-xl tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wide opacity-70">{label}</span>
    </div>
  );
}

// ── Achievement badge ────────────────────────────────────────────────────────
function Achievement({ icon, label, unlocked }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
      unlocked
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
        : 'border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 text-zen-ink/40 dark:text-white/30 opacity-60 grayscale'
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-zen-ink/60 dark:text-white/60 hover:text-zen-ink dark:hover:text-white transition-colors">
          <ArrowLeft size={14} /> <Trans>Dashboard</Trans>
        </Link>

        {/* ── Passport card ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-zen via-zen-violet to-emerald-400" />

            <div className="px-6 py-6">
              <div className="flex items-center gap-5 mb-6">
                <AvatarLetters name={displayName} size="lg" />
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-zen-ink dark:text-white text-xl truncate">
                    {displayName ?? user.email}
                  </h1>
                  <p className="text-sm text-zen-ink/60 dark:text-white/60 truncate">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {isPro
                      ? <GlassBadge tone="warning"><Zap size={10} />Pro</GlassBadge>
                      : <GlassBadge tone="neutral"><Trans>Free</Trans></GlassBadge>
                    }
                    {isAdmin && <GlassBadge tone="brand"><Shield size={10} />Admin</GlassBadge>}
                    {passed > 0 && <GlassBadge tone="success"><Trophy size={10} />{passed === 1 ? t`${passed} aprobado` : t`${passed} aprobados`}</GlassBadge>}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-2">
                <StatPill icon={BookOpen} label={t`Exámenes`}   value={totalExams}     tone="brand" />
                <StatPill icon={Trophy}   label={t`Aprobados`}  value={passed}         tone="success" />
                <StatPill icon={Target}   label={t`Promedio`}   value={`${avgScore}%`} tone="amber" />
                <StatPill icon={Star}     label={t`Mejor nota`} value={`${bestScore}%`} tone="violet" />
              </div>

              {/* Pass rate bar */}
              {totalExams > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-zen-ink/60 dark:text-white/60 mb-1.5">
                    <span><Trans>Tasa de aprobación</Trans></span>
                    <span className="font-semibold">{passRate}%</span>
                  </div>
                  <div className="h-1.5 bg-glass-light-2 dark:bg-glass-dark-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passRate}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      className="h-full bg-zen-brand rounded-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Datos de cuenta ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-5 space-y-4">
          <h2 className="font-bold text-zen-ink dark:text-white text-sm"><Trans>Datos de cuenta</Trans></h2>

          {/* Nombre */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zen/15 dark:bg-zen/25 flex items-center justify-center shrink-0">
                <User size={15} className="text-zen dark:text-indigo-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zen-ink/50 dark:text-white/50 mb-0.5"><Trans>Nombre</Trans></p>
                {editingName ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <GlassInput
                      autoFocus
                      value={nameValue}
                      onChange={(e) => { setNameValue(e.target.value); setNameError(null); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') cancelEdit(); }}
                      maxLength={40}
                      className="h-8 min-h-0 w-48"
                    />
                    <button onClick={saveName} disabled={savingName}
                      className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 flex items-center justify-center transition-colors">
                      <Check size={14} />
                    </button>
                    <button onClick={cancelEdit}
                      className="w-8 h-8 rounded-lg bg-glass-light-2 dark:bg-glass-dark-2 text-zen-ink/50 dark:text-white/50 hover:bg-zen-danger/10 hover:text-zen-danger flex items-center justify-center transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-zen-ink dark:text-white">{displayName}</p>
                )}
                {nameError && <p className="text-xs text-zen-danger mt-1">{nameError}</p>}
              </div>
            </div>
            {!editingName && (
              <button onClick={startEdit}
                className="shrink-0 w-8 h-8 rounded-lg border border-glass-light-border dark:border-glass-dark-border text-zen-ink/50 dark:text-white/50 hover:text-zen dark:hover:text-indigo-300 hover:border-zen/40 flex items-center justify-center transition-all">
                <Pencil size={13} />
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-violet-600 dark:text-violet-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zen-ink/50 dark:text-white/50 mb-0.5"><Trans>Correo electrónico</Trans></p>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-zen-ink dark:text-white truncate">{user.email}</p>
                {user.emailVerified
                  ? <GlassBadge tone="success"><Trans>Verificado</Trans></GlassBadge>
                  : <GlassBadge tone="warning"><Trans>Sin verificar</Trans></GlassBadge>
                }
              </div>
            </div>
          </div>

          {/* Proveedor */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
              <Shield size={15} className="text-amber-600 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-zen-ink/50 dark:text-white/50 mb-0.5"><Trans>Método de acceso</Trans></p>
              <p className="text-sm font-medium text-zen-ink dark:text-white capitalize">
                {user.providerData?.[0]?.providerId === 'google.com' ? t`🔵 Google` : t`🔑 Email y contraseña`}
              </p>
            </div>
          </div>

          {/* Miembro desde */}
          {user.metadata?.creationTime && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-emerald-600 dark:text-emerald-300" />
              </div>
              <div>
                <p className="text-xs text-zen-ink/50 dark:text-white/50 mb-0.5"><Trans>Miembro desde</Trans></p>
                <p className="text-sm font-medium text-zen-ink dark:text-white">
                  {new Date(user.metadata.creationTime).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
          </GlassCard>
        </motion.div>

        {/* ── Facturación ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-5 space-y-4">
          <h2 className="font-bold text-zen-ink dark:text-white text-sm flex items-center gap-2">
            <CreditCard size={15} className="text-zen-ink/50 dark:text-white/50" /> <Trans>Suscripción y facturación</Trans>
          </h2>

          {/* Plan header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPro ? 'bg-zen-brand' : 'bg-glass-light-2 dark:bg-glass-dark-2'
              }`}>
                <Zap size={17} className={isPro ? 'text-white' : 'text-zen-ink/40 dark:text-white/40'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zen-ink dark:text-white">
                  {isPro ? t`CertZen Pro` : t`Plan Gratuito`}
                </p>
                <p className="text-xs text-zen-ink/60 dark:text-white/60">
                  {isPro ? t`Acceso completo · Sin restricciones` : t`3 exámenes/mes · Funciones básicas`}
                </p>
              </div>
            </div>
            <GlassBadge tone={isPro ? 'warning' : 'neutral'}>
              {subscriptionStatus === 'past_due' ? t`Pago pendiente`
               : subscriptionStatus === 'on_hold'  ? t`En espera`
               : subscriptionStatus === 'cancelled' ? t`Cancelada`
               : isPro ? t`Activo` : t`Free`}
            </GlassBadge>
          </div>

          {/* Features del plan */}
          <div className="rounded-xl border border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 p-4 space-y-2">
            {(isPro
              ? [t`Exámenes ilimitados`, t`Historial completo`, t`Análisis por dominio`, t`Crea y comparte sets`, t`Acceso anticipado a nuevas certs`]
              : [t`3 exámenes por mes`, t`Acceso a certificaciones oficiales`, t`Resultados básicos`]
            ).map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs text-zen-ink/60 dark:text-white/60">
                <Check size={12} className="text-emerald-500 shrink-0" /> {f}
              </div>
            ))}
          </div>

          {/* Subscription dates (only for Pro) */}
          {isPro && (subscriptionStartedAt || subscriptionRenewsAt) && (
            <div className="grid grid-cols-2 gap-3">
              {subscriptionStartedAt && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border">
                  <Clock size={13} className="text-zen-ink/40 dark:text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-zen-ink/40 dark:text-white/40"><Trans>Inicio</Trans></p>
                    <p className="text-xs font-medium text-zen-ink dark:text-white">{formatDate(subscriptionStartedAt)}</p>
                  </div>
                </div>
              )}
              {subscriptionRenewsAt && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border">
                  <RefreshCw size={13} className="text-zen-ink/40 dark:text-white/40 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-zen-ink/40 dark:text-white/40"><Trans>Próxima renovación</Trans></p>
                    <p className="text-xs font-medium text-zen-ink dark:text-white">{formatDate(subscriptionRenewsAt)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Past-due / on-hold warning */}
          {(subscriptionStatus === 'past_due' || subscriptionStatus === 'on_hold') && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-zen-ink/60 dark:text-white/60">
                <Trans>Hubo un problema con tu último pago. Tu acceso Pro sigue activo por ahora, pero actualiza tu método de pago para evitar interrupciones.</Trans>
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
                className="flex items-center gap-2 text-xs text-zen-ink/60 dark:text-white/60 hover:text-zen-ink dark:hover:text-white transition-colors"
              >
                <Receipt size={13} />
                <Trans>Historial de pagos</Trans>
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
                    <div className="mt-3 rounded-xl border border-glass-light-border dark:border-glass-dark-border overflow-hidden">
                      {paymentsLoading ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-zen-ink/50 dark:text-white/50 text-xs">
                          <RefreshCw size={13} className="animate-spin" /> <Trans>Cargando...</Trans>
                        </div>
                      ) : paymentsError ? (
                        <div className="flex items-center gap-2 px-4 py-3 text-xs text-zen-danger">
                          <AlertTriangle size={13} /> {paymentsError}
                        </div>
                      ) : payments.length === 0 ? (
                        <p className="px-4 py-3 text-xs text-zen-ink/50 dark:text-white/50"><Trans>No hay pagos registrados.</Trans></p>
                      ) : (
                        <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[420px]">
                          <thead>
                            <tr className="border-b border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1">
                              <th className="text-left px-4 py-2 font-medium text-zen-ink/50 dark:text-white/50"><Trans>Fecha</Trans></th>
                              <th className="text-left px-4 py-2 font-medium text-zen-ink/50 dark:text-white/50"><Trans>Monto</Trans></th>
                              <th className="text-left px-4 py-2 font-medium text-zen-ink/50 dark:text-white/50"><Trans>Estado</Trans></th>
                              <th className="px-4 py-2" />
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((p) => (
                              <tr key={p.payment_id} className="border-b border-glass-light-border dark:border-glass-dark-border last:border-0 hover:bg-glass-light-1 dark:hover:bg-glass-dark-1 transition-colors">
                                <td className="px-4 py-2.5 text-zen-ink/60 dark:text-white/60">{formatDate(p.created_at)}</td>
                                <td className="px-4 py-2.5 text-zen-ink dark:text-white font-medium">
                                  {p.currency?.toUpperCase()} {((p.total_amount ?? 0) / 100).toFixed(2)}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                    p.status === 'succeeded' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : p.status === 'failed'   ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                    : 'bg-glass-light-2 dark:bg-glass-dark-2 text-zen-ink/50 dark:text-white/50'
                                  }`}>
                                    {p.status === 'succeeded' ? t`Exitoso`
                                     : p.status === 'failed'   ? t`Fallido`
                                     : p.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5">
                                  {p.receipt_url && (
                                    <a href={p.receipt_url} target="_blank" rel="noopener noreferrer"
                                       className="inline-flex items-center gap-1 text-zen dark:text-indigo-300 hover:underline transition-colors">
                                      <ExternalLink size={11} /> <Trans>Recibo</Trans>
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
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
            <div className="border-t border-glass-light-border dark:border-glass-dark-border pt-4">
              {!confirmCancel ? (
                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="text-xs text-zen-ink/50 dark:text-white/50 hover:text-zen-danger transition-colors flex items-center gap-1.5"
                >
                  <X size={12} /> <Trans>Cancelar renovación automática</Trans>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zen-ink/60 dark:text-white/60">
                    <Trans>¿Estás seguro? Tu plan Pro se mantendrá activo hasta</Trans>{' '}
                    <strong>{formatDate(subscriptionRenewsAt)}</strong>,{' '}
                    <Trans>pero no se renovará.</Trans>
                  </p>
                  {cancelError && (
                    <p className="text-xs text-zen-danger">{cancelError}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={cancelling}
                      onClick={handleCancelRenewal}
                      className="px-3 py-1.5 rounded-lg bg-zen-danger/10 text-zen-danger text-xs font-medium hover:bg-zen-danger/20 transition-colors disabled:opacity-50"
                    >
                      {cancelling ? t`Cancelando...` : t`Sí, cancelar`}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setConfirmCancel(false); setCancelError(null); }}
                      className="px-3 py-1.5 rounded-lg border border-glass-light-border dark:border-glass-dark-border text-zen-ink/60 dark:text-white/60 text-xs hover:text-zen-ink dark:hover:text-white transition-colors"
                    >
                      <Trans>Mantener plan</Trans>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancellation confirmed + reactivate option */}
          {(cancelSuccess || subscriptionStatus === 'cancelled') && !reactivateSuccess && (
            <div className="border-t border-glass-light-border dark:border-glass-dark-border pt-4 space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border">
                <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-zen-ink/60 dark:text-white/60">
                  <Trans>Renovación cancelada. Tu acceso Pro continúa hasta</Trans>{' '}
                  <strong>{formatDate(subscriptionRenewsAt)}</strong>.
                </p>
              </div>
              {reactivateError && (
                <p className="text-xs text-zen-danger">{reactivateError}</p>
              )}
              <button
                type="button"
                disabled={reactivating}
                onClick={handleReactivateRenewal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zen/10 text-zen dark:text-indigo-300 text-xs font-medium hover:bg-zen/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={reactivating ? 'animate-spin' : ''} />
                {reactivating ? t`Reactivando...` : t`Reactivar renovación automática`}
              </button>
            </div>
          )}

          {/* Reactivation confirmed */}
          {reactivateSuccess && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-xs text-zen-ink/60 dark:text-white/60">
                <Trans>¡Renovación reactivada! Tu plan Pro se renovará el</Trans>{' '}
                <strong>{formatDate(subscriptionRenewsAt)}</strong>.
              </p>
            </div>
          )}

          {/* Upgrade CTA for free users */}
          {!isPro && (
            <Link
              to="/pricing"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-zen-brand text-white text-sm font-semibold rounded-zen shadow-zen hover:brightness-110 transition-all"
            >
              <Zap size={14} /> <Trans>Ver planes y precios</Trans>
            </Link>
          )}
          </GlassCard>
        </motion.div>

        {/* ── Quick actions ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-5">
          <h2 className="font-bold text-zen-ink dark:text-white text-sm mb-3"><Trans>Acceso rápido</Trans></h2>
          <div className="grid grid-cols-3 gap-3">
            <Link to="/" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 hover:bg-zen/10 hover:border-zen/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-zen/15 dark:bg-zen/25 flex items-center justify-center group-hover:bg-zen/25 transition-colors">
                <Target size={17} className="text-zen dark:text-indigo-300" />
              </div>
              <span className="text-xs font-semibold text-zen-ink/60 dark:text-white/60 group-hover:text-zen-ink dark:group-hover:text-white leading-tight"><Trans>Tomar examen</Trans></span>
            </Link>
            <Link to="/explore" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center group-hover:bg-violet-500/25 transition-colors">
                <Search size={17} className="text-violet-600 dark:text-violet-300" />
              </div>
              <span className="text-xs font-semibold text-zen-ink/60 dark:text-white/60 group-hover:text-zen-ink dark:group-hover:text-white leading-tight"><Trans>Explorar sets</Trans></span>
            </Link>
            <Link to="/create-exam" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-glass-light-border dark:border-glass-dark-border bg-glass-light-1 dark:bg-glass-dark-1 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all text-center group">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors">
                <Plus size={17} className="text-emerald-600 dark:text-emerald-300" />
              </div>
              <span className="text-xs font-semibold text-zen-ink/60 dark:text-white/60 group-hover:text-zen-ink dark:group-hover:text-white leading-tight"><Trans>Crear set</Trans></span>
            </Link>
          </div>
          </GlassCard>
        </motion.div>

        {/* ── Achievements ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <GlassCard className="p-5">
          <h2 className="font-bold text-zen-ink dark:text-white text-sm mb-4 flex items-center gap-2"><Trophy size={15} className="text-amber-500" /> <Trans>Logros</Trans></h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {achievements.map((a) => (
              <Achievement key={a.label} {...a} />
            ))}
          </div>
          </GlassCard>
        </motion.div>

        {/* ── Por certificación ── */}
        {certStats.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard className="p-5">
            <h2 className="font-bold text-zen-ink dark:text-white text-sm mb-4"><Trans>Rendimiento por certificación</Trans></h2>
            <div className="space-y-3">
              {certStats.map((c) => (
                <div key={c.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zen-ink dark:text-white truncate pr-2">{c.title}</span>
                    <span className="text-zen-ink/50 dark:text-white/50 shrink-0">
                      {t`${c.avgPct}% prom · ${c.passed}/${c.count} aprobados`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-glass-light-2 dark:bg-glass-dark-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.avgPct}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        c.avgPct >= 80 ? 'bg-emerald-500' :
                        c.avgPct >= 60 ? 'bg-zen' :
                        'bg-rose-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Historial completo ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-zen-ink dark:text-white text-sm"><Trans>Historial de exámenes</Trans></h2>
            {totalExams > 0 && (
              <span className="text-xs text-zen-ink/50 dark:text-white/50">{totalExams === 1 ? t`${totalExams} examen` : t`${totalExams} exámenes`}</span>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-glass-light-2 dark:bg-glass-dark-2 animate-pulse" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-zen-ink/60 dark:text-white/60"><Trans>Aún no has tomado ningún examen.</Trans></p>
              <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-zen dark:text-indigo-300 hover:underline font-semibold">
                <Target size={14} /> <Trans>Empezar ahora</Trans>
              </Link>
            </div>
          ) : (
            <>
              <div className="divide-y divide-glass-light-border dark:divide-glass-dark-border">
                {visibleAttempts.map((attempt) => {
                  const pct = Math.round((attempt.score / attempt.total) * 100);
                  const isPassed = pct >= (attempt.passPercent ?? 72);
                  const date = attempt.createdAt?.toDate?.();
                  return (
                    <div key={attempt.id} className="flex items-center justify-between py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zen-ink dark:text-white truncate">{attempt.certTitle ?? attempt.certId}</p>
                        <p className="text-xs text-zen-ink/50 dark:text-white/50">
                          {date ? date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          {attempt.total && <span className="ml-2 opacity-60">{t`${attempt.score}/${attempt.total} correctas`}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className="text-sm font-bold tabular-nums text-zen-ink dark:text-white">{pct}%</span>
                        <GlassBadge tone={isPassed ? 'success' : 'danger'}>{isPassed ? t`Aprobado` : t`No aprobado`}</GlassBadge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {attempts.length > HISTORY_PREVIEW && (
                <button
                  onClick={() => setShowAllHistory((v) => !v)}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-zen-ink/60 dark:text-white/60 hover:text-zen-ink dark:hover:text-white py-2 border border-glass-light-border dark:border-glass-dark-border rounded-lg hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-all"
                >
                  {showAllHistory
                    ? <><ChevronUp size={13} /> <Trans>Ver menos</Trans></>
                    : <><ChevronDown size={13} /> {t`Ver todos (${attempts.length - HISTORY_PREVIEW} más)`}</>
                  }
                </button>
              )}
            </>
          )}
          </GlassCard>
        </motion.div>

        {/* Sign out */}
        <div className="text-center pb-6">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-zen-ink/60 dark:text-white/60 hover:text-zen-danger transition-colors"
          >
            <Trans>Cerrar sesión</Trans>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
