// ─────────────────────────────────────────
// SESSION KEY
// ─────────────────────────────────────────
const TODAY_KEY = (() => {
  const d = new Date();
  return `cookiedle-${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
})();

// ─────────────────────────────────────────
// STATE PERSISTENCE
// ─────────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(TODAY_KEY);
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

function defaultState() {
  return {
    // Game 1
    guesses: [],
    results: {},
    won: false,
    hintUsed: false,
    hintTrait: null,
    hintValue: null,
    hintAfterGuess: null,
    victoryData: null,
    g1StateToken: null,
    // Game 2
    g2started: false,
    g2guesses: [],
    g2won: false,
    g2hintUsed: false,
    g2hintValue: null,
    g2hintAfterGuess: null,
    g2victoryName: null,
    g2StateToken: null,
    // Game 3
    g3started: false,
    g3guesses: [],
    g3won: false,
    g3hintUsed: false,
    g3hintValue: null,
    g3hintAfterGuess: null,
    g3victoryName: null,
    g3StateToken: null,
  };
}

function saveState() {
  try {
    localStorage.setItem(
      TODAY_KEY,
      JSON.stringify({
        guesses,
        results,
        won,
        hintUsed,
        hintTrait,
        hintValue,
        hintAfterGuess,
        victoryData,
        g1StateToken,
        g2started,
        g2guesses,
        g2won,
        g2hintUsed,
        g2hintValue,
        g2hintAfterGuess,
        g2victoryName,
        g2StateToken,
        g3started,
        g3guesses,
        g3won,
        g3hintUsed,
        g3hintValue,
        g3hintAfterGuess,
        g3victoryName,
        g3StateToken,
      })
    );
  } catch {}
}

const saved = loadState();

// ─────────────────────────────────────────
// STATE VARIABLES
// ─────────────────────────────────────────
// Game 1
let guesses = saved.guesses || [];
let results = saved.results || {};
let won = saved.won || false;
let hintUsed = saved.hintUsed || false;
let hintTrait = saved.hintTrait || null;
let hintValue = saved.hintValue || null;
let hintAfterGuess = saved.hintAfterGuess || null;
let victoryData = saved.victoryData || null;
let g1StateToken = saved.g1StateToken || null;

// Game 2
let g2started = saved.g2started || false;
let g2guesses = saved.g2guesses || [];
let g2won = saved.g2won || false;
let g2hintUsed = saved.g2hintUsed || false;
let g2hintValue = saved.g2hintValue || null;
let g2hintAfterGuess = saved.g2hintAfterGuess || null;
let g2victoryName = saved.g2victoryName || null;
let g2StateToken = saved.g2StateToken || null;

// Game 3
let g3started = saved.g3started || false;
let g3guesses = saved.g3guesses || [];
let g3won = saved.g3won || false;
let g3hintUsed = saved.g3hintUsed || false;
let g3hintValue = saved.g3hintValue || null;
let g3hintAfterGuess = saved.g3hintAfterGuess || null;
let g3victoryName = saved.g3victoryName || null;
let g3StateToken = saved.g3StateToken || null;

// Game 2 skill data (fetched from worker)
let skillData = null;

// Game 3 silhouette image is served via ${WORKER_URL}/silhouette3-image (opaque proxy)

let activeSuggestion = -1;
let activeSuggestion2 = -1;
let activeSuggestion3 = -1;

// ─────────────────────────────────────────
// TURNSTILE
// ─────────────────────────────────────────
let turnstileToken = null;

function onTurnstileToken(token) {
  turnstileToken = token;
}

function consumeTurnstileToken() {
  const token = turnstileToken;
  turnstileToken = null;
  if (typeof turnstile !== 'undefined') turnstile.reset('#turnstileWidget');
  return token || '';
}

// ─────────────────────────────────────────
// DOM REFS — GAME 1
// ─────────────────────────────────────────
const input = document.getElementById('guessInput');
const suggestBox = document.getElementById('suggestions');
const historyEl = document.getElementById('guessHistory');
const metaEl = document.getElementById('guessMeta');
const alreadyEl = document.getElementById('alreadyGuessed');
const victoryEl = document.getElementById('victoryBanner');
const vicCountEl = document.getElementById('victoryGuessCount');
const vicNameEl = document.getElementById('victoryCookieName');
const vicSkillEl = document.getElementById('victorySkill');
const vicSpotlightEl = document.getElementById('victorySpotlight');
const submitBtn = document.getElementById('submitBtn');
const nextGameBtn = document.getElementById('nextGameBtn');
const hintSection = document.getElementById('hintSection');
const hintBtn = document.getElementById('hintBtn');
const hintPicker = document.getElementById('hintPicker');
const hintReveal = document.getElementById('hintReveal');

// DOM REFS — GAME 2
const game2Section = document.getElementById('game2Section');
const input2 = document.getElementById('guessInput2');
const suggestBox2 = document.getElementById('suggestions2');
const submitBtn2 = document.getElementById('submitBtn2');
const alreadyEl2 = document.getElementById('alreadyGuessed2');
const metaEl2 = document.getElementById('guessMeta2');
const game2History = document.getElementById('game2History');
const hintSection2 = document.getElementById('hintSection2');
const hintBtn2 = document.getElementById('hintBtn2');
const hintReveal2 = document.getElementById('hintReveal2');
const skillNameEl = document.getElementById('skillName');
const skillCdEl = document.getElementById('skillCd');
const skillImgEl = document.getElementById('skillImg');

// DOM REFS — GAME 3
const game3Section = document.getElementById('game3Section');
const input3 = document.getElementById('guessInput3');
const suggestBox3 = document.getElementById('suggestions3');
const submitBtn3 = document.getElementById('submitBtn3');
const alreadyEl3 = document.getElementById('alreadyGuessed3');
const metaEl3 = document.getElementById('guessMeta3');
const game3History = document.getElementById('game3History');
const hintSection3 = document.getElementById('hintSection3');
const hintBtn3 = document.getElementById('hintBtn3');
const hintReveal3 = document.getElementById('hintReveal3');
const silhouetteImg = document.getElementById('silhouetteImg');
const g2NextPrompt = document.getElementById('g2NextPrompt');

// DOM REFS — FINAL
const finalVictory = document.getElementById('finalVictory');
const finalSub = document.getElementById('finalSub');
const finalCookieEl = document.getElementById('finalCookieName');
const shareBtn = document.getElementById('shareBtn');
const nextTimerEl = document.getElementById('nextTimer');

// Bind suggestion boxes to their inputs for shared autocomplete
bindSuggestionBox(input, suggestBox);
bindSuggestionBox(input2, suggestBox2);
bindSuggestionBox(input3, suggestBox3);

// ─────────────────────────────────────────
// RESTORE SESSION
// ─────────────────────────────────────────
function restoreGame2Session() {
  showGame2();
  g2guesses.forEach((name) => addGame2Row(name, name === g2victoryName, false));
  updateMeta2();
  updateHint2();
  if (g2won) {
    input2.disabled = true;
    submitBtn2.disabled = true;
    if (!g3started) {
      document.getElementById('g2VicCount').textContent =
        g2guesses.length === 1
          ? 'Got it in just 1 guess!'
          : `Got it in ${g2guesses.length} guesses!`;
      document.getElementById('g2VicName').textContent = `🍪 ${g2victoryName}`;
      const g2Img = document.getElementById('g2VictoryImg');
      g2Img.src = cookieImgSrc(g2victoryName);
      g2Img.alt = g2victoryName;
      g2Img.style.animation = 'none';
      g2Img.style.display = '';
      g2NextPrompt.classList.add('show');
    }
  }
}

function restoreGame3Session() {
  showGame3();
  g3guesses.forEach((name) => addGame3Row(name, name === g3victoryName, false));
  updateMeta3();
  updateHint3();
  if (g3won) {
    input3.disabled = true;
    submitBtn3.disabled = true;
    showFinalVictory(false);
  }
}

function restoreSession() {
  // Restore game 1 rows
  guesses.forEach((name) => {
    const traitResults = results[name];
    if (traitResults) addGuessRow(traitResults, false);
  });
  updateMeta();
  updateHint();

  if (won && victoryData) {
    input.disabled = true;
    submitBtn.disabled = true;
    showVictory1(false);
    const victoryImg = document.getElementById('victoryImg');
    victoryImg.style.animation = 'none';
  }

  if (g2started) restoreGame2Session();
  if (g3started) restoreGame3Session();
}

// ─────────────────────────────────────────
// AUTOCOMPLETE — event listeners
// ─────────────────────────────────────────
input.addEventListener('input', () => {
  activeSuggestion = -1;
  alreadyEl.textContent = '';
  buildSuggestions(input.value.trim(), guesses, suggestBox);
});

input.addEventListener('keydown', (e) => {
  const items = suggestBox.querySelectorAll('.suggestion-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1);
    updateActiveSugg(items, activeSuggestion, input);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeSuggestion = Math.max(activeSuggestion - 1, -1);
    updateActiveSugg(items, activeSuggestion, input);
  } else if (e.key === 'Enter') {
    if (activeSuggestion >= 0 && items[activeSuggestion]) {
      e.preventDefault();
      selectSuggestion(items[activeSuggestion].textContent, input, suggestBox);
    } else {
      submitGuess();
    }
  } else if (e.key === 'Escape') {
    hideSuggestions(suggestBox);
  }
});

input2.addEventListener('input', () => {
  activeSuggestion2 = -1;
  alreadyEl2.textContent = '';
  buildSuggestions(input2.value.trim(), g2guesses, suggestBox2);
});

input2.addEventListener('keydown', (e) => {
  const items = suggestBox2.querySelectorAll('.suggestion-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeSuggestion2 = Math.min(activeSuggestion2 + 1, items.length - 1);
    updateActiveSugg(items, activeSuggestion2, input2);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeSuggestion2 = Math.max(activeSuggestion2 - 1, -1);
    updateActiveSugg(items, activeSuggestion2, input2);
  } else if (e.key === 'Enter') {
    if (activeSuggestion2 >= 0 && items[activeSuggestion2]) {
      e.preventDefault();
      selectSuggestion(items[activeSuggestion2].textContent, input2, suggestBox2);
    } else {
      submitGuess2();
    }
  } else if (e.key === 'Escape') {
    hideSuggestions(suggestBox2);
  }
});

input3.addEventListener('input', () => {
  activeSuggestion3 = -1;
  alreadyEl3.textContent = '';
  buildSuggestions(input3.value.trim(), g3guesses, suggestBox3);
});

input3.addEventListener('keydown', (e) => {
  const items = suggestBox3.querySelectorAll('.suggestion-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeSuggestion3 = Math.min(activeSuggestion3 + 1, items.length - 1);
    updateActiveSugg(items, activeSuggestion3, input3);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeSuggestion3 = Math.max(activeSuggestion3 - 1, -1);
    updateActiveSugg(items, activeSuggestion3, input3);
  } else if (e.key === 'Enter') {
    if (activeSuggestion3 >= 0 && items[activeSuggestion3]) {
      e.preventDefault();
      selectSuggestion(items[activeSuggestion3].textContent, input3, suggestBox3);
    } else {
      submitGuess3();
    }
  } else if (e.key === 'Escape') {
    hideSuggestions(suggestBox3);
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.input-wrap')) {
    hideSuggestions(suggestBox);
    hideSuggestions(suggestBox2);
    hideSuggestions(suggestBox3);
  }
});

// ─────────────────────────────────────────
// GAME 1 — GUESS LOGIC
// ─────────────────────────────────────────
submitBtn.addEventListener('click', submitGuess);

async function submitGuess() {
  if (won) return;
  const raw = input.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found — check your spelling!');
    return;
  }
  if (guesses.includes(cookie.cookie_name)) {
    alreadyEl.textContent = `Already guessed ${cookie.cookie_name}!`;
    return;
  }

  input.disabled = true;
  submitBtn.disabled = true;
  alreadyEl.textContent = '';

  let data;
  try {
    const res = await fetch(`${WORKER_URL}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: cookie.cookie_name, state_token: g1StateToken, cf_turnstile: consumeTurnstileToken() }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error — please try again.');
    input.disabled = false;
    submitBtn.disabled = false;
    return;
  }

  if (data.error) {
    showToast(data.error);
    input.disabled = false;
    submitBtn.disabled = false;
    return;
  }
  if (data.state_token) g1StateToken = data.state_token;

  const traitResults = [
    { value: cookie.cookie_name, result: 'name' },
    { value: cookie.primary_color, result: data.primary_color },
    { value: cookie.secondary_color, result: data.secondary_color },
    { value: cookie.rarity, result: data.rarity },
    { value: cookie.type, result: data.type },
    { value: cookie.position, result: data.position },
  ];

  guesses.push(cookie.cookie_name);
  results[cookie.cookie_name] = traitResults;
  input.value = '';
  hideSuggestions(suggestBox);

  addGuessRow(traitResults, true);
  updateMeta();
  updateHint();

  if (data.correct) {
    won = true;
    addToCollection(data.cookie_name);
    victoryData = {
      name: data.cookie_name,
      skill: data.skill_name || '',
      cooldown: data.skill_cooldown || 0,
    };
    saveState();
    input.disabled = true;
    submitBtn.disabled = true;
    setTimeout(() => showVictory1(true), 6 * 700 + 400);
  } else {
    input.disabled = false;
    submitBtn.disabled = false;
    saveState();
  }
}

