#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { normalizeCoeData, parseCoeExport } from './tools/convert-coe-data.mjs';
import { buildNormalizedBrowserSource } from './tools/build-normalized-data.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NORMALIZED_DIR = path.join(HERE, 'data', 'normalized');
const PROVENANCE_PATH = path.join(HERE, 'data', 'source-cache', 'provenance.json');
const COVERAGE_PATH = path.join(HERE, 'reports', 'data-coverage.json');
const BASE_PARITY_PATH = path.join(HERE, 'reports', 'base-item-parity.json');
const CRAFTING_PARITY_PATH = path.join(HERE, 'reports', 'crafting-parity.json');
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
check('crafting parity baseline matches the classified currency index',
  craftingParity.targetGameVersion === currencyIndex.targetGameVersion &&
  craftingParity.fullParityClaim === false &&
  craftingParity.counts.sourceEntries === currencyIndex.counts.entries &&
  craftingParity.counts.runtimeDefinitions === currencyIndex.counts.runtimeDefinitions &&
  stable(craftingParity.counts.sourceByClassification) === stable(currencyIndex.counts.byClassification) &&
  stable(craftingParity.counts.runtimeByClassification) === stable(currencyIndex.counts.runtimeByClassification));

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
check('generated normalized browser bundle is current', actualBundle === expectedBundle);

const context = { window: {} };
vm.runInNewContext(actualBundle, context, { filename: bundlePath });
check('browser bundle matches normalized source data',
  stable(context.window.COE_NORMALIZED_DATA) === stable(actual));

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
