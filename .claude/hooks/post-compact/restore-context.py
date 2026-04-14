#!/usr/bin/env python3
"""
Hook: PostCompact — Restore Context
=====================================
Se ejecuta DESPUÉS de que Claude compacta el contexto (resumen de conversación larga).

Propósito:
- Re-inyectar información crítica que podría haberse perdido en el resumen
- Registrar el evento de compactación con el resumen generado
- Mantener continuidad de la sesión tras compactación

Protocolo Claude Code:
- Recibe: compact_summary (el resumen completo que Claude generó)
- Puede retornar: additionalContext para inyectar en el contexto nuevo
- exit(0) + JSON con additionalContext → contexto agregado tras la compactación

Ref: https://code.claude.com/docs/en/hooks#postcompact
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def load_pending_updates() -> list[dict]:
    """Carga las actualizaciones de memoria pendientes."""
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    pending_file = Path(project_root) / "memory" / "sessions" / "pending-memory-updates.jsonl"
    if not pending_file.exists():
        return []
    entries = []
    try:
        with open(pending_file, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        entries.append(json.loads(line))
                    except json.JSONDecodeError:
                        pass
    except (OSError, IOError):
        pass
    return entries


def load_last_decisions(max_items: int = 3) -> list[str]:
    """Carga las últimas decisiones arquitectónicas registradas."""
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    decisions_dir = Path(project_root) / "memory" / "decisions"
    if not decisions_dir.exists():
        return []
    files = sorted(decisions_dir.glob("*.md"), reverse=True)[:max_items]
    titles = []
    for f in files:
        if f.name == ".gitkeep":
            continue
        try:
            content = f.read_text(encoding="utf-8")
            first_line = content.split("\n")[0].lstrip("# ").strip()
            if first_line:
                titles.append(first_line)
        except (OSError, IOError):
            pass
    return titles


def save_compact_event(summary: str, session_id: str) -> None:
    """Registra el evento de compactación en el log de sesión."""
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    log_dir = Path(project_root) / "memory" / "sessions"
    log_dir.mkdir(parents=True, exist_ok=True)

    today = datetime.now().strftime("%Y-%m-%d")
    log_file = log_dir / f"{today}.jsonl"

    entry = {
        "ts": datetime.now(tz=timezone.utc).isoformat(),
        "session": session_id[:16] if session_id else "unknown",
        "event": "compact",
        "summary_length": len(summary),
    }

    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        pass

    # También guardar el resumen completo para la próxima sesión
    summaries_dir = log_dir / "compact-summaries"
    summaries_dir.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
    summary_file = summaries_dir / f"{ts}.md"
    try:
        with open(summary_file, "w", encoding="utf-8") as f:
            f.write(f"# Compact Summary — {ts}\n\n{summary}\n")
    except (OSError, IOError):
        pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    compact_summary: str = data.get("compact_summary", "")
    session_id: str = data.get("session_id", "unknown")

    # Guardar el evento de compactación
    save_compact_event(compact_summary, session_id)

    # Construir contexto post-compactación
    context_parts: list[str] = []

    # 1. Informar que hubo compactación
    context_parts.append("[post-compact] El contexto fue compactado. Resumen guardado en memory/sessions/compact-summaries/.")

    # 2. Inyectar actualizaciones de memoria pendientes
    pending = load_pending_updates()
    if pending:
        recent = pending[-3:]  # Solo los últimos 3
        items = "; ".join(e.get("suggestion", str(e)) for e in recent)
        context_parts.append(f"[post-compact] {len(pending)} actualizaciones de memoria pendientes. Recientes: {items[:300]}")

    # 3. Inyectar decisiones arquitectónicas recientes
    decisions = load_last_decisions()
    if decisions:
        context_parts.append(f"[post-compact] Decisiones arquitectónicas recientes: {', '.join(decisions)}")

    if context_parts:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PostCompact",
                "additionalContext": "\n".join(context_parts)
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
