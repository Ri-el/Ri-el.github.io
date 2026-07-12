#!/usr/bin/env node
// fuzz.mjs - deterministic, invariant-checking fuzz harness for the PoE2 jewel crafting engine.
//
// Usage:   node fuzz.mjs [iterations=20000] [seed]
//
// What it does:
//  - Loads crafting.js the same way the browser app does (window shim + side-effect import),
//    then reads globalThis.window.CraftingEngine. (The old fuzz used a static
//    `import CraftingEngine from './crafting.js'`, but crafting.js has no ESM export - it only
//    assigns window.CraftingEngine - so the old harness could never run a single iteration.)
//  - Rebuilds `modData` from data/bases/*.json (+ optional data/shared/*.json), mirroring the
//    app's mergeModSources()/resolveInherits() pipeline. Auto-discovers every base that actually
//    has mods, so newly-wired bases get fuzzed automatically with no code change.
//  - Loads data/desecrated-mods.json raw and feeds it to the engine (3rd constructor arg), so the
//    Well-of-Souls / desecration code paths are exercised.
//  - Seeds a mulberry32 PRNG and OVERRIDES Math.random, so BOTH the fuzzer's choices and the
//    engine's internal rolls are fully deterministic. The seed is printed so any run is replayable.
//  - Drives ~19 labelled actions covering every public engine method, and after EVERY action checks
//    a set of invariants (affix caps per rarity, no duplicate mod groups, ilvl bounds, rolled values
//    inside their [min,max], corruption lockout). Any breach is a failure.
//  - Prints a full report and exits non-zero on any invariant violation or harness error (CI-ready).

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import path from 'node:path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(HERE, 'data')

// ---------- args ----------
const ITERATIONS = Math.max(1, parseInt(process.argv[2] ?? '20000', 10) || 20000)
const SEED = process.argv[3] !== undefined ? (parseInt(process.argv[3], 10) >>> 0) : ((Math.random() * 0xffffffff) >>> 0)

// ---------- seeded RNG (mulberry32) ----------
function mulberry32(a) {
	return function () {
		a |= 0
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}
const rng = mulberry32(SEED)
const _origRandom = Math.random
Math.random = rng // makes the engine's internal rolls deterministic too

const rnd = () => rng()
const ri = (n) => Math.floor(rng() * n)
const pick = (arr) => arr[ri(arr.length)]

// ---------- load the engine the same way the app does ----------
globalThis.window = globalThis.window || globalThis
async function loadEngine() {
	const url = new URL('./crafting.js', import.meta.url).href
	await import(url) // side-effect: assigns window.CraftingEngine
	const Engine = globalThis.window.CraftingEngine
	if (typeof Engine !== 'function') {
		throw new Error('crafting.js did not define window.CraftingEngine')
	}
	return Engine
}

// ---------- data pipeline (mirrors app.js mergeModSources/resolveInherits) ----------
function readJSON(file) {
	try {
		return JSON.parse(readFileSync(file, 'utf8'))
	} catch (error) {
		const relative = path.relative(HERE, file)
		throw new Error(`Malformed JSON in ${relative}: ${error && error.message}`)
	}
}
function loadShared() {
	const dir = path.join(DATA, 'shared')
	const shared = {}
	if (existsSync(dir)) {
		for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
			const id = f.replace(/\.json$/, '')
			const def = readJSON(path.join(dir, f))
			if (!def || typeof def !== 'object' || Array.isArray(def)) {
				throw new Error(`Malformed shared data in ${path.relative(HERE, path.join(dir, f))}: expected an object`)
			}
			shared[id] = def
		}
	}
	return shared
}
function resolveInherits(baseDef, shared) {
	if (!Array.isArray(baseDef.inherits)) return baseDef
	const def = { ...baseDef }
	const pre = []
	const suf = []
	for (const key of baseDef.inherits) {
		const s = shared[key]
		if (!s) throw new Error(`Base inherits unknown shared pool: ${key}`)
		if (Array.isArray(s.prefixes)) pre.push(...s.prefixes)
		if (Array.isArray(s.suffixes)) suf.push(...s.suffixes)
	}
	def.prefixes = [...pre, ...(baseDef.prefixes || [])]
	def.suffixes = [...suf, ...(baseDef.suffixes || [])]
	delete def.inherits
	return def
}
function hasMods(def) {
	const p = Array.isArray(def.prefixes) ? def.prefixes.length : 0
	const s = Array.isArray(def.suffixes) ? def.suffixes.length : 0
	return p + s > 0
}
function buildModData() {
	const dir = path.join(DATA, 'bases')
	const shared = loadShared()
	const bases = {}
	const discovered = []
	for (const f of readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
		const id = f.replace(/\.json$/, '')
		let def = readJSON(path.join(dir, f))
		if (!def || typeof def !== 'object' || Array.isArray(def)) {
			throw new Error(`Malformed base data in ${path.relative(HERE, path.join(dir, f))}: expected an object`)
		}
		for (const key of ['prefixes', 'suffixes', 'inherits']) {
			if (def[key] != null && !Array.isArray(def[key])) {
				throw new Error(`Malformed base data in ${path.relative(HERE, path.join(dir, f))}: ${key} must be an array`)
			}
		}
		def = resolveInherits(def, shared)
		bases[id] = def
		if (hasMods(def)) discovered.push(id)
	}
	return { modData: { bases }, fuzzable: discovered }
}
function loadDesecData() {
	const file = path.join(DATA, 'desecrated-mods.json')
	return existsSync(file) ? readJSON(file) : null
}

