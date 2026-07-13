// app.js - PoE2 Jewel Crafting UI Controller
// Runs as a classic <script defer> (not an ES module) so the app also works
// when opened directly from file:// (double-click index.html, no server).
(function () {
'use strict';
const CraftingEngine = window.CraftingEngine;
const CRAFTING_CURRENCY_INDEX = window.CRAFTING_CURRENCY_INDEX || null;
const APP_BOOT_STARTED = typeof performance !== 'undefined' ? performance.now() : 0;
const UNSUPPORTED_REASON = 'Mechanic blocked because exact target-version behavior is not verified.';

const USE_SOUND_FILES = false;

const DEFAULT_ORB_COLOR = 'rgba(255,255,255,0.6)';

const CRAFTING_ITEM_REGISTRY = {};
function normalizeCraftDefinition(definition) {
  return Object.freeze({
    ...definition,
    id: definition.craftId,
    tab: definition.tab || definition.category,
    validator: definition.disabledReasonHandler,
    omenId: definition.omenInteraction?.omenId || null,
    unsupportedReason: definition.disabledReason || definition.blocker?.reason || definition.blocker || UNSUPPORTED_REASON,
    minModifierLevel: definition.operationOptions?.minModifierLevel ?? null,
  });
}
function registerCraftDefinitions(definitions) {
  for (const rawDefinition of definitions || []) {
    if (!rawDefinition?.craftId) continue;
    const definition = Object.isFrozen(rawDefinition)
      ? rawDefinition
      : normalizeCraftDefinition(rawDefinition);
    CRAFTING_ITEM_REGISTRY[definition.craftId] = definition;
  }
}
registerCraftDefinitions(CRAFTING_CURRENCY_INDEX?.craftRegistry);
const CRAFTING_TABS = Object.freeze([...(CRAFTING_CURRENCY_INDEX?.craftTabs || [])]
  .sort((left, right) => left.order - right.order));
const VISIBLE_CRAFT_DEFINITIONS = Object.freeze(Object.values(CRAFTING_ITEM_REGISTRY)
  .filter(definition => definition.supported)
  .sort((left, right) => (left.tabOrder || 0) - (right.tabOrder || 0) || left.displayOrder - right.displayOrder || left.displayName.localeCompare(right.displayName)));
const CRAFT_DEFINITION_BY_ACTION = new Map();
for (const definition of VISIBLE_CRAFT_DEFINITIONS) {
  if (definition.engineAction && !CRAFT_DEFINITION_BY_ACTION.has(definition.engineAction)) {
    CRAFT_DEFINITION_BY_ACTION.set(definition.engineAction, definition);
  }
}

function definitionForElement(element) {
  return element ? CRAFTING_ITEM_REGISTRY[element.dataset.craftId] || null : null;
}

function actionForElement(element) {
  return definitionForElement(element)?.engineAction || null;
}

function omenForElement(element) {
  return definitionForElement(element)?.omenId || null;
}

function iconIdForAction(action) {
  return CRAFT_DEFINITION_BY_ACTION.get(action)?.iconId || action;
}

const CURRENCIES = Object.freeze(Object.fromEntries(VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.engineAction)
  .map(definition => [definition.engineAction, { color: definition.accentColor || DEFAULT_ORB_COLOR }])));
const ORB_VARIANTS = Object.freeze(Object.fromEntries(VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.operationOptions?.baseAction)
  .map(definition => [definition.engineAction, {
    base: definition.operationOptions.baseAction,
    minModLevel: definition.operationOptions.minModifierLevel,
    label: definition.displayName,
    abbr: definition.iconFallback,
  }])));
const CRAFT_OMENS = Object.freeze(Object.fromEntries(VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.omenInteraction?.exclusiveGroup === 'crafting_omen')
  .map(definition => [definition.omenInteraction.omenId, {
    currency: CRAFTING_ITEM_REGISTRY[definition.omenInteraction.triggerCraftId]?.engineAction || definition.triggeringAction,
    craftId: definition.craftId,
    label: definition.displayName,
  }])));
const CRAFT_DEFINITION_BY_COUNTER_KEY = new Map();
for (const definition of VISIBLE_CRAFT_DEFINITIONS) {
  CRAFT_DEFINITION_BY_COUNTER_KEY.set(definition.craftId, definition);
}

function craftIdForAction(action) {
  return CRAFT_DEFINITION_BY_ACTION.get(action)?.craftId || action;
}

function craftIdForOmen(omen) {
  return CRAFT_OMENS[omen]?.craftId ||
    VISIBLE_CRAFT_DEFINITIONS.find(definition => definition.omenId === omen)?.craftId || omen;
}

const performanceMetrics = [];
function measureOperation(name, operation) {
  const start = typeof performance !== 'undefined' ? performance.now() : 0;
  try {
    return operation();
  } finally {
    const duration = typeof performance !== 'undefined' ? performance.now() - start : 0;
    performanceMetrics.push({ name, duration });
    if (performanceMetrics.length > 120) performanceMetrics.shift();
  }
}

let engine = null;
let craftingRandomSource = null;
// Legacy name kept for compatibility: this now holds the ACTIVE base id for any
// category (e.g. 'ruby', 'rings', 'gloves_str'), not only jewels.
let currentJewelType = 'ruby';
// PoE2 item-class line shown on the tooltip (e.g. 'Jewel', 'Rings', 'Body
// Armours'). Set by loadBase() when a category is chosen on the select screen.
let currentItemClass = 'Jewel';
// Stable normalized concrete-base identity. The simulator pool remains in
// currentJewelType/baseType; this ID only identifies the in-game base selected
// inside the workbench.
let currentConcreteBaseId = null;
// Every outer item-class selection owns one or more compatible simulator
// pools. Concrete bases may switch between these pools without leaving the
// workbench (for example Strength to Dexterity Gloves).
let currentSelectablePoolIds = ['ruby', 'sapphire', 'emerald'];
// True while crafting a Jewel (keeps the Ruby/Sapphire/Emerald header selector
// visible). Every other base picks its base on the select screen and hides it.
let isJewelMode = true;
let modData = null;
let desecData = null;
let normalizedData = null;
let normalizedIndexes = null;
const concreteBasePoolCache = new Map();
let armedCurrency = null;
let stickyCurrency = null;
let showDetails = false;
let stash = [];
let dragIndex = null;
let dragCurrency = null;
// Hinekora's Lock: sealed foresight outcomes for the current Lock, keyed by
// currency. Computed lazily on hover and reused so the previewed result equals
// what gets committed. Cleared when the Lock is applied fresh or consumed.
let foreseenSeals = {};
let foreseenHover = null; // currency currently previewed on hover (or null)
let undoStack = [];
let redoStack = [];
let eventsBound = false;
let activeCraftTab = 'currency';
let craftInventoryMode = 'available';
let showDeprecatedCrafts = false;
let knownCraftDefinitions = null;
let knownItemsLoadPromise = null;

// Desecration (Abyssal) UI state.
// A directional Necromancy omen (sinistral/dextral) may be combined with
// Abyssal Echoes, so we track a set of active omens rather than a single one.
let selectedOmens = new Set();
let omenOfLightActive = false;
// Crafting omen currently armed (key in CRAFT_OMENS), or null.
let selectedCraftOmen = null;
let desecState = null;
// Item Level slider state: when locked, the knob can't be dragged.
let ilvlLocked = false;

// Last known pointer position, tracked continuously so the cursor orb can be
// placed correctly the instant a currency is armed — even before the pointer
// moves again. Without this the native cursor is hidden while the orb is still
// parked at its previous spot, making it look like the cursor "disappeared".
let lastMouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
let lastMouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
let orbRaf = 0;

function createCraftCard(definition) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'craft-item-card';
  for (const className of definition.cssClasses || []) button.classList.add(className);
  if (definition.actionType === 'omen') {
    button.classList.add('abyss-btn', definition.omenInteraction?.exclusiveGroup === 'crafting_omen' ? 'craft-omen-btn' : 'omen-btn');
  } else if (definition.tab === 'abyss' || definition.tab === 'breach') {
    button.classList.add('abyss-btn');
    if (definition.handler === 'startDesecrationFlow') button.classList.add('bone-btn');
    else button.classList.add('essence-btn');
  } else {
    button.classList.add('currency-btn');
  }
  if (definition.operationOptions?.baseAction) button.classList.add('tier-badge');
  button.dataset.craftId = definition.craftId;
  button.dataset.iconId = definition.iconId;
  button.dataset.craftCategory = definition.category;
  button.dataset.searchText = `${definition.displayName} ${definition.description} ${definition.category}`.toLocaleLowerCase();
  const status = definition.implementationStatus === 'deprecated_for_target_version'
    ? 'Deprecated'
    : definition.implementationStatus === 'non_item_currency'
      ? 'Audit only'
    : definition.confidence === 'inferred'
      ? 'Inferred'
      : definition.supported ? 'Verified' : 'Blocked';
  const statusSlug = status.toLocaleLowerCase().replace(/\s+/g, '-');
  button.dataset.craftStatus = statusSlug;
  button.setAttribute('aria-disabled', String(!definition.supported));
  button.setAttribute('aria-pressed', 'false');
  button.draggable = Boolean(definition.supported && definition.actionType !== 'omen');
  button.title = definition.supported ? definition.description : definition.unsupportedReason;

  const icon = document.createElement('div');
  icon.className = `currency-icon ${definition.tab === 'ritual' || definition.tab === 'abyss' || definition.tab === 'breach' ? 'abyss-icon' : ''}`.trim();
  const fallback = document.createElement('span');
  fallback.className = 'currency-abbr';
  fallback.textContent = definition.iconFallback;
  icon.appendChild(fallback);

  const label = document.createElement('span');
  label.className = 'currency-label';
  label.textContent = definition.displayName;
  if (definition.operationOptions?.baseAction) {
    label.hidden = true;
    button.setAttribute('aria-label', `${definition.displayName}, tier ${definition.historyTier || definition.operationOptions.variantTier || 1}, ${status}`);
    const tier = document.createElement('span');
    tier.className = 'tier-num';
    tier.textContent = definition.iconFallback;
    button.append(icon, label, tier);
  } else {
    button.append(icon, label);
    button.setAttribute('aria-label', `${definition.displayName}, ${status}`);
  }
  const statusLabel = document.createElement('span');
  statusLabel.className = `craft-status craft-status-${statusSlug}`;
  statusLabel.textContent = status;
  button.appendChild(statusLabel);
  return button;
}

function loadKnownCraftDefinitions() {
  if (knownCraftDefinitions) return Promise.resolve(knownCraftDefinitions);
  if (knownItemsLoadPromise) return knownItemsLoadPromise;
  knownItemsLoadPromise = new Promise((resolve, reject) => {
    const acceptLoadedData = () => {
      const payload = window.CRAFTING_KNOWN_ITEMS;
      if (!payload || payload.targetGameVersion !== CRAFTING_CURRENCY_INDEX?.targetGameVersion ||
          !Array.isArray(payload.craftRegistry)) {
        reject(new Error('The complete crafting catalog is missing or targets a different game version.'));
        return;
      }
      knownCraftDefinitions = Object.freeze(payload.craftRegistry
        .map(normalizeCraftDefinition)
        .sort((left, right) => (left.tabOrder || 0) - (right.tabOrder || 0) ||
          left.displayOrder - right.displayOrder || left.displayName.localeCompare(right.displayName)));
      registerCraftDefinitions(knownCraftDefinitions);
      window.CRAFTING_KNOWN_ITEMS = null;
      resolve(knownCraftDefinitions);
    };
    if (window.CRAFTING_KNOWN_ITEMS) {
      acceptLoadedData();
      return;
    }
    const script = document.createElement('script');
    script.src = 'data/crafting/known-items.data.js';
    script.async = true;
    script.dataset.craftingKnownItems = 'true';
    script.addEventListener('load', acceptLoadedData, { once: true });
    script.addEventListener('error', () => reject(new Error('Unable to load the complete crafting catalog.')), { once: true });
    document.head.appendChild(script);
  }).catch(error => {
    knownItemsLoadPromise = null;
    throw error;
  });
  return knownItemsLoadPromise;
}

function inventoryDefinitionsForTab(tabId) {
  const source = craftInventoryMode === 'known'
    ? (knownCraftDefinitions || [])
    : VISIBLE_CRAFT_DEFINITIONS;
  return source.filter(definition => definition.tab === tabId &&
    (showDeprecatedCrafts || definition.implementationStatus !== 'deprecated_for_target_version'));
}

function appendCraftCards(grid, definitions) {
  const rendered = new Set();
  for (const definition of definitions) {
    if (rendered.has(definition.craftId)) continue;
    const variants = definitions.filter(record => record.operationOptions?.baseAction === definition.engineAction);
    if (variants.length) {
      const cluster = document.createElement('div');
      cluster.className = 'cur-cluster';
      cluster.appendChild(createCraftCard(definition));
      const tiers = document.createElement('div');
      tiers.className = 'cur-tiers';
      for (const variant of variants) {
        tiers.appendChild(createCraftCard(variant));
        rendered.add(variant.craftId);
      }
      cluster.appendChild(tiers);
      grid.appendChild(cluster);
    } else if (!definition.operationOptions?.baseAction) {
      grid.appendChild(createCraftCard(definition));
    }
    rendered.add(definition.craftId);
  }
}

function renderActiveCraftPanel() {
  const panel = document.querySelector(`[data-craft-panel="${activeCraftTab}"]`);
  const tab = CRAFTING_TABS.find(record => record.id === activeCraftTab);
  if (!panel || !tab) return 0;
  return measureOperation('active-tab-render', () => {
    document.querySelectorAll('[data-craft-panel]').forEach(otherPanel => {
      if (otherPanel !== panel) otherPanel.replaceChildren();
    });
    panel.replaceChildren();
    if (tab.description) {
      const help = document.createElement('p');
      help.className = 'tab-help';
      help.textContent = tab.description;
      panel.appendChild(help);
    }
    const grid = document.createElement('div');
    grid.className = `crafting-card-grid ${tab.id}-card-grid`;
    if (tab.id === 'currency') {
      grid.id = 'currency-grid';
      grid.classList.add('currency-grid');
    }
    const definitions = inventoryDefinitionsForTab(tab.id);
    appendCraftCards(grid, definitions);
    panel.appendChild(grid);
    if (!definitions.length) {
      const counts = CRAFTING_CURRENCY_INDEX?.categoryCounts?.[tab.id] || { available: 0, known: 0 };
      const empty = document.createElement('div');
      empty.className = 'craft-inventory-empty';
      empty.setAttribute('role', 'status');
      empty.innerHTML = craftInventoryMode === 'available'
        ? `<strong>No implemented ${escapeHtml(tab.label)} operations yet.</strong><span>${counts.known} known item${counts.known === 1 ? '' : 's'} available in All known items.</span>`
        : `<strong>No items match the current filters.</strong><span>Clear search or applicability filters to see this category.</span>`;
      panel.appendChild(empty);
    }
    refreshCraftInventoryElements();
    syncRenderedCraftControlState();
    setupCurrencyIcons();
    filterCraftInventory();
    return definitions.length;
  });
}

// Startup creates only tab shells and renders the active category. The complete
// retained inventory is loaded only when All known items is selected, which
// preserves file:// support without parsing hundreds of blocked audit records.
function renderCraftingInventory() {
  const tabList = document.getElementById('craft-tab-list');
  const panelHost = document.getElementById('craft-tab-panels');
  const categoryFilter = document.getElementById('craft-category-filter');
  if (!tabList || !panelHost || !categoryFilter) return;
  tabList.replaceChildren();
  panelHost.replaceChildren();
  categoryFilter.replaceChildren();

  try {
    const savedTab = localStorage.getItem(CRAFT_TAB_STORAGE_KEY);
    if (savedTab && CRAFTING_TABS.some(tab => tab.id === savedTab)) activeCraftTab = savedTab;
  } catch (_) {}

  for (const tab of CRAFTING_TABS) {
    const active = tab.id === activeCraftTab;
    const tabButton = document.createElement('button');
    tabButton.id = `craft-tab-${tab.id}`;
    tabButton.type = 'button';
    tabButton.className = `craft-tab${active ? ' active' : ''}`;
    tabButton.setAttribute('role', 'tab');
    tabButton.dataset.craftTab = tab.id;
    tabButton.setAttribute('aria-selected', String(active));
    tabButton.setAttribute('aria-controls', `craft-panel-${tab.id}`);
    tabButton.tabIndex = active ? 0 : -1;
    tabButton.textContent = tab.label;
    tabList.appendChild(tabButton);
    categoryFilter.appendChild(new Option(tab.label, tab.id));

    const panel = document.createElement('section');
    panel.id = `craft-panel-${tab.id}`;
    panel.className = 'craft-tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.dataset.craftPanel = tab.id;
    panel.setAttribute('aria-labelledby', tabButton.id);
    panel.hidden = !active;

    panelHost.appendChild(panel);
  }
  categoryFilter.value = activeCraftTab;
  renderActiveCraftPanel();
}

const elements = {
  tooltip: document.getElementById('jewel-tooltip'),
  itemName: document.getElementById('item-name'),
  modList: document.getElementById('mod-list'),
  enchantList: document.getElementById('enchant-list'),
  baseDetailList: document.getElementById('base-detail-list'),
  qualityList: document.getElementById('quality-list'),
  socketList: document.getElementById('socket-list'),
  implicitList: document.getElementById('implicit-list'),
  corruptedLabel: document.getElementById('corrupted-label'),
  itemLevel: document.getElementById('item-level'),
  ilvlSlider: document.getElementById('ilvl-slider'),
  ilvlTrack: document.getElementById('ilvl-track'),
  ilvlFill: document.getElementById('ilvl-fill'),
  ilvlKnob: document.getElementById('ilvl-knob'),
  ilvlValue: document.getElementById('ilvl-value'),
  craftGlow: document.getElementById('craft-glow'),
  currencyGrid: document.getElementById('currency-grid'),
  currencyPanel: document.getElementById('currency-panel'),
  craftButtons: document.querySelectorAll('[data-craft-id]'),
  currencyBtns: document.querySelectorAll('.currency-btn'),
  resetBtn: document.getElementById('reset-btn'),
  errorToast: document.getElementById('error-toast'),
  cursorOrb: document.getElementById('cursor-orb'),
  jewelSelector: document.getElementById('jewel-selector'),
  jewelBtns: document.querySelectorAll('.jewel-btn'),
  craftModeLabel: document.getElementById('craft-mode-label'),
  stashGrid: document.getElementById('stash-grid'),
  saveBtn: document.getElementById('save-btn'),
  undoBtn: document.getElementById('undo-btn'),
  redoBtn: document.getElementById('redo-btn'),
  craftCounter: document.getElementById('craft-counter'),
  hinekoraMark: document.getElementById('hinekora-mark'),
  boneBtns: document.querySelectorAll('.bone-btn'),
  omenBtns: document.querySelectorAll('.omen-btn'),
  craftOmenBtns: document.querySelectorAll('.craft-omen-btn'),
  essenceBtns: document.querySelectorAll('.essence-btn'),
  craftTabs: document.querySelectorAll('[data-craft-tab]'),
  craftTabPanels: document.querySelectorAll('[data-craft-panel]'),
  craftItemSearch: document.getElementById('craft-item-search'),
  craftCategoryFilter: document.getElementById('craft-category-filter'),
  craftInventoryModes: document.querySelectorAll('input[name="craft-inventory-mode"]'),
  craftApplicableOnly: document.getElementById('craft-applicable-only'),
  craftShowDeprecated: document.getElementById('craft-show-deprecated'),
  craftDeprecatedLabel: document.getElementById('craft-deprecated-filter-label'),
  craftResultCount: document.getElementById('craft-result-count'),
  craftTabList: document.getElementById('craft-tab-list'),
  craftDescriptionTitle: document.getElementById('craft-item-description-title'),
  craftDescriptionText: document.getElementById('craft-item-description-text'),
  sanctifiedLabel: document.getElementById('sanctified-label'),
  revealPanel: document.getElementById('reveal-panel'),
  revealBtn: document.getElementById('reveal-btn'),
  wellModal: document.getElementById('well-modal'),
  wellSub: document.getElementById('well-sub'),
  wellOptions: document.getElementById('well-options'),
  wellReroll: document.getElementById('well-reroll'),
  wellRerolls: document.getElementById('well-rerolls'),
  wellCancel: document.getElementById('well-cancel'),
  itemFlavor: document.getElementById('item-flavor'),
};

