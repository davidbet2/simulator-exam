// ─── Markdown → questions parser ─────────────────────────────────────────────
// Line-by-line state machine for the canonical "question Markdown" grammar
// (emitted by pdfToMarkdown.js or written/pasted by the user):
//
//   # 1. Question text
//   - A) Option one
//   - B) Option two
//   > Respuesta: B
//   > Explicación: optional text
//
// Tolerant by design — it also accepts:
//   1. Question without the leading '#'
//   A) Option without the leading '-'
//   **Respuesta:** B   /   Answer: B   /   Correct answer: B, C
//   B, C               (bare trailing answer letters right after options)
//   Wrapped lines: continuation text joins the current question/option.
//
// Returns { questions, invalid, missingAnswer } — questions use the same shape
// as the legacy parser: { type:'multiple', question, options, answer, explanation }.
// missingAnswer lists otherwise-valid blocks (question + options present) for
// which no answer could be resolved, as { number, question, optionKeys }, so
// the caller can point the user at exactly which questions still need a
// manual answer instead of silently dropping them into the invalid count.

const Q_START_RE = /^(?:#{1,6}\s*)?(?:Q(?:uestion)?\s*)?(\d{1,4})[.)]\s*(.*)$/i
const OPTION_RE = /^(?:[-*•]\s*)?[([{]?\s*([A-Ha-h])\s*[.)\]]\s+(.+)$/
const ANSWER_RE = /^(?:>\s*)?(?:\*\*)?(?:answer|ans|respuesta|correct\s*answer|key)\s*(?:\*\*)?\s*[:：]\s*(?:\*\*)?(.+?)(?:\*\*)?$/i
const EXPLANATION_RE = /^(?:>\s*)?(?:\*\*)?(?:explicaci[oó]n|explanation|por\s*qu[eé]|why)\s*(?:\*\*)?\s*[:：]\s*(?:\*\*)?(.+?)(?:\*\*)?$/i
const TRAILING_ANSWER_RE = /^([A-Ha-h](?:[\s,;&]+[A-Ha-h]){0,3})\.?$/
const PAGE_NOISE_RE = /^(?:page|p[aá]g(?:ina)?\.?)\s*\d+(?:\s*(?:of|de)\s*\d+)?$|^\d{1,4}[.)]?$/i
const FULL_BOLD_RE = /^\*\*.+\*\*$/
// Detached answer-key line, e.g. "1. C – rationale text", "2. A, B - rationale"
// or "3. C: rationale" (no options collected in that block) — common in
// official exam PDFs that put a separate answer-key section after all the
// questions, using a dash or a colon before the rationale.
const ANSWER_KEY_RE = /^([A-Ha-h](?:\s*[,;&]\s*[A-Ha-h])*)\s*[:：–—-]\s*(.+)$/

function stripMd(text) {
  return text.replace(/\*\*/g, '').replace(/__/g, '').trim()
}

function extractLetters(text) {
  const seen = []
  for (const m of text.matchAll(/[A-Ha-h]/g)) {
    const k = m[0].toUpperCase()
    if (!seen.includes(k)) seen.push(k)
  }
  return seen
}

export function parseMarkdownToQuestions(markdown) {
  const lines = String(markdown ?? '').split('\n')
  const blocks = []
  let cur = null
  let lastKey = null

  const flush = () => {
    if (cur) blocks.push(cur)
    cur = null
    lastKey = null
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || PAGE_NOISE_RE.test(line)) continue

    let m
    if ((m = line.match(Q_START_RE))) {
      // A numbered line inside a question's own preamble (no options collected
      // yet) whose number is LOWER than the current question — e.g. a nested
      // enumerated list ("1. task A / 2. task B…") inside the question text —
      // is not a new question. Append it as body text instead of a new block,
      // bypassing the generic "# Title" header check below (it would otherwise
      // discard this line since pdfToMarkdown.js also emits it as "# N.").
      const isNestedList = cur && Object.keys(cur.options).length === 0 && Number(m[1]) < Number(cur.number)
      if (!isNestedList) {
        flush()
        cur = { number: m[1], question: stripMd(m[2]), options: {}, answer: [], explanation: '' }
        continue
      }
      cur.question += (cur.question ? ' ' : '') + stripMd(line.replace(/^#{1,6}\s*/, ''))
      continue
    }
    // Section headers (`# Title`) that are not numbered questions.
    if (/^#{1,6}\s/.test(line)) continue
    if (!cur) continue

    if ((m = line.match(OPTION_RE))) {
      const key = m[1].toUpperCase()
      cur.options[key] = stripMd(m[2])
      lastKey = key
      continue
    }
    if ((m = line.match(ANSWER_RE))) {
      cur.answer = extractLetters(m[1])
      lastKey = null
      continue
    }
    if ((m = line.match(EXPLANATION_RE))) {
      cur.explanation = stripMd(m[1])
      lastKey = null
      continue
    }
    // Bare trailing answer letters right after the options ("B, C").
    if (lastKey && (m = line.match(TRAILING_ANSWER_RE))) {
      const letters = extractLetters(m[1])
      if (letters.every((k) => k in cur.options)) {
        cur.answer = letters
        lastKey = null
        continue
      }
    }
    // Other quote lines extend the explanation.
    if (line.startsWith('>')) {
      cur.explanation = (cur.explanation + ' ' + stripMd(line.replace(/^>\s*/, ''))).trim()
      lastKey = null
      continue
    }
    // Standalone fully-bold lines are section titles — skip them.
    if (FULL_BOLD_RE.test(line)) continue
    // Plain continuation line: joins the current option, question, or explanation.
    if (lastKey) {
      cur.options[lastKey] += ' ' + stripMd(line)
    } else if (Object.keys(cur.options).length === 0) {
      cur.question += ' ' + stripMd(line)
    } else {
      cur.explanation = (cur.explanation + ' ' + stripMd(line)).trim()
    }
  }
  flush()

  // Blocks with no options that read as "<letter(s)> – rationale" are a
  // detached answer-key entry (question body listed separately from its
  // answer), not a question attempt — index them by number for the merge below.
  const answerKey = new Map()
  const candidates = []
  for (const block of blocks) {
    const m = Object.keys(block.options).length === 0 && block.question.match(ANSWER_KEY_RE)
    if (m) answerKey.set(block.number, { letters: extractLetters(m[1]), rationale: m[2].trim() })
    else candidates.push(block)
  }

  const questions = []
  const missingAnswer = []
  let invalid = 0
  for (const block of candidates) {
    const question = block.question.trim()
    const options = {}
    for (const [k, v] of Object.entries(block.options)) {
      const val = v.trim()
      if (val) options[k] = val
    }
    let answer = block.answer.filter((k) => k in options).sort()
    let explanation = block.explanation.trim()
    if (answer.length === 0 && answerKey.has(block.number)) {
      const key = answerKey.get(block.number)
      answer = key.letters.filter((k) => k in options).sort()
      if (!explanation) explanation = key.rationale
    }
    const wellFormed = question.length >= 5 && Object.keys(options).length >= 1
    if (wellFormed && answer.length > 0) {
      questions.push({ type: 'multiple', question, options, answer, explanation })
    } else if (wellFormed) {
      missingAnswer.push({ number: block.number, question, optionKeys: Object.keys(options) })
    } else {
      invalid++
    }
  }

  return { questions, invalid, missingAnswer }
}

// ─── Quick-fill templates ────────────────────────────────────────────────────
// Inserts a ready-to-edit "> Respuesta: " line right after the last option of
// each question whose number is in `numbers` — so the user only has to type
// the letter(s) in the Markdown textarea instead of writing the whole line.
export function insertAnswerTemplates(markdown, numbers) {
  const wanted = new Set(numbers.map(String))
  const lines = String(markdown ?? '').split('\n')
  const out = []
  let curNumber = null

  const closeCurrent = () => {
    if (curNumber !== null && wanted.has(curNumber)) {
      while (out.length && out[out.length - 1].trim() === '') out.pop()
      out.push('> Respuesta:', '')
    }
  }

  for (const rawLine of lines) {
    const m = rawLine.trim().match(Q_START_RE)
    if (m) {
      closeCurrent()
      curNumber = m[1]
    }
    out.push(rawLine)
  }
  closeCurrent()
  while (out.length && out[out.length - 1].trim() === '') out.pop()

  return out.join('\n')
}
