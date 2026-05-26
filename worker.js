// worker.js - Cloudflare Worker entry
import { getCookies } from './worker/cookies-kv.js';
import {
  checkAuth,
  handleAdminGetCookies,
  handleAdminAddCookie,
  handleAdminUpdateCookie,
  handleAdminDeleteCookie,
  handleAdminSeedCookies,
} from './worker/admin.js';
import { getDailyTarget, getDailyTarget2, getDailyTarget3 } from './worker/daily.js';
import { corsHeaders, jsonResponse } from './worker/cors.js';
import {
  makeToken,
  verifyAndDecodeToken,
  makeProgressToken,
  verifyProgressToken,
} from './worker/crypto.js';
import { sanitizeInput } from './worker/sanitize.js';
import { checkRateLimit, rateLimitConfig } from './worker/rate-limit.js';
import { logEvent } from './worker/analytics.js';

// ─────────────────────────────────────────
// EVALUATE A GUESS AGAINST TARGET
// Returns trait results without revealing target
// ─────────────────────────────────────────
const cmpI = (a, b) => a.toLowerCase() === b.toLowerCase();

function colorResult(guess, primary, secondary) {
  if (cmpI(guess, primary)) return 'correct';
  if (cmpI(guess, secondary)) return 'partial';
  return 'wrong';
}

function evaluateGuess(guess, target) {
  return {
    cookie_name: guess.cookie_name,
    primary_color: colorResult(guess.primary_color, target.primary_color, target.secondary_color),
    secondary_color: colorResult(
      guess.secondary_color,
      target.secondary_color,
      target.primary_color
    ),
    rarity: cmpI(guess.rarity, target.rarity) ? 'correct' : 'wrong',
    type: cmpI(guess.type, target.type) ? 'correct' : 'wrong',
    position: cmpI(guess.position, target.position) ? 'correct' : 'wrong',
    correct: cmpI(guess.cookie_name, target.cookie_name),
  };
}

// ─────────────────────────────────────────
// ROUTE HANDLERS
// ─────────────────────────────────────────
function unbiasedRandomIndex(n) {
  const limit = 2 ** 32 - (2 ** 32 % n);
  let value;
  do {
    value = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (value >= limit);
  return value % n;
}

async function handleUnlimitedNew({ request, env, COOKIES }) {
  const url = new URL(request.url);
  const rarity = url.searchParams.get('rarity') || '';
  const type = url.searchParams.get('type') || '';

  const filteredIndices = COOKIES.reduce((acc, c, i) => {
    if ((!rarity || c.rarity === rarity) && (!type || c.type === type)) acc.push(i);
    return acc;
  }, []);

  if (filteredIndices.length === 0) {
    return jsonResponse(request, { error: 'No cookies match the selected filters.' }, 400);
  }

  const cookieIndex = filteredIndices[unbiasedRandomIndex(filteredIndices.length)];
  const token = await makeToken(cookieIndex, env.COOKIE_SECRET);
  const progress_token = await makeProgressToken(
    { game: 'unlimited', date: 'rolling', wrong: 0, hint_used: false, token_bind: token },
    env.COOKIE_SECRET
  );
  return jsonResponse(request, { token, progress_token });
}

async function handleUnlimitedGuess({ request, env, COOKIES }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const token = sanitizeInput(body.token || '', 300);
  const progressToken = sanitizeInput(body.progress_token || '', 500);
  const guess = sanitizeInput(body.guess || '');
  if (!token || !guess || !progressToken)
    return jsonResponse(request, { error: 'Missing token, progress token, or guess' }, 400);
  if (token.length > 280 || progressToken.length > 480)
    return jsonResponse(request, { error: 'Invalid token' }, 400);

  const tokenPayload = await verifyAndDecodeToken(token, env.COOKIE_SECRET, COOKIES.length);
  if (!tokenPayload)
    return jsonResponse(
      request,
      { error: 'Invalid or expired token - click New Cookie to get a fresh one.' },
      400
    );
  const target_u = COOKIES[tokenPayload.i];

  const progress = await verifyProgressToken(
    progressToken,
    'unlimited',
    'rolling',
    env.COOKIE_SECRET
  );
  if (progress?.token_bind !== token) {
    return jsonResponse(
      request,
      { error: 'Invalid progress token - click New Cookie to start over.' },
      400
    );
  }

  const guessCookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === guess.toLowerCase());
  if (!guessCookie) return jsonResponse(request, { error: 'Cookie not found' }, 404);

  const result = evaluateGuess(guessCookie, target_u);
  const nextProgress = { ...progress, wrong: result.correct ? progress.wrong : progress.wrong + 1 };
  result.progress_token = await makeProgressToken(nextProgress, env.COOKIE_SECRET);
  logEvent(env, {
    game: 'unlimited',
    outcome: result.correct ? 'win' : 'guess',
    wrong_count: nextProgress.wrong,
    hint_used: nextProgress.hint_used,
  });
  if (result.correct) {
    result.cookie_name = target_u.cookie_name;
    result.skill_name = target_u.skill_name || '';
    result.skill_cooldown = target_u.skill_cooldown || 0;
  }
  return jsonResponse(request, result);
}

