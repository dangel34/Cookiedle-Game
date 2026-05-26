// worker/analytics.js - Privacy-respecting event logging via Cloudflare Analytics Engine.
// No IP, no cookie names, no fingerprints.
// Data is queryable via the Analytics Engine SQL API in the Cloudflare dashboard.
export function logEvent(env, { game, outcome, wrong_count, hint_used }) {
  try {
    env.ANALYTICS?.writeDataPoint({
      blobs: [game, outcome],
      doubles: [wrong_count, hint_used ? 1 : 0],
      indexes: [game],
    });
  } catch {
    // analytics must never break the game
  }
}
