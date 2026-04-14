#!/usr/bin/env python3
"""
Migration Analyzer
==================
Analiza un proyecto existente y genera un plan de migración seguro
para adoptar la estructura base sin romper nada.

Uso:
    python tools/scripts/migrate.py [--dry-run] [--target-dir PATH]

Opciones:
    --dry-run       Solo analizar, no crear archivos
    --target-dir    Directorio del proyecto a analizar (default: CWD)
    --force         Sobreescribir archivos existentes (PELIGROSO)

Outputs:
    - Imprime análisis de compatibilidad
    - Genera migration-plan.md con pasos recomendados
    - En modo real: copia selectivamente archivos base que no existan
"""
import argparse
import json
import os
import shutil
import sys
from datetime import datetime
from pathlib import Path


# Archivos del base-project que son SEGUROS de copiar si no existen
SAFE_TO_COPY: list[str] = [
    "CLAUDE.md",
    "AGENTS.md",
    ".claude/settings.json",
    ".claude/rules/security.md",
    ".claude/rules/testing.md",
    ".claude/skills/code-review/SKILL.md",
    ".claude/skills/debug/SKILL.md",
    ".claude/skills/documentation/SKILL.md",
    ".claude/skills/architecture/SKILL.md",
    ".claude/skills/refactor/SKILL.md",
    ".claude/skills/release/SKILL.md",
    ".claude/hooks/pre-tool-use/security-check.py",
    ".claude/hooks/pre-tool-use/validate-input.py",
    ".claude/hooks/post-tool-use/log-activity.py",
    ".claude/hooks/post-tool-use/error-enricher.py",
    ".claude/hooks/post-tool-use/quality-check.py",
    ".claude/hooks/stop/finalize-session.py",
    ".claude/hooks/session-start/inject-context.py",
    ".claude/hooks/user-prompt/enrich-prompt.py",
    ".claude/hooks/pre-compact/save-context.py",
    ".claude/hooks/post-compact/restore-context.py",
    ".claude/hooks/session-end/cleanup.py",
    ".claude/hooks/file-changed/env-watcher.py",
    "memory/README.md",
    "docs/decisions/README.md",
    "docs/decisions/template.md",
    "docs/runbooks/README.md",
]

# Archivos que NUNCA se sobreescriben (datos del proyecto existente)
NEVER_OVERWRITE: list[str] = [
    "package.json", "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "pyproject.toml", "setup.py", "requirements.txt", "Pipfile",
    "Cargo.toml", "go.mod", "pom.xml", "build.gradle",
    ".gitignore", ".git",
    "src/", "app/", "lib/", "pkg/",
    "Makefile", "Dockerfile", "docker-compose.yml",
    "README.md",  # El README del proyecto es del proyecto
]

# Conflictos que requieren atención manual
POTENTIAL_CONFLICTS: list[str] = [
    ".claude/settings.json",  # Puede haber configuración existente de Claude
    "CLAUDE.md",              # Puede haber instrucciones existentes de Claude
]


