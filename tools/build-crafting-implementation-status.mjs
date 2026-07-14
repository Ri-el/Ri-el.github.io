#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const INDEX_PATH = path.join(ROOT, 'data', 'crafting', 'currency-index.json');
const JSON_PATH = path.join(ROOT, 'reports', 'crafting-implementation-status.json');
const MARKDOWN_PATH = path.join(ROOT, 'reports', 'crafting-implementation-status.md');
const CHECK = process.argv.includes('--check');

const CATEGORY_ORDER = [
  ['currency', 'Currency'],
  ['quality', 'Quality'],
  ['socketing', 'Socketing / Augments'],
  ['ritual', 'Ritual / Omens'],
  ['essences', 'Essences'],
  ['abyss', 'Abyss'],
  ['breach', 'Breach / Genesis'],
  ['delirium', 'Delirium / Instilling'],
  ['runeforging', 'Runeforging'],
  ['corruption', 'Corruption / Sacrifice'],
];

// Captured from the authoritative registry immediately before this task's
// mechanics changes. Keeping this checkpoint beside the generated current
// state makes the requested audit reproducible without pretending that Git
// history is an input to the report builder.
const PRE_IMPLEMENTATION_BASELINE = {
  currency: { known: 20, implemented: 20, inferred: 0, blocked: 0, deprecated: 0, nonEquipment: 0 },
  quality: { known: 8, implemented: 0, inferred: 0, blocked: 8, deprecated: 0, nonEquipment: 0 },
  socketing: { known: 296, implemented: 0, inferred: 0, blocked: 288, deprecated: 8, nonEquipment: 0 },
  ritual: { known: 38, implemented: 18, inferred: 0, blocked: 19, deprecated: 1, nonEquipment: 0 },
  essences: { known: 80, implemented: 0, inferred: 0, blocked: 80, deprecated: 0, nonEquipment: 0 },
  abyss: { known: 12, implemented: 2, inferred: 6, blocked: 4, deprecated: 0, nonEquipment: 0 },
  breach: { known: 28, implemented: 0, inferred: 0, blocked: 28, deprecated: 0, nonEquipment: 0 },
  delirium: { known: 26, implemented: 0, inferred: 0, blocked: 26, deprecated: 0, nonEquipment: 0 },
  runeforging: { known: 19, implemented: 0, inferred: 0, blocked: 17, deprecated: 0, nonEquipment: 2 },
  corruption: { known: 4, implemented: 0, inferred: 0, blocked: 3, deprecated: 0, nonEquipment: 1 },
};

const RARITY_BY_HANDLER = {
  applyTransmutation: 'Normal',
  applyAugmentation: 'Magic',
  applyAlchemy: 'Normal',
  applyRegal: 'Magic',
  applyExalted: 'Rare',
  applyChaos: 'Rare',
  applyAnnulment: 'Magic or Rare',
  applyDivine: 'Magic or Rare',
  applyFracturing: 'Rare',
  applyHinekoraLock: 'Depends on the previewed craft',
  applyArtificerOrb: 'Any mutable compatible equipment rarity',
  applySocketable: 'Any mutable compatible equipment rarity',
  startDesecrationFlow: 'Rare',
  applyEssenceOfAbyss: 'Rare',
};

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function reportStatus(definition) {
  if (definition.confidence === 'deprecated' ||
      definition.implementationStatus === 'deprecated_for_target_version') return 'deprecated';
  if (definition.confidence === 'non_item' ||
      definition.implementationStatus === 'non_item_currency') return 'non_equipment';
  if (definition.supported && definition.confidence === 'verified') return 'verified';
  if (definition.supported && definition.confidence === 'inferred') return 'inferred';
  if (definition.confidence === 'blocked' || definition.blocker) return 'blocked';
  return 'catalogue_only';
}

