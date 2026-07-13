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
const REGISTRY_SOURCE = path.join(OUTPUT_DIR, 'runtime-registry.json');
const REPORT_OUTPUT = path.join(ROOT, 'reports', 'currency-coverage.md');
const TARGET_VERSION = '0.5.4';
const INDEX_SCHEMA_VERSION = 2;

const CLASSIFICATIONS = Object.freeze([
  'implemented',
  'conditional',
  'non_item_currency',
  'blocked_missing_data',
  'probability_unverified',
  'intentionally_out_of_scope',
  'deprecated_for_target_version',
]);

const REQUIRED_TABS = Object.freeze([
  'currency', 'quality', 'socketing', 'ritual', 'essences',
  'abyss', 'breach', 'delirium', 'runeforging', 'corruption',
]);

const REQUIRED_DEFINITION_FIELDS = Object.freeze([
  'craftId', 'id', 'sourceItemId', 'metadataKey', 'sourceIdentityStatus',
  'displayName', 'category', 'tab', 'tabOrder', 'displayOrder',
  'equipmentRelevance', 'iconId', 'iconFallback', 'accentColor',
  'cssClasses', 'description', 'actionType', 'activation', 'engineAction',
  'applicabilityPredicate', 'disabledReasonHandler', 'disabledReason',
  'handler', 'sourceHandler', 'triggeringAction', 'omenInteraction',
  'corruptionRestriction', 'validItemClasses', 'validItemTags',
  'qualityRestriction', 'socketRestriction', 'operationOptions',
  'sourceEvidence', 'implementationStatus', 'verificationStatus',
  'blocker', 'testFixtureIds', 'supported', 'visible', 'targetGameVersion',
]);

const TAB_ACCENTS = Object.freeze({
  currency: '#c8a848',
  quality: '#b9a88d',
  socketing: '#8db5c7',
  ritual: '#d4af5a',
  essences: '#b45ac8',
  abyss: '#5fd38a',
  breach: '#c0506f',
  delirium: '#9c83c9',
  runeforging: '#8bb7a0',
  corruption: '#c02040',
});

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

