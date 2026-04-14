# /memory-sync — Sincronización de Memoria

Procesa las actualizaciones de memoria pendientes y sincroniza el estado persistente.

## Uso

```
/memory-sync               → Revisar y procesar pendientes
/memory-sync --patterns    → Solo sincronizar patrones aprendidos
/memory-sync --decisions   → Solo sincronizar decisiones tomadas
/memory-sync --status      → Ver estado de la memoria sin modificar nada
```

## Instrucciones

Cuando se invoque este comando:

### 1. Leer pendientes

Abrir `memory/sessions/pending-memory-updates.jsonl` y listar entradas con `"processed": false`.

### 2. Para cada pendiente, preguntar:

```
¿Este cambio en [archivo] merece ser recordado?

Opciones:
a) Sí, agregar a memory/patterns/ — [sugerencia de qué documentar]
b) Sí, agregar a memory/decisions/ — [decisión tomada]
c) No, marcar como procesado sin acción
```

### 3. Actualizar archivos de memoria

Si el usuario elige `a` o `b`:
- Crear o actualizar el archivo correspondiente en `memory/`
- Marcar la entrada como `"processed": true` en el JSONL

### 4. Reporte final

```markdown
## Memory Sync — Resultado

- Entradas revisadas: N
- Patrones documentados: N
- Decisiones registradas: N
- Descartadas: N

### Memoria actualizada en:
- memory/patterns/[archivo].md
- memory/decisions/[archivo].md
```

## ⚠️ Importante

- La memoria es **append-only** para patrones y decisiones
- No borrar entradas antiguas, solo agregar contexto nuevo
- Si algo es incorrecto, documentar la corrección (no borrar lo anterior)

## Integración MCP

Con **Claudemem** activo: las actualizaciones de `memory/` se sincronizan automáticamente
al contexto cross-session del MCP.

Con **Engram** activo: los patrones se indexan semánticamente para recuperación inteligente.