function loadConcreteBaseDefinitions(fuzzable) {
	const normalizedDir = path.join(DATA, 'normalized')
	const baseData = readJSON(path.join(normalizedDir, 'base-items.json'))
	const modifierData = readJSON(path.join(normalizedDir, 'modifiers.json'))
	const manifest = readJSON(path.join(normalizedDir, 'version-manifest.json'))
	const basesById = new Map(baseData.bases.map(base => [base.id, base]))
	const classesById = new Map(baseData.classes.map(sourceClass => [sourceClass.id, sourceClass]))
	const modifiersById = new Map(modifierData.modifiers.map(modifier => [modifier.id, modifier]))
	const canonicalClass = base => {
		if (base.itemClass === 'LifeFlask') return 'Life Flask'
		if (base.itemClass === 'ManaFlask') return 'Mana Flask'
		if (base.itemClass === 'UtilityFlask' && base.equipmentSlot === 'Charm') return 'Charm'
		return base.itemClass
	}
	const out = new Map()
	for (const simulatorPoolId of fuzzable) {
		const mapping = baseData.simulatorBaseMap[simulatorPoolId]
		if (!mapping) throw new Error(`Fuzzable pool ${simulatorPoolId} has no normalized concrete-base mapping.`)
		const base = (mapping.concreteBaseIds || []).map(id => basesById.get(id)).find(record => record && !record.unmodifiable)
		if (!base) throw new Error(`Fuzzable pool ${simulatorPoolId} has no selectable normalized concrete base.`)
		const sourceClass = classesById.get(base.classId)
		const attributeFamily = ({
			attr_str: 'str', attr_dex: 'dex', attr_int: 'int', attr_strdex: 'str_dex',
			attr_strint: 'str_int', attr_dexint: 'dex_int', attr_all: 'str_dex_int',
		})[sourceClass?.iconKey] || null
		out.set(simulatorPoolId, {
			id: base.id,
			sourceId: base.id,
			metadataKey: base.metadataKey || null,
			displayName: base.displayName,
			itemClass: canonicalClass(base),
			sourceItemClass: base.itemClass,
			equipmentSlot: base.equipmentSlot || null,
			classId: base.classId,
			modifierPoolClassId: base.modifierPoolClassId,
			simulatorPoolId,
			attributeFamily,
			variantFamily: simulatorPoolId,
			requiredLevel: null,
			dropLevel: base.dropLevel,
			tags: [...new Set(base.tags || [])],
			requirements: isRecord(base.requirements) ? base.requirements : {},
			baseProperties: isRecord(base.baseProperties) ? base.baseProperties : {},
			implicits: (base.implicitModifierIds || []).map(id => {
				const modifier = modifiersById.get(id)
				return { id, key: modifier?.key || null, stats: modifier?.stats || [], displayText: modifier?.key || `Modifier ${id}` }
			}),
			sourceSocketCount: Number.isInteger(base.socketCount) ? base.socketCount : null,
			defaultSockets: null,
			maximumSockets: null,
			targetGameVersion: manifest.targetGameVersion,
			sourceVersion: manifest.source?.embeddedGameVersion || null,
			verificationState: manifest.source?.versionStatus || null,
			provenance: { normalizedPath: 'data/normalized/base-items.json', sourceSha256: manifest.source?.sha256 || null },
		})
	}
	return out
}

