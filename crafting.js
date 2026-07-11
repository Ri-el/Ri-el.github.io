// crafting.js - PoE2 Crafting Engine (base-agnostic)
// ES Module — no external dependencies
//
// The engine is no longer hardcoded to jewels. It reads a generic base data
// object keyed by base type (supports both `bases` and the legacy `jewelTypes`
// key) and per-base affix limits. Jewels remain the default base.

class CraftingEngine {
  // Ordinary equipment can hold three prefixes and three suffixes. Jewels are
  // the exception at two of each; flasks and charms are Magic-only.
  static LIMITS = {
    magic: { prefixes: 1, suffixes: 1 },
    rare:  { prefixes: 3, suffixes: 3 },
  };

  static JEWEL_LIMITS = {
    magic: { prefixes: 1, suffixes: 1 },
    rare:  { prefixes: 2, suffixes: 2 },
  };

  static MAGIC_ONLY_LIMITS = {
    magic: { prefixes: 1, suffixes: 1 },
  };

  static JEWEL_BASE_TYPES = new Set([
    'ruby', 'sapphire', 'emerald', 'diamond',
    'time_lost_ruby', 'time_lost_sapphire', 'time_lost_emerald', 'time_lost_diamond',
  ]);

  static MAGIC_ONLY_BASE_TYPES = new Set(['life_flasks', 'mana_flasks', 'charms']);

  // PoE2 0.5.4 minimum modifier levels. These filter tiers, not the numeric
  // value rolled within a selected tier.
  static CURRENCY_MIN_MODIFIER_LEVEL = {
    greater_transmutation: 44,
    perfect_transmutation: 70,
    greater_augmentation: 44,
    perfect_augmentation: 70,
    greater_regal: 35,
    perfect_regal: 50,
    greater_exalted: 35,
    perfect_exalted: 50,
    greater_chaos: 35,
    perfect_chaos: 50,
  };

  // Runtime fallback for file:// use. A caller may inject the attributed rules
  // from data/crafting/quality-rules.json at development/test time; the browser
  // never fetches that JSON. This copy keeps state migration self-contained but
  // does not enable a quality-currency operation or UI by itself.
  static DEFAULT_QUALITY_RULES = {
    schemaVersion: 1,
    targetGameVersion: '0.5.4',
    defaultMaximumQuality: 20,
    itemClasses: {
      martial_weapon: {
        label: 'martial weapon',
        baseTypes: [
          'claws', 'daggers', 'one_hand_swords', 'one_hand_axes',
          'one_hand_maces', 'spears', 'flails', 'bows', 'two_hand_swords',
          'two_hand_axes', 'two_hand_maces', 'quarterstaves', 'crossbows',
          'talismans',
        ],
        itemClassNames: [
          'Claw', 'Dagger', 'One Hand Sword', 'One Hand Axe', 'One Hand Mace',
          'Spear', 'Flail', 'Bow', 'Two Hand Sword', 'Two Hand Axe',
          'Two Hand Mace', 'Warstaff', 'Crossbow', 'Talisman',
        ],
      },
      caster_weapon: {
        label: 'caster weapon',
        baseTypes: ['wands', 'staves', 'sceptres'],
        itemClassNames: ['Wand', 'Staff', 'Sceptre'],
      },
      armour: {
        label: 'armour',
        baseTypes: ['bucklers', 'foci'],
        baseTypePrefixes: ['gloves_', 'boots_', 'helmets_', 'body_armours_', 'shields_'],
        itemClassNames: ['Gloves', 'Boots', 'Helmet', 'Body Armour', 'Shield', 'Buckler', 'Focus'],
      },
      flask: {
        label: 'flask',
        baseTypes: ['life_flasks', 'mana_flasks'],
        itemClassNames: ['Life Flask', 'Mana Flask', 'Flask'],
      },
      skill_gem: {
        label: 'Skill Gem',
        baseTypes: ['skill_gem', 'skill_gems'],
        itemClassNames: ['Skill Gem'],
        tags: ['skill_gem'],
      },
      support_gem: {
        label: 'Support Gem',
        baseTypes: ['support_gem', 'support_gems'],
        itemClassNames: ['Support Gem'],
        tags: ['support_gem'],
      },
      jewellery: {
        label: 'jewellery',
        baseTypes: ['rings', 'amulets'],
        itemClassNames: ['Ring', 'Amulet'],
      },
      belt: { label: 'belt', baseTypes: ['belts'], itemClassNames: ['Belt'] },
      quiver: { label: 'quiver', baseTypes: ['quivers'], itemClassNames: ['Quiver'] },
      jewel: {
        label: 'jewel',
        baseTypes: [
          'ruby', 'sapphire', 'emerald', 'diamond',
          'time_lost_ruby', 'time_lost_sapphire', 'time_lost_emerald', 'time_lost_diamond',
        ],
        itemClassNames: ['Jewel'],
      },
      charm: { label: 'charm', baseTypes: ['charms'], itemClassNames: ['Charm'] },
    },
    operations: {
      blacksmiths_whetstone: {
        displayName: "Blacksmith's Whetstone",
        targetClasses: ['martial_weapon'],
        targetDescription: 'a martial weapon',
        qualityType: 'normal', maximumQuality: 20,
        increment: {
          kind: 'unverified', status: 'blocked_missing_formula',
          reason: "Unsupported — verification required: the exact Path of Exile 2 0.5.4 item-level quality increment formula for Blacksmith's Whetstone is unavailable in the cited sources.",
        },
      },
      arcanists_etcher: {
        displayName: "Arcanist's Etcher",
        targetClasses: ['caster_weapon'],
        targetDescription: 'a wand, staff or sceptre',
        qualityType: 'normal', maximumQuality: 20,
        increment: {
          kind: 'unverified', status: 'blocked_missing_formula',
          reason: "Unsupported — verification required: the exact Path of Exile 2 0.5.4 item-level quality increment formula for Arcanist's Etcher is unavailable in the cited sources.",
        },
      },
      armourers_scrap: {
        displayName: "Armourer's Scrap",
        targetClasses: ['armour'],
        targetDescription: 'an armour item',
        qualityType: 'normal', maximumQuality: 20,
        increment: {
          kind: 'unverified', status: 'blocked_missing_formula',
          reason: "Unsupported — verification required: the exact Path of Exile 2 0.5.4 item-level quality increment formula for Armourer's Scrap is unavailable in the cited sources.",
        },
      },
      glassblowers_bauble: {
        displayName: "Glassblower's Bauble",
        targetClasses: ['flask'],
        targetDescription: 'a flask',
        qualityType: 'normal', maximumQuality: 20,
        increment: {
          kind: 'unverified', status: 'blocked_missing_formula',
          reason: "Unsupported — verification required: the exact Path of Exile 2 0.5.4 item-level quality increment formula for Glassblower's Bauble is unavailable in the cited sources.",
        },
      },
      gemcutters_prism: {
        displayName: "Gemcutter's Prism",
        targetClasses: ['skill_gem'],
        targetDescription: 'a Skill Gem',
        qualityType: 'normal', maximumQuality: 20,
        increment: { kind: 'fixed', status: 'verified', amount: 5 },
      },
    },
  };

  static RARE_NAME_A = ['Brood','Cataclysm','Dragon','Doom','Vortex','Storm','Blood','Onslaught','Eagle','Empyrean','Phoenix','Grim','Hypnotic','Maelstrom','Pandemonium','Rune','Skull','Sol','Spirit','Tempest','Vengeance','Viper','Wrath','Carrion','Corpse','Demon','Dusk','Gloom','Hate','Morbid'];
  static RARE_NAME_B = ['Husk','Wound','Whorl','Bane','Crest','Glyph','Grasp','Knot','Mark','Pith','Sigil','Song','Star','Thirst','Veil','Ward','Weave','Bauble','Charm','Eye','Heart','Light','Loop','Nexus','Pulse','Shard','Spark','Token','Visage','Core'];

  // Abyssal Bone configuration. For jewels the relevant bone is the
  // Preserved Cranium: it opens the Well of Souls and reveals 3 options
  // (a mix of Desecrated/Abyssal and ordinary affixes on the targeted side).
  static BONES = {
    // Cranium is the jewel bone. In-game only the Preserved quality exists for
    // Craniums (Gnawed/Ancient apply to Jawbone/Rib/Collarbone, not jewels).
    preserved_cranium: { name: 'Preserved Cranium', reveal: 3, desecratedOnly: false },
  };

