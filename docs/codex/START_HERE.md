# Codex Task Pack — Start Here

This folder divides the Oishy Crafting Forge expansion into focused tasks.

## Files

1. `MASTER_ROADMAP.md` — overall product direction and architecture
2. `01_IN_WORKBENCH_BASE_SELECTOR.md` — concrete base selection inside the workbench
3. `02_ITEM_STATE_AND_BASE_DATA.md` — concrete-base data and generic item state
4. `03_CRAFTING_REGISTRY.md` — authoritative data-driven crafting registry
5. `04_CORE_AND_QUALITY_CURRENCY.md` — core currency and quality systems
6. `05_ABYSS_BREACH_OMENS.md` — Abyss, Breach, Essences, and Omens
7. `06_SOCKETS_RUNES_SOUL_CORES.md` — sockets, Runes, and Soul Cores
8. `07_EXPEDITION_TEMPLE_ATZIRI.md` — Expedition and Temple/Atziri systems
9. `TESTING_AND_ACCEPTANCE.md` — cross-task validation requirements

## How to use this pack

For each Codex session:

1. Ensure the local repository is selected.
2. Tell Codex to read `AGENTS.md`.
3. Tell Codex to read `MASTER_ROADMAP.md`.
4. Tell Codex to read only the current numbered task file.
5. Tell Codex to read `TESTING_AND_ACCEPTANCE.md`.
6. Ask Codex to implement only that task.
7. Do not let Codex begin the next task until the current task is tested.

## First Codex message

```text
Read AGENTS.md first.

Then read:

- docs/codex/MASTER_ROADMAP.md
- docs/codex/01_IN_WORKBENCH_BASE_SELECTOR.md
- docs/codex/TESTING_AND_ACCEPTANCE.md

Implement task 01 only.

Do not redesign the outer item-class selection screen.
Clicking Amulets must continue opening the crafting workbench immediately.
Concrete Amulet selection must happen inside the crafting workbench.

Inspect the current implementation and preserve existing changes.
Run the required tests.
Do not push anything.
Do not begin task 02.
```

## Later task example

```text
Read AGENTS.md, docs/codex/MASTER_ROADMAP.md,
docs/codex/02_ITEM_STATE_AND_BASE_DATA.md, and
docs/codex/TESTING_AND_ACCEPTANCE.md.

Review the completed task 01 implementation.
Implement task 02 only.
Do not redo task 01 unless a failing test proves a correction is required.
Do not push anything.
```
