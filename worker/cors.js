const ALLOWED_ORIGINS = new Set([
  'https://cookiedle.nappi.work',
  'http://localhost:8787',
  'http://127.0.0.1:8787',
]);

export function corsHeaders(request) {
  const origin = request?.headers?.get('Origin');
  const allowOrigin =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://cookiedle.nappi.work';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

export function jsonResponse(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...corsHeaders(request),
    },
  });
}
