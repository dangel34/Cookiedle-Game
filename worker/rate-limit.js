// Sliding-window counter via Cache API (no KV binding required).

const RATE_LIMITS = {
  'POST /guess': { limit: 30, windowSec: 60 },
  'POST /guess2': { limit: 30, windowSec: 60 },
  'POST /guess3': { limit: 30, windowSec: 60 },
  'POST /unlimited/guess': { limit: 120, windowSec: 60 },
  'POST /unlimited/hint': { limit: 60, windowSec: 60 },
  'GET /unlimited/new': { limit: 60, windowSec: 60 },
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
