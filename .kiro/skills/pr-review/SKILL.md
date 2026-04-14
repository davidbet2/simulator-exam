---
name: pr-review
description: Reviews a pull request with live diff, comments, and changed files. Use when reviewing a PR, before merging, or when the user asks to review a pull request.
---

# PR Review

## Pull request context

- **PR diff:**
```!
gh pr diff 2>/dev/null || echo "No active PR found. Use: gh pr view --json number -q .number"
```

- **PR description and comments:**
```!
gh pr view --json title,body,comments,state,additions,deletions 2>/dev/null || echo "No active PR"
```

- **Changed files:**
```!
gh pr diff --name-only 2>/dev/null || echo "Run: git diff main...HEAD --name-only"
```

## Review Task

Perform a thorough code review of this pull request:

### 1. Summary
- What does this PR change?
- Is the description clear and accurate?
- Is the scope appropriate (not too big)?

### 2. Security Check
- SQL injection, XSS, command injection risks?
- Secrets or credentials exposed?
- Authentication/authorization changes?
- Input validation present?

### 3. Code Quality
- Follows existing patterns and naming conventions?
- Functions/classes have single responsibility?
- Error handling is appropriate?
- No dead code or debug artifacts?

### 4. Tests
- New functionality covered by tests?
- Edge cases considered?
- Tests are meaningful (not just coverage)?

### 5. Performance
- Any N+1 query risks?
- Any blocking operations that should be async?
- Any unnecessary loops or redundant computations?

### 6. Breaking Changes
- Any API changes without version bumping?
- Any database migrations with rollback strategy?
- Any changes to shared configuration?

## Output Format

```markdown
## PR Review — [PR Title]

### ✅ Approved / ⚠️ Changes Requested / 🔴 Blocked

**Summary:** [1-2 sentences about what this PR does]

**Additions:** X lines | **Deletions:** Y lines | **Files:** Z

---

### 🔴 Critical Issues (must fix)
[List any blockers]

### 🟡 Warnings (should fix)  
[List improvements]

### 🔵 Suggestions (consider)
[List nice-to-haves]

### ✅ Done well
[Acknowledge good patterns]
```
