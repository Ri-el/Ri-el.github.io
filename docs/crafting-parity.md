# Crafting parity

Target game version: **0.5.4**  
Full parity claimed: **No**

## Current implementation-status audit

The current 531-definition registry has **412 executable definitions**: 97 verified and 315 explicitly inferred. The remaining records are 107 blocked, nine deprecated for the target version, and three non-equipment records. Exact per-definition evidence, assumptions, fixtures, and blockers are generated in `reports/crafting-implementation-status.md` and `.json`.

| Category | Known | Verified | Inferred | Blocked | Deprecated | Non-equipment |
|---|---:|---:|---:|---:|---:|---:|
| Currency | 20 | 20 | 0 | 0 | 0 | 0 |
| Quality | 8 | 0 | 0 | 8 | 0 | 0 |
| Socketing / Augments | 296 | 0 | 285 | 3 | 8 | 0 |
| Ritual / Omens | 38 | 18 | 0 | 19 | 1 | 0 |
| Essences | 80 | 57 | 23 | 0 | 0 | 0 |
| Abyss | 12 | 2 | 6 | 4 | 0 | 0 |
| Breach / Genesis | 28 | 0 | 1 | 27 | 0 | 0 |
| Delirium / Instilling | 26 | 0 | 0 | 26 | 0 | 0 |
| Runeforging | 19 | 0 | 0 | 17 | 0 | 2 |
| Corruption / Sacrifice | 4 | 0 | 0 | 3 | 0 | 1 |

## Task 07 Expedition, Temple/Atziri, Vaal, and specialized crafting checkpoint

Task 07 leaves the shipped visible surface unchanged and keeps unsupported specialized systems out of mutation dispatch. The registry retains **19 Runeforging/Expedition category**, **26 Delirium/Instilling**, and **four corruption category** definitions; all 49 are hidden and unsupported except the visible, probability-unverified Vaal Orb card. The true equipment candidates are 17 Expedition records and three corruption records; Alloy Crossbow, Elemental Conflux, and the Sacrifice skill gem are converter false positives excluded from equipment-operation parity. No specialized operation reuses ordinary Vaal outcomes.

The four Fluxes, thirteen named Alloys, Architect's Orb, Ancient Infuser, Vaal Infusers, extraction candidates, and task-listed Temple/Atziri names remain source-audited blockers: exact target classes/tags, conversion/property/quality rules, corruption or sacrifice requirements, outcome weights, destruction/failure, extraction, and interactions are not verified. Missing normalized identities are recorded rather than fabricated. Delirium/Instilling and Runeforging results are not classified as enchantments, implicits, socket effects, or base properties without source-backed state definitions.

## Task 06 Sockets, Runes, and Soul Cores checkpoint

