import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true,
  error: null,

  /** Call once in App.jsx — listens to auth state changes */
  init: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.email));
        set({ user: firebaseUser, isAdmin: adminDoc.exists(), isLoading: false });
      } else {
        set({ user: null, isAdmin: false, isLoading: false });
      }
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged handles the state update
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  clearError: () => set({ error: null }),
}));

function mapAuthError(code) {
  const map = {
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/invalid-email': 'Correo electrónico inválido.',
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  };
  return map[code] || `Error de autenticación (${code}).`;
}
