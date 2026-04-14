import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Modal that shows every question the user got wrong or skipped */
function WrongAnswersModal({ wrongItems, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg z-10">
          <h2 className="font-bold text-gray-800 text-base">
            Respuestas incorrectas / sin responder ({wrongItems.length})
          </h2>
          <button
            onClick={onClose}
            className="text-appian-muted hover:text-gray-800 text-lg leading-none font-bold"
          >
            ✕
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {wrongItems.map(({ idx, question, selected }) => {
            const unanswered = selected.length === 0;

            return (
              <div key={idx} className="px-6 py-5">
                {/* Question header */}
                <div className="flex items-start gap-2 mb-3">
                  <span className="shrink-0 text-xs font-bold bg-appian-blue-light text-appian-blue px-2 py-0.5 rounded mt-0.5">
                    #{idx + 1}
                  </span>
                  {unanswered && (
                    <span className="shrink-0 text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded mt-0.5">
                      Sin responder
                    </span>
                  )}
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                    {question.question}
                  </p>
                </div>

                {/* Options — multiple choice */}
                {!question.type || question.type === 'multiple' ? (() => {
                  const correctSet = new Set(question.answer);
                  const selectedSet = new Set(selected);
                  const sortedEntries = Object.keys(question.options).sort().map((k) => [k, question.options[k]]);
                  return (
                    <div className="flex flex-col gap-2 ml-4">
                      {sortedEntries.map(([key, value]) => {
                        const isCorrect = correctSet.has(key);
                        const wasSelected = selectedSet.has(key);
                        let cls = 'flex items-baseline gap-2 px-3 py-2 rounded border text-sm ';
                        if (isCorrect) cls += 'bg-green-50 border-green-400 text-green-800';
                        else if (wasSelected) cls += 'bg-red-50 border-red-400 text-red-700';
                        else cls += 'bg-gray-50 border-gray-200 text-gray-600';
                        return (
                          <div key={key} className={cls}>
                            <span className="font-bold shrink-0">{key}.</span>
                            <span>{value}</span>
                            {isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-green-600">✓ Correcta</span>}
                            {wasSelected && !isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-red-500">✗ Tu respuesta</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })() : null}

                {/* Options — matching */}
                {question.type === 'matching' && (
                  <div className="flex flex-col gap-2 ml-4">
                    {question.pairs.map((pair, i) => {
                      const chosen = selected[i] ?? '';
                      const isCorrect = chosen === pair.correctMatch;
                      return (
                        <div key={pair.term} className={`flex items-center gap-3 px-3 py-2 rounded border text-sm ${isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
                          <span className="font-medium text-gray-800 shrink-0">{pair.term}</span>
                          <span className="text-gray-400">→</span>
                          <span className={isCorrect ? 'text-green-800' : 'text-red-700 line-through'}>
                            {chosen ? question.matches[chosen] : '— sin responder —'}
                          </span>
                          {!isCorrect && (
                            <span className="ml-auto shrink-0 text-xs text-green-700 font-semibold">
                              ✓ {question.matches[pair.correctMatch]}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Options — ordering */}
                {question.type === 'ordering' && (
                  <div className="flex flex-col gap-2 ml-4">
                    <p className="text-xs text-gray-500 mb-1">Orden correcto:</p>
                    {question.correctOrder.map((item, i) => (
                      <div key={item} className="flex items-center gap-3 px-3 py-2 rounded border text-sm bg-green-50 border-green-400 text-green-800">
                        <span className="font-bold shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-appian-blue hover:bg-appian-blue-dark text-white font-bold px-6 py-2 rounded transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showWrong, setShowWrong] = useState(false);

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { score, total, isTimeOut, certLabel, passPercent, displayQuestions, answers } = state;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= passPercent;

  // Compute wrong/unanswered items for the modal
  const wrongItems = (displayQuestions ?? []).map((dq, idx) => {
    const sel = answers?.[idx] ?? [];
    let isCorrect = false;
    if (dq.type === 'matching') {
      isCorrect = sel.length > 0 && dq.pairs.every((p, i) => sel[i] === p.correctMatch);
    } else if (dq.type === 'ordering') {
      isCorrect =
        sel.length > 0 &&
        sel.length === dq.correctOrder?.length &&
        sel.every((v, i) => v === dq.correctOrder[i]);
    } else {
      if (sel.length > 0) {
        const correct = [...dq.answer].sort();
        const sortedSel = [...sel].sort();
        isCorrect = sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
      }
    }
    return isCorrect ? null : { idx, question: dq, selected: sel };
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-appian-bg flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-md px-10 py-12 text-center">

        {/* Icon */}
        <div className="text-5xl mb-4">
          {isTimeOut ? '⏱️' : passed ? '🎉' : '📚'}
        </div>

        {/* Title */}
        <h1
          className={`text-2xl font-bold mb-2 ${
            isTimeOut ? 'text-appian-error' : passed ? 'text-appian-success' : 'text-appian-error'
          }`}
        >
          {isTimeOut
            ? '¡Tiempo Agotado!'
            : passed
            ? '¡Felicitaciones! Aprobaste'
            : 'No aprobaste esta vez'}
        </h1>

        {/* Cert label */}
        <p className="text-appian-muted text-sm mb-6">{certLabel}</p>

        {/* Score card */}
        <div className="bg-appian-bg rounded-lg p-6 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-appian-muted">Respuestas correctas</span>
            <span className="font-bold text-gray-800">
              {score} / {total}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-appian-muted">Porcentaje obtenido</span>
            <span
              className={`font-bold text-lg ${
                passed ? 'text-appian-success' : 'text-appian-error'
              }`}
            >
              {percentage}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-appian-muted">Umbral de aprobación</span>
            <span className="font-semibold text-gray-600">{passPercent}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              passed ? 'bg-appian-success' : 'bg-appian-error'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-appian-blue hover:bg-appian-blue-dark text-white font-bold py-3 px-6 rounded transition-colors w-full"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border border-appian-blue text-appian-blue hover:bg-appian-blue-light font-semibold py-3 px-6 rounded transition-colors w-full"
          >
            Reintentar mismo examen
          </button>
          {wrongItems.length > 0 && (
            <button
              onClick={() => setShowWrong(true)}
              className="border border-appian-error text-appian-error hover:bg-red-50 font-semibold py-3 px-6 rounded transition-colors w-full"
            >
              📖 Ver {wrongItems.length} respuesta{wrongItems.length !== 1 ? 's' : ''} incorrecta{wrongItems.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      {showWrong && (
        <WrongAnswersModal wrongItems={wrongItems} onClose={() => setShowWrong(false)} />
      )}
    </div>
  );
}



