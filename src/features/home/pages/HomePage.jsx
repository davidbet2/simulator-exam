import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  collection, query, where, orderBy, limit, getDocs, doc, getDoc,
} from 'firebase/firestore';
import {
  Sparkles, Bookmark, ArrowUpRight, BookOpen, TrendingUp,
  Plus, Star, Flame, Target, Compass,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useTranslation } from '../../../core/i18n';
import { Trans, useLingui, Plural } from '@lingui/react/macro';
import { AppShell } from '../../../components/layout/AppShell';
import { SEOHead } from '../../../components/SEOHead';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';
import { GlassBadge } from '../../../components/glass/GlassBadge';
import { getDomain, DOMAINS } from '../../../core/constants/domains';
import robotHeroDark320 from '../../../assets/mascot/robot-hero-dark-320.webp';
import robotHeroDark640 from '../../../assets/mascot/robot-hero-dark-640.webp';
import robotHeroLight320 from '../../../assets/mascot/robot-hero-light-320.webp';
import robotHeroLight640 from '../../../assets/mascot/robot-hero-light-640.webp';

function greetingKey() {
  const h = new Date().getHours();
  if (h < 12) return 'home.greeting.morning';
  if (h < 19) return 'home.greeting.afternoon';
  return 'home.greeting.evening';
}

// Tinte por dominio para las cajas de ícono (fiel a los colores de `App Inicio`)
const DOMAIN_TINTS = {
  blue:    'bg-sky-500/15 text-sky-600 dark:text-sky-300',
  indigo:  'bg-zen/15 text-zen dark:text-indigo-300',
  red:     'bg-red-500/15 text-red-600 dark:text-red-300',
  violet:  'bg-violet-500/15 text-violet-600 dark:text-violet-300',
  rose:    'bg-pink-500/15 text-pink-600 dark:text-pink-300',
  emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
  amber:   'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  lime:    'bg-lime-500/15 text-lime-600 dark:text-lime-300',
  slate:   'bg-glass-light-2 text-zen-ink/60 dark:bg-glass-dark-2 dark:text-white/60',
};

// ── Set card ────────────────────────────────────────────────────────────────
function SetCard({ set }) {
  const domain = getDomain(set.domain);
  const ratingCount = set.ratingCount ?? 0;
  const ratingAvg = ratingCount > 0 ? (set.ratingSum ?? 0) / ratingCount : 0;

  return (
    <Link to={`/exam-sets/${set.id}`} className="block h-full">
      <GlassCard className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-zen/40">
        <div className="flex items-start justify-between gap-2">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${DOMAIN_TINTS[domain.color] ?? DOMAIN_TINTS.slate}`} aria-hidden>
            {domain.icon}
          </span>
          {set.official && <GlassBadge tone="warning"><Trans>Oficial</Trans></GlassBadge>}
        </div>
        <div className="mt-auto">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zen-ink/50 dark:text-white/40 mb-1">
            {domain.label}
          </p>
          <h3 className="text-sm font-bold text-zen-ink dark:text-white leading-snug line-clamp-2">
            {set.title}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-zen-ink/50 dark:text-white/40">
            <span className="inline-flex items-center gap-1">
              <BookOpen size={12} />
              {set.questionCount ?? '?'}
            </span>
            {ratingCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                {ratingAvg.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

// ── Category tile ──────────────────────────────────────────────────────────
function CategoryTile({ domain }) {
  return (
    <Link to={`/explore/${domain.id}`}>
      <GlassCard className="flex flex-col items-center justify-center gap-2.5 p-4 hover:border-zen/40 transition-colors">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${DOMAIN_TINTS[domain.color] ?? DOMAIN_TINTS.slate}`} aria-hidden>
          {domain.icon}
        </span>
        <span className="text-xs font-semibold text-zen-ink/80 dark:text-white/80 text-center leading-tight">
          {domain.label}
        </span>
      </GlassCard>
    </Link>
  );
}

