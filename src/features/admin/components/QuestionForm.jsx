import { useState } from 'react';
import { X } from 'lucide-react';
import { CERTIFICATIONS } from '../../../core/constants/certifications';

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
        <label className="block text-xs font-semibold text-ink-soft mb-2">Opciones</label>
        <div className="space-y-2">
          {form.mcOptions.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink-faint w-4">{KEYS[idx]}</span>
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(idx, e.target.value)}
                placeholder={idx < 3 ? `Opción ${KEYS[idx]} (requerida)` : `Opción ${KEYS[idx]} (opcional)`}
                className="flex-1 border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white"
              />
              <button type="button" onClick={() => removeOption(idx)} disabled={form.mcOptions.length <= 3}
                className="text-ink-faint hover:text-danger-500 disabled:opacity-20 text-sm leading-none px-1 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {errors.mcOptions && <p className="text-danger-500 text-xs mt-1">{errors.mcOptions}</p>}
        {form.mcOptions.length < KEYS.length && (
          <button type="button" onClick={addOption} className="mt-2 text-brand-500 text-xs font-semibold hover:underline">+ Agregar opción</button>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-soft mb-2">Respuesta(s) correcta(s) *</label>
        <div className="flex gap-3 flex-wrap">
          {availableKeys.map((key) => {
            const val = form.mcOptions[KEYS.indexOf(key)];
            if (!val?.trim()) return null;
            return (
              <label key={key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors ${
                form.answer.includes(key)
                  ? 'bg-brand-500/10 border-brand-500 text-brand-600 font-semibold'
                  : 'border-surface-border text-ink-soft hover:bg-surface-raised'
              }`}>
                <input type="checkbox" checked={form.answer.includes(key)} onChange={() => toggleAnswer(key)} className="accent-brand-500" />
                {key}
              </label>
            );
          })}
        </div>
        {errors.answer && <p className="text-danger-500 text-xs mt-1">{errors.answer}</p>}
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
      <label className="block text-xs font-semibold text-ink-soft mb-1">
        Pasos / elementos <span className="font-normal text-ink-faint">(en orden correcto — de arriba hacia abajo)</span>
      </label>
      <div className="space-y-2">
        {form.orderItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-faint w-5 text-center">{idx + 1}</span>
            <input type="text" value={item} onChange={(e) => updateItem(idx, e.target.value)} placeholder={`Paso ${idx + 1}`}
              className="flex-1 border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white" />
            <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="text-ink-faint hover:text-ink disabled:opacity-20 px-1 transition-colors">▲</button>
            <button type="button" onClick={() => moveDown(idx)} disabled={idx === form.orderItems.length - 1} className="text-ink-faint hover:text-ink disabled:opacity-20 px-1 transition-colors">▼</button>
            <button type="button" onClick={() => removeItem(idx)} disabled={form.orderItems.length <= 2} className="text-ink-faint hover:text-danger-500 disabled:opacity-20 text-sm px-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.orderItems && <p className="text-danger-500 text-xs mt-1">{errors.orderItems}</p>}
      <button type="button" onClick={addItem} className="mt-2 text-brand-500 text-xs font-semibold hover:underline">+ Agregar paso</button>
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
      <label className="block text-xs font-semibold text-ink-soft mb-1">
        Pares <span className="font-normal text-ink-faint">(Término → Respuesta correcta)</span>
      </label>
      <div className="space-y-2">
        {form.matchPairs.map((pair, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-ink-faint w-5 text-center">{KEYS[idx]}</span>
            <input type="text" value={pair.term} onChange={(e) => updatePair(idx, 'term', e.target.value)} placeholder="Término"
              className="flex-1 border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white" />
            <span className="text-ink-faint text-xs">→</span>
            <input type="text" value={pair.matchText} onChange={(e) => updatePair(idx, 'matchText', e.target.value)} placeholder="Respuesta"
              className="flex-1 border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white" />
            <button type="button" onClick={() => removePair(idx)} disabled={form.matchPairs.length <= 2} className="text-ink-faint hover:text-danger-500 disabled:opacity-20 text-sm px-1 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {errors.matchPairs && <p className="text-danger-500 text-xs mt-1">{errors.matchPairs}</p>}
      <button type="button" onClick={addPair} className="mt-2 text-brand-500 text-xs font-semibold hover:underline">+ Agregar par</button>
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export function QuestionForm({ initial, certifications = CERTIFICATIONS, onSave, onCancel, loading, hideMeta = false }) {
  const [form, setForm] = useState(initial ? formFromQuestion(initial) : emptyMultiple());
  const [errors, setErrors] = useState({});

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
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-surface-card border border-surface-border w-full max-w-2xl rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-ink">{initial ? 'Editar pregunta' : 'Nueva pregunta'}</h2>
          <button onClick={onCancel} className="p-1.5 text-ink-faint hover:text-ink rounded-lg hover:bg-surface-raised transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-2">Tipo de pregunta</label>
            <div className="flex gap-2">
              {Object.entries(typeLabels).map(([t, label]) => (
                <button key={t} type="button" onClick={() => changeType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors ${
                    form.type === t
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-surface-border text-ink-soft hover:bg-surface-raised'
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          {/* Category + Level */}
          {!hideMeta && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Certificación</label>
              <select value={form.category} onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white">
                {[...new Set(certifications.map((c) => c.category))].map((cat) => (
                  <option key={cat} value={cat}>{cat === 'developer' ? 'Desarrollador' : cat === 'analyst' ? 'Analista' : cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Nivel</label>
              <select value={form.level} onChange={(e) => set('level', e.target.value)}
                className="w-full border border-surface-border rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand-500 bg-white">
                {uniqueLevels.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          )}

          {/* Question */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1">Pregunta *</label>
            <textarea value={form.question} onChange={(e) => set('question', e.target.value)} rows={3}
              className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand-500 resize-y min-h-[72px] bg-white"
              placeholder="Escribe el enunciado de la pregunta..." />
            {errors.question && <p className="text-danger-500 text-xs mt-1">{errors.question}</p>}
          </div>

          {/* Type-specific */}
          {form.type === 'multiple' && <MultipleForm form={form} errors={errors} setForm={setForm} setErrors={setErrors} toggleAnswer={toggleAnswer} />}
          {form.type === 'ordering' && <OrderingForm form={form} errors={errors} set={set} />}
          {form.type === 'matching' && <MatchingForm form={form} errors={errors} set={set} />}

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold text-ink-soft mb-1">
              Justificación <span className="font-normal text-ink-faint">(opcional — se muestra en modo estudio)</span>
            </label>
            <textarea value={form.explanation} onChange={(e) => set('explanation', e.target.value)} rows={5}
              className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand-500 resize-y overflow-y-auto min-h-[80px] max-h-64 bg-white"
              placeholder="Explica por qué esta es la respuesta correcta..." />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-surface-border">
            <button type="button" onClick={onCancel}
              className="px-4 py-2 text-sm border border-surface-border rounded-lg text-ink-soft hover:bg-surface-raised transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 text-sm bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors">
              {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear pregunta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

