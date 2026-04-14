#!/usr/bin/env node
/**
 * run-bash.js — Portable Bash hook runner for Windows + Unix
 *
 * Finds a shell (bash → sh) and runs the given script, passing stdin
 * through. Exits 0 gracefully if no shell is found so Claude Code is
 * never blocked on Windows where bash may not be in PATH.
 *
 * On Windows, Git Bash is tried first via common install paths.
 *
 * Usage (from settings.json hooks):
 *   node "$CLAUDE_PROJECT_DIR/.claude/hooks/run-bash.js" "$CLAUDE_PROJECT_DIR/.claude/hooks/some/hook.sh"
 */

const { spawnSync } = require('child_process');
const path = require('path');

const script = process.argv[2];
if (!script) process.exit(0);

// Candidate shells in priority order
const candidates = [
  'bash',   // Unix default / Git Bash in PATH on Windows
  'sh',     // POSIX fallback
];

// Common Windows Git Bash install paths (if not in PATH)
if (process.platform === 'win32') {
  const gitBashPaths = [
    'C:\\Program Files\\Git\\bin\\bash.exe',
    'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
    'C:\\Git\\bin\\bash.exe',
  ];
  candidates.push(...gitBashPaths);
}

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

  // Shell found — exit with its exit code (or 0 if signal-killed)
  process.exit(result.status ?? 0);
}

// No shell found — exit 0 to avoid blocking Claude
process.stderr.write('[run-bash] No shell found (bash/sh). GSD shell hook skipped gracefully.\n');
process.exit(0);
