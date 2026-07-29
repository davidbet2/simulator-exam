# Decisión: Pipeline PDF → Markdown → Preguntas (sin IA)

**Fecha:** 2026-07-29
**Estado:** Aprobada e implementada

## Contexto

El importador de PDF anterior (`importParsers.js`) aplanaba todo el texto a una sola línea (`items.map(i => i.str).join(' ')`), destruyendo la estructura (saltos de línea, columnas, fuentes) y obligando al parser a adivinar preguntas con regex sobre texto plano. Resultado: extracción frágil y errores frecuentes.

El usuario pidió explícitamente **no usar LLMs/IA** por costo.

## Alternativas evaluadas

| Opción | Decisión | Motivo |
|---|---|---|
| Reconstructor propio sobre pdfjs-dist | ✅ Elegida | $0, sin deps nuevas (pdfjs ya instalado), layout suficiente para exámenes |
| `@opendocsg/pdf2md` (npm) | ❌ | Output genérico no orientado a preguntas, dep extra, problemas de memoria con PDFs grandes |
| PyMuPDF4LLM (Python) | ❌ | Licencia **AGPL** (riesgo SaaS comercial) + requiere backend Python (costo de infra) |
| Docling / Marker (Python ML) | ❌ | Infra pesada (modelos, GPU/CPU), stack nuevo, costo |

## Arquitectura implementada

```
PDF ──► pdfToMarkdown.js ──► MD canónico ──► [preview editable] ──► markdownQuestions.js ──► preguntas
```

- **`src/features/creator/utils/pdfToMarkdown.js`** — reconstruye líneas agrupando items de pdfjs por coordenada Y, detecta negrita por `fontName`, detecta layout a 2 columnas (gutter vertical), y emite MD canónico. Heurística extra: si un bloque tiene exactamente una opción en negrita → se infiere como respuesta.
- **`src/features/creator/utils/markdownQuestions.js`** — máquina de estados línea a línea, tolerante a variantes (`# 1.` / `1.` / `A)` / `- A)` / `Answer:` / `Respuesta:` / letras de respuesta sueltas al final).
- **`src/features/creator/components/PdfImportPanel.jsx`** — UI compartida entre Create y Edit (antes duplicada). Preview editable con contador en vivo de preguntas detectadas.
- **Fallback:** si la conversión a MD falla, se intenta el parser legacy (`parseTextToQuestions`) — no hay regresión.

## Gramática MD canónica

```markdown
# 1. ¿Texto de la pregunta?
- A) Opción uno
- B) Opción dos
> Respuesta: B
> Explicación: opcional
```

## Consecuencias

- El MD se convierte en artefacto intermedio de primera clase: soportar "pegar MD directo" como nuevo tab de importación es trivial (follow-up opcional).
- PDFs escaneados siguen sin soportarse (sin OCR por costo) — se mantiene el aviso en UI.
- Solo tipo `multiple` desde PDF (igual que antes); ordering/matching solo por JSON/Excel.
- Tests: `src/features/creator/utils/__tests__/` (23 tests, helpers puros testeados sin pdfjs).

## Validación con PDFs reales (2026-07-29)

Se probó el pipeline contra 2 PDFs oficiales de AWS (sample questions de Cloud Practitioner y Solutions Architect Associate, descargados de `d1.awsstatic.com`). La primera corrida detectó **0 de 20 preguntas** por dos gaps reales, ambos corregidos:

1. **Answer key separado del cuerpo** (formato muy común: preguntas primero, respuestas al final tipo `1. C – rationale`). `parseMarkdownToQuestions` exigía respuesta inline y descartaba todo. Fix: los bloques sin opciones que matchean `letra(s) – texto` se indexan por número de pregunta como "answer key" y se fusionan (answer + explicación) con la pregunta real correspondiente, en vez de tratarse como preguntas inválidas.
2. **Numeración sin espacio** (`4)An analytics company...`): el regex de inicio de pregunta exigía `\s+` tras el delimitador `.`/`)`; se relajó a `\s*` en `pdfToMarkdown.js` y `markdownQuestions.js`.

Tras el fix: 10/10 preguntas detectadas en ambos PDFs, incluyendo multi-respuesta (`Select TWO` → `answer: ['A','B']`).