class ProjectAnalyzer:
    def __init__(self, target_dir: Path, base_dir: Path) -> None:
        self.target = target_dir
        self.base = base_dir
        self.issues: list[str] = []
        self.safe_copies: list[str] = []
        self.conflicts: list[str] = []
        self.skips: list[str] = []

    def detect_project_type(self) -> dict:
        """Detecta el tipo de proyecto objetivo."""
        detected: dict = {
            "language": "unknown",
            "framework": "unknown",
            "has_git": False,
            "has_ci": False,
            "existing_claude_config": False,
            "has_tests": False,
        }

        # Lenguaje
        if (self.target / "package.json").exists():
            detected["language"] = "javascript/typescript"
            pkg = json.loads((self.target / "package.json").read_text("utf-8"))
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if "next" in deps:
                detected["framework"] = "Next.js"
            elif "react" in deps:
                detected["framework"] = "React"
            elif "express" in deps:
                detected["framework"] = "Express"
            elif "fastify" in deps:
                detected["framework"] = "Fastify"
            elif "nest" in deps or "@nestjs/core" in deps:
                detected["framework"] = "NestJS"
        elif (self.target / "pyproject.toml").exists() or (self.target / "setup.py").exists():
            detected["language"] = "python"
            for fw in ["django", "fastapi", "flask", "starlette"]:
                if any((self.target / f).exists()
                       for f in [f"requirements.txt", "pyproject.toml"]
                       if _file_contains(self.target / f, fw)):
                    detected["framework"] = fw
                    break
        elif (self.target / "Cargo.toml").exists():
            detected["language"] = "rust"
        elif (self.target / "go.mod").exists():
            detected["language"] = "go"
        elif (self.target / "pom.xml").exists() or (self.target / "build.gradle").exists():
            detected["language"] = "java"

        # Git
        detected["has_git"] = (self.target / ".git").exists()

        # CI
        ci_files = [".github/workflows", ".gitlab-ci.yml", "Jenkinsfile", ".circleci"]
        detected["has_ci"] = any((self.target / f).exists() for f in ci_files)

        # Claude config existente
        detected["existing_claude_config"] = (self.target / ".claude" / "settings.json").exists()

        # Tests
        test_dirs = ["tests", "test", "__tests__", "spec"]
        test_files = list(self.target.rglob("*.test.*"))[:5] + list(self.target.rglob("*.spec.*"))[:5]
        detected["has_tests"] = (
            any((self.target / d).exists() for d in test_dirs)
            or len(test_files) > 0
        )

        return detected

    def analyze(self) -> None:
        """Analiza qué archivos se pueden copiar de forma segura."""
        for rel_path in SAFE_TO_COPY:
            target_file = self.target / rel_path
            base_file = self.base / rel_path

            if not base_file.exists():
                self.skips.append(f"{rel_path} — no existe en base-project")
                continue

            if target_file.exists():
                if rel_path in POTENTIAL_CONFLICTS:
                    self.conflicts.append(rel_path)
                else:
                    self.skips.append(f"{rel_path} — ya existe (no se sobreescribe)")
            else:
                self.safe_copies.append(rel_path)

        # Verificar que ningún archivo peligroso sea tocado
        for danger in NEVER_OVERWRITE:
            danger_path = self.target / danger
            if danger_path.exists() and danger in [s for s in SAFE_TO_COPY]:
                self.issues.append(f"CONFLICTO CRÍTICO: {danger} existe y está en SAFE_TO_COPY")

    def execute_copies(self, dry_run: bool = True, force: bool = False) -> list[str]:
        """Ejecuta las copias seguras."""
        copied: list[str] = []

        for rel_path in self.safe_copies:
            base_file = self.base / rel_path
            target_file = self.target / rel_path

            if target_file.exists() and not force:
                continue

            if not dry_run:
                target_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(base_file, target_file)
                copied.append(rel_path)
            else:
                copied.append(f"[DRY RUN] {rel_path}")

        return copied

    def generate_report(self, project_info: dict, dry_run: bool) -> str:
        """Genera el reporte de migración."""
        lines: list[str] = [
            f"# Migration Plan — {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            "",
            "## Proyecto Detectado",
            "",
            f"- **Lenguaje:** {project_info['language']}",
            f"- **Framework:** {project_info['framework']}",
            f"- **Git:** {'Sí' if project_info['has_git'] else 'No (⚠️ no está inicializado)'}",
            f"- **CI/CD:** {'Sí' if project_info['has_ci'] else 'No'}",
            f"- **Config Claude existente:** {'Sí — revisar conflicts' if project_info['existing_claude_config'] else 'No'}",
            f"- **Tests:** {'Sí' if project_info['has_tests'] else 'No (considerar agregar)'}",
            "",
        ]

        if self.issues:
            lines += ["## ⛔ Problemas Críticos (requieren acción manual)", ""]
            for issue in self.issues:
                lines.append(f"- {issue}")
            lines.append("")

        if self.conflicts:
            lines += ["## ⚠️ Conflictos Detectados (revisar manualmente)", ""]
            for conflict in self.conflicts:
                lines.append(f"- `{conflict}` ya existe — comparar con versión base antes de decidir")
            lines += [
                "",
                "**Acción recomendada:** Abrir ambas versiones, tomar las secciones relevantes.",
                "",
            ]

        if self.safe_copies:
            mode = "[DRY RUN] Se copiarían" if dry_run else "Archivos copiados"
            lines += [f"## ✅ {mode}", ""]
            for f in self.safe_copies:
                lines.append(f"- `{f}`")
            lines.append("")

        if self.skips:
            lines += ["## ℹ️ Omitidos (ya existen o no aplican)", ""]
            for s in self.skips:
                lines.append(f"- {s}")
            lines.append("")

        lines += [
            "## Próximos Pasos Recomendados",
            "",
            "1. Revisar conflictos manualmente (si los hay)",
            "2. Abrir CLAUDE.md copiado y personalizar para este proyecto",
            "3. Abrir .claude/settings.json y verificar los MCPs configurados",
            "4. Hacer `git add -p` para revisar los cambios antes de commitear",
            "5. Agregar `.claude/rules/` con reglas específicas de este proyecto",
            "6. Si el proyecto ya tiene hooks de Claude, mergear con los nuevos",
        ]

        if not project_info["has_git"]:
            lines += ["", "> ⚠️ **Importante:** Este proyecto no tiene git. Inicializar con `git init` antes de continuar."]

        return "\n".join(lines)


