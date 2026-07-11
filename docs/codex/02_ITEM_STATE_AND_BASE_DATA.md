# Task 02 — Generic Concrete-Base Data and Item State

## Goal

Generalize the completed in-workbench Amulet selector to every supported item class and make concrete base identity a first-class part of item state.

Do not redesign the outer item-class selection screen.

## Prerequisite

Task 01 must already be implemented and tested.

Review the existing task 01 implementation before editing.

Do not rewrite it unless a failing test or clear architectural defect requires correction.

## Supported flow

For every item class:

1. User clicks the class on the outer screen.
2. The workbench opens immediately.
3. The user selects the concrete base inside the workbench.
4. The user can switch concrete bases from the same workbench.

## Concrete-base mapping

Every selectable concrete base must map to exactly one simulator modifier pool.

Examples:

```text
Concrete base: Crimson Amulet
Item class: Amulets
Simulator pool: amulets
```

```text
Concrete base: specific Strength/Dexterity Body Armour
Item class: Body Armours
Simulator pool: body_armours_str_dex
```

Do not treat `body_armours_str_dex` as a concrete base.

## Data model

Extend normalized base records only where needed.

Applicable fields include:

- stable base ID
- source ID
- metadata key
- display name
- item class
- simulator pool ID
- attribute family
- required level
- base/drop level
- tags
- implicits
- inherent skill
- armour
- evasion
- energy shield
- runic ward
- physical damage
- elemental damage
- attack time
- attacks per second
- critical strike chance
- spirit
- charm slots
- flask properties
- maximum sockets
- default sockets
- icon
- variant family
- source version
- provenance
- verification status

Keep these values distinct:

- required level
- item level
- modifier required level
- base/drop level

## Validation

Validation must fail for:

- missing stable ID
- duplicate stable ID
- missing display name
- unknown item class
- missing or ambiguous simulator-pool mapping
- malformed tags
- malformed implicit data
- invalid required level
- invalid socket limit
- malformed base property values
- unsupported version mixing

Icons should use graceful fallback rather than failing validation.

## Workbench selector generalization

Reuse one generic in-workbench component.

Required behavior:

- class-specific base list
- search
- required-level filter
- attribute-family filter where relevant
- property or implicit search where useful
- selected state
- keyboard support
- mobile support
- empty state
- data-error state
- fresh-item immediate switching
- crafted-item reset confirmation

Do not add separate implementations for every class unless class-specific rendering is genuinely required.

## Generic item state

Introduce or formalize fields conceptually similar to:

```text
schemaVersion
baseItemId
simulatorPoolId
itemClass
itemLevel
requiredLevel
rarity
generatedName
baseProperties
implicits
explicits
enchantments
quality
sockets
runes
soulCores
corrupted
sanctified
fracturedMods
desecratedState
omenState
hinekoraState
flags
history
```

Adapt this to the existing engine rather than replacing the engine wholesale.

## Invariants

- Implicits are separate from explicit modifiers.
- Enchantments are separate from implicits and explicits.
- Normal affix currency does not remove base implicits.
- Concrete base tags participate in eligibility.
- Item level controls modifier tiers.
- Base-specific restrictions are enforceable.
- Fractured state remains identifiable.
- Corrupted restrictions remain central.
- Switching bases cannot carry invalid state.
- Undo/redo snapshots include concrete base identity.
- Hinekora preview includes concrete base identity.

## Save migration

Add a versioned migration for legacy saved items.

Legacy items may lack:

- `baseItemId`
- structured implicits
- structured quality
- structured sockets

Migration must either:

- choose a deterministic compatible base and document the rule, or
- show a clear compatibility message

Never crash on old state.

## Class coverage

Generalize to every class present in repository data, including:

- Jewels
- Amulets
- Rings
- Belts
- Gloves
- Boots
- Body Armours
- Helmets
- Quivers
- Shields
- Bucklers
- Foci
- Claws
- Daggers
- Wands
- one-handed weapons
- two-handed weapons
- Flasks
- Charms
- other normalized classes

Preserve Jewel-specific behavior where needed.

## Tests

Add tests for:

- every selectable class has at least one valid concrete base or an explicit documented blocker
- every displayed base maps to one simulator pool
- changing classes still uses the outer screen
- changing concrete bases stays inside the workbench
- attribute family is not treated as a concrete base
- switching fresh items works
- switching crafted items requires confirmation
- incompatible state is reset
- implicits survive normal affix operations
- save migration works
- undo/redo includes base identity
- Hinekora preview remains deterministic
- malformed mappings fail validation

## Completion report

Report:

- classes covered
- concrete base count
- unresolved base-data gaps
- item-state schema version
- migration behavior
- files changed
- tests
- direct `file://` results
- next task

Do not push.
