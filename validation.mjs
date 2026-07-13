#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.join(HERE, 'data', 'bases');

globalThis.window = globalThis;
await import(new URL('./crafting.js', import.meta.url));
const Engine = globalThis.CraftingEngine;

function loadBases() {
  const bases = {};
  for (const file of readdirSync(BASE_DIR).filter(f => f.endsWith('.json')).sort()) {
    bases[file.replace(/\.json$/, '')] = JSON.parse(readFileSync(path.join(BASE_DIR, file), 'utf8'));
  }
  return bases;
}

const bases = loadBases();
const modData = { bases };
const desecratedData = JSON.parse(readFileSync(path.join(HERE, 'data', 'desecrated-mods.json'), 'utf8'));
const normalizedBaseItems = JSON.parse(readFileSync(path.join(HERE, 'data', 'normalized', 'base-items.json'), 'utf8'));
const normalizedModifiers = JSON.parse(readFileSync(path.join(HERE, 'data', 'normalized', 'modifiers.json'), 'utf8'));
const normalizedModifiersById = new Map(normalizedModifiers.modifiers.map(modifier => [modifier.id, modifier]));

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withRandom(random, fn) {
  const original = Math.random;
  Math.random = typeof random === 'function' ? random : mulberry32(random >>> 0);
  try { return fn(); } finally { Math.random = original; }
}

function tier(ilvlReq, weight, value = ilvlReq) {
  return { tier: ilvlReq, ilvlReq, weight, name: `L${ilvlReq}`, modLine: '+{0} test', min: value, max: value };
}

function group(modGroup, tiers) { return { modGroup, tiers }; }

function syntheticBase(prefixCount = 5, suffixCount = 5) {
  return {
    name: 'Synthetic Equipment',
    prefixes: Array.from({ length: prefixCount }, (_, i) => group(`P${i}`, [tier(1, 100)])),
    suffixes: Array.from({ length: suffixCount }, (_, i) => group(`S${i}`, [tier(1, 100)])),
  };
}

function record(modGroup, ilvlReq, extra = {}) {
  return { modGroup, ilvlReq, tier: ilvlReq, displayText: modGroup, fractured: false, ...extra };
}

function rareItem(baseType, prefixes = [], suffixes = []) {
  return {
    schemaVersion: 4,
    rarity: 'rare', baseName: baseType, name: 'Test Item', baseType, jewelType: baseType,
    generatedName: 'Test Item',
    prefixes, suffixes, enchantments: [], corrupted: false, sanctified: false,
    mirrored: false, quality: { amount: 0, type: 'normal', source: null, cap: 20 },
    ilvl: 83, itemLevel: 83, currencyUsed: {}, hinekoraLocked: false,
    sockets: [], socketedContent: [], runes: [], soulCores: [], flags: {},
    desecratedState: null, omenState: null, hinekoraState: null, fracturedMods: [],
  };
}

function concreteAmulet(id, displayName, dropLevel, implicitId) {
  return {
    id,
    metadataKey: `Metadata/Items/Amulets/Test${id}`,
    displayName,
    itemClass: 'Amulet',
    simulatorPoolId: 'amulets',
    requiredLevel: null,
    dropLevel,
    tags: ['amulet', 'default'],
    baseProperties: {},
    implicits: [{
      id: implicitId,
      key: `TestImplicit${implicitId}`,
      stats: [{ id: `test_stat_${implicitId}`, range: [1, 2] }],
      displayText: `Test stat ${implicitId}: 1\u20132`,
    }],
    socketCount: 0,
    targetGameVersion: '0.5.4',
    verificationState: 'fixture',
  };
}

function concreteLimitBase({ id, simulatorPoolId, itemClass, prefixRange, suffixRange }) {
  const stats = [];
  if (prefixRange) stats.push({ id: 'local_maximum_prefixes_allowed_+', range: prefixRange });
  if (suffixRange) stats.push({ id: 'local_maximum_suffixes_allowed_+', range: suffixRange });
  return {
    id,
    sourceId: id,
    metadataKey: `Metadata/Items/${itemClass}/${id}`,
    displayName: `${itemClass} Limit Base ${id}`,
    itemClass,
    simulatorPoolId,
    requiredLevel: null,
    dropLevel: 1,
    tags: [simulatorPoolId, 'default'],
    requirements: {},
    baseProperties: {},
    implicits: [{ id: id + 10000, key: `LimitImplicit${id}`, stats, displayText: 'Limit fixture' }],
    sourceSocketCount: 1,
    targetGameVersion: '0.5.4',
    verificationState: 'fixture',
  };
}

function normalizedConcreteBase(baseItemId, simulatorPoolId) {
  const base = normalizedBaseItems.bases.find(candidate => candidate.id === baseItemId);
  assert(base, `Missing normalized concrete base ${baseItemId}`);
  return {
    id: base.id,
    sourceId: base.id,
    metadataKey: base.metadataKey,
    displayName: base.displayName,
    itemClass: base.itemClass,
    sourceItemClass: base.itemClass,
    equipmentSlot: base.equipmentSlot,
    classId: base.classId,
    modifierPoolClassId: base.modifierPoolClassId,
    simulatorPoolId,
    dropLevel: base.dropLevel,
    tags: base.tags || [],
    requirements: base.requirements || {},
    baseProperties: base.baseProperties || {},
    implicits: (base.implicitModifierIds || []).map(id => {
      const modifier = normalizedModifiersById.get(id);
      assert(modifier, `Missing normalized implicit ${id}`);
      return {
        id,
        key: modifier.key,
        modifierGroupId: modifier.modifierGroupId,
        modifierGroup: modifier.modifierGroup,
        stats: modifier.stats || [],
      };
    }),
    sourceSocketCount: base.socketCount ?? null,
    selectable: !base.unmodifiable,
    targetGameVersion: normalizedBaseItems.targetGameVersion || '0.5.4',
    verificationState: 'normalized-test-fixture',
  };
}

function desecrationTransactionFixture() {
  const baseType = 'desecration_transaction_test';
  const data = { bases: { [baseType]: {
    name: 'Desecration Transaction Test',
    limits: {
      magic: { prefixes: 1, suffixes: 1 },
      rare: { prefixes: 2, suffixes: 2 },
    },
    prefixes: ['P0', 'P1', 'P2', 'P3'].map(name => group(name, [tier(1, 100)])),
    suffixes: ['S0', 'S1', 'S2', 'S3'].map(name => group(name, [tier(1, 100)])),
  } } };
  const makeDesecrated = name => ({
    modGroup: name, name, tier: 'D', weight: 100,
    modLine: '+{0} desecrated test', min: 1, max: 2,
  });
  const desecrated = { bases: { [baseType]: {
    prefixes: ['DP0', 'DP1', 'DP2'].map(makeDesecrated),
    suffixes: ['DS0', 'DS1', 'DS2'].map(makeDesecrated),
  } } };
  return { baseType, data, desecrated };
}

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('compiled browser data exactly matches all source base JSON', () => {
  const context = { window: {} };
  vm.runInNewContext(readFileSync(path.join(HERE, 'data', 'mods.data.js'), 'utf8'), context);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.MOD_BASES)), bases);
});

