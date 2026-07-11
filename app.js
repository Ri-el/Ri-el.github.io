// app.js - PoE2 Jewel Crafting UI Controller
// Runs as a classic <script defer> (not an ES module) so the app also works
// when opened directly from file:// (double-click index.html, no server).
(function () {
'use strict';
const CraftingEngine = window.CraftingEngine;
const CRAFTING_CURRENCY_INDEX = window.CRAFTING_CURRENCY_INDEX || null;
const APP_BOOT_STARTED = typeof performance !== 'undefined' ? performance.now() : 0;
const UNSUPPORTED_REASON = 'Unsupported — verification required';

const USE_SOUND_FILES = false;

const CURRENCIES = {
  transmutation: { color: '#6888c8' },
  augmentation:  { color: '#88aaff' },
  alchemy:       { color: '#c8a848' },
  regal:         { color: '#6888c8' },
  exalted:       { color: '#c8a848' },
  chaos:         { color: '#c8a848' },
  annulment:     { color: '#aaaaaa' },
  divine:        { color: '#e8d898' },
  vaal:          { color: '#c02040' },
  fracturing:    { color: '#6fb0a8' },
  hinekora:      { color: '#b061d6' },
  desecration:   { color: '#b061d6' },
  preserved_cranium: { color: '#5fd38a' },
  essence_abyss:     { color: '#7a3da6' },
  essence_breach:    { color: '#c0506f' },
};
const DEFAULT_ORB_COLOR = 'rgba(255,255,255,0.6)';

// Crafting omens modify the next use of a specific currency. Each omen maps to
// the currency it augments. They are mutually exclusive (only one armed).
const CRAFT_OMENS = {
  whittling:           { currency: 'chaos',     label: 'Omen of Whittling' },
  sinistral_erasure:   { currency: 'chaos',     label: 'Omen of Sinistral Erasure' },
  dextral_erasure:     { currency: 'chaos',     label: 'Omen of Dextral Erasure' },
  sinistral_annulment: { currency: 'annulment', label: 'Omen of Sinistral Annulment' },
  dextral_annulment:   { currency: 'annulment', label: 'Omen of Dextral Annulment' },
  sanctification:      { currency: 'divine',    label: 'Omen of Sanctification' },
};

// Greater / Perfect orb variants use the in-game Minimum Modifier Level rule.
// This filters eligible TIERS; it does not bias the numeric roll inside a tier.
// At least the best eligible tier of each modifier group remains rollable.
const MIN_MOD_LEVEL = CraftingEngine.CURRENCY_MIN_MODIFIER_LEVEL;
const ORB_VARIANTS = {
  greater_transmutation: { base: 'transmutation', minModLevel: MIN_MOD_LEVEL.greater_transmutation, label: 'Greater Orb of Transmutation', abbr: 'G.Trans' },
  perfect_transmutation: { base: 'transmutation', minModLevel: MIN_MOD_LEVEL.perfect_transmutation, label: 'Perfect Orb of Transmutation', abbr: 'P.Trans' },
  greater_augmentation:  { base: 'augmentation',  minModLevel: MIN_MOD_LEVEL.greater_augmentation,  label: 'Greater Orb of Augmentation',  abbr: 'G.Aug'   },
  perfect_augmentation:  { base: 'augmentation',  minModLevel: MIN_MOD_LEVEL.perfect_augmentation,  label: 'Perfect Orb of Augmentation',  abbr: 'P.Aug'   },
  greater_regal:         { base: 'regal',         minModLevel: MIN_MOD_LEVEL.greater_regal,         label: 'Greater Regal Orb',            abbr: 'G.Regal' },
  perfect_regal:         { base: 'regal',         minModLevel: MIN_MOD_LEVEL.perfect_regal,         label: 'Perfect Regal Orb',            abbr: 'P.Regal' },
  greater_exalted:       { base: 'exalted',       minModLevel: MIN_MOD_LEVEL.greater_exalted,       label: 'Greater Exalted Orb',          abbr: 'G.Exalt' },
  perfect_exalted:       { base: 'exalted',       minModLevel: MIN_MOD_LEVEL.perfect_exalted,       label: 'Perfect Exalted Orb',          abbr: 'P.Exalt' },
  greater_chaos:         { base: 'chaos',         minModLevel: MIN_MOD_LEVEL.greater_chaos,         label: 'Greater Chaos Orb',            abbr: 'G.Chaos' },
  perfect_chaos:         { base: 'chaos',         minModLevel: MIN_MOD_LEVEL.perfect_chaos,         label: 'Perfect Chaos Orb',            abbr: 'P.Chaos' },
};
// Variants reuse the base orb's cursor colour.
for (const [key, v] of Object.entries(ORB_VARIANTS)) {
  if (CURRENCIES[v.base]) CURRENCIES[key] = { color: CURRENCIES[v.base].color };
}

// Stable crafting identity lives here. HTML labels, tab names, CSS classes and
// icon filenames are presentation only; every interaction first resolves its
// data-craft-id through this registry before reaching a validator or handler.
function craftDefinition(fields) {
  const indexed = CRAFTING_CURRENCY_INDEX?.runtimeRegistry?.[fields.id] || null;
  return Object.freeze(Object.assign({
    triggeringAction: null,
    supported: true,
    unsupportedReason: '',
    inventoryClassification: indexed?.classification || 'unclassified',
    inventorySourceItemId: indexed?.sourceItemId ?? null,
    inventoryMetadataKey: indexed?.metadataKey ?? null,
  }, fields));
}

function directCraft(id, displayName, tab, engineAction, iconId, handler, sourceHandler, extra = {}) {
  return craftDefinition(Object.assign({
    id, displayName, tab, engineAction, iconId,
    actionType: 'direct',
    validator: 'currencyDisabledReason',
    handler,
    sourceHandler,
  }, extra));
}

function omenCraft(id, displayName, omenId, triggeringAction, handler = 'toggleCraftOmen', supported = true) {
  return craftDefinition({
    id, displayName, tab: 'ritual', omenId,
    actionType: supported ? 'omen' : 'unsupported',
    iconId: id.replace(/^omen-/, ''),
    validator: 'omenDisabledReason',
    handler: supported ? handler : null,
    triggeringAction,
    supported,
    unsupportedReason: supported ? '' : UNSUPPORTED_REASON,
  });
}

const CRAFTING_ITEM_REGISTRY = Object.freeze(Object.fromEntries([
  directCraft('transmutation', 'Orb of Transmutation', 'currency', 'transmutation', 'transmutation', 'applyTransmutation', 'poe2_transmutation'),
  directCraft('greater-transmutation', 'Greater Orb of Transmutation', 'currency', 'greater_transmutation', 'transmutation', 'applyTransmutation', 'poe2_transmutation_greater', { minModifierLevel: 44 }),
  directCraft('perfect-transmutation', 'Perfect Orb of Transmutation', 'currency', 'perfect_transmutation', 'transmutation', 'applyTransmutation', 'poe2_transmutation_perfect', { minModifierLevel: 70 }),
  directCraft('augmentation', 'Orb of Augmentation', 'currency', 'augmentation', 'augmentation', 'applyAugmentation', 'poe2_augmentation'),
  directCraft('greater-augmentation', 'Greater Orb of Augmentation', 'currency', 'greater_augmentation', 'augmentation', 'applyAugmentation', 'poe2_augmentation_greater', { minModifierLevel: 44 }),
  directCraft('perfect-augmentation', 'Perfect Orb of Augmentation', 'currency', 'perfect_augmentation', 'augmentation', 'applyAugmentation', 'poe2_augmentation_perfect', { minModifierLevel: 70 }),
  directCraft('alchemy', 'Orb of Alchemy', 'currency', 'alchemy', 'alchemy', 'applyAlchemy', 'poe2_alchemy'),
  directCraft('regal', 'Regal Orb', 'currency', 'regal', 'regal', 'applyRegal', 'poe2_regal'),
  directCraft('greater-regal', 'Greater Regal Orb', 'currency', 'greater_regal', 'regal', 'applyRegal', 'poe2_regal_greater', { minModifierLevel: 35 }),
  directCraft('perfect-regal', 'Perfect Regal Orb', 'currency', 'perfect_regal', 'regal', 'applyRegal', 'poe2_regal_perfect', { minModifierLevel: 50 }),
  directCraft('exalted', 'Exalted Orb', 'currency', 'exalted', 'exalted', 'applyExalted', 'poe2_exalted'),
  directCraft('greater-exalted', 'Greater Exalted Orb', 'currency', 'greater_exalted', 'exalted', 'applyExalted', 'poe2_exalted_greater', { minModifierLevel: 35 }),
  directCraft('perfect-exalted', 'Perfect Exalted Orb', 'currency', 'perfect_exalted', 'exalted', 'applyExalted', 'poe2_exalted_perfect', { minModifierLevel: 50 }),
  directCraft('chaos', 'Chaos Orb', 'currency', 'chaos', 'chaos', 'applyChaos', 'poe2_chaos'),
  directCraft('greater-chaos', 'Greater Chaos Orb', 'currency', 'greater_chaos', 'chaos', 'applyChaos', 'poe2_chaos_greater', { minModifierLevel: 35 }),
  directCraft('perfect-chaos', 'Perfect Chaos Orb', 'currency', 'perfect_chaos', 'chaos', 'applyChaos', 'poe2_chaos_perfect', { minModifierLevel: 50 }),
  directCraft('annulment', 'Orb of Annulment', 'currency', 'annulment', 'annulment', 'applyAnnulment', 'poe2_annulment'),
  directCraft('divine', 'Divine Orb', 'currency', 'divine', 'divine', 'applyDivine', 'poe2_divine'),
  directCraft('fracturing', 'Fracturing Orb', 'currency', 'fracturing', 'fracturing', 'applyFracturing', 'poe2_fracture'),
  craftDefinition({ id: 'hinekora', displayName: "Hinekora's Lock", tab: 'currency', engineAction: 'hinekora', iconId: 'hinekora', actionType: 'specialized', validator: 'currencyDisabledReason', handler: 'applyHinekoraLock' }),
  omenCraft('omen-sinistral-necromancy', 'Omen of Sinistral Necromancy', 'sinistral_necromancy', 'preserved-cranium', 'toggleOmen'),
  omenCraft('omen-dextral-necromancy', 'Omen of Dextral Necromancy', 'dextral_necromancy', 'preserved-cranium', 'toggleOmen'),
  omenCraft('omen-abyssal-echoes', 'Omen of Abyssal Echoes', 'abyssal_echoes', 'preserved-cranium', 'toggleOmen'),
  omenCraft('omen-light', 'Omen of Light', 'omen_of_light', 'annulment', 'toggleOmen'),
  omenCraft('omen-sovereign', 'Omen of the Sovereign', 'omen_of_the_sovereign', 'preserved-cranium', 'toggleOmen', false),
  omenCraft('omen-liege', 'Omen of the Liege', 'omen_of_the_liege', 'preserved-cranium', 'toggleOmen', false),
  omenCraft('omen-blackblooded', 'Omen of the Blackblooded', 'omen_of_the_blackblooded', 'preserved-cranium', 'toggleOmen', false),
  omenCraft('omen-whittling', 'Omen of Whittling', 'whittling', 'chaos'),
  omenCraft('omen-sinistral-erasure', 'Omen of Sinistral Erasure', 'sinistral_erasure', 'chaos'),
  omenCraft('omen-dextral-erasure', 'Omen of Dextral Erasure', 'dextral_erasure', 'chaos'),
  omenCraft('omen-sinistral-annulment', 'Omen of Sinistral Annulment', 'sinistral_annulment', 'annulment'),
  omenCraft('omen-dextral-annulment', 'Omen of Dextral Annulment', 'dextral_annulment', 'annulment'),
  omenCraft('omen-sanctification', 'Omen of Sanctification', 'sanctification', 'divine'),
  craftDefinition({ id: 'preserved-cranium', displayName: 'Preserved Cranium', tab: 'abyss', engineAction: 'preserved_cranium', iconId: 'cranium', actionType: 'specialized', validator: 'boneDisabledReason', handler: 'startDesecrationFlow' }),
  directCraft('essence-abyss', 'Essence of the Abyss', 'abyss', 'essence_abyss', 'abyss-essence', 'applyEssenceOfAbyss', 'poe2_essence', { validator: 'essenceDisabledReason' }),
  craftDefinition({ id: 'essence-breach', displayName: 'Essence of the Breach', tab: 'breach', engineAction: 'essence_breach', iconId: 'breach-essence', actionType: 'unsupported', validator: 'unsupportedReason', handler: null, supported: false, unsupportedReason: UNSUPPORTED_REASON }),
  directCraft('vaal', 'Vaal Orb', 'corruption', 'vaal', 'vaal', 'applyVaal', 'poe2_vaal'),
].map(definition => [definition.id, definition])));
const CRAFT_DEFINITION_BY_ACTION = new Map();
for (const definition of Object.values(CRAFTING_ITEM_REGISTRY)) {
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
let armedCurrency = null;
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

const elements = {
  tooltip: document.getElementById('jewel-tooltip'),
  itemName: document.getElementById('item-name'),
  modList: document.getElementById('mod-list'),
  enchantList: document.getElementById('enchant-list'),
  baseDetailList: document.getElementById('base-detail-list'),
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
  if (!data?.baseItems || !data?.modifiers || !data?.craftingItems) return null;
  return measureOperation('normalized-index-build', () => {
    const indexes = {
      basesById: new Map(),
      basesByItemClass: new Map(),
      simulatorPoolByBaseId: new Map(),
      classesById: new Map(),
      modifiersById: new Map(),
      modifiersByBase: new Map(),
      modifiersByItemClass: new Map(),
      prefixes: [],
      suffixes: [],
      modifierGroups: new Map(),
      tags: new Map(),
      itemLevelThresholds: new Map(),
      desecratedPools: new Map(),
      craftingDefinitions: new Map(),
      craftingMethodsByHandler: new Map(),
      modifiersByClassGroupLevel: new Map(),
    };

    const addToMapArray = (map, key, value) => {
      if (key == null) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(value);
    };

    for (const sourceClass of data.baseItems.classes || []) indexes.classesById.set(sourceClass.id, sourceClass);
    for (const base of data.baseItems.bases || []) {
      indexes.basesById.set(base.id, base);
      addToMapArray(indexes.basesByItemClass, base.itemClass, base);
      for (const tag of base.tags || []) addToMapArray(indexes.tags, tag, { kind: 'base', id: base.id });
    }

    for (const modifier of data.modifiers.modifiers || []) {
      indexes.modifiersById.set(modifier.id, modifier);
      if (modifier.affix === 'prefix') indexes.prefixes.push(modifier);
      if (modifier.affix === 'suffix') indexes.suffixes.push(modifier);
      addToMapArray(indexes.modifierGroups, modifier.modifierGroupId, modifier);
      addToMapArray(indexes.itemLevelThresholds, modifier.requiredItemLevel, modifier);
      for (const tag of modifier.modifierTags || []) addToMapArray(indexes.tags, tag, { kind: 'modifier', id: modifier.id });
      for (const [classId] of modifier.spawnWeights || []) {
        const sourceClass = indexes.classesById.get(classId);
        addToMapArray(indexes.modifiersByItemClass, sourceClass?.itemClass, modifier);
        if (modifier.desecrated) addToMapArray(indexes.desecratedPools, classId, modifier);
        const key = `${classId}|${modifier.affix}|${modifier.modifierGroup}|${modifier.requiredItemLevel}`;
        addToMapArray(indexes.modifiersByClassGroupLevel, key, modifier);
      }
    }

    for (const [simulatorPoolId, mapping] of Object.entries(data.baseItems.simulatorBaseMap || {})) {
      const seen = new Set();
      const pool = [];
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
      for (const classId of mapping.classIds || []) {
        const sourceClass = indexes.classesById.get(classId);
        for (const [modifierId] of sourceClass?.modifierWeights || []) {
          if (seen.has(modifierId)) continue;
          const modifier = indexes.modifiersById.get(modifierId);
          if (modifier) { seen.add(modifierId); pool.push(modifier); }
        }
      }
      indexes.modifiersByBase.set(simulatorPoolId, pool);
    }

    for (const item of data.craftingItems.items || []) indexes.craftingDefinitions.set(item.id, item);
    const visitMethod = method => {
      if (method.handler) addToMapArray(indexes.craftingMethodsByHandler, method.handler, method);
      for (const child of method.elements || []) visitMethod(child);
    };
    for (const method of data.craftingItems.methods || []) visitMethod(method);
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
  const modifier = normalizedIndexes?.modifiersById.get(modifierId);
  if (!modifier) return { id: modifierId, key: null, stats: [], displayText: `Modifier ${modifierId}` };
  const stats = Array.isArray(modifier.stats) ? structuredClone(modifier.stats) : [];
  const statText = stats.map(normalizedStatText).filter(Boolean);
  return {
    id: modifier.id,
    key: modifier.key || null,
    modifierGroupId: modifier.modifierGroupId ?? null,
    modifierGroup: modifier.modifierGroup || null,
    stats,
    // The source export has no localization templates. This deliberately uses
    // sourced stat identifiers/ranges instead of inventing in-game wording.
    displayText: statText.join('; ') || modifier.key || `Modifier ${modifier.id}`,
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
    targetGameVersion: normalizedData?.manifest?.targetGameVersion || null,
    sourceVersion: normalizedData?.manifest?.source?.embeddedGameVersion || null,
    verificationState: normalizedData?.manifest?.source?.versionStatus || null,
    provenance: {
      normalizedPath: 'data/normalized/base-items.json',
      sourceSha256: normalizedData?.manifest?.source?.sha256 || null,
    },
  };
}

function concreteBasesForPool(simulatorPoolId) {
  const mapping = normalizedData?.baseItems?.simulatorBaseMap?.[simulatorPoolId];
  if (!mapping || !normalizedIndexes) return [];
  return (mapping.concreteBaseIds || [])
    .map(id => normalizedIndexes.basesById.get(id))
    .filter(Boolean)
    .map(base => concreteBaseDefinition(base, simulatorPoolId));
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
  const mapping = normalizedData.baseItems.simulatorBaseMap?.[baseType];
  const typeData = modData?.bases?.[baseType];
  if (!mapping || !typeData) return null;

  return measureOperation('base-modifier-overlay', () => {
    const overlay = new Map();
    for (const [affix, groups] of [['prefix', typeData.prefixes || []], ['suffix', typeData.suffixes || []]]) {
      for (const group of groups) {
        for (const tier of group.tiers || []) {
          const matches = [];
          for (const classId of mapping.classIds || []) {
            const key = `${classId}|${affix}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`;
            for (const modifier of normalizedIndexes.modifiersByClassGroupLevel.get(key) || []) {
              if (modifier.desecrated || modifier.essence || modifier.corrupted || modifier.enchantment) continue;
              matches.push(modifier);
            }
          }
          const ids = [...new Set(matches.map(modifier => modifier.id))];
          if (ids.length !== 1) continue;
          const modifier = normalizedIndexes.modifiersById.get(ids[0]);
          const applicableWeights = (modifier.spawnWeights || [])
            .filter(([classId]) => mapping.classIds.includes(classId))
            .map(([, weight]) => Number(weight));
          const uniqueWeights = [...new Set(applicableWeights)];
          overlay.set(`${affix}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`, {
            stableModifierId: modifier.id,
            sourceModifierKey: modifier.key,
            sourceModifierGroupId: modifier.modifierGroupId,
            spawnWeight: uniqueWeights.length === 1 ? uniqueWeights[0] : null,
            modifierTags: modifier.modifierTags || [],
            requiredTags: modifier.requiredTags || [],
            forbiddenTags: modifier.forbiddenTags || [],
            weightConditions: modifier.weightConditions || [],
          });
        }
      }
    }
    return overlay;
  });
}

function validateCraftRegistry() {
  const validators = { currencyDisabledReason, boneDisabledReason, essenceDisabledReason, omenDisabledReason, unsupportedReason };
  const specializedHandlers = { applyHinekoraLock, startDesecrationFlow, toggleOmen, toggleCraftOmen };
  const indexedRegistry = CRAFTING_CURRENCY_INDEX?.runtimeRegistry || {};
  if (Object.keys(indexedRegistry).length !== Object.keys(CRAFTING_ITEM_REGISTRY).length) {
    throw new Error('Crafting currency index does not match the runtime registry.');
  }
  const seen = new Set();
  for (const card of document.querySelectorAll('[data-craft-id]')) {
    const id = card.dataset.craftId;
    if (!id || seen.has(id)) throw new Error(`Duplicate or missing crafting ID: ${id || '(empty)'}`);
    seen.add(id);
    const definition = CRAFTING_ITEM_REGISTRY[id];
    if (!definition) throw new Error(`Crafting registry entry not found: ${id}`);
    if (!indexedRegistry[id] || definition.inventoryClassification === 'unclassified') {
      throw new Error(`Crafting inventory classification is missing for ${id}.`);
    }
    const panel = card.closest('[data-craft-panel]');
    if (panel && panel.dataset.craftPanel !== definition.tab) {
      throw new Error(`Crafting card ${id} is in ${panel.dataset.craftPanel}, expected ${definition.tab}.`);
    }
    if (definition.supported && (!definition.validator || !definition.handler)) {
      throw new Error(`Supported crafting card lacks validator/handler: ${id}`);
    }
    if (typeof validators[definition.validator] !== 'function') {
      throw new Error(`Eligibility validator is missing for ${id}: ${definition.validator}`);
    }
    if (!definition.supported && definition.unsupportedReason !== UNSUPPORTED_REASON) {
      throw new Error(`Unsupported crafting card lacks the required reason: ${id}`);
    }
    if (definition.actionType === 'direct' && typeof CraftingEngine.prototype[definition.handler] !== 'function') {
      throw new Error(`Engine handler is missing for ${id}: ${definition.handler}`);
    }
    if ((definition.actionType === 'specialized' || definition.actionType === 'omen') &&
        typeof specializedHandlers[definition.handler] !== 'function') {
      throw new Error(`Specialized handler is missing for ${id}: ${definition.handler}`);
    }
    if (definition.sourceHandler && normalizedIndexes && !normalizedIndexes.craftingMethodsByHandler.has(definition.sourceHandler)) {
      throw new Error(`Imported crafting method is missing for ${id}: ${definition.sourceHandler}`);
    }
  }
  return true;
}

async function init() {
  try {
    measureOperation('initial-data-load', () => {
      if (!window.MOD_BASES) throw new Error('Mod data not found — run build (build.cmd) to generate data/mods.data.js.');
      if (!window.COE_NORMALIZED_DATA) throw new Error('Normalized crafting data not found — run build (build.cmd).');
      if (!window.CRAFTING_CURRENCY_INDEX) throw new Error('Crafting currency index not found — run build (build.cmd).');
      modData = mergeModSources();
      normalizedData = window.COE_NORMALIZED_DATA;
      normalizedIndexes = buildNormalizedDataIndexes(normalizedData);

      // Desecrated (Abyssal) mod pools — optional. Desecration is disabled if absent.
      desecData = window.DESECRATED_MODS_RAW || null;

      validateCraftRegistry();
      loadStash();
      if (USE_SOUND_FILES) preloadSounds();
      setupCurrencyIcons();
      createEngine(currentJewelType);
      setupEventListeners();
    });
    if (typeof performance !== 'undefined') {
      performanceMetrics.push({ name: 'app-boot', duration: performance.now() - APP_BOOT_STARTED });
    }
  } catch (err) {
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
  if (elements.omenBtns) elements.omenBtns.forEach(b => b.classList.remove('active'));
  if (elements.craftOmenBtns) elements.craftOmenBtns.forEach(b => b.classList.remove('active'));
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
window.CraftForge.getPerformanceMetrics = () => performanceMetrics.map(metric => ({ ...metric }));
window.CraftForge.reloadCraftIcons = () => setupCurrencyIcons();
window.CraftForge.getConcreteBaseContext = concreteBaseContext;
window.CraftForge.selectConcreteBase = selectConcreteBase;
window.CraftForge.getNormalizedIndexCounts = () => normalizedIndexes ? ({
  bases: normalizedIndexes.basesById.size,
  itemClasses: normalizedIndexes.basesByItemClass.size,
  modifiers: normalizedIndexes.modifiersById.size,
  modifierGroups: normalizedIndexes.modifierGroups.size,
  tags: normalizedIndexes.tags.size,
  desecratedPools: normalizedIndexes.desecratedPools.size,
  craftingItems: normalizedIndexes.craftingDefinitions.size,
}) : null;

function setupCurrencyIcons() {
  document.querySelectorAll('[data-craft-id]').forEach(card => {
    const definition = definitionForElement(card);
    const iconEl = card.querySelector('.currency-icon');
    const iconId = card.dataset.iconId || definition?.iconId || card.dataset.craftId;
    if (iconEl && iconId) loadIconInto(iconEl, iconId);
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

  elements.craftTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setActiveCraftTab(tab.dataset.craftTab));
    tab.addEventListener('keydown', (event) => {
      const tabs = Array.from(elements.craftTabs);
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      setActiveCraftTab(tabs[next].dataset.craftTab, { focus: true });
    });
  });
}

function setupEventListeners() {
  // Protect against duplicate listeners when init is re-entered by a test,
  // hot-reload wrapper, or restored page lifecycle.
  if (eventsBound) return;
  eventsBound = true;
  setupCraftTabs();

  document.addEventListener('contextmenu', e => e.preventDefault());

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

  elements.currencyBtns.forEach(btn => {
    btn.setAttribute('aria-pressed', 'false');
    // Click/tap picks up a currency; right-click remains available for players
    // accustomed to the original desktop interaction. Native drag still starts
    // once the pointer moves, so both the stash-like drag and click model work.
    btn.addEventListener('click', () => {
      toggleCurrency(actionForElement(btn));
    });
    btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleCurrency(actionForElement(btn));
    });
  });

  // Shared apply path used by BOTH interaction models:
  //  1) arm (right- or left-click a currency) then left-click the item, and
  //  2) left-click drag a currency and release it on the item.
  function useCurrencyOnItem(currency, shiftKey) {
    if (!currency) return;
    // The drag-drop path may not have armed the currency; arm it so the orb /
    // shift-to-keep behaviour stays consistent with the click model.
    if (armedCurrency !== currency) armCurrency(currency);

    if (currency === 'hinekora') { applyHinekoraLock(shiftKey); return; }

    // Abyssal bones open the Well of Souls (desecration) instead of applying
    // directly. Under Hinekora's Lock the desecration outcome is FORESEEN, so
    // commit the EXACT sealed desecration (same placement + same Well of Souls
    // options) rather than rolling a fresh one -- otherwise the committed result
    // would differ from what the Lock just previewed.
    if (currency === 'preserved_cranium') {
      if (engine.getItem().hinekoraLocked) commitDesecrationForesight(currency);
      else startDesecrationFlow(currency);
      return;
    }

    // Hinekora's Lock: using any currency commits its (sealed) foreseen outcome
    // immediately and removes the Lock. Hovering only previews; there is no
    // accept/cancel step.
    if (engine.getItem().hinekoraLocked && FORESEEABLE.has(currency)) {
      commitForesight(currency);
      return;
    }

    const before = snapshotState(engine.getItem());
    const result = applyCurrencyToEngine(currency);

    if (result.success) {
      pushUndo(before);
      engine.recordCurrencyUse(currency);
      consumeCraftOmen(currency);
      if (currency === 'annulment' && omenOfLightActive) {
        omenOfLightActive = false;
        const lb = Array.from(elements.omenBtns).find(b => omenForElement(b) === 'omen_of_light');
        if (lb) lb.classList.remove('active');
      }
      playSound(currency);
      triggerCraftAnimation(currency);
      renderItem(result);
      // Applying normally consumes the held currency and drops it. Hold SHIFT to
      // keep it on the cursor so you can keep slamming the remaining slots. A
      // corrupted result always drops it (nothing more can be applied).
      if (!shiftKey || result.item.corrupted || result.item.sanctified) disarmCurrency();
    } else {
      // A blocked/failed application consumes nothing, but the held currency
      // must not stay glued to the cursor. Drop it back automatically (hold
      // SHIFT to keep it in hand and try another slot), mirroring the success
      // path so an invalid currency never trails the pointer.
      if (!shiftKey) disarmCurrency();
      playSound('error');
      triggerErrorAnimation();
      showError(result.error);
    }
  }

  const applyArmedToItem = (e) => {
    if (!armedCurrency) return;
    e.preventDefault();
    useCurrencyOnItem(armedCurrency, e.shiftKey);
  };
  // Model 1 (arm + click): right- or left-click a currency to pick it up (its
  // icon rides the cursor), then LEFT-CLICK the jewel to use it.
  elements.tooltip.addEventListener('click', applyArmedToItem);
  // Hinekora's Lock: foresight previews ONLY once a currency is in hand (armed
  // via left- or right-click) and brought over the item -- never on plain hover
  // of a currency button. Moving the cursor off the item clears the preview.
  elements.tooltip.addEventListener('mouseenter', () => { if (armedCurrency) previewForesight(armedCurrency); });
  elements.tooltip.addEventListener('mouseleave', clearForesightPreview);

  // Model 2 (left-click drag): press and hold left mouse on a currency, drag it
  // onto the item, and release to use it. The dragged icon follows the cursor
  // while the button stays put; releasing anywhere other than the item cancels.
  const startCurrencyDrag = (btn, currency) => (e) => {
    if (!currency) return;
    if (engine.getItem().corrupted) { e.preventDefault(); return; }
    // Clear any armed orb so we never show two icons at once.
    disarmCurrency();
    dragCurrency = currency;
    btn.classList.add('dragging-currency');
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'copy';
      try { e.dataTransfer.setData('text/plain', currency); } catch (_) {}
      const iconImg = btn.querySelector('img');
      if (iconImg && iconImg.complete && iconImg.width) {
        try { e.dataTransfer.setDragImage(iconImg, iconImg.width / 2, iconImg.height / 2); } catch (_) {}
      }
    }
  };
  const endCurrencyDrag = (btn) => () => { btn.classList.remove('dragging-currency'); dragCurrency = null; };
  Array.from(elements.currencyBtns).forEach(btn => {
    btn.setAttribute('draggable', 'true');
    btn.addEventListener('dragstart', startCurrencyDrag(btn, actionForElement(btn)));
    btn.addEventListener('dragend', endCurrencyDrag(btn));
  });
  Array.from(elements.boneBtns).forEach(btn => {
    btn.setAttribute('draggable', 'true');
    btn.addEventListener('dragstart', startCurrencyDrag(btn, actionForElement(btn)));
    btn.addEventListener('dragend', endCurrencyDrag(btn));
  });
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
    useCurrencyOnItem(currency, e.shiftKey);
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

  // --- Desecration (Abyssal) ---
  elements.omenBtns.forEach(btn => {
    // PoE2 omens are activated by RIGHT-CLICK ("right click to set active").
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleOmen(omenForElement(btn)); });
    btn.addEventListener('click', () => showError('Right-click an Omen to activate it.'));
  });
  // Crafting omens (Whittling / Erasure / Annulment / Sanctification): right-click
  // to arm one, then use its matching currency (Chaos / Annulment / Divine).
  if (elements.craftOmenBtns) elements.craftOmenBtns.forEach(btn => {
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleCraftOmen(omenForElement(btn)); });
    btn.addEventListener('click', () => showError('Right-click an Omen to activate it, then use its matching currency.'));
  });
  elements.boneBtns.forEach(btn => {
    // Preserved Cranium behaves like a normal currency: left- or right-click to
    // arm/disarm it (a glowing orb follows the cursor), then click the jewel to
    // desecrate. The button stays put in the menu while the orb is dragged.
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleCurrency(actionForElement(btn)); });
    btn.addEventListener('click', () => {
      const action = actionForElement(btn);
      if (armedCurrency === action) disarmCurrency();
      else toggleCurrency(action);
    });
  });
  // Essences behave like currencies: arm with click (or drag), then click the jewel.
  if (elements.essenceBtns) elements.essenceBtns.forEach(btn => {
    btn.setAttribute('draggable', 'true');
    btn.addEventListener('dragstart', startCurrencyDrag(btn, actionForElement(btn)));
    btn.addEventListener('dragend', endCurrencyDrag(btn));
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); toggleCurrency(actionForElement(btn)); });
    btn.addEventListener('click', () => {
      const action = actionForElement(btn);
      if (armedCurrency === action) disarmCurrency();
      else toggleCurrency(action);
    });
  });
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
      case 'applyAlchemy':
      case 'applyVaal':
      case 'applyFracturing':
      case 'applyEssenceOfAbyss':
      case 'applyEssenceOfBreach': return eng[definition.handler]();
      default: return { success: false, error: 'Registered crafting handler is unavailable.' };
    }
  });
}

