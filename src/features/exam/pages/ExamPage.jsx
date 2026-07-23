import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Trans, useLingui, Plural } from '@lingui/react/macro';
import { db } from '../../../core/firebase/firebase';
import { CERTIFICATIONS } from '../../../core/constants/certifications';
import { useExam } from '../hooks/useExam';
import { QuestionCard } from '../components/QuestionCard';
import { TimerBox } from '../components/TimerBox';
import { X, FlagOff } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import { PageBackground } from '../../../components/glass/PageBackground';

/** Wager mode — 3-button confidence multiplier selector (×1 Dudo / ×2 Creo / ×3 Seguro). */
function ConfidencePicker({ value, onPick, disabled }) {
  const options = [
    { level: 1, label: /* i18n */ <Trans>Dudo</Trans>,  emoji: '🤔', hint: '×1' },
    { level: 2, label: /* i18n */ <Trans>Creo</Trans>,  emoji: '✓',  hint: '×2' },
    { level: 3, label: /* i18n */ <Trans>Seguro</Trans>, emoji: '⚡', hint: '×3' },
  ];
  return (
    <div className="px-6 pb-4">
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-3">
        <p className="text-xs font-semibold text-zen-ink/70 dark:text-white/60 mb-2 flex items-center gap-1.5">
          <span>🎲</span>
          <span><Trans>¿Cuánto apuestas por tu respuesta?</Trans></span>
          {!value && <span className="ml-auto text-[10px] uppercase tracking-wider text-rose-600 font-bold"><Trans>Requerido</Trans></span>}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {options.map((opt) => {
            const selected = value === opt.level;
            return (
              <button
                key={opt.level}
                type="button"
                disabled={disabled}
                onClick={() => onPick(opt.level)}
                aria-pressed={selected}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                  selected
                    ? 'border-rose-500 bg-rose-500 text-white shadow-md'
                    : 'border-glass-light-border dark:border-glass-dark-border bg-glass-light-2 dark:bg-glass-dark-2 text-zen-ink/70 dark:text-white/60 hover:border-rose-400 hover:text-rose-600'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-lg leading-none">{opt.emoji}</span>
                <span className="text-xs">{opt.label}</span>
                <span className={`text-[10px] font-bold ${selected ? 'text-white/90' : 'text-rose-600'}`}>{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Wrapping chips showing each question's status */
function QuestionNavigator({ total, current, answers, flags, revealed, displayQuestions, mode, onNavigate }) {
  const { t } = useLingui();
  const isStudy = mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager';
  return (
      <div className="flex flex-wrap gap-1.5 px-4 py-3 bg-glass-light-1 dark:bg-glass-dark-1 border-b border-glass-light-border dark:border-glass-dark-border">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const sel = answers[i] ?? [];
        const isAnswered = sel.length > 0;
        const isRevealed = revealed?.[i] ?? false;
        const isFlagged = flags[i];

        let cls =
          'shrink-0 w-8 h-8 rounded text-xs font-bold border transition-colors flex items-center justify-center cursor-pointer ';
        if (isCurrent) {
          cls += 'bg-zen-brand text-white border-zen shadow-zen';
        } else if (isStudy && isRevealed) {
          const dq = displayQuestions[i];
          let isCorrect = false;
          if (dq.type === 'matching') {
            isCorrect = sel.length > 0 && dq.pairs.every((p, pi) => sel[pi] === p.correctMatch);
          } else if (dq.type === 'ordering') {
            isCorrect =
              sel.length > 0 &&
              sel.length === dq.correctOrder?.length &&
              sel.every((v, pi) => v === dq.correctOrder[pi]);
          } else {
            const correct = [...dq.answer].sort();
            const sortedSel = [...sel].sort();
            isCorrect = sortedSel.length === correct.length && sortedSel.every((v, j) => v === correct[j]);
          }
          cls += isCorrect ? 'bg-zen-success/100 text-white border-success-500' : 'bg-zen-danger/100 text-white border-danger-500';
        } else if (isStudy && isAnswered) {
          cls += 'bg-warning-500 text-white border-warning-500';
        } else if (isFlagged) {
          cls += 'bg-zen-danger/100 text-white border-danger-500';
        } else if (isAnswered) {
          cls += 'bg-zen-success/100 text-white border-success-500';
        } else {
          cls += 'bg-glass-light-2 dark:bg-glass-dark-2 text-zen-ink/70 dark:text-white/60 border-glass-light-border dark:border-glass-dark-border hover:border-zen hover:text-indigo-300';
        }

        return (
          <button key={i} className={cls} onClick={() => onNavigate(i)} title={t`Pregunta ${i + 1}`}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

/** Legend for chip colors */
function NavLegend({ mode }) {
  const isStudy = mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager';
  if (isStudy) {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 bg-glass-light-1 dark:bg-glass-dark-1 border-b border-glass-light-border dark:border-glass-dark-border text-xs text-zen-ink/70 dark:text-white/60">
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-brand" /> <Trans>Actual</Trans></span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-success/100" /> <Trans>Correcta</Trans></span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-danger/100" /> <Trans>Incorrecta</Trans></span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-warning-500" /> <Trans>Sin confirmar</Trans></span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border" /> <Trans>Sin responder</Trans></span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-glass-light-1 dark:bg-glass-dark-1 border-b border-glass-light-border dark:border-glass-dark-border text-xs text-zen-ink/70 dark:text-white/60">
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-brand" /> <Trans>Actual</Trans></span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-success/100" /> <Trans>Respondida</Trans></span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-zen-danger/100" /> <Trans>Con duda</Trans></span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border" /> <Trans>Sin responder</Trans></span>
    </div>
  );
}

/** Exit confirmation modal */
function ExitGuardModal({ mode, onExit, onFinish, onCancel }) {
  const isExam = mode === 'exam';
  const isStudyLike = mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager';
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="rounded-2xl border bg-white/90 backdrop-blur-xl dark:bg-[#221c49]/95 w-full max-w-sm p-6 border border-glass-light-border dark:border-glass-dark-border">
        <h2 className="font-display font-bold text-zen-ink dark:text-white text-base mb-2">
          {isExam ? <Trans>⚠️ ¿Salir del examen?</Trans> : <Trans>¿Salir de la sesión?</Trans>}
        </h2>
        <p className="text-sm text-zen-ink/70 dark:text-white/60 mb-5">
          {isExam
            ? <Trans>Si sales, perderás todo el progreso de este examen. Las respuestas no se guardarán.</Trans>
            : <Trans>Tu progreso está guardado automáticamente. Podrás retomar desde donde lo dejaste cuando vuelvas.</Trans>}
        </p>
        <div className="flex flex-col gap-2">
          {isStudyLike && (
            <button
              onClick={onFinish}
              className="w-full px-4 py-2.5 text-sm bg-zen-success/100 hover:bg-success-600 text-white font-bold rounded-xl transition-colors"
            >
              <Trans>Finalizar y ver resultados ✓</Trans>
            </button>
          )}
          <button
            onClick={onExit}
            className="w-full px-4 py-2.5 text-sm border border-glass-light-border dark:border-glass-dark-border rounded-xl text-zen-ink/70 dark:text-white/60 hover:bg-zen/10 transition-colors"
          >
            {isExam ? <Trans>Salir sin guardar</Trans> : <Trans>Guardar y salir</Trans>}
          </button>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 text-sm text-zen dark:text-indigo-300 font-medium hover:underline transition-colors"
          >
            <Trans>Continuar la sesión</Trans>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Submit confirmation / unanswered-warning modal */
function SubmitGuardModal({ unanswered, onNavigate, onConfirm, onCancel }) {
  const hasUnanswered = unanswered.length > 0;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="rounded-2xl border bg-white/90 backdrop-blur-xl dark:bg-[#221c49]/95 w-full max-w-md p-6 border border-glass-light-border dark:border-glass-dark-border">
        <h2 className="font-display font-bold text-zen-ink dark:text-white text-base mb-2">
          {hasUnanswered ? <Trans>⚠️ Preguntas sin responder</Trans> : <Trans>¿Enviar el examen?</Trans>}
        </h2>

        {hasUnanswered ? (
          <>
            <p className="text-sm text-zen-ink/70 dark:text-white/60 mb-4">
              <Plural
                value={unanswered.length}
                one="La siguiente pregunta no fue respondida. Puedes ir a responderla o enviar de todas formas."
                other="Las siguientes # preguntas no fueron respondidas. Puedes ir a responderlas o enviar de todas formas."
              />
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {unanswered.map((idx) => (
                <button
                  key={idx}
                  onClick={() => { onNavigate(idx); onCancel(); }}
                  className="text-xs font-bold bg-glass-light-1 dark:bg-glass-dark-1 hover:bg-zen/20 hover:text-indigo-300 border border-glass-light-border dark:border-glass-dark-border hover:border-zen/50 px-3 py-1.5 rounded-lg transition-colors text-zen-ink/70 dark:text-white/60"
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-zen-ink/70 dark:text-white/60 mb-5">
            <Trans>Has respondido todas las preguntas. ¿Deseas enviar el examen ahora?</Trans>
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-glass-light-border dark:border-glass-dark-border rounded-xl text-zen-ink/70 dark:text-white/60 hover:bg-zen/10 transition-colors"
          >
            <Trans>Cancelar</Trans>
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-zen-brand hover:opacity-90 text-white font-bold rounded-xl transition-colors"
          >
            {hasUnanswered ? <Trans>Enviar de todas formas</Trans> : <Trans>Enviar examen</Trans>}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExamPage() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const certId = searchParams.get('cert');
  const setId  = searchParams.get('setId');
  const mode = searchParams.get('mode') ?? 'exam';
  const countParam = Number(searchParams.get('count'));
  const countOverride = Number.isFinite(countParam) && countParam > 0 ? countParam : null;
  const domainFilter = searchParams.get('domain') || null;
  const staticCertification = CERTIFICATIONS.find((c) => c.id === certId);
  const [setCertification, setSetCertification] = useState(null);
  const [setLoadError, setSetLoadError]         = useState(false);
  const certification = staticCertification ?? setCertification;
  const [showSubmitGuard, setShowSubmitGuard] = useState(false);
  const [showExitGuard, setShowExitGuard] = useState(false);

  // ExamSet path: load set metadata and build a virtual certification
  useEffect(() => {
    if (staticCertification || !setId) return;
    let active = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'examSets', setId));
        if (!active) return;
        if (!snap.exists()) { setSetLoadError(true); return; }
        const data = snap.data();
        setSetCertification({
          id: `set:${setId}`,
          setId,
          isExamSet: true,
          label: data.title ?? setId,
          labelEs: data.title ?? setId,
          category: data.category ?? data.domain ?? 'other',
          level: data.level ?? 'beginner',
          questionCount: data.questionCount ?? 10,
          timeMinutes: data.timeMinutes ?? 30,
          passPercent: data.passPercent ?? 70,
          available: true,
          color: 'blue',
        });
      } catch {
        if (active) setSetLoadError(true);
      }
    })();
    return () => { active = false; };
  }, [setId, staticCertification]);

  const {
    displayQuestions,
    current,
    answers,
    flags,
    revealed,
    confidence,
    score,
    timeLeft,
    status,
    error,
    isTimeOut,
    passPercent,
    total,
    navigateTo,
    saveAnswer,
    toggleFlag,
    setConfidenceFor,
    confirmAnswer,
    submitExam,
  } = useExam(certification, mode, countOverride, domainFilter);

  useEffect(() => {
    if (status === 'finished') {
      const timeSpentSeconds = certification?.timeMinutes
        ? Math.max(0, certification.timeMinutes * 60 - timeLeft)
        : null;
      navigate('/results', {
        replace: true,
        state: { score, total, isTimeOut, certLabel: certification?.labelEs ?? certId, certId, passPercent, displayQuestions, answers, mode, confidence, timeSpentSeconds },
      });
    }
  }, [status, navigate, score, total, isTimeOut, certification, certId, passPercent, displayQuestions, answers, mode, confidence, timeLeft]);

  useEffect(() => {
    if (setLoadError) { navigate('/explore', { replace: true }); return; }
    // Wait for either a static cert or async-loaded set metadata before redirecting
    if (!certification && !setId) navigate('/', { replace: true });
  }, [certification, navigate, setId, setLoadError]);

  if (!certification) return null;

  if (status === 'loading') {
    return (
      <PageBackground>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-zen/30 border-t-zen animate-spin" />
          <p className="text-zen-ink/70 dark:text-white/60 text-sm"><Trans>Cargando preguntas...</Trans></p>
        </div>
      </div>
      </PageBackground>
    );
  }

  if (error) {
    return (
      <PageBackground>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-danger-500 font-semibold">{error}</p>
        <button onClick={() => navigate('/')} className="bg-zen-brand hover:opacity-90 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          <Trans>Volver al inicio</Trans>
        </button>
      </div>
      </PageBackground>
    );
  }

  const question = displayQuestions[current];
  const answeredCount = Object.values(answers).filter((v) => v.length > 0).length;
  const unansweredIndices = Array.from({ length: total }, (_, i) => i).filter(
    (i) => (answers[i] ?? []).length === 0
  );

  return (
    <PageBackground>
    <div className="min-h-screen flex items-start justify-center py-6 px-4">
      <SEOHead title={t`Examen`} description={t`Sesión de práctica de examen de certificación.`} path="/exam" noindex />
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-glass-light-border bg-glass-light-2 shadow-zen-glass backdrop-blur-md dark:border-glass-dark-border dark:bg-glass-dark-2 dark:shadow-none">

        {/* Header — Game HUD */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-glass-light-border dark:border-glass-dark-border bg-glass-light-2 dark:bg-glass-dark-2">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowExitGuard(true)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-zen-ink/50 dark:text-white/40 hover:text-zen-ink dark:hover:text-white hover:bg-zen/10 transition-colors"
              title={t`Salir`}
              aria-label={t`Salir de la sesión`}
            >
              <X size={15} />
            </button>
            <h1 className="font-display font-bold text-zen-ink dark:text-white text-sm">{certification.labelEs}</h1>
            {mode === 'study' ? (
              <span className="text-xs bg-zen-success/100/20 text-success-500 font-semibold px-2 py-0.5 rounded-full">📖 <Trans>Estudio</Trans></span>
            ) : mode === 'weak' ? (
              <span className="text-xs bg-violet-500/20 text-violet-500 font-semibold px-2 py-0.5 rounded-full">🎯 <Trans>Zona Débil</Trans></span>
            ) : mode === 'srs' ? (
              <span className="text-xs bg-amber-500/20 text-amber-500 font-semibold px-2 py-0.5 rounded-full">🧠 <Trans>Repaso</Trans></span>
            ) : mode === 'wager' ? (
              <span className="text-xs bg-rose-500/20 text-rose-600 font-semibold px-2 py-0.5 rounded-full">🎲 <Trans>Apuesta</Trans></span>
            ) : (
              <span className="text-xs bg-zen/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full">🎯 <Trans>Examen</Trans></span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zen-ink/70 dark:text-white/60 font-medium tabular-nums">
              <span className="text-zen-ink dark:text-white font-bold">{answeredCount}</span>/{total}
            </span>
            {mode === 'exam' && <TimerBox timeLeft={timeLeft} />}
            {(mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager') && (
              <button
                type="button"
                onClick={submitExam}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-success-500/40 text-success-600 dark:text-success-400 hover:bg-zen-success/100/10 transition-colors"
                title={t`Finalizar sesión y ver resultados`}
              >
                <Trans>Finalizar ✓</Trans>
              </button>
            )}
          </div>
        </header>

        {/* Question navigator */}
        <QuestionNavigator
          total={total}
          current={current}
          answers={answers}
          flags={flags}
          revealed={revealed}
          displayQuestions={displayQuestions}
          mode={mode}
          onNavigate={navigateTo}
        />

        {/* Color legend */}
        <NavLegend mode={mode} />

        {/* Progress bar */}
        <div className="h-1 bg-glass-light-1 dark:bg-glass-dark-1">
          <div
            className="h-1 bg-gradient-to-r from-zen to-zen-violet transition-all duration-500"
            style={{ width: total > 0 ? `${(answeredCount / total) * 100}%` : '0%' }}
          />
        </div>

        {/* Question */}
        <main className="px-6 py-6">
          {question && (
            <QuestionCard
              question={question}
              questionNumber={current + 1}
              total={total}
              savedSelection={answers[current] ?? []}
              flagged={flags[current] ?? false}
              mode={mode}
              revealed={revealed[current] ?? false}
              onSelectionChange={(keys) => saveAnswer(current, keys)}
              onToggleFlag={() => toggleFlag(current)}
            />
          )}
        </main>

        {/* Wager mode — confidence picker (shown before reveal) */}
        {mode === 'wager' && question && !(revealed[current] ?? false) && (
          <ConfidencePicker
            value={confidence?.[current]}
            onPick={(lvl) => setConfidenceFor(current, lvl)}
          />
        )}

        {/* Footer navigation */}
        <footer className="px-6 py-4 border-t border-glass-light-border dark:border-glass-dark-border bg-glass-light-2 dark:bg-glass-dark-2 flex items-center justify-between gap-3">
          <button
            onClick={() => navigateTo(current - 1)}
            disabled={current === 0}
            className="px-4 py-2 text-sm border border-glass-light-border dark:border-glass-dark-border rounded-xl text-zen-ink/70 dark:text-white/60 hover:bg-zen/10 hover:text-zen-ink dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Trans>← Anterior</Trans>
          </button>

          {/* Study / wager mode: confirm button */}
          {(mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager') && (answers[current] ?? []).length > 0 && !(revealed[current] ?? false) && (() => {
            const needsConfidence = mode === 'wager' && !confidence?.[current];
            return (
              <button
                onClick={() => !needsConfidence && confirmAnswer(current)}
                disabled={needsConfidence}
                title={needsConfidence ? t`Elige tu nivel de confianza antes de confirmar` : undefined}
                className={`px-5 py-2 text-sm text-white font-bold rounded-xl transition-all active:scale-95 ${
                  needsConfidence
                    ? 'bg-zen-success/100/40 cursor-not-allowed'
                    : 'bg-zen-success/100 hover:bg-success-600'
                }`}
              >
                <Trans>Confirmar ✓</Trans>
              </button>
            );
          })()}

          {current < total - 1 ? (
            <button
              onClick={() => navigateTo(current + 1)}
              className="px-5 py-2 text-sm bg-zen-brand hover:opacity-90 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Trans>Siguiente →</Trans>
            </button>
          ) : (mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager') ? (
            <button
              onClick={submitExam}
              className="px-5 py-2 text-sm bg-zen-success/100 hover:bg-success-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Trans>Ver resultados ✓</Trans>
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitGuard(true)}
              className="px-5 py-2 text-sm bg-zen-success/100 hover:bg-success-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              <Trans>Finalizar examen ✓</Trans>
            </button>
          )}
        </footer>
      </div>

      {mode === 'exam' && showSubmitGuard && (
        <SubmitGuardModal
          unanswered={unansweredIndices}
          onNavigate={navigateTo}
          onConfirm={() => { setShowSubmitGuard(false); submitExam(); }}
          onCancel={() => setShowSubmitGuard(false)}
        />
      )}

      {showExitGuard && (
        <ExitGuardModal
          mode={mode}
          onFinish={() => { setShowExitGuard(false); submitExam(); }}
          onExit={() => {
            setShowExitGuard(false);
            // For exam mode, session is already cleared on finish; for study modes
            // sessionStorage is preserved so the user can resume.
            const backUrl = certification?.isExamSet
              ? `/exam-sets/${certification.setId}`
              : '/explore';
            navigate(backUrl);
          }}
          onCancel={() => setShowExitGuard(false)}
        />
      )}
    </div>
    </PageBackground>
  );
}