test('equal-weight fallback pools are explicitly marked unverified', () => {
  const expected = [
    'body_armours_str_dex_int', 'claws', 'daggers', 'flails',
    'one_hand_axes', 'one_hand_swords', 'two_hand_axes', 'two_hand_swords',
  ];
  const observed = Object.entries(bases)
    .filter(([, base]) => {
      const tiers = [...(base.prefixes || []), ...(base.suffixes || [])]
        .flatMap(group => group.tiers || []);
      return tiers.length > 0 && tiers.every(entry => entry.weight === 1);
    })
    .map(([id]) => id)
    .sort();
  assert.deepEqual(observed, expected);
  for (const id of expected) {
    assert.equal(bases[id].weightStatus, 'unverified');
    assert.equal(bases[id].weightSourceVersion, '0.5.4.1.2');
    assert.match(bases[id].weightSource, /^https:\/\//);
    assert.match(bases[id].weightNote, /not verified/i);
  }
});

test('legacy quality state migrates to the structured shape without changing mechanics', () => {
  const data = { bases: { quality_migration_test: syntheticBase() } };
  const engine = new Engine(data, 'quality_migration_test');
  assert.deepEqual(engine.getItem().quality, { amount: 0, type: 'normal', source: null, cap: 20 });

  const legacy = rareItem('quality_migration_test');
  legacy.schemaVersion = 1;
  legacy.quality = 7;
  engine.loadItem(legacy);
  assert.deepEqual(engine.getItem().quality, { amount: 7, type: 'normal', source: null, cap: 20 });

  const structured = rareItem('quality_migration_test');
  structured.quality = { amount: '12', type: 'preserved', source: { id: 'saved-state' } };
  engine.loadItem(structured);
  assert.deepEqual(engine.getItem().quality, {
    amount: 12,
    type: 'preserved',
    source: { id: 'saved-state' },
    cap: null,
  });
});

test('quality state preserves alternate and explicit caps without conflating types', () => {
  const data = { bases: { quality_state_test: syntheticBase() } };
  const engine = new Engine(data, 'quality_state_test');

  const aboveDefault = rareItem('quality_state_test');
  aboveDefault.quality = { amount: 25, type: 'normal', source: { id: 'infuser' } };
  engine.loadItem(aboveDefault);
  assert.deepEqual(engine.getItem().quality, {
    amount: 25, type: 'normal', source: { id: 'infuser' }, cap: null,
  });

  const explicit = rareItem('quality_state_test');
  explicit.quality = { amount: 12, type: 'catalyst', source: { id: 'catalyst' }, cap: 30 };
  engine.loadItem(explicit);
  assert.deepEqual(engine.getItem().quality, explicit.quality);
  assert.throws(() => engine.loadItem({ ...explicit, quality: { ...explicit.quality, cap: 10 } }), /exceeds its verified cap/);
  assert.deepEqual(engine.getItem().quality, explicit.quality);
});

test('verified fixed quality operation enforces target, cap, type, save/load, and atomic failures', () => {
  const skillGemBase = {
    name: 'Synthetic Skill Gem',
    baseTags: ['skill_gem'],
    prefixes: [],
    suffixes: [],
  };
  const data = { bases: { skill_gem: skillGemBase, amulets: syntheticBase() } };
  const engine = new Engine(data, 'skill_gem');
  assert.deepEqual(engine.getItem().quality, { amount: 0, type: 'normal', source: null, cap: 20 });

  assert(engine.applyQualityCurrency('gemcutters_prism').success);
  assert.equal(engine.getItem().quality.amount, 5);
  assert.equal(engine.getItem().quality.cap, 20);
  assert.equal(engine.getItem().quality.source.operationId, 'gemcutters_prism');
  assert(engine.applyQualityCurrency('gemcutters_prism').success);
  assert(engine.applyQualityCurrency('gemcutters_prism').success);
  assert(engine.applyQualityCurrency('gemcutters_prism').success);
  const atCap = engine.applyQualityCurrency('gemcutters_prism');
  assert.equal(atCap.success, false);
  assert.match(atCap.error, /maximum quality/i);
  assert.equal(engine.getItem().quality.amount, 20);

  const saved = JSON.parse(JSON.stringify(engine.getItem()));
  const restored = new Engine(data, 'skill_gem');
  restored.loadItem(saved);
  assert.deepEqual(restored.getItem().quality, saved.quality);

  const alternate = new Engine(data, 'skill_gem');
  const alternateItem = alternate.getItem();
  alternateItem.quality = { amount: 1, type: 'catalyst', source: { id: 'c' }, cap: 20 };
  alternate.loadItem(alternateItem);
  const before = alternate.getItem();
  const incompatible = alternate.applyQualityCurrency('gemcutters_prism');
  assert.equal(incompatible.success, false);
  assert.match(incompatible.error, /cannot replace catalyst/i);
  assert.deepEqual(alternate.getItem(), before);

  const invalidTarget = new Engine(data, 'amulets');
  const invalidBefore = invalidTarget.getItem();
  const invalid = invalidTarget.applyQualityCurrency('gemcutters_prism');
  assert.equal(invalid.success, false);
  assert.match(invalid.error, /requires a Skill Gem/i);
  assert.deepEqual(invalidTarget.getItem(), invalidBefore);
});

test('schema v4 keeps generic concrete-base metadata and item-level aliases distinct', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = {
    ...concreteAmulet(2546, 'Crimson Amulet', 1, 1564),
    sourceId: 'source-2546',
    sourceItemClass: 'Amulet',
    equipmentSlot: 'Amulet',
    classId: 34,
    modifierPoolClassId: 34,
    attributeFamily: 'str',
    variantFamily: 'amulets',
    requirements: { strength: 10 },
    baseProperties: { spirit: 5 },
    sourceSocketCount: 2,
    defaultSockets: null,
    maximumSockets: null,
    sourceVersion: '0.5.4.1.2',
    provenance: { normalizedPath: 'data/normalized/base-items.json' },
  };
  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const item = engine.getItem();

  assert.equal(item.schemaVersion, 4);
  assert.equal(item.baseItemId, 2546);
  assert.equal(item.baseSourceId, 'source-2546');
  assert.equal(item.sourceItemClass, 'Amulet');
  assert.equal(item.equipmentSlot, 'Amulet');
  assert.equal(item.baseClassId, 34);
  assert.equal(item.modifierPoolClassId, 34);
  assert.equal(item.attributeFamily, 'str');
  assert.equal(item.variantFamily, 'amulets');
  assert.deepEqual(item.requirements, { strength: 10 });
  assert.deepEqual(item.baseProperties, { spirit: 5 });
  assert.equal(item.sourceSocketCount, 2);
  assert.equal(item.baseSocketCount, 2);
  assert.equal(item.defaultSockets, null);
  assert.equal(item.maximumSockets, null);
  assert.equal(item.socketCount, undefined);
  assert.equal(item.sourceVersion, '0.5.4.1.2');
  assert.deepEqual(item.baseProvenance, { normalizedPath: 'data/normalized/base-items.json' });
  assert.deepEqual(item.sockets, []);
  assert.deepEqual(item.runes, []);
  assert.deepEqual(item.soulCores, []);
  assert.deepEqual(item.flags, {});
  assert.deepEqual(item.fracturedMods, []);
  assert.equal(item.generatedName, null);
  assert.equal(item.ilvl, 83);
  assert.equal(item.itemLevel, 83);

  engine.setItemLevel(67);
  assert.equal(engine.getItem().ilvl, 67);
  assert.equal(engine.getItem().itemLevel, 67);
  withRandom(() => 0, () => {
    assert(engine.applyTransmutation().success);
    assert(engine.applyRegal().success);
  });
  const rare = engine.getItem();
  assert.equal(rare.name, rare.generatedName);
  assert.notEqual(rare.generatedName, rare.baseName);
});

