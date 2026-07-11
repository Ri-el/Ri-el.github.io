# Currency coverage

Target game version: **0.5.4**

This report is generated from `data/crafting/currency-index.json`. Classification is exclusive; every retained item has exactly one status.

| Classification | Source inventory | Runtime registry |
|---|---:|---:|
| implemented | 31 | 32 |
| conditional | 0 | 0 |
| non_item_currency | 0 | 0 |
| blocked_missing_data | 489 | 4 |
| probability_unverified | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 |
| deprecated_for_target_version | 9 | 0 |

- Total source inventory entries: **530**
- Existing runtime definitions preserved: **37**
- Unclassified entries: **0**

## Disabled existing registry entries

- `omen-sovereign` — Omen of the Sovereign: Visible registry entry omen-sovereign remains disabled until its exact target-version mutation is verified.
- `omen-liege` — Omen of the Liege: Visible registry entry omen-liege remains disabled until its exact target-version mutation is verified.
- `omen-blackblooded` — Omen of the Blackblooded: Visible registry entry omen-blackblooded remains disabled until its exact target-version mutation is verified.
- `essence-breach` — Essence of the Breach: Visible registry entry essence-breach remains disabled until its exact target-version mutation is verified.

## Runtime identities missing from normalized item names

- `hinekora` — Hinekora's Lock

A missing normalized identity does not disable an already verified handler; it is recorded so future source imports can reconcile the stable item ID.