## Segunda ronda: PDFs de otras disciplinas (2026-07-29, tarde)

Se probaron 3 PDFs oficiales adicionales de disciplinas distintas: **PMI CAPM** (project management, 5 preguntas), **ISTQB CTFL v4.0** (testing de software, 40 preguntas) y **Cambridge B2 First Handbook** (inglés, 90 páginas). Dos bugs reales más encontrados y corregidos:

3. **Negrita no detectada en fuentes subseteadas**: `content.items[].fontName` de pdfjs es un ID de recurso interno (`g_d0_f2`), no el nombre real de la fuente — en PDFs con fuentes subseteadas (común, ej. PMI) nunca contiene "Bold" aunque la fuente sí lo sea. Fix: llamar `page.getOperatorList()` y resolver el nombre real vía `page.commonObjs.get(id).name` (ej. `BCDFEE+Calibri-Bold`) antes de aplicar `BOLD_FONT_RE`. Con esto, el heurístico "opción en negrita = respuesta" (que antes fallaba silenciosamente) empezó a funcionar en el PDF de PMI.
4. **Heurística de negrita no soportaba multi-respuesta**: el PDF de PMI marca preguntas "Choose two" con **dos** opciones en negrita, pero el código solo inferís cuando había *exactamente una*. Se relajó a: "1 o más, pero no todas" las opciones en negrita (todas-en-negrita se sigue tratando como ruido de formato, no como respuesta).
5. **Encabezado de pregunta en línea propia** (`Question #16 (1 Point)` seguido del texto en la línea siguiente — formato de ISTQB): no coincidía con ningún patrón y cayó como texto en negrita normal, siendo descartado como "título de sección". Se agregó detección de este patrón como apertura de bloque de pregunta (con texto vacío que se completa por las líneas de continuación).

Resultado: PMI CAPM pasó de 0/5 a 5/5 preguntas detectadas correctamente (incluida la multi-respuesta).

## Tercera ronda: PDF real del usuario, bilingüe, con answer key por dos puntos (2026-07-29, noche)

El usuario probó un PDF propio (`AWS-Certified-Cloud-Practitioner_Sample-Questions.pdf`, variante distinta a la descargada antes: 6 páginas, dos columnas con español LATAM y español España en paralelo, cada una con sus 10 preguntas + su propio answer key). Solo detectaba 2/20 preguntas. Causa: el answer key de esta variante usa **dos puntos** (`C: rationale`) en vez de guion (`C – rationale`), y `ANSWER_KEY_RE` solo aceptaba guion.

**Fix 6**: `ANSWER_KEY_RE` ahora acepta `:`/`：` además de `–`/`—`/`-` como separador entre la(s) letra(s) y el texto de racional. Resultado: 20/20 preguntas (10 por columna de idioma) con respuesta y explicación correctas, solo 1 bloque genuinamente inválido (un typo real del PDF: `R: Amazon SNS...` usa una letra fuera de A-H, no mapea a ninguna opción — correctamente descartado, no es un fallo del parser).

**Nueva feature — visibilidad de "falta respuesta"**: a pedido del usuario ("indicar de alguna forma qué falta en caso de respuestas"), `parseMarkdownToQuestions` ahora devuelve `{ questions, invalid, missingAnswer }`:
- `missingAnswer`: bloques bien formados (pregunta + opciones válidas) pero sin respuesta resoluble — antes se perdían silenciosamente en `invalid`. Cada item es `{ number, question }` para ubicar la pregunta exacta.
- `invalid` ahora solo cuenta bloques genuinamente rotos (sin texto de pregunta o sin ninguna opción).

`PdfImportPanel.jsx` muestra un aviso ámbar cuando `missingAnswer.length > 0`, listando los números de pregunta afectados, para que el usuario sepa exactamente cuáles completar a mano en el Markdown antes de importar.

## Cuarta ronda: más disciplinas + fix de listas anidadas + plantilla de respuesta (2026-07-29, noche)

Se probó un PDF oficial más — **examen MIR** (residencia médica española, Ministerio de Sanidad, cuadernillo de Cardiología 2023) — y se re-testearon todos los PDFs previos tras los fixes de la sesión.