test('schema v4 migration preserves legacy socket payloads without inventing mechanics', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const engine = new Engine(data, 'amulets', null, null, null, crimson);

  const numericLegacy = rareItem('amulets');
  numericLegacy.schemaVersion = 1;
  numericLegacy.baseItemId = 2546;
  numericLegacy.simulatorPoolId = 'amulets';
  delete numericLegacy.ilvl;
  numericLegacy.itemLevel = 67;
  numericLegacy.quality = 7;
  numericLegacy.sockets = 2;
  delete numericLegacy.socketCount;
  delete numericLegacy.runes;
  delete numericLegacy.soulCores;
  delete numericLegacy.flags;
  engine.loadItem(numericLegacy);
  const migrated = engine.getItem();
  assert.equal(migrated.schemaVersion, 4);
  assert.equal(migrated.ilvl, 67);
  assert.equal(migrated.itemLevel, 67);
  assert.deepEqual(migrated.quality, { amount: 7, type: 'normal', source: null, cap: 20 });
  assert.deepEqual(migrated.sockets, []);
  assert.equal(migrated.socketCount, 2);
  assert.deepEqual(migrated.legacySocketState, {
    count: 2,
    sourceField: 'sockets',
    payload: null,
    status: 'preserved-unverified',
    mechanicsApplied: false,
  });
  assert.deepEqual(migrated.runes, []);
  assert.deepEqual(migrated.soulCores, []);
  assert.deepEqual(migrated.flags, {});
  assert.equal(migrated.generatedName, 'Test Item');
  assert.equal(migrated.implicits[0].id, 1564);

  const opaqueLegacy = rareItem('amulets');
  opaqueLegacy.schemaVersion = 1;
  opaqueLegacy.baseItemId = 2546;
  opaqueLegacy.sockets = { count: 1, contents: ['legacy-rune'] };
  delete opaqueLegacy.socketCount;
  engine.loadItem(opaqueLegacy);
  const opaque = engine.getItem();
  assert.deepEqual(opaque.sockets, []);
  assert.deepEqual(opaque.legacySocketState.payload, { count: 1, contents: ['legacy-rune'] });
  assert.equal(opaque.legacySocketState.status, 'preserved-unverified');
  assert.equal(opaque.legacySocketState.mechanicsApplied, false);
});

test('explicit socket state is deterministic, typed, and atomic on malformed records', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = { ...concreteAmulet(2546, 'Crimson Amulet', 1, 1564), maximumSockets: 2 };
  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const item = rareItem('amulets');
  item.baseItemId = 2546;
  item.simulatorPoolId = 'amulets';
  item.socketState = {
    schemaVersion: 1,
    status: 'verified_fixture',
    slots: [
      { index: 1, state: 'occupied', insertedItemId: 625, insertedItemType: 'Rune', effect: 'test effect', source: { sourceId: 625 } },
      { index: 0, state: 'empty', insertedItemId: null, insertedItemType: null, effect: null, source: null },
    ],
  };
  engine.loadItem(item);
  const state = engine.getSocketState();
  assert.deepEqual(state.slots.map(slot => slot.index), [0, 1]);
  assert.equal(state.currentSockets, 2);
  assert.equal(state.occupiedSockets, 1);
  assert.equal(state.slots[1].insertedItemType, 'Rune');
  assert.deepEqual(engine.getItem().sockets, state.slots);

  const before = engine.getItem();
  assert.throws(() => engine.loadItem({ ...before, socketState: { slots: [{ index: 0, state: 'occupied' }] } }), /must identify its inserted item/i);
  assert.deepEqual(engine.getItem(), before);
  assert.throws(() => engine.loadItem({ ...before, socketState: { slots: [{ index: 0, state: 'empty' }, { index: 0, state: 'empty' }] } }), /duplicate indices/i);
  assert.deepEqual(engine.getItem(), before);

  const unverified = new Engine(data, 'amulets');
  const occupiedWithoutCap = rareItem('amulets');
  occupiedWithoutCap.socketState = {
    slots: [{ index: 0, state: 'occupied', insertedItemId: 625, insertedItemType: 'Rune' }],
  };
  assert.throws(() => unverified.loadItem(occupiedWithoutCap), /verified maximum socket count/i);
});

test('schema migration rejects incompatible state without mutating the live item', () => {
  const data = { bases: { amulets: syntheticBase(), rings: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const before = engine.getItem();

  assert.throws(() => engine.loadItem({ ...before, schemaVersion: 5 }), /newer than supported/);
  assert.throws(() => engine.loadItem({ ...before, simulatorPoolId: 'rings' }), /does not match/);
  assert.throws(() => engine.loadItem({ ...before, baseItemId: 999999 }), /does not match resolved base/);
  assert.throws(() => engine.loadItem({ ...before, targetGameVersion: '0.4.0' }), /targets game version/);
  const invalidSockets = { ...before, schemaVersion: 1, sockets: -1 };
  assert.throws(() => engine.loadItem(invalidSockets), /invalid legacy socket count/);
  assert.deepEqual(engine.getItem(), before);
});

test('concrete bases enforce selectable state and verified socket bounds non-mutatingly', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const disabled = { ...concreteAmulet(2547, 'Disabled Amulet', 1, 1565), selectable: false, disabledReason: 'Fixture base is unmodifiable.' };
  assert.throws(() => new Engine(data, 'amulets', null, null, null, disabled), /Fixture base is unmodifiable/);

  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const before = engine.getItem();
  assert.throws(() => engine.setConcreteBase(disabled), /Fixture base is unmodifiable/);
  assert.deepEqual(engine.getItem(), before);
  assert.throws(
    () => engine.setConcreteBase({ ...crimson, defaultSockets: 2, maximumSockets: 1 }),
    /default sockets above its maximum/
  );
  assert.deepEqual(engine.getItem(), before);
});

test('fixed concrete implicit stats adjust Amulet and Ring affix capacity only', () => {
  const data = { bases: { amulets: syntheticBase(8, 8), rings: syntheticBase(8, 8) } };
  const amuletBase = concreteLimitBase({
    id: 7001, simulatorPoolId: 'amulets', itemClass: 'Amulet',
    prefixRange: [1, 1], suffixRange: [-1, -1],
  });
  const amulet = new Engine(data, 'amulets', null, null, null, amuletBase);
  assert.deepEqual(amulet.getLimits('magic'), { prefixes: 2, suffixes: 0 });
  assert.deepEqual(amulet.getLimits('rare'), { prefixes: 4, suffixes: 2 });
  const fullAmulet = rareItem('amulets',
    [0, 1, 2, 3].map(i => record(`P${i}`, 1)),
    [0, 1].map(i => record(`S${i}`, 1)));
  amulet.loadItem(fullAmulet);
  assert.equal(amulet.applyExalted().success, false);

  const ringBase = concreteLimitBase({
    id: 7002, simulatorPoolId: 'rings', itemClass: 'Ring',
    prefixRange: [-2, -2], suffixRange: [2, 2],
  });
  const ring = new Engine(data, 'rings', null, null, null, ringBase);
  assert.deepEqual(ring.getLimits('magic'), { prefixes: 0, suffixes: 3 });
  assert.deepEqual(ring.getLimits('rare'), { prefixes: 1, suffixes: 5 });
  const fullRing = rareItem('rings',
    [record('P0', 1)],
    [0, 1, 2, 3, 4].map(i => record(`S${i}`, 1)));
  ring.loadItem(fullRing);
  assert.equal(ring.applyExalted().success, false);

  const variableBase = concreteLimitBase({
    id: 7003, simulatorPoolId: 'rings', itemClass: 'Ring',
    prefixRange: [1, 2], suffixRange: [-2, -1],
  });
  const variable = new Engine(data, 'rings', null, null, null, variableBase);
  assert.deepEqual(variable.getLimits('magic'), { prefixes: 1, suffixes: 1 });
  assert.deepEqual(variable.getLimits('rare'), { prefixes: 3, suffixes: 3 });
  assert.deepEqual(Engine.LIMITS, {
    magic: { prefixes: 1, suffixes: 1 },
    rare: { prefixes: 3, suffixes: 3 },
  });
});

test('Absent Amulet Transmutation is a successful zero-affix transition and Regal adds exactly one modifier', () => {
  const absent = normalizedConcreteBase(2563, 'amulets');
  assert.equal(absent.displayName, 'Absent Amulet');
  let randomCalls = 0;
  const engine = new Engine(modData, 'amulets', null, null, null, absent, () => {
    randomCalls++;
    return 0;
  });
  assert.deepEqual(engine.getLimits('magic'), { prefixes: 0, suffixes: 0 });
  assert.deepEqual(engine.getLimits('rare'), { prefixes: 2, suffixes: 2 });

  const transmutation = engine.applyTransmutation();
  assert.equal(transmutation.success, true);
  assert.equal(transmutation.action, 'transform');
  assert.deepEqual(transmutation.addedMods, []);
  assert.equal(transmutation.previousRarity, 'normal');
  assert.equal(transmutation.item.rarity, 'magic');
  assert.equal(transmutation.item.prefixes.length, 0);
  assert.equal(transmutation.item.suffixes.length, 0);
  assert.equal(randomCalls, 0, 'a zero-capacity transition must not consume crafting RNG');

  engine.recordCurrencyUse('transmutation');
  const zeroModifierMagic = engine.getItem();
  assert.equal(zeroModifierMagic.currencyUsed.transmutation, 1);

  const restored = new Engine(modData, 'amulets', null, null, null, absent, () => 0);
  restored.loadItem(JSON.parse(JSON.stringify(zeroModifierMagic)));
  assert.deepEqual(restored.getItem(), zeroModifierMagic, 'stash-style serialization must preserve zero-modifier Magic state');

  const beforeAugmentation = restored.getItem();
  const augmentation = restored.applyAugmentation();
  assert.equal(augmentation.success, false);
  assert.equal(augmentation.error, 'This base has 0 available Magic affix slots.');
  assert.deepEqual(restored.getItem(), beforeAugmentation, 'blocked Augmentation must be atomic');

  const regal = restored.applyRegal();
  assert.equal(regal.success, true);
  assert.equal(regal.item.rarity, 'rare');
  assert.equal(regal.addedMods.length, 1);
  assert.equal(regal.item.prefixes.length + regal.item.suffixes.length, 1);
  assert.deepEqual(restored.getLimits('rare'), { prefixes: 2, suffixes: 2 });
});

test('zero-affix Transmutation remains deterministic through Hinekora-style preview and commit', () => {
  const absent = normalizedConcreteBase(2563, 'amulets');
  let randomCalls = 0;
  const engine = new Engine(modData, 'amulets', null, null, null, absent, () => {
    randomCalls++;
    return 0.75;
  });
  engine.setHinekoraLock();
  const locked = engine.getItem();
  const preview = engine.applyTransmutation();
  const previewItem = engine.getItem();
  engine.loadItem(locked);
  const commit = engine.applyTransmutation();
  assert.equal(preview.success, true);
  assert.equal(commit.success, true);
  assert.deepEqual(commit.item, previewItem);
  assert.equal(randomCalls, 0);
});

test('one-sided Magic capacity still forces Transmutation onto its available affix side', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const cases = [
    { prefixRange: [-1, -1], suffixRange: null, expectedType: 'suffix' },
    { prefixRange: null, suffixRange: [-1, -1], expectedType: 'prefix' },
  ];
  for (const [index, fixture] of cases.entries()) {
    const base = concreteLimitBase({
      id: 7100 + index,
      simulatorPoolId: 'amulets',
      itemClass: 'Amulet',
      prefixRange: fixture.prefixRange,
      suffixRange: fixture.suffixRange,
    });
    const engine = new Engine(data, 'amulets', null, null, null, base, () => 0);
    const result = engine.applyTransmutation();
    assert.equal(result.success, true);
    assert.equal(result.addedMods.length, 1);
    assert.equal(result.addedMods[0].type, fixture.expectedType);
  }
});

