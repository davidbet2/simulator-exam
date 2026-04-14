#!/usr/bin/env python3
"""
Memory Sync Script — Sincronización de Memoria Persistente
===========================================================
Procesa `memory/sessions/pending-memory-updates.jsonl` y clasifica
las actualizaciones pendientes en patterns/ o decisions/.

Diseñado para ejecutarse desde Claude Code con `/memory-sync`,
pero también puede correr standalone para mantenimiento.

Uso:
    python tools/scripts/memory-sync.py                 # Modo interactivo
    python tools/scripts/memory-sync.py --status        # Solo ver estado
    python tools/scripts/memory-sync.py --auto-mark     # Marca todos como procesados
"""
import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path


PENDING_FILE = Path("memory/sessions/pending-memory-updates.jsonl")


def load_pending() -> list[dict]:
    """Carga entradas pendientes de procesamiento."""
    if not PENDING_FILE.exists():
        return []

    entries = []
    try:
        for line in PENDING_FILE.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                if not entry.get("processed", True):
                    entries.append(entry)
            except json.JSONDecodeError:
                continue
    except (OSError, IOError):
        pass

    return entries


def mark_all_processed() -> int:
    """Marca todas las entradas como procesadas."""
    if not PENDING_FILE.exists():
        print("No hay archivo de pendientes.")
        return 0

    lines = PENDING_FILE.read_text(encoding="utf-8").splitlines()
    updated_lines = []
    count = 0

    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)
            if not entry.get("processed", True):
                entry["processed"] = True
                entry["processed_at"] = datetime.utcnow().isoformat()
                count += 1
            updated_lines.append(json.dumps(entry, ensure_ascii=False))
        except json.JSONDecodeError:
            updated_lines.append(line)

    PENDING_FILE.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")
    print(f"Marcadas {count} entradas como procesadas.")
    return count


def show_status() -> None:
    """Muestra estado de la memoria sin modificar nada."""
    pending = load_pending()

    print("\n=== Estado de Memoria ===\n")

    print(f"Pendientes de procesar: {len(pending)}")

    if pending:
        print("\nEntradas pendientes:")
        for i, entry in enumerate(pending[:10], 1):
            print(f"  {i}. [{entry.get('ts', '?')[:10]}] {entry.get('file', '?')}")
            print(f"     Razón: {entry.get('reason', '?')}")
            print(f"     Acción sugerida: {entry.get('action', '?')}\n")

        if len(pending) > 10:
            print(f"  ... y {len(pending) - 10} más\n")

    # Stats de memoria existente
    patterns = list(Path("memory/patterns").glob("*.md")) if Path("memory/patterns").exists() else []
    decisions = list(Path("memory/decisions").glob("*.md")) if Path("memory/decisions").exists() else []

    print(f"Patrones documentados: {len(patterns)}")
    print(f"Decisiones documentadas: {len(decisions)}")

    if patterns:
        print("\nÚltimos patrones:")
        for p in sorted(patterns, key=lambda x: x.stat().st_mtime, reverse=True)[:3]:
            print(f"  - {p.name}")

    print()


def interactive_sync() -> None:
    """Modo interactivo para procesar pendientes con confirmación."""
    pending = load_pending()

    if not pending:
        print("No hay actualizaciones de memoria pendientes. ✓")
        return

    print(f"\n{len(pending)} actualizaciones pendientes de revisar.\n")

    lines = PENDING_FILE.read_text(encoding="utf-8").splitlines()

    for entry in pending:
        print(f"─ Archivo: {entry.get('file', '?')}")
        print(f"  Razón: {entry.get('reason', '?')}")
        print(f"  Acción sugerida: {entry.get('action', '?')}")
        print()
        print("  ¿Qué hacer con esta entrada?")
        print("  [p] Guardar en memory/patterns/")
        print("  [d] Guardar en memory/decisions/")
        print("  [s] Saltar (procesar después)")
        print("  [x] Marcar como procesado sin acción")

        choice = input("  > ").strip().lower()

        if choice == "p":
            filename = input("  Nombre del archivo de patrón (sin .md): ").strip()
            if filename:
                pattern_file = Path("memory/patterns") / f"{filename}.md"
                pattern_file.parent.mkdir(parents=True, exist_ok=True)
                content = f"""# Patrón: {filename}
**Categoría:** [a completar]
**Descubierto:** {datetime.now().strftime('%Y-%m-%d')}
**Origen:** {entry.get('file', '?')}

## Problema
[Describir el problema que resuelve]

## Solución
[Describir el patrón]

## Ejemplo en este proyecto
Ver: {entry.get('file', '?')}

## Notas
{entry.get('reason', '')}
"""
                pattern_file.write_text(content, encoding="utf-8")
                print(f"  ✓ Creado: {pattern_file}")
                _mark_entry_processed(lines, entry)

        elif choice == "d":
            filename = input("  Nombre del archivo de decisión (sin .md): ").strip()
            if filename:
                today = datetime.now().strftime("%Y-%m-%d")
                decision_file = Path("memory/decisions") / f"{today}-{filename}.md"
                decision_file.parent.mkdir(parents=True, exist_ok=True)
                content = f"""# Decisión: {filename}
**Fecha:** {today}
**Contexto:** {entry.get('file', '?')}

## Decisión
[Describir la decisión tomada]

## Razón
{entry.get('reason', '')}

## Consecuencias
[Qué implica para el trabajo futuro]
"""
                decision_file.write_text(content, encoding="utf-8")
                print(f"  ✓ Creado: {decision_file}")
                _mark_entry_processed(lines, entry)

        elif choice == "x":
            _mark_entry_processed(lines, entry)
            print("  Marcado como procesado.")

        elif choice == "s":
            print("  Saltando...\n")
            continue

        print()

    PENDING_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("✓ Sincronización completada.")


def _mark_entry_processed(lines: list[str], entry: dict) -> None:
    """Marca una entrada específica como procesada en la lista de líneas."""
    target_ts = entry.get("ts", "")
    for i, line in enumerate(lines):
        try:
            parsed = json.loads(line)
            if parsed.get("ts") == target_ts:
                parsed["processed"] = True
                parsed["processed_at"] = datetime.utcnow().isoformat()
                lines[i] = json.dumps(parsed, ensure_ascii=False)
                break
        except json.JSONDecodeError:
            continue


def main() -> None:
    parser = argparse.ArgumentParser(description="Sincronizar memoria persistente del proyecto")
    parser.add_argument("--status", action="store_true", help="Ver estado sin modificar")
    parser.add_argument("--auto-mark", action="store_true", help="Marcar todos como procesados")
    args = parser.parse_args()

    # Cambiar al directorio raíz
    project_root = Path(__file__).parent.parent.parent
    os.chdir(project_root)

    if args.status:
        show_status()
    elif args.auto_mark:
        mark_all_processed()
    else:
        interactive_sync()


if __name__ == "__main__":
    main()
