import { describe, it, expect } from 'vitest'
import { parseMarkdownToQuestions, insertAnswerTemplates } from '../markdownQuestions'

describe('parseMarkdownToQuestions', () => {
  it('parses the canonical format', () => {
    const md = `# 1. ¿Cuál es la profundidad correcta?
- A) 2 cm
- B) 5-6 cm
- C) 10 cm
> Respuesta: B
> Explicación: Según la guía.

# 2. ¿Segunda pregunta?
- A) Uno
- B) Dos
> Respuesta: A`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions).toHaveLength(2)
    expect(questions[0]).toEqual({
      type: 'multiple',
      question: '¿Cuál es la profundidad correcta?',
      options: { A: '2 cm', B: '5-6 cm', C: '10 cm' },
      answer: ['B'],
      explanation: 'Según la guía.',
    })
    expect(questions[1].answer).toEqual(['A'])
  })

  it('parses questions without leading # and options without leading -', () => {
    const md = `1. ¿Pregunta uno?
A) Opción a
B) Opción b
Respuesta: B

2) ¿Pregunta dos?
A. x
B. y
Answer: A`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions).toHaveLength(2)
    expect(questions[0].answer).toEqual(['B'])
    expect(questions[1].answer).toEqual(['A'])
  })

  it('handles multi-answer questions and bold markers', () => {
    const md = `# 3. Selecciona dos
- A) **Primera**
- B) Segunda
- C) Tercera
**Respuesta:** A, C`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions[0].answer).toEqual(['A', 'C'])
    expect(questions[0].options.A).toBe('Primera')
  })

  it('detects bare trailing answer letters after options', () => {
    const md = `# 1. ¿Pregunta?
- A) Uno
- B) Dos
- C) Tres
B, C`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions[0].answer).toEqual(['B', 'C'])
    expect(questions[0].options.C).toBe('Tres')
  })

  it('joins wrapped continuation lines', () => {
    const md = `# 1. ¿Pregunta larga que sigue
en una segunda línea?
- A) Opción que continúa
en otra línea
- B) Corta
> Respuesta: A`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions[0].question).toBe('¿Pregunta larga que sigue en una segunda línea?')
    expect(questions[0].options.A).toBe('Opción que continúa en otra línea')
  })

  it('skips page-number noise and section headers', () => {
    const md = `# Sección de prueba
# 1. ¿Pregunta?
12
Page 3 of 40
- A) Uno
- B) Dos
> Respuesta: A`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions).toHaveLength(1)
    expect(questions[0].question).toBe('¿Pregunta?')
  })

  it('ignores content before the first question', () => {
    const md = `Examen de certificación 2026
Introducción al tema.
# 1. ¿Pregunta válida aquí?
- A) Uno
- B) Dos
> Respuesta: B`
    const { questions } = parseMarkdownToQuestions(md)
    expect(questions).toHaveLength(1)
    expect(questions[0].question).toBe('¿Pregunta válida aquí?')
  })

  it('reports well-formed blocks with no resolvable answer as missingAnswer, not invalid', () => {
    const md = `# 1. Sin respuesta marcada
- A) Uno
- B) Dos

# 2. Completa esta vez
- A) Uno
- B) Dos
> Respuesta: A`
    const { questions, invalid, missingAnswer } = parseMarkdownToQuestions(md)
    expect(questions).toHaveLength(1)
    expect(invalid).toBe(0)
    expect(missingAnswer).toEqual([{ number: '1', question: 'Sin respuesta marcada', optionKeys: ['A', 'B'] }])
  })

  it('counts blocks with no question text or no options as invalid', () => {
    const md = `# 1.
> Respuesta: A`
    const { questions, invalid, missingAnswer } = parseMarkdownToQuestions(md)
    expect(questions).toHaveLength(0)
    expect(missingAnswer).toHaveLength(0)
    expect(invalid).toBe(1)
  })

  it('merges a detached answer-key section using a colon separator', () => {
    const md = `# 1. ¿Cuál es más económico?
- A) Opción uno
- B) Opción dos
- C) Opción tres

Respuestas

# 1. C: Porque permite escalar bajo demanda.`
    const { questions, invalid, missingAnswer } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(missingAnswer).toHaveLength(0)
    expect(questions[0].answer).toEqual(['C'])
    expect(questions[0].explanation).toBe('Porque permite escalar bajo demanda.')
  })

  it('returns empty for blank input', () => {
    expect(parseMarkdownToQuestions('').questions).toHaveLength(0)
    expect(parseMarkdownToQuestions(null).questions).toHaveLength(0)
  })

  it('merges a detached answer-key section (questions first, answers at the end)', () => {
    const md = `# 1. ¿Cuál es más económico?
- A) Opción uno
- B) Opción dos
- C) Opción tres

# 2. Selecciona dos
- A) Uno
- B) Dos
- C) Tres

Respuestas

# 1. C – Porque permite escalar bajo demanda.
# 2. A, B – Ambas son correctas por diseño.`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions).toHaveLength(2)
    expect(questions[0].answer).toEqual(['C'])
    expect(questions[0].explanation).toBe('Porque permite escalar bajo demanda.')
    expect(questions[1].answer).toEqual(['A', 'B'])
  })

  it('recognizes a question number with no space after the delimiter', () => {
    const md = `# 3. ¿Pregunta con espacio?
- A) Uno
- B) Dos
> Respuesta: A

4)¿Pregunta sin espacio tras el paréntesis?
- A) Uno
- B) Dos
> Respuesta: B`
    const { questions, invalid } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(questions).toHaveLength(2)
    expect(questions[1].question).toBe('¿Pregunta sin espacio tras el paréntesis?')
    expect(questions[1].answer).toEqual(['B'])
  })

  it('treats a nested enumerated list inside a question as body text, not a new question', () => {
    const md = `# 17. Dadas las siguientes descripciones de tareas:
# 1. Se seleccionan las características de calidad
# 2. Todos tienen acceso al producto de trabajo
Y las siguientes actividades de revisión
- A) Revisión individual
- B) Iniciación de la revisión
> Respuesta: A

# 18. Siguiente pregunta real
- A) Uno
- B) Dos
> Respuesta: B`
    const { questions, invalid, missingAnswer } = parseMarkdownToQuestions(md)
    expect(invalid).toBe(0)
    expect(missingAnswer).toHaveLength(0)
    expect(questions).toHaveLength(2)
    expect(questions[0].question).toContain('Dadas las siguientes descripciones de tareas:')
    expect(questions[0].question).toContain('Se seleccionan las características de calidad')
    expect(questions[0].question).toContain('Y las siguientes actividades de revisión')
    expect(questions[0].options).toEqual({ A: 'Revisión individual', B: 'Iniciación de la revisión' })
    expect(questions[1].question).toBe('Siguiente pregunta real')
  })
})

