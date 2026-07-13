# Oishy Crafting Forge — Master Roadmap

## Product goal

Expand Oishy Crafting Forge from an item-class modifier-pool simulator into a reliable Path of Exile 2 equipment-crafting simulator while preserving its current local, static, offline-friendly architecture.

The two major goals are:

1. Allow the user to choose a concrete in-game base item from inside the crafting workbench.
2. Audit and implement all relevant equipment-affecting crafting items for one explicit target game version.

## Non-negotiable UX

The existing outer item-class selection flow remains.

Correct flow:

1. User clicks an item class such as `Amulets`.
2. The Amulet workbench opens immediately.
3. A concrete-base selector inside the workbench lets the user choose:
   - Crimson Amulet
   - Azure Amulet
   - Amber Amulet
   - Jade Amulet
   - Lapis Amulet
   - Lunar Amulet
   - Bloodstone Amulet
   - Stellar Amulet
   - Solar Amulet
   - Gold Amulet
   - Pearlescent Amulet
   - Veridical Chain
   - Runemastered Veridical Chain variants
   - Lament Amulet
   - every other valid normalized Amulet base
4. The user can switch Amulet bases without returning to Item Categories.

Do not add an intermediate full-screen concrete-base page.

## Concept separation

The implementation must keep these concepts distinct:

### Item class

Examples:

- Amulets
- Rings
- Bows
- Body Armours

### Simulator modifier pool

Examples:

- `amulets`
- `rings`
- `bows`
- `body_armours_str`
- `body_armours_str_dex`

### Concrete base item

Examples:

- Crimson Amulet
- Gold Amulet
- a specific Bow base
- a specific Body Armour base

An attribute family is not a concrete base.

## Target architecture

### Concrete-base layer

Concrete bases should come from normalized data and map to one simulator modifier pool.

Each record should support applicable fields such as:

- stable ID
- source ID
- metadata key
- display name
- item class
- simulator pool ID
- required level
- base/drop level
- tags
- implicit modifiers
- inherent skill
- attribute family
- armour/evasion/energy shield/runic ward
- physical and elemental base damage
- attack time or attacks per second
- critical strike chance
- spirit
- charm slots
- flask properties
- maximum/default sockets
- icon reference
- source version
- provenance
- verification state

### Generic item state

The engine should be capable of representing:

- concrete base identity
- simulator modifier pool
- item class
- item level
- required level
- rarity
- generated item name
- base properties
- implicits
- explicit modifiers
- enchantments
- quality amount/type/source/cap
- sockets
- Runes
- Soul Cores
- corruption
- sanctification
- fractured modifiers
- Desecrate/Abyss state
- Omen state
- Hinekora state
- save schema version
- history

### Crafting registry

Create one authoritative crafting-item registry with:

- stable craft ID
- source item ID
- metadata key
- exact display name
- category/tab
- icon
- target version
- applicability
- disabled reason
- operation handler
- triggering action
- Omen interaction
- corruption rules
- valid item classes/tags
- quality rules
- socket rules
- source evidence
- verification state
- test fixtures

The UI should be generated from this registry instead of duplicating currency definitions across HTML and JavaScript.

## Crafting systems in scope

Audit every item in `data/crafting/currency-index.json`.

Relevant systems include:

- core currency
- Greater and Perfect currency variants
- quality currency
- Breach Catalysts
- Ritual Omens
- Abyss Omens
- Abyssal Bones
- Abyssal Eyes and related items
- regular and special Essences
- Abyss Essences
- Breach Essences
- Expedition Resistance Fluxes
- Expedition Alloys
- socketing currency
- Runes
- Soul Cores
- Delirium/Instilling
- Runeforging
- corruption currency
- sacrifice currency
- Atziri/Temple/Vaal crafting
- Infusers
- extraction items

Every retained crafting item must be classified as one of:

- implemented
- conditional
- non-item currency
- blocked_missing_data
- probability_unverified
- intentionally_out_of_scope
- deprecated_for_target_version

## Version and provenance

Choose one explicit target Path of Exile 2 version.

Do not silently mix versions.

Prefer:

1. checked-in normalized data
2. repository source-cache and provenance
3. Craft of Exile integration
4. configured RePoE-fork data
5. official Grinding Gear Games sources
6. other structured sources only when documented and approved

Unknown mechanics must receive specific blockers, not fabricated behavior.

## Delivery sequence

1. In-workbench Amulet base selector
2. Generic concrete-base selector for every class
3. Concrete-base data and generic item state
4. Authoritative crafting registry and generated UI
5. Core and quality currency
6. Abyss, Breach, Essences, and Omens
7. Sockets, Runes, and Soul Cores
8. Expedition and Temple/Atziri/Vaal systems
9. Final parity report and full validation

Current local checkpoint: numbered Tasks 01–03 are implemented and tested. Task 03 preserves the existing 37-control surface while generating it from a 531-definition authoritative registry; no unverified mechanic was enabled. The next numbered task is Task 04, Core and Quality Currency.

Task 04 is implemented and tested. The registry still has 531 definitions and now surfaces 45 visible cards (37 runtime controls plus eight disabled quality audit cards). Core rarity/mirror restrictions are corrected, structured quality includes a cap, and Vaal remains blocked pending verified target-version outcomes. The next numbered task is Task 05, Abyss, Breach, Essences, and Omens.

Task 05 is implemented and tested at a verified boundary. The runtime keeps the existing Preserved Cranium/Well of Souls flow, adds source-backed Jewel and Essence of the Abyss applicability gates, rejects unknown Bones and conflicting directional Omens atomically, fixes Omen of Light consumption on successful Annulment (including Hinekora foresight), and uses the engine's verified reroll count in the UI. The other Abyssal Bones, regular and Breach Essences, Catalysts, and target-version Desecrated pool/Well weighting remain explicitly blocked where the checked-in 0.5.4 evidence is incomplete. The next numbered task is Task 06, Sockets, Runes, and Soul Cores.

Task 06 is implemented and tested as an evidence-boundary slice. The item now carries deterministic empty/preserved-unverified socket state with typed contiguous slots, atomic malformed-state rejection, save/load and base-reset preservation, and a dedicated tooltip section. No Artificer's Orb, socket insertion, Rune, Soul Core, replacement, or extraction mutation is enabled: the checked-in source has no verified default/maximum socket semantics, target-version effects/localization, class limits, corruption behavior, or extraction procedure. The next numbered task is Task 07, Expedition and Temple/Atziri/Vaal systems.

Each task must end with:

- relevant tests passing
- direct `file://` verification
- documentation updated
- a clear progress report
- no push
