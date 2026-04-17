/**
 * useAuthStore — unit tests focused on:
 *   - mapAuthError code collapsing (OWASP A07 enumeration defense)
 *   - login/register set error states correctly
 *   - logout calls signOut
 *   - refreshProfile is a no-op without auth.currentUser
 *
 * We do NOT test onAuthStateChanged + onSnapshot orchestration in unit form —
 * those belong in integration with the Firestore emulator (P2.x backlog).
 */
import { describe, it, beforeEach, vi, expect } from 'vitest';

// ── Mocks (hoisted) ────────────────────────────────────────────────────────
const mockSignIn = vi.fn();
const mockCreate = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuth = vi.fn();
const mockSendVerification = vi.fn();
const mockSendReset = vi.fn();

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...a) => mockSignIn(...a),
  createUserWithEmailAndPassword: (...a) => mockCreate(...a),
  signInWithPopup: vi.fn(),
  signOut: (...a) => mockSignOut(...a),
  onAuthStateChanged: (...a) => mockOnAuth(...a),
  sendEmailVerification: (...a) => mockSendVerification(...a),
  sendPasswordResetEmail: (...a) => mockSendReset(...a),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  setDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'server-ts'),
  onSnapshot: vi.fn(() => () => {}),
}));

vi.mock('../../firebase/firebase', () => ({
  auth: { languageCode: null, currentUser: null },
  db: {},
  googleProvider: {},
}));

// stub localStorage
beforeEach(() => {
  vi.clearAllMocks();
  globalThis.localStorage = {
    getItem: vi.fn(() => 'es'),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };
  // Reset window for ACTION_CODE_SETTINGS
  if (!globalThis.window) globalThis.window = { location: { origin: 'http://localhost' } };
});

// Import lazily after mocks
async function loadStore() {
  vi.resetModules();
  const mod = await import('../useAuthStore');
  // Clear any previous state from module cache
  return mod.useAuthStore;
}

describe('useAuthStore — error mapping (OWASP A07)', () => {
  it('collapses user-not-found and wrong-password to the same generic message', async () => {
    const useAuthStore = await loadStore();
    mockSignIn.mockRejectedValueOnce({ code: 'auth/user-not-found' });
    await useAuthStore.getState().login('a@b.com', 'x');
    const errA = useAuthStore.getState().error;

    mockSignIn.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    await useAuthStore.getState().login('a@b.com', 'x');
    const errB = useAuthStore.getState().error;

    expect(errA).toBe(errB);
    expect(errA).toMatch(/correo o contraseña/i);
  });

  it('maps email-already-in-use to a distinct registration error', async () => {
    const useAuthStore = await loadStore();
    mockCreate.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
    await useAuthStore.getState().register('a@b.com', 'pw', 'Alice');
    expect(useAuthStore.getState().error).toMatch(/ya está registrado/i);
  });

  it('maps weak-password explicitly', async () => {
    const useAuthStore = await loadStore();
    mockCreate.mockRejectedValueOnce({ code: 'auth/weak-password' });
    await useAuthStore.getState().register('a@b.com', '1', 'A');
    expect(useAuthStore.getState().error).toMatch(/al menos 6 caracteres/i);
  });

  it('maps too-many-requests to throttling message (rate-limit hint)', async () => {
    const useAuthStore = await loadStore();
    mockSignIn.mockRejectedValueOnce({ code: 'auth/too-many-requests' });
    await useAuthStore.getState().login('a@b.com', 'x');
    expect(useAuthStore.getState().error).toMatch(/demasiados intentos/i);
  });

  it('falls back to generic message for unknown codes', async () => {
    const useAuthStore = await loadStore();
    mockSignIn.mockRejectedValueOnce({ code: 'auth/something-new' });
    await useAuthStore.getState().login('a@b.com', 'x');
    expect(useAuthStore.getState().error).toMatch(/error de autenticación/i);
  });
});

describe('useAuthStore — basic actions', () => {
  it('logout calls firebase signOut', async () => {
    const useAuthStore = await loadStore();
    mockSignOut.mockResolvedValueOnce();
    await useAuthStore.getState().logout();
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it('clearError resets error state', async () => {
    const useAuthStore = await loadStore();
    mockSignIn.mockRejectedValueOnce({ code: 'auth/wrong-password' });
    await useAuthStore.getState().login('a@b.com', 'x');
    expect(useAuthStore.getState().error).not.toBeNull();
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('refreshProfile is a no-op when there is no currentUser', async () => {
    const useAuthStore = await loadStore();
    // auth.currentUser is null per mock
    await expect(useAuthStore.getState().refreshProfile()).resolves.toBeUndefined();
  });

  it('resetPassword forwards to sendPasswordResetEmail', async () => {
    const useAuthStore = await loadStore();
    mockSendReset.mockResolvedValueOnce();
    await useAuthStore.getState().resetPassword('a@b.com');
    expect(mockSendReset).toHaveBeenCalledOnce();
  });
});
