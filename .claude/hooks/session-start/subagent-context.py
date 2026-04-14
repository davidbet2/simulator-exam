#!/usr/bin/env python3
"""
Hook: SubagentStart — Inject Project Context
=============================================
Fires when a subagent (Task, Agent tool) starts. Injects a compact
summary of project context into the subagent via additionalContext so
it doesn't start blind.

Output format (Claude Code SubagentStart hook):
{
  "additionalContext": "...context string..."
}

The subagent receives this context merged into its initial context window.
"""
import json
import os
import sys
from pathlib import Path

PROJECT_DIR = Path(os.environ.get("CLAUDE_PROJECT_DIR", "."))
MEMORY_DIR = PROJECT_DIR / "memory"


def load_last_session_summary() -> str:
    sessions_dir = MEMORY_DIR / "sessions"
    if not sessions_dir.exists():
        return ""
    # Find the most recent session log file
    logs = sorted(sessions_dir.glob("*.log"), reverse=True)
    if not logs:
        return ""
    try:
        content = logs[0].read_text(encoding="utf-8", errors="ignore")
        # Return last 500 chars to keep context compact
        return content[-500:].strip()
    except Exception:
        return ""


def load_recent_patterns() -> str:
    patterns_dir = MEMORY_DIR / "patterns"
    if not patterns_dir.exists():
        return ""
    lines = []
    for f in sorted(patterns_dir.glob("*.md"))[:3]:  # max 3 pattern files
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
            # Only include headers (lines starting with ##) to keep it compact
            headers = [
                ln.strip()
                for ln in text.splitlines()
                if ln.startswith("##") and len(ln) < 80
            ]
            lines.extend(headers[:5])  # max 5 headers per file
        except Exception:
            pass
    return "\n".join(lines)


def load_recent_decisions() -> str:
    decisions_dir = MEMORY_DIR / "decisions"
    if not decisions_dir.exists():
        return ""
    files = sorted(decisions_dir.glob("*.md"), reverse=True)[:2]  # last 2 decisions
    summaries = []
    for f in files:
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
            # Read first 3 lines only (ADR title + status)
            lines = [ln.strip() for ln in text.splitlines() if ln.strip()][:3]
            summaries.append(" | ".join(lines))
        except Exception:
            pass
    return "\n".join(summaries)


def build_context(agent_type: str, agent_id: str) -> str:
    parts = [
        f"# Contexto del Proyecto (subagente: {agent_type} / {agent_id})",
        f"Proyecto: base-project | Ruta: {PROJECT_DIR}",
    ]

    patterns = load_recent_patterns()
    if patterns:
        parts.append(f"\n## Patrones Conocidos\n{patterns}")

    decisions = load_recent_decisions()
    if decisions:
        parts.append(f"\n## Últimas Decisiones\n{decisions}")

    last_session = load_last_session_summary()
    if last_session:
        parts.append(f"\n## Última Sesión\n{last_session}")

    parts.append(
        "\n## Reglas Críticas\n"
        "- NUNCA commitear ni pushear sin confirmación del usuario\n"
        "- No borrar archivos sin confirmación\n"
        "- Usar prepared statements o ORM para SQL\n"
        "- Nunca loggear passwords, tokens, o PII"
    )

    return "\n".join(parts)


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    agent_type = data.get("agent_type", "unknown")
    agent_id = data.get("agent_id", "?")

    # Log to stderr (visible in hook debug output)
    sys.stderr.write(f"[SubagentStart] {agent_type} (id={agent_id})\n")

    # Build and output the context injection
    context = build_context(agent_type, agent_id)
    output = {"additionalContext": context}
    print(json.dumps(output))

    sys.exit(0)


if __name__ == "__main__":
    main()
