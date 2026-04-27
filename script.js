// ── BACKEND ───────────────────────────────────────────────────────────────
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwSm05J9K1PAeM6uxmLOnSxoIB4hnfBqake-hTwaN-R6iguMOHLSZzjfOOxn99fxODc2g/exec";
async function getReadingFromBackend(payload) {
  const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Reading failed");
  return data.html;
}

// ── I18N ──────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    page1_title: 'Your Oracle Awaits',
    page1_subtitle: 'Choose the realm of your inquiry',
    cat_general_label: 'General',     cat_general_sub: 'Life Path',
    cat_work_label: 'Work',           cat_work_sub: 'Career & Ambition',
    cat_romance_label: 'Romance',     cat_romance_sub: 'Love & Relationships',
    cat_friends_label: 'Friendships', cat_friends_sub: 'Bonds & Community',
    cat_family_label: 'Family',       cat_family_sub: 'Roots & Home',
    cat_spiritual_label: 'Spiritual', cat_spiritual_sub: 'Purpose & Soul',
    back_to_categories: 'Back to Categories',
    page2_title: 'Choose Your Cards',
    reading_for: 'Reading for:',
    search_label: 'Search & Add a Card',
    search_placeholder: 'Type a card name, suit, or number (e.g. 3, cups, three of swords…)',
    current_spread: 'Current Spread',
    change_formation: 'Change Formation',
    back_to_cards: 'Back to Card Selection',
    page3_title: 'The Oracle Speaks',
    page3_subtitle: 'The cards have been laid. The spirits are stirring.',
    oracle_stirs: 'The Oracle Stirs…',
    end_divider: '— End —',
    ask_again: '✦ Ask the Oracle Again',
    choose_spread: 'Choose Your Spread',
    modal_close: 'Close',
    slots_filled:     function(n)       { return 'All ' + n + ' slots are filled. Remove a card or change the formation.'; },
    cards_selected:   function(n, tot)  { return n + ' / ' + tot + ' cards selected'; },
    consult_oracle:   '✦ Consult the Oracle ✦',
    select_all_cards: function(n)       { return 'Select All ' + n + ' Cards to Continue'; },
    major_arcana: 'Major Arcana',
    reversed_banner: '↕ REVERSED',
    reversed_tap:    '↕ Reversed — tap to upright',
    mark_reversed:   '↕ Mark as Reversed',
    remove_card: '✕ Remove Card',
    position:    function(n) { return 'Position ' + n; },
    no_results:  'No cards match — try suit name, number, or card name',
    card_count:  function(n) { return n + ' card' + (n > 1 ? 's' : ''); },
    oracle_silent: function(msg) { return '⚠ The Oracle is silent: ' + msg; },
    backend_unreachable: 'Backend unreachable.',
    suit_cups: 'Cups', suit_wands: 'Wands', suit_swords: 'Swords', suit_pentacles: 'Pentacles',
    category_labels: {
      general: 'General / Life Path', work: 'Work & Career',
      romance: 'Romantic Relationships', friends: 'Friendships',
      family: 'Family', spiritual: 'Spiritual & Purpose'
    },
    formations: {
      single:              { name: 'Single Card',                       desc: 'One card for direct, focused guidance',         positions: ['Your Message'] },
      past_present_future: { name: 'Three Card: Past · Present · Future', desc: 'The classic three-card spread',    positions: ['Past', 'Present', 'Future'] },
      love_triangle:       { name: 'Love Triangle',                     desc: 'Three positions exploring relationship dynamics', positions: ['You in This Relationship', 'The Other Person', 'The Relationship Itself'] },
      five_cross:          { name: 'Five Card Cross',                   desc: 'A cross-shaped spread for deeper context',     positions: ['Present Situation', 'The Challenge', 'The Past', 'The Future', 'Likely Outcome'] },
      horseshoe:           { name: 'Horseshoe Spread',                  desc: 'Seven positions in a horseshoe arc',           positions: ['The Past', 'The Present', 'Hidden Influences', 'Obstacles', 'External Influences', 'Best Course of Action', 'Likely Outcome'] },
      celtic_cross:        { name: 'Celtic Cross',                      desc: 'The classic ten-card deep-dive spread',        positions: ['Present Situation', 'The Challenge', 'Foundation', 'Recent Past', 'Best Outcome', 'Immediate Future', 'Your Attitude', 'External Influences', 'Hopes & Fears', 'Final Outcome'] }
    }
  },
  'zh-TW': {
    page1_title: '神諭恺候',
    page1_subtitle: '選擇您的詢問領域',
    cat_general_label: '通用',     cat_general_sub: '人生道路',
    cat_work_label: '工作',        cat_work_sub: '事業與抱負',
    cat_romance_label: '愛情',     cat_romance_sub: '戀愛與關係',
    cat_friends_label: '友誼',     cat_friends_sub: '連結與社群',
    cat_family_label: '家庭',      cat_family_sub: '根源與家園',
    cat_spiritual_label: '霊性',   cat_spiritual_sub: '目的與靈魂',
    back_to_categories: '返回分類',
    page2_title: '選擇您的牌',
    reading_for: '解讀主題：',
    search_label: '搜尋並添加一張牌',
    search_placeholder: '輸入牌名、花色或數字（例如：3、聖盃、寶劍三…）',
    current_spread: '當前牌陣',
    change_formation: '更改牌陣',
    back_to_cards: '返回選牌',
    page3_title: '神諭降臨',
    page3_subtitle: '牌已落定，靈魂正在悌動。',
    oracle_stirs: '神諭正在繌醒…',
    end_divider: '─ 終 ─',
    ask_again: '✦ 再次問神諭',
    choose_spread: '選擇您的牌陣',
    modal_close: '關閉',
    slots_filled:     function(n)       { return '所有 ' + n + ' 個位置已填滿。請移除一張牌或更改牌陣。'; },
    cards_selected:   function(n, tot)  { return '已選擇 ' + n + ' / ' + tot + ' 張牌'; },
    consult_oracle:   '✦ 請示神諭 ✦',
    select_all_cards: function(n)       { return '請選擇全部 ' + n + ' 張牌以繼續'; },
    major_arcana: '大阿爾克那',
    reversed_banner: '↕ 逆位',
    reversed_tap:    '↕ 逆位 — 黭e擊轉為正位',
    mark_reversed:   '↕ 標記為逆位',
    remove_card: '✕ 移除牌',
    position:    function(n) { return '位置 ' + n; },
    no_results:  '找不到符合的牌 — 請嘗試花色名稱、數字或牌名',
    card_count:  function(n) { return n + ' 張牌'; },
    oracle_silent: function(msg) { return '⚠ 神諭沉默：' + msg; },
    backend_unreachable: '後端無法連接。',
    suit_cups: '聖盃', suit_wands: '權杖', suit_swords: '寶劍', suit_pentacles: '星幣',
    category_labels: {
      general: '通用 / 人生道路', work: '工作與事業',
      romance: '浪漫關係', friends: '友誼',
      family: '家庭', spiritual: '霊性與目的'
    },
    formations: {
      single:              { name: '單張牌',            desc: '一張牌，給予直接、專注的指引',   positions: ['您的訊息'] },
      past_present_future: { name: '三張牌：過去・現在・未來', desc: '經典三張牌陣', positions: ['過去', '現在', '未來'] },
      love_triangle:       { name: '愛情三角',     desc: '三個位置探索感情動態',                         positions: ['您在這段關係中的位置', '對方', '這段關係本身'] },
      five_cross:          { name: '五張牌十字', desc: '十字形牌陣，提供更深入的背景', positions: ['目前狀況', '挑戰', '過去', '未來', '可能的結果'] },
      horseshoe:           { name: '馬蹄形牌陣', desc: '馬蹄弧形七個位置',                                   positions: ['過去', '現在', '隱藏的影響', '障礙', '外部影響', '最佳行動方案', '可能的結果'] },
      celtic_cross:        { name: '凱爾特十字', desc: '經典十張牌深度牌陣',                             positions: ['目前狀況', '挑戰', '基礎', '近期過去', '最佳結果', '近期未來', '您的態度', '外部影響', '希望與恐懼', '最終結果'] }
    }
  }
};

