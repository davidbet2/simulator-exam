import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useUserPlan } from '../../plans/hooks/useUserPlan';
import { PageBackground } from '../../../components/glass/PageBackground';
import { SEOHead } from '../../../components/SEOHead';
import { useFlashcards } from '../hooks/useFlashcards';
import { FlashcardView } from '../components/FlashcardView';
import { FlashcardControls } from '../components/FlashcardControls';
import { FlashcardArrowNav } from '../components/FlashcardArrowNav';
import { FlashcardCardPicker } from '../components/FlashcardCardPicker';
import { FlashcardSummary } from '../components/FlashcardSummary';

const DEMO_SLUG = 'demo';

export function FlashcardsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLingui();
  const { user, isLoading: authLoading } = useAuthStore();
  const { isPro, isLoading: planLoading } = useUserPlan();
  const {
    set, cards, total, currentIndex, current, isFlipped, statuses, currentStatus,
    flip, next, previous, goToIndex, shuffle, restart, markKnown, markUnknown,
    knownCount, isFinished, isLoading, error,
  } = useFlashcards(slug);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isDemo = slug === DEMO_SLUG;
  const exitToSet = () => navigate(isDemo ? '/explore' : `/exam-sets/${slug}`);

  // Real sets require an account + Pro — same gate ExamSetLandingPage.launchFlashcards
  // already applies before linking here; this covers users who land on the URL directly.
  // Flashcards are not part of the free plan (only Práctica Rápida is).
  useEffect(() => {
    if (isDemo || authLoading) return;
    if (!user) { navigate('/register'); return; }
    if (!planLoading && !isPro) navigate('/pricing');
  }, [isDemo, authLoading, user, planLoading, isPro, navigate]);

  if (!isDemo && (authLoading || !user || planLoading || !isPro)) {
    return (
      <PageBackground>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zen/30 border-t-zen" />
        </div>
      </PageBackground>
    );
  }

  if (isLoading) {
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
        <SEOHead title={t`Flashcards`} path={`/flashcards/${slug}`} noindex />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-sm font-semibold text-zen-danger">{error}</p>
          <button
            onClick={exitToSet}
            className="rounded-xl bg-zen-brand px-6 py-2 font-bold text-white transition-colors hover:opacity-90"
          >
            <Trans>Volver al set</Trans>
          </button>
        </div>
      </PageBackground>
    );
  }

  const progressPct = total > 0 ? (Math.min(currentIndex, total) / total) * 100 : 0;

  return (
    <PageBackground>
      <SEOHead
        title={t`Flashcards — ${set?.title ?? ''}`}
        description={t`Repasa las preguntas de ${set?.title ?? 'este set'} con flashcards.`}
        path={`/flashcards/${slug}`}
        noindex
      />
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold sm:text-xl">
              <Trans>Flashcards</Trans>
            </h1>
            {set?.title && (
              <p className="truncate text-xs text-zen-ink/60 dark:text-white/50 sm:text-sm">{set.title}</p>
            )}
          </div>
          <button
            type="button"
            onClick={exitToSet}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zen-ink/50 hover:bg-zen/10 hover:text-zen-ink dark:text-white/40 dark:hover:text-white"
            title={t`Salir`}
            aria-label={t`Salir de la sesión`}
          >
            <X size={18} />
          </button>
        </header>

        {!isFinished && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-zen-ink/60 dark:text-white/50">
              <button
                type="button"
                onClick={previous}
                disabled={currentIndex === 0}
                aria-label={t`Anterior`}
                className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-zen/10 hover:text-zen-ink disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-white lg:hidden"
              >
                <ChevronLeft size={14} />
              </button>
              <span>
                <Trans>Tarjeta {Math.min(currentIndex + 1, total)} de {total}</Trans>
              </span>
              <button
                type="button"
                onClick={next}
                aria-label={t`Siguiente`}
                className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-zen/10 hover:text-zen-ink dark:hover:text-white lg:hidden"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label={t`Ir a una tarjeta`}
              title={t`Ir a una tarjeta`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-glass-light-border bg-glass-light-2 text-zen-ink/70 backdrop-blur-md transition-colors hover:bg-glass-light-3 hover:text-zen-ink dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white/60 dark:hover:bg-glass-dark-3 dark:hover:text-white"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        )}
        {!isFinished && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-glass-light-2 dark:bg-glass-dark-2">
            <motion.div
              className="h-full rounded-full bg-zen-brand"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex flex-1 flex-col justify-center gap-8">
          {isFinished ? (
            <FlashcardSummary
              knownCount={knownCount}
              total={total}
              onRestart={restart}
              onExit={exitToSet}
            />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <FlashcardArrowNav side="left" onClick={previous} disabled={currentIndex === 0} />
                <div className="min-w-0 flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current?.id ?? currentIndex}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <FlashcardView
                        card={current}
                        isFlipped={isFlipped}
                        status={currentStatus}
                        onFlip={flip}
                        onMarkKnown={markKnown}
                        onMarkUnknown={markUnknown}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <FlashcardArrowNav side="right" onClick={next} />
              </div>
              <FlashcardControls onShuffle={shuffle} onFlip={flip} onRestart={restart} />
            </>
          )}
        </div>
      </div>

      <FlashcardCardPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        cards={cards}
        currentIndex={currentIndex}
        statuses={statuses}
        onSelect={goToIndex}
      />
    </PageBackground>
  );
}
