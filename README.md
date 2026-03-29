# Cookiedle 🍪

A daily Cookie Run Kingdom guessing game inspired by Wordle, Loldle, and Pokedle — now fully playable in the browser.

**[▶ Play Now](https://dange134.github.io/Cookiedle-Game)**

---

## 🎮 How to Play

Cookiedle has two daily game modes that reset at midnight every day.

### Game 1 — Cookie Guesser
Guess the mystery Cookie Run Kingdom cookie. After each guess, tiles reveal how close you are across five traits.

| Color | Meaning |
|-------|---------|
| 🟢 Green | Trait is correct |
| 🟡 Orange | Color exists but is swapped (primary ↔ secondary) |
| 🔴 Red | Trait is wrong |

The five traits revealed per guess are: **Primary Color, Secondary Color, Rarity, Type, Position**

After 5 wrong guesses, a **💡 Hint** button unlocks — choose one trait to reveal its answer.

### Game 2 — Skill Guesser
Once you complete Game 1, a second challenge unlocks. A skill name and cooldown are shown — guess which cookie owns that skill. You get ✅ or ❌ per guess, with a hint after 5 wrong guesses that reveals the cookie's Rarity, Type, and Position.

### Sharing
After completing both games, a **Share** button generates a combined emoji grid you can copy and send to friends.

---

## ✨ Features

- **Daily cookies** — same cookie for everyone each day, secured server-side
- **Cheat-proof** — the answer is never in the page source or network traffic
- **Fuzzy autocomplete** — smart search as you type
- **Session persistence** — your guesses survive page refreshes
- **Hint system** — unlocks after 5 wrong guesses in both game modes
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
- Guess rendering                  - Guess checking
- Session state (localStorage)     - Hint values
                    ↕ fetch API ↕
                  /guess   /hint
                  /guess2  /hint2
                  /skill   /cookies
```

The daily target cookie is computed server-side using `SHA-256(date + COOKIE_SECRET)` where `COOKIE_SECRET` is an encrypted Cloudflare environment variable — it never touches the browser.

---

## 🛠️ Local Development

### Updating the cookie database

**1. Scrape new cookies** (requires Chrome installed):
```bash
pip install selenium beautifulsoup4
python scraper.py
```
This updates `cookies_rows.csv` with any new cookies. New entries will have blank color fields — fill those in manually.

**2. Rebuild the frontend:**
```bash
python build_cookies_js.py
```
This injects the updated cookie list into `index.html`.

**3. Redeploy the worker:**
```bash
wrangler deploy worker.js --name cookiedle-worker --compatibility-date 2025-09-27
```

**4. Push to GitHub:**
```bash
git add index.html cookies_rows.csv
git commit -m "Update cookies"
git push origin master
```

---

## 📁 File Structure

```
Cookiedle-Game/
├── index.html           # Main web app (game UI + JS logic)
├── secret.html          # 👀
├── worker.js            # Cloudflare Worker (backend logic)
├── wrangler.toml        # Wrangler config for Worker deployment
├── wrangler.jsonc       # Wrangler config (alternate format)
├── cookies_rows.csv     # Cookie database (source of truth)
├── scraper.py           # Selenium scraper for noff.gg
├── build_cookies_js.py  # Injects CSV data into index.html
├── robots.txt           # Blocks secret.html from search engines
├── .gitignore
└── README.md
```

---

## 🔒 Security

- The daily answer is never sent to the browser
- All guess checking happens server-side in the Cloudflare Worker
- `COOKIE_SECRET` is stored as an encrypted environment variable in Cloudflare — not in any file
- CORS is locked to `dange134.github.io`
- `secret.html` is excluded from search engine indexing via `robots.txt`

---

## 🙏 Credits

- Cookie data sourced from **[noff.gg](https://www.noff.gg/cookie-run-kingdom/cookies)**
- Inspired by **Wordle**, **Loldle**, and **Pokedle**

---

*Made with ❤️ — For Rayn, From Derek* 🍪