function rarityRestrictions(definition) {
  const required = definition.operationOptions?.requiredRarity;
  if (required === 'magic') return 'Magic';
  if (required === 'rare') return 'Rare';
  if (required === 'normal') return 'Normal';
  if (definition.actionType === 'omen') {
    return definition.triggeringAction
      ? `Determined by triggering craft: ${definition.triggeringAction}`
      : 'Determined by the triggering craft';
  }
  if (RARITY_BY_HANDLER[definition.handler]) return RARITY_BY_HANDLER[definition.handler];
  return definition.supported ? 'No additional rarity restriction encoded' : 'Unresolved; see blocker';
}

function engineHandler(definition) {
  if (!definition.supported) return null;
  if (definition.actionType === 'omen') {
    return definition.triggeringAction
      ? `Triggered through ${definition.triggeringAction}`
      : 'Triggered through the armed Omen state';
  }
  if (definition.handler === 'startDesecrationFlow') return 'CraftingEngine.startDesecration';
  if (definition.handler === 'applyHinekoraLock') return 'CraftingEngine preview/commit transaction';
  return definition.handler ? `CraftingEngine.${definition.handler}` : null;
}

function uiHandler(definition) {
  if (!definition.supported || !definition.handler) return null;
  return `executeCraftOperation -> ${definition.handler}`;
}

function unresolvedQuestion(definition, status) {
  if (!['blocked', 'catalogue_only'].includes(status)) return null;
  if (definition.blocker) {
    const blocker = String(definition.blocker)
      .replace(/^Mechanic blocked because\s*/i, '')
      .replace(/[.\s]+$/, '');
    return `What exact target-version evidence resolves this blocker: ${blocker}?`;
  }
  return `What exact target-version item mutation, applicability rule, and failure behavior should ${definition.displayName} use?`;
}

function buildDefinition(definition) {
  const status = reportStatus(definition);
  return {
    craftId: definition.craftId,
    category: definition.category,
    displayName: definition.displayName,
    sourceItemId: definition.sourceItemId,
    implementationStatus: status,
    registryImplementationStatus: definition.implementationStatus,
    confidence: definition.confidence,
    evidenceSource: definition.sourceEvidence || [],
    supportedItemClasses: definition.validItemClasses || [],
    rarityRestrictions: rarityRestrictions(definition),
    engineHandler: engineHandler(definition),
    engineAction: definition.engineAction,
    uiHandler: uiHandler(definition),
    testCoverage: definition.testFixtureIds || [],
    blocker: definition.blocker || null,
    exactUnresolvedQuestion: unresolvedQuestion(definition, status),
    targetGameVersion: definition.targetGameVersion,
    visible: !!definition.visible,
    supported: !!definition.supported,
  };
}

function emptySummary() {
  return {
    known: 0,
    implemented: 0,
    inferred: 0,
    blocked: 0,
    deprecated: 0,
    nonEquipment: 0,
    catalogueOnly: 0,
  };
}

function buildCategorySummary(definitions) {
  const summary = Object.fromEntries(CATEGORY_ORDER.map(([id]) => [id, emptySummary()]));
  for (const definition of definitions) {
    const bucket = summary[definition.category];
    if (!bucket) throw new Error(`Unknown report category: ${definition.category}`);
    bucket.known++;
    if (definition.implementationStatus === 'verified') bucket.implemented++;
    else if (definition.implementationStatus === 'inferred') bucket.inferred++;
    else if (definition.implementationStatus === 'blocked') bucket.blocked++;
    else if (definition.implementationStatus === 'deprecated') bucket.deprecated++;
    else if (definition.implementationStatus === 'non_equipment') bucket.nonEquipment++;
    else if (definition.implementationStatus === 'catalogue_only') bucket.catalogueOnly++;
  }
  for (const [category, counts] of Object.entries(summary)) {
    const classified = counts.implemented + counts.inferred + counts.blocked +
      counts.deprecated + counts.nonEquipment + counts.catalogueOnly;
    if (classified !== counts.known) {
      throw new Error(`${category} report classification mismatch: ${classified}/${counts.known}.`);
    }
  }
  return summary;
}

