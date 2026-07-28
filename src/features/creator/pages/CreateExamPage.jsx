import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import { Plus, Trash2, ArrowLeft, Clock, Target, Pencil, FileJson, FileSpreadsheet, FileText, Lock } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { AppShell } from '../../../components/layout/AppShell'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassButton } from '../../../components/glass/GlassButton'
import { GlassInput } from '../../../components/glass/GlassInput'
import { QuestionForm } from '../../admin/components/QuestionForm'
import { parseXLSX, extractPDFText, parseTextToQuestions } from '../utils/importParsers'
import { DOMAINS } from '../../../core/constants/domains'

const INPUT_CLS = 'w-full border border-glass-light-border dark:border-glass-dark-border rounded-zen px-3 py-2 text-sm text-zen-ink dark:text-white bg-glass-light-2 dark:bg-glass-dark-2 backdrop-blur-md focus:outline-none focus:border-zen focus:ring-2 focus:ring-zen/40'
const FREE_QUESTION_LIMIT = 20
const PRO_QUESTION_LIMIT = 500
const LABEL_CLS = 'block text-xs font-semibold text-zen-ink/60 dark:text-white/60 mb-1'

const buildTypeLabels = (t) => ({
  multiple: t`Opción múltiple`,
  ordering: t`Ordenamiento`,
  matching: t`Emparejamiento`,
})

const JSON_EXAMPLE = `[
  {
    "type": "multiple",
    "question": "¿Cuál de las siguientes opciones describe mejor el concepto A?",
    "options": {
      "A": "Descripción incorrecta 1",
      "B": "Descripción correcta del concepto",
      "C": "Descripción incorrecta 2",
      "D": "Descripción incorrecta 3"
    },
    "answer": ["B"],
    "explanation": "Breve justificación de por qué B es la respuesta correcta."
  },
  {
    "type": "ordering",
    "question": "Ordena los siguientes pasos del proceso.",
    "items": ["Paso 1", "Paso 2", "Paso 3"],
    "correctOrder": ["Paso 1", "Paso 2", "Paso 3"]
  },
  {
    "type": "matching",
    "question": "Asocia cada término con su descripción.",
    "pairs": [
      { "term": "Término A", "correctMatch": "A" },
      { "term": "Término B", "correctMatch": "B" }
    ],
    "matches": {
      "A": "Descripción del término A",
      "B": "Descripción del término B"
    }
  }
]`

