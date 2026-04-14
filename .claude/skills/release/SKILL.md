---
name: release
description: Manages the full release process including versioning, CHANGELOG, git tags, and publishing. Use when preparing a release or version bump.
paths:
  - "CHANGELOG.md"
  - "package.json"
  - "pyproject.toml"
  - "Cargo.toml"
disable-model-invocation: true
allowed-tools: Bash(git tag *) Bash(git log *) Bash(git push *) Bash(npm publish) Read Write
---

# Skill: Release

## Trigger

Activar cuando el usuario diga: "prepara release", "versiona", "crea release", "bump version", "publica versión"

---

## Proceso de Release

> Este skill sigue [Semantic Versioning](https://semver.org/) y [Conventional Commits](https://www.conventionalcommits.org/)

### Paso 1: Determinar Tipo de Versión

Analizar los commits desde el último tag para determinar el bump:

```
PATCH (0.0.X) → Solo commits tipo fix, chore, docs
MINOR (0.X.0) → Al menos un commit tipo feat
MAJOR (X.0.0) → Hay commits con BREAKING CHANGE o feat! / fix!
```

Ejecutar: `git log [LAST_TAG]..HEAD --oneline` para ver los commits.

### Paso 2: Generar Changelog

Clasificar commits en secciones y agregar a `CHANGELOG.md`:

```markdown
## [X.Y.Z] — YYYY-MM-DD

### Added
- feat(scope): descripción

### Fixed  
- fix(scope): descripción

### Changed
- refactor(scope): descripción

### Breaking Changes ⚠️
- feat!(scope): descripción — **BREAKING:** detalle del breaking change
```

### Paso 3: Actualizar Versión en Archivos

Dependiendo del ecosistema del proyecto, actualizar:

| Ecosistema | Archivo           | Campo          |
|------------|-------------------|----------------|
| Node.js    | `package.json`    | `"version"`    |
| Python     | `pyproject.toml`  | `version =`    |
| Rust       | `Cargo.toml`      | `version =`    |
| Java/Maven | `pom.xml`         | `<version>`    |
| Go         | `go.mod` + tag    | (via tag)      |

### Paso 4: Commit y Tag

```bash
git add CHANGELOG.md [archivos de versión]
git commit -m "chore(release): v[X.Y.Z]"
git tag -a v[X.Y.Z] -m "Release v[X.Y.Z]"
```

> ⚠️ NO hacer `git push` automáticamente. El usuario debe confirmarlo.

### Paso 5: Checklist Pre-Release

- [ ] Tests pasan en rama principal
- [ ] CHANGELOG.md actualizado
- [ ] Versión actualizada en todos los archivos relevantes
- [ ] ADR creado si hay breaking changes
- [ ] Documentación de API actualizada si cambió contrato público
- [ ] Variables de entorno nuevas documentadas en `.env.example`

---

## Formato de Reporte

```markdown
## Release Candidate: v[X.Y.Z]

**Tipo de bump:** MAJOR | MINOR | PATCH
**Razón:** [commits que determinaron el tipo]

### Cambios incluidos ([N] commits)
[lista del changelog generado]

### Checklist
- [x] CHANGELOG.md actualizado
- [x] Versión bumpeada en [archivos]
- [ ] Tests verificados (pendiente)

### Próximos pasos
1. Revisar y confirmar el changelog
2. Ejecutar suite de tests completa
3. Hacer push: `git push origin main --tags`
```
