import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/firebase';

// After the user clicks the verification link, Firebase redirects them to
// this URL (the app's verify-email page). Must be whitelisted in Firebase
// Console → Authentication → Settings → Authorized domains.
const ACTION_CODE_SETTINGS = {
  url: `${window.location.origin}/verify-email`,
  handleCodeInApp: false,
};

async function fetchUserProfile(firebaseUser) {
  const [adminDoc, userDoc] = await Promise.all([
    getDoc(doc(db, 'admins', firebaseUser.email)),
    getDoc(doc(db, 'users', firebaseUser.uid)),
  ]);
  const profile = userDoc.exists() ? userDoc.data() : {};
  return {
    user:                firebaseUser,
    isAdmin:             adminDoc.exists(),
    isPro:               profile.plan === 'pro',
    plan:                profile.plan ?? 'free',
    displayName:         profile.displayName ?? firebaseUser.displayName ?? firebaseUser.email.split('@')[0],
    subscriptionStatus:  profile.subscriptionStatus ?? null,
    subscriptionRenewsAt: profile.subscriptionRenewsAt ?? null,
    isLoading:           false,
    error:               null,
  };
}

export const useAuthStore = create((set) => ({
  user:        null,
  isAdmin:     false,
  isPro:       false,
  plan:        'free',
  displayName: null,
  isLoading:   true,
  error:       null,

  /** Call once in App.jsx — listens to auth state changes */
  init: () => {
    // Set Firebase email language to match stored locale (es by default).
    // This controls the language of verification/reset emails sent by Firebase.
    const storedLocale = localStorage.getItem('certzen-locale') ?? 'es';
    auth.languageCode = storedLocale;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const state = await fetchUserProfile(firebaseUser);
        set(state);
      } else {
        set({ user: null, isAdmin: false, isPro: false, plan: 'free', displayName: null, isLoading: false });
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

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Create user profile if first time
      const userRef = doc(db, 'users', result.user.uid);
      const existing = await getDoc(userRef);
      if (!existing.exists()) {
        await setDoc(userRef, {
          uid:         result.user.uid,
          email:       result.user.email,
          displayName: result.user.displayName ?? result.user.email.split('@')[0],
          plan:        'free',
          createdAt:   serverTimestamp(),
        });
      }
      // onAuthStateChanged handles the state update
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await Promise.all([
        setDoc(doc(db, 'users', result.user.uid), {
          uid:         result.user.uid,
          email,
          displayName: displayName ?? email.split('@')[0],
          plan:        'free',
          createdAt:   serverTimestamp(),
        }),
        sendEmailVerification(result.user, ACTION_CODE_SETTINGS),
      ]);
      // onAuthStateChanged handles the state update
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  resendVerification: async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser, ACTION_CODE_SETTINGS);
    }
  },

  resetPassword: async (email) => {
    // Uses the same continueUrl so after reset the user lands back on the app.
    await sendPasswordResetEmail(auth, email, ACTION_CODE_SETTINGS);
  },

  logout: async () => {
    await signOut(auth);
  },

  /** Update display name in Firestore + Firebase Auth + local store */
  updateDisplayName: async (uid, newName) => {
    const { updateProfile } = await import('firebase/auth');
    const { updateDoc } = await import('firebase/firestore');
    await Promise.all([
      updateProfile(auth.currentUser, { displayName: newName }),
      updateDoc(doc(db, 'users', uid), { displayName: newName }),
    ]);
    set({ displayName: newName });
  },

  clearError: () => set({ error: null }),
}));

function mapAuthError(code) {
  // Collapse credential-related codes to a single generic message to prevent
  // account enumeration (OWASP A07 — Authentication Failures).
  const genericCredential = 'Correo o contraseña incorrectos.';
  const map = {
    'auth/user-not-found':  genericCredential,
    'auth/wrong-password':  genericCredential,
    'auth/invalid-credential': genericCredential,
    'auth/invalid-login-credentials': genericCredential,
    'auth/invalid-email':   genericCredential,
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/weak-password':   'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    'auth/popup-closed-by-user': 'Cerraste la ventana antes de completar el inicio de sesión.',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con ese correo usando otro proveedor.',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
  };
  return map[code] || 'Error de autenticación. Intenta nuevamente.';
}
