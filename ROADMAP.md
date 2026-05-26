# Cookiedle Roadmap

This document tracks planned improvements across features, code quality, performance, and operations. Items are grouped by phase, roughly ordered from lowest-risk/highest-value to more ambitious.

---

## Phase 1: Foundation & Stability

These are improvements that pay dividends across all future work and carry no risk of breaking the game.

~~### 1.1 Automate Worker Deployment~~ ✅ **Done** - Separate `deploy-worker.yml` workflow triggers on changes to `worker.js` or `wrangler.jsonc`. Runs `npm ci --ignore-scripts` then `npm run deploy` (uses the exact wrangler version from `package-lock.json`). Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets, both injected via `env:` variables rather than inline secret expansion.

---

~~### 1.2 Bot Protection (Cloudflare Turnstile)~~ ✅ **Done** - Explicit render API (`turnstile.render()`) used to eliminate the previous race condition. `docs/turnstile.js` handles lazy script loading, widget render, token capture, and reset after each guess. `ensureTurnstileToken()` / `resetTurnstile()` called in `game.js` and `unlimited.js` around every guess POST. Worker verifies via `worker/turnstile.js` → Cloudflare siteverify. Disabled gracefully when `TURNSTILE_SITE_KEY` meta tag is empty (local dev).

---

~~### 1.3 Rate Limiting on the Worker~~ ✅ **Done** - Sliding-window counter via Cache API (no KV required). `worker/rate-limit.js` defines per-route limits (e.g. `/guess` 30/min, `/unlimited/new` 60/min, `/daily-state` 30/hr). `checkRateLimit()` called in the main fetch handler before route dispatch; returns 429 on breach. Known limitation: read-check-write is non-atomic, so burst over-allowance equals truly concurrent requests - acceptable without Durable Objects.

---

~~### 1.3 Health Check Endpoint~~ ✅ **Done** - `GET /health` added to `worker.js`. Returns `{ ok, cookies, date }`.

---

~~### 1.4 Unit Tests for Worker Token Logic~~ ✅ **Done** - `worker/crypto.test.js` with Vitest covers: `signMessage` determinism, `makeToken`/`verifyAndDecodeToken` round-trip, tamper rejection, out-of-range index rejection, progress token round-trip, hint gate (4 wrong → blocked, 5 wrong → allowed), and empty/null token rejection.

---

## Phase 2: UX & Accessibility

~~### 2.1 Tutorial / How-to-Play Modal~~ ✅ **Done** - First-visit modal shows an example guess row with color legend and descriptions of all 3 games. `seen_tutorial` localStorage flag prevents re-showing. `? How to Play` button in header re-opens it anytime.

---

~~### 2.2 Countdown Timer to Daily Reset~~ ✅ **Already implemented** - `startHeaderCountdown()` runs in the header; `startNextCookieTimer()` runs in the final victory screen.

---

~~### 2.3 Accessibility Pass~~ ✅ **Done** - All three modals converted from `<div role="dialog">` to native `<dialog>` elements (built-in focus-trap, Escape-to-close, `::backdrop`; manual Escape keydown handler removed). `aria-label` added to all three guess inputs and all modal close buttons. Every guess tile gets a descriptive `aria-label` (e.g. `"Primary: Brown - correct"`), falling back to index-based labels for restored localStorage data. `<output>` live region announces guess summaries and victory to screen readers. Game 2/3 emoji icons marked `aria-hidden="true"` to avoid double-reading. `.sr-only` utility class and global `:focus-visible` ring (3px accent outline) added to `shared.css`.

---

~~### 2.4 Improved Share Card~~ ✅ **Done** - `generateShareCanvas()` in `game.js` draws a 420px PNG card: accent gradient bar, Princess Cookie logo + "Cookiedle" + date in the header, one section per active game (Game 1: 5 coloured trait cells per row in green/orange/red; Games 2 & 3: green/red indicator squares), hint-used marker (`💡`) injected at the right row via `withHint()`, footer with streak and URL. `shareResults()` calls `navigator.share({ files })` on mobile (native share sheet) and falls back to downloading the PNG on desktop. "Share Results 📋" button updated to 🖼️. Old clipboard text share removed.

---

~~### 2.5 Guess History Animation~~ ✅ **Already implemented** - `.cell` uses `rotateY(90deg) → rotateY(0deg)` transition; cells stagger via `setTimeout` per index.

---

