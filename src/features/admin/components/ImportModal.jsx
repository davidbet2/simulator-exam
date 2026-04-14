import { useRef, useState } from 'react';

/**
 * Expected JSON format (array):
 * [
 *   {
 *     "question": "...",
 *     "options": { "A": "...", "B": "...", ... },
 *     "answer": ["B"],
 *     "explanation": "Porque B es correcto ya que..." // opcional, se muestra en modo estudio
 *   },
 *   ...
 * ]
 */

function validateQuestion(item, idx) {
  if (typeof item !== 'object' || item === null) return `Item ${idx + 1}: no es un objeto`;

  // ── Matching ──────────────────────────────────────────────────────────────
  if (item.type === 'matching') {
    if (!Array.isArray(item.pairs) || item.pairs.length < 2)
      return `Item ${idx + 1}: tipo "matching" requiere "pairs" con al menos 2 elementos`;
    if (typeof item.matches !== 'object' || Array.isArray(item.matches) || Object.keys(item.matches).length < 2)
      return `Item ${idx + 1}: tipo "matching" requiere "matches" con al menos 2 definiciones`;
    for (const p of item.pairs) {
      if (!p.term || !p.correctMatch)
        return `Item ${idx + 1}: cada par en "pairs" debe tener "term" y "correctMatch"`;
      if (!Object.prototype.hasOwnProperty.call(item.matches, p.correctMatch))
        return `Item ${idx + 1}: "correctMatch" "${p.correctMatch}" no existe en "matches"`;
    }
    return null;
  }

  // ── Ordering ──────────────────────────────────────────────────────────────
  if (item.type === 'ordering') {
    if (!Array.isArray(item.items) || item.items.length < 2)
      return `Item ${idx + 1}: tipo "ordering" requiere "items" con al menos 2 elementos`;
    if (!Array.isArray(item.correctOrder) || item.correctOrder.length !== item.items.length)
      return `Item ${idx + 1}: "correctOrder" debe tener el mismo número de elementos que "items"`;
    const itemSet = new Set(item.items);
    for (const o of item.correctOrder) {
      if (!itemSet.has(o))
        return `Item ${idx + 1}: "correctOrder" contiene "${o}" que no existe en "items"`;
    }
    return null;
  }

  // ── Multiple choice (default) ─────────────────────────────────────────────
  if (typeof item.question !== 'string' || !item.question.trim())
    return `Item ${idx + 1}: campo "question" vacío o inválido`;
  if (typeof item.options !== 'object' || Array.isArray(item.options) || Object.keys(item.options).length < 2)
    return `Item ${idx + 1}: "options" debe ser un objeto con al menos 2 claves`;
  if (!Array.isArray(item.answer) || item.answer.length === 0)
    return `Item ${idx + 1}: "answer" debe ser un arreglo con al menos un elemento`;
  for (const a of item.answer) {
    if (!Object.prototype.hasOwnProperty.call(item.options, a))
      return `Item ${idx + 1}: respuesta "${a}" no existe en "options"`;
  }
  return null;
}

function parseJSON(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { error: `JSON inválido: ${e.message}` };
  }
  if (!Array.isArray(parsed)) return { error: 'El JSON debe ser un arreglo (array) de preguntas.' };
  if (parsed.length === 0) return { error: 'El arreglo está vacío.' };

  const errors = [];
  const valid = [];
  parsed.forEach((item, i) => {
    const err = validateQuestion(item, i);
    if (err) errors.push(err);
    else valid.push(item);
  });

  return { valid, errors };
}

