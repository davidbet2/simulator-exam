# Patrones Aprendidos — Hook System

> Este archivo se actualiza automáticamente cuando se descubren bugs o mejores prácticas.
> **No editar manualmente** — es la fuente de verdad del auto-mejora loop.
> Última actualización: 2025-07-18

---

## BUGS CRÍTICOS ENCONTRADOS Y CORREGIDOS

### BUG-001: PreToolUse — Formato de Decision Incorrecto
**Descubierto:** 2025-01-30 (investigación en docs oficiales)
**Síntoma:** Hooks de PreToolUse usaban `{"decision": "block", "reason": "..."}` — formato de Stop/PostToolUse
**Causa raíz:** El formato de PreToolUse es diferente a otros hooks
**Fix correcto:**
```python
# ❌ INCORRECTO para PreToolUse
{"decision": "block", "reason": "motivo"}

# ✅ CORRECTO para PreToolUse
{"hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",          # o "ask", "allow", "defer"
    "permissionDecisionReason": "motivo"
}}

# ✅ TAMBIÉN VÁLIDO para bloqueo absoluto (sin reasoning)
sys.exit(2) + print("mensaje de error", file=sys.stderr)
```
**Regla:** PreToolUse usa `hookSpecificOutput.permissionDecision`. Stop/PostToolUse usan `decision`.

---

### BUG-002: Stop Hook — Bucle Infinito sin stop_hook_active Check
**Descubierto:** 2025-01-30 (investigación en docs oficiales)
**Síntoma:** Si el Stop hook retorna `decision: block` y Claude hace algo, el Stop hook vuelve a correr → bucle infinito
**Causa raíz:** Claude hace SIEMPRE una Stop call al terminar, incluyendo cuando termina POR un Stop hook
**Fix correcto:**
```python
def main():
    data = json.loads(sys.stdin.read())
    
    # ✅ SIEMPRE verificar esto primero en Stop hooks
    if data.get("stop_hook_active"):
        sys.exit(0)  # Salir inmediatamente sin bloquear
    
    # ... lógica del hook
```
**Regla:** Todo Stop hook DEBE tener `stop_hook_active` check como primera instrucción.

---

### BUG-003: Paths de Hooks Hardcodeados en settings.json
**Descubierto:** 2025-01-30 (investigación en docs oficiales)
**Síntoma:** `python .claude/hooks/...` fallaba cuando Claude no corría desde el project root
**Causa raíz:** CWD no garantizado al ser el project root
**Fix correcto:**
```json
// ❌ INCORRECTO
{"command": "python .claude/hooks/security-check.py"}

// ✅ CORRECTO
{"command": "python \"$CLAUDE_PROJECT_DIR/.claude/hooks/security-check.py\""}
```
**Regla:** Siempre usar `$CLAUDE_PROJECT_DIR` en paths de hooks en settings.json.

---

### BUG-004: Path Traversal Bloqueado con JSON en vez de exit(2)
**Descubierto:** 2025-01-30 (investigación en docs oficiales)
**Síntoma:** validate-input.py retornaba JSON con `permissionDecision: "deny"` para path traversal
**Causa raíz:** Para ataques/errores graves, exit(2) es más seguro que JSON porque no depende del parsing
**Fix correcto:**
```python
# Para path traversal (intento de seguridad)
print(f"BLOCKED: path traversal attempt: {file_path}", file=sys.stderr)
sys.exit(2)  # Bloqueo nativo, sin depender de JSON parsing

# Para archivos protegidos (legítimo pero necesita confirmación)
print(json.dumps({"hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "ask",  # Pide confirmación, no bloquea directamente
    "permissionDecisionReason": f"Archivo protegido: {file_path}"
}}))
sys.exit(0)
```
**Regla:** `exit(2)` para seguridad crítica. `permissionDecision: "ask"` para confirmación de usuario.

---

## MEJORES PRÁCTICAS CONSOLIDADAS

### Exit Codes de Hooks
| Exit code | Significado | Cuándo usar |
|-----------|-------------|-------------|
| `0` | Éxito normal | Siempre que no haya error |
| `2` | Error bloqueante | Errores críticos, path traversal, sintaxis inválida |
| Otros | Advertencia (no bloquea) | No usar — comportamiento poco predecible |

