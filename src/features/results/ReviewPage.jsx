import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trans, useLingui } from '@lingui/react/macro';
import { ArrowLeft, ArrowRight, Lightbulb, LayoutList, Rows3, X } from 'lucide-react';
import { PageBackground } from '../../components/glass/PageBackground';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { SEOHead } from '../../components/SEOHead';

const FILTERS = ['all', 'wrong', 'correct'];
const EMPTY_GRADED = [];

/** Renders the answer options of a graded question with correct/incorrect highlighting. */
function QuestionOptions({ question, selected }) {
  const { t } = useLingui();

  if (!question.type || question.type === 'multiple') {
    const correctSet = new Set(question.answer);
    const selectedSet = new Set(selected);
    const sortedEntries = Object.keys(question.options).sort().map((k) => [k, question.options[k]]);
    return (
      <div className="flex flex-col gap-2">
        {sortedEntries.map(([key, value]) => {
          const isCorrect = correctSet.has(key);
          const wasSelected = selectedSet.has(key);
          let cls = 'flex items-baseline gap-2 px-3 py-2 rounded-lg border text-sm ';
          if (isCorrect) cls += 'bg-emerald-500/15 border-emerald-500/50 text-emerald-700 dark:text-emerald-300';
          else if (wasSelected) cls += 'bg-rose-500/15 border-rose-500/50 text-rose-700 dark:text-rose-300';
          else cls += 'bg-glass-light-1 dark:bg-glass-dark-1 border-glass-light-border dark:border-glass-dark-border text-zen-ink/60 dark:text-white/50';
          return (
            <div key={key} className={cls}>
              <span className="font-bold shrink-0">{key}.</span>
              <span>{value}</span>
              {isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-emerald-600 dark:text-emerald-400"><Trans>✓ Correcta</Trans></span>}
              {wasSelected && !isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-rose-600 dark:text-rose-400"><Trans>✗ Tu respuesta</Trans></span>}
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === 'matching') {
    return (
      <div className="flex flex-col gap-2">
        {question.pairs.map((pair, i) => {
          const chosen = selected[i] ?? '';
          const isCorrect = chosen === pair.correctMatch;
          return (
            <div key={pair.term} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${isCorrect ? 'bg-emerald-500/15 border-emerald-500/50' : 'bg-rose-500/15 border-rose-500/50'}`}>
              <span className="font-medium text-zen-ink dark:text-white shrink-0">{pair.term}</span>
              <span className="text-zen-ink/40 dark:text-white/40">→</span>
              <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300 line-through'}>
                {chosen ? question.matches[chosen] : t`— sin responder —`}
              </span>
              {!isCorrect && (
                <span className="ml-auto shrink-0 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">✓ {question.matches[pair.correctMatch]}</span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (question.type === 'ordering') {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs text-zen-ink/50 dark:text-white/50"><Trans>Orden correcto:</Trans></p>
        {question.correctOrder.map((item, i) => (
          <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg border text-sm bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
            <span className="font-bold shrink-0">{i + 1}.</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function ExplanationBox({ text }) {
  const { t } = useLingui();
  return (
    <div className="mt-4 rounded-xl border border-zen/20 bg-zen/5 dark:bg-zen/10 p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-zen dark:text-indigo-300 mb-1.5">
        <Lightbulb size={13} /> <Trans>Explicación</Trans>
      </p>
      <p className="text-sm text-zen-ink/70 dark:text-white/70 leading-relaxed">
        {text || t`No hay explicación disponible para esta pregunta.`}
      </p>
    </div>
  );
}

function QuestionCard({ item, showExplanationFallback }) {
  const unanswered = item.selected.length === 0;
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <GlassBadge tone="brand"><Trans>Pregunta {item.idx + 1}</Trans></GlassBadge>
        {unanswered ? (
          <GlassBadge tone="neutral"><Trans>Sin responder</Trans></GlassBadge>
        ) : item.isCorrect ? (
          <GlassBadge tone="success"><Trans>Correcta</Trans></GlassBadge>
        ) : (
          <GlassBadge tone="danger"><Trans>Incorrecta</Trans></GlassBadge>
        )}
      </div>
      <p className="text-sm font-semibold text-zen-ink dark:text-white leading-relaxed mb-3">{item.question.question}</p>
      <QuestionOptions question={item.question} selected={item.selected} />
      {(item.question.explanation || showExplanationFallback) && (
        <ExplanationBox text={item.question.explanation} />
      )}
    </GlassCard>
  );
}

export function ReviewPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useLingui();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'list'
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!state?.graded) navigate('/results', { replace: true });
  }, [state, navigate]);

  const graded = state?.graded ?? EMPTY_GRADED;
  const { certLabel, percentage, passed } = state ?? {};

  const wrongCount = graded.filter((g) => !g.isCorrect).length;
  const correctCount = graded.filter((g) => g.isCorrect).length;

  const filtered = useMemo(() => {
    if (filter === 'wrong') return graded.filter((g) => !g.isCorrect);
    if (filter === 'correct') return graded.filter((g) => g.isCorrect);
    return graded;
  }, [graded, filter]);

  if (!state?.graded) return null;

  const activeIndex = Math.min(current, Math.max(filtered.length - 1, 0));
  const activeItem = filtered[activeIndex];

  const FILTER_LABELS = { all: t`Todas`, wrong: t`Incorrectas`, correct: t`Correctas` };

  function changeFilter(f) {
    setFilter(f);
    setCurrent(0);
  }

  return (
    <PageBackground>
      <SEOHead title={t`Revisión`} description={t`Revisa tus respuestas pregunta por pregunta.`} path="/results/review" noindex />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zen-ink/40 dark:text-white/40"><Trans>Revisión</Trans></p>
          <p className="font-bold text-zen-ink dark:text-white text-sm truncate">{certLabel}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <GlassBadge tone={passed ? 'success' : 'danger'}>
            {passed ? '✓' : '✗'} {percentage}% · {passed ? t`Aprobado` : t`No aprobado`}
          </GlassBadge>
          <button
            type="button"
            onClick={() => setViewMode((v) => (v === 'single' ? 'list' : 'single'))}
            className="h-9 w-9 flex items-center justify-center rounded-full text-zen-ink/70 dark:text-white/70 bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border hover:text-zen-ink dark:hover:text-white transition-colors"
            aria-label={viewMode === 'single' ? t`Ver todas en lista` : t`Ver de a una`}
            title={viewMode === 'single' ? t`Ver todas en lista` : t`Ver de a una`}
          >
            {viewMode === 'single' ? <Rows3 size={16} /> : <LayoutList size={16} />}
          </button>
          <button
            onClick={() => navigate('/results')}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-zen-ink/70 dark:text-white/70 bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border hover:text-zen-ink dark:hover:text-white transition-colors"
          >
            <X size={14} /> <Trans>Volver a resultados</Trans>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {viewMode === 'single' && filtered.length > 0 && (
            <p className="text-sm text-zen-ink/60 dark:text-white/60">
              <Trans>Pregunta {activeIndex + 1} de {filtered.length}</Trans>
              {' · '}
              <span className="text-rose-600 dark:text-rose-400"><Trans>{wrongCount} incorrectas</Trans></span>
              {' · '}
              <span className="text-emerald-600 dark:text-emerald-400"><Trans>{correctCount} correctas</Trans></span>
            </p>
          )}
          <div className="flex flex-wrap gap-2 ml-auto">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => changeFilter(f)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-zen text-white shadow-zen'
                    : 'bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border text-zen-ink/70 dark:text-white/70 hover:text-zen-ink dark:hover:text-white'
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-zen-ink/60 dark:text-white/60">
            <Trans>No hay preguntas en esta categoría.</Trans>
          </GlassCard>
        ) : viewMode === 'single' ? (
          <>
            {/* Jump grid */}
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((item, i) => (
                <button
                  key={item.idx}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                    i === activeIndex
                      ? 'bg-zen text-white shadow-zen'
                      : item.isCorrect
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25'
                  }`}
                >
                  {item.idx + 1}
                </button>
              ))}
            </div>

            <QuestionCard item={activeItem} showExplanationFallback />

            <div className="flex items-center justify-between gap-3">
              <GlassButton
                variant="secondary"
                disabled={activeIndex === 0}
                onClick={() => setCurrent((i) => Math.max(0, i - 1))}
              >
                <ArrowLeft size={14} /> <Trans>Anterior</Trans>
              </GlassButton>
              <GlassButton
                disabled={activeIndex === filtered.length - 1}
                onClick={() => setCurrent((i) => Math.min(filtered.length - 1, i + 1))}
              >
                <Trans>Siguiente</Trans> <ArrowRight size={14} />
              </GlassButton>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <QuestionCard key={item.idx} item={item} />
            ))}
          </div>
        )}
      </div>
    </PageBackground>
  );
}
