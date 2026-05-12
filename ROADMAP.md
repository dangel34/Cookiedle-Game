# Cookiedle Roadmap

This document tracks planned improvements across features, code quality, performance, and operations. Items are grouped by phase — roughly ordered from lowest-risk/highest-value to more ambitious.

---

## Phase 1 — Foundation & Stability

These are improvements that pay dividends across all future work and carry no risk of breaking the game.

~~### 1.1 Automate Worker Deployment~~ ✅ **Done** — `deploy-worker` job added to `.github/workflows/deploy.yml`. Triggers on changes to `worker.js` or `wrangler.jsonc`; requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets.

---

### 1.2 Rate Limiting on the Worker
**Problem:** The unlimited mode and daily guess endpoints have no rate limiting. A script could brute-force the unlimited mode or spam guesses.

**Solution:** Use Cloudflare's built-in [Rate Limiting rules](https://developers.cloudflare.com/waf/rate-limiting-rules/) on the worker routes, or implement a lightweight token-bucket counter in a Cloudflare KV namespace (keyed by IP). Suggested limits:
- `/unlimited/new` — 60 req/min per IP
- `/guess`, `/guess2`, `/guess3` — 30 req/min per IP

**Effort:** Medium — KV-based approach requires ~30 lines in `worker.js`.

---

~~### 1.3 Health Check Endpoint~~ ✅ **Done** — `GET /health` added to `worker.js`. Returns `{ ok, cookies, date }`.

---

### 1.4 Unit Tests for Worker Token Logic
**Problem:** The HMAC token system is the backbone of cheat prevention. There are zero automated tests — a refactor or typo could silently break hint gating.

**Solution:** Add a test suite using [Vitest](https://vitest.dev/) (works with Cloudflare Worker module syntax). Cover:
- `signToken` / `verifyToken` round-trip
- Token tamper rejection
- Hint gate: 4 wrong guesses → blocked, 5 wrong → allowed
- Daily hash determinism (same date → same cookie index)

**Effort:** Medium — ~150 lines of tests, no changes to production code.

---

## Phase 2 — UX & Accessibility

~~### 2.1 Tutorial / How-to-Play Modal~~ ✅ **Done** — First-visit modal shows an example guess row with color legend and descriptions of all 3 games. `seen_tutorial` localStorage flag prevents re-showing. `? How to Play` button in header re-opens it anytime.

---

~~### 2.2 Countdown Timer to Daily Reset~~ ✅ **Already implemented** — `startHeaderCountdown()` runs in the header; `startNextCookieTimer()` runs in the final victory screen.

---

### 2.3 Accessibility Pass
**Problem:** The game uses color and emoji as its primary feedback mechanism with no ARIA labels or keyboard-only navigation beyond the autocomplete input.

**Solution:**
- Add `aria-label` attributes to all game tiles (e.g., `aria-label="Primary Color: correct"`)
- Add `role="status"` live region for guess result announcements
- Ensure all interactive elements are focusable and keyboard-operable
- Add visible focus rings (currently suppressed by some CSS)

**Effort:** Medium — no logic changes, only HTML/CSS/minimal JS.

---

### 2.4 Improved Share Card
**Problem:** The current share output is plain emoji text. It looks fine in Discord/iMessage but is hard to read without context.

**Solution:** Generate a proper share image client-side using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). The image would show the Cookiedle logo, date, and colored guess tiles for all three games — shareable as a PNG download or `navigator.share()` on mobile.

**Effort:** Large — ~100 lines of canvas code + image assets.

---

~~### 2.5 Guess History Animation~~ ✅ **Already implemented** — `.cell` uses `rotateY(90deg) → rotateY(0deg)` transition; cells stagger via `setTimeout` per index.

---

### 2.6 "Cookie of the Day" Spotlight on Win
**Problem:** After a correct guess the cookie artwork appears, but there's no context — new players may not know who the cookie is.

**Solution:** On win, show a small card below the artwork with the cookie's name, rarity, type, and position. Data is already available from the guess result. Optionally link to noff.gg for more info.

**Effort:** Small — ~15 lines of JS + CSS.

---

## Phase 3 — New Game Content

### 3.1 Game 4 — Cooldown Guesser
**Problem:** Only three daily games means returning players finish quickly.

**Solution:** Add a fourth daily game: display a skill cooldown time (e.g., "12 seconds") and ask the player to identify the cookie. The answer check is binary (correct/wrong). Hints after 5 wrong guesses reveal Rarity and Type.

**Implementation Notes:**
- New endpoint: `GET /cooldown4` (returns cooldown value)
- New endpoint: `POST /guess4`
- New endpoint: `GET /hint4`
- Frontend: new section in `index.html`, handler in `game.js`
- Worker: new daily hash suffix `-cooldown`
- Edge case: multiple cookies share the same cooldown — need to handle ambiguity (either exclude shared cooldowns from the pool, or accept any matching cookie as correct)

**Effort:** Large — significant worker + frontend work, but follows the established Game 2/3 pattern exactly.

---

