# PoE2 0.5.4 UI and Crafting Validation

Validated against the repository's converted Craft of Exile dataset and Grinding Gear Games' published [0.5.0 item changes](https://www.pathofexile.com/forum/view-thread/3932540), [0.5.4 patch notes](https://www.pathofexile.com/forum/view-thread/3975218), [0.5.4 hotfix](https://www.pathofexile.com/forum/view-thread/3975342), and [0.5.4 hotfix 2](https://www.pathofexile.com/forum/view-thread/3976201). The 0.5.4 notes and hotfixes do not replace the relevant 0.5.0 core currency rules.

## UI root cause and fix

The dark section was not a modal or backdrop. Browser inspection showed the Well of Souls modal was hidden with a zero-sized rectangle and `display: none`. The effective cause was sticky positioning in the workbench/right-rail layout: the pinned crafting columns remained in the viewport after their grid row, while the later Desecration/Omens content entered the same paint area. With automatic z-index values, the later DOM sibling painted over the item controls.

The fix returns the affected rail/panels to normal document flow (`position: relative; top: auto`). This corrects the stacking lifecycle rather than hiding content, forcing a height, or raising one panel above another with z-index.

The overlap correction was exercised in Chrome-compatible browser checks at 100% scale at 1299x665, 1920x1080, and 2560x1440. There was no panel intersection or horizontal overflow. Craft/apply, undo, item tooltip, 24 stash slots, save/load state, scrolling, and button hit targets remained functional.

The final package adds the in-game-inspired three-column workbench in `overhaul.css`, loaded after every legacy stylesheet: a currency stash tab on the left, active item in the centre, item stash on the right, and Omens in the following grid row. It also restores click/tap currency pickup alongside right-click and drag-and-drop. A dependency-free UI contract suite verifies that the affected panels stay in normal flow, the mobile legacy fixed drawer is cancelled, the modal starts hidden, the stylesheet order is correct, and the selection/stash interactions remain wired. The cloud Chrome session used during the final packaging continuation rejected access to the local server, so that final visual layer could not be re-screenshot in that continuation; the earlier cross-resolution overlap checks and the repeatable DOM/CSS checks are reported separately rather than conflated.

The project documents direct `index.html` use as its normal launch path. `serve.ps1` is optional for HTTP/PWA testing. PowerShell was not available in the Linux test environment, so the same static-file and MIME behaviour was exercised through a local HTTP server. All core HTML, CSS, JavaScript, data, manifest, and icon requests loaded without a JavaScript exception. Missing optional category/Omen PNGs return 404 and use the app's text/monogram fallback; these were not the overlay cause.

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

- The converted data has 61 class-level files, 56 populated. It has no concrete base IDs, item-class metadata, base tags, attribute requirements, or per-base requirements/limits. Exact base-specific and tag-dependent eligibility cannot be reconstructed from the current conversion.
- Eight populated pools have every weight collapsed to `1`: `body_armours_str_dex_int`, `claws`, `daggers`, `flails`, `one_hand_axes`, `one_hand_swords`, `two_hand_axes`, and `two_hand_swords`. Their probabilities are equalised and cannot be certified against 0.5.4 until the weights are re-imported from the source export.
- All 700 Desecrated entries lack numeric modifier levels. Whittling therefore cannot accurately compare a revealed Desecrated modifier with ordinary modifiers; the engine conservatively ranks unknown levels last.
- Desecrated pools are empty for `sceptres`, `life_flasks`, `mana_flasks`, and `charms`.
- `diamond` and all four `time_lost_*` jewel pools are empty and not selectable.
- Essence of the Breach is still a hard-coded no-op, and generic enforcement of the 0.5.4 one-crafted-modifier rule is not implemented.
- Well of Souls options are deliberately selected uniformly in the current engine rather than by configured weight.
- 0.5.0 added concrete Ring, Amulet, and Belt base types and two Amulet bases with reduced prefix/suffix capacity. The class-level conversion cannot distinguish those bases.

Every one of the 56 currently selectable populated class/attribute pools constructs and accepts a valid basic craft without an exception. That is not the same as supporting every concrete base available in PoE2 0.5.4.

## Repeatable results

- Baseline deterministic suite against the original engine: **11/17 passed**. Failures covered the stale browser bundle, equipment limits, Magic-only classes, Alchemy count, Whittling ties, and Greater/Perfect semantics.
- Corrected deterministic suite: **17/17 passed** with `node validation.mjs`.
- UI DOM/CSS contract suite: **21/21 passed** with `node ui-validation.mjs`.
- Seeded fuzz suite: **30,016 operations across 56 populated pools, 0 exceptions, 0 invariant violations** with `node fuzz.mjs 30000 542026`.
- Syntax and patch checks: `node --check` for engine/UI scripts and `git diff --check` passed.
