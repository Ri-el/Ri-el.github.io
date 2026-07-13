# Currency coverage

Target game version: **0.5.4**

This report is generated from `data/crafting/currency-index.json`. Classification is exclusive; every retained item has exactly one status.

| Classification | Source inventory | Runtime registry |
|---|---:|---:|
| implemented | 45 | 46 |
| conditional | 0 | 0 |
| non_item_currency | 3 | 0 |
| blocked_missing_data | 472 | 4 |
| probability_unverified | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 |
| deprecated_for_target_version | 9 | 0 |

- Total source inventory entries: **530**
- Authoritative registry definitions: **531**
- Visible workbench definitions: **522**
- Existing runtime definitions preserved: **51**
- Unclassified entries: **0**

## Disabled existing registry entries

- `omen-sovereign` — Omen of the Sovereign: Mechanic blocked because the exact target-version Omen of the Sovereign Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-liege` — Omen of the Liege: Mechanic blocked because the exact target-version Omen of the Liege Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-blackblooded` — Omen of the Blackblooded: Mechanic blocked because the exact target-version Omen of the Blackblooded Lich-type modifier guarantee and applicable modifier table are not verified.
- `essence-breach` — Essence of the Breach: Mechanic blocked because a Ring or Amulet receives a +20% Maximum Quality Prefix, but full-Prefix-side removal behavior and runtime quality-cap derivation from that explicit modifier are not encoded.

## Runtime identities missing from normalized item names

- `hinekora` — Hinekora's Lock

A missing normalized identity does not disable an already verified handler; it is recorded so future source imports can reconcile the stable item ID.
