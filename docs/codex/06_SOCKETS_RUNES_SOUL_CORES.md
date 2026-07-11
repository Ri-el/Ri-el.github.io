# Task 06 — Sockets, Runes, and Soul Cores

## Goal

Implement explicit socket state and verified Rune/Soul Core crafting.

Runes and Soul Cores must not be modeled as ordinary random explicit modifiers.

## Socket state

Represent every socket explicitly.

A socket record should support:

- stable position/index
- empty or occupied state
- inserted item ID
- inserted item type
- effect
- source metadata
- replacement/removal state

The item state must support:

- maximum sockets
- current sockets
- socketed Runes
- socketed Soul Cores
- socket-specific effects

## Socket limits

Verify:

- base-specific limits
- item-class limits
- one-handed restrictions
- two-handed restrictions
- armour-slot restrictions
- Jewellery restrictions
- Jewel restrictions
- Flask/Charm restrictions
- corruption restrictions

Do not infer limits from item size or UI appearance.

## Socketing operations

Implement applicable:

- socket-adding currency
- extraction/removal currency
- socket replacement where supported
- invalid target handling
- corrupted-item behavior
- undo/redo
- save/load

A rejected operation must not mutate the item.

## Runes

Audit every current equipment-affecting Rune.

For each Rune verify:

- exact name and ID
- valid item classes
- valid socket target
- effect
- slot-dependent effect
- replacement behavior
- extraction behavior
- corruption interaction
- display order
- source version

The UI must show:

- empty sockets
- occupied sockets
- Rune name
- icon
- effect
- replacement confirmation where required

## Soul Cores

Audit every current equipment-affecting Soul Core.

For each verify:

- exact name and ID
- valid item classes
- socket requirement
- effect
- slot-dependent effect
- replacement behavior
- extraction behavior
- corruption interaction
- source version

Keep Soul Cores distinct from Runes when the game does.

## Tooltip

Show sockets and socketed effects in a dedicated section.

Do not mix socketed effects into random explicit affixes.

## Tests

Add tests for:

- socket creation
- maximum socket limit
- invalid class
- one-handed/two-handed restrictions
- empty socket rendering
- Rune insertion
- Rune replacement
- Rune invalid target
- Soul Core insertion
- Soul Core replacement
- Soul Core invalid target
- extraction/removal
- corruption restrictions
- undo/redo
- save/load
- base switching reset confirmation
- no sockets transferred to incompatible bases
- deterministic state serialization

## Completion report

Report:

- socketable classes
- socket currency implemented
- Rune count
- Soul Core count
- extraction support
- blockers
- tests
- next task

Do not push.
