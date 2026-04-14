---
name: plan-execute
description: >
  Plan-first development workflow. Forces a research → plan → confirm → execute loop
  with atomic commits per unit. Use when asked to implement, develop, build, create,
  or add any feature that requires more than one file change.
---

# Skill: Plan-Execute Workflow

## Trigger

Activar cuando el usuario diga: "implementa", "develop", "build", "add", "create", "crea", "agrega", "construye"

---

## Workflow (Orden Estricto)

### Fase 1 — Research
1. Leer todos los archivos relevantes a la tarea (no adivinar)
2. Verificar `memory/decisions/` para decisiones previas que restrinjan esta tarea
3. Verificar `memory/patterns/` para patrones establecidos a seguir
4. Identificar: qué existe, qué falta, qué se impacta

### Fase 2 — Plan (Presentar antes de ejecutar)
Presentar un plan estructurado en este formato:

```
## Implementation Plan: <nombre de la tarea>

### Scope
- Files to create: [lista]
- Files to modify: [lista]
- Files to delete: [lista — requiere confirmación]

### Approach
<2-3 oraciones explicando el enfoque y por qué>

### Steps (en orden)
1. [Descripción del paso] → commit: `type(scope): mensaje`
2. [Descripción del paso] → commit: `type(scope): mensaje`
...

### Assumptions
- [Lista de suposiciones]

### Out of Scope
- [Qué NO incluye este plan]

---
Responde `/approve` o describe cambios al plan.
```

**STOP AQUÍ. No escribir código hasta que el usuario apruebe.**

### Fase 3 — Ejecución (Después de aprobación)
- Ejecutar UN paso a la vez del plan aprobado
- Después de cada paso: correr tests/lint si están disponibles
- Commitear con el mensaje exacto del plan
- Confirmar: "Step N done — committed as `<hash>`"
- **Si se requiere una desviación**: detenerse, explicar por qué, obtener aprobación antes de continuar

### Fase 4 — Verificación
Después de completar todos los pasos:
1. Re-leer la solicitud original
2. Verificar que cada archivo coincide con el plan
3. Correr la suite de tests completa (si está configurada)
4. Declarar: "Implementation complete. <N> commits. All steps verified."

### Fase 5 — Memory Update
Escribir un registro de decisión si la tarea involucró una elección arquitectónica no obvia:
- `memory/decisions/YYYY-MM-DD-<topic>.md` — ADR si es arquitectónico
- `memory/patterns/` — Agregar al archivo de patrón relevante si surgió un nuevo patrón

## Manejo de Desviaciones
Si durante la ejecución descubres:
- El plan está incorrecto → DETENER, explicar, mostrar plan revisado, esperar re-aprobación
- Un archivo está en estado inesperado → DETENER, mostrar lo que encontraste, preguntar cómo proceder
- Un test falla → DETENER, diagnosticar, presentar opciones de corrección

## Reglas de Commits Atómicos
- Un cambio lógico por commit
- Formato: `type(scope): oración imperativa` (máx 72 chars)
- Tipos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Nunca commitear secrets, nunca usar `--no-verify`
