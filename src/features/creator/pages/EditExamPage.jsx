import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Trans, useLingui } from '@lingui/react/macro'
import { Plus, Trash2, ArrowLeft, Clock, Target, Pencil, FileJson, FileText, Lock, Loader2 } from 'lucide-react'
import {
  collection, doc, getDoc, getDocs, updateDoc, addDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { AppShell } from '../../../components/layout/AppShell'
import { GlassCard } from '../../../components/glass/GlassCard'
import { GlassButton } from '../../../components/glass/GlassButton'
import { GlassInput } from '../../../components/glass/GlassInput'
import { QuestionForm } from '../../admin/components/QuestionForm'
import { PdfImportPanel } from '../components/PdfImportPanel'
import { DOMAINS } from '../../../core/constants/domains'

const INPUT_CLS = 'w-full border border-glass-light-border dark:border-glass-dark-border rounded-zen px-3 py-2 text-sm text-zen-ink dark:text-white bg-glass-light-2 dark:bg-glass-dark-2 backdrop-blur-md focus:outline-none focus:border-zen focus:ring-2 focus:ring-zen/40'
const LABEL_CLS = 'block text-xs font-semibold text-zen-ink/60 dark:text-white/60 mb-1'
const FREE_QUESTION_LIMIT = 20
const PRO_QUESTION_LIMIT = 500

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

export function EditExamPage() {
  const { t } = useLingui()
  const TYPE_LABELS = buildTypeLabels(t)
  const { id } = useParams()
  const { user, isPro } = useAuthStore()
  const navigate = useNavigate()
  const maxQuestions = isPro ? PRO_QUESTION_LIMIT : FREE_QUESTION_LIMIT

  // ── loading ───────────────────────────────────────────────────────────────
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

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
  const [importTab, setImportTab] = useState('json')
  const [showImport, setShowImport] = useState(false)
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState(null)
  const [jsonSuccess, setJsonSuccess] = useState(null)

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
        setDomain(data.domain ?? DOMAINS[0]?.id ?? '')
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
    } else if (questions.length < maxQuestions) {
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

  function mergePdfQuestions(imported) {
    setQuestions((prev) => [...prev, ...imported])
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

      // Update the set metadata
      await updateDoc(doc(db, 'examSets', id), {
        title:         title.trim(),
        description:   description.trim(),
        domain,
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
          <Loader2 size={32} className="animate-spin text-zen" />
        </div>
      </AppShell>
    )
  }

  if (loadError) {
    return (
      <AppShell>
        <div className="flex items-center justify-center p-4 py-20">
          <div className="text-center space-y-4">
            <p className="text-zen-ink/60 dark:text-white/60">{loadError}</p>
            <GlassButton to="/my-sets">
              <Trans>Volver a mis sets</Trans>
            </GlassButton>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zen-ink dark:text-white"><Trans>Editar set</Trans></h1>
          <Link to="/my-sets" className="text-sm text-zen-ink/50 dark:text-white/50 hover:text-zen-ink dark:hover:text-white flex items-center gap-1">
            <ArrowLeft size={14} /> <Trans>Mis sets</Trans>
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
              <label className={LABEL_CLS}><Trans>Categorías / Etiquetas (opcional)</Trans></label>
              <GlassInput
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t`Ej: Procesos, Interfaces, Registros, Seguridad`}
              />
              <p className="text-xs text-zen-ink/40 dark:text-white/40 mt-1"><Trans>Separa las categorías con comas para clasificar el contenido del examen.</Trans></p>
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
                <span className="font-semibold text-zen-ink dark:text-white text-sm"><Trans>Importar más preguntas</Trans></span>
                <span className="text-xs text-zen-ink/40 dark:text-white/40 font-normal">JSON · PDF</span>
              </div>
              <span className="text-zen-ink/40 dark:text-white/40 text-xs">{showImport ? '▲' : '▼'}</span>
            </button>

            {showImport && (
              <div className="border-t border-glass-light-border dark:border-glass-dark-border">
                <div className="flex border-b border-glass-light-border dark:border-glass-dark-border">
                  {[
                    { id: 'json',  icon: FileJson, label: 'JSON' },
                    { id: 'pdf',   icon: FileText, label: 'PDF' },
                  ].map(({ id: tabId, icon: Icon, label }) => (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => setImportTab(tabId)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                        importTab === tabId
                          ? 'border-zen text-zen bg-zen/10 dark:text-indigo-300'
                          : 'border-transparent text-zen-ink/50 dark:text-white/50 hover:text-zen-ink dark:hover:text-white'
                      }`}
                    >
                      <Icon size={13} /> {label}
                    </button>
                  ))}
                </div>

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

                {importTab === 'pdf' && <PdfImportPanel onImport={mergePdfQuestions} />}
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
                  <Trans>Actualiza a Pro para importar desde JSON o PDF e importar cientos de preguntas en segundos.</Trans>
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
                <p className="text-zen-ink/40 dark:text-white/40 text-xs mt-1">{isPro ? <Trans>Usa "Nueva pregunta" o importa desde JSON o PDF.</Trans> : <Trans>Usa el botón "Nueva pregunta" para añadir preguntas.</Trans>}</p>
              </GlassCard>
            ) : (
              <div className="space-y-2 max-h-[32rem] overflow-y-auto pr-1 -mr-1">
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
            {saving ? t`Guardando…` : t`Guardar cambios`}
          </GlassButton>
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
