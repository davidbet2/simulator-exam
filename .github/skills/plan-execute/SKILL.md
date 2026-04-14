---
name: plan-execute
description: >
  Plan-first development workflow. Forces a research → plan → confirm → execute loop
  with atomic commits per unit. GSD-methodology equivalent for VS Code Copilot.
  Use when asked to implement, develop, build, create, or add a feature.
argument-hint: "<feature or task to implement>"
disable-model-invocation: false
---

# Skill: Plan-Execute Workflow

## When to Invoke
- User says: "implementa", "develop", "build", "add", "create", "crea", "agrega"
- Before any multi-file implementation begins
- When a task requires more than 1 file change

## Workflow (Strict Order)

### Phase 1 — Research
1. Read all files relevant to the task (don't guess)
2. Check `memory/decisions/` for prior decisions that constrain this task
3. Check `memory/patterns/` for established patterns to follow
4. Identify: what exists, what's missing, what's impacted

### Phase 2 — Plan (Present to User Before Executing)
Present a structured plan in this exact format:

```
## Implementation Plan: <task name>

### Scope
- Files to create: [list]
- Files to modify: [list]
- Files to delete: [list — requires confirmation]

### Approach
<2-3 sentence explanation of the approach and why>

### Steps (in order)
1. [Step description] → commit: `type(scope): message`
2. [Step description] → commit: `type(scope): message`
...

### Assumptions
- [List any assumptions made]

### Out of Scope
- [What this plan explicitly does NOT include]

---
Reply `/approve` or describe changes to the plan.
```

**STOP HERE. Do not write code until the user approves.**

### Phase 3 — Execution (After Approval)
- Execute ONE step at a time from the approved plan
- After each step: run relevant tests/lint if available
- Commit with the exact message from the plan
- State completion: "Step N done — committed as `<hash>`"
- **If a deviation is required**: stop, explain why, get approval before continuing

### Phase 4 — Verification
After all steps complete:
1. Re-read the original request
2. Verify each file matches the plan
3. Run full test suite (if configured)
4. State: "Implementation complete. <N> commits. All steps verified."

### Phase 5 — Memory Update
Write a brief decision record if the task involved a non-obvious architectural choice:
- `memory/decisions/YYYY-MM-DD-<topic>.md` — ADR if architectural
- `memory/patterns/` — append to relevant pattern file if a new pattern emerged

## Deviation Handling
If during execution you discover:
- The plan is wrong → STOP, explain, show revised plan, wait for re-approval
- A file is in an unexpected state → STOP, show what you found, ask how to proceed
- A test fails → STOP, diagnose, present fix options

## Atomic Commit Rules
- One logical change per commit
- Commit format: `type(scope): imperative sentence` (max 72 chars)
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- Never commit secrets, never bypass `--no-verify`

## Memory Integration
Use the `memory-files` MCP (filesystem) during Research phase:
- Read `memory/patterns/*.md` for project patterns
- Read `memory/decisions/` for prior constraints
- After execution: write to `memory/decisions/` if a decision was made
