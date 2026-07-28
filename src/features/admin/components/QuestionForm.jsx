import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { CERTIFICATIONS } from '../../../core/constants/certifications';
import { useGenerateExplanation } from '../hooks/useGenerateExplanation';
import Button from '../../../components/ui/Button';

const inputClass = 'w-full rounded-zen border border-glass-light-border bg-glass-light-2 px-3 py-1.5 text-sm text-zen-ink placeholder:text-zen-ink/40 backdrop-blur-md transition-colors focus:border-zen focus:outline-none focus:ring-2 focus:ring-zen/40 dark:border-glass-dark-border dark:bg-glass-dark-2 dark:text-white dark:placeholder:text-white/40';
const labelClass = 'block text-xs font-semibold text-zen-ink/60 dark:text-white/60 mb-1';

const KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Derive level from cert object (Firestore certs may lack the `level` field)
function certLevel(c) {
  return c.level ?? c.id?.split('-').slice(1).join('-') ?? '';
}

function emptyMultiple() {
  return { type: 'multiple', question: '', category: 'developer', level: 'senior', mcOptions: ['', '', ''], answer: [], explanation: '' };
}
function emptyOrdering() {
  return { type: 'ordering', question: '', category: 'developer', level: 'senior', orderItems: ['', '', ''], explanation: '' };
}
function emptyMatching() {
  return { type: 'matching', question: '', category: 'developer', level: 'senior', matchPairs: [{ term: '', matchText: '' }, { term: '', matchText: '' }], explanation: '' };
}

function formFromQuestion(q) {
  const base = { type: q.type ?? 'multiple', question: q.question ?? '', category: q.category ?? 'developer', level: q.level ?? 'senior', explanation: q.explanation ?? '' };
  if (q.type === 'ordering') {
    return { ...base, orderItems: q.correctOrder?.length ? [...q.correctOrder] : ['', '', ''] };
  }
  if (q.type === 'matching') {
    const pairs = (q.pairs ?? []).map((p) => ({ term: p.term ?? '', matchText: q.matches?.[p.correctMatch] ?? '' }));
    return { ...base, matchPairs: pairs.length ? pairs : [{ term: '', matchText: '' }, { term: '', matchText: '' }] };
  }
  const sortedOpts = Object.entries(q.options ?? {}).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  const mcOptions = sortedOpts.length >= 3 ? sortedOpts : [...sortedOpts, ...Array(Math.max(0, 3 - sortedOpts.length)).fill('')];
  return { ...base, mcOptions, answer: q.answer ?? [] };
}

