#!/usr/bin/env python3
"""
Hook: SessionStart — Context Injector
======================================
Se ejecuta al INICIO de cada sesión (startup, resume, clear, compact).

Funciones:
1. Inyectar contexto del proyecto en la sesión
2. Cargar variables de entorno si hay direnv o .env
3. Notificar actualizaciones de memoria pendientes
4. Detectar si es un proyecto existente que necesita setup

Protocolo Claude Code:
- SessionStart solo soporta type: "command"
- Stdout (texto plano o JSON con additionalContext) se inyecta como contexto para Claude
- CLAUDE_ENV_FILE disponible para persistir variables de entorno

Ref: https://code.claude.com/docs/en/hooks#sessionstart
"""
import json
import sys
import os
from datetime import datetime
from pathlib import Path


def load_pending_count() -> int:
    """Cuenta actualizaciones de memoria pendientes."""
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    pending_file = Path(project_root) / "memory" / "sessions" / "pending-memory-updates.jsonl"
    if not pending_file.exists():
        return 0
    count = 0
    try:
        for line in pending_file.read_text(encoding="utf-8").splitlines():
            try:
                entry = json.loads(line.strip())
                if not entry.get("processed", True):
                    count += 1
            except json.JSONDecodeError:
                continue
    except (OSError, IOError):
        pass
    return count


def get_last_session_summary() -> str | None:
    """Lee el último resumen de sesión si existe."""
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    sessions_dir = Path(project_root) / "memory" / "sessions"
    if not sessions_dir.exists():
        return None

    summaries = sorted(sessions_dir.glob("summary-*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not summaries:
        return None

    try:
        content = summaries[0].read_text(encoding="utf-8")
        # Solo las primeras 20 líneas para no consumir demasiado contexto
        lines = content.splitlines()[:20]
        return "\n".join(lines)
    except (OSError, IOError):
        return None


def setup_env_file() -> None:
    """Persiste variables de entorno del proyecto si hay .env."""
    env_file = os.environ.get("CLAUDE_ENV_FILE")
    if not env_file:
        return

    # Detectar si hay .env o .envrc y exportar vars seguras (no secrets)
    project_root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
    project_env = Path(project_root) / ".env"
    if project_env.exists():
        try:
            content = project_env.read_text(encoding="utf-8")
            safe_vars = []
            for line in content.splitlines():
                line = line.strip()
                # Solo exportar vars no sensibles (sin password, secret, key, token)
                if line and not line.startswith("#") and "=" in line:
                    var_name = line.split("=")[0].lower()
                    sensitive_words = ("password", "secret", "key", "token", "credential", "api_key")
                    if not any(s in var_name for s in sensitive_words):
                        safe_vars.append(f"export {line}")

            if safe_vars:
                with open(env_file, "a", encoding="utf-8") as f:
                    f.write("\n".join(safe_vars) + "\n")
        except (OSError, IOError):
            pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        data = {}

    source: str = data.get("source", "startup")

    # Persistir entorno
    setup_env_file()

    # Construir contexto adicional
    context_parts: list[str] = []

    # 1. Estado de memoria pendiente
    pending = load_pending_count()
    if pending > 0:
        context_parts.append(
            f"⚠️ HAY {pending} ACTUALIZACIONES DE MEMORIA PENDIENTES. "
            f"Ejecutar `/memory-sync` cuando sea conveniente."
        )

    # 2. Resumen de última sesión (solo en resume/compact para no repetir)
    if source in ("resume", "compact"):
        last_summary = get_last_session_summary()
        if last_summary:
            context_parts.append(f"RESUMEN DE SESIÓN ANTERIOR:\n{last_summary}")

    # 3. Verificar si el proyecto tiene setup básico completo
    missing_setup: list[str] = []
    if not Path(".env").exists() and Path(".env.example").exists():
        missing_setup.append(".env no configurado (usa .env.example como base)")
    if not Path("memory/sessions").exists():
        missing_setup.append("Directorio memory/ no inicializado (ejecutar setup.py)")

    if missing_setup:
        context_parts.append("SETUP PENDIENTE: " + " | ".join(missing_setup))

    if context_parts:
        context_text = "\n\n".join(context_parts)
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "SessionStart",
                "additionalContext": context_text
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
