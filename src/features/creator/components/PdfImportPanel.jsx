/**
 * PdfImportPanel — shared PDF import flow for Create/Edit exam pages.
 *
 * Pipeline: PDF → Markdown (layout reconstruction, no AI) → editable preview
 * → deterministic MD parser → questions. The human-in-the-loop preview lets
 * the user fix extraction mistakes before importing.
 */
import { useRef, useState, useMemo } from 'react'
import { FileText } from 'lucide-react'
import { Trans, useLingui } from '@lingui/react/macro'
import { GlassButton } from '../../../components/glass/GlassButton'
import { pdfToMarkdown } from '../utils/pdfToMarkdown'
import { parseMarkdownToQuestions, insertAnswerTemplates } from '../utils/markdownQuestions'
import { extractPDFText, parseTextToQuestions } from '../utils/importParsers'

const INPUT_CLS = 'w-full border border-glass-light-border dark:border-glass-dark-border rounded-zen px-3 py-2 text-sm text-zen-ink dark:text-white bg-glass-light-2 dark:bg-glass-dark-2 backdrop-blur-md focus:outline-none focus:border-zen focus:ring-2 focus:ring-zen/40'

const MD_EXAMPLE = `# 1. ¿Texto de la pregunta?
- A) Primera opción
- B) Segunda opción
- C) Tercera opción
> Respuesta: B
> Explicación: opcional

# 2. Otra pregunta…`

