// ─── PDF worker config (Vite 5 compatible) ───────────────────────────────────
// Must be set before any getDocument() call. Using import.meta.url lets Vite
// bundle the worker as a static asset in both dev and production builds.
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// ─── XLSX parser ─────────────────────────────────────────────────────────────
// Expected column headers (case-insensitive):
//   question | optA | optB | optC | optD [optE..optH] | answer | explanation
//
// For ordering type:
//   type="ordering" | question | item1 | item2 | item3 [item4..item8] | explanation
//
// For matching type (not supported in flat format — too complex):
//   Skip rows with type="matching"

export async function parseXLSX(file) {
  const { default: readXlsxFile } = await import('read-excel-file/browser')
  const rows = await readXlsxFile(file)
  if (!rows || rows.length < 2) {
    return { questions: [], error: 'El archivo está vacío o no tiene filas de datos.' }
  }

  const headers = rows[0].map((h) => String(h ?? '').trim().toLowerCase())
  const dataRows = rows.slice(1)

  const questions = []
  const invalid = []

  dataRows.forEach((row, i) => {
    const get = (key) => {
      const idx = headers.indexOf(key)
      return idx >= 0 ? String(row[idx] ?? '').trim() : ''
    }

    const questionText = get('question')
    if (!questionText) { invalid.push(i + 2); return }

    const type = get('type').toLowerCase() || 'multiple'

    if (type === 'ordering') {
      // Collect item1..item8 columns
      const items = ['item1','item2','item3','item4','item5','item6','item7','item8']
        .map((k) => get(k))
        .filter(Boolean)
      if (items.length < 2) { invalid.push(i + 2); return }
      questions.push({
        type: 'ordering',
        question: questionText,
        items,
        correctOrder: items,
        explanation: get('explanation'),
      })
      return
    }

    // multiple (default)
    const optKeys = ['opta','optb','optc','optd','opte','optf','optg','opth']
    const KEYS = ['A','B','C','D','E','F','G','H']
    const options = {}
    optKeys.forEach((k, idx) => {
      const v = get(k)
      if (v) options[KEYS[idx]] = v
    })

    if (Object.keys(options).length < 2) { invalid.push(i + 2); return }

    const rawAnswer = get('answer')
    if (!rawAnswer) { invalid.push(i + 2); return }
    const answer = rawAnswer.toUpperCase().split(/[,;]/).map((a) => a.trim()).filter((a) => a in options)
    if (answer.length === 0) { invalid.push(i + 2); return }

    questions.push({
      type: 'multiple',
      question: questionText,
      options,
      answer,
      explanation: get('explanation'),
    })
  })

  const error = invalid.length
    ? `Filas ignoradas (formato inválido): ${invalid.map((n) => `fila ${n}`).join(', ')}`
    : null

  return { questions, error }
}

// ─── PDF parser ───────────────────────────────────────────────────────────────
// Extracts all text from a PDF file, then tries to parse multiple-choice
// questions using common exam formats.

export async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n)
    const content = await page.getTextContent()
    // Join items; add space between text runs; add newline at end of each page
    const pageText = content.items.map((item) => item.str).join(' ')
    pages.push(pageText)
  }
  return pages.join('\n\n')
}

// ─── Text → question parser ───────────────────────────────────────────────────
// Robust parser for numbered exam PDFs. Works on inline text (no newlines
// required) because pdfjs typically extracts page content as a single line.
//
// Detects two common formats automatically:
//
//  Format A — Full MCQ (uppercase options + standalone answer letters):
//    1. Question text?  A. Option A  B. Option B  C. Option C  D. Option D  B, C
//    → options = {A,B,C,D}, answer = [B,C]
//
//  Format B — Explicit answer prefix:
//    1. Question text?  A. Option A  B. Option B  Answer: B
//    → options = {A,B}, answer = [B]
//
//  Format C — Answer-only cards (lowercase letters are the correct answers):
//    1. Question text?  a. Correct answer
//    2. Question text?  b. First correct  c. Second correct
//    → options = {A: "Correct answer"}, answer = [A]
//      (no distractors — user must add them manually in the editor)
//
// Returns { questions, rawText }. rawText is always available for fallback.

