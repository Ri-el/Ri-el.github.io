#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOL_DIR, '..');
const BASE_ITEMS_SOURCE = path.join(ROOT, 'data', 'normalized', 'base-items.json');
const CURRENCY_INDEX_SOURCE = path.join(ROOT, 'data', 'crafting', 'currency-index.json');
const BASE_ASSET_DIR = path.join(ROOT, 'assets', 'item-bases');
const CRAFT_ICON_DIR = path.join(ROOT, 'assets', 'icons');
const REPORT_DIR = path.join(ROOT, 'reports');
const JSON_OUTPUT = path.join(REPORT_DIR, 'asset-requirements.json');
const MARKDOWN_OUTPUT = path.join(REPORT_DIR, 'asset-requirements.md');
const REPORT_SCHEMA_VERSION = 1;

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function compareText(left, right) {
  const a = String(left);
  const b = String(right);
  return a < b ? -1 : a > b ? 1 : 0;
}

function uniqueSorted(values) {
  return [...new Set(values.filter(value => value != null && value !== ''))].sort(compareText);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function exactFileNames(directory) {
  if (!existsSync(directory)) return new Set();
  return new Set(readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => entry.name));
}

function assetStatus(fileNames, fileName) {
  return fileNames.has(fileName) ? 'existing' : 'missing';
}

function isCurrentDefinition(definition) {
  return definition.implementationStatus !== 'deprecated_for_target_version';
}

function validateSources(baseItems, currencyIndex) {
  assert(baseItems && typeof baseItems === 'object', 'Base-items source must be an object.');
  assert(baseItems.simulatorBaseMap && typeof baseItems.simulatorBaseMap === 'object',
    'Base-items source is missing simulatorBaseMap.');
  assert(Array.isArray(baseItems.bases), 'Base-items source is missing bases.');
  assert(currencyIndex && typeof currencyIndex === 'object', 'Currency-index source must be an object.');
  assert(typeof currencyIndex.targetGameVersion === 'string' && currencyIndex.targetGameVersion,
    'Currency index is missing targetGameVersion.');
  assert(Array.isArray(currencyIndex.craftRegistry), 'Currency index is missing craftRegistry.');
}

function buildBaseRequirements(baseItems, baseAssetNames) {
  const baseById = new Map();
  for (const base of baseItems.bases) {
    const baseId = Number(base.id);
    assert(Number.isSafeInteger(baseId), `Normalized base has invalid id: ${base.id}.`);
    assert(!baseById.has(baseId), `Normalized base id ${baseId} is duplicated.`);
    baseById.set(baseId, base);
  }

  const poolsByBaseId = new Map();
  const poolIds = Object.keys(baseItems.simulatorBaseMap).sort(compareText);
  let mappingReferences = 0;
  for (const poolId of poolIds) {
    const mapping = baseItems.simulatorBaseMap[poolId];
    assert(Array.isArray(mapping?.concreteBaseIds), `Simulator pool ${poolId} is missing concreteBaseIds.`);
    for (const rawBaseId of mapping.concreteBaseIds) {
      const baseId = Number(rawBaseId);
      assert(Number.isSafeInteger(baseId), `Simulator pool ${poolId} has invalid base id ${rawBaseId}.`);
      assert(baseById.has(baseId), `Simulator pool ${poolId} references missing base id ${baseId}.`);
      if (!poolsByBaseId.has(baseId)) poolsByBaseId.set(baseId, []);
      const pools = poolsByBaseId.get(baseId);
      assert(!pools.includes(poolId), `Simulator pool ${poolId} repeats base id ${baseId}.`);
      pools.push(poolId);
      mappingReferences += 1;
    }
  }

  const requirements = [...poolsByBaseId.keys()]
    .sort((left, right) => left - right)
    .map(baseId => {
      const base = baseById.get(baseId);
      const fileName = `${baseId}.png`;
      return {
        baseId,
        displayName: base.displayName,
        assetPath: `assets/item-bases/${fileName}`,
        assetStatus: assetStatus(baseAssetNames, fileName),
        pools: poolsByBaseId.get(baseId).sort(compareText),
        selectable: !base.unmodifiable,
        metadata: {
          metadataKey: base.metadataKey,
          classId: base.classId,
          modifierPoolClassId: base.modifierPoolClassId,
          itemClass: base.itemClass,
          equipmentSlot: base.equipmentSlot,
          tags: [...(base.tags || [])],
          dimensions: [...(base.dimensions || [])],
          unmodifiable: Boolean(base.unmodifiable),
        },
      };
    });

  return { poolIds, mappingReferences, requirements };
}

