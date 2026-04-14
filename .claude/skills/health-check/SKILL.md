---
name: health-check
description: Diagnoses the health of this Claude Code project setup — hooks, skills, MCPs, memory, and settings. Use when something feels broken or to verify setup after pulling changes.
disable-model-invocation: true
allowed-tools: Bash(node *) Bash(git *) Bash(where *) Bash(which *)
---

# Health Check — Claude Code Project Setup

Run a complete diagnostic of this project's Claude Code configuration.

## 1. Settings Validation

```!
node -e "
  const fs = require('fs');
  try {
    const s = JSON.parse(fs.readFileSync('.claude/settings.json', 'utf8'));
    const hooks = Object.keys(s.hooks || {});
    const mcps = Object.keys(s.mcpServers || {});
    console.log('✅ settings.json: valid JSON');
    console.log('   Hook events:', hooks.length, '-', hooks.join(', '));
    console.log('   MCP servers:', mcps.length, '-', mcps.join(', '));
  } catch(e) { console.log('❌ settings.json:', e.message); }
" 2>&1
```

## 2. CLAUDE.md Size Check

```!
node -e "
  const fs = require('fs');
  const lines = fs.readFileSync('CLAUDE.md', 'utf8').split('\n').length;
  const status = lines <= 250 ? '✅' : '⚠️';
  console.log(status + ' CLAUDE.md:', lines, 'lines (limit: 250)');
" 2>&1
```

## 3. Skills Inventory

```!
node -e "
  const fs = require('fs'), path = require('path');
  const skillsDir = '.claude/skills';
  if (!fs.existsSync(skillsDir)) { console.log('❌ .claude/skills/ not found'); process.exit(0); }
  const skills = fs.readdirSync(skillsDir).filter(d =>
    fs.existsSync(path.join(skillsDir, d, 'SKILL.md'))
  );
  console.log('Skills found:', skills.length);
  skills.forEach(s => {
    const content = fs.readFileSync(path.join(skillsDir, s, 'SKILL.md'), 'utf8');
    const hasFrontmatter = content.startsWith('---');
    const hasDesc = content.includes('description:');
    const icon = (hasFrontmatter && hasDesc) ? '✅' : '⚠️';
    console.log(icon, s, hasFrontmatter ? '(frontmatter)' : '(NO frontmatter)');
  });
" 2>&1
```

## 4. Agents Inventory

```!
node -e "
  const fs = require('fs'), path = require('path');
  const agentsDir = '.claude/agents';
  if (!fs.existsSync(agentsDir)) { console.log('❌ .claude/agents/ not found'); process.exit(0); }
  const agents = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  console.log('Agents found:', agents.length);
  agents.forEach(f => {
    const content = fs.readFileSync(path.join(agentsDir, f), 'utf8');
    const isGSD = f.startsWith('gsd-');
    const hasFrontmatter = content.startsWith('---');
    const icon = isGSD ? '🤖' : (hasFrontmatter ? '✅' : '⚠️');
    const label = isGSD ? '(GSD)' : '(custom)';
    if (!isGSD) console.log(icon, f, label);
  });
  const custom = agents.filter(f => !f.startsWith('gsd-'));
  const gsd = agents.filter(f => f.startsWith('gsd-'));
  console.log('Custom:', custom.length, '| GSD:', gsd.length);
" 2>&1
```

## 5. Python / Node.js Availability

```!
node -e "
  const { execSync } = require('child_process');
  const cmds = [
    ['node', '--version'],
    ['npm', '--version'],
    ['py', '--version'],
    ['python3', '--version'],
    ['python', '--version'],
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

## 6. Environment Variables Check

```!
node -e "
  const vars = ['TAVILY_API_KEY', 'SEMGREP_APP_TOKEN', 'CLAUDE_PROJECT_DIR'];
  vars.forEach(v => {
    const val = process.env[v];
    if (val) {
      const masked = val.substring(0,4) + '...' + val.substring(val.length-4);
      console.log('✅', v + ':', masked);
    } else {
      console.log('⚠️', v + ': not set');
    }
  });
" 2>&1
```

## 7. Git Status

```!
git log --oneline -5 2>&1
```

## 8. Memory Directory Structure

```!
node -e "
  const fs = require('fs');
  const dirs = ['memory/sessions', 'memory/patterns', 'memory/decisions', 'memory/knowledge'];
  dirs.forEach(d => {
    const exists = fs.existsSync(d);
    console.log(exists ? '✅' : '⚠️', d, exists ? '' : '(missing)');
  });
" 2>&1
```

---

Report any ⚠️ or ❌ items above and explain how to fix each.