function addGuessRow(traitResults, animate) {
  const row = document.createElement('div');
  row.className = 'guess-row';
  traitResults.forEach((trait, i) => {
    const cell = document.createElement('div');
    cell.className = `cell cell-${trait.result}`;
    cell.textContent = trait.value;
    if (animate) setTimeout(() => cell.classList.add('revealed'), i * 700);
    else cell.classList.add('instant');
    row.appendChild(cell);
  });
  historyEl.prepend(row);
}

// ─────────────────────────────────────────
// GAME 1 — META & HINT
// ─────────────────────────────────────────
function wrongCount() {
  return won ? guesses.length - 1 : guesses.length;
}

function updateMeta() {
  if (!guesses.length) {
    metaEl.textContent = '';
    return;
  }
  metaEl.textContent = guesses.length === 1 ? '1 guess so far' : `${guesses.length} guesses so far`;
}

function updateHint() {
  if (won) {
    hintSection.classList.remove('show');
    return;
  }
  hintSection.classList.toggle('show', wrongCount() >= 5);
  if (hintUsed && hintTrait && hintValue) {
    hintBtn.style.display = 'none';
    hintPicker.classList.remove('show');
    hintReveal.textContent = `💡 ${TRAIT_LABELS[hintTrait]}: ${hintValue}`;
    hintReveal.classList.add('show');
  } else {
    hintBtn.style.display = '';
    hintBtn.disabled = false;
  }
}

