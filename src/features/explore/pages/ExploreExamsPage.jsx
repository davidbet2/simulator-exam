import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Users, Plus, X, Loader2 } from 'lucide-react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useExploreQuery, normalize } from '../hooks/useExploreQuery';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { getDomain } from '../../../core/constants/domains';
import { SEOHead } from '../../../components/SEOHead';
import { AppShell } from '../../../components/layout/AppShell';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassButton } from '../../../components/glass/GlassButton';
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
      <mark className="rounded-sm bg-zen/25 text-inherit not-italic">{text.slice(idx, idx + needle.length)}</mark>
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
    <GlassCard className="flex h-full flex-col transition-colors hover:border-zen/40">
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/exam-sets/${set.id}`} className="group flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zen/15 text-lg dark:bg-zen/25" aria-hidden>{domain.icon}</span>
            <h3 className="flex-1 truncate text-sm font-semibold leading-snug transition-colors group-hover:text-zen dark:group-hover:text-indigo-300">
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
            <p className="line-clamp-2 text-xs text-zen-ink/70 transition-colors hover:text-zen-ink dark:text-white/60 dark:hover:text-white">
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
          <div className="flex items-center gap-3 border-t border-glass-light-border pt-2 text-xs text-zen-ink/50 dark:border-glass-dark-border dark:text-white/40">
            <span className="flex items-center gap-1"><BookOpen size={11} />{set.questionCount ?? '?'} {t`preguntas`}</span>
            <span className="flex items-center gap-1"><Users size={11} />{set.attempts ?? 0} {t`intentos`}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
});

export function ExploreExamsPage() {
  const { t } = useLingui();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeDomain = searchParams.get('domain') ?? '';
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);

  // Server-side cursor pagination + debounced search (scales to 10 k+ sets).
  const { sets, loading, loadingMore, hasMore, loadMore, isSearchMode } = useExploreQuery({
    domain: activeDomain,
    searchTerm: search,
  });


  // Build suggestion candidates from titles + tags of loaded sets
  const suggestions = useMemo(() => {
    const needle = normalize(search.trim());
    if (needle.length < 2 || sets.length === 0) return [];
    const seen = new Set();
    const results = [];
    for (const s of sets) {
      if (results.length >= 8) break;
      const title = s.title ?? '';
      if (normalize(title).includes(needle) && !seen.has(normalize(title))) {
        seen.add(normalize(title));
        results.push({ label: title, kind: 'set' });
      }
    }
    // Also include matching tags
    for (const s of sets) {
      for (const tag of s.tags ?? []) {
        if (results.length >= 8) break;
        if (normalize(tag).includes(needle) && !seen.has(normalize(tag))) {
          seen.add(normalize(tag));
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

  const pageTitle = activeDomain
    ? t`Exámenes de ${getDomain(activeDomain).label}`
    : t`Explorar exámenes de certificación`;
  const pageDescription = activeDomain
    ? t`Simulacros gratuitos de ${getDomain(activeDomain).label}. Preguntas basadas en exam guides públicos. Estudia y evalúate en línea.`
    : t`Plataforma colaborativa de simuladores de examen: IT, Cloud, Salud, Inglés, Appian y más. Exploración gratis, regístrate para practicar.`;

  const Shell = user ? AppShell : PublicLayout;

  return (
    <Shell>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        path={`/explore${activeDomain ? `?domain=${activeDomain}` : ''}`}
        image="https://certzen.app/og-image.png"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {activeDomain ? t`Exámenes de ${getDomain(activeDomain).label}` : t`Explorar exámenes`}
              </h1>
              <p className="mt-1 text-sm text-zen-ink/70 dark:text-white/60">
                <Trans>Sets oficiales y de la comunidad. Estudia gratis, regístrate para guardar tu progreso.</Trans>
              </p>
            </div>
            {user && (
              <GlassButton onClick={() => navigate('/create-exam')}>
                <Plus size={16} /><Trans>Crear set</Trans>
              </GlassButton>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <form
            role="search"
            onSubmit={(e) => { e.preventDefault(); setShowSuggestions(false); }}
            className="relative"
            ref={searchBoxRef}
          >
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zen-ink/40 dark:text-white/40" />
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
              className="h-11 w-full rounded-zen border border-glass-light-border bg-glass-light-2 pl-10 pr-9 text-sm text-zen-ink backdrop-blur-md placeholder:text-zen-ink/50 focus:border-zen focus:outline-none focus:ring-2 focus:ring-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white dark:placeholder:text-white/40"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zen-ink/50 transition-colors hover:text-zen-ink dark:text-white/50 dark:hover:text-white"
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
                className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-glass-light-border bg-white/95 shadow-lg backdrop-blur-xl dark:border-glass-dark-border dark:bg-[#221c49]/95"
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
                        ? 'bg-zen/15 text-zen dark:text-indigo-300'
                        : 'hover:bg-zen/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {s.kind === 'tag'
                      ? <span className="shrink-0 rounded border border-glass-light-border bg-glass-light-1 px-1.5 py-0.5 text-xs text-zen-ink/60 dark:border-glass-dark-border dark:bg-glass-dark-1 dark:text-white/50">#</span>
                      : <Search size={13} className="shrink-0 text-zen-ink/40 dark:text-white/40" />
                    }
                    <Highlight text={s.label} needle={search} />
                  </li>
                ))}
              </ul>
            )}
          </form>
        </motion.div>

        <div id="explore-results" aria-live="polite" aria-busy={loading} aria-label={t`Resultados de búsqueda`}>
          {!loading && sets.length > 0 && (
            <p className="mb-3 text-xs text-zen-ink/50 dark:text-white/40">
              {isSearchMode
                ? (sets.length === 1 ? t`${sets.length} resultado` : t`${sets.length} resultados`)
                : (sets.length === 1 ? t`${sets.length} set encontrado` : t`${sets.length} sets encontrados`)
              }
              {loadingMore && <span className="ml-1 opacity-60">…</span>}
            </p>
          )}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-glass-light-2 dark:bg-glass-dark-2" />
              ))}
            </div>
          ) : sets.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-3">
              <BookOpen size={40} className="mx-auto text-zen-ink/40 dark:text-white/40" />
              <p className="text-zen-ink/70 dark:text-white/60">{search || activeDomain ? t`No se encontraron resultados.` : t`Aún no hay sets publicados.`}</p>
              {user ? (
                <GlassButton onClick={() => navigate('/create-exam')} variant="secondary">
                  <Plus size={14} /><Trans>Crea el primero</Trans>
                </GlassButton>
              ) : (
                <GlassButton onClick={() => navigate('/register')}><Trans>Regístrate gratis</Trans></GlassButton>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-150 ${loading ? 'opacity-60' : 'opacity-100'}`}
            >
              {sets.map((set) => <ExamSetCard key={set.id} set={set} needle={search} />)}
            </motion.div>
          )}

          {/* Cursor-based load more — hidden in search mode */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <GlassButton onClick={loadMore} disabled={loadingMore} variant="secondary">
                {loadingMore
                  ? <><Loader2 size={14} className="animate-spin mr-1.5" /><Trans>Cargando…</Trans></>
                  : <Trans>Cargar más sets</Trans>
                }
              </GlassButton>
            </div>
          )}
        </div>

        {!user && !loading && sets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-glass-light-border bg-glass-light-2 p-6 text-center backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2"
          >
            <h2 className="text-lg font-bold"><Trans>¿Listo para practicar?</Trans></h2>
            <p className="mb-4 mt-1 text-sm text-zen-ink/70 dark:text-white/60">
              <Trans>Regístrate gratis para empezar exámenes, guardar resultados y crear tus propios sets.</Trans>
            </p>
            <GlassButton onClick={() => navigate('/register')} className="mx-auto w-fit"><Trans>Crear cuenta gratis</Trans></GlassButton>
          </motion.div>
        )}
      </div>
    </Shell>
  );
}
