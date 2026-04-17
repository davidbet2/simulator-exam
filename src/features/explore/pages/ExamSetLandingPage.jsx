import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Trans, useLingui } from '@lingui/react/macro';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import {
  ArrowLeft, BookOpen, Clock, Target, User, Play,
  Lock, CheckCircle2, Tag, GraduationCap, Zap, TimerReset,
  Brain, TrendingDown, Sparkles, Dice5, Layers,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { getDomain } from '../../../core/constants/domains';
import { fetchStatsSummary, fetchDomainMastery } from '../../exam/utils/questionStats';
import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { RatingStars } from '../../social/components/RatingStars';
import { FavoriteButton } from '../../social/components/FavoriteButton';
import { AuthorChip } from '../../social/components/AuthorChip';
import { SaveToFolderButton } from '../../home/components/SaveToFolderButton';
import { ShareButton } from '../../../components/ui/ShareButton';
import DomainPath from '../components/DomainPath';
import { SEOHead } from '../../../components/SEOHead';

function MetaStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-surface-soft border border-surface-border rounded-xl px-3 py-2.5">
      <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="text-sm font-semibold text-ink truncate">{value}</p>
      </div>
    </div>
  );
}

// ── Study mode card ──────────────────────────────────────────────────────────
function ModeCard({
  icon: Icon, title, subtitle, description, technique, meta, ctaLabel,
  accent = 'brand', onClick, disabled = false, soon = false, highlighted = false,
}) {
  const accentMap = {
    brand:   { ring: 'ring-brand-500/30',   bg: 'bg-brand-500/10',   text: 'text-brand-600'   },
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
          ? 'border-surface-border bg-surface-soft/60 opacity-70'
          : highlighted
            ? `border-transparent bg-gradient-to-br from-brand-500/10 to-brand-500/5 ring-1 ${a.ring} hover:shadow-lg hover:-translate-y-0.5`
            : 'border-surface-border bg-white hover:border-brand-500/40 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {soon && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-ink-muted/10 text-ink-muted rounded-full px-2 py-0.5">
          <Trans>Próximamente</Trans>
        </span>
      )}
      {highlighted && !soon && (
        <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-brand-500 text-white rounded-full px-2 py-0.5 flex items-center gap-1">
          <Sparkles size={9} /><Trans>Recomendado</Trans>
        </span>
      )}
      <div className={`w-11 h-11 rounded-xl ${a.bg} ${a.text} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="text-xs text-ink-muted mt-0.5 mb-2">{subtitle}</p>
      <p className="text-sm text-ink-soft flex-1 leading-relaxed">{description}</p>
      {technique && (
        <p className="text-[11px] text-ink-muted mt-3 italic">
          <Trans>Técnica:</Trans> {technique}
        </p>
      )}
      {meta && (
        <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-ink-muted">
          {meta.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-surface-soft border border-surface-border rounded-full px-2 py-0.5">
              {m.icon && <m.icon size={10} />}{m.label}
            </span>
          ))}
        </div>
      )}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant={highlighted ? 'primary' : 'secondary'}
        size="sm"
        className="mt-4 w-full"
      >
        {disabled ? <><Lock size={13} />{ctaLabel}</> : <><Play size={13} />{ctaLabel}</>}
      </Button>
    </div>
  );
}

function QuestionPreview({ q, index, locked }) {
  const { t } = useLingui();
  const options = q.options ?? {};
  return (
    <Card>
      <CardBody className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-ink-muted">{t`Pregunta ${index + 1}`}</span>
          {q.difficulty && (
            <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'success'}>
              {q.difficulty === 'hard' ? <Trans>Difícil</Trans> : q.difficulty === 'medium' ? <Trans>Intermedia</Trans> : <Trans>Fácil</Trans>}
            </Badge>
          )}
        </div>
        <h3 className="text-sm font-medium text-ink leading-relaxed">{q.question}</h3>
        <ul className="space-y-1.5">
          {Object.entries(options).map(([key, val]) => (
            <li key={key} className="text-xs text-ink-soft flex gap-2">
              <span className="font-semibold text-ink-muted shrink-0 w-5">{key}.</span>
              <span>{val}</span>
            </li>
          ))}
        </ul>
        {locked && (
          <div className="flex items-center gap-2 text-xs text-ink-muted pt-2 border-t border-surface-border">
            <Lock size={12} />
            <Trans>Regístrate para ver la respuesta y explicación.</Trans>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export function ExamSetLandingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4 text-center">
        <Helmet><title>{t`Set no encontrado — CertZen`}</title><meta name="robots" content="noindex" /></Helmet>
        <BookOpen size={40} className="text-ink-muted mb-3" />
        <h1 className="text-xl font-semibold text-ink"><Trans>Set no disponible</Trans></h1>
        <p className="text-sm text-ink-soft mt-1"><Trans>Este examen no existe o no es público.</Trans></p>
        <Link to="/explore" className="mt-5">
          <Button variant="outline" size="sm"><ArrowLeft size={14} /><Trans>Volver a explorar</Trans></Button>
        </Link>
      </div>
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

  const launchMode = (params) => {
    if (!user) { navigate('/register'); return; }
    const qs = new URLSearchParams({ setId: slug, ...params }).toString();
    navigate(`/exam?${qs}`);
  };

  return (
    <AppShell>
      <Helmet>
        <title>{set.title} — Simulador gratis | CertZen</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${set.title} — CertZen`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {set.tags?.length > 0 && (
          <meta name="keywords" content={set.tags.join(', ')} />
        )}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        <Link to="/explore" className="text-sm text-ink-soft hover:text-ink inline-flex items-center gap-1.5">
          <ArrowLeft size={14} /> <Trans>Exámenes</Trans>
        </Link>
        {/* Hero */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link to={`/explore?domain=${set.domain}`}>
              <Badge>{domain.icon} {domain.label}</Badge>
            </Link>
            {set.level && <Badge>{set.level}</Badge>}
            <AuthorChip
              official={!!set.official}
              ownerEmail={set.ownerEmail}
              ownerDisplayName={set.ownerDisplayName}
              size="md"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">{set.title}</h1>
          {set.description && (
            <p className="text-base text-ink-soft mt-3 max-w-3xl">{set.description}</p>
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
              <Button size="lg" onClick={() => navigate('/register')}>
                <Lock size={16} /><Trans>Regístrate para practicar</Trans>
              </Button>
              <span className="text-xs text-ink-muted">
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
              <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                <Layers size={20} className="text-brand-600" />
                <Trans>Ruta de Dominio</Trans>
              </h2>
              <p className="text-sm text-ink-soft mt-1">
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
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <GraduationCap size={20} className="text-brand-600" />
              <Trans>Elige tu modo de estudio</Trans>
            </h2>
            <p className="text-sm text-ink-soft mt-1">
              <Trans>Cada modo aprovecha una técnica distinta respaldada por la ciencia cognitiva del aprendizaje.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              highlighted
              ctaLabel={user ? t`Empezar` : t`Regístrate`}
              onClick={() => launchMode({ mode: 'study' })}
            />

            <ModeCard
              icon={Zap}
              title={t`Práctica Rápida`}
              subtitle={t`10 preguntas · sesión corta`}
              description={t`Sesión exprés ideal para 5–10 minutos: aleatoria, con explicación inmediata. Perfecta para el día a día.`}
              technique={t`Espaciado + sesiones breves (micro-learning)`}
              meta={[
                { icon: BookOpen, label: t`10 preguntas` },
                { icon: Clock, label: t`~5 min` },
              ]}
              accent="amber"
              ctaLabel={user ? t`Practicar` : t`Regístrate`}
              onClick={() => launchMode({ mode: 'study', count: '10' })}
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
              ctaLabel={user ? t`Empezar examen` : t`Regístrate`}
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
              disabled={!user || stats.weak === 0}
              ctaLabel={!user ? t`Regístrate` : stats.weak === 0 ? t`Sin errores aún` : t`Empezar`}
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
              disabled={!user || stats.due === 0}
              ctaLabel={!user ? t`Regístrate` : stats.due === 0 ? (stats.seen > 0 ? t`Nada por repasar` : t`Sin historial`) : t`Repasar ahora`}
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
              ctaLabel={user ? t`Apostar` : t`Regístrate`}
              onClick={() => launchMode({ mode: 'wager', count: String(Math.min(20, set.questionCount ?? 20)) })}
            />
          </div>
        </motion.section>

        {/* Source & tags */}
        {(set.source || set.tags?.length > 0) && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-surface-soft border border-surface-border rounded-2xl p-5 space-y-3"
          >
            {set.source && (
              <div className="flex items-start gap-2 text-xs text-ink-soft">
                <CheckCircle2 size={14} className="text-success-500 mt-0.5 shrink-0" />
                <p>
                  <span className="font-semibold text-ink"><Trans>Fuente:</Trans></span> {set.source}
                </p>
              </div>
            )}
            {set.tags?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-ink-muted" />
                {set.tags.map((t) => (
                  <Link key={t} to={`/explore?domain=${set.domain}`}>
                    <span className="text-xs bg-white border border-surface-border text-ink-soft px-2 py-0.5 rounded-full hover:border-brand-500/50 hover:text-ink transition-colors">
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
              <h2 className="text-xl font-bold text-ink"><Trans>Vista previa</Trans></h2>
              <p className="text-sm text-ink-soft mt-1">{t`Primeras ${preview.length} preguntas del set.`}</p>
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
            className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-brand-500/10 p-8 text-center"
          >
            <h2 className="text-xl font-semibold text-ink"><Trans>Regístrate para empezar</Trans></h2>
            <p className="text-sm text-ink-soft mt-2 mb-5 max-w-xl mx-auto">
              <Trans>El simulador es gratuito. Solo necesitas una cuenta para guardar tu progreso y ver explicaciones completas.</Trans>
            </p>
            <Button size="lg" onClick={() => navigate('/register')}>
              <Trans>Crear cuenta gratis</Trans>
            </Button>
          </motion.section>
        )}
      </div>
    </AppShell>
  );
}
