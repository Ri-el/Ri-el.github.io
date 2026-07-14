#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data', 'normalized');

const REQUIRED_ROOT_SECTIONS = [
  'categories', 'classes', 'items', 'mods', 'modgroups', 'classmods',
  'tags', 'families', 'essences', 'socketables', 'enums', 'stats',
  'methods', 'emotions',
];

const SIMPLE_BASE_CLASSES = {
  amulets: 'Amulet',
  belts: 'Belt',
  bows: 'Bow',
  bucklers: 'Buckler',
  claws: 'Claw',
  crossbows: 'Crossbow',
  daggers: 'Dagger',
  flails: 'Flail',
  foci: 'Focus',
  life_flasks: 'LifeFlask',
  mana_flasks: 'ManaFlask',
  one_hand_axes: 'One Hand Axe',
  one_hand_maces: 'One Hand Mace',
  one_hand_swords: 'One Hand Sword',
  quarterstaves: 'Warstaff',
  quivers: 'Quiver',
  rings: 'Ring',
  sceptres: 'Sceptre',
  spears: 'Spear',
  staves: 'Staff',
  two_hand_axes: 'Two Hand Axe',
  two_hand_maces: 'Two Hand Mace',
  two_hand_swords: 'Two Hand Sword',
  wands: 'Wand',
};

const ATTRIBUTE_BASES = {
  body_armours: 'Body Armour',
  boots: 'Boots',
  gloves: 'Gloves',
  helmets: 'Helmet',
  shields: 'Shield',
};

const ATTRIBUTE_ICONS = {
  dex: 'attr_dex',
  dex_int: 'attr_dexint',
  int: 'attr_int',
  str: 'attr_str',
  str_dex: 'attr_strdex',
  str_dex_int: 'attr_all',
  str_int: 'attr_strint',
};

const JEWEL_BASE_NAMES = {
  diamond: 'Diamond',
  emerald: 'Emerald',
  ruby: 'Ruby',
  sapphire: 'Sapphire',
  time_lost_diamond: 'Time-Lost Diamond',
  time_lost_emerald: 'Time-Lost Emerald',
  time_lost_ruby: 'Time-Lost Ruby',
  time_lost_sapphire: 'Time-Lost Sapphire',
};

const sha256 = value => createHash('sha256').update(value).digest('hex');
const numericSort = (a, b) => Number(a) - Number(b);

export function parseCoeExport(rawText) {
  let payload = String(rawText).trim();
  let wrapper = 'json';
  if (/^coedata\s*=/.test(payload)) {
    wrapper = 'coedata-assignment';
    payload = payload.replace(/^coedata\s*=\s*/, '');
    if (payload.endsWith(';')) payload = payload.slice(0, -1).trimEnd();
  }
  const data = JSON.parse(payload);
  for (const section of REQUIRED_ROOT_SECTIONS) {
    if (!(section in data)) throw new Error(`Required source section is missing: ${section}`);
  }
  return { data, wrapper };
}

function entryById(section, id) {
  if (!section || id == null) return null;
  const position = section.index?.[String(id)];
  return position == null ? null : section.entries[position] || null;
}

function resolvedTag(data, id) {
  const tag = entryById(data.tags, id);
  return tag ? { id: tag.id, key: tag.key } : { id: Number(id), key: null };
}

function className(data, classRecord) {
  return classRecord ? data.enums.classes[classRecord.class] ?? null : null;
}

function slotName(data, classRecord) {
  return classRecord ? data.enums.categories[classRecord.category] ?? null : null;
}

function itemName(item) {
  return item?.wiki || null;
}

function sortObject(object, comparator = numericSort) {
  return Object.fromEntries(Object.entries(object || {}).sort(([a], [b]) => comparator(a, b)));
}

