# Task 07 — Expedition, Temple, Atziri, Vaal, and Specialized Crafting

## Goal

Implement verified Expedition equipment-crafting items and specialized Temple/Atziri/Vaal corruption, sacrifice, Infuser, extraction, and Soul Core systems.

Do not approximate unknown outcomes.

## Expedition

Audit target-version equipment-affecting items including:

- Resistance Flux items
- Alloy items
- other item-mutating Expedition currency

For each determine:

- exact name
- stable ID
- valid item classes
- valid tags
- required state
- resistance conversion or replacement rules
- defence/property mutation
- quality interaction
- socket interaction
- corruption restriction
- deterministic or random behavior
- outcome weights
- consumption on invalid use
- exact disabled reasons
- source evidence

Do not infer mechanics from the words `Flux` or `Alloy`.

## Temple/Atziri/Vaal inventory

Audit exact spelling, IDs, version availability, and behavior for items including:

- Architect's Orb
- Crystallised Corruption
- Core Destabiliser
- Ancient Infuser
- Vaal Cultivation Orb
- Yaomac's Orb of Sacrifice
- Kopec's Orb of Sacrifice
- Kamasa's Orb of Sacrifice
- Yugul's Orb of Sacrifice
- Vaal Armourer's Infuser
- Vaal Blacksmith's Infuser
- Vaal Arcanist's Infuser
- Vaal Catalysing Infuser
- Orb of Extraction
- Vaal Siphoner

Relevant Soul Cores include:

- Guatelitzi's Thesis
- Citaqualotl's Thesis
- Jiquani's Thesis
- Quipolatl's Thesis

Verify the exact names from source data rather than relying on this list alone.

## Required behavior analysis

For every specialized operation determine:

- valid target
- required rarity
- required corruption state
- whether use corrupts the target
- sacrifice requirements
- possible outcomes
- outcome weights
- destruction/failure possibility
- preservation of existing modifiers
- implicit interaction
- enchantment interaction
- quality interaction
- socket interaction
- Rune interaction
- Soul Core interaction
- extraction behavior
- exact disabled reasons
- source evidence
- deterministic test fixtures

Do not reuse ordinary Vaal Orb behavior unless the mechanic is verified as identical.

## Delirium, Instilling, and Runeforging

If not completed earlier, audit and implement current equipment-affecting:

- Delirium crafting
- Instilling
- Runeforging

Keep map-only or non-equipment items out of equipment parity counts.

Determine whether each result is:

- an enchantment
- an implicit
- a socket effect
- a base property
- another distinct state type

Do not guess the state category.

## Tests

Add deterministic tests for:

- every implemented Expedition operation
- valid/invalid targets
- conversion/replacement behavior
- outcome weights
- corruption requirements
- sacrifice requirements
- destruction/failure outcomes
- quality interactions
- socket/Rune/Soul Core interactions
- extraction
- undo/redo
- save/load
- Hinekora interaction where applicable
- specialized operations not falling through to ordinary Vaal logic

## Completion report

Report:

- Expedition items implemented
- Temple/Atziri/Vaal items implemented
- specialized Soul Cores implemented
- unresolved probability/data blockers
- parity totals
- tests
- remaining roadmap gaps

Do not push.
