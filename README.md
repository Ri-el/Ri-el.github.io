# PoE2 Crafting Simulator

A click-and-play **Path of Exile 2 crafting *emulator*** (not a probability calculator). Double-click `index.html` to play — no server, no install, no terminal needed. Works offline and on a locked-down office laptop.

This README explains **what every file does** and **where to look when something breaks** — written so a human *or* an AI assistant can pick it up cold.

---

## ▶️ Quick start

- **Play it:** double-click `index.html`.
- **Changed mod data:** double-click `build.cmd` (home PC only), then open `index.html`.
- **Upload to GitHub:** double-click `push.cmd` (home PC only) → pushes to `Ri-el/poe2-crafting`.

> The app reads compiled `.data.js` files (because `file://` can't fetch raw `.json`). After editing any JSON you MUST run `build.cmd` to recompile, or the app won't see your change.

---

## 🗺️ Architecture in one paragraph

You edit **one small JSON file per base item** in `data/bases/` (e.g. `ruby.json`, `helmets_str.json`). `build.cmd` runs `build_data.ps1`, which validates those files and compiles local browser-loadable `.data.js` bundles. `app.js` reads those globals and hands the selected pool to `crafting.js`; no external site is contacted at runtime, so direct `file://` use still works. Repository-owned normalized source data, provenance, and the classified crafting inventory are kept separately so development-time validation does not depend on `../upload/data.json`.

---

## 📄 App files (the stuff that runs the simulator)

| File | What it does | Look here when… |
|---|---|---|
| `index.html` | The page itself. Loads every script/style in order. The `<script>` tags at the bottom decide what code runs. | A file you added isn't loading, or you need to add a new script/style tag. |
| `app.js` | **Boot + UI glue.** Wraps everything in an IIFE (`window.CraftingEngine`), reads `window.MOD_BASES` from the compiled data, builds the engine, wires up buttons, cursor orb, animations, the stash, and ALT tier tooltips. Has a guard that throws a clear error if the mod data didn't load (\"run build\"). | Buttons/clicks/tooltips/animations misbehave, or data isn't loading into the UI. |
| `crafting.js` | **The crafting engine (the rules).** Currency behavior lives here — Transmute, Augment, Regal, Exalt, Chaos, Annul, Alchemy, Divine, Vaal, Essence of the Abyss, Desecrate, plus prefix/suffix caps and tier rolling. It also migrates legacy quality values into `{ amount, type, source }`; this state support does not by itself enable quality currencies. | An orb does the wrong thing, mods roll incorrectly, or affix caps are off. **Engine bugs live here, NOT in the data files.** |
| `select.js` | **Item-picker menu.** Defines the category tree (jewels, armour, weapons, etc.). Each category has a `status` of `'active'` or `'soon'` (greyed out). Flip `'soon'`→`'active'` once a base has real data. | A base/category isn't selectable, or you finished its data and want to turn it on. |
| `style.css` | Main look — item tooltip, stash panel, dark PoE2 theme, layout. | General visual styling. |
| `overhaul.css` | Final in-game-inspired layout layer: three-column workbench, currency stash tab, item stash, Omens row, and responsive selection screen. | Current UI layout and visual polish. |
| `desecrate.css` | Styling specific to the Desecrate / abyssal-bones overlay feature. | The desecrate panel looks wrong. |
| `select.css` | Styling for the item-picker menu only. | The category picker looks wrong. |
| `sw.js` | Service worker — caches files so the app works offline / installs as a PWA. | Offline mode or \"install app\" behaves oddly (or stale cache after an update). |
| `manifest.json` | PWA metadata (app name, icons, colors) so it can install to desktop/phone. | Install name/icon is wrong. |

---

## 🧱 Data files

| File / folder | What it does | Look here when… |
|---|---|---|
| `data/bases/*.json` | **The converted Craft of Exile mod data — one file per supported item class (61 files).** 56 are populated; Diamond and the four Time-Lost jewel files are empty. Each file is self-contained: `{ name, attribute?, prefixes:[], suffixes:[] }`. | A specific class has wrong/missing mods — open just that file. **Wrong weighting or a missing modifier = a data-conversion/data bug, fix it here.** |
| `data/mods.data.js` | **Auto-generated.** `build_data.ps1` bundles every `data/bases/*.json` into this one file (`window.MOD_BASES[\"<id>\"] = {...}`). The app loads this, not the raw JSON. | Never edit by hand. If it's stale/missing, run `build.cmd`. |
| `data/desecrated-mods.json` | Source data for the Desecrate (abyssal bone) feature — one shared jewel pool (Lightless prefixes + of-the-Abyss suffixes), keyed under `jewelTypes` and gated by `bones` (only `preserved_cranium` is valid for jewels). Hand-editable. | Desecrate offers wrong mods. |
| `data/desecrated-mods.data.js` | **Auto-generated** browser version of the above (built by `build_data.ps1`). | Don't edit by hand; rebuild instead. |
| `data/normalized/*.json` | Repository-owned normalized base, modifier, crafting-item, and Essence records plus a version manifest and output hashes. | A source mapping or normalized reference fails validation. |
| `data/normalized.data.js` | **Auto-generated** `file://` wrapper for the normalized records. | Never edit by hand; run the build. |
| `data/source-cache/` | Source policy and provenance for the normalized data. The manifest explicitly records that the legacy raw export is unavailable rather than fabricating a fixture. | Auditing source identity, target version, parser version, or hashes. |
| `data/crafting/currency-index.json` | Classified inventory of all 530 retained crafting-item records. Every record has exactly one classification; the existing 37 runtime craft IDs are preserved as an overlay. | Adding or auditing a crafting item. Generate it with `tools/build-currency-index.mjs`. |
| `data/crafting/quality-rules.json` | Attributed 0.5.4 quality target/cap data and explicit blocked reasons for rules whose exact formula is unavailable. | Reviewing quality support; this file is not permission to enable a button without an engine operation and tests. |

### The 61 base files at a glance
- **Populated and selectable (56):** Ruby/Emerald/Sapphire jewels; all listed armour attribute combinations; jewellery; off-hands; one- and two-handed weapons; flasks and charms.
- **Empty and not selectable (5):** `diamond`, `time_lost_ruby`, `time_lost_emerald`, `time_lost_sapphire`, `time_lost_diamond`.
- These are **item-class pools**, not every concrete in-game base type. The converted files currently do not retain concrete base IDs, requirements, item tags, or per-base modifier-limit overrides.
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
| `build_data.ps1` | The actual build script: validates each `data/bases/*.json`, bundles them into `data/mods.data.js`, and also compiles `desecrated-mods.json` → `.data.js`. Writes UTF-8 (no BOM). | Edit only if the build process itself needs to change. |
| `tools/build-normalized-data.mjs` | Rebuilds `data/normalized.data.js` from repository-owned normalized JSON. | Run through the normal build. |
| `tools/build-currency-index.mjs` | Rebuilds the 530-entry classified currency inventory, browser wrapper, and coverage report. `--check` fails if generated files are stale. | Development-time only; no runtime fetches. |
| `tools/sync-poe2-data.mjs` | Staging-only public-source sync/import utility with HTTPS/public-host checks, rate limits, response limits, hashes, and provenance. `verify` validates the active repository snapshot without downloading. | New fetches are candidates; they do not auto-promote runtime data. |
| `push.cmd` | **Double-click to upload everything to GitHub.** Inits git if needed, then force-pushes the whole folder to `Ri-el/poe2-crafting` (`main`). | Home PC only. Force-push overwrites the old version on GitHub — pull/sync first if the repo changed elsewhere. |
| `serve.ps1` | Optional: starts a tiny local web server (only needed if you ever want to test PWA/service-worker features that `file://` can't do). | Not needed for normal play. |
| `.gitignore` | Tells git which files to skip (OS junk, `node_modules/`, the dev-only generator). | — |

---

## 🤖 Dev-only / not shipped

| File | What it does |
|---|---|
| `_scaffold_data.mjs` | One-off Node generator that split the jewel data into per-base files and created the empty scaffolds. Already done its job; kept for reference. Git-ignored. |
| `fuzz.mjs` | **Node fuzz / regression harness for the crafting engine.** It treats malformed data, engine exceptions, malformed item state, zero meaningful mutations, invariant violations, and fixed-seed digest drift as fatal. The reviewed checkpoint is `node fuzz.mjs 30000 542026`: 30,016 operations, 2,526 meaningful mutations, 198 Hinekora consumptions, digest `780fbd933eac3cbc60df3f2cb3e13077e00e8a56384e146d5e43d76cdd937a4b`. |
| `validation.mjs` | Deterministic 0.5.4-oriented engine/data regression suite, including all four confirmed hazard fixes, source overlays, weight metadata, structured quality migration, and all 56 populated pools. Current checkpoint: **29/29**. |
| `ui-validation.mjs` | Dependency-free DOM/CSS contract checks for the workbench grid, hidden modal state, normal-flow panel positioning, mobile drawer reset, currency activation, search, and stash markup. Run with `node ui-validation.mjs`. |
| `data-validation.mjs` | Validates normalized schemas, cross-record mappings, provenance/version/parser metadata, hashes, the browser bundle, and coverage using only repository-owned files. Current checkpoint: **23/23**. |

### Validation commands

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-currency-index.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

The current UI contract suite passes **63/63**, and the fixed-seed fuzz run passes with zero exceptions, harness errors, or invariant violations.

---

## 🧭 \"Something's wrong\" cheat sheet

- **An orb / currency behaves wrong, caps wrong, tiers wrong** → `crafting.js` (engine logic).
- **A specific item has wrong or missing mods** → that one file in `data/bases/` (data), then run `build.cmd`.
- **Clicks, tooltips, animations, cursor orb, stash UI** → `app.js`.
- **A category won't appear or won't select** → `select.js` (check `status`, flip `'soon'`→`'active'`).
- **Visuals/layout** → `style.css` (main), `select.css` (menu), `desecrate.css` (desecrate panel).
- **Edited JSON but nothing changed in the app** → you forgot to run `build.cmd` (the app reads the compiled `.data.js`, not raw JSON).
- **Offline/install issues or stale content after update** → `sw.js` (service worker cache).

---

## ➕ Adding a new base later (no code edits needed)
1. Drop a new file in `data/bases/`, e.g. `data/bases/my_new_base.json` with `{ \"name\": \"My Base\", \"prefixes\": [], \"suffixes\": [] }`.
2. Fill in its `prefixes` / `suffixes`.
3. Double-click `build.cmd`.
4. If it should show in the menu, set its category to `'active'` in `select.js`.

That's it — `index.html` and `app.js` never need to change.