### Async Hooks
```json
// Usar async: true para operaciones que no deben bloquear a Claude
{"type": "command", "async": true, "command": "..."}

// Usar asyncRewake: true cuando quieres despertar a Claude si hay error crítico
{"type": "command", "async": true, "asyncRewake": true, "command": "..."}
```
**Regla:** Logging, quality checks, memory updates → siempre `async: true`.

### Scope de Variables de Entorno en Hooks
```python
# ✅ CORRECTO: usar env var para project root
project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())

# ✅ CORRECTO: persistir vars entre hooks en la misma sesión
env_file = os.environ.get("CLAUDE_ENV_FILE")
if env_file:
    with open(env_file, "a") as f:
        f.write(f"MY_VAR=value\n")

# ❌ INCORRECTO: asumir CWD es el project root
project_root = os.getcwd()  # Puede ser diferente en llamadas remotas
```

### additionalContext vs permissionDecision
```python
# additionalContext → info extra para Claude (en cualquier hook)
{"hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "Tienes 3 updates de memoria pendientes"
}}

# permissionDecision → solo en PreToolUse, controla si Claude puede ejecutar
{"hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",  # allow, deny, ask, defer
    "permissionDecisionReason": "Razón para el usuario"
}}
```

### Settings.json — Schema Correcto
```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": [
      "Read(./.env)",       // Sintaxis con paréntesis, no glob
      "Bash(rm -rf*)"       // asterisco sin espacio
    ]
  }
}
```

---

## LECCIONES DE INVESTIGACIÓN — Repos Trending (2025-04-13)

### Fuentes consultadas
- `forrestchang/andrej-karpathy-skills` (⭐23k) — Principios de Karpathy para LLM coding
- `shanraisshan/claude-code-best-practice` (⭐41k) — Referencia definitiva de Boris Cherny
- `gsd-build/get-shit-done` (⭐52k) — Spec-driven development para Claude Code

---

### PATTERN-001: CLAUDE.md — Bajo 200 Líneas y con `<important>` Tags
**Fuente:** claude-code-best-practice (Boris Cherny)
- CLAUDE.md debe mantenerse bajo **200 líneas** para evitar que Claude ignore instrucciones
- Reglas críticas deben envolverse en `<important if="siempre activo">` para evitar que se ignoren
- Los módulos deben tener su propio CLAUDE.md en subdirectorios (monorepos: `src/*/CLAUDE.md`)
- Usar `settings.json` para comportamiento determinístico, NO CLAUDE.md (ej: `attribution.commit: ""` es determinístico)

---

### PATTERN-002: Principios Karpathy para LLM Coding
**Fuente:** `forrestchang/andrej-karpathy-skills` (integrado en CLAUDE.md)
1. **Think Before Coding** — Enuncia suposiciones; presenta interpretaciones alternativas
2. **Simplicity First** — Mínimo código; sin features extra; sin abstracciones de uso único
3. **Surgical Changes** — Solo tocar lo pedido; no "mejorar" código adyacente
4. **Goal-Driven Execution** — Transformar tareas en metas verificables con plan breve

---

### PATTERN-003: GSD — Workflow Spec-Driven
**Fuente:** `gsd-build/get-shit-done` (instalado en `.claude/commands/gsd/`)
```
/gsd-new-project     → Inicia: preguntas → research → roadmap
/gsd-plan-phase 1    → Research + plan XML estructurado + verificación
/gsd-execute-phase 1 → Wave execution paralela con 200k tokens frescos
/gsd-verify-work 1   → Verificación manual + debug automático
/gsd-next            → Auto-detecta siguiente paso
```
**Por qué es valioso:** Elimina context rot — cada plan usa contexto limpio.

---

### PATTERN-004: Skills — Descripción como Trigger
**Fuente:** Thariq (Creator of Claude Code)
- El campo `description` es un trigger ("¿cuándo debo activarme?"), NO un resumen
- Agregar sección **Gotchas** — documenta fallos pasados del modelo
- Usar `context: fork` para subagente aislado — contexto principal solo ve resultado final

---

### ANTI-PATTERNS Descubiertos (Investigación)

| Anti-pattern | Consecuencia | Fix |
|-------------|--------------|-----|
| CLAUDE.md > 200 líneas | Instrucciones ignoradas silenciosamente | Modularizar en `.claude/rules/` |
| Reglas críticas sin `<important>` | Se omiten cuando crece el archivo | Envolver en `<important if="...">` |
| Comportamiento determinístico en CLAUDE.md | No determinístico | Mover a `settings.json` |
| Context > 50% sin /compact | Context rot — calidad degrada | /compact manual al 50% |

