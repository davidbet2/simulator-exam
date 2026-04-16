---
name: research
description: >
  Primary research skill. Before any implementation, fetches current best practices
  from authoritative internet sources, cross-references them, and produces a structured
  RESEARCH.md report. Triggers automatically before "implementa", "crea", "agrega",
  "build". Can also be invoked explicitly: "investiga", "researcha", "busca mejores
  prácticas", "qué recomienda X".
argument-hint: "<topic or feature to research>"
allowed-tools: Read Write Grep Glob fetch WebSearch
---

# Skill: Research-First

## Cuándo se Activa

**Automáticamente (gatillos implícitos):**
- Antes de cualquier `implementa`, `crea`, `agrega`, `build`, `add`
- Cuando una tecnología o patrón no está en `memory/patterns/`
- Cuando hay una decisión arquitectónica nueva que tomar

**Explícitamente (gatillos directos):**
- "investiga X", "researcha X"
- "busca mejores prácticas de X"
- "qué recomienda la comunidad para X"
- "cómo lo hacen en producción X"
- "hay algo mejor que X"

---

## Flujo de Ejecución (5 fases — no saltarse ninguna)

```
FASE 1: CONTEXTO DEL PROYECTO
      ↓
FASE 2: PREGUNTAS DE INVESTIGACIÓN
      ↓
FASE 3: BÚSQUEDA WEB (≥3 fuentes confiables)
      ↓
FASE 4: ANÁLISIS Y COMPARACIÓN
      ↓
FASE 5: REPORTE + DECISIÓN
```

---

## FASE 1 — Contexto del Proyecto

Antes de buscar cualquier cosa externamente, leer:

```
1. CLAUDE.md          → stack actual, decisiones tomadas, restricciones
2. docs/architecture.md → restricciones estructurales
3. memory/decisions/  → decisiones previas (evitar contradecirlas)
4. memory/patterns/   → patrones establecidos (si ya existe uno, usarlo)
5. memory/research/   → investigaciones anteriores (evitar repetir trabajo)
```

Si ya existe un research reciente (< 30 días) para el mismo tema: **re-usar y no re-buscar**.

---

## FASE 2 — Preguntas de Investigación

Para el tema dado, formular **exactamente 4 preguntas** siguiendo estos arquetipos:

| # | Arquetipo | Ejemplo |
|---|-----------|---------|
| Q1 | ¿Cuál es el estándar actual? | "¿Cómo lo recomienda la doc oficial?" |
| Q2 | ¿Cuáles son los pitfalls conocidos? | "¿Qué errores cometen los implementadores?" |
| Q3 | ¿Cómo lo hacen en producción? | "¿Cómo lo resuelven apps grandes?" |
| Q4 | ¿Hay implicaciones de seguridad? | "¿Qué dice OWASP al respecto?" |

Mostrar las preguntas al usuario antes de buscar:

```
## 🔍 Investigando: <tema>

Preguntas que voy a responder:
1. [Q1]
2. [Q2]
3. [Q3]
4. [Q4]

Buscando en fuentes confiables...
```

---

## FASE 3 — Búsqueda Web

### Fuentes por Categoría

**Documentación oficial (prioridad máxima):**
- react.dev, reactrouter.com, vitejs.dev
- firebase.google.com/docs
- tailwindcss.com/docs
- framer.com/motion
- web.dev (Google)
- developer.mozilla.org (MDN)

**Comunidad técnica de alta confianza:**
- kentcdodds.com, joshwcomeau.com
- patterns.dev, ui.dev
- smashingmagazine.com
- blog.logrocket.com (verificar fecha)

**Repositorios y discusiones:**
- github.com/[lib]/[lib]/issues (issues oficiales del proyecto)
- github.com/[lib]/[lib]/discussions

**Seguridad:**
- owasp.org
- snyk.io/advisor (para vulnerabilidades de npm)
- cheatsheetseries.owasp.org

### Reglas de Calidad para Fuentes

| Regla | Detalle |
|-------|---------|
| Fecha | Máximo 18 meses de antigüedad (excepto RFC o spec) |
| Relevancia | Debe ser específica al stack del proyecto |
| Verificación | Al menos 2 fuentes independientes para cualquier afirmación crítica |
| Rechazo | Nunca citar Medium/Dev.to sin verificar con fuente primaria |

**Mínimo de fuentes por tipo de tema:**
- Librería nueva: 3 fuentes (oficial + 2 comunidad)
- Patrón de arquitectura: 4 fuentes (oficial + 1 caso real + 1 contra-argumento)
- Seguridad: 3 fuentes (OWASP + oficial + 1 informe de CVE si aplica)

---

## FASE 4 — Análisis y Comparación

### Tabla de Comparación (siempre incluir)