  // `desecratedData` is the parsed contents of data/desecrated-mods.json (or null).
  constructor(modData, baseType = 'ruby', desecratedData = null, sourceModifierOverlay = null, qualityRules = null, concreteBase = null) {
    this._modData = modData;
    // Keep `jewelType` for backwards-compatibility (stash records, UI), and
    // expose `baseType` as the generic alias.
    this.baseType = baseType;
    this.jewelType = baseType;

    const typeData = modData?.bases?.[baseType] ?? modData?.jewelTypes?.[baseType];
    if (!typeData) throw new Error(`Invalid base type: ${baseType}`);
    this._typeData = typeData;
    this._sourceModifierOverlay = sourceModifierOverlay instanceof Map ? sourceModifierOverlay : new Map();
    this._typeBaseTags = new Set(typeData.baseTags || typeData.tags || []);
    this._concreteBase = this._normalizeConcreteBaseDefinition(concreteBase);
    this._refreshBaseTags();
    const globalQualityRules = typeof globalThis !== 'undefined' ? globalThis.QUALITY_RULES : null;
    const suppliedQualityRules = qualityRules || globalQualityRules;
    this._qualityRules = structuredClone(
      suppliedQualityRules?.operations && suppliedQualityRules?.itemClasses
        ? suppliedQualityRules
        : CraftingEngine.DEFAULT_QUALITY_RULES
    );

    this._limits = typeData.limits || (
      CraftingEngine.MAGIC_ONLY_BASE_TYPES.has(baseType)
        ? CraftingEngine.MAGIC_ONLY_LIMITS
        : CraftingEngine.JEWEL_BASE_TYPES.has(baseType)
          ? CraftingEngine.JEWEL_LIMITS
          : CraftingEngine.LIMITS
    );

    this._prefixPool = typeData.prefixes || [];
    this._suffixPool = typeData.suffixes || [];
    this._vaalCorruptedPool = typeData.vaalCorruptedMods || [];

    // Desecrated (Abyssal) mod pools for this base, if any.
    const desData = desecratedData?.bases?.[baseType] ?? desecratedData?.jewelTypes?.[baseType] ?? null;
    this._desecratedPrefixes = (desData?.prefixes || []).slice();
    this._desecratedSuffixes = (desData?.suffixes || []).slice();
    this._bones = desecratedData?.bones || {};
    this._pendingDesecration = null;

    this._item = this._createBlankItem(typeData.name);

    this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
    this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
  }

  getItem() { return structuredClone(this._item); }

  // Concrete base identity is independent from the simulator modifier pool.
  // The browser controller hydrates this record exclusively from the checked-in
  // normalized data. Keeping a small serializable snapshot on the item makes
  // base identity survive save/load, history, and Hinekora previews without
  // coupling the engine to browser globals.
  _normalizeConcreteBaseDefinition(base) {
    if (!base || typeof base !== 'object' || base.id == null || !base.displayName) return null;
    const numericOrNull = value => {
      if (value == null || value === '') return null;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    };
    return {
      id: base.id,
      metadataKey: base.metadataKey || null,
      displayName: String(base.displayName),
      itemClass: base.itemClass || null,
      simulatorPoolId: base.simulatorPoolId || this.baseType,
      requiredLevel: numericOrNull(base.requiredLevel),
      dropLevel: numericOrNull(base.dropLevel != null ? base.dropLevel : base.baseLevel),
      tags: Array.isArray(base.tags) ? base.tags.map(String) : [],
      baseProperties: base.baseProperties && typeof base.baseProperties === 'object'
        ? structuredClone(base.baseProperties)
        : {},
      implicits: Array.isArray(base.implicits) ? structuredClone(base.implicits) : [],
      socketCount: numericOrNull(base.socketCount),
      icon: base.icon || null,
      targetGameVersion: base.targetGameVersion || null,
      verificationState: base.verificationState || null,
    };
  }

  _refreshBaseTags() {
    this._baseTags = new Set(this._typeBaseTags || []);
    for (const tag of this._concreteBase?.tags || []) this._baseTags.add(tag);
  }

  _applyConcreteBaseDefinition(item) {
    const base = this._concreteBase;
    if (!base || !item) return item;
    const previousBaseName = item.baseName;
    item.schemaVersion = Math.max(2, Number(item.schemaVersion) || 0);
    item.baseItemId = base.id;
    item.baseMetadataKey = base.metadataKey;
    item.simulatorPoolId = base.simulatorPoolId || this.baseType;
    item.itemClass = base.itemClass;
    item.requiredLevel = base.requiredLevel;
    item.dropLevel = base.dropLevel;
    item.baseTags = base.tags.slice();
    item.baseProperties = structuredClone(base.baseProperties);
    item.implicits = structuredClone(base.implicits);
    item.baseSocketCount = base.socketCount;
    item.baseIcon = base.icon;
    item.targetGameVersion = base.targetGameVersion;
    item.baseVerificationState = base.verificationState;
    item.baseName = base.displayName;
    item.baseType = this.baseType;
    item.jewelType = this.jewelType;
    if (item.rarity === 'normal' || !item.name || item.name === previousBaseName) {
      item.name = base.displayName;
    }
    return item;
  }

  getConcreteBase() {
    return this._concreteBase ? structuredClone(this._concreteBase) : null;
  }

  setConcreteBase(base, options = {}) {
    const next = this._normalizeConcreteBaseDefinition(base);
    if (!next) throw new Error('Invalid concrete base definition.');
    if (next.simulatorPoolId !== this.baseType) {
      throw new Error(`Concrete base ${next.id} does not map to simulator pool ${this.baseType}.`);
    }
    const preserveItemLevel = options.preserveItemLevel !== false;
    const resetItem = options.resetItem !== false;
    const itemLevel = this._item?.ilvl;
    this._concreteBase = next;
    this._refreshBaseTags();
    if (resetItem) {
      this._item = this._createBlankItem(next.displayName);
      if (preserveItemLevel && Number.isFinite(Number(itemLevel))) {
        this.setItemLevel(itemLevel);
      } else {
        this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
        this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
      }
      this._pendingDesecration = null;
    } else {
      this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
      this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
    }
    return this.getConcreteBase();
  }

  isFreshItem(item = this._item) {
    if (!item || item.rarity !== 'normal') return false;
    if ((item.prefixes || []).length || (item.suffixes || []).length || (item.enchantments || []).length) return false;
    const quality = item.quality && typeof item.quality === 'object'
      ? item.quality
      : { amount: item.quality ?? 0, type: 'normal', source: null };
    if (Number(quality.amount || 0) !== 0 || (quality.type || 'normal') !== 'normal' || quality.source != null) return false;
    if (item.corrupted || item.sanctified || item.mirrored || item.isMirrored || item.hinekoraLocked) return false;
    if (this._pendingDesecration || item.desecratedState || item.abyssState || item.omenState || item.hinekoraState) return false;
    if (Object.values(item.currencyUsed || {}).some(value => Number(value) > 0)) return false;
    for (const key of ['sockets', 'socketedContent', 'socketState', 'runes', 'soulCores', 'fracturedMods']) {
      const value = item[key];
      if (Array.isArray(value) && value.length) return false;
      if (value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length) return false;
      if (value != null && typeof value !== 'object' && value !== false && Number(value) !== 0) return false;
    }
    if (item.socketCount != null && Number(item.socketCount) !== Number(item.baseSocketCount || 0)) return false;
    if (item.flags && typeof item.flags === 'object' && Object.keys(item.flags).length) return false;
    return true;
  }

  getLimits(rarity = null) {
    if (rarity) return this._limits[rarity] ? structuredClone(this._limits[rarity]) : null;
    return structuredClone(this._limits);
  }

  supportsRarity(rarity) { return !!this._limits[rarity]; }

  // Item saves created before quality became structured may contain a number
  // (or no quality field at all). Normalise that legacy shape at every engine
  // entry point without inventing an effect, source, or target-version cap.
  _normalizeQualityState(item) {
    const fallback = { amount: 0, type: 'normal', source: null };
    if (!item || typeof item !== 'object') return fallback;

    const raw = item.quality;
    const structured = raw && typeof raw === 'object' && !Array.isArray(raw);
    const rawAmount = structured
      ? raw.amount
      : raw ?? item.qualityAmount ?? 0;
    const parsedAmount = Number(rawAmount);
    const amount = Number.isFinite(parsedAmount) ? Math.max(0, parsedAmount) : 0;
    const rawType = structured ? raw.type : item.qualityType;
    const type = typeof rawType === 'string' && rawType.trim() ? rawType.trim() : 'normal';

    let source = null;
    if (structured && Object.prototype.hasOwnProperty.call(raw, 'source')) {
      source = raw.source == null ? null : structuredClone(raw.source);
    } else if (Object.prototype.hasOwnProperty.call(item, 'qualitySource')) {
      source = item.qualitySource == null ? null : structuredClone(item.qualitySource);
    }

    item.quality = { amount, type, source };
    return item.quality;
  }

  resetItem() {
    this._item = this._createBlankItem(this._typeData.name);
    this._pendingDesecration = null;
    this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
    this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
    return this.getItem();
  }

