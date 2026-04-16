/**
 * useFolders — CRUD for a user's private folders.
 *
 * Collection: users/{uid}/folders/{folderId}
 * Shape: { name, slugs: string[], createdAt, updatedAt }
 */
import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../../../core/firebase/firebase';
import { useAuthStore } from '../../../core/store/useAuthStore';

export function useFolders() {
  const { user } = useAuthStore();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!user) { setFolders([]); setLoading(false); return; }
    const q = query(
      collection(db, 'users', user.uid, 'folders'),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        // Fallback: if orderBy fails (missing index / empty), just list
        console.warn('[useFolders] onSnapshot error', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [user]);

  const createFolder = useCallback(async (name) => {
    if (!user) throw new Error('Login required');
    if (!name?.trim()) throw new Error('Name required');
    const ref = await addDoc(collection(db, 'users', user.uid, 'folders'), {
      name: name.trim(),
      slugs: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }, [user]);

  const renameFolder = useCallback(async (folderId, name) => {
    if (!user) throw new Error('Login required');
    await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
      name: name.trim(),
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const removeFolder = useCallback(async (folderId) => {
    if (!user) throw new Error('Login required');
    await deleteDoc(doc(db, 'users', user.uid, 'folders', folderId));
  }, [user]);

  const addSlugToFolder = useCallback(async (folderId, slug) => {
    if (!user) throw new Error('Login required');
    await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
      slugs: arrayUnion(slug),
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const removeSlugFromFolder = useCallback(async (folderId, slug) => {
    if (!user) throw new Error('Login required');
    await updateDoc(doc(db, 'users', user.uid, 'folders', folderId), {
      slugs: arrayRemove(slug),
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  return {
    folders,
    loading,
    createFolder,
    renameFolder,
    removeFolder,
    addSlugToFolder,
    removeSlugFromFolder,
  };
}
