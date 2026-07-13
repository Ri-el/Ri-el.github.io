# UI Redesign, Bug Fixes, and Interaction Specification

## Objective

Independently redesign and implement the UI of `Ri-el/Ri-el.github.io` so it feels as close as reasonably possible to the Path of Exile 2 in-game crafting and item interface.

Do not wait for every visual decision to be specified manually. Inspect the repository, run the site, study the current UI at multiple viewport sizes, and determine what looks unlike the game.

Use official publicly available Path of Exile 2 screenshots, videos, and interface references when browsing is available. Recreate the visual language with original CSS and existing project assets. Do not import or copy proprietary game files that are not already present in the repository.

The final interface should feel like an actual in-game crafting screen, not a developer dashboard, database viewer, or generic website.

---

## Core Constraints

Preserve all of the following:

- Existing crafting behaviour.
- Modifier identity, tiers, tags, and effective weights.
- Concrete-base mappings.
- Save migration.
- Undo and redo.
- Hinekora's Lock preview and commit behaviour.
- Omen and Abyss interactions.
- Offline service-worker support.
- Direct no-server `file://` compatibility.
- Classic deferred scripts.
- No required framework or package dependency.
- The recent lightweight runtime-data improvements.
- The 45-definition runtime crafting registry.
- The complete checked-in source and audit data.

Do not delete complete source or audit information merely to simplify the visible UI.

Do not make unrelated crafting-mechanics changes.

---

## Required Process

1. Establish a measurable before-state.
2. Reproduce all listed bugs.
3. Capture screenshots at representative viewport sizes.
4. Profile before optimizing.
5. Audit the full UI independently.
6. Write a short internal design plan based on the actual Path of Exile 2 visual language.
7. Implement the redesign and fixes in coherent stages.
8. Compare before and after.
9. Test interaction, accessibility, performance, and offline behaviour.
10. Remove obsolete CSS where safe instead of endlessly stacking overrides.
11. Add regression coverage for the discovered problems.
12. Run all required validation before finishing.

Do not merely write a plan. Make the changes.

---

# Known Bugs

## 1. Crafting Stash Collapse

At some desktop viewport heights or browser zoom levels, the Crafting Stash shows its controls and category tabs, but the crafting-card area collapses into a very thin strip.

The result is that the player cannot see or use the actual crafting cards or icons.

### Required fix

- Reproduce the issue at multiple viewport sizes.
- Test multiple viewport heights, widths, device-pixel ratios, and zoom-equivalent sizes.
- Find the real layout cause.
- Ensure the active crafting panel always retains a usable visible height.
- Ensure the cards area scrolls correctly when required.
- Do not solve it only with one arbitrary hardcoded height.
- Do not make the entire page awkwardly scroll just to expose the stash.
- Do not hide controls to make the layout fit.
- Add a regression test that checks visible bounding-box height, clipping, overflow, scrollability, icon rendering, and active-panel visibility.

A test that only confirms that 45 elements exist in the DOM is not sufficient.

## 2. Missing Crafting Icons

The Crafting Stash must show the correct icon for every visible crafting control.

### Required fix

- Verify all 45 visible crafting controls.
- Diagnose asset paths, generated `iconId` fields, service-worker cache state, cache-version upgrades, CSS visibility, image loading, and fallback behaviour.
- Every crafting card must show either the correct PNG icon or a readable fallback abbreviation.
- A crafting card must never appear blank.
- Verify first load, cached reload, offline reload, and stale-cache upgrade.

## 3. Concrete-Base Picker Lag

The Concrete Base chooser feels slow for large classes such as Gloves with roughly 198 bases.

### Measure before changing

Profile:

- first open;
- repeated open;
- search-input latency;
- filter latency;
- DOM node count;
- scroll responsiveness;
- scripting time;
- layout time;
- paint time;
- memory retained;
- view-model construction;
- `structuredClone` usage;
- search-text generation;
- image creation;
- event-listener creation;
- repeated full-list rerendering.

### Required fix

Determine the actual bottleneck yourself.

Consider, only where measurements justify it:

- caching immutable concrete-base view models;
- precomputing searchable text;
- reusing rendered rows;
- event delegation;
- debounced filtering;
- batched DOM insertion;
- avoiding unnecessary deep clones;
- lazy icon creation;
- rendering only visible rows;
- list windowing or virtualization.