  loadItem(item, pending = null) {
    this._item = structuredClone(item);
    if (!this._item.currencyUsed) this._item.currencyUsed = {};
    if (!Array.isArray(this._item.enchantments)) this._item.enchantments = [];
    if (!Array.isArray(this._item.prefixes)) this._item.prefixes = [];
    if (!Array.isArray(this._item.suffixes)) this._item.suffixes = [];
    if (this._item.sanctified == null) this._item.sanctified = false;
    if (this._item.mirrored == null) this._item.mirrored = !!this._item.isMirrored;
    if (this._item.ilvl == null) this._item.ilvl = 83;
    this._applyConcreteBaseDefinition(this._item);
    this._normalizeQualityState(this._item);
    // Rebuild the ilvl-eligible candidate pools to match the loaded item's Item
    // Level. Without this, an item loaded from the stash (or restored by
    // undo/redo) keeps whatever ilvl the engine was constructed with (the blank
    // default of 83), letting tiers that should be ineligible roll on later
    // crafts — and hiding tiers that should be available at a higher ilvl.
    this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
    this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
    // Optionally restore a pending (unrevealed) desecration so undo/redo can
    // bring the Reveal step back exactly as it was.
    this._pendingDesecration = pending ? structuredClone(pending) : null;
    return this.getItem();
  }

  // Set the item level (1-100). Rebuilds the eligible candidate pools so the
  // tiers that can roll always match the current ilvl.
  setItemLevel(level) {
    // A corrupted or sanctified item is locked: its mod pool must not change,
    // and silently re-rolling the eligible candidate pools here would let later
    // crafts (or a reveal) behave as if the item were still editable.
    if (this._item.corrupted || this._item.sanctified) return this._item.ilvl;
    const n = Math.max(1, Math.min(100, Math.round(Number(level) || 0)));
    this._item.ilvl = n;
    this._prefixCandidates = this._buildCandidatePool(this._prefixPool, 'prefix');
    this._suffixCandidates = this._buildCandidatePool(this._suffixPool, 'suffix');
    return n;
  }

  setHinekoraLock()   { this._item.hinekoraLocked = true; }
  clearHinekoraLock() { this._item.hinekoraLocked = false; }

  recordCurrencyUse(type) {
    if (!this._item.currencyUsed) this._item.currencyUsed = {};
    this._item.currencyUsed[type] = (this._item.currencyUsed[type] || 0) + 1;
    return this._item.currencyUsed[type];
  }

  _checkCorrupted() {
    if (this._item.corrupted) return this._fail('Item is corrupted and cannot be modified.');
    if (this._item.sanctified) return this._fail('Item is sanctified and cannot be modified further.');
    return null;
  }