test('positive Magic capacity with no eligible modifier still fails Transmutation atomically', () => {
  const data = { bases: { gated: {
    name: 'Gated Base',
    prefixes: [group('HighLevelOnly', [tier(80, 100)])],
    suffixes: [],
  } } };
  const engine = new Engine(data, 'gated', null, null, null, null, () => 0);
  engine.setItemLevel(1);
  assert.deepEqual(engine.getLimits('magic'), { prefixes: 1, suffixes: 1 });
  const before = engine.getItem();
  const result = engine.applyTransmutation();
  assert.equal(result.success, false);
  assert.match(result.error, /No eligible mods available/);
  assert.deepEqual(engine.getItem(), before);
});

test('concrete Amulet identity remains separate from the simulator pool', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const azure = concreteAmulet(2547, 'Azure Amulet', 1, 1565);
  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const initial = engine.getItem();

  assert.equal(initial.schemaVersion, 4);
  assert.equal(initial.baseType, 'amulets');
  assert.equal(initial.jewelType, 'amulets');
  assert.equal(initial.simulatorPoolId, 'amulets');
  assert.equal(initial.baseItemId, 2546);
  assert.equal(initial.baseName, 'Crimson Amulet');
  assert.equal(initial.name, 'Crimson Amulet');
  assert.equal(initial.itemClass, 'Amulet');
  assert.equal(initial.requiredLevel, null);
  assert.equal(initial.dropLevel, 1);
  assert.deepEqual(initial.baseTags, ['amulet', 'default']);
  assert.equal(initial.baseSocketCount, 0);
  assert.equal(initial.implicits[0].id, 1564);
  assert(engine.isFreshItem());

  engine.setItemLevel(71);
  engine.setConcreteBase(azure, { resetItem: true, preserveItemLevel: true });
  const switched = engine.getItem();
  assert.equal(switched.ilvl, 71);
  assert.equal(switched.baseItemId, 2547);
  assert.equal(switched.baseName, 'Azure Amulet');
  assert.equal(switched.simulatorPoolId, 'amulets');
  assert.equal(switched.implicits[0].id, 1565);
  assert(engine.isFreshItem());

  const beforeMismatch = engine.getItem();
  assert.throws(() => engine.setConcreteBase({ ...crimson, simulatorPoolId: 'rings' }), /does not map/);
  assert.deepEqual(engine.getItem(), beforeMismatch);
});

test('concrete implicits survive ordinary affix crafting and reset', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const engine = new Engine(data, 'amulets', null, null, null, crimson);
  const result = withRandom(() => 0, () => engine.applyTransmutation());
  assert(result.success);
  assert.equal(engine.isFreshItem(), false);
  assert.equal(engine.getItem().implicits[0].id, 1564);
  assert.equal(engine.getItem().prefixes.length + engine.getItem().suffixes.length, 1);

  const serialized = JSON.parse(JSON.stringify(engine.getItem()));
  const restored = new Engine(data, 'amulets', null, null, null, crimson);
  restored.loadItem(serialized);
  assert.deepEqual(restored.getItem(), serialized);
  restored.resetItem();
  assert.equal(restored.getItem().baseItemId, 2546);
  assert.equal(restored.getItem().baseName, 'Crimson Amulet');
  assert.equal(restored.getItem().implicits[0].id, 1564);
  assert(restored.isFreshItem());
});

test('reset rebuilds item-level candidate pools for the reset item', () => {
  const data = { bases: { reset_pool_test: {
    name: 'Reset Pool Test',
    prefixes: [group('LevelGate', [tier(80, 100), tier(1, 100)])],
    suffixes: [],
  } } };
  const engine = new Engine(data, 'reset_pool_test');
  engine.setItemLevel(1);
  assert.deepEqual(engine._prefixCandidates.map(candidate => candidate.tier.ilvlReq), [1]);
  engine.resetItem();
  assert.equal(engine.getItem().ilvl, 83);
  assert.deepEqual(engine._prefixCandidates.map(candidate => candidate.tier.ilvlReq), [80, 1]);
});

