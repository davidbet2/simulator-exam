# Research: Auto-generación de Explicaciones para Preguntas de Examen con IA

**Fecha:** 2026-04-19  
**Stack:** React 19 · Firebase Functions v2 (Node 22) · Gemini 2.5 Flash · @google/genai  
**Implementado en:** `feat/ai-explanation-generator`

---

## Decisión: Gemini 2.5 Flash via Firebase Function callable

### Por qué Gemini 2.5 Flash

| Modelo | Input /1M | Output /1M | Free Tier | Calidad ES |
|--------|-----------|------------|-----------|-----------|
| **Gemini 2.5 Flash** ✅ | $0.30 | $2.50 | ✅ | ⭐⭐⭐⭐⭐ |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | ✅ | ⭐⭐⭐⭐ |
| GPT-5.4 nano | $0.20 | $1.25 | ❌ | ⭐⭐⭐⭐ |
| Claude Haiku 3.5 | ~$0.80 | ~$4.00 | ❌ | ⭐⭐⭐⭐ |

### SDK correcto en 2026

- ❌ `@google/generative-ai` — **DEPRECATED** (agosto 2025)
- ✅ `@google/genai` v1.50.1 — SDK oficial GA, activamente mantenido

---

## Arquitectura implementada

```
Admin (QuestionForm)
  └── botón "Generar con IA" (Sparkles icon)
        └── useGenerateExplanation() hook
              └── httpsCallable(fns, 'generateExplanation')
                    └── Firebase Function onCall
                          ├── Auth guard: solo admins (col. `admins`)
                          ├── Input validation
                          ├── Prompt engineering (Gemini 2.5 Flash)
                          └── return { explanation }
```

---

## Setup requerido (una sola vez)

```bash
# 1. Obtener API key en https://aistudio.google.com/apikey (gratis)
# 2. Registrar como secret de Firebase:
firebase functions:secrets:set GEMINI_API_KEY

# 3. Desplegar funciones:
firebase deploy --only functions
```

---

## Pitfalls conocidos

- `onCall` maneja CORS automáticamente (no necesita `setCorsHeaders` manual)
- `maxInstances: 5` protege billing de IA contra abuso
- `temperature: 0.3` produce respuestas técnicamente consistentes
- Validar que `question.trim()` y `answer.length` antes de habilitar el botón (ya implementado)
- El free tier de Gemini tiene rate limits: ~15 RPM / 1M tokens/día — más que suficiente para admin

---

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `functions/index.js` | Import `@google/genai`, secret `GEMINI_API_KEY`, `exports.generateExplanation` |
| `functions/package.json` | `@google/genai: ^1.50.1` |
| `src/features/admin/hooks/useGenerateExplanation.js` | Hook nuevo |
| `src/features/admin/components/QuestionForm.jsx` | Botón "Generar con IA" en sección Justificación |
