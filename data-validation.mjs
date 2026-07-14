#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { normalizeCoeData, parseCoeExport } from './tools/convert-coe-data.mjs';
import {
  buildNormalizedBrowserSource,
  buildRuntimeBrowserSource,
  buildRuntimeData,
} from './tools/build-normalized-data.mjs';
import { buildModifierOverlayAudit } from './tools/modifier-overlay.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NORMALIZED_DIR = path.join(HERE, 'data', 'normalized');
const BASE_DIR = path.join(HERE, 'data', 'bases');
const SHARED_DIR = path.join(HERE, 'data', 'shared');
const PROVENANCE_PATH = path.join(HERE, 'data', 'source-cache', 'provenance.json');
const COVERAGE_PATH = path.join(HERE, 'reports', 'data-coverage.json');
const BASE_PARITY_PATH = path.join(HERE, 'reports', 'base-item-parity.json');
const CRAFTING_PARITY_PATH = path.join(HERE, 'reports', 'crafting-parity.json');
const IMPLEMENTATION_STATUS_PATH = path.join(HERE, 'reports', 'crafting-implementation-status.json');
const IMPLEMENTATION_STATUS_MARKDOWN_PATH = path.join(HERE, 'reports', 'crafting-implementation-status.md');
const CURRENCY_INDEX_PATH = path.join(HERE, 'data', 'crafting', 'currency-index.json');
const NORMALIZED_FILES = {
  baseItems: 'base-items.json',
  modifiers: 'modifiers.json',
  craftingItems: 'crafting-items.json',
  essences: 'essences.json',
  manifest: 'version-manifest.json',
};

let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  if (condition) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.error(`  FAIL  ${name}${details ? ` -- ${details}` : ''}`);
  }
}

function failAndExit(message) {
  console.error(`\nValidation could not start: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    failAndExit(`${path.relative(HERE, filePath)}: ${error.message}`);
  }
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stable(value) {
  return JSON.stringify(value);
}

function uniqueIds(records) {
  const ids = records.map(record => String(record.id));
  return ids.length === new Set(ids).size;
}

function isStableId(value) {
  return (typeof value === 'string' && value.trim().length > 0) ||
    (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype;
}

function isValidBasePropertyValue(value) {
  if (value == null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isValidBasePropertyValue);
  if (!isPlainObject(value)) return false;
  return Object.entries(value).every(([key, child]) => key.trim().length > 0 && isValidBasePropertyValue(child));
}

export function auditZeroMagicCapacityBases(baseItems, modifiers, basePools = {}) {
  const basesById = new Map((baseItems?.bases || []).map(base => [String(base.id), base]));
  const modifiersById = new Map((modifiers?.modifiers || []).map(modifier => [String(modifier.id), modifier]));
  const poolByBaseId = new Map();
  for (const [poolId, mapping] of Object.entries(baseItems?.simulatorBaseMap || {})) {
    for (const baseId of mapping?.concreteBaseIds || []) poolByBaseId.set(String(baseId), poolId);
  }

  const statToSide = new Map([
    ['local_maximum_prefixes_allowed_+', 'prefixes'],
    ['local_maximum_suffixes_allowed_+', 'suffixes'],
  ]);
  const zeroCapacity = [];
  for (const [baseId, poolId] of poolByBaseId) {
    const base = basesById.get(baseId);
    if (!base || base.unmodifiable) continue;
    const configured = basePools?.[poolId]?.limits?.magic;
    const limits = {
      prefixes: Number.isFinite(Number(configured?.prefixes)) ? Number(configured.prefixes) : 1,
      suffixes: Number.isFinite(Number(configured?.suffixes)) ? Number(configured.suffixes) : 1,
    };
    const deltas = { prefixes: 0, suffixes: 0 };
    for (const implicitId of base.implicitModifierIds || []) {
      const implicit = modifiersById.get(String(implicitId));
      for (const stat of implicit?.stats || []) {
        const side = statToSide.get(stat?.id);
        const range = Array.isArray(stat?.range) ? stat.range : [];
        if (!side || range.length === 0) continue;
        const first = Number(range[0]);
        if (!Number.isInteger(first) || range.some(value => Number(value) !== first)) continue;
        deltas[side] += first;
      }
    }
    const effective = {
      prefixes: Math.max(0, limits.prefixes + deltas.prefixes),
      suffixes: Math.max(0, limits.suffixes + deltas.suffixes),
    };
    if (effective.prefixes === 0 && effective.suffixes === 0) {
      zeroCapacity.push({
        baseItemId: base.id,
        displayName: base.displayName,
        simulatorPoolId: poolId,
        magic: effective,
      });
    }
  }
  return zeroCapacity.sort((left, right) => Number(left.baseItemId) - Number(right.baseItemId));
}

// Validate the normalized concrete-base contract independently from the UI.
// Known source limitations are accepted only through explicit ID allowlists;
// malformed fixtures without those allowlists must still fail deterministically.
export function validateNormalizedBaseCatalog(baseItems, modifiers, manifest, options = {}) {
  const errors = [];
  const warnings = [];
  const addError = (code, message, context = {}) => errors.push({ code, message, ...context });
  const addWarning = (code, message, context = {}) => warnings.push({ code, message, ...context });
  const allowedUnmapped = new Set((options.allowedUnmappedBaseIds || []).map(String));
  const allowedDuplicateTags = new Set((options.allowedDuplicateTagBaseIds || []).map(String));
  const allowedMalformedBaseProperties = new Set((options.allowedMalformedBasePropertyIds || []).map(String));
  const classes = Array.isArray(baseItems?.classes) ? baseItems.classes : [];
  const bases = Array.isArray(baseItems?.bases) ? baseItems.bases : [];
  const mappings = isPlainObject(baseItems?.simulatorBaseMap) ? baseItems.simulatorBaseMap : {};
  const modifierRecords = Array.isArray(modifiers?.modifiers) ? modifiers.modifiers : [];
  const targetVersion = manifest?.targetGameVersion || null;
  const classById = new Map();
  const baseById = new Map();
  const modifierIds = new Set(modifierRecords.filter(record => isStableId(record?.id)).map(record => String(record.id)));
  const reverseMappings = new Map();
  const ambiguousBaseIds = new Set();
  const unknownMappingBaseIds = new Set();

  for (const sourceClass of classes) {
    if (!isStableId(sourceClass?.id)) {
      addError('unknown_item_class', 'Normalized source class is missing a stable ID.');
      continue;
    }
    const key = String(sourceClass.id);
    if (classById.has(key)) addError('unknown_item_class', `Duplicate normalized source class ID ${key}.`, { classId: sourceClass.id });
    classById.set(key, sourceClass);
  }

  for (const base of bases) {
    if (!isStableId(base?.id)) {
      addError('missing_stable_id', 'Concrete base is missing a stable ID.');
      continue;
    }
    const baseKey = String(base.id);
    if (baseById.has(baseKey)) {
      addError('duplicate_stable_id', `Duplicate concrete-base ID ${baseKey}.`, { baseId: base.id });
    } else {
      baseById.set(baseKey, base);
    }

    if (typeof base.displayName !== 'string' || !base.displayName.trim()) {
      addError('missing_display_name', `Concrete base ${baseKey} has no display name.`, { baseId: base.id });
    }

    const sourceClass = classById.get(String(base.classId));
    const modifierClass = classById.get(String(base.modifierPoolClassId));
    if (!sourceClass || !modifierClass || typeof base.itemClass !== 'string' ||
        base.itemClass !== sourceClass?.itemClass) {
      addError('unknown_item_class', `Concrete base ${baseKey} has an unknown or inconsistent item class.`, {
        baseId: base.id,
        classId: base.classId,
        itemClass: base.itemClass,
        modifierPoolClassId: base.modifierPoolClassId,
      });
    }

    if (!Array.isArray(base.tags)) {
      addError('malformed_tags', `Concrete base ${baseKey} tags must be an array.`, { baseId: base.id });
    } else {
      const malformed = base.tags.some(tag => typeof tag !== 'string' || !tag.trim());
      const duplicate = base.tags.length !== new Set(base.tags).size;
      if (malformed || (duplicate && !allowedDuplicateTags.has(baseKey))) {
        addError('malformed_tags', `Concrete base ${baseKey} contains malformed or duplicate tags.`, { baseId: base.id });
      } else if (duplicate) {
        addWarning('allowed_duplicate_source_tag', `Concrete base ${baseKey} retains a documented duplicate source tag.`, { baseId: base.id });
      }
    }

    if (!Array.isArray(base.implicitModifierIds) ||
        base.implicitModifierIds.some(id => !isStableId(id) || !modifierIds.has(String(id))) ||
        base.implicitModifierIds.length !== new Set(base.implicitModifierIds.map(String)).size) {
      addError('malformed_implicit_data', `Concrete base ${baseKey} has malformed or unresolved implicit data.`, { baseId: base.id });
    }

    const requiredLevels = [base.requiredLevel, base.requirements?.level].filter(value => value != null);
    if (requiredLevels.some(value => !Number.isInteger(value) || value < 0) ||
        (requiredLevels.length > 1 && new Set(requiredLevels).size > 1)) {
      addError('invalid_required_level', `Concrete base ${baseKey} has an invalid required level.`, { baseId: base.id });
    }

    const socketFields = ['socketCount', 'maximumSockets', 'maxSockets', 'defaultSockets'];
    const invalidSocket = socketFields.some(field =>
      base[field] != null && (!Number.isInteger(base[field]) || base[field] < 0));
    const maximumSockets = base.maximumSockets ?? base.maxSockets ?? null;
    if (invalidSocket ||
        (base.maximumSockets != null && base.maxSockets != null && base.maximumSockets !== base.maxSockets) ||
        (maximumSockets != null && base.defaultSockets != null && base.defaultSockets > maximumSockets)) {
      addError('invalid_socket_limit', `Concrete base ${baseKey} has an invalid socket field.`, { baseId: base.id });
    }

    if (Object.prototype.hasOwnProperty.call(base, 'baseProperties') &&
        (!isPlainObject(base.baseProperties) || !isValidBasePropertyValue(base.baseProperties))) {
      if (allowedMalformedBaseProperties.has(baseKey)) {
        addWarning('allowed_malformed_source_base_properties', `Concrete base ${baseKey} retains a documented malformed source property payload.`, { baseId: base.id });
      } else {
        addError('malformed_base_properties', `Concrete base ${baseKey} has malformed base properties.`, { baseId: base.id });
      }
    }

    for (const versionField of ['targetGameVersion', 'sourceVersion', 'gameVersion']) {
      if (base[versionField] != null && base[versionField] !== targetVersion) {
        addError('unsupported_version_mixing', `Concrete base ${baseKey} mixes target version ${base[versionField]} with ${targetVersion}.`, {
          baseId: base.id,
          versionField,
        });
      }
    }
  }

  for (const [poolId, mapping] of Object.entries(mappings)) {
    if (!poolId.trim() || !isPlainObject(mapping) || !Array.isArray(mapping.classIds) ||
        mapping.classIds.length === 0 || !Array.isArray(mapping.concreteBaseIds) ||
        mapping.concreteBaseIds.length === 0) {
      addError('missing_simulator_pool_mapping', `Simulator pool ${poolId || '(blank)'} has a malformed mapping.`, { poolId });
      continue;
    }
    if (mapping.classIds.length !== new Set(mapping.classIds.map(String)).size ||
        mapping.classIds.some(id => !classById.has(String(id)))) {
      addError('unknown_item_class', `Simulator pool ${poolId} references an unknown or duplicate class.`, { poolId });
    }
    if (mapping.concreteBaseIds.length !== new Set(mapping.concreteBaseIds.map(String)).size) {
      addError('ambiguous_simulator_pool_mapping', `Simulator pool ${poolId} repeats a concrete base ID.`, { poolId });
    }

    for (const baseId of mapping.concreteBaseIds) {
      const baseKey = String(baseId);
      const base = baseById.get(baseKey);
      if (!base) {
        unknownMappingBaseIds.add(baseId);
        addError('missing_simulator_pool_mapping', `Simulator pool ${poolId} references unknown base ${baseKey}.`, { poolId, baseId });
        continue;
      }
      const previousPool = reverseMappings.get(baseKey);
      if (previousPool && previousPool !== poolId) {
        ambiguousBaseIds.add(baseId);
        addError('ambiguous_simulator_pool_mapping', `Concrete base ${baseKey} maps to both ${previousPool} and ${poolId}.`, {
          baseId,
          poolIds: [previousPool, poolId],
        });
      } else {
        reverseMappings.set(baseKey, poolId);
      }
      if (!mapping.classIds.includes(base.classId) || !mapping.classIds.includes(base.modifierPoolClassId)) {
        addError('unknown_item_class', `Concrete base ${baseKey} does not match simulator pool ${poolId}'s classes.`, { poolId, baseId });
      }
    }
  }

  const unmappedBaseIds = [];
  for (const base of bases) {
    if (!isStableId(base?.id) || reverseMappings.has(String(base.id))) continue;
    unmappedBaseIds.push(base.id);
    if (allowedUnmapped.has(String(base.id))) {
      addWarning('allowed_unmapped_source_base', `Concrete base ${base.id} is a documented unselectable source record.`, { baseId: base.id });
    } else {
      addError('missing_simulator_pool_mapping', `Concrete base ${base.id} has no simulator-pool mapping.`, { baseId: base.id });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    reverseMappings,
    unmappedBaseIds,
    ambiguousBaseIds: [...ambiguousBaseIds],
    unknownMappingBaseIds: [...unknownMappingBaseIds],
  };
}

