// ─── PDF → Markdown reconstructor ────────────────────────────────────────────
// Turns a PDF into a canonical "question Markdown" using only the layout
// metadata that pdfjs already provides (x/y position, font size, font name,
// EOL flags) — no AI, no external services.
//
// Canonical output grammar (parsed by markdownQuestions.js):
//   # 1. Question text
//   - A) Option one
//   - B) Option two
//   > Respuesta: B
//   > Explicación: optional text
//
// Pure helpers (groupItemsIntoLines, detectGutter, linesToCanonicalMarkdown)
// are exported for unit testing; only pdfToMarkdown() touches pdfjs.

const BOLD_FONT_RE = /bold|black|semibold|demi|heavy/i

// ─── Line reconstruction ─────────────────────────────────────────────────────
// pdfjs returns text "runs" (items). Items on the same visual line share the
// same y (± tolerance). We group them, sort by x, and join with a space only
// when there is a visible horizontal gap.

export function groupItemsIntoLines(items, { yTolerance = 2 } = {}) {
  const sorted = items
    .filter((i) => i.str && i.str.trim())
    .sort((a, b) => b.y - a.y || a.x - b.x)

  const rows = []
  for (const item of sorted) {
    const last = rows[rows.length - 1]
    if (last && Math.abs(last.y - item.y) <= yTolerance) {
      last.items.push(item)
    } else {
      rows.push({ y: item.y, items: [item] })
    }
  }

  return rows
    .map(({ y, items: rowItems }) => {
      const byX = [...rowItems].sort((a, b) => a.x - b.x)
      let text = ''
      let prevEnd = null
      let sizeSum = 0
      let bold = false
      let right = 0
      for (const it of byX) {
        if (prevEnd !== null) {
          const gap = it.x - prevEnd
          if (gap > it.size * 0.3 && !text.endsWith(' ')) text += ' '
        }
        text += it.str
        const end = it.x + (it.width ?? it.str.length * it.size * 0.5)
        prevEnd = end
        right = Math.max(right, end)
        sizeSum += it.size
        if (BOLD_FONT_RE.test(it.fontName ?? '')) bold = true
      }
      return {
        text: text.trim(),
        x: byX[0].x,
        y,
        right,
        size: sizeSum / byX.length,
        bold,
      }
    })
    .filter((l) => l.text)
}

// ─── Column detection ────────────────────────────────────────────────────────
// Finds a vertical "gutter" band in the middle of the page that almost no
// text spans. Returns { gutterStart, gutterEnd } or null for single-column.

export function detectGutter(lines) {
  if (lines.length < 8) return null
  const pageRight = Math.max(...lines.map((l) => l.right))
  const minX = pageRight * 0.28
  const maxX = pageRight * 0.72
  const step = 5

  // Coverage per x-step: how many lines' horizontal span covers this x.
  const steps = []
  for (let gx = minX; gx <= maxX; gx += step) {
    const covered = lines.filter((l) => l.x < gx - 2 && l.right > gx + 2).length
    steps.push({ gx, covered })
  }

  // Widest contiguous run with ~zero coverage.
  let best = null
  let run = null
  for (const s of steps) {
    if (s.covered <= Math.max(1, lines.length * 0.03)) {
      if (!run) run = { start: s.gx, end: s.gx + step }
      else run.end = s.gx + step
    } else {
      if (run && (!best || run.end - run.start > best.end - best.start)) best = run
      run = null
    }
  }
  if (run && (!best || run.end - run.start > best.end - best.start)) best = run
  if (!best || best.end - best.start < 18) return null

  // Require enough lines starting in the right column.
  const starters = lines.filter((l) => l.x >= best.start).length
  if (starters < Math.max(3, lines.length * 0.12)) return null

  return { gutterStart: best.start, gutterEnd: best.end }
}

// Orders lines for reading: single column top→bottom, or left column fully
// then right column (typical two-column exam layout).
export function orderLinesForReading(lines) {
  const gutter = detectGutter(lines)
  if (!gutter) return lines
  const left = lines.filter((l) => l.x < gutter.gutterStart)
  const right = lines.filter((l) => l.x >= gutter.gutterStart)
  return [...left, ...right]
}

// ─── Canonical Markdown emission ─────────────────────────────────────────────

export function bodyFontSize(lines) {
  const counts = new Map()
  for (const l of lines) {
    const key = Math.round(l.size * 2) / 2
    counts.set(key, (counts.get(key) ?? 0) + l.text.length)
  }
  let best = 10
  let bestCount = -1
  for (const [size, count] of counts) {
    if (count > bestCount) { best = size; bestCount = count }
  }
  return best
}

