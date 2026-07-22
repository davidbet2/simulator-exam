#!/usr/bin/env node
/**
 * generate-sets.mjs — Generador batch de exámenes con LLM.
 *
 * Lee scripts/generator/exam-catalog.mjs, llama al LLM configurado para producir
 * 50 preguntas originales por examen, valida el JSON y escribe un archivo .mjs
 * por batch en scripts/seed-data/.
 *
 * USO:
 *   # 1. Define tu API key en .env (o exporta en shell):
 *   #    OPENAI_API_KEY=sk-...      (recomendado: gpt-4o-mini, barato)
 *   #    GEMINI_API_KEY=...         (recomendado: gemini-2.0-flash, tier gratuito)
 *   #    ANTHROPIC_API_KEY=sk-ant-... (claude-3-5-haiku-latest)
 *   #
 *   # 2. (opcional) LLM_PROVIDER=openai|gemini|anthropic para forzar uno
 *   #
 *   # 3. Ejecutar:
 *   node scripts/generator/generate-sets.mjs                    # genera todos los pendientes
 *   node scripts/generator/generate-sets.mjs --batch sports     # solo un batch
 *   node scripts/generator/generate-sets.mjs --slug nasm-cpt-fundamentos  # solo un slug
 *   node scripts/generator/generate-sets.mjs --questions 30     # menos preguntas (default 50)
 *   node scripts/generator/generate-sets.mjs --concurrency 3    # paralelismo (default 2)
 *   node scripts/generator/generate-sets.mjs --force            # regenera aunque exista
 *
 * SALIDA:
 *   scripts/seed-data/sets-<batch>.mjs              (uno por batch)
 *   scripts/generator/.cache/<slug>.json            (cache por examen para reanudar)
 *
 * Después: ejecuta `node scripts/seed-official-sets.mjs` para subir a Firestore
 * (recuerda actualizar los imports allí).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

import { EXAM_CATALOG, EXAM_SOURCES } from './exam-catalog.mjs';
import { buildLLMClient } from './llm-client.mjs';

config();

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR   = resolve(__dirname, '../..');
const SEED_DIR   = resolve(ROOT_DIR, 'scripts/seed-data');
const CACHE_DIR  = resolve(__dirname, '.cache');

// ─────────────────────────────────────────────
// CLI args
// ─────────────────────────────────────────────
function parseArgs(argv) {
  const out = { batch: null, slug: null, questions: 50, concurrency: 2, force: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--batch')         out.batch = argv[++i];
    else if (a === '--slug')     out.slug = argv[++i];
    else if (a === '--questions') out.questions = parseInt(argv[++i], 10);
    else if (a === '--concurrency') out.concurrency = parseInt(argv[++i], 10);
    else if (a === '--force')    out.force = true;
    else if (a === '--help' || a === '-h') {
      console.log(
        'Uso: node scripts/generator/generate-sets.mjs [--batch X] [--slug Y]\n' +
        '     [--questions N] [--concurrency N] [--force]'
      );
      process.exit(0);
    }
  }
  return out;
}

// ─────────────────────────────────────────────
// Prompt building
// ─────────────────────────────────────────────
function buildSystemPrompt() {
  return `Eres un experto pedagogo y diseñador de exámenes de certificación profesional con acceso a los blueprints y contenidos oficiales de cada certificación.
Tu tarea es generar preguntas de alta calidad BASADAS EN HECHOS REALES del dominio.

REGLAS ESTRICTAS — GROUNDING FACTUAL:
1. SOLO escribe preguntas sobre conceptos, procedimientos o terminología que REALMENTE existen en el dominio.
   - Si la pregunta es sobre una certificación (AWS, PMP, NCLEX…): basa CADA pregunta en el blueprint/exam guide oficial.
   - Si es sobre una disciplina (anatomía, farmacología, JavaScript…): basa CADA pregunta en hechos verificables del dominio.
   - NUNCA inventes conceptos, nombres de herramientas, valores numéricos, siglas o procedimientos.
2. Los valores numéricos (dosis, umbrales, tiempos, porcentajes) DEBEN ser correctos según estándares reales.
   Ejemplos: el ratio RCP adulto es 30:2 (AHA), el threshold de aprobación NCLEX-RN es pass/fail por CAT.
3. Los distractores deben ser errores conceptuales REALES que cometen estudiantes, basados en confusiones documentadas.
   No inventes distractores absurdos ni conceptos falsos en las opciones incorrectas.
4. La explicación debe enseñar el concepto CORRECTO con rigor factual (2-3 oraciones), citando la fuente o estándar si aplica.
5. Contenido ORIGINAL en redacción: no copies preguntas literales de exámenes oficiales, pero el conocimiento evaluado debe ser idéntico al real.
6. Cada pregunta debe tener exactamente 4 opciones (A, B, C, D) y UNA sola correcta.
7. Distribución de dificultad target: 40% easy, 40% medium, 20% hard.
8. Cubre todos los sub-dominios proporcionados de manera balanceada.
9. Idioma: ESPAÑOL (excepto exámenes de inglés, donde las preguntas y opciones van en inglés).
10. Salida: ÚNICAMENTE un objeto JSON válido. Sin texto antes/después, sin markdown fences.`;
}

function buildUserPrompt(exam, questionCount, offset = 0, totalQ = questionCount) {
  const sourceNote = exam.source
    ? `\nFUENTE DE REFERENCIA OFICIAL: ${exam.source}\nTodas las preguntas deben estar alineadas con el contenido y terminología de esta fuente.`
    : '';

  const chunkNote = totalQ > questionCount
    ? `\nNOTA: Este es el bloque ${Math.floor(offset / questionCount) + 1} de ${Math.ceil(totalQ / questionCount)} para este examen. Genera preguntas DISTINTAS a las anteriores, cubriendo sub-dominios diferentes o aspectos distintos de los mismos sub-dominios.`
    : '';

  return `Genera ${questionCount} preguntas para el examen "${exam.title}".${sourceNote}${chunkNote}

Sub-dominios y temario a cubrir (distribuye las preguntas equitativamente entre ellos):
${exam.topics}

CRITERIOS DE CALIDAD FACTUAL:
- Los conceptos, cifras, nombres y procedimientos deben ser 100% correctos según el dominio real.
- Si un sub-dominio tiene estándares específicos (ej. AHA para RCP, ISO para calidad), úsalos explícitamente.
- Incluye al menos 30% de preguntas de aplicación práctica (mini-escenarios o casos clínicos/técnicos).
- Verifica mentalmente cada respuesta correcta antes de incluirla.

Formato de salida (JSON estricto):
{
  "questions": [
    {
      "type": "multiple",
      "question": "Enunciado claro y específico (puede incluir un mini-escenario)",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "answer": ["B"],
      "explanation": "2-3 oraciones que enseñen el concepto correcto, citando el estándar si aplica.",
      "domain": "Nombre corto del sub-dominio",
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}

Devuelve EXACTAMENTE ${questionCount} preguntas. Sin comentarios ni texto fuera del JSON.`;
}

// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────
function extractJson(raw) {
  if (!raw) throw new Error('Respuesta vacía del LLM');
  const trimmed = raw.trim();
  // Remove markdown fences if present
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const candidate = fence ? fence[1] : trimmed;
  // Find first { ... last }
  const first = candidate.indexOf('{');
  const last  = candidate.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('No se encontró objeto JSON');
  return JSON.parse(candidate.slice(first, last + 1));
}

function validateQuestions(parsed, expectedCount) {
  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error('La respuesta no contiene un array "questions"');
  }
  const questions = parsed.questions;
  if (questions.length < Math.floor(expectedCount * 0.8)) {
    throw new Error(`Solo se generaron ${questions.length}/${expectedCount} preguntas`);
  }
  const valid = questions.filter((q, idx) => {
    const ok =
      q && typeof q.question === 'string' && q.question.trim().length > 5 &&
      q.options && ['A','B','C','D'].every(k => typeof q.options[k] === 'string' && q.options[k].trim()) &&
      Array.isArray(q.answer) && q.answer.length === 1 && ['A','B','C','D'].includes(q.answer[0]) &&
      typeof q.explanation === 'string' && q.explanation.trim().length > 10;
    if (!ok) console.warn(`  ⚠ pregunta ${idx + 1} inválida, descartada`);
    return ok;
  }).map(q => ({
    type: 'multiple',
    question: q.question.trim(),
    options: { A: q.options.A.trim(), B: q.options.B.trim(), C: q.options.C.trim(), D: q.options.D.trim() },
    answer: q.answer,
    explanation: q.explanation.trim(),
    domain: (q.domain || 'General').toString().trim(),
    difficulty: ['easy','medium','hard'].includes(q.difficulty) ? q.difficulty : 'medium',
  }));
  if (valid.length < Math.floor(expectedCount * 0.7)) {
    throw new Error(`Tras validación quedaron solo ${valid.length} preguntas válidas`);
  }
  return valid;
}

// ─────────────────────────────────────────────
// Generation per exam
// ─────────────────────────────────────────────
async function generateExam(client, examRaw, opts) {
  // Enrich exam with official source reference for grounding
  const exam = { ...examRaw, source: EXAM_SOURCES[examRaw.slug] || null };
  const cachePath = resolve(CACHE_DIR, `${exam.slug}.json`);

  if (!opts.force && existsSync(cachePath)) {
    const cached = JSON.parse(await readFile(cachePath, 'utf8'));
    console.log(`  ↻ ${exam.slug} cargado desde cache (${cached.questions.length} q)`);
    return cached;
  }

  console.log(`  ▶ ${exam.slug} — generando con ${client.provider}/${client.model}…`);
  const t0 = Date.now();

  // Split into chunks of 25 to avoid LLM output truncation
  const CHUNK_SIZE = 25;
  const totalQ = opts.questions;
  const chunks = [];
  for (let i = 0; i < totalQ; i += CHUNK_SIZE) {
    chunks.push(Math.min(CHUNK_SIZE, totalQ - i));
  }

  let allQuestions = [];
  let lastErr;

  for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
    const chunkCount = chunks[chunkIdx];
    const offset = chunkIdx * CHUNK_SIZE;
    let chunkDone = false;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const userPrompt = buildUserPrompt(exam, chunkCount, offset, totalQ);
        const raw = await client.generate(buildSystemPrompt(), userPrompt);
        const parsed = extractJson(raw);
        const questions = validateQuestions(parsed, chunkCount);
        allQuestions = allQuestions.concat(questions);
        if (chunks.length > 1) {
          console.log(`  ↳ chunk ${chunkIdx + 1}/${chunks.length}: ${questions.length} q OK`);
        }
        chunkDone = true;
        break;
      } catch (err) {
        lastErr = err;
        console.warn(`  ⚠ ${exam.slug} chunk ${chunkIdx + 1} intento ${attempt}/3 falló: ${err.message}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
    if (!chunkDone) throw new Error(`${exam.slug} chunk ${chunkIdx + 1}: ${lastErr?.message}`);
  }

  const set = buildSetObject(exam, allQuestions);
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cachePath, JSON.stringify(set, null, 2), 'utf8');
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`  ✓ ${exam.slug} — ${allQuestions.length} q en ${dt}s`);
  return set;
}

function buildSetObject(exam, questions) {
  return {
    slug: exam.slug,
    title: exam.title,
    description: exam.description,
    domain: exam.domain,
    category: exam.category,
    level: exam.level,
    language: 'es',
    tags: exam.tags || [],
    passPercent: 70,
    timeMinutes: Math.max(20, Math.round(questions.length * 1.1)),
    source: `Basado en blueprint público de ${exam.title} — contenido original generado para CertZen`,
    questions,
  };
}

// ─────────────────────────────────────────────
// Concurrency limiter
// ─────────────────────────────────────────────
async function runWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      try { results[idx] = { ok: true, value: await worker(items[idx], idx) }; }
      catch (err) { results[idx] = { ok: false, error: err, item: items[idx] }; }
    }
  });
  await Promise.all(workers);
  return results;
}

// ─────────────────────────────────────────────
// Output: write per-batch .mjs file
// ─────────────────────────────────────────────
function escapeForTemplate(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}
function jsString(str) {
  return JSON.stringify(String(str));
}
function serializeQuestion(q) {
  return `      {
        type: 'multiple',
        question: ${jsString(q.question)},
        options: { A: ${jsString(q.options.A)}, B: ${jsString(q.options.B)}, C: ${jsString(q.options.C)}, D: ${jsString(q.options.D)} },
        answer: [${jsString(q.answer[0])}],
        explanation: ${jsString(q.explanation)},
        domain: ${jsString(q.domain)},
        difficulty: ${jsString(q.difficulty)},
      }`;
}
function serializeSet(set) {
  const tagsStr = JSON.stringify(set.tags);
  return `  {
    slug: ${jsString(set.slug)},
    title: ${jsString(set.title)},
    description: ${jsString(set.description)},
    domain: ${jsString(set.domain)},
    category: ${jsString(set.category)},
    level: ${jsString(set.level)},
    language: ${jsString(set.language)},
    tags: ${tagsStr},
    passPercent: ${set.passPercent},
    timeMinutes: ${set.timeMinutes},
    source: ${jsString(set.source)},
    questions: [
${set.questions.map(serializeQuestion).join(',\n')}
    ],
  }`;
}
async function writeBatchFile(batch, exportName, sets) {
  const path = resolve(SEED_DIR, `sets-${batch}.mjs`);
  const body =
    `// AUTO-GENERATED por scripts/generator/generate-sets.mjs\n` +
    `// Batch: ${batch} — ${sets.length} sets, ${sets.reduce((s, x) => s + x.questions.length, 0)} preguntas\n` +
    `// Regenera con: node scripts/generator/generate-sets.mjs --batch ${batch} --force\n\n` +
    `export const ${exportName} = [\n${sets.map(serializeSet).join(',\n')},\n];\n`;
  await writeFile(path, body, 'utf8');
  return path;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  const opts = parseArgs(process.argv);
  const client = buildLLMClient(process.env);

  console.log(`\n🤖 LLM provider: ${client.provider} (${client.model})`);
  console.log(`📋 Catálogo: ${EXAM_CATALOG.length} exámenes definidos`);

  // Filter
  let exams = EXAM_CATALOG;
  if (opts.batch) exams = exams.filter(e => e.batch === opts.batch);
  if (opts.slug)  exams = exams.filter(e => e.slug === opts.slug);
  if (!exams.length) {
    console.error('❌ Ningún examen coincide con los filtros.');
    process.exit(1);
  }

  console.log(`🎯 A generar: ${exams.length} exámenes (${opts.questions} preguntas c/u)`);
  console.log(`⚡ Concurrencia: ${opts.concurrency}\n`);

  const t0 = Date.now();
  const results = await runWithConcurrency(exams, opts.concurrency, exam =>
    generateExam(client, exam, opts)
  );

  const successes = results.filter(r => r.ok).map(r => r.value);
  const failures  = results.filter(r => !r.ok);

  // Group successes by batch and write files
  const byBatch = new Map();
  for (let i = 0; i < results.length; i++) {
    if (!results[i].ok) continue;
    const exam = exams[i];
    const key = `${exam.batch}|${exam.exportName}`;
    if (!byBatch.has(key)) byBatch.set(key, []);
    byBatch.get(key).push(results[i].value);
  }

  console.log(`\n📝 Escribiendo archivos batch…`);
  for (const [key, sets] of byBatch) {
    const [batch, exportName] = key.split('|');
    // If filtering by slug, merge with existing sets in that batch from cache to keep file complete
    const allSetsForBatch = await mergeWithCache(batch, sets);
    const path = await writeBatchFile(batch, exportName, allSetsForBatch);
    console.log(`  ✓ ${path} (${allSetsForBatch.length} sets)`);
  }

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n✅ ${successes.length}/${exams.length} exámenes OK en ${dt}s`);
  if (failures.length) {
    console.log(`❌ ${failures.length} fallidos:`);
    failures.forEach(f => console.log(`   - ${f.item.slug}: ${f.error.message}`));
    process.exitCode = 1;
  }

  console.log(`\n👉 Próximo paso: actualiza scripts/seed-official-sets.mjs con los nuevos imports y ejecuta:`);
  console.log(`   node scripts/seed-official-sets.mjs\n`);
}

async function mergeWithCache(batch, freshSets) {
  // Pull every cached exam belonging to this batch (not only the freshly generated ones)
  const examsInBatch = EXAM_CATALOG.filter(e => e.batch === batch);
  const merged = [];
  const freshBySlug = new Map(freshSets.map(s => [s.slug, s]));
  for (const exam of examsInBatch) {
    if (freshBySlug.has(exam.slug)) { merged.push(freshBySlug.get(exam.slug)); continue; }
    const cachePath = resolve(CACHE_DIR, `${exam.slug}.json`);
    if (existsSync(cachePath)) {
      try { merged.push(JSON.parse(await readFile(cachePath, 'utf8'))); }
      catch { /* skip corrupt cache */ }
    }
  }
  return merged;
}

main().catch(err => {
  console.error('\n💥 Error fatal:', err.message);
  process.exit(1);
});