let craftingInventoryReady = false;
function refreshCraftInventoryElements() {
  elements.currencyGrid = document.getElementById('currency-grid');
  elements.craftButtons = document.querySelectorAll('[data-craft-id]');
  elements.currencyBtns = document.querySelectorAll('.currency-btn');
  elements.boneBtns = document.querySelectorAll('.bone-btn');
  elements.omenBtns = document.querySelectorAll('.omen-btn');
  elements.craftOmenBtns = document.querySelectorAll('.craft-omen-btn');
  elements.essenceBtns = document.querySelectorAll('.essence-btn');
  elements.craftTabs = document.querySelectorAll('[data-craft-tab]');
  elements.craftTabPanels = document.querySelectorAll('[data-craft-panel]');
}

function syncRenderedCraftControlState() {
  const item = engine?.getItem();
  elements.craftButtons.forEach(button => {
    const definition = definitionForElement(button);
    setCraftButtonState(button, item ? disabledReasonForDefinition(definition, item) : '');
    const action = definition?.engineAction;
    const isArmed = Boolean(action && action === armedCurrency);
    button.classList.toggle('armed', isArmed);
    button.classList.toggle('sticky', isArmed && stickyCurrency === action);
    button.dataset.repeatMode = String(isArmed && stickyCurrency === action);
    const omen = definition?.omenId;
    const omenActive = definition?.handler === 'toggleCraftOmen'
      ? omen === selectedCraftOmen
      : omen === 'omen_of_light' ? omenOfLightActive : selectedOmens.has(omen);
    button.classList.toggle('active', Boolean(omen && omenActive));
    button.setAttribute('aria-pressed', String(isArmed || Boolean(omen && omenActive)));
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Merge every loaded category mod file (jewels, time-lost, armour, weapons,
// jewellery, off-hand, flasks) into one { bases } pool. A base that lists
// `inherits` gets the named shared prefix/suffix pools merged in at load time,
// so mods common to a category only need to be written once.
function resolveInherits(baseDef, shared) {
  if (!baseDef || !Array.isArray(baseDef.inherits) || !baseDef.inherits.length) return baseDef;
  const pre = [], suf = [];
  for (const key of baseDef.inherits) {
    const s = shared && shared[key];
    if (!s) continue;
    if (Array.isArray(s.prefixes)) pre.push(...s.prefixes);
    if (Array.isArray(s.suffixes)) suf.push(...s.suffixes);
  }
  const out = Object.assign({}, baseDef);
  out.prefixes = pre.concat(baseDef.prefixes || []);
  out.suffixes = suf.concat(baseDef.suffixes || []);
  delete out.inherits;
  return out;
}

function mergeModSources() {
  const srcBases = window.MOD_BASES || {};
  const shared = window.MOD_SHARED || {};
  const bases = {};
  for (const id in srcBases) bases[id] = resolveInherits(srcBases[id], shared);
  return { bases };
}

function buildNormalizedDataIndexes(data) {
  if (!data?.baseItems || !data?.implicits || !data?.sourceModifiers || !data?.overlayByPool) return null;
  return measureOperation('normalized-index-build', () => {
    const indexes = {
      basesById: new Map(),
      simulatorPoolByBaseId: new Map(),
      classesById: new Map(),
      implicitModifiersById: new Map(),
      sourceModifiersById: new Map(),
      craftingMethodsByHandler: new Set(data.craftingHandlers || []),
    };

    for (const sourceClass of data.baseItems.classes || []) indexes.classesById.set(sourceClass.id, sourceClass);
    for (const base of data.baseItems.bases || []) indexes.basesById.set(base.id, base);
    for (const [id, modifier] of Object.entries(data.implicits || {})) {
      indexes.implicitModifiersById.set(Number(id), modifier);
    }
    for (const [id, modifier] of Object.entries(data.sourceModifiers || {})) {
      indexes.sourceModifiersById.set(Number(id), modifier);
    }

    for (const [simulatorPoolId, mapping] of Object.entries(data.baseItems.simulatorBaseMap || {})) {
      for (const concreteBaseId of mapping.concreteBaseIds || []) {
        const concreteBase = indexes.basesById.get(concreteBaseId);
        if (!concreteBase) {
          throw new Error(`Simulator pool ${simulatorPoolId} references unknown concrete base ${concreteBaseId}.`);
        }
        const existingPoolId = indexes.simulatorPoolByBaseId.get(concreteBaseId);
        if (existingPoolId && existingPoolId !== simulatorPoolId) {
          throw new Error(`Concrete base ${concreteBaseId} maps to both ${existingPoolId} and ${simulatorPoolId}.`);
        }
        if (!(mapping.classIds || []).includes(concreteBase.classId) ||
            !(mapping.classIds || []).includes(concreteBase.modifierPoolClassId)) {
          throw new Error(`Concrete base ${concreteBaseId} does not match simulator pool ${simulatorPoolId}.`);
        }
        indexes.simulatorPoolByBaseId.set(concreteBaseId, simulatorPoolId);
      }
    }
    return indexes;
  });
}

function normalizedRequiredLevel(base) {
  const value = base?.requiredLevel ?? base?.requirements?.level ?? null;
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function canonicalItemClassName(sourceItemClass, equipmentSlot) {
  if (sourceItemClass === 'LifeFlask') return 'Life Flask';
  if (sourceItemClass === 'ManaFlask') return 'Mana Flask';
  if (sourceItemClass === 'UtilityFlask' && equipmentSlot === 'Charm') return 'Charm';
  return sourceItemClass || null;
}

function normalizedStatText(stat) {
  if (!stat || !stat.id) return '';
  const label = String(stat.id).replaceAll('_', ' ').replace(/\s+/g, ' ').trim();
  const range = Array.isArray(stat.range) ? stat.range : [];
  const values = range.length === 0
    ? ''
    : range.length === 1 || range[0] === range[1]
      ? String(range[0])
      : `${range[0]}\u2013${range[1]}`;
  return `${capitalize(label)}${values ? `: ${values}` : ''}`;
}

function normalizedImplicitSnapshot(modifierId) {
  const modifier = normalizedIndexes?.implicitModifiersById.get(Number(modifierId));
  if (!modifier) return { id: modifierId, key: null, stats: [], displayText: `Modifier ${modifierId}` };
  const [key, modifierGroupId, modifierGroup, sourceStats] = modifier;
  const stats = Array.isArray(sourceStats) ? structuredClone(sourceStats) : [];
  const statText = stats.map(normalizedStatText).filter(Boolean);
  return {
    id: modifierId,
    key: key || null,
    modifierGroupId: modifierGroupId ?? null,
    modifierGroup: modifierGroup || null,
    stats,
    // The source export has no localization templates. This deliberately uses
    // sourced stat identifiers/ranges instead of inventing in-game wording.
    displayText: statText.join('; ') || key || `Modifier ${modifierId}`,
  };
}

function concreteBaseDefinition(base, simulatorPoolId) {
  if (!base) return null;
  const sourceClass = normalizedIndexes?.classesById.get(base.classId);
  const attributeFamily = ({
    attr_str: 'str',
    attr_dex: 'dex',
    attr_int: 'int',
    attr_strdex: 'str_dex',
    attr_strint: 'str_int',
    attr_dexint: 'dex_int',
    attr_all: 'str_dex_int',
  })[sourceClass?.iconKey] || null;
  return {
    id: base.id,
    sourceId: base.id,
    metadataKey: base.metadataKey || null,
    displayName: base.displayName,
    itemClass: canonicalItemClassName(base.itemClass, base.equipmentSlot),
    sourceItemClass: base.itemClass,
    equipmentSlot: base.equipmentSlot || null,
    classId: base.classId,
    modifierPoolClassId: base.modifierPoolClassId,
    simulatorPoolId,
    attributeFamily,
    variantFamily: simulatorPoolId,
    requiredLevel: normalizedRequiredLevel(base),
    dropLevel: base.dropLevel != null && Number.isFinite(Number(base.dropLevel)) ? Number(base.dropLevel) : null,
    tags: Array.isArray(base.tags) ? [...new Set(base.tags.map(String))] : [],
    requirements: base.requirements && typeof base.requirements === 'object'
      ? structuredClone(base.requirements)
      : {},
    baseProperties: base.baseProperties && typeof base.baseProperties === 'object' && !Array.isArray(base.baseProperties)
      ? structuredClone(base.baseProperties)
      : {},
    implicits: (base.implicitModifierIds || []).map(normalizedImplicitSnapshot),
    sourceSocketCount: base.socketCount != null && Number.isFinite(Number(base.socketCount)) ? Number(base.socketCount) : null,
    defaultSockets: null,
    maximumSockets: null,
    icon: base.icon || sourceClass?.iconKey || null,
    selectable: !base.unmodifiable,
    disabledReason: base.unmodifiable ? 'This normalized base is marked unmodifiable.' : '',
    targetGameVersion: normalizedData?.targetGameVersion || null,
    sourceVersion: normalizedData?.source?.embeddedGameVersion || null,
    verificationState: normalizedData?.source?.versionStatus || null,
    provenance: {
      normalizedPath: 'data/normalized/base-items.json',
      sourceSha256: normalizedData?.source?.sha256 || null,
    },
  };
}

function concreteBasesForPool(simulatorPoolId) {
  if (concreteBasePoolCache.has(simulatorPoolId)) return concreteBasePoolCache.get(simulatorPoolId);
  const mapping = normalizedData?.baseItems?.simulatorBaseMap?.[simulatorPoolId];
  if (!mapping || !normalizedIndexes) return [];
  const bases = (mapping.concreteBaseIds || [])
    .map(id => normalizedIndexes.basesById.get(id))
    .filter(Boolean)
    .map(base => concreteBaseDefinition(base, simulatorPoolId));
  concreteBasePoolCache.set(simulatorPoolId, bases);
  return bases;
}

function concreteBasesForPools(simulatorPoolIds) {
  return (simulatorPoolIds || []).flatMap(concreteBasesForPool);
}

function poolHasCraftableData(simulatorPoolId) {
  const pool = modData?.bases?.[simulatorPoolId];
  return !!pool && ((pool.prefixes || []).length > 0 || (pool.suffixes || []).length > 0);
}

function selectablePoolsFor(simulatorPoolId) {
  if (JEWEL_BASES.has(simulatorPoolId)) {
    return ['ruby', 'sapphire', 'emerald']
      .filter(poolId => poolHasCraftableData(poolId) && concreteBasesForPool(poolId).length > 0);
  }
  const itemClass = concreteBasesForPool(simulatorPoolId)[0]?.sourceItemClass;
  if (!itemClass) return poolHasCraftableData(simulatorPoolId) ? [simulatorPoolId] : [];
  return Object.keys(normalizedData?.baseItems?.simulatorBaseMap || {})
    .filter(poolId => poolHasCraftableData(poolId))
    .filter(poolId => concreteBasesForPool(poolId)[0]?.sourceItemClass === itemClass)
    .sort();
}

function concreteBaseById(baseItemId, simulatorPoolId = currentJewelType) {
  const numericId = Number(baseItemId);
  return concreteBasesForPool(simulatorPoolId)
    .find(base => Number(base.id) === numericId) || null;
}

function concreteBaseByIdAcrossMappings(baseItemId) {
  const numericId = Number(baseItemId);
  const simulatorPoolId = normalizedIndexes?.simulatorPoolByBaseId.get(numericId);
  return simulatorPoolId ? concreteBaseById(numericId, simulatorPoolId) : null;
}

function concreteBaseByIdInCurrentClass(baseItemId) {
  const numericId = Number(baseItemId);
  return concreteBasesForPools(currentSelectablePoolIds)
    .find(base => Number(base.id) === numericId) || null;
}

function defaultConcreteBaseForPool(simulatorPoolId) {
  // Normalized mappings are emitted in stable numeric ID order.
  return concreteBasesForPool(simulatorPoolId).find(base => base.selectable) || null;
}

function concreteBaseContext() {
  const bases = concreteBasesForPools(currentSelectablePoolIds);
  const item = engine ? engine.getItem() : null;
  const attributeFamilies = [...new Set(bases.map(base => base.attributeFamily).filter(Boolean))].sort();
  return {
    enabled: bases.length > 0,
    workbenchBaseId: isJewelMode ? 'jewels' : currentJewelType,
    simulatorPoolId: currentJewelType,
    simulatorPoolIds: currentSelectablePoolIds.slice(),
    itemClass: item?.itemClass || null,
    classLabel: currentItemClass,
    selectedBaseItemId: item?.baseItemId ?? currentConcreteBaseId,
    bases,
    attributeFamilies,
    hasRequiredLevel: bases.some(base => base.requiredLevel != null),
    requiredLevelBlocker: bases.some(base => base.requiredLevel != null)
      ? ''
      : 'Required levels are unavailable in the verified normalized source.',
    error: bases.length === 0
      ? `Normalized concrete base data is unavailable for ${currentItemClass}.`
      : '',
  };
}

function notifyConcreteBaseChange() {
  if (typeof window.CustomEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent('craftforge:concrete-base-changed', {
    detail: concreteBaseContext(),
  }));
}

function requestConcreteBaseConfirmation(result) {
  if (typeof window.CustomEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent('craftforge:base-change-confirmation-requested', {
    detail: result,
  }));
}

function buildSourceModifierOverlay(baseType) {
  if (!normalizedIndexes || !normalizedData) return null;
  const rows = normalizedData.overlayByPool?.[baseType];
  const typeData = modData?.bases?.[baseType];
  if (!Array.isArray(rows) || !typeData) return null;

  return measureOperation('base-modifier-overlay', () => {
    const overlay = new Map();
    for (const [key, modifierId, spawnWeight] of rows) {
      const source = normalizedIndexes.sourceModifiersById.get(Number(modifierId));
      if (!source) throw new Error(`Runtime modifier overlay references unknown source modifier ${modifierId}.`);
      const [sourceModifierKey, sourceModifierGroupId, modifierTags, requiredTags, forbiddenTags, weightConditions] = source;
      overlay.set(key, {
        stableModifierId: Number(modifierId),
        sourceModifierKey,
        sourceModifierGroupId,
        spawnWeight,
        modifierTags: modifierTags || [],
        requiredTags: requiredTags || [],
        forbiddenTags: forbiddenTags || [],
        weightConditions: weightConditions || [],
      });
    }
    return overlay;
  });
}

const CRAFT_VALIDATORS = Object.freeze({
  currencyDisabledReason: (definition, item) => currencyDisabledReason(definition.engineAction, item),
  boneDisabledReason: (definition, item) => boneDisabledReason(definition, item),
  essenceDisabledReason: (definition, item) => essenceDisabledReason(definition.engineAction, item),
  omenDisabledReason: (definition, item) => omenDisabledReason(definition, item),
  unsupportedReason: definition => definition.unsupportedReason,
  staticDisabledReason: definition => definition.unsupportedReason,
});

function disabledReasonForDefinition(definition, item = engine?.getItem()) {
  if (!definition) return UNSUPPORTED_REASON;
  if (!definition.supported) return definition.unsupportedReason || UNSUPPORTED_REASON;
  const validator = CRAFT_VALIDATORS[definition.disabledReasonHandler];
  if (typeof validator !== 'function') return `Registry validator is unavailable: ${definition.disabledReasonHandler || '(missing)'}.`;
  return item ? validator(definition, item) : '';
}

function validateCraftRegistry() {
  const specializedHandlers = { applyHinekoraLock, startDesecrationFlow, toggleOmen, toggleCraftOmen };
  const indexedRegistry = knownCraftDefinitions || CRAFTING_CURRENCY_INDEX?.craftRegistry || [];
  if (!indexedRegistry.length || indexedRegistry.length !== Object.keys(CRAFTING_ITEM_REGISTRY).length) {
    throw new Error('Authoritative crafting registry is missing or incomplete.');
  }
  if (CRAFTING_TABS.length !== 10) throw new Error('Crafting registry must define all ten workbench tabs.');
  const registryIds = new Set();
  const metadataKeys = new Set();
  for (const definition of Object.values(CRAFTING_ITEM_REGISTRY)) {
    const id = definition.craftId;
    if (!id || registryIds.has(id)) throw new Error(`Duplicate or missing crafting ID: ${id || '(empty)'}`);
    registryIds.add(id);
    if (!definition.displayName || !definition.category || !definition.tab || !definition.iconId || !definition.description) {
      throw new Error(`Crafting registry metadata is incomplete for ${id}.`);
    }
    if (definition.metadataKey) {
      if (metadataKeys.has(definition.metadataKey)) throw new Error(`Duplicate crafting metadata mapping: ${definition.metadataKey}`);
      metadataKeys.add(definition.metadataKey);
    }
    if (definition.supported && (!definition.disabledReasonHandler || !definition.handler)) {
      throw new Error(`Supported crafting card lacks validator/handler: ${id}`);
    }
    if (definition.supported && typeof CRAFT_VALIDATORS[definition.disabledReasonHandler] !== 'function') {
      throw new Error(`Eligibility validator is missing for ${id}: ${definition.disabledReasonHandler}`);
    }
    if (!definition.supported && (!definition.unsupportedReason || definition.handler)) {
      throw new Error(`Unsupported crafting card lacks a specific reason or exposes a handler: ${id}`);
    }
    if (definition.supported && definition.actionType === 'direct' && typeof CraftingEngine.prototype[definition.handler] !== 'function') {
      throw new Error(`Engine handler is missing for ${id}: ${definition.handler}`);
    }
    if (definition.supported && (definition.actionType === 'specialized' || definition.actionType === 'omen') &&
        typeof specializedHandlers[definition.handler] !== 'function') {
      throw new Error(`Specialized handler is missing for ${id}: ${definition.handler}`);
    }
    const triggerCraftId = definition.omenInteraction?.triggerCraftId;
    if (triggerCraftId && !CRAFTING_ITEM_REGISTRY[triggerCraftId]) {
      throw new Error(`Omen trigger does not resolve for ${id}: ${triggerCraftId}`);
    }
    if (definition.sourceHandler && normalizedIndexes && !normalizedIndexes.craftingMethodsByHandler.has(definition.sourceHandler)) {
      throw new Error(`Imported crafting method is missing for ${id}: ${definition.sourceHandler}`);
    }
  }

  const seen = new Set();
  for (const card of document.querySelectorAll('[data-craft-id]')) {
    const id = card.dataset.craftId;
    if (!id || seen.has(id)) throw new Error(`Duplicate or missing crafting ID: ${id || '(empty)'}`);
    seen.add(id);
    const definition = CRAFTING_ITEM_REGISTRY[id];
    if (!definition) throw new Error(`Crafting registry entry not found: ${id}`);
    if (definition.implementationStatus === 'deprecated_for_target_version' && !showDeprecatedCrafts) {
      throw new Error(`Deprecated crafting definition was rendered without audit mode: ${id}`);
    }
    const panel = card.closest('[data-craft-panel]');
    if (panel && panel.dataset.craftPanel !== definition.tab) {
      throw new Error(`Crafting card ${id} is in ${panel.dataset.craftPanel}, expected ${definition.tab}.`);
    }
  }
  if (seen.size !== inventoryDefinitionsForTab(activeCraftTab).length) {
    throw new Error('Rendered crafting inventory does not match the active category model.');
  }
  return true;
}

async function init() {
  try {
    measureOperation('initial-data-load', () => {
      if (!window.MOD_BASES) throw new Error('Mod data not found — run build (build.cmd) to generate data/mods.data.js.');
      if (!window.COE_RUNTIME_DATA) throw new Error('Compiled runtime crafting data not found — run build (build.cmd).');
      if (!window.CRAFTING_CURRENCY_INDEX) throw new Error('Crafting currency index not found — run build (build.cmd).');
      modData = mergeModSources();
      normalizedData = window.COE_RUNTIME_DATA;
      normalizedIndexes = buildNormalizedDataIndexes(normalizedData);

      // Desecrated (Abyssal) mod pools — optional. Desecration is disabled if absent.
      desecData = window.DESECRATED_MODS_RAW || null;

      loadStash();
      if (USE_SOUND_FILES) preloadSounds();
      // Core base selection and the CraftForge bridge must remain usable even
      // if the independent crafting-inventory renderer has invalid data.
      createEngine(currentJewelType);

      try {
        renderCraftingInventory();
        refreshCraftInventoryElements();
        validateCraftRegistry();
        setupCurrencyIcons();
        craftingInventoryReady = true;
        renderItem();
      } catch (registryError) {
        craftingInventoryReady = false;
        console.error('Crafting registry initialization failed:', registryError);
        showError(`Crafting inventory unavailable: ${registryError.message}`);
      }
      setupEventListeners();
    });
    if (typeof performance !== 'undefined') {
      const bootDuration = performance.now() - APP_BOOT_STARTED;
      performanceMetrics.push({ name: 'app-boot', duration: bootDuration });
      document.documentElement.dataset.appBootMs = bootDuration.toFixed(3);
      const dataLoad = performanceMetrics.find(metric => metric.name === 'initial-data-load');
      if (dataLoad) document.documentElement.dataset.initialDataLoadMs = dataLoad.duration.toFixed(3);
    }
  } catch (err) {
    console.error('Error initializing simulator:', err);
    showError('Error initializing simulator: ' + err.message);
  }
}

// Reset all omen-related UI state to a clean slate. Called whenever the active
// item is swapped out from under the UI (new engine, or an item loaded from the
// stash) so leftover armed omens can't leak onto the new item. Both call sites
// (createEngine + loadFromStash) share this so they can't drift apart again.
function resetOmenState() {
  selectedOmens.clear();
  omenOfLightActive = false;
  selectedCraftOmen = null;
  if (elements.omenBtns) elements.omenBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  if (elements.craftOmenBtns) elements.craftOmenBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
}

function createEngine(type, concreteBase = null) {
  return measureOperation('base-selection', () => {
    const selectedConcreteBase = concreteBase || defaultConcreteBaseForPool(type);
    currentConcreteBaseId = selectedConcreteBase?.id ?? null;
    engine = new CraftingEngine(
      modData,
      type,
      desecData,
      buildSourceModifierOverlay(type),
      null,
      selectedConcreteBase,
      craftingRandomSource,
    );
    undoStack = [];
    redoStack = [];
    resetOmenState();
    clearDesecration();
    renderItem();
    notifyConcreteBaseChange();
    return engine;
  });
}

// Jewel base ids -- the only category that swaps sub-bases from the in-craft
// header selector. Every other category picks its concrete base on the item
// select screen instead.
const JEWEL_BASES = new Set([
  'ruby', 'sapphire', 'emerald', 'diamond',
  'time_lost_ruby', 'time_lost_sapphire', 'time_lost_emerald', 'time_lost_diamond',
]);

function setJewelSelectorVisible(show) {
  if (elements.jewelSelector) elements.jewelSelector.style.display = show ? '' : 'none';
}

function syncJewelSelectorActive() {
  if (!elements.jewelBtns) return;
  elements.jewelBtns.forEach(b => b.classList.toggle('active', b.dataset.type === currentJewelType));
}

// Called by the item-select screen (select.js) when a category/base is chosen.
// Switches the engine to that base, updates the item-class label, and shows or
// hides the jewel header selector. Returns false (and shows an error) if the
// base has no compiled data so the caller can keep the select screen open.
function loadBase(baseId, classLabel) {
  if (baseId === 'jewels') {
    // Jewel mode: keep/repair the active jewel base and show the header swatch
    // selector so Ruby/Sapphire/Emerald can be swapped without leaving craft.
    isJewelMode = true;
    currentItemClass = 'Jewel';
    if (!['ruby', 'sapphire', 'emerald'].includes(currentJewelType)) currentJewelType = 'ruby';
    setJewelSelectorVisible(true);
    syncJewelSelectorActive();
  } else {
    if (!modData || !modData.bases || !modData.bases[baseId] || !poolHasCraftableData(baseId)) {
      showError('That base has no data yet -- run build (build.cmd) after adding it.');
      return false;
    }
    isJewelMode = false;
    currentJewelType = baseId;          // legacy var now holds any base id
    currentItemClass = classLabel || 'Item';
    setJewelSelectorVisible(false);
  }
  currentSelectablePoolIds = selectablePoolsFor(currentJewelType);
  if (!currentSelectablePoolIds.length || !currentSelectablePoolIds.includes(currentJewelType)) {
    showError('No verified concrete bases are available for this item class.');
    return false;
  }
  const defaultBase = defaultConcreteBaseForPool(currentJewelType);
  if (!defaultBase) {
    showError('No selectable concrete base is available for this simulator pool.');
    return false;
  }
  disarmCurrency();
  createEngine(currentJewelType, defaultBase);
  return true;
}

function selectConcreteBase(baseItemId, options = {}) {
  if (!engine || currentSelectablePoolIds.length === 0) {
    return { success: false, error: 'Concrete base selection is not available for this item class.' };
  }
  const nextBase = concreteBaseByIdInCurrentClass(baseItemId);
  if (!nextBase) {
    const error = 'That concrete base is not available for the active item class.';
    showError(error);
    return { success: false, error };
  }
  if (!nextBase.selectable) {
    const error = nextBase.disabledReason || 'That concrete base cannot be modified.';
    showError(error);
    return { success: false, error };
  }

  const currentItem = engine.getItem();
  if (Number(currentItem.baseItemId) === Number(nextBase.id)) {
    return { success: true, unchanged: true, base: nextBase };
  }

  const crafted = !engine.isFreshItem();
  if (crafted && options.confirmed !== true) {
    return {
      success: false,
      requiresConfirmation: true,
      currentBaseName: currentItem.baseName,
      nextBaseName: nextBase.displayName,
      nextBaseItemId: nextBase.id,
      nextSimulatorPoolId: nextBase.simulatorPoolId,
    };
  }

  const before = snapshotState(currentItem);
  pushUndo(before);
  if (nextBase.simulatorPoolId === currentJewelType) {
    engine.setConcreteBase(nextBase, { resetItem: true, preserveItemLevel: true });
  } else {
    engine = new CraftingEngine(
      modData,
      nextBase.simulatorPoolId,
      desecData,
      buildSourceModifierOverlay(nextBase.simulatorPoolId),
      null,
      nextBase,
      craftingRandomSource,
    );
    engine.setItemLevel(currentItem.itemLevel ?? currentItem.ilvl);
    currentJewelType = nextBase.simulatorPoolId;
  }
  currentConcreteBaseId = nextBase.id;
  syncJewelSelectorActive();
  resetOmenState();
  clearDesecration();
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  disarmCurrency();
  renderItem();
  notifyConcreteBaseChange();
  return { success: true, reset: crafted, base: nextBase, item: engine.getItem() };
}

function syncConcreteBaseTemplateFromItem(item) {
  if (!item) return null;
  const simulatorPoolId = item.simulatorPoolId || item.baseType || item.jewelType || currentJewelType;
  if (!modData?.bases?.[simulatorPoolId]) return null;
  currentJewelType = simulatorPoolId;
  if (!currentSelectablePoolIds.includes(simulatorPoolId)) {
    currentSelectablePoolIds = selectablePoolsFor(simulatorPoolId);
  }
  const base = concreteBaseById(item.baseItemId, simulatorPoolId) || defaultConcreteBaseForPool(simulatorPoolId);
  if (!base) return null;
  if (!engine || engine.baseType !== simulatorPoolId) {
    engine = new CraftingEngine(
      modData,
      simulatorPoolId,
      desecData,
      buildSourceModifierOverlay(simulatorPoolId),
      null,
      base,
      craftingRandomSource,
    );
  } else {
    engine.setConcreteBase(base, { resetItem: false });
  }
  currentConcreteBaseId = base.id;
  isJewelMode = JEWEL_BASES.has(simulatorPoolId);
  setJewelSelectorVisible(isJewelMode);
  syncJewelSelectorActive();
  return base;
}

// Expose the bridge the select screen calls. Assigned at load time so it exists
// before the user can click a category card.
window.CraftForge = window.CraftForge || {};
window.CraftForge.loadBase = loadBase;
window.CraftForge.setCraftTab = (tabId) => setActiveCraftTab(tabId);
window.CraftForge.getActiveCraftTab = () => activeCraftTab;
window.CraftForge.getCraftRegistry = () => CRAFTING_ITEM_REGISTRY;
window.CraftForge.setCraftingRandomSource = source => {
  if (source != null && typeof source !== 'function') throw new TypeError('Crafting RNG must be a function or null.');
  craftingRandomSource = source;
  if (engine) engine.setRandomSource(source);
  invalidateForesightContext();
};
window.CraftForge.getPerformanceMetrics = () => performanceMetrics.map(metric => ({ ...metric }));
window.CraftForge.reloadCraftIcons = () => setupCurrencyIcons();
window.CraftForge.getConcreteBaseContext = concreteBaseContext;
window.CraftForge.selectConcreteBase = selectConcreteBase;
window.CraftForge.getNormalizedIndexCounts = () => normalizedIndexes
  ? { ...(normalizedData?.counts || {}) }
  : null;

let craftIconObserver = null;
function setupCurrencyIcons() {
  if (!craftIconObserver && typeof IntersectionObserver === 'function') {
    craftIconObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const iconEl = entry.target;
        loadIconInto(iconEl, iconEl.dataset.lazyIconId);
        craftIconObserver.unobserve(iconEl);
      }
    }, { root: elements.currencyPanel, rootMargin: '160px' });
  }
  document.querySelectorAll('[data-craft-id]').forEach(card => {
    const definition = definitionForElement(card);
    const iconEl = card.querySelector('.currency-icon');
    const iconId = card.dataset.iconId || definition?.iconId || card.dataset.craftId;
    if (!iconEl || !iconId) return;
    iconEl.dataset.lazyIconId = iconId;
    if (craftIconObserver) craftIconObserver.observe(iconEl);
    else loadIconInto(iconEl, iconId);
  });
  loadIconInto(elements.hinekoraMark, 'hinekora-mark');
}

function loadIconInto(iconEl, iconId) {
  if (!iconEl || !iconId) return;
  const existing = Array.from(iconEl.querySelectorAll('.currency-img'))
    .find(image => image.dataset.iconId === iconId);
  if (existing) return existing;
  iconEl.querySelectorAll('.currency-img').forEach(image => image.remove());
  iconEl.classList.remove('has-real-icon');
  const img = new Image();
  img.className = 'currency-img';
  img.alt = '';
  img.hidden = true;
  img.dataset.iconId = iconId;
  img.addEventListener('load', () => {
    if (!img.isConnected) return;
    img.hidden = false;
    iconEl.classList.add('has-real-icon');
  }, { once: true });
  img.addEventListener('error', () => {
    img.remove();
    if (!iconEl.querySelector('.currency-img')) iconEl.classList.remove('has-real-icon');
  }, { once: true });
  iconEl.appendChild(img);
  img.src = `assets/icons/${iconId}.png`;
  return img;
}

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

const SOUND_TYPES = ['transmutation','augmentation','alchemy','regal','exalted','chaos','annulment','divine','fracturing','vaal','hinekora','undo','reset','error'];
const soundFiles = {};
const soundReady = {};

function preloadSounds() {
  SOUND_TYPES.forEach(type => {
    const audio = new Audio(`assets/sounds/${type}.mp3`);
    audio.preload = 'auto';
    audio.addEventListener('canplaythrough', () => { soundReady[type] = true; }, { once: true });
    audio.addEventListener('error', () => { soundReady[type] = false; });
    soundFiles[type] = audio;
  });
}

function playSound(type) {
  if (USE_SOUND_FILES && soundReady[type] && soundFiles[type]) {
    try {
      const a = soundFiles[type];
      a.currentTime = 0;
      a.volume = 0.6;
      a.play().catch(() => playProceduralSound(type));
      return;
    } catch (e) { /* fall through */ }
  }
  playProceduralSound(type);
}

function playProceduralSound(type) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  if (type === 'vaal') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.3);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(800, now);
    osc2.frequency.linearRampToValueAtTime(400, now + 0.3);
    gain2.gain.setValueAtTime(0.1, now);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.start(now); osc2.stop(now + 0.3);
    return;
  }

  let freq = 400, sweep = 800, dur = 0.15, oscType = 'sine';
  switch (type) {
    case 'transmutation': freq = 300; sweep = 600; break;
    case 'augmentation':  freq = 400; sweep = 700; dur = 0.1; break;
    case 'alchemy':       freq = 200; sweep = 800; oscType = 'triangle'; break;
    case 'regal':         freq = 350; sweep = 750; oscType = 'triangle'; break;
    case 'exalted':       freq = 600; sweep = 1200; dur = 0.25; break;
    case 'chaos':         freq = 150; sweep = 300; oscType = 'sawtooth'; dur = 0.2; break;
    case 'annulment':     freq = 800; sweep = 200; dur = 0.2; break;
    case 'divine':        freq = 500; sweep = 1000; oscType = 'square'; dur = 0.2; break;
    case 'fracturing':    freq = 520; sweep = 110; oscType = 'square'; dur = 0.18; break;
    case 'hinekora':      freq = 420; sweep = 900; oscType = 'triangle'; dur = 0.22; break;
    case 'desecration':   freq = 180; sweep = 70; oscType = 'sawtooth'; dur = 0.26; break;
    case 'undo':          freq = 300; sweep = 620; dur = 0.12; break;
    case 'reset':         freq = 200; sweep = 100; dur = 0.1; break;
    case 'error':         freq = 150; sweep = 120; oscType = 'sawtooth'; dur = 0.15; break;
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = oscType;
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(sweep, now + dur);
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
  osc.start(now); osc.stop(now + dur);
}

