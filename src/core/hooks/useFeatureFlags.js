import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Default values — used as fallback when the doc doesn't exist yet or on error.
 * Any new flag added here is immediately available across the app.
 */
export const DEFAULT_FLAGS = {
  registrationEnabled:  true,
  creatorEnabled:       true,
  xlsxImportEnabled:    true,
  pdfImportEnabled:     true,
  googleLoginEnabled:   true,
  publicExploreEnabled: true,
  maintenanceMode:      false,
};

/**
 * Fetches featureFlags via the getPublicFlags Cloud Function, which bypasses App Check.
 * Used as fallback when onSnapshot fails (e.g. App Check 403 in incognito).
 */
async function fetchFlagsViaRest(projectId) {
  try {
    const url = `https://us-central1-${projectId}.cloudfunctions.net/getPublicFlags`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok || !data.flags) return null;
    return data.flags;
  } catch {
    return null;
  }
}

/**
 * Live hook — subscribes to `featureFlags/global` and keeps the local state
 * in sync with Firestore changes. If the doc is missing, returns DEFAULT_FLAGS.
 * Falls back to Firestore REST API when App Check blocks the SDK read (e.g. incognito).
 *
 * Usage:
 *   const { flags, loading } = useFeatureFlags();
 *   if (flags.creatorEnabled) { ... }
 */
export function useFeatureFlags() {
  const [flags, setFlags]   = useState(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'featureFlags', 'global');
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setFlags({ ...DEFAULT_FLAGS, ...snap.data() });
        } else {
          setFlags(DEFAULT_FLAGS);
        }
        setLoading(false);
      },
      async () => {
        // SDK read failed (App Check 403, offline, etc.).
        // Try REST API which doesn't require App Check for public collections.
        const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
        const restFlags = await fetchFlagsViaRest(projectId);
        setFlags(restFlags ? { ...DEFAULT_FLAGS, ...restFlags } : DEFAULT_FLAGS);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  return { flags, loading };
}

/** One-shot fetch — useful in scripts/non-component code. */
export async function getFeatureFlags() {
  try {
    const snap = await getDoc(doc(db, 'featureFlags', 'global'));
    if (snap.exists()) return { ...DEFAULT_FLAGS, ...snap.data() };
  } catch {
    /* ignore */
  }
  return DEFAULT_FLAGS;
}