def _file_contains(path: Path, text: str) -> bool:
    try:
        return text.lower() in path.read_text("utf-8").lower()
    except (OSError, IOError):
        return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Analiza un proyecto y genera plan de migración hacia base-project"
    )
    parser.add_argument("--dry-run", action="store_true", default=True,
                        help="Solo analizar — no copiar archivos (default)")
    parser.add_argument("--execute", action="store_true", default=False,
                        help="Ejecutar la migración (copiar archivos seguros)")
    parser.add_argument("--target-dir", type=Path, default=Path.cwd(),
                        help="Directorio del proyecto objetivo (default: CWD)")
    parser.add_argument("--force", action="store_true", default=False,
                        help="Sobreescribir archivos existentes (⚠️ PELIGROSO)")
    args = parser.parse_args()

    # El base-project está en el mismo lugar que este script (2 niveles arriba)
    base_dir = Path(__file__).parent.parent.parent
    target_dir = args.target_dir.resolve()
    dry_run = not args.execute

    if args.force and not args.execute:
        print("⚠️  --force solo tiene efecto con --execute", file=sys.stderr)

    print(f"🔍 Analizando proyecto en: {target_dir}")
    print(f"📦 Base-project en:        {base_dir}")
    print(f"{'🔬 Modo DRY-RUN (sin cambios)' if dry_run else '🚀 Modo EJECUCIÓN (copiando archivos)'}")
    print()

    analyzer = ProjectAnalyzer(target_dir, base_dir)
    project_info = analyzer.detect_project_type()
    analyzer.analyze()

    if args.execute:
        copied = analyzer.execute_copies(dry_run=False, force=args.force)
        if copied:
            print(f"✅ Copiados {len(copied)} archivos")
    else:
        analyzer.execute_copies(dry_run=True)  # Para populate safe_copies

    # Generar y guardar el reporte
    report = analyzer.generate_report(project_info, dry_run)
    print(report)

    # Guardar el plan en el proyecto objetivo
    plan_file = target_dir / "migration-plan.md"
    try:
        plan_file.write_text(report, encoding="utf-8")
        print(f"\n📄 Plan guardado en: {plan_file}")
    except (OSError, IOError) as e:
        print(f"\n⚠️  No se pudo guardar el plan: {e}", file=sys.stderr)

    # Exit code: 1 si hay problemas críticos
    if analyzer.issues:
        print("\n⛔ Hay problemas críticos. Revisar el plan antes de continuar.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