### .claude/rules/ — Path-Scoped Rules
Los archivos en `.claude/rules/` se cargan SOLO cuando Claude trabaja en archivos que coinciden con `paths:`:
```markdown
---
paths:
  - "src/api/**"
  - "**/*controller*"
---
# Estas reglas solo aplican al trabajar en src/api/ o controladores
```
Sin `paths:` frontmatter → aplica a TODOS los archivos siempre.

---

## ANTI-PATTERNS A EVITAR

1. **No usar `decision: "block"` en PreToolUse** — usar `hookSpecificOutput.permissionDecision: "deny"`
2. **No hacer Stop hooks que bloqueen sin `stop_hook_active` check** → bucle infinito
3. **No hardcodear paths en settings.json** → usar `$CLAUDE_PROJECT_DIR`
4. **No loggear desde hooks síncronos cuando no es necesario** → usar `async: true`
5. **No retornar JSON con `decision` en `exit(2)` cases** → son mutuamente excluyentes
6. **No poner secretos en `additionalContext`** → se inyectan en el contexto de Claude que puede loggearse

---

## FUENTES DE VERDAD

- Hooks reference: `https://code.claude.com/docs/en/hooks`
- Memory system: `https://code.claude.com/docs/en/memory`
- Settings: `https://code.claude.com/docs/en/settings`
- Sub-agents: `https://code.claude.com/docs/en/sub-agents`
- Skills: `https://code.claude.com/docs/en/skills`
- JSON Schema: `https://json.schemastore.org/claude-code-settings.json`

---

## INVESTIGACIÓN — Sesión 2025-07-18 (deep self-analysis)

### Fuentes consultadas
- Official docs: hooks, memory, settings, sub-agents, skills (code.claude.com)

---

### BUG-009: Stop Prompt Hook — Formato de Response Incorrecto
**Descubierto:** 2025-07-18 (deep analysis + official docs)
**Síntoma:** Stop hook de tipo `"prompt"` usaba `{"decision": "block", "reason": "..."}` — formato de `type: "command"` hooks
**Causa raíz:** Los hooks `type: "prompt"` tienen schema propio diferente a command hooks
**Fix correcto:**
```json
// ❌ INCORRECTO — formato de command hooks, no de prompt hooks
{"decision": "block", "reason": "tareas pendientes"}

// ✅ CORRECTO — formato para type: "prompt" hooks
{"ok": false, "reason": "tareas pendientes"}
{"ok": true}
```
**Regla:** Promise hooks usan `{"ok": true/false, "reason": "..."}`. Command hooks usan `{"decision": "block"}`.

---

### BUG-010: Stop Prompt Hook — Timeout en Segundos no Milisegundos
**Descubierto:** 2025-07-18
**Síntoma:** `"timeout": 15000` en hook de Stop — si es segundos, eso son ~250 minutos (correcto: 30s)
**Causa raíz:** La docs dicen "Seconds before canceling. Defaults: 600 for command, 30 for prompt"
**Fix correcto:**
```json
// ❌ INCORRECTO — 15000 segundos = 250 minutos
{"type": "prompt", "timeout": 15000}

// ✅ CORRECTO — 30 segundos (valor razonable para evaluación LLM)
{"type": "prompt", "timeout": 30}
```
**Regla:** El campo `timeout` en todos los hook handlers es en SEGUNDOS, no milisegundos.

---

### PATTERN-005: Subagents — Custom Agents con `memory: project`
**Fuente:** code.claude.com/docs/en/sub-agents
**Qué aprendimos:**
- Custom agents van en `.claude/agents/<name>.md` con YAML frontmatter
- Campo `memory: project` → el agente acumula conocimiento cross-session en `.claude/agent-memory/<name>/`
- Campo `tools:` = allowlist; `disallowedTools:` = denylist (más flexible)
- `isolation: worktree` → agente trabaja en copia temporal del repo (perfecta para code review)
- `background: true` → agente corre concurrentemente mientras el usuario trabaja
- `skills:` en frontmatter de subagente → inyecta skill completa en contexto del agente

**Subagentes creados en este proyecto:**
- `code-reviewer.md` — con `memory: project` para acumular patrones del codebase
- `debugger.md` — herramientas de edit para poder fijar bugs
- `security-auditor.md` — con `memory: project` para recordar vulnerabilidades pasadas
- `performance-analyst.md` — análisis de rendimiento sin modificar código

