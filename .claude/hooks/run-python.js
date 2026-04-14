#!/usr/bin/env node
/**
 * run-python.js — Portable Python hook runner
 *
 * Finds Python (py → python3 → python) and runs the given script,
 * passing stdin through. Exits 0 gracefully if Python is not installed
 * so Claude Code is never blocked by a missing interpreter.
 *
 * Usage (from settings.json hooks):
 *   node "$CLAUDE_PROJECT_DIR/.claude/hooks/run-python.js" "$CLAUDE_PROJECT_DIR/.claude/hooks/some/hook.py"
 */

const { spawnSync } = require('child_process');

const script = process.argv[2];
if (!script) process.exit(0);

const candidates = ['py', 'python3', 'python'];

for (const cmd of candidates) {
  const result = spawnSync(cmd, [script], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: process.env,
    windowsHide: true,
  });

  if (result.error?.code === 'ENOENT') {
    // This candidate not found — try next
    continue;
  }

  // Python found — exit with its exit code (or 0 if signal-killed)
  process.exit(result.status ?? 0);
}

// No Python found — exit 0 to avoid blocking Claude
process.stderr.write('[run-python] Python not found (py/python3/python). Skipping hook.\n');
process.exit(0);
