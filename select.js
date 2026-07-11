(function () { "use strict";
// ============================================================
//  Item Category Selection Screen
//
//  Icons auto-load from /assets/icons/<icon>.png. Until a PNG
//  exists, a glyph fallback is shown. Just drop files named
//  exactly as the `icon` fields below and they appear.
//
//  Naming pattern for attribute variants: <base>_<attr>.png
//  e.g. gloves_str.png, gloves_str_dex.png, body_armours_str_dex_int.png
//
//  ALL BASES RELEASED: every category is playable. Clicking a simple
//  category opens its crafting workbench directly. Classes with
//  attribute variants start on their first available base, then allow
//  switching variants inside the workbench. Jewels are special -- they
//  enter the jewel crafter and use the in-craft Ruby/Sapphire/Emerald
//  header selector to swap sub-bases.
// ============================================================

const ATTR_LABELS = {
  str: 'Str',
  dex: 'Dex',
  int: 'Int',
  str_dex: 'Str / Dex',
  str_int: 'Str / Int',
  dex_int: 'Dex / Int',
  str_dex_int: 'Str / Dex / Int',
};

const ARMOUR_ATTRS = ['str', 'dex', 'int', 'str_dex', 'str_int', 'dex_int'];
const BODY_ATTRS = ['str', 'dex', 'int', 'str_dex', 'str_int', 'dex_int', 'str_dex_int'];
const SHIELD_ATTRS = ['str', 'str_dex', 'str_int'];

// Build attribute variants for a base item. Each variant id matches a compiled
// base file in data/bases (e.g. gloves_str.json -> id 'gloves_str').
function variants(base, attrs) {
  return attrs.map((a) => ({
    id: base + '_' + a,
    name: ATTR_LABELS[a],
    icon: base + '_' + a,
    bestBase: '',
  }));
}

const CATEGORIES = [
  {
    group: 'Jewels',
    items: [
      { id: 'jewels', name: 'Jewels', icon: 'jewels', status: 'active' },
    ],
  },
  {
    group: 'Jewellery',
    items: [
      { id: 'amulets', name: 'Amulets', icon: 'amulets', status: 'active' },
      { id: 'rings', name: 'Rings', icon: 'rings', status: 'active' },
      { id: 'belts', name: 'Belts', icon: 'belts', status: 'active' },
    ],
  },
  {
    group: 'Armour',
    items: [
      { id: 'gloves', name: 'Gloves', icon: 'gloves', status: 'active', variants: variants('gloves', ARMOUR_ATTRS) },
      { id: 'boots', name: 'Boots', icon: 'boots', status: 'active', variants: variants('boots', ARMOUR_ATTRS) },
      { id: 'body_armours', name: 'Body Armours', icon: 'body_armours', status: 'active', variants: variants('body_armours', BODY_ATTRS) },
      { id: 'helmets', name: 'Helmets', icon: 'helmets', status: 'active', variants: variants('helmets', ARMOUR_ATTRS) },
    ],
  },
  {
    group: 'Off-hand',
    items: [
      { id: 'quivers', name: 'Quivers', icon: 'quivers', status: 'active' },
      { id: 'shields', name: 'Shields', icon: 'shields', status: 'active', variants: variants('shields', SHIELD_ATTRS) },
      { id: 'bucklers', name: 'Bucklers', icon: 'bucklers', status: 'active' },
      { id: 'foci', name: 'Foci', icon: 'foci', status: 'active' },
    ],
  },
  {
    group: 'One-Handed Weapons',
    items: [
      { id: 'claws', name: 'Claws', icon: 'claws', status: 'active' },
      { id: 'daggers', name: 'Daggers', icon: 'daggers', status: 'active' },
      { id: 'wands', name: 'Wands', icon: 'wands', status: 'active' },
      { id: 'one_hand_swords', name: 'One Hand Swords', icon: 'one_hand_swords', status: 'active' },
      { id: 'one_hand_axes', name: 'One Hand Axes', icon: 'one_hand_axes', status: 'active' },
      { id: 'one_hand_maces', name: 'One Hand Maces', icon: 'one_hand_maces', status: 'active' },
      { id: 'sceptres', name: 'Sceptres', icon: 'sceptres', status: 'active' },
      { id: 'spears', name: 'Spears', icon: 'spears', status: 'active' },
      { id: 'flails', name: 'Flails', icon: 'flails', status: 'active' },
    ],
  },
  {
    group: 'Two-Handed Weapons',
    items: [
      { id: 'bows', name: 'Bows', icon: 'bows', status: 'active' },
      { id: 'staves', name: 'Staves', icon: 'staves', status: 'active' },
      { id: 'two_hand_swords', name: 'Two Hand Swords', icon: 'two_hand_swords', status: 'active' },
      { id: 'two_hand_axes', name: 'Two Hand Axes', icon: 'two_hand_axes', status: 'active' },
      { id: 'two_hand_maces', name: 'Two Hand Maces', icon: 'two_hand_maces', status: 'active' },
      { id: 'quarterstaves', name: 'Quarterstaves', icon: 'quarterstaves', status: 'active' },
      { id: 'crossbows', name: 'Crossbows', icon: 'crossbows', status: 'active' },
    ],
  },
  {
    group: 'Flasks & Charms',
    items: [
      { id: 'life_flasks', name: 'Life Flasks', icon: 'life_flasks', status: 'active' },
      { id: 'mana_flasks', name: 'Mana Flasks', icon: 'mana_flasks', status: 'active' },
      { id: 'charms', name: 'Charms', icon: 'charms', status: 'active' },
    ],
  },
];

let selectView;
let craftView;
let root;
let selectHeading;
let selectSub;
let searchInput;
let resultCount;
let emptyState;
let workbenchBaseSelector;

// Load the focused craft-header layout fix while preserving direct file:// use.
function ensureCraftHeaderStyles() {
  if (document.querySelector('link[data-craft-header-fix]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'header-fix.css?v=14';
  link.dataset.craftHeaderFix = 'true';
  document.head.appendChild(link);
}

// Auto-loading icon with graceful glyph fallback.
function monogram(label) {
  const words = String(label || '').replace(/[^a-z0-9 ]/gi, ' ').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '◆';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function iconEl(name, label) {
  const wrap = document.createElement('span');
  wrap.className = 'cat-ico';
  const img = document.createElement('img');
  img.src = 'assets/icons/' + name + '.png';
  img.alt = '';
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    img.remove();
    const glyph = document.createElement('span');
    glyph.className = 'cat-ico-glyph cat-ico-monogram';
    glyph.textContent = monogram(label || name);
    wrap.appendChild(glyph);
  });
  wrap.appendChild(img);
  return wrap;
}

function buildCard(item, groupName) {
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
  const active = item.status === 'active';

  const card = document.createElement('button');
  card.type = 'button';
  // Every released category is clickable. Variant categories open their
  // attribute grid; everything else jumps straight into the crafter.
  card.className = 'cat-card' + (active ? ' is-active' : '');
  card.dataset.search = (item.name + ' ' + (groupName || '')).toLowerCase();

  card.appendChild(iconEl(item.icon, item.name));

  const label = document.createElement('span');
  label.className = 'cat-card-label';
  label.textContent = item.name;
  card.appendChild(label);

  card.addEventListener('click', () => {
    // This screen chooses only the item class. Variant selection happens
    // inside the crafting workbench.
    const initialBaseId = hasVariants ? item.variants[0].id : item.id;
    enterCraft(initialBaseId, item.name);
  });

  return card;
}

// All categories render into ONE continuous grid so every row fills
// edge-to-edge (no empty space at the end of each section).
function renderCategories() {
  if (selectHeading) selectHeading.textContent = 'Choose your item class';
  if (selectSub) selectSub.textContent = 'Practice every slam, annul and omen without risking your currency.';
  if (selectView) selectView.classList.remove('showing-variants');
  if (searchInput) {
    searchInput.disabled = false;
    searchInput.value = '';
  }
  root.innerHTML = '';

  for (const group of CATEGORIES) {
    const section = document.createElement('section');
    section.className = 'cat-group';
    section.dataset.group = group.group.toLowerCase();

    const heading = document.createElement('div');
    heading.className = 'cat-group-heading';
    const title = document.createElement('h3');
    title.className = 'cat-group-title';
    title.textContent = group.group;
    const count = document.createElement('span');
    count.className = 'cat-group-count';
    count.textContent = group.items.length + (group.items.length === 1 ? ' base' : ' bases');
    heading.append(title, count);
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'cat-grid';
    for (const item of group.items) {
      grid.appendChild(buildCard(item, group.group));
    }
    section.appendChild(grid);
    root.appendChild(section);
  }
  filterCategories();
  window.scrollTo(0, 0);
}

function filterCategories() {
  if (!root) return;
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let visible = 0;

  root.querySelectorAll('.cat-group').forEach((section) => {
    let sectionVisible = 0;
    section.querySelectorAll('.cat-card').forEach((card) => {
      const matches = !query || (card.dataset.search || '').includes(query);
      card.hidden = !matches;
      if (matches) { visible++; sectionVisible++; }
    });
    section.hidden = sectionVisible === 0;
  });

  if (resultCount) {
    resultCount.textContent = query
      ? visible + (visible === 1 ? ' matching base' : ' matching bases')
      : visible + ' item classes ready';
  }
  if (emptyState) emptyState.hidden = visible !== 0;
}

function renderVariants(item) {
  if (selectHeading) selectHeading.textContent = item.name;
  if (selectSub) selectSub.textContent = 'Pick an attribute base to craft.';
  if (selectView) selectView.classList.add('showing-variants');
  if (searchInput) searchInput.disabled = true;
  if (emptyState) emptyState.hidden = true;
  root.innerHTML = '';

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'variant-back';
  back.textContent = '\u2190 All categories';
  back.addEventListener('click', renderCategories);
  root.appendChild(back);

  const grid = document.createElement('div');
  grid.className = 'cat-grid variant-grid';
  for (const v of item.variants) {
    const card = document.createElement('button');
    card.type = 'button';
    // Variant cards are now live: each loads its own base (gloves_str, ...).
    card.className = 'cat-card variant-card is-active';

    card.appendChild(iconEl(v.icon, item.name + ' ' + v.name));

    const label = document.createElement('span');
    label.className = 'cat-card-label';
    label.textContent = item.name + ' (' + v.name + ')';
    card.appendChild(label);

    const base = document.createElement('span');
    base.className = 'variant-base';
    base.textContent = v.bestBase ? 'Best base: ' + v.bestBase : v.name;
    card.appendChild(base);

    card.addEventListener('click', () => enterCraft(v.id, item.name));

    grid.appendChild(card);
  }
  root.appendChild(grid);
  window.scrollTo(0, 0);
}


// Find the category item and all switchable base choices for a compiled base id.
function findBaseChoice(baseId) {
  for (const category of CATEGORIES) {
    for (const item of category.items) {
      if (item.id === baseId) {
        return {
          item,
          choices: [{ id: item.id, name: item.name }],
          selectedId: baseId,
        };
      }

      const variant = Array.isArray(item.variants)
        ? item.variants.find(choice => choice.id === baseId)
        : null;

      if (variant) {
        return {
          item,
          choices: item.variants,
          selectedId: baseId,
        };
      }
    }
  }

  return null;
}

// Create a second selector for every non-jewel base. It occupies the same
// workbench-heading position as Ruby/Sapphire/Emerald, but the two selectors
// are never visible at the same time.
function ensureWorkbenchBaseSelector() {
  if (workbenchBaseSelector && workbenchBaseSelector.isConnected) {
    return workbenchBaseSelector;
  }

  const heading = document.querySelector('#jewel-panel .workbench-heading');
  const state = heading ? heading.querySelector('.workbench-state') : null;
  if (!heading) return null;

  workbenchBaseSelector = document.getElementById('workbench-base-selector');
  if (!workbenchBaseSelector) {
    workbenchBaseSelector = document.createElement('div');
    workbenchBaseSelector.id = 'workbench-base-selector';
    workbenchBaseSelector.className = 'workbench-base-selector';
    workbenchBaseSelector.setAttribute('aria-label', 'Available bases');
    workbenchBaseSelector.hidden = true;
  }

  if (workbenchBaseSelector.parentElement !== heading) {
    if (state) heading.insertBefore(workbenchBaseSelector, state);
    else heading.appendChild(workbenchBaseSelector);
  }

  return workbenchBaseSelector;
}

function renderWorkbenchBaseSelector(baseId, classLabel) {
  const genericSelector = ensureWorkbenchBaseSelector();
  const jewelSelector = document.getElementById('jewel-selector');
  if (!genericSelector) return;

  // Jewels keep the original Ruby/Sapphire/Emerald selector.
  if (baseId === 'jewels') {
    genericSelector.hidden = true;
    genericSelector.replaceChildren();
    return;
  }

  const baseChoice = findBaseChoice(baseId);
  const fallbackName = classLabel || baseId.replaceAll('_', ' ');
  const choices = baseChoice?.choices || [{ id: baseId, name: fallbackName }];
  const itemLabel = baseChoice?.item?.name || classLabel || 'Item';

  // app.js already hides the jewel selector for non-jewel bases. Keep that
  // behaviour and show the matching class/attribute choices instead.
  if (jewelSelector) jewelSelector.style.display = 'none';

  const fragment = document.createDocumentFragment();

  for (const choice of choices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'base-choice-btn';
    button.dataset.baseId = choice.id;
    button.textContent = choice.name;

    const active = choice.id === baseId;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));

    // A class with only one compiled pool has nothing else to switch to, but
    // still shows its selected base in the centre of the workbench heading.
    if (choices.length === 1) {
      button.classList.add('single-choice');
      button.setAttribute('aria-current', 'true');
    } else {
      button.addEventListener('click', () => {
        if (button.classList.contains('active')) return;
        if (!window.CraftForge || typeof window.CraftForge.loadBase !== 'function') return;

        const ok = window.CraftForge.loadBase(choice.id, itemLabel);
        if (ok === false) return;

        renderWorkbenchBaseSelector(choice.id, itemLabel);
      });
    }

    fragment.appendChild(button);
  }

  genericSelector.replaceChildren(fragment);
  genericSelector.hidden = false;
}

// Hand the chosen base to the crafter (app.js). If its data isn't available the
// bridge returns false and we stay on the select screen rather than opening an
// empty crafter.
function enterCraft(baseId, classLabel) {
  if (window.CraftForge && typeof window.CraftForge.loadBase === 'function') {
    const ok = window.CraftForge.loadBase(baseId, classLabel);
    if (ok === false) return;
  }

  renderWorkbenchBaseSelector(baseId, classLabel);
  craftView.hidden = false;
  selectView.hidden = true;
  window.scrollTo(0, 0);
}

function exitCraft() {
  selectView.hidden = false;
  craftView.hidden = true;
  window.scrollTo(0, 0);
}



// Remove the old craft-mode caption from the document completely.
// This is more reliable than only hiding it with CSS because index.html
// still contains the legacy "Jewel workshop" element.
function removeCraftModeLabel() {
  const label = document.getElementById('craft-mode-label');
  if (label) label.remove();
}

// Keep the jewel base choices in the workbench heading so the controls sit
// beside "Crafting Workbench" and the Ready indicator.
function placeJewelSelectorInWorkbench() {
  const selector = document.getElementById('jewel-selector');
  const heading = document.querySelector('#jewel-panel .workbench-heading');
  const state = heading ? heading.querySelector('.workbench-state') : null;

  if (!selector || !heading || selector.parentElement === heading) return;

  if (state) heading.insertBefore(selector, state);
  else heading.appendChild(selector);
}

function init() {
  ensureCraftHeaderStyles();
  removeCraftModeLabel();
  placeJewelSelectorInWorkbench();
  ensureWorkbenchBaseSelector();
  selectView = document.getElementById('select-view');
  craftView = document.getElementById('craft-view');
  root = document.getElementById('select-grid');
  selectHeading = document.getElementById('select-heading');
  selectSub = document.getElementById('select-sub');
  searchInput = document.getElementById('item-search');
  if (searchInput) searchInput.placeholder = 'Search item classes';
  resultCount = document.getElementById('select-result-count');
  emptyState = document.getElementById('select-empty');

  if (!selectView || !craftView || !root) return;

  const backBtn = document.getElementById('back-to-select');
  if (backBtn) backBtn.addEventListener('click', exitCraft);
  if (searchInput) searchInput.addEventListener('input', filterCategories);

  renderCategories();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
