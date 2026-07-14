#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModifierOverlayAudit } from './modifier-overlay.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const NORMALIZED_DIR = path.join(PROJECT_ROOT, 'data', 'normalized');
const BASE_DIR = path.join(PROJECT_ROOT, 'data', 'bases');
const SHARED_DIR = path.join(PROJECT_ROOT, 'data', 'shared');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'normalized.data.js');
const RUNTIME_OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'runtime.data.js');

const SOURCES = {
  baseItems: 'base-items.json',
  modifiers: 'modifiers.json',
  craftingItems: 'crafting-items.json',
  essences: 'essences.json',
  manifest: 'version-manifest.json',
};

const RUNTIME_BASE_FIELDS = [
  'id', 'metadataKey', 'displayName', 'itemClass', 'equipmentSlot',
  'classId', 'modifierPoolClassId', 'requiredLevel', 'dropLevel', 'tags',
  'requirements', 'baseProperties', 'implicitModifierIds', 'socketCount',
  'icon', 'unmodifiable',
];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function pickFields(source, fields) {
  return Object.fromEntries(fields
    .filter(field => Object.prototype.hasOwnProperty.call(source, field))
    .map(field => [field, source[field]]));
}

function buildSocketableItemClassMap(craftingItems, essences) {
  const names = new Map(Object.entries(craftingItems.socketableItemClasses || {})
    .filter(([, itemClass]) => typeof itemClass === 'string' && itemClass));
  // The retained legacy snapshot predates socketableItemClasses. Essence
  // applicability uses the same source enum and preserves every enum value
  // referenced by the snapshot's socketables, so it is a deterministic
  // compatibility source until the next raw conversion.
  for (const essence of essences.essences || []) {
    for (const mapping of essence.guaranteedModifiersByItemClass || []) {
      if (!mapping.itemClass) continue;
      const key = String(mapping.itemClassId);
      const existing = names.get(key);
      if (existing && existing !== mapping.itemClass) {
        throw new Error(`Source item-class enum ${key} resolves to both ${existing} and ${mapping.itemClass}.`);
      }
      names.set(key, mapping.itemClass);
    }
  }
  const referenced = [...new Set((craftingItems.socketables || [])
    .flatMap(socketable => Object.keys(socketable.effects?.classes || {})))]
    .sort((left, right) => Number(left) - Number(right));
  for (const key of referenced) {
    if (!names.has(String(key))) {
      throw new Error(`Socketable applicability enum ${key} has no retained item-class name.`);
    }
  }
  return Object.fromEntries(referenced.map(key => [String(key), names.get(String(key))]));
}

function jsonFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter(file => file.endsWith('.json')).sort();
}

function loadResolvedModBases(baseDirectory = BASE_DIR, sharedDirectory = SHARED_DIR) {
  const shared = Object.fromEntries(jsonFiles(sharedDirectory).map(file => [
    path.basename(file, '.json'),
    readJson(path.join(sharedDirectory, file)),
  ]));
  const bases = {};
  for (const file of jsonFiles(baseDirectory)) {
    const id = path.basename(file, '.json');
    const source = readJson(path.join(baseDirectory, file));
    if (!Array.isArray(source.inherits) || source.inherits.length === 0) {
      bases[id] = source;
      continue;
    }
    const prefixes = [];
    const suffixes = [];
    for (const key of source.inherits) {
      const inherited = shared[key];
      if (!inherited) throw new Error(`Base ${id} inherits unknown shared pool ${key}.`);
      prefixes.push(...(inherited.prefixes || []));
      suffixes.push(...(inherited.suffixes || []));
    }
    bases[id] = {
      ...source,
      prefixes: [...prefixes, ...(source.prefixes || [])],
      suffixes: [...suffixes, ...(source.suffixes || [])],
    };
    delete bases[id].inherits;
  }
  return bases;
}

export function buildNormalizedBrowserSource(directory = NORMALIZED_DIR) {
  const parts = [];
  for (const [key, fileName] of Object.entries(SOURCES)) {
    const raw = readFileSync(path.join(directory, fileName), 'utf8').trimStart().replace(/^\uFEFF/, '').trim();
    JSON.parse(raw);
    parts.push(`${JSON.stringify(key)}:${raw}`);
  }
  return `window.COE_NORMALIZED_DATA={${parts.join(',')}};\n`;
}