export function PdfImportPanel({ onImport }) {
  const { t } = useLingui()
  const pdfRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [status, setStatus] = useState(null) // { type: 'error'|'success'|'partial', msg?, count? }

  // Live question count while the user edits the Markdown (parse is <1ms).
  const { detected, missingAnswer } = useMemo(() => {
    if (!markdown.trim()) return { detected: [], missingAnswer: [] }
    const { questions, missingAnswer: ma } = parseMarkdownToQuestions(markdown)
    return { detected: questions, missingAnswer: ma }
  }, [markdown])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus(null)
    setMarkdown('')
    if (file.size > 10 * 1024 * 1024) {
      setStatus({ type: 'error', msg: t`El archivo supera 10 MB.` })
      e.target.value = ''
      return
    }
    if (!/\.pdf$/i.test(file.name)) {
      setStatus({ type: 'error', msg: t`Formato inválido. Solo se permite .pdf.` })
      e.target.value = ''
      return
    }
    setLoading(true)
    try {
      const { markdown: md, emptyPages, pageCount } = await pdfToMarkdown(file)
      if (!md.trim()) {
        setStatus({ type: 'error', msg: t`El PDF no contiene texto seleccionable (parece escaneado).` })
      } else {
        setMarkdown(md)
        if (emptyPages > 0) {
          setStatus({ type: 'partial', msg: t`${emptyPages} de ${pageCount} páginas parecen escaneadas y se omitieron.` })
        }
      }
    } catch (_err) {
      // Fallback: legacy flat-text extraction + parser.
      try {
        const rawText = await extractPDFText(file)
        const { questions: legacy } = parseTextToQuestions(rawText)
        if (legacy.length > 0) {
          onImport(legacy)
          setStatus({ type: 'partial', msg: t`${legacy.length} preguntas importadas con el modo de compatibilidad. Revísalas.` })
        } else {
          setStatus({ type: 'error', msg: t`Error al leer el PDF.` })
        }
      } catch {
        setStatus({ type: 'error', msg: t`Error al leer el PDF.` })
      }
    }
    setLoading(false)
    e.target.value = ''
  }

  function handleFillTemplates() {
    setMarkdown((md) => insertAnswerTemplates(md, missingAnswer.map((q) => q.number)))
  }

  function handleImport() {
    if (detected.length === 0) {
      setStatus({ type: 'error', msg: t`No se detectaron preguntas. Revisa o edita el Markdown.` })
      return
    }
    onImport(detected)
    setStatus({ type: 'success', count: detected.length })
    setMarkdown('')
  }

  return (
    <div className="p-5 space-y-3">
      <p className="text-xs text-zen-ink/50 dark:text-white/50">
        <Trans>Sube un PDF con preguntas numeradas. Lo convertimos a Markdown editable: revísalo, corrígelo si hace falta y pulsa importar.</Trans>
      </p>
      <p className="text-amber-600 dark:text-zen-warning text-xs">
        ⚠ <Trans>PDFs escaneados (imágenes) no soportados — el texto debe ser copiable desde el PDF.</Trans>
      </p>

      <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
      {status?.type === 'error' && <p className="text-zen-danger text-xs">{status.msg}</p>}
      {status?.type === 'success' && (
        <p className="text-emerald-600 dark:text-zen-success text-xs">
          ✓ {status.count} pregunta{status.count !== 1 ? 's' : ''} detectada{status.count !== 1 ? 's' : ''} e importada{status.count !== 1 ? 's' : ''}.
        </p>
      )}
      {status?.type === 'partial' && <p className="text-amber-600 dark:text-zen-warning text-xs">{status.msg}</p>}

      <GlassButton type="button" onClick={() => pdfRef.current?.click()} disabled={loading} className="px-4 py-2 text-xs">
        <FileText size={13} /> {loading ? t`Procesando PDF…` : t`Seleccionar archivo PDF`}
      </GlassButton>

      {markdown && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-xs font-semibold text-zen-ink/60 dark:text-white/60">
              <Trans>Markdown extraído del PDF (editable):</Trans>
            </p>
            <p className={`text-xs font-semibold ${detected.length > 0 ? 'text-emerald-600 dark:text-zen-success' : 'text-amber-600 dark:text-zen-warning'}`}>
              {detected.length > 0
                ? `${detected.length} pregunta${detected.length !== 1 ? 's' : ''} detectada${detected.length !== 1 ? 's' : ''}`
                : t`Ninguna pregunta detectada`}
            </p>
          </div>
          {missingAnswer.length > 0 && (
            <div className="rounded-zen border border-amber-500/30 bg-amber-500/5 p-2.5 space-y-1.5">
              <p className="text-amber-600 dark:text-zen-warning text-xs">
                ⚠ {t`${missingAnswer.length} pregunta(s) sin respuesta identificada — no se importarán hasta completarlas.`}
              </p>
              <ul className="text-xs text-zen-ink/70 dark:text-white/60 space-y-0.5">
                {missingAnswer.map((q) => (
                  <li key={q.number}>
                    <Trans>Pregunta #{q.number}: opciones {q.optionKeys.join(', ')} — falta elegir una</Trans>
                  </li>
                ))}
              </ul>
              <GlassButton type="button" onClick={handleFillTemplates} className="px-3 py-1 text-xs">
                <Trans>Agregar plantilla "&gt; Respuesta:" en cada una</Trans>
              </GlassButton>
            </div>
          )}
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={14}
            spellCheck={false}
            className={`${INPUT_CLS} text-xs font-mono resize-y`}
            aria-label={t`Markdown de preguntas`}
          />
          <details className="group">
            <summary className="text-xs font-semibold text-zen dark:text-indigo-300 cursor-pointer list-none flex items-center gap-1">
              <span className="group-open:hidden">▶</span><span className="hidden group-open:inline">▼</span> <Trans>Ver formato Markdown de preguntas</Trans>
            </summary>
            <pre className="mt-2 text-xs text-zen-ink/60 dark:text-white/50 bg-glass-light-1 dark:bg-glass-dark-1 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap border border-glass-light-border dark:border-glass-dark-border">{MD_EXAMPLE}</pre>
          </details>
          <div className="flex justify-end">
            <GlassButton type="button" onClick={handleImport} disabled={detected.length === 0} className="px-4 py-1.5 text-xs">
              <Trans>Importar</Trans> {detected.length > 0 ? `(${detected.length})` : ''}
            </GlassButton>
          </div>
        </div>
      )}
    </div>
  )
}
