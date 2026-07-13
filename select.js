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
//  attribute variants start on their first available simulator pool, then use
//  the shared concrete-base picker inside the workbench. Jewels are special -- they
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
let activeWorkbenchBaseId = null;
let activeWorkbenchClassLabel = null;
let concreteBasePicker;
let basePickerTitle;
let basePickerSearch;
let basePickerSearchLabel;
let basePickerList;
let basePickerCount;
let basePickerEmpty;
let basePickerError;
let basePickerAttributeField;
let basePickerAttributeFilter;
let pendingConcreteBaseId = null;
let lastBasePickerTrigger = null;
let renderedConcreteBaseSignature = '';

// Load the focused craft-header layout fix while preserving direct file:// use.
function ensureCraftHeaderStyles() {
  if (document.querySelector('link[data-craft-header-fix]')) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'header-fix.css?v=20';
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
  // Every released category is clickable. Variant classes enter through their
  // first compiled pool; all concrete choices stay inside the workbench.
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


// Create one concrete-base selector for every non-Jewel item class. It occupies
// the same workbench-heading position as Ruby/Sapphire/Emerald, but the two
// selectors are never visible at the same time.
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

function concreteBaseContext() {
  if (!window.CraftForge || typeof window.CraftForge.getConcreteBaseContext !== 'function') return null;
  return window.CraftForge.getConcreteBaseContext();
}

function searchableConcreteBaseValue(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map(searchableConcreteBaseValue).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, nested]) => `${key.replaceAll('_', ' ')} ${searchableConcreteBaseValue(nested)}`)
      .join(' ');
  }
  return String(value);
}

function setSelectOptions(select, options, selectedValue = '') {
  if (!select) return;
  const fragment = document.createDocumentFragment();
  for (const option of options) {
    const element = document.createElement('option');
    element.value = option.value;
    element.textContent = option.label;
    fragment.appendChild(element);
  }
  select.replaceChildren(fragment);
  select.value = selectedValue;
}

function configureConcreteBaseFilters(context) {
  const classLabel = context?.classLabel || context?.itemClass || 'concrete bases';
  if (basePickerTitle) basePickerTitle.textContent = `Choose ${classLabel}`;
  if (basePickerSearchLabel) basePickerSearchLabel.textContent = `Search ${classLabel}`;
  if (basePickerSearch) {
    basePickerSearch.placeholder = `Search ${classLabel.toLowerCase()} by name, property, or implicit`;
  }
  if (basePickerList) basePickerList.setAttribute('aria-label', `${classLabel} concrete bases`);

  const families = Array.isArray(context?.attributeFamilies)
    ? context.attributeFamilies.filter(family => ATTR_LABELS[family])
    : [];
  const filterGroup = basePickerAttributeField?.closest('.base-picker-filters');
  if (filterGroup) filterGroup.hidden = families.length < 2;
  if (basePickerAttributeField) basePickerAttributeField.hidden = families.length < 2;
  if (basePickerAttributeFilter) {
    const previous = basePickerAttributeFilter.value;
    setSelectOptions(basePickerAttributeFilter, [
      { value: '', label: 'All attribute families' },
      ...families.map(family => ({ value: family, label: ATTR_LABELS[family] })),
    ], previous);
    if (basePickerAttributeFilter.selectedIndex < 0) basePickerAttributeFilter.value = '';
  }
}