function SectionHeader({ title, icon: Icon, cta }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-lg font-bold text-zen-ink dark:text-white flex items-center gap-2">
        {Icon && <Icon size={18} className="text-zen dark:text-indigo-300" />}
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
          favSlugs.slice(0, 3).map(async (slug) => {
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
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zen dark:text-indigo-300 mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  {greeting}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-zen-ink dark:text-white leading-tight">
                  <Trans>Hola,</Trans>{' '}
                  <span className="bg-zen-brand bg-clip-text text-transparent">
                    {displayName ?? tMacro`estudiante`}
                  </span>
                </h1>
                <p className="text-zen-ink/60 dark:text-white/60 mt-2 text-sm sm:text-base max-w-lg">
                  <Trans>Retoma tu progreso o descubre nuevos exámenes. Tu próxima certificación está a un intento de distancia.</Trans>
                </p>

                {user && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border px-3 py-1.5 text-xs font-semibold text-zen-ink dark:text-white">
                      <Flame size={13} className="text-rose-500" />
                      <Plural value={stats.streak} one="# día seguido" other="# días seguidos" />
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border px-3 py-1.5 text-xs font-semibold text-zen-ink dark:text-white">
                      <Target size={13} className="text-emerald-500" />
                      <Trans>{stats.avgScore}% promedio</Trans>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border px-3 py-1.5 text-xs font-semibold text-zen-ink dark:text-white">
                      <BookOpen size={13} className="text-zen dark:text-indigo-300" />
                      <Trans>{stats.attempts} intentos</Trans>
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-5">
                  <GlassButton onClick={() => navigate('/explore')}>
                    <Compass size={14} /> <Trans>Explorar exámenes</Trans>
                  </GlassButton>
                  <GlassButton variant="secondary" onClick={() => navigate('/create-exam')}>
                    <Plus size={14} /> <Trans>Crear set</Trans>
                  </GlassButton>
                </div>
              </div>

              <div className="hidden sm:block shrink-0">
                <div className="relative h-40 w-40 select-none overflow-hidden rounded-full border border-glass-light-border shadow-zen-glass dark:border-glass-dark-border" aria-hidden="true">
                  <img
                    src={robotHeroLight320}
                    srcSet={`${robotHeroLight320} 320w, ${robotHeroLight640} 640w`}
                    sizes="160px"
                    alt=""
                    className="h-full w-full object-cover dark:hidden"
                    width="320"
                    height="320"
                  />
                  <img
                    src={robotHeroDark320}
                    srcSet={`${robotHeroDark320} 320w, ${robotHeroDark640} 640w`}
                    sizes="160px"
                    alt=""
                    className="hidden h-full w-full object-cover dark:block"
                    width="320"
                    height="320"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Categories */}
        <section>
          <SectionHeader title={tMacro`Explora por categoría`} icon={Compass} />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {DOMAINS.map((d) => <CategoryTile key={d.id} domain={d} />)}
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-glass-light-2 dark:bg-glass-dark-2 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {favorites.length > 0 && (
              <section>
                <SectionHeader title={t('home.favorites')} icon={Bookmark} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((s) => <SetCard key={s.id} set={s} />)}
                </div>
              </section>
            )}

            <section>
              <SectionHeader
                title={t('home.recommended')}
                icon={TrendingUp}
                cta={
                  <Link to="/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-zen dark:text-indigo-300 hover:underline">
                    <Trans>Explorar todo</Trans>
                    <ArrowUpRight size={13} />
                  </Link>
                }
              />
              {recommended.length === 0 ? (
                <GlassCard className="p-10 text-center">
                  <BookOpen size={40} className="text-zen-ink/30 dark:text-white/30 mx-auto mb-3" />
                  <p className="text-sm text-zen-ink/60 dark:text-white/60 mb-4"><Trans>No hay recomendaciones por ahora.</Trans></p>
                  <GlassButton onClick={() => navigate('/explore')}><Trans>Explorar exámenes</Trans></GlassButton>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map((s) => <SetCard key={s.id} set={s} />)}
                </div>
              )}
            </section>

            {user && favorites.length === 0 && (
              <GlassCard className="p-8 text-center">
                <Sparkles size={40} className="text-zen dark:text-indigo-300 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-zen-ink dark:text-white"><Trans>Empieza a estudiar</Trans></h3>
                <p className="text-sm text-zen-ink/60 dark:text-white/60 mt-1 max-w-md mx-auto">
                  <Trans>Marca sets como favoritos o empieza un examen para ver tu progreso aquí.</Trans>
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <GlassButton onClick={() => navigate('/explore')}>
                    <BookOpen size={14} /><Trans>Explorar</Trans>
                  </GlassButton>
                  <GlassButton variant="secondary" onClick={() => navigate('/create-exam')}>
                    <Plus size={14} /><Trans>Crear set</Trans>
                  </GlassButton>
                </div>
              </GlassCard>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
