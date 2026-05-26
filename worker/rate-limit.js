// Sliding-window counter via Cache API (no KV binding required).
//
// Known limitation: the read-check-write is non-atomic. Under high concurrency,
// multiple requests that arrive before any cache.put completes will all read the
// same stale counter and all pass the limit check simultaneously. The burst
// over-allowance equals the number of truly concurrent requests, which is
// negligible for normal traffic but cannot be fully prevented without an atomic
// store (KV / Durable Objects).

const RATE_LIMITS = {
  'POST /guess': { limit: 30, windowSec: 60 },
  'POST /guess2': { limit: 30, windowSec: 60 },
  'POST /guess3': { limit: 30, windowSec: 60 },
  'POST /unlimited/guess': { limit: 120, windowSec: 60 },
  'POST /unlimited/hint': { limit: 60, windowSec: 60 },
  'GET /unlimited/new': { limit: 60, windowSec: 60 },
  'GET /hint': { limit: 20, windowSec: 60 },
  'GET /hint2': { limit: 20, windowSec: 60 },
  'GET /hint3': { limit: 20, windowSec: 60 },
  'GET /skill': { limit: 30, windowSec: 60 },
  'GET /skill-image': { limit: 30, windowSec: 60 },
  'GET /silhouette3-image': { limit: 30, windowSec: 60 },
  'GET /roster': { limit: 20, windowSec: 60 },
  'GET /cookies': { limit: 20, windowSec: 60 },
  'GET /daily-state': { limit: 30, windowSec: 3600 },
  'GET /admin/cookies': { limit: 20, windowSec: 60 },
  'POST /admin/cookies': { limit: 10, windowSec: 60 },
  'PUT /admin/cookies': { limit: 10, windowSec: 60 },
  'DELETE /admin/cookies': { limit: 10, windowSec: 60 },
  'POST /admin/cookies/seed': { limit: 3, windowSec: 3600 },
};

export function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

export function rateLimitConfig(method, pathname) {
  return RATE_LIMITS[`${method} ${pathname}`] || null;
}

export async function checkRateLimit(request, routeKey) {
  const cfg = RATE_LIMITS[routeKey];
  if (!cfg) return true;

  const ip = getClientIp(request);
  const cacheKey = new Request(`https://rate-limit.cookiedle.internal/${routeKey}/${ip}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);

  let count = 0;
  if (cached) {
    const n = Number.parseInt(await cached.text(), 10);
    if (!Number.isNaN(n)) count = n;
  }

  if (count >= cfg.limit) return false;

  await cache.put(
    cacheKey,
    new Response(String(count + 1), {
      headers: { 'Cache-Control': `max-age=${cfg.windowSec}` },
    })
  );
  return true;
}
