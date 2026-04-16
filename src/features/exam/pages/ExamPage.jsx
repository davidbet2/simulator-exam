import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { CERTIFICATIONS } from '../../../core/constants/certifications';
import { useExam } from '../hooks/useExam';
import { QuestionCard } from '../components/QuestionCard';
import { TimerBox } from '../components/TimerBox';

/** Wager mode — 3-button confidence multiplier selector (×1 Dudo / ×2 Creo / ×3 Seguro). */
function ConfidencePicker({ value, onPick, disabled }) {
  const options = [
    { level: 1, label: 'Dudo',  emoji: '🤔', hint: '×1' },
    { level: 2, label: 'Creo',  emoji: '✓',  hint: '×2' },
    { level: 3, label: 'Seguro', emoji: '⚡', hint: '×3' },
  ];
  return (
    <div className="px-6 pb-4">
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-3">
        <p className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
          <span>🎲</span>
          <span>¿Cuánto apuestas por tu respuesta?</span>
          {!value && <span className="ml-auto text-[10px] uppercase tracking-wider text-rose-600 font-bold">Requerido</span>}
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
                    : 'border-surface-border bg-surface-card text-ink-soft hover:border-rose-400 hover:text-rose-600'
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
  const isStudy = mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager';
  return (
      <div className="flex flex-wrap gap-1.5 px-4 py-3 bg-surface-soft border-b border-surface-border">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const sel = answers[i] ?? [];
        const isAnswered = sel.length > 0;
        const isRevealed = revealed?.[i] ?? false;
        const isFlagged = flags[i];

        let cls =
          'shrink-0 w-8 h-8 rounded text-xs font-bold border transition-colors flex items-center justify-center cursor-pointer ';
        if (isCurrent) {
          cls += 'bg-brand-500 text-white border-brand-500 shadow-glow-brand';
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
          cls += isCorrect ? 'bg-success-500 text-white border-success-500' : 'bg-danger-500 text-white border-danger-500';
        } else if (isStudy && isAnswered) {
          cls += 'bg-warning-500 text-white border-warning-500';
        } else if (isFlagged) {
          cls += 'bg-danger-500 text-white border-danger-500';
        } else if (isAnswered) {
          cls += 'bg-success-500 text-white border-success-500';
        } else {
          cls += 'bg-surface-card text-ink-soft border-surface-border hover:border-brand-400 hover:text-brand-300';
        }

        return (
          <button key={i} className={cls} onClick={() => onNavigate(i)} title={`Pregunta ${i + 1}`}>
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 bg-surface-soft/50 border-b border-surface-border text-xs text-ink-soft">
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-brand-500" /> Actual</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-success-500" /> Correcta</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-danger-500" /> Incorrecta</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-warning-500" /> Sin confirmar</span>
        <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-surface-muted border border-surface-border" /> Sin responder</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-surface-soft/50 border-b border-surface-border text-xs text-ink-soft">
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-brand-500" /> Actual</span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-success-500" /> Respondida</span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-danger-500" /> Con duda</span>
      <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded bg-surface-muted border border-surface-border" /> Sin responder</span>
    </div>
  );
}

/** Submit confirmation / unanswered-warning modal */
function SubmitGuardModal({ unanswered, onNavigate, onConfirm, onCancel }) {
  const hasUnanswered = unanswered.length > 0;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="glass-bright rounded-2xl shadow-card w-full max-w-md p-6 border border-surface-border">
        <h2 className="font-display font-bold text-ink text-base mb-2">
          {hasUnanswered ? '⚠️ Preguntas sin responder' : '¿Enviar el examen?'}
        </h2>

        {hasUnanswered ? (
          <>
            <p className="text-sm text-ink-soft mb-4">
              {unanswered.length === 1
                ? 'La siguiente pregunta no fue respondida. Puedes ir a responderla o enviar de todas formas.'
                : `Las siguientes ${unanswered.length} preguntas no fueron respondidas. Puedes ir a responderlas o enviar de todas formas.`}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {unanswered.map((idx) => (
                <button
                  key={idx}
                  onClick={() => { onNavigate(idx); onCancel(); }}
                  className="text-xs font-bold bg-surface-muted hover:bg-brand-500/20 hover:text-brand-300 border border-surface-border hover:border-brand-500/50 px-3 py-1.5 rounded-lg transition-colors text-ink-soft"
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-ink-soft mb-5">
            Has respondido todas las preguntas. ¿Deseas enviar el examen ahora?
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-surface-border rounded-xl text-ink-soft hover:bg-surface-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors"
          >
            {hasUnanswered ? 'Enviar de todas formas' : 'Enviar examen'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExamPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const certId = searchParams.get('cert');
  const setId  = searchParams.get('setId');
  const mode = searchParams.get('mode') ?? 'exam';
  const countParam = Number(searchParams.get('count'));
  const countOverride = Number.isFinite(countParam) && countParam > 0 ? countParam : null;
  const staticCertification = CERTIFICATIONS.find((c) => c.id === certId);
  const [setCertification, setSetCertification] = useState(null);
  const [setLoadError, setSetLoadError]         = useState(false);
  const certification = staticCertification ?? setCertification;
  const [showSubmitGuard, setShowSubmitGuard] = useState(false);

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
  } = useExam(certification, mode, countOverride);

  useEffect(() => {
    if (status === 'finished') {
      navigate('/results', {
        replace: true,
        state: { score, total, isTimeOut, certLabel: certification?.labelEs ?? certId, certId, passPercent, displayQuestions, answers, mode, confidence },
      });
    }
  }, [status, navigate, score, total, isTimeOut, certification, certId, passPercent, displayQuestions, answers, mode, confidence]);

  useEffect(() => {
    if (setLoadError) { navigate('/explore', { replace: true }); return; }
    // Wait for either a static cert or async-loaded set metadata before redirecting
    if (!certification && !setId) navigate('/', { replace: true });
  }, [certification, navigate, setId, setLoadError]);

  if (!certification) return null;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
          <p className="text-ink-soft text-sm">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-danger-500 font-semibold">{error}</p>
        <button onClick={() => navigate('/')} className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 px-6 rounded-xl transition-colors">
          Volver al inicio
        </button>
      </div>
    );
  }

  const question = displayQuestions[current];
  const answeredCount = Object.values(answers).filter((v) => v.length > 0).length;
  const unansweredIndices = Array.from({ length: total }, (_, i) => i).filter(
    (i) => (answers[i] ?? []).length === 0
  );

  return (
    <div className="min-h-screen flex items-start justify-center py-6 px-4">
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-card bg-surface-soft border border-surface-border">

        {/* Header — Game HUD */}
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border bg-surface-card">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            <h1 className="font-display font-bold text-ink text-sm">{certification.labelEs}</h1>
            {mode === 'study' ? (
              <span className="text-xs bg-success-500/20 text-success-500 font-semibold px-2 py-0.5 rounded-full">📖 Estudio</span>
            ) : mode === 'weak' ? (
              <span className="text-xs bg-violet-500/20 text-violet-500 font-semibold px-2 py-0.5 rounded-full">🎯 Zona Débil</span>
            ) : mode === 'srs' ? (
              <span className="text-xs bg-amber-500/20 text-amber-500 font-semibold px-2 py-0.5 rounded-full">🧠 Repaso</span>
            ) : mode === 'wager' ? (
              <span className="text-xs bg-rose-500/20 text-rose-600 font-semibold px-2 py-0.5 rounded-full">🎲 Apuesta</span>
            ) : (
              <span className="text-xs bg-brand-500/20 text-brand-400 font-semibold px-2 py-0.5 rounded-full">🎯 Examen</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-soft font-medium tabular-nums">
              <span className="text-ink font-bold">{answeredCount}</span>/{total}
            </span>
            {mode === 'exam' && <TimerBox timeLeft={timeLeft} />}
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
        <div className="h-1 bg-surface-muted">
          <div
            className="h-1 bg-gradient-to-r from-brand-500 to-success-500 transition-all duration-500"
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
        <footer className="px-6 py-4 border-t border-surface-border bg-surface-card flex items-center justify-between gap-3">
          <button
            onClick={() => navigateTo(current - 1)}
            disabled={current === 0}
            className="px-4 py-2 text-sm border border-surface-border rounded-xl text-ink-soft hover:bg-surface-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Anterior
          </button>

          {/* Study / wager mode: confirm button */}
          {(mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager') && (answers[current] ?? []).length > 0 && !(revealed[current] ?? false) && (() => {
            const needsConfidence = mode === 'wager' && !confidence?.[current];
            return (
              <button
                onClick={() => !needsConfidence && confirmAnswer(current)}
                disabled={needsConfidence}
                title={needsConfidence ? 'Elige tu nivel de confianza antes de confirmar' : undefined}
                className={`px-5 py-2 text-sm text-white font-bold rounded-xl transition-all active:scale-95 ${
                  needsConfidence
                    ? 'bg-success-500/40 cursor-not-allowed'
                    : 'bg-success-500 hover:bg-success-600'
                }`}
              >
                Confirmar ✓
              </button>
            );
          })()}

          {current < total - 1 ? (
            <button
              onClick={() => navigateTo(current + 1)}
              className="px-5 py-2 text-sm bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Siguiente →
            </button>
          ) : (mode === 'study' || mode === 'weak' || mode === 'srs' || mode === 'wager') ? (
            <button
              onClick={submitExam}
              className="px-5 py-2 text-sm bg-success-500 hover:bg-success-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Ver resultados ✓
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitGuard(true)}
              className="px-5 py-2 text-sm bg-success-500 hover:bg-success-600 text-white font-bold rounded-xl transition-all active:scale-95"
            >
              Finalizar examen ✓
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
    </div>
  );
}
