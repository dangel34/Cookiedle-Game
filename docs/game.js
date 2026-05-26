// ─────────────────────────────────────────
// ARCHIVE MODE
// ─────────────────────────────────────────
const _archiveParam = new URLSearchParams(location.search).get('date');
const IS_ARCHIVE = (() => {
  if (!_archiveParam || !/^\d{4}-\d{2}-\d{2}$/.test(_archiveParam)) return false;
  if (!location.pathname.includes('archive')) return false;
  const [y, m, d] = _archiveParam.split('-').map(Number);
  return (
    Date.UTC(y, m - 1, d) <=
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())
  );
})();
const ARCHIVE_DATE = IS_ARCHIVE ? _archiveParam.split('-').map(Number).join('-') : null;

// ─────────────────────────────────────────
// SESSION KEY
// ─────────────────────────────────────────
const TODAY_KEY = IS_ARCHIVE
  ? `cookiedle-archive-${ARCHIVE_DATE}`
  : (() => {
      const d = new Date();
      return `cookiedle-${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
    })();

function api(path) {
  if (!IS_ARCHIVE) return `${WORKER_URL}${path}`;
  const sep = path.includes('?') ? '&' : '?';
  return `${WORKER_URL}${path}${sep}date=${ARCHIVE_DATE}`;
}

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
    guesses: [],
    results: {},
    won: false,
    hintUsed: false,
    hintTrait: null,
    hintValue: null,
    hintAfterGuess: null,
    victoryData: null,
    g1StateToken: null,
  };
}

function createGameState(saved = {}) {
  return {
    started: saved.started || false,
    guesses: saved.guesses || [],
    won: saved.won || false,
    hintUsed: saved.hintUsed || false,
    hintValue: saved.hintValue ?? null,
    hintAfterGuess: saved.hintAfterGuess ?? null,
    victoryName: saved.victoryName || null,
    stateToken: saved.stateToken || null,
    get wrongCount() {
      return this.won ? this.guesses.length - 1 : this.guesses.length;
    },
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
        g2started: g2.started,
        g2guesses: g2.guesses,
        g2won: g2.won,
        g2hintUsed: g2.hintUsed,
        g2hintValue: g2.hintValue,
        g2hintAfterGuess: g2.hintAfterGuess,
        g2victoryName: g2.victoryName,
        g2StateToken: g2.stateToken,
        g3started: g3.started,
        g3guesses: g3.guesses,
        g3won: g3.won,
        g3hintUsed: g3.hintUsed,
        g3hintValue: g3.hintValue,
        g3hintAfterGuess: g3.hintAfterGuess,
        g3victoryName: g3.victoryName,
        g3StateToken: g3.stateToken,
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
let hintTrait = saved.hintTrait ?? null;
let hintValue = saved.hintValue ?? null;
let hintAfterGuess = saved.hintAfterGuess ?? null;
let victoryData = saved.victoryData ?? null;
let g1StateToken = saved.g1StateToken ?? null;

// Games 2 & 3 use factory-created state objects; future games follow this same pattern
const g2 = createGameState({
  started: saved.g2started,
  guesses: saved.g2guesses,
  won: saved.g2won,
  hintUsed: saved.g2hintUsed,
  hintValue: saved.g2hintValue,
  hintAfterGuess: saved.g2hintAfterGuess,
  victoryName: saved.g2victoryName,
  stateToken: saved.g2StateToken,
});
const g3 = createGameState({
  started: saved.g3started,
  guesses: saved.g3guesses,
  won: saved.g3won,
  hintUsed: saved.g3hintUsed,
  hintValue: saved.g3hintValue,
  hintAfterGuess: saved.g3hintAfterGuess,
  victoryName: saved.g3victoryName,
  stateToken: saved.g3StateToken,
});

// Game 2 skill data (fetched from worker)
let skillData = null;

// Game 3 silhouette image is served via ${WORKER_URL}/silhouette3-image (opaque proxy)

let activeSuggestion = -1;
let activeSuggestion2 = -1;
let activeSuggestion3 = -1;

function reenableWhenReady(inp, btn) {
  inp.disabled = false;
  btn.disabled = false;
}

// ─────────────────────────────────────────
// DOM REFS - GAME 1
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

// DOM REFS - GAME 2
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

// DOM REFS - GAME 3
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

// DOM REFS - FINAL
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
  g2.guesses.forEach((name) => addGame2Row(name, name === g2.victoryName, false));
  updateMeta2();
  updateHint2();
  if (g2.won) {
    input2.disabled = true;
    submitBtn2.disabled = true;
    if (!g3.started) {
      document.getElementById('g2VicCount').textContent =
        g2.guesses.length === 1
          ? 'Got it in just 1 guess!'
          : `Got it in ${g2.guesses.length} guesses!`;
      document.getElementById('g2VicName').textContent = `🍪 ${g2.victoryName}`;
      const g2Img = document.getElementById('g2VictoryImg');
      g2Img.src = cookieImgSrc(g2.victoryName);
      g2Img.alt = g2.victoryName;
      g2Img.style.animation = 'none';
      g2Img.style.display = '';
      g2NextPrompt.classList.add('show');
    }
  }
}

function restoreGame3Session() {
  showGame3();
  g3.guesses.forEach((name) => addGame3Row(name, name === g3.victoryName, false));
  updateMeta3();
  updateHint3();
  if (g3.won) {
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

  if (g2.started) restoreGame2Session();
  if (g3.started) restoreGame3Session();
}

// ─────────────────────────────────────────
// AUTOCOMPLETE - event listeners
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
  buildSuggestions(input2.value.trim(), g2.guesses, suggestBox2);
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
  buildSuggestions(input3.value.trim(), g3.guesses, suggestBox3);
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
// GAME 1 - GUESS LOGIC
// ─────────────────────────────────────────
submitBtn.addEventListener('click', submitGuess);

async function submitGuess() {
  if (won) return;
  const raw = input.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found - check your spelling!');
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
    const res = await fetch(api('/guess'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guess: cookie.cookie_name,
        state_token: g1StateToken,
      }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error - please try again.');
    reenableWhenReady(input, submitBtn);
    return;
  }

  if (data.error) {
    showToast(data.error);
    reenableWhenReady(input, submitBtn);
    return;
  }
  if (data.state_token) g1StateToken = data.state_token;

  const traitResults = [
    { label: 'Cookie', value: cookie.cookie_name, result: 'name' },
    { label: 'Primary', value: cookie.primary_color, result: data.primary_color },
    { label: 'Secondary', value: cookie.secondary_color, result: data.secondary_color },
    { label: 'Rarity', value: cookie.rarity, result: data.rarity },
    { label: 'Type', value: cookie.type, result: data.type },
    { label: 'Position', value: cookie.position, result: data.position },
  ];

  guesses.push(cookie.cookie_name);
  results[cookie.cookie_name] = traitResults;
  input.value = '';
  hideSuggestions(suggestBox);

  addGuessRow(traitResults, true);
  const summary = traitResults
    .slice(1)
    .map((t) => `${t.label} ${t.value} ${t.result === 'partial' ? 'close' : t.result}`)
    .join(', ');
  announce(`Guessed ${cookie.cookie_name}: ${summary}`);
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
    reenableWhenReady(input, submitBtn);
    saveState();
  }
}

const CELL_LABELS = ['Cookie', 'Primary', 'Secondary', 'Rarity', 'Type', 'Position'];

function announce(msg) {
  const el = document.getElementById('srAnnounce');
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = msg;
  });
}

function addGuessRow(traitResults, animate) {
  const row = document.createElement('div');
  row.className = 'guess-row';
  traitResults.forEach((trait, i) => {
    const cell = document.createElement('div');
    cell.className = `cell cell-${trait.result}`;
    cell.textContent = trait.value;
    const label = trait.label ?? CELL_LABELS[i] ?? '';
    const resultWord = trait.result === 'partial' ? 'close' : trait.result;
    const resultText = trait.result === 'name' ? '' : ` - ${resultWord}`;
    cell.setAttribute('aria-label', `${label}: ${trait.value}${resultText}`);
    if (animate) setTimeout(() => cell.classList.add('revealed'), i * 700);
    else cell.classList.add('instant');
    row.appendChild(cell);
  });
  historyEl.prepend(row);
}

// ─────────────────────────────────────────
// GAME 1 - META & HINT
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
        api(`/hint?trait=${trait}&state_token=${encodeURIComponent(g1StateToken || '')}`)
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
      showToast('Could not fetch hint - please try again.');
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
// GAME 1 - VICTORY
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
  const guessCount =
    guesses.length === 1 ? 'Got it in 1 guess!' : `Got it in ${guesses.length} guesses!`;
  announce(`Correct! The cookie was ${victoryData.name}. ${guessCount}`);

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
  g2.started = true;
  saveState();
  await showGame2();
});

// ─────────────────────────────────────────
// GAME 2 - SHOW & LOAD SKILL
// ─────────────────────────────────────────
async function showGame2() {
  game2Section.classList.add('show');
  game2Section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (!skillData) {
    skillNameEl.textContent = 'Loading...';
    skillCdEl.textContent = '';
    try {
      const res = await fetch(api('/skill'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      skillData = await res.json();
    } catch {
      showToast('Could not load skill - please refresh.');
      if (!g2.won) reenableWhenReady(input2, submitBtn2);
      return;
    }
  }

  skillNameEl.textContent = skillData.skill_name;
  skillCdEl.textContent = `Cooldown: ${skillData.skill_cooldown}s`;
  skillImgEl.src = api('/skill-image');
  skillImgEl.alt = skillData.skill_name;
  skillImgEl.style.display = '';

  if (!g2.won) {
    reenableWhenReady(input2, submitBtn2);
    input2.focus();
  }
}

// ─────────────────────────────────────────
// GAME 2 - GUESS LOGIC
// ─────────────────────────────────────────
submitBtn2.addEventListener('click', submitGuess2);

async function submitGuess2() {
  if (g2.won) return;
  const raw = input2.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found - check your spelling!');
    return;
  }
  if (g2.guesses.includes(cookie.cookie_name)) {
    alreadyEl2.textContent = `Already guessed ${cookie.cookie_name}!`;
    return;
  }
  input2.disabled = true;
  submitBtn2.disabled = true;
  alreadyEl2.textContent = '';

  let data;
  try {
    const res = await fetch(api('/guess2'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guess: cookie.cookie_name,
        state_token: g2.stateToken,
      }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error - please try again.');
    reenableWhenReady(input2, submitBtn2);
    return;
  }

  if (data.error) {
    showToast(data.error);
    reenableWhenReady(input2, submitBtn2);
    return;
  }
  if (data.state_token) g2.stateToken = data.state_token;

  g2.guesses.push(cookie.cookie_name);
  input2.value = '';
  hideSuggestions(suggestBox2);

  addGame2Row(cookie.cookie_name, data.correct, true);
  updateMeta2();
  updateHint2();

  if (data.correct) {
    g2.won = true;
    addToCollection(data.cookie_name);
    g2.victoryName = data.cookie_name;
    saveState();
    input2.disabled = true;
    submitBtn2.disabled = true;
    setTimeout(() => {
      document.getElementById('g2VicCount').textContent =
        g2.guesses.length === 1
          ? 'Got it in just 1 guess!'
          : `Got it in ${g2.guesses.length} guesses!`;
      document.getElementById('g2VicName').textContent = `🍪 ${data.cookie_name}`;
      const g2Img = document.getElementById('g2VictoryImg');
      g2Img.src = cookieImgSrc(data.cookie_name);
      g2Img.alt = data.cookie_name;
      g2Img.style.display = '';
      g2NextPrompt.classList.add('show');
      g2NextPrompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  } else {
    reenableWhenReady(input2, submitBtn2);
    saveState();
  }
}

function addGame2Row(name, correct, animate) {
  const row = document.createElement('div');
  row.className = `game2-row ${correct ? 'correct' : 'wrong'}`;
  row.setAttribute('aria-label', `${name}: ${correct ? 'correct' : 'wrong'}`);
  if (!animate) row.style.animation = 'none';
  const icon = document.createElement('span');
  icon.className = 'g2-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = correct ? '✅' : '❌';
  const label = document.createElement('span');
  label.className = 'g2-name';
  label.textContent = name;
  row.append(icon, label);
  game2History.prepend(row);
  announce(`Guessed ${name}: ${correct ? 'correct' : 'wrong'}`);
}

// ─────────────────────────────────────────
// GAME 2 - META & HINT
// ─────────────────────────────────────────
function updateMeta2() {
  if (!g2.guesses.length) {
    metaEl2.textContent = '';
    return;
  }
  metaEl2.textContent =
    g2.guesses.length === 1 ? '1 guess so far' : `${g2.guesses.length} guesses so far`;
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
  if (g2.won) {
    hintSection2.classList.remove('show');
    return;
  }
  hintSection2.classList.toggle('show', g2.wrongCount >= 5);
  if (g2.hintUsed && g2.hintValue && typeof g2.hintValue === 'object') {
    hintBtn2.style.display = 'none';
    renderHint2(hintReveal2, g2.hintValue);
    hintReveal2.classList.add('show');
  } else {
    hintBtn2.style.display = '';
    hintBtn2.disabled = false;
  }
}

hintBtn2.addEventListener('click', async () => {
  if (g2.hintUsed) return;
  hintBtn2.disabled = true;
  let data;
  try {
    const res = await fetch(api(`/hint2?state_token=${encodeURIComponent(g2.stateToken || '')}`));
    data = await res.json();
  } catch {
    showToast('Could not fetch hint - please try again.');
    hintBtn2.disabled = false;
    return;
  }
  if (data.error) {
    showToast(data.error);
    hintBtn2.disabled = false;
    return;
  }
  if (data.state_token) g2.stateToken = data.state_token;
  g2.hintUsed = true;
  g2.hintValue = { rarity: data.rarity, type: data.type, position: data.position };
  g2.hintAfterGuess = g2.guesses.length;
  saveState();
  hintBtn2.style.display = 'none';
  renderHint2(hintReveal2, g2.hintValue);
  hintReveal2.classList.add('show');
});

// ─────────────────────────────────────────
// GAME 3 - SHOW & LOAD SILHOUETTE
// ─────────────────────────────────────────
document.getElementById('g3NextBtn').addEventListener('click', async () => {
  g3.started = true;
  saveState();
  await showGame3();
});

async function showGame3() {
  game3Section.classList.add('show');
  game3Section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  silhouetteImg.src = g3.won ? cookieImgSrc(g3.victoryName) : api('/silhouette3-image');
  silhouetteImg.style.display = '';

  if (!g3.won) {
    reenableWhenReady(input3, submitBtn3);
    input3.focus();
  }
}

// ─────────────────────────────────────────
// GAME 3 - GUESS LOGIC
// ─────────────────────────────────────────
submitBtn3.addEventListener('click', submitGuess3);

async function submitGuess3() {
  if (g3.won) return;
  const raw = input3.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find((c) => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) {
    showToast('Cookie not found - check your spelling!');
    return;
  }
  if (g3.guesses.includes(cookie.cookie_name)) {
    alreadyEl3.textContent = `Already guessed ${cookie.cookie_name}!`;
    return;
  }
  input3.disabled = true;
  submitBtn3.disabled = true;
  alreadyEl3.textContent = '';

  let data;
  try {
    const res = await fetch(api('/guess3'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guess: cookie.cookie_name,
        state_token: g3.stateToken,
      }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error - please try again.');
    reenableWhenReady(input3, submitBtn3);
    return;
  }

  if (data.error) {
    showToast(data.error);
    reenableWhenReady(input3, submitBtn3);
    return;
  }
  if (data.state_token) g3.stateToken = data.state_token;

  g3.guesses.push(cookie.cookie_name);
  input3.value = '';
  hideSuggestions(suggestBox3);

  addGame3Row(cookie.cookie_name, data.correct, true);
  updateMeta3();
  updateHint3();

  if (data.correct) {
    g3.won = true;
    addToCollection(data.cookie_name);
    g3.victoryName = data.cookie_name;
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
    reenableWhenReady(input3, submitBtn3);
    saveState();
  }
}

function addGame3Row(name, correct, animate) {
  const row = document.createElement('div');
  row.className = `game2-row ${correct ? 'correct' : 'wrong'}`;
  row.setAttribute('aria-label', `${name}: ${correct ? 'correct' : 'wrong'}`);
  if (!animate) row.style.animation = 'none';
  const icon = document.createElement('span');
  icon.className = 'g2-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = correct ? '✅' : '❌';
  const label = document.createElement('span');
  label.className = 'g2-name';
  label.textContent = name;
  row.append(icon, label);
  game3History.prepend(row);
  announce(`Guessed ${name}: ${correct ? 'correct' : 'wrong'}`);
}

// ─────────────────────────────────────────
// GAME 3 - META & HINT
// ─────────────────────────────────────────
function updateMeta3() {
  if (!g3.guesses.length) {
    metaEl3.textContent = '';
    return;
  }
  metaEl3.textContent =
    g3.guesses.length === 1 ? '1 guess so far' : `${g3.guesses.length} guesses so far`;
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
  if (g3.won) {
    hintSection3.classList.remove('show');
    return;
  }
  hintSection3.classList.toggle('show', g3.wrongCount >= 5);
  if (g3.hintUsed && g3.hintValue && typeof g3.hintValue === 'object') {
    hintBtn3.style.display = 'none';
    renderHint3(hintReveal3, g3.hintValue);
    hintReveal3.classList.add('show');
  } else {
    hintBtn3.style.display = '';
    hintBtn3.disabled = false;
  }
}

hintBtn3.addEventListener('click', async () => {
  if (g3.hintUsed) return;
  hintBtn3.disabled = true;
  let data;
  try {
    const res = await fetch(api(`/hint3?state_token=${encodeURIComponent(g3.stateToken || '')}`));
    data = await res.json();
  } catch {
    showToast('Could not fetch hint - please try again.');
    hintBtn3.disabled = false;
    return;
  }
  if (data.error) {
    showToast(data.error);
    hintBtn3.disabled = false;
    return;
  }
  if (data.state_token) g3.stateToken = data.state_token;
  g3.hintUsed = true;
  g3.hintValue = { primary_color: data.primary_color, type: data.type, rarity: data.rarity };
  g3.hintAfterGuess = g3.guesses.length;
  saveState();
  hintBtn3.style.display = 'none';
  renderHint3(hintReveal3, g3.hintValue);
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
    s.totalWon > 0 ? (s.totalGuesses / s.totalWon).toFixed(1) : '-';
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

function loadImgWithRetry(img, src, attempt = 0) {
  img.src = src;
  img.onerror = () => {
    if (attempt < 4) {
      setTimeout(() => loadImgWithRetry(img, src, attempt + 1), 400 * (attempt + 1));
    }
  };
}

let _collectionObserver = null;

function getCollectionObserver() {
  if (_collectionObserver) _collectionObserver.disconnect();
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.dataset.lazySrc;
        if (src) {
          loadImgWithRetry(img, src);
          delete img.dataset.lazySrc;
        }
        obs.unobserve(img);
      });
    },
    { root: collectionGrid, rootMargin: '200px' }
  );
  _collectionObserver = obs;
  return obs;
}

function renderCollection() {
  const found = new Set(getCollection());
  collectionCount.textContent = `${found.size} / ${COOKIES.length} identified`;
  collectionGrid.textContent = '';
  const observer = getCollectionObserver();

  COOKIES.forEach((c) => {
    const item = document.createElement('div');
    const iFound = found.has(c.cookie_name);
    item.className = `collection-item ${iFound ? 'found' : 'missing'}`;
    item.title = iFound ? c.cookie_name : '???';

    if (iFound) {
      const img = document.createElement('img');
      img.alt = c.cookie_name;
      img.width = 64;
      img.height = 64;
      img.dataset.lazySrc = cookieImgSrc(c.cookie_name);
      observer.observe(img);
      item.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'collection-placeholder';
      placeholder.setAttribute('aria-hidden', 'true');
      item.appendChild(placeholder);
    }

    const label = document.createElement('div');
    label.className = 'collection-name';
    label.textContent = iFound ? c.cookie_name : '???';
    item.appendChild(label);
    collectionGrid.appendChild(item);
  });
}

function openCollection() {
  renderCollection();
  collectionModal.showModal();
}
function closeCollection() {
  collectionModal.close();
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
  tutorialModal.showModal();
}
function closeTutorial() {
  tutorialModal.close();
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
function openStats() {
  renderStats();
  statsModal.showModal();
}
function closeStats() {
  statsModal.close();
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
  finalSub.textContent = `Game 1: ${guesses.length} guess${guesses.length === 1 ? '' : 'es'} · Game 2: ${g2.guesses.length} guess${g2.guesses.length === 1 ? '' : 'es'} · Game 3: ${g3.guesses.length} guess${g3.guesses.length === 1 ? '' : 'es'}`;
  finalCookieEl.textContent = `🍪 ${g3.victoryName}`;
  if (!animate) finalVictory.style.animation = 'none';
  finalVictory.classList.add('show');
  announce(`Daily complete! All three games finished.`);
  if (animate && !IS_ARCHIVE)
    recordCompletion(guesses.length + g2.guesses.length + g3.guesses.length);
  statsBtn.style.display = '';
  if (!IS_ARCHIVE) startNextCookieTimer();
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
  nextTimerEl.textContent = `Next cookies in ${h}:${m}:${s}`;
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

// ─────────────────────────────────────────
// SHARE CARD (Canvas)
// ─────────────────────────────────────────
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function generateShareCanvas() {
  const W = 420,
    PAD = 20,
    IW = W - PAD * 2;
  const ACCENT_H = 4,
    HEADER_H = 56,
    DIVIDER_GAP = 12;
  const LABEL_H = 28,
    CELL_H = 26,
    CELL_GAP = 5,
    ROW_H = CELL_H + CELL_GAP;
  const SZ = 22,
    SG = 6;
  const SECTION_GAP = 14;
  const ITEMS_PER_LINE = Math.floor((IW + SG) / (SZ + SG));

  const sectionData = [];
  if (guesses.length > 0) {
    sectionData.push({
      label: `Game 1  ·  ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}  ${won ? '✅' : '❌'}`,
      type: 'grid',
      rows: withHint([...guesses], hintUsed, hintAfterGuess),
    });
  }
  if (g2.started && g2.guesses.length > 0) {
    sectionData.push({
      label: `Game 2  ·  ${g2.guesses.length} guess${g2.guesses.length === 1 ? '' : 'es'}  ${g2.won ? '✅' : '❌'}`,
      type: 'indicators',
      items: withHint(
        g2.guesses.map((n) => n === g2.victoryName),
        g2.hintUsed,
        g2.hintAfterGuess
      ),
    });
  }
  if (g3.started && g3.guesses.length > 0) {
    sectionData.push({
      label: `Game 3  ·  ${g3.guesses.length} guess${g3.guesses.length === 1 ? '' : 'es'}  ${g3.won ? '✅' : '❌'}`,
      type: 'indicators',
      items: withHint(
        g3.guesses.map((n) => n === g3.victoryName),
        g3.hintUsed,
        g3.hintAfterGuess
      ),
    });
  }

  // Compute canvas height
  const sectionHeights = sectionData.map((s) => {
    if (s.type === 'grid') return LABEL_H + s.rows.length * ROW_H;
    return LABEL_H + Math.ceil(s.items.length / ITEMS_PER_LINE) * (SZ + SG);
  });
  const contentH =
    sectionHeights.reduce((a, h) => a + h, 0) + Math.max(0, sectionData.length - 1) * SECTION_GAP;
  const H = ACCENT_H + PAD + HEADER_H + DIVIDER_GAP + contentH + SECTION_GAP + 46 + PAD;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);

  // Accent gradient bar
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#e94560');
  grad.addColorStop(0.5, '#f5a623');
  grad.addColorStop(1, '#e94560');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, ACCENT_H);

  let y = ACCENT_H + PAD;

  // Header: logo icon + title + date
  const logoImg = document.querySelector('.logo-icon');
  if (logoImg?.complete && logoImg.naturalWidth > 0) {
    ctx.drawImage(logoImg, PAD, y + 6, 40, 40);
  }
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#e0e0e0';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.fillText('Cookiedle', PAD + 52, y + 12);
  ctx.fillStyle = '#7a8aa0';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'right';
  const shareDate = IS_ARCHIVE
    ? (() => {
        const [sy, sm, sd] = ARCHIVE_DATE.split('-').map(Number);
        return (
          new Date(Date.UTC(sy, sm - 1, sd)).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }) + ' (Archive)'
        );
      })()
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  ctx.fillText(shareDate, W - PAD, y + 14);
  ctx.textAlign = 'left';
  y += HEADER_H;

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(PAD, y, IW, 1);
  y += DIVIDER_GAP;

  // Game sections
  sectionData.forEach((section, si) => {
    if (si > 0) y += SECTION_GAP;

    ctx.fillStyle = '#7a8aa0';
    ctx.font = '600 13px system-ui, sans-serif';
    ctx.fillText(section.label, PAD, y);
    y += LABEL_H;

    if (section.type === 'grid') {
      const CELL_W = (IW - 4 * CELL_GAP) / 5;
      section.rows.forEach((item) => {
        if (item === '💡') {
          ctx.fillStyle = '#f5a623';
          ctx.font = '12px system-ui, sans-serif';
          ctx.fillText('— hint used —', PAD, y + 7);
          y += ROW_H;
          return;
        }
        (results[item] || []).slice(1).forEach((trait, i) => {
          ctx.fillStyle =
            trait.result === 'correct'
              ? '#4caf50'
              : trait.result === 'partial'
                ? '#ff9800'
                : '#e94560';
          drawRoundRect(ctx, PAD + i * (CELL_W + CELL_GAP), y, CELL_W, CELL_H, 4);
          ctx.fill();
        });
        y += ROW_H;
      });
    } else {
      const startY = y;
      section.items.forEach((item, idx) => {
        const col = idx % ITEMS_PER_LINE;
        const row = Math.floor(idx / ITEMS_PER_LINE);
        const ix = PAD + col * (SZ + SG);
        const iy = startY + row * (SZ + SG);
        if (item === '💡') {
          ctx.fillStyle = '#f5a623';
          ctx.font = 'bold 15px system-ui, sans-serif';
          ctx.fillText('💡', ix + 2, iy + 2);
        } else {
          ctx.fillStyle = item ? '#4caf50' : '#e94560';
          drawRoundRect(ctx, ix, iy, SZ, SZ, 4);
          ctx.fill();
        }
      });
      y += Math.ceil(section.items.length / ITEMS_PER_LINE) * (SZ + SG);
    }
  });

  // Footer
  y += SECTION_GAP;
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(PAD, y, IW, 1);
  y += 12;
  ctx.fillStyle = '#f5a623';
  ctx.font = '600 14px system-ui, sans-serif';
  ctx.fillText(IS_ARCHIVE ? '📅 Archive' : `🔥 Streak: ${loadStats().currentStreak}`, PAD, y);
  ctx.fillStyle = '#7a8aa0';
  ctx.font = '13px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('cookiedle.nappi.work', W - PAD, y);
  ctx.textAlign = 'left';

  return canvas;
}

async function shareResults() {
  let canvas;
  try {
    canvas = generateShareCanvas();
  } catch {
    showToast('Could not generate share card.');
    return;
  }
  canvas.toBlob(async (blob) => {
    if (!blob) {
      showToast('Could not generate image.');
      return;
    }
    const file = new File([blob], 'cookiedle.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Cookiedle' });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;
      }
    }
    // Fallback: download the image
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cookiedle-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Image saved!');
  }, 'image/png');
}

shareBtn.addEventListener('click', shareResults);

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
async function init() {
  if (!IS_ARCHIVE) {
    startHeaderCountdown();
  } else {
    const [ay, am, ad] = ARCHIVE_DATE.split('-').map(Number);
    const todayISO = new Date().toISOString().slice(0, 10);
    const picker = document.getElementById('archiveDatePicker');
    if (picker) {
      picker.value = `${ay}-${String(am).padStart(2, '0')}-${String(ad).padStart(2, '0')}`;
      picker.max = todayISO;
      picker.addEventListener('change', () => {
        if (picker.value) location.href = `/archive?date=${picker.value}`;
      });
    }
    const prevBtn = document.getElementById('archivePrev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = new Date(Date.UTC(ay, am - 1, ad - 1));
        location.href = `/archive?date=${prev.toISOString().slice(0, 10)}`;
      });
    }
    const nextBtn = document.getElementById('archiveNext');
    if (nextBtn) {
      const nextDay = new Date(Date.UTC(ay, am - 1, ad + 1));
      if (nextDay.toISOString().slice(0, 10) > todayISO) nextBtn.disabled = true;
      nextBtn.addEventListener('click', () => {
        const n = new Date(Date.UTC(ay, am - 1, ad + 1));
        if (n.toISOString().slice(0, 10) <= todayISO)
          location.href = `/archive?date=${n.toISOString().slice(0, 10)}`;
      });
    }
  }

  input.disabled = true;
  submitBtn.disabled = true;
  input.placeholder = 'Loading cookies...';

  try {
    const res = await fetch(`${WORKER_URL}/roster`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    COOKIES.splice(0, COOKIES.length, ...(await res.json()));
  } catch (e) {
    input.placeholder = 'Type a cookie name...';
    input.disabled = false;
    submitBtn.disabled = false;
    showToast('Could not load cookie list - please refresh.');
    console.error('Failed to load cookies:', e);
    return;
  }

  // Fetch initial signed state tokens for all three daily games if not already stored.
  // This ensures every guess carries a server-validated token, preventing hint-gate resets.
  if (!g1StateToken || !g2.stateToken || !g3.stateToken) {
    try {
      const res = await fetch(api('/daily-state'));
      if (res.ok) {
        const data = await res.json();
        if (!g1StateToken && data.g1) g1StateToken = data.g1;
        if (!g2.stateToken && data.g2) g2.stateToken = data.g2;
        if (!g3.stateToken && data.g3) g3.stateToken = data.g3;
        saveState();
      }
    } catch {}
  }

  input.placeholder = 'Type a cookie name...';
  if (!won) {
    reenableWhenReady(input, submitBtn);
  }

  try {
    const res = await fetch(api('/skill'));
    if (res.ok) skillData = await res.json();
  } catch {}

  restoreSession();

  if (!IS_ARCHIVE && !localStorage.getItem('seen_tutorial')) openTutorial();
}

init();
