import INITIAL_COOKIES from '../data/cookies.json';
import { jsonResponse } from './cors.js';
import { getCookies, saveCookies } from './cookies-kv.js';

const VALID_RARITIES = [
  'Common',
  'Rare',
  'Epic',
  'Super Epic',
  'Legendary',
  'Ancient',
  'Dragon',
  'Beast',
  'Special',
  'Witch',
];
const VALID_TYPES = [
  'Ambush',
  'Bomber',
  'Charge',
  'Defense',
  'Healing',
  'Magic',
  'Ranged',
  'Support',
];
const VALID_POSITIONS = ['Front', 'Middle', 'Rear'];

export function checkAuth(request, env) {
  if (!env.ADMIN_SECRET) return false;
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return token === env.ADMIN_SECRET;
}

function validateCookie(c) {
  if (!c || typeof c !== 'object') return 'Cookie must be an object';
  if (typeof c.cookie_name !== 'string' || !c.cookie_name.trim()) return 'cookie_name is required';
  if (typeof c.primary_color !== 'string' || !c.primary_color.trim())
    return 'primary_color is required';
  if (typeof c.secondary_color !== 'string' || !c.secondary_color.trim())
    return 'secondary_color is required';
  if (!VALID_RARITIES.includes(c.rarity))
    return `rarity must be one of: ${VALID_RARITIES.join(', ')}`;
  if (!VALID_TYPES.includes(c.type)) return `type must be one of: ${VALID_TYPES.join(', ')}`;
  if (!VALID_POSITIONS.includes(c.position))
    return `position must be one of: ${VALID_POSITIONS.join(', ')}`;
  if (typeof c.skill_name !== 'string' || !c.skill_name.trim()) return 'skill_name is required';
  if (typeof c.skill_cooldown !== 'number' || c.skill_cooldown < 0)
    return 'skill_cooldown must be a non-negative number';
  return null;
}

function shapeCookie(body) {
  return {
    cookie_name: body.cookie_name.trim(),
    primary_color: body.primary_color.trim(),
    secondary_color: body.secondary_color.trim(),
    rarity: body.rarity,
    type: body.type,
    position: body.position,
    skill_name: body.skill_name.trim(),
    skill_cooldown: Number(body.skill_cooldown),
  };
}

export async function handleAdminGetCookies({ request, env }) {
  const cookies = await getCookies(env);
  return jsonResponse(request, { cookies, count: cookies.length });
}

export async function handleAdminAddCookie({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const error = validateCookie(body);
  if (error) return jsonResponse(request, { error }, 400);
  const cookies = await getCookies(env);
  if (cookies.some((c) => c.cookie_name.toLowerCase() === body.cookie_name.trim().toLowerCase()))
    return jsonResponse(request, { error: 'Cookie already exists' }, 409);
  const entry = shapeCookie(body);
  await saveCookies(env, [...cookies, entry]);
  return jsonResponse(request, { ok: true, cookie: entry }, 201);
}

export async function handleAdminUpdateCookie({ request, env, url }) {
  const name = (url.searchParams.get('name') || '').trim();
  if (!name) return jsonResponse(request, { error: 'name query param required' }, 400);
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const error = validateCookie(body);
  if (error) return jsonResponse(request, { error }, 400);
  const cookies = await getCookies(env);
  const idx = cookies.findIndex((c) => c.cookie_name.toLowerCase() === name.toLowerCase());
  if (idx === -1) return jsonResponse(request, { error: 'Cookie not found' }, 404);
  const updated = shapeCookie(body);
  const newList = [...cookies];
  newList[idx] = updated;
  await saveCookies(env, newList);
  return jsonResponse(request, { ok: true, cookie: updated });
}

export async function handleAdminDeleteCookie({ request, env, url }) {
  const name = (url.searchParams.get('name') || '').trim();
  if (!name) return jsonResponse(request, { error: 'name query param required' }, 400);
  const cookies = await getCookies(env);
  const idx = cookies.findIndex((c) => c.cookie_name.toLowerCase() === name.toLowerCase());
  if (idx === -1) return jsonResponse(request, { error: 'Cookie not found' }, 404);
  await saveCookies(
    env,
    cookies.filter((_, i) => i !== idx)
  );
  return jsonResponse(request, { ok: true });
}

export async function handleAdminSeedCookies({ request, env }) {
  await saveCookies(env, INITIAL_COOKIES);
  return jsonResponse(request, { ok: true, count: INITIAL_COOKIES.length });
}
