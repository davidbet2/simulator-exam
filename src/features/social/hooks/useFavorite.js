/**
 * useFavorite — toggle a favorite on an exam set.
 *
 * Data model:
 *   users/{uid}/favorites/{slug}  → private favorite entry
 *   examSets/{slug}.favoritesCount → public denormalized counter
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

export function useFavorite(slug, setMeta = null) {
  const { user } = useAuthStore();
  const [isFav, setIsFav]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug || !user) { setLoading(false); setIsFav(false); return; }
    const ref = doc(db, 'users', user.uid, 'favorites', slug);
    getDoc(ref)
      .then((snap) => {
        if (!cancelled) {
          setIsFav(snap.exists());
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useFavorite] load failed', err);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [slug, user]);

  const toggle = useCallback(async () => {
    if (!user) throw new Error('Debes iniciar sesión para guardar favoritos.');
    if (!slug) return;

    const prev = isFav;
    setIsFav(!prev); // optimistic
    setBusy(true);

    try {
      const favRef = doc(db, 'users', user.uid, 'favorites', slug);
      const setRef = doc(db, 'examSets', slug);
      const batch  = writeBatch(db);

      if (prev) {
        batch.delete(favRef);
        batch.update(setRef, {
          favoritesCount: increment(-1),
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.set(favRef, {
          slug,
          title: setMeta?.title ?? null,
          domain: setMeta?.domain ?? null,
          addedAt: serverTimestamp(),
        });
        batch.update(setRef, {
          favoritesCount: increment(1),
          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();
    } catch (err) {
      console.error('[useFavorite] toggle failed', err);
      setIsFav(prev); // rollback
      throw err;
    } finally {
      setBusy(false);
    }
  }, [slug, user, isFav, setMeta]);

  return { isFav, loading, busy, toggle };
}
