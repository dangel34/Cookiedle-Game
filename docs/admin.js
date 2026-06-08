const WORKER_URL =
  location.hostname === 'cookiedle.nappi.work'
    ? `${location.origin}/api`
    : 'https://cookiedle-worker.personal-account-bc0.workers.dev';

let adminToken = sessionStorage.getItem('admin_token') || '';
let allCookies = [];
let editingName = null;

const $ = (id) => document.getElementById(id);

// ── TOAST ──
function toast(msg, ok = true) {
  const el = $('toast');
  el.textContent = msg;
  el.style.background = ok ? 'var(--green)' : 'var(--red)';
  el.style.color = '#fff';
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 2800);
}

// ── AUTH ──
async function tryLogin() {
  const token = $('tokenInput').value.trim();
  if (!token) {
    $('loginError').textContent = 'Please enter a token.';
    return;
  }
  $('loginError').textContent = '';
  $('loginBtn').textContent = 'Logging in…';
  $('loginBtn').disabled = true;
  const ok = await loadCookies(token);
  $('loginBtn').textContent = 'Login';
  $('loginBtn').disabled = false;
  if (ok === true) {
    adminToken = token;
    sessionStorage.setItem('admin_token', token);
    $('loginSection').style.display = 'none';
    $('mainSection').style.display = '';
  } else if (ok === 'unauthorized') {
    $('loginError').textContent = '✕ Wrong token.';
    $('tokenInput').select();
  } else {
    $('loginError').textContent = '✕ Could not reach the worker — is it deployed?';
    $('tokenInput').select();
  }
}

$('loginBtn').addEventListener('click', tryLogin);
$('tokenInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') tryLogin();
});
$('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('admin_token');
  adminToken = '';
  $('mainSection').style.display = 'none';
  $('loginSection').style.display = '';
  $('tokenInput').value = '';
});

// ── API HELPERS ──
function apiHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };
}

