#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const INDEX_PATH = path.join(ROOT, 'data', 'crafting', 'currency-index.json');
const OUTPUT_PATH = path.join(ROOT, 'reports', 'crafting-parity.json');
const CHECK = process.argv.includes('--check');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function countByStatus(entries, statuses) {
  return Object.fromEntries(statuses.map(status => [
    status,
    entries.filter(entry => entry.implementationStatus === status).length,
  ]));
}

function countByField(entries, field) {
  const counts = new Map();
  for (const entry of entries) {
    const value = entry[field];
    if (value == null || value === '') continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))));
}

// The parity report deliberately copies its behavioral claims from the
// authoritative generated registry. It must not reconstruct applicability,
// handlers, evidence, or verification from normalized source hints.
function buildEntry(definition) {
  return {
    stableId: definition.id,
    craftId: definition.craftId,
    sourceItemId: definition.sourceItemId,
    metadataKey: definition.metadataKey,
    sourceIdentityStatus: definition.sourceIdentityStatus,
    exactName: definition.displayName,
    targetGameVersion: definition.targetGameVersion,
    equipmentRelevance: definition.equipmentRelevance,
    category: definition.category,
    tab: definition.tab,
    implementationStatus: definition.implementationStatus,
    verificationStatus: definition.verificationStatus,
    applicability: {
      predicate: definition.applicabilityPredicate,
      validItemClasses: definition.validItemClasses,
      validItemTags: definition.validItemTags,
      corruptionRestriction: definition.corruptionRestriction,
      qualityRestriction: definition.qualityRestriction,
      socketRestriction: definition.socketRestriction,
    },
    handler: definition.handler,
    disabledReasonHandler: definition.disabledReasonHandler,
    disabledReason: definition.disabledReason,
    triggeringAction: definition.triggeringAction,
    omenInteraction: definition.omenInteraction,
    sourceEvidence: definition.sourceEvidence,
    testReferences: definition.testFixtureIds,
    blocker: definition.blocker,
    supported: definition.supported,
    visible: definition.visible,
  };
}

