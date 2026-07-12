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
    entryDetailStatus: 'authoritative_registry_task03',
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
    task03Change: {
      craftingItemStatusesChanged: 0,
      note: 'Task 03 centralizes registry metadata, UI generation, and dispatch without claiming new crafting mechanics.',
    },
    blockers: [
      'Full parity remains blocked while retained registry definitions still have implementation or verification blockers.',
      'Hinekora\'s Lock remains implemented for compatibility but has no normalized source-item identity in the checked-in export.',
      'Tasks 04-07 must resolve mechanic-specific blocked_missing_data and probability_unverified records from verified target-version evidence.',
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
