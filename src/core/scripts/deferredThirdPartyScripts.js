/**
 * Runs `callback` on the browser's next idle slot, or after `timeoutMs`
 * elapses — whichever happens first. Used to keep third-party scripts
 * (GTM, Meta Pixel, AdSense) off the main thread during initial load
 * without losing them entirely on short/bounce sessions.
 */
export function onIdleOrTimeout(callback, { timeoutMs = 4000 } = {}) {
  let called = false;
  const run = () => {
    if (called) return;
    called = true;
    callback();
  };

  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(run, { timeout: timeoutMs });
  } else {
    setTimeout(run, timeoutMs);
  }

  setTimeout(run, timeoutMs);
}