**Fix 7 (bug real, no cosmético)**: las listas numeradas **dentro** del cuerpo de una pregunta (ej. ISTQB preguntas #17/#18/#34/#39: *"Dadas las siguientes descripciones: 1. ... 2. ... 3. ... 4. ... Y las siguientes actividades:"*) se confundían con el inicio de una nueva pregunta, tanto en `pdfToMarkdown.js` (emitía cada ítem como su propio `# N.`) como en `markdownQuestions.js` (los trataba como bloques nuevos). Esto partía la pregunta real en pedazos y robaba sus opciones reales asignándolas a un bloque falso.
  - Fix: en `markdownQuestions.js`, un número que abre lo que parece una nueva pregunta se rechaza como tal (y se anexa como texto del cuerpo) cuando el bloque actual **todavía no tiene opciones** Y el número candidato es **menor** al número de la pregunta en curso — patrón inequívoco de sub-lista anidada, ya que la numeración real de preguntas siempre es creciente.
  - Resultado en ISTQB: antes había entradas duplicadas/corruptas (`"#4"` repetido 3 veces con texto mezclado); ahora las 40 preguntas aparecen limpias y en orden, cada una con sus 4 opciones reales completas.

**MIR (Cardiología)**: 74 preguntas detectadas correctamente (texto completo, opciones A-D), todas en `missingAnswer` — el Ministerio de Sanidad publica preguntas y plantilla de respuestas en **dos PDFs separados**, igual que ISTQB. Además la plantilla de respuestas usa una **tabla compacta de dos columnas sin delimitador** (`1 A 41 B`, dos pares número-letra por línea de texto) — un formato de grid que requeriría un parser dedicado (no es "una pregunta por línea"), distinto de cualquier variante de answer-key ya soportada. Confirma una tercera limitación de formato (ver abajo), no un bug a corregir hoy.

**Regresión completa**: los 6 PDFs de rondas anteriores (AWS ×2, PMI, ISTQB, y el PDF bilingüe del usuario) se re-verificaron tras cada fix — sin regresiones, todos mantienen su tasa de detección.

**Nueva funcionalidad — plantilla de respuesta rápida**: `insertAnswerTemplates(markdown, numbers)` en `markdownQuestions.js` inserta una línea `> Respuesta:` lista para completar justo después de las opciones de cada pregunta en `missingAnswer`. En `PdfImportPanel.jsx`, un recuadro ámbar lista las preguntas afectadas con sus opciones disponibles y un botón de un clic para insertar todas las plantillas — el usuario solo escribe la letra en vez de la línea completa. Validado end-to-end con las 40 preguntas de ISTQB (sin ninguna respuesta en el PDF original): tras completar las plantillas, las 40 pasan a válidas.

### Limitaciones confirmadas (no bugs, fuera de alcance actual)

- **ISTQB y MIR**: ambos publican preguntas y respuestas en **dos PDFs separados**, sin ningún texto que los vincule. El importador solo acepta un PDF a la vez — soportar esto requeriría una feature de "importar 2 archivos y fusionar por número", fuera de alcance de hoy. Mitigado en la práctica por la plantilla de respuesta rápida (ver arriba): el usuario importa el PDF de preguntas y completa las respuestas a mano consultando el PDF de respuestas en paralelo.
- **MIR — tabla de respuestas en grid**: además del punto anterior, la plantilla de respuestas del MIR es una tabla de 2 columnas sin delimitador (`1 A 41 B`) — ni siquiera pegándola manualmente en el Markdown la reconocería el parser actual (que asume "una pregunta por línea"). Requeriría un modo de parseo de grid dedicado.
- **Cambridge (idiomas)**: el handbook de 90 páginas es material de formación para profesores (ensayos de ejemplo, rúbricas), no un banco de preguntas — no contiene el formato `A) B) C) D)` vertical en ningún punto. Los exámenes reales de "Reading and Use of English" de Cambridge suelen usar opciones **en una sola línea horizontal** (`0  A wondered  B thought  C imagined  D considered`), un layout que el parser actual (una opción por línea) no soporta. Sería un parser de layout distinto, no un fix puntual.
