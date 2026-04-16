import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../core/firebase/firebase'
import { useAuthStore } from '../../../core/store/useAuthStore'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const questionSchema = z.object({
  question: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres'),
  optA: z.string().min(1, 'Opción requerida'),
  optB: z.string().min(1, 'Opción requerida'),
  optC: z.string().optional(),
  optD: z.string().optional(),
  answer: z.string().min(1, 'Indica la respuesta correcta'),
  explanation: z.string().optional(),
})

const schema = z.object({
  title:       z.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
  questions:   z.array(questionSchema).min(3, 'Añade al menos 3 preguntas'),
})

const emptyQuestion = { question: '', optA: '', optB: '', optC: '', optD: '', answer: 'A', explanation: '' }

export function CreateExamPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', questions: [emptyQuestion, emptyQuestion, emptyQuestion] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' })

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-ink-soft">Debes iniciar sesión para crear sets de examen.</p>
          <Link to="/login"><Button>Iniciar sesión</Button></Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data) => {
    setSaving(true); setError(null)
    try {
      const questions = data.questions.map((q) => ({
        question: q.question,
        options: {
          A: q.optA, B: q.optB,
          ...(q.optC ? { C: q.optC } : {}),
          ...(q.optD ? { D: q.optD } : {}),
        },
        answer:      [q.answer],
        explanation: q.explanation ?? '',
        type:        'multiple',
      }))

      const setRef = await addDoc(collection(db, 'examSets'), {
        title:         data.title,
        description:   data.description ?? '',
        ownerUid:      user.uid,
        ownerName:     user.displayName ?? user.email,
        published:     true,
        questionCount: questions.length,
        attempts:      0,
        official:      false,
        createdAt:     serverTimestamp(),
      })

      // Save questions subcollection
      await Promise.all(
        questions.map((q, i) =>
          addDoc(collection(db, 'examSets', setRef.id, 'questions'), { ...q, order: i })
        )
      )

      navigate('/explore')
    } catch (_err) {
      setError('Error al guardar. Inténtalo de nuevo.')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface pb-12">
      <header className="border-b border-surface-border bg-surface-soft/60 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            CertZen
          </Link>
          <Link to="/explore" className="text-sm text-ink-soft hover:text-ink flex items-center gap-1">
            <ArrowLeft size={14} /> Explorar
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-ink mb-6">Crear set de examen</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Card>
              <CardHeader><h2 className="font-semibold text-ink">Información del set</h2></CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Título"
                  placeholder="Ej: AWS Solutions Architect — Práctica"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">Descripción (opcional)</label>
                  <textarea
                    placeholder="Describe el contenido de este set…"
                    rows={2}
                    className="w-full rounded-xl border border-surface-border bg-surface-soft px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 resize-none"
                    {...register('description')}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Questions */}
            <div className="space-y-4">
              <h2 className="font-semibold text-ink">
                Preguntas{' '}
                <span className="text-ink-soft font-normal">({fields.length})</span>
              </h2>
              {errors.questions?.root && (
                <p className="text-sm text-red-400" role="alert">{errors.questions.root.message}</p>
              )}

              {fields.map((field, i) => (
                <Card key={field.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink-soft">Pregunta {i + 1}</span>
                      {fields.length > 3 && (
                        <button type="button" onClick={() => remove(i)}
                          className="text-ink-soft hover:text-red-400 transition-colors"
                          aria-label={`Eliminar pregunta ${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    <Input
                      label="Enunciado"
                      placeholder="¿Cuál es…?"
                      error={errors.questions?.[i]?.question?.message}
                      {...register(`questions.${i}.question`)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Opción A" placeholder="A" error={errors.questions?.[i]?.optA?.message} {...register(`questions.${i}.optA`)} />
                      <Input label="Opción B" placeholder="B" error={errors.questions?.[i]?.optB?.message} {...register(`questions.${i}.optB`)} />
                      <Input label="Opción C (opcional)" placeholder="C" {...register(`questions.${i}.optC`)} />
                      <Input label="Opción D (opcional)" placeholder="D" {...register(`questions.${i}.optD`)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-ink-soft">Respuesta correcta</label>
                      <select
                        className="h-11 rounded-xl border border-surface-border bg-surface-soft px-4 text-sm text-ink focus:outline-none focus:border-brand-500"
                        {...register(`questions.${i}.answer`)}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    <Input
                      label="Explicación (opcional)"
                      placeholder="¿Por qué es correcta esta respuesta?"
                      {...register(`questions.${i}.explanation`)}
                    />
                  </CardBody>
                </Card>
              ))}

              <Button
                type="button"
                variant="ghost"
                className="w-full border border-dashed border-surface-border hover:border-brand-500/50"
                onClick={() => append(emptyQuestion)}
              >
                <Plus size={16} />
                Añadir pregunta
              </Button>
            </div>

            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving ? 'Guardando…' : 'Publicar set'}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
