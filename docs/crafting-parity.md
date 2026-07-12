# Crafting parity

Target game version: **0.5.4**  
Full parity claimed: **No**

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
