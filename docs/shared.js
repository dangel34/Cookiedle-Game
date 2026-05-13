// ─────────────────────────────────────────
// SHARED — loaded on every page
// ─────────────────────────────────────────

const WORKER_URL = 'https://cookiedle-worker.personal-account-bc0.workers.dev';

// Cookie list — populated by each page's init()
let COOKIES = [];

// Trait display labels
const TRAIT_LABELS = {
  primary_color: 'Primary Color',
  secondary_color: 'Secondary Color',
  rarity: 'Rarity',
  type: 'Type',
  position: 'Position',
};

// ─────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
}

// ─────────────────────────────────────────
// AUTOCOMPLETE HELPERS
// ─────────────────────────────────────────
function buildSuggestions(val, usedList, box) {
  if (!val || !COOKIES.length) {
    // NOSONAR — COOKIES is populated by init() before any user interaction
    hideSuggestions(box);
    return;
  }
  const q = val.toLowerCase();
  const scored = COOKIES.map((c) => c.cookie_name)
    .filter((name) => {
      const n = name.toLowerCase();
      return (
        n.startsWith(q) || n.split(' ').some((word) => word !== 'cookie' && word.startsWith(q))
      );
    })
    .sort((a, b) => {
      const an = a.toLowerCase(),
        bn = b.toLowerCase();
      const aStart = an.startsWith(q) ? 0 : 1;
      const bStart = bn.startsWith(q) ? 0 : 1;
      return aStart - bStart || a.localeCompare(b);
    })
    .slice(0, 8);
  if (!scored.length) {
    hideSuggestions(box);
    return;
  }
  box.innerHTML = '';
  scored.forEach((name) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item' + (usedList.includes(name) ? ' used' : '');
    div.textContent = name;
    div.addEventListener('mousedown', (e) => {
      e.preventDefault();
      selectSuggestion(name, box._input, box);
    });
    box.appendChild(div);
  });
  box.style.display = 'block';
}

function hideSuggestions(box) {
  box.style.display = 'none';
  box.innerHTML = '';
}

function selectSuggestion(name, inp, box) {
  inp.value = name;
  hideSuggestions(box);
  inp.focus();
}

function updateActiveSugg(items, activeIdx, inp) {
  items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
  if (activeIdx >= 0) inp.value = items[activeIdx].textContent;
}

// Wire a suggestion box to its input so buildSuggestions can reference it
function bindSuggestionBox(inp, box) {
  box._input = inp;
}

function cookieImgSrc(name) {
  const safe = name.replace(/[^a-zA-Z0-9 '\-À-ɏ]/g, '');
  return `${WORKER_URL}/cookie_images/${safe.replaceAll(' ', '_')}.webp`;
}
