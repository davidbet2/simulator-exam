import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trans, useLingui } from '@lingui/react/macro';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import {
  ArrowLeft, BookOpen, Clock, Target, User, Play,
  Lock, CheckCircle2, Tag, GraduationCap, Zap, TimerReset,
  Brain, TrendingDown, Sparkles, Dice5, Layers,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useUserPlan } from '../../plans/hooks/useUserPlan';
import { getDomain } from '../../../core/constants/domains';
import { fetchStatsSummary, fetchDomainMastery } from '../../exam/utils/questionStats';
import { AppShell } from '../../../components/layout/AppShell';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { PageBackground } from '../../../components/glass/PageBackground';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassBadge } from '../../../components/glass/GlassBadge';
import { GlassButton } from '../../../components/glass/GlassButton';
import { RatingStars } from '../../social/components/RatingStars';
import { FavoriteButton } from '../../social/components/FavoriteButton';
import { AuthorChip } from '../../social/components/AuthorChip';
import { SaveToFolderButton } from '../../home/components/SaveToFolderButton';
import { ShareButton } from '../../../components/ui/ShareButton';
import DomainPath from '../components/DomainPath';
import { SEOHead } from '../../../components/SEOHead';

function MetaStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-glass-light-border bg-glass-light-2 px-3 py-2.5 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-zen-ink/50 dark:text-white/40">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

// ── Study mode card ──────────────────────────────────────────────────────────
function ModeCard({
  icon: Icon, title, subtitle, description, technique, meta, ctaLabel,
  accent = 'brand', onClick, disabled = false, soon = false, highlighted = false, locked = false,
}) {
  const accentMap = {
    brand:   { ring: 'ring-zen/30',         bg: 'bg-zen/10',         text: 'text-zen'          },
    violet:  { ring: 'ring-violet-500/30',  bg: 'bg-violet-500/10',  text: 'text-violet-600'  },
    amber:   { ring: 'ring-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-600'   },
    rose:    { ring: 'ring-rose-500/30',    bg: 'bg-rose-500/10',    text: 'text-rose-600'    },
    emerald: { ring: 'ring-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  };
  const a = accentMap[accent] ?? accentMap.brand;
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border p-5 transition-all ${
        disabled
          ? 'border-glass-light-border bg-glass-light-1 opacity-70 dark:border-glass-dark-border dark:bg-glass-dark-1'
          : highlighted
            ? `border-zen/40 bg-glass-light-2 ring-1 backdrop-blur-md dark:bg-glass-dark-2 ${a.ring} hover:-translate-y-0.5 hover:shadow-zen`
            : 'border-glass-light-border bg-glass-light-2 backdrop-blur-md hover:-translate-y-0.5 hover:border-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2'
      }`}
    >
      {soon && (
        <span className="absolute right-3 top-3 rounded-full bg-glass-light-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zen-ink/50 dark:bg-glass-dark-1 dark:text-white/40">
          <Trans>Próximamente</Trans>
        </span>
      )}
      {locked && !soon && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          <Lock size={9} /><Trans>Pro</Trans>
        </span>
      )}
      {highlighted && !soon && !locked && (
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-zen-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          <Sparkles size={9} /><Trans>Recomendado</Trans>
        </span>
      )}
      <div className={`w-11 h-11 rounded-xl ${a.bg} ${a.text} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mb-2 mt-0.5 text-xs text-zen-ink/50 dark:text-white/40">{subtitle}</p>
      <p className="flex-1 text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">{description}</p>
      {technique && (
        <p className="mt-3 text-[11px] italic text-zen-ink/50 dark:text-white/40">
          <Trans>Técnica:</Trans> {technique}
        </p>
      )}
      {meta && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zen-ink/50 dark:text-white/40">
          {meta.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 rounded-full border border-glass-light-border bg-glass-light-1 px-2 py-0.5 dark:border-glass-dark-border dark:bg-glass-dark-1">
              {m.icon && <m.icon size={10} />}{m.label}
            </span>
          ))}
        </div>
      )}
      <GlassButton
        onClick={onClick}
        disabled={disabled}
        variant={highlighted ? 'primary' : 'secondary'}
        className="mt-4 w-full"
      >
        {disabled || locked ? <><Lock size={13} />{ctaLabel}</> : <><Play size={13} />{ctaLabel}</>}
      </GlassButton>
    </div>
  );
}