function buildSimulatorBaseMap(data) {
  const map = {};
  const allClasses = data.classes.entries;
  const classItems = classId => data.items.entries.filter(item => item.class === classId);
  const add = (simulatorId, classRecords, concreteName = null) => {
    const selected = classRecords.slice().sort((a, b) => a.id - b.id);
    if (!selected.length) throw new Error(`No source class matched simulator base: ${simulatorId}`);
    const concrete = selected.flatMap(record => classItems(record.id))
      .filter(item => !concreteName || itemName(item) === concreteName)
      .map(item => item.id)
      .sort(numericSort);
    map[simulatorId] = {
      classIds: selected.map(record => record.id),
      concreteBaseIds: concrete,
    };
  };

  for (const [simulatorId, expectedClass] of Object.entries(SIMPLE_BASE_CLASSES)) {
    add(simulatorId, allClasses.filter(record => className(data, record) === expectedClass));
  }

  add('charms', allClasses.filter(record =>
    className(data, record) === 'UtilityFlask' && slotName(data, record) === 'Charm'));

  for (const [prefix, expectedClass] of Object.entries(ATTRIBUTE_BASES)) {
    for (const [suffix, icon] of Object.entries(ATTRIBUTE_ICONS)) {
      const simulatorId = `${prefix}_${suffix}`;
      const matches = allClasses.filter(record =>
        className(data, record) === expectedClass && record.icon === icon);
      // Only Body Armours expose the all-attribute variant in the simulator.
      if (!matches.length && suffix === 'str_dex_int' && prefix !== 'body_armours') continue;
      if (matches.length) add(simulatorId, matches);
    }
  }

  for (const [simulatorId, baseName] of Object.entries(JEWEL_BASE_NAMES)) {
    const item = data.items.entries.find(candidate => itemName(candidate) === baseName);
    if (!item) throw new Error(`No source item matched simulator jewel base: ${simulatorId}`);
    const sourceClass = entryById(data.classes, item.class);
    add(simulatorId, [sourceClass], baseName);
  }

  return sortObject(map, (a, b) => a.localeCompare(b));
}

function normalizeBaseData(data, simulatorBaseMap) {
  const selectedClassIds = new Set(Object.values(simulatorBaseMap).flatMap(entry => entry.classIds));
  const classRecords = data.classes.entries
    .filter(record => selectedClassIds.has(record.id))
    .sort((a, b) => a.id - b.id)
    .map(record => ({
      id: record.id,
      itemClass: className(data, record),
      equipmentSlot: slotName(data, record),
      group: record.group,
      iconKey: record.icon || null,
      affixLimit: record.affixes ?? null,
      fixedRarity: record.rarity || null,
      canUpgrade: !!record.upgrade,
      canCorrupt: !!record.corrupt,
      unmodifiable: record.unmodifiable ?? null,
      modifierWeights: Object.entries(data.classmods[record.id] || {})
        .map(([modifierId, weight]) => [Number(modifierId), Number(weight)])
        .sort((a, b) => a[0] - b[0]),
    }));

  const bases = data.items.entries
    .filter(item => selectedClassIds.has(item.class))
    .sort((a, b) => a.id - b.id)
    .map(item => {
      const sourceClass = entryById(data.classes, item.class);
      const normalized = {
        id: item.id,
        metadataKey: item.key,
        displayName: itemName(item),
        classId: item.class,
        itemClass: className(data, sourceClass),
        equipmentSlot: slotName(data, sourceClass),
        tags: (item.tags || []).map(tagId => resolvedTag(data, tagId).key).filter(Boolean),
        socketCount: item.sockets ?? null,
        modifierPoolClassId: item.class,
        implicitModifierIds: (item.implicits || []).map(Number),
        sourceCorruptFlag: !!item.corrupt,
        unmodifiable: !!item.unmodifiable,
        dropLevel: item.drop ?? null,
      };
      if (item.reqs != null) normalized.requirements = item.reqs;
      if (item.props != null) normalized.baseProperties = item.props;
      if (item.dim != null && (item.dim[0] !== 1 || item.dim[1] !== 1)) normalized.dimensions = item.dim;
      return normalized;
    });

  const usedTagKeys = new Set(bases.flatMap(base => base.tags));
  return {
    schemaVersion: 1,
    simulatorBaseMap,
    classes: classRecords,
    bases,
    tags: data.tags.entries.filter(tag => usedTagKeys.has(tag.key)).map(tag => ({ id: tag.id, key: tag.key })),
  };
}

