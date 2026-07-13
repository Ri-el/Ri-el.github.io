# Crafting Registry Expansion + Counter and Navigation Bug Fixes

**Suggested repo path:** `docs/codex/CRAFTING_REGISTRY_EXPANSION_AND_UI_BUGS.md`

---

## Objective

Complete one combined implementation task covering:

1. Crafting-history identity and counter bugs
2. Mouse-wheel scrolling for the horizontal crafting-category strip
3. Misleading category counts and blank category panels
4. Discovery of all retained crafting definitions
5. Source-backed implementation of verified or safely inferred crafting mechanics
6. Performance, accessibility, offline, and direct `file://` preservation

Do not stop after fixing only the Chaos counter or wheel-scrolling bug.

The final Crafting Stash must make all retained crafting definitions discoverable while clearly distinguishing:

- supported and implemented
- safely inferred / experimental
- blocked due to unresolved behaviour
- deprecated for the target version

Do not fabricate mechanics merely to make every button active.

---

# 1. Evidence and Verification Policy

The simulator targets Path of Exile 2 version `0.5.4`.

Research crafting mechanics using this evidence priority:

1. Current in-game item description or exact retained item text
2. Official Grinding Gear Games patch notes and official PoE2 pages
3. PoE2DB and Craft of Exile data, cross-checked against official sources
4. Reproducible manual in-game observations supplied by the user
5. Logical inference only where the evidence permits one reasonable state transition

For every researched mechanic, record:

- stable craft identity
- exact display name
- source links or source references
- target item classes
- rarity requirements
- affix requirements
- corruption, sanctification, and mirroring restrictions
- exact mutation
- modifier-selection rule
- consumption timing
- failure conditions
- interactions with Omens
- interactions with Hinekora
- undo/redo behaviour
- save/load behaviour
- confidence classification

Use these classifications:

### `verified`

The full transition is directly supported by reliable evidence.

### `inferred`

Minor implementation glue is missing, but only one reasonable transition is possible.

An inferred mechanic must:

- carry an `Experimental` or `Inferred` indicator
- document the exact assumption
- remain deterministic under injected RNG
- not be described as exact parity

### `blocked`

Multiple materially different behaviours remain possible.

Blocked items must remain discoverable but disabled with a precise explanation.

Do not invent:

- hidden probabilities
- failure/destruction rates
- target-selection rules
- corruption outcomes
- modifier-removal priorities
- consumption timing

when the available sources do not determine them.

---

# 2. Complete Crafting Inventory

The registry contains all retained crafting definitions across these categories:

- Currency
- Quality
- Socketing / Augments
- Ritual / Omens
- Essences
- Abyss
- Breach / Genesis
- Delirium / Instilling
- Runeforging
- Corruption / Sacrifice

The current runtime must not hide most known items without explanation.

## Required inventory modes

Provide two clear views:

### Available

Show operations that are currently implemented and valid for use.

### All known items

Show every retained definition for the active category.

In `All known items`:

- implemented items remain interactive
- inferred items remain interactive and visibly marked
- blocked items are disabled and explain the missing evidence
- deprecated items are hidden by default behind an explicit audit/deprecated option

Do not expose mutation handlers for blocked or deprecated items.

## Required category behaviour

All known items must be discoverable in the correct category.

Examples:

- all retained Essences under Essences
- all retained Socketing / Augments under Socketing / Augments
- all retained Runeforging items under Runeforging
- all retained Liquid Emotions under Delirium / Instilling
- all retained Vaal / sacrifice / infuser definitions under Corruption / Sacrifice

Do not leave a category as a large unexplained black area.

Use an explanatory empty state, for example:

```text
No implemented Runeforging operations yet.
19 known items are available in All known items.
```

---

# 3. Research and Implement Mechanics

Work category by category.

For every definition:

1. Read its exact retained description
2. Research official and reliable public sources
3. Cross-check target-version membership
4. Determine `verified`, `inferred`, or `blocked`
5. Implement verified and safely inferred mechanics
6. Add exact applicability messages
7. Add deterministic engine and UI tests
8. Keep genuinely unresolved mechanics disabled

Do not claim complete game parity while inferred or blocked mechanics remain.

## Important examples to investigate

Research rather than automatically leaving these blocked:

- regular Essences
- Greater / Perfect Essences
- Breach Essences
- Catalysts / Genesis-related crafting
- Alloys
- Resistance Fluxes
- Liquid Emotions / Instilling
- Runeforging
- Artificer's Orb
- Runes
- Soul Cores
- Vaal Infusers
- Architect / Ancient Infuser style operations
- Vaal Orb outcomes
- sacrifice/extraction operations

Where item descriptions fully define the transition, implement it.

Where probabilities or target rules are materially incomplete, retain a blocker.

---

# 4. Exact Currency-History Identity Bug

## Problem

The currency-history panel can visually merge or confuse different variants such as:

- Chaos Orb
- Greater Chaos Orb
- Perfect Chaos Orb

The history currently shows similar icons and counts without a reliable visible tier indicator.

## Required fix

Key every history entry by exact stable identity:

- preferred: `craftId`
- acceptable: another unique variant identity that survives save/load

Do not key by:

- shared engine action
- shared handler
- generic `chaos`
- icon ID
- base action
- display group

Ordinary, Greater, and Perfect variants must remain independent.

## Required display

Every variant entry must expose:

- exact display name
- exact tier
- quantity
- accessible label

Use consistent tier language:

- ordinary / base: `I`
- Greater: `II`
- Perfect: `III`

Example:

```text
Chaos Orb · I · ×34
Perfect Chaos Orb · III · ×26
```

Compact icon-only layout is allowed only when the tier remains visibly and accessibly clear.

