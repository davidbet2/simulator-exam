#!/usr/bin/env python3
"""
Hook: UserPromptSubmit — Prompt Enricher
=========================================
Se ejecuta ANTES de que Claude procese cada prompt del usuario.

Funciones clave:
1. Detectar automáticamente el skill relevante y sugerirlo como contexto
2. Agregar contexto del módulo actual si Claude está trabajando en src/
3. Detectar pautas de seguridad cuando el prompt menciona palabras clave críticas
4. Bloquear prompts que intenten inyectar instrucciones maliciosas

DETECCIÓN DE PROMPT INJECTION:
Alerta si detecta patrones que intentan sobreescribir instrucciones del sistema.

Protocolo Claude Code:
- UserPromptSubmit recibe "prompt" field con el texto del usuario
- Puede: bloquear con {decision: "block"}, agregar contexto, o renombrar sesión
- Stdout JSON con additionalContext → Claude lo recibe como contexto
"""
import json
import sys
import os
import re
from pathlib import Path


# Palabras que activan sugerencia de skill específico
SKILL_TRIGGERS: list[tuple[list[str], str, str]] = [
    (["revisa", "review", "audita", "analiza", "audit"],
     "code-review", "Activa el skill de code-review para análisis estructurado"),

    (["refactoriza", "refactor", "limpiar", "reestructura", "mejora estructura"],
     "refactor", "Activa el skill de refactor con plan previo"),

    (["debug", "investiga", "bug", "error", "falla", "no funciona", "por qué"],
     "debug", "Activa el skill de debug con metodología científica"),

    (["documenta", "documentación", "docs", "document"],
     "documentation", "Activa el skill de documentation"),

    (["prepara release", "versiona", "bump version", "changelog", "publica versión"],
     "release", "Activa el skill de release con SemVer"),

    (["diseña", "arquitectura", "arquitectónico", "architect", "diseño"],
     "architecture", "Activa el skill de architecture con ADR"),

    (["instala", "install", "no está instalado", "necesito que uses", "verifica que tengas",
      "check dependencies", "setup environment", "¿tienes", "do you have", "is installed",
      "herramienta faltante", "falta instalar"],
     "ensure-tools", "Activa el skill de ensure-tools para verificar e instalar dependencias"),

    (["revisa el pr", "review pr", "pull request", "pr-review", "pr diff",
      "revisa el pull request", "check pull request"],
     "pr-review", "Activa el skill de pr-review con gh CLI"),

    (["health", "health-check", "diagnóstico", "diagnostico", "setup ok",
      "estado del proyecto", "¿está bien configurado", "verifica configuración"],
     "health-check", "Activa el skill de health-check para diagnóstico completo del entorno"),
]

# Patrones de prompt injection (intentos de sobreescribir sistema)
INJECTION_PATTERNS: list[str] = [
    r"ignore\s+(all\s+)?previous\s+instructions",
    r"disregard\s+(all\s+)?previous",
    r"forget\s+(everything|all\s+instructions)",
    r"act\s+as\s+if\s+you\s+(are|have\s+no)",
    r"your\s+new\s+(instructions|rules|system\s+prompt)",
    r"from\s+now\s+on\s+you\s+are",
    r"system\s*:\s*(you\s+are|ignore|disregard)",
    r"<\s*system\s*>.*ignore",
    r"jailbreak",
    r"bypass\s+(all\s+)?(safety|security|restrictions)",
    r"do\s+anything\s+now",           # DAN-style jailbreak
    r"developer\s+mode",               # Fake developer mode jailbreak
    r"pretend\s+you\s+(have\s+no|are\s+not)",
    r"respond\s+(only|always)\s+with.{0,40}(dan|evil|unrestricted)",
]

def detect_skill(prompt_lower: str) -> str | None:
    """Detecta si el prompt activa algún skill específico."""
    for triggers, skill_name, description in SKILL_TRIGGERS:
        for trigger in triggers:
            if trigger in prompt_lower:
                return f"[autoskill] Skill relevante detectado: '{skill_name}' — {description}\nLeer: .claude/skills/{skill_name}/SKILL.md"
    return None


def detect_injection(prompt: str) -> bool:
    """Detecta intentos de prompt injection."""
    prompt_lower = prompt.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, prompt_lower):
            return True
    return False


def detect_security_context(prompt_lower: str) -> str | None:
    """Detecta si el prompt involucra operaciones de seguridad críticas."""
    security_keywords = [
        "secret", "password", "credential", "token", "api key",
        "private key", "certificate", "encrypt", "decrypt", "auth"
    ]
    action_keywords = ["commit", "push", "log", "print", "show", "display", "send"]

    has_security = any(kw in prompt_lower for kw in security_keywords)
    has_action = any(kw in prompt_lower for kw in action_keywords)

    if has_security and has_action:
        return (
            "⚠️ ADVERTENCIA DE SEGURIDAD: El prompt involucra secretos/credenciales + "
            "operaciones de output. Verificar que NO se vayan a exponer datos sensibles en logs o commits."
        )
    return None


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        data = {}

    prompt: str = data.get("prompt", "")

    if not prompt:
        sys.exit(0)

    # 1. Detectar prompt injection — BLOQUEAR
    if detect_injection(prompt):
        print(json.dumps({
            "decision": "block",
            "reason": (
                "[security] Posible prompt injection detectado. "
                "El prompt contiene patrones que intentan sobreescribir instrucciones del sistema. "
                "Si esto es legítimo, reformula la solicitud sin esos patrones."
            )
        }))
        sys.exit(0)

    # 2. Construir contexto adicional
    context_parts: list[str] = []
    prompt_lower = prompt.lower()

    # Sugerir skill relevante
    skill_hint = detect_skill(prompt_lower)
    if skill_hint:
        context_parts.append(skill_hint)

    # Advertencia de seguridad
    security_warning = detect_security_context(prompt_lower)
    if security_warning:
        context_parts.append(security_warning)

    if context_parts:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "UserPromptSubmit",
                "additionalContext": "\n".join(context_parts)
            }
        }))

    sys.exit(0)


if __name__ == "__main__":
    main()