function collectEssenceModifierMetadata(data) {
  const modifierToEssences = new Map();
  const modifierToBases = new Map();
  const addEssence = (modifierId, essenceId) => {
    const key = Number(modifierId);
    if (!modifierToEssences.has(key)) modifierToEssences.set(key, new Set());
    modifierToEssences.get(key).add(Number(essenceId));
  };

  for (const [essenceId, classMap] of Object.entries(data.essences.byessences || {})) {
    for (const modifierIds of Object.values(classMap || {})) {
      for (const modifierId of modifierIds || []) addEssence(modifierId, essenceId);
    }
  }
  for (const assignments of Object.values(data.essences.classmods || {})) {
    for (const [modifierId, essenceId] of Object.entries(assignments || {})) addEssence(modifierId, essenceId);
  }
  for (const [baseId, assignments] of Object.entries(data.essences.basemods || {})) {
    for (const [modifierId, essenceId] of Object.entries(assignments || {})) {
      addEssence(modifierId, essenceId);
      const key = Number(modifierId);
      if (!modifierToBases.has(key)) modifierToBases.set(key, new Set());
      modifierToBases.get(key).add(Number(baseId));
    }
  }
  return { modifierToEssences, modifierToBases };
}

function collectRelevantModifierIds(data, normalizedBases, essenceMetadata) {
  const ids = new Set();
  for (const sourceClass of normalizedBases.classes) {
    for (const [modifierId] of sourceClass.modifierWeights) ids.add(modifierId);
  }
  for (const base of normalizedBases.bases) {
    for (const modifierId of base.implicitModifierIds) ids.add(modifierId);
  }
  for (const modifierId of essenceMetadata.modifierToEssences.keys()) ids.add(modifierId);
  for (const mapping of Object.values(data.emotions.items || {})) {
    for (const modifierIds of Object.values(mapping || {})) {
      for (const modifierId of modifierIds || []) ids.add(Number(modifierId));
    }
  }
  for (const mapping of Object.values(data.emotions.basemods || {})) {
    const modifierIds = Array.isArray(mapping) ? mapping : Object.values(mapping || {}).flat();
    for (const modifierId of modifierIds) ids.add(Number(modifierId));
  }
  // Retain item-domain Corrupted and Enchantment records for the existing Vaal
  // flow and for explicit unsupported-state auditing.
  for (const modifier of data.mods.entries) {
    const group = entryById(data.modgroups, modifier.group);
    if (group && group.domain === 1 && (group.type === 5 || group.type === 10)) ids.add(modifier.id);
  }
  return ids;
}

function buildTierRanks(data) {
  const levelsByGroup = new Map();
  for (const modifier of data.mods.entries) {
    if (!levelsByGroup.has(modifier.group)) levelsByGroup.set(modifier.group, new Set());
    levelsByGroup.get(modifier.group).add(Number(modifier.minlvl) || 0);
  }
  const rankByGroupLevel = new Map();
  for (const [groupId, levels] of levelsByGroup) {
    const sorted = [...levels].sort((a, b) => b - a);
    const ranks = new Map(sorted.map((level, index) => [level, index + 1]));
    rankByGroupLevel.set(groupId, ranks);
  }
  return rankByGroupLevel;
}

