# PoE2 Crafting Implementation Task

Repository: `Ri-el/Ri-el.github.io`  
Target game version: `0.5.4`

## Objective

Continue the crafting simulator implementation beyond merely listing items in **All known items**.

Several categories still show zero or very few implemented operations. Implement the actual mechanics where the checked-in data, PoE2DB data, official sources, or explicit user-verified behaviour provide enough evidence.

Do not stop after improving empty-state text or catalogue visibility.

## Attached research files

The user may attach:

- `poe2db-autocomplete-us.json`
- `ModsView.f39fc410dd746d3.js`
- `poe2db-network.har`

Use them only to identify structured PoE2DB data, endpoints, IDs, fields, categories, item text, modifier groups, weights, tiers, required levels, tags, restrictions, and version/filter parameters.

Prefer structured JSON responses over rendered HTML.

Do not copy PoE2DB branding, UI, layout, or frontend code into the simulator.

Do not commit third-party JavaScript bundles or HAR files into the public repository. Extract only the minimum normalized facts and provenance references required.

## Evidence policy

Use this priority:

1. Checked-in normalized export and retained item descriptions
2. PoE2DB structured data and version-specific pages
3. Official GGG patch notes and official PoE2 pages
4. Reproducible user-observed gameplay requirements
5. poe.ninja for item existence, naming, and economy membership
6. Logical inference only when exactly one reasonable transition exists

Do not use poe.ninja prices as evidence for crafting mechanics.

Classify every retained definition as:

- `verified`
- `inferred`
- `blocked`
- `deprecated`
- `non_equipment`
- `catalogue_only`

Implement `verified` mechanics.

Implement `inferred` mechanics only when one reasonable transition exists, and visibly label them `Experimental` or `Inferred`.

Use `blocked` only when multiple materially different behaviours remain possible.

Do not leave a mechanic blocked merely because an official patch note does not restate item text already present in PoE2DB or the checked-in data.

## Phase 1 — Audit before editing

Produce a category summary showing:

| Category | Known | Implemented | Inferred | Blocked | Deprecated | Non-equipment |
|---|---:|---:|---:|---:|---:|---:|
| Currency | | | | | | |
| Quality | | | | | | |
| Socketing / Augments | | | | | | |
| Ritual / Omens | | | | | | |
| Essences | | | | | | |
| Abyss | | | | | | |
| Breach / Genesis | | | | | | |
| Delirium / Instilling | | | | | | |
| Runeforging | | | | | | |
| Corruption / Sacrifice | | | | | | |

Also report:

- catalogue-only categories
- existing handlers
- discoverable but disabled mechanics
- mechanics implementable directly from retained text
- mechanics implementable using PoE2DB
- genuinely ambiguous mechanics

## Phase 2 — Implement category by category

Priority:

1. Essences
2. Abyss
3. Socketing / Augments
4. Ritual / Omens
5. Quality
6. Breach / Genesis
7. Delirium / Instilling
8. Runeforging
9. Corruption / Sacrifice

### Essences

Implement where defined:

- regular Essences
- Greater Essences
- Perfect Essences
- Abyss Essences
- Breach Essences
- forced modifier groups
- tier or minimum-modifier-level effects
- rarity restrictions
- item-class restrictions
- prefix/suffix targeting
- replacement rules
- exact history identity

### Abyss

Implement and verify:

- Preserved Cranium
- Desecration
- Well of Souls
- Abyssal Bones
- Omen of Abyssal Echoes
- directional Necromancy Omens
- Omen of Light
- unrevealed Desecrated state
- ordinary Annulment and Chaos interaction
- undo/redo
- stash save/load
- reveal-state cleanup

Preserve the existing Well performance improvements.

### Socketing / Augments

Implement where defined:

- Artificer's Orb
- socket addition
- socket limits
- socket-type restrictions
- Runes
- Soul Cores
- Idols
- other socketable augments
- replacement and removal rules
- compatibility and duplicate restrictions
- history counters
- save/load state

### Ritual / Omens

For every retained Omen with sufficient evidence, implement:

- activation
- triggering currency
- target side
- target-selection rule
- failure behaviour
- consumption timing
- Hinekora interaction
- fractured, Desecrated, corrupted, sanctified, and mirrored restrictions
- history identity

### Quality

Implement where defined:

- weapons
- armour
- jewellery
- flasks
- gems
- alternate quality
- caps
- quality-type replacement
- class restrictions

### Breach / Genesis

Investigate and implement:

- Catalysts
- Genesis-related crafting
- Breach-specific crafting
- Breach Essences
- applicable class and affix restrictions

### Delirium / Instilling

Implement where defined:

- Liquid Emotions
- instilling recipes
- recipe validation
- replacement rules
- application restrictions
- save/load persistence

### Runeforging

Implement where defined:

- Alloys
- Resistance Fluxes
- Runeforging materials
- valid equipment classes
- replacement and upgrade rules
- precise failure messages

### Corruption / Sacrifice

Implement only evidence-supported operations:

- Vaal Orb
- Vaal Infusers
- Architect or Ancient Infuser-style operations
- sacrifice
- extraction
- corruption outcomes
- sanctification
- irreversible restrictions