function parseArguments(argv) {
  let sourcePath = null;
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') {
      console.log('Usage: node data-validation.mjs [--source <path-to-data.json>]');
      console.log('Without --source, validation uses only repository-owned normalized data and provenance.');
      process.exit(0);
    }
    if (argument === '--source') {
      if (!argv[index + 1]) failAndExit('--source requires a path');
      sourcePath = path.resolve(HERE, argv[++index]);
      continue;
    }
    if (!argument.startsWith('-') && sourcePath == null) {
      // Preserve the old explicit positional form without retaining its external default.
      sourcePath = path.resolve(HERE, argument);
      continue;
    }
    failAndExit(`unknown argument: ${argument}`);
  }
  return { sourcePath };
}

function collectMethodItemIds(nodes, result = []) {
  for (const node of nodes || []) {
    if (node.itemId != null) result.push(node.itemId);
    collectMethodItemIds(node.elements, result);
  }
  return result;
}

function legacyPoolCoverage(baseItems) {
  const files = readdirSync(path.join(HERE, 'data', 'bases'))
    .filter(file => file.endsWith('.json'))
    .sort();
  const poolIds = files.map(file => file.slice(0, -5));
  const normalizedIds = Object.keys(baseItems.simulatorBaseMap).sort();
  const emptyPools = [];
  const allOneWeightPools = [];

  for (const file of files) {
    const pool = readJson(path.join(HERE, 'data', 'bases', file));
    const groups = [...(pool.prefixes || []), ...(pool.suffixes || [])];
    const tiers = groups.flatMap(group => group.tiers || []);
    if (groups.length === 0) emptyPools.push(file.slice(0, -5));
    if (tiers.length > 0 && tiers.every(tier => tier.weight === 1)) {
      allOneWeightPools.push(file.slice(0, -5));
    }
  }

  return {
    poolIds,
    normalizedIds,
    emptyPools,
    allOneWeightPools,
    normalizedOnly: normalizedIds.filter(id => !poolIds.includes(id)),
    legacyOnly: poolIds.filter(id => !normalizedIds.includes(id)),
  };
}

const TASK02_OUTER_CLASSES = [
  {
    outerId: 'jewels', label: 'Jewels', normalizedItemClasses: ['Jewel'],
    normalizedPoolIds: [
      'ruby', 'sapphire', 'emerald', 'diamond',
      'time_lost_ruby', 'time_lost_sapphire', 'time_lost_emerald', 'time_lost_diamond',
    ],
    selectorPoolIds: ['ruby', 'sapphire', 'emerald'],
    blockerIds: ['empty-jewel-engine-pools', 'unmapped-timeless-jewel'],
  },
  { outerId: 'amulets', label: 'Amulets', normalizedItemClasses: ['Amulet'], normalizedPoolIds: ['amulets'] },
  { outerId: 'rings', label: 'Rings', normalizedItemClasses: ['Ring'], normalizedPoolIds: ['rings'] },
  { outerId: 'belts', label: 'Belts', normalizedItemClasses: ['Belt'], normalizedPoolIds: ['belts'] },
  {
    outerId: 'gloves', label: 'Gloves', normalizedItemClasses: ['Gloves'],
    normalizedPoolIds: [
      'gloves_str', 'gloves_dex', 'gloves_int', 'gloves_str_dex',
      'gloves_str_int', 'gloves_dex_int', 'gloves_str_dex_int',
    ],
    blockerIds: ['normalized-only-all-attribute-pools'],
  },
  {
    outerId: 'boots', label: 'Boots', normalizedItemClasses: ['Boots'],
    normalizedPoolIds: [
      'boots_str', 'boots_dex', 'boots_int', 'boots_str_dex',
      'boots_str_int', 'boots_dex_int', 'boots_str_dex_int',
    ],
    blockerIds: ['normalized-only-all-attribute-pools'],
  },
  {
    outerId: 'body_armours', label: 'Body Armours', normalizedItemClasses: ['Body Armour'],
    normalizedPoolIds: [
      'body_armours_str', 'body_armours_dex', 'body_armours_int', 'body_armours_str_dex',
      'body_armours_str_int', 'body_armours_dex_int', 'body_armours_str_dex_int',
    ],
  },
  {
    outerId: 'helmets', label: 'Helmets', normalizedItemClasses: ['Helmet'],
    normalizedPoolIds: [
      'helmets_str', 'helmets_dex', 'helmets_int', 'helmets_str_dex',
      'helmets_str_int', 'helmets_dex_int', 'helmets_str_dex_int',
    ],
    blockerIds: ['normalized-only-all-attribute-pools'],
  },
  { outerId: 'quivers', label: 'Quivers', normalizedItemClasses: ['Quiver'], normalizedPoolIds: ['quivers'] },
  {
    outerId: 'shields', label: 'Shields', normalizedItemClasses: ['Shield'],
    normalizedPoolIds: ['shields_str', 'shields_str_dex', 'shields_str_int', 'shields_str_dex_int'],
    blockerIds: ['normalized-only-all-attribute-pools'],
  },
  { outerId: 'bucklers', label: 'Bucklers', normalizedItemClasses: ['Buckler'], normalizedPoolIds: ['bucklers'] },
  { outerId: 'foci', label: 'Foci', normalizedItemClasses: ['Focus'], normalizedPoolIds: ['foci'] },
  { outerId: 'claws', label: 'Claws', normalizedItemClasses: ['Claw'], normalizedPoolIds: ['claws'] },
  { outerId: 'daggers', label: 'Daggers', normalizedItemClasses: ['Dagger'], normalizedPoolIds: ['daggers'] },
  { outerId: 'wands', label: 'Wands', normalizedItemClasses: ['Wand'], normalizedPoolIds: ['wands'] },
  { outerId: 'one_hand_swords', label: 'One Hand Swords', normalizedItemClasses: ['One Hand Sword'], normalizedPoolIds: ['one_hand_swords'] },
  { outerId: 'one_hand_axes', label: 'One Hand Axes', normalizedItemClasses: ['One Hand Axe'], normalizedPoolIds: ['one_hand_axes'] },
  { outerId: 'one_hand_maces', label: 'One Hand Maces', normalizedItemClasses: ['One Hand Mace'], normalizedPoolIds: ['one_hand_maces'] },
  { outerId: 'sceptres', label: 'Sceptres', normalizedItemClasses: ['Sceptre'], normalizedPoolIds: ['sceptres'] },
  { outerId: 'spears', label: 'Spears', normalizedItemClasses: ['Spear'], normalizedPoolIds: ['spears'] },
  { outerId: 'flails', label: 'Flails', normalizedItemClasses: ['Flail'], normalizedPoolIds: ['flails'] },
  { outerId: 'bows', label: 'Bows', normalizedItemClasses: ['Bow'], normalizedPoolIds: ['bows'] },
  { outerId: 'staves', label: 'Staves', normalizedItemClasses: ['Staff'], normalizedPoolIds: ['staves'] },
  { outerId: 'two_hand_swords', label: 'Two Hand Swords', normalizedItemClasses: ['Two Hand Sword'], normalizedPoolIds: ['two_hand_swords'] },
  { outerId: 'two_hand_axes', label: 'Two Hand Axes', normalizedItemClasses: ['Two Hand Axe'], normalizedPoolIds: ['two_hand_axes'] },
  { outerId: 'two_hand_maces', label: 'Two Hand Maces', normalizedItemClasses: ['Two Hand Mace'], normalizedPoolIds: ['two_hand_maces'] },
  { outerId: 'quarterstaves', label: 'Quarterstaves', normalizedItemClasses: ['Warstaff'], normalizedPoolIds: ['quarterstaves'] },
  { outerId: 'crossbows', label: 'Crossbows', normalizedItemClasses: ['Crossbow'], normalizedPoolIds: ['crossbows'] },
  { outerId: 'life_flasks', label: 'Life Flasks', normalizedItemClasses: ['LifeFlask'], normalizedPoolIds: ['life_flasks'] },
  { outerId: 'mana_flasks', label: 'Mana Flasks', normalizedItemClasses: ['ManaFlask'], normalizedPoolIds: ['mana_flasks'] },
  { outerId: 'charms', label: 'Charms', normalizedItemClasses: ['UtilityFlask'], normalizedPoolIds: ['charms'] },
];

