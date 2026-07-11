# Craft of Exile PoE 2 data schema

This document records the schema actually observed in the uploaded source export before it is used by the simulator. The source file has SHA-256 `30a09add1e2e626a74c697da3aa78c2400c4122c21353bd0ed824bd4aa58b4ee` and is 2,897,500 bytes.

## Container format and indexes

The uploaded `data.json` is not a bare JSON document. It is a one-line JavaScript assignment in the exact form `coedata={...};`. The converter removes that fixed wrapper and parses the enclosed object with `JSON.parse`; it never evaluates the file.

Most sections use this pattern:

- `entries`: the records.
- `index`: a stable ID to **array-position** map. It is not an ID-to-record map.
- `dictionary`: where present, a game metadata key to stable ID map.

For example, a modifier with ID `4592` is resolved as `mods.entries[mods.index[4592]]`. Treating `mods.index[4592]` as the modifier itself would be incorrect.

The root keys are `categories`, `classes`, `items`, `mods`, `modgroups`, `classmods`, `tags`, `families`, `essences`, `socketables`, `enums`, `keywords`, `beasts`, `stats`, `methods`, `skills`, and `emotions`.

## Field mapping

| Simulator concept | Source location and observed meaning |
|---|---|
| Base ID and name | `items.entries[].id` is the stable numeric ID, `key` is the game metadata key, and `wiki` is the available English base/item name. Numeric `label` values point to a localization table that is not included in this export. |
| Item class | `items.entries[].class` points to `classes.entries[].id`; `classes.entries[].class` indexes `enums.classes`. |
| Equipment slot/category | `classes.entries[].category` indexes `enums.categories`; `group` is the broader crafting group. |
| Base tags | `items.entries[].tags[]` contains tag IDs resolved through `tags.index` / `tags.entries`. |
| Requirements and defences | `items.entries[].reqs` contains requirements. `props` contains available base properties, including defence/weapon/flask values. |
| Socket restrictions | `items.entries[].sockets` stores the base socket count/cap datum available in the export. `methods.socketables.types` and `.limits` describe socketable types and global limits. |
| Prefix or suffix | `mods.entries[].group` resolves to a `modgroups` record. `modgroups.type` resolves through `enums.types`; values `1` and `2` are `PREFIX` and `SUFFIX`. |
| Modifier ID and group | `mods.entries[].id` / `key` are stable modifier identities. `group` is the stable modifier-group ID. `modgroups.families[]` resolves to conflict-family keys in `families.entries`. |
| Tier and level | `mods.entries[].minlvl` and `maxlvl` are the required/minimum and maximum levels. The export has no explicit tier number; the normalizer derives a deterministic tier rank within a modifier group and marks it as derived. |
| Stats and ranges | `mods.entries[].stats[]` contains a stable stat index and value range. `stats[statIndex].id` is the stat identity. Human-readable modifier templates are not present. |
| Spawn weights | `classmods[classDefinitionId][modifierId]` is the class-specific spawn weight. A modifier can therefore have more than one applicable class/weight pair; there is no universally correct single global weight. |
| Weight conditions | `modgroups.gtags[]` and `gvals[]` are parallel ordered tag/weight arrays. Every observed pair of arrays in this upload is empty. The converter still preserves any future pairs as `weightConditions`; zero-weight conditions would also be exposed as `forbiddenTags`, while positive conditions are not mislabeled as mandatory tags. |
| Modifier tags | `modgroups.tags[]` are resolved modifier tags. `adds[]` are tags added by the modifier. |
| Base applicability | `classmods` maps normal modifiers to class definitions. `essences.classmods`, `essences.basemods`, and `essences.byessences` add essence-specific class/base mappings. |
| Implicits/enchantments | Base implicit modifier IDs are in `items.entries[].implicits`. Modifier generation type `ENCHANTMENT` is `enums.types[10]`. |
| Corruption | `classes.entries[].corrupt`, base flags, the `poe2_vaal` method, and modifier generation type `CORRUPTED` (`enums.types[5]`) are present. Exact Vaal outcome probabilities are not encoded. |
| Crafting methods | `methods.crafting[]` is a nested method tree with `handler`, `item`, `constraints`, `omens`, and `properties`. Greater/Perfect modifier-level floors are encoded as `properties: [{ key: "min_mod_level", value: ... }]`. |
| Omens | `methods.omens.entries[]` maps an Omen item ID to an action such as `OmenOnChaosLowestLevelMod`. The export identifies Omen of Whittling as the Chaos action that targets the lowest-level modifier. |
| Essences | `essences.entries[]` identifies essence tier/type and item ID. `byessences[essenceId]` maps enum item-class IDs to guaranteed modifier IDs; `classmods` and `basemods` provide additional mappings. |
| Desecrated modifiers | The Desecrate method and bone constraints are in `methods.crafting`. Its special modifier records use stable `AbyssMod...` keys and the `AbyssJewelMod` family convention, and appear in applicable `classmods` pools. The export does not include human-readable reveal text or a complete Well-of-Souls selection procedure. |
| Catalysts/quality | Catalyst items are identifiable by `catalyst` / `jewel_catalyst` and typed catalyst tags. Quality currency handlers and eligibility constraint names exist in `methods.crafting`; a complete mutable quality-state model and scaling procedure do not. |
| Sockets/Augments | `socketables.entries[]` contains Rune/Soul Core/Idol effects for martial, armour, caster, global, and class-specific cases. This is effect data, not a complete socket-state mutation procedure. |
| Distilled Emotions | `emotions.items` maps emotion item IDs to class/modifier choices and `emotions.basemods` maps supported bases. Complete instilling recipes and passive allocation behaviour are not encoded. |
| Runeforging/Genesis/Sacrifice | Relevant items/tags and some modifier records exist, but the export does not provide a self-contained recipe/state-transition specification for these systems. |