test('fresh-item detection includes irreversible and special item state', () => {
  const data = { bases: { amulets: syntheticBase() } };
  const crimson = concreteAmulet(2546, 'Crimson Amulet', 1, 1564);
  const make = () => new Engine(data, 'amulets', null, null, null, crimson);
  const cases = [
    item => { item.rarity = 'magic'; },
    item => { item.prefixes.push(record('P0', 1)); },
    item => { item.enchantments.push('Test enchantment'); },
    item => { item.quality.amount = 1; },
    item => { item.quality.type = 'catalyst'; },
    item => { item.quality.source = { id: 'test-source' }; },
    item => { item.sockets = [{ index: 0, state: 'empty', insertedItemId: null, insertedItemType: null }]; },
    item => { item.socketCount = 1; },
    item => { item.legacySocketState = { status: 'preserved-unverified', payload: { count: 1 } }; },
    item => { item.socketedContent = { 0: 'test-rune' }; },
    item => { item.corrupted = true; },
    item => { item.sanctified = true; },
    item => { item.hinekoraLocked = true; },
    item => { item.currencyUsed.transmutation = 1; },
    item => { item.flags = { special: true }; },
  ];
  for (const mutate of cases) {
    const engine = make();
    const item = engine.getItem();
    mutate(item);
    engine.loadItem(item);
    assert.equal(engine.isFreshItem(), false);
  }

  const legacy = new Engine({ bases: { ruby: syntheticBase() } }, 'ruby');
  assert.equal(legacy.getItem().baseItemId, undefined);
  assert.equal(legacy.getItem().baseName, 'Synthetic Equipment');
  assert(legacy.isFreshItem());
});

test('same Amulet base filters monotonically across several item levels', () => {
  const counts = [];
  for (const level of [1, 20, 40, 60, 83]) {
    const engine = new Engine(modData, 'amulets', desecratedData);
    engine.setItemLevel(level);
    const candidates = [...engine._prefixCandidates, ...engine._suffixCandidates];
    assert(candidates.length > 0);
    assert(candidates.every(c => c.tier.ilvlReq <= level));
    counts.push(candidates.length);
  }
  assert.deepEqual(counts, [...counts].sort((a, b) => a - b));
});

test('low-item-level base cannot roll a high-level tier', () => {
  const data = { bases: { low_test: {
    name: 'Low Test',
    prefixes: [group('LevelGate', [tier(80, 10000), tier(20, 1000), tier(1, 100)])],
    suffixes: [],
  } } };
  withRandom(91, () => {
    for (let i = 0; i < 250; i++) {
      const engine = new Engine(data, 'low_test');
      engine.setItemLevel(10);
      const result = engine.applyTransmutation();
      assert(result.success);
      assert(result.addedMods[0].ilvlReq <= 10);
    }
  });
});

test('ordinary equipment fills to three prefixes and three suffixes', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  withRandom(7, () => {
    const engine = new Engine(data, 'test_equipment');
    assert(engine.applyAlchemy().success);
    while (engine.applyExalted().success) { /* fill every open slot */ }
    const item = engine.getItem();
    assert.equal(item.prefixes.length, 3);
    assert.equal(item.suffixes.length, 3);
  });
});

test('jewels remain capped at two prefixes and two suffixes', () => {
  const data = { bases: { ruby: syntheticBase() } };
  withRandom(8, () => {
    const engine = new Engine(data, 'ruby');
    assert(engine.applyAlchemy().success);
    while (engine.applyExalted().success) { /* fill every open slot */ }
    const item = engine.getItem();
    assert.equal(item.prefixes.length, 2);
    assert.equal(item.suffixes.length, 2);
  });
});

test('flasks and charms reject Rare upgrades but still craft as Magic', () => {
  const data = { bases: { life_flasks: syntheticBase() } };
  const engine = new Engine(data, 'life_flasks');
  assert.equal(engine.applyAlchemy().success, false);
  assert(engine.applyTransmutation().success);
  assert(engine.applyAugmentation().success);
  assert.equal(engine.applyRegal().success, false);
  assert.equal(engine.getItem().rarity, 'magic');
});

test('Alchemy produces exactly four fresh modifiers', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  withRandom(() => 0, () => {
    const engine = new Engine(data, 'test_equipment');
    const result = engine.applyAlchemy();
    assert(result.success);
    assert.equal(result.item.prefixes.length + result.item.suffixes.length, 4);
  });
});

test('core rarity constraints reject invalid Alchemy, Annulment, and Divine uses atomically', () => {
  const data = { bases: { test_equipment: syntheticBase() } };

  const magic = new Engine(data, 'test_equipment');
  assert(magic.applyTransmutation().success);
  const magicBefore = magic.getItem();
  const alchemy = magic.applyAlchemy();
  assert.equal(alchemy.success, false);
  assert.match(alchemy.error, /Normal items/i);
  assert.deepEqual(magic.getItem(), magicBefore);

  const normal = new Engine(data, 'test_equipment');
  const normalBefore = normal.getItem();
  assert.equal(normal.applyAnnulment().success, false);
  assert.equal(normal.applyDivine().success, false);
  assert.deepEqual(normal.getItem(), normalBefore);
});

test('mirrored items reject every core mutation and item-level changes', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const operations = [
    engine => engine.applyTransmutation(),
    engine => engine.applyAlchemy(),
    engine => engine.applyAnnulment(),
    engine => engine.applyDivine(),
    engine => engine.applyFracturing(),
    engine => engine.applyEssenceOfAbyss(),
  ];
  for (const operation of operations) {
    const engine = new Engine(data, 'test_equipment');
    const item = engine.getItem();
    item.mirrored = true;
    engine.loadItem(item);
    const before = engine.getItem();
    const result = operation(engine);
    assert.equal(result.success, false);
    assert.match(result.error, /mirrored/i);
    assert.deepEqual(engine.getItem(), before);
  }
  const levelEngine = new Engine(data, 'test_equipment');
  const levelItem = levelEngine.getItem();
  levelItem.mirrored = true;
  levelEngine.loadItem(levelItem);
  assert.equal(levelEngine.setItemLevel(12), 83);
  assert.equal(levelEngine.getItem().ilvl, 83);
});

test('blocked Vaal is atomic and consumes no injected RNG', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  let calls = 0;
  const engine = new Engine(data, 'test_equipment', null, null, null, null, () => { calls++; return 0; });
  const before = engine.getItem();
  const result = engine.applyVaal();
  assert.equal(result.success, false);
  assert.match(result.error, /Vaal Orb outcomes and probabilities/i);
  assert.equal(calls, 0);
  assert.deepEqual(engine.getItem(), before);
});

test('a full prefix or suffix side forces Exalted onto the open side', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const prefixesFull = new Engine(data, 'test_equipment');
  prefixesFull.loadItem(rareItem('test_equipment', [record('P0', 1), record('P1', 1), record('P2', 1)], []));
  assert.equal(prefixesFull.applyExalted().addedMods[0].type, 'suffix');

  const suffixesFull = new Engine(data, 'test_equipment');
  suffixesFull.loadItem(rareItem('test_equipment', [], [record('S0', 1), record('S1', 1), record('S2', 1)]));
  assert.equal(suffixesFull.applyExalted().addedMods[0].type, 'prefix');
});

test('fractured modifiers survive Chaos and remain group blockers', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const engine = new Engine(data, 'test_equipment');
  engine.loadItem(rareItem('test_equipment', [record('P0', 1, { fractured: true }), record('P1', 20)], [record('S0', 60)]));
  const result = withRandom(() => 0, () => engine.applyChaos('whittling'));
  assert(result.success);
  assert.equal(result.removedMods[0].modGroup, 'P1');
  assert(engine.getItem().prefixes.concat(engine.getItem().suffixes).some(m => m.modGroup === 'P0' && m.fractured));
  assert(!engine._eligibleCandidates('prefix', engine._existingGroups()).some(c => c.group.modGroup === 'P0'));
});