function renderConcreteBaseOptions(context) {
  if (!basePickerList || !basePickerError || !basePickerEmpty || !basePickerCount) return;
  const renderStarted = performance.now();
  const recordRender = cacheHit => {
    concreteBasePicker.dataset.lastRenderMs = (performance.now() - renderStarted).toFixed(3);
    concreteBasePicker.dataset.renderCacheHit = String(cacheHit);
  };
  configureConcreteBaseFilters(context);
  basePickerError.hidden = true;
  basePickerError.textContent = '';
  if (!context || context.error) {
    basePickerError.textContent = context?.error || 'Concrete base data is unavailable.';
    basePickerError.hidden = false;
    basePickerEmpty.hidden = true;
    basePickerCount.textContent = 'Base data unavailable';
    recordRender(false);
    return;
  }

  const bases = context.bases || [];
  const signature = `${context.workbenchBaseId || ''}:${bases.map(base => base.id).join(',')}`;
  if (signature === renderedConcreteBaseSignature) {
    basePickerList.querySelectorAll('.concrete-base-option').forEach(button => {
      const selected = Number(button.dataset.baseItemId) === Number(context.selectedBaseItemId);
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    filterConcreteBaseOptions();
    recordRender(true);
    return;
  }
  renderedConcreteBaseSignature = signature;
  basePickerList.replaceChildren();

  const duplicateCounts = new Map();
  const duplicatePositions = new Map();
  for (const base of bases) duplicateCounts.set(base.displayName, (duplicateCounts.get(base.displayName) || 0) + 1);
  const fragment = document.createDocumentFragment();
  for (const base of bases) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'concrete-base-option';
    button.dataset.baseItemId = base.id;
    button.dataset.attributeFamily = base.attributeFamily || '';
    button.setAttribute('role', 'option');
    const selected = Number(base.id) === Number(context.selectedBaseItemId);
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
    const selectable = base.selectable !== false;
    button.disabled = !selectable;
    button.setAttribute('aria-disabled', String(!selectable));
    if (!selectable && base.disabledReason) button.title = base.disabledReason;

    const copy = document.createElement('span');
    copy.className = 'base-option-copy';
    const title = document.createElement('strong');
    title.className = 'base-option-title';
    title.textContent = base.displayName;
    copy.appendChild(title);

    if (duplicateCounts.get(base.displayName) > 1) {
      const position = (duplicatePositions.get(base.displayName) || 0) + 1;
      duplicatePositions.set(base.displayName, position);
      const variant = document.createElement('span');
      variant.className = 'base-option-variant';
      variant.textContent = `Variant ${position} of ${duplicateCounts.get(base.displayName)}`;
      copy.appendChild(variant);
    }

    const implicitText = (base.implicits || []).map(implicit => implicit.displayText).filter(Boolean).join(' / ');
    if (implicitText) {
      const implicit = document.createElement('span');
      implicit.className = 'base-option-implicit';
      implicit.textContent = implicitText;
      copy.appendChild(implicit);
    }

    if (!selectable) {
      const unavailable = document.createElement('span');
      unavailable.className = 'base-option-disabled';
      unavailable.textContent = base.disabledReason || 'Unavailable for crafting';
      copy.appendChild(unavailable);
    }

    const propertyText = searchableConcreteBaseValue(base.baseProperties);
    const requirementText = searchableConcreteBaseValue(base.requirements);
    button.dataset.search = [
      base.displayName,
      implicitText,
      propertyText,
      requirementText,
      base.attributeFamily ? ATTR_LABELS[base.attributeFamily] : '',
    ]
      .join(' ')
      .toLowerCase();
    button.appendChild(copy);
    fragment.appendChild(button);
  }
  basePickerList.appendChild(fragment);
  filterConcreteBaseOptions();
  recordRender(false);
}

function visibleConcreteBaseOptions() {
  return Array.from(basePickerList?.querySelectorAll('.concrete-base-option:not([hidden]):not([disabled])') || []);
}

function setWorkbenchModalIsolation(active) {
  const app = document.getElementById('app');
  if (!app) return;
  if ('inert' in app) app.inert = active;
  if (active) app.setAttribute('aria-hidden', 'true');
  else app.removeAttribute('aria-hidden');
}

function trapModalFocus(container, event) {
  if (event.key !== 'Tab') return false;
  const focusable = Array.from(container.querySelectorAll(
    'button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"]):not([hidden])'
  )).filter(element => element.getClientRects().length > 0);
  if (!focusable.length) {
    event.preventDefault();
    return true;
  }
  const current = focusable.indexOf(document.activeElement);
  const next = event.shiftKey
    ? (current <= 0 ? focusable.length - 1 : current - 1)
    : (current < 0 || current === focusable.length - 1 ? 0 : current + 1);
  event.preventDefault();
  focusable[next].focus();
  return true;
}

function filterConcreteBaseOptions() {
  if (!basePickerList || !basePickerCount || !basePickerEmpty) return;
  const query = basePickerSearch?.value.trim().toLowerCase() || '';
  const attributeFamily = basePickerAttributeFilter?.value || '';
  let visible = 0;
  let unavailable = 0;
  basePickerList.querySelectorAll('.concrete-base-option').forEach(option => {
    const matchesSearch = !query || (option.dataset.search || '').includes(query);
    const matchesAttribute = !attributeFamily || option.dataset.attributeFamily === attributeFamily;
    const matches = matchesSearch && matchesAttribute;
    option.hidden = !matches;
    if (matches) {
      visible++;
      if (option.disabled) unavailable++;
    }
  });
  basePickerCount.textContent = `${visible} ${visible === 1 ? 'base' : 'bases'}` +
    (unavailable ? ` · ${unavailable} unavailable` : '');
  basePickerEmpty.hidden = visible !== 0 || !basePickerError?.hidden;
}

function openConcreteBasePicker(trigger) {
  if (!concreteBasePicker) return;
  lastBasePickerTrigger = trigger || document.querySelector('.concrete-base-trigger');
  if (basePickerSearch) basePickerSearch.value = '';
  if (basePickerAttributeFilter) basePickerAttributeFilter.value = '';
  renderConcreteBaseOptions(concreteBaseContext());
  concreteBasePicker.hidden = false;
  setWorkbenchModalIsolation(true);
  lastBasePickerTrigger?.setAttribute('aria-expanded', 'true');
  requestAnimationFrame(() => basePickerSearch?.focus());
}

function closeConcreteBasePicker({ restoreFocus = true } = {}) {
  if (!concreteBasePicker || concreteBasePicker.hidden) return;
  concreteBasePicker.hidden = true;
  const currentTrigger = document.querySelector('.concrete-base-trigger');
  currentTrigger?.setAttribute('aria-expanded', 'false');
  setWorkbenchModalIsolation(false);
  if (restoreFocus) requestAnimationFrame(() => document.querySelector('.concrete-base-trigger')?.focus());
}

function closeBaseConfirmation({ restoreFocus = true } = {}) {
  const confirmation = document.getElementById('base-change-confirmation');
  if (!confirmation || confirmation.hidden) return;
  confirmation.hidden = true;
  pendingConcreteBaseId = null;
  setWorkbenchModalIsolation(false);
  if (restoreFocus) {
    requestAnimationFrame(() => {
      const target = lastBasePickerTrigger?.isConnected
        ? lastBasePickerTrigger
        : document.querySelector('.concrete-base-trigger, .jewel-btn.active');
      target?.focus();
    });
  }
}

function openBaseConfirmation(result) {
  const confirmation = document.getElementById('base-change-confirmation');
  const message = document.getElementById('base-confirm-message');
  const cancel = document.getElementById('base-confirm-cancel');
  if (!confirmation || !message || !cancel) return;
  if (document.activeElement?.matches?.('.jewel-btn, .concrete-base-trigger')) {
    lastBasePickerTrigger = document.activeElement;
  }
  pendingConcreteBaseId = result.nextBaseItemId;
  message.textContent = `Changing ${result.currentBaseName} to ${result.nextBaseName} resets modifiers, quality, sockets, and special state. Item level is preserved.`;
  confirmation.hidden = false;
  setWorkbenchModalIsolation(true);
  requestAnimationFrame(() => cancel.focus());
}

function chooseConcreteBase(baseItemId) {
  if (!window.CraftForge || typeof window.CraftForge.selectConcreteBase !== 'function') return;
  const result = window.CraftForge.selectConcreteBase(baseItemId);
  if (result?.requiresConfirmation) {
    closeConcreteBasePicker({ restoreFocus: false });
    openBaseConfirmation(result);
    return;
  }
  if (result?.success) {
    closeConcreteBasePicker();
  }
}

function moveConcreteBaseFocus(event) {
  if (!concreteBasePicker || concreteBasePicker.hidden) return;
  if (trapModalFocus(concreteBasePicker, event)) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeConcreteBasePicker();
    return;
  }
  if (event.target?.tagName === 'SELECT') return;
  if (event.target === basePickerSearch && event.key !== 'ArrowDown') return;
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const options = visibleConcreteBaseOptions();
  if (!options.length) return;
  event.preventDefault();
  const current = options.indexOf(document.activeElement);
  let next = current;
  if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = options.length - 1;
  else if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % options.length;
  else next = current < 0 ? options.length - 1 : (current - 1 + options.length) % options.length;
  options[next].focus();
}

