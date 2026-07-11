# Testing and Acceptance Requirements

These requirements apply across all numbered Codex tasks.

## Repository checks

At a stable slice boundary, run:

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-normalized-data.mjs --check
node tools/build-currency-index.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

Run focused tests during development.

Do not hide or delete failing tests.

If a fixed-seed fuzz digest changes because of an intentional engine change:

1. explain the behavior change
2. verify invariants
3. record the new reviewed checkpoint
4. do not silently replace the expected digest

## Manual verification

After runtime changes, verify:

- opening `index.html` through `file://`
- outer category selection
- immediate workbench entry
- in-workbench concrete base selection
- switching an untouched base
- switching a crafted base
- cancellation and confirmation
- at least one Jewellery class
- at least one Armour class
- at least one Weapon class
- Jewel behavior
- Flask or Charm behavior where supported
- mobile layout
- keyboard operation
- custom cursor cancellation
- offline behavior
- service-worker cache through a local server

Update the service-worker cache version when runtime assets change.

## Concrete-base acceptance

- The outer item-class screen remains intact.
- Clicking Amulets opens the workbench immediately.
- No intermediate full-screen concrete-base page appears.
- Concrete bases are selected inside the workbench.
- The selector uses normalized data.
- The tooltip shows the actual selected concrete base.
- Required level is distinct from item level.
- Implicits are distinct from explicit modifiers.
- Non-Jewels do not show Jewel-only flavor text.
- Attribute families are not treated as concrete bases.
- Switching a crafted base requires confirmation.
- Cancelling preserves the item exactly.
- Confirming resets incompatible state.
- Concrete base identity survives undo/redo and save/load.

## Item-state invariants

- no malformed item state after an operation
- no duplicate modifier groups where forbidden
- no modifier outside valid spawn tags
- no modifier tier above item-level eligibility
- no normal currency removal of base implicits
- no removal of fractured modifiers by forbidden operations
- no quality below zero
- no quality above verified cap
- no socket count above verified limit
- no Rune in an invalid target
- no Soul Core in an invalid target
- no normal mutation of corrupted items unless explicitly allowed
- no Omen consumption after a rejected action
- no impossible rarity state
- no successful zero-effect operation unless the real mechanic permits it
- no corruption reversal unless a verified mechanic does it

## Crafting registry acceptance

- every rendered crafting control maps to one registry definition
- every stable craft ID is unique
- every supported operation has a validator and handler
- every unavailable operation has a specific reason
- invalid attempts do not mutate state
- invalid attempts do not consume Omens
- keyboard and pointer paths use the same operation pipeline
- direct `file://` loading remains functional

## Source and parity acceptance

Maintain:

```text
reports/crafting-parity.json
docs/crafting-parity.md
```

Every retained crafting item must have:

- exact name
- stable ID
- metadata key
- target version
- equipment relevance
- category
- implementation status
- verification status
- applicability
- source evidence
- test reference or blocker

Do not claim full parity while relevant blockers remain.

## Required progress report

At the end of each task, report:

- current branch
- pre-existing changes found
- files changed
- architecture decisions
- behavior implemented
- tests run
- test results
- manual verification
- parity changes
- unresolved blockers
- exact next task

Do not push unless explicitly requested.
