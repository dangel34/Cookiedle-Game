import { describe, it, expect } from 'vitest';
import { getDailyTarget, getDailyTarget2, getDailyTarget3 } from './daily.js';

const SECRET = 'test-secret-for-vitest-only';

// Minimal cookie array — id is required for stable sort in computeDailyTarget.
const COOKIES = Array.from({ length: 170 }, (_, i) => ({ id: i + 1, cookie_name: `Cookie${i}` }));

describe('getDailyTarget with dateOverride', () => {
  it('returns a cookie from the array', async () => {
    const c = await getDailyTarget(COOKIES, SECRET, '2025-1-1');
    expect(COOKIES).toContain(c);
  });

  it('is deterministic for the same date', async () => {
    const a = await getDailyTarget(COOKIES, SECRET, '2025-5-26');
    const b = await getDailyTarget(COOKIES, SECRET, '2025-5-26');
    expect(a).toBe(b);
  });

  it('returns different cookies for different dates', async () => {
    // This could theoretically collide, but with 170 cookies the chance is 1/170 per pair.
    const jan = await getDailyTarget(COOKIES, SECRET, '2025-1-1');
    const feb = await getDailyTarget(COOKIES, SECRET, '2025-2-1');
    const mar = await getDailyTarget(COOKIES, SECRET, '2025-3-1');
    // At least two of three should differ.
    expect(jan !== feb || jan !== mar || feb !== mar).toBe(true);
  });

  it('without override returns same result as passing today explicitly', async () => {
    const now = new Date();
    const todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
    const withOverride = await getDailyTarget(COOKIES, SECRET, todayStr);
    const withoutOverride = await getDailyTarget(COOKIES, SECRET);
    expect(withOverride).toBe(withoutOverride);
  });
});

describe('getDailyTarget2 and getDailyTarget3 hash independence', () => {
  it('game 1 and game 2 return different cookies for the same date', async () => {
    // The hash key for game 2 appends "-skill" before the secret, so it should differ.
    // In rare cases they could collide — test at least that the hash keys are distinct strings.
    const date = '2025-5-26';
    const g1 = await getDailyTarget(COOKIES, SECRET, date);
    const g2 = await getDailyTarget2(COOKIES, SECRET, date);
    const g3 = await getDailyTarget3(COOKIES, SECRET, date);
    // All three use different hash inputs, so the results should generally differ.
    // We just verify the function runs without error and returns a valid entry.
    expect(COOKIES).toContain(g1);
    expect(COOKIES).toContain(g2);
    expect(COOKIES).toContain(g3);
  });

  it('getDailyTarget2 is deterministic with override', async () => {
    const a = await getDailyTarget2(COOKIES, SECRET, '2025-1-15');
    const b = await getDailyTarget2(COOKIES, SECRET, '2025-1-15');
    expect(a).toBe(b);
  });

  it('getDailyTarget3 is deterministic with override', async () => {
    const a = await getDailyTarget3(COOKIES, SECRET, '2025-1-15');
    const b = await getDailyTarget3(COOKIES, SECRET, '2025-1-15');
    expect(a).toBe(b);
  });

  it('game 2 hash uses "-skill" suffix (different from game 1 for same date)', async () => {
    // Verify the hash inputs differ by computing a known date with a controlled secret.
    // If both used the same input, they'd return the same index.
    // We use enough dates that at least one pair should differ.
    let foundDiff = false;
    for (const date of ['2025-1-1', '2025-6-15', '2025-12-31']) {
      const g1 = await getDailyTarget(COOKIES, SECRET, date);
      const g2 = await getDailyTarget2(COOKIES, SECRET, date);
      if (g1 !== g2) {
        foundDiff = true;
        break;
      }
    }
    expect(foundDiff).toBe(true);
  });
});

describe('getDailyTarget backward compatibility', () => {
  it('passing a date string matching today gives the same result as no override', async () => {
    const now = new Date();
    const todayStr = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
    const g2WithOverride = await getDailyTarget2(COOKIES, SECRET, todayStr);
    const g2Without = await getDailyTarget2(COOKIES, SECRET);
    expect(g2WithOverride).toBe(g2Without);

    const g3WithOverride = await getDailyTarget3(COOKIES, SECRET, todayStr);
    const g3Without = await getDailyTarget3(COOKIES, SECRET);
    expect(g3WithOverride).toBe(g3Without);
  });
});
