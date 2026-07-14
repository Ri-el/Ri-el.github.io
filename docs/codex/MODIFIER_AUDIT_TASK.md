# Modifier Audit Task

Inspect the entire `Ri-el/Ri-el.github.io` repository and audit the modifier data and rolling system.

Do **not** fix only the reported `+Projectile Skills` tier display.

## Known symptoms

1. On an Absent Amulet, `+3 to Level of all Projectile Skills` is displayed as `S3`, although it should be the highest tier, `S1`.
2. Spirit appears suspiciously difficult to roll on amulets. Determine whether this is correct according to the source data or caused by an incorrect weight, overlay mapping, grouping, eligibility filter, or crafting algorithm.

First determine the repository's active target game version from its manifest/runtime data. Do not assume a version.

---

## Part 1 — Complete modifier-tier audit

Audit every modifier in:

- `data/bases/*.json`
- `data/shared/*.json`
- `data/normalized/modifiers.json`
- `data/runtime.data.js`
- modifier-overlay generation code
- `crafting.js`
- `app.js`
- `validation.mjs`
- UI tests

For every base, affix side, and modifier group, verify:

- Player-facing tier number
- Required item level
- Minimum and maximum values
- Legacy weight
- Normalized source spawn weight
- Effective runtime weight
- Prefix/suffix classification
- Modifier-group identity
- Source modifier-group identity
- Required, forbidden, and weighted tags
- Applicable item classes and concrete bases
- Item-level eligibility
- Greater/Perfect minimum-modifier-level behaviour
- Displayed tier after crafting
- Displayed tier after loading from stash

Specifically detect modifier groups where multiple semantic variants share the same required item level, such as:

- `+Melee Skills`
- `+Minion Skills`
- `+Projectile Skills`
- `+Spell Skills`

The array position or sequential row number must not be presented as the player-facing tier.

Expected examples:

- All `+3` skill variants at required item level 75 should display as tier 1.
- All `+2` variants at required item level 41 should display as tier 2.
- The `+1` variants should use the correct tier according to their own required levels.

Search for this same structural error in every other modifier group and every other base.

Do not blindly overwrite the existing `tier` field if engine mechanics or saved-item compatibility currently rely on it. Prefer a clearly named field such as:

- `displayTier`
- `sourceTier`
- `normalizedTier`

Use stable modifier IDs for identity.

---

## Part 2 — Spirit probability investigation

Investigate the `BaseSpirit` modifier group on amulets.

The legacy amulet data currently appears to contain:

| Spirit roll | Required item level | Weight |
|---|---:|---:|
| 47–50 Spirit | 54 | 400 |
| 43–46 Spirit | 46 | 500 |
| 38–42 Spirit | 33 | 500 |
| 34–37 Spirit | 25 | 500 |
| 30–33 Spirit | 16 | 500 |

Verify these values against the normalized source.

Print the actual effective runtime data for each Spirit tier after applying the source modifier overlay:

- Stable modifier ID
- Source key
- Source modifier-group ID
- Display tier
- Required item level
- Legacy weight
- Normalized spawn weight
- Final effective weight
- Applicable tags
- Whether the overlay matched uniquely

Check whether any `BaseSpirit` overlay row:

- Failed to match
- Matched multiple normalized modifiers
- Received a null spawn weight
- Falls back incorrectly to legacy data
- Is excluded by a tag condition
- Is merged into the wrong group
- Is blocked when another unrelated modifier exists

---

## Part 3 — Exact odds

Create a deterministic audit utility that calculates exact probabilities rather than relying only on Monte Carlo simulation.

For an item-level 83 Absent Amulet, calculate the probability of rolling:

- Any Spirit tier
- T1 Spirit specifically
- `+1`, `+2`, and `+3 Projectile Skills`
- Every other prefix and suffix group

Calculate these probabilities for:

- Orb of Transmutation
- Orb of Augmentation
- Regal Orb
- Exalted Orb
- Chaos Orb
- Greater Chaos Orb
- Perfect Chaos Orb
- Directional prefix/suffix variants where supported
- An empty item
- An item with existing affixes that block modifier groups

The calculation must account for:

- Available prefix and suffix slots
- Existing modifier-group exclusions
- All eligible tiers
- Effective runtime weights
- Source modifier-group identities
- Minimum-modifier-level filtering
- The rule preserving the highest eligible tier when a modifier group has no tier above the currency floor

For each target, show:

- Probability per applicable roll
- Expected number of rolls, `1 / p`
- Chance of failing after 10 attempts
- Chance of failing after 50 attempts
- Chance of failing after 100 attempts
- Chance of failing after 181 attempts
- Exact eligible-pool denominator
- Every candidate contributing to that denominator

Verify mathematically that the current two-stage selection:

1. Select a modifier group by its summed tier weights.
2. Select a tier inside that group by tier weight.

produces the same probability as selecting directly from all eligible tier candidates.

Add a regression test proving this.

---

## Part 4 — Report before fixing

Before editing, produce a concise diagnosis containing:

1. Confirmed tier-display errors
2. Other modifier groups affected by the same problem
3. Spirit's exact effective probability
4. Whether Spirit is intentionally rare or incorrectly implemented
5. Any overlay failures or weight mismatches
6. Proposed files to change
7. Save migration or compatibility risks

Then implement only evidence-supported fixes.

---

## Part 5 — Required tests

Add regression tests covering at minimum:

- [ ] `+3 Projectile Skills` displays `S1`
- [ ] `+2 Projectile Skills` displays `S2`
- [ ] `+1 Projectile Skills` displays its correct tier
- [ ] `+3 Melee Skills` displays `S1`
- [ ] `+3 Minion Skills` displays `S1`
- [ ] `+3 Spell Skills` displays `S1`
- [ ] Every modifier's displayed tier agrees with normalized source ranking
- [ ] No modifier group has inconsistent tiers for identical required levels unless explicitly justified
- [ ] Spirit effective weights match the normalized source
- [ ] Exact Spirit probability matches a seeded large-sample simulation within a reasonable tolerance
- [ ] Greater/Perfect currencies preserve the highest eligible Spirit tier when the minimum-modifier-level exception applies
- [ ] Stash save/load retains the corrected display tier
- [ ] Whittling continues comparing required modifier level, not display tier

---

## Required reports

Generate:

- `reports/modifier-audit.json`
- `reports/modifier-audit.md`

The reports must include all detected mismatches, not only the ones fixed.

---

## Acceptance checklist

- [ ] Audit all legacy and normalized modifier tiers
- [ ] Audit all modifier weights and effective runtime weights
- [ ] Calculate exact Spirit odds
- [ ] Calculate exact odds for all amulet modifier groups
- [ ] Report findings before editing
- [ ] Fix player-facing tier display
- [ ] Preserve engine behaviour and save compatibility
- [ ] Add regression tests
- [ ] Generate audit reports
- [ ] Run the repository's full validation and UI test suite

---

## Instruction to Codex

Read this file completely, inspect the repository, produce the requested diagnosis before editing, then implement and test the fixes.
