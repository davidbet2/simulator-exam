/**
 * expireStalePlans — scheduled fallback that downgrades 'pro' users whose
 * subscriptionRenewsAt is stale, in case the Dodo webhook never arrives
 * (root cause of the certzen.app/api/dodo/webhookPDN routing bug).
 *
 * Run:  cd functions && npm test
 */
const test = require('firebase-functions-test')();

jest.mock('firebase-functions/params', () => {
  const actual = jest.requireActual('firebase-functions/params');
  return {
    ...actual,
    defineSecret: (name) => ({ value: () => `mock-${name}` }),
  };
});

const mockCommit = jest.fn().mockResolvedValue();
const mockBatchUpdate = jest.fn();
const mockBatch = jest.fn(() => ({ update: mockBatchUpdate, commit: mockCommit }));
const mockGet = jest.fn();
const mockWhere = jest.fn(() => ({ get: mockGet }));
const mockCollection = jest.fn(() => ({ where: mockWhere }));

jest.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({
    collection: mockCollection,
    batch: mockBatch,
  }),
}));

jest.mock('firebase-admin/app', () => ({ initializeApp: jest.fn() }));

jest.mock('dodopayments', () => ({
  default: jest.fn().mockImplementation(() => ({})),
}), { virtual: true });

const fns = require('../index');

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  test.cleanup();
});

function snapshotFixture(userDocs) {
  return { forEach: (cb) => userDocs.forEach(cb) };
}

function userDoc(id, data) {
  return { ref: { id }, data: () => data };
}

describe('expireStalePlans', () => {
  const wrapped = test.wrap(fns.expireStalePlans);

  it('downgrades a pro user whose subscription expired more than 3 days ago', async () => {
    const staleRenewsAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    mockGet.mockResolvedValueOnce(
      snapshotFixture([userDoc('userA', { subscriptionRenewsAt: staleRenewsAt })])
    );

    await wrapped();

    expect(mockCollection).toHaveBeenCalledWith('users');
    expect(mockWhere).toHaveBeenCalledWith('plan', '==', 'pro');
    expect(mockBatchUpdate).toHaveBeenCalledWith(
      { id: 'userA' },
      expect.objectContaining({ plan: 'free', isPro: false, subscriptionStatus: 'expired' })
    );
    expect(mockCommit).toHaveBeenCalledTimes(1);
  });

  it('does not downgrade a pro user still within the renewal window', async () => {
    const freshRenewsAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    mockGet.mockResolvedValueOnce(
      snapshotFixture([userDoc('userB', { subscriptionRenewsAt: freshRenewsAt })])
    );

    await wrapped();

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockCommit).not.toHaveBeenCalled();
  });

  it('does not downgrade a pro user within the 3-day grace period', async () => {
    const withinGrace = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    mockGet.mockResolvedValueOnce(
      snapshotFixture([userDoc('userC', { subscriptionRenewsAt: withinGrace })])
    );

    await wrapped();

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockCommit).not.toHaveBeenCalled();
  });

  it('skips users with no subscriptionRenewsAt (never commits an empty batch)', async () => {
    mockGet.mockResolvedValueOnce(snapshotFixture([userDoc('userD', {})]));

    await wrapped();

    expect(mockBatchUpdate).not.toHaveBeenCalled();
    expect(mockCommit).not.toHaveBeenCalled();
  });
});
