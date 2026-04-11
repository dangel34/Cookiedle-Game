// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
let token     = null;
let guesses   = [];
let won       = false;
let round     = 1;
let solved    = 0;
let hintUsed  = false;
let hintTrait = null;
let hintValue = null;
let activeSuggestion = -1;

// ─────────────────────────────────────────
// DOM REFS
// ─────────────────────────────────────────
const input       = document.getElementById('guessInput');
const suggestBox  = document.getElementById('suggestions');
const submitBtn   = document.getElementById('submitBtn');
const historyEl   = document.getElementById('guessHistory');
const metaEl      = document.getElementById('guessMeta');
const alreadyEl   = document.getElementById('alreadyGuessed');
const hintSection = document.getElementById('hintSection');
const hintBtn     = document.getElementById('hintBtn');
const hintPicker  = document.getElementById('hintPicker');
const hintReveal  = document.getElementById('hintReveal');
const victoryEl   = document.getElementById('victoryBanner');
const vicCountEl  = document.getElementById('vicCount');
const vicNameEl   = document.getElementById('vicName');
const vicSkillEl  = document.getElementById('vicSkill');
const vicSolvedEl = document.getElementById('vicSolved');
const newCookieBtn= document.getElementById('newCookieBtn');
const roundNumEl  = document.getElementById('roundNum');
const solvedNumEl = document.getElementById('solvedNum');

// Bind suggestion box to its input for shared autocomplete
bindSuggestionBox(input, suggestBox);

// ─────────────────────────────────────────
// AUTOCOMPLETE — event listeners
// ─────────────────────────────────────────
input.addEventListener('input', () => {
  activeSuggestion = -1;
  alreadyEl.textContent = '';
  buildSuggestions(input.value.trim(), guesses, suggestBox);
});

input.addEventListener('keydown', e => {
  const items = suggestBox.querySelectorAll('.suggestion-item');
  if (e.key === 'ArrowDown') { e.preventDefault(); activeSuggestion = Math.min(activeSuggestion + 1, items.length - 1); updateActiveSugg(items, activeSuggestion, input); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); activeSuggestion = Math.max(activeSuggestion - 1, -1); updateActiveSugg(items, activeSuggestion, input); }
  else if (e.key === 'Enter') { if (activeSuggestion >= 0 && items[activeSuggestion]) { e.preventDefault(); selectSuggestion(items[activeSuggestion].textContent, input, suggestBox); } else { submitGuess(); } }
  else if (e.key === 'Escape') { hideSuggestions(suggestBox); }
});

document.addEventListener('click', e => { if (!e.target.closest('.input-wrap')) hideSuggestions(suggestBox); });

// ─────────────────────────────────────────
// GUESS
// ─────────────────────────────────────────
submitBtn.addEventListener('click', submitGuess);

async function submitGuess() {
  if (won || !token) return;
  const raw = input.value.trim();
  if (!raw) return;

  const cookie = COOKIES.find(c => c.cookie_name.toLowerCase() === raw.toLowerCase());
  if (!cookie) { showToast('Cookie not found — check your spelling!'); return; }
  if (guesses.includes(cookie.cookie_name)) { alreadyEl.textContent = `Already guessed ${cookie.cookie_name}!`; return; }

  input.disabled = true; submitBtn.disabled = true; alreadyEl.textContent = '';

  let data;
  try {
    const res = await fetch(`${WORKER_URL}/unlimited/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, guess: cookie.cookie_name }),
    });
    data = await res.json();
  } catch {
    showToast('Connection error — please try again.');
    input.disabled = false; submitBtn.disabled = false;
    return;
  }

  if (data.error) {
    if (data.error.includes('expired')) {
      showToast('Session expired — fetching a new cookie...');
      await fetchNewToken();
    } else {
      showToast(data.error);
    }
    input.disabled = false; submitBtn.disabled = false;
    return;
  }

  const traitResults = [
    { value: cookie.cookie_name,     result: 'name' },
    { value: cookie.primary_color,   result: data.primary_color },
    { value: cookie.secondary_color, result: data.secondary_color },
    { value: cookie.rarity,          result: data.rarity },
    { value: cookie.type,            result: data.type },
    { value: cookie.position,        result: data.position },
  ];

  guesses.push(cookie.cookie_name);
  input.value = '';
  hideSuggestions(suggestBox);
  addGuessRow(traitResults, true);
  updateMeta();
  updateHint();

  if (data.correct) {
    won = true; solved++;
    solvedNumEl.textContent = solved;
    input.disabled = true; submitBtn.disabled = true;
    setTimeout(() => showVictory(data), 6 * 700 + 400);
  } else {
    input.disabled = false; submitBtn.disabled = false;
  }
}

function addGuessRow(traitResults, animate) {
  const row = document.createElement('div');
  row.className = 'guess-row';
  traitResults.forEach((trait, i) => {
    const cell = document.createElement('div');
    cell.className = `cell cell-${trait.result}`;
    cell.textContent = trait.value;
    if (!animate) cell.classList.add('instant');
    else setTimeout(() => cell.classList.add('revealed'), i * 700);
    row.appendChild(cell);
  });
  historyEl.prepend(row);
}

// ─────────────────────────────────────────
// META & HINT
// ─────────────────────────────────────────
function wrongCount() { return won ? guesses.length - 1 : guesses.length; }

function updateMeta() {
  if (!guesses.length) { metaEl.textContent = ''; return; }
  metaEl.textContent = guesses.length === 1 ? '1 guess so far' : `${guesses.length} guesses so far`;
}

function updateHint() {
  if (won) { hintSection.classList.remove('show'); return; }
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

hintPicker.querySelectorAll('.hint-choice').forEach(btn => {
  btn.addEventListener('click', async () => {
    const trait = btn.dataset.trait;
    let value;
    try {
      const res = await fetch(`${WORKER_URL}/unlimited/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, trait }),
      });
      const data = await res.json();
      if (data.error) { showToast(data.error); hintBtn.disabled = false; return; }
      value = data.value;
    } catch { showToast('Could not fetch hint — please try again.'); hintBtn.disabled = false; return; }
    hintUsed = true; hintTrait = trait; hintValue = value;
    hintBtn.style.display = 'none';
    hintPicker.classList.remove('show');
    hintReveal.textContent = `💡 ${TRAIT_LABELS[trait]}: ${value}`;
    hintReveal.classList.add('show');
  });
});