---

### PATTERN-006: Skills — YAML Frontmatter Oficial
**Fuente:** code.claude.com/docs/en/skills
**Qué aprendimos:**
- `<!-- applyTo: "..." -->` es un comentario HTML, NO YAML frontmatter oficial
- El frontmatter oficial usa `---` delimitadores con campos YAML:
  - `name:` — nombre del slash command
  - `description:` — trigger para auto-invocación (front-load el use case)
  - `paths:` — array de globs para lazy-loading por archivos
  - `allowed-tools:` — tools aprobadas sin prompt (space-separated string o YAML list)
  - `disable-model-invocation: true` — solo invocar manualmente (risky ops: release, deploy)
  - `context: fork` — corre en subagente aislado (no ve historial de conversación)
  - `agent: Explore` — tipo de subagente cuando `context: fork`
- `!`command`` o fenced ````!` blocks → inyección shell (corre antes que Claude vea el prompt)
- Supporting files en el directorio del skill → referenciar desde SKILL.md

**Skills actualizadas con frontmatter oficial:**
- code-review: `paths:`, `allowed-tools:`
- debug: `allowed-tools:`
- release: `disable-model-invocation: true`
- refactor: `disable-model-invocation: true`
- architecture: `context: fork`, `agent: Explore`
- pr-review (NEW): shell injection (`gh pr diff`), `context: fork`

---

### PATTERN-007: Hook Events Nuevos (2026 API)
**Fuente:** code.claude.com/docs/en/hooks (2025-07-18)
**Nuevos eventos disponibles que no teníamos configurados:**
| Evento | Útil para |
|--------|-----------|
| `PermissionRequest` | Auto-aprobar operaciones seguras conocidas |
| `PermissionDenied` | Logging de denegaciones del auto-mode classifier |
| `SubagentStart` | Inyectar contexto especializado a subagentes |
| `SubagentStop` | Log de finalización de agentes |
| `StopFailure` | Alertas cuando la API falla (rate limit, billing) |
| `InstructionsLoaded` | Audit log de qué instrucciones se cargan |
| `ConfigChange` | Auditoría de cambios de configuración |
| `Notification` | Interceptar y personalizar notificaciones |
| `TaskCreated/Completed` | Validar tareas en agent teams |
| `TeammateIdle` | Quality gates antes de que un teammate pare |
| `Elicitation` | Auto-responder a requests de MCP servers |
| `WorktreeCreate/Remove` | Custom worktree management (SVN, Perforce) |
| `CwdChanged` | Recargar env vars al cambiar directorio |

**Nuevos tipos de hook handlers:**
- `type: "prompt"` → LLM evalúa si bloquear (retorna `{"ok": true/false}`)
- `type: "agent"` → Subagente con tools verifica condición (retorna igual)
- `type: "http"` → POST a endpoint propio (útil para integración con Slack, PagerDuty)
- `shell: "powershell"` → Corre command hook en PowerShell en Windows

**Nuevos campos en handlers:**
- `statusMessage: "..."` → Mensaje en el spinner mientras corre el hook
- `once: true` → Corre solo una vez por sesión (solo en skills)
- `asyncRewake: true` → Async pero despierta a Claude si exit code 2
- `if: "Bash(rm *)"` → Filtro por argumentos (más preciso que matcher)

---

### PATTERN-008: Settings — Nuevas Opciones Útiles
**Fuente:** code.claude.com/docs/en/settings (2025-07-18)
| Setting | Valor | Qué hace |
|---------|-------|----------|
| `effortLevel` | `"medium"` | Persiste nivel de esfuerzo entre sesiones |
| `autoMemoryEnabled` | `true` | Claude escribe auto-memoria sobre el proyecto |
| `autoMemoryDirectory` | `"./memory/auto"` | Dónde guarda Claude sus notas automáticas |
| `includeGitInstructions` | `false` | Quitar git instructions si tienes skill de git propio |
| `cleanupPeriodDays` | `30` | Limpiar transcripts viejos |
| `spinnerVerbs` | `{mode:"append", verbs:["Analizando", "Pensando"]}` | Verbos personalizados |
| `language` | `"spanish"` | Respuestas en español por default |

**Nota:** `autoMemoryEnabled: true` activado → Claude escribe notas en `~/.claude/projects/<project>/memory/MEMORY.md`.
Primeras 200 líneas de MEMORY.md se cargan en cada sesión automáticamente.
