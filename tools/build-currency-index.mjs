#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOL_DIR, '..');
const NORMALIZED_DIR = path.join(ROOT, 'data', 'normalized');
const OUTPUT_DIR = path.join(ROOT, 'data', 'crafting');
const JSON_OUTPUT = path.join(OUTPUT_DIR, 'currency-index.json');
const BROWSER_OUTPUT = path.join(OUTPUT_DIR, 'currency-index.data.js');
const REPORT_OUTPUT = path.join(ROOT, 'reports', 'currency-coverage.md');
const TARGET_VERSION = '0.5.4';

const CLASSIFICATIONS = Object.freeze([
  'implemented',
  'conditional',
  'non_item_currency',
  'blocked_missing_data',
  'probability_unverified',
  'intentionally_out_of_scope',
  'deprecated_for_target_version',
]);

// Stable UI identities remain unchanged. This table is the migration bridge
// between the proven app.js handlers and the repository-owned data index.
const RUNTIME_CRAFTS = Object.freeze([
  ['transmutation', 'Orb of Transmutation', true],
  ['greater-transmutation', 'Greater Orb of Transmutation', true],
  ['perfect-transmutation', 'Perfect Orb of Transmutation', true],
  ['augmentation', 'Orb of Augmentation', true],
  ['greater-augmentation', 'Greater Orb of Augmentation', true],
  ['perfect-augmentation', 'Perfect Orb of Augmentation', true],
  ['alchemy', 'Orb of Alchemy', true],
  ['regal', 'Regal Orb', true],
  ['greater-regal', 'Greater Regal Orb', true],
  ['perfect-regal', 'Perfect Regal Orb', true],
  ['exalted', 'Exalted Orb', true],
  ['greater-exalted', 'Greater Exalted Orb', true],
  ['perfect-exalted', 'Perfect Exalted Orb', true],
  ['chaos', 'Chaos Orb', true],
  ['greater-chaos', 'Greater Chaos Orb', true],
  ['perfect-chaos', 'Perfect Chaos Orb', true],
  ['annulment', 'Orb of Annulment', true],
  ['divine', 'Divine Orb', true],
  ['fracturing', 'Fracturing Orb', true],
  ['hinekora', "Hinekora's Lock", true],
  ['omen-sinistral-necromancy', 'Omen of Sinistral Necromancy', true],
  ['omen-dextral-necromancy', 'Omen of Dextral Necromancy', true],
  ['omen-abyssal-echoes', 'Omen of Abyssal Echoes', true],
  ['omen-light', 'Omen of Light', true],
  ['omen-sovereign', 'Omen of the Sovereign', false],
  ['omen-liege', 'Omen of the Liege', false],
  ['omen-blackblooded', 'Omen of the Blackblooded', false],
  ['omen-whittling', 'Omen of Whittling', true],
  ['omen-sinistral-erasure', 'Omen of Sinistral Erasure', true],
  ['omen-dextral-erasure', 'Omen of Dextral Erasure', true],
  ['omen-sinistral-annulment', 'Omen of Sinistral Annulment', true],
  ['omen-dextral-annulment', 'Omen of Dextral Annulment', true],
  ['omen-sanctification', 'Omen of Sanctification', true],
  ['preserved-cranium', 'Preserved Cranium', true],
  ['essence-abyss', 'Essence of the Abyss', true],
  ['essence-breach', 'Essence of the Breach', false],
  ['vaal', 'Vaal Orb', true],
].map(([id, displayName, supported]) => ({ id, displayName, supported })));

const OFFICIAL_SOURCES = Object.freeze([
  {
    id: 'ggg-0.5.0',
    type: 'official_patch_notes',
    url: 'https://www.pathofexile.com/forum/view-thread/3932540',
    version: '0.5.0',
  },
  {
    id: 'ggg-0.5.4',
    type: 'official_patch_notes',
    url: 'https://www.pathofexile.com/forum/view-thread/3975218',
    version: '0.5.4',
  },
  {
    id: 'ggg-0.5.4-hotfix',
    type: 'official_patch_notes',
    url: 'https://www.pathofexile.com/forum/view-thread/3975342',
    version: '0.5.4',
  },
  {
    id: 'ggg-0.5.4-hotfix-2',
    type: 'official_patch_notes',
    url: 'https://www.pathofexile.com/forum/view-thread/3976201',
    version: '0.5.4',
  },
]);

