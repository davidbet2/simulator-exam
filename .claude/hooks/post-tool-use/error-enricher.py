#!/usr/bin/env python3
"""
Hook: PostToolUseFailure — Error Enricher
==========================================
Se ejecuta cuando un tool call FALLA (errores, exit codes no-0 en Bash, etc.)

Propósito:
- Agregar contexto adicional para que Claude pueda recuperarse del error
- Detectar patrones de error conocidos y sugerir soluciones
- Registrar fallos para análisis post-sesión

Protocolo Claude Code:
- PostToolUseFailure recibe: tool_name, tool_input, error, is_interrupt
- Puede: agregar additionalContext (NO puede bloquear — ya falló)
- exit(0) + JSON con additionalContext → Claude recibe sugerencias de recuperación

Ref: https://code.claude.com/docs/en/hooks#posttoolusefailure
"""
import json
import sys
import os
from datetime import datetime, timezone
from pathlib import Path


# Patrones de error conocidos con sugerencias de solución
ERROR_PATTERNS: list[tuple[str, str]] = [
    ("command not found", "El comando no está instalado o no está en PATH. Verificar instalación."),
    ("permission denied", "Sin permisos para ejecutar. Puede requerir sudo o cambiar permisos del archivo."),
    ("no such file or directory", "El archivo o directorio no existe. Verificar la ruta."),
    ("ENOENT", "Archivo no encontrado (Node.js). Verificar que la ruta existe."),
    ("modulenotfounderror", "Módulo Python no instalado. Ejecutar: pip install <módulo>"),
    ("cannot find module", "Módulo Node.js no instalado. Ejecutar: npm install <módulo>"),
    ("syntax error", "Error de sintaxis en el código. Revisar la línea indicada."),
    ("connection refused", "Servicio no disponible. Verificar que el servidor está corriendo."),
    ("timeout", "Operación expiró. Puede ser red lenta o proceso largo."),
    ("out of memory", "Sin memoria suficiente. Reducir el tamaño de los datos o liberar memoria."),
    ("git: not a git repository", "No es un repositorio git. Ejecutar: git init"),
    ("merge conflict", "Hay conflictos de merge. Resolver manualmente y hacer commit."),
    ("cannot read property", "Null/undefined access (JS). Verificar que el objeto existe antes de acceder."),
    ("attributeerror", "Acceso a atributo en None (Python). Verificar que el objeto no es None."),
]


def get_error_hint(error: str) -> str | None:
    """Busca sugerencias basadas en el mensaje de error."""
    error_lower = error.lower()
    for pattern, hint in ERROR_PATTERNS:
        if pattern in error_lower:
            return hint
    return None


def log_failure(tool_name: str, error: str, session_id: str) -> None:
    """Registra el fallo en el log de sesión."""
    log_dir = Path("memory/sessions")
    log_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = log_dir / f"{today}.jsonl"

    entry = {
        "ts": datetime.now(tz=timezone.utc).isoformat(),
        "session": session_id[:16] if session_id else "unknown",
        "tool": tool_name,
        "success": False,
        "error": error[:200],  # Truncar para no llenar disco
    }

    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    tool_name: str = data.get("tool_name", "unknown")
    error: str = data.get("error", "")
    session_id: str = data.get("session_id", "unknown")
    is_interrupt: bool = data.get("is_interrupt", False)

    # No hacer nada si fue una interrupción del usuario
    if is_interrupt:
        sys.exit(0)

    # Registrar el fallo
    log_failure(tool_name, error, session_id)

    # Buscar sugerencia de recuperación
    hint = get_error_hint(error)
    if hint:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostToolUseFailure",
                "additionalContext": f"[error-enricher] Sugerencia de recuperación: {hint}"
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
