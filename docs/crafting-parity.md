# Crafting parity

Target game version: **0.5.4**  
Full parity claimed: **No**

This is the Task 02 checkpoint. Generic concrete-base selection and item-state migration change identity, applicability metadata, and persistence; they do not change any crafting-item classification or currency mechanic.

The complete retained source inventory remains `data/crafting/currency-index.json`, where all 530 records have an exclusive classification and the 37 existing runtime definitions are overlaid by stable craft ID. `reports/crafting-parity.json` records the checkpoint counts without duplicating or weakening that inventory.

| Classification | Source inventory | Runtime registry |
|---|---:|---:|
| implemented | 31 | 32 |
| conditional | 0 | 0 |
| non_item_currency | 0 | 0 |
| blocked_missing_data | 489 | 4 |
| probability_unverified | 1 | 1 |
| intentionally_out_of_scope | 0 | 0 |
| deprecated_for_target_version | 9 | 0 |

Task 02 parity delta: **0 crafting-item statuses changed**.

This checkpoint deliberately does not claim that `currency-index.json` already satisfies the final per-entry parity contract. Task 03 must add authoritative applicability, handler, target-version evidence, verification, test reference, and blocker fields while generating the runtime inventory from the registry. Until that work and the later mechanic tasks are complete, the `blocked_missing_data` and `probability_unverified` records remain explicit blockers.