export function buildReport(index) {
  if (!Array.isArray(index.craftRegistry)) {
    throw new Error('data/crafting/currency-index.json has no authoritative craftRegistry array.');
  }
  const definitions = index.craftRegistry;
  const entries = definitions.map(buildEntry);
  const statuses = index.allowedClassifications || [];
  const visibleDefinitions = definitions.filter(definition => definition.visible);
  const unresolvedSourceIdentities = definitions.filter(definition => definition.sourceItemId == null);

  return {
    schemaVersion: 2,
    targetGameVersion: index.targetGameVersion,
    fullParityClaim: false,
    inventorySource: 'data/crafting/currency-index.json',
    registrySource: 'data/crafting/currency-index.json#craftRegistry',
    entryDetailStatus: 'authoritative_registry_crafting_implementation',
    counts: {
      sourceEntries: index.counts.entries,
      registryDefinitions: definitions.length,
      visibleDefinitions: visibleDefinitions.length,
      unresolvedSourceIdentities: unresolvedSourceIdentities.length,
      unclassified: definitions.filter(definition => !statuses.includes(definition.implementationStatus)).length,
      sourceByClassification: index.counts.byClassification,
      registryByClassification: countByStatus(definitions, statuses),
      visibleByClassification: countByStatus(visibleDefinitions, statuses),
      registryByCategory: countByField(definitions, 'category'),
      visibleByTab: countByField(visibleDefinitions, 'tab'),
    },
    entries,
    task04Change: {
      coreCorrections: ['alchemy_normal_only', 'annulment_non_normal_only', 'divine_non_normal_only', 'mirrored_items_immutable'],
      qualityAuditCardsSurfaced: visibleDefinitions.filter(definition => definition.category === 'quality').length,
      vaalBlocked: definitions.some(definition => definition.craftId === 'vaal' && !definition.supported),
      note: 'Task 04 adds structured quality caps and blocked quality audit cards, corrects source-backed core restrictions, and blocks unverified Vaal outcomes.',
    },
    task05Change: {
      jewelOnlyAbyssControls: ['preserved-cranium', 'omen-sinistral-necromancy', 'omen-dextral-necromancy', 'omen-abyssal-echoes', 'omen-light'],
      essenceOfAbyssEquipmentClasses: 27,
      atomicDesecrationValidation: ['unknown_bone', 'conflicting_directional_omens'],
      lightOmenConsumption: 'successful_annulment_once_including_hinekora_commit',
      rerollCountSource: 'engine_result',
      note: 'The Abyss transaction now treats revealed and unrevealed Desecrated affixes as ordinary removable explicit modifiers, preserves pending Well state atomically, and keeps only source-incomplete Bones blocked.',
    },
    task06Change: {
      socketingDefinitions: definitions.filter(definition => definition.category === 'socketing').length,
      socketingSupported: definitions.filter(definition => definition.category === 'socketing' && definition.supported).length,
      socketingVisible: definitions.filter(definition => definition.category === 'socketing' && definition.visible).length,
      socketState: 'explicit_slots_with_inferred_source_socket_count_cap',
      socketOperations: {
        adding: 'implemented_inferred',
        insertion: 'implemented_inferred_exact_retained_effects',
        replacement: 'not_exposed_no_retained_method',
        extraction: 'not_exposed_no_retained_method',
      },
      retainedSocketables: 295,
      retainedRunes: 221,
      retainedSoulCores: 34,
      note: 'Artificer and 287 non-deprecated socketable augments are enabled as explicit inference from retained socket counts, exact class effects, corruption flags, and per-item limit codes. Replacement and extraction remain unavailable because no retained operation defines them.',
    },
    task07Change: {
      expeditionRuneforgingDefinitions: definitions.filter(definition => definition.category === 'runeforging').length,
      expeditionEquipmentCandidates: 17,
      excludedRuneforgingFalsePositiveSourceIds: [2191, 4402],
      deliriumDefinitions: definitions.filter(definition => definition.category === 'delirium').length,
      corruptionDefinitions: definitions.filter(definition => definition.category === 'corruption').length,
      corruptionEquipmentCandidates: 3,
      excludedCorruptionFalsePositiveSourceIds: [4479],
      supportedSpecializedOperations: definitions.filter(definition =>
        ['runeforging', 'delirium', 'corruption'].includes(definition.category) && definition.supported).length,
      vaalVisibleBlocked: definitions.some(definition => definition.craftId === 'vaal' && definition.visible && !definition.supported),
      vaalInfuserSourceIds: [65, 66, 67, 68],
      thesisSoulCoreSourceIds: [770, 771, 772, 773],
      note: 'Task 07 keeps Expedition, Delirium/Instilling, Temple/Atziri, sacrifice, extraction, and specialized Vaal operations blocked where exact target-version transitions or outcome weights are absent. Ordinary Vaal behavior is not reused.',
    },
    blockers: [
      'Full parity remains blocked while retained registry definitions still have implementation or verification blockers.',
      'Hinekora\'s Lock remains implemented for compatibility but has no normalized source-item identity in the checked-in export.',
      'Quality, unresolved Ritual/Abyss records, Catalysts, Delirium, Runeforging, and corruption still require their definition-specific target-version evidence.',
    ],
  };
}

const index = readJson(INDEX_PATH);
const report = buildReport(index);
const output = `${JSON.stringify(report, null, 2)}\n`;

if (CHECK) {
  const current = readFileSync(OUTPUT_PATH, 'utf8');
  if (current !== output) {
    console.error('reports/crafting-parity.json is stale.');
    process.exit(1);
  }
  console.log(`Crafting parity report is current (${report.counts.registryDefinitions} registry definitions).`);
} else {
  writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)} (${report.counts.registryDefinitions} registry definitions).`);
}
