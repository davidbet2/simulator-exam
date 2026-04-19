import re

with open('src/locales/es/messages.po', 'r', encoding='utf-8') as f:
    content = f.read()

def fill_empty(match):
    msgid_val = match.group(1)
    if msgid_val == '""':
        return match.group(0)
    return f'msgid {msgid_val}\nmsgstr {msgid_val}'

result = re.sub(r'msgid (".*?")\nmsgstr ""', fill_empty, content, flags=re.DOTALL)

with open('src/locales/es/messages.po', 'w', encoding='utf-8') as f:
    f.write(result)

print('Done')