function toggleCurrency(currency) {
  if (!currency) return;
  if (engine.getItem().corrupted) {
    showError('Item is corrupted and cannot be modified.');
    return;
  }
  if (armedCurrency === currency) disarmCurrency();
  else armCurrency(currency);
}

// Show the picked-up currency's real icon riding along with the cursor orb,
// so dragging feels like carrying the actual currency item.
function setOrbIcon(name) {
  if (!elements.cursorOrb) return;
  let img = elements.cursorOrb.querySelector('.orb-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'orb-img';
    img.alt = '';
    elements.cursorOrb.appendChild(img);
  }
  img.style.display = 'none';
  img.onload = () => { img.style.display = 'block'; };
  img.onerror = () => { img.remove(); };
  img.src = `assets/icons/${iconIdForAction(name)}.png`;
}

function clearOrbIcon() {
  if (!elements.cursorOrb) return;
  const img = elements.cursorOrb.querySelector('.orb-img');
  if (img) img.remove();
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
    b.setAttribute('aria-pressed', String(isArmed));
  });
  elements.boneBtns.forEach(b =>
    b.classList.toggle('armed', actionForElement(b) === currency));
  if (elements.essenceBtns) elements.essenceBtns.forEach(b =>
    b.classList.toggle('armed', actionForElement(b) === currency));

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
  elements.currencyBtns.forEach(b => {
    b.classList.remove('armed');
    b.setAttribute('aria-pressed', 'false');
  });
  elements.boneBtns.forEach(b => b.classList.remove('armed'));
  if (elements.essenceBtns) elements.essenceBtns.forEach(b => b.classList.remove('armed'));
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

  const applyValue = (v) => measureOperation('item-level-change', () => updateIlvlUI(engine.setItemLevel(v)));

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
const DIRECTIONAL_OMENS = ['sinistral_necromancy', 'dextral_necromancy'];

