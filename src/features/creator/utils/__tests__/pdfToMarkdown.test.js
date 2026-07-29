import { describe, it, expect } from 'vitest'
import {
  groupItemsIntoLines,
  detectGutter,
  orderLinesForReading,
  linesToCanonicalMarkdown,
  bodyFontSize,
} from '../pdfToMarkdown'

const item = (str, x, y, extra = {}) => ({
  str, x, y, size: 10, width: str.length * 5, fontName: 'Helvetica', ...extra,
})

describe('groupItemsIntoLines', () => {
  it('groups items on the same y into one line, sorted by x', () => {
    const items = [
      item('world', 60, 700),
      item('Hello', 10, 700),
      item('Second line', 10, 680),
    ]
    const lines = groupItemsIntoLines(items)
    expect(lines).toHaveLength(2)
    expect(lines[0].text).toBe('Hello world')
    expect(lines[1].text).toBe('Second line')
  })

  it('keeps separate y rows as separate lines', () => {
    const items = [item('1. Q?', 10, 700), item('A. one', 20, 680), item('B. two', 20, 660)]
    const lines = groupItemsIntoLines(items)
    expect(lines.map((l) => l.text)).toEqual(['1. Q?', 'A. one', 'B. two'])
  })

  it('detects bold fonts', () => {
    const lines = groupItemsIntoLines([item('Bold text', 10, 700, { fontName: 'Helvetica-Bold' })])
    expect(lines[0].bold).toBe(true)
  })

  it('does not join words without a visible gap', () => {
    const lines = groupItemsIntoLines([
      item('Hel', 10, 700, { width: 15 }),
      item('lo', 25, 700, { width: 10 }),
    ])
    expect(lines[0].text).toBe('Hello')
  })
})

describe('detectGutter / orderLinesForReading', () => {
  const colLines = []
  // 10 left-column lines (x=30, right≈250), 10 right-column lines (x=320, right≈540)
  for (let i = 0; i < 10; i++) {
    colLines.push({ text: `L${i}`, x: 30, y: 700 - i * 20, right: 250, size: 10, bold: false })
    colLines.push({ text: `R${i}`, x: 320, y: 700 - i * 20, right: 540, size: 10, bold: false })
  }

  it('detects a two-column gutter', () => {
    const gutter = detectGutter(colLines)
    expect(gutter).not.toBeNull()
    expect(gutter.gutterStart).toBeGreaterThanOrEqual(248)
    expect(gutter.gutterEnd).toBeLessThanOrEqual(330)
  })

  it('orders left column fully before right column', () => {
    const ordered = orderLinesForReading(colLines)
    expect(ordered[0].text).toBe('L0')
    expect(ordered[9].text).toBe('L9')
    expect(ordered[10].text).toBe('R0')
  })

  it('returns single-column lines untouched', () => {
    const single = colLines.filter((l) => l.x === 30)
    expect(orderLinesForReading(single)).toBe(single)
  })
})

describe('linesToCanonicalMarkdown', () => {
  it('emits the canonical question grammar', () => {
    const lines = [
      { text: '1. ¿Pregunta?', x: 10, y: 700, right: 100, size: 10, bold: false },
      { text: 'A. Uno', x: 20, y: 680, right: 80, size: 10, bold: false },
      { text: 'B. Dos', x: 20, y: 660, right: 80, size: 10, bold: false },
      { text: 'Answer: B', x: 10, y: 640, right: 80, size: 10, bold: false },
    ]
    expect(linesToCanonicalMarkdown(lines)).toBe(
      '# 1. ¿Pregunta?\n- A) Uno\n- B) Dos\n> Respuesta: B',
    )
  })

  it('infers the answer from a single bold option', () => {
    const lines = [
      { text: '1. ¿Pregunta?', x: 10, y: 700, right: 100, size: 10, bold: false },
      { text: 'A. Uno', x: 20, y: 680, right: 80, size: 10, bold: false },
      { text: 'B. Correcta', x: 20, y: 660, right: 80, size: 10, bold: true },
      { text: 'C. Tres', x: 20, y: 640, right: 80, size: 10, bold: false },
    ]
    const md = linesToCanonicalMarkdown(lines)
    expect(md).toContain('- B) **Correcta**')
    expect(md).toContain('> Respuesta: B')
  })

  it('does not infer an answer when every option is bold (font-wide noise)', () => {
    const lines = [
      { text: '1. ¿Pregunta?', x: 10, y: 700, right: 100, size: 10, bold: false },
      { text: 'A. Uno', x: 20, y: 680, right: 80, size: 10, bold: true },
      { text: 'B. Dos', x: 20, y: 660, right: 80, size: 10, bold: true },
    ]
    expect(linesToCanonicalMarkdown(lines)).not.toContain('> Respuesta:')
  })

  it('infers a multi-select answer from several (but not all) bold options', () => {
    const lines = [
      { text: '1. Elige dos', x: 10, y: 700, right: 100, size: 10, bold: false },
      { text: 'A. Uno', x: 20, y: 680, right: 80, size: 10, bold: true },
      { text: 'B. Dos', x: 20, y: 660, right: 80, size: 10, bold: false },
      { text: 'C. Tres', x: 20, y: 640, right: 80, size: 10, bold: true },
      { text: 'D. Cuatro', x: 20, y: 620, right: 80, size: 10, bold: false },
    ]
    expect(linesToCanonicalMarkdown(lines)).toContain('> Respuesta: A, C')
  })

  it('passes through non-structural lines', () => {
    const lines = [
      { text: 'Examen final 2026', x: 10, y: 700, right: 100, size: 16, bold: true },
      { text: '1. ¿Pregunta?', x: 10, y: 680, right: 100, size: 10, bold: false },
    ]
    const md = linesToCanonicalMarkdown(lines)
    expect(md).toContain('**Examen final 2026**')
    expect(md).toContain('# 1. ¿Pregunta?')
  })
})

describe('bodyFontSize', () => {
  it('returns the dominant size by text volume', () => {
    const lines = [
      { text: 'Title', size: 18 },
      { text: 'body text that is quite long', size: 10 },
      { text: 'more body text here as well', size: 10 },
    ]
    expect(bodyFontSize(lines)).toBe(10)
  })
})
