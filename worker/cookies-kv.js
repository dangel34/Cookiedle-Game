import INITIAL_COOKIES from '../data/cookies.json';

const KV_KEY = 'cookies';
let _cache = null;

export async function getCookies(env) {
  if (_cache) return _cache;
  if (!env.COOKIEDLE_KV) return INITIAL_COOKIES;
  try {
    const raw = await env.COOKIEDLE_KV.get(KV_KEY, { cacheTtl: 60 });
    _cache = raw ? JSON.parse(raw) : INITIAL_COOKIES;
  } catch {
    _cache = INITIAL_COOKIES;
  }
  return _cache;
}

export async function saveCookies(env, cookies) {
  await env.COOKIEDLE_KV.put(KV_KEY, JSON.stringify(cookies));
  _cache = cookies;
}