function concreteIdsForPools(baseItems, poolIds) {
  return [...new Set(poolIds.flatMap(poolId => baseItems.simulatorBaseMap[poolId]?.concreteBaseIds || []))];
}

function buildTask02ClassCoverage(baseItems, compiledPoolIds) {
  const compiled = new Set(compiledPoolIds);
  return TASK02_OUTER_CLASSES.map(definition => {
    const compiledIds = definition.normalizedPoolIds.filter(poolId => compiled.has(poolId));
    const selectorIds = definition.selectorPoolIds || compiledIds;
    const normalizedClasses = new Set(definition.normalizedItemClasses);
    return {
      outerId: definition.outerId,
      label: definition.label,
      normalizedItemClasses: definition.normalizedItemClasses,
      normalizedPoolIds: definition.normalizedPoolIds,
      compiledPoolIds: compiledIds,
      selectorPoolIds: selectorIds,
      normalizedConcreteBaseCount: baseItems.bases.filter(base => normalizedClasses.has(base.itemClass)).length,
      mappedConcreteBaseCount: concreteIdsForPools(baseItems, definition.normalizedPoolIds).length,
      compiledConcreteBaseCount: concreteIdsForPools(baseItems, compiledIds).length,
      selectorConcreteBaseCount: concreteIdsForPools(baseItems, selectorIds).length,
      blockerIds: definition.blockerIds || [],
    };
  });
}

function duplicateDisplayNameStats(baseItems, reverseMappings) {
  const byName = new Map();
  const byPoolAndName = new Map();
  for (const base of baseItems.bases) {
    if (!byName.has(base.displayName)) byName.set(base.displayName, []);
    byName.get(base.displayName).push(base.id);
    const poolId = reverseMappings.get(String(base.id));
    if (!poolId) continue;
    const key = `${poolId}\u0000${base.displayName}`;
    if (!byPoolAndName.has(key)) byPoolAndName.set(key, []);
    byPoolAndName.get(key).push(base.id);
  }
  const duplicateNames = [...byName.values()].filter(ids => ids.length > 1);
  const duplicatePoolNames = [...byPoolAndName.values()].filter(ids => ids.length > 1);
  return {
    groups: duplicateNames.length,
    records: duplicateNames.reduce((sum, ids) => sum + ids.length, 0),
    samePoolGroups: duplicatePoolNames.length,
    samePoolRecords: duplicatePoolNames.reduce((sum, ids) => sum + ids.length, 0),
  };
}

const { sourcePath } = parseArguments(process.argv.slice(2));

console.log('Repository data validation\n');

for (const fileName of Object.values(NORMALIZED_FILES)) {
  if (!existsSync(path.join(NORMALIZED_DIR, fileName))) {
    failAndExit(`missing data/normalized/${fileName}`);
  }
}
if (!existsSync(PROVENANCE_PATH)) failAndExit('missing data/source-cache/provenance.json');

const actual = Object.fromEntries(Object.entries(NORMALIZED_FILES)
  .map(([key, fileName]) => [key, readJson(path.join(NORMALIZED_DIR, fileName))]));
const provenance = readJson(PROVENANCE_PATH);
const baseParity = readJson(BASE_PARITY_PATH);
const craftingParity = readJson(CRAFTING_PARITY_PATH);
const implementationStatus = readJson(IMPLEMENTATION_STATUS_PATH);
const currencyIndex = readJson(CURRENCY_INDEX_PATH);
const activeSnapshot = (provenance.snapshots || [])
  .find(snapshot => snapshot.id === provenance.activeSnapshotId);

check('normalized schemas are supported',
  ['baseItems', 'modifiers', 'craftingItems', 'essences', 'manifest']
    .every(key => actual[key].schemaVersion === 1));
check('normalized base IDs are unique', uniqueIds(actual.baseItems.bases));
check('normalized modifier IDs are unique', uniqueIds(actual.modifiers.modifiers));
check('normalized crafting-item IDs are unique', uniqueIds(actual.craftingItems.items));
check('normalized Essence IDs are unique', uniqueIds(actual.essences.essences));

const manifestCounts = {
  simulatorBaseMappings: Object.keys(actual.baseItems.simulatorBaseMap).length,
  sourceClasses: actual.baseItems.classes.length,
  concreteBases: actual.baseItems.bases.length,
  modifiers: actual.modifiers.modifiers.length,
  desecratedModifiers: actual.modifiers.modifiers.filter(modifier => modifier.desecrated).length,
  essenceModifiers: actual.modifiers.modifiers.filter(modifier => modifier.essence).length,
  craftingItems: actual.craftingItems.items.length,
  omens: actual.craftingItems.omens.length,
  essences: actual.essences.essences.length,
  socketables: actual.craftingItems.socketables.length,
};
check('manifest counts match normalized payloads',
  Object.entries(manifestCounts).every(([key, count]) => actual.manifest.counts[key] === count));

const payloadHashes = Object.fromEntries(['baseItems', 'modifiers', 'craftingItems', 'essences']
  .map(key => [key, sha256(stable(actual[key]))]));
check('manifest payload hashes match normalized JSON',
  Object.entries(payloadHashes).every(([key, hash]) => actual.manifest.outputHashes[key] === hash));

const classIds = new Set(actual.baseItems.classes.map(record => record.id));
const baseIds = new Set(actual.baseItems.bases.map(record => record.id));
const modifierIds = new Set(actual.modifiers.modifiers.map(record => record.id));
const craftingItemIds = new Set(actual.craftingItems.items.map(record => record.id));

const baseCatalogValidation = validateNormalizedBaseCatalog(
  actual.baseItems,
  actual.modifiers,
  actual.manifest,
  {
    allowedUnmappedBaseIds: [613],
    allowedDuplicateTagBaseIds: [5333],
    allowedMalformedBasePropertyIds: [2647, 2977, 2978],
  },
);
check('normalized concrete-base catalog passes the generic Task 02 contract',
  baseCatalogValidation.valid,
  baseCatalogValidation.errors.map(error => `${error.code}: ${error.message}`).join('; '));
check('known source anomalies require explicit validator allowances',
  stable(baseCatalogValidation.warnings.map(warning => [warning.code, warning.baseId])) === stable([
    ['allowed_malformed_source_base_properties', 2647],
    ['allowed_malformed_source_base_properties', 2977],
    ['allowed_malformed_source_base_properties', 2978],
    ['allowed_duplicate_source_tag', 5333],
    ['allowed_unmapped_source_base', 613],
  ]));

function makeBaseValidationFixture() {
  return {
    baseItems: {
      classes: [{ id: 1, itemClass: 'Ring', equipmentSlot: 'Ring' }],
      bases: [{
        id: 1,
        metadataKey: 'Metadata/Items/Rings/TestRing',
        displayName: 'Test Ring',
        classId: 1,
        itemClass: 'Ring',
        equipmentSlot: 'Ring',
        modifierPoolClassId: 1,
        tags: ['ring'],
        implicitModifierIds: [10],
        socketCount: 0,
        dropLevel: 1,
        baseProperties: { armour: 1 },
      }],
      simulatorBaseMap: { rings: { classIds: [1], concreteBaseIds: [1] } },
    },
    modifiers: { modifiers: [{ id: 10 }] },
    manifest: { targetGameVersion: '0.5.4' },
  };
}

function fixtureHasError(code, mutate) {
  const fixture = structuredClone(makeBaseValidationFixture());
  mutate(fixture);
  return validateNormalizedBaseCatalog(fixture.baseItems, fixture.modifiers, fixture.manifest)
    .errors.some(error => error.code === code);
}

check('base validator accepts missing icons for graceful runtime fallback', (() => {
  const fixture = makeBaseValidationFixture();
  delete fixture.baseItems.bases[0].icon;
  return validateNormalizedBaseCatalog(fixture.baseItems, fixture.modifiers, fixture.manifest).valid;
})());
check('base validator rejects missing stable IDs',
  fixtureHasError('missing_stable_id', fixture => { delete fixture.baseItems.bases[0].id; }));
check('base validator rejects duplicate stable IDs',
  fixtureHasError('duplicate_stable_id', fixture => { fixture.baseItems.bases.push(structuredClone(fixture.baseItems.bases[0])); }));
check('base validator rejects missing display names',
  fixtureHasError('missing_display_name', fixture => { fixture.baseItems.bases[0].displayName = ''; }));
check('base validator rejects unknown item classes',
  fixtureHasError('unknown_item_class', fixture => { fixture.baseItems.bases[0].itemClass = 'Unknown'; }));
check('base validator rejects missing simulator-pool mappings',
  fixtureHasError('missing_simulator_pool_mapping', fixture => { fixture.baseItems.simulatorBaseMap = {}; }));
