# Memory — Sistema de Memoria Persistente

Este directorio es el **sistema de memoria a largo plazo** del proyecto para Claude.
Los MCPs Claudemem y Engram leen de aquí y sincronizan entre sesiones.

---

## Estructura

```
memory/
├── sessions/      → Logs automáticos de cada sesión (generado por hooks)
├── decisions/     → Decisiones importantes tomadas durante el desarrollo
├── patterns/      → Patrones útiles aprendidos y reutilizables
└── knowledge/     → Índice semántico (usado por Engram MCP)
```

---

## Convenciones

### ¿Qué va en cada carpeta?

**`sessions/`** — Completamente automático. Los hooks escriben aquí. No editar manualmente.
- `YYYY-MM-DD.jsonl` — Log del día
- `summary-*.md` — Resumen de sesión (generado al finalizar)
- `pre-compact-*.md` — Snapshot antes de compactación
- `pending-memory-updates.jsonl` — Actualizaciones pendientes de procesar

**`decisions/`** — Decisiones que no merecen un ADR completo pero sí deben recordarse.
Formato sugerido: `YYYY-MM-DD-descripcion-corta.md`
Ejemplo: decisión de usar camelCase vs snake_case en el proyecto

**`patterns/`** — Patrones técnicos o de proceso que funcionaron bien.
Formato sugerido: `nombre-del-patron.md`
Ejemplo: cómo manejar paginación en este proyecto

**`knowledge/`** — Gestionado por Engram MCP. No escribir manualmente.

---

## Reglas de la Memoria

1. **Append-only** — Nunca borrar entradas, solo agregar contexto nuevo o correcciones
2. **Conciso** — Cada entrada debería leerse en < 2 minutos
3. **Accionable** — Si no cambia cómo se trabaja, no merece estar en memoria
4. **Fechado** — Siempre incluir la fecha de la entrada

---

## Cómo Claude usa esta memoria

1. Al inicio de sesión puede pedirle: *"Revisa memory/patterns/ para contexto del proyecto"*
2. Antes de decisiones arquitectónicas: *"Busca en memory/decisions/ decisiones previas sobre X"*
3. Para deduplicar trabajo: *"¿Ya hay algo en memory/ sobre Y?"*
4. Comando `/memory-sync` para procesar actualizaciones pendientes

---

## Integración MCP

- **Claudemem** lee `memory/` y propaga el contexto cross-session automáticamente
- **Engram** indexa `memory/knowledge/` para búsqueda semántica
- Los hooks post-tool-use escriben en `memory/sessions/` en tiempo real
