/**
 * Injects TURNSTILE_SITE_KEY into docs/index.html before frontend deploy.
 * Usage: TURNSTILE_SITE_KEY=xxx node scripts/inject-turnstile-site-key.mjs
 */
import fs from 'fs';

const key = (process.env.TURNSTILE_SITE_KEY || '').trim();
const path = 'docs/index.html';
let html = fs.readFileSync(path, 'utf8');

const metaRe = /<meta name="turnstile-site-key" content="[^"]*" \/>/;
if (!metaRe.test(html)) {
  console.error('turnstile-site-key meta tag not found in index.html');
  process.exit(1);
}

html = html.replace(metaRe, `<meta name="turnstile-site-key" content="${key.replace(/"/g, '')}" />`);
fs.writeFileSync(path, html);
console.log(key ? 'Turnstile site key injected.' : 'Turnstile site key cleared (empty).');