check('base validator rejects ambiguous simulator-pool mappings',
  fixtureHasError('ambiguous_simulator_pool_mapping', fixture => {
    fixture.baseItems.simulatorBaseMap.alternate_rings = { classIds: [1], concreteBaseIds: [1] };
  }));
check('base validator rejects malformed tags',
  fixtureHasError('malformed_tags', fixture => { fixture.baseItems.bases[0].tags = ['ring', 'ring']; }));
check('base validator rejects malformed implicit data',
  fixtureHasError('malformed_implicit_data', fixture => { fixture.baseItems.bases[0].implicitModifierIds = [999]; }));
check('base validator rejects invalid required levels',
  fixtureHasError('invalid_required_level', fixture => { fixture.baseItems.bases[0].requiredLevel = -1; }));
check('base validator rejects invalid socket limits',
  fixtureHasError('invalid_socket_limit', fixture => {
    fixture.baseItems.bases[0].maximumSockets = 1;
    fixture.baseItems.bases[0].defaultSockets = 2;
  }));
check('base validator rejects malformed base-property values',
  fixtureHasError('malformed_base_properties', fixture => { fixture.baseItems.bases[0].baseProperties.armour = Infinity; }));
check('base validator rejects unsupported version mixing',
  fixtureHasError('unsupported_version_mixing', fixture => { fixture.baseItems.bases[0].targetGameVersion = '0.5.3'; }));
check('zero-Magic-capacity audit is driven by fixed implicit deltas rather than a base name', (() => {
  const fixture = makeBaseValidationFixture();
  fixture.baseItems.bases[0].displayName = 'Future Capacity Fixture';
  fixture.modifiers.modifiers[0].stats = [
    { id: 'local_maximum_prefixes_allowed_+', range: [-1, -1] },
    { id: 'local_maximum_suffixes_allowed_+', range: [-1, -1] },
  ];
  return stable(auditZeroMagicCapacityBases(fixture.baseItems, fixture.modifiers, { rings: {} })) === stable([{
    baseItemId: 1,
    displayName: 'Future Capacity Fixture',
    simulatorPoolId: 'rings',
    magic: { prefixes: 0, suffixes: 0 },
  }]);
})());

const mappingsValid = Object.values(actual.baseItems.simulatorBaseMap).every(mapping =>
  mapping.classIds.length > 0 && mapping.classIds.every(id => classIds.has(id)) &&
  mapping.concreteBaseIds.length > 0 && mapping.concreteBaseIds.every(id => baseIds.has(id)));
check('simulator mappings reference retained classes and concrete bases', mappingsValid);

const amuletMapping = actual.baseItems.simulatorBaseMap.amulets;
const normalizedAmulets = (amuletMapping?.concreteBaseIds || [])
  .map(id => actual.baseItems.bases.find(base => base.id === id))
  .filter(Boolean);
check('Amulet mapping retains all 25 concrete bases with Crimson first',
  stable(amuletMapping?.classIds) === stable([34]) &&
  normalizedAmulets.length === 25 &&
  normalizedAmulets[0]?.id === 2546 &&
  normalizedAmulets[0]?.displayName === 'Crimson Amulet');
check('every normalized Amulet maps to class and modifier-pool class 34',
  normalizedAmulets.every(base =>
    base.itemClass === 'Amulet' && base.equipmentSlot === 'Amulet' &&
    base.classId === 34 && base.modifierPoolClassId === 34));
check('Amulet stable IDs and metadata keys are unique',
  uniqueIds(normalizedAmulets) &&
  normalizedAmulets.length === new Set(normalizedAmulets.map(base => base.metadataKey)).size);
check('Amulet implicit references resolve and duplicate names remain ID-addressable',
  normalizedAmulets.every(base => base.implicitModifierIds.every(id => modifierIds.has(id))) &&
  normalizedAmulets.filter(base => base.displayName === 'Runemastered Veridical Chain').length === 3);
check('Amulet drop level remains distinct from unavailable required level',
  normalizedAmulets.every(base =>
    Number.isFinite(base.dropLevel) &&
    !Object.prototype.hasOwnProperty.call(base, 'requiredLevel') &&
    !Object.prototype.hasOwnProperty.call(base, 'requirements')));
check('base-item parity report matches Task 01 normalized Amulet coverage',
  baseParity.targetGameVersion === actual.manifest.targetGameVersion &&
  baseParity.fullParityClaim === false &&
  baseParity.task01.normalizedConcreteBaseCount === normalizedAmulets.length &&
  baseParity.task01.selectorImplementedCount === normalizedAmulets.length &&
  baseParity.task01.defaultBase.id === normalizedAmulets[0].id);
const craftRegistry = Array.isArray(currencyIndex.craftRegistry) ? currencyIndex.craftRegistry : [];
const craftTabs = Array.isArray(currencyIndex.craftTabs) ? currencyIndex.craftTabs : [];
const visibleCraftDefinitions = craftRegistry.filter(definition => definition.visible);
const sourceBackedCraftDefinitions = craftRegistry.filter(definition => definition.sourceItemId != null);
const runtimeOnlyCraftDefinitions = craftRegistry.filter(definition => definition.sourceItemId == null);
const registryCraftIds = new Set(craftRegistry.map(definition => definition.craftId));
const registryTabIds = new Set(craftTabs.map(tab => tab.id));
const inventoryBySourceId = new Map(currencyIndex.entries.map(entry => [String(entry.sourceItemId), entry]));
const parityByCraftId = new Map((craftingParity.entries || []).map(entry => [entry.craftId, entry]));
const requiredCraftDefinitionFields = [
  'craftId', 'id', 'sourceItemId', 'metadataKey', 'sourceIdentityStatus', 'displayName',
  'equipmentRelevance', 'category', 'tab', 'iconId', 'description', 'actionType',
  'activation', 'engineAction', 'applicabilityPredicate', 'disabledReasonHandler',
  'disabledReason', 'handler', 'triggeringAction', 'omenInteraction',
  'corruptionRestriction', 'validItemClasses', 'validItemTags', 'qualityRestriction',
  'socketRestriction', 'operationOptions', 'sourceEvidence', 'implementationStatus',
  'verificationStatus', 'blocker', 'testFixtureIds', 'supported', 'visible',
  'targetGameVersion',
];
const expectedRegistryClassificationCounts = {
  ...currencyIndex.counts.byClassification,
  implemented: currencyIndex.counts.byClassification.implemented + 1,
};
const expectedVisibleClassificationCounts = {
  ...currencyIndex.counts.byClassification,
  implemented: currencyIndex.counts.byClassification.implemented + 1,
  deprecated_for_target_version: 0,
};

function countCraftDefinitionsBy(definitions, field, orderedValues = null) {
  const counts = new Map((orderedValues || []).map(value => [value, 0]));
  for (const definition of definitions) {
    const value = definition[field];
    if (value == null || value === '') continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  const pairs = orderedValues
    ? orderedValues.map(value => [value, counts.get(value) || 0])
    : [...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b)));
  return Object.fromEntries(pairs);
}

check('Task 07 authoritative crafting registry has complete stable coverage',
  currencyIndex.schemaVersion >= 2 &&
  craftRegistry.length === 531 &&
  sourceBackedCraftDefinitions.length === currencyIndex.entries.length &&
  runtimeOnlyCraftDefinitions.length === 1 &&
  runtimeOnlyCraftDefinitions[0].craftId === 'hinekora' &&
  visibleCraftDefinitions.length === currencyIndex.counts.visibleCraftDefinitions &&
  registryCraftIds.size === craftRegistry.length &&
  new Set(craftRegistry.map(definition => definition.id)).size === craftRegistry.length);
check('every crafting definition exposes the complete Task 07 data contract',
  craftRegistry.every(definition =>
    requiredCraftDefinitionFields.every(field => Object.prototype.hasOwnProperty.call(definition, field)) &&
    typeof definition.craftId === 'string' && definition.craftId.length > 0 &&
    typeof definition.displayName === 'string' && definition.displayName.length > 0 &&
    typeof definition.equipmentRelevance === 'string' && definition.equipmentRelevance.length > 0 &&
    definition.equipmentRelevance !== 'pending_audit' &&
    Array.isArray(definition.validItemClasses) &&
    Array.isArray(definition.validItemTags) &&
    Array.isArray(definition.sourceEvidence) && definition.sourceEvidence.length > 0 &&
    definition.sourceEvidence.every(evidence => typeof evidence === 'string' && evidence.length > 0) &&
    Array.isArray(definition.testFixtureIds) &&
    isPlainObject(definition.omenInteraction) &&
    definition.targetGameVersion === currencyIndex.targetGameVersion));
check('registry source identities exactly cover the retained crafting inventory',
  new Set(sourceBackedCraftDefinitions.map(definition => String(definition.sourceItemId))).size === currencyIndex.entries.length &&
  new Set(sourceBackedCraftDefinitions.map(definition => definition.metadataKey)).size === currencyIndex.entries.length &&
  sourceBackedCraftDefinitions.every(definition => {
    const source = inventoryBySourceId.get(String(definition.sourceItemId));
    return source && source.metadataKey === definition.metadataKey &&
      source.displayName === definition.displayName;
  }) &&
  runtimeOnlyCraftDefinitions[0].metadataKey == null &&
  runtimeOnlyCraftDefinitions[0].sourceIdentityStatus !== 'resolved');
check('registry tabs expose every supported mechanics definition and quality audit card',
  craftTabs.length === 10 &&
  registryTabIds.size === craftTabs.length &&
  craftRegistry.every(definition => registryTabIds.has(definition.tab)) &&
  craftRegistry.filter(definition => definition.supported).length ===
    craftRegistry.filter(definition => definition.implementationStatus === 'implemented').length &&
  craftRegistry.filter(definition => definition.supported).length === 415 &&
  craftRegistry.filter(definition => definition.supported).every(definition => definition.visible) &&
  visibleCraftDefinitions.filter(definition => definition.category === 'quality').length === 8);