test('Omen of Whittling uses modifier level and randomises equal-lowest ties', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const make = () => {
    const engine = new Engine(data, 'test_equipment');
    engine.loadItem(rareItem('test_equipment', [record('P0', 20), record('P1', 20)], [record('S0', 60)]));
    return engine;
  };
  const first = withRandom(() => 0, () => make().applyChaos('whittling').removedMods[0].modGroup);
  const second = withRandom(() => 0.999999, () => make().applyChaos('whittling').removedMods[0].modGroup);
  assert.equal(first, 'P0');
  assert.equal(second, 'P1');
});

test('Desecration rejects unknown Bones and incompatible directional Omen combinations atomically', () => {
  const fixture = desecrationTransactionFixture();
  const engine = new Engine(fixture.data, fixture.baseType, fixture.desecrated);
  engine.loadItem(rareItem(fixture.baseType, [record('P0', 1)], [record('S0', 1)]));
  const before = engine.getItem();
  const unknownBone = engine.startDesecration({ bone: 'gnawed_jawbone' });
  assert.equal(unknownBone.success, false);
  assert.match(unknownBone.error, /Unsupported Abyssal Bone/i);
  assert.deepEqual(engine.getItem(), before);

  const incompatible = engine.startDesecration({
    bone: 'preserved_cranium',
    omens: ['sinistral_necromancy', 'dextral_necromancy'],
  });
  assert.equal(incompatible.success, false);
  assert.match(incompatible.error, /cannot be combined/i);
  assert.deepEqual(engine.getItem(), before);
  assert.equal(engine.getPendingDesecration(), null);

  const nonJewel = new Engine(fixture.data, fixture.baseType, fixture.desecrated);
  const amulet = rareItem(fixture.baseType, [record('P0', 1)], [record('S0', 1)]);
  amulet.itemClass = 'Amulet';
  nonJewel.loadItem(amulet);
  const nonJewelBefore = nonJewel.getItem();
  const nonJewelResult = nonJewel.startDesecration({ bone: 'preserved_cranium' });
  assert.equal(nonJewelResult.success, false);
  assert.match(nonJewelResult.error, /only applicable to a Jewel/i);
  assert.deepEqual(nonJewel.getItem(), nonJewelBefore);
});

test('modifier groups are mutually exclusive across both affix sides', () => {
  const shared = group('SharedFamily', [tier(60, 100), tier(1, 100)]);
  const data = { bases: { group_test: { name: 'Group Test', prefixes: [shared], suffixes: [shared, group('Other', [tier(1, 100)])] } } };
  const engine = new Engine(data, 'group_test');
  engine.loadItem(rareItem('group_test', [record('SharedFamily', 60)], []));
  assert(!engine._eligibleCandidates('prefix', engine._existingGroups()).some(c => c.group.modGroup === 'SharedFamily'));
  assert(!engine._eligibleCandidates('suffix', engine._existingGroups()).some(c => c.group.modGroup === 'SharedFamily'));
});

test('Well of Souls excludes modifiers that conflict with existing groups', () => {
  const data = { bases: { desecration_group_test: {
    name: 'Desecration Group Test',
    prefixes: [group('SharedFamily', [tier(1, 100)]), group('OrdinaryFresh', [tier(1, 100)])],
    suffixes: [group('SuffixFresh', [tier(1, 100)])],
  } } };
  const desecrated = { bases: { desecration_group_test: {
    prefixes: [
      { modGroup: 'SharedFamily', weight: 100, modLine: '+{0} conflict', min: 1, max: 1 },
      { modGroup: 'DesecratedFresh', weight: 100, modLine: '+{0} fresh', min: 1, max: 1 },
    ],
    suffixes: [],
  } } };
  const engine = new Engine(data, 'desecration_group_test', desecrated);
  engine.loadItem(rareItem('desecration_group_test', [record('SharedFamily', 1)], []));
  const started = withRandom(() => 0, () => engine.startDesecration({
    bone: 'preserved_cranium',
    omen: 'sinistral_necromancy',
  }));
  assert(started.success);
  assert(started.options.length > 0);
  assert(!started.options.some(option => option.modGroup === 'SharedFamily'));
  assert(engine.chooseDesecratedMod(0).success);
  const groups = engine.getItem().prefixes.concat(engine.getItem().suffixes).map(mod => mod.modGroup);
  assert.equal(groups.length, new Set(groups).size);
});

test('cancelling Desecration removes added placeholders and restores replaced modifiers', () => {
  const { baseType, data, desecrated } = desecrationTransactionFixture();

  const addEngine = new Engine(data, baseType, desecrated);
  const addBefore = rareItem(baseType, [record('P0', 1)], [record('S0', 1)]);
  addEngine.loadItem(addBefore);
  const added = withRandom(() => 0, () => addEngine.startDesecration({
    bone: 'preserved_cranium', omen: 'sinistral_necromancy',
  }));
  assert(added.success);
  assert.equal(added.mode, 'add');
  assert(addEngine.getItem().prefixes.some(mod => mod.modGroup === '__desecrated_pending__'));
  assert(addEngine.cancelDesecration().success);
  assert.deepEqual(addEngine.getItem(), addBefore);
  assert.equal(addEngine.getPendingDesecration(), null);

  const replaceEngine = new Engine(data, baseType, desecrated);
  const replaceBefore = rareItem(baseType, [record('P0', 1), record('P1', 1)], [record('S0', 1)]);
  replaceEngine.loadItem(replaceBefore);
  const replaced = withRandom(() => 0, () => replaceEngine.startDesecration({
    bone: 'preserved_cranium', omen: 'sinistral_necromancy',
  }));
  assert(replaced.success);
  assert.equal(replaced.mode, 'replace');
  assert.equal(replaced.removedMods[0].modGroup, 'P0');
  assert(replaceEngine.cancelDesecration().success);
  assert.deepEqual(replaceEngine.getItem(), replaceBefore);
  assert.equal(replaceEngine.getPendingDesecration(), null);
});

test('cancelling Desecration restores a consumed Mark of the Abyssal Lord', () => {
  const { baseType, data, desecrated } = desecrationTransactionFixture();
  const engine = new Engine(data, baseType, desecrated);
  engine.loadItem(rareItem(baseType, [record('P0', 1)], [record('S0', 1)]));
  assert(withRandom(() => 0, () => engine.applyEssenceOfAbyss()).success);
  const beforeDesecration = engine.getItem();
  assert(beforeDesecration.prefixes.concat(beforeDesecration.suffixes).some(mod => mod.mark && mod.crafted));

  const started = withRandom(() => 0, () => engine.startDesecration({ bone: 'preserved_cranium' }));
  assert(started.success);
  assert(!engine.getItem().prefixes.concat(engine.getItem().suffixes).some(mod => mod.mark));
  assert(engine.cancelDesecration().success);
  assert.deepEqual(engine.getItem(), beforeDesecration);
});

test('Desecration rerolls are enforced and decremented by the engine', () => {
  const { baseType, data, desecrated } = desecrationTransactionFixture();
  const engine = new Engine(data, baseType, desecrated);
  engine.loadItem(rareItem(baseType, [record('P0', 1)], [record('S0', 1)]));
  const started = withRandom(0xdec0de, () => engine.startDesecration({
    bone: 'preserved_cranium',
    omens: ['sinistral_necromancy', 'abyssal_echoes'],
  }));
  assert(started.success);
  assert.equal(engine.getPendingDesecration().rerollsLeft, 1);

  const first = withRandom(0xdec0df, () => engine.rerollDesecration());
  assert(first.success);
  assert.equal(first.rerollsLeft, 0);
  const afterFirst = engine.getPendingDesecration();
  assert.equal(afterFirst.rerollsLeft, 0);

  const second = engine.rerollDesecration();
  assert.equal(second.success, false);
  assert.match(second.error, /no desecration rerolls remaining/i);
  assert.deepEqual(engine.getPendingDesecration(), afterFirst);

  const noEchoes = new Engine(data, baseType, desecrated);
  noEchoes.loadItem(rareItem(baseType, [record('P0', 1)], [record('S0', 1)]));
  assert(withRandom(() => 0, () => noEchoes.startDesecration({
    bone: 'preserved_cranium', omen: 'sinistral_necromancy',
  })).success);
  assert.equal(noEchoes.rerollDesecration().success, false);
});

