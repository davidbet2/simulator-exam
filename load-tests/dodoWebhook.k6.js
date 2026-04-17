/**
 * k6 load test — dodoWebhook idempotency under burst.
 *
 * Prereq: install k6 → https://k6.io/docs/get-started/installation/
 *   winget install k6 --source winget
 *
 * Run (against staging only — NEVER prod):
 *   k6 run --env WEBHOOK_URL=https://staging.example.com/api/dodo/webhook \
 *          --env WEBHOOK_SECRET=test_signing_secret \
 *          load-tests/dodoWebhook.k6.js
 *
 * The same event_id is sent N times in parallel — the function must process
 * it exactly once thanks to the idempotency key in the dodo_events collection.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },  // ramp-up
    { duration: '1m',  target: 50 },  // sustained burst
    { duration: '20s', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // <1% errors
    http_req_duration: ['p(95)<1500'],  // p95 < 1.5s incl. cold-start
  },
};

const URL    = __ENV.WEBHOOK_URL;
const SECRET = __ENV.WEBHOOK_SECRET || '';

if (!URL) throw new Error('WEBHOOK_URL env var required');

export default function () {
  // Same event_id across all VUs to test idempotency
  const payload = JSON.stringify({
    event_id: 'evt_loadtest_idempotent_001',
    type: 'subscription.active',
    data: { subscription_id: 'sub_load_test', status: 'active' },
  });

  // NOTE: signature MUST be precomputed for the fixed payload above.
  // Replace this with a valid HMAC for your staging webhook secret.
  const headers = {
    'Content-Type': 'application/json',
    'webhook-signature': SECRET,
    'webhook-id': 'evt_loadtest_idempotent_001',
    'webhook-timestamp': String(Math.floor(Date.now() / 1000)),
  };

  const res = http.post(URL, payload, { headers });
  check(res, {
    'status 200/204': (r) => r.status === 200 || r.status === 204,
    'no 5xx':         (r) => r.status < 500,
  });
  sleep(0.1);
}
