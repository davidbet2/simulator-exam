import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { Trophy, Star, Zap, Target, Clock, ArrowLeft, BookOpen } from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { Badge } from '../../../components/ui/Badge';

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
  const navigate = useNavigate();
  const { user, displayName, logout } = useAuthStore();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return; }
    const q = query(
      collection(db, 'attempts'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    getDocs(q)
      .then((snap) => setAttempts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {})
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

  // ── Achievements ───────────────────────────────────────────────────────────
  const achievements = [
    { icon: '🎯', label: 'Primer examen',  unlocked: totalExams >= 1 },
    { icon: '🔥', label: '5 exámenes',     unlocked: totalExams >= 5 },
    { icon: '⚡', label: '10 exámenes',    unlocked: totalExams >= 10 },
    { icon: '🏆', label: 'Primer aprobado',unlocked: passed >= 1 },
    { icon: '💎', label: 'Nota perfecta',  unlocked: bestScore === 100 },
    { icon: '🌟', label: '80%+ promedio',  unlocked: avgScore >= 80 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-brand-600/15 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-purple-600/10 blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 relative">
        {/* Back nav */}
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink-soft transition-colors">
          <ArrowLeft size={14} /> Dashboard
        </Link>

        {/* Passport card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-bright rounded-2xl border border-surface-border shadow-card overflow-hidden"
        >
          {/* Card header bar */}
          <div className="h-2 bg-gradient-to-r from-brand-500 via-purple-500 to-success-500" />

          <div className="px-6 py-6">
            <div className="flex items-center gap-5 mb-6">
              <AvatarLetters name={displayName} size="lg" />
              <div className="min-w-0">
                <h1 className="font-display font-bold text-ink text-xl truncate">
                  {displayName ?? user.email}
                </h1>
                <p className="text-sm text-ink-soft truncate">{user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="pro"><Zap size={10} />CertZen</Badge>
                  {passed > 0 && <Badge variant="success"><Trophy size={10} />{passed} aprobados</Badge>}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-2">
              <StatPill icon={BookOpen}  label="Exámenes"    value={totalExams} color="bg-brand-500/15 text-brand-300 border-brand-500/20" />
              <StatPill icon={Trophy}    label="Aprobados"   value={passed}     color="bg-success-500/15 text-success-400 border-success-500/20" />
              <StatPill icon={Target}    label="% Promedio"  value={`${avgScore}%`} color="bg-amber-500/15 text-amber-300 border-amber-500/20" />
              <StatPill icon={Star}      label="Mejor nota"  value={`${bestScore}%`} color="bg-purple-500/15 text-purple-300 border-purple-500/20" />
            </div>

            {/* Pass rate bar */}
            {totalExams > 0 && (
              <div className="mt-5">
                <div className="flex justify-between text-xs text-ink-soft mb-1.5">
                  <span>Tasa de aprobación</span>
                  <span className="text-ink-soft font-semibold">{passRate}%</span>
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

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl border border-surface-border p-5"
        >
          <h2 className="font-display font-bold text-ink text-sm mb-4">Logros</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {achievements.map((a) => (
              <Achievement key={a.label} {...a} />
            ))}
          </div>
        </motion.div>

        {/* Recent attempts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl border border-surface-border p-5"
        >
          <h2 className="font-display font-bold text-ink text-sm mb-4">Historial de exámenes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-surface-muted animate-pulse" />
              ))}
            </div>
          ) : attempts.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-6">Aún no has tomado ningún examen.</p>
          ) : (
            <div className="space-y-0 divide-y divide-surface-border">
              {attempts.slice(0, 10).map((attempt) => {
                const pct = Math.round((attempt.score / attempt.total) * 100);
                const isPassed = pct >= (attempt.passPercent ?? 72);
                const date = attempt.createdAt?.toDate?.();
                return (
                  <div key={attempt.id} className="flex items-center justify-between py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{attempt.certTitle ?? attempt.certId}</p>
                      <p className="text-xs text-ink-soft">
                        {date ? date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span className="text-sm font-bold tabular-nums text-ink">{pct}%</span>
                      <Badge variant={isPassed ? 'success' : 'danger'}>{isPassed ? 'Aprobado' : 'No aprobado'}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Sign out */}
        <div className="text-center pb-6">
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-ink-soft hover:text-danger-400 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
