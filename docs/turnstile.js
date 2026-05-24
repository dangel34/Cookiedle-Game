// Cloudflare Turnstile (explicit invisible widget). Disabled when meta site key is empty.
let turnstileToken = null;
let turnstileWidgetId = null;

function turnstileSiteKey() {
  return document.querySelector('meta[name="turnstile-site-key"]')?.content?.trim() || '';
}

function turnstileEnabled() {
  return Boolean(turnstileSiteKey());
}

function turnstileBodyExtra() {
  return turnstileToken ? { turnstile_token: turnstileToken } : {};
}

async function initTurnstile() {
  const siteKey = turnstileSiteKey();
  if (!siteKey) return;

  await new Promise((resolve, reject) => {
    if (globalThis.turnstile) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.onload = resolve;
    s.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(s);
  });

  let anchor = document.getElementById('turnstile-anchor');
  if (!anchor) {
    anchor = document.createElement('div');
    anchor.id = 'turnstile-anchor';
    anchor.setAttribute('aria-hidden', 'true');
    anchor.style.cssText =
      'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    document.body.appendChild(anchor);
  }

  turnstileWidgetId = turnstile.render('#turnstile-anchor', {
    sitekey: siteKey,
    size: 'invisible',
    callback: (token) => {
      turnstileToken = token;
    },
  });
}

/** Wait for a one-time token before daily guess POSTs. No-op when Turnstile is disabled. */
async function ensureTurnstileToken() {
  if (!turnstileEnabled()) return;
  if (turnstileToken) return;
  if (turnstileWidgetId == null) {
    await initTurnstile();
  }
  if (turnstileToken) return;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Turnstile timeout')), 15000);
    turnstile.execute(turnstileWidgetId, {
      callback: (token) => {
        clearTimeout(timeout);
        turnstileToken = token;
        resolve();
      },
      'error-callback': () => {
        clearTimeout(timeout);
        reject(new Error('Turnstile challenge failed'));
      },
    });
  });
}

function resetTurnstile() {
  if (turnstileWidgetId != null && globalThis.turnstile) {
    turnstile.reset(turnstileWidgetId);
    turnstileToken = null;
  }
}
