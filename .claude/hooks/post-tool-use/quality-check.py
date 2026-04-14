#!/usr/bin/env python3
"""
Hook: PostToolUse — Async Quality Check
=========================================
Corre en BACKGROUND (async: true) después de que Claude escribe/edita un archivo.
No bloquea a Claude — corre en paralelo y reporta problemas al log.

Propósito:
- Ejecutar linters disponibles en el proyecto sin bloquear el flujo
- Detectar errores de sintaxis inmediatamente post-edición
- Registrar deuda técnica en memory/sessions/quality-issues.jsonl

Protocolo Claude Code:
- async: true → corre en background, Claude NO espera el resultado
- asyncRewake + exit(2): si algo falla crítico, puede despertar a Claude
- Para linting, siempre exit(0) — el resultado va al log, no bloquea

Configurar en settings.json para aktivar asyncRewake:
  "async": true, "asyncRewake": true
  → despierta a Claude con stderr si hay errores de sintaxis críticos

Ref: https://code.claude.com/docs/en/hooks#async-hooks
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def detect_available_linters() -> dict[str, list[str]]:
    """Detecta qué linters están disponibles en el proyecto."""
    linters: dict[str, list[str]] = {}

    # Python linters
    if Path("pyproject.toml").exists() or Path("setup.py").exists():
        for tool in ["ruff", "flake8", "pylint", "mypy"]:
            if _cmd_exists(tool):
                linters["python"] = [tool, "--select=E9,F63,F7,F82", "--no-cache"]
                break
            if _cmd_exists("python"):
                linters["python_compile"] = ["python", "-m", "py_compile"]

    # JavaScript/TypeScript linters
    if Path("package.json").exists():
        if Path("node_modules/.bin/eslint").exists():
            linters["js"] = ["node_modules/.bin/eslint", "--no-eslintrc", "--rule",
                             "{\"no-undef\": \"error\", \"no-unused-vars\": \"warn\"}"]

    return linters


def _cmd_exists(cmd: str) -> bool:
    try:
        result = subprocess.run(
            ["where" if os.name == "nt" else "which", cmd],
            capture_output=True, timeout=2, check=False
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        return False


def run_lint(file_path: Path, linters: dict) -> list[dict]:
    """Ejecuta el linter apropiado para el archivo dado."""
    issues: list[dict] = []
    suffix = file_path.suffix.lower()

    if suffix == ".py" and "python" in linters:
        cmd = linters["python"] + [str(file_path)]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                issues.append({
                    "file": str(file_path),
                    "linter": linters["python"][0],
                    "output": result.stdout[:500] + result.stderr[:500],
                    "severity": "error" if result.returncode > 0 else "warning",
                })
        except (subprocess.TimeoutExpired, OSError):
            pass

    elif suffix == ".py" and "python_compile" in linters:
        # Fallback: solo verificar que la sintaxis sea válida
        cmd = linters["python_compile"] + [str(file_path)]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if result.returncode != 0:
                issues.append({
                    "file": str(file_path),
                    "linter": "py_compile",
                    "output": result.stderr[:500],
                    "severity": "error",
                })
        except (subprocess.TimeoutExpired, OSError):
            pass

    elif suffix in (".js", ".ts", ".jsx", ".tsx") and "js" in linters:
        cmd = linters["js"] + [str(file_path)]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            if result.returncode != 0:
                issues.append({
                    "file": str(file_path),
                    "linter": "eslint",
                    "output": result.stdout[:500],
                    "severity": "warning",
                })
        except (subprocess.TimeoutExpired, OSError):
            pass

    return issues


def log_quality_issues(issues: list[dict]) -> None:
    """Registra problemas de calidad en el log de sesión."""
    if not issues:
        return

    log_dir = Path("memory/sessions")
    log_dir.mkdir(parents=True, exist_ok=True)
    quality_file = log_dir / "quality-issues.jsonl"

    ts = datetime.now(tz=timezone.utc).isoformat()
    try:
        with open(quality_file, "a", encoding="utf-8") as f:
            for issue in issues:
                issue["ts"] = ts
                f.write(json.dumps(issue, ensure_ascii=False) + "\n")
    except (OSError, IOError):
        pass


def main() -> None:
    try:
        raw = sys.stdin.read()
        data = json.loads(raw) if raw.strip() else {}
    except (json.JSONDecodeError, Exception):
        sys.exit(0)

    tool_name: str = data.get("tool_name", "")
    tool_input: dict = data.get("tool_input", {})

    if tool_name not in ("Write", "Edit", "MultiEdit"):
        sys.exit(0)

    # Obtener el archivo editado
    file_path_str: str = tool_input.get("file_path", "")
    if not file_path_str:
        # MultiEdit tiene una lista
        edits = tool_input.get("edits", [])
        if edits:
            file_path_str = edits[0].get("file_path", "")

    if not file_path_str:
        sys.exit(0)

    file_path = Path(file_path_str)
    if not file_path.exists():
        sys.exit(0)

    # Solo analizar archivos de código
    code_extensions = {".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rs"}
    if file_path.suffix.lower() not in code_extensions:
        sys.exit(0)

    linters = detect_available_linters()
    if not linters:
        sys.exit(0)

    issues = run_lint(file_path, linters)
    log_quality_issues(issues)

    # Con asyncRewake: si hay errores sintácticos críticos, despertar a Claude
    critical = [i for i in issues if i.get("severity") == "error"]
    if critical:
        error_summary = "\n".join(i["output"][:200] for i in critical[:2])
        print(f"[quality-check] Errores en {file_path.name}:\n{error_summary}", file=sys.stderr)
        sys.exit(2)  # asyncRewake → despierta a Claude con este mensaje

    sys.exit(0)


if __name__ == "__main__":
    main()
