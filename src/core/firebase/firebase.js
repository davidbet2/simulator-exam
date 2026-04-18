import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
// App Check is set to Monitor mode in Firebase Console — not enforced.
// Client-side initialization is disabled to prevent SDK throttle errors
// that block auth and Firestore calls after a failed token fetch.

// In test mode (Playwright e2e), use localStorage so Playwright's storageState
// captures the auth token. In production, prefer IndexedDB with localStorage fallback.
const persistence = import.meta.env.MODE === 'test'
  ? [browserLocalPersistence]
  : [indexedDBLocalPersistence, browserLocalPersistence];

export const auth = initializeAuth(app, { persistence });
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
// Always show the account picker so users can choose or register with a different account
googleProvider.setCustomParameters({ prompt: 'select_account' });