// Matches "A) text", "A. text", "A] text" and the dash-delimited variant used
// by exam-dump style PDFs ("A- text", with no space before the dash).
const OPTION_LINE_RE = /^[([{]?\s*([A-Ha-h])(?:[.)\]]\s+|-\s*)(.+)$/
// Header-only section labels ("Options:", "Answer:", "Explanation:") used by
// exam-dump PDFs that put the value on the following line(s) instead of
// inline. Matching these lets us gate option detection to the right section
// (so explanation text like "A . API Keys:" isn't mistaken for an option)
// and capture the answer value from the line that follows.
const OPTIONS_HEADER_RE = /^options?\s*[:：]?\s*$/i
const ANSWER_HEADER_RE = /^(?:answer|ans|respuesta|correct\s*answer|key)\s*[:：]?\s*$/i
const EXPLANATION_HEADER_RE = /^(?:explicaci[oó]n|explanation)\s*[:：]?\s*$/i

export function linesToCanonicalMarkdown(lines) {
  const out = []
  // Tracks the current question block for bold-answer inference.
  let block = null

  const closeBlock = () => {
    if (block && !block.hasAnswer) {
      const boldOpts = block.options.filter((o) => o.bold)
      // Heuristic: bold options mark the answer(s) — single or multi-select
      // ("Choose two"). If every option is bold it's noise (font-wide
      // emphasis), not an answer marker, so skip it.
      if (block.options.length >= 2 && boldOpts.length >= 1 && boldOpts.length < block.options.length) {
        out.push(`> Respuesta: ${boldOpts.map((o) => o.key).join(', ')}`)
      }
    }
    block = null
  }

  for (const line of lines) {
    const t = line.text
    let m

    // Metadata noise emitted by some exam-dump PDFs — not part of the question.
    if (/^Question\s*Type\s*[:：]/i.test(t)) continue

    if ((m = t.match(/^(?:Q(?:uestion)?\s*)?(\d{1,4})[.)]\s*(.+)$/i))) {
      closeBlock()
      out.push('', `# ${m[1]}. ${m[2]}`)
      block = { options: [], hasAnswer: false, section: 'question' }
    } else if ((m = t.match(/^Q(?:uestion)?\s*#?\s*(\d{1,4})\b\s*(?:\(.*\))?\s*[:.]?\s*$/i))) {
      // Header-only line ("Question #16 (1 Point)") — the question text
      // follows on the next line(s), so the block opens with no text yet.
      closeBlock()
      out.push('', `# ${m[1]}.`)
      block = { options: [], hasAnswer: false, section: 'question' }
    } else if (OPTIONS_HEADER_RE.test(t)) {
      if (block) block.section = 'options'
    } else if (
      block?.section !== 'answer' && block?.section !== 'explanation' &&
      (m = t.match(OPTION_LINE_RE))
    ) {
      const key = m[1].toUpperCase()
      out.push(`- ${key}) ${line.bold ? `**${m[2]}**` : m[2]}`)
      block?.options.push({ key, bold: line.bold })
      if (block) block.section = 'options'
    } else if ((m = t.match(/^(answer|ans|respuesta|correct\s*answer|key)\s*[:：]\s*(.+)$/i))) {
      out.push(`> Respuesta: ${m[2].trim()}`)
      if (block) { block.hasAnswer = true; block.section = 'explanation' }
    } else if (ANSWER_HEADER_RE.test(t)) {
      if (block) block.section = 'answer'
    } else if ((m = t.match(/^(explicaci[oó]n|explanation)\s*[:：]\s*(.+)$/i))) {
      out.push(`> Explicación: ${m[2].trim()}`)
      if (block) block.section = 'explanation'
    } else if (EXPLANATION_HEADER_RE.test(t)) {
      if (block) block.section = 'explanation'
    } else if (block?.section === 'answer') {
      // Value line right after a header-only "Answer:" — e.g. "C, E, F".
      out.push(`> Respuesta: ${t.trim()}`)
      block.hasAnswer = true
      block.section = 'explanation'
    } else {
      out.push(line.bold && t.length < 90 ? `**${t}**` : t)
    }
  }
  closeBlock()
  return out.join('\n').replace(/^\n+/, '')
}

// ─── Public API ──────────────────────────────────────────────────────────────

// Returns { markdown, pageCount, emptyPages }.
// emptyPages > 0 usually means a scanned PDF (image-only pages).
export async function pdfToMarkdown(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const allLines = []
  let emptyPages = 0

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const content = await page.getTextContent()
    // content.items[].fontName is an internal resource id (e.g. "g_d0_f2"), not
    // the real PostScript font name — subsetted PDFs need the operator list
    // loaded before commonObjs exposes the real name (e.g. "BCDFEE+Calibri-Bold"),
    // which is what BOLD_FONT_RE actually needs to detect bold-marked answers.
    await page.getOperatorList()
    const fontNameCache = new Map()
    const resolveFontName = (id) => {
      if (fontNameCache.has(id)) return fontNameCache.get(id)
      let real = id
      try {
        const obj = page.commonObjs.get(id)
        if (obj?.name) real = obj.name
      } catch { /* keep raw id */ }
      fontNameCache.set(id, real)
      return real
    }
    const items = content.items
      .filter((i) => typeof i.str === 'string')
      .map((i) => ({
        str: i.str,
        x: i.transform[4],
        y: i.transform[5],
        size: Math.hypot(i.transform[0], i.transform[1]) || 10,
        width: i.width,
        fontName: resolveFontName(i.fontName),
      }))
    if (items.length === 0) { emptyPages++; continue }
    const lines = groupItemsIntoLines(items)
    allLines.push(...orderLinesForReading(lines))
  }

  // Repeated running header/footer ("Sample PDF — Page 3") sit in a much
  // smaller font than the body text — strip them so they don't get glued
  // onto the surrounding question/explanation as noise.
  const bodySize = bodyFontSize(allLines)
  const contentLines = allLines.filter(
    (l) => !(l.size <= bodySize * 0.85 && /page\s*\d+\s*$/i.test(l.text)),
  )

  return {
    markdown: linesToCanonicalMarkdown(contentLines),
    pageCount: pdf.numPages,
    emptyPages,
  }
}
