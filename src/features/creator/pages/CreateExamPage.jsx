import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft, Clock, Target, Pencil, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { QuestionForm } from '../../admin/components/QuestionForm'
import { parseXLSX, extractPDFText, parseTextToQuestions } from '../utils/importParsers'

const TYPE_LABELS = {
  multiple: 'Opción múltiple',
  ordering: 'Ordenamiento',
  matching: 'Emparejamiento',
}

const JSON_EXAMPLE = `[
  {
    "type": "multiple",
    "question": "¿Cuál es la función del XOR Gateway en Appian?",
    "options": {
      "A": "Ejecuta todos los caminos en paralelo",
      "B": "Selecciona un único camino basado en condición",
      "C": "Inicia un subproceso",
      "D": "Termina el proceso"
    },
    "answer": ["B"],
    "explanation": "El XOR Gateway acepta una entrada y selecciona una salida."
  },
  {
    "type": "ordering",
    "question": "Ordena los pasos para publicar un Data Store.",
    "items": ["Crear CDT", "Crear Data Store", "Publicar Data Store"],
    "correctOrder": ["Crear CDT", "Crear Data Store", "Publicar Data Store"]
  },
  {
    "type": "matching",
    "question": "Asocia cada elemento con su descripción.",
    "pairs": [
      { "term": "Record Type", "correctMatch": "A" },
      { "term": "Process Model", "correctMatch": "B" }
    ],
    "matches": {
      "A": "Define los datos y vistas de un objeto de negocio",
      "B": "Define el flujo de trabajo de un proceso"
    }
  }
]`

function parseJsonQuestions(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { questions: [], error: 'JSON inválido. Verifica la sintaxis.' }
  }
  if (!Array.isArray(parsed)) {
    return { questions: [], error: 'El JSON debe ser un array [ ... ].' }
  }
  const questions = []
  const invalid = []
  parsed.forEach((q, i) => {
    if (!q.question || typeof q.question !== 'string') { invalid.push(i + 1); return }
    const type = q.type ?? 'multiple'
    if (type === 'ordering') {
      if (!Array.isArray(q.items) || q.items.length < 2) { invalid.push(i + 1); return }
      questions.push({ type: 'ordering', question: q.question.trim(), items: q.items, correctOrder: q.correctOrder ?? q.items, explanation: q.explanation ?? '' })
    } else if (type === 'matching') {
      if (!Array.isArray(q.pairs) || !q.matches) { invalid.push(i + 1); return }
      questions.push({ type: 'matching', question: q.question.trim(), pairs: q.pairs, matches: q.matches, explanation: q.explanation ?? '' })
    } else {
      if (!q.options || Object.keys(q.options).length < 2) { invalid.push(i + 1); return }
      if (!Array.isArray(q.answer) || q.answer.length === 0) { invalid.push(i + 1); return }
      questions.push({ type: 'multiple', question: q.question.trim(), options: q.options, answer: q.answer, explanation: q.explanation ?? '' })
    }
  })
  const error = invalid.length ? `Preguntas ignoradas (formato inválido): #${invalid.join(', #')}` : null
  return { questions, error }
}