hintBtn.addEventListener('click', () => {
  if (hintUsed) return;
  hintBtn.disabled = true;
  hintPicker.classList.add('show');
});

hintPicker.querySelectorAll('.hint-choice').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const trait = btn.dataset.trait;
    let value;
    try {
      const res = await fetch(
        `${WORKER_URL}/hint?trait=${trait}&state_token=${encodeURIComponent(g1StateToken || '')}`
      );
      const data = await res.json();
      if (data.error) {
        showToast(data.error);
        hintBtn.disabled = false;
        return;
      }
      value = data.value;
      if (data.state_token) g1StateToken = data.state_token;
    } catch {
      showToast('Could not fetch hint — please try again.');
      hintBtn.disabled = false;
      return;
    }
    hintUsed = true;
    hintTrait = trait;
    hintValue = value;
    hintAfterGuess = guesses.length;
    saveState();
    hintBtn.style.display = 'none';
    hintPicker.classList.remove('show');
    hintReveal.textContent = `💡 ${TRAIT_LABELS[trait]}: ${value}`;
    hintReveal.classList.add('show');
  });
});

// ─────────────────────────────────────────
// GAME 1 — VICTORY
// ─────────────────────────────────────────
function showVictory1(animate) {
  vicCountEl.textContent =
    guesses.length === 1 ? 'Got it in just 1 guess!' : `Got it in ${guesses.length} guesses!`;
  vicNameEl.textContent = `🍪 ${victoryData.name}`;
  if (victoryData.skill) {
    vicSkillEl.textContent = '';
    const skillLabel = document.createTextNode('Skill: ');
    const skillSpan = document.createElement('span');
    skillSpan.style.cssText = 'color:var(--gold);font-weight:800';
    skillSpan.textContent = victoryData.skill;
    const sep = document.createTextNode(' · Cooldown: ');
    const cdSpan = document.createElement('span');
    cdSpan.style.cssText = 'color:var(--gold);font-weight:800';
    cdSpan.textContent = `${victoryData.cooldown}s`;
    vicSkillEl.append(skillLabel, skillSpan, sep, cdSpan);
  } else {
    vicSkillEl.textContent = '';
  }
  const victoryImg = document.getElementById('victoryImg');
  victoryImg.src = cookieImgSrc(victoryData.name);
  victoryImg.alt = victoryData.name;
  if (!animate) victoryImg.style.animation = 'none';
  victoryImg.style.display = '';
  if (!animate) victoryEl.style.animation = 'none';
  victoryEl.classList.add('show');

  vicSpotlightEl.textContent = '';
  const cookieData = COOKIES.find((c) => c.cookie_name === victoryData.name);
  if (cookieData) {
    [
      { label: 'Rarity', value: cookieData.rarity },
      { label: 'Type', value: cookieData.type },
      { label: 'Position', value: cookieData.position },
    ].forEach(({ label, value }) => {
      const chip = document.createElement('div');
      chip.className = 'spotlight-chip';
      const lbl = document.createElement('span');
      lbl.className = 'spotlight-label';
      lbl.textContent = label;
      const val = document.createElement('span');
      val.className = 'spotlight-value';
      val.textContent = value;
      chip.append(lbl, val);
      vicSpotlightEl.appendChild(chip);
    });
  }
}

