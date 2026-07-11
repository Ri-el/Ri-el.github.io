# Task 04 — Core Currency and Quality Systems

## Goal

Verify existing core crafting behavior against the selected target version, fix supported mechanics where evidence is available, and implement verified quality currency.

Do not fabricate unknown formulas.

## Core currency audit

Verify applicable behavior for:

- Orb of Transmutation
- Greater Orb of Transmutation
- Perfect Orb of Transmutation
- Orb of Augmentation
- Greater Orb of Augmentation
- Perfect Orb of Augmentation
- Orb of Alchemy
- Regal Orb
- Greater Regal Orb
- Perfect Regal Orb
- Exalted Orb
- Greater Exalted Orb
- Perfect Exalted Orb
- Chaos Orb
- Greater Chaos Orb
- Perfect Chaos Orb
- Orb of Annulment
- Divine Orb
- Fracturing Orb
- Hinekora's Lock
- Vaal Orb
- other core equipment-affecting currency in the target version

Verify:

- rarity requirements
- prefix/suffix caps
- minimum modifier-level rules
- item-level gates
- spawn weights
- modifier-group conflicts
- fractured-mod behavior
- corrupted-item restrictions
- no-effect conditions
- Omen interaction
- Hinekora preview equality
- numeric reroll behavior

## RNG

Random operations must support injected deterministic RNG.

Do not introduce uncontrolled `Math.random()` paths in engine operations.

Hinekora's Lock must preview exactly the result later committed.

## Quality state

Quality must be represented structurally:

- amount
- type
- source
- cap

Normal physical quality, Catalyst quality, and other alternate quality types must not be conflated.

## Quality currency

Implement verified behavior for applicable items including:

- Armourer's Scrap
- Blacksmith's Whetstone
- Arcanist's Etcher
- Glassblower's Bauble
- special quality Infusers
- current advanced quality items

For each item verify:

- valid target class
- exact increment formula
- rarity-dependent behavior
- maximum quality
- quality type
- replacement rules
- corrupted-item restriction
- interaction with sockets
- interaction with Catalysts
- tooltip rendering
- save/load
- undo/redo

If the repository currently marks a formula as blocked, resolve it only from documented evidence.

Do not enable a quality operation solely because the item description is present.

## Vaal and corruption scope

Only verify existing core Vaal behavior in this task.

Leave specialized Temple/Atziri sacrifice systems for task 07 unless an existing core regression requires shared infrastructure.

## Tests

Add deterministic tests for:

- rarity transitions
- modifier caps
- tier eligibility
- group conflicts
- Greater/Perfect minimum modifier levels
- fractured-mod protection
- Annul behavior
- Divine numeric rerolls
- Hinekora preview equality
- corruption restrictions
- quality increments
- quality caps
- quality type replacement
- invalid target classes
- undo/redo
- save/load
- concrete base implicits surviving normal affix currency

Update fuzz invariants where necessary.

Do not silently update a fixed-seed digest without documenting the intentional behavioral change.

## Completion report

Report:

- mechanics verified
- corrections made
- quality items implemented
- unresolved formulas
- parity counts
- tests
- fuzz results
- next task

Do not push.
