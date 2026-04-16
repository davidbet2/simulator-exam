/**
 * Seed OFFICIAL multi-domain exam sets.
 *
 * Usage:
 *   node scripts/seed-official-sets.mjs
 *
 * What it does:
 *   - Signs in as the admin account (must already exist — run `npm run seed` first)
 *   - For every set in scripts/seed-data/*.mjs:
 *       · Upsert examSets/{slug} with metadata (official:true, published:true,
 *         ownerUid=admin uid, ownerEmail=admin email, etc.)
 *       · Replace subcollection `questions` with the provided items
 *   - Idempotent: running it twice overwrites existing official sets cleanly.
 *
 * SOURCE POLICY:
 *   Every question is ORIGINAL content written against PUBLIC exam
 *   blueprints / open educational material. No copyrighted material from
 *   commercial certifications has been copied.
 */
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { config } from 'dotenv';

import { IT_SETS } from './seed-data/sets-it.mjs';
import { IT_ADVANCED_SETS } from './seed-data/sets-it-advanced.mjs';
import { AGILE_PM_SETS } from './seed-data/sets-agile-pm.mjs';
import { SECURITY_SETS } from './seed-data/sets-security.mjs';
import { HEALTH_SETS } from './seed-data/sets-health.mjs';
import { ENGLISH_SETS } from './seed-data/sets-english.mjs';
import { LOGIC_SETS } from './seed-data/sets-logic.mjs';
import { EXTRA_QUESTIONS } from './seed-data/sets-extras.mjs';

config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error('❌ Missing env vars:', missing.join(', '));
  process.exit(1);
}

const ADMIN_EMAIL    = process.env.SEED_ADMIN_EMAIL    ?? process.env.SETUP_ADMIN_EMAIL    ?? 'david.betancur@pragma.com.co';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? process.env.SETUP_ADMIN_PASSWORD ?? 'Appian123!';

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const ALL_SETS = [
  ...IT_SETS,
  ...IT_ADVANCED_SETS,
  ...AGILE_PM_SETS,
  ...SECURITY_SETS,
  ...HEALTH_SETS,
  ...ENGLISH_SETS,
  ...LOGIC_SETS,
].map((set) => {
  const extras = EXTRA_QUESTIONS[set.slug] ?? [];
  return extras.length
    ? { ...set, questions: [...set.questions, ...extras] }
    : set;
});

async function deleteSubcollection(setId) {
  const qSnap = await getDocs(collection(db, 'examSets', setId, 'questions'));
  if (qSnap.empty) return 0;
  const batch = writeBatch(db);
  qSnap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return qSnap.size;
}

async function upsertSet(set, ownerUid, ownerEmail) {
  const { questions, slug, ...meta } = set;
  const setRef = doc(db, 'examSets', slug);

  // Clear existing questions for idempotency
  const removed = await deleteSubcollection(slug);
  if (removed) console.log(`   · cleared ${removed} previous questions`);

  // Upsert set metadata
  await setDoc(
    setRef,
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
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Add questions
  for (const q of questions) {
    await addDoc(collection(db, 'examSets', slug, 'questions'), {
      ...q,
      createdAt: serverTimestamp(),
    });
  }

  return questions.length;
}

async function main() {
  console.log(`🌱 Seeding ${ALL_SETS.length} official exam sets…\n`);

  const cred = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  const uid   = cred.user.uid;
  const email = cred.user.email;
  console.log(`👤 Signed in as ${email} (${uid})\n`);

  const summary = [];
  for (const set of ALL_SETS) {
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
