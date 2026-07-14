# Currency coverage

Target game version: **0.5.4**

This report is generated from `data/crafting/currency-index.json`. Classification is exclusive; every retained item has exactly one status.

| Classification | Source inventory | Runtime registry |
|---|---:|---:|
| implemented | 414 | 415 |
| conditional | 0 | 0 |
| non_item_currency | 3 | 0 |
| blocked_missing_data | 103 | 6 |
| probability_unverified | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 |
| deprecated_for_target_version | 9 | 0 |

- Total source inventory entries: **530**
- Authoritative registry definitions: **531**
- Visible workbench definitions: **522**
- Existing runtime definitions preserved: **422**
- Unclassified entries: **0**

## Disabled existing registry entries

- `omen-sovereign` — Omen of the Sovereign: Mechanic blocked because the exact target-version Omen of the Sovereign Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-liege` — Omen of the Liege: Mechanic blocked because the exact target-version Omen of the Liege Lich-type modifier guarantee and applicable modifier table are not verified.
- `omen-blackblooded` — Omen of the Blackblooded: Mechanic blocked because the exact target-version Omen of the Blackblooded Lich-type modifier guarantee and applicable modifier table are not verified.
- `socketable-5111` — Ancient Rune of Animosity: The only retained applicability is Talisman (source item-class enum 109), but the normalized target data and workbench contain no selectable Talisman concrete base.
- `socketable-5200` — Legacy of Amor Mandragora: The only retained applicability is Talisman (source item-class enum 109), but the normalized target data and workbench contain no selectable Talisman concrete base.
- `socketable-5201` — Legacy of Spiteful Floret: The only retained applicability is Talisman (source item-class enum 109), but the normalized target data and workbench contain no selectable Talisman concrete base.

## Runtime identities missing from normalized item names

- `hinekora` — Hinekora's Lock

A missing normalized identity does not disable an already verified handler; it is recorded so future source imports can reconcile the stable item ID.

## Supplied PoE2DB catalogue cross-check

The attached focused ModsView catalogue has **60/60** metadata-keyed Currency/Omen records represented in this registry. The broader autocomplete asset has **71** search-only labels absent from the normalized inventory (59 Stackable Currency and 12 Omen records); none occurs in the focused modifier-crafting catalogue, and autocomplete alone does not encode enough identity or mechanics to promote them. See `reports/poe2db-data-sources.md` for the complete list and evidence boundary.