function readJson(fileName) {
  return JSON.parse(readFileSync(path.join(NORMALIZED_DIR, fileName), 'utf8'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function addToMapArray(map, key, value) {
  if (key == null) return;
  const normalized = String(key);
  if (!map.has(normalized)) map.set(normalized, []);
  map.get(normalized).push(value);
}

function buildMethodIndex(methods) {
  const byItemId = new Map();
  const visit = (method, inheritedConstraints = [], category = null) => {
    const nextCategory = method.label || category;
    const constraints = [...new Set([...inheritedConstraints, ...(method.constraints || [])])];
    if (method.itemId != null) {
      addToMapArray(byItemId, method.itemId, {
        methodId: method.id,
        category: nextCategory,
        handler: method.handler,
        constraints,
        omens: method.omens || [],
        properties: method.properties || [],
      });
    }
    for (const child of method.elements || []) visit(child, constraints, nextCategory);
  };
  for (const method of methods || []) visit(method);
  return byItemId;
}

function runtimeClassification(runtimeCraft) {
  if (!runtimeCraft.supported) return 'blocked_missing_data';
  // Exact Vaal outcome probabilities are not present in the target-version
  // sources. The mutation exists, but statistical simulation is not certified.
  if (runtimeCraft.id === 'vaal') return 'probability_unverified';
  return 'implemented';
}

function isDeprecated(item) {
  const name = item.displayName || '';
  const key = item.metadataKey || '';
  return /\[DNT-Unused\]/i.test(name) ||
    /Omen of (?:Recombination|Corruption)$/i.test(name) ||
    /SentinelCurrency(?:Armour|Jewellery|Weapon)/i.test(key);
}

function fallbackClassification(item) {
  if (isDeprecated(item)) return 'deprecated_for_target_version';
  // Every retained normalized item is an item-affecting method, Omen, Essence,
  // Catalyst, socketable, emotion, or explicitly retained data-only crafting
  // resource. Until an exact state transition is implemented, it stays blocked.
  return 'blocked_missing_data';
}

function explanationFor(classification, runtimeCraft = null) {
  switch (classification) {
    case 'implemented':
      return `Implemented by stable runtime craft ${runtimeCraft?.id || 'unknown'}.`;
    case 'probability_unverified':
      return 'Mutation is implemented, but target-version outcome probabilities are not encoded by the retained public data.';
    case 'deprecated_for_target_version':
      return 'Source record is retained for audit, but is unused/deprecated for the 0.5.4 target.';
    case 'blocked_missing_data':
      return runtimeCraft
        ? `Visible registry entry ${runtimeCraft.id} remains disabled until its exact target-version mutation is verified.`
        : 'Source identity is known, but a complete target-version applicability/mutation specification is not yet implemented.';
    default:
      return 'Classified by the repository-owned crafting inventory.';
  }
}

export function buildCurrencyIndex() {
  const crafting = readJson('crafting-items.json');
  const essences = readJson('essences.json');
  const manifestRaw = readFileSync(path.join(NORMALIZED_DIR, 'version-manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const methodByItemId = buildMethodIndex(crafting.methods);
  const omenByItemId = new Map((crafting.omens || []).map(omen => [String(omen.itemId), omen]));
  const essenceByItemId = new Map((essences.essences || []).map(essence => [String(essence.itemId), essence]));
  const runtimeByName = new Map();
  for (const runtime of RUNTIME_CRAFTS) addToMapArray(runtimeByName, runtime.displayName, runtime);

  const entries = (crafting.items || []).map(item => {
    const runtimeCrafts = runtimeByName.get(item.displayName) || [];
    const classification = runtimeCrafts.length
      ? runtimeClassification(runtimeCrafts[0])
      : fallbackClassification(item);
    if (!CLASSIFICATIONS.includes(classification)) throw new Error(`Unclassified crafting item ${item.id}`);
    return {
      id: `source-item:${item.id}`,
      sourceItemId: item.id,
      metadataKey: item.metadataKey,
      displayName: item.displayName,
      classification,
      reason: explanationFor(classification, runtimeCrafts[0] || null),
      runtimeCraftIds: runtimeCrafts.map(runtime => runtime.id),
      sourceClassifications: item.classifications || [],
      sourceTags: (item.tags || []).map(tag => tag.key || tag).filter(Boolean),
      methods: methodByItemId.get(String(item.id)) || [],
      omen: omenByItemId.get(String(item.id)) || null,
      essence: essenceByItemId.get(String(item.id)) || null,
    };
  }).sort((a, b) => Number(a.sourceItemId) - Number(b.sourceItemId));

  const entryByName = new Map(entries.map(entry => [entry.displayName, entry]));
  const runtimeRegistry = Object.fromEntries(RUNTIME_CRAFTS.map(runtime => {
    const source = entryByName.get(runtime.displayName) || null;
    const classification = runtimeClassification(runtime);
    return [runtime.id, {
      id: runtime.id,
      displayName: runtime.displayName,
      supported: runtime.supported,
      classification,
      reason: explanationFor(classification, runtime),
      sourceItemId: source?.sourceItemId ?? null,
      metadataKey: source?.metadataKey ?? null,
      sourceHandlers: [...new Set((source?.methods || []).map(method => method.handler).filter(Boolean))],
      sourceMissing: !source,
    }];
  }));

  const counts = Object.fromEntries(CLASSIFICATIONS.map(status => [
    status,
    entries.filter(entry => entry.classification === status).length,
  ]));
  const runtimeCounts = Object.fromEntries(CLASSIFICATIONS.map(status => [
    status,
    Object.values(runtimeRegistry).filter(entry => entry.classification === status).length,
  ]));

  return {
    schemaVersion: 1,
    targetGameVersion: TARGET_VERSION,
    generatedFrom: {
      normalizedManifestSha256: sha256(manifestRaw.trim()),
      normalizedSourceSha256: manifest.source?.sha256 || null,
      normalizedSourceVersionStatus: manifest.source?.versionStatus || null,
    },
    allowedClassifications: CLASSIFICATIONS,
    sources: OFFICIAL_SOURCES,
    migration: {
      mode: 'data-metadata-overlay',
      behaviorOwner: 'Existing CraftingEngine/app.js handlers remain authoritative until migrated operation-by-operation.',
      runtimeDefinitions: RUNTIME_CRAFTS.length,
    },
    counts: {
      entries: entries.length,
      byClassification: counts,
      runtimeDefinitions: RUNTIME_CRAFTS.length,
      runtimeByClassification: runtimeCounts,
      unclassified: 0,
    },
    runtimeRegistry,
    entries,
  };
}

function coverageMarkdown(index) {
  const rows = index.allowedClassifications
    .map(status => `| ${status} | ${index.counts.byClassification[status]} | ${index.counts.runtimeByClassification[status]} |`)
    .join('\n');
  const blockedRuntime = Object.values(index.runtimeRegistry)
    .filter(entry => entry.classification === 'blocked_missing_data')
    .map(entry => `- \`${entry.id}\` — ${entry.displayName}: ${entry.reason}`)
    .join('\n');
  const missingRuntimeSources = Object.values(index.runtimeRegistry)
    .filter(entry => entry.sourceMissing)
    .map(entry => `- \`${entry.id}\` — ${entry.displayName}`)
    .join('\n') || '- None.';
  return `# Currency coverage\n\n` +
    `Target game version: **${index.targetGameVersion}**\n\n` +
    `This report is generated from \`data/crafting/currency-index.json\`. Classification is exclusive; every retained item has exactly one status.\n\n` +
    `| Classification | Source inventory | Runtime registry |\n|---|---:|---:|\n${rows}\n\n` +
    `- Total source inventory entries: **${index.counts.entries}**\n` +
    `- Existing runtime definitions preserved: **${index.counts.runtimeDefinitions}**\n` +
    `- Unclassified entries: **${index.counts.unclassified}**\n\n` +
    `## Disabled existing registry entries\n\n${blockedRuntime || '- None.'}\n\n` +
    `## Runtime identities missing from normalized item names\n\n${missingRuntimeSources}\n\n` +
    `A missing normalized identity does not disable an already verified handler; it is recorded so future source imports can reconcile the stable item ID.\n`;
}

export function writeCurrencyIndex(index = buildCurrencyIndex()) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(path.dirname(REPORT_OUTPUT), { recursive: true });
  const json = `${JSON.stringify(index, null, 2)}\n`;
  writeFileSync(JSON_OUTPUT, json, 'utf8');
  writeFileSync(BROWSER_OUTPUT, `window.CRAFTING_CURRENCY_INDEX=${JSON.stringify(index)};\n`, 'utf8');
  writeFileSync(REPORT_OUTPUT, coverageMarkdown(index), 'utf8');
  return index;
}

function runCli() {
  const checkOnly = process.argv.includes('--check');
  const index = buildCurrencyIndex();
  const expectedJson = `${JSON.stringify(index, null, 2)}\n`;
  const expectedBrowser = `window.CRAFTING_CURRENCY_INDEX=${JSON.stringify(index)};\n`;
  const expectedReport = coverageMarkdown(index);
  if (checkOnly) {
    const checks = [
      [JSON_OUTPUT, expectedJson],
      [BROWSER_OUTPUT, expectedBrowser],
      [REPORT_OUTPUT, expectedReport],
    ];
    for (const [file, expected] of checks) {
      if (readFileSync(file, 'utf8') !== expected) throw new Error(`${path.relative(ROOT, file)} is stale.`);
    }
    console.log(`Currency index is current (${index.counts.entries} entries, ${index.counts.unclassified} unclassified).`);
    return;
  }
  writeCurrencyIndex(index);
  console.log(`Generated currency index (${index.counts.entries} entries; ${index.counts.runtimeDefinitions} runtime definitions).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