Do not invent unknown probabilities or destructive outcomes.

## User-verified Desecrated modifier requirement

Treat this as a user-verified project requirement for version `0.5.4`.

A Desecrated modifier, including an unrevealed Desecrated placeholder, is an ordinary removable explicit modifier unless another property specifically protects it.

### Ordinary Orb of Annulment

Ordinary Annulment selects uniformly from all removable explicit modifiers.

Examples:

- Six removable modifiers, one Desecrated:
  - Desecrated removal chance = `1/6`

- Six total modifiers, one fractured and one Desecrated:
  - fractured is excluded
  - five remain removable
  - Desecrated removal chance = `1/5`

Do not exclude a modifier merely because it is Desecrated or unrevealed.

### Omen of Light

Omen of Light does not grant removability.

It modifies Annulment selection by guaranteeing that an eligible Desecrated modifier is chosen.

### Chaos Orb

Ordinary Chaos must:

1. select randomly from all removable explicit modifiers
2. remove the selected modifier
3. add a valid replacement
4. remain atomic if no replacement is available

If Chaos removes an unrevealed Desecrated placeholder:

- clear pending Well choices
- close the Well modal
- hide the Reveal panel
- remove stale controls
- prevent old choices from being selected
- preserve undo/redo
- preserve stash save/load

Protected modifiers such as fractured modifiers remain excluded.

## Definition of implemented

A crafting item is not implemented until it has:

- stable `craftId`
- correct category
- exact display name
- engine handler
- applicability validation
- precise disabled reason
- class and rarity restrictions
- corruption/sanctification/mirroring restrictions
- modifier-group handling
- target-selection rule
- injected RNG
- consumption timing
- history by stable identity
- undo/redo support
- stash save/load support
- Hinekora interaction where applicable
- deterministic engine tests
- UI tests
- provenance
- confidence classification

Do not key history by shared engine action, icon ID, generic family, or shared handler.

Ordinary, Greater, and Perfect variants must remain separate.

## PoE2DB data extraction

Inspect the HAR and bundle to locate useful structured endpoints.

Create a research note containing:

- endpoint URL or route
- response type
- useful fields
- category coverage
- version/filter parameter
- repository schema mapping
- build-time versus runtime use

Prefer build-time normalization.

Do not add a runtime dependency on PoE2DB unless clearly justified.

Preserve:

- GitHub Pages support
- offline support
- current direct `file://` architecture

## Required reports

Generate:

- `reports/crafting-implementation-status.md`
- `reports/crafting-implementation-status.json`
- `reports/poe2db-data-sources.md`

For every retained definition include:

- `craftId`
- category
- display name
- source item ID
- implementation status
- confidence
- evidence source
- supported item classes
- rarity restrictions
- engine handler
- UI handler
- test coverage
- blocker
- exact unresolved question

## Required regression tests

### Desecrated / Annulment / Chaos

- one Desecrated among six removable modifiers = `1/6`
- one Desecrated among five removable modifiers = `1/5`
- Omen of Light guarantees Desecrated selection
- fractured modifiers are excluded
- ordinary Chaos can select a Desecrated modifier
- ordinary Chaos can select an unrevealed placeholder
- removing an unrevealed placeholder clears pending reveal state
- undo restores the exact placeholder and Well choices
- redo removes them again
- stash save/load preserves pending and resolved states
- no stale Well options remain

### Essences

- forced modifier group
- rarity conversion
- class restrictions
- Greater/Perfect behaviour
- ordinary/Greater/Perfect history separation
- deterministic seeded outcomes

### Socketing / Augments

- socket-cap enforcement
- invalid-class rejection
- Rune/Soul Core compatibility
- replacement restrictions
- save/load persistence

### Registry and categories

- implemented items appear in Available
- blocked items appear in All known items with precise reasons
- counts match registry status
- no unexplained blank category
- mouse, wheel, keyboard, and mobile tab navigation work

### Global

- undo/redo
- stash save/load
- Hinekora consistency
- service-worker cache
- direct `file://` assertions
- deterministic fuzz
- generated-data reproducibility
- provenance verification

## Performance constraints

Do not regress the Well of Souls performance fix.

Preserve:

- no full-screen backdrop blur
- no forced synchronous layout flush
- no animated CSS brightness filter
- paused background loops while open
- reduced-motion support
- stale-option cleanup

Do not add large synchronous parsing work to normal UI interactions.

Large PoE2DB-derived data should be normalized at build time or loaded lazily.

## Completion criteria

Do not claim completion merely because:

- items are visible in All known items
- empty-state text improved
- registry counts are correct
- unsupported buttons exist

Completion requires:

- actual mechanics implemented where evidence is sufficient
- genuine ambiguity documented precisely
- category implementation totals improved
- deterministic tests added
- reports generated
- full validation passing

Before the final answer, provide:

1. confirmed data sources
2. categories implemented
3. mechanics still blocked
4. exact reason for every blocker
5. test totals
6. generated reports
7. service-worker cache version
8. browser execution limitations