  // Greater/Perfect currency passes { minModLevel }. A numeric argument is
  // still accepted as a legacy value-roll bias for old callers, but the UI no
  // longer uses that inaccurate behaviour.
  applyTransmutation(options = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'normal') return this._fail('Orb of Transmutation can only be used on Normal items.');
    const previousRarity = this._item.rarity;
    this._item.rarity = 'magic';
    const added = this._addRandomMod('magic', options);
    if (!added) { this._item.rarity = previousRarity; return this._fail('No eligible mods available.'); }
    return this._success({ action: 'transform', addedMods: [added], previousRarity });
  }

  applyAugmentation(options = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'magic') return this._fail('Orb of Augmentation can only be used on Magic items.');
    if (this._isAtModLimit('magic')) return this._fail('Item already has max mods for a Magic item (1 prefix + 1 suffix).');
    const added = this._addRandomMod('magic', options);
    if (!added) return this._fail('No eligible open affix available.');
    return this._success({ action: 'add', addedMods: [added], previousRarity: 'magic' });
  }

  applyRegal(options = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'magic') return this._fail('Regal Orb can only be used on Magic items.');
    if (!this.supportsRarity('rare')) return this._fail(`${this._item.baseName} cannot be upgraded to Rare.`);
    const previousRarity = this._item.rarity;
    const previousName = this._item.name;
    this._item.rarity = 'rare';
    this._item.name = this._generateRareName();
    const added = this._addRandomMod('rare', options);
    if (!added) {
      this._item.rarity = previousRarity;
      this._item.name = previousName;
      return this._fail('No eligible mods available.');
    }
    return this._success({ action: 'transform', addedMods: [added], previousRarity });
  }

  applyExalted(options = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'rare') return this._fail('Exalted Orb can only be used on Rare items.');
    const rareLimits = this._limits.rare;
    if (!rareLimits) return this._fail(`${this._item.baseName} cannot have Rare modifiers.`);
    if (this._isAtModLimit('rare')) {
      return this._fail(`Item already has max mods (${rareLimits.prefixes} prefixes + ${rareLimits.suffixes} suffixes).`);
    }
    const added = this._addRandomMod('rare', options);
    if (!added) return this._fail('No eligible open affix available.');
    return this._success({ action: 'add', addedMods: [added], previousRarity: 'rare' });
  }

  // `omen` may be one of: 'whittling' (remove the lowest modifier level),
  // 'sinistral_erasure' (remove a prefix), or 'dextral_erasure' (remove a
  // suffix). The Chaos Orb then adds a new random modifier as usual.
  applyChaos(omen = null, options = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'rare') return this._fail('Chaos Orb can only be used on Rare items.');
    if (this._allModEntries().length === 0) return this._fail('Item has no mods to modify.');

    // Chaos is one atomic remove-and-add operation. If the replacement pool is
    // empty after every eligibility filter, restore this snapshot so neither the
    // item nor an armed Omen is consumed by a partial remove-only result.
    const preChaos = structuredClone(this._item);
    let removed;
    if (omen === 'whittling') {
      // Whittling compares numeric modifier levels, not displayed tiers. Some
      // imported Desecrated records still have no numeric level; guessing would
      // risk removing the wrong modifier, so fail without mutating the item.
      const removable = this._allModEntries().filter(e => !e.mod.fractured && !e.mod.unrevealed);
      const hasUnknownLevel = removable.some(({ mod }) => {
        const level = Number(mod.ilvlReq != null ? mod.ilvlReq : mod.tier);
        return !Number.isFinite(level);
      });
      if (hasUnknownLevel) {
        return this._fail('Unsupported — verification required: a removable modifier has no numeric modifier level.');
      }
      removed = this._removeMod({ mode: 'lowest' });
      if (!removed) return this._fail('Omen of Whittling: all modifiers are fractured and cannot be changed.');
    } else if (omen === 'sinistral_erasure') {
      removed = this._removeMod({ side: 'prefix' });
      if (!removed) return this._fail('Omen of Sinistral Erasure: no removable prefix on this item.');
    } else if (omen === 'dextral_erasure') {
      removed = this._removeMod({ side: 'suffix' });
      if (!removed) return this._fail('Omen of Dextral Erasure: no removable suffix on this item.');
    } else {
      removed = this._removeRandomMod();
      if (!removed) return this._fail('All modifiers are fractured and cannot be changed.');
    }

    const added = this._addRandomMod('rare', options);
    if (!added) {
      this._item = preChaos;
      return this._fail('Chaos Orb has no eligible replacement modifier; the item was not changed.');
    }
    return this._success({ action: 'reroll', addedMods: [added], removedMods: [removed], previousRarity: 'rare', omen });
  }

  applyAlchemy() {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'normal' && this._item.rarity !== 'magic') {
      return this._fail('Orb of Alchemy can only be used on Normal or Magic items.');
    }
    if (!this.supportsRarity('rare')) return this._fail(`${this._item.baseName} cannot be upgraded to Rare.`);

    const snapshot = structuredClone(this._item);
    const previousRarity = this._item.rarity;

    const removedMods = [];
    if (this._item.rarity === 'magic') {
      for (const e of this._allModEntries()) removedMods.push(e.mod);
      this._item.prefixes = [];
      this._item.suffixes = [];
    }

    this._item.rarity = 'rare';
    this._item.name = this._generateRareName();

    const totalMods = 4;
    const addedMods = [];

    const forcedPrefix = this._addRandomModOfType('prefix', 'rare');
    if (forcedPrefix) addedMods.push(forcedPrefix);
    const forcedSuffix = this._addRandomModOfType('suffix', 'rare');
    if (forcedSuffix) addedMods.push(forcedSuffix);

    const remaining = totalMods - addedMods.length;
    for (let i = 0; i < remaining; i++) {
      const mod = this._addRandomMod('rare');
      if (mod) addedMods.push(mod);
    }

    if (addedMods.length === 0) {
      this._item = snapshot;
      return this._fail('No eligible mods available.');
    }
    return this._success({ action: 'transform', addedMods, removedMods, previousRarity });
  }

  applyAnnulment(opts = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._allModEntries().length === 0) return this._fail('Item has no mods to remove.');
    const previousRarity = this._item.rarity;

    // Omen of Light: the next Orb of Annulment removes ONLY a Desecrated mod.
    if (opts.desecratedOnly) {
      // Exclude the UNREVEALED pending placeholder (it also carries
      // desecrated:true): Omen of Light must only strip a real, revealed
      // Desecrated modifier, never the hidden pending one before it is revealed.
      const desEntries = this._allModEntries()
        .filter(e => !e.mod.fractured && e.mod.desecrated && !e.mod.unrevealed);
      if (desEntries.length === 0) {
        return this._fail('Omen of Light: this item has no Desecrated modifier to remove.');
      }
      const pick = desEntries[this._randomInt(0, desEntries.length - 1)];
      if (pick.type === 'prefix') this._item.prefixes.splice(pick.index, 1);
      else this._item.suffixes.splice(pick.index, 1);
      return this._success({ action: 'remove', removedMods: [{ ...pick.mod, type: pick.type }], previousRarity });
    }

    // Sinistral / Dextral Annulment omens remove ONLY a prefix / suffix.
    if (opts.omen === 'sinistral_annulment') {
      const removed = this._removeMod({ side: 'prefix' });
      if (!removed) return this._fail('Omen of Sinistral Annulment: no removable prefix to remove.');
      return this._success({ action: 'remove', removedMods: [removed], previousRarity, omen: opts.omen });
    }
    if (opts.omen === 'dextral_annulment') {
      const removed = this._removeMod({ side: 'suffix' });
      if (!removed) return this._fail('Omen of Dextral Annulment: no removable suffix to remove.');
      return this._success({ action: 'remove', removedMods: [removed], previousRarity, omen: opts.omen });
    }

    const removed = this._removeRandomMod();
    if (!removed) return this._fail('All modifiers are fractured and cannot be removed.');
    return this._success({ action: 'remove', removedMods: [removed], previousRarity });
  }

  // `omen` may be 'sanctification': the Divine Orb instead SANCTIFIES the item,
  // rolling every modifier toward (and potentially beyond) its normal range and
  // locking the item from any further modification.
  applyDivine(omen = null) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._allModEntries().length === 0) return this._fail('Item has no mods to re-roll values on.');

    if (omen === 'sanctification') {
      if (this._item.rarity !== 'rare') return this._fail('Omen of Sanctification can only be used on Rare items.');
      const sanctifiable = this._allModEntries().filter(({ mod }) => !mod.fractured);
      if (sanctifiable.length === 0) return this._fail('Omen of Sanctification: all modifiers are fractured.');
      this._applySanctification();
      return this._success({ action: 'sanctify', previousRarity: this._item.rarity, omen, sanctified: true });
    }

    const rerollable = this._allModEntries().filter(({ mod }) => !mod.fractured);
    const lineHasRange = (l) =>
      (l.min != null && l.max != null && l.min !== l.max) ||
      (Array.isArray(l.vals) && l.vals.some(s => s.min != null && s.max != null && s.min !== s.max));
    const modHasRange = (mod) =>
      (mod.min != null && mod.max != null && mod.min !== mod.max) ||
      (Array.isArray(mod.lines) && mod.lines.some(lineHasRange));
    const hasRange = rerollable.some(({ mod }) => modHasRange(mod));
    if (!hasRange) return this._fail('No re-rollable mods (fractured or fixed-value mods are locked).');

    for (const { mod } of rerollable) {
      if (Array.isArray(mod.lines) && mod.lines.length) {
        let changed = false;
        for (const l of mod.lines) {
          if (Array.isArray(l.vals) && l.vals.length) {
            l.values = l.vals.map(s => this._rollSpec(s.min, s.max, 0));
            let text = l.modLine || '';
            l.values.forEach((v, idx) => { text = text.replaceAll(`{${idx}}`, v); });
            l.text = text;
            l.value = l.values[0]; l.min = l.vals[0].min; l.max = l.vals[0].max;
            changed = true;
          } else if (lineHasRange(l)) {
            l.value = this._rollSpec(l.min, l.max, 0);
            l.text = l.modLine.replaceAll('{0}', l.value);
            changed = true;
          }
        }
        if (changed) mod.displayText = mod.lines.map(l => l.text).join('\n');
      } else if (mod.min != null && mod.max != null && mod.min !== mod.max) {
        mod.value = this._rollSpec(mod.min, mod.max, 0);
        mod.displayText = mod.modLine.replaceAll('{0}', mod.value);
      }
    }
    return this._success({ action: 'reroll', previousRarity: this._item.rarity });
  }

  // Which corruption outcomes are currently valid (used by Hinekora's Lock).
  vaalOutcomeOptions() {
    const hasMods = this._allModEntries().length > 0;
    const affixRarity = this._item.rarity === 'magic' || this._item.rarity === 'rare';
    const opts = [{ outcome: 1, key: 'none' }];
    if (hasMods && affixRarity) opts.push({ outcome: 2, key: 'reroll' });
    opts.push({ outcome: 3, key: 'enchant' });
    opts.push({ outcome: 4, key: 'modify' });
    return opts;
  }

  applyVaal(forcedOutcome = null) {
    const err = this._checkCorrupted(); if (err) return err;

    this._item.corrupted = true;
    const previousRarity = this._item.rarity;
    const hasMods = this._allModEntries().length > 0;

    const affixRarity = this._item.rarity === 'magic' ? 'magic'
                      : this._item.rarity === 'rare' ? 'rare'
                      : null;

    let outcome = forcedOutcome != null ? forcedOutcome : this._randomInt(1, 4);
    if (outcome === 2 && (!hasMods || !affixRarity)) outcome = 3;

    let vaalOutcome = 'none';
    const addedMods = [];
    const removedMods = [];

    if (outcome === 1) {
      vaalOutcome = 'none';
    } else if (outcome === 2) {
      vaalOutcome = 'reroll';
      const times = this._randomInt(1, 3);
      for (let i = 0; i < times; i++) {
        if (this._allModEntries().length === 0) break;
        const removed = this._removeRandomMod();
        if (removed) removedMods.push(removed);
        const added = this._addRandomMod(affixRarity);
        if (added) addedMods.push(added);
      }
    } else if (outcome === 3) {
      vaalOutcome = 'enchant';
      const ench = this._rollCorruptedImplicit();
      if (ench) { this._item.enchantments.push(ench.text); addedMods.push(ench.mod); }
    } else {
      vaalOutcome = 'modify';
      const isAdd = this._randomInt(1, 2) === 1;
      if (isAdd || !hasMods) {
        const ench = this._rollCorruptedImplicit();
        if (ench) { this._item.enchantments.push(ench.text); addedMods.push(ench.mod); }
      } else {
        const removed = this._removeRandomMod();
        if (removed) removedMods.push(removed);
      }
    }

    return this._success({ action: 'corrupt', vaalOutcome, addedMods, removedMods, previousRarity });
  }

  applyFracturing() {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'rare') return this._fail('Fracturing Orb can only be used on Rare items.');
    // A full Rare item has 4 modifier SLOTS. An UNREVEALED placeholder (a pending
    // Desecrated mod or the Mark of the Abyssal Lord) still occupies a slot, so it
    // counts toward the "4 modifiers" requirement. Previously it was filtered out
    // before this check, so a fully-modded jewel that had just been desecrated
    // (3 revealed + 1 pending) wrongly read as only 3 mods and the orb refused.
    const allEntries = this._allModEntries();
    if (allEntries.length < 4) return this._fail('Fracturing Orb requires a Rare item with 4 modifiers.');
    if (allEntries.some(e => e.mod.fractured)) return this._fail('Item already has a fractured modifier.');
    // ...but fracturing can only LAND on a real, REVEALED modifier — never the
    // unrevealed placeholder (that would "succeed" while leaving nothing
    // fractured). With a pending Desecrated mod present, the fracture is chosen
    // from the 3 revealed mods (1-in-3), not 1-in-4.
    const fracturable = allEntries.filter(e => !e.mod.unrevealed);
    if (fracturable.length === 0) {
      return this._fail('Reveal the Desecrated modifier before fracturing this item.');
    }
    const pick = fracturable[this._randomInt(0, fracturable.length - 1)];
    pick.mod.fractured = true;
    return this._success({ action: 'fracture', fracturedMod: { ...pick.mod, type: pick.type }, previousRarity: 'rare' });
  }

  // ===========================================================
  //  DESECRATION (Abyssal mechanic) — Preserved Cranium
  // ===========================================================
  //
  //  Flow: startDesecration() reveals options (a "Well of Souls" set), then the
  //  UI calls chooseDesecratedMod() to commit one, rerollDesecration() to reroll
  //  the set (Omen of Abyssal Echoes), or cancelDesecration() to back out.
  //
  //  Empty-slot rule: desecration needs an open affix on the targeted side. A
  //  Rare jewel caps at 2 prefixes + 2 suffixes (4 total). If the targeted side
  //  still has an open slot, the Desecrated mod fills it; if the side is full,
  //  it replaces a random existing (non-fractured) mod on that side.
  //
  //  Omens (a directional omen MAY be combined with Abyssal Echoes):
  //   - 'sinistral_necromancy' -> target a prefix
  //   - 'dextral_necromancy'   -> target a suffix (exclusive with sinistral)
  //   - 'abyssal_echoes'       -> one reroll of the revealed options

  getPendingDesecration() {
    return this._pendingDesecration ? structuredClone(this._pendingDesecration) : null;
  }

  // Essence of the Abyss: removes a random modifier and augments a Rare item
  // with the guaranteed "Mark of the Abyssal Lord" modifier. The Mark does
  // nothing on its own until the item is next Desecrated, at which point the
  // Mark is consumed and guarantees a Desecrated modifier (of a higher tier
  // once per-base modifier levels exist).
  applyEssenceOfAbyss() {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'rare') return this._fail('Essence of the Abyss can only be used on a Rare item.');
    if (this._allModEntries().some(({ mod }) => mod.crafted)) {
      return this._fail('Item already has its maximum of one crafted modifier.');
    }
    if (this._item.prefixes.some(m => m.mark) || this._item.suffixes.some(m => m.mark)) {
      return this._fail('This item already carries the Mark of the Abyssal Lord.');
    }
    const removed = this._removeRandomMod();
    if (!removed) return this._fail('Essence of the Abyss: all modifiers are fractured and cannot be removed.');

    const lim = this._limits[this._item.rarity] || this._limits.rare;
    const sides = [];
    if (this._item.prefixes.length < lim.prefixes) sides.push('prefix');
    if (this._item.suffixes.length < lim.suffixes) sides.push('suffix');
    const side = sides.length ? sides[this._randomInt(0, sides.length - 1)] : (removed.type || 'prefix');
    const mark = {
      modGroup: '__mark_of_abyssal_lord__',
      tier: 'D',
      tierName: 'Mark of the Abyssal Lord',
      displayText: 'Mark of the Abyssal Lord',
      fractured: false,
      desecrated: true,
      unrevealed: true,
      mark: true,
      crafted: true,
      affix: side,
    };
    (side === 'prefix' ? this._item.prefixes : this._item.suffixes).push(mark);
    return this._success({ action: 'mark', addedMods: [{ ...mark, type: side }], removedMods: [removed], previousRarity: 'rare' });
  }

  // Essence of the Breach has no effect on Jewels (its guaranteed modifier
  // category does not exist on jewel bases). Intentionally a no-op here and
  // disabled in the jewel UI; it will be implemented when other bases land.
  applyEssenceOfBreach() {
    return this._fail('Unsupported — verification required');
  }

  startDesecration({ bone = 'preserved_cranium', omen = null, omens = null } = {}) {
    const err = this._checkCorrupted(); if (err) return err;
    if (this._item.rarity !== 'rare') {
      return this._fail('Desecration can only be used on a Rare item (use Alchemy or Regal first).');
    }
    // Mark of the Abyssal Lord (applied by Essence of the Abyss): desecrating an
    // item that carries the Mark ALWAYS consumes it, guaranteeing an Unrevealed
    // Desecrated modifier. Remove the Mark up front so the one-time "already
    // desecrated" guard below doesn't block this intended interaction.
    // Snapshot the item BEFORE any mutation so a desecration that fails its
    // validation *after* work has begun (e.g. after consuming the Mark of the
    // Abyssal Lord) is a clean no-op. Otherwise the player loses the Mark with
    // nothing to show for it.
    const _preDesecration = structuredClone(this._item);
    const _failDesecration = (msg) => { this._item = _preDesecration; return this._fail(msg); };
    let markConsumed = false;
    let markSide = null;
    const consumedMarks = [];
    for (const [arrName, sideName] of [['prefixes', 'prefix'], ['suffixes', 'suffix']]) {
      const idx = this._item[arrName].findIndex(m => m.mark);
      if (idx !== -1) {
        const [mark] = this._item[arrName].splice(idx, 1);
        consumedMarks.push({ side: sideName, index: idx, mod: structuredClone(mark) });
        markConsumed = true;
        markSide = sideName;
      }
    }

    // PoE2 rule: an item that already carries a Desecrated modifier cannot be
    // desecrated again — desecration is a one-time, permanent step per item.
    if (this._item.prefixes.some(m => m.desecrated && !m.mark) ||
        this._item.suffixes.some(m => m.desecrated && !m.mark)) {
      return _failDesecration('This item already has a Desecrated modifier and cannot be desecrated again.');
    }
    if (this._desecratedPrefixes.length === 0 && this._desecratedSuffixes.length === 0) {
      return _failDesecration('No Desecrated modifiers are available for this base.');
    }

    // Accept either a single `omen` (legacy) or an `omens` array, so a
    // directional Necromancy omen can be combined with Abyssal Echoes.
    const omenList = Array.isArray(omens) ? omens.slice() : (omen ? [omen] : []);

    let targetSide = null;
    if (omenList.includes('sinistral_necromancy')) targetSide = 'prefix';
    else if (omenList.includes('dextral_necromancy')) targetSide = 'suffix';
    else if (markConsumed) targetSide = markSide;

    const side = this._resolveDesecrationSide(targetSide);
    const sidePool = side === 'prefix' ? this._desecratedPrefixes : this._desecratedSuffixes;
    if (sidePool.length === 0) {
      return _failDesecration(`No Desecrated ${side} modifiers available for this base.`);
    }

    const lim = this._limits[this._item.rarity] || this._limits.rare;
    const cap = lim[side === 'prefix' ? 'prefixes' : 'suffixes'];
    const current = (side === 'prefix' ? this._item.prefixes : this._item.suffixes).length;
    const mode = current < cap ? 'add' : 'replace';
    const rerollsLeft = omenList.includes('abyssal_echoes') ? 1 : 0;

    // Bone sets the base number of revealed options. Omen of Light is NOT a
    // reveal omen — it modifies the next Orb of Annulment instead.
    const boneCfg = CraftingEngine.BONES[bone] || CraftingEngine.BONES.preserved_cranium;
    const desecratedOnly = !!boneCfg.desecratedOnly || markConsumed;
    const revealCount = boneCfg.reveal || 3;

    // Bone item-level gating (PoE2 0.5.0 Abyssal bones):
    //  - Gnawed:    can only desecrate items of ilvl <= maxItemLevel (64).
    //  - Preserved: no item-level limit.
    //  - Ancient:   no ilvl limit, but guarantees a minimum modifier level (40).
    if (boneCfg.maxItemLevel != null && (this._item.ilvl || 0) > boneCfg.maxItemLevel) {
      return _failDesecration(`${boneCfg.name} can only desecrate items of Item Level ${boneCfg.maxItemLevel} or lower (this item is Item Level ${this._item.ilvl}).`);
    }
    const minModLevel = boneCfg.minModLevel || 0;

    const options = this._rollDesecratedOptions(side, revealCount, { desecratedOnly, minModLevel });
    if (options.length === 0) return _failDesecration('No eligible Desecrated modifiers to reveal.');

    // Place an UNREVEALED Desecrated modifier on the item immediately (PoE2
    // style): it fills the open slot on the targeted side, or replaces a random
    // non-fractured mod there when the side is full. The actual modifier stays
    // hidden (rendered as a green "Desecrated Modifier" line) until the player
    // reveals it at the Well of Souls. The reveal options are rolled now and
    // kept pending until then.
    const arr = side === 'prefix' ? this._item.prefixes : this._item.suffixes;
    const placeholder = {
      modGroup: '__desecrated_pending__',
      tier: 'D',
      tierName: 'Desecrated',
      displayText: 'Desecrated Modifier',
      fractured: false,
      desecrated: true,
      unrevealed: true,
      affix: side,
    };
    let removedMod = null;
    let placeholderIndex;
    if (mode === 'add') {
      placeholderIndex = arr.length;
      arr.push(placeholder);
    } else {
      const candidates = arr.map((m, i) => ({ m, i })).filter(x => !x.m.fractured && !x.m.unrevealed);
      if (candidates.length === 0) {
        return _failDesecration('All modifiers on that side are fractured and cannot be replaced.');
      }
      const pick = candidates[this._randomInt(0, candidates.length - 1)];
      placeholderIndex = pick.i;
      removedMod = { ...arr[pick.i], type: side };
      arr.splice(pick.i, 1, placeholder);
    }

    this._pendingDesecration = {
      bone, omens: omenList, side, mode, rerollsLeft, revealCount,
      desecratedOnly, minModLevel, options, removedMod, placeholderIndex, consumedMarks,
    };
    return {
      success: true,
      action: 'desecrate-pending',
      bone, side, mode, rerollsLeft, options,
      addedMods: [{ ...placeholder, type: side }],
      removedMods: removedMod ? [removedMod] : [],
      item: this.getItem(),
    };
  }

  rerollDesecration() {
    const pd = this._pendingDesecration;
    if (!pd) return this._fail('No desecration in progress.');
    if (!(Number(pd.rerollsLeft) > 0)) {
      return this._fail('No Desecration rerolls remaining.');
    }
    // Omen of Abyssal Echoes is activated AT REVEAL TIME (not before
    // desecrating). It rerolls the revealed Well of Souls options.
    const options = this._rollDesecratedOptions(pd.side, pd.revealCount || 3, {
      desecratedOnly: !!pd.desecratedOnly,
      minModLevel: Number(pd.minModLevel) || 0,
    });
    if (options.length === 0) return this._fail('No eligible Desecrated modifiers to reveal.');
    pd.options = options;
    pd.rerollsLeft = Math.max(0, Number(pd.rerollsLeft) - 1);
    return {
      success: true,
      action: 'desecrate-reroll',
      side: pd.side, mode: pd.mode, rerollsLeft: pd.rerollsLeft, options: pd.options,
      item: this.getItem(),
    };
  }

  chooseDesecratedMod(index) {
    const pd = this._pendingDesecration;
    if (!pd) return this._fail('No desecration in progress.');
    const chosen = pd.options[index];
    if (!chosen) return this._fail('Invalid Desecrated modifier selected.');

    const previousRarity = this._item.rarity;

    const record = structuredClone(chosen);
    delete record.affix;
    // Anything pulled from the Well of Souls counts as a Desecrated modifier,
    // even base prefixes/suffixes in the reveal pool (renders green).
    record.desecrated = true;
    delete record.unrevealed;

    // Replace the unrevealed placeholder (placed when the item was desecrated)
    // with the revealed modifier, in its exact slot.
    let placedSide = pd.side;
    let replaced = false;
    for (const s of ['prefixes', 'suffixes']) {
      const idx = this._item[s].findIndex(m => m.unrevealed);
      if (idx !== -1) {
        this._item[s].splice(idx, 1, record);
        placedSide = s === 'prefixes' ? 'prefix' : 'suffix';
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      // Fallback (should not happen): no placeholder present — add to the side.
      const arr = pd.side === 'prefix' ? this._item.prefixes : this._item.suffixes;
      arr.push(record);
    }

    this._pendingDesecration = null;
    return this._success({
      action: 'desecrate',
      addedMods: [{ ...record, type: placedSide }],
      removedMods: [],
      desecratedSide: placedSide,
      previousRarity,
    });
  }

  cancelDesecration() {
    const pd = this._pendingDesecration;
    if (!pd) return this._fail('No desecration in progress.');

    const arr = pd.side === 'prefix' ? this._item.prefixes : this._item.suffixes;
    let placeholderIndex = Number.isInteger(pd.placeholderIndex) ? pd.placeholderIndex : -1;
    if (!arr[placeholderIndex] || arr[placeholderIndex].modGroup !== '__desecrated_pending__') {
      placeholderIndex = arr.findIndex(mod => mod.modGroup === '__desecrated_pending__' && mod.unrevealed);
    }
    if (placeholderIndex === -1) {
      return this._fail('Desecration placeholder is missing and cannot be cancelled safely.');
    }

    if (pd.mode === 'replace') {
      if (!pd.removedMod) {
        return this._fail('Replaced modifier data is missing and Desecration cannot be cancelled safely.');
      }
      const restored = structuredClone(pd.removedMod);
      delete restored.type;
      arr.splice(placeholderIndex, 1, restored);
    } else {
      arr.splice(placeholderIndex, 1);
    }

    for (const consumed of (pd.consumedMarks || [])) {
      const markArr = consumed.side === 'prefix' ? this._item.prefixes : this._item.suffixes;
      const index = Math.max(0, Math.min(markArr.length, Number(consumed.index) || 0));
      markArr.splice(index, 0, structuredClone(consumed.mod));
    }
    this._pendingDesecration = null;
    return { success: true, action: 'desecrate-cancel', item: this.getItem() };
  }

  _resolveDesecrationSide(targetSide) {
    if (targetSide === 'prefix' || targetSide === 'suffix') return targetSide;
    const lim = this._limits[this._item.rarity] || this._limits.rare;
    const pCap = lim.prefixes;
    const sCap = lim.suffixes;
    const pOpen = this._item.prefixes.length < pCap && this._desecratedPrefixes.length > 0;
    const sOpen = this._item.suffixes.length < sCap && this._desecratedSuffixes.length > 0;
    const open = [];
    if (pOpen) open.push('prefix');
    if (sOpen) open.push('suffix');
    if (open.length > 0) return open[this._randomInt(0, open.length - 1)];
    // Item is full — desecration replaces a random mod; pick any side with a pool.
    const avail = [];
    if (this._desecratedPrefixes.length > 0) avail.push('prefix');
    if (this._desecratedSuffixes.length > 0) avail.push('suffix');
    return avail[this._randomInt(0, avail.length - 1)] || 'prefix';
  }

  _rollDesecratedOptions(side, count = 3, { desecratedOnly = false, minModLevel = 0 } = {}) {
    const existing = this._existingGroups();

    // Desecrated (Abyssal) candidates for this side.
    const desPool = side === 'prefix' ? this._desecratedPrefixes : this._desecratedSuffixes;
    const desCandidates = (desPool || [])
      .filter(c => Number.isFinite(Number(c.weight)) && Number(c.weight) > 0)
      .map(c => ({
        kind: 'desecrated',
        modGroup: c.modGroup,
        weight: Number(c.weight),
        data: c,
      }));

    // Normal base candidates for this side — the same ilvl-eligible pool the
    // regular orbs roll from — so the Well of Souls also surfaces ordinary
    // prefixes/suffixes, not just Desecrated mods.
    const normPool = side === 'prefix' ? this._prefixCandidates : this._suffixCandidates;
    const normCandidates = desecratedOnly ? [] : (normPool || [])
      // Ancient bone guarantees a minimum modifier level: filter the ordinary
      // affixes surfaced at the Well of Souls to those whose required level
      // meets the floor. (Desecrated jewel mods carry no level yet, so they
      // are intentionally left ungated — per-base modifier levels land later.)
      .filter(c => minModLevel <= 0 || (c.tier.ilvlReq || 0) >= minModLevel)
      .filter(c => Number.isFinite(Number(c.weight)) && Number(c.weight) > 0)
      .map(c => ({
        kind: 'normal',
        modGroup: c.group.modGroup,
        weight: Number(c.weight),
        data: c,
      }));

    // _existingGroups stores explicit identity namespaces (`name:` for the
    // curated pool and `source:` for imported stable group IDs). Compare Well
    // candidates in the same namespace; comparing the former raw names here
    // silently admitted a second modifier from an existing group. Never fall
    // back to the conflicting pool: an empty result is a clean failed craft.
    const work = desCandidates.concat(normCandidates)
      .filter(candidate => !existing.has(`name:${candidate.modGroup}`));

    const out = [];
    const usedGroups = new Set();
    while (out.length < count && work.length > 0) {
      // Uniform reveal: every revealed candidate has an EQUAL chance,
      // regardless of its configured weight. (Design choice: if there are 50
      // possible modifiers, each has the same chance to appear.)
      const idx = this._randomInt(0, work.length - 1);
      const pick = work[idx];
      work.splice(idx, 1);
      if (usedGroups.has(pick.modGroup)) continue; // one mod per group in the reveal
      usedGroups.add(pick.modGroup);
      out.push(pick.kind === 'desecrated'
        ? this._materializeDesecrated(pick.data, side)
        : this._materializeNormal(pick.data, side));
    }
    return out;
  }

  // Roll a normal (non-Desecrated) affix candidate into the same option shape
  // the Well of Souls uses. Mirrors _applyMod but does not mutate the item.
  _materializeNormal(candidate, side) {
    const { group, tier } = candidate;
    if (Array.isArray(tier.lines) && tier.lines.length) {
      const lines = tier.lines.map(ln => this._rollLineTemplate(ln, 0));
      return {
        modGroup: group.modGroup,
        tier: tier.tier,
        tierName: tier.name,
        ilvlReq: tier.ilvlReq,
        lines,
        displayText: lines.map(l => l.text).join('\n'),
        fractured: false,
        affix: side,
      };
    }
    const hasRange = tier.min != null && tier.max != null;
    const value = hasRange ? this._rollSpec(tier.min, tier.max, 0) : null;
    const displayText = tier.modLine
      ? (value != null ? tier.modLine.replaceAll('{0}', value) : tier.modLine)
      : 'Unknown Mod';
    return {
      modGroup: group.modGroup,
      tier: tier.tier,
      tierName: tier.name,
      ilvlReq: tier.ilvlReq,
      modLine: tier.modLine,
      displayText,
      value,
      min: tier.min,
      max: tier.max,
      fractured: false,
      affix: side,
    };
  }

  // Roll one value spec [min,max] with optional quality bias (0..1) that lifts
  // the low end toward max (Greater/Perfect orbs). Fixed specs (min===max) and
  // null specs return the obvious result.
  _rollSpec(min, max, quality = 0) {
    if (min == null || max == null) return null;
    if (min === max) return min;
    // Many gear mods use FRACTIONAL ranges (e.g. "2.1 to 3 Life Regeneration").
    // _randomInt only steps by whole integers, so roll on an integer grid scaled
    // to the range's decimal precision, then scale back. quality (0..1) lifts the
    // low end toward max for Greater/Perfect orbs.
    const decimals = (x) => { const s = String(x); const d = s.indexOf('.'); return d < 0 ? 0 : s.length - d - 1; };
    const p = Math.max(decimals(min), decimals(max));
    const scale = Math.pow(10, p);
    const lo = Math.round(min * scale);
    const hi = Math.round(max * scale);
    const span = hi - lo;
    if (span <= 0) return min;
    const floorK = quality > 0 ? Math.ceil(span * quality) : 0;
    const k = floorK + this._randomInt(0, Math.max(0, span - floorK));
    return (lo + k) / scale;
  }

  // Roll a stat-line template that may carry EITHER a single {0} placeholder
  // (min/max) or several placeholders {0},{1},... described by a `vals` array of
  // { min, max } specs (e.g. "Adds {0} to {1} Fire Damage", or a hybrid mod
  // whose stat lines were joined into one template). value/min/max keep pointing
  // at the FIRST placeholder so the single-value range checks (and the fuzz
  // harness) still validate it, while `values`/`vals` carry every placeholder
  // for divine reroll, sanctification, and display.
  _rollLineTemplate(ln, quality = 0) {
    if (Array.isArray(ln.vals) && ln.vals.length) {
      const vals = ln.vals.map(s => ({ min: s.min, max: s.max }));
      const values = vals.map(s => this._rollSpec(s.min, s.max, quality));
      let text = ln.modLine || '';
      values.forEach((v, idx) => { text = text.replaceAll(`{${idx}}`, v); });
      return { modLine: ln.modLine, vals, values, value: values[0], min: vals[0].min, max: vals[0].max, text };
    }
    const value = this._rollSpec(ln.min, ln.max, quality);
    const text = ln.modLine
      ? (value != null ? ln.modLine.replaceAll('{0}', value) : ln.modLine)
      : '';
    return { modLine: ln.modLine, min: ln.min, max: ln.max, value, text };
  }

  // Build a single rolled stat line from a template (single- or multi-value).
  _materializeLine(ln) {
    return this._rollLineTemplate(ln, 0);
  }

  _materializeDesecrated(c, side) {
    // Multi-stat desecrated mods carry a `lines` array; each line rolls
    // independently and renders on its own row.
    if (Array.isArray(c.lines) && c.lines.length) {
      const lines = c.lines.map(ln => this._materializeLine(ln));
      return {
        modGroup: c.modGroup,
        tier: c.tier || 'D',
        tierName: c.name || 'Desecrated',
        lines,
        displayText: lines.map(l => l.text).join('\n'),
        fractured: false,
        desecrated: true,
        affix: side,
      };
    }
    // Legacy single-stat path.
    const hasRange = c.min != null && c.max != null;
    const value = hasRange ? this._randomInt(c.min, c.max) : null;
    const displayText = c.modLine
      ? (value != null ? c.modLine.replaceAll('{0}', value) : c.modLine)
      : (c.name || 'Desecrated Modifier');
    return {
      modGroup: c.modGroup,
      tier: c.tier || 'D',
      tierName: c.name || 'Desecrated',
      modLine: c.modLine,
      displayText,
      value,
      min: c.min,
      max: c.max,
      fractured: false,
      desecrated: true,
      affix: side,
    };
  }

  _weightedIndex(arr) {
    const eligible = arr
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate }) => Number.isFinite(Number(candidate.weight)) && Number(candidate.weight) > 0);
    if (!eligible.length) return -1;
    let total = 0;
    for (const { candidate } of eligible) total += Number(candidate.weight);
    let roll = Math.random() * total;
    for (let i = 0; i < eligible.length; i++) {
      roll -= Number(eligible[i].candidate.weight);
      if (roll <= 0) return eligible[i].index;
    }
    return eligible[eligible.length - 1].index;
  }

  _createBlankItem(baseName) {
    const item = {
      rarity: 'normal',
      baseName,
      name: baseName,
      baseType: this.baseType,
      jewelType: this.jewelType,
      prefixes: [],
      suffixes: [],
      enchantments: [],
      corrupted: false,
      sanctified: false,
      mirrored: false,
      quality: { amount: 0, type: 'normal', source: null },
      ilvl: 83,
      currencyUsed: {},
      hinekoraLocked: false,
    };
    return this._applyConcreteBaseDefinition(item);
  }

  _generateRareName() {
    const a = CraftingEngine.RARE_NAME_A;
    const b = CraftingEngine.RARE_NAME_B;
    return `${a[this._randomInt(0, a.length - 1)]} ${b[this._randomInt(0, b.length - 1)]}`;
  }

  _allModEntries() {
    const entries = [];
    this._item.prefixes.forEach((m, i) => entries.push({ type: 'prefix', index: i, mod: m }));
    this._item.suffixes.forEach((m, i) => entries.push({ type: 'suffix', index: i, mod: m }));
    return entries;
  }

  _existingGroups() {
    const groups = new Set();
    for (const m of this._item.prefixes) {
      groups.add(`name:${m.modGroup}`);
      if (m.sourceModifierGroupId != null) groups.add(`source:${m.sourceModifierGroupId}`);
    }
    for (const m of this._item.suffixes) {
      groups.add(`name:${m.modGroup}`);
      if (m.sourceModifierGroupId != null) groups.add(`source:${m.sourceModifierGroupId}`);
    }
    return groups;
  }

  _isAtModLimit(rarity) {
    const limits = this._limits[rarity];
    if (!limits) return true;
    return (this._item.prefixes.length >= limits.prefixes && this._item.suffixes.length >= limits.suffixes);
  }

  _buildCandidatePool(pool, type) {
    const out = [];
    if (!pool) return out;
    for (const group of pool) {
      for (const tier of (group.tiers || [])) {
        const overlayKey = `${type}|${group.modGroup}|${Number(tier.ilvlReq) || 0}`;
        const source = this._sourceModifierOverlay.get(overlayKey) || null;
        const weight = Number(source?.spawnWeight != null ? source.spawnWeight : tier.weight);
        if (tier.ilvlReq <= this._item.ilvl && Number.isFinite(weight) && weight > 0 && this._sourceTagsAllow(source)) {
          out.push({
            type,
            group,
            tier,
            source,
            weight,
            groupIdentity: source?.sourceModifierGroupId != null
              ? `source:${source.sourceModifierGroupId}`
              : `name:${group.modGroup}`,
          });
        }
      }
    }
    return out;
  }

  _sourceTagsAllow(source) {
    if (!source) return true;
    if ((source.requiredTags || []).some(tag => !this._baseTags.has(tag))) return false;
    if ((source.forbiddenTags || []).some(tag => this._baseTags.has(tag))) return false;
    // The imported 0.5.4 reference has no populated ordered weight conditions.
    // If a later export supplies an explicit zero for a matching base tag, it is
    // safe to exclude; positive ordered-condition semantics remain data-only
    // until the source specifies how they compose with class spawn weights.
    if ((source.weightConditions || []).some(([tag, weight]) => this._baseTags.has(tag) && Number(weight) === 0)) return false;
    return true;
  }

  _eligibleCandidates(type, existingGroups) {
    const src = type === 'prefix' ? this._prefixCandidates : this._suffixCandidates;
    return src.filter(c =>
      !existingGroups.has(c.groupIdentity) && !existingGroups.has(`name:${c.group.modGroup}`));
  }

  _craftOptions(options) {
    if (typeof options === 'number') {
      return { minModLevel: 0, valueQuality: Math.max(0, Math.min(1, options)) };
    }
    return {
      minModLevel: Math.max(0, Number(options?.minModLevel) || 0),
      valueQuality: Math.max(0, Math.min(1, Number(options?.valueQuality) || 0)),
    };
  }

  // Minimum Modifier Level removes low tiers while preserving at least the
  // highest item-level-eligible tier of every modifier group. This is the
  // in-game exception behind the underlined tooltip term: a currency floor may
  // not remove a modifier type from the pool entirely.
  _filterByMinModifierLevel(candidates, minModLevel = 0) {
    if (!(minModLevel > 0)) return candidates;
    const byGroup = new Map();
    for (const candidate of candidates) {
      const key = `${candidate.type}:${candidate.groupIdentity || `name:${candidate.group.modGroup}`}`;
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key).push(candidate);
    }
    const filtered = [];
    for (const groupCandidates of byGroup.values()) {
      const aboveFloor = groupCandidates.filter(c => Number(c.tier.ilvlReq) >= minModLevel);
      if (aboveFloor.length) {
        filtered.push(...aboveFloor);
        continue;
      }
      const highestEligibleLevel = Math.max(...groupCandidates.map(c => Number(c.tier.ilvlReq) || 0));
      filtered.push(...groupCandidates.filter(c => (Number(c.tier.ilvlReq) || 0) === highestEligibleLevel));
    }
    return filtered;
  }

  _addRandomMod(rarity, options = {}) {
    const limits = this._limits[rarity];
    if (!limits) return null;
    const canPrefix = this._item.prefixes.length < limits.prefixes;
    const canSuffix = this._item.suffixes.length < limits.suffixes;
    if (!canPrefix && !canSuffix) return null;

    const existingGroups = this._existingGroups();
    const candidates = [];
    if (canPrefix) candidates.push(...this._eligibleCandidates('prefix', existingGroups));
    if (canSuffix) candidates.push(...this._eligibleCandidates('suffix', existingGroups));
    if (candidates.length === 0) return null;
    const craftOptions = this._craftOptions(options);
    const filtered = this._filterByMinModifierLevel(candidates, craftOptions.minModLevel);
    return this._selectAndApplyCandidate(filtered, craftOptions);
  }

  _addRandomModOfType(type, rarity, options = {}) {
    const limits = this._limits[rarity];
    if (!limits) return null;
    const current = type === 'prefix' ? this._item.prefixes : this._item.suffixes;
    const cap = type === 'prefix' ? limits.prefixes : limits.suffixes;
    if (current.length >= cap) return null;
    const candidates = this._eligibleCandidates(type, this._existingGroups());
    if (candidates.length === 0) return null;
    const craftOptions = this._craftOptions(options);
    const filtered = this._filterByMinModifierLevel(candidates, craftOptions.minModLevel);
    return this._selectAndApplyCandidate(filtered, craftOptions);
  }

  _selectAndApplyCandidate(candidates, options = {}) {
    if (!candidates.length) return null;
    const craftOptions = this._craftOptions(options);
    const groupMap = new Map();
    for (const c of candidates) {
      const key = `${c.type}:${c.groupIdentity}`;
      groupMap.set(key, (groupMap.get(key) || 0) + c.weight);
    }
    const selectedGroupKey = this._weightedRandom(groupMap);
    if (selectedGroupKey == null) return null;
    const groupCandidates = candidates.filter(c => `${c.type}:${c.groupIdentity}` === selectedGroupKey);
    const tierWeights = groupCandidates.map(c => [c, c.weight]);
    const selected = this._weightedRandomFromPairs(tierWeights);
    if (!selected) return null;
    return this._applyMod(selected.type, selected.group, selected.tier, craftOptions.valueQuality, selected.source);
  }

  _applyMod(type, group, tier, quality = 0, source = null) {
    if (Array.isArray(tier.lines) && tier.lines.length) {
      const lines = tier.lines.map(ln => this._rollLineTemplate(ln, quality));
      const multiRecord = {
        modGroup: group.modGroup,
        tier: tier.tier,
        tierName: tier.name,
        ilvlReq: tier.ilvlReq,
        lines,
        displayText: lines.map(l => l.text).join('\n'),
        fractured: false,
      };
      this._applySourceIdentity(multiRecord, source);
      if (type === 'prefix') this._item.prefixes.push(multiRecord);
      else this._item.suffixes.push(multiRecord);
      return { ...multiRecord, type };
    }
    const hasRange = tier.min != null && tier.max != null;
    // `quality` (0..1) raises the low end of the roll toward max, so Greater and
    // Perfect orbs land in the upper part of the mod's value range.
    let value = null;
    if (hasRange) {
      value = this._rollSpec(tier.min, tier.max, quality);
    }
    const displayText = tier.modLine
      ? (value != null ? tier.modLine.replaceAll('{0}', value) : tier.modLine)
      : 'Unknown Mod';
    const modRecord = {
      modGroup: group.modGroup,
      tier: tier.tier,
      tierName: tier.name,
      ilvlReq: tier.ilvlReq,
      modLine: tier.modLine,
      displayText,
      value,
      min: tier.min,
      max: tier.max,
      fractured: false,
    };
    this._applySourceIdentity(modRecord, source);
    if (type === 'prefix') this._item.prefixes.push(modRecord);
    else this._item.suffixes.push(modRecord);
    return { ...modRecord, type };
  }

  _applySourceIdentity(record, source) {
    if (!source) return record;
    record.stableModifierId = source.stableModifierId;
    record.sourceModifierKey = source.sourceModifierKey;
    record.sourceModifierGroupId = source.sourceModifierGroupId;
    if (source.modifierTags?.length) record.modifierTags = source.modifierTags.slice();
    return record;
  }

  // Remove a single (non-fractured) modifier.
  //  - `side`: 'prefix' | 'suffix' | null (any side)
  //  - `mode`: 'random' (default) or 'lowest' (lowest modifier level / ilvlReq)
  _removeMod({ side = null, mode = 'random' } = {}) {
    // Never strip a pending UNREVEALED desecrated placeholder via Annulment /
    // Chaos / Essence removals — it must persist until it is revealed (or removed
    // explicitly by Omen of Light). This keeps the Reveal panel alive when an
    // unrelated modifier is annulled.
    let entries = this._allModEntries().filter(e => !e.mod.fractured && !e.mod.unrevealed);
    if (side) entries = entries.filter(e => e.type === side);
    if (entries.length === 0) return null;

    let pick;
    if (mode === 'lowest') {
      // Rank by NUMERIC modifier level (ilvlReq). Some mods have no numeric
      // level: Desecrated mods use a string tier ('D'), and mods revealed from
      // the Well of Souls historically lacked ilvlReq. Coerce to a Number and
      // treat anything non-numeric as Infinity so it sorts LAST. Previously the
      // fallback returned the raw `tier` string, so comparisons like 5 < 'D'
      // evaluated to NaN-driven false and Whittling removed the wrong modifier.
      const levelOf = (m) => {
        const lvl = m.ilvlReq != null ? m.ilvlReq : m.tier;
        const n = Number(lvl);
        return Number.isFinite(n) ? n : Infinity;
      };
      const lowestLevel = Math.min(...entries.map(e => levelOf(e.mod)));
      const lowestEntries = entries.filter(e => levelOf(e.mod) === lowestLevel);
      pick = lowestEntries[this._randomInt(0, lowestEntries.length - 1)];
    } else {
      pick = entries[this._randomInt(0, entries.length - 1)];
    }

    if (pick.type === 'prefix') this._item.prefixes.splice(pick.index, 1);
    else this._item.suffixes.splice(pick.index, 1);
    return { ...pick.mod, type: pick.type };
  }

  _removeRandomMod() {
    return this._removeMod({ mode: 'random' });
  }

  // Omen of Sanctification: roll every non-fractured modifier toward (and
  // possibly beyond) its range, then lock the item from further modification.
  _applySanctification() {
    const sanctify = (base) => Math.round(Number(base) * (0.78 + Math.random() * 0.44));
    for (const { mod } of this._allModEntries()) {
      if (mod.fractured) continue;
      if (Array.isArray(mod.lines) && mod.lines.length) {
        for (const l of mod.lines) {
          if (Array.isArray(l.vals) && Array.isArray(l.values)) {
            l.values = l.values.map(v => sanctify(v));
            let text = l.modLine || '';
            l.values.forEach((v, idx) => { text = text.replaceAll(`{${idx}}`, v); });
            l.text = text;
            l.value = l.values[0];
          } else if (l.value != null && l.modLine) {
            l.value = sanctify(l.value);
            l.text = l.modLine.replaceAll('{0}', l.value);
          }
        }
        mod.displayText = mod.lines.map(l => l.text).join('\n');
      } else if (mod.value != null && mod.modLine) {
        mod.value = sanctify(mod.value);
        mod.displayText = mod.modLine.replaceAll('{0}', mod.value);
      }
    }
    this._item.sanctified = true;
  }

  _rollCorruptedImplicit() {
    const pool = this._vaalCorruptedPool;
    if (!pool || pool.length === 0) return null;
    const selected = pool[this._randomInt(0, pool.length - 1)];
    let text;
    if (Array.isArray(selected.vals) && selected.vals.length) {
      const values = selected.vals.map(s => this._randomInt(s.min, s.max));
      text = selected.modLine || '';
      values.forEach((v, idx) => { text = text.replaceAll(`{${idx}}`, v); });
    } else {
      const hasRange = selected.min != null && selected.max != null;
      const value = hasRange ? this._rollSpec(selected.min, selected.max, 0) : null;
      text = value != null ? selected.modLine.replaceAll('{0}', value) : selected.modLine;
    }
    return { text, mod: { type: 'corrupted', modGroup: selected.modGroup, displayText: text } };
  }

  _weightedRandom(weightMap) {
    const entries = [...weightMap].filter(([, weight]) => Number.isFinite(Number(weight)) && Number(weight) > 0);
    if (!entries.length) return null;
    let total = 0;
    for (const [, weight] of entries) total += Number(weight);
    let roll = Math.random() * total;
    for (const [key, weight] of entries) {
      roll -= Number(weight);
      if (roll <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  _weightedRandomFromPairs(pairs) {
    const eligible = pairs.filter(([, weight]) => Number.isFinite(Number(weight)) && Number(weight) > 0);
    if (!eligible.length) return null;
    let total = 0;
    for (const [, weight] of eligible) total += Number(weight);
    let roll = Math.random() * total;
    for (const [item, weight] of eligible) {
      roll -= Number(weight);
      if (roll <= 0) return item;
    }
    return eligible[eligible.length - 1][0];
  }

  _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _success(payload) { return { success: true, item: this.getItem(), ...payload }; }
  _fail(error) { return { success: false, error, item: this.getItem() }; }
}

window.CraftingEngine = CraftingEngine;