const CRAFT_TAB_STORAGE_KEY = 'poe2_active_craft_tab';

// Tab changes are intentionally presentation-only. The engine instance, active
// item, pending/armed Omens, history stacks, stash, and counters stay untouched.
function setActiveCraftTab(tabId, { focus = false, persist = true } = {}) {
  return measureOperation('tab-switch', () => {
    const target = Array.from(elements.craftTabs).find(tab => tab.dataset.craftTab === tabId);
    if (!target) return false;
    const targetPanel = Array.from(elements.craftTabPanels).find(panel => panel.dataset.craftPanel === tabId);
    const shouldRender = activeCraftTab !== tabId || !targetPanel?.childElementCount;

    activeCraftTab = tabId;
    elements.craftTabs.forEach(tab => {
      const selected = tab === target;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    elements.craftTabPanels.forEach(panel => {
      panel.hidden = panel.dataset.craftPanel !== tabId;
    });
    if (elements.craftCategoryFilter) elements.craftCategoryFilter.value = tabId;
    if (shouldRender) renderActiveCraftPanel();

    if (persist) {
      try { localStorage.setItem(CRAFT_TAB_STORAGE_KEY, tabId); } catch (_) {}
    }
    if (focus) target.focus();
    return true;
  });
}

function setupCraftTabs() {
  if (!elements.craftTabs.length || !elements.craftTabPanels.length) return;

  let saved = 'currency';
  try { saved = localStorage.getItem(CRAFT_TAB_STORAGE_KEY) || saved; } catch (_) {}
  if (!setActiveCraftTab(saved, { persist: false })) {
    setActiveCraftTab('currency', { persist: false });
  }

  const activateInventoryTab = (tabId, options = {}) => setActiveCraftTab(tabId, options);
  elements.craftTabList?.addEventListener('click', event => {
    const tab = event.target.closest('[data-craft-tab]');
    if (tab && elements.craftTabList.contains(tab)) activateInventoryTab(tab.dataset.craftTab);
  });
  elements.craftTabList?.addEventListener('keydown', event => {
    const tab = event.target.closest('[data-craft-tab]');
    if (!tab) return;
    const tabs = Array.from(elements.craftTabs);
    const index = tabs.indexOf(tab);
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') next = index;
    else return;
    event.preventDefault();
    activateInventoryTab(tabs[next].dataset.craftTab, { focus: true });
  });
  elements.craftTabList?.addEventListener('wheel', event => {
    const strip = elements.craftTabList;
    if (!strip || strip.scrollWidth <= strip.clientWidth) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta) return;
    const before = strip.scrollLeft;
    const maximum = Math.max(0, strip.scrollWidth - strip.clientWidth);
    if ((delta < 0 && before <= 0) || (delta > 0 && before >= maximum)) return;
    strip.scrollLeft = Math.max(0, Math.min(maximum, before + delta));
    if (strip.scrollLeft !== before) event.preventDefault();
  }, { passive: false });
}

function renderCraftingDescription(definition, reason = '') {
  if (!definition) return;
  if (elements.craftDescriptionTitle) elements.craftDescriptionTitle.textContent = definition.displayName;
  if (elements.craftDescriptionText) {
    const triggerDefinition = CRAFTING_ITEM_REGISTRY[definition.omenInteraction?.triggerCraftId]
      || CRAFTING_ITEM_REGISTRY[definition.triggeringAction];
    const triggerName = triggerDefinition?.displayName || (definition.triggeringAction
      ? definition.triggeringAction.replace(/-/g, ' ').replace(/^./, letter => letter.toUpperCase())
      : '');
    const trigger = triggerName ? ` Triggers from ${triggerName}.` : '';
    elements.craftDescriptionText.textContent = reason || `${definition.description}${trigger}`;
  }
}

function filterCraftInventory() {
  const query = (elements.craftItemSearch?.value || '').trim().toLocaleLowerCase();
  const applicableOnly = Boolean(elements.craftApplicableOnly?.checked);
  let visibleCount = 0;
  elements.craftButtons.forEach(button => {
    const definition = definitionForElement(button);
    const reason = disabledReasonForDefinition(definition);
    const matchesSearch = !query || button.dataset.searchText.includes(query);
    const matchesApplicable = !applicableOnly || !reason;
    button.hidden = !(matchesSearch && matchesApplicable);
    if (!button.hidden) {
      visibleCount++;
    }
  });
  document.querySelectorAll('.cur-cluster').forEach(cluster => {
    cluster.hidden = !Array.from(cluster.querySelectorAll('[data-craft-id]')).some(button => !button.hidden);
  });
  const activePanel = document.querySelector(`[data-craft-panel="${activeCraftTab}"]`);
  const existingFilterEmpty = activePanel?.querySelector('.craft-filter-empty');
  if (visibleCount === 0 && elements.craftButtons.length > 0) {
    if (!existingFilterEmpty && activePanel) {
      const empty = document.createElement('div');
      empty.className = 'craft-inventory-empty craft-filter-empty';
      empty.setAttribute('role', 'status');
      empty.innerHTML = '<strong>No items match the current filters.</strong><span>Clear search or applicability filters to see this category.</span>';
      activePanel.appendChild(empty);
    }
  } else if (existingFilterEmpty) {
    existingFilterEmpty.remove();
  }
  if (elements.craftResultCount) {
    const counts = CRAFTING_CURRENCY_INDEX?.categoryCounts?.[activeCraftTab] || { available: 0, known: 0, deprecated: 0 };
    const known = counts.known + (showDeprecatedCrafts ? counts.deprecated : 0);
    const filtered = Boolean(query || applicableOnly);
    elements.craftResultCount.textContent = `${filtered ? `${visibleCount} shown · ` : ''}${counts.available} available · ${known} known`;
  }
  return visibleCount;
}

function rejectCraftOperation(reason, shiftKey = false) {
  // Sticky mode never survives an invalid operation. Physical Shift retains
  // its historical behaviour for non-sticky currency use.
  if (stickyCurrency || !shiftKey) disarmCurrency();
  playSound('error');
  triggerErrorAnimation();
  showError(reason);
  return { success: false, error: reason };
}

// All item mutations enter here, including click-held currency and drag/drop.
// Validation happens before snapshots, RNG-facing work, history, or Omen state.
function executeCraftOperation(definition, { shiftKey = false } = {}) {
  if (!definition) return rejectCraftOperation(UNSUPPORTED_REASON, shiftKey);
  const reason = disabledReasonForDefinition(definition);
  if (!definition.supported) return rejectCraftOperation(reason || definition.unsupportedReason || UNSUPPORTED_REASON, shiftKey);
  if (reason) return rejectCraftOperation(reason, shiftKey);
  const currency = definition.engineAction;
  if (!currency) return rejectCraftOperation(definition.unsupportedReason || UNSUPPORTED_REASON, shiftKey);
  if (armedCurrency !== currency) armCurrency(currency);
  const before = snapshotState(engine.getItem());
  if (!definition.handler) return rejectCraftOperation(UNSUPPORTED_REASON, shiftKey);

  if (definition.handler === 'applyHinekoraLock') {
    return applyHinekoraLock(shiftKey);
  }
  if (definition.handler === 'startDesecrationFlow') {
    return engine.getItem().hinekoraLocked
      ? commitDesecrationForesight(currency)
      : startDesecrationFlow(currency);
  }
  if (engine.getItem().hinekoraLocked && FORESEEABLE.has(currency)) {
    return commitForesight(currency);
  }

  const result = applyCurrencyToEngine(currency);
  if (!result.success) return rejectCraftOperation(result.error, shiftKey);

  consumeCraftOmen(currency);
  engine.recordCurrencyUse(definition.craftId);
  pushUndo(before);
  if (currency === 'annulment' && omenOfLightActive) {
    engine.recordCurrencyUse(craftIdForOmen('omen_of_light'));
    omenOfLightActive = false;
    const lightButton = Array.from(elements.omenBtns).find(button => omenForElement(button) === 'omen_of_light');
    if (lightButton) {
      lightButton.classList.remove('active');
      lightButton.setAttribute('aria-pressed', 'false');
    }
  }
  playSound(currency);
  triggerCraftAnimation(currency);
  renderItem(result);
  const keepArmed = shiftKey || stickyCurrency === currency;
  if (!keepArmed || result.item.corrupted || result.item.sanctified) disarmCurrency();
  return result;
}

function dispatchCraftControl(definition, event, intent = 'activate', control = event?.currentTarget) {
  if (!definition) return false;
  const reason = disabledReasonForDefinition(definition);
  renderCraftingDescription(definition, reason);
  if (reason) {
    showError(reason);
    return false;
  }
  if (intent === 'dragstart') {
    disarmCurrency();
    dragCurrency = definition.engineAction;
    control?.classList?.add('dragging-currency');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      try { event.dataTransfer.setData('text/plain', definition.craftId); } catch (_) {}
      const iconImage = control?.querySelector?.('img');
      if (iconImage?.complete && iconImage.width) {
        try { event.dataTransfer.setDragImage(iconImage, iconImage.width / 2, iconImage.height / 2); } catch (_) {}
      }
    }
    return true;
  }
  if (definition.actionType === 'omen') {
    if (definition.handler === 'toggleOmen') toggleOmen(definition.omenId);
    else if (definition.handler === 'toggleCraftOmen') toggleCraftOmen(definition.omenId);
    else return false;
    return true;
  }
  if (intent === 'sticky' && isStickyCurrencyDefinition(definition)) {
    toggleStickyCurrency(definition.engineAction);
  } else {
    toggleCurrency(definition.engineAction);
  }
  return true;
}

