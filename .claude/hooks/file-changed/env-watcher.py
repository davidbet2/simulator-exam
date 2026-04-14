#!/usr/bin/env python3
"""
Hook: FileChanged — .env Watcher
==================================
Detecta cuando archivos críticos de configuración cambian en disco.

Este hook NO está en el settings.json por defecto — es opcional.
Para activarlo, agregar a settings.json:
  "FileChanged": [{"if": "**/.env*", "hooks": [{"type": "command", ...}]}]

Propósito:
- Cuando .env cambia: avisar a Claude que puede haber nuevas variables
- Cuando CLAUDE.md cambia: recordar que el contexto base fue modificado
- Cuando package.json / pyproject.toml cambian: avisar de dependencias nuevas

Protocolo Claude Code:
- FileChanged recibe: file_path, change_type (created/modified/deleted)
- Puede retornar: additionalContext con el nuevo valor de vars seguras
- NO exponer valores de secretos — solo names de variables nuevas/cambiadas

Ref: https://code.claude.com/docs/en/hooks#filechanged
"""
import json
import os
import sys
from pathlib import Path
import re


# Variables que NO son secretos y se pueden reportar sus valores
SAFE_VAR_PREFIXES = (
    "APP_", "NODE_ENV", "PYTHON_ENV", "LOG_", "DEBUG",
    "PORT", "HOST", "TIMEOUT", "MAX_", "MIN_", "ENABLE_",
    "FEATURE_", "PUBLIC_", "BASE_URL",
)

# Patrones de línea que contienen secretos (nunca reportar valor)
SECRET_PATTERNS = [
    re.compile(p, re.IGNORECASE)
    for p in [
        r"(password|passwd|secret|api_key|token|private_key|credential|auth)",
        r"(database_url|db_url|conn_str|connection_string)",
        r"(aws_|gcp_|azure_)",
        r"(_key=|_secret=|_password=|_token=)",
    ]
]


def is_secret_var(var_name: str) -> bool:
    return any(p.search(var_name) for p in SECRET_PATTERNS)


def parse_env_keys(file_path: Path) -> tuple[list[str], list[str]]:
    """Parsea un .env y separa variables seguras de secretas."""
    safe_vars: list[str] = []
    secret_vars: list[str] = []

    try:
        content = file_path.read_text(encoding="utf-8")
        for line in content.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key = line.split("=", 1)[0].strip()
                if is_secret_var(key):
                    secret_vars.append(key)
                else:
                    safe_vars.append(key)
    except (OSError, IOError):
        pass

    return safe_vars, secret_vars


def reload_claude_env_file(safe_vars: list[str], file_path: Path) -> None:
    """Si CLAUDE_ENV_FILE está definido, actualiza las vars seguras."""
    env_file = os.environ.get("CLAUDE_ENV_FILE")
    if not env_file:
        return

    try:
        env_content = Path(file_path).read_text(encoding="utf-8")
        new_lines: list[str] = []
        for line in env_content.splitlines():
            if "=" in line and not line.startswith("#"):
                key = line.split("=", 1)[0].strip()
                if key in safe_vars:
                    new_lines.append(line)

        with open(env_file, "a", encoding="utf-8") as f:
            f.write("\n".join(new_lines) + "\n")
    except (OSError, IOError):
        pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    file_path_str: str = data.get("file_path", "")
    change_type: str = data.get("change_type", "modified")  # created/modified/deleted
    file_path = Path(os.path.abspath(file_path_str)) if file_path_str else Path(file_path_str)

    context_parts: list[str] = []

    # .env file changed
    if file_path.suffix in (".env", "") and ".env" in file_path.name:
        if change_type == "deleted":
            context_parts.append(f"[file-watcher] ⚠️  {file_path.name} fue ELIMINADO.")
        else:
            safe_vars, secret_vars = parse_env_keys(file_path)
            reload_claude_env_file(safe_vars, file_path)
            context_parts.append(
                f"[file-watcher] {file_path.name} fue modificado. "
                f"Variables públicas: {', '.join(safe_vars[:10]) or 'ninguna'}. "
                f"Secretos detectados: {len(secret_vars)} (no mostrados)."
            )

    # CLAUDE.md changed
    elif file_path.name in ("CLAUDE.md", "CLAUDE.local.md"):
        context_parts.append(
            f"[file-watcher] {file_path.name} fue modificado ({change_type}). "
            "El contexto base del proyecto cambió — tener en cuenta para el resto de la sesión."
        )

    # Package manifest changed
    elif file_path.name in ("package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod"):
        context_parts.append(
            f"[file-watcher] {file_path.name} fue modificado ({change_type}). "
            "Puede haber nuevas dependencias — considerar ejecutar el comando de instalación apropiado."
        )

    if context_parts:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "FileChanged",
                "additionalContext": "\n".join(context_parts)
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
