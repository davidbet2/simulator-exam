#!/usr/bin/env python3
"""
Setup Script — Inicialización del Proyecto Base
================================================
Verifica prerrequisitos, crea directorios necesarios y
configura el entorno de desarrollo inicial.

Uso:
    python tools/scripts/setup.py
    python tools/scripts/setup.py --check-only   # Solo verificar, no modificar
"""
import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


# ─── Colores ANSI para output legible ────────────────────────────────────────
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"


def ok(msg: str) -> None:
    print(f"{GREEN}  ✓{RESET} {msg}")


def warn(msg: str) -> None:
    print(f"{YELLOW}  ⚠{RESET} {msg}")


def err(msg: str) -> None:
    print(f"{RED}  ✗{RESET} {msg}")


def header(msg: str) -> None:
    print(f"\n{BOLD}{msg}{RESET}")


# ─── Verificaciones ───────────────────────────────────────────────────────────

def check_python_version() -> bool:
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        ok(f"Python {version.major}.{version.minor}.{version.micro}")
        return True
    err(f"Python 3.8+ requerido. Encontrado: {version.major}.{version.minor}")
    return False


def check_git() -> bool:
    if shutil.which("git"):
        result = subprocess.run(["git", "--version"], capture_output=True, text=True)
        ok(result.stdout.strip())
        return True
    warn("git no encontrado — control de versiones no disponible")
    return False


def check_claude_code() -> bool:
    if shutil.which("claude"):
        ok("Claude Code CLI disponible")
        return True
    warn("Claude Code CLI no encontrado. Instalar con: npm install -g @anthropic-ai/claude-code")
    return False


def check_env_file() -> bool:
    if Path(".env").exists():
        ok(".env existe")
        return True
    warn(".env no encontrado")
    return False


def check_required_dirs() -> list[str]:
    """Retorna lista de directorios que faltan."""
    required = [
        "memory/sessions",
        "memory/decisions",
        "memory/patterns",
        "memory/knowledge",
        "docs/decisions",
        "docs/runbooks",
        "docs/context",
        ".claude/hooks/pre-tool-use",
        ".claude/hooks/post-tool-use",
        ".claude/hooks/pre-compact",
        ".claude/hooks/stop",
        ".claude/skills",
        ".claude/commands",
        "tools/scripts",
        "tools/prompts",
        "src/api",
        "src/core",
    ]
    missing = [d for d in required if not Path(d).exists()]
    return missing


# ─── Setup ────────────────────────────────────────────────────────────────────

def setup_env() -> None:
    """Crea .env desde .env.example si no existe."""
    if not Path(".env").exists() and Path(".env.example").exists():
        shutil.copy(".env.example", ".env")
        ok("Creado .env desde .env.example — completar con valores reales")
    elif Path(".env").exists():
        ok(".env ya existe — no se sobreescribe")
    else:
        warn(".env.example no encontrado — crear .env manualmente")


def setup_git_hooks() -> None:
    """Inicializa git si no está inicializado."""
    if not Path(".git").exists():
        subprocess.run(["git", "init"], capture_output=True)
        ok("Repositorio git inicializado")
    else:
        ok("Repositorio git ya existe")


def create_missing_dirs(dirs: list[str]) -> None:
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
        gitkeep = Path(d) / ".gitkeep"
        if not list(Path(d).iterdir()):
            gitkeep.touch()
    if dirs:
        ok(f"Creados {len(dirs)} directorios faltantes")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Setup del proyecto base")
    parser.add_argument("--check-only", action="store_true",
                        help="Solo verificar prerrequisitos sin modificar nada")
    args = parser.parse_args()

    print(f"\n{BOLD}=== Setup del Proyecto Base ==={RESET}")

    header("1. Verificando prerrequisitos")
    check_python_version()
    check_git()
    check_claude_code()

    header("2. Verificando estructura de directorios")
    missing_dirs = check_required_dirs()
    if missing_dirs:
        warn(f"{len(missing_dirs)} directorios faltantes: {', '.join(missing_dirs[:3])}...")
    else:
        ok("Estructura de directorios completa")

    header("3. Verificando configuración")
    check_env_file()

    if args.check_only:
        print(f"\n{BOLD}Modo check-only — no se realizaron cambios.{RESET}\n")
        return

    header("4. Aplicando setup")
    setup_env()
    if missing_dirs:
        create_missing_dirs(missing_dirs)
    setup_git_hooks()

    print(f"\n{GREEN}{BOLD}✓ Setup completado.{RESET}")
    print("\nPróximos pasos:")
    print("  1. Editar .env con los valores reales")
    print("  2. Actualizar CLAUDE.md con el contexto del proyecto")
    print("  3. Ejecutar: python tools/scripts/validate.py")
    print("  4. Abrir Claude Code: claude\n")


if __name__ == "__main__":
    main()
