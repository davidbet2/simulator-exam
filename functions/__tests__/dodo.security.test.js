/**
 * Cloud Functions — security boundary tests (P1.2).
 *
 * Focus: auth + ownership checks for Dodo Payments callables.
 * Strategy: offline mode — mock Firestore admin + dodopayments SDK + secrets.
 *
 * Run:  cd functions && npm test
 */
const test = require('firebase-functions-test')();

// ── Mock secrets BEFORE requiring index.js ────────────────────────────────
jest.mock('firebase-functions/params', () => {
  const actual = jest.requireActual('firebase-functions/params');
  return {
    ...actual,
    defineSecret: (name) => ({ value: () => `mock-${name}` }),
  };
});

// ── Mock firebase-admin/firestore ─────────────────────────────────────────
const mockUpdate = jest.fn().mockResolvedValue();
const mockGet = jest.fn();
const mockWhere = jest.fn(() => ({ limit: () => ({ get: mockGet }) }));
const mockCollection = jest.fn(() => ({ where: mockWhere }));
const mockDoc = jest.fn();

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({
    collection: mockCollection,
    doc: mockDoc,
  }),
}));

jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn() }));

// ── Mock dodopayments SDK ─────────────────────────────────────────────────
const mockSubscriptionUpdate = jest.fn().mockResolvedValue({});
const mockPaymentsList = jest.fn().mockResolvedValue({ items: [] });
jest.mock('dodopayments', () => ({
  default: jest.fn().mockImplementation(() => ({
    subscriptions: { update: mockSubscriptionUpdate },
    payments: { list: mockPaymentsList },
  })),
}), { virtual: true });

const fns = require('../index');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  test.cleanup();
});

function userDocFixture(extra = {}) {
  const docRef = { update: mockUpdate };
  return {
    empty: false,
    docs: [
      {
        ref: docRef,
        data: () => ({
          uid: 'userA',
          email: 'a@example.com',
          dodoSubscriptionId: 'sub_real_123',
          ...extra,
        }),
      },
    ],
  };
}

describe('cancelDodoSubscription — security', () => {
  const wrapped = test.wrap(fns.cancelDodoSubscription);

  it('throws unauthenticated when no auth context', async () => {
    await expect(wrapped({ data: { subscriptionId: 'sub_x' } }))
      .rejects.toMatchObject({ code: 'unauthenticated' });
  });

  it('throws invalid-argument when subscriptionId is missing', async () => {
    await expect(
      wrapped({ data: {}, auth: { token: { email: 'a@example.com' } } })
    ).rejects.toMatchObject({ code: 'invalid-argument' });
  });

  it('throws invalid-argument when subscriptionId is not a string', async () => {
    await expect(
      wrapped({
        data: { subscriptionId: 123 },
        auth: { token: { email: 'a@example.com' } },
      })
    ).rejects.toMatchObject({ code: 'invalid-argument' });
  });

  it('throws not-found when user document is missing', async () => {
    mockGet.mockResolvedValueOnce({ empty: true, docs: [] });
    await expect(
      wrapped({
        data: { subscriptionId: 'sub_real_123' },
        auth: { token: { email: 'a@example.com' } },
      })
    ).rejects.toMatchObject({ code: 'not-found' });
  });

  it('throws permission-denied when subscription does not belong to user (exploit)', async () => {
    mockGet.mockResolvedValueOnce(userDocFixture()); // owns sub_real_123
    await expect(
      wrapped({
        data: { subscriptionId: 'sub_someone_else' },
        auth: { token: { email: 'a@example.com' } },
      })
    ).rejects.toMatchObject({ code: 'permission-denied' });
    expect(mockSubscriptionUpdate).not.toHaveBeenCalled();
  });

  it('cancels successfully when subscriptionId matches', async () => {
    mockGet.mockResolvedValueOnce(userDocFixture());
    const res = await wrapped({
      data: { subscriptionId: 'sub_real_123' },
      auth: { token: { email: 'a@example.com' } },
    });
    expect(res).toEqual({ cancelled: true });
    expect(mockSubscriptionUpdate).toHaveBeenCalledWith('sub_real_123', {
      status: 'cancelled',
    });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ subscriptionStatus: 'cancelled' })
    );
  });
});

describe('reactivateDodoSubscription — security', () => {
  const wrapped = test.wrap(fns.reactivateDodoSubscription);

  it('throws unauthenticated when no auth context', async () => {
    await expect(wrapped({ data: { subscriptionId: 'x' } }))
      .rejects.toMatchObject({ code: 'unauthenticated' });
  });

  it('throws permission-denied on subscription ownership mismatch', async () => {
    mockGet.mockResolvedValueOnce(userDocFixture());
    await expect(
      wrapped({
        data: { subscriptionId: 'sub_other' },
        auth: { token: { email: 'a@example.com' } },
      })
    ).rejects.toMatchObject({ code: 'permission-denied' });
    expect(mockSubscriptionUpdate).not.toHaveBeenCalled();
  });

  it('reactivates when ownership verified', async () => {
    mockGet.mockResolvedValueOnce(userDocFixture());
    const res = await wrapped({
      data: { subscriptionId: 'sub_real_123' },
      auth: { token: { email: 'a@example.com' } },
    });
    expect(res).toEqual({ reactivated: true });
    expect(mockSubscriptionUpdate).toHaveBeenCalledWith('sub_real_123', {
      status: 'active',
    });
  });
});

describe('getDodoPayments — security', () => {
  const wrapped = test.wrap(fns.getDodoPayments);

  it('throws unauthenticated when no auth', async () => {
    await expect(wrapped({ data: {} }))
      .rejects.toMatchObject({ code: 'unauthenticated' });
  });

  it('throws invalid-argument when no email on token', async () => {
    await expect(
      wrapped({ data: {}, auth: { token: {} } })
    ).rejects.toMatchObject({ code: 'invalid-argument' });
  });

  it('returns sanitized payment list capped at 24', async () => {
    const items = Array.from({ length: 50 }, (_, i) => ({
      payment_id: `p_${i}`,
      created_at: '2026-01-01',
      total_amount: 999,
      currency: 'usd',
      status: 'succeeded',
      receipt_url: `https://r/${i}`,
      // raw fields that should NOT leak:
      raw_secret: 'leaky',
      customer_internal_id: 'should-not-leak',
    }));
    mockPaymentsList.mockResolvedValueOnce({ items });

    const res = await wrapped({
      data: {},
      auth: { token: { email: 'a@example.com' } },
    });

    expect(res.payments).toHaveLength(24);
    // Sanitization: only the whitelisted fields
    for (const p of res.payments) {
      expect(Object.keys(p).sort()).toEqual(
        ['created_at', 'currency', 'payment_id', 'receipt_url', 'status', 'total_amount']
      );
    }
  });

  it('only queries Dodo with the authenticated user email (no spoofing)', async () => {
    mockPaymentsList.mockResolvedValueOnce({ items: [] });
    await wrapped({
      data: { email: 'attacker-tries-to-spoof@example.com' },
      auth: { token: { email: 'real@example.com' } },
    });
    expect(mockPaymentsList).toHaveBeenCalledWith({
      customer_email: 'real@example.com',
    });
  });
});
