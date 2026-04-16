/**
 * useRating — read/write a user rating for an exam set.
 *
 * Data model:
 *   examSets/{slug}                      → aggregate counters (ratingSum, ratingCount, ratingAvg)
 *   examSets/{slug}/ratings/{uid}        → user's individual rating (doc id = uid)
 *
 * The component writes BOTH docs in a single batch with optimistic UI.
 * Counter drift is acceptable for MVP (Cloud Function trigger can be added later).
 */
import { useEffect, useState, useCallback } from 'react';
import {
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';

export function useRating(slug) {
  const { user } = useAuthStore();
  const [myStars, setMyStars]       = useState(0);       // 0 = not rated
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  // Load the user's existing rating (if any)
  useEffect(() => {
    let cancelled = false;
    if (!slug || !user) { setLoading(false); return; }
    const ref = doc(db, 'examSets', slug, 'ratings', user.uid);
    getDoc(ref)
      .then((snap) => {
        if (cancelled) return;
        setMyStars(snap.exists() ? (snap.data().stars ?? 0) : 0);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[useRating] load failed', err);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug, user]);

  const submit = useCallback(async (stars) => {
    if (!user) throw new Error('Debes iniciar sesión para calificar.');
    if (!slug) throw new Error('Set inválido.');
    if (stars < 1 || stars > 5) throw new Error('Rating inválido.');

    setSubmitting(true);
    setError(null);
    const prev = myStars;
    setMyStars(stars); // optimistic

    try {
      const setRef    = doc(db, 'examSets', slug);
      const ratingRef = doc(db, 'examSets', slug, 'ratings', user.uid);

      const prevSnap  = await getDoc(ratingRef);
      const isUpdate  = prevSnap.exists();
      const prevStars = isUpdate ? (prevSnap.data().stars ?? 0) : 0;

      const batch = writeBatch(db);
      batch.set(ratingRef, {
        uid: user.uid,
        stars,
        createdAt: isUpdate ? prevSnap.data().createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Denormalize aggregate counters on the set doc
      const delta = stars - prevStars;
      batch.update(setRef, {
        ratingSum:   increment(delta),
        ratingCount: increment(isUpdate ? 0 : 1),
        updatedAt:   serverTimestamp(),
      });

      await batch.commit();
    } catch (err) {
      console.error('[useRating] submit failed', err);
      setMyStars(prev); // rollback
      setError(err.message ?? 'Error al calificar');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [slug, user, myStars]);

  return { myStars, loading, submitting, error, submit };
}
