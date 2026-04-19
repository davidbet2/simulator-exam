import { readFileSync, writeFileSync } from 'fs'

let content = readFileSync('src/locales/es/messages.po', 'utf8')

// Fill empty msgstr with the msgid value for single-line strings
content = content.replace(/msgid ("(?:[^"\\]|\\.)*")\nmsgstr ""/g, (match, id) => {
  if (id === '""') return match
  return `msgid ${id}\nmsgstr ${id}`
})

writeFileSync('src/locales/es/messages.po', content, 'utf8')
console.log('Done')
