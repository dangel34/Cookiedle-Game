# Cookiedle 🍪

A daily Cookie Run Kingdom guessing game inspired by Wordle, Loldle, and Pokedle — now fully playable in the browser.

**[▶ Play Now](https://dangel34.github.io/Cookiedle-Game)**

---

## 🎮 How to Play

Cookiedle has **three daily game modes** that reset at midnight UTC every day. Complete them in order — each one unlocks after the previous.

### Game 1 — Cookie Guesser
Guess the mystery Cookie Run Kingdom cookie. After each guess, tiles reveal how close you are across five traits.

| Color | Meaning |
|-------|---------|
| 🟢 Green | Trait is correct |
| 🟡 Orange | Color exists but is swapped (primary ↔ secondary) |
| 🔴 Red | Trait is wrong |

The five traits revealed per guess are: **Primary Color, Secondary Color, Rarity, Type, Position**

After 5 wrong guesses a **💡 Hint** button unlocks — choose one trait to reveal its answer. On a correct guess, the cookie's artwork is revealed.

### Game 2 — Skill Guesser
A skill image and cooldown are shown — guess which cookie owns that skill. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Rarity, Type, and Position. The cookie's artwork is revealed on a correct guess.

### Game 3 — Silhouette
A black silhouette of a cookie is shown — identify it from its shape alone. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Primary Color, Type, and Rarity. On a correct guess, the silhouette animates away to reveal the full cookie artwork.

### Unlimited Mode
A separate endless mode accessible from the header. Play as many rounds as you want — each round picks a random cookie. Hints are available after 5 wrong guesses.

### Sharing
After completing all three daily games a **Share** button generates a combined emoji grid you can copy and send to friends.

---

## ✨ Features

- **Three daily games** — Cookie Guesser, Skill Guesser, and Silhouette — all secured server-side
- **Cookie artwork** — revealed on every correct guess across all three modes
- **Cheat-proof** — the answer is never in the page source or network traffic; skill and silhouette images are proxied through the worker so filenames never reach the browser
- **Hint system** — server-verified, unlocks after 5 confirmed wrong guesses
- **Fuzzy autocomplete** — smart search as you type
- **Session persistence** — your guesses and revealed images survive page refreshes
- **Streak & stats** — tracks your current streak, best streak, win rate, and avg guesses
- **Unlimited mode** — endless random rounds with HMAC-signed tokens (expire after 2 hours)
- **170+ cookies** in the database
- **Mobile friendly** — responsive layout
- **Easter egg** — keep an eye on the bottom right 👀

---

## 🏗️ Architecture

```
Browser                            Cloudflare Worker (worker.js)
──────────────────────────         ──────────────────────────────
Static frontend (docs/)            Secure backend + asset proxy
- Autocomplete UI                  - Daily cookie selection (SHA-256 hash)
- Guess rendering                  - Guess checking & hint validation
- Session state (localStorage)     - HMAC tokens for unlimited mode
                                   - Image proxy (skill & silhouette)
                    ↕ fetch API ↕
          /guess        /hint          /cookies
          /guess2        /hint2         /skill
          /guess3        /hint3         /skill-image
          /silhouette3-image
          /unlimited/new   /unlimited/guess   /unlimited/hint
```

The daily target cookies are computed server-side using `SHA-256(date + suffix + COOKIE_SECRET)` where `COOKIE_SECRET` is an encrypted Cloudflare environment variable — it never touches the browser. Each game uses a different suffix (`-skill`, `-silhouette`) to guarantee three distinct daily cookies.

Skill images and silhouettes are served through opaque worker proxy endpoints (`/skill-image`, `/silhouette3-image`) so the cookie filename — which encodes the answer — is never visible in network traffic.

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

**1. Edit `worker.js`** — add new entries to the `COOKIES` array at the top.

**2. Deploy everything** (worker + assets):
```bash
npm run deploy
```

**3. Push to GitHub:**
```bash
git add .
git commit -m "Add new cookies"
git push origin master
```

> **Note:** Adding or reordering cookies in the `COOKIES` array changes the daily hash results, shifting which cookie appears on each date.

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
├── worker.js               # Cloudflare Worker (all backend logic)
├── wrangler.jsonc          # Wrangler config (assets directory, bindings)
├── package.json            # npm scripts (deploy)
├── package-lock.json       # Lockfile — commit this
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
- All guess checking and hint validation happens server-side in the Cloudflare Worker
- Hints require at least 5 server-verified wrong guesses before unlocking
- Skill images and silhouettes are proxied through the worker — the cookie name never appears in any URL the browser can see
- Unlimited mode uses HMAC-SHA256 signed tokens — the cookie name never leaves the server
- `COOKIE_SECRET` is stored as an encrypted environment variable in Cloudflare — not in any file
- CORS is locked to `dangel34.github.io`
- Security headers (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) applied via `docs/_headers`
- `secret.html` is excluded from search engine indexing via `robots.txt`

---

## 🙏 Credits

- Cookie data and artwork sourced from **[noff.gg](https://www.noff.gg/cookie-run-kingdom/cookies)**
- Inspired by **Wordle**, **Loldle**, and **Pokedle**

---

*Made with ❤️ — For Rayn, From Derek* 🍪
