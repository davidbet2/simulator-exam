---
name: cert-populator
description: >
  Investiga certificaciones populares globales y genera bancos de preguntas
  completos en formato CertZen para poblar la plataforma. Combina investigación
  de demanda de mercado con generación pedagógica de contenido original.
argument-hint: "<domain: it | health | sports | english | business> [count: número de sets a generar]"
allowed-tools: Read Write Grep Glob fetch WebSearch
---

# Skill: Cert Populator

## Cuándo se Activa
- "poblar la plataforma con certificaciones"
- "qué certificaciones le faltan a CertZen"
- "genera sets para [dominio]"
- "crea banco de preguntas para [certificación]"
- "busca certifications populares de [industria]"
- "necesitamos más contenido en [área]"

---

## Flujo Obligatorio

```
PASO 1 — AUDITORÍA (leer antes de generar)
  → Leer scripts/seed-data/ para saber qué ya existe (no duplicar)
  → Leer scripts/seed-data/domains.mjs para IDs de dominio válidos

PASO 2 — INVESTIGACIÓN DE DEMANDA
  → Identificar top 5-10 certifications más buscadas en el dominio solicitado
  → Verificar que tienen blueprint/temario oficial público
  → Priorizar las que tienen mayor demanda en LATAM

PASO 3 — PRESENTAR AL USUARIO
  → Mostrar tabla: Certificación | Dominio | Nivel | Demanda estimada | Blueprint
  → Preguntar cuántos sets generar en esta sesión

PASO 4 — GENERACIÓN
  → Generar mínimo 20 preguntas por set (óptimo 30-40)
  → Distribución: 40% easy / 40% medium / 20% hard
  → Cubrir TODOS los sub-dominios del blueprint oficial
  → Tipos: 'multiple' (principal) + 'ordering' para procesos

PASO 5 — ENTREGA
  → Output: archivo .mjs listo para scripts/seed-data/
  → Instrucciones exactas para agregar el import en seed-official-sets.mjs
  → Comando para ejecutar: node scripts/seed-official-sets.mjs
```

---

## Schema Obligatorio (no modificar estructura)

```js
{
  slug: 'kebab-case-unico',           // Verificar que no existe ya
  title: 'Título para el usuario',
  description: 'SEO-friendly, 2-3 frases',
  domain: 'it|health|sports|english|business|logic',
  category: 'subcategoría libre',
  level: 'beginner|intermediate|advanced',
  language: 'es',
  tags: ['tag1', 'tag2'],
  passPercent: 70,
  timeMinutes: 20,
  source: 'Basado en [Documento] — [URL pública]',
  questions: [{
    type: 'multiple',
    question: '...',
    options: { A: '...', B: '...', C: '...', D: '...' },
    answer: ['B'],
    explanation: 'Justificación pedagógica que enseña el concepto.',
    domain: 'Sub-dominio temático',
    difficulty: 'easy|medium|hard',
  }]
}
```

---

## Reglas de Contenido

✅ **Hacer:**
- Basar preguntas en blueprints/objetivos oficiales públicos
- Distractores plausibles que representen errores comunes reales
- Explicaciones que enseñen el "por qué", no solo "la correcta es X"
- Citar la fuente oficial en el campo `source`

❌ **No hacer:**
- Copiar preguntas literales de exámenes comerciales (copyright)
- Inventar conceptos técnicos incorrectos
- Usar distractores absurdos o trivialmente incorrectos
- Generar PII o datos de personas reales

---

## Prioridades por Demanda (Referencia Rápida)

| Prioridad | Certificación | Dominio | Demanda LATAM |
|-----------|--------------|---------|---------------|
| 🔥 Alta | AWS Cloud Practitioner | IT | Muy alta |
| 🔥 Alta | Google Analytics 4 | Business | Muy alta |
| 🔥 Alta | NASM Personal Trainer | Sports | Alta |
| 🔥 Alta | IELTS Academic | English | Muy alta |
| 🔥 Alta | Scrum PSM I | IT | Alta |
| 🔥 Alta | NCLEX-RN | Health | Alta |
| ⚡ Media | CompTIA Security+ | IT | Media |
| ⚡ Media | Google Ads Search | Business | Alta |
| ⚡ Media | ACE Personal Trainer | Sports | Media |
| ⚡ Media | Cambridge B2 First | English | Media |
| ⚡ Media | ITIL Foundation v4 | IT | Media |
| ⚡ Media | Meta Blueprint | Business | Media |

---

## Output Template

Al final, siempre entregar:

1. **Archivo `.mjs`** con los sets generados
2. **Líneas a agregar** en `seed-official-sets.mjs`:
   ```js
   import { NOMBRE_SETS } from './seed-data/sets-nuevo.mjs';
   // Y en el array ALL_SETS:
   ...NOMBRE_SETS,
   ```
3. **Comando de ejecución:**
   ```bash
   node scripts/seed-official-sets.mjs
   ```
