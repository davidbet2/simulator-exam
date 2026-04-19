/**
 * fill-po-from-messages.mjs
 *
 * Reads translations from src/locales/messages.js and fills the msgstr
 * entries in each locale's .po file. Strings not found in messages.js
 * are left with msgstr "" so Lingui falls back to the Spanish source.
 *
 * Usage: node scripts/fill-po-from-messages.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// 1. Load messages.js via dynamic import (handles all batches correctly)
// ---------------------------------------------------------------------------

const messagesUrl = pathToFileURL(path.join(ROOT, 'src/locales/messages.js')).href;
const { messages: allMessages } = await import(messagesUrl);

const LOCALES = ['en', 'fr', 'pt', 'de', 'it', 'zh', 'ja'];
const translations = {};
for (const locale of LOCALES) {
  translations[locale] = allMessages[locale] ?? {};
  const count = Object.keys(translations[locale]).length;
  console.log(`  ${locale}: ${count} entries loaded`);
}

// ---------------------------------------------------------------------------
// 2. Process each .po file
// ---------------------------------------------------------------------------

/**
 * Escape a string for PO file msgstr value.
 * PO format requires: " \ → \\ and " → \"
 */
function escapePo(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

for (const locale of LOCALES) {
  const poPath = path.join(ROOT, `src/locales/${locale}/messages.po`);
  let po = readFileSync(poPath, 'utf-8');

  const dict = translations[locale];
  let filled = 0;
  let skipped = 0;

  // Replace ONLY empty msgstr entries with correct locale translation.
  // Non-empty msgstr are preserved as-is.
  po = po.replace(
    /^(msgid "((?:[^"\\]|\\.)*)")\s*\n^(msgstr "")$/gm,
    (_, msgidLine, msgidRaw) => {
      // Unescape the msgid to get the lookup key
      const key = msgidRaw.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
      const translation = dict[key];
      if (translation && translation.trim()) {
        filled++;
        return `${msgidLine}\nmsgstr "${escapePo(translation)}"`;
      }
      skipped++;
      return `${msgidLine}\nmsgstr ""`;
    },
  );

  writeFileSync(poPath, po, 'utf-8');
  console.log(`  ${locale}: filled ${filled}, skipped ${skipped} (no translation)`);
}

console.log('\nDone. Run "npm run compile" or let the vite plugin handle it at build time.');