Preserve search, attribute-family filtering, selected-base highlighting, disabled bases, keyboard navigation, focus handling, screen-reader behaviour, base switching, confirmation before replacing a crafted item, undo and redo, stash restoration, save migration, offline operation, and direct `file://` compatibility.

## 4. Item Tooltip Overflow

The item tooltip currently exposes unnecessary horizontal and vertical scrollbars.

### Required fix

- The item tooltip must fit the available workbench width.
- There must be no horizontal scrolling inside the item tooltip.
- Text must wrap or size naturally.
- The tooltip should only scroll vertically when genuinely necessary.
- Avoid nested scroll containers.
- Ensure the workbench layout remains usable at common laptop sizes.

---

# In-Game UI Direction

## Overall Goal

The normal gameplay view should prioritize:

1. The selected item.
2. Item level.
3. Implicits.
4. Prefixes and suffixes.
5. Quality, sockets, enchantments, and corruption only when present.
6. The crafting currency the player can use.
7. The result of the last craft.
8. Saved items only when relevant.

The UI should not look like a database browser or audit report.

Audit and improve overall visual hierarchy, item tooltip anatomy, crafting workbench layout, crafting stash, item stash, concrete-base selector, tabs, typography, spacing, alignment, borders, separators, backgrounds, textures, shadows, glows, scrollbars, hover/focus/selected/armed/disabled states, responsive behaviour, keyboard behaviour, accessibility, loading states, and empty states.

---

# Visual Noise to Remove or Demote

Remove the following from the normal player-facing UI unless they genuinely affect crafting:

- Drop Level.
- Drop Level filters.
- `Required Level unavailable`.
- `Unavailable in normalized source`.
- `Sockets unavailable — target-version limits and operations are unverified`.
- Source IDs.
- Provenance paths.
- Target-version explanations.
- Internal blocker terminology.
- Empty technical sections.
- Empty requirement sections.
- Repetitive labels that add no gameplay value.
- Repeated monograms that do not help distinguish bases.
- Disabled filters that only communicate missing data.

Keep complete source and audit information in development data, reports, or an optional technical/details mode.

---

# Item Tooltip Requirements

Rebuild the tooltip structure so it more closely resembles the in-game item presentation.

Show sections only when they exist.

A clean normal item should not contain large empty gaps, duplicate labels, unnecessary separators, developer wording, audit wording, unavailable-source wording, horizontal scrolling, or placeholder technical text.

Investigate and implement the correct visual ordering for:

- item name;
- item class;
- item level;
- quality;
- requirements only when useful;
- implicits;
- enchantments;
- prefixes;
- suffixes;
- corrupted state;
- mirrored state;
- sanctified state;
- flavour text where appropriate.

A minimal normal item may be as simple as:

```text
AZURE AMULET

Item Level: 83
────────────────────

Mana Regeneration Rate: 20–30

No modifiers
```

Only show quality, sockets, enchantments, corruption, or similar sections when they actually exist.

---

# Crafting Stash Requirements

The Crafting Stash must be immediately readable and usable.

## Required behaviour

- All 45 visible crafting controls render.
- Every control displays an icon or fallback.
- The active tab always has usable visible height.
- The cards area scrolls when needed.
- Filters do not crowd out the cards.
- Tabs do not crowd out the cards.
- Unsupported mechanics do not visually dominate usable mechanics.
- The layout remains usable at common laptop sizes.
- The card area remains visible at multiple zoom-equivalent dimensions.

## Simplification

Independently decide whether the current combination of search, category dropdown, applicable-only filter, result count, permanent description panel, and ten visible tabs is too visually dense.

Prefer clarity over showing every control at once.

The permanent empty-state description box may be collapsed, moved, or shown only on hover, focus, or selection.

Rare or unsupported groups may be placed under a secondary `More` or `Unavailable mechanics` area if that improves clarity.

---

# Concrete Base Picker Requirements

The selector should feel fast, clean, and focused.

## Visible information

Prefer showing only useful crafting-related information, such as:

- base name;
- attribute family when relevant;
- implicit text when relevant;
- selected state;
- unavailable state only when needed.

Do not show Drop Level.