function QuestionRow({ q, index, onEdit, onDelete }) {
  const preview = q.question.length > 90 ? q.question.slice(0, 90) + '…' : q.question
  return (
    <div className="flex items-start gap-3 py-3 px-4 border border-surface-border rounded-lg bg-surface-card hover:border-brand-400/40 transition-colors">
      <span className="mt-0.5 w-6 h-6 rounded-full bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink leading-snug">{preview}</p>
        <span className="text-xs text-ink-faint mt-0.5 block">{TYPE_LABELS[q.type] ?? 'Opción múltiple'}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={() => onEdit(index)}
          className="p-1.5 text-ink-faint hover:text-brand-500 rounded transition-colors" title="Editar">
          <Pencil size={14} />
        </button>
        <button type="button" onClick={() => onDelete(index)}
          className="p-1.5 text-ink-faint hover:text-danger-500 rounded transition-colors" title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export function CreateExamPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // ── set metadata ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [timeMinutes, setTimeMinutes] = useState(60)
  const [passPercent, setPassPercent] = useState(70)

  // ── questions ─────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState(null)

  // ── json import ───────────────────────────────────────────────────────────
  const [importTab, setImportTab] = useState('json')   // 'json' | 'xlsx' | 'pdf'
  const [showImport, setShowImport] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState(null)
  const [jsonSuccess, setJsonSuccess] = useState(null)
  // xlsx
  const xlsxRef = useRef(null)
  const [xlsxStatus, setXlsxStatus] = useState(null)  // {type:'success'|'error', msg, count}
  // pdf
  const pdfRef = useRef(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfRawText, setPdfRawText] = useState('')
  const [pdfStatus, setPdfStatus] = useState(null)

  // ── submit ────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [errors, setErrors] = useState({})

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-soft flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-ink-muted">Debes iniciar sesión para crear sets de examen.</p>
          <Link to="/login" className="inline-block px-5 py-2 bg-brand-500 text-white rounded font-semibold text-sm">Iniciar sesión
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  function handleSaveQuestion(payload) {
    if (editIndex !== null) {
      setQuestions((qs) => qs.map((q, i) => i === editIndex ? payload : q))
    } else {
      setQuestions((qs) => [...qs, payload])
    }
    setShowForm(false)
    setEditIndex(null)
  }

  function handleEditQuestion(index) {
    setEditIndex(index)
    setShowForm(true)
  }

  function handleDeleteQuestion(index) {
    setQuestions((qs) => qs.filter((_, i) => i !== index))
  }

  function handleJsonImport() {
    setJsonError(null); setJsonSuccess(null)
    const { questions: imported, error } = parseJsonQuestions(jsonText)
    if (imported.length === 0 && error) { setJsonError(error); return }
    setQuestions((qs) => [...qs, ...imported])
    setJsonSuccess(`${imported.length} pregunta${imported.length !== 1 ? 's' : ''} importada${imported.length !== 1 ? 's' : ''}.${error ? ' ' + error : ''}`)
    setJsonText('')
  }

  async function handleXlsxImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setXlsxStatus(null)
    try {
      const { questions: imported, error } = await parseXLSX(file)
      if (imported.length === 0) {
        setXlsxStatus({ type: 'error', msg: error ?? 'No se encontraron preguntas válidas en el archivo.' })
      } else {
        setQuestions((qs) => [...qs, ...imported])
        setXlsxStatus({ type: 'success', count: imported.length, msg: error ?? null })
      }
    } catch (_err) {
      setXlsxStatus({ type: 'error', msg: 'Error al leer el archivo Excel.' })
    }
    e.target.value = ''
  }

  async function handlePdfImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfStatus(null); setPdfRawText(''); setPdfLoading(true)
    try {
      const rawText = await extractPDFText(file)
      const { questions: imported } = parseTextToQuestions(rawText)
      if (imported.length > 0) {
        setQuestions((qs) => [...qs, ...imported])
        setPdfStatus({ type: 'success', count: imported.length })
        setPdfRawText('')
      } else {
        setPdfRawText(rawText)
        setPdfStatus({ type: 'partial', msg: 'No se detectaron preguntas automáticamente. Revisa el texto extraído abajo.' })
      }
    } catch (_err) {
      setPdfStatus({ type: 'error', msg: 'Error al leer el PDF.' })
    }
    setPdfLoading(false)
    e.target.value = ''
  }

  function validate() {
    const e = {}
    if (!title.trim() || title.trim().length < 3) e.title = 'El título debe tener al menos 3 caracteres.'
    if (questions.length < 1) e.questions = 'Añade al menos 1 pregunta.'
    if (Number(timeMinutes) < 1 || Number(timeMinutes) > 300) e.timeMinutes = 'Entre 1 y 300 minutos.'
    if (Number(passPercent) < 1 || Number(passPercent) > 100) e.passPercent = 'Entre 1 y 100%.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true); setFormError(null)
    try {
      const tagsArr = tags.split(',').map((t) => t.trim()).filter(Boolean)
      const setRef = await addDoc(collection(db, 'examSets'), {
        title:         title.trim(),
        description:   description.trim(),
        tags:          tagsArr,
        ownerUid:      user.uid,
        ownerName:     user.displayName ?? user.email,
        published:     true,
        questionCount: questions.length,
        timeMinutes:   Number(timeMinutes),
        passPercent:   Number(passPercent),
        attempts:      0,
        official:      false,
        createdAt:     serverTimestamp(),
      })

      await Promise.all(
        questions.map((q, i) =>
          addDoc(collection(db, 'examSets', setRef.id, 'questions'), { ...q, order: i })
        )
      )

      navigate('/explore')
    } catch (_err) {
      setFormError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-soft pb-16">
      {/* Header */}
      <header className="border-b border-surface-border bg-surface-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-base font-bold text-brand-600">CertZen</span>
          <Link to="/explore" className="text-sm text-ink-muted hover:text-ink flex items-center gap-1">
            <ArrowLeft size={14} /> Explorar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-ink">Crear set de examen</h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Información del set */}
          <section className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
            <h2 className="font-semibold text-ink">Información del set</h2>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })) }}
                placeholder="Ej: Examen de Práctica"
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              />
              {errors.title && <p className="text-danger-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Descripción (opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe el contenido de este set…"
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 resize-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1">Categorías / Etiquetas (opcional)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Ej: Procesos, Interfaces, Registros, Seguridad"
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              />
              <p className="text-xs text-ink-faint mt-1">Separa las categorías con comas para clasificar el contenido del examen.</p>
            </div>
          </section>

          {/* Configuración del examen */}
          <section className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
            <h2 className="font-semibold text-ink">Configuración del examen</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-ink-soft mb-1">
                  <Clock size={12} /> Tiempo límite (minutos)
                </label>
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={timeMinutes}
                  onChange={(e) => { setTimeMinutes(e.target.value); setErrors((p) => ({ ...p, timeMinutes: undefined })) }}
                  className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
                />
                {errors.timeMinutes && <p className="text-danger-500 text-xs mt-1">{errors.timeMinutes}</p>}
                <p className="text-xs text-ink-faint mt-1">Ej: 60 min para 50 preguntas</p>
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-ink-soft mb-1">
                  <Target size={12} /> Puntaje mínimo para aprobar (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={passPercent}
                  onChange={(e) => { setPassPercent(e.target.value); setErrors((p) => ({ ...p, passPercent: undefined })) }}
                  className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
                />
                {errors.passPercent && <p className="text-danger-500 text-xs mt-1">{errors.passPercent}</p>}
                <p className="text-xs text-ink-faint mt-1">Examen oficial: 73%</p>
              </div>
            </div>
          </section>

          {/* ── Importar preguntas ─────────────────────────────── */}
          <section className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setShowImport((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-brand-500" />
                <span className="font-semibold text-ink text-sm">Importar preguntas</span>
                <span className="text-xs text-ink-faint font-normal">JSON · Excel · PDF</span>
              </div>
              <span className="text-ink-faint text-xs">{showImport ? '▲' : '▼'}</span>
            </button>

            {showImport && (
              <div className="border-t border-surface-border">
                {/* Tabs */}
                <div className="flex border-b border-surface-border">
                  {[
                    { id: 'json',  icon: FileJson,        label: 'JSON' },
                    { id: 'xlsx',  icon: FileSpreadsheet, label: 'Excel' },
                    { id: 'pdf',   icon: FileText,        label: 'PDF' },
                  ].map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setImportTab(id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                        importTab === id
                          ? 'border-brand-500 text-brand-600 bg-brand-50'
                          : 'border-transparent text-ink-muted hover:text-ink-soft'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

                {/* ── JSON tab ── */}
                {importTab === 'json' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-ink-muted">
                      Pega un array JSON. Tipos soportados: <strong>multiple</strong>, <strong>ordering</strong>, <strong>matching</strong>.
                    </p>
                    <details className="group">
                      <summary className="text-xs font-semibold text-brand-600 cursor-pointer list-none flex items-center gap-1">
                        <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> Ver formato de ejemplo
                      </summary>
                      <pre className="mt-2 text-xs text-ink-muted bg-surface-soft rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-surface-border">{JSON_EXAMPLE}</pre>
                    </details>
                    <textarea
                      value={jsonText}
                      onChange={(e) => { setJsonText(e.target.value); setJsonError(null); setJsonSuccess(null) }}
                      rows={7}
                      placeholder="Pega aquí el JSON..."
                      className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-500 resize-y bg-white"
                    />
                    {jsonError && <p className="text-danger-500 text-xs">{jsonError}</p>}
                    {jsonSuccess && <p className="text-success-600 text-xs">{jsonSuccess}</p>}
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { setJsonText(JSON_EXAMPLE); setJsonError(null); setJsonSuccess(null) }}
                        className="text-xs text-ink-faint hover:text-brand-500 underline">
                        Cargar ejemplo
                      </button>
                      <button type="button" onClick={handleJsonImport} disabled={!jsonText.trim()}
                        className="ml-auto px-4 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:bg-surface-muted disabled:text-ink-faint text-white text-xs font-semibold rounded-lg transition-colors">
                        Importar
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Excel tab ── */}
                {importTab === 'xlsx' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-ink-muted">
                      Sube un archivo <strong>.xlsx</strong>. La primera fila debe ser el encabezado con estas columnas:
                    </p>
                    <details className="group">
                      <summary className="text-xs font-semibold text-brand-600 cursor-pointer list-none flex items-center gap-1">
                        <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> Ver columnas requeridas
                      </summary>
                      <div className="mt-2 text-xs bg-surface-soft border border-surface-border rounded-lg p-3 space-y-2">
                        <p className="font-semibold text-ink-soft">Para preguntas de opción múltiple (<code>type=multiple</code>):</p>
                        <code className="block text-ink-muted font-mono">type | question | optA | optB | optC | optD | answer | explanation</code>
                        <p className="text-ink-muted">• <strong>answer</strong>: letra(s) correcta(s), ej: <code>B</code> o <code>A,C</code> para múltiple</p>
                        <p className="font-semibold text-ink-soft mt-2">Para ordenamiento (<code>type=ordering</code>):</p>
                        <code className="block text-ink-muted font-mono">type | question | item1 | item2 | item3 | item4 | explanation</code>
                        <p className="text-ink-muted">• Los ítems se listan en el orden correcto</p>
                      </div>
                    </details>
                    <input ref={xlsxRef} type="file" accept=".xlsx" className="hidden" onChange={handleXlsxImport} />
                    {xlsxStatus?.type === 'error' && <p className="text-danger-500 text-xs">{xlsxStatus.msg}</p>}
                    {xlsxStatus?.type === 'success' && (
                      <p className="text-success-600 text-xs">
                        ✓ {xlsxStatus.count} pregunta{xlsxStatus.count !== 1 ? 's' : ''} importada{xlsxStatus.count !== 1 ? 's' : ''}.
                        {xlsxStatus.msg && ` ${xlsxStatus.msg}`}
                      </p>
                    )}
                    <button type="button" onClick={() => xlsxRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      <FileSpreadsheet size={13} /> Seleccionar archivo .xlsx
                    </button>
                  </div>
                )}

                {/* ── PDF tab ── */}
                {importTab === 'pdf' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-gray-500">
                      Sube un PDF con preguntas numeradas. Se extraen automáticamente preguntas con opciones <code>A/B/C/D</code> y respuesta correcta (letra al final o <code>Answer: B</code> / <code>Respuesta: A</code>). También reconoce tarjetas donde la letra minúscula (<code>a. Texto</code>) indica directamente la respuesta correcta; en ese caso deberás completar los distractores manualmente.
                    </p>
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                      ⚠ PDFs escaneados (imágenes) no soportados — el texto debe ser copiable desde el PDF.
                    </p>
                    <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfImport} />
                    {pdfStatus?.type === 'error' && <p className="text-danger-500 text-xs">{pdfStatus.msg}</p>}
                    {pdfStatus?.type === 'success' && (
                      <p className="text-success-600 text-xs">
                        ✓ {pdfStatus.count} pregunta{pdfStatus.count !== 1 ? 's' : ''} detectada{pdfStatus.count !== 1 ? 's' : ''} e importada{pdfStatus.count !== 1 ? 's' : ''}.
                      </p>
                    )}
                    {pdfStatus?.type === 'partial' && <p className="text-warning-600 text-xs">{pdfStatus.msg}</p>}
                    <button type="button" onClick={() => pdfRef.current?.click()} disabled={pdfLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-surface-muted disabled:text-ink-faint text-white text-xs font-semibold rounded-lg transition-colors">
                      <FileText size={13} /> {pdfLoading ? 'Procesando PDF…' : 'Seleccionar archivo PDF'}
                    </button>
                    {pdfRawText && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-ink-soft">Texto extraído del PDF (cópialo al tab JSON si lo necesitas):</p>
                        <textarea readOnly value={pdfRawText} rows={8}
                          className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs font-mono bg-surface-soft resize-y" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Preguntas */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">
                Preguntas <span className="text-ink-faint font-normal">({questions.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => { setEditIndex(null); setShowForm(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Plus size={14} /> Nueva pregunta
              </button>
            </div>

            {errors.questions && <p className="text-danger-500 text-xs">{errors.questions}</p>}

            {questions.length === 0 ? (
              <div className="border-2 border-dashed border-surface-border rounded-xl py-12 text-center bg-surface-card">
                <p className="text-ink-faint text-sm">Aún no hay preguntas.</p>
                <p className="text-ink-faint text-xs mt-1">Usa "Nueva pregunta" o importa desde JSON, Excel o PDF.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <QuestionRow
                    key={i}
                    q={q}
                    index={i}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                ))}
              </div>
            )}
          </section>

          {formError && <p className="text-sm text-danger-500">{formError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-surface-muted disabled:text-ink-muted text-white font-bold rounded-xl text-sm transition-colors shadow-brand"
          >
            {saving ? 'Guardando…' : 'Publicar set'}
          </button>
        </form>
      </main>

      {/* QuestionForm modal */}
      {showForm && (
        <QuestionForm
          initial={editIndex !== null ? questions[editIndex] : undefined}
          onSave={handleSaveQuestion}
          onCancel={() => { setShowForm(false); setEditIndex(null) }}
          loading={false}
          hideMeta={true}
        />
      )}
    </div>
  )
}