check('registry implementation classifications are exclusive after Task 07 audit surfacing',
  craftRegistry.every(definition => currencyIndex.allowedClassifications.includes(definition.implementationStatus)) &&
  stable(countCraftDefinitionsBy(craftRegistry, 'implementationStatus', currencyIndex.allowedClassifications)) ===
    stable(expectedRegistryClassificationCounts) &&
  stable(countCraftDefinitionsBy(visibleCraftDefinitions, 'implementationStatus', currencyIndex.allowedClassifications)) ===
    stable(expectedVisibleClassificationCounts));
check('supported registry entries resolve declarative validators and handlers',
  craftRegistry.filter(definition => definition.supported).every(definition =>
    typeof definition.applicabilityPredicate === 'string' && definition.applicabilityPredicate.length > 0 &&
    typeof definition.disabledReasonHandler === 'string' && definition.disabledReasonHandler.length > 0 &&
    typeof definition.handler === 'string' && definition.handler.length > 0));
check('unavailable registry entries retain exact reasons and explicit blockers',
  craftRegistry.filter(definition => !definition.supported).every(definition =>
    typeof definition.disabledReason === 'string' && definition.disabledReason.length > 0 &&
    definition.disabledReason !== 'Unsupported — verification required' &&
    typeof definition.blocker === 'string' && definition.blocker.length > 0));
check('registry evidence and fixtures never replace unresolved blockers with invented mechanics',
  craftRegistry.every(definition =>
    definition.testFixtureIds.length > 0 ||
    (typeof definition.blocker === 'string' && definition.blocker.length > 0)) &&
  visibleCraftDefinitions.every(definition => definition.testFixtureIds.length > 0 ||
    (!definition.supported && typeof definition.blocker === 'string' && definition.blocker.length > 0)));
check('all Omen trigger craft references resolve inside the authoritative registry',
  craftRegistry.every(definition => {
    const triggerCraftId = definition.omenInteraction?.triggerCraftId;
    return triggerCraftId == null || registryCraftIds.has(triggerCraftId);
  }));
check('crafting parity is a direct complete projection of the implementation registry',
  craftingParity.schemaVersion === 2 &&
  craftingParity.targetGameVersion === currencyIndex.targetGameVersion &&
  craftingParity.fullParityClaim === false &&
  craftingParity.entryDetailStatus === 'authoritative_registry_crafting_implementation' &&
  craftingParity.entries.length === craftRegistry.length &&
  parityByCraftId.size === craftRegistry.length &&
  craftRegistry.every(definition => {
    const parity = parityByCraftId.get(definition.craftId);
    return parity && parity.stableId === definition.id &&
      parity.sourceItemId === definition.sourceItemId &&
      parity.metadataKey === definition.metadataKey &&
      parity.exactName === definition.displayName &&
      parity.targetGameVersion === definition.targetGameVersion &&
      parity.equipmentRelevance === definition.equipmentRelevance &&
      parity.category === definition.category && parity.tab === definition.tab &&
      parity.implementationStatus === definition.implementationStatus &&
      parity.verificationStatus === definition.verificationStatus &&
      parity.handler === definition.handler &&
      stable(parity.sourceEvidence) === stable(definition.sourceEvidence) &&
      stable(parity.testReferences) === stable(definition.testFixtureIds) &&
      parity.blocker === definition.blocker;
  }));
const task06SocketDefinitions = craftRegistry.filter(definition => definition.category === 'socketing');
const task06SocketTypeCounts = Object.fromEntries([...new Set(actual.craftingItems.socketables.map(record => record.type))]
  .sort((a, b) => a - b)
  .map(type => [String(type), actual.craftingItems.socketables.filter(record => record.type === type).length]));
check('socket inventory exposes inferred insertion mechanics and retains deprecated records',
  task06SocketDefinitions.length === 296 &&
  task06SocketDefinitions.filter(definition => definition.supported).length === 288 &&
  task06SocketDefinitions.filter(definition => definition.visible).length === 288 &&
  task06SocketDefinitions.filter(definition => definition.implementationStatus === 'implemented').length === 288 &&
  task06SocketDefinitions.filter(definition => definition.confidence === 'inferred').length === 288 &&
  task06SocketDefinitions.filter(definition => definition.supported)
    .every(definition => ['applyArtificerOrb', 'applySocketable'].includes(definition.handler)) &&
  task06SocketDefinitions.filter(definition => definition.implementationStatus === 'deprecated_for_target_version').length === 8);
check('Task 06 retained socketable cohorts match normalized source',
  actual.craftingItems.socketables.length === 295 &&
  stable(task06SocketTypeCounts) === stable({ '0': 221, '1': 34, '2': 35, '3': 4, '4': 1 }) &&
  !actual.craftingItems.methods.some(method => /extract|remove.*socket|socket.*remove/i.test(String(method.handler || ''))));
const task07Definitions = craftRegistry.filter(definition =>
  ['runeforging', 'delirium', 'corruption'].includes(definition.category));
const task07ExpeditionSourceIds = [...Array.from({ length: 13 }, (_, index) => 5049 + index), 5067, 5068, 5069, 5070];
const task07SpecializedSourceIds = [52, 54, 57, 65, 66, 67, 68];
const task07ThesisSourceIds = [770, 771, 772, 773];
const task07ExcludedSourceIds = [2191, 4402, 4479];
const task07SpecializedEntries = currencyIndex.entries.filter(entry => task07ExpeditionSourceIds.concat(task07SpecializedSourceIds, task07ThesisSourceIds).includes(Number(entry.sourceItemId)));
const task07InfuserDefinitions = craftRegistry.filter(definition => [65, 66, 67, 68].includes(Number(definition.sourceItemId)));
const task07ThesisDefinitions = craftRegistry.filter(definition => task07ThesisSourceIds.includes(Number(definition.sourceItemId)));
check('Task 07 Expedition, Delirium, and specialized corruption definitions remain blocked',
  task07Definitions.length === 49 &&
  task07Definitions.filter(definition => definition.category === 'runeforging').length === 19 &&
  task07Definitions.filter(definition => definition.category === 'delirium').length === 26 &&
  task07Definitions.filter(definition => definition.category === 'corruption').length === 4 &&
  task07Definitions.filter(definition => definition.supported).length === 0 &&
  task07Definitions.filter(definition => definition.craftId !== 'vaal').every(definition => definition.handler == null && definition.engineAction == null) &&
  task07Definitions.every(definition => definition.visible) &&
  task07Definitions.find(definition => definition.craftId === 'vaal')?.implementationStatus === 'probability_unverified');
check('specialized source identities retain blockers while exact socketable effects use generic insertion',
  task07SpecializedEntries.length === task07ExpeditionSourceIds.length + task07SpecializedSourceIds.length + task07ThesisSourceIds.length &&
  task07SpecializedEntries.every(entry => typeof entry.reason === 'string' && entry.reason.length > 0) &&
  task07InfuserDefinitions.length === 4 && task07InfuserDefinitions.every(definition => definition.category === 'quality' && definition.visible && !definition.supported) &&
  task07ThesisDefinitions.length === 4 && task07ThesisDefinitions.every(definition =>
    definition.category === 'socketing' && definition.visible && definition.supported &&
    definition.handler === 'applySocketable' && definition.confidence === 'inferred') &&
  currencyIndex.entries.filter(entry => task07ExcludedSourceIds.includes(Number(entry.sourceItemId))).length === task07ExcludedSourceIds.length &&
  actual.craftingItems.methods.every(method => !/extract|sacrifice.*outcome|vaal.*outcome/i.test(String(method.handler || ''))));
check('Task 03 parity counts derive exactly from source, registry, and visible definitions',
  craftingParity.counts.sourceEntries === currencyIndex.counts.entries &&
  craftingParity.counts.registryDefinitions === craftRegistry.length &&
  craftingParity.counts.visibleDefinitions === visibleCraftDefinitions.length &&
  craftingParity.counts.unresolvedSourceIdentities === runtimeOnlyCraftDefinitions.length &&
  craftingParity.counts.unclassified === 0 &&
  stable(craftingParity.counts.sourceByClassification) === stable(currencyIndex.counts.byClassification) &&
  stable(craftingParity.counts.registryByClassification) ===
    stable(countCraftDefinitionsBy(craftRegistry, 'implementationStatus', currencyIndex.allowedClassifications)) &&
  stable(craftingParity.counts.visibleByClassification) ===
    stable(countCraftDefinitionsBy(visibleCraftDefinitions, 'implementationStatus', currencyIndex.allowedClassifications)) &&
  stable(craftingParity.counts.registryByCategory) ===
    stable(countCraftDefinitionsBy(craftRegistry, 'category')) &&
  stable(craftingParity.counts.visibleByTab) ===
    stable(countCraftDefinitionsBy(visibleCraftDefinitions, 'tab')) &&
  Array.isArray(craftingParity.blockers) && craftingParity.blockers.length > 0);

const implementationByCraftId = new Map((implementationStatus.definitions || [])
  .map(definition => [definition.craftId, definition]));
const expectedImplementationStatus = definition => {
  if (definition.confidence === 'deprecated' ||
      definition.implementationStatus === 'deprecated_for_target_version') return 'deprecated';
  if (definition.confidence === 'non_item' ||
      definition.implementationStatus === 'non_item_currency') return 'non_equipment';
  if (definition.supported && definition.confidence === 'verified') return 'verified';
  if (definition.supported && definition.confidence === 'inferred') return 'inferred';
  if (definition.confidence === 'blocked' || definition.blocker) return 'blocked';
  return 'catalogue_only';
};
check('crafting implementation audit covers every definition with current provenance and exact blockers',
  implementationStatus.schemaVersion === 1 &&
  implementationStatus.targetGameVersion === currencyIndex.targetGameVersion &&
  implementationStatus.generatedFrom?.sha256 === sha256(readFileSync(CURRENCY_INDEX_PATH, 'utf8')) &&
  implementationByCraftId.size === craftRegistry.length &&
  craftRegistry.every(definition => {
    const audit = implementationByCraftId.get(definition.craftId);
    if (!audit) return false;
    const expectedStatus = expectedImplementationStatus(definition);
    return audit.category === definition.category &&
      audit.displayName === definition.displayName &&
      audit.sourceItemId === definition.sourceItemId &&
      audit.implementationStatus === expectedStatus &&
      audit.confidence === definition.confidence &&
      stable(audit.evidenceSource) === stable(definition.sourceEvidence) &&
      stable(audit.supportedItemClasses) === stable(definition.validItemClasses) &&
      stable(audit.testCoverage) === stable(definition.testFixtureIds) &&
      audit.blocker === definition.blocker &&
      (expectedStatus === 'blocked'
        ? typeof audit.exactUnresolvedQuestion === 'string' && audit.exactUnresolvedQuestion.length > 20
        : audit.exactUnresolvedQuestion == null);
  }));
