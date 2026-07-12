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
- Authoritative registry definitions: **531**
- Visible workbench definitions: **37**
- Existing runtime definitions preserved: **37**
- Unclassified entries: **0**

## Disabled existing registry entries

- `omen-sovereign` — Omen of the Sovereign: Mechanic blocked because the exact target-version Omen of the Sovereign Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-liege` — Omen of the Liege: Mechanic blocked because the exact target-version Omen of the Liege Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-blackblooded` — Omen of the Blackblooded: Mechanic blocked because the exact target-version Omen of the Blackblooded Lich-type modifier guarantee and applicable modifier table are not verified.
- `essence-breach` — Essence of the Breach: Mechanic blocked because the exact target-version Essence of the Breach Caster/Minion modifier mapping, applicable item classes, and replacement behavior are not verified.

## Runtime identities missing from normalized item names

- `hinekora` — Hinekora's Lock

A missing normalized identity does not disable an already verified handler; it is recorded so future source imports can reconcile the stable item ID.
