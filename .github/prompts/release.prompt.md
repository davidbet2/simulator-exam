---
mode: 'agent'
tools: ['codebase', 'terminal', 'changes']
description: 'Manages the full release process: versioning, CHANGELOG, git tags, and publishing.'
---

# Release

## Trigger
Activate when: "prepare release", "bump version", "create release", "publish version".

## Process
Follows [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/).

### Step 1: Determine Version Type
Analyze commits since last tag to determine the bump:
```
PATCH (0.0.X) → Only fix, chore, docs commits
MINOR (0.X.0) → At least one feat commit
MAJOR (X.0.0) → Any commit with BREAKING CHANGE footer or ! after type
```

Get commits: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`

### Step 2: Update CHANGELOG.md
Add new section at the top:
```markdown
## [X.Y.Z] — YYYY-MM-DD

### Breaking Changes
- ...

### Added
- feat(scope): description (commit hash)

### Fixed
- fix(scope): description (commit hash)

### Changed
- ...
```

### Step 3: Bump Version
Update the version in the relevant manifest:
- Node.js: `package.json` → `"version": "X.Y.Z"`
- Python: `pyproject.toml` → `version = "X.Y.Z"`
- Rust: `Cargo.toml` → `version = "X.Y.Z"`

### Step 4: Commit and Tag
```bash
git add CHANGELOG.md package.json  # (or equivalent)
git commit -m "chore(release): bump version to X.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

### Step 5: Publish (if applicable)
- `npm publish` for npm packages
- `git push origin main --tags` for GitHub releases

## Checklist Before Releasing
- [ ] All tests pass
- [ ] CHANGELOG.md updated
- [ ] Version bumped in manifests
- [ ] No uncommitted secrets or credentials
- [ ] Branch is up to date with main
