# PoE2 0.5.4 UI and Crafting Validation

Validated against the repository's converted Craft of Exile dataset and Grinding Gear Games' published [0.5.0 item changes](https://www.pathofexile.com/forum/view-thread/3932540), [0.5.4 patch notes](https://www.pathofexile.com/forum/view-thread/3975218), [0.5.4 hotfix](https://www.pathofexile.com/forum/view-thread/3975342), and [0.5.4 hotfix 2](https://www.pathofexile.com/forum/view-thread/3976201). The 0.5.4 notes and hotfixes do not replace the relevant 0.5.0 core currency rules.

## UI root cause and fix

The dark section was not a modal or backdrop. Browser inspection showed the Well of Souls modal was hidden with a zero-sized rectangle and `display: none`. The effective cause was sticky positioning in the workbench/right-rail layout: the pinned crafting columns remained in the viewport after their grid row, while the later Desecration/Omens content entered the same paint area. With automatic z-index values, the later DOM sibling painted over the item controls.

The fix returns the affected rail/panels to normal document flow (`position: relative; top: auto`). This corrects the stacking lifecycle rather than hiding content, forcing a height, or raising one panel above another with z-index.

The overlap correction was exercised in Chrome-compatible browser checks at 100% scale at 1299x665, 1920x1080, and 2560x1440. There was no panel intersection or horizontal overflow. Craft/apply, undo, item tooltip, 24 stash slots, save/load state, scrolling, and button hit targets remained functional.

The final package adds the in-game-inspired three-column workbench in `overhaul.css`, loaded after every legacy stylesheet: a currency stash tab on the left, active item in the centre, item stash on the right, and Omens in the following grid row. It also restores click/tap currency pickup alongside right-click and drag-and-drop. A dependency-free UI contract suite verifies that the affected panels stay in normal flow, the mobile legacy fixed drawer is cancelled, the modal starts hidden, the stylesheet order is correct, and the selection/stash interactions remain wired. The cloud Chrome session used during the final packaging continuation rejected access to the local server, so that final visual layer could not be re-screenshot in that continuation; the earlier cross-resolution overlap checks and the repeatable DOM/CSS checks are reported separately rather than conflated.

The project documents direct `index.html` use as its normal launch path. `serve.ps1` is optional for HTTP/PWA testing. PowerShell was not available in the Linux test environment, so the same static-file and MIME behaviour was exercised through a local HTTP server. All core HTML, CSS, JavaScript, data, manifest, and icon requests loaded without a JavaScript exception. Missing optional category/Omen PNGs return 404 and use the app's text/monogram fallback; these were not the overlay cause.

## Task 01 concrete Amulet selector

The outer item-class screen remains the entry point. Clicking Amulets still calls the existing `CraftForge.loadBase('amulets')` bridge and opens the workbench immediately. A single trigger in the workbench header now opens a searchable concrete-base dialog populated from `window.COE_NORMALIZED_DATA`; there is no intermediate full-screen base page.

All 25 records in `simulatorBaseMap.amulets` are selectable. ID `2546` (Crimson Amulet) is the deterministic default. Concrete ID/name/class state is distinct from the `amulets` modifier pool and is included in reset, undo/redo, Hinekora snapshots, and stash persistence. Fresh switches are immediate; crafted switches remain unchanged until the explicit `Change Base and Reset Item` confirmation is activated. Item level is preserved across a confirmed reset.

Required level is not present for any retained Amulet, so the UI reports it as unavailable and displays the normalized Drop Level separately. Implicits use retained stat IDs/ranges because localization templates are absent. The Amulet tooltip hides Jewel-only socket instructions; Ruby, Sapphire, and Emerald retain them.

The Codex in-app browser rejected direct `file://` navigation under its local-file URL policy. Direct-file compatibility is therefore covered at this checkpoint by classic deferred script order, absence of runtime fetches, locally bundled data, and source contracts, but interactive `file://` verification is recorded as blocked rather than claimed. The local HTTP/service-worker verification remains pending the repository-required approval for local network access.

## Task 02 generic concrete-base state

The Task 01 workbench component now serves all 31 outer item classes without changing their cards or direct-entry behavior. The 56 populated simulator pools map to 1,743 surfaced normalized records. Two unmodifiable Gloves are disabled, leaving 1,741 craft-selectable records. The selector searches sourced names, IDs, requirements, properties, and implicit text; it also provides Drop Level and attribute-family filters. Because none of the 1,760 normalized records has a verified required level, that distinct filter is disabled with an explicit source-data message and never substitutes Drop Level.

Concrete choices from another attribute family rebuild the engine for that base's exact simulator pool while preserving item level and one undo snapshot. Crafted switches, including Jewel swatches, require confirmation and reset incompatible state; fresh switches are immediate. Undo/redo, stash loading, and Hinekora previews retain concrete ID and pool identity. Ruby, Sapphire, and Emerald keep their existing header control, and attribute-family pool IDs are never presented as concrete bases.

Item-state schema version 3 adds versioned migration and generic concrete metadata while retaining the existing prefix/suffix engine. Legacy saves without `baseItemId` deterministically use the first selectable mapped base in their saved pool. Malformed IDs, pool mismatches, newer schemas, target-version mismatches, empty pools, and unsupported versions are rejected with compatibility messages. Legacy socket counts are retained as explicitly unverified metadata; maximum/default limits and socket effects are not invented. Concrete tags participate in modifier eligibility, and fixed sourced prefix/suffix-cap implicit deltas are enforced.

The 17 normalized-data blockers are explicit: 11 all-attribute armour/shield records lack compiled pools, five Diamond/Time-Lost Jewel pools are empty, and Timeless Jewel ID `613` has no simulator mapping. No retained base maps ambiguously. The source `socketCount` field remains a source datum until Task 06 verifies its gameplay semantics.

## Task 03 authoritative crafting registry

The crafting inventory now has one authoritative generated registry in `data/crafting/currency-index.json`. It contains all 530 retained normalized crafting records plus the existing runtime-only Hinekora's Lock definition: 531 unique craft IDs, 530 exact source ID/metadata-key mappings, ten ordered tabs, and exactly the same 37 visible controls as before this task. Classification counts did not change. Hinekora's missing normalized identity and every unimplemented mechanic remain explicit blockers; `fullParityClaim` remains false.

`index.html` now contains structural inventory containers only. `app.js` generates tabs, focusable buttons, labels, icon fallbacks, descriptions, and supported/blocked state from the classic-script registry bundle. Search, category filtering, Applicable-only filtering, arrow-key navigation, persistent hover/focus descriptions, and mobile layout are covered by the UI contract suite. The existing outer item-class screen and direct workbench entry are unchanged, and concrete base selection remains inside the workbench.

Click, keyboard, context-menu, and drag interactions resolve the same stable craft ID and enter a shared dispatcher. Item operations calculate their exact disabled reason before snapshots or handlers; successful ordinary operations alone consume matching crafting Omens and add history. Unsupported definitions have no mutation handler and stay focusable so their exact blocker can be inspected. Hinekora, Desecration, Essence of the Abyss, and ordinary currency all pass through registry validation before their existing specialized behavior. The engine and browser controller also accept an injectable RNG for deterministic preview/test paths while the default still reads live `Math.random` and preserves the reviewed fuzz digest.

The parity report is generated directly from the registry rather than reconstructed from names or source tags. It records 531 definitions, 37 visible controls, 32 implemented definitions, one probability-unverified Vaal definition, 489 blocked definitions, and nine deprecated target-version records. The four visible unavailable controls retain item-specific blockers. No new crafting mechanic was enabled in Task 03.

Interactive direct-`file://` verification remains explicitly blocked by the Codex in-app browser's local-file URL policy. Compatibility is covered by the unchanged classic deferred script model, local `.data.js` bundle, absence of runtime fetches, generated-asset freshness checks, service-worker shell inclusion, and source contracts. The later regression-fix instruction explicitly authorized the local-server verification described below.

### Task 03 production entry regression fix

Commit `72a5f0b` initially failed during default-engine rendering. The first visible browser exception was `Error initializing simulator: noEligibleModifier is not defined`; the app caught it and displayed the error toast, so the browser console itself remained empty. `noEligibleModifier` had been declared inside `consumeCraftOmen()` but was called from `currencyDisabledReason()` during the initial `renderItem()`. That aborted `createEngine()` before normalized indexes were exposed through the working bridge, so every outer class stayed on the selection screen.

The helper now lives in `currencyDisabledReason()`. Core modifier/normalized data and the default engine initialize before the crafting registry UI; registry rendering/validation has its own prominently reported failure boundary, and non-crafting category navigation is still bound. The service-worker cache is `poe2-craft-task03-regression-fix-v1`, preventing the previous Task 03 shell from mixing old and fixed runtime assets.

Real HTTP browser smoke testing used the repository's `serve.ps1` workflow. All 31 released item classes entered the workbench, selected a deterministic concrete base, rendered the tooltip, and returned through the Item Categories button without a toast or console error. The mandatory representative set passed with Ruby, Crimson Amulet, Golden Hoop, Stocky Mitts, Rusted Cuirass, Crude Bow, Lesser Life Flask, and Thawing Charm. `tools/browser-smoke.mjs` now automates the same real-script assertions, including the 531-definition/ten-tab globals and service-worker unregister/cache-clear step, when an existing Playwright browser is available.

The in-app browser rejected `file://` navigation under its URL security policy and explicitly prohibited switching to another automation surface as a workaround. Direct-file click-through therefore remains pending external/manual execution and is not claimed as verified here. The checked-in classic-script bundle itself passes JavaScript evaluation and assigns 531 registry definitions and ten tabs without fetching JSON.

## Selection calculation

The corrected ordinary-currency path is:

1. Resolve the selected `baseType` to its one converted class/attribute pool.
2. Build prefix and suffix candidates containing only tiers whose `ilvlReq <= item.ilvl`.
3. Apply the rarity's open prefix/suffix capacity.
4. Remove every candidate whose `modGroup` is already present. Fractured and revealed Desecrated modifiers remain present and therefore continue to block their groups.
5. For Greater/Perfect currency, remove tiers below its Minimum Modifier Level. If that would remove an entire modifier group, retain the highest item-level-eligible tier in that group.
6. Sum tier weights by affix side and modifier group, choose a group by its summed weight, then choose a tier inside that group by its tier weight.
7. Roll the numeric value only after the tier is selected and add the final modifier.

The two-stage weighted choice is algebraically equivalent to choosing every eligible tier directly by its weight:

`P(tier) = groupWeight / totalWeight * tierWeight / groupWeight = tierWeight / totalWeight`.

Chaos first removes one removable modifier. Omen of Whittling selects the minimum numeric modifier level (`ilvlReq`), not the displayed tier number; equal-lowest modifiers are selected randomly. Fractured and unrevealed placeholder modifiers cannot be removed. After removal, the engine rebuilds the existing-group set and recalculates eligible candidates, Minimum Modifier Level filtering, capacity, and weights before selecting the replacement.

## Corrected differences

- Ordinary Rare equipment now uses 3 prefixes and 3 suffixes; jewels remain 2 and 2.
- Life Flasks, Mana Flasks, and Charms are Magic-only.
- Orb of Alchemy creates exactly four fresh modifiers and discards Magic modifiers.
- Greater/Perfect currency now filters modifier tiers instead of biasing the numeric value within a tier.
- 0.5.4 floors are configured as Greater Transmutation/Augmentation 44, Perfect Transmutation/Augmentation 70, Greater Regal/Exalted/Chaos 35, and Perfect Regal/Exalted/Chaos 50.
- Minimum Modifier Level preserves the best eligible tier of a group when the group would otherwise disappear.
- Omen of Whittling now randomises ties between equal-lowest modifier levels.
- The browser data bundle was rebuilt; it had omitted all four Time-Lost jewel JSON definitions.

## Remaining 0.5.4 gaps

These prevent a claim of complete game parity:

- The converted modifier data still has 61 class-level files, 56 populated. Normalized data retains 1,760 concrete records; 1,743 map to populated pools, while 17 have documented pool/mapping blockers. Required levels, per-base icons, localized implicit templates, maximum/default socket semantics, and some per-base properties/limits remain unavailable. Exact base-specific mechanics cannot be claimed where fields or enforcement rules are missing.
- Eight populated pools have every weight collapsed to `1`: `body_armours_str_dex_int`, `claws`, `daggers`, `flails`, `one_hand_axes`, `one_hand_swords`, `two_hand_axes`, and `two_hand_swords`. Their probabilities are equalised and cannot be certified against 0.5.4 until the weights are re-imported from the source export.
- All 700 Desecrated entries lack numeric modifier levels. Whittling therefore cannot accurately compare a revealed Desecrated modifier with ordinary modifiers; the engine conservatively ranks unknown levels last.
- Desecrated pools are empty for `sceptres`, `life_flasks`, `mana_flasks`, and `charms`.
- `diamond` and all four `time_lost_*` jewel pools are empty and not selectable.
- Essence of the Breach is still a hard-coded no-op, and generic enforcement of the 0.5.4 one-crafted-modifier rule is not implemented.
- Well of Souls options are deliberately selected uniformly in the current engine rather than by configured weight.
- Concrete tags and fixed sourced prefix/suffix-cap implicit deltas are enforced generically. Other inherent effects remain state/display data until their exact operation hooks are verified.

Every one of the 56 currently selectable populated class/attribute pools constructs and accepts a valid basic craft without an exception. That is not the same as supporting every concrete base available in PoE2 0.5.4.

Task 01 also corrected a reset invariant: `resetItem()` previously created an item at level 83 while retaining the old item's lower-level candidate cache. Reset now rebuilds prefix and suffix candidates for the reset item and remains covered by a focused regression. The current Task 02 digest change is separately explained below.

## Repeatable results

## Task 04 core and quality currency checkpoint

The engine now uses item-state schema version 4 with structured quality `{ amount, type, source, cap }`. Legacy normal quality at or below the verified 20% cap migrates to `cap: 20`; alternate and above-cap legacy quality keeps `cap: null` unless a saved cap is explicit and valid. Quality target/cap validation is active, the verified fixed Gemcutter's Prism +5 transition is covered by a synthetic Skill Gem fixture, and no unsupported quality formula is enabled in the equipment workbench.

Normalized core constraints corrected in the engine and registry are: Orb of Alchemy requires Normal rarity; Orb of Annulment and Divine Orb require non-Normal rarity; and mirrored items reject core currency and item-level changes. Greater/Perfect floors remain 44/70 for Transmutation and Augmentation and 35/50 for Regal, Exalted, and Chaos, with the existing documented fallback to the best eligible tier when a modifier group has no tier at the floor.

Vaal Orb remains a visible but disabled parity card. Its prior uniform outcome implementation was removed from the reachable operation path because retained 0.5.4 data does not verify outcome transitions or probabilities. Hinekora seals are invalidated when item level, Omen state, or crafting RNG context changes, so a preview cannot be committed under stale context.

Quality parity now surfaces eight disabled audit cards: four ordinary quality currencies blocked on the exact item-level increment formula and four Vaal Infusers blocked on specialized mutation/corruption data reserved for Task 07. The generated registry remains 531 definitions with 45 visible cards (37 authored runtime controls plus eight quality audit cards); `fullParityClaim` remains false.

Task 04 deterministic boundary: **44/44 engine**, **121/121 UI**, **67/67 data**, normalized/currency/parity generators current, sync verification passing, and fuzz **30,016 operations / 4,178 meaningful mutations / 405 Hinekora consumptions / 0 exceptions / 0 invariant violations**, reviewed digest `85d16590e2ed6e7a8fb4dd55d5a53ab4af980a40a360fd4633e469c3b59c37fe`. Interactive direct-file browser verification remains blocked by the Codex browser's local-file URL policy; static file:// contracts and generated bundles pass.

## Task 05 Abyss, Breach, Essences, and Omens checkpoint

Task 05 preserves the existing in-workbench Desecration and Well of Souls flow while tightening only behavior supported by the checked-in normalized records. Preserved Cranium and its directional Necromancy/Abyssal Echoes/Light controls are now declared Jewel-only; Essence of the Abyss records its 27 source-backed equipment classes and rejects Jewels, Flasks, and Charms in both the engine and UI. Unknown Abyssal Bones and simultaneous Sinistral/Dextral Necromancy Omens fail atomically before any item, history, or RNG mutation. Omen of Light now requires a revealed Desecrated modifier and is consumed exactly once when the guarded Orb of Annulment succeeds, including the Hinekora foresight commit path. The UI uses the engine-returned Desecration reroll count instead of assuming one reroll.

The remaining systems are intentionally not promoted to invented parity. Ten retained Bones besides Preserved Cranium remain blocked because their exact target-version mutation/pool behavior is not verified. The checked-in Desecrated modifier file identifies a PoE2 0.3 jewel pool and does not provide a complete target 0.5.4 Well-of-Souls weighting/localization procedure, so reveal options remain an explicitly limited compatibility path. Regular Essences, Essence of the Breach, Catalysts/Refined Catalysts, and Lich-guarantee Omens remain visible only where the registry already provides a specific blocker; no replacement, scaling, rounding, corruption, or probability rule was inferred. Abyssal Echoes consumption timing is retained as a documented verification blocker because the source identifies the reroll action but not whether arming or actual rerolling consumes it.

Task 05 deterministic boundary: **46/46 engine**, **122/122 UI**, **67/67 data**, normalized/currency/parity generators current, sync verification passing, and fixed-seed fuzz **30,016 operations / 3,984 meaningful mutations / 402 Hinekora consumptions / 0 exceptions / 0 invariant violations**, reviewed digest `68cf3661d60c39b202799fff940bab1070d3c24ebb396c55a6d7d9809c0b0b55`. Interactive direct-file browser verification remains blocked by the Codex browser's local-file URL policy; static file:// contracts and generated bundles pass. The service-worker cache is `poe2-craft-task05-abyss-omens-v1`.

The next numbered task is **Task 06 — Sockets, Runes, and Soul Cores**.

## Task 06 Sockets, Runes, and Soul Cores checkpoint

Task 06 formalizes socket state without inventing socket mechanics. Every item now has an internal deterministic socket-state record; empty/unverified state is preserved without manufacturing slots from the source `socketCount`. Explicit slots are typed (`empty` or `occupied`), indexed contiguously, carry stable inserted-item/source/effect/replacement fields, and reject malformed, duplicate, inconsistent, or over-cap payloads atomically. Save/load, undo snapshots, and concrete-base reset continue to clear or preserve socket state through the existing item-state path. The tooltip has a dedicated sockets section; production bases still report target-version socket limits and operations as unverified.

The normalized source retains **295 socketables** (type distribution: 221 Rune records, 34 Soul Cores, 35 Idols, four Abyssal Eyes, and one Congealed Mist; Rune classification totals 226 because five cross-type records are also classified as Runes). The authoritative registry retains **296 socketing definitions** including Artificer's Orb: **0 supported, 0 visible, 288 blocked_missing_data, and eight deprecated target-version records**. No socket-adding, insertion, replacement, extraction, Rune, or Soul Core mutation is enabled. All 1,760 concrete bases have a source `socketCount`, but none has verified default or maximum semantics; effect localization, class-target resolution, scaling, icons, version membership, and corruption transitions are incomplete, and no extraction method is present.

Task 06 deterministic boundary: **47/47 engine**, **124/124 UI**, **69/69 data**, normalized/currency/parity generators current, sync verification passing, and fixed-seed fuzz **30,016 operations / 3,984 meaningful mutations / 402 Hinekora consumptions / 0 exceptions / 0 invariant violations**, reviewed digest `68cf3661d60c39b202799fff940bab1070d3c24ebb396c55a6d7d9809c0b0b55`. Interactive direct-file browser verification remains blocked by the Codex browser's local-file URL policy; static file:// contracts and generated bundles pass. The service-worker cache is `poe2-craft-task06-sockets-runes-v1`.

The next numbered task is **Task 07 — Expedition and Temple/Atziri/Vaal systems**.

- Baseline deterministic suite against the original engine: **11/17 passed**. Failures covered the stale browser bundle, equipment limits, Magic-only classes, Alchemy count, Whittling ties, and Greater/Perfect semantics.
- Current deterministic suite: **39/39 passed** with `node validation.mjs`.
- Current UI DOM/CSS contract suite: **117/117 passed** with `node ui-validation.mjs`.
- Current normalized/registry-data suite: **67/67 passed** with `node data-validation.mjs`.
- Generated registry and parity checks passed with `node tools/build-currency-index.mjs --check` and `node tools/build-crafting-parity.mjs --check`.
- Seeded fuzz suite: **30,016 operations across 56 populated pools, 2,573 meaningful mutations, 206 Hinekora consumptions, 0 exceptions, and 0 invariant violations** with `node fuzz.mjs 30000 542026`. Reviewed digest: `46984d739488e00aea6bfd0664a34741306ec273e68542df96d574695f1f5104`. The intentional Task 02 digest change comes from deterministic schema-v3 concrete-base state being included for every pool.
- Syntax and patch checks: `node --check` for engine/UI scripts and `git diff --check` passed.