export function ImportModal({ onImport, onClose, certifications = [] }) {
  const fileRef = useRef(null);
  const [certKey, setCertKey] = useState('');
  const [parsed, setParsed] = useState(null); // { valid, errors } | null
  const [parseError, setParseError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null); // { ok, count, error }

  const certOptions = certifications.map((c) => ({
    value: `${c.category}|${c.level}`,
    label: c.labelEs,
  }));

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParsed(null);
    setParseError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = parseJSON(ev.target.result);
      if (res.error) {
        setParseError(res.error);
      } else {
        setParsed(res);
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  async function handleImport() {
    if (!certKey || !parsed?.valid?.length) return;
    const [category, level] = certKey.split('|');
    setImporting(true);
    const res = await onImport(parsed.valid, category, level);
    setImporting(false);
    setResult(res);
  }

  const canImport = certKey && parsed?.valid?.length > 0 && !importing && !result?.ok;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">Importar preguntas desde JSON</h2>
          <button onClick={onClose} className="text-appian-muted hover:text-gray-800 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Success state */}
          {result?.ok ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-14 h-14 rounded-full bg-appian-success-light flex items-center justify-center text-appian-success text-3xl">✓</div>
              <p className="text-gray-800 font-semibold text-center">
                {result.count} pregunta{result.count !== 1 ? 's' : ''} importada{result.count !== 1 ? 's' : ''} correctamente.
              </p>
              <button
                onClick={onClose}
                className="bg-appian-blue hover:bg-appian-blue-dark text-white font-bold px-6 py-2 rounded transition-colors"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {/* Certification selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Certificación destino <span className="text-appian-error">*</span>
                </label>
                <select
                  value={certKey}
                  onChange={(e) => setCertKey(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-appian-blue"
                >
                  <option value="">Selecciona una certificación…</option>
                  {certOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Format example */}
              <div>
                <p className="text-xs font-semibold text-appian-muted uppercase tracking-wide mb-1.5">Formato esperado</p>
                <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed select-all">{`[
  // Opción múltiple
  {
    "question": "Texto de la pregunta",
    "options": { "A": "Op1", "B": "Op2", "C": "Op3" },
    "answer": ["B"]
  },
  // Matching (emparejamiento)
  {
    "type": "matching",
    "question": "Empareja cada término con su definición.",
    "pairs": [
      { "term": "Término A", "correctMatch": "D1" },
      { "term": "Término B", "correctMatch": "D2" }
    ],
    "matches": {
      "D1": "Definición para A",
      "D2": "Definición para B",
      "D3": "Distractor opcional"
    }
  },
  // Ordenamiento (drag & drop)
  {
    "type": "ordering",
    "question": "¿En qué orden se realizan los siguientes pasos?",
    "items": ["Paso A", "Paso B", "Paso C"],
    "correctOrder": ["Paso B", "Paso A", "Paso C"]
  }
]`}</pre>
              </div>

              {/* File picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Archivo JSON <span className="text-appian-error">*</span>
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-appian-blue rounded-lg p-5 text-center cursor-pointer transition-colors"
                >
                  <p className="text-sm text-appian-muted">
                    {fileName
                      ? <span className="text-gray-800 font-medium">{fileName}</span>
                      : 'Haz clic para seleccionar un archivo .json'}
                  </p>
                </div>
                <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFile} />
              </div>

              {/* Parse error */}
              {parseError && (
                <div className="bg-appian-error-light text-appian-error text-sm rounded p-3">
                  {parseError}
                </div>
              )}

              {/* Preview */}
              {parsed && (
                <div className="bg-gray-50 rounded-lg border border-gray-100 px-4 py-3 text-sm flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Resultado del análisis</span>
                  </div>
                  <div className="flex items-center gap-2 text-appian-success font-medium">
                    <span>✓</span>
                    <span>{parsed.valid.length} pregunta{parsed.valid.length !== 1 ? 's' : ''} válida{parsed.valid.length !== 1 ? 's' : ''}</span>
                  </div>
                  {parsed.errors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-appian-error font-medium">
                        <span>✗</span>
                        <span>{parsed.errors.length} con error{parsed.errors.length !== 1 ? 'es' : ''} (se omitirán)</span>
                      </div>
                      <ul className="mt-1 ml-5 text-xs text-appian-error list-disc space-y-0.5">
                        {parsed.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                        {parsed.errors.length > 5 && <li>… y {parsed.errors.length - 5} más</li>}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Import error */}
              {result?.error && (
                <div className="bg-appian-error-light text-appian-error text-sm rounded p-3">
                  Error al importar: {result.error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!result?.ok && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              disabled={importing}
              className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              disabled={!canImport}
              className="px-5 py-2 text-sm bg-appian-blue hover:bg-appian-blue-dark text-white font-bold rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importing && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {importing
                ? 'Importando…'
                : parsed?.valid?.length
                ? `Importar ${parsed.valid.length} pregunta${parsed.valid.length !== 1 ? 's' : ''}`
                : 'Importar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
