---
mode: 'agent'
tools: ['terminal']
description: 'Verifies if a required CLI tool is installed and offers to install it.'
---

# Ensure Tools

## Trigger
Activate when: about to use a CLI tool that might not be installed, "check dependencies",
"is X installed?", "setup environment", "install Y if missing".

Also activate automatically before running a command whose binary might not exist.

## Process

### Step 1: Check if the Tool is Available

**Windows (PowerShell):**
```powershell
Get-Command <tool> -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
```

**Unix/macOS:**
```bash
which <tool> 2>/dev/null || command -v <tool> 2>/dev/null
```

A missing output means the tool is not installed.

### Step 2: If Missing, Offer to Install

Present the installation options based on the detected OS and package managers:

| Tool | Windows | macOS | Linux |
|------|---------|-------|-------|
| Node.js | `winget install OpenJS.NodeJS.LTS` | `brew install node` | `apt install nodejs` |
| Python | `winget install Python.Python.3` | `brew install python3` | `apt install python3` |
| Git | `winget install Git.Git` | `brew install git` | `apt install git` |
| gh CLI | `winget install GitHub.cli` | `brew install gh` | See https://cli.github.com |
| jq | `winget install jqlang.jq` | `brew install jq` | `apt install jq` |

For npm packages: `npm install -g <package>` or `npx <package>` (no install needed)

### Step 3: Verify After Installation
After installing, re-check that the tool is available and show the version:
```bash
<tool> --version
```

## Output Format
```
Checking for <tool>...
✅ Found: <tool> vX.Y.Z at /path/to/tool
— or —
❌ Not found: <tool>
Install with: [command]
```