async function handleUnlimitedHint({ request, env, COOKIES }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const token = sanitizeInput(body.token || '', 300);
  const progressToken = sanitizeInput(body.progress_token || '', 500);
  const trait = sanitizeInput(body.trait || '');
  const valid = ['primary_color', 'secondary_color', 'rarity', 'type', 'position'];
  if (!token || !progressToken || !valid.includes(trait))
    return jsonResponse(request, { error: 'Invalid request' }, 400);

  const tokenPayload = await verifyAndDecodeToken(token, env.COOKIE_SECRET, COOKIES.length);
  if (!tokenPayload) return jsonResponse(request, { error: 'Invalid or expired token' }, 400);
  const target_u = COOKIES[tokenPayload.i];

  const progress = await verifyProgressToken(
    progressToken,
    'unlimited',
    'rolling',
    env.COOKIE_SECRET
  );
  if (progress?.token_bind !== token) {
    return jsonResponse(
      request,
      { error: 'Invalid progress token - click New Cookie to start over.' },
      400
    );
  }
  if (progress.hint_used)
    return jsonResponse(request, { error: 'Hint already used this round' }, 403);
  if (progress.wrong < 5)
    return jsonResponse(request, { error: 'Hint requires 5 wrong guesses' }, 403);

  const nextProgress = { ...progress, hint_used: true };
  return jsonResponse(request, {
    trait,
    value: target_u[trait],
    progress_token: await makeProgressToken(nextProgress, env.COOKIE_SECRET),
  });
}

// ─────────────────────────────────────────
// SHARED DAILY GAME HELPERS
// ─────────────────────────────────────────

async function handleDailyHint({ request, url, env, gameId, todayStr, buildPayload }) {
  const stateToken = sanitizeInput(url.searchParams.get('state_token') || '', 500);
  const state = await verifyProgressToken(stateToken, gameId, todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse(request, { error: 'Invalid state token. Refresh to continue.' }, 400);
  if (state.hint_used) return jsonResponse(request, { error: 'Hint already used' }, 403);
  if (state.wrong < 5)
    return jsonResponse(request, { error: 'Hint requires 5 wrong guesses' }, 403);
  const nextState = { ...state, hint_used: true };
  return jsonResponse(request, {
    ...buildPayload(),
    state_token: await makeProgressToken(nextState, env.COOKIE_SECRET),
  });
}

async function handleDailyBinaryGuess({ request, body, env, gameId, todayStr, target }) {
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  const stateToken = sanitizeInput(body.state_token || '', 500);
  if (!guessName) return jsonResponse(request, { error: 'No guess provided' }, 400);
  const state = await verifyProgressToken(stateToken, gameId, todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse(request, { error: 'Invalid state token. Refresh to continue.' }, 400);
  const correct = guessName === target.cookie_name.toLowerCase();
  const nextState = { ...state, wrong: correct ? state.wrong : state.wrong + 1 };
  logEvent(env, {
    game: gameId,
    outcome: correct ? 'win' : 'guess',
    wrong_count: nextState.wrong,
    hint_used: state.hint_used,
  });
  return jsonResponse(request, {
    correct,
    cookie_name: correct ? target.cookie_name : undefined,
    state_token: await makeProgressToken(nextState, env.COOKIE_SECRET),
  });
}

// ─────────────────────────────────────────
// GAME 1 HANDLERS
// ─────────────────────────────────────────

async function handleGuess1({ request, env, target, todayStr, COOKIES }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  const stateToken = sanitizeInput(body.state_token || '', 500);
  if (!guessName) return jsonResponse(request, { error: 'No guess provided' }, 400);

  const guessCookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === guessName);
  if (!guessCookie) return jsonResponse(request, { error: 'Cookie not found' }, 404);

  const result = evaluateGuess(guessCookie, target);
  const state = await verifyProgressToken(stateToken, 'daily1', todayStr, env.COOKIE_SECRET);
  if (!state)
    return jsonResponse(request, { error: 'Invalid state token. Refresh to continue.' }, 400);
  const nextState = { ...state, wrong: result.correct ? state.wrong : state.wrong + 1 };
  result.state_token = await makeProgressToken(nextState, env.COOKIE_SECRET);
  logEvent(env, {
    game: 'daily1',
    outcome: result.correct ? 'win' : 'guess',
    wrong_count: nextState.wrong,
    hint_used: state.hint_used,
  });
  if (result.correct) {
    result.skill_name = target.skill_name || '';
    result.skill_cooldown = target.skill_cooldown || 0;
    result.cookie_name = target.cookie_name;
  }
  return jsonResponse(request, result);
}

async function handleHint1({ request, url, env, target, todayStr }) {
  const trait = sanitizeInput(url.searchParams.get('trait') || '');
  const valid = ['primary_color', 'secondary_color', 'rarity', 'type', 'position'];
  if (!valid.includes(trait)) return jsonResponse(request, { error: 'Invalid trait' }, 400);
  return handleDailyHint({
    request,
    url,
    env,
    gameId: 'daily1',
    todayStr,
    buildPayload: () => ({ trait, value: target[trait] }),
  });
}

// ─────────────────────────────────────────
// ASSET & UTILITY HANDLERS
// ─────────────────────────────────────────

function handleRoster({ request, COOKIES }) {
  return new Response(JSON.stringify(COOKIES), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      ...corsHeaders(request),
    },
  });
}

