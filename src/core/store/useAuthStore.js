import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/firebase';
import { analytics } from '../analytics/events';

const SESSION_ID_KEY = 'certzen-session-id';

/** Generates a new session id for the caller to write to Firestore first. */
function generateSessionId() {
  return crypto.randomUUID();
}

/**
 * Persists the session id to localStorage. Must only be called AFTER the
 * matching Firestore write (activeSessionId) has been confirmed — otherwise
 * the single-session-enforcement listener in `init()` can observe the new
 * local id against the still-stale remote value and sign the user out of
 * their own, only session (race between login's own write and the snapshot
 * listener attached concurrently by onAuthStateChanged).
 */
function persistSessionId(id) {
  try {
    localStorage.setItem(SESSION_ID_KEY, id);
  } catch (e) {
    console.warn('[auth] failed to persist session id:', e?.message);
  }
}

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
  sessionClosedMessage: null,

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
          // Ignore cached snapshots (e.g. on reconnect) — only server-confirmed
          // data can trigger a single-session logout, to avoid false positives.
          if (snap.metadata.fromCache) return;
          const profile = snap.data();
          // Single-session enforcement: if another device/browser logged in and
          // rotated activeSessionId, this session is stale — sign it out.
          let localSessionId = null;
          try {
            localSessionId = localStorage.getItem(SESSION_ID_KEY);
          } catch (e) {
            console.warn('[auth] failed to read session id:', e?.message);
          }
          if (profile.activeSessionId && localSessionId && profile.activeSessionId !== localSessionId) {
            signOut(auth);
            set({ sessionClosedMessage: 'Tu sesión se cerró porque iniciaste sesión en otro dispositivo.' });
            return;
          }
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
    set({ isLoading: true, error: null, sessionClosedMessage: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const sessionId = generateSessionId();
      await updateDoc(doc(db, 'users', result.user.uid), { activeSessionId: sessionId });
      persistSessionId(sessionId);
      analytics.login({ method: 'email' });
      // onAuthStateChanged handles the state update
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null, sessionClosedMessage: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const sessionId = generateSessionId();
      // Create user profile if first time
      const userRef = doc(db, 'users', result.user.uid);
      const existing = await getDoc(userRef);
      if (!existing.exists()) {
        try {
          await setDoc(userRef, {
            uid:            result.user.uid,
            email:          result.user.email,
            displayName:    result.user.displayName ?? result.user.email.split('@')[0],
            plan:           'free',
            activeSessionId: sessionId,
            createdAt:      serverTimestamp(),
          });
          persistSessionId(sessionId);
          analytics.signUp({ method: 'google' });
        } catch (profileErr) {
          // Auth succeeded but profile write failed — log and surface to UI.
          // The user is authenticated; they can retry on next load via fetchUserProfile.
          console.error('[auth] Google profile creation failed:', profileErr);
          set({ error: 'No se pudo crear tu perfil. Inténtalo de nuevo.', isLoading: false });
          return;
        }
      } else {
        await updateDoc(userRef, { activeSessionId: sessionId });
        persistSessionId(sessionId);
        analytics.login({ method: 'google' });
      }
      // onAuthStateChanged handles the state update
    } catch (err) {
      set({ error: mapAuthError(err.code), isLoading: false });
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null, sessionClosedMessage: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Force the Firebase ID token to be issued and attached before the
      // Firestore write — prevents a race condition where security rules
      // evaluate request.auth as null immediately after account creation.
      await result.user.getIdToken();
      const sessionId = generateSessionId();
      // Write profile — this must succeed before proceeding.
      await setDoc(doc(db, 'users', result.user.uid), {
        uid:            result.user.uid,
        email,
        displayName:    displayName ?? email.split('@')[0],
        plan:           'free',
        activeSessionId: sessionId,
        createdAt:      serverTimestamp(),
      });
      persistSessionId(sessionId);
      // Email verification intentionally skipped — app uses Google Sign-In;
      // Firebase Auth identity is guaranteed by Google OAuth.
      analytics.signUp({ method: 'email' });
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
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { activeSessionId: null });
      } catch (e) {
        console.warn('[auth] failed to clear activeSessionId on logout:', e?.message);
      }
    }
    try {
      localStorage.removeItem(SESSION_ID_KEY);
    } catch (e) {
      console.warn('[auth] failed to clear session id:', e?.message);
    }
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
