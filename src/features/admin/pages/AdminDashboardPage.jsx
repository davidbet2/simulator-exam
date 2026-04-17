import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Crown, Activity, Library,
  TrendingUp, AlertTriangle, ScrollText, Flag, ArrowUpRight,
} from 'lucide-react';
import { AdminShell } from '../components/AdminShell';
import { useAdmin } from '../hooks/useAdmin';

function Kpi({ label, value, sub, icon: Icon, tone = 'brand', to }) {
  const TONES = {
    brand:   'text-brand-700 border-brand-500/20',
    amber:   'text-amber-700 border-amber-500/20',
    emerald: 'text-emerald-700 border-emerald-500/20',
    rose:    'text-rose-700 border-rose-500/20',
    violet:  'text-violet-700 border-violet-500/20',
  };
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden p-5 rounded-2xl border bg-white shadow-card hover:shadow-card-hover transition-all ${TONES[tone]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <Icon size={18} className="opacity-80" />
        {to && <ArrowUpRight size={14} className="text-ink-muted opacity-70" />}
      </div>
      <p className="font-display font-bold text-2xl text-ink tabular-nums">{value}</p>
      <p className="text-xs text-ink-soft mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-ink-muted mt-1">{sub}</p>}
    </motion.div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function QuickLink({ to, icon: Icon, label, desc }) {
  return (
    <Link
      to={to}
      className="group p-4 rounded-xl bg-white border border-surface-border hover:border-brand-500/40 hover:shadow-card transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-700 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
          <Icon size={17} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-[11px] text-ink-muted truncate">{desc}</p>
        </div>
        <ArrowUpRight size={14} className="text-ink-muted group-hover:text-brand-500 transition-colors" />
      </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface-muted animate-pulse" />
          ))}
        </div>
      ) : !kpis ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-surface-border">
          <AlertTriangle size={28} className="mx-auto text-danger-500 mb-2" />
          <p className="text-sm text-ink-soft">No se pudieron cargar las métricas.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Kpi icon={Users}          label="Usuarios totales"     value={kpis.totalUsers}    sub={`+${kpis.newUsers7d} últimos 7 días`} tone="brand"   to="/admin/users" />
            <Kpi icon={Crown}          label="Usuarios Pro"         value={kpis.proUsers}      sub={`${kpis.conversionPct}% conversión`}  tone="amber"   to="/admin/users" />
            <Kpi icon={Activity}       label="Intentos últimas 24h" value={kpis.attempts24h}   sub={`${kpis.attempts7d} últimos 7 días`}  tone="emerald" to="/admin/attempts" />
            <Kpi icon={AlertTriangle}  label="Usuarios baneados"    value={kpis.bannedUsers}   sub={kpis.bannedUsers > 0 ? 'Revisar' : 'Sin incidencias'} tone="rose" to="/admin/users" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <Kpi icon={Library}       label="Sets publicados"   value={kpis.publishedSets}  sub={`${kpis.totalSets} totales`} tone="violet"  to="/admin/exam-sets" />
            <Kpi icon={TrendingUp}    label="Intentos totales"   value={kpis.totalAttempts}  tone="emerald" to="/admin/attempts" />
            <Kpi icon={Users}         label="Nuevos (30 días)"   value={kpis.newUsers30d}    tone="brand" />
          </div>

          <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-3">
            Gestión rápida
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