function projectCraftDefinition(definition) {
  return {
    craftId: definition.craftId,
    id: definition.id,
    sourceItemId: definition.sourceItemId,
    metadataKey: definition.metadataKey,
    displayName: definition.displayName,
    category: definition.category,
    tab: definition.tab,
    implementationStatus: definition.implementationStatus,
    verificationStatus: definition.verificationStatus,
    sourceIdentityStatus: definition.sourceIdentityStatus,
    supported: Boolean(definition.supported),
    visible: Boolean(definition.visible),
    current: isCurrentDefinition(definition),
    targetGameVersion: definition.targetGameVersion,
  };
}

function compareDefinitions(left, right) {
  return compareText(left.craftId, right.craftId)
    || compareText(left.id, right.id)
    || Number(left.sourceItemId ?? -1) - Number(right.sourceItemId ?? -1);
}

function buildCraftIconRequirements(currencyIndex, craftIconNames) {
  const definitionsByIconId = new Map();
  for (const definition of currencyIndex.craftRegistry) {
    assert(typeof definition.iconId === 'string' && definition.iconId,
      `Craft definition ${definition.craftId || definition.id || '<unknown>'} is missing iconId.`);
    assert(/^[a-z0-9][a-z0-9-]*$/.test(definition.iconId),
      `Craft definition ${definition.craftId || definition.id} has unsafe iconId ${definition.iconId}.`);
    assert(typeof definition.displayName === 'string' && definition.displayName,
      `Craft definition ${definition.craftId || definition.id || '<unknown>'} is missing displayName.`);
    if (!definitionsByIconId.has(definition.iconId)) definitionsByIconId.set(definition.iconId, []);
    definitionsByIconId.get(definition.iconId).push(definition);
  }

  return [...definitionsByIconId.keys()].sort(compareText).map(iconId => {
    const sourceDefinitions = definitionsByIconId.get(iconId);
    const definitions = sourceDefinitions.map(projectCraftDefinition).sort(compareDefinitions);
    const fileName = `${iconId}.png`;
    return {
      iconId,
      assetPath: `assets/icons/${fileName}`,
      assetStatus: assetStatus(craftIconNames, fileName),
      definitionCounts: {
        known: definitions.length,
        current: definitions.filter(definition => definition.current).length,
        supported: definitions.filter(definition => definition.supported).length,
        visible: definitions.filter(definition => definition.visible).length,
      },
      categories: uniqueSorted(definitions.map(definition => definition.category)),
      tabs: uniqueSorted(definitions.map(definition => definition.tab)),
      fallbacks: uniqueSorted(sourceDefinitions.map(definition => definition.iconFallback)),
      accentColors: uniqueSorted(sourceDefinitions.map(definition => definition.accentColor)),
      definitions,
    };
  });
}

function countAssets(requirements) {
  const existing = requirements.filter(requirement => requirement.assetStatus === 'existing').length;
  return {
    required: requirements.length,
    existing,
    missing: requirements.length - existing,
  };
}

function scopedIconAssets(requirements, countField) {
  return countAssets(requirements.filter(requirement => requirement.definitionCounts[countField] > 0));
}

