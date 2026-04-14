#!/usr/bin/env python3
"""
Hook: PostToolUse — Update Memory (Claudemem/Engram Integration)
=================================================================
Detecta cuando Claude realiza cambios significativos y genera
sugerencias para actualizar memory/patterns/.

Heurísticas para "cambio significativo":
- Se creó/modificó un archivo de arquitectura
- Se ejecutó un refactoring
- Se tomó una decisión en docs/decisions/
- Se modificó configuración crítica

No escribe en memoria directamente (eso lo hace Claude con contexto)
sino que genera un archivo de sugerencia que Claude puede revisar.

Protocolo Claude Code Hooks:
- Recibe JSON por stdin con: tool_name, tool_input, tool_response, session_id
- PostToolUse — no bloquea, siempre exit(0)
"""
import json
import sys
import os
from datetime import datetime


# Rutas que indican cambios arquitectónicos relevantes para memoria
SIGNIFICANT_PATHS: list[str] = [
    "docs/decisions/",
    "docs/architecture",
    "CLAUDE.md",
    "src/",
    ".claude/skills/",
]

# Tools cuyas escrituras son más relevantes para la memoria
SIGNIFICANT_TOOLS: tuple[str, ...] = ("Write", "Edit", "MultiEdit")


def is_significant_change(tool_name: str, tool_input: dict) -> tuple[bool, str]:
    """
    Determina si el cambio merece ser recordado.
    Retorna (es_significativo, razón).
    """
    if tool_name not in SIGNIFICANT_TOOLS:
        return False, ""

    file_path: str = tool_input.get("file_path", tool_input.get("path", ""))
    if not file_path:
        return False, ""

    normalized = file_path.replace("\\", "/")
    for sig_path in SIGNIFICANT_PATHS:
        if sig_path in normalized:
            return True, f"Archivo en ruta arquitectónica: {file_path}"

    return False, ""


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    tool_name: str = data.get("tool_name", "")
    tool_input: dict = data.get("tool_input", {})

    significant, reason = is_significant_change(tool_name, tool_input)

    if not significant:
        sys.exit(0)

    # Escribir sugerencia de actualización de memoria
    suggestions_dir = os.path.join("memory", "sessions")
    os.makedirs(suggestions_dir, exist_ok=True)

    suggestion_file = os.path.join(suggestions_dir, "pending-memory-updates.jsonl")

    entry = {
        "ts": datetime.utcnow().isoformat(),
        "tool": tool_name,
        "file": tool_input.get("file_path", tool_input.get("path", "")),
        "reason": reason,
        "action": "Revisar si este cambio debe registrarse en memory/patterns/ o memory/decisions/",
        "processed": False,
    }

    try:
        with open(suggestion_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
