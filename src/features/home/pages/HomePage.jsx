import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  collection, query, where, orderBy, limit, getDocs, doc, getDoc,
} from 'firebase/firestore';
import {
  Sparkles, Bookmark, ArrowRight, BookOpen, TrendingUp,
  Clock, Plus, Star, Flame, Target, Compass,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useTranslation } from '../../../core/i18n';
import { Trans, useLingui, Plural } from '@lingui/react/macro';
import { AppShell } from '../../../components/layout/AppShell';
import { SEOHead } from '../../../components/SEOHead';
import { ZenDolphin } from '../../../components/mascot/ZenDolphin';
import Button from '../../../components/ui/Button';
import { getDomain, DOMAINS } from '../../../core/constants/domains';
import { AdBanner } from '../../ads/components/AdBanner';

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'home.greeting.morning';
  if (h < 19) return 'home.greeting.afternoon';
  return 'home.greeting.evening';
}

// Pastel palette rotated per card index for visual variety (Pinterest feel)
const PALETTES = [
  { bg: 'from-brand-400/20 to-sky-400/20',       ring: 'ring-brand-400/30',   chip: 'bg-brand-500/15 text-brand-700',     accent: 'text-brand-600' },
  { bg: 'from-violet-400/20 to-fuchsia-400/20',  ring: 'ring-violet-400/30',  chip: 'bg-violet-500/15 text-violet-700',   accent: 'text-violet-600' },
  { bg: 'from-amber-300/25 to-rose-300/20',      ring: 'ring-amber-400/30',   chip: 'bg-amber-500/15 text-amber-700',     accent: 'text-amber-600' },
  { bg: 'from-emerald-400/20 to-teal-400/20',    ring: 'ring-emerald-400/30', chip: 'bg-emerald-500/15 text-emerald-700', accent: 'text-emerald-600' },
  { bg: 'from-sky-400/20 to-indigo-400/20',      ring: 'ring-sky-400/30',     chip: 'bg-sky-500/15 text-sky-700',         accent: 'text-sky-600' },
  { bg: 'from-rose-400/20 to-orange-300/20',     ring: 'ring-rose-400/30',    chip: 'bg-rose-500/15 text-rose-700',       accent: 'text-rose-600' },
];