export function buildAssetRequirements({
  baseItems = readJson(BASE_ITEMS_SOURCE),
  currencyIndex = readJson(CURRENCY_INDEX_SOURCE),
  baseAssetNames = exactFileNames(BASE_ASSET_DIR),
  craftIconNames = exactFileNames(CRAFT_ICON_DIR),
} = {}) {
  validateSources(baseItems, currencyIndex);
  const baseResult = buildBaseRequirements(baseItems, baseAssetNames);
  const craftIcons = buildCraftIconRequirements(currencyIndex, craftIconNames);
  const currentDefinitions = currencyIndex.craftRegistry.filter(isCurrentDefinition);
  const supportedDefinitions = currencyIndex.craftRegistry.filter(definition => definition.supported);
  const visibleDefinitions = currencyIndex.craftRegistry.filter(definition => definition.visible);
  const selectableBases = baseResult.requirements.filter(base => base.selectable).length;

  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    targetGameVersion: currencyIndex.targetGameVersion,
    generatedFrom: {
      baseItems: 'data/normalized/base-items.json',
      currencyIndex: 'data/crafting/currency-index.json',
    },
    conventions: {
      baseItemAssetPath: 'assets/item-bases/<baseId>.png',
      craftIconAssetPath: 'assets/icons/<iconId>.png',
      assetStatus: 'existing means an exact file name is present; missing means the required path is absent',
      selectable: 'A mapped concrete base is selectable when its normalized unmodifiable flag is false.',
      currentCraftDefinition: 'A known definition is current unless its implementationStatus is deprecated_for_target_version.',
    },
    summary: {
      pools: baseResult.poolIds.length,
      baseItems: {
        mappingReferences: baseResult.mappingReferences,
        mapped: baseResult.requirements.length,
        selectable: selectableBases,
        unselectable: baseResult.requirements.length - selectableBases,
        assets: countAssets(baseResult.requirements),
      },
      craftDefinitions: {
        known: currencyIndex.craftRegistry.length,
        current: currentDefinitions.length,
        supported: supportedDefinitions.length,
        visible: visibleDefinitions.length,
      },
      craftIcons: {
        known: scopedIconAssets(craftIcons, 'known'),
        current: scopedIconAssets(craftIcons, 'current'),
        supported: scopedIconAssets(craftIcons, 'supported'),
        visible: scopedIconAssets(craftIcons, 'visible'),
      },
    },
    baseItems: baseResult.requirements,
    craftIcons,
  };
}

function markdownText(value) {
  return String(value ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|');
}

function markdownCode(value) {
  return `\`${String(value ?? '').replace(/`/g, '\\`')}\``;
}

function definitionMarkdown(definition) {
  const ids = definition.id && definition.id !== definition.craftId
    ? `${markdownCode(definition.craftId)} / ${markdownCode(definition.id)}`
    : markdownCode(definition.craftId);
  const sourceId = definition.sourceItemId == null ? '' : `; source ${markdownCode(definition.sourceItemId)}`;
  const flags = [definition.category, definition.implementationStatus];
  if (definition.supported) flags.push('supported');
  if (definition.current) flags.push('current');
  return `${ids}${sourceId} — ${markdownText(definition.displayName)} (${flags.map(markdownText).join('; ')})`;
}