const implementationMarkdown = existsSync(IMPLEMENTATION_STATUS_MARKDOWN_PATH)
  ? readFileSync(IMPLEMENTATION_STATUS_MARKDOWN_PATH, 'utf8')
  : '';
check('human-readable implementation audit includes baseline, current totals, and all category sections',
  implementationMarkdown.includes('## Pre-implementation audit') &&
  implementationMarkdown.includes('## Current audit') &&
  implementationMarkdown.includes('## Every retained definition') &&
  ['Currency', 'Quality', 'Socketing / Augments', 'Ritual / Omens', 'Essences', 'Abyss',
    'Breach / Genesis', 'Delirium / Instilling', 'Runeforging', 'Corruption / Sacrifice']
    .every(label => implementationMarkdown.includes(`### ${label}`)));

check('base records reference retained classes and implicit modifiers',
  actual.baseItems.bases.every(base =>
    classIds.has(base.classId) && classIds.has(base.modifierPoolClassId) &&
    base.implicitModifierIds.every(id => modifierIds.has(id))));
check('class modifier pools reference retained modifiers',
  actual.baseItems.classes.every(record =>
    record.modifierWeights.every(([modifierId, weight]) =>
      modifierIds.has(modifierId) && Number.isFinite(weight) && weight >= 0)));

const essenceModifierReferences = actual.essences.essences
  .flatMap(essence => essence.guaranteedModifiersByItemClass)
  .flatMap(entry => entry.modifierIds);
const assignmentReferences = [
  ...actual.essences.classModifierAssignments,
  ...actual.essences.baseModifierAssignments,
].flatMap(scope => scope.assignments).map(assignment => assignment.modifierId);
check('Essence mappings reference retained modifiers',
  [...essenceModifierReferences, ...assignmentReferences].every(id => modifierIds.has(id)));

const methodItemIds = collectMethodItemIds(actual.craftingItems.methods);
const specialItemIds = [
  ...actual.craftingItems.omens.map(record => record.itemId),
  ...actual.craftingItems.catalysts,
  ...actual.craftingItems.socketables.map(record => record.itemId),
  ...actual.craftingItems.emotions.map(record => record.itemId),
];
const allowedExternalMethodItemIds = [
  'Metadata/Items/Currency/SentinelCurrencyArmour',
  'Metadata/Items/Currency/SentinelCurrencyJewellery',
  'Metadata/Items/Currency/SentinelCurrencyWeapon',
];
const observedExternalMethodItemIds = [...new Set(methodItemIds
  .filter(id => typeof id === 'string'))].sort();
check('crafting metadata references retained crafting items',
  specialItemIds.every(id => craftingItemIds.has(id)) &&
  methodItemIds.every(id => typeof id === 'number'
    ? craftingItemIds.has(id)
    : allowedExternalMethodItemIds.includes(id)) &&
  stable(observedExternalMethodItemIds) === stable(allowedExternalMethodItemIds.sort()));

const coverage = legacyPoolCoverage(actual.baseItems);
check('every legacy engine pool has a normalized mapping', coverage.legacyOnly.length === 0,
  coverage.legacyOnly.join(', '));
check('known empty legacy pools remain explicit',
  stable(coverage.emptyPools) === stable([
    'diamond', 'time_lost_diamond', 'time_lost_emerald', 'time_lost_ruby', 'time_lost_sapphire',
  ]));

const task02ClassCoverage = buildTask02ClassCoverage(actual.baseItems, coverage.poolIds);
const mappedConcreteIds = new Set(baseCatalogValidation.reverseMappings.keys());
const compiledMappedIds = new Set(concreteIdsForPools(actual.baseItems, coverage.poolIds).map(String));
const selectorPoolIds = [...new Set(task02ClassCoverage.flatMap(entry => entry.selectorPoolIds))];
const selectorConcreteIds = new Set(concreteIdsForPools(actual.baseItems, selectorPoolIds).map(String));
const disabledUnmodifiableBases = actual.baseItems.bases
  .filter(base => selectorConcreteIds.has(String(base.id)) && base.unmodifiable)
  .map(base => ({ id: base.id, displayName: base.displayName, classification: 'disabled_unmodifiable_source_base' }));
const normalizedOnlyMappingDetails = coverage.normalizedOnly.map(poolId => ({
  poolId,
  baseIds: actual.baseItems.simulatorBaseMap[poolId].concreteBaseIds,
  classification: 'blocked_missing_compiled_modifier_pool',
}));
const emptyCompiledPoolDetails = coverage.emptyPools.map(poolId => ({
  poolId,
  baseIds: actual.baseItems.simulatorBaseMap[poolId].concreteBaseIds,
  classification: 'blocked_empty_modifier_pool',
}));
const unmappedBaseDetails = baseCatalogValidation.unmappedBaseIds.map(id => {
  const base = actual.baseItems.bases.find(record => record.id === id);
  return {
    id,
    displayName: base?.displayName,
    metadataKey: base?.metadataKey,
    classification: 'blocked_missing_simulator_pool_mapping',
  };
});
const explicitlyBlockedIds = new Set([
  ...baseCatalogValidation.unmappedBaseIds,
  ...normalizedOnlyMappingDetails.flatMap(entry => entry.baseIds),
  ...emptyCompiledPoolDetails.flatMap(entry => entry.baseIds),
].map(String));
const task02ExpectedCounts = {
  outerClasses: TASK02_OUTER_CLASSES.length,
  normalizedMappings: Object.keys(actual.baseItems.simulatorBaseMap).length,
  compiledSimulatorPools: coverage.poolIds.length,
  normalizedConcreteBases: actual.baseItems.bases.length,
  uniquelyMappedConcreteBases: mappedConcreteIds.size,
  compiledMappedConcreteBases: compiledMappedIds.size,
  selectorConcreteBases: selectorConcreteIds.size,
  craftSelectableConcreteBases: selectorConcreteIds.size - disabledUnmodifiableBases.length,
  disabledUnmodifiableConcreteBases: disabledUnmodifiableBases.length,
  explicitlyBlockedConcreteBases: explicitlyBlockedIds.size,
};
const duplicateNames = duplicateDisplayNameStats(actual.baseItems, baseCatalogValidation.reverseMappings);

check('Task 02 parity counts match normalized and compiled coverage',
  stable(baseParity.task02?.counts) === stable(task02ExpectedCounts));
check('Task 02 parity covers all 31 outer classes with exact pool and base counts',
  stable(baseParity.task02?.classCoverage) === stable(task02ClassCoverage) &&
  task02ClassCoverage.reduce((sum, entry) => sum + entry.normalizedConcreteBaseCount, 0) === actual.baseItems.bases.length &&
  task02ClassCoverage.reduce((sum, entry) => sum + entry.selectorConcreteBaseCount, 0) === selectorConcreteIds.size);
const attributeFamilyIconMap = {
  attr_str: 'str',
  attr_dex: 'dex',
  attr_int: 'int',
  attr_strdex: 'str_dex',
  attr_strint: 'str_int',
  attr_dexint: 'dex_int',
  attr_all: 'str_dex_int',
};
const attributeFamilyPools = {
  body_armours: {
    str: 'body_armours_str', dex: 'body_armours_dex', int: 'body_armours_int',
    str_dex: 'body_armours_str_dex', str_int: 'body_armours_str_int',
    dex_int: 'body_armours_dex_int', str_dex_int: 'body_armours_str_dex_int',
  },
  gloves: {
    str: 'gloves_str', dex: 'gloves_dex', int: 'gloves_int', str_dex: 'gloves_str_dex',
    str_int: 'gloves_str_int', dex_int: 'gloves_dex_int', str_dex_int: 'gloves_str_dex_int',
  },
  boots: {
    str: 'boots_str', dex: 'boots_dex', int: 'boots_int', str_dex: 'boots_str_dex',
    str_int: 'boots_str_int', dex_int: 'boots_dex_int', str_dex_int: 'boots_str_dex_int',
  },
  helmets: {
    str: 'helmets_str', dex: 'helmets_dex', int: 'helmets_int', str_dex: 'helmets_str_dex',
    str_int: 'helmets_str_int', dex_int: 'helmets_dex_int', str_dex_int: 'helmets_str_dex_int',
  },
  shields: {
    str: 'shields_str', str_dex: 'shields_str_dex', str_int: 'shields_str_int',
    str_dex_int: 'shields_str_dex_int',
  },
};
const attributeFamilyCoverage = Object.fromEntries(Object.entries(attributeFamilyPools).map(([outerId, families]) => [
  outerId,
  Object.fromEntries(Object.entries(families).map(([family, poolId]) => [
    family,
    actual.baseItems.simulatorBaseMap[poolId].concreteBaseIds.length,
  ])),
]));
const classByNormalizedId = new Map(actual.baseItems.classes.map(sourceClass => [sourceClass.id, sourceClass]));
const attributeFamiliesMatchSourceClasses = Object.values(attributeFamilyPools).every(families =>
  Object.entries(families).every(([family, poolId]) =>
    actual.baseItems.simulatorBaseMap[poolId].classIds.every(classId =>
      attributeFamilyIconMap[classByNormalizedId.get(classId)?.iconKey] === family)));
check('attribute families derive from normalized source classes and remain filters, not concrete bases',
  stable(baseParity.task02?.attributeFamilies) === stable({
    derivation: 'Use the normalized source-class iconKey; attribute family is a filter and never a concrete base identity.',
    iconKeyMap: attributeFamilyIconMap,
    coverage: attributeFamilyCoverage,
  }) && attributeFamiliesMatchSourceClasses);