function setupCraftInventoryEvents() {
  if (!elements.currencyPanel) return;
  elements.currencyPanel.addEventListener('click', event => {
    const button = event.target.closest('[data-craft-id]');
    if (!button || !elements.currencyPanel.contains(button)) return;
    dispatchCraftControl(definitionForElement(button), event, 'activate');
  });
  elements.currencyPanel.addEventListener('contextmenu', event => {
    const button = event.target.closest('[data-craft-id]');
    if (!button || !elements.currencyPanel.contains(button)) return;
    event.preventDefault();
    dispatchCraftControl(definitionForElement(button), event, 'sticky');
  });
  elements.currencyPanel.addEventListener('focusin', event => {
    const button = event.target.closest('[data-craft-id]');
    if (button) renderCraftingDescription(definitionForElement(button), button.dataset.disabledReason || '');
  });
  elements.currencyPanel.addEventListener('mouseover', event => {
    const button = event.target.closest('[data-craft-id]');
    if (button) renderCraftingDescription(definitionForElement(button), button.dataset.disabledReason || '');
  });
  elements.currencyPanel.addEventListener('dragstart', event => {
    const button = event.target.closest('[data-craft-id]');
    if (!button) return;
    if (!dispatchCraftControl(definitionForElement(button), event, 'dragstart', button)) event.preventDefault();
  });
  elements.currencyPanel.addEventListener('dragend', event => {
    const button = event.target.closest('[data-craft-id]');
    if (button) button.classList.remove('dragging-currency');
    dragCurrency = null;
  });
  elements.currencyPanel.addEventListener('keydown', event => {
    const button = event.target.closest('[data-craft-id]');
    if (!button || !['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const candidates = Array.from(button.closest('[data-craft-panel]').querySelectorAll('[data-craft-id]:not([hidden])'));
    const index = candidates.indexOf(button);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? candidates.length - 1
      : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? (index + 1) % candidates.length
        : (index - 1 + candidates.length) % candidates.length;
    event.preventDefault();
    candidates[next]?.focus();
  });
  elements.craftItemSearch?.addEventListener('input', filterCraftInventory);
  elements.craftCategoryFilter?.addEventListener('change', () => {
    if (elements.craftCategoryFilter.value) setActiveCraftTab(elements.craftCategoryFilter.value);
  });
  elements.craftApplicableOnly?.addEventListener('change', filterCraftInventory);
  elements.craftInventoryModes?.forEach(control => control.addEventListener('change', async () => {
    if (!control.checked) return;
    if (control.value === 'known') {
      craftInventoryMode = 'known';
      if (elements.craftResultCount) elements.craftResultCount.textContent = 'Loading complete crafting catalog…';
      try {
        await loadKnownCraftDefinitions();
      } catch (error) {
        craftInventoryMode = 'available';
        const availableControl = Array.from(elements.craftInventoryModes).find(input => input.value === 'available');
        if (availableControl) availableControl.checked = true;
        showError(error.message);
      }
    } else {
      craftInventoryMode = 'available';
      showDeprecatedCrafts = false;
      if (elements.craftShowDeprecated) elements.craftShowDeprecated.checked = false;
    }
    if (elements.craftDeprecatedLabel) elements.craftDeprecatedLabel.hidden = craftInventoryMode !== 'known';
    renderActiveCraftPanel();
    validateCraftRegistry();
    renderItem();
  }));
  elements.craftShowDeprecated?.addEventListener('change', () => {
    showDeprecatedCrafts = Boolean(elements.craftShowDeprecated.checked);
    renderActiveCraftPanel();
  });
  filterCraftInventory();
}

function setupEventListeners() {
  // Protect against duplicate listeners when init is re-entered by a test,
  // hot-reload wrapper, or restored page lifecycle.
  if (eventsBound) return;
  eventsBound = true;
  if (craftingInventoryReady) setupCraftTabs();

  elements.jewelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetBase = defaultConcreteBaseForPool(btn.dataset.type);
      if (!targetBase) {
        showError('Normalized Jewel base data is unavailable.');
        return;
      }
      const result = selectConcreteBase(targetBase.id);
      if (result?.requiresConfirmation) requestConcreteBaseConfirmation(result);
    });
  });
  if (craftingInventoryReady) setupCraftInventoryEvents();

  const applyArmedToItem = (e) => {
    if (!armedCurrency) return;
    e.preventDefault();
    executeCraftOperation(CRAFT_DEFINITION_BY_ACTION.get(armedCurrency), { shiftKey: e.shiftKey });
  };
  // Model 1 (arm + click): right- or left-click a currency to pick it up (its
  // icon rides the cursor), then LEFT-CLICK the jewel to use it.
  elements.tooltip.addEventListener('click', applyArmedToItem);
  // Hinekora's Lock: foresight previews ONLY once a currency is in hand (armed
  // via left- or right-click) and brought over the item -- never on plain hover
  // of a currency button. Moving the cursor off the item clears the preview.
  elements.tooltip.addEventListener('mouseenter', () => { if (armedCurrency) previewForesight(armedCurrency); });
  elements.tooltip.addEventListener('mouseleave', clearForesightPreview);

  elements.tooltip.addEventListener('dragover', (e) => {
    if (!dragCurrency) return; // ignore unrelated drags (e.g. stash reordering)
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    elements.tooltip.classList.add('drag-target');
    // Hinekora's Lock: dragging a currency over the item previews its foreseen
    // outcome, just like carrying an armed currency. Guard so we render once per
    // entry instead of on every dragover tick.
    if (foreseenHover !== dragCurrency) previewForesight(dragCurrency);
  });
  elements.tooltip.addEventListener('dragleave', (e) => {
    // Detect leaving via pointer position, not relatedTarget (which is null mid
    // re-render) -- otherwise the foresight preview re-render flickers the drag.
    const r = elements.tooltip.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right &&
                   e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) {
      elements.tooltip.classList.remove('drag-target');
      clearForesightPreview();
    }
  });
  elements.tooltip.addEventListener('drop', (e) => {
    if (!dragCurrency) return;
    e.preventDefault();
    elements.tooltip.classList.remove('drag-target');
    const currency = dragCurrency;
    dragCurrency = null;
    executeCraftOperation(CRAFT_DEFINITION_BY_ACTION.get(currency), { shiftKey: e.shiftKey });
  });

  elements.resetBtn.addEventListener('click', () => {
    pushUndo(snapshotState(engine.getItem()));
    engine.resetItem();
    clearCraftOmen();
    clearDesecration();
    foreseenSeals = {};
    foreseenHover = null;
    disarmCurrency();
    playSound('reset');
    renderItem();
  });

  if (elements.undoBtn) elements.undoBtn.addEventListener('click', undoLastAction);
  if (elements.redoBtn) elements.redoBtn.addEventListener('click', redoLastAction);

  elements.saveBtn.addEventListener('click', saveToStash);

  // --- Item Level slider (drag to set 1-100; click the knob to lock/unlock) ---
  setupIlvlSlider();

  if (elements.revealBtn) elements.revealBtn.addEventListener('click', openWell);
  if (elements.wellReroll) elements.wellReroll.addEventListener('click', rerollWell);
  if (elements.wellCancel) elements.wellCancel.addEventListener('click', cancelWell);
  if (elements.wellModal) {
    elements.wellModal.addEventListener('click', (e) => {
      if (e.target === elements.wellModal) cancelWell();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Alt' && !showDetails) { showDetails = true; renderItem(); }
    if (e.key === 'Escape') {
      if (elements.wellModal && !elements.wellModal.hidden) cancelWell();
      else disarmCurrency();
    }
  });
  document.addEventListener('keyup', e => {
    if (e.key === 'Alt') { showDetails = false; renderItem(); }
  });
  // If the window loses focus while Alt is held (e.g. Alt+Tab), the keyup never
  // fires, which would otherwise leave the inspect/detail view stuck on.
  window.addEventListener('blur', () => {
    if (showDetails) { showDetails = false; renderItem(); }
  });

  document.addEventListener('mousemove', e => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    if (!armedCurrency) return;
    if (orbRaf) return;
    orbRaf = requestAnimationFrame(() => {
      orbRaf = 0;
      positionOrb();
    });
  });

  document.addEventListener('mouseleave', () => { elements.cursorOrb.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => {
    if (armedCurrency) { positionOrb(); elements.cursorOrb.style.opacity = '1'; }
  });
}

function applyCurrencyToEngine(currency, eng = engine) {
  const definition = CRAFT_DEFINITION_BY_ACTION.get(currency);
  if (!definition || !definition.supported || !definition.handler) {
    return { success: false, error: definition?.unsupportedReason || UNSUPPORTED_REASON };
  }
  // Greater/Perfect orbs apply a modifier-level floor to the newly added mod.
  const variant = ORB_VARIANTS[currency];
  const baseCurrency = variant ? variant.base : currency;
  const craftOptions = variant ? { minModLevel: variant.minModLevel } : {};
  // A crafting omen only applies to its matching (base) currency.
  const omen = (selectedCraftOmen && CRAFT_OMENS[selectedCraftOmen]
    && CRAFT_OMENS[selectedCraftOmen].currency === baseCurrency) ? selectedCraftOmen : null;
  if (omen) craftOptions.omen = omen;
  const metric = baseCurrency === 'chaos' && omen === 'whittling'
    ? 'chaos-with-whittling'
    : `craft-${baseCurrency}`;
  return measureOperation(metric, () => {
    switch (definition.handler) {
      case 'applyChaos': return eng[definition.handler](omen, craftOptions);
      case 'applyAnnulment': return eng[definition.handler]({ desecratedOnly: omenOfLightActive, omen });
      case 'applyDivine': return eng[definition.handler](omen);
      case 'applyTransmutation':
      case 'applyAugmentation':
      case 'applyRegal':
      case 'applyExalted': return eng[definition.handler](craftOptions);
      case 'applyAlchemy': return eng[definition.handler](craftOptions);
      case 'applyFracturing':
      case 'applyEssenceOfAbyss':
      case 'applyEssenceOfBreach': return eng[definition.handler]();
      default: return { success: false, error: 'Registered crafting handler is unavailable.' };
    }
  });
}

function isStickyCurrencyDefinition(definition) {
  return Boolean(definition?.supported && definition.actionType === 'direct' &&
    definition.engineAction && definition.handler &&
    definition.handler !== 'applyHinekoraLock' && definition.handler !== 'startDesecrationFlow');
}

function toggleStickyCurrency(currency) {
  if (!currency) return;
  if (stickyCurrency === currency && armedCurrency === currency) {
    disarmCurrency();
    return;
  }
  stickyCurrency = currency;
  armCurrency(currency);
}

function toggleCurrency(currency) {
  if (!currency) return;
  const item = engine.getItem();
  if (item.corrupted || item.sanctified || item.mirrored || item.isMirrored) {
    const reason = item.corrupted
      ? 'Item is corrupted and cannot be modified.'
      : item.sanctified
        ? 'Item is sanctified and cannot be modified further.'
        : 'Item is mirrored and cannot be modified.';
    showError(reason);
    return;
  }
  if (armedCurrency === currency) disarmCurrency();
  else {
    stickyCurrency = null;
    armCurrency(currency);
  }
}

// Show the picked-up currency's real icon riding along with the cursor orb,
// so dragging feels like carrying the actual currency item.
function setOrbIcon(name) {
  if (!elements.cursorOrb) return;
  const definition = CRAFT_DEFINITION_BY_ACTION.get(name);
  let fallback = elements.cursorOrb.querySelector('.orb-fallback');
  if (!fallback) {
    fallback = document.createElement('span');
    fallback.className = 'orb-fallback';
    elements.cursorOrb.appendChild(fallback);
  }
  fallback.textContent = definition?.iconFallback || '';
  fallback.hidden = true;
  let img = elements.cursorOrb.querySelector('.orb-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'orb-img';
    img.alt = '';
    elements.cursorOrb.appendChild(img);
  }
  img.style.display = 'none';
  img.onload = () => {
    img.style.display = 'block';
    fallback.hidden = true;
  };
  img.onerror = () => {
    img.remove();
    fallback.hidden = !fallback.textContent;
  };
  img.src = `assets/icons/${iconIdForAction(name)}.png`;
}

