import { useRef } from 'react';

// ─── Shared top-bar (flag + question text) ────────────────────────────────────
function QuestionHeader({ question, questionNumber: _questionNumber, flagged, isStudy, onToggleFlag }) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div />
        {!isStudy && (
          <button
            onClick={onToggleFlag}
            title={flagged ? 'Quitar bandera' : 'Marcar con duda'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
              flagged
                ? 'bg-danger-500 border-danger-500 text-white shadow-glow-danger'
                : 'bg-transparent border-surface-border text-ink-soft hover:border-danger-500 hover:text-danger-600'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M4 3a1 1 0 0 1 1-1h14a1 1 0 0 1 .707 1.707L14.414 9l5.293 5.293A1 1 0 0 1 19 16H6v5a1 1 0 1 1-2 0V3z" />
            </svg>
          </button>
        )}
      </div>
      <h2 className="text-base font-semibold leading-relaxed text-ink mb-5">
        {question.question}
      </h2>
    </>
  );
}

// ─── Explanation box (study mode) ───────────────────────────────────────────
function ExplanationBox({ text }) {
  if (!text) return null;
  return (
    <div className="flex gap-2 mt-4 px-4 py-3 rounded-lg border border-brand-500/30 bg-brand-50 text-sm text-brand-700">
      <span className="shrink-0 text-base">💡</span>
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Feedback banner ──────────────────────────────────────────────────────────
function FeedbackBanner({ isCorrect }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-semibold border ${
      isCorrect
        ? 'bg-success-50 border-success-500/40 text-success-700'
        : 'bg-danger-50 border-danger-500/40 text-danger-700'
    }`}>
      <span>{isCorrect ? '✅' : '❌'}</span>
      <span>
        {isCorrect
          ? '¡Respuesta correcta!'
          : '¡Respuesta incorrecta! Revisa las correcciones en verde.'}
      </span>
    </div>
  );
}

// ─── Matching question ────────────────────────────────────────────────────────
function MatchingQuestion({ question, savedSelection, revealed, onSelectionChange }) {
  // savedSelection[i] = selected matchKey for pairs[i], '' if none
  const selectedSet = new Set(savedSelection.filter(Boolean));

  function handleSelect(pairIdx, val) {
    const next = Array.from({ length: question.pairs.length }, (_, i) => savedSelection[i] ?? '');
    next[pairIdx] = val;
    onSelectionChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {question.pairs.map((pair, i) => {
        const selected = savedSelection[i] ?? '';
        const isCorrect = revealed && selected === pair.correctMatch;
        const isWrong = revealed && selected !== '' && selected !== pair.correctMatch;
        const isBlank = revealed && selected === '';

        let rowCls = 'grid gap-3 p-3 rounded-lg border ';
        if (revealed) {
          rowCls += isCorrect
            ? 'border-success-500/50 bg-success-500/10'
            : isWrong
            ? 'border-danger-500/50 bg-danger-500/10'
            : 'border-surface-border bg-surface-card';
        } else {
          rowCls += 'border-surface-border bg-surface-card';
        }

        return (
          <div key={pair.term} className={rowCls} style={{ gridTemplateColumns: '1fr 1fr' }}>
            <span className="text-sm font-medium text-ink flex items-center min-w-0 break-words">{pair.term}</span>
            <div className="flex items-center gap-2 min-w-0">
              <select
                value={selected}
                onChange={(e) => handleSelect(i, e.target.value)}
                disabled={revealed}
                className={`flex-1 min-w-0 w-0 border rounded-lg px-2 py-1.5 text-sm bg-white text-ink focus:outline-none focus:border-brand-500 ${
                  revealed ? 'cursor-default' : 'cursor-pointer'
                } ${isCorrect ? 'border-success-500' : isWrong ? 'border-danger-500' : 'border-surface-border'}`}
              >
                <option value="">— Seleccionar —</option>
                {Object.entries(question.matches).map(([key, text]) => (
                  <option
                    key={key}
                    value={key}
                    disabled={!revealed && selectedSet.has(key) && selected !== key}
                  >
                    {text}
                  </option>
                ))}
              </select>
              {revealed && (
                <span className={`shrink-0 font-bold text-sm ${isCorrect ? 'text-success-600' : isWrong ? 'text-danger-600' : 'text-ink-muted'}`}>
                  {isCorrect ? '✓' : isWrong ? '✗' : '—'}
                </span>
              )}
            </div>
            {revealed && (isWrong || isBlank) && (
              <div className="col-span-2 text-xs text-success-400 font-medium bg-success-500/10 border border-success-500/30 rounded px-2 py-1">
                ✓ Correcto: {question.matches[pair.correctMatch]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Ordering question (drag-and-drop) ────────────────────────────────────────
function OrderingQuestion({ question, savedSelection, revealed, onSelectionChange }) {
  // savedSelection = string[] of items placed on right side, in order
  const dragItem = useRef(null);
  const dragFrom = useRef(null); // 'left' | 'right'

  const leftItems = question.items.filter((item) => !savedSelection.includes(item));

  function moveToRight(item) {
    if (revealed) return;
    onSelectionChange([...savedSelection, item]);
  }

  function removeFromRight(item) {
    if (revealed) return;
    onSelectionChange(savedSelection.filter((i) => i !== item));
  }

  function handleDragStart(e, item, from) {
    dragItem.current = item;
    dragFrom.current = from;
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDropOnRightZone(e) {
    e.preventDefault();
    if (!dragItem.current) return;
    if (dragFrom.current === 'left' && !savedSelection.includes(dragItem.current)) {
      onSelectionChange([...savedSelection, dragItem.current]);
    }
    dragItem.current = null;
  }

  function handleDropOnRightItem(e, targetItem) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragItem.current) return;
    if (dragFrom.current === 'right' && dragItem.current !== targetItem) {
      const next = [...savedSelection];
      const fromIdx = next.indexOf(dragItem.current);
      const toIdx = next.indexOf(targetItem);
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragItem.current);
      onSelectionChange(next);
    } else if (dragFrom.current === 'left' && !savedSelection.includes(dragItem.current)) {
      const idx = savedSelection.indexOf(targetItem);
      const next = [...savedSelection];
      next.splice(idx, 0, dragItem.current);
      onSelectionChange(next);
    }
    dragItem.current = null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left pool */}
      <div>
        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
          Elementos disponibles
        </p>
        <div className="min-h-28 border-2 border-dashed border-surface-muted rounded-lg p-2 flex flex-col gap-2 bg-surface-card">
          {leftItems.length === 0 && (
            <p className="text-xs text-ink-muted text-center mt-6">Haz clic en elementos del lado derecho para devolverlos</p>
          )}
          {leftItems.map((item) => (
            <div
              key={item}
              draggable={!revealed}
              onDragStart={(e) => handleDragStart(e, item, 'left')}
              onClick={() => moveToRight(item)}
              className="p-2.5 bg-surface-soft border border-surface-border rounded-lg text-sm text-ink-soft cursor-grab active:cursor-grabbing hover:border-brand-500/60 hover:bg-brand-50 select-none transition-all"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right ordered list */}
      <div>
        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
          Orden definido
        </p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropOnRightZone}
          className={`min-h-28 border-2 border-dashed rounded-lg p-2 flex flex-col gap-2 ${
            revealed ? 'border-surface-muted bg-surface-card' : 'border-brand-500/40 bg-brand-500/5'
          }`}
        >
          {savedSelection.length === 0 && (
            <p className="text-xs text-ink-muted text-center mt-6">Arrastra o haz clic los elementos</p>
          )}
          {savedSelection.map((item, idx) => {
            const isCorrect = revealed && question.correctOrder[idx] === item;
            const _isWrong = revealed && question.correctOrder[idx] !== item;

            return (
              <div
                key={item}
                draggable={!revealed}
                onDragStart={(e) => handleDragStart(e, item, 'right')}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnRightItem(e, item)}
                onClick={() => removeFromRight(item)}
                className={`flex items-center gap-2 p-2.5 border rounded-lg text-sm select-none transition-all ${
                  revealed
                    ? isCorrect
                      ? 'bg-success-50 border-success-500/50 cursor-default text-success-700'
                      : 'bg-danger-50 border-danger-500/50 cursor-default text-danger-700'
                    : 'bg-white border-surface-border text-ink-soft cursor-grab active:cursor-grabbing hover:border-danger-500/50 hover:bg-danger-50'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center bg-surface-muted rounded-full text-xs font-bold text-ink-muted shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1">{item}</span>
                {revealed && (
                  <span className={`shrink-0 font-bold ${isCorrect ? 'text-success-600' : 'text-danger-600'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {revealed && (
          <div className={`mt-2 p-2 bg-success-50 border border-success-500/30 rounded-lg text-xs text-success-700`}>
            <strong>Orden correcto:</strong>
            <ol className="mt-1 ml-4 list-decimal space-y-0.5">
              {question.correctOrder.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main QuestionCard ─────────────────────────────────────────────────────────
/**
 * Renders a question with pre-shuffled options (shuffling is done in useExam at load time).
 * Selection is controlled via savedSelection prop — no internal state for answers.
 * In study mode, `revealed` locks options and shows correct/wrong feedback.
 */
export function QuestionCard({ question, questionNumber, total: _total, savedSelection, flagged, mode, revealed, onSelectionChange, onToggleFlag }) {
  const isStudy = mode === 'study';

  // ── Matching type ────────────────────────────────────────────────────────────
  if (question.type === 'matching') {
    const _allSelected = savedSelection.length === question.pairs.length && savedSelection.every(Boolean);
    const isCorrect = revealed && question.pairs.every((p, i) => savedSelection[i] === p.correctMatch);

    return (
      <div>
        {revealed && <FeedbackBanner isCorrect={isCorrect} />}
        <QuestionHeader
          question={question}
          questionNumber={questionNumber}
          flagged={flagged}
          isStudy={isStudy}
          onToggleFlag={onToggleFlag}
        />
        <p className="text-xs text-gray-500 mb-3 italic">
          Selecciona la definición correcta para cada término. Cada opción sólo se puede usar una vez.
        </p>
        <MatchingQuestion
          question={question}
          savedSelection={savedSelection}
          revealed={revealed}
          onSelectionChange={onSelectionChange}
        />
        {revealed && isStudy && <ExplanationBox text={question.explanation} />}
      </div>
    );
  }

  // ── Ordering type ────────────────────────────────────────────────────────────
  if (question.type === 'ordering') {
    const allPlaced = savedSelection.length === question.items.length;
    const isCorrect = revealed && allPlaced &&
      savedSelection.every((v, i) => v === question.correctOrder[i]);

    return (
      <div>
        {revealed && <FeedbackBanner isCorrect={isCorrect} />}
        <QuestionHeader
          question={question}
          questionNumber={questionNumber}
          flagged={flagged}
          isStudy={isStudy}
          onToggleFlag={onToggleFlag}
        />
        <p className="text-xs text-gray-500 mb-3 italic">
          Arrastra los elementos al lado derecho y ordénalos correctamente. Haz clic en un elemento del lado derecho para devolverlo.
        </p>
        <OrderingQuestion
          question={question}
          savedSelection={savedSelection}
          revealed={revealed}
          onSelectionChange={onSelectionChange}
        />
        {revealed && isStudy && <ExplanationBox text={question.explanation} />}
      </div>
    );
  }

  // ── Multiple choice (default) ────────────────────────────────────────────────
  const isMultiple = question.answer.length > 1;
  const correctSet = new Set(question.answer);

  const isCorrect = revealed && (() => {
    const correct = [...question.answer].sort();
    const sortedSel = [...savedSelection].sort();
    return sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
  })();

  function toggleOption(key) {
    if (revealed) return;
    if (isMultiple) {
      const next = savedSelection.includes(key)
        ? savedSelection.filter((k) => k !== key)
        : [...savedSelection, key];
      onSelectionChange(next);
    } else {
      onSelectionChange(savedSelection[0] === key ? [] : [key]);
    }
  }

  const optionEntries = Object.keys(question.options).sort().map((k) => [k, question.options[k]]);

  return (
    <div>
      {revealed && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl mb-4 text-sm font-semibold border ${
          isCorrect
            ? 'bg-success-50 border-success-500/40 text-success-700'
            : 'bg-danger-50 border-danger-500/40 text-danger-700'
        }`}>
          <span>{isCorrect ? '✅' : '❌'}</span>
          <span>
            {isCorrect
              ? '¡Respuesta correcta!'
              : savedSelection.length === 0
              ? 'Sin responder — la respuesta correcta está marcada en verde'
              : 'Respuesta incorrecta — la respuesta correcta está marcada en verde'}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          {isMultiple && (
            <span className="inline-block bg-warning-50 text-warning-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-warning-500/30">
              Selección múltiple — elige {question.answer.length} opciones
            </span>
          )}
        </div>
        {!isStudy && (
          <button
            onClick={onToggleFlag}
            title={flagged ? 'Quitar bandera' : 'Marcar con duda'}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
              flagged
                ? 'bg-danger-500 border-danger-500 text-white shadow-glow-danger'
                : 'bg-transparent border-surface-border text-ink-soft hover:border-danger-500 hover:text-danger-600'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M4 3a1 1 0 0 1 1-1h14a1 1 0 0 1 .707 1.707L14.414 9l5.293 5.293A1 1 0 0 1 19 16H6v5a1 1 0 1 1-2 0V3z" />
            </svg>
          </button>
        )}
      </div>

      <h2 className="text-base font-semibold leading-relaxed text-ink mb-5">
        {question.question}
      </h2>

      <div className="flex flex-col gap-2.5">
        {optionEntries.map(([key, value]) => {
          const isSelected = savedSelection.includes(key);
          const isRight = correctSet.has(key);

          let cls = 'flex items-baseline gap-3 p-3.5 rounded-xl border transition-all select-none ';
          if (revealed) {
            cls += 'cursor-default ';
            if (isRight) {
              cls += 'bg-success-500/15 border-success-500/60 shadow-glow-success';
            } else if (isSelected) {
              cls += 'bg-danger-500/15 border-danger-500/60 animate-shake';
            } else {
              cls += 'bg-surface-card border-surface-border opacity-50';
            }
          } else {
            cls += 'cursor-pointer ';
            cls += isSelected
              ? 'bg-brand-500/20 border-brand-500 shadow-glow-brand'
              : 'bg-surface-card border-surface-border hover:border-brand-500/50 hover:bg-brand-500/10';
          }

          return (
            <label key={key} className={cls}>
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={`question-${questionNumber}`}
                value={key}
                checked={isSelected}
                onChange={() => toggleOption(key)}
                disabled={revealed}
                className="mt-0.5 accent-brand-500 shrink-0"
              />
              <span className={`text-sm ${
                revealed
                  ? isRight ? 'text-success-700 font-medium' : isSelected ? 'text-danger-700' : 'text-ink-muted'
                  : isSelected ? 'text-ink font-medium' : 'text-ink-soft'
              }`}>
                <span className="font-bold">{key}.</span> {value}
              </span>
              {revealed && isRight && (
                <span className="ml-auto shrink-0 text-xs font-bold text-success-700">✓ Correcta</span>
              )}
              {revealed && isSelected && !isRight && (
                <span className="ml-auto shrink-0 text-xs font-bold text-danger-700">✗ Tu resp.</span>
              )}
            </label>
          );
        })}
      </div>
      {revealed && isStudy && <ExplanationBox text={question.explanation} />}
    </div>
  );
}