nextGameBtn.addEventListener('click', async () => {
  g2started = true;
  saveState();
  await showGame2();
});

// ─────────────────────────────────────────
// GAME 2 — SHOW & LOAD SKILL
// ─────────────────────────────────────────
async function showGame2() {
  game2Section.classList.add('show');
  game2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!skillData) {
    skillNameEl.textContent = 'Loading...';
    skillCdEl.textContent = '';
    try {
      const res = await fetch(`${WORKER_URL}/skill`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      skillData = await res.json();
    } catch {
      showToast('Could not load skill — please refresh.');
      return;
    }
  }

  skillNameEl.textContent = skillData.skill_name;
  skillCdEl.textContent = `Cooldown: ${skillData.skill_cooldown}s`;
  skillImgEl.src = `${WORKER_URL}/skill-image`;
  skillImgEl.alt = skillData.skill_name;
  skillImgEl.style.display = '';

  if (!g2won) {
    input2.disabled = false;
    submitBtn2.disabled = false;
    input2.focus();
  }
}

// ─────────────────────────────────────────
// GAME 2 — GUESS LOGIC
// ─────────────────────────────────────────
submitBtn2.addEventListener('click', submitGuess2);

async function submitGuess2() {
  if (g2won) return;
  const raw = input2.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found — check your spelling!');
    return;
  }
  if (g2guesses.includes(cookie.cookie_name)) {
    alreadyEl2.textContent = `Already guessed ${cookie.cookie_name}!`;
    return;
  }

  input2.disabled = true;
  submitBtn2.disabled = true;
  alreadyEl2.textContent = '';

  let data;
  try {
    const res = await fetch(`${WORKER_URL}/guess2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: cookie.cookie_name, state_token: g2StateToken, cf_turnstile: consumeTurnstileToken() }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error — please try again.');
    input2.disabled = false;
    submitBtn2.disabled = false;
    return;
  }

  if (data.error) {
    showToast(data.error);
    input2.disabled = false;
    submitBtn2.disabled = false;
    return;
  }
  if (data.state_token) g2StateToken = data.state_token;

  g2guesses.push(cookie.cookie_name);
  input2.value = '';
  hideSuggestions(suggestBox2);

  addGame2Row(cookie.cookie_name, data.correct, true);
  updateMeta2();
  updateHint2();

  if (data.correct) {
    g2won = true;
    addToCollection(data.cookie_name);
    g2victoryName = data.cookie_name;
    saveState();
    input2.disabled = true;
    submitBtn2.disabled = true;
    setTimeout(() => {
      document.getElementById('g2VicCount').textContent =
        g2guesses.length === 1
          ? 'Got it in just 1 guess!'
          : `Got it in ${g2guesses.length} guesses!`;
      document.getElementById('g2VicName').textContent = `🍪 ${data.cookie_name}`;
      const g2Img = document.getElementById('g2VictoryImg');
      g2Img.src = cookieImgSrc(data.cookie_name);
      g2Img.alt = data.cookie_name;
      g2Img.style.display = '';
      g2NextPrompt.classList.add('show');
      g2NextPrompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  } else {
    input2.disabled = false;
    submitBtn2.disabled = false;
    saveState();
  }
}

function addGame2Row(name, correct, animate) {
  const row = document.createElement('div');
  row.className = `game2-row ${correct ? 'correct' : 'wrong'}`;
  if (!animate) row.style.animation = 'none';
  const icon = document.createElement('span');
  icon.className = 'g2-icon';
  icon.textContent = correct ? '✅' : '❌';
  const label = document.createElement('span');
  label.className = 'g2-name';
  label.textContent = name;
  row.append(icon, label);
  game2History.prepend(row);
}

// ─────────────────────────────────────────
// GAME 2 — META & HINT
// ─────────────────────────────────────────
function g2wrongCount() {
  return g2won ? g2guesses.length - 1 : g2guesses.length;
}

function updateMeta2() {
  if (!g2guesses.length) {
    metaEl2.textContent = '';
    return;
  }
  metaEl2.textContent =
    g2guesses.length === 1 ? '1 guess so far' : `${g2guesses.length} guesses so far`;
}

function renderHint2(el, hintData) {
  el.textContent = '';
  const b1 = document.createElement('strong');
  b1.textContent = hintData.rarity;
  const b2 = document.createElement('strong');
  b2.textContent = hintData.type;
  const b3 = document.createElement('strong');
  b3.textContent = hintData.position;
  el.append('💡 Rarity: ', b1, ' · Type: ', b2, ' · Position: ', b3);
}

function updateHint2() {
  if (g2won) {
    hintSection2.classList.remove('show');
    return;
  }
  hintSection2.classList.toggle('show', g2wrongCount() >= 5);
  if (g2hintUsed && g2hintValue && typeof g2hintValue === 'object') {
    hintBtn2.style.display = 'none';
    renderHint2(hintReveal2, g2hintValue);
    hintReveal2.classList.add('show');
  } else {
    hintBtn2.style.display = '';
    hintBtn2.disabled = false;
  }
}

hintBtn2.addEventListener('click', async () => {
  if (g2hintUsed) return;
  hintBtn2.disabled = true;
  let data;
  try {
    const res = await fetch(
      `${WORKER_URL}/hint2?state_token=${encodeURIComponent(g2StateToken || '')}`
    );
    data = await res.json();
  } catch {
    showToast('Could not fetch hint — please try again.');
    hintBtn2.disabled = false;
    return;
  }
  if (data.error) {
    showToast(data.error);
    hintBtn2.disabled = false;
    return;
  }
  if (data.state_token) g2StateToken = data.state_token;
  g2hintUsed = true;
  g2hintValue = { rarity: data.rarity, type: data.type, position: data.position };
  g2hintAfterGuess = g2guesses.length;
  saveState();
  hintBtn2.style.display = 'none';
  renderHint2(hintReveal2, g2hintValue);
  hintReveal2.classList.add('show');
});

// ─────────────────────────────────────────
// GAME 3 — SHOW & LOAD SILHOUETTE
// ─────────────────────────────────────────
document.getElementById('g3NextBtn').addEventListener('click', async () => {
  g3started = true;
  saveState();
  await showGame3();
});

async function showGame3() {
  game3Section.classList.add('show');
  game3Section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  silhouetteImg.src = g3won ? cookieImgSrc(g3victoryName) : `${WORKER_URL}/silhouette3-image`;
  silhouetteImg.style.display = '';

  if (!g3won) {
    input3.disabled = false;
    submitBtn3.disabled = false;
    input3.focus();
  }
}

// ─────────────────────────────────────────
// GAME 3 — GUESS LOGIC
// ─────────────────────────────────────────
submitBtn3.addEventListener('click', submitGuess3);

async function submitGuess3() {
  if (g3won) return;
  const raw = input3.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found — check your spelling!');
    return;
  }
  if (g3guesses.includes(cookie.cookie_name)) {
    alreadyEl3.textContent = `Already guessed ${cookie.cookie_name}!`;
    return;
  }

  input3.disabled = true;
  submitBtn3.disabled = true;
  alreadyEl3.textContent = '';

  let data;
  try {
    const res = await fetch(`${WORKER_URL}/guess3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: cookie.cookie_name, state_token: g3StateToken, cf_turnstile: consumeTurnstileToken() }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error — please try again.');
    input3.disabled = false;
    submitBtn3.disabled = false;
    return;
  }

  if (data.error) {
    showToast(data.error);
    input3.disabled = false;
    submitBtn3.disabled = false;
    return;
  }
  if (data.state_token) g3StateToken = data.state_token;

  g3guesses.push(cookie.cookie_name);
  input3.value = '';
  hideSuggestions(suggestBox3);

  addGame3Row(cookie.cookie_name, data.correct, true);
  updateMeta3();
  updateHint3();

  if (data.correct) {
    g3won = true;
    addToCollection(data.cookie_name);
    g3victoryName = data.cookie_name;
    saveState();
    input3.disabled = true;
    submitBtn3.disabled = true;

    silhouetteImg.classList.add('fading');
    setTimeout(() => {
      silhouetteImg.src = cookieImgSrc(data.cookie_name);
      silhouetteImg.classList.remove('fading');
    }, 400);

    setTimeout(() => showFinalVictory(true), 1000);
  } else {
    silhouetteImg.classList.remove('shake');
    silhouetteImg.getBoundingClientRect();
    silhouetteImg.classList.add('shake');
    input3.disabled = false;
    submitBtn3.disabled = false;
    saveState();
  }
}