function clearOrbIcon() {
  if (!elements.cursorOrb) return;
  const img = elements.cursorOrb.querySelector('.orb-img');
  if (img) img.remove();
  const fallback = elements.cursorOrb.querySelector('.orb-fallback');
  if (fallback) fallback.remove();
}

function positionOrb() {
  elements.cursorOrb.style.transform =
    `translate3d(${lastMouseX}px, ${lastMouseY}px, 0) translate(-50%, -50%)`;
}

function armCurrency(currency) {
  armedCurrency = currency;
  elements.currencyBtns.forEach(b => {
    const isArmed = actionForElement(b) === currency;
    b.classList.toggle('armed', isArmed);
    b.classList.toggle('sticky', isArmed && stickyCurrency === currency);
    b.setAttribute('aria-pressed', String(isArmed));
    b.dataset.repeatMode = String(isArmed && stickyCurrency === currency);
  });
  elements.boneBtns.forEach(b => {
    const isArmed = actionForElement(b) === currency;
    b.classList.toggle('armed', isArmed);
    b.classList.toggle('sticky', isArmed && stickyCurrency === currency);
    b.setAttribute('aria-pressed', String(isArmed));
    b.dataset.repeatMode = String(isArmed && stickyCurrency === currency);
  });
  if (elements.essenceBtns) elements.essenceBtns.forEach(b => {
    const isArmed = actionForElement(b) === currency;
    b.classList.toggle('armed', isArmed);
    b.classList.toggle('sticky', isArmed && stickyCurrency === currency);
    b.setAttribute('aria-pressed', String(isArmed));
    b.dataset.repeatMode = String(isArmed && stickyCurrency === currency);
  });

  const color = (CURRENCIES[currency] && CURRENCIES[currency].color) || DEFAULT_ORB_COLOR;
  elements.cursorOrb.style.setProperty('--orb-color', color);
  elements.cursorOrb.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  setOrbIcon(currency);
  positionOrb();
  elements.cursorOrb.style.opacity = '1';
  // Keep the native cursor visible while a currency is armed — the glow orb
  // simply trails it. Previously this set `cursor: none`, which made the
  // pointer appear to vanish the moment you picked up a currency.
  document.body.style.cursor = '';
  elements.tooltip.style.cursor = 'pointer';
}

function disarmCurrency() {
  armedCurrency = null;
  stickyCurrency = null;
  elements.currencyBtns.forEach(b => {
    b.classList.remove('armed', 'sticky');
    b.setAttribute('aria-pressed', 'false');
    b.dataset.repeatMode = 'false';
  });
  elements.boneBtns.forEach(b => {
    b.classList.remove('armed', 'sticky');
    b.setAttribute('aria-pressed', 'false');
    b.dataset.repeatMode = 'false';
  });
  if (elements.essenceBtns) elements.essenceBtns.forEach(b => {
    b.classList.remove('armed', 'sticky');
    b.setAttribute('aria-pressed', 'false');
    b.dataset.repeatMode = 'false';
  });
  clearOrbIcon();
  elements.cursorOrb.style.opacity = '0';
  document.body.style.cursor = 'default';
  elements.tooltip.style.cursor = 'pointer';
}

// ============================================================
// ITEM LEVEL SLIDER -- drag 1..100 (~50 at the middle), lockable knob
// ============================================================

// Map an item level (1..100) to a 0..100% position along the track.
function ilvlToPercent(v) {
  return ((Math.max(1, Math.min(100, v)) - 1) / 99) * 100;
}

// Reflect the engine's current item level in the slider track + label.
function updateIlvlUI(ilvl) {
  const pct = ilvlToPercent(ilvl);
  if (elements.ilvlFill) elements.ilvlFill.style.width = pct + '%';
  if (elements.ilvlKnob) {
    elements.ilvlKnob.style.left = pct + '%';
    elements.ilvlKnob.classList.toggle('locked', ilvlLocked);
  }
  if (elements.ilvlValue) elements.ilvlValue.textContent = ilvl;
  if (elements.ilvlSlider) elements.ilvlSlider.setAttribute('aria-valuenow', String(ilvl));
}

function setupIlvlSlider() {
  const slider = elements.ilvlSlider;
  const track = elements.ilvlTrack;
  const knob = elements.ilvlKnob;
  if (!slider || !track || !knob) return;

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startedOnKnob = false;

  const valueFromClientX = (clientX) => {
    const r = track.getBoundingClientRect();
    if (r.width <= 0) return engine.getItem().ilvl;
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return Math.round(1 + ratio * 99);
  };

  const applyValue = (v) => measureOperation('item-level-change', () => {
    const previous = engine.getItem().ilvl;
    const next = engine.setItemLevel(v);
    if (next !== previous) invalidateForesightContext({ restorePreview: true });
    updateIlvlUI(next);
  });

  slider.addEventListener('pointerdown', (e) => {
    // Keep the press off the tooltip so it can't apply an armed currency.
    e.stopPropagation();
    e.preventDefault();
    startedOnKnob = !!(e.target.closest && e.target.closest('.ilvl-knob'));
    startX = e.clientX;
    moved = false;
    dragging = true;
    try { slider.setPointerCapture(e.pointerId); } catch (_) {}
  });

  slider.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 3) moved = true;
    if (ilvlLocked) return;             // locked: dragging does nothing
    if (!moved && !startedOnKnob) return;
    applyValue(valueFromClientX(e.clientX));
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
    if (moved) return;
    // A plain click (no drag): clicking the knob toggles the lock; clicking the
    // bare track while unlocked jumps the level to that spot.
    if (startedOnKnob) {
      ilvlLocked = !ilvlLocked;
      updateIlvlUI(engine.getItem().ilvl);
    } else if (!ilvlLocked) {
      applyValue(valueFromClientX(e.clientX));
    }
  };
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
  slider.addEventListener('click', (e) => e.stopPropagation());

  if (engine) updateIlvlUI(engine.getItem().ilvl);
}

// ============================================================
// DESECRATION (Abyssal) — Preserved Cranium / Well of Souls
// ============================================================

// The two directional Necromancy omens target opposite affix sides, so they
// are mutually exclusive with each other — but either one may be combined with
// Abyssal Echoes (which only grants a reroll of the revealed set).
const DIRECTIONAL_OMENS = VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.omenInteraction?.exclusiveGroup === 'desecration_direction')
  .map(definition => definition.omenId);

