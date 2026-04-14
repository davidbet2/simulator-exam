#!/usr/bin/env python3
"""
Hook: SessionEnd — Cleanup
===========================
Se ejecuta cuando la sesión de Claude termina (timeout, cierre manual, etc.)

IMPORTANTE: SessionEnd tiene un timeout de 1.5s por defecto.
Para tareas más largas usar: CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS=5000

Propósito:
- Mover el log de sesión actual a completados
- Limpiar archivos temporales de la sesión
- Registrar duración y estadísticas de la sesión

Protocolo Claude Code:
- SessionEnd no puede bloquear ni retornar contexto
- Solo puede ejecutar cleanup asíncrono
- exit(0) = fin normal

Ref: https://code.claude.com/docs/en/hooks#sessionend
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def finalize_daily_log() -> None:
    """Agrega un marcador de fin al log del día."""
    log_dir = Path("memory/sessions")
    log_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = log_dir / f"{today}.jsonl"

    entry = {
        "ts": datetime.now(tz=timezone.utc).isoformat(),
        "event": "session_end",
    }
    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        pass


def cleanup_temp_files() -> None:
    """Elimina archivos temporales que haya dejado la sesión."""
    patterns = ["*.tmp", "*.temp", ".claude-draft-*"]
    for pattern in patterns:
        for f in Path(".").rglob(pattern):
            # Solo limpiar fuera de node_modules y .git
            path_str = str(f)
            if "node_modules" in path_str or ".git" in path_str:
                continue
            if f.is_file():
                try:
                    f.unlink()
                except OSError:
                    pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        # SessionEnd puede recibir datos mínimos
        json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        pass

    finalize_daily_log()
    cleanup_temp_files()
    sys.exit(0)


if __name__ == "__main__":
    main()
