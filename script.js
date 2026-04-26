// ── FORMATIONS ────────────────────────────────────────────────────────────
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyI1aAv9CHrr6iAckRbM_qcpWfiKFMePIRm1xVadm7ACICNllCA4mFk7eMWo3PTZlwQIA/exec";
async function getReadingFromBackend(payload) {
  const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Reading failed");
  }

  return data.html;
}

const FORMATIONS = [
  {
    id: 'single',
    name: 'Single Card',
    desc: 'One card for direct, focused guidance',
    cardCount: 1,
    positions: ['Your Message']
  },
  {
    id: 'past_present_future',
    name: 'Three Card: Past · Present · Future',
    desc: 'The classic three-card spread',
    cardCount: 3,
    positions: ['Past', 'Present', 'Future']
  },
  {
    id: 'love_triangle',
    name: 'Love Triangle',
    desc: 'Three positions exploring relationship dynamics',
    cardCount: 3,
    positions: ['You in This Relationship', 'The Other Person', 'The Relationship Itself']
  },
  {
    id: 'five_cross',
    name: 'Five Card Cross',
    desc: 'A cross-shaped spread for deeper context',
    cardCount: 5,
    positions: ['Present Situation', 'The Challenge', 'The Past', 'The Future', 'Likely Outcome']
  },
  {
    id: 'horseshoe',
    name: 'Horseshoe Spread',
    desc: 'Seven positions in a horseshoe arc',
    cardCount: 7,
    positions: [
      'The Past',
      'The Present',
      'Hidden Influences',
      'Obstacles',
      'External Influences',
      'Best Course of Action',
      'Likely Outcome'
    ]
  },
  {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    desc: 'The classic ten-card deep-dive spread',
    cardCount: 10,
    positions: [
      'Present Situation',
      'The Challenge',
      'Foundation',
      'Recent Past',
      'Best Outcome',
      'Immediate Future',
      'Your Attitude',
      'External Influences',
      'Hopes & Fears',
      'Final Outcome'
    ]
  }
];

// ── SPREAD LAYOUT CONFIGS ─────────────────────────────────────────────────
const SPREAD_CSS = {
  'single':              'spread-single',
  'past_present_future': 'spread-past-present-future',
  'love_triangle':       'spread-love-triangle',
  'five_cross':          'spread-five-cross',
  'horseshoe':           'spread-horseshoe',
  'celtic_cross':        'spread-celtic-cross'
};
const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

// ── APP STATE ─────────────────────────────────────────────────────────────
const appState = {
  category: '',
  categoryLabel: '',
  selectedCards: [],
  formation: FORMATIONS[1], // default: past_present_future
  maxCards: 10
};

// ── FUZZY SEARCH ENGINE ───────────────────────────────────────────────────
const SUIT_SYNONYMS = {
  'coins':  'pentacles',
  'coin':   'pentacles',
  'disks':  'pentacles',
  'disk':   'pentacles',
  'rods':   'wands',
  'rod':    'wands',
  'staves': 'wands',
  'batons': 'wands'
};

const NUM_WORDS = {
  'zero': '0',  'one': '1',   'two': '2',   'three': '3', 'four': '4',
  'five': '5',  'six': '6',   'seven': '7', 'eight': '8', 'nine': '9',
  'ten': '10',  'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14',
  'ace': '1',   'page': '11', 'knight': '12', 'queen': '13', 'king': '14'
};

function normalizeQuery(raw) {
  let q = raw.toLowerCase().trim();
  for (const [syn, canon] of Object.entries(SUIT_SYNONYMS)) {
    q = q.replace(new RegExp('\\b' + syn + '\\b', 'g'), canon);
  }
  for (const [word, digit] of Object.entries(NUM_WORDS)) {
    q = q.replace(new RegExp('\\b' + word + '\\b', 'g'), digit);
  }
  return q;
}

function searchCards(rawQuery) {
  if (!rawQuery || rawQuery.trim().length < 1) return [];
  const q = normalizeQuery(rawQuery);
  const queryTokens = q.split(/\s+/).filter(Boolean);

  const tier1 = [], tier2 = [], tier3 = [];

  for (const card of TAROT_DECK) {
    const nameLower = card.name.toLowerCase();
    const allText = nameLower + ' ' + card.aliases.join(' ');

    if (nameLower.includes(q)) {
      tier1.push(card);
    } else if (card.aliases.some(a => a.includes(q))) {
      tier2.push(card);
    } else if (queryTokens.length > 0 && queryTokens.every(token => allText.includes(token))) {
      tier3.push(card);
    }
  }

  const seen = new Set();
  const results = [];
  for (const card of [...tier1, ...tier2, ...tier3]) {
    if (!seen.has(card.name)) {
      seen.add(card.name);
      results.push(card);
    }
  }
  return results.slice(0, 20);
}

// ── PAGE NAVIGATION ───────────────────────────────────────────────────────
const CATEGORY_LABELS = {
  'general':    'General / Life Path',
  'work':       'Work & Career',
  'romance':    'Romantic Relationships',
  'friends':    'Friendships',
  'family':     'Family',
  'spiritual':  'Spiritual & Purpose'
};

