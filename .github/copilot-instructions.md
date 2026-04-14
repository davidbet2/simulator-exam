# Project Instructions for GitHub Copilot

> Loaded automatically by GitHub Copilot in every session.
> For full details see `CLAUDE.md` and `docs/architecture.md`.

---

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | `AppianSimulator-Exam` |
| **Type** | `spa` |
| **Stack** | `[to be defined per project]` |
| **Version** | `0.0.0` |

**Summary:** [What this project does and for whom]

---

## Architecture

```
src/
├── api/    → External contracts (HTTP, gRPC, events)
├── core/   → Business logic, framework-free
└── ...     → [Project-specific modules]
```

> Full details: `docs/architecture.md` | Decisions: `docs/decisions/`

---

## Behavior Principles

- **Minimal code** — No extra features, no single-use abstractions, no unrequested flexibility
- **Surgical changes** — Don't improve adjacent code. Every changed line must trace to the request
- **Explicit assumptions** — State assumptions before implementing. Present options when multiple interpretations exist
- **Plan first** — For complex tasks, share a brief plan and get approval before executing

---

## Memory System

This project uses a file-based memory system at `memory/`. Copilot has read/write access via the `memory-files` MCP server (filesystem).

| Directory | Purpose |
|-----------|---------|
| `memory/sessions/` | Session logs written by the activity hook (append-only) |
| `memory/decisions/` | Architectural decisions — read before structural changes |
| `memory/patterns/` | Reusable patterns discovered during development |
| `memory/knowledge/` | Domain knowledge graph (JSON) |

**Rules:**
- Before any multi-file implementation: check `memory/decisions/` for constraints
- After a non-obvious architectural choice: write an ADR to `memory/decisions/YYYY-MM-DD-<topic>.md`
- Do NOT log passwords, tokens, or PII to any memory file

---

## Available Prompts

Invoke with `/` in the VS Code chat input:

| Prompt | Purpose |
|--------|---------|
| `code-review` | Security (OWASP) + quality + architecture audit |
| `debug` | Systematic root cause analysis |
| `architecture` | Design new components with ADR |
| `documentation` | Generate technical documentation |
| `refactor` | Structured refactoring with clear plan |
| `release` | Full release flow: version, CHANGELOG, tag |
| `pr-review` | Review open PR with live diff |
| `health-check` | Diagnose project setup health |
| `ensure-tools` | Verify and install required CLI tools |

---

## Available Agents

Switch in the Agents dropdown (⌘K or the model picker):

| Agent | Specialty |
|-------|-----------|
| `code-reviewer` | Code quality + OWASP security checklist |
| `debugger` | Root cause → fix → verify |
| `security-auditor` | Full OWASP Top 10 audit |
| `performance-analyst` | N+1, memory leaks, bottleneck analysis |
| `architect` | Design decisions + ADR creation |
| `explore` | Read-only codebase Q&A and exploration |

### Plan-Execute Workflow (GSD-lite)
For multi-step features, trigger the **plan-execute skill**:
- Say "implementa [X]" or "develop [X]" — Copilot will research → plan → confirm → execute in atomic commits
- Plan is presented first; execution starts only after your approval
- Each step is committed separately with conventional commit messages

---

## Git Conventions

- **Branches**: `type/short-description` — types: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`
- **Commits**: `type(scope): imperative message` — e.g. `feat(api): add user endpoint`
- **PRs**: Always reference issue. Use template if exists.

---

## Security (Always Active)

- Never commit secrets, tokens, or credentials — use `.env` files
- Validate input at system boundaries only (never in internal layers)
- Review OWASP Top 10 in every code review
- Protected files (require explicit confirmation): `.env`, `*.key`, `**/migrations/**`, `**/prod/**`

---

## Restrictions

- ⛔ No destructive git commands (`--force`, `reset --hard`) without explicit confirmation
- ⛔ No deleting files or directories without confirmation
- ⚠️ Always consult `docs/decisions/` before architectural changes
- ℹ️ VS Code reads `.claude/settings.json` hooks natively — no need to duplicate hook config
