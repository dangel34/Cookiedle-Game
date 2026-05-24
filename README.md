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
- **Unlimited mode**: endless random rounds with HMAC-signed tokens (expire after 2 hours)
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
- **`deploy.yml`**: on `docs/**` changes — lint on GitHub, rsync to Pi, purge Cloudflare HTML/JS cache
- **`deploy-worker.yml`**: on worker/data/docs changes — unit tests, `wrangler deploy` (worker + assets)

Production API URL is **`/api`** on `cookiedle.nappi.work` (nginx on the Pi proxies to the worker).

Cookie artwork is served from the **Pi** (`/cookie_images/`) in production so CSP stays `img-src 'self'`. Local dev may use the worker URL directly.

The daily target cookies are computed server-side using `SHA-256(date + suffix + COOKIE_SECRET)` where `COOKIE_SECRET` is an encrypted Cloudflare environment variable; it never touches the browser. Each game uses a different suffix (`-skill`, `-silhouette`) to guarantee three distinct daily cookies.

Skill images and silhouettes are served through opaque worker proxy endpoints (`/skill-image`, `/silhouette3-image`) so the cookie filename (which encodes the answer) is never visible in network traffic. The worker reads these images via `env.ASSETS.fetch()` (the `ASSETS` binding declared in `wrangler.jsonc`), reading directly from the asset store with no network subrequest.

---

## 🛠️ Local Development

### Adding cookie images

**1. Install Python dependencies:**
```bash
pip install -r requirements.txt
```

**2. Download cookie artwork from noff.gg:**
```bash
python cookie_images_scraper.py
```
Images are saved to `docs/cookie_images/` as `Cookie_Name.webp`.

**3. Download cookie skill images:**
```bash
python cookie_skill_scraper.py
```
Images are saved to `docs/cookie_skill_images/` as `Cookie_Name.webp`.

**4. Generate silhouettes for Game 3:**
```bash
python make_silhouettes.py
```
Silhouettes are saved to `docs/cookie_silhouettes/` with matching filenames.

**5. Commit all asset folders to the repo** so they are included in the next deployment.

### Updating the cookie database

**1. Edit `data/cookies.json`** to add new cookie entries.

**2. Deploy the worker** (and assets if images changed):
```bash
npm run deploy
```

**3. Push to GitHub:**
```bash
git add .
git commit -m "Add new cookies"
git push origin master
```

> **Note:** Reordering the JSON array changes daily hash results. Prefer appending new cookies at the end.

### Automated deployment (GitHub Actions)

Two workflows run automatically on push to `master`:

**`deploy.yml`** (frontend only, self-hosted Pi runner):
1. Rsyncs `docs/` to `/var/www/cookiedle/` on the Raspberry Pi
2. Purges Cloudflare CDN cache for HTML/JS/CSS so browsers immediately get the new code (images are intentionally left cached)

**`deploy-worker.yml`** (Cloudflare Worker) runs tests then deploys when `worker.js`, `worker/`, `data/`, or `docs/` change:
1. Installs dependencies with `npm ci --ignore-scripts`
2. Runs `npm run deploy` (wrangler) to publish the worker and all `docs/` assets to Cloudflare Workers

#### Required GitHub Actions secrets

| Secret | Used by | Where to get it |
|--------|---------|----------------|
| `CLOUDFLARE_API_TOKEN` | both workflows | Cloudflare Dashboard > My Profile > API Tokens. Needs Zone > Cache Purge (for `deploy.yml`) and Workers Scripts > Edit (for `deploy-worker.yml`) permissions |
| `CF_ZONE_ID` | `deploy.yml` | Cloudflare Dashboard > nappi.work zone > Overview > Zone ID (right sidebar) |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy-worker.yml` | Cloudflare Dashboard > account home > Account ID (right sidebar) |
| `TURNSTILE_SITE_KEY` | `deploy.yml` | Turnstile widget **Site Key** (injected into `index.html` on deploy) |

Set the Turnstile **Secret Key** on the worker manually: `npx wrangler secret put TURNSTILE_SECRET` (not stored in GitHub).

Secrets are passed to shell steps via `env:` variables rather than inline `${{ secrets.* }}` expansion, which prevents accidental injection if a secret value contains shell metacharacters.

**Turnstile test keys** (always pass): site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`. Replace with real keys from the Cloudflare Turnstile dashboard for production.

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
│   ├── deploy.yml          # GitHub Actions: rsync docs/ to Pi + CDN cache purge
│   ├── deploy-worker.yml   # GitHub Actions: wrangler deploy on worker.js / wrangler.jsonc changes
│   └── lint.yml            # GitHub Actions: ESLint + Prettier check on every push and PR
├── worker.js               # Cloudflare Worker (all backend logic)
├── wrangler.jsonc          # Wrangler config (assets directory, bindings)
├── package.json            # npm scripts (deploy)
├── package-lock.json       # Lockfile; commit this
├── cookie_images_scraper.py # Downloads cookie artwork from noff.gg
├── cookie_skill_scraper.py  # Downloads cookie skill images from noff.gg
├── make_silhouettes.py      # Generates black silhouettes from cookie images
├── requirements.txt         # Python dependencies for the scrapers
├── cookies_rows.csv        # Cookie database (source of truth)
├── .gitignore
├── README.md
└── docs/                   # Static frontend (served by Cloudflare + GitHub Pages)
    ├── index.html          # Main web app (3 daily games)
    ├── unlimited.html      # Unlimited mode
    ├── secret.html         # 👀
    ├── shared.js           # Shared JS (WORKER_URL, cookie list, autocomplete)
    ├── game.js             # Daily game logic
    ├── unlimited.js        # Unlimited mode logic
    ├── shared.css          # Shared styles
    ├── game.css            # Daily game styles
    ├── unlimited.css       # Unlimited mode styles
    ├── _headers            # Cloudflare security headers (CSP, X-Frame-Options, etc.)
    ├── robots.txt          # Blocks secret.html from search engines
    ├── cookie_images/      # Cookie artwork (.webp)
    ├── cookie_skill_images/# Skill icons (.webp)
    └── cookie_silhouettes/ # Generated silhouette images (.webp)
```

---

## 🔒 Security

- The daily answer is never sent to the browser unprompted
- All guess checking and hint validation happen server-side in the Cloudflare Worker
- Hints require at least 5 server-verified wrong guesses (signed `state_token`)
- Skill/silhouette images proxied via `env.ASSETS.fetch()` — filenames never exposed to the client
- Unlimited mode uses HMAC-SHA256 tokens; cookie names never leave the server
- `COOKIE_SECRET` (and optional `TURNSTILE_SECRET`) are Cloudflare Worker secrets only
- Production CSP via **`/etc/nginx/snippets/security-headers-cookiedle.conf`** (`connect-src 'self'`, Turnstile allowed)
- Same-origin `/api/` nginx proxy to the worker (configured on the Pi, not in this repo)
- Per-IP rate limits on guess endpoints (worker Cache API)
- Optional Cloudflare Turnstile on daily guesses (`docs/turnstile.js` + meta site key)
- `npm test` — Vitest coverage for token signing and hint progress
- `secret.html` is excluded from search engine indexing via `robots.txt` (not access control)

---

## 🙏 Credits

- Cookie data and artwork sourced from **[noff.gg](https://www.noff.gg/cookie-run-kingdom/cookies)**
- Inspired by **Wordle**, **Loldle**, and **Pokedle**

---

*Made with ❤️, for Rayn, from Derek* 🍪
