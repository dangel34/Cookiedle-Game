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
A skill name and cooldown are shown — guess which cookie owns that skill. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Rarity, Type, and Position. The cookie's artwork is revealed on a correct guess.

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
- **Cheat-proof** — the answer is never in the page source or network traffic
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
GitHub Pages (index.html)          Cloudflare Worker (worker.js)
──────────────────────────         ──────────────────────────────
Static frontend                    Secure backend
- Autocomplete UI                  - Daily cookie selection (SHA-256 hash)
- Guess rendering                  - Guess checking & hint validation
- Session state (localStorage)     - HMAC tokens for unlimited mode
- Cookie & silhouette images
                    ↕ fetch API ↕
          /guess    /hint     /cookies
          /guess2   /hint2    /skill
          /guess3   /hint3    /silhouette3
          /unlimited/new  /unlimited/guess  /unlimited/hint
```

The daily target cookies are computed server-side using `SHA-256(date + suffix + COOKIE_SECRET)` where `COOKIE_SECRET` is an encrypted Cloudflare environment variable — it never touches the browser. Each game uses a different suffix (`-skill`, `-silhouette`) to guarantee three distinct daily cookies.

---

## 🛠️ Local Development

### Adding cookie images

**1. Download cookie artwork from noff.gg:**
```bash
pip install cloudscraper beautifulsoup4
python scraper.py
```
Images are saved to `cookie_images/` as `Cookie_Name.webp`.

**2. Generate silhouettes for Game 3:**
```bash
pip install Pillow
python make_silhouettes.py
```
Silhouettes are saved to `cookie_silhouettes/` with matching filenames.

**3. Commit both folders to the repo** so GitHub Pages can serve them.

### Updating the cookie database

**1. Edit `worker.js`** — add new entries to the `COOKIES` array at the top.

**2. Redeploy the worker:**
```bash
wrangler deploy worker.js --name cookiedle-worker --compatibility-date 2025-09-27
```

**3. Push to GitHub:**
```bash
git add .
git commit -m "Add new cookies"
git push origin master
```

> **Note:** Adding or reordering cookies in the `COOKIES` array changes the daily hash results, shifting which cookie appears on each date.

---

## 📁 File Structure

```
Cookiedle-Game/
├── index.html              # Main web app (3 daily games)
├── unlimited.html          # Unlimited mode
├── secret.html             # 👀
├── worker.js               # Cloudflare Worker (all backend logic)
├── wrangler.jsonc          # Wrangler config
├── scraper.py              # Downloads cookie images from noff.gg
├── make_silhouettes.py     # Generates black silhouettes from cookie images
├── cookies_rows.csv        # Cookie database (source of truth)
├── cookie_images/          # Downloaded cookie artwork (.webp)
├── cookie_silhouettes/     # Generated silhouette images (.webp)
├── robots.txt              # Blocks secret.html from search engines
├── .gitignore
└── README.md
```

---

## 🔒 Security

- The daily answer is never sent to the browser unprompted
- All guess checking and hint validation happens server-side in the Cloudflare Worker
- Hints require at least 5 server-verified wrong guesses before unlocking
- Unlimited mode uses HMAC-SHA256 signed tokens — the cookie name never leaves the server
- `COOKIE_SECRET` is stored as an encrypted environment variable in Cloudflare — not in any file
- CORS is locked to `dangel34.github.io`
- `secret.html` is excluded from search engine indexing via `robots.txt`

---

## 🙏 Credits

- Cookie data and artwork sourced from **[noff.gg](https://www.noff.gg/cookie-run-kingdom/cookies)**
- Inspired by **Wordle**, **Loldle**, and **Pokedle**

---

*Made with ❤️ — For Rayn, From Derek* 🍪
