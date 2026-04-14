---
name: refactor
description: Structured refactoring with a clear plan, preserving all behavior. Use when cleaning up code structure, removing duplication, or improving design. Trigger: "refactor", "clean up this code", "improve structure".
argument-hint: "[module or file to refactor]"
disable-model-invocation: true
allowed-tools: Read Grep Glob Bash(git diff *) Bash(git status)
---

# Skill: Refactor

## Trigger

Activar cuando el usuario diga: "refactoriza", "refactor", "limpia este código", "mejora la estructura", "reestructura"

---

## Principios de Refactoring

> **Regla de oro:** El comportamiento externo observable NO cambia. Si el usuario no tiene tests, crear tests primero.

### Cuándo NO refactorizar primero

- Si no hay tests que validen el comportamiento actual → crear tests primero
- Si hay un bug que corregir → corregir el bug primero, luego refactorizar
- Si el deadline es inminente → documentar deuda técnica y refactorizar después

---

## Proceso

### Fase 1: Análisis (antes de tocar código)

1. **Identificar el problema** — ¿Qué huele mal? (code smells específicos)
2. **Delimitar el alcance** — ¿Qué archivos/funciones están involucrados?
3. **Verificar tests existentes** — ¿Qué cobertura hay actualmente?
4. **Presentar plan al usuario** y esperar confirmación antes de proceder

### Fase 2: Preparación

1. Verificar que los tests pasan ANTES de refactorizar
2. Si no hay tests suficientes, escribirlos ahora
3. Hacer commit del estado actual: `chore: pre-refactor snapshot`

### Fase 3: Aplicar Técnicas (una por vez, con verificación)

**Extracción:**
- Extract Method — función demasiado larga (>20 líneas es señal)
- Extract Class — clase con demasiadas responsabilidades
- Extract Variable — expresiones complejas sin nombre

**Simplificación:**
- Inline Variable/Method — abstracción que no aporta claridad
- Remove Dead Code — código nunca ejecutado
- Simplify Conditional — `if/else` que puede ser polimorfismo o guard clauses

**Reorganización:**
- Move Method/Field — método que usa más datos de otra clase que de la propia
- Rename — nombres que no comunican intención clara

**Eliminación de duplicación:**
- Pull Up Method — código duplicado en subclases
- Introduce Parameter Object — múltiples parámetros relacionados

### Fase 4: Verificación

1. Ejecutar todos los tests → deben pasar sin cambios
2. Comparar comportamiento externo con estado pre-refactor
3. Hacer commit: `refactor(scope): descripción del cambio`

---

## Formato de Reporte

```markdown
## Refactoring Plan — [módulo]

### Problemas Identificados
1. **[Code Smell]** en `archivo:línea` — Descripción breve
2. ...

### Alcance del Cambio
- Archivos afectados: [lista]
- Tests existentes: [cobertura actual]

### Plan de Ejecución
1. [Paso 1] — Técnica: [nombre]
2. [Paso 2] — Técnica: [nombre]

### Tests a crear antes de empezar
- [ ] Test para [comportamiento A]
- [ ] Test para [comportamiento B]

¿Procedo con este plan? [S/N]
```

---

## Post-Refactor

- Documentar el patrón aplicado en `memory/patterns/` si es reutilizable
- Si cambió la arquitectura, crear ADR en `docs/decisions/`

---

## ⚠️ Gotchas

- **Refactorizar sin tests** — Crear los tests PRIMERO, siempre.
- **Cambiar comportamiento accidentalmente** — Verificar que no hay código externo que dependa de lo que se modifica.
- **Refactoring como vector de cambio funcional** — No agregar features mientras se refactoriza.
- **Alcance que crece** — Delimitar el alcance ANTES y respetarlo.
- **Commits atómicos omitidos** — Cada técnica de refactoring aplicada → un commit.