function toggleOmen(omen) {
  // Omen of Light is an ANNULMENT omen, tracked separately from the
  // desecration-reveal omens: it makes the next Orb of Annulment strip only a
  // Desecrated modifier. The other omens influence the Well of Souls.
  if (omen === 'omen_of_light') {
    omenOfLightActive = !omenOfLightActive;
    const btn = Array.from(elements.omenBtns).find(b => omenForElement(b) === 'omen_of_light');
    if (btn) btn.classList.toggle('active', omenOfLightActive);
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
    b.classList.toggle('active', selectedOmens.has(buttonOmen));
  });
}

// ---- Crafting omens (Chaos / Annulment / Divine augments) ----
function updateCraftOmenButtons() {
  if (!elements.craftOmenBtns) return;
  elements.craftOmenBtns.forEach(b =>
    b.classList.toggle('active', omenForElement(b) === selectedCraftOmen));
}

function toggleCraftOmen(omen) {
  if (!CRAFT_OMENS[omen]) return;
  selectedCraftOmen = (selectedCraftOmen === omen) ? null : omen;
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
    engine.recordCurrencyUse(selectedCraftOmen);
    clearCraftOmen();
  }
}

function startDesecrationFlow(bone = 'preserved_cranium') {
  if (!desecData) { showError('Desecrated modifier data is not available.'); return; }
  disarmCurrency();
  // Committing a bone supersedes any Hinekora foresight preview.
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  if (engine.getItem().corrupted) {
    playSound('error'); triggerErrorAnimation();
    showError('Item is corrupted and cannot be modified.');
    return;
  }
  const before = snapshotState(engine.getItem());
  const res = engine.startDesecration({
    bone: bone || 'preserved_cranium',
    omens: Array.from(selectedOmens),
  });
  if (!res.success) {
    playSound('error'); triggerErrorAnimation();
    showError(res.error);
    return;
  }
  // The bone (and any omens) are consumed now: the desecration is applied and an
  // unrevealed green modifier is placed on the item. The actual modifier is
  // revealed later via the Reveal panel below the item.
  pushUndo(before);
  engine.recordCurrencyUse(bone || 'preserved_cranium');
  // Abyssal Echoes is activated at reveal time (not now), so don't count it here.
  selectedOmens.forEach((o) => { if (o !== 'abyssal_echoes') engine.recordCurrencyUse(o); });
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
  });

  desecState = { side: res.side, mode: res.mode, rerollsLeft: 1, options: res.options, abyssalUsed: false };
  playSound('desecration');
  triggerCraftAnimation('desecration');
  renderItem(res);
  showRevealPanel();
}