function QuestionPreview({ q, index, locked }) {
  const { t } = useLingui();
  const options = q.options ?? {};
  return (
    <GlassCard>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-zen-ink/50 dark:text-white/40">{t`Pregunta ${index + 1}`}</span>
          {q.difficulty && (
            <GlassBadge tone={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'success'}>
              {q.difficulty === 'hard' ? <Trans>Difícil</Trans> : q.difficulty === 'medium' ? <Trans>Intermedia</Trans> : <Trans>Fácil</Trans>}
            </GlassBadge>
          )}
        </div>
        <h3 className="text-sm font-medium leading-relaxed">{q.question}</h3>
        <ul className="space-y-1.5">
          {Object.entries(options).map(([key, val]) => (
            <li key={key} className="flex gap-2 text-xs text-zen-ink/70 dark:text-white/60">
              <span className="w-5 shrink-0 font-semibold text-zen-ink/50 dark:text-white/40">{key}.</span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
        {locked && (
          <div className="flex items-center gap-2 border-t border-glass-light-border pt-2 text-xs text-zen-ink/50 dark:border-glass-dark-border dark:text-white/40">
            <Lock size={12} />
            <Trans>Regístrate para ver la respuesta y explicación.</Trans>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export function ExamSetLandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isPro } = useUserPlan();
  const { t } = useLingui();

  const [set, setState] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ weak: 0, due: 0, mastered: 0, seen: 0 });
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const ref = doc(db, 'examSets', slug);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (active) { setError('not-found'); setLoading(false); }
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        if (!data.published) {
          if (active) { setError('not-public'); setLoading(false); }
          return;
        }
        // Load first 3 questions for preview
        const qsSnap = await getDocs(query(collection(db, 'examSets', slug, 'questions'), limit(3)));
        if (!active) return;
        setState(data);
        setPreview(qsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      } catch (e) {
        if (active) { setError(e.message); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [slug]);

  // Load per-user stats (best-effort) to power Zona Débil + Repaso Inteligente counts.
  useEffect(() => {
    if (!user?.uid || !slug) return;
    let active = true;
    fetchStatsSummary({ uid: user.uid, setId: slug })
      .then((s) => { if (active) setStats(s); })
      .catch(() => { /* non-critical */ });
    return () => { active = false; };
  }, [user?.uid, slug]);

  // Load domain mastery map (Ruta de Dominio). Fetches all question domains in the set
  // and joins with user Leitner stats. Best-effort — anon users see 0% progression.
  useEffect(() => {
    if (!slug) return;
    let active = true;
    (async () => {
      try {
        const qsSnap = await getDocs(collection(db, 'examSets', slug, 'questions'));
        if (!active) return;
        const questions = qsSnap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, domain: data.domain, category: data.category };
        });
        const rows = await fetchDomainMastery({ uid: user?.uid, setId: slug, questions });
        if (active) setDomains(rows);
      } catch { /* non-critical */ }
    })();
    return () => { active = false; };
  }, [user?.uid, slug]);

  if (loading) {
    return (
      <PageBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zen/30 border-t-zen" />
        </div>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <SEOHead title={t`Set no encontrado`} path={`/exam-sets/${slug}`} noindex />
          <BookOpen size={40} className="mb-3 text-zen-ink/40 dark:text-white/40" />
          <h1 className="text-xl font-bold"><Trans>Set no disponible</Trans></h1>
          <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60"><Trans>Este examen no existe o no es público.</Trans></p>
          <GlassButton to="/explore" variant="secondary" className="mt-5"><ArrowLeft size={14} /><Trans>Volver a explorar</Trans></GlassButton>
        </div>
      </PageBackground>
    );
  }

  const domain = getDomain(set.domain);
  const canonicalUrl = `https://certzen.app/exam-sets/${slug}`;
  const description = set.description || `Simulador de examen ${set.title}`;

  // JSON-LD structured data (Quiz schema)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: set.title,
    description,
    url: canonicalUrl,
    about: domain.label,
    inLanguage: set.language ?? 'es',
    numberOfQuestions: set.questionCount ?? preview.length,
    timeRequired: `PT${set.timeMinutes ?? 30}M`,
    educationalLevel: set.level ?? 'beginner',
    ...(set.source ? { citation: set.source } : {}),
    provider: {
      '@type': 'Organization',
      name: 'CertZen',
      url: 'https://certzen.app',
    },
  };

  // Free plan only unlocks Práctica Rápida (mode=quick) — every other mode requires Pro.
  const launchMode = (params) => {
    if (!user) { navigate('/register'); return; }
    if (params.mode !== 'quick' && !isPro) {
      navigate('/pricing');
      return;
    }
    const qs = new URLSearchParams({ setId: slug, ...params }).toString();
    navigate(`/exam?${qs}`);
  };

  const hasQuestions = (set.questionCount ?? preview.length) > 0;
  const launchFlashcards = () => {
    if (!user) { navigate('/register'); return; }
    if (!isPro) { navigate('/pricing'); return; }
    navigate(`/flashcards/${slug}`);
  };

  const Shell = user ? AppShell : PublicLayout;

  return (
    <Shell>
      <SEOHead
        title={`${set.title} — Simulador gratis`}
        description={description}
        path={`/exam-sets/${slug}`}
        image="https://certzen.app/og-image.png"
        ogType="article"
        keywords={set.tags?.length > 0 ? set.tags.join(', ') : undefined}
        jsonLd={jsonLd}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-zen-ink/70 hover:text-zen-ink dark:text-white/60 dark:hover:text-white">
          <ArrowLeft size={14} /> <Trans>Exámenes</Trans>
        </Link>
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link to={`/explore?domain=${set.domain}`}>
              <GlassBadge tone="brand">{domain.icon} {domain.label}</GlassBadge>
            </Link>
            {set.level && <GlassBadge tone="neutral">{set.level}</GlassBadge>}
            <AuthorChip
              official={!!set.official}
              ownerEmail={set.ownerEmail}
              ownerDisplayName={set.ownerDisplayName}
              size="md"
            />
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{set.title}</h1>
          {set.description && (
            <p className="mt-3 max-w-3xl text-base text-zen-ink/70 dark:text-white/60">{set.description}</p>
          )}

          {/* Rating + favorite row */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <RatingStars
              slug={slug}
              ownerUid={set.ownerUid}
              averageValue={
                (set.ratingCount ?? 0) > 0
                  ? (set.ratingSum ?? 0) / set.ratingCount
                  : 0
              }
              count={set.ratingCount ?? 0}
              size={22}
            />
            <FavoriteButton
              slug={slug}
              setMeta={{ title: set.title, domain: set.domain }}
              count={set.favoritesCount ?? 0}
              variant="inline"
            />
            <SaveToFolderButton slug={slug} />
            <ShareButton
              url={canonicalUrl}
              title={set.title}
              text={`${set.title} — Simulador gratis en CertZen`}
            />
          </div>

          {/* Anon prompt */}
          {!user && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <GlassButton onClick={() => navigate('/register')} className="px-6 text-base">
                <Sparkles size={16} /><Trans>Regístrate para practicar</Trans>
              </GlassButton>
              <span className="text-xs text-zen-ink/50 dark:text-white/40">
                <Trans>Gratis · guarda tu progreso y ve explicaciones completas</Trans>
              </span>
            </div>
          )}
        </motion.section>

        {/* Meta stats */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <MetaStat icon={BookOpen} label={t`Preguntas`} value={set.questionCount ?? preview.length} />
          <MetaStat icon={Clock}    label={t`Duración`}  value={`${set.timeMinutes ?? 30} min`} />
          <MetaStat icon={Target}   label={t`Aprobar`}   value={`${set.passPercent ?? 70}%`} />
          <MetaStat icon={User}     label={t`Intentos`}  value={set.attempts ?? 0} />
        </motion.section>

        {/* Ruta de Dominio — domain-level mastery map */}
        {domains.length > 1 && (
          <motion.section
            id="domain-path"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            className="space-y-4 scroll-mt-20"
          >
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Layers size={20} className="text-zen dark:text-indigo-300" />
                <Trans>Ruta de Dominio</Trans>
              </h2>
              <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">
                <Trans>Tu progreso por área temática. Toca un dominio para practicarlo de forma focalizada.</Trans>
              </p>
            </div>
            <DomainPath
              domains={domains}
              locked={!user}
              onSelect={(domainName) => launchMode({ mode: 'study', domain: domainName })}
            />
          </motion.section>
        )}

        {/* Study modes */}
        <motion.section
          id="study-modes"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="space-y-4 scroll-mt-20"
        >
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <GraduationCap size={20} className="text-zen dark:text-indigo-300" />
              <Trans>Elige tu modo de estudio</Trans>
            </h2>
            <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">
              <Trans>Cada modo aprovecha una técnica distinta respaldada por la ciencia cognitiva del aprendizaje.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ModeCard
              icon={Zap}
              title={t`Práctica Rápida`}
              subtitle={t`10 preguntas · sesión corta`}
              description={t`Sesión exprés ideal para 5–10 minutos: aleatoria, con explicación inmediata. Perfecta para el día a día. Disponible en el plan gratuito.`}
              technique={t`Espaciado + sesiones breves (micro-learning)`}
              meta={[
                { icon: BookOpen, label: t`10 preguntas` },
                { icon: Clock, label: t`~5 min` },
              ]}
              accent="amber"
              highlighted
              ctaLabel={user ? t`Practicar` : t`Regístrate`}
              onClick={() => launchMode({ mode: 'quick', count: '10' })}
            />

            <ModeCard
              icon={GraduationCap}
              title={t`Estudio Guiado`}
              subtitle={t`Aprende sin presión`}
              description={t`Responde, confirma y ve la explicación al instante. Sin tiempo, revisa cuantas veces quieras.`}
              technique={t`Retrieval practice + feedback inmediato`}
              meta={[
                { icon: BookOpen, label: `${set.questionCount ?? preview.length} ${t`preguntas`}` },
                { icon: TimerReset, label: t`Sin tiempo` },
              ]}
              accent="emerald"
              locked={!!user && !isPro}
              ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : t`Empezar`}
              onClick={() => launchMode({ mode: 'study' })}
            />

            <ModeCard
              icon={Target}
              title={t`Modo Examen`}
              subtitle={t`Simulacro cronometrado`}
              description={t`Condiciones reales: ${set.timeMinutes ?? 30} min · ${set.passPercent ?? 70}% para aprobar · sin pistas. Evalúa tu preparación real.`}
              technique={t`Testing effect + feedback diferido`}
              meta={[
                { icon: Clock, label: `${set.timeMinutes ?? 30} min` },
                { icon: Target, label: `${set.passPercent ?? 70}% ${t`aprobar`}` },
              ]}
              accent="rose"
              locked={!!user && !isPro}
              ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : t`Empezar examen`}
              onClick={() => launchMode({ mode: 'exam' })}
            />

            <ModeCard
              icon={TrendingDown}
              title={t`Zona Débil`}
              subtitle={t`Ataca tus errores`}
              description={t`Te enfoca en las preguntas que fallaste. Aprendizaje dirigido a tus lagunas reales.`}
              technique={t`Práctica focalizada (targeted practice)`}
              meta={[
                user && stats.weak > 0
                  ? { icon: BookOpen, label: `${stats.weak} ${stats.weak !== 1 ? t`preguntas por repasar` : t`pregunta por repasar`}` }
                  : { icon: Sparkles, label: t`Responde preguntas primero` },
              ]}
              accent="violet"
              locked={!!user && !isPro}
              disabled={!user || (isPro && stats.weak === 0)}
              ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : stats.weak === 0 ? t`Sin errores aún` : t`Empezar`}
              onClick={() => launchMode({ mode: 'weak' })}
            />

            <ModeCard
              icon={Brain}
              title={t`Repaso Inteligente`}
              subtitle={t`Repetición espaciada`}
              description={t`Algoritmo Leitner que programa cuándo repasar cada pregunta para consolidar memoria a largo plazo al mínimo esfuerzo.`}
              technique={t`Spaced repetition (Leitner 5 cajas)`}
              meta={[
                user && stats.due > 0
                  ? { icon: Brain, label: `${stats.due} ${stats.due !== 1 ? t`preguntas por repasar hoy` : t`pregunta por repasar hoy`}` }
                  : user && stats.seen > 0
                    ? { icon: Sparkles, label: t`Todo al día 🎉` }
                    : { icon: Sparkles, label: t`Responde preguntas primero` },
                user && stats.mastered > 0 ? { icon: CheckCircle2, label: `${stats.mastered} ${stats.mastered !== 1 ? t`dominadas` : t`dominada`}` } : null,
              ].filter(Boolean)}
              accent="brand"
              locked={!!user && !isPro}
              disabled={!user || (isPro && stats.due === 0)}
              ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : stats.due === 0 ? (stats.seen > 0 ? t`Nada por repasar` : t`Sin historial`) : t`Repasar ahora`}
              onClick={() => launchMode({ mode: 'srs' })}
            />

            <ModeCard
              icon={Dice5}
              title={t`Apuesta tu Confianza`}
              subtitle={t`Apuesta ×1, ×2 o ×3`}
              description={t`Antes de revelar, apuesta qué tan seguro estás. Aciertas con ×3 y ganas; fallas con ×3 y pierdes. Descubre dónde crees saber sin saber.`}
              technique={t`Calibración metacognitiva (Brainscape CBR · Dunning-Kruger)`}
              meta={[
                { icon: BookOpen, label: `${Math.min(20, set.questionCount ?? 20)} ${t`preguntas`}` },
                { icon: Sparkles, label: t`Nuevo ✨` },
              ]}
              accent="rose"
              locked={!!user && !isPro}
              ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : t`Apostar`}
              onClick={() => launchMode({ mode: 'wager', count: String(Math.min(20, set.questionCount ?? 20)) })}
            />

            {hasQuestions && (
              <ModeCard
                icon={Layers}
                title={t`Flashcards`}
                subtitle={t`Voltea y autoevalúate`}
                description={t`Repasa cada pregunta como una tarjeta: pregunta al frente, respuesta y explicación al voltear. Sesión libre, sin cronómetro.`}
                technique={t`Active recall`}
                meta={[
                  { icon: BookOpen, label: `${set.questionCount ?? preview.length} ${t`tarjetas`}` },
                  { icon: TimerReset, label: t`Sin tiempo` },
                ]}
                accent="violet"
                locked={!!user && !isPro}
                ctaLabel={!user ? t`Regístrate` : !isPro ? t`Requiere Pro` : t`Estudiar con Flashcards`}
                onClick={launchFlashcards}
              />
            )}
          </div>
        </motion.section>

        {/* Source & tags */}
        {(set.source || set.tags?.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="space-y-3 rounded-2xl border border-glass-light-border bg-glass-light-2 p-5 backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2"
          >
            {set.source && (
              <div className="flex items-start gap-2 text-xs text-zen-ink/70 dark:text-white/60">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-600 dark:text-zen-success" />
                <p>
                  <span className="font-semibold"><Trans>Fuente:</Trans></span> {set.source}
                </p>
              </div>
            )}
            {set.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-zen-ink/40 dark:text-white/40" />
                {set.tags.map((t) => (
                  <Link key={t} to={`/explore?domain=${set.domain}`}>
                    <span className="rounded-full border border-glass-light-border bg-glass-light-1 px-2 py-0.5 text-xs text-zen-ink/70 transition-colors hover:border-zen/40 hover:text-zen-ink dark:border-glass-dark-border dark:bg-glass-dark-1 dark:text-white/60 dark:hover:text-white">
                      #{t}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl font-bold"><Trans>Vista previa</Trans></h2>
              <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">{t`Primeras ${preview.length} preguntas del set.`}</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {preview.map((q, i) => (
                <QuestionPreview key={q.id} q={q} index={i} locked={!user} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Final CTA — anon only */}
        {!user && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-glass-light-border bg-glass-light-2 p-8 text-center backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2"
          >
            <h2 className="text-xl font-bold"><Trans>Regístrate para empezar</Trans></h2>
            <p className="mx-auto mb-5 mt-2 max-w-xl text-sm text-zen-ink/70 dark:text-white/60">
              <Trans>El simulador es gratuito. Solo necesitas una cuenta para guardar tu progreso y ver explicaciones completas.</Trans>
            </p>
            <GlassButton onClick={() => navigate('/register')} className="mx-auto w-fit px-6 text-base">
              <Trans>Crear cuenta gratis</Trans>
            </GlassButton>
          </motion.section>
        )}
      </div>
    </Shell>
  );
}