// ─────────────────────────────────────────
// VICTORY
// ─────────────────────────────────────────
function showVictory(data) {
  vicCountEl.textContent = guesses.length === 1 ? 'Got it in just 1 guess!' : `Got it in ${guesses.length} guesses!`;
  vicNameEl.textContent  = `🍪 ${data.cookie_name}`;
  vicSkillEl.textContent = '';
  if (data.skill_name) {
    const skillSpan = document.createElement('span');
    skillSpan.textContent = data.skill_name;
    const cdSpan = document.createElement('span');
    cdSpan.textContent = `${data.skill_cooldown}s`;
    vicSkillEl.append('Skill: ', skillSpan, ' · Cooldown: ', cdSpan);
  }
  vicSolvedEl.textContent = solved;
  const victoryImg = document.getElementById('victoryImg');
  victoryImg.src   = `cookie_images/${data.cookie_name.replace(/ /g, '_')}.webp`;
  victoryImg.alt   = data.cookie_name;
  victoryImg.style.animation = '';
  victoryImg.style.display   = '';
  victoryEl.classList.add('show');
}

newCookieBtn.addEventListener('click', startNewRound);

async function startNewRound() {
  guesses   = [];
  won       = false;
  hintUsed  = false;
  hintTrait = null;
  hintValue = null;
  token     = null;
  round++;

  historyEl.innerHTML   = '';
  metaEl.textContent    = '';
  alreadyEl.textContent = '';
  hintSection.classList.remove('show');
  hintBtn.style.display = '';
  hintBtn.disabled = false;
  hintPicker.classList.remove('show');
  hintReveal.classList.remove('show');
  hintReveal.textContent = '';
  victoryEl.classList.remove('show');
  victoryEl.style.animation = '';
  const victoryImg = document.getElementById('victoryImg');
  victoryImg.style.display = 'none';
  victoryImg.src = '';
  roundNumEl.textContent = round;

  input.disabled     = true;
  submitBtn.disabled = true;
  input.placeholder  = 'Loading...';

  await fetchNewToken();

  input.placeholder  = 'Type a cookie name...';
  input.disabled     = false;
  submitBtn.disabled = false;
  input.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─────────────────────────────────────────
// TOKEN FETCH
// ─────────────────────────────────────────
async function fetchNewToken() {
  try {
    const res = await fetch(`${WORKER_URL}/unlimited/new`);
    const data = await res.json();
    token = data.token;
  } catch {
    showToast('Could not load a new cookie — please refresh.');
  }
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
async function init() {
  input.placeholder = 'Loading cookies...';

  try {
    const res = await fetch(`${WORKER_URL}/cookies`);
    if (!res.ok) throw new Error();
    COOKIES = await res.json();
  } catch {
    showToast('Could not load cookies — please refresh.');
    return;
  }

  await fetchNewToken();

  input.placeholder  = 'Type a cookie name...';
  input.disabled     = false;
  submitBtn.disabled = false;
  input.focus();
}

init();
