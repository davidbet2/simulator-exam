import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Search, BookOpen, Users, Plus } from 'lucide-react';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { DOMAINS, getDomain } from '../../../core/constants/domains';
import { AppShell } from '../../../components/layout/AppShell';
import { Card, CardBody } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { RatingStars } from '../../social/components/RatingStars';
import { FavoriteButton } from '../../social/components/FavoriteButton';
import { AuthorChip } from '../../social/components/AuthorChip';
import { SaveToFolderButton } from '../../home/components/SaveToFolderButton';

function ExamSetCard({ set }) {
  const domain = getDomain(set.domain);
  const ratingCount = set.ratingCount ?? 0;
  const ratingAvg = ratingCount > 0 ? (set.ratingSum ?? 0) / ratingCount : 0;
  return (
    <Card className="hover:border-brand-500/50 transition-colors h-full flex flex-col">
      <CardBody className="p-5 space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/exam-sets/${set.id}`} className="flex items-center gap-2 min-w-0 group flex-1">
            <span className="text-lg" aria-hidden>{domain.icon}</span>
            <h3 className="font-semibold text-ink text-sm leading-snug flex-1 group-hover:text-brand-600 transition-colors truncate">
              {set.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            <SaveToFolderButton slug={set.id} compact />
            <FavoriteButton
              slug={set.id}
              setMeta={{ title: set.title, domain: set.domain }}
              count={set.favoritesCount ?? 0}
            />
          </div>
        </div>

        <AuthorChip
          official={!!set.official}
          ownerEmail={set.ownerEmail}
          ownerDisplayName={set.ownerDisplayName}
        />

        {set.description && (
          <Link to={`/exam-sets/${set.id}`} className="block">
            <p className="text-xs text-ink-soft line-clamp-2 hover:text-ink transition-colors">
              {set.description}
            </p>
          </Link>
        )}

        <div className="mt-auto space-y-2">
          <RatingStars
            slug={set.id}
            ownerUid={set.ownerUid}
            averageValue={ratingAvg}
            count={ratingCount}
            size={14}
            readOnly
          />
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><BookOpen size={11} />{set.questionCount ?? '?'} preguntas</span>
            <span className="flex items-center gap-1"><Users size={11} />{set.attempts ?? 0} intentos</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function DomainChip({ domain, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-9 px-3.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 ${
        active
          ? 'bg-brand-500 border-brand-500 text-white'
          : 'bg-white border-surface-border text-ink-soft hover:border-brand-500/50 hover:text-ink'
      }`}
    >
      <span aria-hidden>{domain.icon}</span>
      {domain.label}
    </button>
  );
}

export function ExploreExamsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDomain = searchParams.get('domain') ?? '';

  useEffect(() => {
    const q = query(
      collection(db, 'examSets'),
      where('published', '==', true),
      limit(100),
    );
    getDocs(q)
      .then((snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort client-side: official first, then by rating avg desc (weighted by count),
        // then favorites, then attempts, then title.
        docs.sort((a, b) => {
          if (a.official !== b.official) return b.official ? 1 : -1;
          // Bayesian-style: avg weighted by count (sets with no ratings fall to 0)
          const aRating = (a.ratingCount ?? 0) > 0 ? ((a.ratingSum ?? 0) / a.ratingCount) * Math.log2(a.ratingCount + 1) : 0;
          const bRating = (b.ratingCount ?? 0) > 0 ? ((b.ratingSum ?? 0) / b.ratingCount) * Math.log2(b.ratingCount + 1) : 0;
          if (bRating !== aRating) return bRating - aRating;
          if ((b.favoritesCount ?? 0) !== (a.favoritesCount ?? 0)) return (b.favoritesCount ?? 0) - (a.favoritesCount ?? 0);
          if ((b.attempts ?? 0) !== (a.attempts ?? 0)) return (b.attempts ?? 0) - (a.attempts ?? 0);
          return (a.title ?? '').localeCompare(b.title ?? '');
        });
        setSets(docs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[Explore] query failed:', err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return sets.filter((s) => {
      if (activeDomain && s.domain !== activeDomain) return false;
      if (!search) return true;
      const needle = search.toLowerCase();
      return (
        s.title?.toLowerCase().includes(needle) ||
        s.description?.toLowerCase().includes(needle) ||
        s.tags?.some?.((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [sets, search, activeDomain]);

  const selectDomain = (id) => {
    if (id === activeDomain || id === '') {
      searchParams.delete('domain');
    } else {
      searchParams.set('domain', id);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const pageTitle = activeDomain
    ? `Exámenes de ${getDomain(activeDomain).label} — CertZen`
    : 'Explorar exámenes de certificación — CertZen';
  const pageDescription = activeDomain
    ? `Simulacros gratuitos de ${getDomain(activeDomain).label}. Preguntas basadas en exam guides públicos. Estudia y evalúate en línea.`
    : 'Plataforma colaborativa de simuladores de examen: IT, Cloud, Salud, Inglés, Appian y más. Exploración gratis, regístrate para practicar.';

  return (
    <AppShell>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://certzen.app/explore${activeDomain ? `?domain=${activeDomain}` : ''}`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink">
                {activeDomain ? `Exámenes de ${getDomain(activeDomain).label}` : 'Explorar exámenes'}
              </h1>
              <p className="text-ink-soft text-sm mt-1">
                Sets oficiales y de la comunidad. Estudia gratis, regístrate para guardar tu progreso.
              </p>
            </div>
            {user && (
              <Button onClick={() => navigate('/create-exam')}>
                <Plus size={16} />Crear set
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <DomainChip domain={{ label: 'Todos', icon: '📚' }} active={!activeDomain} onClick={() => selectDomain('')} />
          {DOMAINS.map((d) => (
            <DomainChip key={d.id} domain={d} active={activeDomain === d.id} onClick={() => selectDomain(d.id)} />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              placeholder="Buscar por título, descripción o etiqueta…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-surface-border bg-white pl-10 pr-4 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              aria-label="Buscar sets de examen"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-surface-soft animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
            <BookOpen size={40} className="text-ink-muted mx-auto" />
            <p className="text-ink-soft">{search || activeDomain ? 'No se encontraron resultados.' : 'Aún no hay sets publicados.'}</p>
            {user ? (
              <Button onClick={() => navigate('/create-exam')} variant="secondary" size="sm">
                <Plus size={14} />Crea el primero
              </Button>
            ) : (
              <Button onClick={() => navigate('/register')} size="sm">Regístrate gratis</Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((set) => <ExamSetCard key={set.id} set={set} />)}
          </motion.div>
        )}

        {!user && !loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-brand-500/10 p-6 text-center"
          >
            <h2 className="text-lg font-semibold text-ink">¿Listo para practicar?</h2>
            <p className="text-sm text-ink-soft mt-1 mb-4">
              Regístrate gratis para empezar exámenes, guardar resultados y crear tus propios sets.
            </p>
            <Button onClick={() => navigate('/register')}>Crear cuenta gratis</Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