function renderWorkbenchBaseSelector(baseId, classLabel) {
  const genericSelector = ensureWorkbenchBaseSelector();
  const jewelSelector = document.getElementById('jewel-selector');
  if (!genericSelector) return;
  activeWorkbenchBaseId = baseId;
  activeWorkbenchClassLabel = classLabel;

  // Jewels keep the original Ruby/Sapphire/Emerald selector.
  if (baseId === 'jewels') {
    genericSelector.hidden = true;
    genericSelector.replaceChildren();
    return;
  }

  // app.js already hides the Jewel selector for non-Jewel bases. Every such
  // class now uses this same normalized concrete-base trigger, including
  // attribute-family classes whose choices span several simulator pools.
  if (jewelSelector) jewelSelector.style.display = 'none';
  const context = concreteBaseContext();
  const selected = context?.bases?.find(base => Number(base.id) === Number(context.selectedBaseItemId));
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'base-choice-btn concrete-base-trigger active';
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'concrete-base-picker');
  trigger.disabled = !context;
  const label = document.createElement('span');
  label.className = 'concrete-base-trigger-label';
  label.textContent = selected?.displayName ||
    (context?.error ? 'Base data unavailable' : `Choose ${classLabel || 'concrete base'}`);
  const caret = document.createElement('span');
  caret.className = 'concrete-base-trigger-caret';
  caret.setAttribute('aria-hidden', 'true');
  caret.textContent = '\u25be';
  trigger.append(label, caret);
  trigger.addEventListener('click', () => openConcreteBasePicker(trigger));
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openConcreteBasePicker(trigger);
    }
  });
  genericSelector.replaceChildren(trigger);
  genericSelector.hidden = false;
}

