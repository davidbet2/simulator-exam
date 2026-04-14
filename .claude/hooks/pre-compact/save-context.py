#!/usr/bin/env python3
"""
Hook: PreCompact — Save Context
================================
Se ejecuta justo ANTES de que Claude compacte la conversación.
La compactación resume el historial para liberar tokens, pero puede
perder contexto crítico que necesitamos preservar.

Este hook extrae y guarda:
- URLs de archivos modificados en la sesión
- Decisiones tomadas (detectadas en el log de actividad)
- Estado actual de tareas (si hay un todo list activo)

El archivo generado es leído al inicio de la siguiente sesión
para restaurar contexto perdido en la compactación.

Protocolo Claude Code Hooks:
- PreCompact: Recibe JSON con metadatos de la sesión actual
- No puede bloquear la compactación
- Siempre exit(0)
"""
import json
import sys
import os
from datetime import datetime


def load_session_log() -> list[dict]:
    """Lee el log de actividad de hoy."""
    today = datetime.now().strftime("%Y-%m-%d")
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    log_file = os.path.join(project_root, "memory", "sessions", f"{today}.jsonl")

    if not os.path.exists(log_file):
        return []

    entries = []
    try:
        with open(log_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        entries.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
    except (OSError, IOError):
        pass

    return entries


def extract_modified_files(entries: list[dict]) -> list[str]:
    """Extrae archivos únicos que fueron modificados en la sesión."""
    files = []
    for entry in entries:
        if entry.get("tool") in ("Write", "Edit", "MultiEdit"):
            summary = entry.get("input_summary", "")
            # Extraer ruta de archivo del summary si está disponible
            if "file_path" in summary or ".py" in summary or ".md" in summary:
                files.append(summary[:100])
    return list(set(files))[:20]  # Máximo 20 archivos


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        data = {}

    session_id: str = data.get("session_id", "unknown")
    entries = load_session_log()
    modified_files = extract_modified_files(entries)

    total_tools = len(entries)
    errors = sum(1 for e in entries if not e.get("success", True))

    # Generar snapshot de contexto pre-compactación
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    context_dir = os.path.join(project_root, "memory", "sessions")
    os.makedirs(context_dir, exist_ok=True)

    snapshot_file = os.path.join(
        context_dir,
        f"pre-compact-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    )

    content = f"""# Contexto Pre-Compactación

- **Sesión:** {session_id[:16]}
- **Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Total tool calls:** {total_tools}
- **Errores detectados:** {errors}

## Archivos Modificados en Esta Sesión

{chr(10).join(f'- {f}' for f in modified_files) if modified_files else '- (ninguno detectado)'}

## Notas para Sesión Siguiente

> Este archivo fue generado automáticamente antes de una compactación.
> Revisar memory/sessions/pending-memory-updates.jsonl para actualizaciones pendientes.
"""

    try:
        with open(snapshot_file, "w", encoding="utf-8") as f:
            f.write(content)
    except (OSError, IOError):
        pass

    # Instruir a Claude sobre qué priorizar en el resumen
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreCompact",
            "customInstructions": (
                "Al resumir, PRIORIZA preservar: "
                "(1) decisiones arquitectónicas y su justificación, "
                "(2) bugs encontrados y sus fixes, "
                "(3) estado actual de tareas pendientes, "
                "(4) nombres de archivos críticos modificados. "
                "No omitas información de seguridad."
            )
        }
    }))
    sys.exit(0)


if __name__ == "__main__":
    main()