Required Level should only be shown if it provides meaningful player value.

The search placeholder should be concise, such as `Search bases`.

## Controls

- One search field.
- Attribute-family filter only when relevant.
- Clear selected-base highlighting.
- `Reset filters` only when filters are active.
- Optional `Show unavailable bases` only if useful.
- Do not reserve space for disabled or irrelevant filters.

---

# Item Stash Requirements

The empty Item Stash currently occupies too much visual space.

When empty, prefer a compact state such as:

```text
ITEM STASH

No saved items

[ Save current item ]
```

Expand the slot grid only when saved items exist, or make it collapsible.

The empty stash should not compete visually with the crafting workbench.

---

# Tutorial and Helper UI

The permanent tutorial bar `1 Choose a currency → 2 Apply it to the item` should not permanently consume vertical space after the player understands the interaction.

Consider showing it on first use, until the first successful craft, behind a Help button, or in a dismissible onboarding state.

---

# Typography and Framing

Reduce visual clutter caused by excessive uppercase, excessive letter spacing, very tiny muted text, nested borders, multiple frames around every panel, strong shadows on every element, and too many competing gold accents.

Use strong gold emphasis only for important states such as active tab, selected base, armed currency, sticky currency, confirmation, and important warning.

Regular containers should use weaker borders or no border where appropriate.

---

# Right-Click Sticky Currency Mode

Implement Path of Exile-style repeated currency application.

## Core interaction

- Normal left-click on a usable repeatable currency arms it for one application.
- After one successful application, it disarms as it currently does.
- Right-clicking a usable repeatable currency activates Sticky Currency Mode.
- Sticky Currency Mode behaves like holding Shift in the game.
- While Sticky Currency Mode is active, the player can repeatedly left-click the item to apply the same currency without selecting it again.
- The currency remains armed after each successful application.
- The user does not need to physically hold Shift.
- Right-click itself must not apply the currency.
- The actual craft still occurs by left-clicking the item.

## Visual state

A sticky currency must have a clearly different persistent state.

- Use an in-game-inspired selected border, glow, or marker.
- Do not rely on colour alone.
- Expose accessible state with `aria-pressed`.
- Include a tooltip such as `Right-click: keep selected for repeated use.`

## Deactivation rules

Sticky Currency Mode must deactivate when:

- the user right-clicks the same currency again;
- the user selects a different currency;
- the user presses Escape;
- the user changes item class;
- the user changes concrete base;
- the user loads an item from the stash;
- the user resets the item;
- the selected craft becomes unavailable;
- a confirmation or modal flow requires cancellation;
- an operation invalidates or consumes the selected crafting item;
- the player exits the relevant workbench context.

Undo and redo must not silently switch to another currency.

Sticky mode may remain active after undo or redo only when the same currency remains valid and safe to apply.

## Input handling

- Prevent the browser context menu only on interactive crafting controls.
- Do not disable context menus across the whole page.
- Ignore right-click sticky activation for unsupported or disabled controls.
- Avoid duplicate application caused by `pointerdown`, `mousedown`, `click`, and `contextmenu` firing together.
- Support mouse and trackpad input.
- Do not apply the currency from the right-click itself.

## Omen compatibility

Inspect existing right-click Omen behaviour before changing shared handlers.

Do not break Omen arming, Abyss interactions, Hinekora preview behaviour, drag behaviour, existing keyboard input, or specialized operations.

Sticky behaviour should apply only to suitable repeatable crafting controls.

Do not automatically apply sticky behaviour to unsupported audit cards, non-repeatable specialized crafts, confirmation actions, selector controls, or Omens whose right-click behaviour already has another meaning.

## Physical Shift compatibility

Preserve physical Shift behaviour if it already exists.

Physical Shift and right-click sticky mode should share one internal `keep currency armed` rule.

Required behaviour:

- Releasing Shift must not disable a right-click sticky selection.
- Right-click deactivation must not interfere with Shift currently being held.
- Shift and sticky mode must not create duplicate applications.
- The result must match manually reselecting the currency before each use.

## Safety

Before each repeated application:

- rerun the normal applicability validator;
- reject invalid operations atomically;
- do not consume or mutate anything on failure;
- do not create duplicate history entries;
- keep or clear sticky mode based on whether the craft remains valid.

---