test('weights produce the expected 1:3 selection ratio', () => {
  const data = { bases: { weight_test: {
    name: 'Weight Test',
    prefixes: [group('Light', [tier(1, 100)]), group('Heavy', [tier(1, 300)])],
    suffixes: [],
  } } };
  const counts = { Light: 0, Heavy: 0 };
  withRandom(0x504054, () => {
    for (let i = 0; i < 12000; i++) {
      const result = new Engine(data, 'weight_test').applyTransmutation();
      counts[result.addedMods[0].modGroup]++;
    }
  });
  const heavyShare = counts.Heavy / (counts.Light + counts.Heavy);
  assert(Math.abs(heavyShare - 0.75) < 0.025, `heavy share was ${heavyShare}`);
});

test('crafting RNG is injectable without changing the default Math.random contract', () => {
  const data = { bases: { rng_test: syntheticBase() } };
  const low = new Engine(data, 'rng_test', null, null, null, null, () => 0);
  const high = new Engine(data, 'rng_test', null, null, null, null, () => 0.999999);
  const weighted = [{ weight: 1 }, { weight: 3 }];
  assert.equal(low._weightedIndex(weighted), 0);
  assert.equal(high._weightedIndex(weighted), 1);
  const invalid = new Engine(data, 'rng_test', null, null, null, null, () => Number.NaN);
  assert.throws(() => invalid._randomInt(1, 2), /RNG returned a non-finite value/);
  const switched = new Engine(data, 'rng_test');
  assert.equal(switched.setRandomSource(() => 0), switched);
  assert.equal(switched._weightedIndex(weighted), 0);
  switched.setRandomSource(() => 0.999999);
  assert.equal(switched._weightedIndex(weighted), 1);
  assert.throws(() => switched.setRandomSource('not-a-function'), /RNG must be a function or null/);
});

test('repeated currency applications have deterministic parity with manual reselection', () => {
  const data = { bases: { repeat_test: syntheticBase(8, 8) } };
  const run = () => {
    const engine = new Engine(data, 'repeat_test', null, null, null, null, mulberry32(0x571c4));
    assert(engine.applyTransmutation().success);
    assert(engine.applyRegal().success);
    for (let i = 0; i < 5; i++) assert(engine.applyChaos().success);
    return engine.getItem();
  };
  // Arming/reselecting is UI state only. One sticky item click must dispatch
  // the same single engine call and consume the same RNG as manual reselection.
  assert.deepEqual(run(), run());
});

test('zero-weight modifier tiers are excluded even at random roll zero', () => {
  const data = { bases: { weight_test: {
    name: 'Weight Test',
    prefixes: [group('Impossible', [tier(1, 0)]), group('Eligible', [tier(1, 100)])],
    suffixes: [],
  } } };
  const engine = new Engine(data, 'weight_test');
  assert(!engine._prefixCandidates.some(candidate => candidate.group.modGroup === 'Impossible'));
  const result = withRandom(() => 0, () => engine.applyTransmutation());
  assert(result.success);
  assert.equal(result.addedMods[0].modGroup, 'Eligible');
});

test('normalized source weights and stable modifier identity are applied', () => {
  const data = { bases: { overlay_test: {
    name: 'Overlay Test',
    baseTags: ['ring'],
    prefixes: [group('Blocked', [tier(1, 9999)]), group('Eligible', [tier(1, 1)])],
    suffixes: [],
  } } };
  const overlay = new Map([
    ['prefix|Blocked|1', {
      stableModifierId: 1001, sourceModifierKey: 'BlockedBySourceWeight', sourceModifierGroupId: 51,
      spawnWeight: 0, modifierTags: ['attack'], requiredTags: [], forbiddenTags: [], weightConditions: [],
    }],
    ['prefix|Eligible|1', {
      stableModifierId: 1002, sourceModifierKey: 'EligibleBySourceWeight', sourceModifierGroupId: 52,
      spawnWeight: 250, modifierTags: ['caster'], requiredTags: ['ring'], forbiddenTags: [], weightConditions: [],
    }],
  ]);
  const engine = new Engine(data, 'overlay_test', null, overlay);
  assert(!engine._prefixCandidates.some(candidate => candidate.group.modGroup === 'Blocked'));
  const result = withRandom(() => 0, () => engine.applyTransmutation());
  assert(result.success);
  assert.equal(result.addedMods[0].stableModifierId, 1002);
  assert.equal(result.addedMods[0].sourceModifierKey, 'EligibleBySourceWeight');
  assert.equal(result.addedMods[0].sourceModifierGroupId, 52);
  assert.deepEqual(result.addedMods[0].modifierTags, ['caster']);
});

test('source tag restrictions and stable modifier-group conflicts are enforced', () => {
  const data = { bases: { source_group_test: {
    name: 'Source Group Test',
    baseTags: ['ring'],
    prefixes: [group('VisiblePrefixName', [tier(1, 100)])],
    suffixes: [group('DifferentVisibleSuffixName', [tier(1, 100)]), group('ForbiddenOnRings', [tier(1, 100)])],
  } } };
  const overlay = new Map([
    ['prefix|VisiblePrefixName|1', { stableModifierId: 2001, sourceModifierGroupId: 77, spawnWeight: 100 }],
    ['suffix|DifferentVisibleSuffixName|1', { stableModifierId: 2002, sourceModifierGroupId: 77, spawnWeight: 100 }],
    ['suffix|ForbiddenOnRings|1', { stableModifierId: 2003, sourceModifierGroupId: 78, spawnWeight: 100, forbiddenTags: ['ring'] }],
  ]);
  const engine = new Engine(data, 'source_group_test', null, overlay);
  engine.loadItem(rareItem('source_group_test', [record('VisiblePrefixName', 1, { sourceModifierGroupId: 77 })], []));
  const eligible = engine._eligibleCandidates('suffix', engine._existingGroups());
  assert(!eligible.some(candidate => candidate.group.modGroup === 'DifferentVisibleSuffixName'));
  assert(!eligible.some(candidate => candidate.group.modGroup === 'ForbiddenOnRings'));
});

test('Chaos and Whittling roll back when no eligible replacement exists', () => {
  const data = { bases: { no_replacement: { name: 'No Replacement', prefixes: [], suffixes: [] } } };
  for (const omen of [null, 'whittling']) {
    const engine = new Engine(data, 'no_replacement');
    const before = rareItem('no_replacement', [record('Existing', 20)], []);
    engine.loadItem(before);
    const result = engine.applyChaos(omen);
    assert.equal(result.success, false);
    assert.match(result.error, /no eligible replacement/i);
    assert.deepEqual(engine.getItem(), before);
  }
});

test('Whittling refuses unknown modifier levels without mutating the item', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const engine = new Engine(data, 'test_equipment');
  const before = rareItem('test_equipment', [record('P0', 20)], [record('Unknown', 'D', { ilvlReq: undefined, tier: 'D', desecrated: true })]);
  engine.loadItem(before);
  const result = engine.applyChaos('whittling');
  assert.equal(result.success, false);
  assert.match(result.error, /^Unsupported — verification required/);
  assert.deepEqual(engine.getItem(), before);
});

