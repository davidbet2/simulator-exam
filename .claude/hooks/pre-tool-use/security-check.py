#!/usr/bin/env python3
"""
Hook: PreToolUse — Security Check (Bash)
========================================
Intercepta comandos de Bash antes de ejecutarlos y bloquea
patrones peligrosos definidos en BLOCKED_PATTERNS.

Protocolo Claude Code Hooks (correcto):
- PreToolUse DEBE usar hookSpecificOutput.permissionDecision para decisiones
- exit(2) + stderr → bloquea con mensaje a Claude
- exit(0) sin output → el tool se ejecuta normalmente
- NO usar {"decision": "block"} para PreToolUse — eso es para Stop/PostToolUse

Ref: https://code.claude.com/docs/en/hooks#pretooluse-decision-control
"""
import json
import sys

# Patrones de comandos que NUNCA deben ejecutarse automáticamente
# (patrón_lowercase, razón_legible)
BLOCKED_PATTERNS: list[tuple[str, str]] = [
    ("rm -rf /", "Eliminación recursiva del root del sistema"),
    ("rm -rf ~", "Eliminación recursiva del home del usuario"),
    ("rm -rf .", "Eliminación recursiva del directorio actual"),
    (":(){ :|:& };:", "Fork bomb — agota recursos del sistema"),
    ("dd if=/dev/random", "Escritura aleatoria sobre dispositivos"),
    ("dd if=/dev/zero of=/dev/", "Sobreescritura de dispositivo de bloque"),
    ("mkfs", "Formateo de sistema de archivos"),
    ("> /dev/sd", "Escritura directa sobre dispositivo de bloque"),
    ("chmod -r 777 /", "Permisos inseguros en root"),
    ("curl | bash", "Ejecución remota sin verificación"),
    ("curl | sh", "Ejecución remota sin verificación"),
    ("wget -o- | bash", "Ejecución remota sin verificación"),
    ("wget -o- | sh", "Ejecución remota sin verificación"),
    ("git push --force", "Push forzado que reescribe historial remoto"),
    ("git reset --hard head~", "Reset destructivo del historial"),
    ("drop database", "Eliminación de base de datos"),
    ("drop table", "Eliminación de tabla"),
    ("truncate table", "Vaciado de tabla"),
]

def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        # Fail-open: si no podemos parsear, dejar pasar
        sys.exit(0)

    command: str = data.get("tool_input", {}).get("command", "")

    if not command:
        sys.exit(0)

    command_lower = command.lower()
    for pattern, reason in BLOCKED_PATTERNS:
        if pattern in command_lower:
            # CORRECTO para PreToolUse: usar hookSpecificOutput con permissionDecision
            output = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": (
                        f"[security-check] Bloqueado por política de seguridad.\n"
                        f"Patrón detectado: '{pattern}'\n"
                        f"Razón: {reason}\n"
                        f"Ejecuta este comando manualmente si es intencional."
                    )
                }
            }
            print(json.dumps(output))
            sys.exit(0)

    sys.exit(0)


if __name__ == "__main__":
    main()
