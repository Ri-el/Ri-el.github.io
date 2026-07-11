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

`data/bases/amulets.json` remains the class-level explicit-modifier pool. Concrete records come from `data/normalized/base-items.json`, are bundled into `window.COE_NORMALIZED_DATA`, and are resolved only through `simulatorBaseMap.amulets.concreteBaseIds` plus the runtime `basesById` index.

## Coverage and default

The normalized `amulets` mapping contains 25 concrete records. The mapping is emitted in stable numeric-ID order; the deterministic default is the first mapped record, ID `2546` (`Crimson Amulet`). Three Runemastered Veridical Chain variants share a display name, so selection, state, and persistence always use the stable numeric ID rather than the name.

## Item state

When a normalized concrete base is active, the engine item snapshot records:

- `schemaVersion`
- `baseItemId`
- `baseMetadataKey`
- `simulatorPoolId`
- normalized singular `itemClass`
- concrete `baseName`
- `requiredLevel`
- `dropLevel`
- `baseTags`
- `baseProperties`
- structured `implicits`
- `baseSocketCount`
- target-version and verification metadata

Implicits remain separate from enchantments, prefixes, and suffixes. Normal affix operations therefore do not remove or reroll the base implicit snapshot.

## Source-accuracy limits

All 25 Amulet records have stable IDs, metadata keys, display names, class mappings, tags, socket count, drop level, and implicit modifier IDs. None has a verified `requiredLevel`, icon, inherent skill, or base-property payload. The normalized modifier records contain implicit stat identifiers and ranges, but the source export has no localization templates.

The UI consequently:

- reports Required Level as unavailable;
- displays Drop Level separately and never substitutes it for Required Level;
- renders sourced implicit stat identifiers/ranges without inventing in-game wording;
- uses a monogram when an icon is absent;
- exposes the source ID when duplicate display names need disambiguation.

## Switching and reset confirmation

A fresh item is Normal rarity with no explicit modifiers, enchantments, quality change, sockets/socketed content, corruption, sanctification, mirroring, fracture state, Hinekora lock, Desecrate/Abyss state, recorded currency use, or other special flags. Item level and concrete identity do not make an item crafted.

Switching a fresh Amulet is immediate. Switching a crafted Amulet first returns a non-mutating confirmation request. `Cancel` performs no state-changing call. `Change Base and Reset Item` creates a fresh item on the selected concrete base, preserves item level, and clears incompatible Omen, Desecrate, foresight, modifier, quality, socket, and special state.

Every confirmed switch creates one history snapshot. Undo/redo restores the concrete-base template before restoring the item. Stash saves retain normalized item class and concrete ID while storing the outer category label separately. A legacy Amulet save without a concrete ID deterministically migrates to the default compatible Amulet instead of crashing.

## UI and offline contract

The workbench header contains one concrete-base trigger. Its body-level dialog avoids clipping inside the workbench panel and supports name/implicit search, reset, selected state, duplicate-name identity, empty/error states, icon fallback, arrow/Home/End navigation, Enter activation, Escape dismissal, and a mobile bottom-sheet layout.

The runtime remains classic deferred HTML/CSS/JavaScript with no fetch requirement. The versioned `header-fix.css` asset is included in the service-worker shell. Direct `file://` navigation is source-contract tested; interactive `file://` browser verification remains explicitly blocked in the Codex browser by its local-file URL policy at this checkpoint.

Task 02 will generalize the same normalized selector/state path to every supported simulator pool. It must reuse this separation rather than reintroducing attribute families as concrete bases.
