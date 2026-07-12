# PoE2 Crafting Simulator

A click-and-play **Path of Exile 2 crafting *emulator*** (not a probability calculator). Double-click `index.html` to play — no server, no install, no terminal needed. Works offline and on a locked-down office laptop.

This README explains **what every file does** and **where to look when something breaks** — written so a human *or* an AI assistant can pick it up cold.

---

## ▶️ Quick start

- **Play it:** double-click `index.html`.
- **Changed mod data:** double-click `build.cmd` (home PC only), then open `index.html`.
- **Upload to GitHub:** double-click `push.cmd` (home PC only) → pushes to `Ri-el/Ri-el.github.io`.

> The app reads compiled `.data.js` files (because `file://` can't fetch raw `.json`). After editing any JSON you MUST run `build.cmd` to recompile, or the app won't see your change.

---

## 🗺️ Architecture in one paragraph

You edit **one small JSON file per base item** in `data/bases/` (e.g. `ruby.json`, `helmets_str.json`). `build.cmd` runs `build_data.ps1`, which validates those files and compiles local browser-loadable `.data.js` bundles. `app.js` reads those globals and hands the selected pool to `crafting.js`; no external site is contacted at runtime, so direct `file://` use still works. The workbench's ten tabs and 37 visible crafting controls are generated from the browser form of one 531-definition registry. Repository-owned normalized source data, provenance, and the classified crafting inventory are kept separately so development-time validation does not depend on `../upload/data.json`.

---

## 📄 App files (the stuff that runs the simulator)

| File | What it does | Look here when… |
|---|---|---|
| `index.html` | The page itself. Loads every script/style in order. The `<script>` tags at the bottom decide what code runs. | A file you added isn't loading, or you need to add a new script/style tag. |
| `app.js` | **Boot + UI glue.** Wraps everything in an IIFE (`window.CraftingEngine`), reads the compiled data, generates crafting tabs/cards from the authoritative registry, and routes pointer, keyboard, context-menu, and drag interactions through shared validation/dispatch. It also owns the cursor orb, animations, stash, and ALT tier tooltips. | Buttons/clicks/tooltips/animations misbehave, or data isn't loading into the UI. |
| `crafting.js` | **The crafting engine (the rules).** Currency behavior lives here — Transmute, Augment, Regal, Exalt, Chaos, Annul, Alchemy, Divine, Vaal, Essence of the Abyss, Desecrate, plus prefix/suffix caps and tier rolling. Item-state schema v3 keeps concrete identity, structured quality/socket placeholders, and versioned legacy migration without enabling unverified mechanics. | An orb does the wrong thing, mods roll incorrectly, or affix caps are off. **Engine bugs live here, NOT in the data files.** |
| `select.js` | **Item-class menu and workbench base selector.** Defines the outer category tree without inserting a concrete-base screen. Inside the workbench one generic normalized picker serves every non-Jewel class; Jewels retain Ruby/Sapphire/Emerald controls. It owns search, filters, keyboard behavior, and reset confirmation. | A class/category is missing, or the in-workbench base picker misbehaves. |
| `style.css` | Main look — item tooltip, stash panel, dark PoE2 theme, layout. | General visual styling. |
| `overhaul.css` | Final in-game-inspired layout layer: three-column workbench, currency stash tab, item stash, Omens row, and responsive selection screen. | Current UI layout and visual polish. |
| `header-fix.css` | Versioned workbench-header, concrete-base dialog, confirmation, and concrete tooltip-detail styles loaded locally by `select.js`. | The workbench selector, its mobile drawer, or concrete details look wrong. |
| `desecrate.css` | Styling specific to the Desecrate / abyssal-bones overlay feature. | The desecrate panel looks wrong. |
| `select.css` | Styling for the item-picker menu only. | The category picker looks wrong. |
| `sw.js` | Service worker — caches files so the app works offline / installs as a PWA. | Offline mode or "install app" behaves oddly (or stale cache after an update). |
| `manifest.json` | PWA metadata (app name, icons, colors) so it can install to desktop/phone. | Install name/icon is wrong. |

---

## 🧱 Data files

| File / folder | What it does | Look here when… |
|---|---|---|
| `data/bases/*.json` | **The converted Craft of Exile mod data — one file per supported item class (61 files).** 56 are populated; Diamond and the four Time-Lost jewel files are empty. Each file is self-contained: `{ name, attribute?, prefixes:[], suffixes:[] }`. | A specific class has wrong/missing mods — open just that file. **Wrong weighting or a missing modifier = a data-conversion/data bug, fix it here.** |
| `data/mods.data.js` | **Auto-generated.** `build_data.ps1` bundles every `data/bases/*.json` into this one file (`window.MOD_BASES["<id>"] = {...}`). The app loads this, not the raw JSON. | Never edit by hand. If it's stale/missing, run `build.cmd`. |
| `data/desecrated-mods.json` | Source data for the Desecrate (abyssal bone) feature — one shared jewel pool (Lightless prefixes + of-the-Abyss suffixes), keyed under `jewelTypes` and gated by `bones` (only `preserved_cranium` is valid for jewels). Hand-editable. | Desecrate offers wrong mods. |
| `data/desecrated-mods.data.js` | **Auto-generated** browser version of the above (built by `build_data.ps1`). | Don't edit by hand; rebuild instead. |
| `data/normalized/*.json` | Repository-owned normalized base, modifier, crafting-item, and Essence records plus a version manifest and output hashes. `base-items.json` retains 1,760 concrete records; Task 02 exposes the 1,743 records mapped to populated compiled pools and documents every remaining blocker. | A source mapping, concrete-base identity, or normalized reference fails validation. |
| `data/normalized.data.js` | **Auto-generated** `file://` wrapper for the normalized records. | Never edit by hand; run the build. |
| `data/source-cache/` | Source policy and provenance for the normalized data. The manifest explicitly records that the legacy raw export is unavailable rather than fabricating a fixture. | Auditing source identity, target version, parser version, or hashes. |
| `data/crafting/runtime-registry.json` | Hand-authored tab metadata and the 37 existing visible runtime definitions. It references normalized records by exact source ID and metadata key, never by display-name matching. | Changing a verified visible craft's presentation or declarative runtime binding. |
| `data/crafting/currency-index.json` | **Generated authoritative registry.** It audits all 530 retained source records plus runtime-only Hinekora's Lock: 531 unique definitions, ten tabs, 37 visible controls, exact blockers, evidence, fixtures, applicability, and handlers. | Adding or auditing a crafting item. Generate it with `tools/build-currency-index.mjs`. |
| `data/crafting/quality-rules.json` | Attributed 0.5.4 quality target/cap data and explicit blocked reasons for rules whose exact formula is unavailable. | Reviewing quality support; this file is not permission to enable a button without an engine operation and tests. |

### The 61 base files at a glance
- **Populated (56):** Ruby/Emerald/Sapphire jewels; all compiled armour attribute combinations; jewellery; off-hands; one- and two-handed weapons; flasks and charms. They map to 1,743 surfaced concrete records; two unmodifiable Gloves are visible but disabled.
- **Empty and not selectable (5):** `diamond`, `time_lost_ruby`, `time_lost_emerald`, `time_lost_sapphire`, `time_lost_diamond`.
- These are **simulator modifier pools**, not concrete in-game base types. Concrete IDs, tags, properties, and implicits live separately in normalized data. Attribute family is a selector filter, never an item identity. Eleven all-attribute armour/shield records have normalized mappings but no compiled pool; five empty Jewel pools and unmapped Timeless Jewel ID `613` are also explicit blockers. Required levels, per-base icons, maximum/default socket semantics, localized implicit templates, and some inherent-skill/property data remain unavailable. Fixed sourced prefix/suffix-cap implicit deltas and concrete-tag eligibility are enforced; unverified effects are not guessed.
- Eight populated pools contain only binary/equal fallback weights: `body_armours_str_dex_int`, `claws`, `daggers`, `flails`, `one_hand_axes`, `one_hand_swords`, `two_hand_axes`, and `two_hand_swords`. They now carry `weightStatus: "unverified"` with source/version metadata. The app is an emulator, not a statistically accurate probability calculator for those pools.

### Quality support at the current checkpoint

- **Implemented infrastructure:** structured item state `quality: { amount, type, source }`, migration of legacy numeric/missing values, target-class definitions, the normal 20% cap record, and explicit evidence/status metadata.
- **Not runtime-enabled:** Armourer's Scrap, Blacksmith's Whetstone, Arcanist's Etcher, and Glassblower's Bauble. Their valid target classes are known, but the exact Path of Exile 2 0.5.4 item-level increment formula is not present in the retained sources, so the data marks them `blocked_missing_formula`.
- **Verified rule but not end-to-end implemented:** Gemcutter's Prism has a fixed +5% rule in the data, but the simulator has no Skill Gem item model or quality operation/UI, so it remains unavailable.
- **Unsupported:** Catalysts and other alternate-quality mechanics. They require their own verified mutations and supporting tables.

No quality currency button is enabled merely from a known description.

---

## 🛠️ Build & tooling files

| File | What it does | Notes |
|---|---|---|
| `build.cmd` | **Double-click to rebuild.** Runs `build_data.ps1` via PowerShell. | Home PC only (office laptops block PowerShell). Run after editing any JSON. |
| `build_data.ps1` | The actual build script: validates and bundles base/Desecration data, rebuilds normalized and crafting browser bundles, then refreshes registry parity reports. Writes UTF-8 (no BOM). | Edit only if the build process itself needs to change. |
| `tools/build-normalized-data.mjs` | Rebuilds `data/normalized.data.js` from repository-owned normalized JSON. | Run through the normal build. |
| `tools/build-currency-index.mjs` | Rebuilds the 530-entry source inventory, complete 531-definition registry, classic-script browser wrapper, and coverage report. `--check` fails if generated files are stale. | Development-time only; no runtime fetches. |
| `tools/build-crafting-parity.mjs` | Projects `reports/crafting-parity.json` directly from the authoritative registry without inferring missing mechanics; `docs/crafting-parity.md` explains that generated report. | Run after registry or classification changes. |
| `tools/sync-poe2-data.mjs` | Staging-only public-source sync/import utility with HTTPS/public-host checks, rate limits, response limits, hashes, and provenance. `verify` validates the active repository snapshot without downloading. | New fetches are candidates; they do not auto-promote runtime data. |
| `push.cmd` | **Double-click to upload everything to GitHub.** Inits git if needed, then force-pushes the whole folder to `Ri-el/Ri-el.github.io` (`main`). | Home PC only. Force-push overwrites the old version on GitHub — pull/sync first if the repo changed elsewhere. |
| `serve.ps1` | Optional: starts a tiny local web server (only needed if you ever want to test PWA/service-worker features that `file://` can't do). | Not needed for normal play. |
| `.gitignore` | Tells git which files to skip (OS junk, `node_modules/`, the dev-only generator). | — |

---

## 🤖 Dev-only / not shipped

| File | What it does |
|---|---|
| `_scaffold_data.mjs` | One-off Node generator that split the jewel data into per-base files and created the empty scaffolds. Already done its job; kept for reference. Git-ignored. |
| `fuzz.mjs` | **Node fuzz / regression harness for the crafting engine.** It treats malformed data, engine exceptions, malformed item state, zero meaningful mutations, invariant violations, and fixed-seed digest drift as fatal. The reviewed Task 02 checkpoint is `node fuzz.mjs 30000 542026`: 30,016 operations, 2,573 meaningful mutations, 206 Hinekora consumptions, digest `46984d739488e00aea6bfd0664a34741306ec273e68542df96d574695f1f5104`. The intentional digest change comes from attaching deterministic schema-v3 concrete-base state to every populated pool. |
| `validation.mjs` | Deterministic 0.5.4-oriented engine/data regression suite, including injectable crafting RNG, generic concrete identity/state migration, source overlays, base-specific tags/affix limits, structured quality/socket preservation, and all 56 populated pools. Current checkpoint: **39/39**. |
| `ui-validation.mjs` | Dependency-free DOM/CSS contract checks for generated registry tabs/cards, shared dispatch, filters, accessibility, the workbench grid, concrete-base flow, and stash markup. Current checkpoint: **114/114**. |
| `data-validation.mjs` | Validates normalized schemas, all 1,760 concrete records, the complete crafting registry/parity projection, 31-class base parity, provenance, hashes, browser bundles, and explicit blockers using only repository-owned files. Current checkpoint: **67/67**. |

### Validation commands

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-normalized-data.mjs --check
node tools/build-currency-index.mjs --check
node tools/build-crafting-parity.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

The Task 03 checkpoint passes **39/39 engine**, **114/114 UI**, and **67/67 data** checks. The fixed-seed fuzz run remains unchanged and passes with zero exceptions, harness errors, or invariant violations.

---

## 🧭 "Something's wrong" cheat sheet

- **An orb / currency behaves wrong, caps wrong, tiers wrong** → `crafting.js` (engine logic).
- **A specific item has wrong or missing mods** → that one file in `data/bases/` (data), then run `build.cmd`.
- **Clicks, tooltips, animations, cursor orb, stash UI** → `app.js`.
- **A category won't appear or won't select** → `select.js` (check `status`, flip `'soon'`→`'active'`).
- **Visuals/layout** → `style.css` (main), `select.css` (menu), `desecrate.css` (desecrate panel).
- **Edited JSON but nothing changed in the app** → you forgot to run `build.cmd` (the app reads the compiled `.data.js`, not raw JSON).
- **Offline/install issues or stale content after update** → `sw.js` (service worker cache).

---

## ➕ Adding a new simulator pool later
1. Drop a new file in `data/bases/`, e.g. `data/bases/my_new_base.json` with `{ "name": "My Base", "prefixes": [], "suffixes": [] }`.
2. Fill in its `prefixes` / `suffixes`.
3. Double-click `build.cmd`.
4. If it should show in the menu, set its category to `'active'` in `select.js`.

This adds a class/attribute modifier pool. A concrete in-game base is a separate normalized record and must map to exactly one such pool.
