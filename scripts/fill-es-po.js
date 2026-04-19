import { readFileSync, writeFileSync } from 'fs';
const fs = { readFileSync, writeFileSync };
const content = fs.readFileSync('src/locales/es/messages.po', 'utf8');
const lines = content.split('\n');
const result = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  result.push(line);
  const nextLine = lines[i + 1] || '';
  if (line.startsWith('msgid ') && nextLine === 'msgstr ""') {
    const msgidVal = line.slice(6); // everything after 'msgid '
    result.push('msgstr ' + msgidVal);
    i++; // skip the empty msgstr line
  }
}
fs.writeFileSync('src/locales/es/messages.po', result.join('\n'), 'utf8');
console.log('Done: filled empty msgstr in es/messages.po');
