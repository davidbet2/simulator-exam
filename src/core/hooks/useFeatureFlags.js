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
 * Live hook — subscribes to `featureFlags/global` and keeps the local state
 * in sync with Firestore changes. If the doc is missing, returns DEFAULT_FLAGS.
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
      () => {
        // On error (e.g. offline), fall back to defaults.
        setFlags(DEFAULT_FLAGS);
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