export function buildRuntimeData(
  directory = NORMALIZED_DIR,
  baseDirectory = BASE_DIR,
  sharedDirectory = SHARED_DIR,
) {
  const baseItems = readJson(path.join(directory, SOURCES.baseItems));
  const modifiers = readJson(path.join(directory, SOURCES.modifiers));
  const craftingItems = readJson(path.join(directory, SOURCES.craftingItems));
  const essences = readJson(path.join(directory, SOURCES.essences));
  const manifest = readJson(path.join(directory, SOURCES.manifest));
  const modBases = loadResolvedModBases(baseDirectory, sharedDirectory);
  const modifiersById = new Map(modifiers.modifiers.map(modifier => [modifier.id, modifier]));
  const overlayAudit = buildModifierOverlayAudit(modBases, baseItems, modifiers);
  if (overlayAudit.failures.length) {
    const sample = overlayAudit.failures.slice(0, 5)
      .map(row => `${row.poolId}:${row.overlayKey} (${row.resolvedCandidateIds.join(', ') || 'no candidates'})`)
      .join('; ');
    throw new Error(`Modifier overlay has ${overlayAudit.failures.length} unresolved rows: ${sample}`);
  }

  const overlayByPool = {};
  const sourceModifierIds = new Set();
  for (const poolId of Object.keys(baseItems.simulatorBaseMap || {})) {
    overlayByPool[poolId] = [];
  }
  for (const row of overlayAudit.rows) {
    const modifier = row.modifier;
    sourceModifierIds.add(modifier.id);
    // Compact tuple layout:
    // [lookup key, stable source id, pool weight, display tier, source tier,
    //  match strategy, class weights when the pool weight is class-dependent]
    overlayByPool[row.poolId].push([
      row.overlayKey,
      modifier.id,
      row.poolSpawnWeight,
      row.displayTier,
      modifier.tier ?? null,
      row.matchStrategy,
      row.poolSpawnWeight == null ? row.classWeights : null,
    ]);
  }

  const implicitModifierIds = new Set((baseItems.bases || [])
    .flatMap(base => base.implicitModifierIds || []));
  const implicits = Object.fromEntries([...implicitModifierIds].sort((left, right) => left - right).map(id => {
    const modifier = modifiersById.get(id);
    if (!modifier) return [id, [null, null, null, []]];
    return [id, [
      modifier.key ?? null,
      modifier.modifierGroupId ?? null,
      modifier.modifierGroup ?? null,
      modifier.stats || [],
    ]];
  }));
  const sourceModifiers = Object.fromEntries([...sourceModifierIds].sort((left, right) => left - right).map(id => {
    const modifier = modifiersById.get(id);
    return [id, [
      modifier.key ?? null,
      modifier.modifierGroupId ?? null,
      modifier.modifierTags || [],
      modifier.requiredTags || [],
      modifier.forbiddenTags || [],
      modifier.weightConditions || [],
    ]];
  }));

  const craftingHandlers = new Set();
  const visitMethod = method => {
    if (method.handler) craftingHandlers.add(method.handler);
    for (const child of method.elements || []) visitMethod(child);
  };
  for (const method of craftingItems.methods || []) visitMethod(method);

  const itemClasses = new Set((baseItems.bases || []).map(base => base.itemClass).filter(value => value != null));
  const modifierGroups = new Set((modifiers.modifiers || []).map(modifier => modifier.modifierGroupId).filter(value => value != null));
  const tags = new Set();
  for (const base of baseItems.bases || []) for (const tag of base.tags || []) tags.add(tag);
  for (const modifier of modifiers.modifiers || []) for (const tag of modifier.modifierTags || []) tags.add(tag);
  const desecratedPools = new Set();
  for (const modifier of modifiers.modifiers || []) {
    if (!modifier.desecrated) continue;
    for (const [classId] of modifier.spawnWeights || []) desecratedPools.add(classId);
  }

  // Mechanics are projected separately from the audit payload so the classic
  // file:// runtime gets stable IDs and exact source ranges without parsing the
  // complete normalized modifier/crafting exports. Essence types 0-4 are the
  // retained PoE2 Essence families; type 5 is the separately audited Alloy
  // family and remains outside this implementation slice.
  const runtimeEssences = (essences.essences || []).filter(essence => Number(essence.type) <= 4);
  const essenceModifierIds = new Set(runtimeEssences
    .flatMap(essence => essence.guaranteedModifiersByItemClass || [])
    .flatMap(mapping => mapping.modifierIds || []));
  const essenceModifiers = Object.fromEntries([...essenceModifierIds]
    .sort((left, right) => left - right)
    .map(id => {
      const modifier = modifiersById.get(id);
      if (!modifier) throw new Error(`Essence runtime projection references missing modifier ${id}.`);
      return [String(id), pickFields(modifier, [
        'id', 'key', 'affix', 'generationType', 'modifierGroupId', 'modifierGroup',
        'tier', 'requiredItemLevel', 'spawnWeight', 'spawnWeights', 'modifierTags',
        'requiredTags', 'forbiddenTags', 'weightConditions', 'stats',
      ])];
    }));
  const essenceTypeNames = (essences.types || []).map(type => type.id);
  const essencesByItemId = Object.fromEntries(runtimeEssences.map(essence => [
    String(essence.itemId),
    {
      id: essence.id,
      itemId: essence.itemId,
      displayName: essence.displayName,
      type: essence.type,
      typeName: essenceTypeNames[essence.type] || `Type ${essence.type}`,
      requiredRarity: Number(essence.type) <= 2 ? 'magic' : 'rare',
      transition: Number(essence.type) <= 2 ? 'magic_to_rare_add' : 'rare_remove_add',
      guaranteedModifiersByItemClass: essence.guaranteedModifiersByItemClass || [],
    },
  ]));

  const socketableTypeNames = (craftingItems.socketableTypes || []).map(type => type.id);
  const socketableItemClasses = buildSocketableItemClassMap(craftingItems, essences);
  const socketablesByItemId = Object.fromEntries((craftingItems.socketables || []).map(socketable => [
    String(socketable.itemId),
    {
      itemId: socketable.itemId,
      displayName: socketable.displayName,
      classifications: socketable.classifications || [],
      type: socketable.type,
      typeName: socketableTypeNames[socketable.type] || `Type ${socketable.type}`,
      limit: socketable.limit,
      bound: !!socketable.bound,
      allowsCorrupted: !!socketable.corrupt,
      effects: socketable.effects || { martial: null, armour: null, caster: null, all: null, classes: {} },
    },
  ]));

  return {
    schemaVersion: 1,
    targetGameVersion: manifest.targetGameVersion,
    source: pickFields(manifest.source || {}, ['embeddedGameVersion', 'versionStatus', 'sha256']),
    counts: {
      bases: (baseItems.bases || []).length,
      itemClasses: itemClasses.size,
      modifiers: (modifiers.modifiers || []).length,
      modifierGroups: modifierGroups.size,
      tags: tags.size,
      desecratedPools: desecratedPools.size,
      craftingItems: (craftingItems.items || []).length,
      modifierOverlayRows: overlayAudit.summary.totalRows,
      modifierDisplayTierMismatches: overlayAudit.rows.filter(row =>
        Number(row.legacyTier.tier) !== Number(row.displayTier)).length,
    },
    baseItems: {
      simulatorBaseMap: baseItems.simulatorBaseMap || {},
      classes: (baseItems.classes || []).map(sourceClass => pickFields(sourceClass, ['id', 'iconKey'])),
      bases: (baseItems.bases || []).map(base => pickFields(base, RUNTIME_BASE_FIELDS)),
    },
    implicits,
    sourceModifiers,
    overlayByPool,
    craftingHandlers: [...craftingHandlers].sort(),
    craftingMechanics: {
      schemaVersion: 1,
      targetGameVersion: manifest.targetGameVersion,
      socketCapacity: {
        sourceField: 'baseItems.bases[].socketCount',
        interpretation: 'inferred_maximum',
        defaultSockets: 0,
        confidence: 'inferred',
      },
      essenceTypes: essenceTypeNames,
      essencesByItemId,
      essenceModifiersById: essenceModifiers,
      socketableTypes: socketableTypeNames,
      socketableItemClasses,
      socketableLimits: craftingItems.socketableLimits || [],
      socketablesByItemId,
    },
  };
}

