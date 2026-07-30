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
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref, onValue } from 'firebase/database';
import { auth, db, rtdb, googleProvider } from '../firebase/firebase';
import { analytics } from '../analytics/events';

const SESSION_ID_KEY = 'certzen-session-id';

// True while THIS tab's own rotateSession() call is in flight. The RTDB
// single-session listener (attached independently by onAuthStateChanged)
// must not act on a mismatch while this is true — the ordering between
// "onAuthStateChanged fires and attaches the listener" and "login()'s own
// continuation writes localStorage" is not guaranteed by the SDK, so relying
// on write-order alone to avoid a self-kick race is not enough on its own.
let rotatingSession = false;

/**
 * Rotates the single-session marker via the rotateSession Cloud Function.
 * The function is the only writer of users/{uid}.activeSessionId and
 * /sessions/{uid} in RTDB (both blocked for direct client writes by
 * firestore.rules / database.rules.json) — so unlike the previous
 * client-writes-its-own-marker design, clearing localStorage cannot forge
 * or bypass this. getIdToken(true) refreshes the sessionId custom claim in
 * this tab immediately, ahead of its ~1h natural expiry.
 *
 * The sessionId is generated HERE (client-side) and persisted to
 * localStorage synchronously, BEFORE the network round-trip to the Cloud
 * Function — not after — so the local value is already correct by the time
 * any listener could observe the corresponding remote write.
 */
async function rotateSession(user) {
  rotatingSession = true;
  try {
    const sessionId = crypto.randomUUID();
    try {
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    } catch (e) {
      console.warn('[auth] failed to persist session id:', e?.message);
    }
    await httpsCallable(getFunctions(), 'rotateSession')({ sessionId });
    await user.getIdToken(true);
    return sessionId;
  } finally {
    rotatingSession = false;
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
    let unsubscribeSession = null;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Tear down any previous listeners
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }
      if (unsubscribeSession) {
        unsubscribeSession();
        unsubscribeSession = null;
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
        // Single-session enforcement — RTDB is the server-verified source of
        // truth (only rotateSession/clearSession Cloud Functions can write
        // /sessions/{uid}, see database.rules.json). If another device/
        // browser rotates the session, this websocket listener fires within
        // seconds and this stale session signs itself out.
        unsubscribeSession = onValue(ref(rtdb, `sessions/${firebaseUser.uid}`), (snap) => {
          // Skip while this tab's own rotateSession() is in flight — the
          // remote write it's about to (or just did) make isn't a foreign
          // takeover, and the ordering vs. this listener isn't guaranteed.
          if (rotatingSession) return;
          const remoteSessionId = snap.val()?.sessionId ?? null;
          let localSessionId = null;
          try {
            localSessionId = localStorage.getItem(SESSION_ID_KEY);
          } catch (e) {
            console.warn('[auth] failed to read session id:', e?.message);
          }
          if (remoteSessionId && localSessionId && remoteSessionId !== localSessionId) {
            signOut(auth);
            set({ sessionClosedMessage: 'Tu sesión se cerró porque iniciaste sesión en otro dispositivo.' });
          }
        });
      } else {
        set({ user: null, isAdmin: false, isPro: false, plan: 'free', displayName: null, isLoading: false });
      }
    });
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      if (unsubscribeSession) unsubscribeSession();
      unsubscribe();
    };
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null, sessionClosedMessage: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await rotateSession(result.user);
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
            createdAt:      serverTimestamp(),
          });
          await rotateSession(result.user);
          analytics.signUp({ method: 'google' });
        } catch (profileErr) {
          // Auth succeeded but profile write failed — log and surface to UI.
          // The user is authenticated; they can retry on next load via fetchUserProfile.
          console.error('[auth] Google profile creation failed:', profileErr);
          set({ error: 'No se pudo crear tu perfil. Inténtalo de nuevo.', isLoading: false });
          return;
        }
      } else {
        await rotateSession(result.user);
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
      // Write profile — this must succeed before proceeding.
      await setDoc(doc(db, 'users', result.user.uid), {
        uid:            result.user.uid,
        email,
        displayName:    displayName ?? email.split('@')[0],
        plan:           'free',
        createdAt:      serverTimestamp(),
      });
      await rotateSession(result.user);
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
        await httpsCallable(getFunctions(), 'clearSession')();
      } catch (e) {
        console.warn('[auth] failed to clear session on logout:', e?.message);
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
