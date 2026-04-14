#!/usr/bin/env node
// Hook: StopFailure — logs failed stop attempts to memory/sessions/
const fs = require('fs');
const path = require('path');

let data = {};
try {
  data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch (_) {}

const err = data.error || 'unknown';
const details = data.error_details || '';
process.stderr.write(`[StopFailure] ${err}: ${details}\n`);

const logDir = path.join(process.env.CLAUDE_PROJECT_DIR || '.', 'memory', 'sessions');
try {
  fs.mkdirSync(logDir, { recursive: true });
  fs.appendFileSync(
    path.join(logDir, 'stop-failures.log'),
    `${new Date().toISOString()} ${err}\n`
  );
} catch (_) {}