function handlerSummary(definitions) {
  const counts = new Map();
  for (const definition of definitions.filter(entry => entry.supported && entry.uiHandler)) {
    counts.set(definition.uiHandler, (counts.get(definition.uiHandler) || 0) + 1);
  }
  return [...counts].sort(([left], [right]) => left.localeCompare(right))
    .map(([handler, count]) => ({ handler, count }));
}

function blockerFamilies(definitions) {
  const counts = new Map();
  for (const definition of definitions.filter(entry => entry.implementationStatus === 'blocked')) {
    const key = `${definition.category}\u0000${definition.blocker}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts]
    .map(([key, count]) => {
      const [category, blocker] = key.split('\u0000');
      return { category, count, blocker };
    })
    .sort((left, right) => left.category.localeCompare(right.category) ||
      left.blocker.localeCompare(right.blocker));
}

export function buildReport(index, indexSource) {
  if (!Array.isArray(index.craftRegistry)) {
    throw new Error('data/crafting/currency-index.json has no authoritative craftRegistry array.');
  }
  const definitions = index.craftRegistry.map(buildDefinition);
  const categorySummary = buildCategorySummary(definitions);
  const catalogueOnlyCategories = CATEGORY_ORDER
    .filter(([id]) => categorySummary[id].implemented + categorySummary[id].inferred === 0)
    .map(([id, label]) => ({ category: id, label }));
  return {
    schemaVersion: 1,
    targetGameVersion: index.targetGameVersion,
    generatedFrom: {
      path: 'data/crafting/currency-index.json',
      sha256: sha256(indexSource),
    },
    statusTaxonomy: ['verified', 'inferred', 'blocked', 'deprecated', 'non_equipment', 'catalogue_only'],
    preImplementationBaseline: PRE_IMPLEMENTATION_BASELINE,
    categorySummary,
    auditFindings: {
      catalogueOnlyCategories,
      existingHandlers: handlerSummary(definitions),
      discoverableButDisabled: Object.fromEntries(CATEGORY_ORDER.map(([id]) => [
        id,
        definitions.filter(entry => entry.category === id && entry.visible && entry.implementationStatus === 'blocked').length,
      ])),
      implementedDirectlyFromRetainedData: [
        '80 regular, Greater, and Perfect Essence definitions with exact normalized class-to-modifier mappings',
        'Essence of the Breach with its retained Amulet/Ring forced prefix identity',
        "Artificer's Orb using the retained concrete-base socket count as an explicitly inferred cap",
        'Nine equipment Abyssal Bones, with the Ancient level-40 modifier floor reconciled from normalized Desecrated modifier levels',
        '287 non-deprecated Runes, Soul Cores, Idols, Abyssal Eyes, and Congealed Mist records with exact retained effects and limit codes',
      ],
      implementedFromPoE2DB: [],
      poe2dbDisposition: 'The supplied autocomplete and ModsView assets were used for catalogue completeness and corroborated Ancient Jawbone and Ancient Collarbone discovery. Checked-in normalized method and modifier-level data remained authoritative; the bundle Rib mismatch could not override it, and the empty HAR did not verify a mechanics JSON endpoint. No runtime or build dependency was added.',
      genuinelyAmbiguous: blockerFamilies(definitions),
    },
    definitions,
  };
}

function markdownCell(value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return '—';
  const text = Array.isArray(value) ? value.join('<br>') : String(value);
  return text.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function summaryTable(summary) {
  const lines = [
    '| Category | Known | Implemented | Inferred | Blocked | Deprecated | Non-equipment |',
    '|---|---:|---:|---:|---:|---:|---:|',
  ];
  for (const [id, label] of CATEGORY_ORDER) {
    const row = summary[id];
    lines.push(`| ${label} | ${row.known} | ${row.implemented} | ${row.inferred} | ${row.blocked} | ${row.deprecated} | ${row.nonEquipment} |`);
  }
  return lines.join('\n');
}

function buildMarkdown(report) {
  const lines = [
    '# Crafting implementation status',
    '',
    `Target game version: **${report.targetGameVersion}**. Canonical machine-readable detail: \`reports/crafting-implementation-status.json\`.`,
    '',
    '“Implemented” in the tables means source-backed `verified`; `inferred` mechanics are operational but remain explicitly labelled as inference. Every retained definition is classified—none is silently treated as available merely because it appears in the catalogue.',
    '',
    '## Pre-implementation audit',
    '',
    'This is the Phase 1 registry checkpoint captured before the Essence/socket mechanics slice:',
    '',
    summaryTable(report.preImplementationBaseline),
    '',
    '## Current audit',
    '',
    summaryTable(report.categorySummary),
    '',
    `Current catalogue-only categories (zero verified or inferred operations): ${report.auditFindings.catalogueOnlyCategories.map(entry => entry.label).join(', ')}.`,
    '',
    'No individual definition remains in the unexplained `catalogue_only` state. Discoverable definitions without mechanics are classified as `blocked`, `deprecated`, or `non_equipment` and carry an exact question.',
    '',
    '## Audit findings',
    '',
    'Existing supported UI handlers:',
    '',
    ...report.auditFindings.existingHandlers.map(entry => `- \`${entry.handler}\`: ${entry.count}`),
    '',
    'Discoverable but disabled definitions:',
    '',
    ...CATEGORY_ORDER.map(([id, label]) => `- ${label}: ${report.auditFindings.discoverableButDisabled[id]}`),
    '',
    'Mechanics implemented directly from checked-in retained data:',
    '',
    ...report.auditFindings.implementedDirectlyFromRetainedData.map(value => `- ${value}`),
    '',
    'Mechanics implemented solely from the supplied PoE2DB files: none. Those files were used for catalogue completeness and corroboration; checked-in normalized methods and modifier levels supply the Ancient mechanics. See `reports/poe2db-data-sources.md`.',
    '',
    'Genuinely ambiguous mechanics remain blocked. Their full blocker and exact unresolved question appear in the per-definition tables and JSON report.',
    '',
    '## Every retained definition',
    '',
  ];

  for (const [category, label] of CATEGORY_ORDER) {
    lines.push(`### ${label}`, '');
    lines.push('| craftId | Display name | Source item | Status | Confidence | Classes | Rarity | Engine handler | UI handler | Evidence | Tests | Blocker | Exact unresolved question |');
    lines.push('|---|---|---:|---|---|---|---|---|---|---|---|---|---|');
    for (const definition of report.definitions.filter(entry => entry.category === category)) {
      lines.push(`| ${[
        definition.craftId,
        definition.displayName,
        definition.sourceItemId,
        definition.implementationStatus,
        definition.confidence,
        definition.supportedItemClasses,
        definition.rarityRestrictions,
        definition.engineHandler,
        definition.uiHandler,
        definition.evidenceSource,
        definition.testCoverage,
        definition.blocker,
        definition.exactUnresolvedQuestion,
      ].map(markdownCell).join(' | ')} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

const indexSource = readFileSync(INDEX_PATH, 'utf8');
const report = buildReport(JSON.parse(indexSource), indexSource);
const jsonOutput = `${JSON.stringify(report, null, 2)}\n`;
const markdownOutput = buildMarkdown(report);

if (CHECK) {
  const stale = [];
  if (readFileSync(JSON_PATH, 'utf8') !== jsonOutput) stale.push(path.relative(ROOT, JSON_PATH));
  if (readFileSync(MARKDOWN_PATH, 'utf8') !== markdownOutput) stale.push(path.relative(ROOT, MARKDOWN_PATH));
  if (stale.length) {
    console.error(`Crafting implementation status report is stale: ${stale.join(', ')}`);
    process.exit(1);
  }
  console.log(`Crafting implementation status is current (${report.definitions.length} definitions).`);
} else {
  writeFileSync(JSON_PATH, jsonOutput, 'utf8');
  writeFileSync(MARKDOWN_PATH, markdownOutput, 'utf8');
  console.log(`Wrote crafting implementation status (${report.definitions.length} definitions).`);
}