export function buildAssetRequirementsMarkdown(report) {
  const baseRows = report.baseItems.map(base =>
    `| ${base.baseId} | ${markdownText(base.displayName)} | ${base.pools.map(markdownCode).join(', ')} | ` +
    `${base.selectable ? 'yes' : 'no'} | ${markdownCode(base.assetPath)} | ${base.assetStatus} | ` +
    `${markdownCode(base.metadata.metadataKey)} |`
  ).join('\n');
  const iconRows = report.craftIcons.map(icon =>
    `| ${markdownCode(icon.iconId)} | ${markdownCode(icon.assetPath)} | ${icon.assetStatus} | ` +
    `${icon.definitionCounts.known} | ${icon.definitionCounts.current} | ${icon.definitionCounts.supported} | ` +
    `${icon.definitions.map(definitionMarkdown).join('<br>')} |`
  ).join('\n');
  const baseAssets = report.summary.baseItems.assets;
  const knownIcons = report.summary.craftIcons.known;
  const currentIcons = report.summary.craftIcons.current;
  const supportedIcons = report.summary.craftIcons.supported;

  return `# Asset requirements\n\n` +
    `Target game version: **${markdownText(report.targetGameVersion)}**\n\n` +
    `Generated deterministically from ${markdownCode(report.generatedFrom.baseItems)} and ` +
    `${markdownCode(report.generatedFrom.currencyIndex)}. No timestamp is included.\n\n` +
    `Regenerate with ${markdownCode('node tools/build-asset-requirements.mjs')} and verify with ` +
    `${markdownCode('node tools/build-asset-requirements.mjs --check')}.\n\n` +
    `## Asset conventions\n\n` +
    `- Concrete base art: ${markdownCode(report.conventions.baseItemAssetPath)}\n` +
    `- Craft icons: ${markdownCode(report.conventions.craftIconAssetPath)}\n` +
    `- “Current” excludes definitions whose implementation status is ` +
    `${markdownCode('deprecated_for_target_version')}.\n` +
    `- Asset status uses exact file names so the report remains valid on case-sensitive GitHub Pages hosting.\n\n` +
    `## Summary\n\n` +
    `| Requirement | Total | Existing | Missing |\n|---|---:|---:|---:|\n` +
    `| Mapped concrete-base assets | ${baseAssets.required} | ${baseAssets.existing} | ${baseAssets.missing} |\n` +
    `| Known craft-icon assets | ${knownIcons.required} | ${knownIcons.existing} | ${knownIcons.missing} |\n` +
    `| Current craft-icon assets | ${currentIcons.required} | ${currentIcons.existing} | ${currentIcons.missing} |\n` +
    `| Supported craft-icon assets | ${supportedIcons.required} | ${supportedIcons.existing} | ${supportedIcons.missing} |\n\n` +
    `- Simulator pools: **${report.summary.pools}**\n` +
    `- Mapped concrete bases: **${report.summary.baseItems.mapped}** ` +
    `(${report.summary.baseItems.selectable} selectable; ${report.summary.baseItems.unselectable} unselectable)\n` +
    `- Craft definitions: **${report.summary.craftDefinitions.known} known**, ` +
    `**${report.summary.craftDefinitions.current} current**, ` +
    `**${report.summary.craftDefinitions.supported} supported**, ` +
    `**${report.summary.craftDefinitions.visible} visible**\n\n` +
    `## Concrete-base assets\n\n` +
    `Selectable is derived from the normalized ${markdownCode('unmodifiable')} flag. Every mapped base is listed, ` +
    `including unselectable bases that still require art for a complete asset set.\n\n` +
    `| Base ID | Display name | Pool(s) | Selectable | Required asset | Status | Metadata key |\n` +
    `|---:|---|---|:---:|---|---|---|\n${baseRows}\n\n` +
    `## Craft-icon assets\n\n` +
    `All known definitions are grouped by their shared ${markdownCode('iconId')}. Definition entries include stable IDs, ` +
    `source item IDs when available, display names, categories, implementation status, and current/supported flags.\n\n` +
    `| Icon ID | Required asset | Status | Known definitions | Current | Supported | Definitions |\n` +
    `|---|---|---|---:|---:|---:|---|\n${iconRows}\n`;
}

function reportOutputs(report = buildAssetRequirements()) {
  return [
    [JSON_OUTPUT, `${JSON.stringify(report, null, 2)}\n`],
    [MARKDOWN_OUTPUT, buildAssetRequirementsMarkdown(report)],
  ];
}

export function writeAssetRequirements(report = buildAssetRequirements()) {
  mkdirSync(REPORT_DIR, { recursive: true });
  for (const [file, contents] of reportOutputs(report)) writeFileSync(file, contents, 'utf8');
  return report;
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function runCli() {
  const checkOnly = process.argv.includes('--check');
  const report = buildAssetRequirements();
  if (checkOnly) {
    for (const [file, expected] of reportOutputs(report)) {
      if (!existsSync(file)) throw new Error(`${path.relative(ROOT, file)} is missing.`);
      if (normalizeText(readFileSync(file, 'utf8')) !== normalizeText(expected)) {
        throw new Error(`${path.relative(ROOT, file)} is stale.`);
      }
    }
    console.log(
      `Asset requirements are current (${report.summary.baseItems.mapped} bases, ` +
      `${report.summary.craftIcons.known.required} craft icons).`
    );
    return;
  }
  writeAssetRequirements(report);
  console.log(
    `Generated asset requirements (${report.summary.baseItems.mapped} bases, ` +
    `${report.summary.craftIcons.known.required} craft icons).`
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