The registry remains **531 definitions** for target **0.5.4**. Socketing retains **296 definitions** (Artificer's Orb plus 295 socketables): **285 executable inferred mechanics**, **three Talisman-only blockers**, and **eight deprecated_for_target_version** records. The executable set is Artificer's Orb plus 284 current socketables.

Item state exposes deterministic typed slots, atomic malformed-state validation, save/load compatibility, Undo/Redo, and a dedicated tooltip section. The runtime explicitly infers each concrete base's `socketCount` as its maximum and starts fresh items with zero added sockets. Artificer's Orb adds one empty socket up to that cap. Socketables insert only into empty sockets, use exact retained stat IDs/ranges, resolve class-specific keys through the source item-class enum, and enforce retained family limits and corruption flags. Replacement and extraction remain unavailable because no retained method defines either transition. Ancient Rune of Animosity and the two Talisman Legacy augments remain blocked because no selectable normalized Talisman base exists.

## Task 05 Abyss, Breach, Essences, and Omens checkpoint

All **80 retained regular, Greater, and Perfect Essence definitions** now execute with exact normalized class-specific modifier IDs, groups, ranges, and rarity gates. The 57 Magic-to-Rare transitions are source-backed and verified; 23 Rare remove/add transitions are explicitly inferred and use atomic rollback. Essence of the Breach likewise executes on Amulets and Rings with its exact retained modifier while its Rare replacement rule remains labelled inferred.

Preserved Cranium and the four Desecration-direction/selection Omens remain **Jewel-only**. The six Gnawed/Preserved Jawbone, Rib, and Collarbone transitions now reuse the existing Well flow with their exact retained direction, replacement count, reroll count, and item-class restrictions, labelled inferred. Ancient Bones remain blocked because their minimum modifier-level rule cannot be enforced against the retained Desecrated records, and Preserved Vertebrae remains blocked without a Waystone model. Essence of the Abyss rejects Jewel, Flask, and Charm targets. Omen of Light accepts any eligible Desecrated modifier, including an unrevealed Well placeholder, excludes fractured protection, and is consumed exactly once on successful guarded Annulment, including Hinekora foresight. Ordinary Chaos can remove revealed or unrevealed Desecrated modifiers and rolls pending Well state back atomically on failure.

The checked-in Desecrated pool is explicitly a PoE2 **0.3** jewel pool and lacks a complete target **0.5.4** Well-of-Souls weighting/localization procedure. Its option selection therefore remains a limited compatibility path, not a full parity claim. Echoes consumption timing is likewise retained as an explicit verification blocker because the source identifies the reroll action but not the exact consumption event.

## Task 04 core and quality checkpoint

The generated registry remains **531 definitions** for target version **0.5.4**. It now renders **45 visible cards**: the original 37 authored runtime controls plus eight disabled quality audit cards from retained normalized records. The eight cards are disabled with specific blockers and expose no handlers; their presence does not claim quality-mechanic parity.

Task 04 corrections are reflected in runtime and parity metadata: Alchemy is Normal-only, Annulment and Divine require non-Normal rarity, mirrored items are immutable, and Vaal Orb is visible but blocked because target-version outcome transitions/probabilities are unverified. Structured quality state now includes `amount`, `type`, `source`, and `cap`; ordinary quality formulas and Vaal Infuser mutations remain blocked. `fullParityClaim` remains false.

## Task 03 authoritative-registry checkpoint

`data/crafting/currency-index.json#craftRegistry` is the authoritative crafting-item registry. It contains all **530** retained normalized crafting items plus the existing runtime-only Hinekora's Lock definition, for **531** stable definitions. Exactly **37** definitions remain visible in this task, preserving the existing crafting surface while presentation and dispatch move to generated registry data.

Every definition records stable identity, target version, equipment relevance, category and tab, applicability and disabled-reason identifiers, operation handler, Omen trigger metadata, corruption/quality/socket restrictions, source evidence, implementation and verification status, deterministic fixture references, and an explicit blocker where evidence is incomplete.

| Classification | Retained source | Complete registry | Visible definitions |
|---|---:|---:|---:|
| implemented | 31 | 32 | 32 |
| conditional | 0 | 0 | 0 |
| non_item_currency | 0 | 0 | 0 |
| blocked_missing_data | 489 | 489 | 4 |
| probability_unverified | 1 | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 | 0 |
| deprecated_for_target_version | 9 | 9 | 0 |

The visible definitions remain distributed across the existing behavior-bearing tabs:

| Tab | Visible definitions |
|---|---:|
| Currency | 20 |
| Ritual / Omens | 13 |
| Abyss | 2 |
| Breach / Genesis | 1 |
| Corruption / Sacrifice | 1 |

The complete registry category inventory is:

| Registry category | Definitions |
|---|---:|
| Currency | 20 |
| Quality | 8 |
| Socketing / Augments | 296 |
| Ritual / Omens | 38 |
| Essences | 76 |
| Abyss | 12 |
| Breach / Genesis | 28 |
| Delirium / Instilling | 26 |
| Runeforging | 19 |
| Corruption / Sacrifice | 8 |

Task 03 parity delta: **0 crafting-item implementation statuses changed**. This task centralizes definitions, generated inventory presentation, exact disabled reasons, and the operation-dispatch contract without enabling unverified mechanics.

## Explicit blockers

- Hinekora's Lock remains implemented for compatibility, but the checked-in normalized export contains no matching source item ID or metadata key. Its runtime-only identity remains explicit.
- The retained public data does not verify Vaal outcome probabilities, so Vaal Orb remains `probability_unverified`.
- `blocked_missing_data` records remain unavailable until their per-definition questions in the generated implementation-status report are resolved; no category-wide placeholder blocker is used.
- Deprecated target-version records remain in the audit inventory but are not rendered as active crafting controls.

`reports/crafting-parity.json` is generated directly from the registry. It keeps `fullParityClaim: false` and copies registry applicability, handlers, evidence, fixtures, verification states, and blockers without reconstructing mechanics from source tags or descriptions.
