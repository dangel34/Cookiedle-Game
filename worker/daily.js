async function computeDailyTarget(cookies, secret, dateOverride, suffix) {
  const now = new Date();
  const base =
    dateOverride || `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
  const msgBuffer = new TextEncoder().encode(base + suffix + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashInt = hashArray.slice(0, 4).reduce((acc, b) => (acc * 256 + b) >>> 0, 0);
  // Sort by stable id so reordering the KV array never shifts daily answers.
  const sorted = [...cookies].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  return sorted[hashInt % sorted.length];
}

export const getDailyTarget = (cookies, secret, dateOverride) =>
  computeDailyTarget(cookies, secret, dateOverride, '');
export const getDailyTarget2 = (cookies, secret, dateOverride) =>
  computeDailyTarget(cookies, secret, dateOverride, '-skill');
export const getDailyTarget3 = (cookies, secret, dateOverride) =>
  computeDailyTarget(cookies, secret, dateOverride, '-silhouette');