function normalizeModifiers(data, normalizedBases) {
  const essenceMetadata = collectEssenceModifierMetadata(data);
  const relevantIds = collectRelevantModifierIds(data, normalizedBases, essenceMetadata);
  const selectedClassIds = new Set(normalizedBases.classes.map(record => record.id));
  const tierRanks = buildTierRanks(data);

  const modifiers = [...relevantIds]
    .map(id => entryById(data.mods, id))
    .filter(Boolean)
    .sort((a, b) => a.id - b.id)
    .map(modifier => {
      const group = entryById(data.modgroups, modifier.group);
      const generationType = group ? data.enums.types[group.type] ?? null : null;
      const weightConditions = (group?.gtags || []).map((tagId, index) => [
        resolvedTag(data, tagId).key,
        Number(group.gvals?.[index]),
      ]);
      const spawnWeights = [];
      for (const classId of selectedClassIds) {
        const weight = data.classmods[classId]?.[modifier.id];
        if (weight != null) spawnWeights.push([classId, Number(weight)]);
      }
      spawnWeights.sort((a, b) => a[0] - b[0]);
      const uniqueWeights = new Set(spawnWeights.map(entry => entry[1]));
      const families = (group?.families || [])
        .map(id => entryById(data.families, id)?.key || null)
        .filter(Boolean);
      const essenceIds = [...(essenceMetadata.modifierToEssences.get(modifier.id) || [])].sort(numericSort);
      const applicableBaseIds = [...(essenceMetadata.modifierToBases.get(modifier.id) || [])].sort(numericSort);
      const normalized = {
        id: modifier.id,
        key: modifier.key,
        sourceLabelId: modifier.label ?? null,
        affix: generationType === 'PREFIX' ? 'prefix' : generationType === 'SUFFIX' ? 'suffix' : null,
        generationType,
        modifierGroupId: modifier.group,
        modifierGroup: families[0] || `group:${modifier.group}`,
        tier: tierRanks.get(modifier.group)?.get(Number(modifier.minlvl) || 0) ?? 1,
        requiredItemLevel: Number(modifier.minlvl) || 0,
        spawnWeight: uniqueWeights.size === 1 ? spawnWeights[0]?.[1] ?? null : null,
        spawnWeights,
        modifierTags: (group?.tags || []).map(tagId => resolvedTag(data, tagId).key).filter(Boolean),
        stats: (modifier.stats || []).map(stat => ({
          id: data.stats[stat.index]?.id || String(stat.index),
          range: stat.range || null,
          ...(stat.inverted ? { inverted: true } : {}),
          ...(stat.values ? { values: true } : {}),
        })),
      };
      if (families.length > 1) normalized.families = families;
      if (Number(modifier.maxlvl) !== 100) normalized.maximumItemLevel = Number(modifier.maxlvl) || null;
      if (weightConditions.length) {
        normalized.weightConditions = weightConditions;
        const forbiddenTags = weightConditions.filter(([, weight]) => weight === 0).map(([tag]) => tag);
        if (forbiddenTags.length) normalized.forbiddenTags = forbiddenTags;
      }
      const addedTags = (group?.adds || []).map(tagId => resolvedTag(data, tagId).key).filter(Boolean);
      if (addedTags.length) normalized.addedTags = addedTags;
      if (applicableBaseIds.length) normalized.applicableBaseIds = applicableBaseIds;
      if (/^AbyssMod/.test(modifier.key || '')) normalized.desecrated = true;
      if (essenceIds.length > 0 || generationType === 'ESSENCE') {
        normalized.essence = true;
        normalized.essenceIds = essenceIds;
      }
      if (generationType === 'ENCHANTMENT') normalized.enchantment = true;
      if (generationType === 'CORRUPTED') normalized.corrupted = true;
      const domain = group ? data.enums.domains[group.domain] ?? group.domain : null;
      if (domain !== 'ITEM') normalized.domain = domain;
      if (group?.influence != null && group.influence !== 6) normalized.influence = group.influence;
      if (group?.rank) normalized.rank = group.rank;
      return normalized;
    });

  return {
    schemaVersion: 1,
    tierField: 'Derived rank of required item levels within the stable modifier group; 1 is the highest level.',
    requiredTagsStatus: 'Not explicit in source; ordered positive tag weights remain in weightConditions.',
    modifiers,
  };
}

function normalizeItem(data, item, classifications = []) {
  const sourceClass = entryById(data.classes, item.class);
  return {
    id: item.id,
    metadataKey: item.key,
    displayName: itemName(item),
    itemClass: className(data, sourceClass),
    equipmentSlot: slotName(data, sourceClass),
    tags: (item.tags || []).map(tagId => resolvedTag(data, tagId)),
    classifications: [...new Set(classifications)].sort(),
  };
}

