---
mode: 'agent'
tools: ['codebase', 'terminal', 'problems']
description: 'Diagnoses the health of the project setup — hooks, instructions, MCPs, and settings.'
---

# Health Check

## Trigger
Activate when: "health check", "check setup", "verify installation", "something feels broken".

## Diagnostic Steps

### 1. VS Code Copilot Customization Files
Check for presence of key files:
```bash
# Check GitHub Copilot files
Test-Path .github/copilot-instructions.md
Test-Path .github/instructions/
Test-Path .github/prompts/
Test-Path .github/agents/
Test-Path .github/hooks/
Test-Path .vscode/mcp.json
```

### 2. Claude Code Configuration
```bash
# Validate settings.json
node -e "
  const fs = require('fs');
  try {
    const s = JSON.parse(fs.readFileSync('.claude/settings.json', 'utf8'));
    const hooks = Object.keys(s.hooks || {});
    const mcps = Object.keys(s.mcpServers || {});
    console.log('settings.json: valid');
    console.log('Hook events:', hooks.join(', '));
    console.log('MCP servers:', mcps.join(', '));
  } catch(e) { console.log('settings.json ERROR:', e.message); }
" 2>&1
```

### 3. MCP Connectivity
```bash
# Check if MCP servers can start (requires npx)
node --version 2>&1
npx --version 2>&1
```

### 4. Hook Scripts
```bash
# Verify Python hook scripts are present
Get-ChildItem .claude/hooks/ -Recurse -Filter "*.py" | Select-Object Name
```

### 5. Memory Structure
```bash
Get-ChildItem memory/ -ErrorAction SilentlyContinue | Select-Object Name, PSIsContainer
```

### 6. Git Configuration
```bash
git config --list | Select-String "user\."
git log --oneline -5
```

## Output Format
Report each check as: ✅ OK | ⚠️ Warning | ❌ Error

End with a summary of issues found and recommended fixes.
