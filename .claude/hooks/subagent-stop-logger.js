#!/usr/bin/env node
// Hook: SubagentStop — logs subagent completion summary
const fs = require('fs');

let data = {};
try {
  data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch (_) {}

const agent = data.agent_type || 'unknown';
const msg = (data.last_assistant_message || '').slice(0, 120);
process.stderr.write(`[SubagentStop] ${agent}: ${msg}\n`);