export function buildRuntimeBrowserSource(
  directory = NORMALIZED_DIR,
  baseDirectory = BASE_DIR,
  sharedDirectory = SHARED_DIR,
) {
  return `window.COE_RUNTIME_DATA=${JSON.stringify(buildRuntimeData(directory, baseDirectory, sharedDirectory))};\n`;
}

function runCli() {
  const normalizedSource = buildNormalizedBrowserSource();
  const runtimeSource = buildRuntimeBrowserSource();
  if (process.argv.includes('--check')) {
    const checks = [
      [OUTPUT_FILE, normalizedSource],
      [RUNTIME_OUTPUT_FILE, runtimeSource],
    ];
    for (const [file, expected] of checks) {
      if (!existsSync(file) || normalizeText(readFileSync(file, 'utf8')) !== normalizeText(expected)) {
        throw new Error(`${path.relative(PROJECT_ROOT, file)} is stale; rebuild browser data.`);
      }
    }
    console.log('Normalized audit and runtime browser bundles are current.');
    return;
  }
  writeFileSync(OUTPUT_FILE, normalizedSource, 'utf8');
  writeFileSync(RUNTIME_OUTPUT_FILE, runtimeSource, 'utf8');
  console.log('Generated data/normalized.data.js and data/runtime.data.js');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
