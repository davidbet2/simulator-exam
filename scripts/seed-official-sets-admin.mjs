/**
 * Seed OFFICIAL multi-domain exam sets — variante con Firebase Admin SDK.
 *
 * A diferencia de seed-official-sets.mjs (que requiere SEED_ADMIN_EMAIL/PASSWORD
 * y hace signInWithEmailAndPassword vía el SDK cliente), este script usa
 * Application Default Credentials (ADC) — las credenciales de Google ya
 * autenticadas localmente vía `firebase login` / `gcloud auth application-default
 * login` — y el Admin SDK, que escribe directo en Firestore sin pasar por
 * Firebase Auth ni por las reglas de seguridad del cliente.
 *
 * Usage:
 *   node scripts/seed-official-sets-admin.mjs
 *
 * Requisitos:
 *   - Haber corrido `firebase login` (o tener ADC configuradas) con una cuenta
 *     de Google que tenga rol de Editor/Owner sobre el proyecto de Firebase.
 *   - VITE_FIREBASE_PROJECT_ID en .env (o .firebaserc con proyecto default).
 *   - Opcional: SEED_ADMIN_EMAIL en .env para asociar ownerEmail/ownerUid a un
 *     usuario existente de Firebase Auth (si no existe, se usa un owner genérico).
 */
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { config } from 'dotenv';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const SEED_DIR = resolve(__dirname, 'seed-data');

let PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
if (!PROJECT_ID) {
  try {
    const rc = JSON.parse(await readFile(resolve(__dirname, '..', '.firebaserc'), 'utf8'));
    PROJECT_ID = rc.projects?.default;
  } catch {
    // ignore
  }
}
if (!PROJECT_ID) {
  console.error('❌ No se encontró VITE_FIREBASE_PROJECT_ID ni .firebaserc con proyecto default.');
  process.exit(1);
}

initializeApp({
  credential: applicationDefault(),
  projectId: PROJECT_ID,
});

const db = getFirestore();
const authAdmin = getAuth();

async function loadAllSets() {
  const entries = await readdir(SEED_DIR);
  const files = entries
    .filter((f) => f.startsWith('sets-') && f.endsWith('.mjs') && f !== 'sets-extras.mjs')
    .sort();

  const all = [];
  for (const file of files) {
    const url = new URL(file, `file://${SEED_DIR}/`).href;
    const mod = await import(url);
    let countFromFile = 0;
    for (const [name, value] of Object.entries(mod)) {
      if (name.endsWith('_SETS') && Array.isArray(value)) {
        all.push(...value);
        countFromFile += value.length;
      }
    }
    console.log(`  · ${file} → ${countFromFile} sets`);
  }
  return all;
}

async function deleteSubcollection(setId) {
  const qSnap = await db.collection('examSets').doc(setId).collection('questions').get();
  if (qSnap.empty) return 0;
  const batch = db.batch();
  qSnap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return qSnap.size;
}

async function upsertSet(set, ownerUid, ownerEmail) {
  const { questions, slug, ...meta } = set;
  const setRef = db.collection('examSets').doc(slug);

  const removed = await deleteSubcollection(slug);
  if (removed) console.log(`   · cleared ${removed} previous questions`);

  await setRef.set(
    {
      ...meta,
      id: slug,
      ownerUid,
      ownerEmail,
      official: true,
      featured: true,
      published: true,
      deleted: false,
      attempts: 0,
      questionCount: questions.length,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Escritura en lotes de 400 (límite de batch de Firestore es 500 operaciones)
  const CHUNK = 400;
  let written = 0;
  for (let i = 0; i < questions.length; i += CHUNK) {
    const batch = db.batch();
    const slice = questions.slice(i, i + CHUNK);
    slice.forEach((q) => {
      const docRef = db.collection('examSets').doc(slug).collection('questions').doc();
      batch.set(docRef, { ...q, createdAt: FieldValue.serverTimestamp() });
    });
    await batch.commit();
    written += slice.length;
  }

  return written;
}

async function resolveOwner() {
  const email = process.env.SEED_ADMIN_EMAIL ?? process.env.SETUP_ADMIN_EMAIL;
  if (!email) {
    console.log('ℹ️  No SEED_ADMIN_EMAIL definido — se usará un owner genérico "system-seed".');
    return { uid: 'system-seed', email: 'system-seed@local' };
  }
  try {
    const user = await authAdmin.getUserByEmail(email);
    console.log(`👤 Owner resuelto vía Firebase Auth: ${email} (${user.uid})`);
    return { uid: user.uid, email };
  } catch (err) {
    console.log(`⚠️  No se encontró el usuario ${email} en Firebase Auth (${err.code}). Se usará owner genérico.`);
    return { uid: 'system-seed', email };
  }
}

async function main() {
  console.log(`🔎 Proyecto: ${PROJECT_ID}`);
  console.log('🔎 Discovering exam set files in scripts/seed-data/ …');
  const DISCOVERED_SETS = await loadAllSets();

  const { uid, email } = await resolveOwner();

  console.log(`\n🌱 Seeding ${DISCOVERED_SETS.length} official exam sets…\n`);

  const summary = [];
  for (const set of DISCOVERED_SETS) {
    console.log(`📦 ${set.domain.toUpperCase()} — ${set.title}`);
    const count = await upsertSet(set, uid, email);
    summary.push({ slug: set.slug, domain: set.domain, questions: count });
    console.log(`   ✅ ${count} preguntas\n`);
  }

  console.log('─'.repeat(60));
  console.log('✨ Summary:');
  for (const s of summary) {
    console.log(`   • [${s.domain}] ${s.slug} — ${s.questions} questions`);
  }
  console.log(`\n📊 Total: ${summary.length} sets, ${summary.reduce((a, b) => a + b.questions, 0)} questions.\n`);

  process.exit(0);
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err);
  process.exit(1);
});