let currentLang = localStorage.getItem('tarot-lang') || 'en';

function t(key, ...args) {
  const val = TRANSLATIONS[currentLang][key];
  if (typeof val === 'function') return val(...args);
  return val !== undefined ? val : key;
}

function lf(f) {
  const loc = TRANSLATIONS[currentLang].formations[f.id];
  return loc ? Object.assign({}, f, loc) : f;
}

function getSuitLabel(suit) {
  if (suit === 'major') return t('major_arcana');
  return t('suit_' + suit) || (suit.charAt(0).toUpperCase() + suit.slice(1));
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    const key = el.dataset.i18n;
    const val = TRANSLATIONS[currentLang][key];
    if (val !== undefined && typeof val !== 'function') el.textContent = val;
  });
  const searchInput = document.getElementById('card-search');
  if (searchInput) searchInput.placeholder = t('search_placeholder');
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  renderFormationList();
  renderCardSlots();
  updateCardStatus();
  updateFormationDisplay();
  updateSubmitButton();
  if (appState.category) {
    appState.categoryLabel = TRANSLATIONS[currentLang].category_labels[appState.category] || appState.categoryLabel;
    const catLabel = document.getElementById('context-category-label');
    if (catLabel) catLabel.textContent = appState.categoryLabel;
  }
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('tarot-lang', lang);
  if (document.getElementById('page3').classList.contains('active')) {
    resetApp();
  } else {
    applyI18n();
  }
}