function addGame3Row(name, correct, animate) {
  const row = document.createElement('div');
  row.className = `game2-row ${correct ? 'correct' : 'wrong'}`;
  if (!animate) row.style.animation = 'none';
  const icon = document.createElement('span');
  icon.className = 'g2-icon';
  icon.textContent = correct ? '✅' : '❌';
  const label = document.createElement('span');
  label.className = 'g2-name';
  label.textContent = name;
  row.append(icon, label);
  game3History.prepend(row);
}

// ─────────────────────────────────────────
// GAME 3 — META & HINT
// ─────────────────────────────────────────
function g3wrongCount() {
  return g3won ? g3guesses.length - 1 : g3guesses.length;
}

function updateMeta3() {
  if (!g3guesses.length) {
    metaEl3.textContent = '';
    return;
  }
  metaEl3.textContent =
    g3guesses.length === 1 ? '1 guess so far' : `${g3guesses.length} guesses so far`;
}

function renderHint3(el, hintData) {
  el.textContent = '';
  const b1 = document.createElement('strong');
  b1.textContent = hintData.primary_color;
  const b2 = document.createElement('strong');
  b2.textContent = hintData.type;
  const b3 = document.createElement('strong');
  b3.textContent = hintData.rarity;
  el.append('💡 Primary Color: ', b1, ' · Type: ', b2, ' · Rarity: ', b3);
}

