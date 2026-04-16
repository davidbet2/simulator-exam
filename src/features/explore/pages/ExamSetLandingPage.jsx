import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import {
  ArrowLeft, BookOpen, Clock, Target, User, Play,
  Lock, CheckCircle2, Tag,
} from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { getDomain } from '../../../core/constants/domains';
import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardBody } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { RatingStars } from '../../social/components/RatingStars';
import { FavoriteButton } from '../../social/components/FavoriteButton';
import { AuthorChip } from '../../social/components/AuthorChip';
import { SaveToFolderButton } from '../../home/components/SaveToFolderButton';

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

function QuestionPreview({ q, index, locked }) {
  const options = q.options ?? {};
  return (
    <Card>
      <CardBody className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-ink-muted">Pregunta {index + 1}</span>
          {q.difficulty && (
            <Badge variant={q.difficulty === 'hard' ? 'danger' : q.difficulty === 'medium' ? 'warning' : 'success'}>
              {q.difficulty === 'hard' ? 'Difícil' : q.difficulty === 'medium' ? 'Intermedia' : 'Fácil'}
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
            Regístrate para ver la respuesta y explicación.
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

  const [set, setState] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <Helmet><title>Set no encontrado — CertZen</title><meta name="robots" content="noindex" /></Helmet>
        <BookOpen size={40} className="text-ink-muted mb-3" />
        <h1 className="text-xl font-semibold text-ink">Set no disponible</h1>
        <p className="text-sm text-ink-soft mt-1">Este examen no existe o no es público.</p>
        <Link to="/explore" className="mt-5">
          <Button variant="outline" size="sm"><ArrowLeft size={14} />Volver a explorar</Button>
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

  const startAction = () => {
    if (!user) { navigate('/register'); return; }
    navigate(`/exam?setId=${slug}`);
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
          <ArrowLeft size={14} /> Exámenes
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
          </div>

          {/* CTA band */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={startAction}>
              {user ? <><Play size={16} />Empezar examen</> : <><Lock size={16} />Regístrate para practicar</>}
            </Button>
            {!user && (
              <span className="text-xs text-ink-muted">
                Explora gratis · regístrate para empezar intentos
              </span>
            )}
          </div>
        </motion.section>

        {/* Meta stats */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <MetaStat icon={BookOpen} label="Preguntas" value={set.questionCount ?? preview.length} />
          <MetaStat icon={Clock}    label="Duración"  value={`${set.timeMinutes ?? 30} min`} />
          <MetaStat icon={Target}   label="Aprobar"   value={`${set.passPercent ?? 70}%`} />
          <MetaStat icon={User}     label="Intentos"  value={set.attempts ?? 0} />
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
                  <span className="font-semibold text-ink">Fuente:</span> {set.source}
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
              <h2 className="text-xl font-bold text-ink">Vista previa</h2>
              <p className="text-sm text-ink-soft mt-1">Primeras {preview.length} preguntas del set.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {preview.map((q, i) => (
                <QuestionPreview key={q.id} q={q} index={i} locked={!user} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-brand-500/10 p-8 text-center"
        >
          <h2 className="text-xl font-semibold text-ink">
            {user ? '¿Listo para este examen?' : 'Regístrate para empezar'}
          </h2>
          <p className="text-sm text-ink-soft mt-2 mb-5 max-w-xl mx-auto">
            {user
              ? 'Tus respuestas se guardan automáticamente. Revisa resultados y repasa cada pregunta.'
              : 'El simulador es gratuito. Solo necesitas una cuenta para guardar tu progreso y ver explicaciones completas.'}
          </p>
          <Button size="lg" onClick={startAction}>
            {user ? 'Empezar ahora' : 'Crear cuenta gratis'}
          </Button>
        </motion.section>
      </div>
    </AppShell>
  );
}