function toggleOmen(omen) {
  // Omen of Light is an ANNULMENT omen, tracked separately from the
  // desecration-reveal omens: it makes the next Orb of Annulment strip only a
  // Desecrated modifier. The other omens influence the Well of Souls.
  if (omen === 'omen_of_light') {
    omenOfLightActive = !omenOfLightActive;
    invalidateForesightContext({ restorePreview: true });
    const btn = Array.from(elements.omenBtns).find(b => omenForElement(b) === 'omen_of_light');
    if (btn) {
      btn.classList.toggle('active', omenOfLightActive);
      btn.setAttribute('aria-pressed', String(omenOfLightActive));
    }
    renderItem();
    return;
  }
  if (selectedOmens.has(omen)) {
    selectedOmens.delete(omen);
  } else {
    // Selecting a directional omen clears the other directional omen.
    if (DIRECTIONAL_OMENS.includes(omen)) {
      DIRECTIONAL_OMENS.forEach(o => selectedOmens.delete(o));
    }
    selectedOmens.add(omen);
  }
  elements.omenBtns.forEach(b => {
    const buttonOmen = omenForElement(b);
    if (buttonOmen === 'omen_of_light') return;
    const active = selectedOmens.has(buttonOmen);
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  invalidateForesightContext({ restorePreview: true });
}

// ---- Crafting omens (Chaos / Annulment / Divine augments) ----
function updateCraftOmenButtons() {
  if (!elements.craftOmenBtns) return;
  elements.craftOmenBtns.forEach(b => {
    const active = omenForElement(b) === selectedCraftOmen;
    b.classList.toggle('active', active);
    b.setAttribute('aria-pressed', String(active));
  });
}

function toggleCraftOmen(omen) {
  if (!CRAFT_OMENS[omen]) return;
  selectedCraftOmen = (selectedCraftOmen === omen) ? null : omen;
  invalidateForesightContext({ restorePreview: true });
  updateCraftOmenButtons();
  renderItem();
}

function clearCraftOmen() {
  selectedCraftOmen = null;
  updateCraftOmenButtons();
}

// Consume the armed crafting omen if it matched the currency just applied.
function consumeCraftOmen(currency) {
  const base = ORB_VARIANTS[currency] ? ORB_VARIANTS[currency].base : currency;
  if (selectedCraftOmen && CRAFT_OMENS[selectedCraftOmen]
      && CRAFT_OMENS[selectedCraftOmen].currency === base) {
    engine.recordCurrencyUse(craftIdForOmen(selectedCraftOmen));
    clearCraftOmen();
  }
}

function startDesecrationFlow(bone = 'preserved_cranium') {
  if (!desecData) {
    const result = { success: false, error: 'Desecrated modifier data is not available.' };
    showError(result.error);
    return result;
  }
  disarmCurrency();
  // Committing a bone supersedes any Hinekora foresight preview.
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  if (engine.getItem().corrupted) {
    playSound('error'); triggerErrorAnimation();
    const result = { success: false, error: 'Item is corrupted and cannot be modified.' };
    showError(result.error);
    return result;
  }
  const before = snapshotState(engine.getItem());
  const res = engine.startDesecration({
    bone: bone || 'preserved_cranium',
    omens: Array.from(selectedOmens),
  });
  if (!res.success) {
    playSound('error'); triggerErrorAnimation();
    showError(res.error);
    return res;
  }
  // The bone (and any omens) are consumed now: the desecration is applied and an
  // unrevealed green modifier is placed on the item. The actual modifier is
  // revealed later via the Reveal panel below the item.
  engine.recordCurrencyUse(craftIdForAction(bone || 'preserved_cranium'));
  // Abyssal Echoes is activated at reveal time (not now), so don't count it here.
  selectedOmens.forEach((o) => { if (o !== 'abyssal_echoes') engine.recordCurrencyUse(craftIdForOmen(o)); });
  engine.clearHinekoraLock();
  // Keep Abyssal Echoes armed through the reveal: it is consumed at the Well of
  // Souls (the reroll), NOT when the bone is used. Clearing every omen here is
  // what stopped the reroll button from ever appearing. Drop only the other
  // (directional / one-shot) omens and leave abyssal_echoes + its button active.
  const keepEchoes = selectedOmens.has('abyssal_echoes');
  selectedOmens.clear();
  if (keepEchoes) selectedOmens.add('abyssal_echoes');
  elements.omenBtns.forEach(b => {
    if (omenForElement(b) === 'abyssal_echoes') return;
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  pushUndo(before);

  desecState = { side: res.side, mode: res.mode, rerollsLeft: res.rerollsLeft, options: res.options, abyssalUsed: false };
  playSound('desecration');
  triggerCraftAnimation('preserved_cranium');
  renderItem(res);
  showRevealPanel();
  return res;
}

function openWell() {
  if (!desecState) { showError('Nothing to reveal.'); return; }
  // Omen of Abyssal Echoes is consumed the moment the desecrated modifier is
  // REVEALED (the Well opens) if it was activated -- whether or not the reroll
  // is actually used. If it was never activated, it is never counted. Guarded
  // by echoCounted so re-opening the Well (after a Cancel) cannot double-count.
  if (selectedOmens.has('abyssal_echoes') && !desecState.echoCounted) {
    engine.recordCurrencyUse(craftIdForOmen('abyssal_echoes'));
    desecState.echoCounted = true;
  }
  renderWell();
  if (elements.wellModal) {
    elements.wellModal.hidden = false;
    // Replay the Well of Souls reveal animation every time the modal opens.
    elements.wellModal.classList.remove('well-revealing');
    void elements.wellModal.offsetWidth;
    elements.wellModal.classList.add('well-revealing');
  }
  playSound('desecration');
}

function renderWell() {
  if (!desecState || !elements.wellOptions) return;
  const { side, mode, rerollsLeft, options } = desecState;
  if (elements.wellSub) {
    elements.wellSub.textContent =
      `Targeting ${capitalize(side)} — ` +
      (mode === 'add' ? 'fills the open slot' : `replaces a random ${side}`);
  }
  const frag = document.createDocumentFragment();
  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'well-option' + (opt.desecrated ? ' desec-option' : '');
    const lineHtml = (Array.isArray(opt.lines) && opt.lines.length > 0)
      ? opt.lines.map(l => escapeHtml(l.text)).join('<br>')
      : escapeHtml(opt.displayText);
    btn.innerHTML =
      `<span class="wo-name">${escapeHtml(opt.tierName)}</span>` +
      `<span class="wo-line">${lineHtml}</span>`;
    btn.addEventListener('click', () => chooseDesec(i));
    frag.appendChild(btn);
  });
  elements.wellOptions.replaceChildren(frag);
  // The reroll only appears if Omen of Abyssal Echoes has been activated, and
  // only once per reveal (it disappears after it's been used).
  const echoesActive = selectedOmens.has('abyssal_echoes');
  if (elements.wellReroll) elements.wellReroll.hidden = !(echoesActive && !desecState.abyssalUsed);
}

function rerollWell() {
  // Reroll requires Omen of Abyssal Echoes to be activated, and is limited to a
  // single use per reveal (not unlimited). The omen itself is consumed/counted
  // at reveal time (openWell), independent of whether this reroll is used.
  if (!desecState || desecState.abyssalUsed) return;
  if (!selectedOmens.has('abyssal_echoes')) return;
  const res = engine.rerollDesecration();
  if (!res.success) { playSound('error'); showError(res.error); return; }
  desecState = { side: res.side, mode: res.mode, rerollsLeft: 0, options: res.options, abyssalUsed: true, echoCounted: desecState.echoCounted };
  playSound('chaos');
  renderWell();
}

function chooseDesec(index) {
  const result = engine.chooseDesecratedMod(index);
  if (!result.success) {
    playSound('error'); triggerErrorAnimation();
    showError(result.error);
    closeWell();
    return;
  }
  // Abyssal Echoes is now counted at REVEAL time (see openWell), so it is
  // consumed whether or not the reroll was used, and never when it was not
  // activated. Nothing left to record here on commit.
  clearDesecration();
  playSound('vaal');
  triggerCraftAnimation('preserved_cranium');
  renderItem(result);
}

function closeWell() {
  if (elements.wellModal) {
    elements.wellModal.hidden = true;
    elements.wellModal.classList.remove('well-revealing');
  }
}

// Fully clear a pending desecration: hide the modal AND the Reveal panel and
// forget the rolled options. Used after a mod is revealed, or when the item is
// reset / undone / replaced.
function clearDesecration() {
  closeWell();
  hideRevealPanel();
  desecState = null;
  // Abyssal Echoes only applies to an active reveal; drop it when the reveal ends.
  selectedOmens.delete('abyssal_echoes');
  elements.omenBtns.forEach(b => {
    if (omenForElement(b) === 'abyssal_echoes') {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    }
  });
}

function showRevealPanel() {
  if (elements.revealPanel) elements.revealPanel.hidden = false;
}

function hideRevealPanel() {
  if (elements.revealPanel) elements.revealPanel.hidden = true;
}

// The Well's "Cancel" just closes the modal — the unrevealed modifier stays on
// the item and the Reveal panel remains so the player can reveal it later.
// Abyssal Echoes is a one-time "before revealing" effect: the act of revealing
// spends the reroll opportunity. So once the Well has been opened, cancelling
// consumes the echo — re-revealing later will NOT offer the reroll again.
function cancelWell() {
  if (desecState) desecState.abyssalUsed = true;
  closeWell();
}

// Snapshot the full restorable state: the item, the UI reveal state
// (desecState), and the engine's pending desecration so the Reveal step can be
// brought back intact by undo/redo.
function snapshotState(item) {
  return {
    item,
    desec: desecState ? structuredClone(desecState) : null,
    pending: engine.getPendingDesecration(),
    omens: Array.from(selectedOmens),
    omenOfLight: omenOfLightActive,
    craftOmen: selectedCraftOmen,
    workbench: {
      categoryLabel: currentItemClass,
      selectablePoolIds: currentSelectablePoolIds.slice(),
      isJewelMode,
    },
  };
}

function pushUndo(beforeState) {
  undoStack.push(beforeState);
  if (undoStack.length > 50) undoStack.shift();
  // Any fresh action invalidates the redo history.
  redoStack = [];
}

function restoreSnapshot(snap) {
  if (snap.workbench && typeof snap.workbench === 'object') {
    currentItemClass = snap.workbench.categoryLabel || currentItemClass;
    currentSelectablePoolIds = Array.isArray(snap.workbench.selectablePoolIds)
      ? snap.workbench.selectablePoolIds.slice()
      : currentSelectablePoolIds;
    isJewelMode = !!snap.workbench.isJewelMode;
  }
  syncConcreteBaseTemplateFromItem(snap.item);
  engine.loadItem(snap.item, snap.pending);
  clearDesecration();
  // Restore the pending reveal AFTER clearDesecration so the Reveal panel
  // re-appears when an unrevealed modifier is still on the item.
  desecState = snap.desec ? structuredClone(snap.desec) : null;
  selectedOmens = new Set(Array.isArray(snap.omens) ? snap.omens : []);
  omenOfLightActive = !!snap.omenOfLight;
  selectedCraftOmen = snap.craftOmen || null;
  elements.omenBtns.forEach(button => {
    const omen = omenForElement(button);
    const active = omen === 'omen_of_light' ? omenOfLightActive : selectedOmens.has(omen);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  updateCraftOmenButtons();
  foreseenSeals = {};
  foreseenHover = null;
  disarmCurrency();
  renderItem();
  notifyConcreteBaseChange();
}

function undoLastAction() {
  return measureOperation('undo', () => {
    if (undoStack.length === 0) { showError('Nothing to undo.'); return; }
    redoStack.push(snapshotState(engine.getItem()));
    if (redoStack.length > 50) redoStack.shift();
    const prev = undoStack.pop();
    restoreSnapshot(prev);
    playSound('undo');
  });
}

function redoLastAction() {
  return measureOperation('redo', () => {
    if (redoStack.length === 0) { showError('Nothing to redo.'); return; }
    undoStack.push(snapshotState(engine.getItem()));
    if (undoStack.length > 50) undoStack.shift();
    const next = redoStack.pop();
    restoreSnapshot(next);
    playSound('undo');
  });
}

function updateUndoButton() {
  if (!elements.undoBtn) return;
  const empty = undoStack.length === 0;
  elements.undoBtn.disabled = empty;
  elements.undoBtn.classList.toggle('disabled', empty);
}

function updateRedoButton() {
  if (!elements.redoBtn) return;
  const empty = redoStack.length === 0;
  elements.redoBtn.disabled = empty;
  elements.redoBtn.classList.toggle('disabled', empty);
}

function applyHinekoraLock(shiftKey = false) {
  const reason = currencyDisabledReason('hinekora', engine.getItem());
  if (reason) {
    if (!shiftKey) disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    showError(reason);
    return { success: false, error: reason };
  }
  const before = snapshotState(engine.getItem());
  engine.setHinekoraLock();
  engine.recordCurrencyUse(craftIdForAction('hinekora'));
  pushUndo(before);
  foreseenSeals = {};
  foreseenHover = null;
  disarmCurrency();
  playSound('hinekora');
  triggerCraftAnimation('hinekora');
  renderItem();
  return { success: true, item: engine.getItem(), action: 'hinekora-lock' };
}

// Currencies whose effect Hinekora's Lock can foresee (everything that directly
// modifies the item — not the Lock itself or the Well-of-Souls bone).
const FORESEEABLE = new Set(VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.supported && definition.actionType === 'direct')
  .map(definition => definition.engineAction));
// Abyssal bones are foreseeable too, but their preview is special: it shows the
// item gaining an UNREVEALED "Desecrated Modifier" line (the real mod is only
// chosen later at the Well of Souls). Using the bone consumes the Lock and opens
// the Well.
const FORESEEABLE_BONES = new Set(VISIBLE_CRAFT_DEFINITIONS
  .filter(definition => definition.handler === 'startDesecrationFlow')
  .map(definition => definition.engineAction));
function currencyLabel(currency) {
  return CRAFT_DEFINITION_BY_ACTION.get(currency)?.displayName || currency;
}

function getCorruptionModalEl() {
  let modal = document.getElementById('corruption-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'corruption-modal';
    modal.className = 'corruption-modal';
    modal.innerHTML =
      '<div class="cm-box">' +
      '<div class="cm-title">Hinekora\'s Lock \u2014 Foreseen Outcome</div>' +
      '<div class="cm-sub">Hinekora\'s Lock reveals what the Vaal Orb will do before you commit. The outcome is sealed \u2014 apply it or cancel.</div>' +
      '<div class="cm-options"></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCorruptionChoice(); });
  }
  return modal;
}

function openCorruptionChoice() {
  const blocked = 'Mechanic blocked because exact target-version Vaal Orb outcomes and probabilities are not verified.';
  showError(blocked);
  return { success: false, error: blocked };
  /* Retained only as an unreachable compatibility body until verified data
     exists; no UI path invokes this function while Vaal is blocked. */
  if (engine.getItem().corrupted) {
    showError('Item is corrupted and cannot be modified.');
    return;
  }
  const modal = getCorruptionModalEl();
  const wrap = modal.querySelector('.cm-options');
  wrap.innerHTML = '';

  // Hinekora's Lock does NOT let the player pick the result — it foresees it.
  // Roll one valid outcome now, reveal it, and let the player either apply
  // that sealed corruption or cancel (which keeps the Lock intact).
  const opts = engine.vaalOutcomeOptions();
  const foreseen = opts[Math.floor(craftingRandom() * opts.length)].key;
  const info = VAAL_CHOICES[foreseen] || { title: foreseen, desc: '' };

  const preview = document.createElement('div');
  preview.className = 'cm-foreseen ' + (foreseen === 'enchant' ? 'cm-sanctify' : 'cm-corrupt');
  preview.innerHTML =
    `<span class="cm-opt-title">${escapeHtml(info.title)}</span>` +
    `<span class="cm-opt-desc">${escapeHtml(info.desc)}</span>`;
  wrap.appendChild(preview);

  const apply = document.createElement('button');
  apply.type = 'button';
  apply.className = 'cm-option cm-corrupt cm-apply';
  apply.innerHTML =
    `<span class="cm-opt-title">Apply Corruption</span>` +
    `<span class="cm-opt-desc">Corrupt the jewel with the foreseen outcome.</span>`;
  apply.addEventListener('click', () => applyChosenCorruption(foreseen));
  wrap.appendChild(apply);

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'cm-option cm-cancel';
  cancel.innerHTML =
    `<span class="cm-opt-title">Cancel</span>` +
    `<span class="cm-opt-desc">Keep Hinekora's Lock and do nothing.</span>`;
  cancel.addEventListener('click', () => closeCorruptionChoice());
  wrap.appendChild(cancel);

  modal.style.display = 'flex';
}

function closeCorruptionChoice() {
  const modal = document.getElementById('corruption-modal');
  if (modal) modal.style.display = 'none';
}

// --- Hinekora's Lock: foresee the next currency on HOVER ----------------------
// Hovering a currency while the item is Locked previews that currency's sealed
// outcome directly on the item card (the engine is left untouched). Using
// (applying) any currency commits that exact sealed result and removes the
// Lock. There is no accept/cancel step \u2014 the Lock mark stays until a currency
// is actually used.
function computeForesight(currency) {
  // Apply to the engine, capture the result + resulting item, then roll the
  // engine back so nothing is actually committed. The captured outcome is
  // sealed and reused for both the preview and the eventual commit.
  const snapshot = engine.getItem();
  const snapshotPending = engine.getPendingDesecration();
  const result = applyCurrencyToEngine(currency);
  if (!result || !result.success) {
    engine.loadItem(snapshot, snapshotPending);
    return { result };
  }
  const afterItem = engine.getItem();
  engine.loadItem(snapshot, snapshotPending);
  return { result, afterItem };
}

// Desecration foresight is special: run the engine's desecration on a snapshot
// (which places an UNREVEALED "Desecrated Modifier" on the item), capture that
// item, then roll the engine back. The preview shows the original mods plus the
// hidden Desecrated line; the real roll happens when the bone is actually used.
function computeDesecrationForesight(bone) {
  if (!desecData) {
    return { result: { success: false, error: 'Desecrated modifier data is not available.' } };
  }
  const snapshot = engine.getItem();
  const snapshotPending = engine.getPendingDesecration();
  const res = engine.startDesecration({ bone, omens: Array.from(selectedOmens) });
  if (!res || !res.success) { engine.loadItem(snapshot, snapshotPending); return { result: res }; }
  const afterItem = engine.getItem();
  // Capture the engine's pending desecration (the placement + the rolled Well of
  // Souls options) so Hinekora's Lock can later COMMIT this exact sealed
  // desecration instead of rolling a brand-new one.
  const pending = engine.getPendingDesecration();
  engine.loadItem(snapshot, snapshotPending); // roll back the placed mod + pending desecration
  return { result: res, afterItem, pending };
}

function previewForesight(currency) {
  if (!currency) return;
  if (!engine.getItem().hinekoraLocked) return;
  const isBone = FORESEEABLE_BONES.has(currency);
  if (!isBone && !FORESEEABLE.has(currency)) return;
  if (!foreseenSeals[currency]) {
    foreseenSeals[currency] = isBone
      ? computeDesecrationForesight(currency)
      : computeForesight(currency);
  }
  const seal = foreseenSeals[currency];
  foreseenHover = currency;
  if (!seal.afterItem) {
    showForeseenBanner(currency, false); // would do nothing
    return;
  }
  renderItem(seal.result, seal.afterItem); // overrideItem keeps the engine untouched
  showForeseenBanner(currency, true);
}

function clearForesightPreview() {
  if (foreseenHover === null) return;
  foreseenHover = null;
  hideForeseenBanner();
  renderItem(); // restore the real, still-Locked item
}

// A sealed Hinekora result is tied to the exact item-level, Omen, and RNG
// context under which it was rolled. Discard cached seals whenever any of
// those inputs changes; optionally restore the live item if a preview is
// currently painted over the tooltip.
function invalidateForesightContext({ restorePreview = false } = {}) {
  const hadPreview = foreseenHover !== null;
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  if (restorePreview && hadPreview && engine) renderItem();
}

function commitForesight(currency) {
  const seal = foreseenSeals[currency] || computeForesight(currency);
  if (!seal.afterItem) {
    // A foreseen currency that would do nothing must not stay stuck on the
    // cursor either -- drop it back like every other blocked application.
    disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    const error = (seal.result && seal.result.error) || 'Nothing to foresee.';
    showError(error);
    return { success: false, error };
  }
  const before = snapshotState(engine.getItem());
  engine.loadItem(seal.afterItem);   // commit the exact sealed outcome
  consumeCraftOmen(currency);
  engine.recordCurrencyUse(craftIdForAction(currency));
  engine.clearHinekoraLock();        // "The Lock is removed when this item is modified."
  if (currency === 'annulment' && omenOfLightActive) {
    engine.recordCurrencyUse(craftIdForOmen('omen_of_light'));
    omenOfLightActive = false;
    const lb = Array.from(elements.omenBtns).find(b => omenForElement(b) === 'omen_of_light');
    if (lb) {
      lb.classList.remove('active');
      lb.setAttribute('aria-pressed', 'false');
    }
  }
  pushUndo(before);
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  playSound(currency);
  triggerCraftAnimation(currency);
  disarmCurrency();
  renderItem();
  return { ...seal.result, success: true, item: engine.getItem(), specialized: true };
}

// Hinekora's Lock + desecration: commit the EXACT foreseen desecration. The
// preview (computeDesecrationForesight) rolled the placement and the Well of
// Souls options and then rolled the engine back; here we restore that sealed
// state instead of running a fresh startDesecration, so the committed result
// matches what was foreseen. Mirrors startDesecrationFlow for omen/UI cleanup.
function commitDesecrationForesight(bone) {
  const seal = foreseenSeals[bone] || computeDesecrationForesight(bone);
  if (!seal.afterItem || !seal.pending) {
    // Would do nothing (e.g. not a Rare item): drop the bone back like any other
    // blocked application instead of leaving it glued to the cursor.
    disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    const error = (seal.result && seal.result.error) || 'Nothing to foresee.';
    showError(error);
    return { success: false, error };
  }
  const before = snapshotState(engine.getItem());
  // Restore the sealed item (with its unrevealed placeholder) AND the sealed
  // pending desecration (same side/mode + the same revealed options).
  engine.loadItem(seal.afterItem, seal.pending);
  engine.recordCurrencyUse(craftIdForAction(bone));
  // Consume any directional / one-shot omens now (Abyssal Echoes is counted
  // later, on commit at the Well), mirroring startDesecrationFlow.
  selectedOmens.forEach((o) => { if (o !== 'abyssal_echoes') engine.recordCurrencyUse(craftIdForOmen(o)); });
  engine.clearHinekoraLock();
  const res = seal.result;
  desecState = { side: res.side, mode: res.mode, rerollsLeft: res.rerollsLeft, options: res.options, abyssalUsed: false };
  // Keep Abyssal Echoes armed through the reveal (its sealed reroll still
  // appears), but drop every other omen + clear their button highlight.
  const keepEchoes = selectedOmens.has('abyssal_echoes');
  selectedOmens.clear();
  if (keepEchoes) selectedOmens.add('abyssal_echoes');
  elements.omenBtns.forEach(b => {
    if (omenForElement(b) === 'abyssal_echoes') return;
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  pushUndo(before);
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  // Committing the foreseen desecration consumes the held bone, so drop the
  // cursor orb too -- otherwise the green Preserved Cranium orb stays glued to
  // the pointer (this path never disarmed, unlike startDesecrationFlow which
  // disarms up front).
  disarmCurrency();
  playSound('desecration');
  triggerCraftAnimation('preserved_cranium');
  renderItem(res);
  showRevealPanel();
  return { ...res, success: true, item: engine.getItem(), specialized: true };
}

function showForeseenBanner(currency, ok) {
  const content = elements.tooltip.querySelector('.tooltip-content') || elements.tooltip;
  let banner = document.getElementById('foreseen-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'foreseen-banner';
    banner.className = 'foreseen-banner';
    content.insertBefore(banner, content.firstChild);
  }
  banner.textContent = ok
    ? `FORESEEN \u2014 ${currencyLabel(currency)}`
    : `${currencyLabel(currency)} would do nothing`;
  elements.tooltip.classList.toggle('foreseen-empty', !ok);
  elements.tooltip.classList.add('foreseen-preview');
}

function hideForeseenBanner() {
  const banner = document.getElementById('foreseen-banner');
  if (banner) banner.remove();
  elements.tooltip.classList.remove('foreseen-preview');
  elements.tooltip.classList.remove('foreseen-empty');
}

function applyChosenCorruption(key) {
  const error = 'Mechanic blocked because exact target-version Vaal Orb outcomes and probabilities are not verified.';
  showError(error);
  return { success: false, error };
}

function renderCraftCounter(item) {
  if (!elements.craftCounter) return;
  const used = item.currencyUsed || {};
  const entries = Object.entries(used).filter(([, n]) => n > 0);
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  if (total === 0) {
    elements.craftCounter.style.display = 'none';
    elements.craftCounter.innerHTML = '';
    return;
  }
  const chipModels = entries.map(([key, count], index) => {
    const legacy = key.startsWith('legacy:');
    const legacyAction = legacy ? key.slice('legacy:'.length) : null;
    const definition = legacy
      ? CRAFT_DEFINITION_BY_ACTION.get(legacyAction)
      : CRAFT_DEFINITION_BY_COUNTER_KEY.get(key) || CRAFTING_ITEM_REGISTRY[key];
    const displayName = legacy
      ? `Legacy ${definition?.displayName || capitalize(legacyAction)} history`
      : definition?.displayName || capitalize(key.replace(/[-_]/g, ' '));
    const tier = definition?.historyTier || definition?.operationOptions?.variantTier ||
      (definition?.actionType === 'direct' || legacy ? 1 : null);
    const romanTier = tier === 3 ? 'III' : tier === 2 ? 'II' : tier === 1 ? 'I' : null;
    return {
      key, count, index, definition, displayName, romanTier, legacy,
      iconId: definition?.iconId || legacyAction || key,
    };
  });
  const chips = chipModels
    .map(model => {
      const accessible = `${model.displayName}${model.romanTier ? `, tier ${model.romanTier}` : ''}, ${model.count} currency use${model.count === 1 ? '' : 's'}`;
      return `<div class="cc-chip${model.legacy ? ' cc-chip-legacy' : ''}" title="${escapeHtml(accessible)}" aria-label="${escapeHtml(accessible)}">` +
        `<span id="cc-icon-${model.index}" class="currency-icon cc-icon">` +
          `<span class="currency-abbr">${escapeHtml(model.definition?.iconFallback || capitalize(model.key))}</span>` +
        `</span>` +
        `<span class="cc-name">${escapeHtml(model.displayName)}</span>` +
        (model.romanTier ? `<span class="cc-tier" aria-hidden="true">${model.romanTier}</span>` : '') +
        `<span class="cc-count">\u00d7${model.count}</span>` +
      `</div>`;
    })
    .join('');
  elements.craftCounter.style.display = 'block';
  elements.craftCounter.innerHTML =
    `<span class="cc-total">${total} currency use${total === 1 ? '' : 's'}</span>` +
    `<div class="cc-chips">${chips}</div>`;
  chipModels.forEach(model => {
    const iconEl = elements.craftCounter.querySelector(`#cc-icon-${model.index}`);
    if (iconEl) loadIconInto(iconEl, model.iconId);
  });
}

// ============================================================
//  MAGIC ITEM NAMING (PoE2-style)
// ============================================================
// PoE2 names a Magic item as: [prefix word] + BaseType + [of suffix phrase],
// e.g. 'Burning Ruby of the Salamander'. Each affix contributes a short flavour
// word chosen from its THEME -- never its raw stat text. This data only stores
// stat-group descriptors (mod.name / mod.modGroup / mod.modLine), so the flavour
// word is derived by matching theme keywords against those. First match wins, so
// list specific themes before generic ones. To retheme, edit word / phrase below;
// to add a theme, add an entry with the lower-case keywords to match.
const MAGIC_PREFIX_WORDS = [
  { keys: ['totem'],                      word: 'Totemic' },
  { keys: ['minion'],                     word: 'Commanding' },
  { keys: ['banner'],                     word: 'Heraldic' },
  { keys: ['warcry'],                     word: 'Bellowing' },
  { keys: ['rage'],                       word: 'Raging' },
  { keys: ['bleed', 'bleeding'],          word: 'Serrated' },
  { keys: ['ignite', 'flammability'],     word: 'Smouldering' },
  { keys: ['fire'],                       word: 'Burning' },
  { keys: ['cold', 'frost'],              word: 'Frosted' },
  { keys: ['lightning', 'shock'],         word: 'Sparking' },
  { keys: ['elemental'],                  word: 'Prismatic' },
  { keys: ['chaos'],                      word: 'Polluted' },
  { keys: ['armour', 'armor'],            word: 'Reinforced' },
  { keys: ['block'],                      word: 'Bastion' },
  { keys: ['shield'],                     word: 'Warding' },
  { keys: ['thorns'],                     word: 'Spiked' },
  { keys: ['area of effect', 'presence'], word: 'Expansive' },
  { keys: ['mace'],                       word: 'Crushing' },
  { keys: ['melee'],                      word: 'Bladed' },
  { keys: ['attack'],                     word: 'Fierce' },
  { keys: ['physical'],                   word: 'Honed' },
  { keys: ['incision'],                   word: 'Lacerating' },
  { keys: ['shapeshift', 'plant', 'damage form'], word: 'Feral' },
  { keys: ['damage'],                     word: 'Vicious' },
];
const MAGIC_SUFFIX_PHRASES = [
  { keys: ['totem'],                      phrase: 'of the Totem' },
  { keys: ['minion'],                     phrase: 'of Servitude' },
  { keys: ['banner', 'glory', 'valour'],  phrase: 'of the Herald' },
  { keys: ['warcry'],                     phrase: 'of Command' },
  { keys: ['rage'],                       phrase: 'of Fury' },
  { keys: ['bleed', 'bleeding'],          phrase: 'of Haemorrhage' },
  { keys: ['ignite', 'flammability'],     phrase: 'of Flames' },
  { keys: ['fire'],                       phrase: 'of the Salamander' },
  { keys: ['cold', 'frost'],              phrase: 'of the Glacier' },
  { keys: ['lightning', 'shock'],         phrase: 'of the Storm' },
  { keys: ['chaos'],                      phrase: 'of the Plague' },
  { keys: ['resist'],                     phrase: 'of Warding' },
  { keys: ['stun'],                       phrase: 'of Stability' },
  { keys: ['knockback'],                  phrase: 'of Repulsion' },
  { keys: ['leech'],                      phrase: 'of the Leech' },
  { keys: ['regeneration', 'regen'],      phrase: 'of Renewal' },
  { keys: ['life'],                       phrase: 'of Vitality' },
  { keys: ['mana'],                       phrase: 'of the Mind' },
  { keys: ['duration'],                   phrase: 'of Lingering' },
  { keys: ['speed', 'cooldown'],          phrase: 'of Haste' },
  { keys: ['mace'],                       phrase: 'of the Brute' },
  { keys: ['shapeshift', 'plant'],        phrase: 'of the Beast' },
  { keys: ['damage'],                     phrase: 'of Ruin' },
];

function magicModHaystack(mod) {
  if (!mod) return '';
  return [mod.modGroup, mod.name, mod.displayText, mod.modLine]
    .filter(Boolean).join(' ').toLowerCase();
}

function pickMagicWord(table, mod, field) {
  const hay = magicModHaystack(mod);
  if (!hay) return '';
  for (const entry of table) {
    if (entry.keys.some(k => hay.includes(k))) return entry[field];
  }
  return '';
}

// Compose a PoE2-style Magic name from the item's (at most one) prefix and
// suffix. Falls back to the bare base name if neither affix yields a word.
function buildMagicName(item) {
  const base = item.baseName;
  const prefixMod = (item.prefixes || []).find(m => !m.unrevealed);
  const suffixMod = (item.suffixes || []).find(m => !m.unrevealed);
  const lead = prefixMod ? pickMagicWord(MAGIC_PREFIX_WORDS, prefixMod, 'word') : '';
  const tail = suffixMod ? pickMagicWord(MAGIC_SUFFIX_PHRASES, suffixMod, 'phrase') : '';
  return [lead, base, tail].filter(Boolean).join(' ') || base;
}

function allItemMods(item) {
  return (item.prefixes || []).concat(item.suffixes || []);
}

function removableItemMods(item, side = null) {
  const source = side === 'prefix' ? (item.prefixes || [])
    : side === 'suffix' ? (item.suffixes || [])
      : allItemMods(item);
  return source.filter(mod => !mod.fractured && !mod.unrevealed);
}

function modHasNumericRange(mod) {
  const lineHasRange = line =>
    (line.min != null && line.max != null && line.min !== line.max) ||
    (Array.isArray(line.vals) && line.vals.some(spec => spec.min != null && spec.max != null && spec.min !== spec.max));
  return (mod.min != null && mod.max != null && mod.min !== mod.max) ||
    (Array.isArray(mod.lines) && mod.lines.some(lineHasRange));
}

function setCraftButtonState(button, disabledReason = '') {
  if (!button) return;
  if (button._forgeBaseTitle == null) button._forgeBaseTitle = button.getAttribute('title') || '';
  const disabled = !!disabledReason;
  // Keep blocked controls focusable so keyboard and assistive-technology users
  // can inspect the exact reason. The shared dispatcher enforces aria-disabled.
  button.classList.toggle('disabled', disabled);
  button.setAttribute('aria-disabled', String(disabled));
  button.dataset.disabledReason = disabledReason;
  button.title = disabled ? disabledReason : button._forgeBaseTitle;
}

function currencyDisabledReason(currency, item) {
  if (!currency) return 'Unsupported — verification required';
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';

  if (item.mirrored || item.isMirrored) return 'Item is mirrored and cannot be modified.';

  const base = ORB_VARIANTS[currency] ? ORB_VARIANTS[currency].base : currency;
  const mods = allItemMods(item);
  const removable = removableItemMods(item);
  const rareLimits = engine.getLimits('rare');
  const magicLimits = engine.getLimits('magic');
  const craftOptions = ORB_VARIANTS[currency]
    ? { minModLevel: ORB_VARIANTS[currency].minModLevel }
    : {};
  const noEligibleModifier = (rarity, options = {}) =>
    engine.getEligibleModifierCount(rarity, craftOptions, options) === 0
      ? 'No eligible modifier at this item level.'
      : '';

  switch (base) {
    case 'transmutation':
      if (item.rarity !== 'normal') return 'Requires a Normal item.';
      if (magicLimits && magicLimits.prefixes === 0 && magicLimits.suffixes === 0) return '';
      return noEligibleModifier('magic');
    case 'augmentation':
      if (item.rarity !== 'magic') return 'Requires a Magic item.';
      if (magicLimits && item.prefixes.length >= magicLimits.prefixes && item.suffixes.length >= magicLimits.suffixes) {
        if (magicLimits.prefixes === 0 && magicLimits.suffixes === 0) {
          return 'This base has 0 available Magic affix slots.';
        }
        return `Magic item has no available affix slots (effective limit: ${magicLimits.prefixes} Prefix / ${magicLimits.suffixes} Suffix).`;
      }
      return noEligibleModifier('magic');
    case 'alchemy':
      if (item.rarity !== 'normal') return 'Requires a Normal item.';
      if (!engine.supportsRarity('rare')) return `${item.baseName} cannot be upgraded to Rare.`;
      return noEligibleModifier('rare', { clearExisting: true });
    case 'regal':
      if (item.rarity !== 'magic') return 'Requires a Magic item.';
      if (!engine.supportsRarity('rare')) return `${item.baseName} cannot be upgraded to Rare.`;
      return noEligibleModifier('rare');
    case 'exalted':
      if (item.rarity !== 'rare') return 'Requires a Rare item.';
      if (!rareLimits) return `${item.baseName} cannot have Rare modifiers.`;
      if (item.prefixes.length >= rareLimits.prefixes && item.suffixes.length >= rareLimits.suffixes) {
        return 'Rare item has no open Prefix or Suffix slot.';
      }
      return noEligibleModifier('rare');
    case 'chaos': {
      if (item.rarity !== 'rare') return 'Requires a Rare item.';
      if (!removable.length) return 'No removable modifier; fractured and unrevealed modifiers are protected.';
      if (selectedCraftOmen === 'sinistral_erasure' && !removableItemMods(item, 'prefix').length) return 'Omen of Sinistral Erasure requires a removable Prefix.';
      if (selectedCraftOmen === 'dextral_erasure' && !removableItemMods(item, 'suffix').length) return 'Omen of Dextral Erasure requires a removable Suffix.';
      if (selectedCraftOmen === 'whittling') {
        const hasUnknownLevel = removable.some(mod => {
          const level = Number(mod.ilvlReq != null ? mod.ilvlReq : mod.tier);
          return !Number.isFinite(level);
        });
        if (hasUnknownLevel) return 'Unsupported — verification required: a removable modifier has no numeric modifier level.';
      }
      return '';
    }
    case 'annulment':
      if (item.rarity === 'normal') return 'Requires a Magic or Rare item.';
      if (!removable.length) return 'No removable modifier; fractured and unrevealed modifiers are protected.';
      if (omenOfLightActive && !removable.some(mod => mod.desecrated)) return 'Omen of Light requires a revealed Desecrated modifier.';
      if (selectedCraftOmen === 'sinistral_annulment' && !removableItemMods(item, 'prefix').length) return 'Omen of Sinistral Annulment requires a removable Prefix.';
      if (selectedCraftOmen === 'dextral_annulment' && !removableItemMods(item, 'suffix').length) return 'Omen of Dextral Annulment requires a removable Suffix.';
      return '';
    case 'divine':
      if (item.rarity === 'normal') return 'Requires a Magic or Rare item.';
      if (selectedCraftOmen === 'sanctification') {
        if (item.rarity !== 'rare') return 'Omen of Sanctification requires a Rare item.';
        return removable.length ? '' : 'Omen of Sanctification requires a non-fractured modifier.';
      }
      return removable.some(modHasNumericRange) ? '' : 'No non-fractured modifier has a numeric range to reroll.';
    case 'fracturing':
      if (item.rarity !== 'rare') return 'Requires a Rare item.';
      if (mods.length < 4) return 'Requires a Rare item with at least 4 modifiers.';
      if (mods.some(mod => mod.fractured)) return 'Item already has a fractured modifier.';
      return removable.length ? '' : 'Reveal a modifier before fracturing this item.';
    case 'hinekora':
      return item.hinekoraLocked ? "Hinekora's Lock is already applied." : '';
    case 'vaal':
      return 'Mechanic blocked because exact target-version Vaal Orb outcomes and probabilities are not verified.';
    default:
      return 'Unsupported — verification required';
  }
}

function unsupportedReason() {
  return UNSUPPORTED_REASON;
}

function boneDisabledReason(definition, item) {
  const boneId = definition?.operationOptions?.boneId || definition?.engineAction || 'preserved_cranium';
  const bone = CraftingEngine.BONES[boneId];
  if (!bone) return `Unsupported Abyssal Bone: ${String(boneId)}.`;
  const alreadyDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark);
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';
  if (item.mirrored || item.isMirrored) return 'Item is mirrored and cannot be modified.';
  if (item.itemClass && bone.validItemClasses && !bone.validItemClasses.includes(item.itemClass)) {
    return `${bone.name} requires ${bone.targetDescription || 'a compatible base'}.`;
  }
  if (bone.maxItemLevel != null && Number(item.ilvl || item.itemLevel || 0) > bone.maxItemLevel) {
    return `${bone.name} can only desecrate items of Item Level ${bone.maxItemLevel} or lower.`;
  }
  const pool = desecData?.bases?.[engine.baseType] || desecData?.jewelTypes?.[engine.baseType];
  if (desecData && (!pool || (!(pool.prefixes || []).length && !(pool.suffixes || []).length))) {
    return 'No Desecrated modifiers are available for this base.';
  }
  if (!desecData) return 'Unsupported — verification required: Desecrated modifier data is unavailable.';
  if (item.rarity !== 'rare') return 'Requires a Rare item.';
  if (alreadyDesecrated) return 'Item already has a Desecrated modifier.';
  return '';
}

function essenceDisabledReason(action, item) {
  if (action !== 'essence_abyss') return UNSUPPORTED_REASON;
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';
  if (item.mirrored || item.isMirrored) return 'Item is mirrored and cannot be modified.';
  if (item.itemClass && !CraftingEngine.ABYSS_ESSENCE_ITEM_CLASSES.has(item.itemClass)) {
    return 'Essence of the Abyss is not applicable to this item class.';
  }
  if (item.rarity !== 'rare') return 'Requires a Rare item.';
  if (!removableItemMods(item).length) return 'Requires at least one removable modifier.';
  if (allItemMods(item).some(mod => mod.mark)) return 'Item already carries the Mark of the Abyssal Lord.';
  if (allItemMods(item).some(mod => mod.crafted)) return 'Item already has its maximum of one crafted modifier.';
  return '';
}

function omenDisabledReason(definition, item) {
  if (!definition?.supported) return definition?.unsupportedReason || UNSUPPORTED_REASON;
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';
  if (item.mirrored || item.isMirrored) return 'Item is mirrored and cannot be modified.';
  const omen = definition.omenId;
  const removable = removableItemMods(item);
  const rareLimits = engine.getLimits('rare');

  if (definition.handler === 'toggleOmen') {
    const alreadyDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark);
    const hasRevealedDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark && !mod.unrevealed);
    if (omen === 'omen_of_light') {
      return allItemMods(item).some(mod => mod.desecrated && !mod.mark && !mod.unrevealed)
        ? ''
        : 'Omen of Light requires a revealed Desecrated modifier.';
    }
    if (item.rarity !== 'rare') return 'Requires a Rare item.';
    if (omen === 'abyssal_echoes') {
      return hasRevealedDesecrated ? 'The Desecrated modifier has already been revealed.' : '';
    }
    return alreadyDesecrated ? 'Item already has a Desecrated modifier.' : '';
  }

  if (omen === 'sinistral_alchemy' || omen === 'dextral_alchemy') {
    if (item.rarity !== 'normal') return 'Requires a Normal item for the next Orb of Alchemy.';
    if (!rareLimits) return `${item.baseName} cannot be upgraded to Rare.`;
    const side = omen === 'sinistral_alchemy' ? 'prefix' : 'suffix';
    const cap = side === 'prefix' ? rareLimits.prefixes : rareLimits.suffixes;
    if (cap === 0) return `This base has 0 available Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} slots.`;
    return engine.getEligibleModifierGroupCountForSide('rare', side, {}, { clearExisting: true }) >= cap
      ? ''
      : `No eligible Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} modifier is available.`;
  }
  if (omen === 'sinistral_coronation' || omen === 'dextral_coronation') {
    if (item.rarity !== 'magic') return 'Requires a Magic item for the next Regal Orb.';
    if (!rareLimits) return `${item.baseName} cannot be upgraded to Rare.`;
    const side = omen === 'sinistral_coronation' ? 'prefix' : 'suffix';
    const cap = side === 'prefix' ? rareLimits.prefixes : rareLimits.suffixes;
    const current = side === 'prefix' ? item.prefixes.length : item.suffixes.length;
    if (current >= cap) return `No open Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} slot is available.`;
    return engine.getEligibleModifierCountForSide('rare', side)
      ? ''
      : `No eligible Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} modifier is available.`;
  }
  if (omen === 'greater_exaltation' || omen === 'sinistral_exaltation' || omen === 'dextral_exaltation') {
    if (item.rarity !== 'rare') return 'Requires a Rare item for the next Exalted Orb.';
    if (!rareLimits) return `${item.baseName} cannot have Rare modifiers.`;
    if (omen === 'greater_exaltation') {
      const openSlots = Math.max(0, rareLimits.prefixes - item.prefixes.length) +
        Math.max(0, rareLimits.suffixes - item.suffixes.length);
      if (openSlots < 2) return 'Omen of Greater Exaltation requires two open Rare affix slots.';
      return engine.getEligibleModifierGroupCount('rare') >= 2
        ? ''
        : 'Omen of Greater Exaltation requires two eligible Rare modifiers.';
    }
    const side = omen === 'sinistral_exaltation' ? 'prefix' : 'suffix';
    const cap = side === 'prefix' ? rareLimits.prefixes : rareLimits.suffixes;
    const current = side === 'prefix' ? item.prefixes.length : item.suffixes.length;
    if (current >= cap) return `No open Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} slot is available.`;
    return engine.getEligibleModifierCountForSide('rare', side)
      ? ''
      : `No eligible Rare ${side === 'prefix' ? 'Prefix' : 'Suffix'} modifier is available.`;
  }
  if (omen === 'greater_annulment') {
    if (item.rarity === 'normal') return 'Requires a Magic or Rare item for the next Orb of Annulment.';
    return removable.length >= 2 ? '' : 'Omen of Greater Annulment requires two removable modifiers.';
  }

  if (item.rarity !== 'rare') return 'Requires a Rare item.';
  if (omen.includes('sinistral') && !removableItemMods(item, 'prefix').length) return 'Requires a removable Prefix.';
  if (omen.includes('dextral') && !removableItemMods(item, 'suffix').length) return 'Requires a removable Suffix.';
  if (!removable.length) return 'Requires a removable modifier.';
  if (omen === 'whittling' && removable.some(mod => {
    const level = Number(mod.ilvlReq != null ? mod.ilvlReq : mod.tier);
    return !Number.isFinite(level);
  })) return 'Unsupported — verification required: a removable modifier has no numeric modifier level.';
  return '';
}

function baseDetailRow(label, value, unavailable = false) {
  const row = document.createElement('div');
  row.className = 'base-detail-row' + (unavailable ? ' is-unavailable' : '');
  const labelEl = document.createElement('span');
  labelEl.className = 'base-detail-label';
  labelEl.textContent = label;
  const valueEl = document.createElement('span');
  valueEl.className = 'base-detail-value';
  valueEl.textContent = value;
  row.append(labelEl, valueEl);
  return row;
}

function renderConcreteBaseDetails(item) {
  const hasConcreteBase = item?.baseItemId != null;
  if (elements.baseDetailList) {
    const properties = hasConcreteBase ? Object.entries(item.baseProperties || {}) : [];
    elements.baseDetailList.hidden = properties.length === 0;
    if (hasConcreteBase) {
      const fragment = document.createDocumentFragment();
      // Audit levels stay on the model, but only player-relevant base
      // properties belong in the in-game-style item tooltip.
      for (const [key, value] of properties) {
        const label = capitalize(String(key).replaceAll('_', ' ').replace(/\s+/g, ' '));
        fragment.appendChild(baseDetailRow(label, String(value)));
      }
      elements.baseDetailList.replaceChildren(fragment);
    } else {
      elements.baseDetailList.replaceChildren();
    }
  }

  if (elements.implicitList) {
    const implicits = hasConcreteBase && Array.isArray(item.implicits) ? item.implicits : [];
    elements.implicitList.hidden = implicits.length === 0;
    const fragment = document.createDocumentFragment();
    for (const implicit of implicits) {
      const line = document.createElement('div');
      line.className = 'implicit-line';
      line.textContent = implicit.displayText || implicit.key || 'Implicit modifier';
      line.dataset.implicitId = implicit.id;
      fragment.appendChild(line);
    }
    elements.implicitList.replaceChildren(fragment);
  }
}

function renderQualityDetails(item) {
  if (!elements.qualityList) return;
  const quality = item?.quality && typeof item.quality === 'object' ? item.quality : null;
  const amount = Number(quality?.amount);
  const visible = Number.isFinite(amount) && amount > 0;
  elements.qualityList.hidden = !visible;
  if (!visible) {
    elements.qualityList.replaceChildren();
    return;
  }

  const type = typeof quality.type === 'string' && quality.type.trim() ? quality.type.trim() : 'normal';
  const cap = Number(quality.cap);
  const capText = quality.cap != null && Number.isFinite(cap) ? ` / ${cap}%` : '';
  const line = document.createElement('div');
  line.className = 'quality-line';
  line.textContent = `Quality (${capitalize(type)}): +${amount}%${capText}`;
  const sourceName = typeof quality.source === 'string'
    ? quality.source
    : quality.source?.displayName || quality.source?.operationId || '';
  if (sourceName) {
    line.dataset.qualitySource = sourceName;
    line.title = `Quality source: ${sourceName}`;
  }
  elements.qualityList.replaceChildren(line);
}

function renderSocketDetails(item) {
  if (!elements.socketList) return;
  const hasConcreteBase = item?.baseItemId != null;
  const state = item?.socketState && typeof item.socketState === 'object' ? item.socketState : null;
  const slots = Array.isArray(state?.slots) ? state.slots : [];
  elements.socketList.hidden = !hasConcreteBase || slots.length === 0;
  if (!hasConcreteBase || !slots.length) {
    elements.socketList.replaceChildren();
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const slot of slots) {
      const line = document.createElement('div');
      line.className = 'socket-line';
      const index = Number(slot.index) + 1;
      if (slot.state === 'occupied') {
        const name = slot.insertedItemType || slot.insertedItemId || 'Socketed item';
        line.textContent = `Socket ${index}: ${name}`;
        if (slot.effect) line.title = typeof slot.effect === 'string' ? slot.effect : JSON.stringify(slot.effect);
      } else {
        line.textContent = `Socket ${index}: Empty`;
      }
      fragment.appendChild(line);
  }
  elements.socketList.replaceChildren(fragment);
}

function renderItem(actionResult = null, overrideItem = null) {
  const item = overrideItem || engine.getItem();
  const liveItem = overrideItem ? engine.getItem() : item;
  const realCorrupted = liveItem.corrupted;
  const realSanctified = liveItem.sanctified;

  if (elements.craftModeLabel) {
    elements.craftModeLabel.innerHTML = '<i class="status-dot"></i> ' +
      escapeHtml(isJewelMode ? 'Jewel workshop' : `${currentItemClass} workshop`);
  }

  elements.tooltip.className = `tooltip rarity-${item.rarity} ${item.corrupted ? 'corrupted' : ''} ${item.sanctified ? 'sanctified' : ''}`;

  // Item display name, following PoE2 conventions:
  //  - Normal: just the base name (e.g. 'Ruby').
  //  - Magic:  [prefix word] + base + [of suffix phrase], e.g.
  //    'Burning Ruby of the Salamander'. The flavour words come from each
  //    affix's THEME via buildMagicName() -- never the raw stat-group text,
  //    which is what produced the old stat-dump titles.
  //  - Rare:   the engine's generated two-word name (e.g. 'Brood Star').
  let fullName = item.baseName;
  if (item.rarity === 'rare') {
    fullName = item.name || item.baseName;
  } else if (item.rarity === 'magic') {
    fullName = buildMagicName(item);
  }
  elements.itemName.textContent = fullName;

  // --- PoE2-style header extras: base type + item class ---
  const tipHeader = elements.itemName.parentNode;
  if (tipHeader) {
    let baseEl = document.getElementById('item-base');
    if (!baseEl) {
      baseEl = document.createElement('span');
      baseEl.id = 'item-base';
      baseEl.className = 'item-base';
      tipHeader.appendChild(baseEl);
    }
    let classEl = document.getElementById('item-class');
    if (!classEl) {
      classEl = document.createElement('span');
      classEl.id = 'item-class';
      classEl.className = 'item-class';
      tipHeader.appendChild(classEl);
    }
    // The item-class line tracks the chosen category (Jewel, Rings, Body
    // Armours, ...), not a hard-coded 'Jewel'.
    classEl.textContent = item.itemClass || currentItemClass || 'Jewel';
    // Show the small base-type subtitle ONLY for Rare items, whose generated
    // name does not contain the base. Magic names already include the base
    // ('Burning Ruby of the Salamander') and Normal items ARE the base, so a
    // subtitle there would just duplicate it (the old 'Ruby / Ruby').
    if (item.rarity === 'rare') {
      const jt = currentJewelType || 'ruby';
      baseEl.textContent = isJewelMode
        ? (jt.charAt(0).toUpperCase() + jt.slice(1))
        : (item.baseName || currentItemClass);
      baseEl.style.display = 'block';
    } else {
      baseEl.style.display = 'none';
    }
  }

  if (elements.itemLevel) {
    updateIlvlUI(item.ilvl);
  }
  renderConcreteBaseDetails(item);
  renderQualityDetails(item);
  renderSocketDetails(item);

  const allMods = [
    ...item.prefixes.map(m => ({ ...m, type: 'prefix' })),
    ...item.suffixes.map(m => ({ ...m, type: 'suffix' })),
  ];

  if (allMods.length === 0) {
    elements.modList.innerHTML = '<div class="mod-line mod-empty">No modifiers</div>';
  } else {
    const frag = document.createDocumentFragment();
    allMods.forEach(mod => {
      const isPrefix = mod.type === 'prefix';
      // PoE2 affix tag = side + modifier TIER (e.g. P1 = a tier-1 prefix).
      // Show just P/S normally; reveal the tier number (and the unrevealed "?")
      // only in the Alt inspect/detail view.
      const affixLabel = (isPrefix ? 'P' : 'S') + (showDetails ? (mod.unrevealed ? '?' : mod.tier) : '');

      const line = document.createElement('div');
      line.className = 'mod-line';
      if (mod.fractured) line.classList.add('fractured-mod');
      if (mod.desecrated) line.classList.add('desecrated-mod');
      if (mod.unrevealed) line.classList.add('unrevealed-mod');

      if (actionResult && actionResult.addedMods &&
          actionResult.addedMods.some(m => m.modGroup && m.modGroup === mod.modGroup)) {
        line.classList.add('mod-enter');
        // Freshly revealed desecrated mod gets a green highlight flash.
        if (mod.desecrated) line.classList.add('desec-reveal');
      }

      // Multi-stat desecrated mods expose a `lines` array; legacy single-stat
      // mods only have displayText + min/max. Support both.
      const multi = Array.isArray(mod.lines) && mod.lines.length > 0;
      const textHtml = multi
        ? mod.lines.map(l => escapeHtml(l.text)).join('<br>')
        : escapeHtml(mod.displayText);
      const rangeText = multi
        ? mod.lines.map(l => (l.min != null && l.max != null ? `[${l.min}-${l.max}]` : '[—]')).join(' ')
        : `[${mod.min}-${mod.max}]`;

      // P#/S# affix tag (blue prefix, red suffix) pinned to the left.
      const affixTag =
        `<span class="affix-tag ${isPrefix ? 'prefix' : 'suffix'}">${affixLabel}</span>`;

      if (showDetails) {
        line.innerHTML =
          affixTag +
          `<span class="mod-body"><span class="mod-meta">${rangeText}</span> ` +
          `<span class="mod-text">${textHtml}</span></span>`;
      } else {
        line.innerHTML = affixTag + `<span class="mod-body">${textHtml}</span>`;
        const hover = document.createElement('div');
        hover.className = 'mod-detail hover-detail';
        hover.textContent = `${isPrefix ? 'P' : 'S'}${mod.unrevealed ? '?' : mod.tier} ${rangeText}`;
        line.appendChild(hover);
      }
      frag.appendChild(line);
    });
    elements.modList.replaceChildren(frag);
  }

  if (item.enchantments.length > 0) {
    const frag = document.createDocumentFragment();
    item.enchantments.forEach(enc => {
      const line = document.createElement('div');
      line.className = 'enchant-line';
      line.textContent = enc;
      frag.appendChild(line);
    });
    elements.enchantList.replaceChildren(frag);
  } else {
    elements.enchantList.replaceChildren();
  }

  // Corrupted layout: the red "Corrupted" label takes the middle slot between
  // the two bottom rules, and the flavour text drops below the second rule.
  // When not corrupted, the flavour text sits in the middle between the rules.
  elements.corruptedLabel.style.display = item.corrupted ? 'block' : 'none';
  if (elements.sanctifiedLabel) elements.sanctifiedLabel.style.display = item.sanctified ? 'block' : 'none';
  const flavorEl = elements.itemFlavor || document.getElementById('item-flavor');
  const sepC = document.getElementById('sep-c');
  if (flavorEl && sepC) {
    flavorEl.hidden = !isJewelMode;
    if (isJewelMode) {
      if (item.corrupted) sepC.after(flavorEl);
      else sepC.before(flavorEl);
    }
  }

  // Keep the Reveal panel in sync with the REAL item: it is visible only while an
  // unrevealed Desecrated modifier is still pending. If a currency (e.g. Orb of
  // Annulment) stripped the pending modifier, drop the stale desecration state
  // too. Skip during foresight previews (overrideItem), which must never mutate
  // real reveal state.
  if (!overrideItem) {
    const hasPendingReveal =
      item.prefixes.some(m => m.unrevealed) || item.suffixes.some(m => m.unrevealed);
    if (hasPendingReveal && desecState) {
      showRevealPanel();
    } else {
      if (!hasPendingReveal) desecState = null;
      hideRevealPanel();
    }
  }

  const heldDefinition = armedCurrency ? CRAFT_DEFINITION_BY_ACTION.get(armedCurrency) : null;
  const heldCurrencyBecameUnavailable = Boolean(
    heldDefinition && disabledReasonForDefinition(heldDefinition, liveItem)
  );
  const selectedOmenDefinition = selectedCraftOmen
    ? CRAFTING_ITEM_REGISTRY[CRAFT_OMENS[selectedCraftOmen]?.craftId]
    : null;
  const selectedCraftOmenBecameUnavailable = Boolean(
    selectedOmenDefinition && disabledReasonForDefinition(selectedOmenDefinition, liveItem)
  );
  elements.craftButtons.forEach(button => {
    const definition = definitionForElement(button);
    const reason = disabledReasonForDefinition(definition, liveItem);
    setCraftButtonState(button, reason);
  });
  if (heldCurrencyBecameUnavailable) disarmCurrency();
  if (selectedCraftOmenBecameUnavailable) clearCraftOmen();
  filterCraftInventory();

  if (actionResult && actionResult.previousRarity && actionResult.previousRarity !== item.rarity) {
    elements.tooltip.style.animation = 'none';
    void elements.tooltip.offsetHeight;
    elements.tooltip.style.animation = 'rarityShift 0.5s ease';
  }

  if (elements.hinekoraMark) {
    elements.hinekoraMark.style.display = item.hinekoraLocked ? 'flex' : 'none';
  }

  renderCraftCounter(item);
  updateUndoButton();
  updateRedoButton();
}

function triggerCraftAnimation(currency) {
  const color = (CURRENCIES[currency] && CURRENCIES[currency].color) || DEFAULT_ORB_COLOR;
  elements.craftGlow.style.background = `radial-gradient(circle, ${color} 0%, transparent 60%)`;
  elements.craftGlow.classList.remove('active');
  void elements.craftGlow.offsetWidth;
  elements.craftGlow.classList.add('active');
}

function triggerErrorAnimation() {
  elements.tooltip.classList.remove('error-shake');
  void elements.tooltip.offsetWidth;
  elements.tooltip.classList.add('error-shake');
  setTimeout(() => elements.tooltip.classList.remove('error-shake'), 400);
}

let toastTimeout;
function showError(msg) {
  elements.errorToast.textContent = msg;
  elements.errorToast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => elements.errorToast.classList.remove('visible'), 3000);
}

function loadStash() {
  try {
    const saved = localStorage.getItem('poe2_stash');
    if (saved) {
      stash = JSON.parse(saved);
      if (!Array.isArray(stash)) stash = [];
    }
  } catch (e) {
    console.error('Failed to load stash', e);
    stash = [];
  }
  // Always render so the grid (and its drop targets) exists even when empty.
  renderStash();
}

function saveToStash() {
  if (stash.length >= 24) {
    showError('Stash is full (24 limit). Right-click a jewel to remove it.');
    return;
  }
  const item = engine.getItem();
  // Keep the normalized singular item class on the item itself and store the
  // outer-screen category label separately for legacy UI restoration.
  item.categoryLabel = currentItemClass;
  // Preserve any in-progress (unrevealed) desecration so a saved item can be
  // resumed after it is loaded back. The unrevealed placeholder lives on the
  // item itself, but the pending reveal options (and the UI reveal state) live
  // outside it -- without saving them the placeholder would be stuck unrevealable.
  const pending = engine.getPendingDesecration();
  if (pending) item._pendingDesecration = pending;
  if (desecState) item._desecState = structuredClone(desecState);
  stash.push(item);
  localStorage.setItem('poe2_stash', JSON.stringify(stash));
  renderStash();
  playSound('transmutation');
}

function loadFromStash(index) {
  const saved = stash[index];
  if (!saved) return;

  const savedPoolId = saved.simulatorPoolId || saved.jewelType || saved.baseType;
  const targetGameVersion = normalizedData?.targetGameVersion || null;
  if (saved.targetGameVersion && targetGameVersion && saved.targetGameVersion !== targetGameVersion) {
    showError(`This saved item targets ${saved.targetGameVersion}; this workbench targets ${targetGameVersion}.`);
    return;
  }
  if (!savedPoolId || !modData?.bases?.[savedPoolId]) {
    showError('This saved item uses a simulator pool that is not available in this version.');
    return;
  }
  if (!poolHasCraftableData(savedPoolId)) {
    showError(`This saved item's ${savedPoolId} pool has no verified crafting data in this version.`);
    return;
  }

  const authoritativePoolId = saved.baseItemId == null
    ? savedPoolId
    : normalizedIndexes?.simulatorPoolByBaseId.get(Number(saved.baseItemId));
  if (saved.baseItemId != null && !authoritativePoolId) {
    showError(`Saved concrete base ${saved.baseItemId} is not mapped in this version.`);
    return;
  }
  if (authoritativePoolId !== savedPoolId) {
    showError(`Saved concrete base ${saved.baseItemId} belongs to ${authoritativePoolId}, not ${savedPoolId}.`);
    return;
  }

  const savedConcreteBase = saved.baseItemId == null
    ? defaultConcreteBaseForPool(savedPoolId)
    : concreteBaseByIdAcrossMappings(saved.baseItemId);
  if (!savedConcreteBase || !savedConcreteBase.selectable) {
    showError(savedConcreteBase?.disabledReason || 'This saved item has no compatible selectable concrete base.');
    return;
  }
  const selectablePoolIds = selectablePoolsFor(savedPoolId);
  if (!selectablePoolIds.includes(savedPoolId)) {
    showError('This saved item is outside the supported pool set for its item class.');
    return;
  }

  // Restore a saved in-progress desecration (the unrevealed placeholder plus its
  // pending reveal options) so a stashed reveal can be resumed. Strip the
  // stash-only bookkeeping fields before handing the item to the engine so they
  // don't leak onto the live item.
  const pending = saved._pendingDesecration || null;
  const savedDesecState = saved._desecState || null;
  const item = structuredClone(saved);
  delete item._pendingDesecration;
  delete item._desecState;
  if (saved.baseItemId == null) {
    item.migrationWarnings = Array.isArray(item.migrationWarnings) ? item.migrationWarnings.slice() : [];
    item.migrationWarnings.push({
      code: 'legacy_base_defaulted',
      message: `Legacy save used deterministic base ${savedConcreteBase.displayName} (${savedConcreteBase.id}) for ${savedPoolId}.`,
    });
  }

  // Construct and migrate off to the side. A malformed/future save must not
  // partially replace the current engine or workbench context.
  let candidateEngine;
  try {
    candidateEngine = new CraftingEngine(
      modData,
      savedPoolId,
      desecData,
      buildSourceModifierOverlay(savedPoolId),
      null,
      savedConcreteBase,
      craftingRandomSource,
    );
    candidateEngine.loadItem(item, pending);
  } catch (error) {
    showError(`Saved item is incompatible: ${error.message}`);
    return;
  }

  // Only mutate live controller state after construction and migration pass.
  engine = candidateEngine;
  currentJewelType = savedPoolId;
  currentSelectablePoolIds = selectablePoolIds;
  currentConcreteBaseId = savedConcreteBase.id;
  isJewelMode = JEWEL_BASES.has(savedPoolId);
  currentItemClass = isJewelMode ? 'Jewel' : (saved.categoryLabel || saved.itemClass || 'Item');
  setJewelSelectorVisible(isJewelMode);
  syncJewelSelectorActive();
  undoStack = [];
  redoStack = [];
  disarmCurrency();
  resetOmenState();
  clearDesecration();
  // Re-show the Reveal panel (via renderItem) when an unrevealed desecration was
  // restored; set desecState AFTER clearDesecration, mirroring restoreSnapshot.
  desecState = savedDesecState;
  renderItem();
  notifyConcreteBaseChange();
  if (saved.baseItemId == null) {
    showError(`Legacy save migrated to ${savedConcreteBase.displayName}.`);
  }
  playSound('regal');
}

function removeFromStash(index) {
  stash.splice(index, 1);
  localStorage.setItem('poe2_stash', JSON.stringify(stash));
  renderStash();
  playSound('annulment');
}

function renderStash() {
  if (stash.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'stash-empty';
    const title = document.createElement('strong');
    title.textContent = 'Your stash is empty';
    const hint = document.createElement('span');
    hint.textContent = 'Save the current item to keep a crafted result.';
    empty.append(title, hint);
    elements.stashGrid.classList.add('is-empty');
    elements.stashGrid.replaceChildren(empty);
    return;
  }
  elements.stashGrid.classList.remove('is-empty');
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 24; i++) {
    const slot = document.createElement('div');
    slot.className = 'stash-slot';

    if (i < stash.length) {
      const item = stash[i];
      slot.classList.add('filled');
      slot.classList.add(`rarity-${item.rarity}`);
      if (item.corrupted) slot.classList.add('corrupted');
      slot.draggable = true;

      // Jewel icon: use the real PNG (assets/icons/<type>.png) when present,
      // falling back to the coloured dot if the image is missing.
      const savedPoolId = item.simulatorPoolId || item.jewelType || item.baseType || '';
      const dot = document.createElement('div');
      dot.className = `jewel-dot ${savedPoolId}`;
      const img = new Image();
      img.className = 'stash-img';
      img.alt = '';
      img.addEventListener('load', () => slot.classList.add('has-real-icon'));
      img.addEventListener('error', () => img.remove());
      img.src = `assets/icons/${iconIdForAction(savedPoolId)}.png`;
      dot.appendChild(img);
      slot.appendChild(dot);

      const modCount = (item.prefixes || []).length + (item.suffixes || []).length;
      if (modCount > 0) {
        const badge = document.createElement('span');
        badge.className = 'stash-badge';
        badge.textContent = modCount;
        slot.appendChild(badge);
      }

      // Visible delete button (in addition to right-click).
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'stash-del';
      del.textContent = '×';
      del.title = 'Delete';
      del.addEventListener('click', (e) => { e.stopPropagation(); removeFromStash(i); });
      slot.appendChild(del);

      slot.title = `${item.baseName} (${item.rarity})\n${modCount} mods\nLeft-click to load \u00b7 Drag to move \u00b7 Right-click to delete`;
      slot.addEventListener('click', () => loadFromStash(i));
      slot.addEventListener('contextmenu', (e) => { e.preventDefault(); removeFromStash(i); });

      slot.addEventListener('dragstart', (e) => {
        dragIndex = i;
        slot.classList.add('dragging');
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
      });
      slot.addEventListener('dragend', () => { slot.classList.remove('dragging'); });
    }

    // Any slot is a valid drop target; dropping past the end moves to the end.
    slot.addEventListener('dragover', (e) => {
      if (dragIndex === null) return;
      e.preventDefault();
      slot.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('drag-over');
      if (dragIndex === null) return;
      moveStash(dragIndex, i);
      dragIndex = null;
    });

    frag.appendChild(slot);
  }
  elements.stashGrid.replaceChildren(frag);
}

function moveStash(from, to) {
  if (from === to || from < 0 || from >= stash.length) return;
  const target = Math.min(to, stash.length - 1);
  const [moved] = stash.splice(from, 1);
  stash.splice(target, 0, moved);
  localStorage.setItem('poe2_stash', JSON.stringify(stash));
  renderStash();
  playSound('transmutation');
}

document.addEventListener('DOMContentLoaded', init);
})();