~~### 3.2 Cookie Collection Tracker~~ ✅ **Done** — After each daily game win, the cookie is added to `localStorage` key `collection`. `🍪 Collection` button in the header (and in the final victory section) opens a modal grid showing all cookies — identified ones in full color, unidentified ones greyed out with a count (`X / Y identified`).

---

### 3.3 Unlimited Mode — Filtered Practice
**Problem:** Unlimited mode picks cookies completely at random, which isn't helpful if a player wants to practice a specific rarity or type.

**Solution:** Add filter chips to the unlimited mode UI: Rarity (Common → Beast), Type (Ambush, Support, etc.). Send selected filters to the worker via `GET /unlimited/new?type=Support&rarity=Epic`. Worker filters the cookie pool before hashing the random index.

**Effort:** Medium — small worker change + UI filter components.

---

### 3.4 Historical Puzzle Archive
**Problem:** New players can't go back and play previous days' puzzles. The daily hash is deterministic, so past answers are computable.

**Solution:** Add a date-picker UI (`/archive?date=2025-12-01`). The worker already computes daily targets from the date string — just pass a `?date=` query param instead of using `today`. Add a localStorage namespace per date so archive progress is saved separately.

**Effort:** Large — requires careful state isolation in frontend to avoid polluting today's localStorage keys.

---

## Phase 4 — Backend & Data Management

### 4.1 Cookie Database in Cloudflare KV
**Problem:** The cookie database is hardcoded in `worker.js`. Adding one new cookie requires editing the JS file and redeploying the entire worker. Worse, reordering cookies shifts all past daily answers (documented in README as a known footgun).

