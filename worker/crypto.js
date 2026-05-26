// HMAC token helpers - unlimited mode + daily progress tokens

export const TOKEN_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const hmacKeyCache = new Map();

export function base64UrlEncodeBytes(bytes) {
  return btoa(String.fromCodePoint(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/g, '');
}

export function base64UrlDecodeToBytes(str) {
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.codePointAt(0));
}

async function getHmacKey(secret) {
  if (!hmacKeyCache.has(secret)) {
    const promise = crypto.subtle
      .importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .catch((err) => {
        // Remove poisoned entry so the next call retries instead of re-throwing forever
        hmacKeyCache.delete(secret);
        throw err;
      });
    hmacKeyCache.set(secret, promise);
  }
  return hmacKeyCache.get(secret);
}

export async function signMessage(secret, message) {
  const key = await getHmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return base64UrlEncodeBytes(new Uint8Array(sig));
}

export async function makeToken(cookieIndex, secret) {
  const ts = Math.floor(Date.now() / TOKEN_TTL_MS);
  const payloadObj = { i: cookieIndex, t: ts };
  const payloadB64 = base64UrlEncodeBytes(encoder.encode(JSON.stringify(payloadObj)));
  const sig = await signMessage(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifyAndDecodeToken(token, secret, cookieCount) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const expectedSig = await signMessage(secret, payloadB64);
  if (expectedSig !== sig) return null;

  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlDecodeToBytes(payloadB64)));
  } catch {
    return null;
  }
  if (!payload || !Number.isInteger(payload.i) || !Number.isInteger(payload.t)) return null;

  const nowTs = Math.floor(Date.now() / TOKEN_TTL_MS);
  if (payload.t !== nowTs && payload.t !== nowTs - 1) return null;
  if (payload.i < 0 || payload.i >= cookieCount) return null;

  return payload;
}

export async function makeProgressToken(progressState, secret) {
  const payloadB64 = base64UrlEncodeBytes(encoder.encode(JSON.stringify(progressState)));
  const sig = await signMessage(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

export async function verifyProgressToken(token, expectedGame, expectedDate, secret) {
  // Empty token is invalid - callers must provide a signed token (issued by /daily-state or prior guess)
  if (!token) return null;
  if (typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const expectedSig = await signMessage(secret, payloadB64);
  if (expectedSig !== sig) return null;

  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64UrlDecodeToBytes(payloadB64)));
  } catch {
    return null;
  }
  if (!payload || payload.game !== expectedGame || payload.date !== expectedDate) return null;
  if (!Number.isInteger(payload.wrong) || payload.wrong < 0) return null;
  if (typeof payload.hint_used !== 'boolean') return null;
  return payload;
}
