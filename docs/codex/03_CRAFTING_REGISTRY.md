# Task 03 — Authoritative Crafting Registry and Generated Inventory

## Goal

Replace duplicated crafting-item definitions with one authoritative registry and render the crafting inventory from data.

Do not broadly change crafting behavior in this task except where required to preserve existing operations under the new registry.

## Prerequisites

Tasks 01 and 02 must be complete and tested.

The item state must already distinguish concrete base identity from simulator pool identity.

## Current problem to audit

Inspect duplication between:

- `index.html`
- `app.js`
- `crafting.js`
- `data/crafting/currency-index.json`
- `data/crafting/currency-index.data.js`
- CSS IDs/classes
- tab markup
- handler maps
- Omen definitions

Identify every place where presentation markup controls behavior.

## Authoritative definition

Each crafting-item definition should support:

- stable craft ID
- source item ID
- metadata key
- exact display name
- category
- tab
- icon ID
- target game version
- description
- action type
- engine action
- applicability predicate
- disabled-reason function
- operation handler
- triggering action
- Omen interaction
- corruption restrictions
- valid item classes
- valid item tags
- quality restrictions
- socket restrictions
- source evidence
- implementation status
- verification status
- test fixture IDs

Avoid storing executable functions in JSON if that harms `file://` compatibility. A data record may reference stable validator and handler names implemented in JavaScript.

## Generated UI

HTML should contain structural containers.

Generate:

- crafting tabs
- item buttons
- labels
- icons
- supported/unsupported state
- descriptions
- Omen trigger hints
- exact disabled reasons

Preserve the existing visual design.

Support:

- crafting-item search
- category filtering
- optional `Applicable only`
- keyboard navigation
- hover and focus descriptions
- mobile layout
- icon fallback
- custom currency cursor
- Escape/right-click cancellation
- accessible non-pointer use

## Central operation pipeline

Route all operations through a consistent sequence:

1. resolve definition
2. validate target
3. calculate disabled reason
4. snapshot state
5. resolve active Omen or conditional effect
6. determine eligible outcomes
7. use injectable RNG
8. mutate item
9. consume applicable Omen
10. record history
11. update undo/redo
12. render

Do not allow button-specific event handlers to bypass central validation.

## Exact disabled reasons

Return precise reasons such as:

- Requires a Normal item
- Requires a Magic item
- Requires a Rare item
- Maximum prefixes reached
- Maximum suffixes reached
- No removable explicit modifiers
- Fractured modifiers cannot be removed
- Cannot be applied to a corrupted item
- Requires a Weapon
- Requires Armour
- Requires Jewellery
- Requires an Abyssal Jewel
- Requires an empty socket
- Maximum quality reached
- Incompatible quality type
- No eligible modifier at this item level
- Active Omen does not trigger from this operation
- Base does not support sockets
- Mechanic blocked because exact target-version behavior is not verified

Avoid a generic unsupported message when a precise reason is known.

## Inventory audit

Use `data/crafting/currency-index.json` as the retained inventory.

Create or update:

```text
reports/crafting-parity.json
docs/crafting-parity.md
```

Each item must record:

- exact name
- craft ID
- metadata key
- source item ID
- target version
- equipment relevance
- category
- implementation status
- verification status
- applicability
- handler
- test reference
- source evidence
- blocker

Classify each item as:

- implemented
- conditional
- non_item_currency
- blocked_missing_data
- probability_unverified
- intentionally_out_of_scope
- deprecated_for_target_version

## Compatibility

Preserve all currently implemented operations.

Do not silently change existing crafting rules merely while moving definitions.

Any intentional rule correction must be documented and tested separately.

## Tests

Add tests proving:

- every rendered button resolves to exactly one registry entry
- no duplicate craft IDs
- no duplicate metadata mappings where uniqueness is expected
- every supported entry has a validator and handler
- every unsupported entry has a specific reason
- generated tabs match registry categories
- all current operations still work
- Omen trigger references resolve
- custom cursor resolves icons through registry
- keyboard activation uses the same pipeline
- invalid operations do not mutate state
- invalid operations do not consume Omens
- direct `file://` loading still works

## Completion report

Report:

- registry entry count
- categories
- rendered item count
- implemented/blocked/non-item counts
- duplicated definitions removed
- tests
- regressions found
- next task

Do not push.
