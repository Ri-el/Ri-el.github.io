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
const KNOWN_BROWSER_OUTPUT = path.join(OUTPUT_DIR, 'known-items.data.js');
const REGISTRY_SOURCE = path.join(OUTPUT_DIR, 'runtime-registry.json');
const EXPANSION_SOURCE = path.join(OUTPUT_DIR, 'registry-expansion.json');
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

function readExpansionSource() {
  return JSON.parse(readFileSync(EXPANSION_SOURCE, 'utf8'));
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
  if ([2191, 4402, 4479].includes(Number(item.id))) return 'non_item_currency';
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
    case 'non_item_currency':
      return 'Retained source-extraction record is not an item-affecting crafting operation.';
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
  if (entry.classification === 'non_item_currency') {
    const detail = Number(entry.sourceItemId) === 2191
      ? 'a Crossbow base item whose name contains “Alloy”'
      : Number(entry.sourceItemId) === 4402
        ? 'an Elemental Conflux skill gem'
        : 'the Sacrifice skill gem';
    return `${entry.displayName} is retained for source-audit completeness but is ${detail}, not a crafting currency or workbench operation.`;
  }
  const identity = `${entry.displayName || ''} ${entry.metadataKey || ''}`;
  const classifications = new Set(entry.sourceClassifications || []);
  if (/^Ancient (?:Jawbone|Rib|Collarbone)$/i.test(entry.displayName)) {
    return `Mechanic blocked because ${entry.displayName} requires modifier level 40 or higher, but all 680 retained Desecrated modifier records lack modifier-level metadata; enforcing the rule only on ordinary reveal candidates would be incomplete.`;
  }
  if (/Vertebra/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName} targets Waystones and the simulator has no verified Waystone item-state or modifier-pool model.`;
  }
  if (/Altered (?:Jawbone|Rib|Collarbone|Cranium|Vertebra)/i.test(identity)) {
    return `Mechanic blocked because the retained text for ${entry.displayName} describes a chance for an otherworldly outcome without encoding its probability or complete outcome pool.`;
  }
  if (category === 'essences') {
    const transition = /^Perfect Essence/i.test(entry.displayName)
      ? 'remove-one/add-one transition'
      : 'Magic-to-Rare transition';
    return `Mechanic blocked because the ${transition} is known, but the guaranteed modifier IDs retained for ${entry.displayName} have no canonical display templates, runtime modifier-group identities, or complete item-class eligibility in the browser data; applying them would lose modifier identity and provenance.`;
  }
  if (/Alloy/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName} has retained guaranteed modifier IDs, but those records lack browser-runtime display templates and modifier-group identities required for an atomic replacement that preserves identity and conflicts.`;
  }
  if (/Resistance Flux/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName} is known to transform resistance modifiers, but the retained data does not map every source modifier tier to an equivalent target resistance modifier while preserving tier, range, group, and weight identity.`;
  }
  if (classifications.has('catalyst')) {
    return `Mechanic blocked because ${entry.displayName}'s jewellery quality family is retained, but the exact per-use increment, cap interaction, and modifier-tag scaling rules are not encoded for target version ${TARGET_VERSION}.`;
  }
  if (classifications.has('distilled-emotion')) {
    return `Mechanic blocked because ${entry.displayName}'s Jewel replacement target is retained only as source modifier IDs; canonical display templates, group-conflict identity, and exact class labels are incomplete in the browser runtime.`;
  }
  if (/Artificer/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName} adds a Rune Socket, but the retained per-base socket count is explicitly unverified as a default or maximum, so the simulator cannot enforce a safe socket-cap transition.`;
  }
  if (classifications.has('socketable') || /(?:Rune|Soul Core)/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName}'s effect text is retained, but verified socket capacity, insertion binding, replacement, removal, and corruption restrictions are incomplete; no socket mutation is exposed.`;
  }
  if (/Sacrifice/i.test(identity)) {
    return `Mechanic blocked because the retained generic ${entry.displayName} identity does not distinguish the target-version Orb of Sacrifice variants or encode their corrupted-enchantment upgrade mapping and random explicit-removal constraints.`;
  }
  if (/Infuser|Architect|Atziri/i.test(identity)) {
    return `Mechanic blocked because ${entry.displayName}'s exact quality mutation or other target model, outcome table, cap interaction, and target-version probabilities are not present in the retained data.`;
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
    assumption: definition.assumption || null,
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
    confidence: definition.confidence || (definition.supported ? 'verified' : 'blocked'),
    historyTier: definition.operationOptions?.variantTier ||
      (definition.actionType === 'direct' ? 1 : null),
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
    equipmentRelevance: entry.classification === 'non_item_currency'
      ? 'source_extraction_non_crafting'
      : 'equipment_crafting_candidate_unverified',
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
      : entry.classification === 'non_item_currency' ? 'verified_non_crafting' : 'not_verified',
    confidence: entry.classification === 'deprecated_for_target_version'
      ? 'deprecated'
      : entry.classification === 'non_item_currency' ? 'non_item' : 'blocked',
    historyTier: null,
    blocker,
    testFixtureIds: [],
    supported: false,
    // Every retained record is discoverable in All known items. Deprecated
    // records remain behind the explicit audit/deprecated control.
    visible: entry.classification !== 'deprecated_for_target_version',
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
  assert(craftRegistry.filter(definition => definition.visible).length === 522,
    'Generated crafting registry must expose all 522 non-deprecated definitions in All known items.');
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
  const baseItems = readJson('base-items.json');
  const manifestRaw = readFileSync(path.join(NORMALIZED_DIR, 'version-manifest.json'), 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const registryRaw = readFileSync(REGISTRY_SOURCE, 'utf8');
  const registrySource = JSON.parse(registryRaw);
  const expansionRaw = readFileSync(EXPANSION_SOURCE, 'utf8');
  const expansionSource = JSON.parse(expansionRaw);
  validateRuntimeRegistrySource(registrySource, crafting.items || []);

  const methodByItemId = buildMethodIndex(crafting.methods);
  const expandedDefinitions = expandRegistryDefinitions(
    expansionSource,
    {
      craftingItems: crafting.items || [],
      socketables: crafting.socketables || [],
      socketableLimits: crafting.socketableLimits || [],
      essences: essences.essences || [],
      bases: baseItems.bases || [],
      methodByItemId,
    }
  );
  const authoredDefinitions = [...registrySource.definitions, ...expandedDefinitions];
  assert(new Set(authoredDefinitions.map(definition => definition.craftId)).size === authoredDefinitions.length,
    'Combined runtime and expansion registry contains duplicate craft IDs.');
  const omenByItemId = new Map((crafting.omens || []).map(omen => [String(omen.itemId), omen]));
  const essenceByItemId = new Map((essences.essences || []).map(essence => [String(essence.itemId), essence]));
  const authoredBySourceId = new Map(authoredDefinitions
    .filter(definition => definition.sourceItemId != null)
    .map(definition => [String(definition.sourceItemId), definition]));
  assert(authoredBySourceId.size === authoredDefinitions.filter(definition => definition.sourceItemId != null).length,
    'Combined registry claims a normalized source item more than once.');

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
  for (const authored of authoredDefinitions.filter(definition => definition.sourceItemId == null)) {
    craftRegistry.push(completeAuthoredDefinition(authored, null, tabById));
  }
  craftRegistry.sort((a, b) => a.tabOrder - b.tabOrder || a.displayOrder - b.displayOrder ||
    a.displayName.localeCompare(b.displayName) || a.craftId.localeCompare(b.craftId));
  validateGeneratedRegistry(craftRegistry, entries, craftTabs);

  const generatedById = new Map(craftRegistry.map(definition => [definition.craftId, definition]));
  const runtimeRegistry = Object.fromEntries(authoredDefinitions.map(authored => {
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
      registryExpansionSource: 'data/crafting/registry-expansion.json',
      registryExpansionSha256: sha256(normalizeText(expansionRaw).trim()),
    },
    allowedClassifications: CLASSIFICATIONS,
    sources: [...OFFICIAL_SOURCES, ...(expansionSource.sources || [])],
    migration: {
      mode: 'authoritative-generated-registry',
      behaviorOwner: 'Registry records reference stable JavaScript validator and handler names; executable functions remain in classic browser scripts.',
      runtimeDefinitions: authoredDefinitions.length,
      retainedStartupDefinitions: registrySource.definitions.length,
      expandedDefinitions: expandedDefinitions.length,
    },
    counts: {
      entries: entries.length,
      byClassification: counts,
      runtimeDefinitions: authoredDefinitions.length,
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

const BONE_ITEM_CLASSES = Object.freeze({
  jawbone: [
    'Claw', 'Dagger', 'Wand', 'One Hand Sword', 'One Hand Axe', 'One Hand Mace',
    'Spear', 'Flail', 'Bow', 'Staff', 'Two Hand Sword', 'Two Hand Axe',
    'Two Hand Mace', 'Quiver', 'Sceptre', 'Warstaff', 'Crossbow', 'Talisman',
  ],
  rib: ['Gloves', 'Boots', 'Body Armour', 'Helmet', 'Shield', 'Buckler', 'Focus'],
  collarbone: ['Amulet', 'Ring', 'Belt'],
});

function socketableHasEffect(socketable) {
  const effects = socketable?.effects || {};
  return [effects.martial, effects.armour, effects.caster, effects.all,
    ...Object.values(effects.classes || {})].some(Boolean);
}

function socketableItemClasses(socketable, bases) {
  const effects = socketable?.effects || {};
  const classIds = new Set(Object.entries(effects.classes || {})
    .filter(([, effect]) => !!effect)
    .map(([classId]) => Number(classId)));
  const matches = base => {
    if (!Number.isInteger(Number(base.socketCount)) || Number(base.socketCount) <= 0) return false;
    if (classIds.has(Number(base.classId))) return true;
    if (effects.all) return true;
    const tags = new Set(base.tags || []);
    if (effects.armour && tags.has('armour')) return true;
    if (effects.martial && tags.has('weapon')) return true;
    return !!effects.caster && ['Wand', 'Staff', 'Sceptre'].includes(base.itemClass);
  };
  return unique(bases.filter(matches).map(base => base.itemClass)).sort();
}

function generatedEssenceDefinition(essence, item) {
  const type = Number(essence.type);
  const rareReplacement = type >= 3;
  const confidence = rareReplacement ? 'inferred' : 'verified';
  const validItemClasses = unique((essence.guaranteedModifiersByItemClass || [])
    .map(mapping => mapping.itemClass)).sort();
  return {
    craftId: `essence-${essence.itemId}`,
    sourceItemId: essence.itemId,
    metadataKey: item.metadataKey,
    displayName: item.displayName,
    category: 'essences',
    equipmentRelevance: 'equipment_runtime',
    displayOrder: 100 + type * 100 + Number(essence.id),
    iconId: `essence-${essence.itemId}`,
    iconFallback: fallbackIconText(item.displayName),
    accentColor: TAB_ACCENTS.essences,
    cssClasses: ['essence-btn'],
    description: rareReplacement
      ? 'Inferred atomic transition: removes one eligible explicit modifier from a Rare item and adds the exact normalized guaranteed modifier for its concrete item class.'
      : 'Upgrades a Magic item to Rare and adds the exact normalized guaranteed modifier for its concrete item class.',
    assumption: rareReplacement
      ? 'When the forced affix side is full, removal is limited to that side so the retained remove-one/add-one transition can complete; conflicting modifier groups fail without mutation.'
      : null,
    actionType: 'direct',
    activation: 'arm',
    engineAction: `essence:${essence.itemId}`,
    applicabilityPredicate: 'essenceDisabledReason',
    disabledReasonHandler: 'essenceDisabledReason',
    disabledReason: '',
    handler: 'applyEssence',
    sourceHandler: 'poe2_essence',
    triggeringAction: null,
    omenInteraction: { omenId: null, exclusiveGroup: null, consumeOn: 'successful_operation', triggerCraftId: null },
    corruptionRestriction: 'blocked_if_corrupted_or_sanctified',
    validItemClasses,
    validItemTags: [],
    qualityRestriction: 'none',
    socketRestriction: 'none',
    operationOptions: {
      essenceItemId: essence.itemId,
      essenceType: type,
      requiredRarity: rareReplacement ? 'rare' : 'magic',
      transition: rareReplacement ? 'rare_remove_add' : 'magic_to_rare_add',
    },
    sourceEvidence: [
      `data/normalized/crafting-items.json#item:${essence.itemId}`,
      `data/normalized/essences.json#essence:${essence.id}`,
      'data/normalized/modifiers.json#essence-modifiers',
      'data/normalized/crafting-items.json#method:34',
      'data/crafting/registry-expansion.json',
    ],
    implementationStatus: 'implemented',
    verificationStatus: rareReplacement
      ? 'inferred_atomic_transition_from_normalized_method'
      : 'verified_normalized_magic_to_rare_transition',
    confidence,
    blocker: null,
    testFixtureIds: [
      'validation:normalized-essence-transitions',
      'ui:implemented-essence-registry-dispatch',
    ],
    supported: true,
    visible: true,
  };
}

function generatedArtificerDefinition(item, bases) {
  return {
    craftId: 'artificers-orb',
    sourceItemId: item.id,
    metadataKey: item.metadataKey,
    displayName: item.displayName,
    category: 'socketing',
    equipmentRelevance: 'equipment_runtime',
    displayOrder: 10,
    iconId: 'artificers-orb',
    iconFallback: 'Art',
    accentColor: TAB_ACCENTS.socketing,
    cssClasses: ['currency-btn', 'socket-currency-btn'],
    description: 'Inferred from the retained socket method and per-base socketCount: adds one empty Rune Socket up to the normalized concrete-base cap.',
    assumption: 'baseItems.bases[].socketCount is the maximum Rune Socket count and a fresh item starts with zero added sockets.',
    actionType: 'direct',
    activation: 'arm',
    engineAction: 'artificer',
    applicabilityPredicate: 'socketDisabledReason',
    disabledReasonHandler: 'socketDisabledReason',
    disabledReason: '',
    handler: 'applyArtificerOrb',
    sourceHandler: 'artificer',
    triggeringAction: null,
    omenInteraction: { omenId: null, exclusiveGroup: null, consumeOn: 'successful_operation', triggerCraftId: null },
    corruptionRestriction: 'blocked_if_corrupted_or_sanctified',
    validItemClasses: unique(bases.filter(base => Number(base.socketCount) > 0).map(base => base.itemClass)).sort(),
    validItemTags: [],
    qualityRestriction: 'none',
    socketRestriction: 'requires_below_inferred_concrete_base_cap',
    operationOptions: {
      socketCapacityStatus: 'inferred_source_cap',
      sourceSocketField: 'socketCount',
    },
    sourceEvidence: [
      'data/normalized/crafting-items.json#item:35',
      'data/normalized/crafting-items.json#method:29',
      'data/normalized/base-items.json#bases[].socketCount',
      'docs/craft-of-exile-data-schema.md',
      'data/crafting/registry-expansion.json',
    ],
    implementationStatus: 'implemented',
    verificationStatus: 'inferred_single_transition_from_source_cap_pattern',
    confidence: 'inferred',
    blocker: null,
    testFixtureIds: ['validation:socketing-augments', 'ui:implemented-socket-registry-dispatch'],
    supported: true,
    visible: true,
  };
}

function generatedSocketableDefinition(socketable, item, bases, socketableLimits) {
  assert(socketableHasEffect(socketable), `Socketable ${socketable.itemId} has no retained effect.`);
  const limit = socketable.limit == null ? null : socketableLimits[Number(socketable.limit)] || null;
  const typeNames = ['Rune', 'Soul Core', 'Idol', 'Abyssal Eye', 'Congealed Mist'];
  const typeName = typeNames[Number(socketable.type)] || `Socketable type ${socketable.type}`;
  return {
    craftId: `socketable-${socketable.itemId}`,
    sourceItemId: socketable.itemId,
    metadataKey: item.metadataKey,
    displayName: item.displayName,
    category: 'socketing',
    equipmentRelevance: 'equipment_runtime',
    displayOrder: 100 + Number(socketable.type) * 1000 + Number(socketable.itemId),
    iconId: `socketable-${socketable.itemId}`,
    iconFallback: fallbackIconText(item.displayName),
    accentColor: TAB_ACCENTS.socketing,
    cssClasses: ['socketable-btn'],
    description: `Inferred insertion transition: places this ${typeName} in an empty Rune Socket and applies the exact retained class-specific stat record. Existing socket contents are never replaced or removed.`,
    assumption: 'The retained effect precedence is concrete class, then all-equipment, then armour/martial/caster family; limit codes cap matching augment families.',
    actionType: 'direct',
    activation: 'arm',
    engineAction: `socketable:${socketable.itemId}`,
    applicabilityPredicate: 'socketDisabledReason',
    disabledReasonHandler: 'socketDisabledReason',
    disabledReason: '',
    handler: 'applySocketable',
    sourceHandler: 'poe2_socketable',
    triggeringAction: null,
    omenInteraction: { omenId: null, exclusiveGroup: null, consumeOn: 'successful_operation', triggerCraftId: null },
    corruptionRestriction: socketable.corrupt ? 'allowed_if_socketable_source_flag' : 'blocked_if_corrupted',
    validItemClasses: socketableItemClasses(socketable, bases),
    validItemTags: [],
    qualityRestriction: 'none',
    socketRestriction: 'requires_empty_socket_no_replacement_or_removal',
    operationOptions: {
      socketableItemId: socketable.itemId,
      socketableType: typeName,
      limitCode: socketable.limit,
      duplicateLimit: limit?.number ?? null,
      duplicateLimitText: limit?.text || null,
      allowsCorrupted: !!socketable.corrupt,
      bindsItem: !!socketable.bound,
      socketCapacityStatus: 'inferred_source_cap',
    },
    sourceEvidence: [
      `data/normalized/crafting-items.json#item:${socketable.itemId}`,
      `data/normalized/crafting-items.json#socketable:${socketable.itemId}`,
      'data/normalized/crafting-items.json#method:52',
      'data/crafting/registry-expansion.json',
    ],
    implementationStatus: 'implemented',
    verificationStatus: 'inferred_structured_socketable_transition',
    confidence: 'inferred',
    blocker: null,
    testFixtureIds: ['validation:socketing-augments', 'ui:implemented-socket-registry-dispatch'],
    supported: true,
    visible: true,
  };
}

function expandRegistryDefinitions(expansion, context) {
  assert(expansion?.schemaVersion === 1, 'Unsupported registry expansion schema.');
  assert(expansion.targetGameVersion === TARGET_VERSION,
    `Registry expansion target ${expansion.targetGameVersion} does not match ${TARGET_VERSION}.`);
  assert(Array.isArray(expansion.definitions), 'Registry expansion definitions are missing.');
  const { craftingItems, socketables, essences, bases, methodByItemId } = context;
  const itemById = new Map(craftingItems.map(item => [String(item.id), item]));
  const craftIds = new Set();
  const definitions = expansion.definitions.map(compact => {
    assert(!craftIds.has(compact.craftId), `Duplicate expansion craft ID ${compact.craftId}.`);
    craftIds.add(compact.craftId);
    assert(compact.confidence === 'verified' || compact.confidence === 'inferred',
      `Expansion ${compact.craftId} must be verified or inferred.`);
    const item = itemById.get(String(compact.sourceItemId));
    assert(item, `Expansion ${compact.craftId} references unknown item ${compact.sourceItemId}.`);
    const sourceMethods = methodByItemId.get(String(compact.sourceItemId)) || [];
    const isOmen = compact.kind === 'crafting_omen';
    const isBone = compact.kind === 'abyss_bone';
    assert(isOmen || isBone, `Expansion ${compact.craftId} has unknown kind ${compact.kind}.`);
    const method = sourceMethods[0] || null;
    if (isBone) assert(method, `Abyss Bone ${compact.craftId} has no retained method record.`);
    const maxItemLevel = method?.properties?.find(property => property.key === 'max_item_level')?.value ?? null;
    const minModifierLevel = method?.properties?.find(property => property.key === 'min_mod_level')?.value ?? null;
    const verificationStatus = compact.confidence === 'verified'
      ? 'verified_exact_item_text'
      : 'inferred_shared_desecration_transition';
    return {
      craftId: compact.craftId,
      sourceItemId: compact.sourceItemId,
      metadataKey: item.metadataKey,
      displayName: item.displayName,
      category: isOmen ? 'ritual' : 'abyss',
      equipmentRelevance: 'equipment_runtime',
      displayOrder: compact.displayOrder,
      iconId: compact.craftId,
      iconFallback: compact.iconFallback,
      accentColor: isOmen ? '#d4af5a' : '#5fd38a',
      cssClasses: isOmen ? ['abyss-btn', 'craft-omen-btn'] : ['abyss-btn', 'bone-btn'],
      description: isBone
        ? `${compact.description} Inferred assumption: Gnawed and Preserved family variants use the same three-option Well of Souls reveal flow as Preserved Cranium.`
        : compact.description,
      assumption: isBone
        ? 'Gnawed and Preserved family variants share Preserved Cranium\'s three-option Well of Souls reveal flow.'
        : null,
      actionType: isOmen ? 'omen' : 'specialized',
      activation: isOmen ? 'toggle_omen' : 'arm',
      engineAction: isBone ? compact.boneId : null,
      applicabilityPredicate: isOmen ? 'omenDisabledReason' : 'boneDisabledReason',
      disabledReasonHandler: isOmen ? 'omenDisabledReason' : 'boneDisabledReason',
      disabledReason: '',
      handler: isOmen ? 'toggleCraftOmen' : 'startDesecrationFlow',
      sourceHandler: method?.handler || null,
      triggeringAction: isOmen ? compact.triggerCraftId : null,
      omenInteraction: {
        omenId: isOmen ? compact.omenId : null,
        exclusiveGroup: isOmen ? 'crafting_omen' : null,
        consumeOn: isOmen ? 'successful_triggering_operation' : 'successful_operation',
        triggerCraftId: isOmen ? compact.triggerCraftId : null,
      },
      corruptionRestriction: 'blocked_if_corrupted_or_sanctified',
      validItemClasses: isBone ? BONE_ITEM_CLASSES[compact.boneFamily] : [],
      validItemTags: [],
      qualityRestriction: 'none',
      socketRestriction: 'none',
      operationOptions: isOmen
        ? { omenId: compact.omenId }
        : {
            boneId: compact.boneId,
            boneFamily: compact.boneFamily,
            revealCount: 3,
            maxItemLevel,
            minModifierLevel,
          },
      sourceEvidence: unique([
        `data/normalized/crafting-items.json#item:${compact.sourceItemId}`,
        method ? `data/normalized/crafting-items.json#method:${method.methodId}` : null,
        isOmen ? 'https://poe2db.tw/us/Omen' : 'https://poe2db.tw/us/Abyss',
        'data/crafting/registry-expansion.json',
      ]),
      implementationStatus: 'implemented',
      verificationStatus,
      confidence: compact.confidence,
      blocker: null,
      testFixtureIds: isOmen
        ? ['validation:expanded-crafting-omens']
        : ['validation:expanded-abyss-bones'],
      supported: true,
      visible: true,
    };
  });

  const generatedFamilies = expansion.generatedFamilies || [];
  for (const family of generatedFamilies) {
    if (family.kind === 'essences') {
      const includedTypes = new Set((family.includedTypes || []).map(Number));
      const excluded = new Set((family.excludedSourceItemIds || []).map(Number));
      for (const essence of essences) {
        if (!includedTypes.has(Number(essence.type)) || excluded.has(Number(essence.itemId))) continue;
        const item = itemById.get(String(essence.itemId));
        assert(item, `Generated Essence references unknown item ${essence.itemId}.`);
        const definition = generatedEssenceDefinition(essence, item);
        assert(!craftIds.has(definition.craftId), `Duplicate expansion craft ID ${definition.craftId}.`);
        craftIds.add(definition.craftId);
        definitions.push(definition);
      }
      continue;
    }
    if (family.kind === 'artificer') {
      const item = itemById.get(String(family.sourceItemId));
      assert(item, `Generated Artificer definition references unknown item ${family.sourceItemId}.`);
      const definition = generatedArtificerDefinition(item, bases);
      assert(!craftIds.has(definition.craftId), `Duplicate expansion craft ID ${definition.craftId}.`);
      craftIds.add(definition.craftId);
      definitions.push(definition);
      continue;
    }
    if (family.kind === 'socketables') {
      for (const socketable of socketables) {
        const item = itemById.get(String(socketable.itemId));
        assert(item, `Generated socketable definition references unknown item ${socketable.itemId}.`);
        if (family.excludeDeprecated && isDeprecated(item)) continue;
        const definition = generatedSocketableDefinition(
          socketable,
          item,
          bases,
          context.socketableLimits || []
        );
        assert(!craftIds.has(definition.craftId), `Duplicate expansion craft ID ${definition.craftId}.`);
        craftIds.add(definition.craftId);
        definitions.push(definition);
      }
      continue;
    }
    throw new Error(`Unknown generated registry family ${String(family.kind)}.`);
  }
  return definitions;
}

// The complete index remains checked in as JSON for provenance and audit
// validation. The browser only needs the tabs and definitions it can render,
// so avoid parsing hundreds of hidden audit-only records on every startup.
export function buildCurrencyBrowserSource(index = buildCurrencyIndex()) {
  const categoryCounts = Object.fromEntries(index.craftTabs.map(tab => {
    const definitions = index.craftRegistry.filter(definition => definition.tab === tab.id);
    return [tab.id, {
      available: definitions.filter(definition => definition.supported).length,
      known: definitions.filter(definition => definition.implementationStatus !== 'deprecated_for_target_version').length,
      deprecated: definitions.filter(definition => definition.implementationStatus === 'deprecated_for_target_version').length,
    }];
  }));
  const runtimeIndex = {
    schemaVersion: index.schemaVersion,
    targetGameVersion: index.targetGameVersion,
    craftTabs: index.craftTabs,
    categoryCounts,
    totalKnownDefinitions: index.craftRegistry.length,
    craftRegistry: projectBrowserDefinitions(
      index.craftRegistry.filter(definition => definition.supported)
    ),
  };
  return `window.CRAFTING_CURRENCY_INDEX=${JSON.stringify(runtimeIndex)};\n`;
}

// Keep complete provenance, validation evidence, and importer audit fields in
// currency-index.json. These are the fields the classic browser runtime reads;
// projecting them here avoids parsing a second audit representation at startup
// while retaining stable craft and source-handler identities.
const BROWSER_DEFINITION_FIELDS = Object.freeze([
  'craftId', 'metadataKey', 'displayName', 'category', 'tab',
  'tabOrder', 'displayOrder', 'iconId', 'iconFallback', 'accentColor', 'cssClasses',
  'description', 'assumption', 'actionType', 'activation', 'engineAction', 'disabledReasonHandler',
  'disabledReason', 'handler', 'sourceHandler', 'triggeringAction', 'omenInteraction',
  'operationOptions', 'implementationStatus', 'confidence', 'historyTier', 'blocker', 'supported',
]);

function projectBrowserDefinitions(definitions) {
  return definitions.map(definition => Object.fromEntries(
    BROWSER_DEFINITION_FIELDS.map(field => [field, definition[field] ?? null])
  ));
}

export function buildKnownItemsBrowserSource(index = buildCurrencyIndex()) {
  const definitions = projectBrowserDefinitions(index.craftRegistry);
  return `window.CRAFTING_KNOWN_ITEMS=${JSON.stringify({
    schemaVersion: index.schemaVersion,
    targetGameVersion: index.targetGameVersion,
    craftRegistry: definitions,
  })};\n`;
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
  writeFileSync(KNOWN_BROWSER_OUTPUT, buildKnownItemsBrowserSource(index), 'utf8');
  writeFileSync(REPORT_OUTPUT, coverageMarkdown(index), 'utf8');
  return index;
}

function runCli() {
  const checkOnly = process.argv.includes('--check');
  const index = buildCurrencyIndex();
  const expectedJson = `${JSON.stringify(index, null, 2)}\n`;
  const expectedBrowser = buildCurrencyBrowserSource(index);
  const expectedKnownBrowser = buildKnownItemsBrowserSource(index);
  const expectedReport = coverageMarkdown(index);
  if (checkOnly) {
    const checks = [
      [JSON_OUTPUT, expectedJson],
      [BROWSER_OUTPUT, expectedBrowser],
      [KNOWN_BROWSER_OUTPUT, expectedKnownBrowser],
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
