#!/usr/bin/env python3
"""
Hook: PreToolUse — Validate Input (Write/Edit/MultiEdit)
=========================================================
Valida rutas de archivos antes de escrituras para prevenir:
- Escrituras fuera del workspace actual (path traversal)
- Modificación de archivos críticos del sistema
- Archivos con extensiones de certificados/claves

Protocolo Claude Code Hooks (correcto para PreToolUse):
- Usar hookSpecificOutput.permissionDecision: "deny" para bloquear
- Usar hookSpecificOutput.permissionDecision: "ask" para pedir confirmación
- exit(0) + JSON → decisión estructurada
- exit(2) + stderr → bloqueo alternativo con mensaje a Claude
"""
import json
import sys
import os
from pathlib import Path

# Archivos que deben ser modificados con consciencia (se usa "ask", no "deny")
PROTECTED_FILES: list[str] = [
    ".claude/settings.json",
    "CLAUDE.md",
    ".gitignore",
]

# Archivos que NUNCA deben modificarse vía IA
NEVER_MODIFY: list[str] = [
    ".env",
    "managed-settings.json",
]

# Extensiones de archivos sensibles que nunca se deben tocar
SENSITIVE_EXTENSIONS: tuple[str, ...] = (
    ".pem", ".key", ".p12", ".pfx", ".crt", ".cert",
)

def is_path_safe(file_path: str, workspace_root: str) -> bool:
    """Verifica que la ruta no haga path traversal fuera del workspace."""
    try:
        resolved = Path(file_path).resolve()
        workspace = Path(workspace_root).resolve()
        return resolved.is_relative_to(workspace)  # Python 3.9+ — funciona en Windows y Unix
    except (OSError, ValueError):
        return False

def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    tool_name: str = data.get("tool_name", "")
    tool_input: dict = data.get("tool_input", {})

    file_path: str = tool_input.get("file_path", tool_input.get("path", ""))

    if not file_path:
        sys.exit(0)

    workspace_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())

    # 1. Verificar path traversal
    if not is_path_safe(file_path, workspace_root):
        print(
            f"[validate-input] Path traversal detectado.\n"
            f"La ruta '{file_path}' apunta fuera del workspace.\n"
            f"Workspace: {workspace_root}",
            file=sys.stderr,
        )
        sys.exit(2)  # exit(2) → Claude recibe el stderr como error bloqueante

    normalized = file_path.replace("\\", "/")

    # 2. Archivos que NUNCA deben modificarse
    for protected in NEVER_MODIFY:
        if normalized.endswith(protected) or os.path.basename(normalized) == protected:
            print(json.dumps({
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": (
                        f"El archivo '{file_path}' no puede modificarse vía IA.\n"
                        f"Edítalo directamente en el editor."
                    )
                }
            }))
            sys.exit(0)

    # 3. Extensiones sensibles
    if file_path.lower().endswith(SENSITIVE_EXTENSIONS):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"Archivo con extensión sensible: '{file_path}'.\n"
                    f"Los archivos de certificados/claves no deben modificarse mediante IA."
                )
            }
        }))
        sys.exit(0)

    # 4. Archivos protegidos → pedir confirmación (ask, no deny)
    for protected in PROTECTED_FILES:
        if protected in normalized or normalized.endswith(protected):
            print(json.dumps({
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "ask",
                    "permissionDecisionReason": (
                        f"'{file_path}' es un archivo crítico del proyecto.\n"
                        f"¿Confirmas que quieres modificarlo?"
                    )
                }
            }))
            sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