~~### 2.6 "Cookie of the Day" Spotlight on Win~~ ✅ **Done** - On win, `showVictory()` in `game.js` renders rarity, type, and position as `spotlight-chip` elements below the cookie artwork. Data pulled from the `COOKIES` array client-side by `cookie_name`.

---

## Phase 3: New Game Content

### ~~3.1 Game 4: Cooldown Guesser~~ ❌ **Dropped** - Too ambiguous: 29 cookies share a 12-second cooldown, 43 share 15 seconds. Guessing a cooldown value is not a meaningful puzzle. Moved to parking lot.

---

~~### 3.2 Cookie Collection Tracker~~ ✅ **Done** - After each daily game win, the cookie is added to `localStorage` key `collection`. `🍪 Collection` button in the header (and in the final victory section) opens a modal grid showing all cookies; identified ones in full color, unidentified ones as a CSS placeholder (no image loaded). Count shown as `X / Y identified`. **503 fix:** unidentified cookie images are no longer fetched at all - only found cookies load lazily via IntersectionObserver, eliminating burst-request 503s on modal open.

---

~~### 3.3 Unlimited Mode: Filtered Practice~~ ✅ **Done** - Two `<select>` dropdowns (Rarity, Type) added between the round counter and the guess input in `unlimited.html`. On "New Cookie", `fetchNewToken` appends `?rarity=&type=` query params. Worker builds `filteredIndices` from `COOKIES`, picks one via `unbiasedRandomIndex`, and returns 400 if the combination is empty. A "(applies next round)" note appears when a filter is changed mid-game. On 400/network error, the input stays disabled with a prompt to adjust filters rather than leaving `token = null` in a broken guessable state.

---

~~### 3.4 Historical Puzzle Archive~~ ✅ **Done** - `/archive?date=YYYY-MM-DD` page plays any past daily puzzle. Worker accepts `?date=YYYY-M-D` query param (validated: not future, not before 2024), passes the date override to `getDailyTarget*` so the same deterministic hash runs for any date. `game.js` detects archive mode via `IS_ARCHIVE`/`ARCHIVE_DATE` constants; uses `cookiedle-archive-{date}` as the localStorage key so archive plays are isolated from today's state. All API calls routed through `api(path)` helper that appends `?date=` in archive mode. Guards: `recordCompletion`, `startNextCookieTimer`, and tutorial auto-show are skipped for archive plays; collection still populates normally. Archive bar shows ←/→ day navigation and a date picker. Bare `/archive` redirects to yesterday.

---

## Phase 4: Backend & Data Management

### 4.1 Cookie Database in Cloudflare KV
**Problem:** The cookie database is hardcoded in `worker.js`. Adding one new cookie requires editing the JS file and redeploying the entire worker. Worse, reordering cookies shifts all past daily answers (documented in README as a known footgun).