function normalizeMethodNode(data, node) {
  const normalized = {
    id: node.id ?? null,
    index: node.index ?? null,
    label: node.label || null,
    handler: node.handler || null,
    itemId: node.item ?? null,
    itemName: itemName(entryById(data.items, node.item)),
    constraints: node.constraints || [],
    omens: node.omens || [],
    properties: node.properties || [],
    reroll: node.reroll || [],
    local: !!node.local,
    pinnable: !!node.pinnable,
    default: !!node.default,
  };
  if (Array.isArray(node.elements)) {
    normalized.elements = node.elements.map(child => normalizeMethodNode(data, child));
  } else {
    normalized.elements = [];
    normalized.elementSource = typeof node.elements === 'string' ? node.elements : null;
  }
  return normalized;
}

function collectMethodItemIds(methods, target) {
  for (const method of methods) {
    if (method.itemId != null) target.add(method.itemId);
    collectMethodItemIds(method.elements || [], target);
  }
}

function normalizeSocketEffect(data, effect) {
  if (!effect) return null;
  return {
    statId: data.stats[effect.index]?.id || String(effect.index),
    statIndex: effect.index,
    outputLabelId: effect.output ?? null,
    range: effect.range || null,
    scaling: !!effect.scaling,
    semantics: effect.semantics ?? null,
    local: !!effect.local,
    weapon: !!effect.weapon,
    virtual: !!effect.virtual,
    inverted: !!effect.inverted,
    values: !!effect.values,
  };
}