async function loadCookies(token = adminToken) {
  try {
    const res = await fetch(`${WORKER_URL}/admin/cookies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) return 'unauthorized';
    if (!res.ok) return false;
    const data = await res.json();
    allCookies = data.cookies;
    renderTable($('searchInput').value);
    return true;
  } catch {
    return false;
  }
}

// ── TABLE ──
function renderTable(filter = '') {
  const q = filter.toLowerCase();
  const rows = allCookies.filter(
    (c) =>
      !q ||
      c.cookie_name.toLowerCase().includes(q) ||
      c.rarity.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) ||
      c.position.toLowerCase().includes(q)
  );
  $('cookieCount').textContent = `${rows.length} / ${allCookies.length} cookies`;
  const tbody = $('tableBody');
  tbody.innerHTML = '';
  rows.forEach((c) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="tbl-name">${esc(c.cookie_name)}</td>
      <td>${esc(c.primary_color)}</td>
      <td>${esc(c.secondary_color)}</td>
      <td>${esc(c.rarity)}</td>
      <td>${esc(c.type)}</td>
      <td>${esc(c.position)}</td>
      <td>${esc(c.skill_name)}</td>
      <td>${c.skill_cooldown}s</td>
      <td class="tbl-actions">
        <button class="tbl-edit-btn" data-name="${esc(c.cookie_name)}">Edit</button>
        <button class="tbl-del-btn" data-name="${esc(c.cookie_name)}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  tbody
    .querySelectorAll('.tbl-edit-btn')
    .forEach((btn) => btn.addEventListener('click', () => openDialog(btn.dataset.name)));
  tbody
    .querySelectorAll('.tbl-del-btn')
    .forEach((btn) => btn.addEventListener('click', () => confirmDelete(btn.dataset.name)));
}

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

$('searchInput').addEventListener('input', (e) => renderTable(e.target.value));

// ── DIALOG ──
function openDialog(name = null) {
  editingName = name;
  $('formError').textContent = '';
  $('dialogTitle').textContent = name ? 'Edit Cookie' : 'Add Cookie';
  if (name) {
    const c = allCookies.find((x) => x.cookie_name === name);
    if (!c) return;
    $('f_name').value = c.cookie_name;
    $('f_primary').value = c.primary_color;
    $('f_secondary').value = c.secondary_color;
    $('f_rarity').value = c.rarity;
    $('f_type').value = c.type;
    $('f_position').value = c.position;
    $('f_skill').value = c.skill_name;
    $('f_cooldown').value = c.skill_cooldown;
  } else {
    $('cookieForm').reset();
  }
  $('cookieDialog').showModal();
}

function closeDialog() {
  $('cookieDialog').close();
}

$('addBtn').addEventListener('click', () => openDialog(null));
$('cancelBtn').addEventListener('click', closeDialog);
$('cookieDialog').addEventListener('click', (e) => {
  if (e.target === $('cookieDialog')) closeDialog();
});

// ── CONFIRM DIALOG ──
function showConfirm(msg) {
  return new Promise((resolve) => {
    $('confirmMsg').textContent = msg;
    $('confirmDialog').showModal();
    function onOk() { cleanup(); resolve(true); }
    function onCancel() { cleanup(); resolve(false); }
    function onBdClick(e) { if (e.target === $('confirmDialog')) { cleanup(); resolve(false); } }
    function cleanup() {
      $('confirmOkBtn').removeEventListener('click', onOk);
      $('confirmCancelBtn').removeEventListener('click', onCancel);
      $('confirmDialog').removeEventListener('click', onBdClick);
      $('confirmDialog').close();
    }
    $('confirmOkBtn').addEventListener('click', onOk);
    $('confirmCancelBtn').addEventListener('click', onCancel);
    $('confirmDialog').addEventListener('click', onBdClick);
  });
}

$('saveBtn').addEventListener('click', async () => {
  $('formError').textContent = '';
  const body = {
    cookie_name: $('f_name').value.trim(),
    primary_color: $('f_primary').value.trim(),
    secondary_color: $('f_secondary').value.trim(),
    rarity: $('f_rarity').value,
    type: $('f_type').value,
    position: $('f_position').value,
    skill_name: $('f_skill').value.trim(),
    skill_cooldown: Number.parseFloat($('f_cooldown').value),
  };
  if (!body.cookie_name || !body.primary_color || !body.secondary_color || !body.skill_name) {
    $('formError').textContent = 'All text fields are required.';
    return;
  }
  $('saveBtn').textContent = 'Saving…';
  $('saveBtn').disabled = true;
  try {
    let res;
    if (editingName) {
      res = await fetch(`${WORKER_URL}/admin/cookies?name=${encodeURIComponent(editingName)}`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch(`${WORKER_URL}/admin/cookies`, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify(body),
      });
    }
    const data = await res.json();
    if (!res.ok) {
      $('formError').textContent = data.error || 'Save failed.';
      return;
    }
    if (editingName) {
      const idx = allCookies.findIndex(
        (c) => c.cookie_name.toLowerCase() === editingName.toLowerCase()
      );
      if (idx !== -1) allCookies[idx] = data.cookie;
    } else {
      allCookies.push(data.cookie);
    }
    renderTable($('searchInput').value);
    closeDialog();
    toast(editingName ? 'Cookie updated.' : 'Cookie added.');
  } catch {
    $('formError').textContent = 'Network error.';
  } finally {
    $('saveBtn').textContent = 'Save';
    $('saveBtn').disabled = false;
  }
});

// ── DELETE ──
async function confirmDelete(name) {
  if (!await showConfirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${WORKER_URL}/admin/cookies?name=${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      toast(data.error || 'Delete failed.', false);
      return;
    }
    allCookies = allCookies.filter((c) => c.cookie_name !== name);
    renderTable($('searchInput').value);
    toast(`"${name}" deleted.`);
  } catch {
    toast('Network error.', false);
  }
}

// ── SEED ──
$('seedBtn').addEventListener('click', async () => {
  if (!await showConfirm('Seed KV with the bundled cookies.json? This overwrites current KV data.')) return;
  try {
    const res = await fetch(`${WORKER_URL}/admin/cookies/seed`, {
      method: 'POST',
      headers: apiHeaders(),
    });
    const d = await res.json();
    if (!res.ok) {
      toast(d.error || 'Seed failed.', false);
      return;
    }
    await loadCookies();
    toast(`KV seeded — ${d.count} cookies.`);
  } catch {
    toast('Seed failed.', false);
  }
});

// ── INIT ──
if (adminToken) {
  loadCookies().then((ok) => {
    if (ok === true) {
      $('loginSection').style.display = 'none';
      $('mainSection').style.display = '';
    } else {
      sessionStorage.removeItem('admin_token');
      adminToken = '';
    }
  });
}
