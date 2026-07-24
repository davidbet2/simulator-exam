import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Crown, Activity, Library,
  TrendingUp, AlertTriangle, ScrollText, Flag, ArrowUpRight,
} from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAdmin } from '../hooks/useAdmin';
import { GlassCard } from '../../../components/glass/GlassCard';

const TONES = {
  brand:   'bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300',
  amber:   'bg-zen-warning/15 text-amber-600 dark:text-zen-warning',
  emerald: 'bg-zen-success/15 text-emerald-600 dark:text-zen-success',
  rose:    'bg-zen-danger/15 text-rose-600 dark:text-zen-danger',
  violet:  'bg-zen-violet/15 text-zen-violet dark:text-violet-300',
};

function Kpi({ label, value, sub, icon: Icon, tone = 'brand', to }) {
  const content = (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="p-5 hover:shadow-zen-glass transition-shadow">
        <div className="mb-3 flex items-start justify-between">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${TONES[tone] ?? TONES.brand}`}>
            <Icon size={16} />
          </span>
          {to && <ArrowUpRight size={14} className="text-zen-ink/40 dark:text-white/40" />}
        </div>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs text-zen-ink/60 dark:text-white/60">{label}</p>
        {sub && <p className="mt-1 text-[11px] text-zen-ink/40 dark:text-white/40">{sub}</p>}
      </GlassCard>
    </motion.div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function QuickLink({ to, icon: Icon, label, desc }) {
  return (
    <Link to={to} className="group">
      <GlassCard className="p-4 hover:shadow-zen-glass transition-all" variant="subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zen/15 text-zen transition-colors group-hover:bg-zen/25 dark:bg-zen/25 dark:text-indigo-300">
            <Icon size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{label}</p>
            <p className="truncate text-[11px] text-zen-ink/50 dark:text-white/50">{desc}</p>
          </div>
          <ArrowUpRight size={14} className="text-zen-ink/40 transition-colors group-hover:text-zen dark:text-white/40" />
        </div>
      </GlassCard>
    </Link>
  );
}

export function AdminDashboardPage() {
  const { fetchDashboardKPIs } = useAdmin();
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardKPIs().then((data) => {
      setKpis(data);
      setLoading(false);
    });
  }, [fetchDashboardKPIs]);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Panorama operativo de la plataforma. Métricas de usuarios, intentos y contenido."
    >
      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-glass-light-2 dark:bg-glass-dark-2" />
          ))}
        </div>
      ) : !kpis ? (
        <GlassCard className="p-8 text-center">
          <AlertTriangle size={28} className="mx-auto mb-2 text-zen-danger" />
          <p className="text-sm text-zen-ink/60 dark:text-white/60">No se pudieron cargar las métricas.</p>
        </GlassCard>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi icon={Users}          label="Usuarios totales"     value={kpis.totalUsers}    sub={`+${kpis.newUsers7d} últimos 7 días`} tone="brand"   to="/admin/users" />
            <Kpi icon={Crown}          label="Usuarios Pro"         value={kpis.proUsers}      sub={`${kpis.conversionPct}% conversión`}  tone="amber"   to="/admin/users" />
            <Kpi icon={Activity}       label="Intentos últimas 24h" value={kpis.attempts24h}   sub={`${kpis.attempts7d} últimos 7 días`}  tone="emerald" to="/admin/attempts" />
            <Kpi icon={AlertTriangle}  label="Usuarios baneados"    value={kpis.bannedUsers}   sub={kpis.bannedUsers > 0 ? 'Revisar' : 'Sin incidencias'} tone="rose" to="/admin/users" />
          </div>

          <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi icon={Library}       label="Sets publicados"   value={kpis.publishedSets}  sub={`${kpis.totalSets} totales`} tone="violet"  to="/admin/exam-sets" />
            <Kpi icon={TrendingUp}    label="Intentos totales"   value={kpis.totalAttempts}  tone="emerald" to="/admin/attempts" />
            <Kpi icon={Users}         label="Nuevos (30 días)"   value={kpis.newUsers30d}    tone="brand" />
          </div>

          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-zen-ink/40 dark:text-white/40">
            Gestión rápida
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink to="/admin/users"          icon={Users}         label="Usuarios"         desc="Buscar, banear, cambiar plan" />
            <QuickLink to="/admin/exam-sets"      icon={Library}       label="Sets comunidad"   desc="Moderar contenido publicado" />
            <QuickLink to="/admin/attempts"       icon={Activity}      label="Intentos"         desc="Auditar intentos de examen" />
            <QuickLink to="/admin/flags"          icon={Flag}          label="Feature flags"    desc="Activar/desactivar features" />
            <QuickLink to="/admin/audit-log"      icon={ScrollText}    label="Audit log"        desc="Historial de acciones admin" />
          </div>
        </>
      )}
    </AdminShell>
  );
}