// ── FORMATIONS ────────────────────────────────────────────────────────────
const FORMATIONS = [
  { id: 'single',              cardCount: 1,  name: 'Single Card',                        desc: 'One card for direct, focused guidance',         positions: ['Your Message'] },
  { id: 'past_present_future', cardCount: 3,  name: 'Three Card: Past · Present · Future', desc: 'The classic three-card spread',   positions: ['Past', 'Present', 'Future'] },
  { id: 'love_triangle',       cardCount: 3,  name: 'Love Triangle',                      desc: 'Three positions exploring relationship dynamics', positions: ['You in This Relationship', 'The Other Person', 'The Relationship Itself'] },
  { id: 'five_cross',          cardCount: 5,  name: 'Five Card Cross',                    desc: 'A cross-shaped spread for deeper context',     positions: ['Present Situation', 'The Challenge', 'The Past', 'The Future', 'Likely Outcome'] },
  { id: 'horseshoe',           cardCount: 7,  name: 'Horseshoe Spread',                   desc: 'Seven positions in a horseshoe arc',           positions: ['The Past', 'The Present', 'Hidden Influences', 'Obstacles', 'External Influences', 'Best Course of Action', 'Likely Outcome'] },
  { id: 'celtic_cross',        cardCount: 10, name: 'Celtic Cross',                       desc: 'The classic ten-card deep-dive spread',        positions: ['Present Situation', 'The Challenge', 'Foundation', 'Recent Past', 'Best Outcome', 'Immediate Future', 'Your Attitude', 'External Influences', 'Hopes & Fears', 'Final Outcome'] }
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
  formation: FORMATIONS[1],
  maxCards: 10
};

