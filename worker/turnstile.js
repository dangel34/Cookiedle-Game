export async function verifyTurnstile(token, secret, remoteip) {
  if (!secret) return true;
  if (!token || typeof token !== 'string') return false;

  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (remoteip) body.set('remoteip', remoteip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

export const DAILY_GUESS_PATHS = new Set(['/guess', '/guess2', '/guess3', '/unlimited/guess']);
