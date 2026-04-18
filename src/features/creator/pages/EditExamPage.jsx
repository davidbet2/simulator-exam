import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import { Plus, Trash2, ArrowLeft, Clock, Target, Pencil, FileJson, FileSpreadsheet, FileText, Lock, Loader2 } from 'lucide-react'
import {
  collection, doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { AppShell } from '../../../components/layout/AppShell'
import { QuestionForm } from '../../admin/components/QuestionForm'
import { parseXLSX, extractPDFText, parseTextToQuestions } from '../utils/importParsers'

const buildTypeLabels = (t) => ({
  multiple: t`Opción múltiple`,
  ordering: t`Ordenamiento`,
  matching: t`Emparejamiento`,
})

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
  }
]`

function parseJsonQuestions(text, t) {
  let parsed
  try { parsed = JSON.parse(text) } catch {
    return { questions: [], error: t`JSON inválido. Verifica la sintaxis.` }
  }
  if (!Array.isArray(parsed)) {
    return { questions: [], error: t`El JSON debe ser un array [ ... ].` }
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
  const error = invalid.length ? t`Preguntas ignoradas (formato inválido): #${invalid.join(', #')}` : null
  return { questions, error }
}

function QuestionRow({ q, index, onEdit, onDelete }) {
  const { t } = useLingui()
  const TYPE_LABELS = buildTypeLabels(t)
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

export function EditExamPage() {
  const { t } = useLingui()
  const TYPE_LABELS = buildTypeLabels(t)
  const { id } = useParams()
  const { user, isPro } = useAuthStore()
  const navigate = useNavigate()

  // ── loading ───────────────────────────────────────────────────────────────
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

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
  const [importTab, setImportTab] = useState('json')
  const [showImport, setShowImport] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState(null)
  const [jsonSuccess, setJsonSuccess] = useState(null)
  // xlsx
  const xlsxRef = useRef(null)
  const [xlsxStatus, setXlsxStatus] = useState(null)
  // pdf
  const pdfRef = useRef(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfRawText, setPdfRawText] = useState('')
  const [pdfStatus, setPdfStatus] = useState(null)

  // ── submit ────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)
  const [errors, setErrors] = useState({})

  // ── load existing data ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    if (!id) { navigate('/my-sets', { replace: true }); return }
    let active = true
    ;(async () => {
      try {
        const setSnap = await getDoc(doc(db, 'examSets', id))
        if (!active) return
        if (!setSnap.exists()) { setLoadError(t`El set no existe.`); setInitialLoading(false); return }
        const data = setSnap.data()
        if (data.ownerUid !== user.uid) { setLoadError(t`No tienes permiso para editar este set.`); setInitialLoading(false); return }

        setTitle(data.title ?? '')
        setDescription(data.description ?? '')
        setTags((data.tags ?? []).join(', '))
        setTimeMinutes(data.timeMinutes ?? 60)
        setPassPercent(data.passPercent ?? 70)

        const qSnap = await getDocs(query(collection(db, 'examSets', id, 'questions'), orderBy('order', 'asc')))
        if (!active) return
        setQuestions(qSnap.docs.map((d) => d.data()))
      } catch (err) {
        if (active) setLoadError(t`Error al cargar el set.`)
        console.error('[EditExam] load failed:', err)
      } finally {
        if (active) setInitialLoading(false)
      }
    })()
    return () => { active = false }
  }, [id, user, navigate, t])

  function handleSaveQuestion(payload) {
    if (editIndex !== null) {
      setQuestions((prev) => prev.map((q, i) => (i === editIndex ? payload : q)))
    } else {
      setQuestions((prev) => [...prev, payload])
    }
    setShowForm(false)
    setEditIndex(null)
  }

  function handleEditQuestion(index) {
    setEditIndex(index)
    setShowForm(true)
  }

  function handleDeleteQuestion(index) {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  function handleJsonImport() {
    const { questions: imported, error } = parseJsonQuestions(jsonText, t)
    if (imported.length === 0) {
      setJsonError(error ?? t`No se encontraron preguntas válidas.`)
      setJsonSuccess(null)
    } else {
      setQuestions((prev) => [...prev, ...imported])
      setJsonSuccess(t`${imported.length} pregunta${imported.length !== 1 ? 's' : ''} importada${imported.length !== 1 ? 's' : ''}.`)
      setJsonError(error)
      setJsonText('')
    }
  }

  async function handleXlsxImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { questions: imported, warnings } = await parseXLSX(file)
      setQuestions((prev) => [...prev, ...imported])
      setXlsxStatus({ type: 'success', count: imported.length, msg: warnings?.join('; ') ?? '' })
    } catch (err) {
      setXlsxStatus({ type: 'error', msg: err.message ?? t`Error al leer el archivo.` })
    }
    e.target.value = ''
  }

  async function handlePdfImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfLoading(true)
    setPdfStatus(null)
    try {
      const rawText = await extractPDFText(file)
      setPdfRawText(rawText)
      const { questions: imported, partial } = parseTextToQuestions(rawText)
      if (imported.length === 0) {
        setPdfStatus({ type: 'error', msg: t`No se detectaron preguntas en el PDF. Copia el texto extraído y usa el tab JSON.` })
      } else {
        setQuestions((prev) => [...prev, ...imported])
        setPdfStatus(partial
          ? { type: 'partial', msg: t`${imported.length} preguntas importadas. Algunas pueden estar incompletas — revísalas.` }
          : { type: 'success', count: imported.length })
      }
    } catch (err) {
      setPdfStatus({ type: 'error', msg: err.message ?? t`Error al procesar el PDF.` })
    } finally {
      setPdfLoading(false)
      e.target.value = ''
    }
  }

  function validate() {
    const e = {}
    if (!title.trim() || title.trim().length < 3) e.title = t`El título debe tener al menos 3 caracteres.`
    if (title.trim().length > 200) e.title = t`El título no puede superar 200 caracteres.`
    if (questions.length < 1) e.questions = t`Añade al menos 1 pregunta.`
    if (questions.length > 500) e.questions = t`Máximo 500 preguntas por examen.`
    if (Number(timeMinutes) < 1 || Number(timeMinutes) > 300) e.timeMinutes = t`Entre 1 y 300 minutos.`
    if (Number(passPercent) < 1 || Number(passPercent) > 100) e.passPercent = t`Entre 1 y 100%.`
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true); setFormError(null)
    try {
      const tagsArr = tags.split(',').map((tag) => tag.trim()).filter(Boolean)

      // Update the set metadata
      await updateDoc(doc(db, 'examSets', id), {
        title:         title.trim(),
        description:   description.trim(),
        tags:          tagsArr,
        questionCount: questions.length,
        timeMinutes:   Number(timeMinutes),
        passPercent:   Number(passPercent),
        updatedAt:     serverTimestamp(),
      })

      // Replace all questions: delete existing then add new ones
      const existingSnap = await getDocs(collection(db, 'examSets', id, 'questions'))
      await Promise.all(existingSnap.docs.map((d) => deleteDoc(d.ref)))
      await Promise.all(
        questions.map((q, i) =>
          addDoc(collection(db, 'examSets', id, 'questions'), { ...q, order: i })
        )
      )

      navigate('/my-sets')
    } catch (_err) {
      setFormError(t`Error al guardar. Inténtalo de nuevo.`)
      setSaving(false)
    }
  }

  if (!user) return null

  if (initialLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-brand-500" />
        </div>
      </AppShell>
    )
  }

  if (loadError) {
    return (
      <AppShell>
        <div className="flex items-center justify-center p-4 py-20">
          <div className="text-center space-y-4">
            <p className="text-ink-muted">{loadError}</p>
            <Link to="/my-sets" className="inline-block px-5 py-2 bg-brand-500 text-white rounded font-semibold text-sm">
              <Trans>Volver a mis sets</Trans>
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink"><Trans>Editar set</Trans></h1>
          <Link to="/my-sets" className="text-sm text-ink-muted hover:text-ink flex items-center gap-1">
            <ArrowLeft size={14} /> <Trans>Mis sets</Trans>
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Información del set */}
          <section className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
            <h2 className="font-semibold text-ink"><Trans>Información del set</Trans></h2>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1"><Trans>Título *</Trans></label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })) }}
                placeholder={t`Ej: Examen de Práctica`}
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              />
              {errors.title && <p className="text-danger-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1"><Trans>Descripción (opcional)</Trans></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder={t`Describe el contenido de este set…`}
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 resize-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-soft mb-1"><Trans>Categorías / Etiquetas (opcional)</Trans></label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t`Ej: Procesos, Interfaces, Registros, Seguridad`}
                className="w-full border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-500 bg-white"
              />
              <p className="text-xs text-ink-faint mt-1"><Trans>Separa las categorías con comas para clasificar el contenido del examen.</Trans></p>
            </div>
          </section>

          {/* Configuración del examen */}
          <section className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4 shadow-card">
            <h2 className="font-semibold text-ink"><Trans>Configuración del examen</Trans></h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-ink-soft mb-1">
                  <Clock size={12} /> <Trans>Tiempo límite (minutos)</Trans>
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
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-semibold text-ink-soft mb-1">
                  <Target size={12} /> <Trans>Puntaje mínimo para aprobar (%)</Trans>
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
              </div>
            </div>
          </section>

          {/* ── Importar preguntas ─────────────────────────────── */}
          {isPro ? (
          <section className="bg-surface-card border border-surface-border rounded-xl overflow-hidden shadow-card">
            <button
              type="button"
              onClick={() => setShowImport((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-muted transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-brand-500" />
                <span className="font-semibold text-ink text-sm"><Trans>Importar más preguntas</Trans></span>
                <span className="text-xs text-ink-faint font-normal">JSON · Excel · PDF</span>
              </div>
              <span className="text-ink-faint text-xs">{showImport ? '▲' : '▼'}</span>
            </button>

            {showImport && (
              <div className="border-t border-surface-border">
                <div className="flex border-b border-surface-border">
                  {[
                    { id: 'json',  icon: FileJson,        label: 'JSON' },
                    { id: 'xlsx',  icon: FileSpreadsheet, label: 'Excel' },
                    { id: 'pdf',   icon: FileText,        label: 'PDF' },
                  ].map(({ id: tabId, icon: Icon, label }) => (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => setImportTab(tabId)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                        importTab === tabId
                          ? 'border-brand-500 text-brand-600 bg-brand-50'
                          : 'border-transparent text-ink-muted hover:text-ink-soft'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

                {importTab === 'json' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-ink-muted">
                      <Trans>Pega un array JSON. Tipos soportados:</Trans> <strong>multiple</strong>, <strong>ordering</strong>, <strong>matching</strong>.
                    </p>
                    <details className="group">
                      <summary className="text-xs font-semibold text-brand-600 cursor-pointer list-none flex items-center gap-1">
                        <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> <Trans>Ver formato de ejemplo</Trans>
                      </summary>
                      <pre className="mt-2 text-xs text-ink-muted bg-surface-soft rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-surface-border">{JSON_EXAMPLE}</pre>
                    </details>
                    <textarea
                      value={jsonText}
                      onChange={(e) => { setJsonText(e.target.value); setJsonError(null); setJsonSuccess(null) }}
                      rows={7}
                      placeholder={t`Pega aquí el JSON...`}
                      className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-brand-500 resize-y bg-white"
                    />
                    {jsonError && <p className="text-danger-500 text-xs">{jsonError}</p>}
                    {jsonSuccess && <p className="text-success-600 text-xs">{jsonSuccess}</p>}
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { setJsonText(JSON_EXAMPLE); setJsonError(null); setJsonSuccess(null) }}
                        className="text-xs text-ink-faint hover:text-brand-500 underline">
                        <Trans>Cargar ejemplo</Trans>
                      </button>
                      <button type="button" onClick={handleJsonImport} disabled={!jsonText.trim()}
                        className="ml-auto px-4 py-1.5 bg-brand-500 hover:bg-brand-600 disabled:bg-surface-muted disabled:text-ink-faint text-white text-xs font-semibold rounded-lg transition-colors">
                        <Trans>Importar</Trans>
                      </button>
                    </div>
                  </div>
                )}

                {importTab === 'xlsx' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-ink-muted">
                      <Trans>Sube un archivo</Trans> <strong>.xlsx</strong>. <Trans>La primera fila debe ser el encabezado.</Trans>
                    </p>
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
                      <FileSpreadsheet size={13} /> <Trans>Seleccionar archivo .xlsx</Trans>
                    </button>
                  </div>
                )}

                {importTab === 'pdf' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-gray-500">
                      <Trans>Sube un PDF con preguntas numeradas. Se extraen automáticamente.</Trans>
                    </p>
                    <p className="text-warning-600 text-xs">
                      ⚠ <Trans>PDFs escaneados (imágenes) no soportados — el texto debe ser copiable desde el PDF.</Trans>
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
                      <FileText size={13} /> {pdfLoading ? t`Procesando PDF…` : t`Seleccionar archivo PDF`}
                    </button>
                    {pdfRawText && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-ink-soft"><Trans>Texto extraído del PDF:</Trans></p>
                        <textarea readOnly value={pdfRawText} rows={8}
                          className="w-full border border-surface-border rounded-lg px-3 py-2 text-xs font-mono bg-surface-soft resize-y" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
          ) : (
          <section className="bg-surface-card border border-surface-border rounded-xl p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={15} className="text-brand-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink"><Trans>Importación masiva — plan Pro</Trans></p>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  <Trans>Actualiza a Pro para importar desde JSON, Excel o PDF e importar cientos de preguntas en segundos.</Trans>
                </p>
                <Link to="/pricing"
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors">
                  <Trans>Ver plan Pro →</Trans>
                </Link>
              </div>
            </div>
          </section>
          )}

          {/* Preguntas */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">
                <Trans>Preguntas</Trans> <span className="text-ink-faint font-normal">({questions.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => { setEditIndex(null); setShowForm(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Plus size={14} /> <Trans>Nueva pregunta</Trans>
              </button>
            </div>

            {errors.questions && <p className="text-danger-500 text-xs">{errors.questions}</p>}

            {questions.length === 0 ? (
              <div className="border-2 border-dashed border-surface-border rounded-xl py-12 text-center bg-surface-card">
                <p className="text-ink-faint text-sm"><Trans>Aún no hay preguntas.</Trans></p>
                <p className="text-ink-faint text-xs mt-1">{isPro ? <Trans>Usa "Nueva pregunta" o importa desde JSON, Excel o PDF.</Trans> : <Trans>Usa el botón "Nueva pregunta" para añadir preguntas.</Trans>}</p>
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
            {saving ? t`Guardando…` : t`Guardar cambios`}
          </button>
        </form>
      </div>

      {showForm && (
        <QuestionForm
          initial={editIndex !== null ? questions[editIndex] : undefined}
          onSave={handleSaveQuestion}
          onCancel={() => { setShowForm(false); setEditIndex(null) }}
          loading={false}
          hideMeta={true}
        />
      )}
    </AppShell>
  )
}
