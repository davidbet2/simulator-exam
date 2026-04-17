import { useState, useEffect, useMemo, useDeferredValue, memo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Search, BookOpen, Users, Plus, X } from 'lucide-react';
import { Trans, useLingui } from '@lingui/react/macro';
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

function Highlight({ text, needle }) {
  if (!needle || !text) return text ?? null;
  const idx = text.toLowerCase().indexOf(needle.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-brand-500/20 text-ink rounded-sm not-italic">{text.slice(idx, idx + needle.length)}</mark>
      {text.slice(idx + needle.length)}
    </>
  );
}

const ExamSetCard = memo(function ExamSetCard({ set, needle }) {
  const { t } = useLingui();
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
              <Highlight text={set.title} needle={needle} />
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
            <span className="flex items-center gap-1"><BookOpen size={11} />{set.questionCount ?? '?'} {t`preguntas`}</span>
            <span className="flex items-center gap-1"><Users size={11} />{set.attempts ?? 0} {t`intentos`}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

function DomainChip({ domain, active, onClick, label }) {
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
      {label ?? domain.label}
    </button>
  );
}

export function ExploreExamsPage() {
  const { t } = useLingui();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDomain = searchParams.get('domain') ?? '';
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);

  // useDeferredValue lets the input stay responsive while results render in the background.
  // React.memo on ExamSetCard ensures only changed cards re-render.
  const deferredSearch = useDeferredValue(search);
  const deferredDomain = useDeferredValue(activeDomain);
  const isPending = deferredSearch !== search || deferredDomain !== activeDomain;

  useEffect(() => {
    // NOTE: Firestore rules allow anonymous list only when limit <= 100.
    // Do not raise this without also updating firestore.rules.
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
      if (deferredDomain && s.domain !== deferredDomain) return false;
      if (!deferredSearch) return true;
      const needle = deferredSearch.toLowerCase();
      return (
        s.title?.toLowerCase().includes(needle) ||
        s.description?.toLowerCase().includes(needle) ||
        s.tags?.some?.((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [sets, deferredSearch, deferredDomain]);

  // Build suggestion candidates from titles + tags of loaded sets
  const suggestions = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (needle.length < 2 || sets.length === 0) return [];
    const seen = new Set();
    const results = [];
    for (const s of sets) {
      if (results.length >= 8) break;
      const title = s.title ?? '';
      if (title.toLowerCase().includes(needle) && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        results.push({ label: title, kind: 'set' });
      }
    }
    // Also include matching tags
    for (const s of sets) {
      for (const tag of s.tags ?? []) {
        if (results.length >= 8) break;
        const t = tag.toLowerCase();
        if (t.includes(needle) && !seen.has(t)) {
          seen.add(t);
          results.push({ label: tag, kind: 'tag' });
        }
      }
    }
    return results;
  }, [sets, search]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function applySearch(val) {
    setSearch(val);
    setShowSuggestions(false);
    setActiveIdx(-1);
    const next = new URLSearchParams(searchParams);
    if (val) next.set('q', val); else next.delete('q');
    setSearchParams(next, { replace: true });
  }

  function handleInputKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      applySearch(suggestions[activeIdx].label);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  }

  const selectDomain = (id) => {
    if (id === activeDomain || id === '') {
      searchParams.delete('domain');
    } else {
      searchParams.set('domain', id);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const pageTitle = activeDomain
    ? t`Exámenes de ${getDomain(activeDomain).label} — CertZen`
    : t`Explorar exámenes de certificación — CertZen`;
  const pageDescription = activeDomain
    ? t`Simulacros gratuitos de ${getDomain(activeDomain).label}. Preguntas basadas en exam guides públicos. Estudia y evalúate en línea.`
    : t`Plataforma colaborativa de simuladores de examen: IT, Cloud, Salud, Inglés, Appian y más. Exploración gratis, regístrate para practicar.`;

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
                {activeDomain ? t`Exámenes de ${getDomain(activeDomain).label}` : t`Explorar exámenes`}
              </h1>
              <p className="text-ink-soft text-sm mt-1">
                <Trans>Sets oficiales y de la comunidad. Estudia gratis, regístrate para guardar tu progreso.</Trans>
              </p>
            </div>
            {user && (
              <Button onClick={() => navigate('/create-exam')}>
                <Plus size={16} /><Trans>Crear set</Trans>
              </Button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <DomainChip domain={{ label: 'Todos', icon: '📚' }} label={t`Todos`} active={!activeDomain} onClick={() => selectDomain('')} />
          {DOMAINS.map((d) => (
            <DomainChip key={d.id} domain={d} active={activeDomain === d.id} onClick={() => selectDomain(d.id)} />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <form
            role="search"
            onSubmit={(e) => { e.preventDefault(); setShowSuggestions(false); }}
            className="relative"
            ref={searchBoxRef}
          >
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
            <input
              ref={inputRef}
              id="explore-search-input"
              type="search"
              autoComplete="off"
              placeholder={t`Buscar por título, descripción o etiqueta…`}
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setActiveIdx(-1);
                setShowSuggestions(val.trim().length >= 2);
                const next = new URLSearchParams(searchParams);
                if (val) next.set('q', val); else next.delete('q');
                setSearchParams(next, { replace: true });
              }}
              onFocus={() => { if (search.trim().length >= 2 && suggestions.length > 0) setShowSuggestions(true); }}
              onKeyDown={handleInputKeyDown}
              className="h-11 w-full rounded-xl border border-surface-border bg-white pl-10 pr-9 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              aria-label={t`Buscar sets de examen`}
              aria-controls="explore-results"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  applySearch('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
                aria-label={t`Limpiar búsqueda`}
              >
                <X size={14} />
              </button>
            )}

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                role="listbox"
                aria-label={t`Sugerencias de búsqueda`}
                className="absolute z-50 mt-1.5 w-full rounded-xl border border-surface-border bg-white shadow-lg overflow-hidden"
              >
                {suggestions.map((s, i) => (
                  <li
                    key={s.label}
                    id={`suggestion-${i}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseDown={(e) => { e.preventDefault(); applySearch(s.label); }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                      i === activeIdx
                        ? 'bg-brand-500/10 text-brand-700'
                        : 'text-ink hover:bg-surface-soft'
                    }`}
                  >
                    {s.kind === 'tag'
                      ? <span className="text-xs bg-surface-soft border border-surface-border rounded px-1.5 py-0.5 text-ink-soft shrink-0">#</span>
                      : <Search size={13} className="text-ink-muted shrink-0" />
                    }
                    <Highlight text={s.label} needle={search} />
                  </li>
                ))}
              </ul>
            )}
          </form>
        </motion.div>

        <div id="explore-results" aria-live="polite" aria-busy={isPending} aria-label={t`Resultados de búsqueda`}>
          {!loading && filtered.length > 0 && (
            <p className="text-xs text-ink-muted mb-3">
              {filtered.length === 1 ? t`${filtered.length} set encontrado` : t`${filtered.length} sets encontrados`}
              {isPending && <span className="ml-1 opacity-60">…</span>}
            </p>
          )}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-surface-soft animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
              <BookOpen size={40} className="text-ink-muted mx-auto" />
              <p className="text-ink-soft">{search || activeDomain ? t`No se encontraron resultados.` : t`Aún no hay sets publicados.`}</p>
              {user ? (
                <Button onClick={() => navigate('/create-exam')} variant="secondary" size="sm">
                  <Plus size={14} /><Trans>Crea el primero</Trans>
                </Button>
              ) : (
                <Button onClick={() => navigate('/register')} size="sm"><Trans>Regístrate gratis</Trans></Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-150 ${isPending ? 'opacity-60' : 'opacity-100'}`}
            >
              {filtered.map((set) => <ExamSetCard key={set.id} set={set} needle={deferredSearch} />)}
            </motion.div>
          )}
        </div>

        {!user && !loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 to-brand-500/10 p-6 text-center"
          >
            <h2 className="text-lg font-semibold text-ink"><Trans>¿Listo para practicar?</Trans></h2>
            <p className="text-sm text-ink-soft mt-1 mb-4">
              <Trans>Regístrate gratis para empezar exámenes, guardar resultados y crear tus propios sets.</Trans>
            </p>
            <Button onClick={() => navigate('/register')}><Trans>Crear cuenta gratis</Trans></Button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