function updateHint3() {
  if (g3won) {
    hintSection3.classList.remove('show');
    return;
  }
  hintSection3.classList.toggle('show', g3wrongCount() >= 5);
  if (g3hintUsed && g3hintValue && typeof g3hintValue === 'object') {
    hintBtn3.style.display = 'none';
    renderHint3(hintReveal3, g3hintValue);
    hintReveal3.classList.add('show');
  } else {
    hintBtn3.style.display = '';
    hintBtn3.disabled = false;
  }
}

hintBtn3.addEventListener('click', async () => {
  if (g3hintUsed) return;
  hintBtn3.disabled = true;
  let data;
  try {
    const res = await fetch(
      `${WORKER_URL}/hint3?state_token=${encodeURIComponent(g3StateToken || '')}`
    );
    data = await res.json();
  } catch {
    showToast('Could not fetch hint — please try again.');
    hintBtn3.disabled = false;
    return;
  }
  if (data.error) {
    showToast(data.error);
    hintBtn3.disabled = false;
    return;
  }
  if (data.state_token) g3StateToken = data.state_token;
  g3hintUsed = true;
  g3hintValue = { primary_color: data.primary_color, type: data.type, rarity: data.rarity };
  g3hintAfterGuess = g3guesses.length;
  saveState();
  hintBtn3.style.display = 'none';
  renderHint3(hintReveal3, g3hintValue);
  hintReveal3.classList.add('show');
});