// Hand the chosen base to the crafter (app.js). If its data isn't available the
// bridge returns false and we stay on the select screen rather than opening an
// empty crafter.
function enterCraft(baseId, classLabel) {
  const entryStarted = performance.now();
  if (window.CraftForge && typeof window.CraftForge.loadBase === 'function') {
    const ok = window.CraftForge.loadBase(baseId, classLabel);
    if (ok === false) return;
  }

  renderWorkbenchBaseSelector(baseId, classLabel);
  craftView.hidden = false;
  selectView.hidden = true;
  window.scrollTo(0, 0);
  document.documentElement.dataset.workbenchEntryMs = (performance.now() - entryStarted).toFixed(3);
}

function exitCraft() {
  closeConcreteBasePicker({ restoreFocus: false });
  closeBaseConfirmation({ restoreFocus: false });
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

function setupConcreteBasePicker() {
  concreteBasePicker = document.getElementById('concrete-base-picker');
  basePickerTitle = document.getElementById('base-picker-title');
  basePickerSearch = document.getElementById('base-picker-search');
  basePickerSearchLabel = document.querySelector('.base-picker-search-label');
  basePickerList = document.getElementById('base-picker-list');
  basePickerCount = document.getElementById('base-picker-count');
  basePickerEmpty = document.getElementById('base-picker-empty');
  basePickerError = document.getElementById('base-picker-error');
  basePickerAttributeField = document.getElementById('base-picker-attribute-field');
  basePickerAttributeFilter = document.getElementById('base-picker-attribute-filter');
  if (!concreteBasePicker || !basePickerSearch || !basePickerList) return;

  document.getElementById('base-picker-close')?.addEventListener('click', () => closeConcreteBasePicker());
  document.getElementById('base-picker-reset')?.addEventListener('click', () => {
    basePickerSearch.value = '';
    if (basePickerAttributeFilter) basePickerAttributeFilter.value = '';
    filterConcreteBaseOptions();
    basePickerSearch.focus();
  });
  basePickerSearch.addEventListener('input', filterConcreteBaseOptions);
  basePickerAttributeFilter?.addEventListener('change', filterConcreteBaseOptions);
  basePickerList.addEventListener('click', event => {
    const option = event.target.closest('.concrete-base-option');
    if (!option || option.disabled || !basePickerList.contains(option)) return;
    chooseConcreteBase(option.dataset.baseItemId);
  });
  basePickerSearch.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = visibleConcreteBaseOptions()[0];
      if (first) {
        event.preventDefault();
        first.click();
      }
    }
  });
  concreteBasePicker.addEventListener('keydown', moveConcreteBaseFocus);
  concreteBasePicker.addEventListener('click', event => {
    if (event.target === concreteBasePicker) closeConcreteBasePicker();
  });

  const confirmation = document.getElementById('base-change-confirmation');
  const cancel = document.getElementById('base-confirm-cancel');
  const apply = document.getElementById('base-confirm-apply');
  cancel?.addEventListener('click', () => closeBaseConfirmation());
  apply?.addEventListener('click', () => {
    if (pendingConcreteBaseId == null || !window.CraftForge?.selectConcreteBase) return;
    const nextId = pendingConcreteBaseId;
    window.CraftForge.selectConcreteBase(nextId, { confirmed: true });
    closeBaseConfirmation();
  });
  confirmation?.addEventListener('click', event => {
    if (event.target === confirmation) closeBaseConfirmation();
  });
  confirmation?.addEventListener('keydown', event => {
    if (trapModalFocus(confirmation, event)) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeBaseConfirmation();
    }
  });

  window.addEventListener('craftforge:concrete-base-changed', event => {
    const context = event.detail;
    if (!context?.workbenchBaseId) return;
    renderWorkbenchBaseSelector(
      context.workbenchBaseId,
      context.classLabel || activeWorkbenchClassLabel || 'Item',
    );
  });

  // Jewel buttons use the same non-mutating crafted-item confirmation path as
  // the generic picker while retaining their original header controls.
  window.addEventListener('craftforge:base-change-confirmation-requested', event => {
    if (event.detail?.requiresConfirmation) openBaseConfirmation(event.detail);
  });
}

function init() {
  ensureCraftHeaderStyles();
  removeCraftModeLabel();
  placeJewelSelectorInWorkbench();
  ensureWorkbenchBaseSelector();
  setupConcreteBasePicker();
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
