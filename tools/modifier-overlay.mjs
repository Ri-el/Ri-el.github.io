const SEMANTIC_DISCRIMINATORS = Object.freeze([
  ['melee', /melee/],
  ['minion', /minion/],
  ['projectile', /projectile/],
  ['bleed', /bleed/],
  ['ignite', /ignite|burn/],
  ['poison', /poison/],
  ['chill', /chill/],
  ['freeze', /freeze/],
  ['shock', /shock/],
  ['bow', /\bbow/],
  ['quarterstaff', /quartersta(?:ff|ves)/],
  ['life', /\blife/],
  ['mana', /\bmana/],
  ['shapeshift', /shapeshift/],
  ['plant', /plant/],
  ['fire', /\bfire/],
  ['cold', /\bcold/],
  ['lightning', /lightning/],
  ['chaos', /chaos/],
  ['physical', /physical/],
  ['spell', /spell/],
]);

function addToMapArray(map, key, value) {
  if (key == null) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
}

function uniqueModifiers(modifiers) {
  return [...new Map(modifiers.map(modifier => [modifier.id, modifier])).values()];
}

export function modifierOverlayKey(affix, legacyGroup, tier) {
  return [
    affix,
    legacyGroup,
    Number(tier?.ilvlReq) || 0,
    String(tier?.tier ?? ''),
  ].join('|');
}

export function legacyTierRanges(tier) {
  const ranges = [];
  const addLine = line => {
    if (Array.isArray(line?.vals)) {
      for (const value of line.vals) ranges.push([Number(value.min), Number(value.max)]);
    } else if (line?.min != null && line?.max != null) {
      ranges.push([Number(line.min), Number(line.max)]);
    }
  };
  if (Array.isArray(tier?.lines)) {
    for (const line of tier.lines) addLine(line);
  } else {
    addLine(tier);
  }
  return ranges;
}

export function normalizedModifierRanges(modifier) {
  return (modifier?.stats || [])
    .filter(stat => Array.isArray(stat.range))
    .map(stat => stat.range.map(Number));
}

function rangesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function legacyTierText(tier) {
  return [tier?.modLine, ...(tier?.lines || []).map(line => line?.modLine)]
    .filter(Boolean)
    .join(' ');
}

function semanticTokens(text) {
  const normalized = String(text || '').toLowerCase();
  return new Set(SEMANTIC_DISCRIMINATORS
    .filter(([, pattern]) => pattern.test(normalized))
    .map(([token]) => token));
}

function semanticScore(tier, modifier) {
  const legacyTokens = semanticTokens(legacyTierText(tier));
  const sourceTokens = semanticTokens((modifier?.stats || []).map(stat => stat.id).join(' '));
  return [...legacyTokens].filter(token => sourceTokens.has(token)).length;
}

// An Essence may guarantee an otherwise ordinary modifier. The normalized
// `essence` flag records that relationship; it does not make the modifier
// Essence-only. Influence rows, by contrast, are not part of ordinary pools.
export function isOrdinarySourceModifier(modifier) {
  return !!modifier &&
    (modifier.affix === 'prefix' || modifier.affix === 'suffix') &&
    modifier.influence == null &&
    !modifier.desecrated &&
    !modifier.corrupted &&
    !modifier.enchantment;
}

function legacyMatcherCandidates(candidates) {
  return candidates.filter(modifier =>
    !modifier.desecrated &&
    !modifier.essence &&
    !modifier.corrupted &&
    !modifier.enchantment);
}

function resolveCandidates(tier, coarseCandidates) {
  if (coarseCandidates.length === 1) {
    return { matches: coarseCandidates, strategy: 'coarse' };
  }

  const legacyRanges = legacyTierRanges(tier);
  const rangeCandidates = coarseCandidates.filter(modifier =>
    rangesEqual(legacyRanges, normalizedModifierRanges(modifier)));
  if (rangeCandidates.length === 1) {
    return { matches: rangeCandidates, strategy: 'range' };
  }

  const semanticPool = rangeCandidates.length ? rangeCandidates : coarseCandidates;
  const scored = semanticPool.map(modifier => ({
    modifier,
    score: semanticScore(tier, modifier),
  }));
  const maximumScore = scored.length ? Math.max(...scored.map(entry => entry.score)) : 0;
  const semanticCandidates = scored
    .filter(entry => maximumScore > 0 && entry.score === maximumScore)
    .map(entry => entry.modifier);
  if (semanticCandidates.length === 1) {
    return { matches: semanticCandidates, strategy: 'semantic' };
  }

  return {
    matches: semanticCandidates.length ? semanticCandidates : semanticPool,
    strategy: semanticCandidates.length ? 'semantic-ambiguous' : 'unresolved',
  };
}

