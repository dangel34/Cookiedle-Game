import { describe, it, expect } from 'vitest';
import {
  makeToken,
  verifyAndDecodeToken,
  makeProgressToken,
  verifyProgressToken,
  signMessage,
  TOKEN_TTL_MS,
} from './crypto.js';

const SECRET = 'test-secret-for-vitest-only';
const COOKIE_COUNT = 170;

describe('HMAC tokens', () => {
  it('signMessage is deterministic', async () => {
    const a = await signMessage(SECRET, 'payload');
    const b = await signMessage(SECRET, 'payload');
    expect(a).toBe(b);
  });

  it('makeToken round-trips with verifyAndDecodeToken', async () => {
    const token = await makeToken(42, SECRET);
    const payload = await verifyAndDecodeToken(token, SECRET, COOKIE_COUNT);
    expect(payload).toEqual({ i: 42, t: Math.floor(Date.now() / TOKEN_TTL_MS) });
  });

  it('rejects tampered token', async () => {
    const token = await makeToken(1, SECRET);
    const bad = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a');
    expect(await verifyAndDecodeToken(bad, SECRET, COOKIE_COUNT)).toBeNull();
  });

  it('rejects out-of-range cookie index', async () => {
    const token = await makeToken(9999, SECRET);
    expect(await verifyAndDecodeToken(token, SECRET, COOKIE_COUNT)).toBeNull();
  });
});

describe('progress tokens', () => {
  it('rejects empty/null token (callers must use /daily-state to get an initial token)', async () => {
    expect(await verifyProgressToken(null, 'daily1', '2026-5-24', SECRET)).toBeNull();
    expect(await verifyProgressToken('', 'daily1', '2026-5-24', SECRET)).toBeNull();
  });

  it('round-trips progress state', async () => {
    const inner = { game: 'daily2', date: '2026-5-24', wrong: 5, hint_used: false };
    const token = await makeProgressToken(inner, SECRET);
    const state = await verifyProgressToken(token, 'daily2', '2026-5-24', SECRET);
    expect(state).toEqual(inner);
  });

  it('blocks hints before 5 wrong', async () => {
    const inner = { game: 'daily1', date: '2026-5-24', wrong: 4, hint_used: false };
    const token = await makeProgressToken(inner, SECRET);
    const state = await verifyProgressToken(token, 'daily1', '2026-5-24', SECRET);
    expect(state.wrong).toBe(4);
    expect(state.wrong >= 5).toBe(false);
  });

  it('allows hints at 5 wrong', async () => {
    const inner = { game: 'daily1', date: '2026-5-24', wrong: 5, hint_used: false };
    const token = await makeProgressToken(inner, SECRET);
    const state = await verifyProgressToken(token, 'daily1', '2026-5-24', SECRET);
    expect(state.wrong >= 5).toBe(true);
  });
});
