#!/usr/bin/env node

import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModifierOverlayAudit } from './modifier-overlay.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const BASE_DIR = path.join(PROJECT_ROOT, 'data', 'bases');
const SHARED_DIR = path.join(PROJECT_ROOT, 'data', 'shared');
const NORMALIZED_DIR = path.join(PROJECT_ROOT, 'data', 'normalized');
const RUNTIME_PATH = path.join(PROJECT_ROOT, 'data', 'runtime.data.js');
const JSON_REPORT_PATH = path.join(PROJECT_ROOT, 'reports', 'modifier-audit.json');
const MARKDOWN_REPORT_PATH = path.join(PROJECT_ROOT, 'reports', 'modifier-audit.md');

globalThis.window = globalThis;
await import(new URL('../crafting.js', import.meta.url));
const CraftingEngine = globalThis.CraftingEngine;

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function jsonFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter(file => file.endsWith('.json')).sort();
}

function loadResolvedModBases() {
  const shared = Object.fromEntries(jsonFiles(SHARED_DIR).map(file => [
    path.basename(file, '.json'),
    readJson(path.join(SHARED_DIR, file)),
  ]));
  const bases = {};
  for (const file of jsonFiles(BASE_DIR)) {
    const id = path.basename(file, '.json');
    const source = readJson(path.join(BASE_DIR, file));
    if (!Array.isArray(source.inherits) || source.inherits.length === 0) {
      bases[id] = source;
      continue;
    }
    bases[id] = {
      ...source,
      prefixes: [
        ...source.inherits.flatMap(key => shared[key]?.prefixes || []),
        ...(source.prefixes || []),
      ],
      suffixes: [
        ...source.inherits.flatMap(key => shared[key]?.suffixes || []),
        ...(source.suffixes || []),
      ],
    };
    delete bases[id].inherits;
  }
  return { bases, shared };
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function stableStringify(value) {
  return `${JSON.stringify(value)}\n`;
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function gcd(left, right) {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function probabilityMetrics(numerator, denominator) {
  const n = Number(numerator) || 0;
  const d = Number(denominator) || 0;
  const divisor = n > 0 && d > 0 ? gcd(n, d) : 1;
  const probability = d > 0 ? n / d : 0;
  return {
    numerator: n,
    denominator: d,
    exactFraction: d > 0 ? `${n / divisor}/${d / divisor}` : '0/0',
    probability,
    percent: probability * 100,
    expectedRolls: probability > 0 ? 1 / probability : null,
    failureChance: Object.fromEntries([10, 50, 100, 181]
      .map(attempts => [attempts, (1 - probability) ** attempts])),
  };
}

function candidateProbability(numerator, denominator) {
  const metric = probabilityMetrics(numerator, denominator);
  return {
    numerator: metric.numerator,
    denominator: metric.denominator,
    exactFraction: metric.exactFraction,
    probability: metric.probability,
  };
}

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function tierLines(tier) {
  if (Array.isArray(tier?.lines)) {
    return tier.lines.map(line => ({
      modLine: line.modLine ?? null,
      values: Array.isArray(line.vals)
        ? line.vals.map(value => ({ min: value.min, max: value.max }))
        : line.min != null ? [{ min: line.min, max: line.max }] : [],
    }));
  }
  return [{
    modLine: tier?.modLine ?? null,
    values: tier?.min != null ? [{ min: tier.min, max: tier.max }] : [],
  }];
}

function buildConcreteBase(baseItems, modifiersById, baseItemId, simulatorPoolId) {
  const base = baseItems.bases.find(candidate => Number(candidate.id) === Number(baseItemId));
  if (!base) throw new Error(`Missing normalized concrete base ${baseItemId}.`);
  return {
    id: base.id,
    sourceId: base.id,
    metadataKey: base.metadataKey,
    displayName: base.displayName,
    itemClass: base.itemClass,
    sourceItemClass: base.itemClass,
    equipmentSlot: base.equipmentSlot,
    classId: base.classId,
    modifierPoolClassId: base.modifierPoolClassId,
    simulatorPoolId,
    dropLevel: base.dropLevel,
    tags: base.tags || [],
    requirements: base.requirements || {},
    baseProperties: base.baseProperties || {},
    implicits: (base.implicitModifierIds || []).map(id => {
      const modifier = modifiersById.get(Number(id));
      return {
        id,
        key: modifier?.key ?? null,
        modifierGroupId: modifier?.modifierGroupId ?? null,
        modifierGroup: modifier?.modifierGroup ?? null,
        stats: modifier?.stats || [],
      };
    }),
    sourceSocketCount: base.socketCount ?? null,
    selectable: !base.unmodifiable,
    targetGameVersion: baseItems.targetGameVersion,
    verificationState: 'normalized-audit',
  };
}

function buildSourceOverlay(rows, poolId) {
  return new Map(rows
    .filter(row => row.poolId === poolId && row.modifier)
    .map(row => [row.overlayKey, {
      stableModifierId: row.modifier.id,
      sourceModifierKey: row.modifier.key,
      sourceModifierGroupId: row.modifier.modifierGroupId,
      spawnWeight: row.poolSpawnWeight,
      sourceClassWeights: row.classWeights,
      displayTier: row.displayTier,
      sourceTier: row.modifier.tier,
      overlayMatchStrategy: row.matchStrategy,
      overlayMatchedUniquely: row.matchedUniquely,
      modifierTags: row.modifier.modifierTags || [],
      requiredTags: row.modifier.requiredTags || [],
      forbiddenTags: row.modifier.forbiddenTags || [],
      weightConditions: row.modifier.weightConditions || [],
    }]));
}

function compactAuditRow(row, baseItems, concreteBasesById) {
  const mapping = baseItems.simulatorBaseMap[row.poolId] || { classIds: [], concreteBaseIds: [] };
  const applicableClassIds = row.classWeights
    .filter(([, weight]) => Number(weight) > 0)
    .map(([classId]) => Number(classId));
  const applicabilitySetId = `${row.poolId}|${applicableClassIds.join(',')}`;
  return {
    poolId: row.poolId,
    affix: row.affix,
    overlayKey: row.overlayKey,
    legacyGroup: row.legacyGroup,
    sourceModifierGroup: row.modifier.modifierGroup,
    sourceModifierGroupId: row.modifier.modifierGroupId,
    stableModifierId: row.modifier.id,
    sourceModifierKey: row.modifier.key,
    legacyTier: row.legacyTier.tier,
    displayTier: row.displayTier,
    sourceTier: row.modifier.tier,
    requiredItemLevel: row.legacyTier.ilvlReq,
    lines: tierLines(row.legacyTier),
    legacyWeight: row.legacyTier.weight,
    normalizedSpawnWeight: row.modifier.spawnWeight,
    normalizedClassWeights: row.classWeights,
    poolSpawnWeight: row.poolSpawnWeight,
    effectiveWeightByConcreteClass: Object.fromEntries(row.classWeights
      .map(([classId, weight]) => [String(classId), weight])),
    modifierTags: row.modifier.modifierTags || [],
    requiredTags: row.modifier.requiredTags || [],
    forbiddenTags: row.modifier.forbiddenTags || [],
    weightConditions: row.modifier.weightConditions || [],
    simulatorMappingClassIds: mapping.classIds || [],
    applicableClassIds,
    applicabilitySetId,
    matchStrategy: row.matchStrategy,
    matchedUniquely: row.matchedUniquely,
    formerMatcherStatus: row.legacyMatcherStatus,
    formerMatcherCandidateIds: row.legacyCandidateIds,
    formerMatcherModifierId: row.legacyMatcherModifierId,
  };
}

function markdownEscape(value) {
  return String(value ?? '')
    .replaceAll('|', '\\|')
    .replace(/\r?\n/g, '<br>');
}

function percent(value) {
  return `${(Number(value) * 100).toFixed(6)}%`;
}

function expected(value) {
  return value == null ? '∞' : Number(value).toFixed(6);
}

function metricCells(metric) {
  return [
    metric.exactFraction,
    percent(metric.probability),
    expected(metric.expectedRolls),
    percent(metric.failureChance[10]),
    percent(metric.failureChance[50]),
    percent(metric.failureChance[100]),
    percent(metric.failureChance[181]),
  ];
}

export function buildModifierAudit() {
  const { bases: modBases, shared } = loadResolvedModBases();
  const baseItems = readJson(path.join(NORMALIZED_DIR, 'base-items.json'));
  const normalizedModifiers = readJson(path.join(NORMALIZED_DIR, 'modifiers.json'));
  const manifest = readJson(path.join(NORMALIZED_DIR, 'version-manifest.json'));
  const modifiersById = new Map(normalizedModifiers.modifiers
    .map(modifier => [Number(modifier.id), modifier]));
  const concreteBasesById = new Map(baseItems.bases
    .map(base => [Number(base.id), base]));
  const overlayAudit = buildModifierOverlayAudit(modBases, baseItems, normalizedModifiers);
  if (overlayAudit.failures.length) {
    throw new Error(`Cannot calculate exact odds with ${overlayAudit.failures.length} unresolved overlay rows.`);
  }

  const auditRows = overlayAudit.rows.map(row =>
    compactAuditRow(row, baseItems, concreteBasesById));
  const applicabilitySets = Object.fromEntries([...new Set(auditRows
    .map(row => row.applicabilitySetId))].sort().map(applicabilitySetId => {
    const example = auditRows.find(row => row.applicabilitySetId === applicabilitySetId);
    const mapping = baseItems.simulatorBaseMap[example.poolId] || { concreteBaseIds: [] };
    const concreteBaseIds = (mapping.concreteBaseIds || []).filter(id => {
      const concrete = concreteBasesById.get(Number(id));
      return concrete && example.applicableClassIds.includes(Number(concrete.modifierPoolClassId));
    });
    return [applicabilitySetId, {
      poolId: example.poolId,
      classIds: example.applicableClassIds,
      concreteBaseIds,
    }];
  }));
  const rowsByStableId = new Map();
  for (const row of overlayAudit.rows) {
    if (!rowsByStableId.has(row.modifier.id)) rowsByStableId.set(row.modifier.id, []);
    rowsByStableId.get(row.modifier.id).push(row);
  }
  const normalizedModifierAudit = normalizedModifiers.modifiers.map(modifier => ({
    stableModifierId: modifier.id,
    sourceModifierKey: modifier.key,
    affix: modifier.affix,
    generationType: modifier.generationType,
    modifierGroup: modifier.modifierGroup,
    modifierGroupId: modifier.modifierGroupId,
    sourceTier: modifier.tier,
    requiredItemLevel: modifier.requiredItemLevel,
    normalizedSpawnWeight: modifier.spawnWeight,
    normalizedClassWeights: modifier.spawnWeights || [],
    modifierTags: modifier.modifierTags || [],
    requiredTags: modifier.requiredTags || [],
    forbiddenTags: modifier.forbiddenTags || [],
    weightConditions: modifier.weightConditions || [],
    stats: modifier.stats || [],
    mappedLegacyRows: (rowsByStableId.get(modifier.id) || [])
      .map(row => ({ poolId: row.poolId, affix: row.affix, overlayKey: row.overlayKey })),
  }));

  const amuletOverlay = buildSourceOverlay(overlayAudit.rows, 'amulets');
  const absent = buildConcreteBase(baseItems, modifiersById, 2563, 'amulets');
  const createEngine = (existingModifierIds = [], itemLevel = 83) => {
    const engine = new CraftingEngine(
      { bases: modBases },
      'amulets',
      null,
      amuletOverlay,
      null,
      absent,
      () => 0,
    );
    engine.setItemLevel(itemLevel);
    engine._item.rarity = 'rare';
    for (const stableModifierId of existingModifierIds) {
      const row = overlayAudit.rows.find(candidate =>
        candidate.poolId === 'amulets' && candidate.modifier.id === stableModifierId);
      if (!row) throw new Error(`Missing amulet audit row for source modifier ${stableModifierId}.`);
      const groups = row.affix === 'prefix' ? modBases.amulets.prefixes : modBases.amulets.suffixes;
      const group = groups.find(candidate => candidate.modGroup === row.legacyGroup);
      const source = amuletOverlay.get(row.overlayKey);
      engine._applyMod(row.affix, group, row.legacyTier, 0, source);
    }
    return engine;
  };

  const emptyEngine = createEngine();
  const emptyOdds = emptyEngine.getExactModifierOdds('rare');
  const firstOtherPrefix = emptyOdds.candidates.find(candidate =>
    candidate.type === 'prefix' && candidate.sourceModifierGroupId !== 281).stableModifierId;
  const poolDefinitions = [
    ['empty-standard', [], 0, null, 'Rare item with no existing affixes; both sides open.'],
    ['empty-prefix', [], 0, 'prefix', 'Rare item with no existing affixes; prefix-forcing roll.'],
    ['empty-suffix', [], 0, 'suffix', 'Rare item with no existing affixes; suffix-forcing roll.'],
    ['empty-greater-chaos', [], 35, null, 'No remaining blockers after Greater Chaos removal; minimum modifier level 35.'],
    ['empty-perfect-chaos', [], 50, null, 'No remaining blockers after Perfect Chaos removal; minimum modifier level 50.'],
    ['existing-spirit', [1140], 0, null, 'T1 Spirit already exists and blocks source group 281.'],
    ['existing-melee', [854], 0, null, '+3 Melee Skills already exists; other skill source groups remain eligible.'],
    ['existing-spirit-and-melee', [1140, 854], 0, null, 'Spirit and Melee source groups are both blocked.'],
    ['existing-melee-prefix', [854], 0, 'prefix', 'Existing Melee suffix with a prefix-forcing roll.'],
    ['existing-melee-suffix', [854], 0, 'suffix', 'Existing Melee suffix with a suffix-forcing roll.'],
    ['prefix-slots-full', [1140, firstOtherPrefix], 0, null, 'Both Absent Amulet prefix slots are occupied; only suffix candidates contribute.'],
    ['suffix-slots-full', [854, 867], 0, null, 'Both Absent Amulet suffix slots are occupied; only prefix candidates contribute.'],
    ['existing-spirit-greater-chaos', [1140], 35, null, 'Spirit remains after a Greater Chaos removal and blocks its group.'],
    ['existing-melee-perfect-chaos', [854], 50, null, 'Melee remains after a Perfect Chaos removal and blocks only source group 59.'],
  ];

  const targetDefinitions = [
    ['any-spirit', 'Any Spirit tier', candidate => candidate.sourceModifierGroupId === 281],
    ['t1-spirit', 'T1 Spirit (47–50)', candidate => candidate.stableModifierId === 1140],
    ['projectile-plus-1', '+1 Projectile Skills', candidate => candidate.stableModifierId === 865],
    ['projectile-plus-2', '+2 Projectile Skills', candidate => candidate.stableModifierId === 866],
    ['projectile-plus-3', '+3 Projectile Skills', candidate => candidate.stableModifierId === 867],
  ];

  const overlayRowsByCandidate = new Map(overlayAudit.rows
    .filter(row => row.poolId === 'amulets')
    .map(row => [`${row.affix}|${row.modifier.id}|${row.legacyTier.tier}`, row]));
  const exactPools = {};
  for (const [poolId, existingModifierIds, minModLevel, side, description] of poolDefinitions) {
    const engine = createEngine(existingModifierIds);
    const odds = engine.getExactModifierOdds('rare', { minModLevel }, { side });
    const candidates = odds.candidates.map(candidate => {
      const row = overlayRowsByCandidate.get(
        `${candidate.type}|${candidate.stableModifierId}|${candidate.legacyTier}`);
      return {
        ...candidate,
        probability: candidateProbability(candidate.weight, odds.totalWeight),
        legacyWeight: row?.legacyTier.weight ?? null,
        normalizedSpawnWeight: row?.modifier.spawnWeight ?? null,
        normalizedClassWeights: row?.classWeights || [],
        modifierTags: row?.modifier.modifierTags || [],
        requiredTags: row?.modifier.requiredTags || [],
        forbiddenTags: row?.modifier.forbiddenTags || [],
        weightConditions: row?.modifier.weightConditions || [],
      };
    });
    const targets = Object.fromEntries(targetDefinitions.map(([targetId, label, predicate]) => {
      const numerator = candidates.filter(predicate)
        .reduce((total, candidate) => total + candidate.weight, 0);
      return [targetId, { label, ...probabilityMetrics(numerator, odds.totalWeight) }];
    }));
    const groups = odds.groups.map(group => {
      const members = candidates.filter(candidate => candidate.groupKey === group.groupKey);
      const first = members[0];
      return {
        groupKey: group.groupKey,
        type: first?.type ?? null,
        sourceModifierGroupId: first?.sourceModifierGroupId ?? null,
        legacyGroup: first?.legacyGroup ?? null,
        representativeLine: first?.modLine ?? first?.lines?.filter(Boolean).join('; ') ?? null,
        candidateKeys: group.candidateKeys,
        ...probabilityMetrics(group.weight, odds.totalWeight),
      };
    });
    exactPools[poolId] = {
      description,
      existingModifierIds,
      minModLevel,
      side,
      denominator: odds.totalWeight,
      targets,
      groups,
      candidates,
    };
  }

  const operations = [
    {
      operation: 'Orb of Transmutation',
      applicable: true,
      applicableRolls: 0,
      poolId: null,
      note: 'Absent Amulet has 0 Magic prefix and suffix capacity; it becomes Magic without rolling an affix.',
    },
    {
      operation: 'Orb of Augmentation',
      applicable: false,
      applicableRolls: 0,
      poolId: null,
      note: 'Blocked because Absent Amulet has no Magic affix slots.',
    },
    { operation: 'Regal Orb', applicable: true, applicableRolls: 1, poolId: 'empty-standard' },
    { operation: 'Regal Orb + Sinistral Coronation', applicable: true, applicableRolls: 1, poolId: 'empty-prefix' },
    { operation: 'Regal Orb + Dextral Coronation', applicable: true, applicableRolls: 1, poolId: 'empty-suffix' },
    { operation: 'Exalted Orb (existing +3 Melee)', applicable: true, applicableRolls: 1, poolId: 'existing-melee' },
    { operation: 'Exalted Orb + Sinistral Exaltation', applicable: true, applicableRolls: 1, poolId: 'existing-melee-prefix' },
    { operation: 'Exalted Orb + Dextral Exaltation', applicable: true, applicableRolls: 1, poolId: 'existing-melee-suffix' },
    { operation: 'Chaos Orb (sole modifier removed)', applicable: true, applicableRolls: 1, poolId: 'empty-standard' },
    { operation: 'Greater Chaos Orb (sole modifier removed)', applicable: true, applicableRolls: 1, poolId: 'empty-greater-chaos' },
    { operation: 'Perfect Chaos Orb (sole modifier removed)', applicable: true, applicableRolls: 1, poolId: 'empty-perfect-chaos' },
    { operation: 'Chaos + Sinistral Erasure (Spirit removed; Melee remains)', applicable: true, applicableRolls: 1, poolId: 'existing-melee' },
    { operation: 'Chaos + Dextral Erasure (Melee removed; Spirit remains)', applicable: true, applicableRolls: 1, poolId: 'existing-spirit' },
    { operation: 'Empty Rare audit state', applicable: true, applicableRolls: 1, poolId: 'empty-standard' },
    { operation: 'Existing Spirit blocker state', applicable: true, applicableRolls: 1, poolId: 'existing-spirit' },
    { operation: 'Existing Melee blocker state', applicable: true, applicableRolls: 1, poolId: 'existing-melee' },
    { operation: 'Prefix slots full state', applicable: true, applicableRolls: 1, poolId: 'prefix-slots-full' },
    { operation: 'Suffix slots full state', applicable: true, applicableRolls: 1, poolId: 'suffix-slots-full' },
  ];

  const equivalencePool = exactPools['empty-standard'];
  const equivalenceRows = equivalencePool.candidates.map(candidate => {
    const group = equivalencePool.groups.find(entry => entry.groupKey === candidate.groupKey);
    const direct = candidate.weight / equivalencePool.denominator;
    const staged = (group.numerator / equivalencePool.denominator) *
      (candidate.weight / group.numerator);
    return {
      candidateKey: candidate.candidateKey,
      directProbability: direct,
      stagedProbability: staged,
      absoluteDifference: Math.abs(direct - staged),
    };
  });

  const simulationRandom = mulberry32(542026);
  const simulationSamples = 300000;
  let simulationSpiritHits = 0;
  for (let index = 0; index < simulationSamples; index++) {
    let roll = simulationRandom() * equivalencePool.denominator;
    let selected = equivalencePool.candidates.at(-1);
    for (const candidate of equivalencePool.candidates) {
      roll -= candidate.weight;
      if (roll <= 0) {
        selected = candidate;
        break;
      }
    }
    if (selected.sourceModifierGroupId === 281) simulationSpiritHits++;
  }
  const exactSpiritProbability = equivalencePool.targets['any-spirit'].probability;

  const spiritRows = auditRows
    .filter(row => row.poolId === 'amulets' && row.sourceModifierGroupId === 281)
    .map(row => ({
      ...row,
      effectiveWeightForAbsentAmulet: Number(row.effectiveWeightByConcreteClass['34']),
      overlayMatchedUniquely: row.matchedUniquely,
    }));
  const tierMismatches = auditRows.filter(row =>
    Number(row.legacyTier) !== Number(row.displayTier));
  const formerOverlayMissing = auditRows.filter(row => row.formerMatcherStatus === 'missing');
  const formerOverlayAmbiguous = auditRows.filter(row => row.formerMatcherStatus === 'ambiguous');
  const formerOverlayWrongIdentity = auditRows.filter(row =>
    row.formerMatcherStatus === 'unique' &&
    Number(row.formerMatcherModifierId) !== Number(row.stableModifierId));
  const weightMismatches = auditRows.filter(row =>
    row.normalizedClassWeights.some(([, weight]) => Number(weight) !== Number(row.legacyWeight)));
  const classDependentWeights = auditRows.filter(row =>
    new Set(row.normalizedClassWeights.map(([, weight]) => Number(weight))).size > 1);

  const runtimeSource = readFileSync(RUNTIME_PATH, 'utf8').trim();
  const runtime = JSON.parse(runtimeSource.replace(/^window\.COE_RUNTIME_DATA=/, '').replace(/;$/, ''));
  const report = {
    schemaVersion: 1,
    targetGameVersion: manifest.targetGameVersion,
    sourceVersionStatus: manifest.source?.versionStatus ?? null,
    generatedFrom: {
      versionManifest: 'data/normalized/version-manifest.json',
      normalizedModifiers: {
        path: 'data/normalized/modifiers.json',
        sha256: sha256(path.join(NORMALIZED_DIR, 'modifiers.json')),
      },
      normalizedBaseItems: {
        path: 'data/normalized/base-items.json',
        sha256: sha256(path.join(NORMALIZED_DIR, 'base-items.json')),
      },
      runtime: {
        path: 'data/runtime.data.js',
        overlayRows: Object.values(runtime.overlayByPool || {})
          .reduce((total, rows) => total + rows.length, 0),
      },
    },
    summary: {
      legacyBaseFiles: Object.keys(modBases).length,
      sharedPoolFiles: Object.keys(shared).length,
      legacyModifierRows: auditRows.length,
      normalizedModifiers: normalizedModifierAudit.length,
      normalizedModifiersMappedToLegacyRows: rowsByStableId.size,
      normalizedModifiersOutsideLegacyPools: normalizedModifierAudit
        .filter(modifier => modifier.mappedLegacyRows.length === 0).length,
      overlayRowsMatchedUniquely: overlayAudit.summary.matchedRows,
      overlayRowsUnresolved: overlayAudit.summary.failedRows,
      matchStrategies: overlayAudit.summary.matchStrategies,
      formerOverlayMatcher: overlayAudit.summary.legacyMatcher,
      displayTierMismatches: tierMismatches.length,
      legacyVsClassWeightMismatches: weightMismatches.length,
      classDependentWeightRows: classDependentWeights.length,
    },
    conclusions: {
      spirit: 'The five amulet Spirit rows match uniquely and use the normalized amulet class weights. Spirit is rare because its 2400 total weight competes with a 173650 two-sided denominator, not because of an overlay, tag, or rolling defect.',
      tierDisplay: 'The legacy tier field is a sequential/internal value in interleaved semantic families. Player display now uses displayTier ranked by required item level within each normalized source modifier group.',
      selection: 'Group-then-tier selection is exactly equivalent to direct candidate selection when both use the same eligible tier weights.',
      saveCompatibility: 'The legacy tier field and item schema remain unchanged. Additive sourceTier/displayTier metadata is rehydrated for older stash records when their internal identity matches uniquely.',
    },
    modifierRows: auditRows,
    applicabilitySets,
    normalizedModifierAudit,
    mismatches: {
      displayTiers: tierMismatches,
      formerOverlayMissing,
      formerOverlayAmbiguous,
      formerOverlayWrongIdentity,
      legacyVsClassWeights: weightMismatches,
      classDependentWeights,
      unresolvedAfterFix: overlayAudit.failures,
    },
    spirit: {
      sourceModifierGroupId: 281,
      rows: spiritRows,
      emptyRareTwoSided: exactPools['empty-standard'].targets,
      emptyRarePrefixOnly: exactPools['empty-prefix'].targets,
      simulation: {
        seed: 542026,
        samples: simulationSamples,
        spiritHits: simulationSpiritHits,
        observedProbability: simulationSpiritHits / simulationSamples,
        exactProbability: exactSpiritProbability,
        absoluteDifference: Math.abs(simulationSpiritHits / simulationSamples - exactSpiritProbability),
        tolerance: 0.00075,
      },
    },
    exactOdds: {
      base: {
        baseItemId: absent.id,
        displayName: absent.displayName,
        simulatorPoolId: 'amulets',
        modifierPoolClassId: absent.modifierPoolClassId,
        itemLevel: 83,
        magicLimits: createEngine().getLimits('magic'),
        rareLimits: createEngine().getLimits('rare'),
      },
      operations,
      pools: exactPools,
      twoStageSelectionEquivalence: {
        proven: equivalenceRows.every(row => row.absoluteDifference <= Number.EPSILON),
        maximumAbsoluteDifference: Math.max(...equivalenceRows.map(row => row.absoluteDifference)),
        candidates: equivalenceRows,
      },
    },
    blockers: [
      'The source export does not encode a game version; mechanics are audited against the repository target 0.5.4.',
      'The normalized source has no modifier display localization table; semantic disambiguation uses exact stat ranges followed by reviewed stat-ID discriminators.',
    ],
  };

  return report;
}

export function renderModifierAuditMarkdown(report) {
  const lines = [
    '# Modifier Audit',
    '',
    `Target game version: **${report.targetGameVersion}**`,
    '',
    '> The source export does not embed a game version. This report audits the checked-in snapshot against the repository’s explicit 0.5.4 target.',
    '',
    '## Result',
    '',
    `All ${report.summary.legacyModifierRows} legacy modifier rows map uniquely to normalized stable IDs. ` +
      `${report.summary.displayTierMismatches} rows had an internal sequential tier that disagreed with the player-facing required-level rank.`,
    '',
    `The former overlay matched ${report.summary.formerOverlayMatcher.unique} rows, skipped ` +
      `${report.summary.formerOverlayMatcher.missing} missing and ${report.summary.formerOverlayMatcher.ambiguous} ambiguous rows, ` +
      `and selected the wrong unique source identity for ${report.summary.formerOverlayMatcher.wrongUnique} rows.`,
    '',
    report.conclusions.spirit,
    '',
    '## Spirit effective rows',
    '',
    '| Stable ID | Source key | Source group | Display | Source tier | Required level | Values | Legacy weight | Normalized aggregate | Amulet class weight | Effective | Tags | Unique |',
    '|---:|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|---|',
  ];
  for (const row of report.spirit.rows) {
    const values = row.lines.flatMap(line => line.values.map(value => `${value.min}–${value.max}`)).join(', ');
    lines.push(`| ${row.stableModifierId} | ${markdownEscape(row.sourceModifierKey)} | ${row.sourceModifierGroupId} | T${row.displayTier} | ${row.sourceTier} | ${row.requiredItemLevel} | ${values} | ${row.legacyWeight} | ${row.normalizedSpawnWeight ?? 'null'} | ${row.effectiveWeightByConcreteClass['34']} | ${row.effectiveWeightForAbsentAmulet} | ${markdownEscape(row.modifierTags.join(', ') || 'none')} | ${row.overlayMatchedUniquely ? 'yes' : 'no'} |`);
  }

  const standardPool = report.exactOdds.pools['empty-standard'];
  const prefixPool = report.exactOdds.pools['empty-prefix'];
  lines.push(
    '',
    '## Exact Spirit odds',
    '',
    '| Roll pool | Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 | Denominator |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  );
  for (const [poolLabel, pool] of [['Two-sided', standardPool], ['Prefix-forcing', prefixPool]]) {
    for (const targetId of ['any-spirit', 't1-spirit']) {
      const metric = pool.targets[targetId];
      lines.push(`| ${poolLabel} | ${markdownEscape(metric.label)} | ${metricCells(metric).join(' | ')} | ${pool.denominator} |`);
    }
  }
  lines.push(
    '',
    `Seeded simulation: ${report.spirit.simulation.spiritHits}/${report.spirit.simulation.samples} Spirit hits ` +
      `(observed ${percent(report.spirit.simulation.observedProbability)}, exact ${percent(report.spirit.simulation.exactProbability)}, ` +
      `absolute difference ${report.spirit.simulation.absoluteDifference.toFixed(9)}).`,
    '',
    '## Currency and state coverage',
    '',
    '| Operation/state | Applicable | Rolls | Pool | Any Spirit | T1 Spirit | +1 Projectile | +2 Projectile | +3 Projectile | Note |',
    '|---|---|---:|---|---:|---:|---:|---:|---:|---|',
  );
  for (const operation of report.exactOdds.operations) {
    const pool = operation.poolId ? report.exactOdds.pools[operation.poolId] : null;
    const chance = targetId => pool ? percent(pool.targets[targetId].probability) : 'n/a';
    lines.push(`| ${markdownEscape(operation.operation)} | ${operation.applicable ? 'yes' : 'no'} | ${operation.applicableRolls} | ${operation.poolId || 'none'} | ${chance('any-spirit')} | ${chance('t1-spirit')} | ${chance('projectile-plus-1')} | ${chance('projectile-plus-2')} | ${chance('projectile-plus-3')} | ${markdownEscape(operation.note || '')} |`);
  }
  lines.push(
    '',
    '## Exact roll pools',
    '',
    'Each operation above references one of these deduplicated pools. Every group and every candidate contributing to each denominator is listed.',
  );
  for (const [poolId, pool] of Object.entries(report.exactOdds.pools)) {
    lines.push(
      '',
      `### ${poolId}`,
      '',
      pool.description,
      '',
      `Denominator: **${pool.denominator}**; minimum modifier level: **${pool.minModLevel}**; side: **${pool.side || 'both'}**; existing source IDs: **${pool.existingModifierIds.join(', ') || 'none'}**.`,
      '',
      '| Target | Exact | Chance | Expected rolls | Fail 10 | Fail 50 | Fail 100 | Fail 181 |',
      '|---|---:|---:|---:|---:|---:|---:|---:|',
    );
    for (const target of Object.values(pool.targets)) {
      lines.push(`| ${markdownEscape(target.label)} | ${metricCells(target).join(' | ')} |`);
    }
    lines.push(
      '',
      '| Affix | Source group | Legacy group | Representative | Weight | Exact | Chance | Candidate IDs |',
      '|---|---:|---|---|---:|---:|---:|---|',
    );
    for (const group of pool.groups) {
      lines.push(`| ${group.type} | ${group.sourceModifierGroupId ?? 'legacy'} | ${markdownEscape(group.legacyGroup)} | ${markdownEscape(group.representativeLine)} | ${group.numerator} | ${group.exactFraction} | ${percent(group.probability)} | ${markdownEscape(group.candidateKeys.join(', '))} |`);
    }
    lines.push(
      '',
      '| Stable ID | Affix | Source group | Legacy group | Display | Source tier | Required | Line | Legacy weight | Normalized aggregate | Effective | Exact | Chance |',
      '|---:|---|---:|---|---:|---:|---:|---|---:|---:|---:|---:|---:|',
    );
    for (const candidate of pool.candidates) {
      lines.push(`| ${candidate.stableModifierId ?? 'legacy'} | ${candidate.type} | ${candidate.sourceModifierGroupId ?? 'legacy'} | ${markdownEscape(candidate.legacyGroup)} | T${candidate.displayTier} | ${candidate.sourceTier ?? 'n/a'} | ${candidate.requiredItemLevel} | ${markdownEscape(candidate.modLine || candidate.lines.join('; '))} | ${candidate.legacyWeight} | ${candidate.normalizedSpawnWeight ?? 'null'} | ${candidate.weight} | ${candidate.probability.exactFraction} | ${percent(candidate.probability.probability)} |`);
    }
  }

  const mismatchTable = (heading, rows, columns, render) => {
    lines.push('', `## ${heading}`, '', `Count: **${rows.length}**`, '', columns[0], columns[1]);
    for (const row of rows) lines.push(render(row));
  };
  mismatchTable(
    'All display-tier mismatches',
    report.mismatches.displayTiers,
    [
      '| Pool | Affix | Legacy group | Stable ID | Source group | Required | Legacy tier | Display tier | Line |',
      '|---|---|---|---:|---:|---:|---:|---:|---|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.stableModifierId} | ${row.sourceModifierGroupId} | ${row.requiredItemLevel} | ${row.legacyTier} | ${row.displayTier} | ${markdownEscape(row.lines.map(line => line.modLine).join('; '))} |`,
  );
  mismatchTable(
    'All rows missing from the former overlay',
    report.mismatches.formerOverlayMissing,
    [
      '| Pool | Affix | Legacy group | Required | Legacy tier | Correct stable ID | Correct source key |',
      '|---|---|---|---:|---:|---:|---|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.requiredItemLevel} | ${row.legacyTier} | ${row.stableModifierId} | ${markdownEscape(row.sourceModifierKey)} |`,
  );
  mismatchTable(
    'All rows ambiguous in the former overlay',
    report.mismatches.formerOverlayAmbiguous,
    [
      '| Pool | Affix | Legacy group | Required | Legacy tier | Former candidates | Correct stable ID | Strategy |',
      '|---|---|---|---:|---:|---|---:|---|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.requiredItemLevel} | ${row.legacyTier} | ${markdownEscape(row.formerMatcherCandidateIds.join(', '))} | ${row.stableModifierId} | ${row.matchStrategy} |`,
  );
  mismatchTable(
    'All wrong source identities in the former overlay',
    report.mismatches.formerOverlayWrongIdentity,
    [
      '| Pool | Affix | Legacy group | Required | Former stable ID | Correct stable ID | Correct key |',
      '|---|---|---|---:|---:|---:|---|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.requiredItemLevel} | ${row.formerMatcherModifierId} | ${row.stableModifierId} | ${markdownEscape(row.sourceModifierKey)} |`,
  );
  mismatchTable(
    'All legacy/class-specific weight mismatches',
    report.mismatches.legacyVsClassWeights,
    [
      '| Pool | Affix | Legacy group | Stable ID | Required | Legacy weight | Normalized class weights | Pool weight |',
      '|---|---|---|---:|---:|---:|---|---:|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.stableModifierId} | ${row.requiredItemLevel} | ${row.legacyWeight} | ${markdownEscape(row.normalizedClassWeights.map(([id, weight]) => `${id}:${weight}`).join(', '))} | ${row.poolSpawnWeight ?? 'class-dependent'} |`,
  );
  mismatchTable(
    'All class-dependent effective-weight rows',
    report.mismatches.classDependentWeights,
    [
      '| Pool | Affix | Legacy group | Stable ID | Required | Legacy weight | Class weights |',
      '|---|---|---|---:|---:|---:|---|',
    ],
    row => `| ${row.poolId} | ${row.affix} | ${markdownEscape(row.legacyGroup)} | ${row.stableModifierId} | ${row.requiredItemLevel} | ${row.legacyWeight} | ${markdownEscape(row.normalizedClassWeights.map(([id, weight]) => `${id}:${weight}`).join(', '))} |`,
  );

  lines.push(
    '',
    '## Compatibility and blockers',
    '',
    `- ${report.conclusions.saveCompatibility}`,
    ...report.blockers.map(blocker => `- ${blocker}`),
    '',
    `The complete ${report.summary.legacyModifierRows}-row legacy/runtime audit and ` +
      `${report.summary.normalizedModifiers}-modifier normalized audit are retained in \`reports/modifier-audit.json\`.`,
    '',
  );
  return `${lines.join('\n')}\n`;
}

function runCli() {
  const report = buildModifierAudit();
  const json = stableStringify(report);
  const markdown = renderModifierAuditMarkdown(report);
  if (process.argv.includes('--check')) {
    const checks = [[JSON_REPORT_PATH, json], [MARKDOWN_REPORT_PATH, markdown]];
    for (const [file, expectedSource] of checks) {
      if (!existsSync(file) || normalizeText(readFileSync(file, 'utf8')) !== normalizeText(expectedSource)) {
        throw new Error(`${path.relative(PROJECT_ROOT, file)} is stale; rebuild modifier audit reports.`);
      }
    }
    console.log('Modifier audit reports are current.');
    return;
  }
  mkdirSync(path.dirname(JSON_REPORT_PATH), { recursive: true });
  writeFileSync(JSON_REPORT_PATH, json, 'utf8');
  writeFileSync(MARKDOWN_REPORT_PATH, markdown, 'utf8');
  const spirit = report.exactOdds.pools['empty-standard'].targets['any-spirit'];
  console.log(`Generated reports/modifier-audit.json and reports/modifier-audit.md`);
  console.log(`Absent Amulet Spirit: ${spirit.exactFraction} (${spirit.percent.toFixed(6)}%), expected ${spirit.expectedRolls.toFixed(6)} rolls.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