function handleSkill({ request, target2 }) {
  return jsonResponse(request, {
    skill_name: target2.skill_name,
    skill_cooldown: target2.skill_cooldown,
  });
}

async function handleSkillImage({ request, env, target2 }) {
  const filename = target2.cookie_name.replaceAll(' ', '_') + '.webp';
  const imageRes = await env.ASSETS.fetch(
    new Request(new URL(`/cookie_skill_images/${filename}`, request.url))
  );
  const headers = new Headers(imageRes.headers);
  Object.entries(corsHeaders(request)).forEach(([k, v]) => headers.set(k, v));
  return new Response(imageRes.body, { status: imageRes.status, headers });
}

async function handleSilhouette3Image({ request, env, target3 }) {
  const filename = target3.cookie_name.replaceAll(' ', '_') + '.webp';
  const imageRes = await env.ASSETS.fetch(
    new Request(new URL(`/cookie_silhouettes/${filename}`, request.url))
  );
  const headers = new Headers(imageRes.headers);
  Object.entries(corsHeaders(request)).forEach(([k, v]) => headers.set(k, v));
  return new Response(imageRes.body, { status: imageRes.status, headers });
}

// ─────────────────────────────────────────
// GAME 2 HANDLERS
// ─────────────────────────────────────────

async function handleGuess2({ request, env, target2, todayStr }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  return handleDailyBinaryGuess({
    request,
    body,
    env,
    gameId: 'daily2',
    todayStr,
    target: target2,
  });
}

async function handleHint2({ request, url, env, target2, todayStr }) {
  return handleDailyHint({
    request,
    url,
    env,
    gameId: 'daily2',
    todayStr,
    buildPayload: () => ({
      rarity: target2.rarity,
      type: target2.type,
      position: target2.position,
    }),
  });
}

// ─────────────────────────────────────────
// GAME 3 HANDLERS
// ─────────────────────────────────────────

async function handleGuess3({ request, env, target3, todayStr, COOKIES }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { error: 'Invalid JSON' }, 400);
  }
  const guessName = sanitizeInput(body.guess || '').toLowerCase();
  if (guessName && !COOKIES.some((c) => c.cookie_name.toLowerCase() === guessName))
    return jsonResponse(request, { error: 'Cookie not found' }, 404);
  return handleDailyBinaryGuess({
    request,
    body,
    env,
    gameId: 'daily3',
    todayStr,
    target: target3,
  });
}

async function handleHint3({ request, url, env, target3, todayStr }) {
  return handleDailyHint({
    request,
    url,
    env,
    gameId: 'daily3',
    todayStr,
    buildPayload: () => ({
      primary_color: target3.primary_color,
      type: target3.type,
      rarity: target3.rarity,
    }),
  });
}

function handleCookieCount({ request, COOKIES }) {
  return jsonResponse(request, { count: COOKIES.length });
}

function handleHealth({ request, COOKIES }) {
  const now = new Date();
  return jsonResponse(request, {
    ok: true,
    cookies: COOKIES.length,
    date: `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`,
  });
}

