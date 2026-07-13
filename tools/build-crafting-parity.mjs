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
    entryDetailStatus: 'authoritative_registry_task06',
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
      note: 'Task 05 gates supported Abyss controls to source-backed targets and keeps unresolved Bones, Essences, Catalysts, and target-version Desecrated weighting as explicit blockers.',
    },
    task06Change: {
      socketingDefinitions: definitions.filter(definition => definition.category === 'socketing').length,
      socketingSupported: definitions.filter(definition => definition.category === 'socketing' && definition.supported).length,
      socketingVisible: definitions.filter(definition => definition.category === 'socketing' && definition.visible).length,
      socketState: 'explicit_empty_or_preserved_unverified',
      socketOperations: {
        adding: 'blocked_missing_data',
        insertion: 'blocked_missing_data',
        replacement: 'blocked_missing_data',
        extraction: 'blocked_missing_data',
      },
      retainedSocketables: 295,
      retainedRunes: 226,
      retainedSoulCores: 34,
      note: 'Task 06 formalizes deterministic empty/preserved socket state and a dedicated tooltip section. It does not enable Artificer, Rune, Soul Core, or extraction mutations because target-version limits, effects, and transitions are incomplete.',
    },
    blockers: [
      'Full parity remains blocked while retained registry definitions still have implementation or verification blockers.',
      'Hinekora\'s Lock remains implemented for compatibility but has no normalized source-item identity in the checked-in export.',
      'Tasks 06-07 must resolve remaining mechanic-specific blocked_missing_data and probability_unverified records from verified target-version evidence.',
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
