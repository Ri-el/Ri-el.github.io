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

function unique(values) {
  return [...new Set(values.filter(value => value != null && value !== ''))];
}

function buildEntry(entry, targetGameVersion) {
  const constraints = unique((entry.methods || []).flatMap(method => method.constraints || []));
  const handlers = unique((entry.methods || []).map(method => method.handler));
  const runtimeCraftIds = unique(entry.runtimeCraftIds || []);
  const implemented = entry.classification === 'implemented';
  return {
    stableId: entry.id,
    craftId: runtimeCraftIds.length === 1 ? runtimeCraftIds[0] : null,
    runtimeCraftIds,
    sourceItemId: entry.sourceItemId,
    metadataKey: entry.metadataKey,
    exactName: entry.displayName,
    targetGameVersion,
    equipmentRelevance: 'pending_audit',
    category: (entry.sourceClassifications || []).length
      ? entry.sourceClassifications.join(' + ')
      : 'pending_audit',
    implementationStatus: entry.classification,
    verificationStatus: implemented
      ? 'runtime_present_not_parity_verified'
      : 'not_verified',
    applicability: {
      status: constraints.length || (entry.sourceTags || []).length
        ? 'source_constraints_only'
        : 'not_audited',
      constraints,
      sourceTags: unique(entry.sourceTags || []),
    },
    handlers,
    sourceEvidence: [
      {
        path: 'data/crafting/currency-index.json',
        stableId: entry.id,
      },
      {
        path: 'data/normalized/crafting-items.json',
        sourceItemId: entry.sourceItemId,
      },
    ],
    testReferences: [],
    blocker: implemented
      ? 'Per-item target-version evidence and deterministic fixture audit remain pending in Tasks 03-07.'
      : entry.reason || 'Exact target-version equipment behavior has not been verified.',
  };
}

function buildReport(index) {
  const entries = index.entries.map(entry => buildEntry(entry, index.targetGameVersion));
  const unmatchedRuntimeEntries = Object.values(index.runtimeRegistry || {})
    .filter(entry => entry.sourceItemId == null)
    .map(entry => ({
      stableId: `runtime:${entry.id}`,
      craftId: entry.id,
      runtimeCraftIds: [entry.id],
      sourceItemId: null,
      metadataKey: null,
      exactName: entry.displayName,
      targetGameVersion: index.targetGameVersion,
      equipmentRelevance: 'equipment_runtime',
      category: 'runtime_registry',
      implementationStatus: entry.classification,
      verificationStatus: 'runtime_present_source_identity_unresolved',
      applicability: { status: 'runtime_validator_only', constraints: [], sourceTags: [] },
      handlers: unique(entry.sourceHandlers || []),
      sourceEvidence: [{ path: 'data/crafting/currency-index.json', runtimeCraftId: entry.id }],
      testReferences: [],
      blocker: 'Normalized source item identity is unresolved; per-item target-version evidence remains pending.',
    }));

  return {
    schemaVersion: 1,
    targetGameVersion: index.targetGameVersion,
    fullParityClaim: false,
    inventorySource: 'data/crafting/currency-index.json',
    entryDetailStatus: 'conservative_baseline_pending_task03_registry_expansion',
    counts: {
      sourceEntries: index.counts.entries,
      runtimeDefinitions: index.counts.runtimeDefinitions,
      unmatchedRuntimeEntries: unmatchedRuntimeEntries.length,
      unclassified: index.counts.unclassified,
      sourceByClassification: index.counts.byClassification,
      runtimeByClassification: index.counts.runtimeByClassification,
    },
    entries,
    unmatchedRuntimeEntries,
    task01Change: {
      craftingItemStatusesChanged: 0,
      note: 'Task 01 changes concrete Amulet selection and item identity only; it does not claim or change crafting-item mechanics.',
    },
    blockers: [
      'Task 03 must replace source-constraint-only applicability with the authoritative registry, equipment relevance, handlers, evidence, and deterministic fixtures.',
      'Later mechanic tasks must resolve retained blocked_missing_data and probability_unverified entries before full parity can be claimed.',
    ],
  };
}

const index = readJson(INDEX_PATH);
const output = `${JSON.stringify(buildReport(index), null, 2)}\n`;

if (CHECK) {
  const current = readFileSync(OUTPUT_PATH, 'utf8');
  if (current !== output) {
    console.error('reports/crafting-parity.json is stale.');
    process.exit(1);
  }
  console.log(`Crafting parity report is current (${index.counts.entries} retained entries).`);
} else {
  writeFileSync(OUTPUT_PATH, output, 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUTPUT_PATH)} (${index.counts.entries} retained entries).`);
}