export function parseTextToQuestions(rawText) {
  const questions = []
  // Collapse whitespace (newlines, tabs, multi-spaces) into single spaces.
  // PDFs may extract with or without newlines depending on layout.
  const text = rawText.replace(/\s+/g, ' ').trim()
  if (!text) return { questions, rawText }

  // Split at question number boundaries: "1.", "2)", "Q3." — must be preceded
  // by whitespace, start of string, or sentence-end punctuation.
  // The captured group is the number; we use matchAll to get positions.
  const blockRegex = /(?:^|[\s.?!])(?:Q(?:uestion)?\s*)?(\d+)[.)]\s+/gi
  const matches = [...text.matchAll(blockRegex)]
  if (matches.length === 0) return { questions, rawText }

  // Build blocks: text between consecutive question-number matches.
  const blocks = []
  for (let idx = 0; idx < matches.length; idx++) {
    const m = matches[idx]
    const num = parseInt(m[1], 10)
    // Sanity check: question numbers should be small and mostly sequential.
    // Skip matches with numbers > 999 (likely a figure caption, page number, etc.)
    if (num > 999) continue
    const start = m.index + m[0].length
    const end = matches[idx + 1]?.index ?? text.length
    const body = text.slice(start, end).trim()
    if (body.length > 10) blocks.push(body)
  }

  for (const block of blocks) {
    // Strip a leftover inner question-number prefix (some PDFs double-number,
    // e.g. outer "1." plus inner "1.)" inside the body).
    const cleaned = block.replace(/^\d+[.)]\s+/, '')

    // Tokenize the block by locating every letter-option marker.
    // Match " A. ", " B) ", "(C) ", "[D] ", etc. — preceded by whitespace or
    // start of block, followed by a space. Lowercase is also captured so we
    // can decide later whether it is a full MCQ or an answer-only card.
    const optionRegex = /(?:^|\s)[([]?\s*([A-Fa-f])\s*[.)\]]\s+/g
    const optMatches = [...cleaned.matchAll(optionRegex)]

    // Extract explicit "Answer: X" prefix if present (case-insensitive).
    const answerPrefixMatch = cleaned.match(
      /(?:answer|ans|correct\s*answer|respuesta|key)\s*[:：]\s*([A-Fa-f](?:[\s,;&y]+[A-Fa-f])*)/i,
    )

    if (optMatches.length === 0) continue

    // Question text = everything before the first option marker.
    const questionText = cleaned.slice(0, optMatches[0].index).trim().replace(/\s+/g, ' ')
    if (!questionText || questionText.length < 5) continue

    // Determine case of the option markers (all uppercase, all lowercase, or mixed).
    const letters = optMatches.map((m) => m[1])
    const allLower = letters.every((l) => l === l.toLowerCase())
    const allUpper = letters.every((l) => l === l.toUpperCase())

    // Extract each option's text: from end of its marker to start of next marker
    // (or to the answer prefix / end of block).
    const answerPrefixIdx = answerPrefixMatch ? cleaned.indexOf(answerPrefixMatch[0]) : -1

    const optionMap = {}
    for (let i = 0; i < optMatches.length; i++) {
      const m = optMatches[i]
      const key = m[1].toUpperCase()
      const optStart = m.index + m[0].length
      let optEnd = optMatches[i + 1]?.index ?? cleaned.length
      if (answerPrefixIdx >= 0 && optStart < answerPrefixIdx && answerPrefixIdx < optEnd) {
        optEnd = answerPrefixIdx
      }
      const value = cleaned.slice(optStart, optEnd).trim().replace(/\s+/g, ' ')
      if (value) optionMap[key] = value
    }

    if (Object.keys(optionMap).length === 0) continue

    // Determine answer keys based on format.
    let answerKeys = []

    if (answerPrefixMatch) {
      // Format B — explicit "Answer: X" prefix
      answerKeys = answerPrefixMatch[1]
        .toUpperCase()
        .split(/[\s,;&Y]+/)
        .filter((k) => /^[A-F]$/.test(k))
    } else if (allUpper && Object.keys(optionMap).length >= 2) {
      // Format A — full MCQ: look for trailing standalone answer letters
      // after the last option text. The last option's value may end with
      // something like "… D config. B, C" — the "B, C" suffix is the answer.
      const lastKey = Object.keys(optionMap).pop()
      const lastVal = optionMap[lastKey]
      // Match trailing letters+separators at the end of the last option text.
      const trailMatch = lastVal.match(/\s+([A-F](?:[\s,;&]+[A-F])*)\s*\.?\s*$/)
      if (trailMatch) {
        answerKeys = trailMatch[1]
          .split(/[\s,;&]+/)
          .filter((k) => /^[A-F]$/.test(k))
        // Strip the answer tail from the option text
        optionMap[lastKey] = lastVal.slice(0, trailMatch.index).trim()
      }
    }

    if (allLower && answerKeys.length === 0) {
      // Format C — answer-only card (lowercase letters = correct answers)
      // Every listed option is a correct answer. There are no distractors.
      answerKeys = Object.keys(optionMap)
    }

    if (answerKeys.length === 0) continue

    const validAnswers = answerKeys.filter((k) => k in optionMap)
    if (validAnswers.length === 0) continue

    questions.push({
      type: 'multiple',
      question: questionText.replace(/\s+\?\s*$/, '?'),
      options: optionMap,
      answer: validAnswers.sort(),
      explanation: '',
    })
  }

  return { questions, rawText }
}