// ---------- invariants ----------
const PLACEHOLDERS = new Set(['__desecrated_pending__', '__mark_of_abyssal_lord__'])
const EPS = 1e-9

function canonicalize(value) {
	if (value === undefined) return { __fuzzUndefined: true }
	if (Array.isArray(value)) return value.map(canonicalize)
	if (value && typeof value === 'object') {
		const out = {}
		for (const key of Object.keys(value).sort()) out[key] = canonicalize(value[key])
		return out
	}
	return value
}

function stableStringify(value) {
	return JSON.stringify(canonicalize(value))
}

function isRecord(value) {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

function capFor(engine, rarity) {
	const r = String(rarity || 'normal').toLowerCase()
	if (r === 'normal') return { p: 0, s: 0 }
	if (!engine || typeof engine.getLimits !== 'function') return null
	const lim = engine.getLimits(r)
	if (!isRecord(lim) || !Number.isInteger(lim.prefixes) || !Number.isInteger(lim.suffixes)) return null
	return { p: lim.prefixes, s: lim.suffixes }
}

function affixTriples(affix) {
	const out = []
	const num = (x) => typeof x === 'number' && isFinite(x)
	const push = (v, mn, mx) => {
		if (num(v) && num(mn) && num(mx)) out.push({ v, mn, mx })
	}
	const valOf = (o) => {
		if (!o) return undefined
		for (const k of ['value', 'val', 'roll', 'rolled', 'current']) if (num(o[k])) return o[k]
		return undefined
	}
	if (Array.isArray(affix?.lines)) for (const ln of affix.lines) push(valOf(ln), ln?.min, ln?.max)
	push(valOf(affix), affix?.min, affix?.max)
	return out
}

function checkItemShape(engine, item) {
	const v = []
	if (!isRecord(item)) {
		v.push('getItem() returned no item')
		return v
	}
	if (!['normal', 'magic', 'rare'].includes(item.rarity)) v.push(`invalid rarity: ${String(item.rarity)}`)
	for (const key of ['baseName', 'name', 'baseType', 'jewelType']) {
		if (typeof item[key] !== 'string' || item[key].length === 0) v.push(`${key} must be a non-empty string`)
	}
	if (engine && typeof engine.baseType === 'string' && item.baseType !== engine.baseType) {
		v.push(`item baseType ${item.baseType} does not match engine baseType ${engine.baseType}`)
	}
	if (item.baseItemId != null) {
		if (!Number.isInteger(item.schemaVersion) || item.schemaVersion < 4) v.push('concrete item must use item-state schema version 4 or newer')
		if (!['string', 'number'].includes(typeof item.baseItemId) || String(item.baseItemId).length === 0) {
			v.push('baseItemId must be a stable string or number')
		}
		if (typeof item.simulatorPoolId !== 'string' || item.simulatorPoolId !== engine?.baseType) {
			v.push(`simulatorPoolId ${String(item.simulatorPoolId)} does not match engine baseType ${String(engine?.baseType)}`)
		}
		if (!Array.isArray(item.baseTags)) v.push('baseTags must be an array when baseItemId is present')
		if (!Array.isArray(item.implicits)) v.push('implicits must be an array when baseItemId is present')
		if (!isRecord(item.baseProperties)) v.push('baseProperties must be an object when baseItemId is present')
		if (item.itemLevel !== item.ilvl) v.push(`itemLevel ${String(item.itemLevel)} does not match ilvl ${String(item.ilvl)}`)
		for (const key of ['sockets', 'runes', 'soulCores']) {
			if (!Array.isArray(item[key])) v.push(`${key} must be a structured array`)
		}
		if (!isRecord(item.flags)) v.push('flags must be an object')
		const concrete = typeof engine?.getConcreteBase === 'function' ? engine.getConcreteBase() : null
		if (concrete) {
			if (String(concrete.id) !== String(item.baseItemId)) v.push('concrete-base ID drifted from engine template')
			const expectedImplicitIds = (concrete.implicits || []).map(implicit => implicit.id)
			const actualImplicitIds = item.implicits.map(implicit => implicit?.id)
			if (stableStringify(actualImplicitIds) !== stableStringify(expectedImplicitIds)) v.push('base implicits drifted during crafting')
		}
		if (item.requiredLevel != null && (!Number.isInteger(item.requiredLevel) || item.requiredLevel < 0)) {
			v.push('requiredLevel must be null or a non-negative integer')
		}
		if (item.dropLevel != null && (!Number.isInteger(item.dropLevel) || item.dropLevel < 0)) {
			v.push('dropLevel must be null or a non-negative integer')
		}
	}
	for (const key of ['prefixes', 'suffixes', 'enchantments']) {
		if (!Array.isArray(item[key])) v.push(`${key} must be an array`)
	}
	for (const key of ['corrupted', 'sanctified', 'hinekoraLocked']) {
		if (typeof item[key] !== 'boolean') v.push(`${key} must be boolean`)
	}
	if (!isRecord(item.quality)) {
		v.push('quality must be a structured object')
	} else {
		const amount = Number(item.quality.amount)
		const cap = item.quality.cap == null ? null : Number(item.quality.cap)
		if (!Number.isFinite(amount) || amount < 0) v.push(`quality amount must be non-negative: ${item.quality.amount}`)
		if (typeof item.quality.type !== 'string' || !item.quality.type.trim()) v.push('quality type must be a non-empty string')
		if (cap != null && (!Number.isFinite(cap) || cap < amount)) v.push(`quality cap must be null or >= amount: ${item.quality.cap}`)
	}
	if (!Number.isInteger(item.ilvl) || item.ilvl < 1 || item.ilvl > 100) v.push(`ilvl must be an integer in [1,100]: ${item.ilvl}`)
	if (!isRecord(item.currencyUsed)) {
		v.push('currencyUsed must be an object')
	} else {
		for (const [key, count] of Object.entries(item.currencyUsed)) {
			if (!key || !Number.isInteger(count) || count < 0) v.push(`currencyUsed.${key} must be a non-negative integer`)
		}
	}
	if (Array.isArray(item.enchantments) && item.enchantments.some(value => typeof value !== 'string')) {
		v.push('enchantments must contain only strings')
	}

	for (const [side, mods] of [['prefix', item.prefixes], ['suffix', item.suffixes]]) {
		if (!Array.isArray(mods)) continue
		mods.forEach((mod, index) => {
			const at = `${side}[${index}]`
			if (!isRecord(mod)) { v.push(`${at} must be an object`); return }
			if (typeof mod.modGroup !== 'string' || mod.modGroup.length === 0) v.push(`${at}.modGroup must be a non-empty string`)
			if (typeof mod.displayText !== 'string') v.push(`${at}.displayText must be a string`)
			if (typeof mod.fractured !== 'boolean') v.push(`${at}.fractured must be boolean`)
			if (mod.affix != null && mod.affix !== side) v.push(`${at}.affix disagrees with its containing side`)
			for (const flag of ['desecrated', 'unrevealed', 'mark', 'crafted']) {
				if (mod[flag] != null && typeof mod[flag] !== 'boolean') v.push(`${at}.${flag} must be boolean when present`)
			}
			if (mod.lines != null && !Array.isArray(mod.lines)) v.push(`${at}.lines must be an array when present`)
			if (Array.isArray(mod.lines)) mod.lines.forEach((line, lineIndex) => {
				if (!isRecord(line)) v.push(`${at}.lines[${lineIndex}] must be an object`)
				else if (typeof line.text !== 'string') v.push(`${at}.lines[${lineIndex}].text must be a string`)
			})
		})
	}
	return v
}

function checkPendingShape(pending, item) {
	const v = []
	const mods = [...(Array.isArray(item?.prefixes) ? item.prefixes : []), ...(Array.isArray(item?.suffixes) ? item.suffixes : [])]
	const placeholders = mods.filter(mod => mod?.modGroup === '__desecrated_pending__')
	if (pending == null) {
		if (placeholders.length) v.push('unrevealed Desecration placeholder exists without pending state')
		return v
	}
	if (!isRecord(pending)) return ['pending Desecration state must be an object']
	if (!['prefix', 'suffix'].includes(pending.side)) v.push(`pending Desecration has invalid side: ${pending.side}`)
	if (!['add', 'replace'].includes(pending.mode)) v.push(`pending Desecration has invalid mode: ${pending.mode}`)
	if (!Number.isInteger(pending.rerollsLeft) || pending.rerollsLeft < 0) v.push('pending rerollsLeft must be a non-negative integer')
	if (!Array.isArray(pending.options) || pending.options.length === 0) v.push('pending Desecration must have reveal options')
	if (placeholders.length !== 1) v.push(`pending Desecration requires exactly one placeholder; found ${placeholders.length}`)
	return v
}

function checkInvariants(engine, item, pending) {
	const v = [...checkItemShape(engine, item), ...checkPendingShape(pending, item)]
	if (!isRecord(item)) return v
	const pre = Array.isArray(item.prefixes) ? item.prefixes : []
	const suf = Array.isArray(item.suffixes) ? item.suffixes : []
	const cap = capFor(engine, item.rarity)
	if (!cap) {
		v.push(`engine returned no valid affix limits for ${item.rarity}`)
	} else {
		if (pre.length > cap.p) v.push(`${item.rarity} item has ${pre.length} prefixes (max ${cap.p})`)
		if (suf.length > cap.s) v.push(`${item.rarity} item has ${suf.length} suffixes (max ${cap.s})`)
	}

	const groups = [...pre, ...suf].map((a) => a && a.modGroup).filter((g) => g && !PLACEHOLDERS.has(g))
	const seen = new Set()
	for (const g of groups) {
		if (seen.has(g)) {
			v.push(`duplicate mod group on item: ${g}`)
			break
		}
		seen.add(g)
	}

	if (!item.sanctified) {
		for (const a of [...pre, ...suf]) {
			if (a && a.sanctified) continue
			for (const t of affixTriples(a)) {
				if (t.v < t.mn - EPS || t.v > t.mx + EPS) {
					v.push(`rolled value ${t.v} outside [${t.mn}, ${t.mx}] in group ${a && a.modGroup}`)
					break
				}
			}
		}
	}
	return v
}

function immutableProjection(item) {
	// Compare the persisted semantic state. The round-trip probe intentionally
	// drops object properties whose value is `undefined`, exactly as stash JSON
	// does; that serialization-only normalization is not an item mutation.
	const persisted = JSON.parse(JSON.stringify(item))
	const projected = canonicalize(persisted)
	if (isRecord(projected)) delete projected.currencyUsed
	return projected
}

function checkImmutableTransition(action, before, after) {
	if (!before?.corrupted && !before?.sanctified) return []
	if (stableStringify(immutableProjection(before)) === stableStringify(immutableProjection(after))) return []
	const kind = before.corrupted ? 'corrupted' : 'sanctified'
	return [`${kind} item changed during ${action}`]
}

// ---------- main ----------
const Engine = await loadEngine()
const { modData, fuzzable } = buildModData()
const desecData = loadDesecData()
const concreteBases = loadConcreteBaseDefinitions(fuzzable)

if (fuzzable.length === 0) {
	console.error('No fuzzable bases found in data/bases (need non-empty prefixes/suffixes).')
	process.exit(2)
}

const QUALS = [0, 0.5, 0.8]
const CHAOS_OMENS = [null, 'whittling', 'sinistral_erasure', 'dextral_erasure']
const ANNUL_OPTS = [{}, { desecratedOnly: true }, { omen: 'sinistral_annulment' }, { omen: 'dextral_annulment' }]
const DIVINE_OMENS = [null, 'sanctification']
const DESEC_OMENS = ['sinistral_necromancy', 'dextral_necromancy', 'abyssal_echoes']
const CONSUMING_ACTIONS = new Set([
	'transmutation', 'augmentation', 'regal', 'exalted', 'chaos', 'alchemy',
	'annulment', 'divine', 'fracturing', 'essenceOfAbyss',
	'essenceOfBreach', 'desecration',
])
const MEANINGFUL_MUTATION_ACTIONS = new Set([
	'transmutation', 'augmentation', 'regal', 'exalted', 'chaos', 'alchemy',
	'annulment', 'divine', 'fracturing', 'essenceOfAbyss', 'desecration',
])

const ACTIONS = [
	['setItemLevel', (e) => {
		const value = e.setItemLevel(1 + ri(100))
		return { success: true, action: 'set-item-level', value }
	}],
	['transmutation', (e) => e.applyTransmutation(pick(QUALS))],
	['augmentation', (e) => e.applyAugmentation(pick(QUALS))],
	['regal', (e) => e.applyRegal(pick(QUALS))],
	['exalted', (e) => e.applyExalted(pick(QUALS))],
	['chaos', (e) => e.applyChaos(pick(CHAOS_OMENS), pick(QUALS))],
	['alchemy', (e) => e.applyAlchemy()],
	['annulment', (e) => e.applyAnnulment(pick(ANNUL_OPTS))],
	['divine', (e) => e.applyDivine(pick(DIVINE_OMENS))],
	['vaal', (e) => {
		if (e.vaalOutcomeOptions) e.vaalOutcomeOptions()
		return e.applyVaal(rnd() < 0.5 ? null : 1 + ri(4))
	}],
	['fracturing', (e) => e.applyFracturing()],
	['essenceOfAbyss', (e) => e.applyEssenceOfAbyss()],
	['essenceOfBreach', (e) => e.applyEssenceOfBreach()],
	['hinekoraLock', (e) => {
		const item = e.getItem()
		if (item.corrupted || item.sanctified || item.mirrored || item.isMirrored) return { success: false, error: 'Item is immutable.' }
		if (rnd() < 0.5) e.setHinekoraLock()
		else e.clearHinekoraLock()
		return { success: true, action: 'hinekora-lock', item: e.getItem() }
	}],
	['recordCurrencyUse', (e) => {
		if (typeof e.recordCurrencyUse !== 'function') return { success: false, error: 'recordCurrencyUse unavailable' }
		const count = e.recordCurrencyUse('Chaos Orb', 1)
		return { success: true, action: 'record-currency', count }
	}],
	['desecration', (e) => {
		const omens = DESEC_OMENS.filter(() => rnd() < 0.5)
		const started = e.startDesecration({ bone: 'preserved_cranium', omen: omens[0] || null, omens })
		if (!started?.success) return started
		let pending = e.getPendingDesecration ? e.getPendingDesecration() : null
		if (!pending) return { success: false, error: 'Desecration succeeded without pending state.' }
		if (omens.includes('abyssal_echoes') && rnd() < 0.5) {
			const rerolled = e.rerollDesecration()
			if (!rerolled?.success) return rerolled
			pending = e.getPendingDesecration ? e.getPendingDesecration() : pending
		}
		const opts = pending && Array.isArray(pending.options) ? pending.options : null
		const n = opts ? opts.length : 3
		if (n > 0 && rnd() < 0.8) return e.chooseDesecratedMod(ri(n))
		return e.cancelDesecration()
	}],
	['loadItemRoundTrip', (e) => {
		const snap = JSON.parse(JSON.stringify(e.getItem()))
		const pend = e.getPendingDesecration && e.getPendingDesecration() ? JSON.parse(JSON.stringify(e.getPendingDesecration())) : null
		e.resetItem()
		e.loadItem(snap, pend)
		return { success: true, action: 'load-round-trip', item: e.getItem() }
	}],
	['probeCorruptedLockout', (e) => {
		const it = e.getItem()
		if (!it || (!it.corrupted && !it.sanctified)) return { success: false, error: 'Item is not immutable.' }
		return e.applyExalted(0)
	}],
]

const FIXED_SNAPSHOT = {
	iterations: 30000,
	seed: 542026,
 // Task 04 checkpoint: Vaal no longer consumes RNG while its unverified
 // outcome model is blocked; structured quality state and strict core rarity
 // guards also change the deterministic event stream.
 digest: '85d16590e2ed6e7a8fb4dd55d5a53ab4af980a40a360fd4633e469c3b59c37fe',
}
const runHash = createHash('sha256')
function hashEvent(event) {
	runHash.update(stableStringify(event))
	runHash.update('\n')
}

const stats = {
	ops: 0,
	resets: 0,
	engineExceptions: 0,
	harnessErrors: 0,
	violations: 0,
	meaningfulSuccessMutations: 0,
	hinekoraConsumptions: 0,
	perAction: {},
	exceptionSamples: [],
	violationSamples: [],
}
for (const [name] of ACTIONS) stats.perAction[name] = { ok: 0, threw: 0, mutated: 0, violated: 0 }

const perBase = Math.ceil(ITERATIONS / fuzzable.length)

for (const base of fuzzable) {
	let engine
	try {
		engine = new Engine(modData, base, desecData, null, null, concreteBases.get(base))
	} catch (e) {
		stats.harnessErrors++
		stats.exceptionSamples.push(`[${base}] constructor: ${e && e.message}`)
		hashEvent({ base, phase: 'constructor', error: e && e.message })
		continue
	}
	for (let i = 0; i < perBase; i++) {
		// occasional reset to re-explore from a fresh normal item
		let resetBefore = false
		if (rnd() < 0.03) {
			try {
				engine.resetItem()
				stats.resets++
				resetBefore = true
			} catch (e) {
				stats.engineExceptions++
				if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] resetItem: ${e && e.message}`)
			}
		}

		const [name, fn] = pick(ACTIONS)
		stats.ops++
		let result
		let thrown = null
		let beforeItem = null
		let beforePending = null
		try {
			beforeItem = engine.getItem()
			beforePending = engine.getPendingDesecration ? engine.getPendingDesecration() : null
		} catch (e) {
			stats.harnessErrors++
			thrown = `pre-action state: ${e && e.message}`
			if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] ${thrown}`)
		}
		try {
			result = fn(engine)
			stats.perAction[name].ok++
		} catch (e) {
			stats.engineExceptions++
			stats.perAction[name].threw++
			thrown = e && e.message
			if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] ${name}: ${e && e.message}`)
		}

		let actionItem = null
		let actionPending = null
		try {
			actionItem = engine.getItem()
			actionPending = engine.getPendingDesecration ? engine.getPendingDesecration() : null
		} catch (e) {
			stats.harnessErrors++
			thrown = thrown || `post-action state: ${e && e.message}`
			if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] post-action state: ${e && e.message}`)
		}

		const actionStateChanged = beforeItem && actionItem && stableStringify({ item: beforeItem, pending: beforePending }) !== stableStringify({ item: actionItem, pending: actionPending })
		if (!thrown && result?.success === true && actionStateChanged && MEANINGFUL_MUTATION_ACTIONS.has(name)) {
			stats.meaningfulSuccessMutations++
			stats.perAction[name].mutated++
		}

		// The browser integration consumes a Hinekora Lock after a successful
		// currency action. Model that integration boundary here, then assert the
		// final state cannot retain the incompatible Lock marker.
		const shouldConsumeHinekora = !!beforeItem?.hinekoraLocked && result?.success === true && CONSUMING_ACTIONS.has(name)
		if (shouldConsumeHinekora) {
			stats.hinekoraConsumptions++
			try {
				engine.clearHinekoraLock()
			} catch (e) {
				stats.engineExceptions++
				thrown = thrown || `clearHinekoraLock: ${e && e.message}`
				if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] clearHinekoraLock: ${e && e.message}`)
			}
		}

		// action-reported violation (e.g. corruption lockout probe)
		const stepViolations = []
		if (result && result.violation) {
			stepViolations.push(result.violation)
		}

		// invariant sweep after every action
		let item = null
		let pending = null
		try {
			item = engine.getItem()
			pending = engine.getPendingDesecration ? engine.getPendingDesecration() : null
			stepViolations.push(...checkInvariants(engine, item, pending))
			if (beforeItem) stepViolations.push(...checkImmutableTransition(name, beforeItem, item))
			if (shouldConsumeHinekora && item.hinekoraLocked) stepViolations.push(`Hinekora Lock survived successful consuming action ${name}`)
		} catch (e) {
			stats.harnessErrors++
			thrown = thrown || `getItem/invariants: ${e && e.message}`
			if (stats.exceptionSamples.length < 15) stats.exceptionSamples.push(`[${base} #${i}] getItem/invariants: ${e && e.message}`)
		}

		if (stepViolations.length) {
			stats.violations += stepViolations.length
			stats.perAction[name].violated++
			if (stats.violationSamples.length < 10) {
				stats.violationSamples.push({
					base,
					i,
					action: name,
					msg: stepViolations.join('; '),
					snapshot: {
						rarity: item && item.rarity,
						ilvl: item && item.ilvl,
						corrupted: item && item.corrupted,
						sanctified: item && item.sanctified,
						prefixes: item && item.prefixes ? item.prefixes.length : 0,
						suffixes: item && item.suffixes ? item.suffixes.length : 0,
					},
				})
			}
		}

		hashEvent({
			base, i, action: name, resetBefore,
			output: result === undefined ? null : result,
			thrown,
			state: item,
			pending,
			violations: stepViolations,
		})
	}
}