function openWell() {
  if (!desecState) { showError('Nothing to reveal.'); return; }
  // Omen of Abyssal Echoes is consumed the moment the desecrated modifier is
  // REVEALED (the Well opens) if it was activated -- whether or not the reroll
  // is actually used. If it was never activated, it is never counted. Guarded
  // by echoCounted so re-opening the Well (after a Cancel) cannot double-count.
  if (selectedOmens.has('abyssal_echoes') && !desecState.echoCounted) {
    engine.recordCurrencyUse('abyssal_echoes');
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
  triggerCraftAnimation('desecration');
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
    if (omenForElement(b) === 'abyssal_echoes') b.classList.remove('active');
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
  if (engine.getItem().corrupted) {
    // A blocked application must not leave the Lock orb glued to the cursor --
    // drop it back like every other failed currency (hold SHIFT to keep it).
    if (!shiftKey) disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    showError('Item is corrupted and cannot be modified.');
    return;
  }
  if (engine.getItem().hinekoraLocked) {
    // Re-applying a Lock that's already on the item is a no-op, so the held
    // Lock must drop back too instead of trailing the pointer.
    if (!shiftKey) disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    showError("Hinekora's Lock is already applied.");
    return;
  }
  pushUndo(snapshotState(engine.getItem()));
  engine.setHinekoraLock();
  engine.recordCurrencyUse('hinekora');
  foreseenSeals = {};
  foreseenHover = null;
  disarmCurrency();
  playSound('hinekora');
  triggerCraftAnimation('hinekora');
  renderItem();
}

// --- Hinekora's Lock: the Vaal is consumed, but the player picks the outcome ---
const VAAL_CHOICES = {
  none:    { title: 'Corrupt \u2014 Unchanged', desc: 'Becomes Corrupted with no other change.' },
  reroll:  { title: 'Corrupt \u2014 Reroll', desc: 'Destroy and re-add 1\u20133 random modifiers, then Corrupt.' },
  enchant: { title: 'Sanctify \u2014 Corrupted Implicit', desc: 'Add a corrupted implicit modifier, then Corrupt.' },
  modify:  { title: 'Corrupt \u2014 Modify', desc: 'Add a corrupted implicit OR remove a modifier, then Corrupt.' },
};
const VAAL_OUTCOME_NUM = { none: 1, reroll: 2, enchant: 3, modify: 4 };

// Currencies whose effect Hinekora's Lock can foresee (everything that directly
// modifies the item — not the Lock itself or the Well-of-Souls bone).
const FORESEEABLE = new Set([
  'transmutation', 'augmentation', 'alchemy', 'regal', 'exalted',
  'chaos', 'annulment', 'divine', 'vaal', 'fracturing', 'essence_abyss',
  'greater_transmutation', 'perfect_transmutation',
  'greater_augmentation', 'perfect_augmentation',
  'greater_regal', 'perfect_regal',
  'greater_exalted', 'perfect_exalted',
  'greater_chaos', 'perfect_chaos',
]);
// Abyssal bones are foreseeable too, but their preview is special: it shows the
// item gaining an UNREVEALED "Desecrated Modifier" line (the real mod is only
// chosen later at the Well of Souls). Using the bone consumes the Lock and opens
// the Well.
const FORESEEABLE_BONES = new Set(['preserved_cranium']);
function currencyLabel(currency) {
  if (ORB_VARIANTS[currency]) return ORB_VARIANTS[currency].label;
  const map = {
    transmutation: 'Orb of Transmutation', augmentation: 'Orb of Augmentation',
    alchemy: 'Orb of Alchemy', regal: 'Regal Orb', exalted: 'Exalted Orb',
    chaos: 'Chaos Orb', annulment: 'Orb of Annulment', divine: 'Divine Orb',
    vaal: 'Vaal Orb', fracturing: 'Fracturing Orb',
    preserved_cranium: 'Preserved Cranium',
    essence_abyss: 'Essence of the Abyss', essence_breach: 'Essence of the Breach',
  };
  return map[currency] || currency;
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
  const foreseen = opts[Math.floor(Math.random() * opts.length)].key;
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

function commitForesight(currency) {
  const seal = foreseenSeals[currency] || computeForesight(currency);
  if (!seal.afterItem) {
    // A foreseen currency that would do nothing must not stay stuck on the
    // cursor either -- drop it back like every other blocked application.
    disarmCurrency();
    playSound('error');
    triggerErrorAnimation();
    showError((seal.result && seal.result.error) || 'Nothing to foresee.');
    return;
  }
  const before = snapshotState(engine.getItem());
  pushUndo(before);
  engine.loadItem(seal.afterItem);   // commit the exact sealed outcome
  engine.recordCurrencyUse(currency);
  consumeCraftOmen(currency);
  engine.clearHinekoraLock();        // "The Lock is removed when this item is modified."
  if (currency === 'annulment' && omenOfLightActive) {
    omenOfLightActive = false;
    const lb = Array.from(elements.omenBtns).find(b => omenForElement(b) === 'omen_of_light');
    if (lb) lb.classList.remove('active');
  }
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  playSound(currency);
  triggerCraftAnimation(currency);
  disarmCurrency();
  renderItem();
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
    showError((seal.result && seal.result.error) || 'Nothing to foresee.');
    return;
  }
  const before = snapshotState(engine.getItem());
  pushUndo(before);
  // Restore the sealed item (with its unrevealed placeholder) AND the sealed
  // pending desecration (same side/mode + the same revealed options).
  engine.loadItem(seal.afterItem, seal.pending);
  engine.recordCurrencyUse(bone);
  // Consume any directional / one-shot omens now (Abyssal Echoes is counted
  // later, on commit at the Well), mirroring startDesecrationFlow.
  selectedOmens.forEach((o) => { if (o !== 'abyssal_echoes') engine.recordCurrencyUse(o); });
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
  });
  foreseenSeals = {};
  foreseenHover = null;
  hideForeseenBanner();
  // Committing the foreseen desecration consumes the held bone, so drop the
  // cursor orb too -- otherwise the green Preserved Cranium orb stays glued to
  // the pointer (this path never disarmed, unlike startDesecrationFlow which
  // disarms up front).
  disarmCurrency();
  playSound('desecration');
  triggerCraftAnimation('desecration');
  renderItem(res);
  showRevealPanel();
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
  const before = snapshotState(engine.getItem());
  const result = engine.applyVaal(VAAL_OUTCOME_NUM[key]);
  if (result.success) {
    pushUndo(before);
    engine.recordCurrencyUse('vaal');
    engine.clearHinekoraLock();
    playSound('vaal');
    triggerCraftAnimation('vaal');
    renderItem(result);
    disarmCurrency();
  } else {
    playSound('error');
    triggerErrorAnimation();
    showError(result.error);
  }
  closeCorruptionChoice();
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
  const ABBR = {
    transmutation: 'Trans', augmentation: 'Aug', alchemy: 'Alch', regal: 'Regal',
    exalted: 'Exalt', chaos: 'Chaos', annulment: 'Annul', divine: 'Divine',
    fracturing: 'Frac', vaal: 'Vaal', hinekora: 'Lock',
    preserved_cranium: 'Bone', sinistral_necromancy: 'Sin', dextral_necromancy: 'Dex',
    abyssal_echoes: 'Echo', omen_of_light: 'Light',
    essence_abyss: 'EAby', essence_breach: 'EBrc',
    omen_of_the_sovereign: 'Sov', omen_of_the_liege: 'Lige', omen_of_the_blackblooded: 'Blk',
  };
  const NAMES = {
    preserved_cranium: 'Preserved Cranium', sinistral_necromancy: 'Sinistral Necromancy',
    dextral_necromancy: 'Dextral Necromancy', abyssal_echoes: 'Abyssal Echoes',
    omen_of_light: 'Omen of Light',
    essence_abyss: 'Essence of the Abyss', essence_breach: 'Essence of the Breach',
    omen_of_the_sovereign: 'Omen of the Sovereign', omen_of_the_liege: 'Omen of the Liege', omen_of_the_blackblooded: 'Omen of the Blackblooded',
  };
  const chips = entries
    .map(([k, n]) =>
      `<div class="cc-chip" title="${escapeHtml(NAMES[k] || capitalize(k))}: ${n} used">` +
        `<span class="currency-icon ${k}-icon cc-icon">` +
          `<span class="currency-abbr">${escapeHtml(ABBR[k] || capitalize(k))}</span>` +
        `</span>` +
        `<span class="cc-count">${n}\u00d7</span>` +
      `</div>`)
    .join('');
  elements.craftCounter.style.display = 'block';
  elements.craftCounter.innerHTML =
    `<span class="cc-total">${total} currenc${total === 1 ? 'y' : 'ies'} used</span>` +
    `<div class="cc-chips">${chips}</div>`;
  entries.forEach(([k]) => {
    const iconEl = elements.craftCounter.querySelector(`.cc-icon.${k}-icon`);
    if (iconEl) loadIconInto(iconEl, iconIdForAction(k));
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
  button.disabled = disabled;
  button.classList.toggle('disabled', disabled);
  button.setAttribute('aria-disabled', String(disabled));
  button.title = disabled ? disabledReason : button._forgeBaseTitle;
}

function currencyDisabledReason(currency, item) {
  if (!currency) return 'Unsupported — verification required';
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';

  const base = ORB_VARIANTS[currency] ? ORB_VARIANTS[currency].base : currency;
  const mods = allItemMods(item);
  const removable = removableItemMods(item);
  const rareLimits = engine.getLimits('rare');
  const magicLimits = engine.getLimits('magic');

  switch (base) {
    case 'transmutation':
      return item.rarity === 'normal' ? '' : 'Requires a Normal item.';
    case 'augmentation':
      if (item.rarity !== 'magic') return 'Requires a Magic item.';
      if (magicLimits && item.prefixes.length >= magicLimits.prefixes && item.suffixes.length >= magicLimits.suffixes) {
        return 'Magic item already has its maximum Prefix and Suffix.';
      }
      return '';
    case 'alchemy':
      if (item.rarity !== 'normal' && item.rarity !== 'magic') return 'Requires a Normal or Magic item.';
      return engine.supportsRarity('rare') ? '' : `${item.baseName} cannot be upgraded to Rare.`;
    case 'regal':
      if (item.rarity !== 'magic') return 'Requires a Magic item.';
      return engine.supportsRarity('rare') ? '' : `${item.baseName} cannot be upgraded to Rare.`;
    case 'exalted':
      if (item.rarity !== 'rare') return 'Requires a Rare item.';
      if (!rareLimits) return `${item.baseName} cannot have Rare modifiers.`;
      if (item.prefixes.length >= rareLimits.prefixes && item.suffixes.length >= rareLimits.suffixes) {
        return 'Rare item has no open Prefix or Suffix slot.';
      }
      return '';
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
      if (!removable.length) return 'No removable modifier; fractured and unrevealed modifiers are protected.';
      if (omenOfLightActive && !removable.some(mod => mod.desecrated)) return 'Omen of Light requires a revealed Desecrated modifier.';
      if (selectedCraftOmen === 'sinistral_annulment' && !removableItemMods(item, 'prefix').length) return 'Omen of Sinistral Annulment requires a removable Prefix.';
      if (selectedCraftOmen === 'dextral_annulment' && !removableItemMods(item, 'suffix').length) return 'Omen of Dextral Annulment requires a removable Suffix.';
      return '';
    case 'divine':
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
      return '';
    default:
      return 'Unsupported — verification required';
  }
}

function unsupportedReason() {
  return UNSUPPORTED_REASON;
}

function boneDisabledReason(item) {
  const alreadyDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark);
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';
  if (!desecData) return 'Unsupported — verification required: Desecrated modifier data is unavailable.';
  if (item.rarity !== 'rare') return 'Requires a Rare item.';
  if (alreadyDesecrated) return 'Item already has a Desecrated modifier.';
  return '';
}