function readRegistrySource() {
  return JSON.parse(readFileSync(REGISTRY_SOURCE, 'utf8'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function addToMapArray(map, key, value) {
  if (key == null) return;
  const normalized = String(key);
  if (!map.has(normalized)) map.set(normalized, []);
  map.get(normalized).push(value);
}

function unique(values) {
  return [...new Set((values || []).filter(value => value != null && value !== ''))];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
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
  return runtimeCraft.implementationStatus;
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
      return `Implemented by stable runtime craft ${runtimeCraft?.craftId || runtimeCraft?.id || 'unknown'}.`;
    case 'probability_unverified':
      return 'Mutation is implemented, but target-version outcome probabilities are not encoded by the retained public data.';
    case 'deprecated_for_target_version':
      return 'Source record is retained for audit, but is unused/deprecated for the 0.5.4 target.';
    case 'blocked_missing_data':
      return runtimeCraft
        ? runtimeCraft.disabledReason || runtimeCraft.blocker
        : 'Source identity is known, but a complete target-version applicability/mutation specification is not yet implemented.';
    default:
      return 'Classified by the repository-owned crafting inventory.';
  }
}

function validateRuntimeRegistrySource(registry, craftingItems) {
  assert(registry?.schemaVersion === 1, 'Unsupported runtime registry source schema.');
  assert(registry.targetGameVersion === TARGET_VERSION,
    `Runtime registry target ${registry.targetGameVersion} does not match ${TARGET_VERSION}.`);
  assert(Array.isArray(registry.tabs) && registry.tabs.length === REQUIRED_TABS.length,
    `Runtime registry must define exactly ${REQUIRED_TABS.length} tabs.`);
  assert(Array.isArray(registry.definitions) && registry.definitions.length === 37,
    'Runtime registry must preserve exactly 37 visible definitions at the Task 03 boundary.');

  const tabIds = registry.tabs.map(tab => tab.id);
  assert(JSON.stringify(tabIds) === JSON.stringify(REQUIRED_TABS),
    `Runtime registry tabs must remain in the required order: ${REQUIRED_TABS.join(', ')}.`);
  assert(new Set(registry.tabs.map(tab => tab.order)).size === registry.tabs.length,
    'Runtime registry tab orders must be unique.');
  for (const tab of registry.tabs) {
    assert(typeof tab.id === 'string' && typeof tab.label === 'string' &&
      Number.isFinite(tab.order) && typeof tab.description === 'string',
    `Runtime registry tab ${tab.id || '(missing)'} is malformed.`);
  }

  const itemById = new Map(craftingItems.map(item => [String(item.id), item]));
  const definitionIds = new Set();
  const claimedSourceIds = new Set();
  const handAuthoredFields = REQUIRED_DEFINITION_FIELDS.filter(field =>
    !['id', 'sourceIdentityStatus', 'tab', 'tabOrder', 'targetGameVersion'].includes(field));

  for (const definition of registry.definitions) {
    for (const field of handAuthoredFields) {
      assert(Object.prototype.hasOwnProperty.call(definition, field),
        `Runtime definition ${definition.craftId || '(missing)'} lacks ${field}.`);
    }
    assert(typeof definition.craftId === 'string' && definition.craftId.length > 0,
      'Runtime definition has no stable craft ID.');
    assert(!definitionIds.has(definition.craftId), `Duplicate runtime craft ID ${definition.craftId}.`);
    definitionIds.add(definition.craftId);
    assert(REQUIRED_TABS.includes(definition.category),
      `Runtime definition ${definition.craftId} uses unknown category ${definition.category}.`);
    assert(CLASSIFICATIONS.includes(definition.implementationStatus),
      `Runtime definition ${definition.craftId} has invalid implementation status.`);
    assert(definition.visible === true,
      `Existing runtime definition ${definition.craftId} must remain visible.`);
    assert(Array.isArray(definition.cssClasses) && Array.isArray(definition.validItemClasses) &&
      Array.isArray(definition.validItemTags) && Array.isArray(definition.sourceEvidence) &&
      Array.isArray(definition.testFixtureIds),
    `Runtime definition ${definition.craftId} has malformed array metadata.`);
    assert(definition.omenInteraction && typeof definition.omenInteraction === 'object',
      `Runtime definition ${definition.craftId} lacks Omen interaction metadata.`);
    if (definition.supported) {
      assert(typeof definition.applicabilityPredicate === 'string' && definition.applicabilityPredicate &&
        typeof definition.disabledReasonHandler === 'string' && definition.disabledReasonHandler &&
        typeof definition.handler === 'string' && definition.handler,
      `Supported runtime definition ${definition.craftId} lacks validator or handler metadata.`);
    } else {
      assert(typeof definition.disabledReason === 'string' && definition.disabledReason.length > 20 &&
        typeof definition.blocker === 'string' && definition.blocker.length > 20,
      `Blocked runtime definition ${definition.craftId} lacks a precise disabled reason.`);
    }

    if (definition.sourceItemId == null || definition.metadataKey == null) {
      assert(definition.sourceItemId == null && definition.metadataKey == null,
        `Runtime definition ${definition.craftId} must provide both source identity fields or neither.`);
      continue;
    }
    const source = itemById.get(String(definition.sourceItemId));
    assert(source, `Runtime definition ${definition.craftId} references unknown source item ${definition.sourceItemId}.`);
    assert(source.metadataKey === definition.metadataKey,
      `Runtime definition ${definition.craftId} metadata key does not match source item ${definition.sourceItemId}.`);
    assert(source.displayName === definition.displayName,
      `Runtime definition ${definition.craftId} display name does not match its explicit source item.`);
    assert(!claimedSourceIds.has(String(definition.sourceItemId)),
      `Source item ${definition.sourceItemId} is claimed by more than one runtime definition.`);
    claimedSourceIds.add(String(definition.sourceItemId));
  }

  assert(registry.definitions.filter(definition => definition.sourceItemId == null).length === 1,
    'Exactly one runtime-only definition (Hinekora\'s Lock) is expected.');
  for (const definition of registry.definitions) {
    const triggers = [definition.triggeringAction, definition.omenInteraction?.triggerCraftId].filter(Boolean);
    for (const trigger of triggers) {
      assert(definitionIds.has(trigger),
        `Runtime definition ${definition.craftId} references unknown trigger ${trigger}.`);
    }
  }
}

function categoryForSource(item, methods) {
  const classifications = new Set(item.classifications || []);
  const handlers = new Set((methods || []).map(method => method.handler).filter(Boolean));
  const identity = `${item.displayName || ''} ${item.metadataKey || ''}`;
  if ([...handlers].some(handler => handler === 'poe2_desecrate_breach')) return 'breach';
  if ([...handlers].some(handler => /^poe2_desecrate_/.test(handler))) return 'abyss';
  if (classifications.has('quality-currency')) return 'quality';
  if (classifications.has('socket-currency') || classifications.has('socketable')) return 'socketing';
  if (classifications.has('omen')) return 'ritual';
  if (classifications.has('catalyst')) return 'breach';
  if (classifications.has('distilled-emotion')) return 'delirium';
  if (classifications.has('runeforging-data-only') ||
      /(?:Resistance Flux|Alloy|Runeforg)/i.test(identity)) return 'runeforging';
  // Essence names such as "Essence of Hysteria" carry corruption-flavoured
  // metadata, but their explicit normalized classification owns the tab.
  if (classifications.has('essence')) return 'essences';
  if (classifications.has('sacrifice-data-only') ||
      [...handlers].some(handler => /(?:vaal|architect|infuser)/i.test(handler)) ||
      /(?:Vaal|Corrupt|Sacrifice|Atziri|Temple|Architect|Infuser)/i.test(identity)) return 'corruption';
  return 'currency';
}

function fallbackBlocker(entry, category) {
  if (entry.classification === 'deprecated_for_target_version') {
    return `${entry.displayName} is retained for audit but is deprecated or unused for target version ${TARGET_VERSION}.`;
  }
  if (entry.classification === 'probability_unverified') {
    return `Mechanic blocked because exact target-version outcome probabilities for ${entry.displayName} are not verified.`;
  }
  if (category === 'quality') {
    const sourceId = Number(entry.sourceItemId);
    if ([0, 1, 6, 28].includes(sourceId)) {
      return `Mechanic blocked because the exact target-version 0.5.4 item-level increment formula, breakpoints, and rounding for ${entry.displayName} are not verified.`;
    }
    if ([65, 66, 67, 68].includes(sourceId)) {
      return `Mechanic blocked because the exact target-version ${entry.displayName} quality mutation, cap, corruption outcome, and increment are not verified.`;
    }
  }
  const details = {
    currency: 'its exact applicability and item-state mutation',
    quality: 'its exact quality applicability, increment, and cap behavior',
    socketing: 'its exact socket applicability, limit, and socketed effect',
    ritual: 'its exact triggering operation, applicability, and consumption behavior',
    essences: 'its guaranteed modifier mapping and item-class applicability',
    abyss: 'its exact Desecration or Abyss item-state mutation',
    breach: 'its exact Breach or Genesis applicability and mutation',
    delirium: 'its exact instilling recipe or guaranteed modifier effect',
    runeforging: 'its exact Expedition or Runeforging applicability and mutation',
    corruption: 'its exact corruption, sacrifice, or Temple outcome behavior',
  };
  return `Mechanic blocked because ${details[category]} for ${entry.displayName} is not verified for target version ${TARGET_VERSION}.`;
}

function fallbackIconText(displayName) {
  const words = String(displayName || '').replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  return words.length === 1 ? words[0].slice(0, 5) : words.slice(0, 4).map(word => word[0]).join('');
}

function completeAuthoredDefinition(definition, sourceEntry, tabById) {
  const tab = tabById.get(definition.category);
  return {
    craftId: definition.craftId,
    id: definition.craftId,
    sourceItemId: sourceEntry?.sourceItemId ?? null,
    metadataKey: sourceEntry?.metadataKey ?? null,
    sourceIdentityStatus: sourceEntry ? 'normalized_exact' : 'runtime_only_unresolved',
    displayName: definition.displayName,
    category: definition.category,
    tab: definition.category,
    tabOrder: tab.order,
    displayOrder: definition.displayOrder,
    equipmentRelevance: definition.equipmentRelevance,
    iconId: definition.iconId,
    iconFallback: definition.iconFallback,
    accentColor: definition.accentColor,
    cssClasses: definition.cssClasses,
    description: definition.description,
    actionType: definition.actionType,
    activation: definition.activation,
    engineAction: definition.engineAction,
    applicabilityPredicate: definition.applicabilityPredicate,
    disabledReasonHandler: definition.disabledReasonHandler,
    disabledReason: definition.disabledReason,
    handler: definition.handler,
    sourceHandler: definition.sourceHandler,
    triggeringAction: definition.triggeringAction,
    omenInteraction: definition.omenInteraction,
    corruptionRestriction: definition.corruptionRestriction,
    validItemClasses: definition.validItemClasses,
    validItemTags: definition.validItemTags,
    qualityRestriction: definition.qualityRestriction,
    socketRestriction: definition.socketRestriction,
    operationOptions: definition.operationOptions,
    sourceEvidence: unique([
      ...(definition.sourceEvidence || []),
      sourceEntry ? `data/crafting/currency-index.json#${sourceEntry.id}` : null,
    ]),
    implementationStatus: definition.implementationStatus,
    verificationStatus: definition.verificationStatus,
    blocker: definition.blocker,
    testFixtureIds: definition.testFixtureIds,
    supported: definition.supported,
    visible: definition.visible,
    targetGameVersion: TARGET_VERSION,
    sourceClassifications: sourceEntry?.sourceClassifications || [],
    sourceTags: sourceEntry?.sourceTags || [],
  };
}

function fallbackDefinition(entry, tabById) {
  const category = categoryForSource({
    displayName: entry.displayName,
    metadataKey: entry.metadataKey,
    classifications: entry.sourceClassifications,
  }, entry.methods);
  const tab = tabById.get(category);
  const blocker = fallbackBlocker(entry, category);
  return {
    craftId: entry.id,
    id: entry.id,
    sourceItemId: entry.sourceItemId,
    metadataKey: entry.metadataKey,
    sourceIdentityStatus: 'normalized_exact',
    displayName: entry.displayName,
    category,
    tab: category,
    tabOrder: tab.order,
    displayOrder: 1000 + Number(entry.sourceItemId),
    equipmentRelevance: 'equipment_crafting_candidate_unverified',
    iconId: `source-item-${entry.sourceItemId}`,
    iconFallback: fallbackIconText(entry.displayName),
    accentColor: TAB_ACCENTS[category],
    cssClasses: ['craft-item-btn', 'unsupported-item-card'],
    description: `${entry.displayName} is retained in the target-version crafting inventory for audit.`,
    actionType: 'unsupported',
    activation: 'none',
    engineAction: null,
    applicabilityPredicate: 'unsupportedReason',
    disabledReasonHandler: 'staticDisabledReason',
    disabledReason: blocker,
    handler: null,
    sourceHandler: null,
    triggeringAction: null,
    omenInteraction: { omenId: null, exclusiveGroup: null, consumeOn: 'never', triggerCraftId: null },
    corruptionRestriction: 'unverified',
    validItemClasses: [],
    validItemTags: [],
    qualityRestriction: category === 'quality' || category === 'breach' ? 'unverified' : 'none',
    socketRestriction: category === 'socketing' ? 'unverified' : 'none',
    operationOptions: {},
    sourceEvidence: [
      `data/crafting/currency-index.json#${entry.id}`,
      `data/normalized/crafting-items.json#item:${entry.sourceItemId}`,
    ],
    implementationStatus: entry.classification,
    verificationStatus: entry.classification === 'deprecated_for_target_version'
      ? 'deprecated_for_target_version'
      : 'not_verified',
    blocker,
    testFixtureIds: [],
    supported: false,
    // Quality records are surfaced as disabled audit cards so the workbench
    // can explain their verified target taxonomy and the exact missing rule;
    // they never acquire an operation handler from source descriptions alone.
    visible: category === 'quality',
    targetGameVersion: TARGET_VERSION,
    sourceClassifications: entry.sourceClassifications,
    sourceTags: entry.sourceTags,
  };
}

function validateGeneratedRegistry(craftRegistry, sourceEntries, craftTabs) {
  assert(craftTabs.length === 10, 'Generated crafting registry must contain 10 tabs.');
  assert(craftRegistry.length === 531, `Generated crafting registry has ${craftRegistry.length} definitions; expected 531.`);
  assert(new Set(craftRegistry.map(definition => definition.craftId)).size === craftRegistry.length,
    'Generated crafting registry contains duplicate craft IDs.');
  assert(craftRegistry.filter(definition => definition.visible).length === 45,
    'Generated crafting registry must contain 37 runtime controls plus 8 visible quality audit cards.');
  const sourceIds = craftRegistry.filter(definition => definition.sourceItemId != null).map(definition => String(definition.sourceItemId));
  const metadataKeys = craftRegistry.filter(definition => definition.metadataKey != null).map(definition => definition.metadataKey);
  assert(sourceIds.length === sourceEntries.length && new Set(sourceIds).size === sourceEntries.length,
    'Generated crafting registry must map every retained source item exactly once.');
  assert(metadataKeys.length === sourceEntries.length && new Set(metadataKeys).size === sourceEntries.length,
    'Generated crafting registry must map every retained metadata key exactly once.');
  const ids = new Set(craftRegistry.map(definition => definition.craftId));
  for (const definition of craftRegistry) {
    for (const field of REQUIRED_DEFINITION_FIELDS) {
      assert(Object.prototype.hasOwnProperty.call(definition, field),
        `Generated definition ${definition.craftId} lacks ${field}.`);
    }
    assert(definition.targetGameVersion === TARGET_VERSION,
      `Generated definition ${definition.craftId} has the wrong target version.`);
    assert(craftTabs.some(tab => tab.id === definition.tab),
      `Generated definition ${definition.craftId} references missing tab ${definition.tab}.`);
    for (const trigger of [definition.triggeringAction, definition.omenInteraction?.triggerCraftId].filter(Boolean)) {
      assert(ids.has(trigger), `Generated definition ${definition.craftId} references unknown trigger ${trigger}.`);
    }
    if (!definition.supported) {
      assert(typeof definition.disabledReason === 'string' && definition.disabledReason.length > 20 &&
        typeof definition.blocker === 'string' && definition.blocker.length > 20,
      `Generated blocked definition ${definition.craftId} lacks a precise blocker.`);
    }
  }
}

export function buildCurrencyIndex() {
  const crafting = readJson('crafting-items.json');
  const essences = readJson('essences.json');
  const manifestRaw = readFileSync(path.join(NORMALIZED_DIR, 'version-manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const registryRaw = readFileSync(REGISTRY_SOURCE, 'utf8');
  const registrySource = JSON.parse(registryRaw);
  validateRuntimeRegistrySource(registrySource, crafting.items || []);

  const methodByItemId = buildMethodIndex(crafting.methods);
  const omenByItemId = new Map((crafting.omens || []).map(omen => [String(omen.itemId), omen]));
  const essenceByItemId = new Map((essences.essences || []).map(essence => [String(essence.itemId), essence]));
  const authoredBySourceId = new Map(registrySource.definitions
    .filter(definition => definition.sourceItemId != null)
    .map(definition => [String(definition.sourceItemId), definition]));

  const entries = (crafting.items || []).map(item => {
    const runtimeCraft = authoredBySourceId.get(String(item.id)) || null;
    const classification = runtimeCraft
      ? runtimeClassification(runtimeCraft)
      : fallbackClassification(item);
    if (!CLASSIFICATIONS.includes(classification)) throw new Error(`Unclassified crafting item ${item.id}`);
    return {
      id: `source-item:${item.id}`,
      sourceItemId: item.id,
      metadataKey: item.metadataKey,
      displayName: item.displayName,
      classification,
      reason: explanationFor(classification, runtimeCraft),
      runtimeCraftIds: runtimeCraft ? [runtimeCraft.craftId] : [],
      sourceClassifications: item.classifications || [],
      sourceTags: (item.tags || []).map(tag => tag.key || tag).filter(Boolean),
      methods: methodByItemId.get(String(item.id)) || [],
      omen: omenByItemId.get(String(item.id)) || null,
      essence: essenceByItemId.get(String(item.id)) || null,
    };
  }).sort((a, b) => Number(a.sourceItemId) - Number(b.sourceItemId));

  const entryBySourceId = new Map(entries.map(entry => [String(entry.sourceItemId), entry]));
  const craftTabs = registrySource.tabs.map(tab => ({
    ...tab,
    targetGameVersion: TARGET_VERSION,
  }));
  const tabById = new Map(craftTabs.map(tab => [tab.id, tab]));

  const craftRegistry = entries.map(entry => {
    const authored = authoredBySourceId.get(String(entry.sourceItemId));
    return authored
      ? completeAuthoredDefinition(authored, entry, tabById)
      : fallbackDefinition(entry, tabById);
  });
  for (const authored of registrySource.definitions.filter(definition => definition.sourceItemId == null)) {
    craftRegistry.push(completeAuthoredDefinition(authored, null, tabById));
  }
  craftRegistry.sort((a, b) => a.tabOrder - b.tabOrder || a.displayOrder - b.displayOrder ||
    a.displayName.localeCompare(b.displayName) || a.craftId.localeCompare(b.craftId));
  validateGeneratedRegistry(craftRegistry, entries, craftTabs);

  const generatedById = new Map(craftRegistry.map(definition => [definition.craftId, definition]));
  const runtimeRegistry = Object.fromEntries(registrySource.definitions.map(authored => {
    const definition = generatedById.get(authored.craftId);
    const source = authored.sourceItemId == null ? null : entryBySourceId.get(String(authored.sourceItemId));
    const classification = runtimeClassification(authored);
    return [definition.craftId, {
      ...definition,
      classification,
      reason: authored.blocker || explanationFor(classification, authored),
      sourceHandlers: unique([
        ...(source?.methods || []).map(method => method.handler),
        authored.sourceHandler,
      ]),
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
    schemaVersion: INDEX_SCHEMA_VERSION,
    targetGameVersion: TARGET_VERSION,
    generatedFrom: {
      normalizedManifestSha256: sha256(normalizeText(manifestRaw).trim()),
      normalizedSourceSha256: manifest.source?.sha256 || null,
      normalizedSourceVersionStatus: manifest.source?.versionStatus || null,
      runtimeRegistrySource: 'data/crafting/runtime-registry.json',
      runtimeRegistrySha256: sha256(normalizeText(registryRaw).trim()),
    },
    allowedClassifications: CLASSIFICATIONS,
    sources: OFFICIAL_SOURCES,
    migration: {
      mode: 'authoritative-generated-registry',
      behaviorOwner: 'Registry records reference stable JavaScript validator and handler names; executable functions remain in classic browser scripts.',
      runtimeDefinitions: registrySource.definitions.length,
    },
    counts: {
      entries: entries.length,
      byClassification: counts,
      runtimeDefinitions: registrySource.definitions.length,
      runtimeByClassification: runtimeCounts,
      craftRegistryDefinitions: craftRegistry.length,
      visibleCraftDefinitions: craftRegistry.filter(definition => definition.visible).length,
      unclassified: 0,
    },
    craftTabs,
    craftRegistry,
    runtimeRegistry,
    entries,
  };
}

// The complete index remains checked in as JSON for provenance and audit
// validation. The browser only needs the tabs and definitions it can render,
// so avoid parsing hundreds of hidden audit-only records on every startup.
export function buildCurrencyBrowserSource(index = buildCurrencyIndex()) {
  const runtimeIndex = {
    schemaVersion: index.schemaVersion,
    targetGameVersion: index.targetGameVersion,
    craftTabs: index.craftTabs,
    craftRegistry: index.craftRegistry.filter(definition => definition.visible),
  };
  return `window.CRAFTING_CURRENCY_INDEX=${JSON.stringify(runtimeIndex)};\n`;
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
    `- Authoritative registry definitions: **${index.counts.craftRegistryDefinitions}**\n` +
    `- Visible workbench definitions: **${index.counts.visibleCraftDefinitions}**\n` +
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
  writeFileSync(BROWSER_OUTPUT, buildCurrencyBrowserSource(index), 'utf8');
  writeFileSync(REPORT_OUTPUT, coverageMarkdown(index), 'utf8');
  return index;
}

function runCli() {
  const checkOnly = process.argv.includes('--check');
  const index = buildCurrencyIndex();
  const expectedJson = `${JSON.stringify(index, null, 2)}\n`;
  const expectedBrowser = buildCurrencyBrowserSource(index);
  const expectedReport = coverageMarkdown(index);
  if (checkOnly) {
    const checks = [
      [JSON_OUTPUT, expectedJson],
      [BROWSER_OUTPUT, expectedBrowser],
      [REPORT_OUTPUT, expectedReport],
    ];
    for (const [file, expected] of checks) {
      if (normalizeText(readFileSync(file, 'utf8')) !== normalizeText(expected)) {
        throw new Error(`${path.relative(ROOT, file)} is stale.`);
      }
    }
    console.log(`Currency index is current (${index.counts.entries} entries, ${index.counts.unclassified} unclassified).`);
    return;
  }
  writeCurrencyIndex(index);
  console.log(`Generated currency index (${index.counts.entries} entries; ${index.counts.runtimeDefinitions} runtime definitions).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
