---
name: health-check
description: Diagnoses the health of this Copilot project setup — hooks, skills, MCPs, memory, and settings. Use when something feels broken or to verify setup after pulling changes.
disable-model-invocation: true
allowed-tools: Bash(node *) Bash(git *) Bash(where *) Bash(which *)
---

# Health Check — Project Setup Diagnostic

Run a complete diagnostic of this project's AI assistant configuration.

## 1. Copilot Skills Inventory

```!
node -e "
  const fs = require('fs'), path = require('path');
  const locations = ['.github/skills', '.claude/skills'];
  locations.forEach(skillsDir => {
    if (!fs.existsSync(skillsDir)) return;
    const skills = fs.readdirSync(skillsDir).filter(d =>
      fs.existsSync(path.join(skillsDir, d, 'SKILL.md'))
    );
    console.log('Skills in', skillsDir + ':', skills.length);
    skills.forEach(s => {
      const content = fs.readFileSync(path.join(skillsDir, s, 'SKILL.md'), 'utf8');
      const hasFrontmatter = content.startsWith('---');
      const hasDesc = content.includes('description:');
      const icon = (hasFrontmatter && hasDesc) ? '✅' : '⚠️';
      console.log(' ', icon, s);
    });
  });
" 2>&1
```

## 2. Copilot Agents Inventory

```!
node -e "
  const fs = require('fs'), path = require('path');
  const agentsDir = '.github/agents';
  if (!fs.existsSync(agentsDir)) { console.log('❌ .github/agents/ not found'); process.exit(0); }
  const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  console.log('Agents found:', agents.length);
  agents.forEach(f => {
    const content = fs.readFileSync(path.join(agentsDir, f), 'utf8');
    const hasFrontmatter = content.startsWith('---');
    const icon = hasFrontmatter ? '✅' : '⚠️';
    console.log(' ', icon, f);
  });
" 2>&1
```

## 3. Instructions Files

```!
node -e "
  const fs = require('fs'), path = require('path');
  const instrDir = '.github/instructions';
  if (!fs.existsSync(instrDir)) { console.log('❌ .github/instructions/ not found'); process.exit(0); }
  const files = fs.readdirSync(instrDir).filter(f => f.endsWith('.md'));
  console.log('Instructions found:', files.length);
  files.forEach(f => {
    const content = fs.readFileSync(path.join(instrDir, f), 'utf8');
    const hasApplyTo = content.includes('applyTo:');
    const icon = hasApplyTo ? '✅' : '⚠️';
    console.log(' ', icon, f, hasApplyTo ? '(applyTo set)' : '(no applyTo)');
  });
" 2>&1
```

## 4. Hooks Configuration

```!
node -e "
  const fs = require('fs'), path = require('path');
  const hooksDir = '.github/hooks';
  if (!fs.existsSync(hooksDir)) { console.log('❌ .github/hooks/ not found'); process.exit(0); }
  const files = fs.readdirSync(hooksDir).filter(f => f.endsWith('.json'));
  console.log('Hook files found:', files.length);
  files.forEach(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(hooksDir, f), 'utf8'));
      const events = Object.keys(data.hooks || {});
      console.log('  ✅', f, '— events:', events.join(', '));
    } catch(e) {
      console.log('  ❌', f, '— invalid JSON:', e.message);
    }
  });
" 2>&1
```

## 5. MCP Servers

```!
node -e "
  const fs = require('fs');
  if (!fs.existsSync('.vscode/mcp.json')) { console.log('⚠️ .vscode/mcp.json not found'); process.exit(0); }
  try {
    const data = JSON.parse(fs.readFileSync('.vscode/mcp.json', 'utf8'));
    const servers = Object.keys(data.servers || {});
    console.log('MCP servers:', servers.length);
    servers.forEach(s => console.log('  ✅', s));
  } catch(e) { console.log('❌ .vscode/mcp.json:', e.message); }
" 2>&1
```

## 6. Node.js / Git Availability

```!
node -e "
  const { execSync } = require('child_process');
  const cmds = [
    ['node', '--version'],
    ['npm', '--version'],
    ['git', '--version'],
    ['gh', '--version'],
  ];
  cmds.forEach(([cmd, arg]) => {
    try {
      const v = execSync(cmd + ' ' + arg, {stderr:'pipe'}).toString().trim().split('\n')[0];
      console.log('✅', cmd + ':', v);
    } catch(e) {
      console.log('❌', cmd + ': not found');
    }
  });
" 2>&1
```

## 7. Git Status

```!
git log --oneline -5 2>&1
```

---

Report any ⚠️ or ❌ items above and explain how to fix each.