check('Task 02 mapping integrity and duplicate-name statistics are exact',
  stable(baseParity.task02?.mappingIntegrity) === stable({
    ambiguousBaseIds: baseCatalogValidation.ambiguousBaseIds,
    unknownMappingBaseIds: baseCatalogValidation.unknownMappingBaseIds,
    unmappedBaseIds: baseCatalogValidation.unmappedBaseIds,
    duplicateDisplayNameGroups: duplicateNames.groups,
    duplicateDisplayNameRecords: duplicateNames.records,
    samePoolDuplicateDisplayNameGroups: duplicateNames.samePoolGroups,
    samePoolDuplicateDisplayNameRecords: duplicateNames.samePoolRecords,
    identityRule: 'Stable numeric base ID, never display name.',
  }));
check('Task 02 parity records every unsupported concrete base as an explicit blocker',
  stable(baseParity.task02?.blockers) === stable({
    unmappedBases: unmappedBaseDetails,
    normalizedOnlyMappings: normalizedOnlyMappingDetails,
    emptyCompiledPools: emptyCompiledPoolDetails,
  }) && explicitlyBlockedIds.size === 17);
check('Task 02 parity distinguishes surfaced unmodifiable bases from data blockers',
  stable(baseParity.task02?.disabledBases) === stable(disabledUnmodifiableBases) &&
  stable(disabledUnmodifiableBases.map(base => base.id)) === stable([2977, 2978]));

const requiredLevelCount = actual.baseItems.bases.filter(base =>
  base.requiredLevel != null || base.requirements?.level != null).length;
const dropLevels = actual.baseItems.bases.map(base => base.dropLevel);
const plainBasePropertyCount = actual.baseItems.bases.filter(base =>
  isPlainObject(base.baseProperties) && isValidBasePropertyValue(base.baseProperties)).length;
const missingBasePropertyCount = actual.baseItems.bases.filter(base =>
  !Object.prototype.hasOwnProperty.call(base, 'baseProperties')).length;
const malformedBasePropertyIds = actual.baseItems.bases.filter(base =>
  Object.prototype.hasOwnProperty.call(base, 'baseProperties') &&
  (!isPlainObject(base.baseProperties) || !isValidBasePropertyValue(base.baseProperties))).map(base => base.id);
const sourceSocketDistribution = Object.fromEntries([...new Set(actual.baseItems.bases.map(base => base.socketCount))]
  .sort((a, b) => a - b)
  .map(value => [String(value), actual.baseItems.bases.filter(base => base.socketCount === value).length]));

check('required level remains unavailable and distinct from complete drop-level data',
  stable(baseParity.task02?.fieldCoverage?.requiredLevel) === stable({
    availableCount: requiredLevelCount,
    unavailableCount: actual.baseItems.bases.length - requiredLevelCount,
    status: 'blocked_missing_verified_data',
    handling: 'Drop level remains separate and is never substituted.',
  }) &&
  stable(baseParity.task02?.fieldCoverage?.dropLevel) === stable({
    availableCount: dropLevels.filter(Number.isFinite).length,
    minimum: Math.min(...dropLevels),
    maximum: Math.max(...dropLevels),
  }) && requiredLevelCount === 0);
check('socketCount remains a sourced field with maximum/default semantics explicitly unverified',
  stable(baseParity.task02?.fieldCoverage?.socketFields) === stable({
    sourceSocketCountAvailable: actual.baseItems.bases.filter(base => Number.isInteger(base.socketCount)).length,
    sourceSocketCountDistribution: sourceSocketDistribution,
    verifiedMaximumSocketsAvailable: actual.baseItems.bases.filter(base => base.maximumSockets != null || base.maxSockets != null).length,
    verifiedDefaultSocketsAvailable: actual.baseItems.bases.filter(base => base.defaultSockets != null).length,
    status: 'blocked_semantics_unverified',
    handling: 'Retain socketCount as a sourced value; do not reinterpret it as maximum or default sockets.',
  }));
check('base-property and icon field coverage remains exact with graceful icon fallback',
  stable(baseParity.task02?.fieldCoverage?.baseProperties) === stable({
    availableCount: plainBasePropertyCount,
    unavailableCount: missingBasePropertyCount,
    malformedSourcePayloadCount: malformedBasePropertyIds.length,
  }) &&
  baseParity.task02?.fieldCoverage?.perBaseIcon?.availableCount === actual.baseItems.bases.filter(base => !!base.icon).length &&
  baseParity.task02?.fieldCoverage?.classIcon?.availableCount === actual.baseItems.classes.filter(sourceClass => !!sourceClass.iconKey).length &&
  baseParity.task02?.fieldCoverage?.classIcon?.classCount === actual.baseItems.classes.length);
check('per-base source version absence remains an explicit blocker',
  stable(baseParity.task02?.fieldCoverage?.perBaseSourceVersion) === stable({
    availableCount: actual.baseItems.bases.filter(base => base.sourceVersion != null).length,
    status: 'blocked_source_export_has_no_embedded_game_version',
  }));
check('source anomalies remain explicit without rewriting normalized records',
  stable(malformedBasePropertyIds) === stable([2647, 2977, 2978]) &&
  stable(baseParity.task02?.sourceAnomalies?.duplicateTagRecords?.map(record => [record.id, record.tag, record.occurrences])) === stable([[5333, 'runeforged', 2]]) &&
  stable(baseParity.task02?.sourceAnomalies?.incompleteBasePropertyRecords?.map(record => [record.id, record.missingField])) === stable([[3533, 'physical_damage_min']]) &&
  stable(baseParity.task02?.sourceAnomalies?.malformedBasePropertyPayloads?.map(record => record.id)) === stable(malformedBasePropertyIds));
check('Task 02 parity declares item-state schema and deterministic legacy migration',
  baseParity.task02?.itemStateSchemaVersion === 3 &&
  typeof baseParity.task02?.migration?.legacyWithoutBaseItemId === 'string' &&
  typeof baseParity.task02?.migration?.invalidOrBlockedMapping === 'string' &&
  baseParity.fullParityClaim === false);

check('active provenance snapshot exists', !!activeSnapshot);
if (activeSnapshot) {
  check('legacy raw-source absence is explicit',
    activeSnapshot.status === 'normalized-without-raw-cache' &&
    activeSnapshot.source.rawAvailable === false &&
    activeSnapshot.source.rawPath === null &&
    typeof activeSnapshot.source.rawUnavailableReason === 'string' &&
    activeSnapshot.source.rawUnavailableReason.length > 0);
  check('provenance source identity matches normalized manifest',
    activeSnapshot.source.fileName === actual.manifest.source.fileName &&
    activeSnapshot.source.bytes === actual.manifest.source.bytes &&
    activeSnapshot.source.sha256 === actual.manifest.source.sha256 &&
    activeSnapshot.source.wrapper === actual.manifest.source.wrapper);
  check('provenance version and parser metadata are explicit',
    activeSnapshot.gameVersion.target === actual.manifest.targetGameVersion &&
    activeSnapshot.gameVersion.embedded === actual.manifest.source.embeddedGameVersion &&
    activeSnapshot.parser.path === 'tools/convert-coe-data.mjs' &&
    activeSnapshot.parser.schemaVersion === 1);
  check('provenance normalized hashes match the manifest',
    stable(activeSnapshot.normalized.outputHashes) === stable(actual.manifest.outputHashes));
}

const expectedBundle = buildNormalizedBrowserSource(NORMALIZED_DIR);
const bundlePath = path.join(HERE, 'data', 'normalized.data.js');
const actualBundle = readFileSync(bundlePath, 'utf8');
check('generated normalized browser bundle is current',
  actualBundle.replace(/\r\n?/g, '\n') === expectedBundle.replace(/\r\n?/g, '\n'));

const context = { window: {} };
vm.runInNewContext(actualBundle, context, { filename: bundlePath });
check('browser bundle matches normalized source data',
  stable(context.window.COE_NORMALIZED_DATA) === stable(actual));

const expectedRuntimeBundle = buildRuntimeBrowserSource(NORMALIZED_DIR, BASE_DIR, SHARED_DIR);
const runtimeBundlePath = path.join(HERE, 'data', 'runtime.data.js');
const actualRuntimeBundle = readFileSync(runtimeBundlePath, 'utf8');
check('generated runtime browser bundle is current',
  actualRuntimeBundle.replace(/\r\n?/g, '\n') === expectedRuntimeBundle.replace(/\r\n?/g, '\n'));

const runtimeContext = { window: {} };
vm.runInNewContext(actualRuntimeBundle, runtimeContext, { filename: runtimeBundlePath });
const runtime = runtimeContext.window.COE_RUNTIME_DATA;
const expectedRuntime = buildRuntimeData(NORMALIZED_DIR, BASE_DIR, SHARED_DIR);
check('runtime browser bundle matches the generated source projection',
  stable(runtime) === stable(expectedRuntime));
check('runtime projection retains source counts and provenance without audit-only payloads',
  runtime.counts.bases === actual.baseItems.bases.length &&
  runtime.counts.modifiers === actual.modifiers.modifiers.length &&
  runtime.counts.craftingItems === actual.craftingItems.items.length &&
  runtime.targetGameVersion === actual.manifest.targetGameVersion &&
  runtime.source.sha256 === actual.manifest.source.sha256 &&
  runtime.modifiers == null && runtime.craftingItems == null && runtime.essences == null);
const runtimeMechanics = runtime.craftingMechanics;
check('runtime mechanics projection retains exact Essence and socketable records without full audit payloads',
  runtimeMechanics?.schemaVersion === 1 &&
  runtimeMechanics.targetGameVersion === actual.manifest.targetGameVersion &&
  runtimeMechanics.socketCapacity?.sourceField === 'baseItems.bases[].socketCount' &&
  runtimeMechanics.socketCapacity?.interpretation === 'inferred_maximum' &&
  runtimeMechanics.socketCapacity?.defaultSockets === 0 &&
  runtimeMechanics.socketCapacity?.confidence === 'inferred' &&
  Object.keys(runtimeMechanics.essencesByItemId || {}).length ===
    actual.essences.essences.filter(essence => Number(essence.type) <= 4).length &&
  Object.keys(runtimeMechanics.essenceModifiersById || {}).length === 152 &&
  runtimeMechanics.essencesByItemId?.['99']?.transition === 'magic_to_rare_add' &&
  runtimeMechanics.essencesByItemId?.['125']?.transition === 'rare_remove_add' &&
  runtimeMechanics.essenceModifiersById?.['83']?.modifierGroup === 'IncreasedLife' &&
  Object.keys(runtimeMechanics.socketablesByItemId || {}).length === actual.craftingItems.socketables.length &&
  stable(runtimeMechanics.socketableTypes) === stable(['Rune', 'SoulCore', 'Idol', 'AbyssalEye', 'CongealedMist']) &&
  runtimeMechanics.socketablesByItemId?.['624']?.effects?.armour?.statId === 'base_fire_damage_resistance_%' &&
  runtimeMechanics.socketablesByItemId?.['5081']?.limit === 0 &&
  runtimeMechanics.socketableLimits?.[0]?.number === 1);