export function buildModifierOverlayAudit(modBases, baseItems, normalizedModifiers) {
  const modifiers = normalizedModifiers?.modifiers || normalizedModifiers || [];
  const modifiersByClassGroupLevel = new Map();
  for (const modifier of modifiers) {
    for (const [classId] of modifier.spawnWeights || []) {
      const key = `${classId}|${modifier.affix}|${modifier.modifierGroup}|${modifier.requiredItemLevel}`;
      addToMapArray(modifiersByClassGroupLevel, key, modifier);
    }
  }

  const rows = [];
  for (const [poolId, mapping] of Object.entries(baseItems?.simulatorBaseMap || {})) {
    const typeData = modBases?.[poolId];
    if (!typeData) continue;
    const seenOverlayKeys = new Set();
    for (const [affix, groups] of [['prefix', typeData.prefixes || []], ['suffix', typeData.suffixes || []]]) {
      for (const group of groups) {
        for (const tier of group.tiers || []) {
          const overlayKey = modifierOverlayKey(affix, group.modGroup, tier);
          if (seenOverlayKeys.has(overlayKey)) {
            throw new Error(`Duplicate modifier overlay key for ${poolId}: ${overlayKey}.`);
          }
          seenOverlayKeys.add(overlayKey);

          const allCandidates = [];
          for (const classId of mapping.classIds || []) {
            const key = `${classId}|${affix}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`;
            allCandidates.push(...(modifiersByClassGroupLevel.get(key) || []));
          }
          const uniqueAllCandidates = uniqueModifiers(allCandidates);
          const coarseCandidates = uniqueAllCandidates.filter(isOrdinarySourceModifier);
          const legacyCandidates = uniqueModifiers(legacyMatcherCandidates(uniqueAllCandidates));
          const resolved = resolveCandidates(tier, coarseCandidates);
          const modifier = resolved.matches.length === 1 ? resolved.matches[0] : null;
          const classWeights = modifier
            ? (modifier.spawnWeights || [])
              .filter(([classId]) => (mapping.classIds || []).includes(classId))
              .map(([classId, weight]) => [Number(classId), Number(weight)])
            : [];
          const uniqueWeights = [...new Set(classWeights.map(([, weight]) => weight))];

          rows.push({
            poolId,
            affix,
            legacyGroup: group.modGroup,
            legacyTier: tier,
            overlayKey,
            mappingClassIds: (mapping.classIds || []).map(Number),
            legacyCandidateIds: legacyCandidates.map(candidate => candidate.id),
            coarseCandidateIds: coarseCandidates.map(candidate => candidate.id),
            resolvedCandidateIds: resolved.matches.map(candidate => candidate.id),
            matchStrategy: resolved.strategy,
            matchedUniquely: !!modifier,
            modifier,
            classWeights,
            poolSpawnWeight: uniqueWeights.length === 1 ? uniqueWeights[0] : null,
            legacyMatcherStatus: legacyCandidates.length === 0
              ? 'missing'
              : legacyCandidates.length === 1 ? 'unique' : 'ambiguous',
            legacyMatcherModifierId: legacyCandidates.length === 1 ? legacyCandidates[0].id : null,
          });
        }
      }
    }
  }

  const levelsBySourceGroup = new Map();
  for (const row of rows) {
    if (!row.modifier) continue;
    const key = `${row.poolId}|${row.affix}|${row.modifier.modifierGroupId}`;
    if (!levelsBySourceGroup.has(key)) levelsBySourceGroup.set(key, new Set());
    levelsBySourceGroup.get(key).add(Number(row.legacyTier.ilvlReq) || 0);
  }
  for (const row of rows) {
    if (!row.modifier) {
      row.displayTier = null;
      continue;
    }
    const key = `${row.poolId}|${row.affix}|${row.modifier.modifierGroupId}`;
    const levels = [...levelsBySourceGroup.get(key)].sort((left, right) => right - left);
    row.displayTier = levels.indexOf(Number(row.legacyTier.ilvlReq) || 0) + 1;
  }

  const failures = rows.filter(row => !row.matchedUniquely);
  const matchStrategies = Object.fromEntries([...new Set(rows.map(row => row.matchStrategy))]
    .sort()
    .map(strategy => [strategy, rows.filter(row => row.matchStrategy === strategy).length]));
  return {
    rows,
    failures,
    summary: {
      totalRows: rows.length,
      matchedRows: rows.length - failures.length,
      failedRows: failures.length,
      matchStrategies,
      legacyMatcher: {
        unique: rows.filter(row => row.legacyMatcherStatus === 'unique').length,
        ambiguous: rows.filter(row => row.legacyMatcherStatus === 'ambiguous').length,
        missing: rows.filter(row => row.legacyMatcherStatus === 'missing').length,
        wrongUnique: rows.filter(row => row.legacyMatcherStatus === 'unique' &&
          row.modifier && row.legacyMatcherModifierId !== row.modifier.id).length,
      },
    },
  };
}
