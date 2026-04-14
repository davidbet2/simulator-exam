# Runbook: Operaciones Comunes

> Guía de referencia rápida para las operaciones más frecuentes en este proyecto.
> Cada procedimiento tiene criterio de éxito explícito y cómo revertir si algo falla.

---

## 1. Iniciar una Nueva Sesión de Trabajo

**Cuándo usar:** Al inicio de cualquier sesión de desarrollo.

**Pasos:**
```bash
# 1. Verificar estado del repositorio
git status
git log --oneline -5

# 2. Verificar que los hooks responden
node .claude/hooks/gsd-statusline.js

# 3. (Opcional) Ejecutar health-check completo
# Decirle a Claude: "ejecuta el health-check"
```

**Criterio de éxito:** `git status` muestra rama limpia o cambios esperados.

---

## 2. Agregar un Nuevo Hook

**Cuándo usar:** Necesitas interceptar un nuevo evento del ciclo de vida de Claude.

**Pasos:**
1. Crear el script en `.claude/hooks/<event>/<nombre>.py`
2. Seguir el patrón `fail-open`: siempre `sys.exit(0)` en caso de error
3. Agregar el hook en `.claude/settings.json` bajo el evento correspondiente
4. Usar `run-python.js` como runner:
   ```json
   "command": "node \"$CLAUDE_PROJECT_DIR/.claude/hooks/run-python.js\" \"$CLAUDE_PROJECT_DIR/.claude/hooks/<event>/<nombre>.py\""
   ```
5. Validar el JSON de settings:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('JSON OK')"
   ```

**Criterio de éxito:** `node -e` no lanza error. Hook aparece en el evento correcto.

**Revertir:** Eliminar la entrada del hook en settings.json y borrar el archivo `.py`.

---

## 3. Agregar un Nuevo Agente Sub-Especializado

**Cuándo usar:** Necesitas un agente con contexto y herramientas específicas.

**Pasos:**
1. Crear `.claude/agents/<nombre>.md` con frontmatter:
   ```yaml
   ---
   name: <nombre>
   description: <descripción concisa para el orchestrator>
   tools: Read, Grep, Glob, Bash
   model: sonnet
   memory: project   # solo si necesita contexto del repo
   # isolation: worktree  # descomentar si hace operaciones destructivas
   ---
   ```
2. Escribir las instrucciones del agente en el body del archivo
3. Documentar en `memory/decisions/ADR-XXX.md` por qué se creó este agente

**Criterio de éxito:** El agente aparece en la lista de agentes disponibles en Claude Code.

---

## 4. Actualizar un Skill Existente

**Cuándo usar:** Mejoras o correcciones a skills en `.claude/skills/`.

**Pasos:**
1. Leer el `SKILL.md` actual para entender el frontmatter y estructura
2. Editar solo lo necesario (no refactorizar partes no relacionadas)
3. Verificar que el frontmatter YAML sigue siendo válido:
   ```bash
   # Los skills tienen frontmatter entre --- ... ---
   # Verificar que no hay tabs (solo espacios) en el YAML
   ```
4. Si se agregan nuevos triggers, actualizar `enrich-prompt.py`:
   - Agregar keywords a `SKILL_TRIGGERS` en `.claude/hooks/user-prompt/enrich-prompt.py`

**Criterio de éxito:** Claude sugiere el skill cuando se usan las keywords del trigger.

---

## 5. Crear una Nueva Regla de Proyecto

**Cuándo usar:** Necesitas que Claude siga reglas específicas para ciertos archivos.

**Pasos:**
1. Crear `.claude/rules/<nombre>.md` con frontmatter `paths:`
2. Formato:
   ```markdown
   ---
   paths: src/modules/**, **/*module*
   ---
   # Reglas para Módulos
   ...
   ```
3. Las reglas sin `paths:` se aplican a TODOS los archivos (usar con cuidado)
4. Documentar en CLAUDE.md si la regla es importante a nivel proyecto

**Criterio de éxito:** Las reglas se cargan automáticamente cuando Claude trabaja en los paths correspondientes.

---

## 6. Debug de un Hook que no Funciona

**Cuándo usar:** Un hook no se dispara o produce errores.

**Pasos:**
1. Verificar que el JSON de settings.json es válido:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8')); console.log('OK')"
   ```
2. Probar el hook directamente:
   ```bash
   # Para hooks Python (via run-python.js)
   echo '{"tool_input":{"command":"ls"}}' | node .claude/hooks/run-python.js .claude/hooks/pre-tool-use/security-check.py
   
   # Para hooks Node.js
   echo '{}' | node .claude/hooks/gsd-statusline.js
   ```
3. Revisar logs de sesión en `memory/sessions/`
4. Activar Caveman MCP para trazabilidad completa de tool calls

**Criterio de éxito:** El hook produce la salida esperada cuando se invoca directamente.

---

## 7. Registrar una Nueva Decisión Arquitectónica

**Cuándo usar:** Se toma una decisión importante de diseño o arquitectura.

**Pasos:**
1. Crear `memory/decisions/ADR-XXX-titulo.md` (incrementar numero)
2. Usar esta plantilla:
   ```markdown
   # ADR-XXX: Título de la Decisión
   
   **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-YYY
   **Date:** YYYY-MM
   **Deciders:** <nombres>
   
   ## Contexto
   Por qué fue necesaria esta decisión.
   
   ## Decisión
   Qué se decidió exactamente.
   
   ## Consecuencias
   ✅ Beneficios
   ⚠️ Trade-offs
   
   ## Alternativas Rechazadas
   Qué se consideró y por qué se descartó.
   ```

**Criterio de éxito:** El archivo existe en `memory/decisions/` y tiene todos los campos completos.

---

## 8. Validar Seguridad Antes de un Release

**Cuándo usar:** Antes de cualquier release a producción o push a main/master.

**Pasos:**
```bash
# 1. Escanear secretos hardcodeados
git grep -n "password\s*=\s*['\"]" -- '*.py' '*.js' '*.ts' '*.env'
git grep -n "api_key\s*=\s*['\"]" -- '*.py' '*.js' '*.ts'
git grep -n "secret\s*=\s*['\"]" -- '*.py' '*.js' '*.ts'

# 2. Verificar no hay .env commitado
git ls-files | grep -E "\.env$|\.env\."

# 3. Ejecutar security-auditor subagent
# Decirle a Claude: "@security-auditor revisa el código para release"

# 4. Revisar CI/CD
# Ver .github/workflows/ci.yml para los checks automatizados
```

**Criterio de éxito:** Ningún secreto encontrado. CI pasa. security-auditor no reporta issues críticos.

---

*Última actualización: 2025-07*
