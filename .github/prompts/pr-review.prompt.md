---
mode: 'agent'
tools: ['codebase', 'terminal', 'changes']
description: 'Reviews a pull request with live diff, changed files, and structured feedback.'
---

# PR Review

## Trigger
Activate when: "review PR", "review pull request", "check this PR", "before merging".

## Setup
Requires `gh` CLI. If not installed, use the `ensure-tools` prompt first.

## Pull Request Context

Get the PR diff:
```bash
gh pr diff 2>/dev/null || echo "No active PR — use: gh pr checkout <number>"
```

Get PR description and metadata:
```bash
gh pr view --json title,body,comments,state,additions,deletions,files 2>/dev/null
```

Get list of changed files:
```bash
gh pr diff --name-only 2>/dev/null
```

## Review Process

### 1. Understand the Change
- Read the PR description — what problem does it solve?
- Look at the list of changed files — is the scope reasonable?
- Check the size — is it small enough to review effectively?

### 2. Security Check
Apply the same OWASP checklist as the `code-review` prompt:
- Injection vulnerabilities, auth issues, secrets in code
- Input validation at API boundaries
- Access control on new/modified endpoints

### 3. Code Quality
- Does the code match the project's conventions?
- Are there obvious bugs or edge cases missed?
- Is there unnecessary complexity?

### 4. Tests
- Do new features have tests?
- Do bug fixes include regression tests?
- Do tests actually cover the changed paths?

### 5. Documentation
- Are public interfaces documented?
- Is the CHANGELOG updated if needed?

## Output Format
Structure feedback as:
```
## PR Review: [PR title]

**Summary:** [One-line assessment — approve/request changes/block]

### 🔴 Must Fix (blocks merge)
- ...

### 🟡 Should Fix (request changes)  
- ...

### 🔵 Suggestions (optional)
- ...

### ✅ Looks good
- ...
```
