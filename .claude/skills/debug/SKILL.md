---
name: debug
description: Systematic debugging using scientific method. Use when there are errors, exceptions, failing tests, or unexpected behavior. Trigger: "debug", "why does this fail", "there's a bug", "investigate error".
allowed-tools: Read Grep Glob Bash(git log *) Bash(git diff *) Bash(cat *) Bash(grep *)
---

# Skill: Debug

## Trigger

Activar cuando el usuario diga: "debug", "investiga", "por qué falla", "hay un error", "no funciona", "find the bug"

---

## Metodología de Depuración

Seguir el proceso científico: hipótesis → experimento → conclusión. No adivinar.

---

## Proceso

### Fase 1: Recolección de Evidencia

Antes de tocar código, recopilar:

1. **Mensaje de error exacto** — Copiar el stack trace completo, no la descripción del usuario
2. **Contexto de reproducción:**
   - ¿Ocurre siempre o intermitentemente?
   - ¿Ocurre en todos los entornos o solo en algunos?
   - ¿Cuándo comenzó? ¿Qué cambió antes de que apareciera?
3. **Comportamiento esperado vs actual** — Ser específico
4. **Logs relevantes** — últimas N líneas de logs, no el archivo completo
5. **Entorno:** versión del runtime, OS, dependencias relevantes

### Fase 2: Hipótesis

Generar **mínimo 3 hipótesis**, ordenadas por probabilidad:

```
H1 (más probable): [descripción] — Evidencia: [qué apunta a esto]
H2 (probable):     [descripción] — Evidencia: [qué apunta a esto]
H3 (menos probable): [descripción] — Evidencia: [qué apunta a esto]
```

### Fase 3: Reducción del Problema

Antes de escribir código:

1. **Bisect** — ¿En qué versión/commit funcionaba? `git bisect` si aplica
2. **Isolate** — Crear el caso más pequeño que reproduce el bug
3. **Eliminar** — ¿Sigue ocurriendo sin [X]? Ir eliminando variables

### Fase 4: Verificar Hipótesis

Para cada hipótesis (de más a menos probable):

1. Diseñar experimento mínimo que confirme o descarte la hipótesis
2. Ejecutar el experimento
3. Interpretar resultados
4. Si se confirma → Fase 5. Si no → probar siguiente hipótesis

**Técnicas de diagnóstico por categoría:**

| Categoría         | Técnica                                          |
|-------------------|--------------------------------------------------|
| Lógica            | Print debugging, watch variables, assert early   |
| Concurrencia      | Logs con timestamps, detectar race conditions    |
| Performance       | Profiling, flamegraphs, medir antes y después    |
| Red/API           | Inspeccionar request/response raw, timeouts      |
| Base de datos     | Log queries, EXPLAIN ANALYZE, verificar índices  |
| Memoria           | Heap dumps, memory profiler, leak detection      |

### Fase 5: Fix y Verificación

1. Implementar el fix mínimo que resuelve el bug
2. Verificar que el bug original no ocurre
3. Verificar que no se rompió nada más (regression test)
4. Escribir test que hubiera detectado el bug
5. Commit: `fix(scope): descripción del bug corregido`

---

## Formato de Reporte

```markdown
## Debug Report — [descripción breve del bug]

### Evidencia Recolectada
- Error: `[mensaje exacto]`
- Reproducible: [siempre / intermitente / solo en X entorno]
- Primer ocurrencia: [cuando]

### Hipótesis
1. **[H1]** — Probabilidad: alta — [razonamiento]
2. **[H2]** — Probabilidad: media — [razonamiento]

### Experimentos Realizados
- H1: [experimento] → [resultado] → [confirmado/descartado]

### Causa Raíz
[Explicación de la causa raíz una vez encontrada]

### Fix Aplicado
[Descripción del cambio y por qué resuelve el problema]

### Test Agregado
[Test que previene regresión]
```

---

## Post-Debug

- Si fue un bug de seguridad → agregar el patrón a `.claude/hooks/pre-tool-use/security-check.py`
- Si es un patrón recurrente → documentar en `memory/patterns/known-bugs.md`
- Si revela un problema arquitectónico → crear ADR en `docs/decisions/`

---

## ⚠️ Gotchas

- **Fix sin reproducción** — Nunca implementar un fix sin haber reproducido el bug primero. Un fix que «debería funcionar» sin evidencia es otro bug potencial.
- **Hipótesis única** — Ir directo a la primera hipótesis sin explorar alternativas lleva a fixes incorrectos. Generar mínimo 3 hipótesis antes de tocar código.
- **Debugging en producción** — No agregar `print()`/`console.log()` en código de producción para debuggear. Usar el logger del proyecto o variables de entorno de debug.
- **Olvidar el test de regresión** — El bug se «resuelve» pero vuelve en 2 semanas. Siempre escribir el test que hubiera detectado el bug antes de hacer commit.
- **Asumir que el error está donde aparece** — Los stack traces en código asíncrono o con wrappers apuntan al lugar del catch, no a la causa raíz. Trazar hacia arriba en el call stack.