check('runtime projection preserves every simulator mapping and concrete base identity',
  stable(runtime.baseItems.simulatorBaseMap) === stable(actual.baseItems.simulatorBaseMap) &&
  stable(runtime.baseItems.bases.map(base => base.id)) === stable(actual.baseItems.bases.map(base => base.id)) &&
  stable(runtime.baseItems.classes.map(sourceClass => sourceClass.id)) === stable(actual.baseItems.classes.map(sourceClass => sourceClass.id)));
const expectedImplicitIds = [...new Set(actual.baseItems.bases.flatMap(base => base.implicitModifierIds || []))]
  .map(String).sort((left, right) => Number(left) - Number(right));
const runtimeOverlayModifierIds = [...new Set(Object.values(runtime.overlayByPool)
  .flatMap(rows => rows.map(([, modifierId]) => String(modifierId))))]
  .sort((left, right) => Number(left) - Number(right));
check('runtime projection retains exactly the implicit and source modifiers it references',
  stable(Object.keys(runtime.implicits)) === stable(expectedImplicitIds) &&
  stable(Object.keys(runtime.sourceModifiers)) === stable(runtimeOverlayModifierIds) &&
  Object.values(runtime.overlayByPool).every(rows => rows.every(row =>
    Array.isArray(row) && row.length === 7 && runtime.sourceModifiers[row[1]])));

const runtimeBaseFields = [
  'id', 'metadataKey', 'displayName', 'itemClass', 'equipmentSlot',
  'classId', 'modifierPoolClassId', 'requiredLevel', 'dropLevel', 'tags',
  'requirements', 'baseProperties', 'implicitModifierIds', 'socketCount',
  'icon', 'unmodifiable',
];
const projectFields = (source, fields) => Object.fromEntries(fields
  .filter(field => Object.prototype.hasOwnProperty.call(source, field))
  .map(field => [field, source[field]]));
check('runtime concrete-base records preserve every field consumed by the browser',
  stable(runtime.baseItems.bases) === stable(actual.baseItems.bases.map(base => projectFields(base, runtimeBaseFields))) &&
  stable(runtime.baseItems.classes) === stable(actual.baseItems.classes.map(sourceClass =>
    projectFields(sourceClass, ['id', 'iconKey']))));

const fullModifiersById = new Map(actual.modifiers.modifiers.map(modifier => [modifier.id, modifier]));
check('runtime implicit tuples preserve exact source identity, group, and stats',
  expectedImplicitIds.every(id => {
    const modifier = fullModifiersById.get(Number(id));
    return stable(runtime.implicits[id]) === stable([
      modifier?.key ?? null,
      modifier?.modifierGroupId ?? null,
      modifier?.modifierGroup ?? null,
      modifier?.stats || [],
    ]);
  }));
check('runtime source-modifier tuples preserve exact identity and tag conditions',
  runtimeOverlayModifierIds.every(id => {
    const modifier = fullModifiersById.get(Number(id));
    return stable(runtime.sourceModifiers[id]) === stable([
      modifier?.key ?? null,
      modifier?.modifierGroupId ?? null,
      modifier?.modifierTags || [],
      modifier?.requiredTags || [],
      modifier?.forbiddenTags || [],
      modifier?.weightConditions || [],
    ]);
  }));

const sharedPools = {};
if (existsSync(SHARED_DIR)) {
  for (const file of readdirSync(SHARED_DIR).filter(file => file.endsWith('.json')).sort()) {
    sharedPools[file.replace(/\.json$/, '')] = readJson(path.join(SHARED_DIR, file));
  }
}
const resolvedBasePools = {};
for (const file of readdirSync(BASE_DIR).filter(file => file.endsWith('.json')).sort()) {
  const id = file.replace(/\.json$/, '');
  const source = readJson(path.join(BASE_DIR, file));
  if (!Array.isArray(source.inherits) || source.inherits.length === 0) {
    resolvedBasePools[id] = source;
    continue;
  }
  const prefixes = source.inherits.flatMap(key => sharedPools[key]?.prefixes || []);
  const suffixes = source.inherits.flatMap(key => sharedPools[key]?.suffixes || []);
  resolvedBasePools[id] = {
    ...source,
    prefixes: [...prefixes, ...(source.prefixes || [])],
    suffixes: [...suffixes, ...(source.suffixes || [])],
  };
}
const zeroMagicCapacityBases = auditZeroMagicCapacityBases(
  actual.baseItems,
  actual.modifiers,
  resolvedBasePools,
);
check('selectable zero-Magic-capacity concrete-base audit matches the reviewed dataset',
  stable(zeroMagicCapacityBases) === stable([{
    baseItemId: 2563,
    displayName: 'Absent Amulet',
    simulatorPoolId: 'amulets',
    magic: { prefixes: 0, suffixes: 0 },
  }]),
  `found ${stable(zeroMagicCapacityBases)}`);
console.log(`  INFO  zero-Magic-capacity selectable bases: ${zeroMagicCapacityBases
  .map(base => `${base.displayName} (${base.baseItemId}, ${base.simulatorPoolId}, ${base.magic.prefixes}/${base.magic.suffixes})`)
  .join(', ') || 'none'}`);
const modifierOverlayAudit = buildModifierOverlayAudit(
  resolvedBasePools,
  actual.baseItems,
  actual.modifiers,
);
check('every legacy modifier tier maps uniquely to a normalized stable modifier',
  modifierOverlayAudit.summary.totalRows === 7929 &&
  modifierOverlayAudit.summary.matchedRows === 7929 &&
  modifierOverlayAudit.failures.length === 0,
  stable(modifierOverlayAudit.summary));
check('modifier overlay matcher records the reviewed deterministic strategy counts',
  stable(modifierOverlayAudit.summary.matchStrategies) === stable({
    coarse: 7466,
    range: 79,
    semantic: 384,
  }));
check('modifier audit detects every failure in the former coarse overlay matcher',
  stable(modifierOverlayAudit.summary.legacyMatcher) === stable({
    unique: 6002,
    ambiguous: 474,
    missing: 1453,
    wrongUnique: 6,
  }));

const expectedOverlayByPool = Object.fromEntries(
  Object.keys(actual.baseItems.simulatorBaseMap).map(poolId => [poolId, []]));
for (const row of modifierOverlayAudit.rows) {
  expectedOverlayByPool[row.poolId].push([
    row.overlayKey,
    row.modifier.id,
    row.poolSpawnWeight,
    row.displayTier,
    row.modifier.tier ?? null,
    row.matchStrategy,
    row.poolSpawnWeight == null ? row.classWeights : null,
  ]);
}
check('runtime modifier overlays exactly preserve stable identity, display tiers, and class weights',
  stable(runtime.overlayByPool) === stable(expectedOverlayByPool));
check('every source-backed display tier is the required-level rank within its concrete pool and source group',
  modifierOverlayAudit.rows.every(row => Number.isInteger(row.displayTier) && row.displayTier > 0) &&
  modifierOverlayAudit.rows.filter(row =>
    Number(row.legacyTier.tier) !== Number(row.displayTier)).length === 520);
check('identical required levels never receive inconsistent display tiers within a source group',
  [...new Set(modifierOverlayAudit.rows.map(row =>
    `${row.poolId}|${row.affix}|${row.modifier.modifierGroupId}|${row.legacyTier.ilvlReq}`))]
    .every(identity => {
      const [poolId, affix, sourceGroupId, requiredLevel] = identity.split('|');
      return new Set(modifierOverlayAudit.rows
        .filter(row => row.poolId === poolId && row.affix === affix &&
          String(row.modifier.modifierGroupId) === sourceGroupId &&
          String(row.legacyTier.ilvlReq) === requiredLevel)
        .map(row => row.displayTier)).size === 1;
    }));

if (existsSync(COVERAGE_PATH)) {
  const report = readJson(COVERAGE_PATH);
  check('coverage report identifies the active snapshot',
    report.activeSnapshotId === provenance.activeSnapshotId);
  check('coverage report matches current pool coverage',
    report.counts.legacyPools === coverage.poolIds.length &&
    report.counts.normalizedMappings === coverage.normalizedIds.length &&
    stable(report.gaps.emptyLegacyPools) === stable(coverage.emptyPools) &&
    stable(report.gaps.normalizedOnlyMappings) === stable(coverage.normalizedOnly) &&
    stable(report.gaps.allOneWeightPools) === stable(coverage.allOneWeightPools));
}

if (sourcePath) {
  check('explicit raw source exists', existsSync(sourcePath), sourcePath);
  if (existsSync(sourcePath)) {
    const raw = readFileSync(sourcePath, 'utf8');
    try {
      const parsed = parseCoeExport(raw);
      const expected = normalizeCoeData(parsed.data, {
        fileName: path.basename(sourcePath),
        bytes: Buffer.byteLength(raw),
        sha256: sha256(raw),
        wrapper: parsed.wrapper,
      });
      check('explicit raw source reproduces normalized outputs',
        Object.keys(actual).every(key => stable(actual[key]) === stable(expected[key])));
    } catch (error) {
      check('explicit raw source parses and normalizes', false, error.message);
    }
  }
} else {
  console.log('\n  INFO  Raw export re-conversion skipped; no --source path was supplied.');
  console.log('        Repository provenance explicitly records that the legacy raw export is unavailable.');
}

console.log(`\n${passed} passed, ${failed} failed.`);
if (failed) process.exit(1);