// ─────────────────────────────────────────
// STATS & STREAK
// ─────────────────────────────────────────
const STATS_KEY = 'cookiedle-stats';

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : defaultStats();
  } catch {
    return defaultStats();
  }
}

function defaultStats() {
  return {
    currentStreak: 0,
    bestStreak: 0,
    totalPlayed: 0,
    totalWon: 0,
    totalGuesses: 0,
    lastCompleted: null,
  };
}

function saveStats(s) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(s));
  } catch {}
}

function recordCompletion(totalGuesses) {
  const s = loadStats();
  const today = new Date();
  const todayStr = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
  if (s.lastCompleted === todayStr) return;

  const yesterday = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 1)
  );
  const yestStr = `${yesterday.getUTCFullYear()}-${yesterday.getUTCMonth() + 1}-${yesterday.getUTCDate()}`;

  s.totalPlayed++;
  s.totalWon++;
  s.totalGuesses += totalGuesses;
  s.currentStreak = s.lastCompleted === yestStr ? s.currentStreak + 1 : 1;
  s.bestStreak = Math.max(s.bestStreak, s.currentStreak);
  s.lastCompleted = todayStr;
  saveStats(s);
}

function renderStats() {
  const s = loadStats();
  document.getElementById('statStreak').textContent = s.currentStreak;
  document.getElementById('statBest').textContent = s.bestStreak;
  document.getElementById('statWinRate').textContent =
    s.totalPlayed > 0 ? Math.round((s.totalWon / s.totalPlayed) * 100) + '%' : '0%';
  document.getElementById('statAvgGuesses').textContent =
    s.totalWon > 0 ? (s.totalGuesses / s.totalWon).toFixed(1) : '—';
}

const statsModal = document.getElementById('statsModal');
const statsBtn = document.getElementById('statsBtn');
const statsBtn2 = document.getElementById('statsBtn2');
const modalClose = document.getElementById('modalClose');

// ─────────────────────────────────────────
// COOKIE COLLECTION
// ─────────────────────────────────────────
function getCollection() {
  try {
    return JSON.parse(localStorage.getItem('collection') || '[]');
  } catch {
    return [];
  }
}

function addToCollection(cookieName) {
  const col = getCollection();
  if (!col.includes(cookieName)) {
    col.push(cookieName);
    localStorage.setItem('collection', JSON.stringify(col));
  }
}

const collectionModal = document.getElementById('collectionModal');
const collectionClose = document.getElementById('collectionClose');
const collectionBtn = document.getElementById('collectionBtn');
const collectionBtn2 = document.getElementById('collectionBtn2');
const collectionGrid = document.getElementById('collectionGrid');
const collectionCount = document.getElementById('collectionCount');

function renderCollection() {
  const found = new Set(getCollection());
  collectionCount.textContent = `${found.size} / ${COOKIES.length} identified`;
  collectionGrid.textContent = '';
  COOKIES.forEach((c) => {
    const item = document.createElement('div');
    const iFound = found.has(c.cookie_name);
    item.className = `collection-item ${iFound ? 'found' : 'missing'}`;
    item.title = iFound ? c.cookie_name : '???';
    const img = document.createElement('img');
    img.src = cookieImgSrc(c.cookie_name);
    img.alt = iFound ? c.cookie_name : '';
    img.width = 64;
    img.height = 64;
    img.loading = 'lazy';
    const label = document.createElement('div');
    label.className = 'collection-name';
    label.textContent = iFound ? c.cookie_name : '???';
    item.append(img, label);
    collectionGrid.appendChild(item);
  });
}

function openCollection() {
  renderCollection();
  collectionModal.classList.add('show');
}
function closeCollection() {
  collectionModal.classList.remove('show');
}

collectionBtn.addEventListener('click', openCollection);
collectionBtn2.addEventListener('click', openCollection);
collectionClose.addEventListener('click', closeCollection);
collectionModal.addEventListener('click', (e) => {
  if (e.target === collectionModal) closeCollection();
});

// ─────────────────────────────────────────
// TUTORIAL MODAL
// ─────────────────────────────────────────
const tutorialModal = document.getElementById('tutorialModal');
const tutorialBtn = document.getElementById('tutorialBtn');
const tutorialClose = document.getElementById('tutorialClose');
const tutorialGotIt = document.getElementById('tutorialGotIt');

function openTutorial() {
  tutorialModal.classList.add('show');
}
function closeTutorial() {
  tutorialModal.classList.remove('show');
}

tutorialBtn.addEventListener('click', openTutorial);
tutorialClose.addEventListener('click', closeTutorial);
tutorialGotIt.addEventListener('click', () => {
  localStorage.setItem('seen_tutorial', '1');
  closeTutorial();
});
tutorialModal.addEventListener('click', (e) => {
  if (e.target === tutorialModal) closeTutorial();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTutorial();
    closeStats();
    closeCollection();
  }
});

function openStats() {
  renderStats();
  statsModal.classList.add('show');
}
function closeStats() {
  statsModal.classList.remove('show');
}

