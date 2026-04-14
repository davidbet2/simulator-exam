#!/usr/bin/env python3
"""
Hook: PostToolUse — Log Activity (Caveman Integration)
======================================================
Loggea cada tool call a memory/sessions/ en formato JSONL.
Actúa como integración con Caveman MCP para observabilidad completa.

Los logs permiten:
- Debuggear cadenas de tool calls que fallan
- Auditar qué acciones tomó Claude en una sesión
- Alimentar análisis de patrones en memory/patterns/

Protocolo Claude Code Hooks:
- Recibe JSON por stdin con: tool_name, tool_input, tool_response, session_id
- No bloquea (es PostToolUse) — solo observa y loggea
- Siempre exit(0)
"""
import json
import sys
import os
from datetime import datetime, timezone


MAX_CONTENT_LENGTH = 500  # Truncar contenidos largos para no llenar disco


def truncate(value: object, max_len: int = MAX_CONTENT_LENGTH) -> str:
    """Convierte a string y trunca si es necesario."""
    text = str(value)
    if len(text) > max_len:
        return text[:max_len] + f"... [truncado, total: {len(text)} chars]"
    return text


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    tool_name: str = data.get("tool_name", "unknown")
    tool_input: dict = data.get("tool_input", {})
    tool_response: object = data.get("tool_response", {})
    session_id: str = data.get("session_id", "unknown")

    # Detectar éxito/fallo básico en la respuesta
    response_str = str(tool_response).lower()
    is_error = any(kw in response_str for kw in ("error", "exception", "failed", "traceback"))

    entry = {
        "ts": datetime.now(tz=timezone.utc).isoformat(),
        "session": session_id[:16] if session_id else "unknown",
        "tool": tool_name,
        "input_summary": truncate(tool_input),
        "success": not is_error,
    }

    # Agregar detalle extra para errores (útil para debug post-mortem)
    if is_error:
        entry["error_hint"] = truncate(tool_response, 300)

    log_dir = os.path.join("memory", "sessions")
    os.makedirs(log_dir, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = os.path.join(log_dir, f"{today}.jsonl")

    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        # El logging falla silenciosamente para no interrumpir el flujo
        pass

    sys.exit(0)


if __name__ == "__main__":
    main()