**Solution:** Move the `COOKIES` array into a [Cloudflare KV](https://developers.cloudflare.com/kv/) namespace. The worker reads it at startup (KV reads are ~1ms). To add a cookie: upload a new JSON blob to KV — no redeployment needed. The index-shuffle problem goes away if cookies are keyed by stable ID rather than array position.

**Effort:** Large — requires migrating the daily hash to use stable cookie IDs, updating all comparison logic, and setting up KV bindings.

---

### 4.2 Admin Endpoint for Cookie Management
**Problem:** There's no way to add, edit, or disable cookies without editing source code and deploying.

**Solution:** Add a `POST /admin/cookie` endpoint protected by a separate `ADMIN_SECRET` header (similar to how `COOKIE_SECRET` works). Supports create, update, and soft-delete. Pairs with Phase 4.1 (KV storage). A minimal HTML admin page (`/admin.html`, blocked from robots.txt) would make this usable without a terminal.

**Effort:** Large — depends on Phase 4.1.

---

### 4.3 Privacy-Respecting Analytics
**Problem:** There's no visibility into how many people play, which games they finish, what the average guess count is, or whether new cookies are being identified.

**Solution:** Log aggregated events to [Cloudflare Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/) (free, no PII). Track:
- Game played (1/2/3/unlimited), result (win/loss), guess count, whether hint was used
- No IP, no fingerprint, no cookie name guessed

View results in the Cloudflare dashboard or via the Analytics Engine SQL API.

**Effort:** Medium — ~30 lines in `worker.js`, no frontend changes.

---

### 4.4 Automated Cookie Sync
**Problem:** When new cookies are released in Cookie Run Kingdom, adding them requires manually editing `worker.js`, running the Python scrapers to download images, committing everything, and redeploying. There's no watch or notification mechanism — new cookies are only added when someone notices and does it by hand.

**Solution:** A two-part pipeline:

1. **Scraper cron job** — a scheduled Cloudflare Worker (using [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)) runs daily, fetches the cookie list from noff.gg, and diffs it against the current KV database. New entries are written to a `pending_cookies` KV key for review.

2. **Image pipeline** — the existing Python scripts (`cookie_images_scraper.py`, `cookie_skill_scraper.py`, `make_silhouettes.py`) already handle image downloading. These can be triggered via a GitHub Actions workflow that runs on a schedule (`on: schedule: - cron: '0 6 * * *'`), checks for new images, commits them, and pushes — which then kicks off the existing `deploy-frontend` job.

**Depends on:** Phase 4.1 (KV database) — the scraper needs somewhere to write new cookie data without touching `worker.js`.

**Effort:** Large — cron worker (~50 lines) + scheduled GitHub Actions workflow + wiring the two halves together.

---

## Phase 5 — Progressive Web App (PWA)

### 5.1 Installable PWA
**Problem:** Mobile players must navigate to the URL every day. There's no home screen icon, no offline support, and no push notification capability.

**Solution:**
- Add a `manifest.json` (name, icons, theme color, `display: standalone`)
- Add a Service Worker (`sw.js`) that caches static assets (JS, CSS, images) with a cache-first strategy, and network-first for API calls
- Add `<link rel="manifest">` to all HTML pages
- Generate app icons (192×192, 512×512) from the cookie logo

**Benefit:** Players can "Add to Home Screen" on iOS/Android. Static assets load instantly even offline. Lays groundwork for push notifications (daily puzzle reminder).

**Effort:** Medium — ~80 lines for service worker, ~20 lines for manifest.

---

### 5.2 Daily Reminder Push Notifications
**Problem:** Players forget to check in and streaks break.

**Solution:** After the PWA is installed (Phase 5.1), offer an opt-in "Remind me at [time]" button. Use the [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) with a lightweight push service (e.g., Cloudflare Worker + Web Push library) to send a daily notification when new puzzles go live.

**Effort:** Very Large — requires push subscription management, a database for subscriptions, and a scheduled Cloudflare Worker cron trigger.

---

## Phase 6 — Code Quality

~~### 6.0 SonarQube Analysis~~ ✅ **Done** — SonarCloud Automatic Analysis enabled. `sonar-project.properties` added to root with `sonar.python.version=3.14`. Analysis runs automatically on every push via SonarCloud's GitHub integration — no CI token or workflow needed.

---

~~### 6.1 Deduplicate Game Handlers in Worker~~ ✅ **Done** — Extracted `handleDailyHint()` (shared token verification, 5-wrong gate, hint_used check) and `handleDailyBinaryGuess()` (shared body parsing, token verification, correct check). Games 2 & 3 hint/guess handlers are now thin wrappers. Game 1 kept separate due to `evaluateGuess()` per-trait logic. Analytics (4.3) wired into both shared functions.

---

### 6.2 Shared State Manager for Frontend
**Problem:** `game.js` has many parallel variables (`wrong1`, `wrong2`, `wrong3`, `guesses1`, `guesses2`...) and localStorage keys for each game. Adding Game 4 (Phase 3.1) would require duplicating this pattern again.

**Solution:** Extract a `createGameState(gameId)` factory function that returns a consistent state object with `{ wrong, guesses, solved, stateToken, load(), save() }`. Each game uses its own instance.

**Effort:** Medium — refactor only. The public API of each game section stays identical; only internal variable management changes.

---

### 6.3 ESLint + Prettier
**Problem:** No linting or formatting rules. Inconsistencies accumulate over time and make diffs harder to read.

**Solution:** Add `eslint.config.js` with recommended rules + `prettier` for formatting. Add `npm run lint` and `npm run format` scripts. Optionally enforce via CI (Phase 1.1 GitHub Actions job).

**Effort:** Small — ~30 minutes of config.

---

## Parking Lot (Future Consideration)

These ideas need more design work or have significant tradeoffs:

- **Localization (i18n):** Cookie Run Kingdom has a large global audience. Translating cookie names + UI to Korean, Chinese, and Spanish would meaningfully expand reach. Tricky because cookie names differ between localizations.
- **Leaderboard / Social:** Weekly or monthly streak leaderboards. Requires user accounts (a significant scope jump — authentication, database, privacy policy).
- **Custom Puzzles:** Let players generate a shareable link with a specific cookie. Worker would need to sign a cookie-name-based token. Potential for spoiler abuse.
- **Cookie Comparison Mode:** Pick two cookies and see a side-by-side trait diff. Purely educational, no guessing.
- **TypeScript Migration:** Type safety for both frontend and worker. High upfront cost; pays off at scale or with multiple contributors.

---

## Summary Table

| # | Item | Phase | Effort | Risk | Status |
|---|------|-------|--------|------|--------|
| 1.1 | Automate worker CI/CD | Foundation | Small | Low | ✅ Done |
| 1.2 | Rate limiting | Foundation | Medium | Low | |
| 1.3 | Health check endpoint | Foundation | Trivial | Low | ✅ Done |
| 1.4 | Unit tests for token logic | Foundation | Medium | Low | |
| 2.1 | Tutorial modal | UX | Medium | Low | ✅ Done |
| 2.2 | Countdown timer | UX | Small | Low | ✅ Done |
| 2.3 | Accessibility pass | UX | Medium | Low | |
| 2.4 | Canvas share card | UX | Large | Low | |
| 2.5 | Tile flip animations | UX | Small | Low | ✅ Done |
| 2.6 | Winner spotlight card | UX | Small | Low | |
| 3.1 | Game 4 — Cooldown | Content | Large | Medium | |
| 3.2 | Cookie collection | Content | Medium | Low | ✅ Done |
| 3.3 | Unlimited filters | Content | Medium | Low | |
| 3.4 | Puzzle archive | Content | Large | Medium | |
| 4.1 | KV cookie database | Backend | Large | High | |
| 4.2 | Admin endpoint | Backend | Large | High | |
| 4.3 | Analytics Engine | Backend | Medium | Low | |
| 4.4 | Automated cookie sync | Backend | Large | Medium | |
| 5.1 | PWA / installable | PWA | Medium | Low | |
| 5.2 | Push notifications | PWA | Very Large | High | |
| 6.0 | SonarQube analysis | Quality | Small | Low | ✅ Done |
| 6.1 | Deduplicate worker handlers | Quality | Medium | Low | ✅ Done |
| 6.2 | Frontend state manager | Quality | Medium | Low | |
| 6.3 | ESLint + Prettier | Quality | Small | Low | |
