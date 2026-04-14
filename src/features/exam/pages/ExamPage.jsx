import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CERTIFICATIONS } from '../../../core/constants/certifications';
import { useExam } from '../hooks/useExam';
import { QuestionCard } from '../components/QuestionCard';
import { TimerBox } from '../components/TimerBox';

/** Wrapping chips showing each question's status */
function QuestionNavigator({ total, current, answers, flags, revealed, displayQuestions, mode, onNavigate }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-200">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current;
        const sel = answers[i] ?? [];
        const isAnswered = sel.length > 0;
        const isRevealed = revealed?.[i] ?? false;
        const isFlagged = flags[i];

        let cls =
          'shrink-0 w-8 h-8 rounded text-xs font-bold border transition-colors flex items-center justify-center cursor-pointer ';
        if (isCurrent) {
          cls += 'bg-appian-blue text-white border-appian-blue shadow-sm';
        } else if (mode === 'study' && isRevealed) {
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
          cls += isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-red-400 text-white border-red-400';
        } else if (mode === 'study' && isAnswered) {
          cls += 'bg-yellow-400 text-white border-yellow-400';
        } else if (isFlagged) {
          cls += 'bg-red-500 text-white border-red-500';
        } else if (isAnswered) {
          cls += 'bg-green-500 text-white border-green-500';
        } else {
          cls += 'bg-white text-gray-500 border-gray-300 hover:border-appian-blue hover:text-appian-blue';
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
  if (mode === 'study') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-appian-blue" /> Actual</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500" /> Correcta</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-400" /> Incorrecta</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-yellow-400" /> Sin confirmar</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-white border border-gray-300" /> Sin responder</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-appian-blue" /> Actual</span>
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-green-500" /> Respondida</span>
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-500" /> Con duda</span>
      <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-white border border-gray-300" /> Sin responder</span>
    </div>
  );
}

/** Submit confirmation / unanswered-warning modal */
function SubmitGuardModal({ unanswered, onNavigate, onConfirm, onCancel }) {
  const hasUnanswered = unanswered.length > 0;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="font-bold text-gray-800 text-base mb-2">
          {hasUnanswered ? '⚠️ Preguntas sin responder' : '¿Enviar el examen?'}
        </h2>

        {hasUnanswered ? (
          <>
            <p className="text-sm text-appian-muted mb-4">
              {unanswered.length === 1
                ? 'La siguiente pregunta no fue respondida. Puedes ir a responderla o enviar de todas formas.'
                : `Las siguientes ${unanswered.length} preguntas no fueron respondidas. Puedes ir a responderlas o enviar de todas formas.`}
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {unanswered.map((idx) => (
                <button
                  key={idx}
                  onClick={() => { onNavigate(idx); onCancel(); }}
                  className="text-xs font-bold bg-gray-100 hover:bg-appian-blue-light hover:text-appian-blue border border-gray-300 hover:border-appian-blue px-3 py-1.5 rounded transition-colors"
                >
                  Pregunta {idx + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-appian-muted mb-5">
            Has respondido todas las preguntas. ¿Deseas enviar el examen ahora?
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-appian-blue hover:bg-appian-blue-dark text-white font-bold rounded transition-colors"
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
  const mode = searchParams.get('mode') ?? 'exam';
  const certification = CERTIFICATIONS.find((c) => c.id === certId);
  const [showSubmitGuard, setShowSubmitGuard] = useState(false);

  const {
    displayQuestions,
    current,
    answers,
    flags,
    revealed,
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
    confirmAnswer,
    submitExam,
  } = useExam(certification, mode);

  useEffect(() => {
    if (status === 'finished') {
      navigate('/results', {
        replace: true,
        state: { score, total, isTimeOut, certLabel: certification?.labelEs ?? certId, passPercent, displayQuestions, answers, mode },
      });
    }
  }, [status, navigate, score, total, isTimeOut, certification, certId, passPercent, displayQuestions, answers]);

  useEffect(() => {
    if (!certification) navigate('/', { replace: true });
  }, [certification, navigate]);

  if (!certification) return null;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-appian-muted">Cargando preguntas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-appian-error font-semibold">{error}</p>
        <button onClick={() => navigate('/')} className="bg-appian-blue text-white font-bold py-2 px-6 rounded">
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
    <div className="min-h-screen bg-appian-bg flex items-start justify-center py-8 px-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-md">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h1 className="text-appian-blue font-bold text-base">{certification.labelEs}</h1>
            {mode === 'study' ? (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded">📖 Estudio</span>
            ) : (
              <span className="text-xs bg-blue-100 text-appian-blue font-semibold px-2 py-0.5 rounded">🎯 Examen</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-appian-muted font-medium">
              {answeredCount}/{total} respondidas
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

        {/* Progress bar (% answered) */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-green-500 transition-all"
            style={{ width: total > 0 ? `${(answeredCount / total) * 100}%` : '0%' }}
          />
        </div>

        {/* Question */}
        <main className="px-8 py-6">
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

        {/* Footer navigation */}
        <footer className="px-8 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={() => navigateTo(current - 1)}
            disabled={current === 0}
            className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          {/* Study mode: confirm button appears when answer selected but not yet revealed */}
          {mode === 'study' && (answers[current] ?? []).length > 0 && !(revealed[current] ?? false) && (
            <button
              onClick={() => confirmAnswer(current)}
              className="px-5 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-bold rounded transition-colors"
            >
              Confirmar respuesta ✓
            </button>
          )}

          {current < total - 1 ? (
            <button
              onClick={() => navigateTo(current + 1)}
              className="px-5 py-2 text-sm bg-appian-blue hover:bg-appian-blue-dark text-white font-bold rounded transition-colors"
            >
              Siguiente →
            </button>
          ) : mode === 'study' ? (
            <button
              onClick={submitExam}
              className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors"
            >
              Ver resultados ✓
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitGuard(true)}
              className="px-5 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors"
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
