# Cookiedle 🍪

A daily Cookie Run Kingdom guessing game inspired by Wordle, Loldle, and Pokedle, now fully playable in the browser.

**[▶ Play Now](https://cookiedle.nappi.work)**

---

## 🎮 How to Play

Cookiedle has **three daily game modes** that reset at midnight UTC every day. Complete them in order; each one unlocks after the previous.

### Game 1: Cookie Guesser
Guess the mystery Cookie Run Kingdom cookie. After each guess, tiles reveal how close you are across five traits.

| Color | Meaning |
|-------|---------|
| 🟢 Green | Trait is correct |
| 🟡 Orange | Color exists but is swapped (primary ↔ secondary) |
| 🔴 Red | Trait is wrong |

The five traits revealed per guess are: **Primary Color, Secondary Color, Rarity, Type, Position**

After 5 wrong guesses a **💡 Hint** button unlocks; choose one trait to reveal its answer. On a correct guess, the cookie's artwork is revealed.

### Game 2: Skill Guesser
A skill image and cooldown are shown. Guess which cookie owns that skill. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Rarity, Type, and Position. The cookie's artwork is revealed on a correct guess.

### Game 3: Silhouette
A black silhouette of a cookie is shown. Identify it from its shape alone. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Primary Color, Type, and Rarity. On a correct guess, the silhouette animates away to reveal the full cookie artwork.

### Unlimited Mode
A separate endless mode accessible from the header. Play as many rounds as you want; each round picks a random cookie. Hints are available after 5 wrong guesses.

### Sharing
After completing all three daily games a **Share** button generates a combined emoji grid you can copy and send to friends.

---

## ✨ Features

- **Three daily games**: Cookie Guesser, Skill Guesser, and Silhouette, all secured server-side
- **Cookie artwork**: revealed on every correct guess across all three modes
- **Cheat-proof**: the answer is never in the page source or network traffic; skill and silhouette images are proxied through the worker so filenames never reach the browser
- **Hint system**: server-verified, unlocks after 5 confirmed wrong guesses
- **Fuzzy autocomplete**: smart search as you type
- **Session persistence**: your guesses and revealed images survive page refreshes
- **Streak & stats**: tracks your current streak, best streak, win rate, and avg guesses
- **Cookie collection**: win a game to add that cookie to your collection; view all discovered cookies in the header modal
- **Unlimited mode**: endless random rounds with HMAC-signed tokens (expire after 2 hours)
- **Accessible**: native `<dialog>` modals with focus-trap, ARIA labels on all guess tiles, screen reader live region for guess and victory announcements, visible keyboard focus rings
- **Per-IP rate limiting** on all routes via worker Cache API; rate limits apply before auth checks to prevent admin token brute-force
- **170+ cookies** in the database
- **Mobile friendly**: responsive layout
- **Easter egg**: keep an eye on the bottom right 👀

---

## 🏗️ Architecture

```
Browser
  │
  ├── HTML / JS / CSS ──► Cloudflare CDN ──► Raspberry Pi nginx (/var/www/cookiedle/)
  │   Cookie images (/cookie_images/)         (deployed via GitHub Actions rsync)
  │
  └── API (production) ───► same host /api/* ──► Cloudflare Worker (worker.js)
        /roster              Cookie trait list (cached 1h)
        /guess  /hint        Daily game 1 + signed progress tokens
        /guess2 /hint2       Daily game 2
        /guess3 /hint3       Daily game 3
        /skill-image         Skill art proxy (no filename leak)
        /silhouette3-image   Silhouette proxy
        /unlimited/*         Unlimited mode (HMAC tokens)
```

**Two deployments (GitHub Actions):**
- **`deploy.yml`**: on `docs/**` changes - lint on GitHub, rsync to Pi, purge Cloudflare HTML/JS cache
- **`deploy-worker.yml`**: on worker/data/docs changes - unit tests, `wrangler deploy` (worker + assets)

Production API URL is **`/api`** on `cookiedle.nappi.work` (nginx on the Pi proxies to the worker).

Cookie artwork is served from the **Pi** (`/cookie_images/`) in production so CSP stays `img-src 'self'`. Local dev may use the worker URL directly.

The daily target cookies are computed server-side using `SHA-256(date + suffix + COOKIE_SECRET)` where `COOKIE_SECRET` is an encrypted Cloudflare environment variable; it never touches the browser. Each game uses a different suffix (`-skill`, `-silhouette`) to guarantee three distinct daily cookies.

Skill images and silhouettes are served through opaque worker proxy endpoints (`/skill-image`, `/silhouette3-image`) so the cookie filename (which encodes the answer) is never visible in network traffic. The worker reads these images via `env.ASSETS.fetch()` (the `ASSETS` binding declared in `wrangler.jsonc`), reading directly from the asset store with no network subrequest.

---

## 🛠️ Local Development

### Adding cookie images

**1. Create and activate a Python virtual environment:**
```bash
python -m venv .venv
.venv\Scripts\Activate.ps1   # Windows
# source .venv/bin/activate  # macOS / Linux
```

**2. Install Python dependencies:**
```bash
pip install -r requirements.txt
```

**3. Download cookie artwork from noff.gg:**
```bash
python scripts/cookie_images_scraper.py
```
Images are saved to `docs/cookie_images/` as `Cookie_Name.webp`. Already-downloaded images are skipped automatically.

**4. Download cookie skill images:**
```bash
python scripts/cookie_skill_scraper.py
```
Images are saved to `docs/cookie_skill_images/` as `Cookie_Name.webp`. Already-downloaded images are skipped automatically.

**5. Generate silhouettes for Game 3:**
```bash
python scripts/make_silhouettes.py
```
Silhouettes are saved to `docs/cookie_silhouettes/` with matching filenames. Already-generated silhouettes are skipped automatically.

**6. Commit all asset folders to the repo** so they are included in the next deployment.

### Updating the cookie database

There are two ways to add or edit cookies. Use whichever fits your workflow.

**Option A: Admin panel (recommended for live edits)**

1. Open `https://cookiedle.nappi.work/admin.html` and log in with your `ADMIN_SECRET`.
2. Use the Add / Edit / Delete controls to manage cookies. Changes write directly to KV.
3. Run the "Sync cookies.json from KV" GitHub Actions workflow (`sync-cookies-kv.yml`) to pull the updated data back into `data/cookies.json` in the repo.

**Option B: Edit the JSON directly**

1. Edit `data/cookies.json` to add or update entries.
2. Push to GitHub. The `deploy-worker.yml` workflow redeploys the worker and seeds KV on the next request.

> **Note:** Reordering the `data/cookies.json` array changes daily hash results. Always append new cookies at the end.

### Automated deployment (GitHub Actions)

Three workflows run automatically on push to `master`:

**`deploy.yml`** (frontend only, self-hosted Pi runner):
1. Rsyncs `docs/` to `/var/www/cookiedle/` on the Raspberry Pi
2. Purges Cloudflare CDN cache for HTML/JS/CSS so browsers immediately get the new code (images are intentionally left cached)

**`deploy-worker.yml`** (Cloudflare Worker) runs tests then deploys when `worker.js`, `worker/`, `data/`, or `docs/` change:
1. Installs dependencies with `npm ci --ignore-scripts`
2. Runs `npm run deploy` (wrangler) to publish the worker and all `docs/` assets to Cloudflare Workers

**`sync-cookies-kv.yml`** (manual only, `workflow_dispatch`):
1. Fetches the live `cookies` key from KV via the Cloudflare REST API
2. Writes it to `data/cookies.json` and commits with `[skip ci]` if the content changed
3. Use this after making changes in the admin panel to keep the repo in sync

#### Required GitHub Actions secrets

| Secret | Used by | Where to get it |
|--------|---------|----------------|
| `CLOUDFLARE_API_TOKEN` | all three workflows | Cloudflare Dashboard > My Profile > API Tokens. Needs Zone > Cache Purge (for `deploy.yml`) and Workers Scripts > Edit (for `deploy-worker.yml` and `sync-cookies-kv.yml`) permissions |
| `CF_ZONE_ID` | `deploy.yml` | Cloudflare Dashboard > nappi.work zone > Overview > Zone ID (right sidebar) |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy-worker.yml`, `sync-cookies-kv.yml` | Cloudflare Dashboard > account home > Account ID (right sidebar) |

Secrets are passed to shell steps via `env:` variables rather than inline `${{ secrets.* }}` expansion, which prevents accidental injection if a secret value contains shell metacharacters.

Set worker-only secrets with wrangler (not stored in GitHub):
```bash
npx wrangler secret put COOKIE_SECRET   # required - daily hash salt
npx wrangler secret put ADMIN_SECRET    # optional - admin panel access
```

### First-time setup
```bash
npm install
npx wrangler login   # opens browser to authenticate with Cloudflare
npm run deploy
```

### Deploying with Wrangler (Worker + assets)

This project uses Wrangler with an `ASSETS` binding (configured in `wrangler.jsonc`) so a deploy publishes both:
- `worker.js` (backend logic)
- `docs/` (static frontend and images)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Log in to Cloudflare**
   ```bash
   npx wrangler login
   ```
3. **Set your worker secret** (first time, and any time you rotate it)
   ```bash
   npx wrangler secret put COOKIE_SECRET
   ```
4. **Deploy**
   ```bash
   npm run deploy
   ```
5. **Verify quickly**
   - Open your worker URL and check the app loads.
   - Try one guess in Daily and Unlimited to confirm API + asset proxy paths are healthy.

### Endpoint state/progress tokens (security model)

Hint unlocks are server-enforced using signed tokens; clients cannot fake wrong-guess progress.

- **Daily Game 1**
  - `POST /guess` accepts `{ guess, state_token }` and returns updated `state_token`
  - `GET /hint?trait=...&state_token=...` requires server-verified `wrong >= 5`
- **Daily Game 2**
  - `POST /guess2` accepts `{ guess, state_token }` and returns updated `state_token`
  - `GET /hint2?state_token=...` requires server-verified `wrong >= 5`
- **Daily Game 3**
  - `POST /guess3` accepts `{ guess, state_token }` and returns updated `state_token`
  - `GET /hint3?state_token=...` requires server-verified `wrong >= 5`
- **Unlimited**
  - `GET /unlimited/new` returns `{ token, progress_token }`
  - `POST /unlimited/guess` accepts `{ token, progress_token, guess }` and returns updated `progress_token`
  - `POST /unlimited/hint` accepts `{ token, progress_token, trait }`; requires server-verified `wrong >= 5`

If frontend and worker versions are out of sync, users may see token errors. Deploy `worker.js` and `docs/` together.

---

## 📁 File Structure

```
Cookiedle-Game/
├── .github/workflows/
│   ├── deploy.yml            # rsync docs/ to Pi + CDN cache purge
│   ├── deploy-worker.yml     # wrangler deploy on worker/data/docs changes
│   ├── lint.yml              # ESLint + Prettier on every push and PR
│   └── sync-cookies-kv.yml  # manual: pull KV into data/cookies.json
├── worker.js                 # Cloudflare Worker entry point (routing, game logic)
├── worker/
│   ├── admin.js              # Admin CRUD endpoints (GET/POST/PUT/DELETE /admin/cookies)
│   ├── analytics.js          # Privacy-respecting event logging (Cloudflare Analytics Engine)
│   ├── cookies-kv.js         # KV read/write with in-process cache and JSON fallback
│   ├── cors.js               # CORS headers + jsonResponse helper
│   ├── crypto.js             # HMAC token sign/verify (unlimited + daily progress tokens)
│   ├── daily.js              # Deterministic daily target via SHA-256(date + suffix + secret)
│   ├── rate-limit.js         # Sliding-window per-IP rate limiting via Cache API
│   ├── sanitize.js           # Input sanitization
│   ├── crypto.test.js        # Vitest: token round-trip, tamper, TTL, hint gate
│   └── daily.test.js         # Vitest: daily target determinism
├── data/
│   └── cookies.json          # Cookie database (fallback + seed source; append-only)
├── scripts/
│   ├── cookie_images_scraper.py  # Downloads cookie artwork from noff.gg
│   ├── cookie_skill_scraper.py   # Downloads skill icons from noff.gg
│   └── make_silhouettes.py       # Generates silhouettes from cookie artwork
├── nginx/
│   ├── security-headers-cookiedle.conf  # CSP, X-Frame-Options, etc.
│   └── cookiedle-rewrites.conf          # URL rewrite rules (e.g. /archive redirect)
├── wrangler.jsonc            # Wrangler config (assets binding, KV namespace)
├── package.json              # npm scripts (deploy, lint, format, test)
├── requirements.txt          # Python deps for scrapers
├── .gitignore
├── README.md
├── ROADMAP.md
└── docs/                     # Static frontend (Cloudflare CDN + Pi nginx)
    ├── index.html            # Main daily game page (3 games)
    ├── unlimited.html        # Unlimited mode
    ├── archive.html          # Historical puzzle archive (/archive?date=YYYY-MM-DD)
    ├── admin.html            # Cookie database admin panel (requires ADMIN_SECRET)
    ├── secret.html           # 👀
    ├── shared.js             # WORKER_URL, COOKIES array, autocomplete, toast helpers
    ├── game.js               # Daily game logic (all 3 games, session, share card)
    ├── unlimited.js          # Unlimited mode logic
    ├── admin.js              # Admin panel logic
    ├── shared.css            # Global styles (variables, sr-only, focus ring)
    ├── game.css              # Daily game styles
    ├── unlimited.css         # Unlimited mode styles
    ├── _headers              # Cloudflare security headers
    ├── robots.txt            # Blocks secret.html from search engines
    ├── manifest.json         # PWA manifest
    ├── sw.js                 # Service worker (cache-first for app shell)
    ├── cookie_images/        # Cookie artwork (.webp)
    ├── cookie_skill_images/  # Skill icons (.webp)
    ├── cookie_silhouettes/   # Generated silhouettes (.webp)
    ├── icons/                # PWA icons (192px, 512px)
    └── fonts/                # Nunito font (woff2)
```

---

## 🔒 Security

- The daily answer is never sent to the browser unprompted
- All guess checking and hint validation happen server-side in the Cloudflare Worker
- Hints require at least 5 server-verified wrong guesses (signed `state_token`)
- Skill/silhouette images proxied via `env.ASSETS.fetch()` - filenames never exposed to the client
- Unlimited mode uses HMAC-SHA256 tokens; cookie names never leave the server
- `COOKIE_SECRET` and `ADMIN_SECRET` are Cloudflare Worker secrets only, never in the repo
- Admin endpoints (`/admin/*`) are rate-limited before the auth check, so token brute-force is capped at 10-20 attempts per minute per IP
- Production CSP via `/etc/nginx/snippets/security-headers-cookiedle.conf` (`connect-src 'self'`)
- Same-origin `/api/` nginx proxy to the worker (configured on the Pi, not in this repo)
- Per-IP rate limits on all routes via worker Cache API
- `npm test` runs Vitest coverage for token signing and hint progress
- `secret.html` is excluded from search engine indexing via `robots.txt` (not access control)

---

## 🙏 Credits

- Cookie data and artwork sourced from **[noff.gg](https://www.noff.gg/cookie-run-kingdom/cookies)**
- Inspired by **Wordle**, **Loldle**, and **Pokedle**

---

*Made with ❤️, for Rayn, from Derek* 🍪