function normalizeCraftingItems(data) {
  const methods = data.methods.crafting.map(node => normalizeMethodNode(data, node));
  const itemClassifications = new Map();
  const addClassification = (itemId, classification) => {
    if (itemId == null) return;
    if (!itemClassifications.has(Number(itemId))) itemClassifications.set(Number(itemId), new Set());
    itemClassifications.get(Number(itemId)).add(classification);
  };

  const methodItemIds = new Set();
  collectMethodItemIds(methods, methodItemIds);
  for (const id of methodItemIds) addClassification(id, 'crafting-method');
  for (const omen of data.methods.omens.entries || []) addClassification(omen.item, 'omen');
  for (const essence of data.essences.entries || []) addClassification(essence.item, 'essence');
  for (const socketable of data.socketables.entries || []) addClassification(socketable.item, 'socketable');
  for (const itemId of Object.keys(data.emotions.items || {})) addClassification(itemId, 'distilled-emotion');

  for (const item of data.items.entries) {
    const tags = new Set((item.tags || []).map(tagId => entryById(data.tags, tagId)?.key).filter(Boolean));
    const name = itemName(item) || '';
    if (tags.has('catalyst') || tags.has('jewel_catalyst')) addClassification(item.id, 'catalyst');
    if (tags.has('quality_currency')) addClassification(item.id, 'quality-currency');
    if (tags.has('socket_currency')) addClassification(item.id, 'socket-currency');
    if (tags.has('rune') || data.enums.classes[entryById(data.classes, item.class)?.class] === 'SoulCore') {
      addClassification(item.id, 'socketable-inventory');
    }
    if (/Alloy|Flux|Runic Ward|Rune of Aldur/i.test(name)) addClassification(item.id, 'runeforging-data-only');
    if (/Sacrifice/i.test(name)) addClassification(item.id, 'sacrifice-data-only');
    if (/Hinekora's Lock|Preserved Cranium/i.test(name)) addClassification(item.id, 'specialized-crafting');
  }

  const items = [...itemClassifications]
    .map(([itemId, classifications]) => ({ item: entryById(data.items, itemId), classifications }))
    .filter(entry => entry.item)
    .map(entry => normalizeItem(data, entry.item, [...entry.classifications]))
    .filter(item => item.metadataKey)
    .sort((a, b) => a.id - b.id);

  const omens = (data.methods.omens.entries || []).map(omen => ({
    itemId: omen.item,
    displayName: itemName(entryById(data.items, omen.item)),
    action: omen.action,
    constraints: omen.constraints || [],
  }));

  const socketableClassIds = [...new Set((data.socketables.entries || [])
    .flatMap(entry => Object.keys(entry.class || {}).map(Number)))]
    .sort((a, b) => a - b);
  const socketableItemClasses = Object.fromEntries(socketableClassIds.map(itemClassId => [
    String(itemClassId),
    data.enums.classes[itemClassId] || null,
  ]));
  const socketables = (data.socketables.entries || []).map(entry => ({
    itemId: entry.item,
    displayName: itemName(entryById(data.items, entry.item)),
    classifications: entry.classify || [],
    type: entry.type,
    limit: entry.limit ?? null,
    bound: !!entry.bound,
    corrupt: !!entry.corrupt,
    effects: {
      martial: normalizeSocketEffect(data, entry.martial),
      armour: normalizeSocketEffect(data, entry.armour),
      caster: normalizeSocketEffect(data, entry.caster),
      all: normalizeSocketEffect(data, entry.all),
      classes: Object.fromEntries(Object.entries(entry.class || {}).map(([classId, effect]) =>
        [classId, normalizeSocketEffect(data, effect)])),
    },
  })).sort((a, b) => a.itemId - b.itemId);

  const emotions = Object.entries(data.emotions.items || {})
    .map(([emotionItemId, mapping]) => ({
      itemId: Number(emotionItemId),
      displayName: itemName(entryById(data.items, emotionItemId)),
      modifiersByItemClass: Object.entries(mapping || {}).map(([itemClassId, modifierIds]) => ({
        itemClassId: Number(itemClassId),
        itemClass: data.enums.classes[Number(itemClassId)] || null,
        modifierIds: (modifierIds || []).map(Number),
      })),
    }))
    .sort((a, b) => a.itemId - b.itemId);

  return {
    schemaVersion: 1,
    methods,
    omens,
    items,
    catalysts: items.filter(item => item.classifications.includes('catalyst')).map(item => item.id),
    socketables,
    socketableItemClasses,
    socketableTypes: data.methods.socketables.types || [],
    socketableLimits: data.methods.socketables.limits || [],
    emotions,
    emotionBaseMappings: sortObject(data.emotions.basemods || {}),
  };
}

function normalizeEssences(data) {
  const entries = data.essences.entries.map(essence => {
    const sourceItem = entryById(data.items, essence.item);
    const typeRecord = data.essences.types?.find(type => type.id === essence.type) || null;
    return {
      id: essence.id,
      itemId: essence.item,
      displayName: itemName(sourceItem),
      level: essence.level ?? null,
      restriction: essence.restriction ?? null,
      type: essence.type,
      typeLabelId: typeRecord?.label ?? null,
      corrupted: !!typeRecord?.corrupted,
      guaranteedModifiersByItemClass: Object.entries(data.essences.byessences[essence.id] || {})
        .map(([itemClassId, modifierIds]) => ({
          itemClassId: Number(itemClassId),
          itemClass: data.enums.classes[Number(itemClassId)] || null,
          modifierIds: modifierIds.map(Number),
        }))
        .sort((a, b) => a.itemClassId - b.itemClassId),
    };
  }).sort((a, b) => a.id - b.id);

  const normalizeAssignments = source => Object.entries(source || {}).map(([scopeId, assignments]) => ({
    scopeId: Number(scopeId),
    assignments: Object.entries(assignments || {})
      .map(([modifierId, essenceId]) => ({ modifierId: Number(modifierId), essenceId: Number(essenceId) }))
      .sort((a, b) => a.modifierId - b.modifierId),
  })).sort((a, b) => a.scopeId - b.scopeId);

  return {
    schemaVersion: 1,
    types: data.essences.types || [],
    essences: entries,
    classModifierAssignments: normalizeAssignments(data.essences.classmods),
    baseModifierAssignments: normalizeAssignments(data.essences.basemods),
  };
}

export function normalizeCoeData(data, source = {}) {
  const simulatorBaseMap = buildSimulatorBaseMap(data);
  const baseItems = normalizeBaseData(data, simulatorBaseMap);
  const modifiers = normalizeModifiers(data, baseItems);
  const craftingItems = normalizeCraftingItems(data);
  const essences = normalizeEssences(data);

  const payloads = { baseItems, modifiers, craftingItems, essences };
  const serialized = Object.fromEntries(Object.entries(payloads).map(([key, value]) => [key, JSON.stringify(value)]));
  const manifest = {
    schemaVersion: 1,
    targetGameVersion: '0.5.4',
    source: {
      fileName: source.fileName || null,
      bytes: source.bytes ?? null,
      sha256: source.sha256 || null,
      wrapper: source.wrapper || null,
      embeddedGameVersion: null,
      versionStatus: 'Source export does not encode a game version; 0.5.4 compatibility must be verified per mechanic.',
    },
    observedRootSections: Object.keys(data),
    counts: {
      simulatorBaseMappings: Object.keys(baseItems.simulatorBaseMap).length,
      sourceClasses: baseItems.classes.length,
      concreteBases: baseItems.bases.length,
      modifiers: modifiers.modifiers.length,
      desecratedModifiers: modifiers.modifiers.filter(modifier => modifier.desecrated).length,
      essenceModifiers: modifiers.modifiers.filter(modifier => modifier.essence).length,
      craftingItems: craftingItems.items.length,
      omens: craftingItems.omens.length,
      essences: essences.essences.length,
      socketables: craftingItems.socketables.length,
    },
    outputHashes: Object.fromEntries(Object.entries(serialized).map(([key, value]) => [key, sha256(value)])),
    limitations: [
      'Numeric localization labels have no string table in this export; modifier display templates are unavailable.',
      'Positive generation-tag weights are ordered conditions, not explicit mandatory-tag declarations.',
      'The simulator selects class-level pools rather than concrete base IDs, so base-specific conditions cannot always be applied safely.',
      'Quality, socket, essence, catalyst, emotion, Genesis, runeforging, corruption-upgrade, and sacrifice state transitions are not fully specified.',
    ],
  };
  return { ...payloads, manifest };
}

export function writeNormalizedFiles(normalized, outputDir = OUTPUT_DIR) {
  mkdirSync(outputDir, { recursive: true });
  const files = {
    'base-items.json': normalized.baseItems,
    'modifiers.json': normalized.modifiers,
    'crafting-items.json': normalized.craftingItems,
    'essences.json': normalized.essences,
    'version-manifest.json': normalized.manifest,
  };
  for (const [fileName, value] of Object.entries(files)) {
    writeFileSync(path.join(outputDir, fileName), `${JSON.stringify(value)}\n`, 'utf8');
  }
  return Object.keys(files);
}

function runCli() {
  const inputArg = process.argv[2];
  if (!inputArg || inputArg === '--help' || inputArg === '-h') {
    console.log('Usage: node tools/convert-coe-data.mjs <path-to-data.json> [--check]');
    process.exitCode = inputArg ? 0 : 1;
    return;
  }
  const checkOnly = process.argv.includes('--check');
  const inputPath = path.resolve(process.cwd(), inputArg);
  const raw = readFileSync(inputPath, 'utf8');
  const { data, wrapper } = parseCoeExport(raw);
  const normalized = normalizeCoeData(data, {
    fileName: path.basename(inputPath),
    bytes: Buffer.byteLength(raw),
    sha256: sha256(raw),
    wrapper,
  });

  if (checkOnly) {
    const expected = {
      'base-items.json': normalized.baseItems,
      'modifiers.json': normalized.modifiers,
      'crafting-items.json': normalized.craftingItems,
      'essences.json': normalized.essences,
      'version-manifest.json': normalized.manifest,
    };
    for (const [fileName, value] of Object.entries(expected)) {
      const actual = JSON.parse(readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8'));
      if (JSON.stringify(actual) !== JSON.stringify(value)) {
        throw new Error(`${fileName} is stale; rerun the converter without --check.`);
      }
    }
    console.log(`Normalized data is current (${normalized.manifest.counts.modifiers} modifiers, ${normalized.manifest.counts.concreteBases} bases).`);
    return;
  }

  const files = writeNormalizedFiles(normalized);
  console.log(`Parsed ${path.basename(inputPath)} (${wrapper}); wrote ${files.length} normalized files.`);
  console.log(`Retained ${normalized.manifest.counts.concreteBases} bases, ${normalized.manifest.counts.modifiers} modifiers, ${normalized.manifest.counts.essences} essences, and ${normalized.manifest.counts.socketables} socketables.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
