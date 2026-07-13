#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

function addToMapArray(map, key, value) {
  if (key == null) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
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
  const manifest = readJson(path.join(directory, SOURCES.manifest));
  const modBases = loadResolvedModBases(baseDirectory, sharedDirectory);
  const modifiersById = new Map(modifiers.modifiers.map(modifier => [modifier.id, modifier]));
  const modifiersByClassGroupLevel = new Map();

  for (const modifier of modifiers.modifiers) {
    for (const [classId] of modifier.spawnWeights || []) {
      const key = `${classId}|${modifier.affix}|${modifier.modifierGroup}|${modifier.requiredItemLevel}`;
      addToMapArray(modifiersByClassGroupLevel, key, modifier);
    }
  }

  const overlayByPool = {};
  const sourceModifierIds = new Set();
  for (const [poolId, mapping] of Object.entries(baseItems.simulatorBaseMap || {})) {
    const typeData = modBases[poolId];
    const rows = [];
    if (typeData) {
      for (const [affix, groups] of [['prefix', typeData.prefixes || []], ['suffix', typeData.suffixes || []]]) {
        for (const group of groups) {
          for (const tier of group.tiers || []) {
            const matches = [];
            for (const classId of mapping.classIds || []) {
              const key = `${classId}|${affix}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`;
              for (const modifier of modifiersByClassGroupLevel.get(key) || []) {
                if (modifier.desecrated || modifier.essence || modifier.corrupted || modifier.enchantment) continue;
                matches.push(modifier);
              }
            }
            const ids = [...new Set(matches.map(modifier => modifier.id))];
            if (ids.length !== 1) continue;
            const modifier = modifiersById.get(ids[0]);
            const weights = (modifier.spawnWeights || [])
              .filter(([classId]) => (mapping.classIds || []).includes(classId))
              .map(([, weight]) => Number(weight));
            const uniqueWeights = [...new Set(weights)];
            rows.push([
              `${affix}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`,
              modifier.id,
              uniqueWeights.length === 1 ? uniqueWeights[0] : null,
            ]);
            sourceModifierIds.add(modifier.id);
          }
        }
      }
    }
    overlayByPool[poolId] = rows;
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