// ── FUZZY SEARCH ENGINE ───────────────────────────────────────────────────
const SUIT_SYNONYMS = {
  'coins':  'pentacles', 'coin':   'pentacles',
  'disks':  'pentacles', 'disk':   'pentacles',
  'rods':   'wands',     'rod':    'wands',
  'staves': 'wands',     'batons': 'wands'
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

function getCardDisplayName(card) {
  if (currentLang === 'zh-TW' && card.zhName) return card.zhName;
  return card.name;
}

function searchCards(rawQuery) {
  if (!rawQuery || rawQuery.trim().length < 1) return [];
  const q = normalizeQuery(rawQuery);
  const rawQ = rawQuery.trim(); // kept as-is for Chinese substring matching
  const queryTokens = q.split(/\s+/).filter(Boolean);

  const tier1 = [], tier2 = [], tier3 = [];

  for (const card of TAROT_DECK) {
    const nameLower = card.name.toLowerCase();
    const zhName = card.zhName || '';
    const zhAliases = card.zhAliases || [];
    const allText = nameLower + ' ' + card.aliases.join(' ');
    const allTextFull = allText + ' ' + zhName + ' ' + zhAliases.join(' ');

    if (nameLower.includes(q) || zhName.includes(rawQ)) {
      tier1.push(card);
    } else if (card.aliases.some(a => a.includes(q)) || zhAliases.some(a => a.includes(rawQ))) {
      tier2.push(card);
    } else if (queryTokens.length > 0 && queryTokens.every(token => allTextFull.includes(token))) {
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
function navigateTo(pageNum, category, fromPopState) {
  if (category) {
    appState.category = category;
    appState.categoryLabel = TRANSLATIONS[currentLang].category_labels[category] || category;
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
        results.innerHTML = '<li class="no-results">' + t('no_results') + '</li>';
      } else {
        results.innerHTML = cards.map(card => {
          return `<li data-name="${escHtml(card.name)}" role="option" tabindex="-1">
            <span>${escHtml(getCardDisplayName(card))}</span>
            <span class="suit-badge">${escHtml(getSuitLabel(card.suit))}</span>
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
    showToast(t('slots_filled', maxSlots));
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
  const locFormation = lf(formation);
  const spreadClass = SPREAD_CSS[formation.id] || 'spread-past-present-future';
  container.className = 'card-slots ' + spreadClass;

  let html = '';
  for (let i = 0; i < formation.cardCount; i++) {
    const entry = selectedCards[i];
    const posLabel = locFormation.positions[i] || t('position', i + 1);
    const roman = ROMAN[i] || String(i + 1);
    const rev = entry && entry.reversed;
    const suitLabel = entry ? getSuitLabel(entry.card.suit) : '';

    html += `<div class="tcs" data-slot="${i}">
      <div class="tcs-inner${rev ? ' reversed' : ''}">
        <div class="tcs-rev-banner">${t('reversed_banner')}</div>
        <div class="tcs-header">
          <span class="tcs-num">${roman}</span>
          <span class="tcs-pos">${escHtml(posLabel)}</span>
        </div>
        <div class="tcs-body">
          ${entry
            ? `<div class="tcs-name">${escHtml(getCardDisplayName(entry.card))}</div>
               <div class="tcs-suit">${escHtml(suitLabel)}</div>`
            : `<div class="tcs-empty">＋</div>`
          }
        </div>
        ${entry ? `
        <div class="tcs-footer">
          <button class="tcs-rev-btn${rev ? ' on' : ''}" onclick="toggleReversed(${i})">
            ${rev ? escHtml(t('reversed_tap')) : escHtml(t('mark_reversed'))}
          </button>
          <button class="tcs-rm-btn" onclick="removeCard(${i})">${t('remove_card')}</button>
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
  el.textContent = t('cards_selected', count, total);
  el.className = 'cards-status' + (count === total ? ' complete' : '');
}

function updateSubmitButton() {
  const btn = document.getElementById('submit-reading-btn');
  const ready = appState.selectedCards.length === appState.formation.cardCount;
  btn.disabled = !ready;
  btn.textContent = ready ? t('consult_oracle') : t('select_all_cards', appState.formation.cardCount);
}

// ── FORMATION MODAL ───────────────────────────────────────────────────────
function renderFormationList() {
  const list = document.getElementById('formation-list');
  if (!list) return;
  list.innerHTML = FORMATIONS.map(function(f) {
    const locF = lf(f);
    return '<li class="formation-option ' + (f.id === appState.formation.id ? 'selected' : '') + '" data-id="' + f.id + '" onclick="selectFormation(\'' + f.id + '\')">' +
      '<div>' +
        '<div class="formation-option-name">' + escHtml(locF.name) + '</div>' +
        '<div class="formation-option-desc">' + escHtml(locF.desc) + '</div>' +
      '</div>' +
      '<div class="formation-option-count">' + t('card_count', f.cardCount) + '</div>' +
    '</li>';
  }).join('');
}

function initFormationModal() {
  const overlay = document.getElementById('formation-modal');
  document.getElementById('formation-modal-btn').addEventListener('click', openFormationModal);
  document.getElementById('formation-modal-close').addEventListener('click', closeFormationModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeFormationModal(); });
  renderFormationList();
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
  document.getElementById('current-formation-name').textContent = lf(appState.formation).name;
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
  document.getElementById('reading-formation-tag').textContent = lf(appState.formation).name;

  const localizedFormation = Object.assign({}, appState.formation, lf(appState.formation));
  const payload = {
    lang:      currentLang,
    category:  appState.categoryLabel,
    cards:     appState.selectedCards,
    formation: localizedFormation
  };

  getReadingFromBackend(payload)
    .then(function (html) {
      loadingEl.style.display = 'none';
      document.getElementById('reading-body').innerHTML = html;
      contentEl.classList.add('visible');
    })
    .catch(function (err) {
      loadingEl.style.display = 'none';
      errorEl.textContent = t('oracle_silent', err.message || t('backend_unreachable'));
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
  const t_ = document.getElementById('toast');
  t_.textContent = msg;
  t_.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t_.style.opacity = '0'; }, 3200);
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
  applyI18n();
});