**Solution:** Move the `COOKIES` array into a [Cloudflare KV](https://developers.cloudflare.com/kv/) namespace. The worker reads it at startup (KV reads are ~1ms). To add a cookie: upload a new JSON blob to KV; no redeployment needed. The index-shuffle problem goes away if cookies are keyed by stable ID rather than array position.

**Effort:** Large - requires migrating the daily hash to use stable cookie IDs, updating all comparison logic, and setting up KV bindings.

---

### 4.2 Admin Endpoint for Cookie Management
**Problem:** There's no way to add, edit, or disable cookies without editing source code and deploying.

**Solution:** Add a `POST /admin/cookie` endpoint protected by a separate `ADMIN_SECRET` header (similar to how `COOKIE_SECRET` works). Supports create, update, and soft-delete. Pairs with Phase 4.1 (KV storage). A minimal HTML admin page (`/admin.html`, blocked from robots.txt) would make this usable without a terminal.

**Effort:** Large - depends on Phase 4.1.

---

~~### 4.3 Privacy-Respecting Analytics~~ ✅ **Done** - `worker/analytics.js` exports `logEvent(env, { game, outcome, wrong_count, hint_used })`. Called fire-and-forget after every guess in `handleGuess1`, `handleDailyBinaryGuess` (covers games 2 & 3), and `handleUnlimitedGuess`. No IP, no cookie names, no fingerprints. Query example: `SELECT blob1 AS game, blob2 AS outcome, SUM(_sample_interval) AS count FROM cookiedle_events WHERE timestamp > NOW() - INTERVAL '7' DAY GROUP BY game, outcome`. **Activation:** Analytics Engine must be enabled in the Cloudflare dashboard before adding the `analytics_engine_datasets` binding back to `wrangler.jsonc` — until then, `env.ANALYTICS?.writeDataPoint` silently no-ops.

---

### 4.4 Automated Cookie Sync
**Problem:** When new cookies are released in Cookie Run Kingdom, adding them requires manually editing `worker.js`, running the Python scrapers to download images, committing everything, and redeploying. There's no watch or notification mechanism; new cookies are only added when someone notices and does it by hand.

**Solution:** A two-part pipeline:

1. **Scraper cron job** - a scheduled Cloudflare Worker (using [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)) runs daily, fetches the cookie list from noff.gg, and diffs it against the current KV database. New entries are written to a `pending_cookies` KV key for review.

2. **Image pipeline** - the existing Python scripts (`cookie_images_scraper.py`, `cookie_skill_scraper.py`, `make_silhouettes.py`) already handle image downloading. These can be triggered via a GitHub Actions workflow that runs on a schedule (`on: schedule: - cron: '0 6 * * *'`), checks for new images, commits them, and pushes, which then kicks off the existing `deploy-frontend` job.

**Depends on:** Phase 4.1 (KV database); the scraper needs somewhere to write new cookie data without touching `worker.js`.

**Effort:** Large - cron worker (~50 lines) + scheduled GitHub Actions workflow + wiring the two halves together.

---

## Phase 5: Progressive Web App (PWA)

~~### 5.1 Installable PWA~~ ✅ **Done** - `docs/manifest.json` (name, short_name, standalone display, `#1a1a2e` theme/background, 192×192 + 512×512 PNG icons). `docs/sw.js`: install pre-caches the app shell (HTML, CSS, JS, manifest, icons); activate purges old caches; fetch uses cache-first for all same-origin non-API requests, passes API calls (`/guess`, `/hint`, `/daily-state`, etc.) straight to the network. SW registered in `shared.js` so it runs on every page. `<link rel="manifest">`, `<meta name="theme-color">`, and `<link rel="apple-touch-icon">` added to `index.html` and `unlimited.html`. Icons generated from `Princess_Cookie.webp` via Pillow into `docs/icons/`.

---

### 5.2 Daily Reminder Push Notifications
**Problem:** Players forget to check in and streaks break.

**Solution:** After the PWA is installed (Phase 5.1), offer an opt-in "Remind me at [time]" button. Use the [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) with a lightweight push service (e.g., Cloudflare Worker + Web Push library) to send a daily notification when new puzzles go live.

**Effort:** Very Large - requires push subscription management, a database for subscriptions, and a scheduled Cloudflare Worker cron trigger.

---

## Phase 6: Code Quality

~~### 6.0 SonarQube Analysis~~ ✅ **Done** - SonarCloud Automatic Analysis enabled. `sonar-project.properties` added to root with `sonar.python.version=3.14`. Analysis runs automatically on every push via SonarCloud's GitHub integration; no CI token or workflow needed. Outstanding issues addressed: S5852 ReDoS hotspot marked SAFE (simple negated character class, no backtracking); S4158 false positive in `shared.js` suppressed with `// NOSONAR` (COOKIES is populated before user interaction); S3776 cognitive complexity resolved by Turnstile removal; dead `origin` parameter removed from all 29 `jsonResponse` call sites in `worker.js`.

---

~~### 6.1 Deduplicate Game Handlers in Worker~~ ✅ **Done** - Extracted `handleDailyHint()` (shared token verification, 5-wrong gate, hint_used check) and `handleDailyBinaryGuess()` (shared body parsing, token verification, correct check). Games 2 & 3 hint/guess handlers are now thin wrappers. Game 1 kept separate due to `evaluateGuess()` per-trait logic.

~~### 6.4 Fix Skill & Silhouette Image Proxy~~ ✅ **Done** - `handleSkillImage` and `handleSilhouette3Image` were using `fetch(new URL(..., request.url))` which re-entered the worker's own fetch handler and returned a JSON 404. Fixed by switching to `env.ASSETS.fetch()` with `"binding": "ASSETS"` declared in `wrangler.jsonc`, reading directly from the asset store with no network round-trip.

~~### 6.5 Fix "Got it!" Button Click Registration~~ ✅ **Done** - The tutorial modal's "Got it!" button has class `submit-btn`, which applies `position: absolute; transform: translateY(-50%)`. The `.tutorial-got-it` override correctly resets this at rest (`position: static; transform: none`), but `.submit-btn:active` (specificity 0,2,0) won out over `.tutorial-got-it` (0,1,0) on mousedown, sliding the button upward mid-press so the click never registered. Fixed by adding `.tutorial-got-it:active { transform: scale(0.96); }` to match the active-state specificity.

---

~~### 6.2 Shared State Manager for Frontend~~ ✅ **Done** - `createGameState(saved)` factory added to `game.js`. Returns `{ started, guesses, won, hintUsed, hintValue, hintAfterGuess, victoryName, stateToken, wrongCount (getter) }`. Games 2 & 3 now use `const g2 = createGameState(...)` / `const g3 = createGameState(...)` instead of 16 scattered `let` variables. `saveState()` serializes from the objects back to the original flat key names for full localStorage backward compatibility. Game 1 kept as-is (trait-grid hints and `results` object are genuinely different). Game 4 can be wired in with one `createGameState()` call.

---

~~### 6.3 ESLint + Prettier~~ ✅ **Done** - `eslint.config.js` and `.prettierrc` added. `npm run lint` (ESLint) and `npm run format` / `npm run format:check` (Prettier) scripts in `package.json`. Enforced in CI via the `deploy-frontend` workflow.

---

## Parking Lot (Future Consideration)

These ideas need more design work or have significant tradeoffs:

- **Localization (i18n):** Cookie Run Kingdom has a large global audience. Translating cookie names + UI to Korean, Chinese, and Spanish would meaningfully expand reach. Tricky because cookie names differ between localizations.
- **Leaderboard / Social:** Weekly or monthly streak leaderboards. Requires user accounts (a significant scope jump: authentication, database, privacy policy).
- **Custom Puzzles:** Let players generate a shareable link with a specific cookie. Worker would need to sign a cookie-name-based token. Potential for spoiler abuse.
- **Cookie Comparison Mode:** Pick two cookies and see a side-by-side trait diff. Purely educational, no guessing.
- **TypeScript Migration:** Type safety for both frontend and worker. High upfront cost; pays off at scale or with multiple contributors.

---

## Summary Table

| # | Item | Phase | Effort | Risk | Status |
|---|------|-------|--------|------|--------|
| 1.1 | Automate worker CI/CD | Foundation | Small | Low | ✅ Done |
| 1.2 | Bot protection (Turnstile) | Foundation | Small | Low | ✅ Done |
| 1.3 | Rate limiting | Foundation | Medium | Low | ✅ Done |
| 1.4 | Health check endpoint | Foundation | Trivial | Low | ✅ Done |
| 1.5 | Unit tests for token logic | Foundation | Medium | Low | ✅ Done |
| 2.1 | Tutorial modal | UX | Medium | Low | ✅ Done |
| 2.2 | Countdown timer | UX | Small | Low | ✅ Done |
| 2.3 | Accessibility pass | UX | Medium | Low | ✅ Done |
| 2.4 | Canvas share card | UX | Large | Low | ✅ Done |
| 2.5 | Tile flip animations | UX | Small | Low | ✅ Done |
| 2.6 | Winner spotlight card | UX | Small | Low | ✅ Done |
| 3.1 | Game 4: Cooldown | Content | Large | Medium | |
| 3.2 | Cookie collection | Content | Medium | Low | ✅ Done |
| 3.3 | Unlimited filters | Content | Medium | Low | ✅ Done |
| 3.4 | Puzzle archive | Content | Large | Medium | ✅ Done |
| 4.1 | KV cookie database | Backend | Large | High | |
| 4.2 | Admin endpoint | Backend | Large | High | |
| 4.3 | Analytics Engine | Backend | Medium | Low | ✅ Done (needs CF dashboard activation) |
| 4.4 | Automated cookie sync | Backend | Large | Medium | |
| 5.1 | PWA / installable | PWA | Medium | Low | |
| 5.2 | Push notifications | PWA | Very Large | High | |
| 6.0 | SonarQube analysis + cleanup | Quality | Small | Low | ✅ Done |
| 6.1 | Deduplicate worker handlers | Quality | Medium | Low | ✅ Done |
| 6.2 | Frontend state manager | Quality | Medium | Low | |
| 6.3 | ESLint + Prettier | Quality | Small | Low | ✅ Done |
| 6.4 | Fix skill/silhouette image proxy | Quality | Small | Low | ✅ Done |
| 6.5 | Fix tutorial "Got it!" click | Quality | Trivial | Low | ✅ Done |