function parseJsonQuestions(text, t) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
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
    <div className="flex items-start gap-3 py-3 px-4 border border-glass-light-border dark:border-glass-dark-border rounded-xl bg-glass-light-1 dark:bg-glass-dark-1 hover:border-zen/40 transition-colors">
      <span className="mt-0.5 w-6 h-6 rounded-full bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zen-ink dark:text-white leading-snug">{preview}</p>
        <span className="text-xs text-zen-ink/40 dark:text-white/40 mt-0.5 block">{TYPE_LABELS[q.type] ?? 'Opción múltiple'}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button type="button" onClick={() => onEdit(index)}
          className="p-1.5 text-zen-ink/40 dark:text-white/40 hover:text-zen dark:hover:text-indigo-300 rounded transition-colors" title="Editar">
          <Pencil size={14} />
        </button>
        <button type="button" onClick={() => onDelete(index)}
          className="p-1.5 text-zen-ink/40 dark:text-white/40 hover:text-zen-danger rounded transition-colors" title="Eliminar">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export function CreateExamPage() {
  const { t } = useLingui()
  const TYPE_LABELS = buildTypeLabels(t)
  const { user, isPro } = useAuthStore()
  const navigate = useNavigate()
  const maxQuestions = isPro ? PRO_QUESTION_LIMIT : FREE_QUESTION_LIMIT

  // ── set metadata ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState(DOMAINS[0]?.id ?? '')
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
      <AppShell>
        <div className="flex items-center justify-center p-4 py-20">
          <div className="text-center space-y-4">
            <p className="text-zen-ink/60 dark:text-white/60"><Trans>Debes iniciar sesión para crear sets de examen.</Trans></p>
            <GlassButton to="/login"><Trans>Iniciar sesión</Trans></GlassButton>
          </div>
        </div>
      </AppShell>
    )
  }

  function handleSaveQuestion(payload) {
    if (editIndex !== null) {
      setQuestions((qs) => qs.map((q, i) => i === editIndex ? payload : q))
    } else if (questions.length < maxQuestions) {
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
    const { questions: imported, error } = parseJsonQuestions(jsonText, t)
    if (imported.length === 0 && error) { setJsonError(error); return }
    setQuestions((qs) => [...qs, ...imported])
    const countMsg = imported.length === 1 ? t`1 pregunta importada.` : t`${imported.length} preguntas importadas.`
    setJsonSuccess(`${countMsg}${error ? ' ' + error : ''}`)
    setJsonText('')
  }

  async function handleXlsxImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setXlsxStatus(null)
    if (file.size > 2 * 1024 * 1024) {
      setXlsxStatus({ type: 'error', msg: t`El archivo supera 2 MB.` })
      e.target.value = ''
      return
    }
    if (!/\.xlsx$/i.test(file.name)) {
      setXlsxStatus({ type: 'error', msg: t`Formato inválido. Solo se permite .xlsx.` })
      e.target.value = ''
      return
    }
    try {
      const { questions: imported, error } = await parseXLSX(file)
      if (imported.length === 0) {
        setXlsxStatus({ type: 'error', msg: error ?? t`No se encontraron preguntas válidas en el archivo.` })
      } else {
        setQuestions((qs) => {
          const merged = [...qs, ...imported]
          return merged.length > 500 ? merged.slice(0, 500) : merged
        })
        setXlsxStatus({ type: 'success', count: imported.length, msg: error ?? null })
      }
    } catch (_err) {
      setXlsxStatus({ type: 'error', msg: t`Error al leer el archivo Excel.` })
    }
    e.target.value = ''
  }

  async function handlePdfImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPdfStatus(null); setPdfRawText('')
    if (file.size > 10 * 1024 * 1024) {
      setPdfStatus({ type: 'error', msg: t`El archivo supera 10 MB.` })
      e.target.value = ''
      return
    }
    if (!/\.pdf$/i.test(file.name)) {
      setPdfStatus({ type: 'error', msg: t`Formato inválido. Solo se permite .pdf.` })
      e.target.value = ''
      return
    }
    setPdfLoading(true)
    try {
      const rawText = await extractPDFText(file)
      const { questions: imported } = parseTextToQuestions(rawText)
      if (imported.length > 0) {
        setQuestions((qs) => {
          const merged = [...qs, ...imported]
          return merged.length > 500 ? merged.slice(0, 500) : merged
        })
        setPdfStatus({ type: 'success', count: imported.length })
        setPdfRawText('')
      } else {
        setPdfRawText(rawText)
        setPdfStatus({ type: 'partial', msg: t`No se detectaron preguntas automáticamente. Revisa el texto extraído abajo.` })
      }
    } catch (_err) {
      setPdfStatus({ type: 'error', msg: t`Error al leer el PDF.` })
    }
    setPdfLoading(false)
    e.target.value = ''
  }

  function validate() {
    const e = {}
    if (!title.trim() || title.trim().length < 3) e.title = t`El título debe tener al menos 3 caracteres.`
    if (title.trim().length > 200) e.title = t`El título no puede superar 200 caracteres.`
    if (questions.length < 1) e.questions = t`Añade al menos 1 pregunta.`
    if (questions.length > maxQuestions) e.questions = isPro
      ? t`Máximo ${maxQuestions} preguntas por examen.`
      : t`El plan Free permite máximo ${maxQuestions} preguntas por examen. Actualiza a Pro para preguntas ilimitadas.`
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
      const setRef = await addDoc(collection(db, 'examSets'), {
        title:         title.trim(),
        description:   description.trim(),
        domain,
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
      setFormError(t`Error al guardar. Inténtalo de nuevo.`)
      setSaving(false)
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zen-ink dark:text-white"><Trans>Crear set de examen</Trans></h1>
          <Link to="/explore" className="text-sm text-zen-ink/50 dark:text-white/50 hover:text-zen-ink dark:hover:text-white flex items-center gap-1">
            <ArrowLeft size={14} /> <Trans>Explorar</Trans>
          </Link>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Información del set */}
          <GlassCard className="p-5 space-y-4">
            <h2 className="font-semibold text-zen-ink dark:text-white"><Trans>Información del set</Trans></h2>

            <div>
              <label className={LABEL_CLS}><Trans>Título *</Trans></label>
              <GlassInput
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })) }}
                placeholder={t`Ej: Examen de Práctica`}
              />
              {errors.title && <p className="text-zen-danger text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className={LABEL_CLS}><Trans>Descripción (opcional)</Trans></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder={t`Describe el contenido de este set…`}
                className={`${INPUT_CLS} resize-none`}
              />
            </div>

            <div>
              <label className={LABEL_CLS}><Trans>Categoría</Trans></label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className={INPUT_CLS}
              >
                {DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>{d.icon} {d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL_CLS}><Trans>Etiquetas (opcional)</Trans></label>
              <GlassInput
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t`Ej: Procesos, Interfaces, Registros, Seguridad`}
              />
              <p className="text-xs text-zen-ink/40 dark:text-white/40 mt-1"><Trans>Separa las etiquetas con comas para clasificar el contenido del examen.</Trans></p>
            </div>
          </GlassCard>

          {/* Configuración del examen */}
          <GlassCard className="p-5 space-y-4">
            <h2 className="font-semibold text-zen-ink dark:text-white"><Trans>Configuración del examen</Trans></h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`flex items-center gap-1 ${LABEL_CLS}`}>
                  <Clock size={12} /> <Trans>Tiempo límite (minutos)</Trans>
                </label>
                <GlassInput
                  type="number"
                  min={1}
                  max={300}
                  value={timeMinutes}
                  onChange={(e) => { setTimeMinutes(e.target.value); setErrors((p) => ({ ...p, timeMinutes: undefined })) }}
                />
                {errors.timeMinutes && <p className="text-zen-danger text-xs mt-1">{errors.timeMinutes}</p>}
                <p className="text-xs text-zen-ink/40 dark:text-white/40 mt-1"><Trans>Ej: 60 min para 50 preguntas</Trans></p>
              </div>

              <div>
                <label className={`flex items-center gap-1 ${LABEL_CLS}`}>
                  <Target size={12} /> <Trans>Puntaje mínimo para aprobar (%)</Trans>
                </label>
                <GlassInput
                  type="number"
                  min={1}
                  max={100}
                  value={passPercent}
                  onChange={(e) => { setPassPercent(e.target.value); setErrors((p) => ({ ...p, passPercent: undefined })) }}
                />
                {errors.passPercent && <p className="text-zen-danger text-xs mt-1">{errors.passPercent}</p>}
                <p className="text-xs text-zen-ink/40 dark:text-white/40 mt-1"><Trans>Examen oficial: 73%</Trans></p>
              </div>
            </div>
          </GlassCard>

          {/* ── Importar preguntas ─────────────────────────────── */}
          {isPro ? (
          <GlassCard className="overflow-hidden">
            <button
              type="button"
              onClick={() => setShowImport((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-glass-light-2 dark:hover:bg-glass-dark-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-zen dark:text-indigo-300" />
                <span className="font-semibold text-zen-ink dark:text-white text-sm"><Trans>Importar preguntas</Trans></span>
                <span className="text-xs text-zen-ink/40 dark:text-white/40 font-normal">JSON · Excel · PDF</span>
              </div>
              <span className="text-zen-ink/40 dark:text-white/40 text-xs">{showImport ? '▲' : '▼'}</span>
            </button>

            {showImport && (
              <div className="border-t border-glass-light-border dark:border-glass-dark-border">
                {/* Tabs */}
                <div className="flex border-b border-glass-light-border dark:border-glass-dark-border">
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
                          ? 'border-zen text-zen bg-zen/10 dark:text-indigo-300'
                          : 'border-transparent text-zen-ink/50 dark:text-white/50 hover:text-zen-ink dark:hover:text-white'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

                {/* ── JSON tab ── */}
                {importTab === 'json' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-zen-ink/50 dark:text-white/50">
                      <Trans>Pega un array JSON. Tipos soportados:</Trans> <strong>multiple</strong>, <strong>ordering</strong>, <strong>matching</strong>.
                    </p>
                    <details className="group">
                      <summary className="text-xs font-semibold text-zen dark:text-indigo-300 cursor-pointer list-none flex items-center gap-1">
                        <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> <Trans>Ver formato de ejemplo</Trans>
                      </summary>
                      <pre className="mt-2 text-xs text-zen-ink/60 dark:text-white/50 bg-glass-light-1 dark:bg-glass-dark-1 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-glass-light-border dark:border-glass-dark-border">{JSON_EXAMPLE}</pre>
                    </details>
                    <textarea
                      value={jsonText}
                      onChange={(e) => { setJsonText(e.target.value); setJsonError(null); setJsonSuccess(null) }}
                      rows={7}
                      placeholder={t`Pega aquí el JSON...`}
                      className={`${INPUT_CLS} text-xs font-mono resize-y`}
                    />
                    {jsonError && <p className="text-zen-danger text-xs">{jsonError}</p>}
                    {jsonSuccess && <p className="text-emerald-600 dark:text-zen-success text-xs">{jsonSuccess}</p>}
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { setJsonText(JSON_EXAMPLE); setJsonError(null); setJsonSuccess(null) }}
                        className="text-xs text-zen-ink/40 dark:text-white/40 hover:text-zen dark:hover:text-indigo-300 underline">
                        <Trans>Cargar ejemplo</Trans>
                      </button>
                      <GlassButton type="button" onClick={handleJsonImport} disabled={!jsonText.trim()} className="ml-auto px-4 py-1.5 text-xs">
                        <Trans>Importar</Trans>
                      </GlassButton>
                    </div>
                  </div>
                )}

                {/* ── Excel tab ── */}
                {importTab === 'xlsx' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-zen-ink/50 dark:text-white/50">
                      <Trans>Sube un archivo</Trans> <strong>.xlsx</strong>. <Trans>La primera fila debe ser el encabezado con estas columnas:</Trans>
                    </p>
                    <details className="group">
                      <summary className="text-xs font-semibold text-zen dark:text-indigo-300 cursor-pointer list-none flex items-center gap-1">
                        <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> <Trans>Ver columnas requeridas</Trans>
                      </summary>
                      <div className="mt-2 text-xs bg-glass-light-1 dark:bg-glass-dark-1 border border-glass-light-border dark:border-glass-dark-border rounded-lg p-3 space-y-2">
                        <p className="font-semibold text-zen-ink/60 dark:text-white/60">Para preguntas de opción múltiple (<code>type=multiple</code>):</p>
                        <code className="block text-zen-ink/50 dark:text-white/50 font-mono">type | question | optA | optB | optC | optD | answer | explanation</code>
                        <p className="text-zen-ink/50 dark:text-white/50">• <strong>answer</strong>: letra(s) correcta(s), ej: <code>B</code> o <code>A,C</code> para múltiple</p>
                        <p className="font-semibold text-zen-ink/60 dark:text-white/60 mt-2">Para ordenamiento (<code>type=ordering</code>):</p>
                        <code className="block text-zen-ink/50 dark:text-white/50 font-mono">type | question | item1 | item2 | item3 | item4 | explanation</code>
                        <p className="text-zen-ink/50 dark:text-white/50">• Los ítems se listan en el orden correcto</p>
                      </div>
                    </details>
                    <input ref={xlsxRef} type="file" accept=".xlsx" className="hidden" onChange={handleXlsxImport} />
                    {xlsxStatus?.type === 'error' && <p className="text-zen-danger text-xs">{xlsxStatus.msg}</p>}
                    {xlsxStatus?.type === 'success' && (
                      <p className="text-emerald-600 dark:text-zen-success text-xs">
                        ✓ {xlsxStatus.count} pregunta{xlsxStatus.count !== 1 ? 's' : ''} importada{xlsxStatus.count !== 1 ? 's' : ''}.
                        {xlsxStatus.msg && ` ${xlsxStatus.msg}`}
                      </p>
                    )}
                    <GlassButton type="button" onClick={() => xlsxRef.current?.click()} className="px-4 py-2 text-xs">
                      <FileSpreadsheet size={13} /> <Trans>Seleccionar archivo .xlsx</Trans>
                    </GlassButton>
                  </div>
                )}

                {/* ── PDF tab ── */}
                {importTab === 'pdf' && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-zen-ink/50 dark:text-white/50">
                      Sube un PDF con preguntas numeradas. Se extraen automáticamente preguntas con opciones <code>A/B/C/D</code> y respuesta correcta (letra al final o <code>Answer: B</code> / <code>Respuesta: A</code>). También reconoce tarjetas donde la letra minúscula (<code>a. Texto</code>) indica directamente la respuesta correcta; en ese caso deberás completar los distractores manualmente.
                    </p>
                      <p className="text-amber-600 dark:text-zen-warning text-xs">
                        ⚠ <Trans>PDFs escaneados (imágenes) no soportados — el texto debe ser copiable desde el PDF.</Trans>
                      </p>
                    <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handlePdfImport} />
                    {pdfStatus?.type === 'error' && <p className="text-zen-danger text-xs">{pdfStatus.msg}</p>}
                    {pdfStatus?.type === 'success' && (
                      <p className="text-emerald-600 dark:text-zen-success text-xs">
                        ✓ {pdfStatus.count} pregunta{pdfStatus.count !== 1 ? 's' : ''} detectada{pdfStatus.count !== 1 ? 's' : ''} e importada{pdfStatus.count !== 1 ? 's' : ''}.
                      </p>
                    )}
                    {pdfStatus?.type === 'partial' && <p className="text-amber-600 dark:text-zen-warning text-xs">{pdfStatus.msg}</p>}
                    <GlassButton type="button" onClick={() => pdfRef.current?.click()} disabled={pdfLoading} className="px-4 py-2 text-xs">
                      <FileText size={13} /> {pdfLoading ? t`Procesando PDF…` : t`Seleccionar archivo PDF`}
                    </GlassButton>
                    {pdfRawText && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-zen-ink/60 dark:text-white/60"><Trans>Texto extraído del PDF (cópialo al tab JSON si lo necesitas):</Trans></p>
                        <textarea readOnly value={pdfRawText} rows={8}
                          className={`${INPUT_CLS} text-xs font-mono resize-y`} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
          ) : (
          <GlassCard className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zen/15 dark:bg-zen/25 flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={15} className="text-zen dark:text-indigo-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-zen-ink dark:text-white"><Trans>Importación masiva — plan Pro</Trans></p>
                <p className="text-xs text-zen-ink/60 dark:text-white/60 mt-1 leading-relaxed">
                  <Trans>En el plan Free puedes añadir preguntas una a una. Actualiza a Pro para importar desde JSON, Excel o PDF e importar cientos de preguntas en segundos.</Trans>
                </p>
                <GlassButton to="/pricing" className="mt-3 px-3 py-1.5 text-xs">
                  <Trans>Ver plan Pro →</Trans>
                </GlassButton>
              </div>
            </div>
          </GlassCard>
          )}

          {/* Preguntas */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zen-ink dark:text-white">
                <Trans>Preguntas</Trans> <span className="text-zen-ink/40 dark:text-white/40 font-normal">({questions.length}{!isPro ? `/${maxQuestions}` : ''})</span>
              </h2>
              <GlassButton
                type="button"
                onClick={() => { setEditIndex(null); setShowForm(true) }}
                disabled={questions.length >= maxQuestions}
                className="px-3 py-1.5 text-sm"
              >
                <Plus size={14} /> <Trans>Nueva pregunta</Trans>
              </GlassButton>
            </div>

            {errors.questions && <p className="text-zen-danger text-xs">{errors.questions}</p>}

            {!isPro && questions.length >= maxQuestions && (
              <p className="text-xs text-zen-ink/60 dark:text-white/60">
                <Trans>Alcanzaste el límite de {maxQuestions} preguntas del plan Free.</Trans>{' '}
                <Link to="/pricing" className="text-zen dark:text-indigo-300 font-semibold hover:underline"><Trans>Actualiza a Pro para preguntas ilimitadas →</Trans></Link>
              </p>
            )}

            {questions.length === 0 ? (
              <GlassCard className="border-dashed py-12 text-center">
                <p className="text-zen-ink/50 dark:text-white/50 text-sm"><Trans>Aún no hay preguntas.</Trans></p>
                <p className="text-zen-ink/40 dark:text-white/40 text-xs mt-1">{isPro ? <Trans>Usa "Nueva pregunta" o importa desde JSON, Excel o PDF.</Trans> : <Trans>Usa el botón "Nueva pregunta" para añadir preguntas.</Trans>}</p>
              </GlassCard>
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

          {formError && <p className="text-sm text-zen-danger">{formError}</p>}

          <GlassButton type="submit" disabled={saving} className="w-full py-3 font-bold">
            {saving ? t`Guardando…` : t`Publicar set`}
          </GlassButton>
        </form>
      </div>

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
    </AppShell>
  )
}
