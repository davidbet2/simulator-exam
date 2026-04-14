---
mode: 'agent'
tools: ['codebase', 'changes', 'problems']
description: 'Review code for security vulnerabilities (OWASP Top 10), quality, and architecture.'
---

# Code Review

## Trigger
Activate when: "review", "audit", "check this code", or after writing significant changes.

## Process
Execute always in this order. Do not skip steps.

### 1. Get the Changes
Start with: check the Changes tab or run `git diff HEAD` to see what's been modified.
Focus the review on modified files.

### 2. Security (OWASP Top 10)
- [ ] **Injection** — SQL injection, command injection, XSS, LDAP injection
- [ ] **Broken Authentication** — Hardcoded credentials, exposed tokens, JWT without validation
- [ ] **Data Exposure** — PII in logs, secrets in code, unencrypted sensitive data
- [ ] **Access Control** — Missing authorization, IDOR, privilege escalation
- [ ] **Misconfiguration** — Insecure defaults, stack traces in error responses
- [ ] **Vulnerable Dependencies** — Known CVEs in changed dependencies
- [ ] **Logging/Monitoring** — Critical actions without logs, insufficient log context

### 3. Code Quality
- [ ] **Cyclomatic complexity** — Functions with more than 10 branches
- [ ] **Single responsibility** — Each function/class does one thing
- [ ] **DRY** — Duplication that should be abstracted
- [ ] **Naming** — Variables, functions, and classes communicate intent
- [ ] **Error handling** — Silent errors, empty catches
- [ ] **Magic values** — Unnamed numeric/string constants

### 4. Architecture
- [ ] **Layer separation** — UI code calling DB directly?
- [ ] **Dependency direction** — Business logic depending on frameworks?
- [ ] **Coupling** — Modules too intertwined?

### 5. Testing
- [ ] **Edge cases** — null, empty, overflow, concurrency
- [ ] **Brittle tests** — Tests depending on order or timing
- [ ] **Over-mocking** — Tests that mock too much test nothing real

## Output Format
Organize feedback by priority:
- **🔴 Critical** — Must fix before merging
- **🟡 Warning** — Should fix
- **🔵 Suggestion** — Consider improving

Include specific code examples showing how to fix each issue.