statsBtn.addEventListener('click', openStats);
statsBtn2.addEventListener('click', openStats);
modalClose.addEventListener('click', closeStats);
statsModal.addEventListener('click', (e) => {
  if (e.target === statsModal) closeStats();
});

// ─────────────────────────────────────────
// COUNTDOWN
// ─────────────────────────────────────────
function startHeaderCountdown() {
  const el = document.getElementById('headerCountdown');
  function tick() {
    const now = new Date();
    const tomorrow = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    const diff = tomorrow - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ─────────────────────────────────────────
// FINAL VICTORY & SHARE
// ─────────────────────────────────────────
function showFinalVictory(animate) {
  finalSub.textContent = `Game 1: ${guesses.length} guess${guesses.length === 1 ? '' : 'es'} · Game 2: ${g2guesses.length} guess${g2guesses.length === 1 ? '' : 'es'} · Game 3: ${g3guesses.length} guess${g3guesses.length === 1 ? '' : 'es'}`;
  finalCookieEl.textContent = `🍪 ${g3victoryName}`;
  if (!animate) finalVictory.style.animation = 'none';
  finalVictory.classList.add('show');
  if (animate) recordCompletion(guesses.length + g2guesses.length + g3guesses.length);
  statsBtn.style.display = '';
  startNextCookieTimer();
}

function tickNextCookieTimer() {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  const diff = tomorrow - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  nextTimerEl.textContent = 'Next cookies in ';
  const timerSpan = document.createElement('span');
  timerSpan.textContent = `${h}:${m}:${s}`;
  nextTimerEl.appendChild(timerSpan);
}

function startNextCookieTimer() {
  tickNextCookieTimer();
  setInterval(tickNextCookieTimer, 1000);
}

function withHint(lines, hintUsedFlag, hintAfterGuessNum) {
  if (!hintUsedFlag || hintAfterGuessNum == null) return lines;
  const out = [...lines];
  out.splice(hintAfterGuessNum, 0, '💡');
  return out;
}

function traitResultEmoji(result) {
  if (result === 'correct') return '🟩';
  if (result === 'partial') return '🟨';
  return '🟥';
}

shareBtn.addEventListener('click', () => {
  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const s = loadStats();
  const sections = [`Cookiedle ${date} 🍪`];

  if (guesses.length > 0) {
    const n = guesses.length;
    const outcome = won ? '✅' : '❌';
    sections.push(`\nGame 1 — ${n} guess${n === 1 ? '' : 'es'} ${outcome}`);
    const rows = guesses.map((name) => {
      const traitCells = (results[name] || []).slice(1);
      return traitCells.map((t) => traitResultEmoji(t.result)).join('');
    });
    sections.push(...withHint(rows, hintUsed, hintAfterGuess));
  }

  if (g2started && g2guesses.length > 0) {
    const n = g2guesses.length;
    const outcome = g2won ? '✅' : '❌';
    sections.push(`\nGame 2 — ${n} guess${n === 1 ? '' : 'es'} ${outcome}`);
    const rows = g2guesses.map((name) => (name === g2victoryName ? '✅' : '❌'));
    sections.push(...withHint(rows, g2hintUsed, g2hintAfterGuess));
  }

  if (g3started && g3guesses.length > 0) {
    const n = g3guesses.length;
    const outcome = g3won ? '✅' : '❌';
    sections.push(`\nGame 3 — ${n} guess${n === 1 ? '' : 'es'} ${outcome}`);
    const rows = g3guesses.map((name) => (name === g3victoryName ? '✅' : '❌'));
    sections.push(...withHint(rows, g3hintUsed, g3hintAfterGuess));
  }

  sections.push(
    `\nStreak: ${s.currentStreak} 🔥`,
    `\nThink you can do better? Play Cookiedle!\nhttps://cookiedle.nappi.work`
  );

  const text = sections.join('\n');
  navigator.clipboard
    .writeText(text)
    .then(() => showToast('Results copied!'))
    .catch(() => showToast('Could not copy — try again.'));
});

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
async function init() {
  startHeaderCountdown();

  input.disabled = true;
  submitBtn.disabled = true;
  input.placeholder = 'Loading cookies...';

  try {
    const res = await fetch(`${WORKER_URL}/cookies`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    COOKIES.splice(0, COOKIES.length, ...(await res.json()));
  } catch (e) {
    input.placeholder = 'Type a cookie name...';
    input.disabled = false;
    submitBtn.disabled = false;
    showToast('Could not load cookie list — please refresh.');
    console.error('Failed to load cookies:', e);
    return;
  }

  input.placeholder = 'Type a cookie name...';
  if (!won) {
    input.disabled = false;
    submitBtn.disabled = false;
  }

  try {
    const res = await fetch(`${WORKER_URL}/skill`);
    if (res.ok) skillData = await res.json();
  } catch {}

  restoreSession();

  if (!localStorage.getItem('seen_tutorial')) openTutorial();
}

init();