## Normalized outputs

`tools/convert-coe-data.mjs` writes compact repository-owned source data under `data/normalized/`:

- `base-items.json`: only simulator-supported base classes, concrete bases, tags, requirements, properties, socket fields, and class modifier-pool mappings.
- `modifiers.json`: only modifiers reachable from those classes or the retained special crafting mappings, with stable IDs, group/family identity, derived tier, levels, class weights, tags, conditions, stat ranges, and special flags.
- `crafting-items.json`: normalized crafting-method metadata, verified Omen actions, referenced crafting items, catalyst inventory, socketable effects/limits, and emotion mappings.
- `essences.json`: normalized essence definitions and guaranteed modifier mappings.
- `version-manifest.json`: source hash, observed schema, output counts, and explicit data limitations. The source does not embed a game version, so the manifest does not pretend that it does.

`tools/build-normalized-data.mjs` compiles those JSON files into `data/normalized.data.js` as `window.COE_NORMALIZED_DATA`, preserving direct `file://` use without `fetch()`.

Repository-owned provenance is recorded in `data/source-cache/provenance.json`. The legacy raw upload is not present, so default validation verifies the normalized payload hashes, references, manifest, coverage, and browser bundle without pretending to re-run the missing conversion. `data-validation.mjs --source <path>` enables an explicit raw-to-normalized comparison when the exact export is available. Refresh candidates and the non-promoting staging workflow are documented in `docs/data-pipeline.md`.

## Runtime crafting-control path

Every crafting card follows one identity path:

`data-craft-id` in HTML → central `CRAFTING_ITEM_REGISTRY` lookup → named eligibility validator → named direct/specialized handler → `CraftingEngine` mutation → pre-action state snapshot → crafting-history record and Undo stack → `renderItem()`.

The stable crafting ID selects behaviour. `data-icon-id` only selects `assets/icons/<icon-id>.png` and never changes support or eligibility.

| Controls | Validator | Engine/specialized handler | History behaviour |
|---|---|---|---|
| Transmutation, Augmentation, Alchemy, Regal, Exalted, Chaos, Annulment, Divine, Fracturing, Vaal and Greater/Perfect variants | `currencyDisabledReason` | Corresponding `CraftingEngine.apply*` method | Snapshot before dispatch; successful actions push Undo, clear Redo, increment the stable currency counter, and rerender. |
| Hinekora's Lock | `currencyDisabledReason` | `applyHinekoraLock` plus sealed foresight flow | Lock and the exact committed foresight are snapshotted and reversible. |
| Preserved Cranium | `boneDisabledReason` | `startDesecrationFlow` / Well of Souls / `CraftingEngine.startDesecration` | Pending reveal state and armed Desecration Omens are included in snapshots. |
| Essence of the Abyss | `essenceDisabledReason` | `CraftingEngine.applyEssenceOfAbyss` | Guaranteed Mark, removal, counters, history, Undo and Redo use the common successful-craft path. |
| Crafting and Desecration Omens | Omen-specific validator | Arm first; the matching later action passes the engine Omen ID | Failed matching actions keep the Omen. Only a successful matching action consumes and counts it. |
| Disabled cards | Registry `supported: false` | No dispatch | Cannot mutate item state and report `Unsupported — verification required`. |

## Verified limits used by the implementation

- The source confirms modifier-level floors of 44/70 for Greater/Perfect Transmutation and Augmentation, and 35/50 for Greater/Perfect Regal, Exalted, and Chaos.
- The source confirms Omen of Whittling is `OmenOnChaosLowestLevelMod`; it affects the removal target, not replacement weights.
- Chaos is treated atomically: if no eligible replacement remains after level, capacity, conflict, protection, zero-weight, tag, and weight filtering, the removal is rolled back and the action fails. A failed action does not consume Whittling.
- Missing modifier text/localization, absent exact Vaal probabilities, and missing complete state-transition rules prevent the imported data alone from safely enabling Quality, Socketing/Augments, standard Essences, Catalysts, Genesis, Delirium/Instilling, Runeforging, or Sacrifice.