const runDigest = runHash.digest('hex')
const fixedSnapshotRun = ITERATIONS === FIXED_SNAPSHOT.iterations && SEED === FIXED_SNAPSHOT.seed
const digestDrift = fixedSnapshotRun && runDigest !== FIXED_SNAPSHOT.digest

// restore Math.random
Math.random = _origRandom

// ---------- report ----------
const L = []
L.push('PoE2 jewel crafting - fuzz harness')
L.push('='.repeat(48))
L.push(`seed:        ${SEED}   (replay: node fuzz.mjs ${ITERATIONS} ${SEED})`)
L.push(`iterations:  ${stats.ops} ops across ${fuzzable.length} base(s)`)
L.push(`bases:       ${fuzzable.join(', ')}`)
L.push(`resets:      ${stats.resets}`)
L.push(`mutations:   ${stats.meaningfulSuccessMutations} meaningful successful craft mutation(s)`)
L.push(`lock uses:   ${stats.hinekoraConsumptions} successful Hinekora consumption(s) exercised`)
L.push(`digest:      ${runDigest}`)
if (fixedSnapshotRun) L.push(`expected:    ${FIXED_SNAPSHOT.digest}`)
L.push(`exceptions:  ${stats.engineExceptions} (engine-level; fatal)`)
L.push(`harness err: ${stats.harnessErrors}`)
L.push(`VIOLATIONS:  ${stats.violations}`)
L.push('')
L.push('per-action            ok / threw / mutated / violated')
for (const [name] of ACTIONS) {
	const a = stats.perAction[name]
	L.push(`  ${name.padEnd(22)} ${String(a.ok).padStart(7)} ${String(a.threw).padStart(7)} ${String(a.mutated).padStart(9)} ${String(a.violated).padStart(10)}`)
}
if (stats.violationSamples.length) {
	L.push('')
	L.push('sample invariant violations:')
	for (const s of stats.violationSamples) {
		L.push(`  [${s.base} #${s.i}] ${s.action}: ${s.msg}`)
		if (s.snapshot) L.push(`      item: ${JSON.stringify(s.snapshot)}`)
	}
}
if (stats.exceptionSamples.length) {
	L.push('')
	L.push('sample exceptions:')
	for (const s of stats.exceptionSamples) L.push(`  ${s}`)
}
L.push('')
if (stats.meaningfulSuccessMutations === 0) L.push('fatal: no meaningful successful craft mutations were exercised')
if (digestDrift) L.push(`fatal: fixed-seed digest drifted (expected ${FIXED_SNAPSHOT.digest}, got ${runDigest})`)
const fatal = stats.violations > 0 || stats.harnessErrors > 0 || stats.engineExceptions > 0 ||
	stats.meaningfulSuccessMutations === 0 || digestDrift
L.push(fatal ? 'RESULT: FAIL' : 'RESULT: PASS')
console.log(L.join('\n'))
process.exit(fatal ? 1 : 0)
