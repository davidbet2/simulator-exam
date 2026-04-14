#!/usr/bin/env node
// Hook: PermissionDenied — logs blocked tool calls
const fs = require('fs');

let data = {};
try {
  data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch (_) {}

const tool = data.tool_name || '?';
const reason = data.reason || '?';
process.stderr.write(`[PermissionDenied] ${tool}: ${reason}\n`);
