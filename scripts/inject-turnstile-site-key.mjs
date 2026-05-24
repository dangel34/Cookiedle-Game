/**
 * Injects TURNSTILE_SITE_KEY into HTML files before frontend deploy.
 * Usage: TURNSTILE_SITE_KEY=xxx node scripts/inject-turnstile-site-key.mjs
 */
import fs from 'node:fs';

const key = (process.env.TURNSTILE_SITE_KEY || '').trim();

// Allowlist only characters that appear in real Turnstile site keys (alphanumeric + _ -).
// This prevents any HTML injection if the secret is ever misconfigured.
const safeKey = key.replaceAll(/[^a-zA-Z0-9_-]/g, '');

const metaRe = /<meta name="turnstile-site-key" content="[^"]*" \/>/;
const replacement = `<meta name="turnstile-site-key" content="${safeKey}" />`;

function injectKey(path) {
  let html = fs.readFileSync(path, 'utf8');
  if (!metaRe.test(html)) {
    console.error(`turnstile-site-key meta tag not found in ${path}`);
    process.exit(1);
  }
  fs.writeFileSync(path, html.replace(metaRe, replacement));
}

injectKey('docs/index.html');
injectKey('docs/unlimited.html');
console.log(key ? 'Turnstile site key injected.' : 'Turnstile site key cleared (empty).');
