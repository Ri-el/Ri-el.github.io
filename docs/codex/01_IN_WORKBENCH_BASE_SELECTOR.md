# Task 01 — Concrete Base Selector Inside the Workbench

## Scope

Implement concrete Amulet selection inside the existing crafting workbench.

Do not implement a new outer selection screen.

Do not begin broad currency expansion in this task.

## Critical behavior

The correct flow is:

1. User clicks `Amulets` on the existing category screen.
2. The Amulet crafting workbench opens immediately.
3. A selector inside the workbench lets the user choose the concrete Amulet base.
4. The selected base is reflected in the tooltip and item state.
5. The user can change Amulet bases without returning to Item Categories.

The current outer category screen must remain intact.

## Required investigation

Before editing, inspect:

- `select.js`
- `app.js`
- `crafting.js`
- `index.html`
- `header-fix.css`
- `overhaul.css`
- `style.css`
- normalized base-item data
- `window.COE_NORMALIZED_DATA`
- the existing `basesById` and `basesByItemClass` indexes
- the current `workbench-base-selector`
- current save, undo, redo, and reset behavior
- current Jewel selector behavior

Identify the existing bridge:

```text
outer class selection
→ CraftForge.loadBase()
→ workbench
→ CraftingEngine
→ tooltip
```

Preserve it.

## In-workbench selector requirements

The workbench header should continue to resemble:

```text
CRAFTING WORKBENCH      [selected base]      READY
```

For Amulets, the center control should represent the concrete base:

```text
CRAFTING WORKBENCH      [Crimson Amulet ▼]      READY
```

The selector may use a dropdown, popover, modal, or drawer, but it must remain part of the crafting interface.

Display for each base where data exists:

- icon
- base name
- required level
- implicit modifier
- inherent skill
- useful special base property
- selected state

Support:

- search by base name
- reset search/filter
- keyboard navigation
- Escape to close
- mobile layout
- empty result state
- graceful data-error state
- icon fallback

Use normalized data. Do not hard-code the complete Amulet list in `select.js`.

## Concrete Amulet coverage

The selector should include every valid normalized Amulet base for the selected target version, including examples such as:

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

Do not invent missing records.

## State separation

Track these separately:

- item class: Amulets
- simulator modifier pool: `amulets`
- concrete base ID
- concrete base display name

Selecting a concrete Amulet must not replace the simulator modifier pool with the base display name.

## Default base

When entering the Amulet workbench:

- select a deterministic sensible default concrete Amulet
- clearly display it
- do not show a generic item named only `Amulet`

If a legacy path enters the workbench without a concrete base, resolve it deterministically.

## Switching bases

### Untouched item

If the current item has not been crafted:

- switch immediately
- update concrete base ID
- update display name
- update required level
- update implicits
- update base properties
- update tags
- update socket limits if represented
- keep the selected item level
- keep the simulator modifier pool when the new base maps to the same pool

### Crafted item

Changing the concrete base must not silently destroy or transfer crafted state.

Treat the item as crafted when any relevant state differs from a fresh base, including:

- non-Normal rarity
- explicit modifiers
- changed quality
- sockets or socketed content
- corruption
- fracture
- sanctification
- enchantments
- Abyss/Desecrate state
- other irreversible or special state

Show confirmation:

- `Cancel`
- `Change Base and Reset Item`

If cancelled:

- preserve the item exactly

If confirmed:

- reset to a fresh item on the selected concrete base
- preserve only settings that are safe and intended, such as item level if current behavior expects it
- do not transfer incompatible explicits, sockets, implicits, or special state

## Tooltip requirements

Display:

- generated item name when applicable
- concrete base name
- item class
- required level where applicable
- item level
- base properties
- implicit modifiers
- enchantments
- explicit modifiers
- quality
- special state

For a fresh Crimson Amulet, the tooltip must show `Crimson Amulet`, not only `Amulet`.

Fix the current incorrect Jewel-only flavor text:

```text
Place into an allocated Jewel Socket on the Passive Skill Tree...
```

That text must not appear on Amulets.

Do not add invented flavor text. Hide the block when no valid class-specific text exists.

## Jewel preservation

Do not break:

- Ruby Jewel
- Sapphire Jewel
- Emerald Jewel
- existing Jewel selector placement
- Jewel-specific text
- Jewel modifier pools

Task 01 should not broadly redesign Jewel selection.

## Tests

Add or update tests proving:

- clicking Amulets still opens the workbench immediately
- no intermediate full-screen concrete-base page appears
- an Amulet concrete-base selector exists inside the workbench
- the selector is populated from normalized data
- selecting Crimson Amulet updates the displayed base
- selecting another Amulet updates the displayed base
- required level updates
- implicit updates
- simulator pool remains `amulets`
- item level is not confused with required level
- switching an untouched base is immediate
- switching a crafted base asks for confirmation
- cancelling preserves the crafted item
- confirming resets the item
- Jewel-only text is absent for Amulets
- Jewel behavior remains intact
- keyboard and mobile contracts are not broken

## Documentation

Record:

- where normalized concrete Amulet data comes from
- how concrete base IDs map to the `amulets` simulator pool
- how a fresh item is detected
- how reset confirmation works
- known missing Amulet fields

## Completion report

Report:

- branch
- pre-existing changes found
- files changed
- selector design
- normalized Amulet count
- default base
- switching/reset behavior
- tests run
- results
- direct `file://` verification
- blockers
- next task

Do not push.

Do not begin task 02 until task 01 is complete and tested.
