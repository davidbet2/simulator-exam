---
name: ensure-tools
description: Verifies if a required CLI tool is installed and offers to install it. Use when about to execute a command whose binary might not be installed. Trigger: "¿tienes X instalado?", "instala Y si no está", "check dependencies", "setup environment".
user-invocable: false
allowed-tools: Bash(where *) Bash(which *) Bash(winget *) Bash(brew *) Bash(apt *) Bash(node --version) Bash(python --version) Bash(git --version)
---

# Skill: Ensure Tools

## Trigger

Activar cuando necesites verificar si una herramienta, CLI o runtime está disponible antes de usarla.

También activarlo automáticamente cuando vayas a ejecutar un comando cuyo binario podría no estar instalado.

---

## Proceso

### Paso 1: Detectar si la herramienta está disponible

```bash
# Windows (PowerShell)
Get-Command <tool> -ErrorAction SilentlyContinue

# Unix/macOS
which <tool> 2>/dev/null || command -v <tool> 2>/dev/null
```

### Paso 2: Si NO está instalada — preguntar al usuario

**Nunca instalar sin confirmación explícita.** Presentar:

```
❓ [tool] no está instalado en tu sistema.
¿Deseas que lo instale ahora?

  [S] Sí, instalar automáticamente
  [N] No, lo instalaré manualmente
  [I] Ver instrucciones de instalación manual

⚠️  Nota: La instalación requiere permisos de administrador / internet.
```

### Paso 3: Si el usuario confirma — instalar con el gestor correcto

| Herramienta       | Windows                              | macOS                  | Linux (Debian/Ubuntu)     |
|-------------------|--------------------------------------|------------------------|---------------------------|
| Node.js / npm     | `winget install OpenJS.NodeJS`       | `brew install node`    | `apt install nodejs npm`  |
| Python            | `winget install Python.Python.3`     | `brew install python`  | `apt install python3 pip3`|
| Git               | `winget install Git.Git`             | `brew install git`     | `apt install git`         |
| Docker            | `winget install Docker.DockerDesktop`| `brew install --cask docker` | [Instrucciones Docker] |
| pnpm              | `npm install -g pnpm`                | `npm install -g pnpm`  | `npm install -g pnpm`     |
| Bun               | `npm install -g bun`                 | `brew install bun`     | `curl -fsSL https://bun.sh/install \| bash` |
| uv (Python)       | `pip install uv`                     | `brew install uv`      | `pip install uv`           |
| ruff              | `pip install ruff`                   | `brew install ruff`    | `pip install ruff`         |
| jq                | `winget install jqlang.jq`           | `brew install jq`      | `apt install jq`           |

### Paso 4: Post-instalación — verificar

```bash
<tool> --version
```

Si la verificación falla: advertir que puede necesitar reiniciar la terminal (PATH no recargado).

---

## Instalaciones que NUNCA se hacen sin confirmación

- `sudo` / instalaciones globales de sistema
- Modificar `PATH`, `.bashrc`, `.zshrc`, `.profile`
- Instalar gestores de paquetes (Homebrew, Chocolatey, winget)
- Instalar Docker o runtimes de VM
- Instalar extensiones globales de npm/pip

---

## Formato de Salida al Usuario

```
🔍 Verificando herramientas necesarias...

❌ [tool-name] (v[min-version]+) — No encontrado
✅ [other-tool] v[version] — OK

---
Para continuar necesito instalar: [tool-name]

Comando de instalación para [OS detectado]:
  [comando]

¿Procedo con la instalación? [S/N]
```

---

## ⚠️ Gotchas

- **No asumir el OS** — Siempre detectar antes de sugerir un comando.
- **Versiones mínimas** — Verificar la versión instalada, no solo la existencia.
- **PATH no actualizado** — Después de instalar en Windows, puede requerir nueva terminal.
- **Virtualenvs Python** — No instalar paquetes Python globalmente si existe `pyproject.toml`.
