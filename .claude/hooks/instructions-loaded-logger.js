#!/usr/bin/env node
// Hook: InstructionsLoaded — logs when instruction files are loaded
const fs = require('fs');

let data = {};
try {
  data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
} catch (_) {}

const memType = data.memory_type || '?';
const filePath = data.file_path || '?';
process.stderr.write(`[Instructions] ${memType}: ${filePath}\n`);
