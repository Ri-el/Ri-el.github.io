# Concrete base architecture

Target game version: **Path of Exile 2 0.5.4**.

The retained source export does not embed a game version. The repository therefore treats 0.5.4 as the explicit target while keeping the source-version limitation visible per `data/normalized/version-manifest.json`; it does not silently certify every retained base as 0.5.4-valid.

## Task 01 scope

Task 01 adds concrete **Amulet** selection inside the existing crafting workbench. The outer screen continues to choose only an item class and opens the workbench immediately. No full-screen concrete-base step was added.

The runtime identities remain separate:

| Concept | Crimson example |
|---|---|
| Outer item class | `Amulets` |
| Normalized item class | `Amulet` |
| Simulator modifier pool | `amulets` |
| Concrete base ID | `2546` |
| Concrete display name | `Crimson Amulet` |

`data/bases/amulets.json` remains the class-level explicit-modifier pool. Concrete records come from `data/normalized/base-items.json`. The complete normalized audit bundle remains checked in, while the browser loads the generated `window.COE_RUNTIME_DATA` projection and resolves Amulets only through `simulatorBaseMap.amulets.concreteBaseIds` plus the runtime `basesById` index.

## Task 02 generic coverage

Task 02 reuses the Task 01 component for all 31 item classes already present on the outer screen. The outer card still enters the workbench directly. Within that workbench, the selector flattens every populated compatible simulator pool for the selected class; changing an armour attribute family can therefore rebuild the engine for its exact pool without treating a pool ID such as `body_armours_str_dex` as a concrete item.

The normalized inventory contains 1,760 concrete records and 65 mappings. Of those, 1,743 records map to the 56 populated compiled pools represented by the outer screen. Two mapped Gloves are explicitly unmodifiable and remain visible but disabled, leaving 1,741 craft-selectable bases. The 17 remaining records are explicit blockers: 11 all-attribute armour/shield records have normalized mappings but no compiled engine pools, five Diamond/Time-Lost Jewel mappings have empty compiled pools, and Timeless Jewel ID `613` has no simulator mapping. No retained ID maps ambiguously.

Mappings and defaults are ID-based. The deterministic legacy/default rule is the first selectable record in the saved simulator pool's stable mapping order. For `amulets`, this remains ID `2546` (`Crimson Amulet`). Duplicate display names never participate in selection or migration.

## Item state

Task 02 item-state schema version 3 records (Task 04 migrates the runtime state to schema version 4 for the quality-cap field):

- `schemaVersion`
- `baseItemId`
- `baseSourceId`
- `baseMetadataKey`
- `simulatorPoolId`
- normalized singular `itemClass`
- source class, equipment-slot, attribute-family, and variant-family metadata
- concrete `baseName`
- `itemLevel` plus the backwards-compatible `ilvl` alias
- `generatedName`
- `requiredLevel`
- `dropLevel`
- `baseTags`
- attribute requirements
- `baseProperties`
- structured `implicits`
- structured socket/Rune/Soul Core placeholders
- the source socket-count datum, kept separate from unverified default/maximum limits
- corruption, sanctification, Hinekora, Desecrate/Omen, flags, and controller history state
- target-version and verification metadata

Quality is now persisted as `{ amount, type, source, cap }`. The verified ordinary default cap is 20; legacy alternate or above-cap quality retains an unknown cap unless the save carries an explicit valid cap.

Implicits remain separate from enchantments, prefixes, and suffixes. Normal affix operations therefore do not remove or reroll the base implicit snapshot. Concrete tags are merged into the engine's eligibility tags. Fixed sourced `local_maximum_prefixes_allowed_+` and `local_maximum_suffixes_allowed_+` implicit deltas adjust the engine limits; other base-specific effects remain presentation-only until their transition rules are verified.

## Source-accuracy limits

All retained records have stable IDs, metadata keys, display names, class mappings, tags, a source socket-count datum, drop level, and implicit modifier IDs. None has a verified `requiredLevel` or per-base icon. Maximum/default socket semantics, some inherent skills/properties, and localized implicit templates are not retained. The normalized modifier records contain implicit stat identifiers and ranges, but the source export has no localization templates.

The UI consequently:

- reports Required Level as unavailable;
- displays Drop Level separately and never substitutes it for Required Level;
- disables the required-level filter with that explicit blocker while keeping a distinct Drop Level filter;
- renders sourced implicit stat identifiers/ranges without inventing in-game wording;
- uses a monogram when an icon is absent;
- exposes the source ID when duplicate display names need disambiguation.

## Switching and reset confirmation

A fresh item is Normal rarity with no explicit modifiers, enchantments, quality change, sockets/socketed content, corruption, sanctification, mirroring, fracture state, Hinekora lock, Desecrate/Abyss state, recorded currency use, or other special flags. Item level and concrete identity do not make an item crafted.

Switching any fresh item is immediate. Switching a crafted item first returns a non-mutating confirmation request, including Ruby/Sapphire/Emerald Jewel changes. `Cancel` performs no state-changing call. `Change Base and Reset Item` creates a fresh item on the selected concrete base, preserves item level, and clears incompatible Omen, Desecrate, foresight, modifier, quality, socket, and special state.

Every confirmed switch creates one history snapshot. Cross-pool undo/redo reconstructs the matching engine and concrete template before loading the item. Hinekora previews clone the full concrete identity. Stash saves retain the normalized concrete ID, exact simulator pool, and outer category label. A legacy save without a concrete ID deterministically migrates to the first selectable base in its saved pool. Unknown IDs, pool/ID mismatches, newer schemas, target-version mismatches, and empty/unsupported pools show compatibility errors without changing the live item. Legacy numeric socket state is preserved as unverified migration metadata; no socket records or effects are fabricated.

## UI and offline contract

The workbench header contains one generic concrete-base trigger for every non-Jewel class. Its body-level dialog avoids clipping inside the workbench panel and supports name/property/requirement/implicit search, Drop Level and attribute-family filters, reset-all, selected/disabled states, duplicate-name identity, empty/error states, icon fallback, arrow/Home/End navigation, Enter activation, Escape dismissal, and a mobile bottom-sheet layout. Attribute families are filters only. Jewels retain the existing Ruby/Sapphire/Emerald header controls.

The runtime remains classic deferred HTML/CSS/JavaScript with no fetch requirement. The versioned `header-fix.css` asset is included in the service-worker shell. Direct `file://` navigation is source-contract tested; interactive `file://` browser verification remains explicitly blocked in the Codex browser by its local-file URL policy at this checkpoint.

Task 03 now builds its authoritative crafting registry against these stable generic item and concrete-base identities without changing the outer selection flow.
