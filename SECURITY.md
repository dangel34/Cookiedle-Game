# Security Policy

## Supported Versions

Cookiedle does not use versioned releases. Security fixes are applied directly to the `master` branch and deployed continuously. Only the live deployment at **[cookiedle.nappi.work](https://cookiedle.nappi.work)** is supported.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately by emailing: **cheery.09.purine@icloud.com**

Include as much detail as you can:
- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept (no destructive testing on production, please)
- Affected endpoint(s) or component(s)

You can expect an acknowledgement within **48 hours** and a status update within **7 days**. If the vulnerability is confirmed, a fix will be deployed as soon as possible and you'll be credited in the commit message unless you prefer to remain anonymous.

## Scope

The following are considered in scope:

- **Worker endpoints** (`/guess`, `/hint`, `/unlimited/*`, etc.) - token bypass, hint unlocking without 5 wrong guesses, answer extraction
- **HMAC token forgery** - crafting valid `state_token` or `progress_token` without the secret
- **Rate limiting bypass** - circumventing the per-IP limits on guess endpoints
- **Turnstile bypass** - automated solving of daily puzzles without the bot check
- **Information disclosure** - any path that leaks the daily answer, cookie filename, or `COOKIE_SECRET` to the client

The following are **out of scope**:

- Brute-forcing the daily answer by guessing all cookies (this is by design - the game is finite)
- Self-XSS or attacks that require physical access to the victim's device
- Denial-of-service against Cloudflare infrastructure
- Social engineering
- Issues in third-party dependencies (report those upstream)
- `secret.html` - it's intentionally discoverable
