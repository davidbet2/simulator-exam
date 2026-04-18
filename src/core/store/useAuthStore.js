import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/firebase';

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
    subscriptionStartedAt: profile.subscriptionStartedAt ?? null,
    dodoSubscriptionId:  profile.dodoSubscriptionId ?? null,
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
    // Wrapped in try/catch — some Firebase SDK versions throw auth/argument-error
    // synchronously here if the locale string is malformed.
    try {
      const storedLocale = localStorage.getItem('certzen-locale') ?? 'es';
      auth.languageCode = storedLocale;
    } catch (e) {
      console.warn('[auth] languageCode set failed:', e?.code, e?.message);
    }

    let unsubscribeProfile = null;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Tear down any previous profile listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (firebaseUser) {
        // Initial fetch (admin check + first profile snapshot)
        const state = await fetchUserProfile(firebaseUser);
        set(state);
        // Live profile updates — webhook/sync mutations propagate instantly
        unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (snap) => {
          if (!snap.exists()) return;
          const profile = snap.data();
          set({
            isPro:                profile.plan === 'pro',
            plan:                 profile.plan ?? 'free',
            displayName:          profile.displayName ?? firebaseUser.displayName ?? firebaseUser.email.split('@')[0],
            subscriptionStatus:   profile.subscriptionStatus ?? null,
            subscriptionRenewsAt: profile.subscriptionRenewsAt ?? null,
            subscriptionStartedAt: profile.subscriptionStartedAt ?? null,
            dodoSubscriptionId:   profile.dodoSubscriptionId ?? null,
          });
        });
      } else {
        set({ user: null, isAdmin: false, isPro: false, plan: 'free', displayName: null, isLoading: false });
      }
    });
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribe();
    };
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
        try {
          await setDoc(userRef, {
            uid:         result.user.uid,
            email:       result.user.email,
            displayName: result.user.displayName ?? result.user.email.split('@')[0],
            plan:        'free',
            createdAt:   serverTimestamp(),
          });
        } catch (profileErr) {
          // Auth succeeded but profile write failed — log and surface to UI.
          // The user is authenticated; they can retry on next load via fetchUserProfile.
          console.error('[auth] Google profile creation failed:', profileErr);
          set({ error: 'No se pudo crear tu perfil. Inténtalo de nuevo.', isLoading: false });
          return;
        }
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
      // Force the Firebase ID token to be issued and attached before the
      // Firestore write — prevents a race condition where security rules
      // evaluate request.auth as null immediately after account creation.
      await result.user.getIdToken();
      // Write profile — this must succeed before proceeding.
      await setDoc(doc(db, 'users', result.user.uid), {
        uid:         result.user.uid,
        email,
        displayName: displayName ?? email.split('@')[0],
        plan:        'free',
        createdAt:   serverTimestamp(),
      });
      // Email verification intentionally skipped — app uses Google Sign-In;
      // Firebase Auth identity is guaranteed by Google OAuth.
      // onAuthStateChanged handles the state update
    } catch (err) {
      console.error('[auth] register error — code:', err.code, '| msg:', err.message);
      set({ error: mapAuthError(err.code, err.message), isLoading: false });
    }
  },

  resendVerification: async () => {
    // No-op: email verification is not used in this app.
  },

  resetPassword: async (email) => {
    // NOTE: ACTION_CODE_SETTINGS omitted until certzen.app is whitelisted
    // in Firebase Console → Authentication → Authorized Domains.
    await sendPasswordResetEmail(auth, email);
  },

  logout: async () => {
    await signOut(auth);
  },

  /**
   * Re-fetch the current user's Firestore profile and update the store.
   * Use after any server-side mutation (e.g. webhook/sync that upgrades plan)
   * so the UI reflects the new state without forcing a page reload.
   */
  refreshProfile: async () => {
    if (!auth.currentUser) return;
    const state = await fetchUserProfile(auth.currentUser);
    set(state);
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

function mapAuthError(code, _rawMessage) {
  // Collapse credential-related codes to a single generic message to prevent
  // account enumeration (OWASP A07 — Authentication Failures).
  const genericCredential = 'Correo o contraseña incorrectos.';
  const map = {
    // ─── Firebase Auth ────────────────────────────────────────────────
    'auth/user-not-found':       genericCredential,
    'auth/wrong-password':       genericCredential,
    'auth/invalid-credential':   genericCredential,
    'auth/invalid-login-credentials': genericCredential,
    'auth/invalid-email':        genericCredential,
    'auth/email-already-in-use': 'Este correo ya está registrado. ¿Quieres iniciar sesión?',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests':    'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
    'auth/popup-closed-by-user': 'Cerraste la ventana antes de completar el inicio de sesión.',
    'auth/cancelled-popup-request': 'Cerraste la ventana antes de completar el inicio de sesión.',
    'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite popups para certzen.app e inténtalo de nuevo.',
    'auth/account-exists-with-different-credential': 'Ya existe una cuenta con ese correo usando otro proveedor (ej. Google).',
    'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
    'auth/operation-not-allowed': 'Este método de inicio de sesión no está habilitado.',
    'auth/user-disabled':        'Esta cuenta ha sido deshabilitada.',
    'auth/requires-recent-login': 'Por seguridad, inicia sesión nuevamente antes de continuar.',
    'auth/unauthorized-continue-uri': 'Error de configuración. Contacta soporte.',
    'auth/missing-continue-uri':     'Error de configuración. Contacta soporte.',
    'auth/invalid-continue-uri':     'Error de configuración. Contacta soporte.',
    'auth/internal-error':       'Error interno del servidor. Intenta nuevamente.',
    // ─── Firestore ───────────────────────────────────────────────────
    'permission-denied':  'Error de permisos al guardar los datos. Intenta nuevamente.',
    'unavailable':        'Servicio temporalmente no disponible. Verifica tu conexión.',
    'resource-exhausted': 'Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.',
    'unauthenticated':    'No estás autenticado. Recarga la página e intenta de nuevo.',
  };
  return map[code] || `Error inesperado (${code ?? 'unknown'}). Intenta nuevamente.`;
}
