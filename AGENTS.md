# AGENTS.md — Multi-Agent Coordination

> Este archivo define cómo múltiples agentes de IA colaboran en este proyecto. Claude Code y otros agentes lo leen para entender roles, protocolos y restricciones de coordinación.

---

## Roles de Agentes

### Agente Principal (Orchestrator)
- **Identidad:** Claude (modelo principal en cada sesión)
- **Responsabilidades:** Planificación, descomposición de tareas, síntesis de resultados
- **Puede delegar:** Tareas de investigación pura, análisis de archivos grandes, búsquedas paralelas

### Sub-agentes Especializados

| Agente       | Especialidad                        | Cuándo invocarlo                          |
|--------------|-------------------------------------|-------------------------------------------|
| `Explore`    | Exploración de código read-only      | Búsqueda en codebase grande, Q&A técnico  |
| `Reviewer`   | Code review profundo                | PRs, auditorías de seguridad              |
| `Architect`  | Diseño y decisiones arquitectónicas | Cambios estructurales, nuevos módulos     |

---

## Protocolos de Coordinación

### Handoff de Contexto
Cuando se transfiere trabajo entre agentes:
1. Incluir resumen del estado actual en el prompt del sub-agente
2. Especificar exactamente qué debe retornar
3. El sub-agente NO tiene acceso al historial de conversación padre

### Paralelización
- ✅ Operaciones read-only independientes → paralelizar
- ✅ Búsquedas en múltiples archivos → paralelizar
- ❌ Escrituras de archivos → siempre secuencial
- ❌ Comandos de terminal → siempre secuencial

### Resolución de Conflictos
Si dos agentes producen resultados contradictorios:
1. El Orchestrator evalúa ambos resultados
2. Consulta `memory/decisions/` para contexto histórico
3. Documenta la decisión final en `memory/decisions/`

---

## Restricciones Globales para Todos los Agentes

```
NEVER:
- Commitear ni pushear código sin confirmación explícita del usuario
- Borrar archivos o directorios sin confirmación
- Modificar configuración de producción
- Ignorar hooks de seguridad en .claude/hooks/

ALWAYS:
- Leer CLAUDE.md antes de comenzar trabajo significativo
- Consultar docs/decisions/ antes de cambios arquitectónicos
- Registrar decisiones importantes en memory/decisions/
- Usar memory/patterns/ para no repetir trabajo anterior
```

---

## Memoria Compartida entre Agentes

Los agentes comparten contexto a través de:

```
memory/
├── sessions/     → Log de acciones por sesión (append-only)
├── decisions/    → Decisiones tomadas (fuente de verdad compartida)
├── patterns/     → Patrones aprendidos (aplicables a nuevas tareas)
└── knowledge/    → Grafo de conocimiento via Engram MCP
```

**Regla:** Un agente NUNCA sobreescribe lo que escribió otro. Solo appends.

---

## Integración con MCPs

Los MCPs actúan como herramientas compartidas entre agentes:

- **Engram:** Permite a sub-agentes consultar conocimiento persistido por el agente principal
- **Claudemem:** El Orchestrator persiste el estado de la sesión; sub-agentes pueden consultarlo
- **Caveman:** Todos los agentes loggean a través de Caveman para trazabilidad completa