// ─── Multiple choice sub-form ─────────────────────────────────────────────────
function MultipleForm({ form, errors, setForm, setErrors, toggleAnswer }) {
  function updateOption(idx, val) {
    const next = [...form.mcOptions];
    next[idx] = val;
    setForm((f) => ({ ...f, mcOptions: next }));
    setErrors((e) => ({ ...e, mcOptions: undefined }));
  }
  function addOption() {
    if (form.mcOptions.length >= KEYS.length) return;
    setForm((f) => ({ ...f, mcOptions: [...f.mcOptions, ''] }));
  }
  function removeOption(idx) {
    if (form.mcOptions.length <= 3) return;
    const removedKey = KEYS[idx];
    const nextOptions = form.mcOptions.filter((_, i) => i !== idx);
    const nextAnswer = form.answer
      .filter((k) => k !== removedKey)
      .map((k) => { const ki = KEYS.indexOf(k); return ki > idx ? KEYS[ki - 1] : k; });
    setForm((f) => ({ ...f, mcOptions: nextOptions, answer: nextAnswer }));
    setErrors((e) => ({ ...e, mcOptions: undefined, answer: undefined }));
  }

  const availableKeys = form.mcOptions.map((opt, i) => (opt.trim() ? KEYS[i] : null)).filter(Boolean);

  return (
    <>
      <div>
        <label className={labelClass}>Opciones</label>
        <div className="space-y-2">
          {form.mcOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-zen-ink/40 dark:text-white/40 w-4">{KEYS[idx]}</span>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={idx < 3 ? `Opción ${KEYS[idx]} (requerida)` : `Opción ${KEYS[idx]} (opcional)`}
                className={`flex-1 ${inputClass}`}
              />
              <button type="button" onClick={() => removeOption(idx)} disabled={form.mcOptions.length <= 3}
                className="text-zen-ink/40 hover:text-zen-danger disabled:opacity-20 text-sm leading-none px-1 transition-colors dark:text-white/40">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {errors.mcOptions && <p className="text-zen-danger text-xs mt-1">{errors.mcOptions}</p>}
        {form.mcOptions.length < KEYS.length && (
          <button type="button" onClick={addOption} className="mt-2 text-zen text-xs font-semibold hover:underline">+ Agregar opción</button>
        )}
      </div>
      <div>
        <label className={labelClass}>Respuesta(s) correcta(s) *</label>
        <div className="flex gap-3 flex-wrap">
          {availableKeys.map((key) => {
            const val = form.mcOptions[KEYS.indexOf(key)];
            if (!val?.trim()) return null;
            return (
              <label key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-zen border cursor-pointer text-sm transition-colors ${
                form.answer.includes(key)
                  ? 'bg-zen/10 border-zen text-zen font-semibold'
                  : 'border-glass-light-border text-zen-ink/70 hover:bg-glass-light-2 dark:border-glass-dark-border dark:text-white/70 dark:hover:bg-glass-dark-2'
              }`}>
                <input type="checkbox" checked={form.answer.includes(key)} onChange={() => toggleAnswer(key)} className="accent-zen" />
                {key}
              </label>
            );
          })}
        </div>
        {errors.answer && <p className="text-zen-danger text-xs mt-1">{errors.answer}</p>}
      </div>
    </>
  );
}

// ─── Ordering sub-form ────────────────────────────────────────────────────────
function OrderingForm({ form, errors, set }) {
  function updateItem(idx, val) { const next = [...form.orderItems]; next[idx] = val; set('orderItems', next); }
  function addItem() { set('orderItems', [...form.orderItems, '']); }
  function removeItem(idx) { if (form.orderItems.length <= 2) return; set('orderItems', form.orderItems.filter((_, i) => i !== idx)); }
  function moveUp(idx) { if (idx === 0) return; const next = [...form.orderItems]; [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]; set('orderItems', next); }
  function moveDown(idx) { if (idx === form.orderItems.length - 1) return; const next = [...form.orderItems]; [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]; set('orderItems', next); }

  return (
    <div>
      <label className={labelClass}>
        Pasos / elementos <span className="font-normal text-zen-ink/40 dark:text-white/40">(en orden correcto — de arriba hacia abajo)</span>
      </label>
      <div className="space-y-2">
        {form.orderItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-zen-ink/40 dark:text-white/40 w-5 text-center">{idx + 1}</span>
            <input type="text" value={item} onChange={(e) => updateItem(idx, e.target.value)} placeholder={`Paso ${idx + 1}`}
              className={`flex-1 ${inputClass}`} />
            <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="text-zen-ink/40 hover:text-zen-ink disabled:opacity-20 px-1 transition-colors dark:text-white/40 dark:hover:text-white">▲</button>
            <button type="button" onClick={() => moveDown(idx)} disabled={idx === form.orderItems.length - 1} className="text-zen-ink/40 hover:text-zen-ink disabled:opacity-20 px-1 transition-colors dark:text-white/40 dark:hover:text-white">▼</button>
            <button type="button" onClick={() => removeItem(idx)} disabled={form.orderItems.length <= 2} className="text-zen-ink/40 hover:text-zen-danger disabled:opacity-20 text-sm px-1 transition-colors dark:text-white/40">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.orderItems && <p className="text-zen-danger text-xs mt-1">{errors.orderItems}</p>}
      <button type="button" onClick={addItem} className="mt-2 text-zen text-xs font-semibold hover:underline">+ Agregar paso</button>
    </div>
  );
}

// ─── Matching sub-form ────────────────────────────────────────────────────────
function MatchingForm({ form, errors, set }) {
  function updatePair(idx, field, val) { const next = form.matchPairs.map((p, i) => i === idx ? { ...p, [field]: val } : p); set('matchPairs', next); }
  function addPair() { set('matchPairs', [...form.matchPairs, { term: '', matchText: '' }]); }
  function removePair(idx) { if (form.matchPairs.length <= 2) return; set('matchPairs', form.matchPairs.filter((_, i) => i !== idx)); }

  return (
    <div>
      <label className={labelClass}>
        Pares <span className="font-normal text-zen-ink/40 dark:text-white/40">(Término → Respuesta correcta)</span>
      </label>
      <div className="space-y-2">
        {form.matchPairs.map((pair, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-zen-ink/40 dark:text-white/40 w-5 text-center">{KEYS[idx]}</span>
            <input type="text" value={pair.term} onChange={(e) => updatePair(idx, 'term', e.target.value)} placeholder="Término"
              className={`flex-1 ${inputClass}`} />
            <span className="text-zen-ink/40 dark:text-white/40 text-xs">→</span>
            <input type="text" value={pair.matchText} onChange={(e) => updatePair(idx, 'matchText', e.target.value)} placeholder="Respuesta"
              className={`flex-1 ${inputClass}`} />
            <button type="button" onClick={() => removePair(idx)} disabled={form.matchPairs.length <= 2} className="text-zen-ink/40 hover:text-zen-danger disabled:opacity-20 text-sm px-1 transition-colors dark:text-white/40">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.matchPairs && <p className="text-zen-danger text-xs mt-1">{errors.matchPairs}</p>}
      <button type="button" onClick={addPair} className="mt-2 text-zen text-xs font-semibold hover:underline">+ Agregar par</button>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function QuestionForm({ initial, certifications = CERTIFICATIONS, onSave, onCancel, loading, hideMeta = false }) {
  const [form, setForm] = useState(initial ? formFromQuestion(initial) : emptyMultiple());
  const [errors, setErrors] = useState({});
  const { generate: generateAI, loading: aiLoading, error: aiError } = useGenerateExplanation();

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function changeType(newType) {
    const base = { question: form.question, category: form.category, level: form.level, explanation: form.explanation };
    if (newType === 'ordering') setForm({ ...emptyOrdering(), ...base });
    else if (newType === 'matching') setForm({ ...emptyMatching(), ...base });
    else setForm({ ...emptyMultiple(), ...base });
    setErrors({});
  }

  function handleCategoryChange(newCat) {
    const firstCert = certifications.find((c) => c.category === newCat);
    const lvl = firstCert ? certLevel(firstCert) : 'senior';
    setForm((f) => ({ ...f, category: newCat, level: lvl }));
    setErrors((e) => ({ ...e, category: undefined, level: undefined }));
  }

  function toggleAnswer(key) {
    setForm((f) => ({ ...f, answer: f.answer.includes(key) ? f.answer.filter((k) => k !== key) : [...f.answer, key].sort() }));
    setErrors((e) => ({ ...e, answer: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.question.trim()) e.question = 'La pregunta es requerida.';
    if (form.type === 'ordering') {
      if (form.orderItems.filter((i) => i.trim()).length < 2) e.orderItems = 'Debes ingresar al menos 2 pasos.';
    } else if (form.type === 'matching') {
      if (form.matchPairs.filter((p) => p.term.trim() && p.matchText.trim()).length < 2) e.matchPairs = 'Debes ingresar al menos 2 pares completos.';
    } else {
      if (form.mcOptions.filter((o) => o.trim()).length < 3) e.mcOptions = 'Se requieren al menos 3 opciones.';
      if (form.answer.length === 0) e.answer = 'Debes marcar al menos una respuesta correcta.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildPayload() {
    const base = {
      question: form.question.trim(),
      category: form.category,
      level: form.level,
      ...(form.explanation.trim() ? { explanation: form.explanation.trim() } : {}),
    };
    if (form.type === 'ordering') {
      const items = form.orderItems.map((i) => i.trim()).filter(Boolean);
      return { ...base, type: 'ordering', items, correctOrder: items };
    }
    if (form.type === 'matching') {
      const validPairs = form.matchPairs.filter((p) => p.term.trim() && p.matchText.trim());
      const matches = {};
      const pairs = validPairs.map((p, idx) => { matches[KEYS[idx]] = p.matchText.trim(); return { term: p.term.trim(), correctMatch: KEYS[idx] }; });
      return { ...base, type: 'matching', pairs, matches };
    }
    const options = {};
    form.mcOptions.forEach((opt, i) => { if (opt.trim()) options[KEYS[i]] = opt.trim(); });
    return { ...base, options, answer: form.answer.filter((k) => options[k]) };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(buildPayload());
  }

  // Unique levels for currently selected category, derived from id when field is missing
  const uniqueLevels = certifications
    .filter((c) => c.category === form.category)
    .map((c) => ({ value: certLevel(c), label: certLevel(c) === 'senior' ? 'Senior' : 'Associate' }))
    .filter((item, i, arr) => item.value && arr.findIndex((x) => x.value === item.value) === i);

  const typeLabels = { multiple: 'Opción múltiple', ordering: 'Ordenamiento', matching: 'Emparejamiento' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zen-ink/50 px-4 py-8 backdrop-blur-sm dark:bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl border border-glass-light-border bg-glass-light-3 backdrop-blur-xl shadow-zen-glass dark:border-glass-dark-border dark:bg-glass-dark-3">
        <div className="flex items-center justify-between px-6 py-4 border-b border-glass-light-border dark:border-glass-dark-border">
          <h2 className="text-lg font-semibold text-zen-ink dark:text-white">{initial ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
          <Button variant="ghost" size="icon" onClick={onCancel} aria-label="Cerrar modal">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type */}
          <div>
            <label className={labelClass}>Tipo de pregunta</label>
            <div className="flex gap-2">
              {Object.entries(typeLabels).map(([t, label]) => (
                <button key={t} type="button" onClick={() => changeType(t)}
                  className={`px-3 py-1.5 rounded-zen text-sm font-semibold border transition-colors ${
                    form.type === t
                      ? 'bg-zen-brand text-white border-transparent shadow-zen'
                      : 'border-glass-light-border text-zen-ink/70 hover:bg-glass-light-2 dark:border-glass-dark-border dark:text-white/70 dark:hover:bg-glass-dark-2'
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Category + Level */}
          {!hideMeta && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Certificación</label>
              <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)} className={inputClass}>
                {[...new Set(certifications.map((c) => c.category))].map((cat) => (
                  <option key={cat} value={cat}>{cat === 'developer' ? 'Desarrollador' : cat === 'analyst' ? 'Analista' : cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Nivel</label>
              <select value={form.level} onChange={(e) => set('level', e.target.value)} className={inputClass}>
                {uniqueLevels.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          )}

          {/* Question */}
          <div>
            <label className={labelClass}>Pregunta *</label>
            <textarea value={form.question} onChange={(e) => set('question', e.target.value)} rows={3}
              className={`resize-y min-h-[72px] py-2 ${inputClass}`}
              placeholder="Escribe el enunciado de la pregunta..." />
            {errors.question && <p className="text-zen-danger text-xs mt-1">{errors.question}</p>}
          </div>

          {/* Type-specific */}
          {form.type === 'multiple' && <MultipleForm form={form} errors={errors} setForm={setForm} setErrors={setErrors} toggleAnswer={toggleAnswer} />}
          {form.type === 'ordering' && <OrderingForm form={form} errors={errors} set={set} />}
          {form.type === 'matching' && <MatchingForm form={form} errors={errors} set={set} />}

          {/* Explanation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`${labelClass} mb-0`}>
                Justificación <span className="font-normal text-zen-ink/40 dark:text-white/40">(opcional — se muestra en modo estudio)</span>
              </label>
              <button
                type="button"
                disabled={aiLoading || !form.question.trim() || (form.type === 'multiple' && !form.answer.length)}
                onClick={async () => {
                  const opts = form.type === 'multiple'
                    ? Object.fromEntries(form.mcOptions.map((v, i) => [KEYS[i], v]).filter(([, v]) => v.trim()))
                    : {};
                  const { explanation } = await generateAI({
                    question: form.question,
                    options:  opts,
                    answer:   form.answer,
                    type:     form.type,
                  });
                  if (explanation) set('explanation', explanation);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-zen hover:brightness-125 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
              
               
              </button>
            </div>
            <textarea value={form.explanation} onChange={(e) => set('explanation', e.target.value)} rows={5}
              className={`resize-y overflow-y-auto min-h-[80px] max-h-64 py-2 ${inputClass}`}
              placeholder="Explica por qué esta es la respuesta correcta..." />
            {aiError && <p className="text-zen-danger text-xs mt-1">{aiError}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-glass-light-border dark:border-glass-dark-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear pregunta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

