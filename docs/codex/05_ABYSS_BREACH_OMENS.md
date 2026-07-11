# Task 05 — Abyss, Breach, Essences, and Omens

## Goal

Implement verified Abyss and Breach equipment-crafting systems, regular/special Essences, and current equipment-crafting Omens.

Use the authoritative crafting registry and generic item state from earlier tasks.

## Ritual Omens

Audit all current equipment-crafting Ritual Omens.

Each Omen must define:

- exact name
- stable ID
- triggering operation
- applicability
- state while armed
- compatible/incompatible Omens
- consumption rule
- interaction with invalid actions
- interaction with undo/redo
- interaction with save/load
- interaction with Hinekora
- source evidence

Required behavior:

- arming is intentional
- invalid actions do not consume the Omen
- a valid trigger consumes it exactly once
- prefix/suffix direction is clear
- incompatible combinations are rejected
- Hinekora preview includes the Omen's effect

## Abyss systems

Audit and implement applicable:

- Abyssal Bones
- Abyss Omens
- Abyssal Eyes or related Eye items
- Desecrate
- Essence of the Abyss
- Lightless modifiers
- `of the Abyss` modifiers
- reveal/reroll flows
- directional prefix/suffix behavior
- valid Omen combinations
- invalid Omen combinations
- item-level gates
- spawn weights
- target restrictions

Do not assume all Bones behave like Preserved Cranium.

Every Bone requires verified:

- target classes
- modifier pool
- operation
- prefix/suffix rules
- disabled reasons
- tests

Do not allow Abyss modifiers on invalid items.

## Breach systems

Audit and implement:

- Breach Catalysts
- Essence of the Breach
- Genesis-related equipment crafting
- other target-version Breach equipment-crafting items

Catalysts must define:

- valid item classes
- quality type
- affected modifier tags
- maximum quality
- replacement behavior
- numeric scaling
- rounding
- Divine Orb interaction
- corruption restriction
- preservation/consumption rules

Catalyst quality must remain distinct from normal quality.

## Essences

Audit and implement current regular and special Essences.

Each Essence must define:

- target rarity/state
- valid item classes
- valid item tags
- guaranteed modifier
- modifier group
- prefix or suffix
- item-level behavior
- tier behavior
- conflict handling
- fractured-mod interaction
- Omen interaction
- corruption restriction
- exact disabled reason

Include:

- regular Essences
- Essence of the Abyss
- Essence of the Breach
- other special target-version Essences

## Tests

Add deterministic tests for:

- Omen arming
- valid Omen trigger
- invalid Omen attempt
- exact consumption
- undo/redo
- save/load
- Hinekora preview with Omen
- each Abyssal Bone target restriction
- Abyss modifier eligibility
- reveal/reroll behavior
- valid and invalid Omen combinations
- Catalyst application
- Catalyst replacement
- Catalyst tag scaling and rounding
- Essence guaranteed modifier
- Essence conflict handling
- fractured preservation
- corruption restrictions
- concrete base tag applicability

## Completion report

Report:

- Omens implemented
- Bones implemented
- Abyss modifier coverage
- Catalysts implemented
- Essences implemented
- blockers
- parity changes
- tests
- next task

Do not push.