| Criterio | Opción A | Opción B | Opción C |
|----------|----------|----------|----------|
| Compatibilidad React 19 | ✓/✗ | ✓/✗ | ✓/✗ |
| Bundle size (KB) | ? | ? | ? |
| Mantenimiento activo | ✓/✗ | ✓/✗ | ✓/✗ |
| Curva de aprendizaje | Baja/Media/Alta | | |
| Accesibilidad | ✓/✗ | ✓/✗ | ✓/✗ |
| Seguridad | ✓/✗ | ✓/✗ | ✓/✗ |
| Score /10 | ? | ? | ? |

### Score /10 — Criterios de Puntuación

```
+3  Recomendado en doc oficial para el stack del proyecto
+2  Usado en producción por ≥3 proyectos grandes conocidos
+2  Mantenimiento activo (commit < 30 días)
+1  Bundle < 10 KB gzip
+1  Zero dependencias peer conflicts
-2  Deprecated o en mantenimiento pasivo
-2  Vulnerabilidades conocidas no parchadas
-3  Incompatible con React 19 o Vite 5
```

---

## FASE 5 — Reporte Final

### Archivo de Salida

Guardar en: `memory/research/YYYY-MM-DD-<topic-kebab>.md`

El directorio `memory/research/` se crea si no existe.

### Estructura del Reporte

```markdown
# Research: <Tema>

**Fecha:** YYYY-MM-DD
**Stack:** React 19 · Vite 5 · Firebase 12 · Tailwind 3 · Framer Motion 12
**Solicitado por:** <resumen de la petición del usuario en 1 oración>
**Investigado por:** Skill `research` — CertZen

---

## Preguntas de Investigación

1. [Q1]
2. [Q2]
3. [Q3]
4. [Q4]

---

## Hallazgos

### [Hallazgo 1]
**Confianza:** ALTA | MEDIA | BAJA
**Fuentes:** [Title](URL) — fecha — cita clave

**Resumen:** 2-3 oraciones explicando el hallazgo con evidencia.

### [Hallazgo 2]
...

---

## Comparación de Enfoques

| Criterio | [Opción A] | [Opción B] | [Opción C] |
|----------|-----------|-----------|-----------|
| Compatibilidad React 19 | | | |
| Bundle size | | | |
| Mantenimiento | | | |
| Accesibilidad | | | |
| **Score /10** | | | |

---

## ⚠️ Pitfalls y Anti-Patrones

- **[Pitfall 1]** — [descripción] · Fuente: [URL]
- **[Pitfall 2]** — [descripción] · Fuente: [URL]

---

## 🔒 Seguridad

[Si aplica: implicaciones de seguridad con referencias OWASP o CVEs]

---

## ✅ Recomendación

**Enfoque recomendado:** [Opción X]

**Justificación:** [2-3 oraciones basadas en evidencia, citando fuentes]

**Notas para el implementador:**
- [Nota específica de implementación]
- [Nota específica de implementación]

**Advertencias:**
- [Advertencia con fuente]

---

## Registro de Fuentes

| # | URL | Fecha | Dominio | Confianza |
|---|-----|-------|---------|-----------|
| 1 | | | | |

---

## Fuera de Alcance

Temas relacionados no investigados en este ciclo:
- [Tema]
```

---

## Reglas Críticas

1. **Nunca fabricar fuentes** — Si no puedes acceder a una URL, di "no pude verificar esta fuente"
2. **Nunca recomendar sin evidencia** — Cada recomendación debe citar ≥1 fuente
3. **Nunca ignorar el stack** — Toda recomendación debe ser verificada contra React 19 + Vite 5
4. **Siempre escribir el archivo** — El reporte en `memory/research/` es obligatorio, no opcional
5. **Siempre mencionar alternativas** — Nunca presentar una sola opción como "la única"
6. **Si hay incertidumbre**: decir explícitamente qué no se pudo confirmar

---

## Mensaje de Cierre (siempre terminar con esto)

```
---
## ✅ Investigación Completa

**Tema:** <tema>
**Reporte:** memory/research/YYYY-MM-DD-<topic>.md

### Resumen ejecutivo
[3 oraciones: qué se encontró, qué se recomienda, riesgo principal]

### Próximo paso
Usa `plan-execute` o di "implementa" para proceder con este contexto de investigación.
El agente ejecutor leerá automáticamente este reporte antes de codificar.
---
```

---

## Integración con Otros Skills

| Después de `research` | Usa este skill |
|-----------------------|----------------|
| Implementar el hallazgo | `plan-execute` |
| Revisar código resultante | `code-review` |
| Diseñar componente UI | `ux-ui` |
| Decidir arquitectura | `architecture` |
| Documentar | `documentation` |