# Accessibility Requirements

Preserve or improve keyboard navigation, visible focus states, focus trapping in modals, focus restoration after closing modals, screen-reader labels, `aria-selected`, `aria-pressed`, `aria-disabled`, non-colour state indicators, semantic buttons, Escape behaviour, and context-menu behaviour outside crafting cards.

Do not sacrifice accessibility for visual similarity.

---

# Performance Requirements

Do not undo the recent runtime-data improvements.

Preserve the compact runtime crafting registry, compiled runtime-data boundary, full audit data, modifier identity, modifier weights, concrete-base mappings, offline support, classic-script `file://` support, and no-server operation.

Avoid introducing a heavy framework or new package dependency unless there is a strong measured reason.

Measure before and after:

- initial eager raw size;
- gzip size;
- compile time;
- execute time;
- retained heap proxy;
- cold startup;
- cached reload;
- workbench entry;
- concrete-base modal open time;
- filter latency;
- scroll performance;
- DOM node count.

---

# Testing Requirements

Run all existing checks:

- `validation.mjs`
- `ui-validation.mjs`
- `data-validation.mjs`
- fuzz testing
- generated-file checks
- provenance checks
- browser smoke tests
- offline service-worker reload
- representative item classes
- concrete-base switching
- crafting
- undo
- redo
- stash save
- stash restore

Add regression coverage for the following.

## Crafting stash

- usable active-panel height;
- visible cards;
- visible icons or fallbacks;
- no clipping;
- correct scrolling;
- multiple viewport sizes;
- multiple viewport heights;
- zoom-equivalent layouts.

## Concrete base picker

- first open;
- repeated open;
- search latency;
- filter latency;
- scroll responsiveness;
- selected state;
- disabled bases;
- keyboard navigation;
- focus handling;
- large classes such as Gloves.

## Sticky currency mode

- normal one-use left-click behaviour;
- right-click activation;
- repeated item clicks;
- right-click deactivation;
- switching currencies;
- Escape cancellation;
- item-class change;
- concrete-base change;
- reset;
- stash load;
- unsupported currency;
- craft becoming invalid;
- physical Shift compatibility;
- no browser context menu on currency controls;
- normal context menu elsewhere;
- no duplicate application per click;
- Omen behaviour unchanged;
- undo;
- redo;
- Hinekora preview and commit;
- offline operation;
- deterministic RNG parity.

Use deterministic RNG and prove that repeated sticky applications produce the same engine results as manually reselecting the same currency before every application.

---

# Visual Regression Requirements

Where practical, add screenshots or automated checks that verify:

- actual visible dimensions;
- no overlap;
- no clipping;
- no hidden active panel;
- no horizontal tooltip scroll;
- readable text wrapping;
- icons rendered;
- selected states visible;
- sticky state visible;
- modal layout usable;
- common desktop viewport;
- common laptop viewport;
- mobile viewport.

Do not rely only on DOM existence checks.

---

# Acceptance Criteria

The task is complete only when:

- The Crafting Stash no longer collapses.
- All 45 visible crafting controls are usable.
- All crafting controls show an icon or fallback.
- The item tooltip no longer shows database noise.
- Drop Level is removed from player-facing UI.
- The tooltip has no horizontal scrollbar.
- The concrete-base picker is measurably faster for large classes.
- The concrete-base picker is visually simpler.
- Right-click Sticky Currency Mode works correctly.
- Physical Shift remains compatible.
- Omen and Hinekora behaviour remain correct.
- Existing crafting outcomes remain unchanged.
- Offline reload works.
- Direct classic-script architecture remains intact.
- All tests pass.
- Before-and-after measurements are reported.
- Before-and-after screenshots are included.
- Remaining differences from the actual game are documented honestly.

---

# Final Report Requirements

At the end, report:

- Main visual problems discovered.
- Root causes of the known bugs.
- Design decisions made.
- Files changed.
- Before-and-after screenshots.
- Before-and-after performance measurements.
- Viewport sizes tested.
- Browser environments tested.
- Tests run.
- Any remaining caveats.
- Any differences from the actual Path of Exile 2 UI.
- Any proposed changes intentionally rejected and why.

The final result should feel focused, readable, responsive, performant, and convincingly in-game rather than like a technical database interface.
