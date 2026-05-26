import fs from 'node:fs';

if (!fs.existsSync('worker-body.tmp.js')) {
  console.error(
    'Error: worker-body.tmp.js not found.\n' +
    'This is a legacy build script that requires an intermediate temp file.\n' +
    'Edit worker.js directly instead of running this script.'
  );
  process.exit(1);
}

let b = fs.readFileSync('worker-body.tmp.js', 'utf8');

b = b.replace(
  /\/\/ ─+\n\/\/ DAILY TARGET[\s\S]*?return COOKIES\[hashInt % COOKIES\.length\];\n}\n\n/,
  ''
);
b = b.replace(/\/\/ ─+\n\/\/ CORS HEADERS[\s\S]*?function jsonResponse[\s\S]*?^}\n\n/m, '');
b = b.replace(/\/\/ ─+\n\/\/ HMAC HELPERS[\s\S]*?^}\n\n\/\/ Input sanitization[\s\S]*?^}\n/m, '');

b = b.replace(/\bgetDailyTarget\(/g, 'getDailyTarget(COOKIES, ');
b = b.replace(/\bgetDailyTarget2\(/g, 'getDailyTarget2(COOKIES, ');
b = b.replace(/\bgetDailyTarget3\(/g, 'getDailyTarget3(COOKIES, ');
b = b.replace(
  /verifyAndDecodeToken\(([^,]+), env\.COOKIE_SECRET\)/g,
  'verifyAndDecodeToken($1, env.COOKIE_SECRET, COOKIES.length)'
);
b = b.replace(/\bjsonResponse\(/g, 'jsonResponse(activeRequest, ');
b = b.replace(/\bcorsHeaders\(\)/g, 'corsHeaders(activeRequest)');
b = b.replace(/function handleCookies\(\)/, 'function handleRoster()');
b = b.replace(
  /return jsonResponse\(activeRequest, COOKIES\);/,
  `return new Response(JSON.stringify(COOKIES), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      ...corsHeaders(activeRequest),
    },
  });`
);
b = b.replace(
  /'GET \/cookies', handleCookies/,
  "'GET /roster', handleRoster,\n  ['GET /cookies', handleRoster]"
);

const header = `// worker.js - Cloudflare Worker entry
import COOKIES from './data/cookies.json';
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

let activeRequest = null;

`;

const fetchBlock = b.slice(b.indexOf('export default'));
const fetchPatched = fetchBlock.replace(
  'async fetch(request, env) {',
  `async fetch(request, env) {
      activeRequest = request;`
).replace(
  'const handler = ROUTES.get',
  `const routeKey = \`\${request.method} \${url.pathname}\`;
      const rateCfg = rateLimitConfig(request.method, url.pathname);
      if (rateCfg) {
        const allowed = await checkRateLimit(request, routeKey);
        if (!allowed) {
          return jsonResponse(request, { error: 'Too many requests - slow down.' }, 429);
        }
      }

      const handler = ROUTES.get`
);

const out = header + b.slice(0, b.indexOf('export default')) + fetchPatched;
fs.writeFileSync('worker.js', out);
console.log('worker.js written,', out.split('\\n').length, 'lines');