## Counter heading

The heading represents successful applications, not unique currency types.

Use:

```text
62 currency uses
```

Do not use:

```text
62 currencies used
```

## Counter rules

- successful craft increments once
- failed craft does not increment
- sticky repeat increments once per successful item click
- Hinekora preview does not increment
- Hinekora commit increments once
- undo and redo restore exact counts
- reset clears counts
- stash save/load preserves counts
- zero-affix Transmutation on Absent Amulet counts once
- Omens must not be silently merged into the triggering currency unless intentionally designed

## Regression fixture

Create a deterministic scenario:

- Transmutation ×1
- Regal ×1
- ordinary Chaos ×34
- Perfect Chaos ×26

Expected:

- `62 currency uses`
- four distinct entries
- Chaos Orb and Perfect Chaos Orb are visibly distinguishable
- no accidental grouping

---

# 5. Counter Save Migration

If old saves store history by generic engine action:

- migrate safely
- preserve known counts
- do not silently assign an ambiguous legacy Chaos count to both variants
- document any unavoidable ambiguity

Preferred migration policy:

- exact old variant keys migrate exactly
- generic legacy keys migrate to a clearly marked legacy/base entry
- do not duplicate counts
- preserve deterministic save loading

---

# 6. Horizontal Category Mouse-Wheel Bug

## Problem

The crafting-tab strip uses horizontal overflow, but normal vertical mouse-wheel input does not move it.

The scrollbar can be dragged, but the wheel appears broken.

## Required behaviour

When the pointer is over the overflowing tab strip:

- `deltaY` scrolls horizontally
- native `deltaX` still works
- Shift+wheel works
- active tab does not change merely from scrolling
- tab click still changes category
- touch dragging still works
- scrollbar dragging still works

## Event handling rules

- add a wheel listener only to the horizontal tab strip
- do not globally intercept wheel events
- use a non-passive listener only where required
- call `preventDefault()` only when the strip actually consumes movement
- at the left or right boundary, allow the parent/page to continue scrolling
- do not create a scroll trap

## Preserve keyboard behaviour

Keep:

- Left
- Right
- Home
- End
- Enter
- Space
- focus-visible state

Do not make a closed native category `<select>` change values from accidental wheel input.

---

# 7. Category Dropdown and Tab Duplication

The category dropdown and horizontal tabs currently duplicate navigation.

Simplify by viewport:

## Desktop

- tabs are primary
- dropdown may be hidden or visually secondary

## Narrow layouts

- dropdown may replace or complement tabs
- avoid showing two equally prominent controls for the same action

Keep:

- search
- Applicable only
- Available / All known mode
- meaningful category counts

Ensure:

- switching category scopes search and counts correctly
- description text matches the active category/item
- no stale description from another category

---

# 8. Counts and Empty States

Do not show a global count like:

```text
0 of 45 crafting items
```

when the active category contains many source-known definitions.

Use active-category counts, for example:

```text
20 available · 20 known
12 available · 76 known
0 available · 19 known
```

The count must respond correctly to:

- active category
- search
- Applicable only
- Available / All known mode
- deprecated visibility

---

# 9. Performance

Do not eagerly render all definitions.

Required:

- render active tab only
- cache immutable card models
- reuse rendered tab content where safe
- use event delegation
- lazy-load icons
- avoid per-card event listeners
- preserve fast search
- preserve smooth scrolling

For very large categories, especially Socketing / Augments:

- profile first
- use virtualization only if measurements justify it

Preserve:

- direct `file://`
- offline service worker
- classic scripts
- no framework dependency
- current runtime-data optimizations

---

# 10. Accessibility

Preserve or improve:

- keyboard tab navigation
- focus-visible styling
- `aria-selected`
- `aria-disabled`
- exact disabled reason
- `aria-label` for tiered history entries
- accessible Available / All known mode
- screen-reader category counts
- no color-only distinction between verified/inferred/blocked

---

# 11. Testing

Add deterministic regression tests for:

## History identity

- ordinary / Greater / Perfect variants remain distinct
- exact `craftId` survives history
- tier badge is correct
- total use count is correct
- failed crafts do not increment
- sticky repeat counts correctly
- Hinekora preview/commit counts correctly
- undo/redo restores counts
- reset clears counts
- stash save/load restores counts
- legacy migration does not duplicate counts

## Category scrolling

- mouse wheel scrolls right
- mouse wheel scrolls left
- horizontal trackpad input works
- Shift+wheel works
- boundary releases page scrolling
- active tab stays unchanged while scrolling
- clicking a scrolled tab activates it
- keyboard navigation remains correct

## Inventory

- all retained definitions discoverable
- all retained Essences discoverable
- all retained Socketing items discoverable
- blocked items remain disabled
- inferred items are marked
- deprecated items hidden by default
- category counts are accurate
- empty states explain known-but-unimplemented content
- active-tab-only rendering
- no large DOM regression

## Environment

- direct `file://`
- HTTP
- offline reload
- service-worker cache update
- mobile
- common laptop
- large desktop

---

# 12. Required Validation

Run:

- engine validation
- UI validation
- data validation
- fuzz testing
- browser smoke
- generated-file checks
- provenance checks
- service-worker checks
- offline reload
- direct `file://`
- `git diff --check`

---

# 13. Final Report

Report:

- mechanics implemented
- sources used
- verified count
- inferred count
- blocked count
- deprecated count
- visible count
- tested count
- assumptions made
- history migration behaviour
- before/after screenshots
- wheel behaviour tested
- active DOM-node counts
- render/search performance
- files changed
- all validation results

Do not describe the project as full parity unless every retained mechanic is actually verified.
