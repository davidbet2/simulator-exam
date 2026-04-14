/**
 * Removes questions that have a `migratedAt` field === null/undefined
 * (i.e. the 4 manually seeded questions from setup-new-project.mjs).
 * 
 * Keeps only questions that were imported via migrate-questions.mjs (have migratedAt).
 * 
 * Run: node scripts/remove-duplicates.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { config } from 'dotenv';

config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const ADMIN_EMAIL = process.env.SETUP_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SETUP_ADMIN_PASSWORD;

async function run() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log(`🔐 Signing in as ${ADMIN_EMAIL}...`);
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('   ✅ Authenticated\n');

  const snapshot = await getDocs(collection(db, 'questions'));
  // Questions without `migratedAt` were seeded manually before migration
  const toDelete = snapshot.docs.filter((d) => !d.data().migratedAt);

  console.log(`🗑️  Found ${toDelete.length} pre-migration docs to remove...`);
  for (const d of toDelete) {
    await deleteDoc(doc(db, 'questions', d.id));
  }
  console.log(`   ✅ Removed ${toDelete.length} duplicates`);
  console.log(`\n📊 Total questions remaining: ${snapshot.docs.length - toDelete.length}`);
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
