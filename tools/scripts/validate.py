#!/usr/bin/env python3
"""
Validate Script — Verificación del Proyecto
=============================================
Valida que la estructura del proyecto esté completa y correctamente configurada.
Útil para CI, onboarding de nuevos miembros y verificación post-setup.

Uso:
    python tools/scripts/validate.py
    python tools/scripts/validate.py --strict    # Falla si hay warnings
    python tools/scripts/validate.py --json      # Output JSON para CI
"""
import argparse
import json
import os
import sys
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class ValidationResult:
    passed: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    failures: list[str] = field(default_factory=list)

    @property
    def is_ok(self) -> bool:
        return len(self.failures) == 0

    @property
    def total(self) -> int:
        return len(self.passed) + len(self.warnings) + len(self.failures)


result = ValidationResult()


def check(condition: bool, passed_msg: str, failed_msg: str, is_warning: bool = False) -> None:
    if condition:
        result.passed.append(passed_msg)
    elif is_warning:
        result.warnings.append(failed_msg)
    else:
        result.failures.append(failed_msg)


# ─── Checks ──────────────────────────────────────────────────────────────────

def validate_required_files() -> None:
    """Valida que los archivos críticos existan."""
    required_files = {
        "CLAUDE.md": "Hub de memoria principal faltante",
        "README.md": "README del proyecto faltante",
        ".gitignore": ".gitignore faltante",
        ".env.example": "Template de variables de entorno faltante",
        ".claude/settings.json": "Configuración de Claude Code faltante",
        "docs/architecture.md": "Documento de arquitectura faltante",
        "docs/decisions/README.md": "Índice de ADRs faltante",
        "docs/runbooks/README.md": "Índice de runbooks faltante",
    }
    for file_path, error_msg in required_files.items():
        check(Path(file_path).exists(), f"Existe: {file_path}", error_msg)


def validate_hooks() -> None:
    """Valida que los hooks existan y sean ejecutables (en términos de sintaxis Python)."""
    hooks = [
        ".claude/hooks/pre-tool-use/security-check.py",
        ".claude/hooks/pre-tool-use/validate-input.py",
        ".claude/hooks/post-tool-use/log-activity.py",
        ".claude/hooks/post-tool-use/update-memory.py",
        ".claude/hooks/pre-compact/save-context.py",
        ".claude/hooks/stop/finalize-session.py",
    ]
    for hook in hooks:
        path = Path(hook)
        exists = path.exists()
        check(exists, f"Hook existe: {hook}", f"Hook faltante: {hook}")

        if exists:
            # Verificar que el Python es sintácticamente válido
            import ast
            try:
                ast.parse(path.read_text(encoding="utf-8"))
                result.passed.append(f"Sintaxis Python OK: {hook}")
            except SyntaxError as e:
                result.failures.append(f"Error de sintaxis en hook {hook}: {e}")


def validate_skills() -> None:
    """Valida que los skills definidos en CLAUDE.md existan como archivos."""
    expected_skills = [
        ".claude/skills/code-review/SKILL.md",
        ".claude/skills/refactor/SKILL.md",
        ".claude/skills/release/SKILL.md",
        ".claude/skills/debug/SKILL.md",
        ".claude/skills/documentation/SKILL.md",
        ".claude/skills/architecture/SKILL.md",
    ]
    for skill in expected_skills:
        check(Path(skill).exists(), f"Skill existe: {skill}", f"Skill faltante: {skill}")


def validate_memory_structure() -> None:
    """Valida que la estructura de memoria esté lista."""
    memory_dirs = ["memory/sessions", "memory/decisions", "memory/patterns", "memory/knowledge"]
    for d in memory_dirs:
        check(Path(d).exists(), f"Directorio de memoria: {d}", f"Directorio faltante: {d}")


def validate_env() -> None:
    """Valida variables de entorno."""
    check(
        not Path(".env").exists() or "change_me" not in Path(".env").read_text(encoding="utf-8"),
        ".env no tiene valores placeholder sin completar",
        ".env tiene valores 'change_me' sin completar — revisar antes de usar",
        is_warning=True,
    )
    check(
        not Path(".claude/settings.local.json").exists()
        or Path(".gitignore").read_text(encoding="utf-8").find("settings.local.json") != -1,
        "settings.local.json protegido en .gitignore",
        "settings.local.json NO está en .gitignore — riesgo de commitear config local",
        is_warning=True,
    )


def validate_settings_json() -> None:
    """Valida que settings.json sea JSON válido."""
    settings_path = Path(".claude/settings.json")
    if not settings_path.exists():
        return

    try:
        data = json.loads(settings_path.read_text(encoding="utf-8"))
        check(True, "settings.json es JSON válido", "")
        check("hooks" in data, "settings.json tiene sección hooks", "settings.json sin sección hooks", is_warning=True)
        check("mcpServers" in data, "settings.json tiene mcpServers", "settings.json sin mcpServers", is_warning=True)
    except json.JSONDecodeError as e:
        result.failures.append(f"settings.json inválido: {e}")


# ─── Report ───────────────────────────────────────────────────────────────────

def print_report(strict: bool = False) -> int:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    RESET = "\033[0m"
    BOLD = "\033[1m"

    print(f"\n{BOLD}=== Validación del Proyecto ==={RESET}")
    print(f"Total de checks: {result.total}")

    if result.failures:
        print(f"\n{RED}{BOLD}✗ Fallos ({len(result.failures)}):{RESET}")
        for f in result.failures:
            print(f"  {RED}✗{RESET} {f}")

    if result.warnings:
        print(f"\n{YELLOW}{BOLD}⚠ Advertencias ({len(result.warnings)}):{RESET}")
        for w in result.warnings:
            print(f"  {YELLOW}⚠{RESET} {w}")

    passed_count = len(result.passed)
    if result.is_ok:
        print(f"\n{GREEN}{BOLD}✓ {passed_count} checks pasados.{RESET}")
        if result.warnings and strict:
            print(f"{YELLOW}Modo --strict: saliendo con error por {len(result.warnings)} warnings.{RESET}\n")
            return 1
        print()
        return 0
    else:
        print(f"\n{RED}{BOLD}✗ Validación fallida. {len(result.failures)} errores.{RESET}\n")
        return 1


def print_json_report() -> int:
    output = {
        "passed": len(result.passed),
        "warnings": len(result.warnings),
        "failures": len(result.failures),
        "is_ok": result.is_ok,
        "details": {
            "failures": result.failures,
            "warnings": result.warnings,
        }
    }
    print(json.dumps(output, indent=2, ensure_ascii=False))
    return 0 if result.is_ok else 1


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Validar estructura del proyecto")
    parser.add_argument("--strict", action="store_true", help="Fail on warnings too")
    parser.add_argument("--json", action="store_true", help="Output JSON for CI")
    args = parser.parse_args()

    # Cambiar al directorio raíz del proyecto
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    os.chdir(project_root)

    # Ejecutar todas las validaciones
    validate_required_files()
    validate_hooks()
    validate_skills()
    validate_memory_structure()
    validate_env()
    validate_settings_json()

    if args.json:
        sys.exit(print_json_report())
    else:
        sys.exit(print_report(strict=args.strict))


if __name__ == "__main__":
    main()
