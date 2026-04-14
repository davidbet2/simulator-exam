# /status — Estado del Proyecto

Presenta un resumen completo del estado actual del proyecto.

## Uso

```
/status                    → Resumen general
/status --memory           → Estado de la memoria persistente
/status --session          → Logs y stats de la sesión actual
```

## Instrucciones

Cuando se invoque este comando, recopilar y presentar:

### 1. Estado del Proyecto (de CLAUDE.md)
- Fase actual del proyecto
- Próximos pasos documentados

### 2. Estado de Git
Ejecutar y resumir:
- `git status` — cambios sin commitear
- `git log --oneline -5` — últimos 5 commits
- `git branch` — branch actual

### 3. Memoria Pendiente
- Verificar si existe `memory/sessions/pending-memory-updates.jsonl`
- Contar entradas con `"processed": false`
- Si hay pendientes, mostrarlas

### 4. Decisiones Recientes
- Listar archivos recientes en `docs/decisions/`

### 5. Stats de Sesión Actual
- Contar líneas en el log del día (`memory/sessions/YYYY-MM-DD.jsonl`)

## Formato de Salida

```markdown
## Estado del Proyecto — [PROJECT_NAME]

**Fase:** [fase actual]
**Branch:** [branch] | **Cambios sin commitear:** [S/N]

### Últimos Commits
[5 commits recientes]

### Tareas Próximas
[de CLAUDE.md]

### Memoria Pendiente
[N actualizaciones pendientes de review]

### Sesión Actual
[N tool calls | N errores]
```