// Issues fresh initial progress tokens for all three daily games.
// Called by the client on page load when no stored tokens exist.
async function handleDailyState({ request, env, todayStr }) {
  const [g1, g2, g3] = await Promise.all([
    makeProgressToken(
      { game: 'daily1', date: todayStr, wrong: 0, hint_used: false },
      env.COOKIE_SECRET
    ),
    makeProgressToken(
      { game: 'daily2', date: todayStr, wrong: 0, hint_used: false },
      env.COOKIE_SECRET
    ),
    makeProgressToken(
      { game: 'daily3', date: todayStr, wrong: 0, hint_used: false },
      env.COOKIE_SECRET
    ),
  ]);
  return jsonResponse(request, { g1, g2, g3 });
}

// ─────────────────────────────────────────
// ROUTE TABLE & MAIN HANDLER
// ─────────────────────────────────────────
const ROUTES = new Map([
  ['GET /unlimited/new', handleUnlimitedNew],
  ['POST /unlimited/guess', handleUnlimitedGuess],
  ['POST /unlimited/hint', handleUnlimitedHint],
  ['POST /guess', handleGuess1],
  ['GET /hint', handleHint1],
  ['GET /roster', handleRoster],
  ['GET /cookies', handleRoster],
  ['GET /skill', handleSkill],
  ['GET /skill-image', handleSkillImage],
  ['POST /guess2', handleGuess2],
  ['GET /hint2', handleHint2],
  ['GET /silhouette3-image', handleSilhouette3Image],
  ['POST /guess3', handleGuess3],
  ['GET /hint3', handleHint3],
  ['GET /cookie-count', handleCookieCount],
  ['GET /health', handleHealth],
  ['GET /daily-state', handleDailyState],
  ['GET /admin/cookies', handleAdminGetCookies],
  ['POST /admin/cookies', handleAdminAddCookie],
  ['PUT /admin/cookies', handleAdminUpdateCookie],
  ['DELETE /admin/cookies', handleAdminDeleteCookie],
  ['POST /admin/cookies/seed', handleAdminSeedCookies],
]);

export default {
  async fetch(request, env) {
    try {
      if (!env.COOKIE_SECRET) {
        return new Response('Service misconfigured', { status: 503 });
      }

      const url = new URL(request.url);

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      }

      if (url.pathname.startsWith('/admin') && !checkAuth(request, env)) {
        return jsonResponse(request, { error: 'Unauthorized' }, 401);
      }

      const now = new Date();
      let todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
      const dateParam = url.searchParams.get('date');
      if (dateParam && /^\d{4}-\d{1,2}-\d{1,2}$/.test(dateParam)) {
        const [py, pm, pd] = dateParam.split('-').map(Number);
        const parsed = new Date(Date.UTC(py, pm - 1, pd));
        if (
          parsed.getUTCFullYear() === py &&
          parsed.getUTCMonth() === pm - 1 &&
          parsed.getUTCDate() === pd &&
          parsed.getTime() <= Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        ) {
          todayStr = dateParam;
        }
      }

      const routeKey = `${request.method} ${url.pathname}`;
      const rateCfg = rateLimitConfig(request.method, url.pathname);
      if (rateCfg) {
        const allowed = await checkRateLimit(request, routeKey);
        if (!allowed) {
          return jsonResponse(request, { error: 'Too many requests - slow down.' }, 429);
        }
      }

      const handler = ROUTES.get(`${request.method} ${url.pathname}`);
      if (!handler) return jsonResponse(request, { error: 'Not found' }, 404);

      const COOKIES = await getCookies(env);

      const needsTarget1 = url.pathname === '/guess' || url.pathname === '/hint';
      const needsTarget2 =
        url.pathname === '/skill' ||
        url.pathname === '/skill-image' ||
        url.pathname === '/guess2' ||
        url.pathname === '/hint2';
      const needsTarget3 =
        url.pathname === '/silhouette3-image' ||
        url.pathname === '/guess3' ||
        url.pathname === '/hint3';

      const [target, target2, target3] = await Promise.all([
        needsTarget1 ? getDailyTarget(COOKIES, env.COOKIE_SECRET, todayStr) : null,
        needsTarget2 ? getDailyTarget2(COOKIES, env.COOKIE_SECRET, todayStr) : null,
        needsTarget3 ? getDailyTarget3(COOKIES, env.COOKIE_SECRET, todayStr) : null,
      ]);

      return handler({ request, env, url, target, target2, target3, todayStr, COOKIES });
    } catch (err) {
      console.error(err);
      return jsonResponse(request, { error: 'Internal server error' }, 500);
    }
  },
};
