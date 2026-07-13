# Crafting parity

Target game version: **0.5.4**  
Full parity claimed: **No**

## Task 06 Sockets, Runes, and Soul Cores checkpoint

The registry remains **531 definitions** for target **0.5.4**. Socketing retains **296 definitions** (Artificer's Orb plus 295 socketables), all hidden and unsupported: **288 blocked_missing_data** and **eight deprecated_for_target_version** records. No socketing mutation is claimed or enabled.

Item state now exposes deterministic empty/preserved-unverified socket state with contiguous typed slots and atomic malformed-state validation. The tooltip renders sockets separately from explicit affixes. Source `socketCount` remains metadata only because all 1,760 bases lack verified default/maximum semantics. Artificer's Orb lacks exact caps, class applicability, corruption behavior, and mutation details; Rune/Soul Core effects lack complete target-class resolution, localization, scaling, icons, and version membership; no extraction/removal method is retained. Consequently implemented socket currency, Rune, Soul Core, replacement, and extraction counts remain **zero**.

## Task 05 Abyss, Breach, Essences, and Omens checkpoint

The registry remains **531 definitions** for target **0.5.4** and the visible surface is intentionally unchanged at **45 cards**. Task 05 adds no speculative controls: the existing Preserved Cranium/Well of Souls and Essence of the Abyss controls remain the only supported Abyss operations, while the other retained Bones, regular/Breach Essences, Catalysts, and unverified Lich guarantees remain blocked with their source-specific reasons.

The supported Abyss metadata now declares Preserved Cranium and the four Desecration-direction/selection Omens as **Jewel-only**. Essence of the Abyss declares the 27 normalized equipment classes and rejects Jewel, Flask, and Charm targets. The engine rejects unknown Bones and simultaneous Sinistral/Dextral Necromancy Omens atomically, and Omen of Light requires a revealed Desecrated modifier and is consumed exactly once on a successful guarded Annulment (including Hinekora foresight). The UI uses the engine-returned reroll count for Abyssal Echoes.

The checked-in Desecrated pool is explicitly a PoE2 **0.3** jewel pool and lacks a complete target **0.5.4** Well-of-Souls weighting/localization procedure. Its option selection therefore remains a limited compatibility path, not a full parity claim. Echoes consumption timing is likewise retained as an explicit verification blocker because the source identifies the reroll action but not the exact consumption event.

## Task 04 core and quality checkpoint

The generated registry remains **531 definitions** for target version **0.5.4**. It now renders **45 visible cards**: the original 37 authored runtime controls plus eight disabled quality audit cards from retained normalized records. The eight cards are disabled with specific blockers and expose no handlers; their presence does not claim quality-mechanic parity.

Task 04 corrections are reflected in runtime and parity metadata: Alchemy is Normal-only, Annulment and Divine require non-Normal rarity, mirrored items are immutable, and Vaal Orb is visible but blocked because target-version outcome transitions/probabilities are unverified. Structured quality state now includes `amount`, `type`, `source`, and `cap`; ordinary quality formulas and Vaal Infuser mutations remain blocked. `fullParityClaim` remains false.

## Task 03 authoritative-registry checkpoint

`data/crafting/currency-index.json#craftRegistry` is the authoritative crafting-item registry. It contains all **530** retained normalized crafting items plus the existing runtime-only Hinekora's Lock definition, for **531** stable definitions. Exactly **37** definitions remain visible in this task, preserving the existing crafting surface while presentation and dispatch move to generated registry data.

Every definition records stable identity, target version, equipment relevance, category and tab, applicability and disabled-reason identifiers, operation handler, Omen trigger metadata, corruption/quality/socket restrictions, source evidence, implementation and verification status, deterministic fixture references, and an explicit blocker where evidence is incomplete.

| Classification | Retained source | Complete registry | Visible definitions |
|---|---:|---:|---:|
| implemented | 31 | 32 | 32 |
| conditional | 0 | 0 | 0 |
| non_item_currency | 0 | 0 | 0 |
| blocked_missing_data | 489 | 489 | 4 |
| probability_unverified | 1 | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 | 0 |
| deprecated_for_target_version | 9 | 9 | 0 |

The visible definitions remain distributed across the existing behavior-bearing tabs:

| Tab | Visible definitions |
|---|---:|
| Currency | 20 |
| Ritual / Omens | 13 |
| Abyss | 2 |
| Breach / Genesis | 1 |
| Corruption / Sacrifice | 1 |

The complete registry category inventory is:

| Registry category | Definitions |
|---|---:|
| Currency | 20 |
| Quality | 8 |
| Socketing / Augments | 296 |
| Ritual / Omens | 38 |
| Essences | 76 |
| Abyss | 12 |
| Breach / Genesis | 28 |
| Delirium / Instilling | 26 |
| Runeforging | 19 |
| Corruption / Sacrifice | 8 |

Task 03 parity delta: **0 crafting-item implementation statuses changed**. This task centralizes definitions, generated inventory presentation, exact disabled reasons, and the operation-dispatch contract without enabling unverified mechanics.

## Explicit blockers

- Hinekora's Lock remains implemented for compatibility, but the checked-in normalized export contains no matching source item ID or metadata key. Its runtime-only identity remains explicit.
- The retained public data does not verify Vaal outcome probabilities, so Vaal Orb remains `probability_unverified`.
- `blocked_missing_data` records remain unavailable until Tasks 04-07 can verify their exact target-version applicability and mutation behavior.
- Deprecated target-version records remain in the audit inventory but are not rendered as active crafting controls.

`reports/crafting-parity.json` is generated directly from the registry. It keeps `fullParityClaim: false` and copies registry applicability, handlers, evidence, fixtures, verification states, and blockers without reconstructing mechanics from source tags or descriptions.
