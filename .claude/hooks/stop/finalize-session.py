#!/usr/bin/env python3
"""
Hook: Stop — Finalize Session
==============================
Se ejecuta cuando Claude termina su turno.

El hook Stop puede:
- Permitir que Claude pare (exit 0, sin decision)
- Bloquear que Claude pare para que continúe trabajando:
  {"decision": "block", "reason": "..."}  ← CORRECTO para Stop
  exit(2) + stderr                         ← también válido

IMPORTANTE: `stop_hook_active` indica si claude ya está siendo
retenido por este hook. Verificar para evitar bucles infinitos.

Responsabilidades:
1. Escribir resumen de sesión en memory/sessions/
2. Marcar sugerencias de memoria como pendientes
3. Preparar contexto para la próxima sesión
"""
import json
import sys
import os
from datetime import datetime


def load_session_log_stats(today: str) -> dict:
    """Calcula estadísticas básicas del log de hoy."""
    log_file = os.path.join("memory", "sessions", f"{today}.jsonl")

    if not os.path.exists(log_file):
        return {"total": 0, "errors": 0, "tools_used": []}

    total = 0
    errors = 0
    tools: dict[str, int] = {}

    try:
        with open(log_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                    total += 1
                    if not entry.get("success", True):
                        errors += 1
                    tool = entry.get("tool", "unknown")
                    tools[tool] = tools.get(tool, 0) + 1
                except json.JSONDecodeError:
                    continue
    except (OSError, IOError):
        pass

    top_tools = sorted(tools.items(), key=lambda x: x[1], reverse=True)[:5]
    return {
        "total": total,
        "errors": errors,
        "tools_used": [f"{t}({c})" for t, c in top_tools],
    }


def count_pending_memory_updates() -> int:
    pending_file = os.path.join("memory", "sessions", "pending-memory-updates.jsonl")
    if not os.path.exists(pending_file):
        return 0
    count = 0
    try:
        with open(pending_file, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    entry = json.loads(line.strip())
                    if not entry.get("processed", True):
                        count += 1
                except json.JSONDecodeError:
                    continue
    except (OSError, IOError):
        pass
    return count


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        data = {}

    # CRÍTICO: Verificar stop_hook_active para evitar bucles infinitos
    stop_hook_active: bool = data.get("stop_hook_active", False)
    if stop_hook_active:
        # Ya estamos en un ciclo de stop hook → dejar parar
        sys.exit(0)

    stop_reason: str = data.get("stop_reason", "unknown")
    session_id: str = data.get("session_id", "unknown")

    today = datetime.now().strftime("%Y-%m-%d")
    stats = load_session_log_stats(today)
    pending_updates = count_pending_memory_updates()

    session_dir = os.path.join("memory", "sessions")
    os.makedirs(session_dir, exist_ok=True)

    summary_path = os.path.join(
        session_dir,
        f"summary-{datetime.now().strftime('%Y%m%d-%H%M%S')}.md"
    )

    pending_note = ""
    if pending_updates > 0:
        pending_note = (
            f"\n## ⚠️ Actualizaciones de Memoria Pendientes\n\n"
            f"Hay **{pending_updates}** cambios en `memory/sessions/pending-memory-updates.jsonl` "
            f"que podrían merecer ser registrados en `memory/patterns/` o `memory/decisions/`.\n\n"
            f"Ejecutar al inicio de la próxima sesión: `/memory-sync`\n"
        )

    summary = f"""# Resumen de Sesión

- **ID:** {session_id[:16]}
- **Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- **Stop reason:** {stop_reason}

## Estadísticas

| Métrica             | Valor |
|---------------------|-------|
| Total tool calls    | {stats['total']} |
| Errores             | {stats['errors']} |
| Herramientas usadas | {', '.join(stats['tools_used']) or 'ninguna'} |
{pending_note}
---
*Generado automáticamente por .claude/hooks/stop/finalize-session.py*
"""

    try:
        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(summary)
    except (OSError, IOError):
        pass

    # Dejar que Claude pare normalmente
    sys.exit(0)


if __name__ == "__main__":
    main()