test('Essence of the Abyss creates one crafted Mark and respects the crafted-modifier limit', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const first = new Engine(data, 'test_equipment');
  first.loadItem(rareItem('test_equipment', [record('P0', 1)], [record('S0', 1)]));
  const applied = withRandom(() => 0, () => first.applyEssenceOfAbyss());
  assert(applied.success);
  const mark = first.getItem().prefixes.concat(first.getItem().suffixes).find(mod => mod.mark);
  assert(mark && mark.crafted);

  const blocked = new Engine(data, 'test_equipment');
  const withCrafted = rareItem('test_equipment', [record('P0', 1, { crafted: true })], [record('S0', 1)]);
  blocked.loadItem(withCrafted);
  const result = blocked.applyEssenceOfAbyss();
  assert.equal(result.success, false);
  assert.match(result.error, /maximum of one crafted modifier/);
  assert.deepEqual(blocked.getItem(), withCrafted);
});

test('Essence of the Abyss rejects Jewel, Flask, and Charm targets when class metadata is present', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  for (const itemClass of ['Jewel', 'Flask', 'Charm']) {
    const engine = new Engine(data, 'test_equipment');
    const item = engine.getItem();
    item.rarity = 'rare';
    item.itemClass = itemClass;
    item.prefixes = [record('P0', 1)];
    engine.loadItem(item);
    const before = engine.getItem();
    const result = engine.applyEssenceOfAbyss();
    assert.equal(result.success, false);
    assert.match(result.error, /not applicable/i);
    assert.deepEqual(engine.getItem(), before);
  }
});

test('Greater/Perfect modifier-level options filter tiers', () => {
  const data = { bases: { floor_test: {
    name: 'Floor Test',
    prefixes: [
      group('HasHighTier', [tier(60, 100), tier(10, 5000)]),
      group('NoHighTier', [tier(30, 100), tier(1, 5000)]),
    ],
    suffixes: [],
  } } };
  const engine = new Engine(data, 'floor_test');
  const filtered = engine._filterByMinModifierLevel(engine._prefixCandidates, 50);
  assert.deepEqual(filtered.map(c => [c.group.modGroup, c.tier.ilvlReq]).sort(), [['HasHighTier', 60], ['NoHighTier', 30]]);
  withRandom(23, () => {
    for (let i = 0; i < 500; i++) {
      const roll = new Engine(data, 'floor_test').applyTransmutation({ minModLevel: 50 }).addedMods[0];
      assert.notEqual(roll.ilvlReq, 10);
      assert.notEqual(roll.ilvlReq, 1);
    }
  });
});

test('Omen of Whittling followed by Perfect Chaos uses both rules in order', () => {
  const data = { bases: { chaos_test: {
    name: 'Chaos Test',
    prefixes: [group('Target', [tier(60, 100), tier(10, 5000)]), group('OtherPrefix', [tier(55, 100)])],
    suffixes: [group('KeptSuffix', [tier(70, 100)])],
  } } };
  const engine = new Engine(data, 'chaos_test');
  engine.loadItem(rareItem('chaos_test', [record('Target', 10)], [record('KeptSuffix', 70)]));
  const result = withRandom(() => 0, () => engine.applyChaos('whittling', { minModLevel: 50 }));
  assert(result.success);
  assert.equal(result.removedMods[0].modGroup, 'Target');
  assert.equal(result.removedMods[0].ilvlReq, 10);
  assert(result.addedMods[0].ilvlReq >= 50);
});

test('eligibility and weights are recalculated after every item-state change', () => {
  const data = { bases: { test_equipment: syntheticBase() } };
  const engine = new Engine(data, 'test_equipment');
  engine.loadItem(rareItem('test_equipment', [record('P0', 1), record('P1', 1)], []));
  let eligible = engine._eligibleCandidates('prefix', engine._existingGroups()).map(c => c.group.modGroup);
  assert(!eligible.includes('P0') && !eligible.includes('P1'));

  engine.loadItem(rareItem('test_equipment', [record('P0', 1, { fractured: true })], []));
  eligible = engine._eligibleCandidates('prefix', engine._existingGroups()).map(c => c.group.modGroup);
  assert(!eligible.includes('P0'));

  engine.loadItem(rareItem('test_equipment', [record('P2', 1, { desecrated: true })], []));
  eligible = engine._eligibleCandidates('prefix', engine._existingGroups()).map(c => c.group.modGroup);
  assert(!eligible.includes('P2'));

  withRandom(() => 0, () => engine.applyAnnulment());
  eligible = engine._eligibleCandidates('prefix', engine._existingGroups()).map(c => c.group.modGroup);
  assert(eligible.includes('P2'));
});

test('every populated selectable base constructs and accepts a valid craft', () => {
  const selectable = [
    'ruby', 'sapphire', 'emerald', 'amulets', 'rings', 'belts',
    ...['gloves', 'boots', 'helmets'].flatMap(base => ['str', 'dex', 'int', 'str_dex', 'str_int', 'dex_int'].map(attr => `${base}_${attr}`)),
    ...['str', 'dex', 'int', 'str_dex', 'str_int', 'dex_int', 'str_dex_int'].map(attr => `body_armours_${attr}`),
    'quivers', 'shields_str', 'shields_str_dex', 'shields_str_int', 'bucklers', 'foci',
    'claws', 'daggers', 'wands', 'one_hand_swords', 'one_hand_axes', 'one_hand_maces', 'sceptres', 'spears', 'flails',
    'bows', 'staves', 'two_hand_swords', 'two_hand_axes', 'two_hand_maces', 'quarterstaves', 'crossbows',
    'life_flasks', 'mana_flasks', 'charms',
  ];
  assert.equal(selectable.length, 56);
  withRandom(0x454, () => {
    for (const id of selectable) {
      assert(bases[id], `missing ${id}`);
      const engine = new Engine(modData, id, desecratedData);
      engine.setItemLevel(83);
      const result = engine.applyTransmutation();
      assert(result.success, `${id}: ${result.error}`);
    }
  });
});

test('base-specific pools do not leak modifiers between item classes', () => {
  const amuletGroups = new Set([...bases.amulets.prefixes, ...bases.amulets.suffixes].map(g => g.modGroup));
  const ringGroups = new Set([...bases.rings.prefixes, ...bases.rings.suffixes].map(g => g.modGroup));
  const amuletOnly = [...amuletGroups].find(g => !ringGroups.has(g));
  assert(amuletOnly);
  const ring = new Engine(modData, 'rings');
  assert(![...ring._prefixCandidates, ...ring._suffixCandidates].some(c => c.group.modGroup === amuletOnly));
});

const audit = {
  files: Object.keys(bases).length,
  populated: 0,
  groups: 0,
  tiers: 0,
  empty: [],
  allWeightsOne: [],
  invalidWeights: [],
  metadata: { limits: 0, tags: 0, itemClass: 0, baseTypes: 0, requirements: 0 },
};

for (const [id, base] of Object.entries(bases)) {
  const groups = [...(base.prefixes || []), ...(base.suffixes || [])];
  const tiers = groups.flatMap(g => g.tiers || []);
  audit.groups += groups.length;
  audit.tiers += tiers.length;
  if (tiers.length) audit.populated++;
  else audit.empty.push(id);
  if (tiers.length && tiers.every(t => t.weight === 1)) audit.allWeightsOne.push(id);
  for (const t of tiers) if (!(Number.isFinite(t.weight) && t.weight > 0)) audit.invalidWeights.push(id);
  for (const key of Object.keys(audit.metadata)) if (base[key] != null) audit.metadata[key]++;
}

let passed = 0;
const failures = [];
for (const { name, fn } of tests) {
  try {
    await fn();
    passed++;
    console.log(`PASS  ${name}`);
  } catch (error) {
    failures.push({ name, error: error.message });
    console.log(`FAIL  ${name}\n      ${error.message}`);
  }
}

console.log('\nDataset audit');
console.log(JSON.stringify(audit, null, 2));
console.log(`\nRESULT: ${passed}/${tests.length} tests passed`);
if (failures.length) {
  console.log(JSON.stringify({ failures }, null, 2));
  process.exitCode = 1;
}