describe('insertAnswerTemplates', () => {
  it('inserts a blank answer line after the options of the requested question', () => {
    const md = `# 1. Sin respuesta
- A) Uno
- B) Dos

# 2. Ya tiene respuesta
- A) Uno
- B) Dos
> Respuesta: A`
    const result = insertAnswerTemplates(md, ['1'])
    expect(result).toBe(
      `# 1. Sin respuesta
- A) Uno
- B) Dos
> Respuesta:

# 2. Ya tiene respuesta
- A) Uno
- B) Dos
> Respuesta: A`,
    )
    const { questions, missingAnswer } = parseMarkdownToQuestions(result)
    expect(missingAnswer).toHaveLength(1)
    expect(questions).toHaveLength(1)
  })

  it('inserts a template for a question at the end of the document', () => {
    const md = `# 1. Última pregunta sin respuesta
- A) Uno
- B) Dos`
    const result = insertAnswerTemplates(md, ['1'])
    expect(result).toBe(
      `# 1. Última pregunta sin respuesta
- A) Uno
- B) Dos
> Respuesta:`,
    )
  })

  it('leaves questions not in the requested list untouched', () => {
    const md = `# 1. Sin respuesta
- A) Uno
- B) Dos`
    expect(insertAnswerTemplates(md, ['2'])).toBe(md)
  })
})