function essenceDisabledReason(action, item) {
  if (action !== 'essence_abyss') return UNSUPPORTED_REASON;
  if (item.corrupted) return 'Item is corrupted and cannot be modified.';
  if (item.sanctified) return 'Item is sanctified and cannot be modified further.';
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
  const omen = definition.omenId;
  const removable = removableItemMods(item);

  if (definition.handler === 'toggleOmen') {
    const alreadyDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark);
    const hasRevealedDesecrated = allItemMods(item).some(mod => mod.desecrated && !mod.mark && !mod.unrevealed);
    if (omen === 'omen_of_light') return '';
    if (item.rarity !== 'rare') return 'Requires a Rare item.';
    if (omen === 'abyssal_echoes') {
      return hasRevealedDesecrated ? 'The Desecrated modifier has already been revealed.' : '';
    }
    return alreadyDesecrated ? 'Item already has a Desecrated modifier.' : '';
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
    elements.baseDetailList.hidden = !hasConcreteBase;
    if (hasConcreteBase) {
      const fragment = document.createDocumentFragment();
      if (item.requiredLevel != null && Number.isFinite(Number(item.requiredLevel))) {
        fragment.appendChild(baseDetailRow('Required Level', String(item.requiredLevel)));
      } else {
        fragment.appendChild(baseDetailRow('Required Level', 'Unavailable in normalized source', true));
      }
      if (item.dropLevel != null && Number.isFinite(Number(item.dropLevel))) {
        fragment.appendChild(baseDetailRow('Drop Level', String(item.dropLevel)));
      }
      for (const [key, value] of Object.entries(item.baseProperties || {})) {
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
      line.textContent = implicit.displayText || implicit.key || `Modifier ${implicit.id}`;
      line.dataset.implicitId = implicit.id;
      fragment.appendChild(line);
    }
    elements.implicitList.replaceChildren(fragment);
  }
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

  let heldCurrencyBecameUnavailable = false;
  elements.currencyBtns.forEach(btn => {
    const action = actionForElement(btn);
    const reason = currencyDisabledReason(action, liveItem);
    setCraftButtonState(btn, reason);
    if (reason && armedCurrency === action) heldCurrencyBecameUnavailable = true;
  });
  if (heldCurrencyBecameUnavailable) disarmCurrency();

  // Keep the specialised Desecration controls in sync with their validators.
  // The engine repeats these checks before mutation, so stale UI state cannot
  // bypass the Mark/reveal restrictions.
  elements.boneBtns.forEach(b => {
    const reason = boneDisabledReason(liveItem);
    setCraftButtonState(b, reason);
    if (reason && armedCurrency === actionForElement(b)) disarmCurrency();
  });
  elements.omenBtns.forEach(b => {
    // Omen of Light (Annulment) stays usable even after the item carries a
    // Desecrated modifier. Abyssal Echoes may be armed any time BEFORE the
    // Desecrated modifier is REVEALED: before desecrating, OR after desecrating
    // while the modifier is still unrevealed (pending at the Reveal panel). Once
    // it has actually been revealed at the Well of Souls, the omen can no longer
    // be switched on. A reroll already armed for the current reveal still works.
    const definition = definitionForElement(b);
    const reason = omenDisabledReason(definition, liveItem);
    setCraftButtonState(b, reason);
  });

  // Essence of the Abyss needs a Rare item with a removable modifier, no
  // existing Mark, and no other crafted modifier under the 0.5.x one-crafted-
  // modifier rule.
  if (elements.essenceBtns && elements.essenceBtns.length) {
    elements.essenceBtns.forEach(b => {
      const key = actionForElement(b);
      const reason = essenceDisabledReason(key, liveItem);
      setCraftButtonState(b, reason);
      if (reason && armedCurrency === key) disarmCurrency();
    });
  }

  // Validate each crafting Omen against the side/modifier data its matching
  // currency will need. Disabled titles are the user-facing reason.
  if (elements.craftOmenBtns && elements.craftOmenBtns.length) {
    let selectedBecameUnavailable = false;
    elements.craftOmenBtns.forEach(b => {
      const omen = omenForElement(b);
      const reason = omenDisabledReason(definitionForElement(b), liveItem);
      setCraftButtonState(b, reason);
      if (reason && selectedCraftOmen === omen) selectedBecameUnavailable = true;
    });
    if (selectedBecameUnavailable) clearCraftOmen();
  }

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
  const targetGameVersion = normalizedData?.manifest?.targetGameVersion || null;
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

  // Only mutate the live workbench after all compatibility checks pass.
  currentJewelType = savedPoolId;
  currentSelectablePoolIds = selectablePoolIds;
  currentConcreteBaseId = savedConcreteBase.id;
  if (JEWEL_BASES.has(currentJewelType)) {
    isJewelMode = true;
    currentItemClass = 'Jewel';
    setJewelSelectorVisible(true);
    elements.jewelBtns.forEach(b => b.classList.toggle('active', b.dataset.type === currentJewelType));
  } else {
    isJewelMode = false;
    currentItemClass = saved.categoryLabel || saved.itemClass || 'Item';
    setJewelSelectorVisible(false);
  }

  engine = new CraftingEngine(
    modData,
    currentJewelType,
    desecData,
    buildSourceModifierOverlay(currentJewelType),
    null,
    savedConcreteBase,
  );

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

  engine.loadItem(item, pending);
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