function navigateTo(pageNum, category, fromPopState) {
  if (category) {
    appState.category = category;
    appState.categoryLabel = CATEGORY_LABELS[category] || category;
  }
  if (!fromPopState) {
    history.pushState({ page: pageNum, category: appState.category }, '', '#p' + pageNum);
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page' + pageNum);
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);

  if (pageNum === 2) {
    document.getElementById('context-category-label').textContent = appState.categoryLabel;
    updateFormationDisplay();
    renderCardSlots();
    updateCardStatus();
    updateSubmitButton();
    document.getElementById('card-search').value = '';
    document.getElementById('search-results').classList.remove('open');
  }

  if (pageNum === 3) {
    fetchReading();
  }
}

// ── SEARCH ────────────────────────────────────────────────────────────────
let searchDebounce = null;
let activeResultIdx = -1;

function initSearch() {
  const input = document.getElementById('card-search');
  const results = document.getElementById('search-results');

  function setFocus(items, idx) {
    activeResultIdx = idx;
    items.forEach((li, i) => li.classList.toggle('focused', i === idx));
    if (idx >= 0 && items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', function () {
    activeResultIdx = -1;
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      const q = input.value.trim();
      if (!q) {
        results.classList.remove('open');
        results.innerHTML = '';
        return;
      }
      const cards = searchCards(q);
      if (cards.length === 0) {
        results.innerHTML = '<li class="no-results">No cards match — try suit name, number, or card name</li>';
      } else {
        results.innerHTML = cards.map(card => {
          const suitLabel = card.suit === 'major'
            ? 'Major Arcana'
            : card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
          return `<li data-name="${escHtml(card.name)}" role="option" tabindex="-1">
            <span>${escHtml(card.name)}</span>
            <span class="suit-badge">${suitLabel}</span>
          </li>`;
        }).join('');
      }
      results.classList.add('open');
    }, 150);
  });

  input.addEventListener('keydown', function (e) {
    const items = Array.from(results.querySelectorAll('li[data-name]'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocus(items, Math.min(activeResultIdx + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocus(items, Math.max(activeResultIdx - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeResultIdx >= 0 && items[activeResultIdx]) {
        const card = TAROT_DECK.find(c => c.name === items[activeResultIdx].dataset.name);
        if (card) addCard(card);
        input.value = '';
        results.classList.remove('open');
        results.innerHTML = '';
        activeResultIdx = -1;
      }
    } else if (e.key === 'Escape') {
      results.classList.remove('open');
      activeResultIdx = -1;
      input.blur();
    }
  });

  results.addEventListener('click', function (e) {
    const li = e.target.closest('li[data-name]');
    if (!li) return;
    const card = TAROT_DECK.find(c => c.name === li.dataset.name);
    if (card) addCard(card);
    input.value = '';
    results.classList.remove('open');
    results.innerHTML = '';
    activeResultIdx = -1;
    input.focus();
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-wrapper')) {
      results.classList.remove('open');
      activeResultIdx = -1;
    }
  });
}

// ── CARD MANAGEMENT ───────────────────────────────────────────────────────
function addCard(card) {
  const maxSlots = appState.formation.cardCount;
  if (appState.selectedCards.length >= maxSlots) {
    showToast('All ' + maxSlots + ' slots are filled. Remove a card or change the formation.');
    return;
  }
  appState.selectedCards.push({ card: card, reversed: false });
  renderCardSlots();
  updateCardStatus();
  updateSubmitButton();
}

function removeCard(idx) {
  appState.selectedCards.splice(idx, 1);
  renderCardSlots();
  updateCardStatus();
  updateSubmitButton();
}

function toggleReversed(idx) {
  appState.selectedCards[idx].reversed = !appState.selectedCards[idx].reversed;
  renderCardSlots();
}

// ── RENDER CARD SLOTS ─────────────────────────────────────────────────────
function renderCardSlots() {
  const container = document.getElementById('card-slots');
  const { formation, selectedCards } = appState;
  const spreadClass = SPREAD_CSS[formation.id] || 'spread-past-present-future';
  container.className = 'card-slots ' + spreadClass;

  let html = '';
  for (let i = 0; i < formation.cardCount; i++) {
    const entry = selectedCards[i];
    const posLabel = formation.positions[i] || ('Position ' + (i + 1));
    const roman = ROMAN[i] || String(i + 1);
    const rev = entry && entry.reversed;
    const suitLabel = entry
      ? (entry.card.suit === 'major' ? 'Major Arcana' : entry.card.suit.charAt(0).toUpperCase() + entry.card.suit.slice(1))
      : '';

    html += `<div class="tcs" data-slot="${i}">
      <div class="tcs-inner${rev ? ' reversed' : ''}">
        <div class="tcs-rev-banner">↕ REVERSED</div>
        <div class="tcs-header">
          <span class="tcs-num">${roman}</span>
          <span class="tcs-pos">${escHtml(posLabel)}</span>
        </div>
        <div class="tcs-body">
          ${entry
            ? `<div class="tcs-name">${escHtml(entry.card.name)}</div>
               <div class="tcs-suit">${suitLabel}</div>`
            : `<div class="tcs-empty">＋</div>`
          }
        </div>
        ${entry ? `
        <div class="tcs-footer">
          <button class="tcs-rev-btn${rev ? ' on' : ''}" onclick="toggleReversed(${i})">
            ${rev ? '↕ Reversed — tap to upright' : '↕ Mark as Reversed'}
          </button>
          <button class="tcs-rm-btn" onclick="removeCard(${i})">✕ Remove Card</button>
        </div>` : ''}
      </div>
    </div>`;
  }

  container.innerHTML = html;
}

function updateCardStatus() {
  const el = document.getElementById('cards-status');
  const count = appState.selectedCards.length;
  const total = appState.formation.cardCount;
  el.textContent = count + ' / ' + total + ' cards selected';
  el.className = 'cards-status' + (count === total ? ' complete' : '');
}

function updateSubmitButton() {
  const btn = document.getElementById('submit-reading-btn');
  const ready = appState.selectedCards.length === appState.formation.cardCount;
  btn.disabled = !ready;
  btn.textContent = ready
    ? '✦ Consult the Oracle ✦'
    : 'Select All ' + appState.formation.cardCount + ' Cards to Continue';
}

// ── FORMATION MODAL ───────────────────────────────────────────────────────
function initFormationModal() {
  const overlay = document.getElementById('formation-modal');
  document.getElementById('formation-modal-btn').addEventListener('click', openFormationModal);
  document.getElementById('formation-modal-close').addEventListener('click', closeFormationModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFormationModal(); });

  const list = document.getElementById('formation-list');
  list.innerHTML = FORMATIONS.map(f => `
    <li class="formation-option ${f.id === appState.formation.id ? 'selected' : ''}"
        data-id="${f.id}" onclick="selectFormation('${f.id}')">
      <div>
        <div class="formation-option-name">${escHtml(f.name)}</div>
        <div class="formation-option-desc">${escHtml(f.desc)}</div>
      </div>
      <div class="formation-option-count">${f.cardCount} card${f.cardCount > 1 ? 's' : ''}</div>
    </li>
  `).join('');
}

function openFormationModal() {
  document.getElementById('formation-modal').classList.add('open');
}

function closeFormationModal() {
  document.getElementById('formation-modal').classList.remove('open');
}

function selectFormation(id) {
  const f = FORMATIONS.find(x => x.id === id);
  if (!f) return;
  appState.formation = f;
  if (appState.selectedCards.length > f.cardCount) {
    appState.selectedCards = appState.selectedCards.slice(0, f.cardCount);
  }
  document.querySelectorAll('.formation-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });
  updateFormationDisplay();
  renderCardSlots();
  updateCardStatus();
  updateSubmitButton();
  closeFormationModal();
}

function updateFormationDisplay() {
  document.getElementById('current-formation-name').textContent = appState.formation.name;
}

// ── READING ───────────────────────────────────────────────────────────────
function submitReading() {
  if (appState.selectedCards.length !== appState.formation.cardCount) return;
  navigateTo(3);
}

function fetchReading() {
  const loadingEl  = document.getElementById('reading-loading');
  const contentEl  = document.getElementById('reading-content');
  const errorEl    = document.getElementById('reading-error');

  loadingEl.style.display = 'flex';
  contentEl.classList.remove('visible');
  errorEl.classList.remove('visible');

  document.getElementById('reading-category-tag').textContent = appState.categoryLabel;
  document.getElementById('reading-formation-tag').textContent = appState.formation.name;

  const payload = {
    category:  appState.categoryLabel,
    cards:     appState.selectedCards,
    formation: appState.formation
  };

  getReadingFromBackend(payload)
    .then(function (html) {
      loadingEl.style.display = 'none';
      document.getElementById('reading-body').innerHTML = html;
      contentEl.classList.add('visible');
    })
    .catch(function (err) {
      loadingEl.style.display = 'none';
      errorEl.textContent = '⚠ The Oracle is silent: ' + (err.message || 'Backend unreachable.');
      errorEl.classList.add('visible');
    });
}

// ── RESET ─────────────────────────────────────────────────────────────────
function resetApp() {
  appState.category = '';
  appState.categoryLabel = '';
  appState.selectedCards = [];
  appState.formation = FORMATIONS[1];
  navigateTo(1);
}

// ── TOAST ─────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 3200);
}

// ── UTILITY ───────────────────────────────────────────────────────────────
function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('page1').classList.add('active');
  history.replaceState({ page: 1 }, '', '#p1');

  window.addEventListener('popstate', function (e) {
    const page = (e.state && e.state.page) ? e.state.page : 1;
    navigateTo(page, null, true);
  });

  document.querySelectorAll('.category-tile').forEach(function (btn) {
    btn.addEventListener('click', function () {
      navigateTo(2, btn.dataset.category);
    });
  });

  initSearch();
  initFormationModal();
  renderCardSlots();
  updateCardStatus();
  updateFormationDisplay();
  updateSubmitButton();
});