// ── Illustrated Set Card ──────────────────────────────────────────────────────
function SetCard({ set, size = 'md', index = 0 }) {
  const domain = getDomain(set.domain);
  const palette = PALETTES[index % PALETTES.length];
  const ratingCount = set.ratingCount ?? 0;
  const ratingAvg = ratingCount > 0 ? (set.ratingSum ?? 0) / ratingCount : 0;
  const heightClass = size === 'lg' ? 'min-h-[200px]' : size === 'sm' ? 'min-h-[120px]' : 'min-h-[160px]';

  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <Link
        to={`/exam-sets/${set.id}`}
        className={`group relative block overflow-hidden rounded-3xl border border-surface-border ring-1 ${palette.ring} bg-gradient-to-br ${palette.bg} p-5 ${heightClass} shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_8px_24px_-12px_rgba(0,0,0,0.15)] hover:shadow-[0_1px_0_rgba(255,255,255,0.5)_inset,0_16px_40px_-12px_rgba(0,0,0,0.25)] transition-shadow`}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/30 dark:bg-white/5 blur-2xl pointer-events-none" aria-hidden />

        <div className="relative flex flex-col h-full">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 dark:bg-surface-raised/80 text-2xl shadow-sm ring-1 ring-white/50" aria-hidden>
              {domain.icon}
            </span>
            {set.official && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${palette.chip}`}>
                <Trans>Oficial</Trans>
              </span>
            )}
          </div>

          <div className="mt-auto pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
              {domain.label}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-ink leading-snug line-clamp-2">
              {set.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-ink-soft">
              <span className="inline-flex items-center gap-1">
                <BookOpen size={12} />
                {set.questionCount ?? '?'}
              </span>
              {ratingCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star size={12} className="text-accent-amber fill-accent-amber" />
                  {ratingAvg.toFixed(1)}
                </span>
              )}
              <ArrowRight size={14} className={`ml-auto ${palette.accent} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Category pill ─────────────────────────────────────────────────────────────
function CategoryPill({ domain, index }) {
  const palette = PALETTES[index % PALETTES.length];
  return (
    <Link
      to={`/explore?domain=${domain.id}`}
      className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-surface-border bg-gradient-to-br ${palette.bg} hover:scale-105 hover:-translate-y-0.5 transition-transform shadow-sm`}
    >
      <span className="text-3xl" aria-hidden>{domain.icon}</span>
      <span className={`text-xs font-semibold ${palette.accent} text-center leading-tight`}>
        {domain.label}
      </span>
    </Link>
  );
}

function SectionHeader({ title, icon: Icon, accent = 'text-brand-500', cta }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-lg sm:text-xl font-bold text-ink flex items-center gap-2">
        {Icon && <Icon size={20} className={accent} />}
        {title}
      </h2>
      {cta}
    </div>
  );
}

export function HomePage() {
  const { user, displayName } = useAuthStore();
  const { t } = useTranslation();
  const { t: tMacro } = useLingui();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [stats, setStats] = useState({ attempts: 0, avgScore: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        const favSnap = await getDocs(collection(db, 'users', user.uid, 'favorites'));
        const favSlugs = favSnap.docs.map((d) => d.id);

        const favSets = await Promise.all(
          favSlugs.slice(0, 6).map(async (slug) => {
            const snap = await getDoc(doc(db, 'examSets', slug));
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
          }),
        );
        if (cancelled) return;
        setFavorites(favSets.filter(Boolean));

        const attSnap = await getDocs(
          query(
            collection(db, 'attempts'),
            where('uid', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(20),
          ),
        );
        const attempts = attSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const totalAttempts = attempts.length;
        const avgScore = totalAttempts > 0
          ? Math.round(attempts.reduce((s, a) => s + (a.score ?? 0), 0) / totalAttempts)
          : 0;

        const dayKeys = new Set(
          attempts
            .map((a) => a.createdAt?.toDate?.())
            .filter(Boolean)
            .map((d) => d.toISOString().slice(0, 10)),
        );
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 90; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          if (dayKeys.has(d.toISOString().slice(0, 10))) streak++;
          else if (i > 0) break;
        }
        if (cancelled) return;
        setStats({ attempts: totalAttempts, avgScore, streak });

        const seen = new Set();
        const recentSets = [];
        for (const a of attempts) {
          const key = a.setId ?? a.certId;
          if (!key || seen.has(key)) continue;
          seen.add(key);
          if (a.setId && recentSets.length < 4) {
            const s = await getDoc(doc(db, 'examSets', a.setId));
            if (s.exists()) recentSets.push({ id: s.id, ...s.data() });
          }
        }
        if (cancelled) return;
        setRecent(recentSets);

        const recSnap = await getDocs(
          query(
            collection(db, 'examSets'),
            where('published', '==', true),
            limit(20),
          ),
        );
        const recDocs = recSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((s) => !favSlugs.includes(s.id))
          .sort((a, b) => {
            if (a.official !== b.official) return b.official ? 1 : -1;
            const aR = (a.ratingCount ?? 0) > 0 ? ((a.ratingSum ?? 0) / a.ratingCount) * Math.log2(a.ratingCount + 1) : 0;
            const bR = (b.ratingCount ?? 0) > 0 ? ((b.ratingSum ?? 0) / b.ratingCount) * Math.log2(b.ratingCount + 1) : 0;
            return bR - aR;
          })
          .slice(0, 6);
        if (cancelled) return;
        setRecommended(recDocs);
        setLoading(false);
      } catch (err) {
        if (err.code === 'failed-precondition') {
          console.info('[HomePage] index still building, will resolve automatically')
        } else {
          console.error('[HomePage] load failed', err);
        }
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const greeting = t(greetingKey());

  return (
    <AppShell>
      <SEOHead
        title={tMacro`Inicio`}
        description={tMacro`Retoma tu progreso o descubre nuevos exámenes. Tu próxima certificación está a un intento de distancia.`}
        path="/home"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Hero banner */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-br from-brand-500/20 via-violet-400/10 to-amber-300/20 p-6 sm:p-8"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" aria-hidden />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 mb-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-accent-amber" />
                {greeting}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
                <Trans>Hola,</Trans>{' '}
                <span className="bg-gradient-to-r from-brand-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  {displayName ?? tMacro`estudiante`}
                </span>
              </h1>
              <p className="text-ink-soft mt-2 text-sm sm:text-base max-w-lg">
                <Trans>Retoma tu progreso o descubre nuevos exámenes. Tu próxima certificación está a un intento de distancia.</Trans>
              </p>

              {user && (
                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-surface-raised/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ink border border-surface-border">
                    <Flame size={13} className="text-rose-500" />
                    <Plural value={stats.streak} one="# día seguido" other="# días seguidos" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-surface-raised/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ink border border-surface-border">
                    <Target size={13} className="text-emerald-500" />
                    <Trans>{stats.avgScore}% promedio</Trans>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-surface-raised/70 backdrop-blur px-3 py-1.5 text-xs font-semibold text-ink border border-surface-border">
                    <BookOpen size={13} className="text-brand-500" />
                    <Trans>{stats.attempts} intentos</Trans>
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-5">
                <Button onClick={() => navigate('/explore')}>
                  <Compass size={14} /> <Trans>Explorar exámenes</Trans>
                </Button>
                <Button variant="secondary" onClick={() => navigate('/create-exam')}>
                  <Plus size={14} /> <Trans>Crear set</Trans>
                </Button>
              </div>
            </div>

            <div className="hidden sm:block shrink-0">
              <ZenDolphin size={160} bob />
            </div>
          </div>
        </motion.section>

        {/* Categories */}
        <section>
          <SectionHeader title={tMacro`Explora por categoría`} icon={Compass} accent="text-violet-500" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {DOMAINS.map((d, i) => <CategoryPill key={d.id} domain={d} index={i} />)}
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-surface-soft animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {recent.length > 0 && (
              <section>
                <SectionHeader
                  title={t('home.continue')}
                  icon={Clock}
                  accent="text-brand-500"
                  cta={
                    <Link to="/dashboard" className="text-xs font-semibold text-brand-600 hover:underline">
                      <Trans>Ver todo →</Trans>
                    </Link>
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recent.map((s, i) => <SetCard key={s.id} set={s} index={i} size="md" />)}
                </div>
              </section>
            )}

            {favorites.length > 0 && (
              <section>
                <SectionHeader title={t('home.favorites')} icon={Bookmark} accent="text-amber-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((s, i) => <SetCard key={s.id} set={s} index={i + 2} size="md" />)}
                </div>
              </section>
            )}

            <section>
              <SectionHeader
                title={t('home.recommended')}
                icon={TrendingUp}
                accent="text-emerald-500"
                cta={
                  <Link to="/explore" className="text-xs font-semibold text-brand-600 hover:underline">
                    <Trans>Explorar todo →</Trans>
                  </Link>
                }
              />
              {recommended.length === 0 ? (
                <div className="rounded-3xl border border-surface-border bg-gradient-to-br from-brand-500/5 to-violet-500/5 p-10 text-center">
                  <BookOpen size={40} className="text-ink-muted mx-auto mb-3" />
                  <p className="text-sm text-ink-soft mb-4"><Trans>No hay recomendaciones por ahora.</Trans></p>
                  <Button onClick={() => navigate('/explore')}><Trans>Explorar exámenes</Trans></Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map((s, i) => (
                    <SetCard key={s.id} set={s} index={i + 1} size={i === 0 ? 'lg' : 'md'} />
                  ))}
                </div>
              )}
            </section>

            {user && recent.length === 0 && favorites.length === 0 && (
              <section className="relative overflow-hidden rounded-3xl border border-surface-border bg-gradient-to-br from-brand-500/10 via-violet-400/10 to-sky-400/10 p-8 text-center">
                <Sparkles size={40} className="text-brand-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-ink"><Trans>Empieza a estudiar</Trans></h3>
                <p className="text-sm text-ink-soft mt-1 max-w-md mx-auto">
                  <Trans>Marca sets como favoritos o empieza un examen para ver tu progreso aquí.</Trans>
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button onClick={() => navigate('/explore')}>
                    <BookOpen size={14} /><Trans>Explorar</Trans>
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/create-exam')}>
                    <Plus size={14} /><Trans>Crear set</Trans>
                  </Button>
                </div>
              </section>
            )}
          </>
        )}

        <AdBanner
          placementId="home-bottom"
          adSlot={import.meta.env.VITE_ADSENSE_SLOT}
          className="mt-4"
        />
      </div>
    </AppShell>
  );
}
