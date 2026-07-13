# Oishy Crafting Forge

A click-and-play **Path of Exile 2 0.5.4-targeted crafting *emulator*** (not a probability calculator). Double-click `index.html` to play — no server, no install, no terminal needed. Works offline and on a locked-down office laptop.

This README explains **what every file does** and **where to look when something breaks** — written so a human *or* an AI assistant can pick it up cold.

---

## ▶️ Quick start

- **Play it:** double-click `index.html`.
- **Changed mod data:** double-click `build.cmd` (home PC only), then open `index.html`.
- **Upload to GitHub:** double-click `push.cmd` (home PC only) → pushes to `Ri-el/Ri-el.github.io`.

> The app reads compiled `.data.js` files (because `file://` can't fetch raw `.json`). After editing any JSON you MUST run `build.cmd` to recompile, or the app won't see your change.

---

## 🗺️ Architecture in one paragraph

You edit **one small JSON file per base item** in `data/bases/` (e.g. `ruby.json`, `helmets_str.json`). `build.cmd` runs `build_data.ps1`, which validates those files and compiles local browser-loadable `.data.js` bundles. `app.js` reads those globals and hands the selected pool to `crafting.js`; no external site is contacted at runtime, so direct `file://` use still works. The workbench's ten tabs load 46 supported crafting definitions at startup from one 531-definition registry. That registry contains 51 runtime definitions and 522 visible catalog definitions; unsupported entries remain explicit blockers. Repository-owned normalized source data, provenance, and the classified crafting inventory are kept separately so development-time validation does not depend on `../upload/data.json`.

### Current workbench interaction

- The outer screen selects an item class and opens the workbench immediately. Concrete bases are selected inside the workbench and can be switched without returning to the outer screen; Ruby/Sapphire/Emerald Jewel switching remains available.
- The item-level divider uses a dark diamond marker with a 22px interaction target. Pointer dragging and track clicks adjust the level; clicking the marker locks or unlocks it. The same slider supports Tab focus, Arrow/Home/End adjustment, Enter/Space lock toggling, and reduced-motion styling.

---

## 📄 App files (the stuff that runs the simulator)

| File | What it does | Look here when… |
|---|---|---|
| `index.html` | The page itself. Loads every script/style in order. The `<script>` tags at the bottom decide what code runs. | A file you added isn't loading, or you need to add a new script/style tag. |
| `app.js` | **Boot + UI glue.** Runs as a classic deferred script, reads the compiled data, generates crafting tabs/cards from the authoritative registry, and routes pointer, keyboard, context-menu, drag, and item-level slider interactions through shared validation/dispatch. It also owns the cursor orb, animations, stash, and ALT tier tooltips. | Buttons/clicks/tooltips/animations misbehave, or data isn't loading into the UI. |
| `crafting.js` | **The crafting engine (the rules).** Currency behavior lives here — Transmute, Augment, Regal, Exalt, Chaos, Annul, Alchemy, Divine, blocked Vaal, Essence of the Abyss, Desecrate, plus prefix/suffix caps and tier rolling. Item-state schema v5 keeps generic concrete-base metadata distinct from simulator pool identity, keeps `ilvl` and `itemLevel` synchronized, preserves structured quality `{ amount, type, source, cap }`, and performs versioned legacy migration without enabling unverified mechanics. | An orb does the wrong thing, mods roll incorrectly, or affix caps are off. **Engine bugs live here, NOT in the data files.** |
| `select.js` | **Item-class menu and workbench base selector.** Defines the outer category tree without inserting a concrete-base screen. Inside the workbench one generic normalized picker serves every non-Jewel class; Jewels retain Ruby/Sapphire/Emerald controls. It owns search, filters, keyboard behavior, and reset confirmation. | A class/category is missing, or the in-workbench base picker misbehaves. |
| `style.css` | Main look — item tooltip, stash panel, dark PoE2 theme, layout, and the item-level diamond marker with its hit target, focus, hover, active, locked, and reduced-motion states. | General visual styling or slider-marker behavior. |
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
| `data/mods.data.js` | **Auto-generated and losslessly minified.** `tools/build-mod-data.mjs` bundles every `data/bases/*.json` into `window.MOD_BASES` without dropping any modifier, tier, identity, weight, or tag. | Never edit by hand. If it's stale/missing, run `build.cmd`. |
| `data/desecrated-mods.json` | Source data for the Desecrate (abyssal bone) feature — one shared jewel pool (Lightless prefixes + of-the-Abyss suffixes), keyed under `jewelTypes` and gated by `bones` (only `preserved_cranium` is valid for jewels). Hand-editable. | Desecrate offers wrong mods. |
| `data/desecrated-mods.data.js` | **Auto-generated** browser version of the above (built by `build_data.ps1`). | Don't edit by hand; rebuild instead. |
| `data/normalized/*.json` | Repository-owned normalized base, modifier, crafting-item, and Essence records plus a version manifest and output hashes. `base-items.json` retains 1,760 concrete records; Task 02 exposes the 1,743 records mapped to populated compiled pools and documents every remaining blocker. | A source mapping, concrete-base identity, or normalized reference fails validation. |
| `data/normalized.data.js` | **Auto-generated complete audit wrapper** for every normalized record. It remains available to validation and source tooling but is not loaded by the application. | Never edit by hand; run the build. |
| `data/runtime.data.js` | **Auto-generated `file://` runtime projection.** Retains every concrete base and simulator mapping plus the exact referenced implicits, source modifier identities, weights, tag rules, provenance, and crafting handlers. | This is the smaller normalized representation loaded by the browser; rebuild it from the complete normalized JSON. |
| `data/source-cache/` | Source policy and provenance for the normalized data. The manifest explicitly records that the legacy raw export is unavailable rather than fabricating a fixture. | Auditing source identity, target version, parser version, or hashes. |
| `data/crafting/runtime-registry.json` | Hand-authored tab metadata and 51 runtime definitions: 46 supported, four blocked for missing data, and one probability-unverified. It references normalized records by exact source ID and metadata key, never by display-name matching. | Changing a verified visible craft's presentation or declarative runtime binding. |
| `data/crafting/currency-index.json` | **Generated authoritative registry.** It audits all 530 retained source records plus runtime-only Hinekora's Lock: 531 unique definitions, ten tabs, 51 runtime definitions, 46 supported startup controls, and 522 visible catalog definitions, with exact blockers, evidence, fixtures, applicability, and handlers. | Adding or auditing a crafting item. Generate it with `tools/build-currency-index.mjs`. |
| `data/crafting/quality-rules.json` | Attributed 0.5.4 quality target/cap data and explicit blocked reasons for rules whose exact formula is unavailable. | Reviewing quality support; this file is not permission to enable a button without an engine operation and tests. |

### The 61 base files at a glance
- **Populated (56):** Ruby/Emerald/Sapphire jewels; all compiled armour attribute combinations; jewellery; off-hands; one- and two-handed weapons; flasks and charms. They map to 1,743 surfaced concrete records; two unmodifiable Gloves are visible but disabled.
- **Empty and not selectable (5):** `diamond`, `time_lost_ruby`, `time_lost_emerald`, `time_lost_sapphire`, `time_lost_diamond`.
- These are **simulator modifier pools**, not concrete in-game base types. Concrete IDs, tags, properties, and implicits live separately in normalized data. Attribute family is a selector filter, never an item identity. Eleven all-attribute armour/shield records have normalized mappings but no compiled pool; five empty Jewel pools and unmapped Timeless Jewel ID `613` are also explicit blockers. Required levels, per-base icons, maximum/default socket semantics, localized implicit templates, and some inherent-skill/property data remain unavailable. Fixed sourced prefix/suffix-cap implicit deltas and concrete-tag eligibility are enforced; unverified effects are not guessed.
- Eight populated pools contain only binary/equal fallback weights: `body_armours_str_dex_int`, `claws`, `daggers`, `flails`, `one_hand_axes`, `one_hand_swords`, `two_hand_axes`, and `two_hand_swords`. They now carry `weightStatus: "unverified"` with source/version metadata. The app is an emulator, not a statistically accurate probability calculator for those pools.

### Quality support at the current checkpoint

- **Implemented infrastructure:** structured item state `quality: { amount, type, source, cap }`, migration of legacy numeric/missing values, target-class and cap validation, a dedicated quality tooltip section, and explicit evidence/status metadata.
- **Not runtime-enabled:** Armourer's Scrap, Blacksmith's Whetstone, Arcanist's Etcher, and Glassblower's Bauble. Their valid target classes are known, but the exact Path of Exile 2 0.5.4 item-level increment formula is not present in the retained sources, so the data marks them `blocked_missing_formula`.
- **Verified engine rule, not a workbench control:** Gemcutter's Prism has a fixed +5% rule and cap-20 transition in the generic engine handler, but the simulator has no normalized Skill Gem item model or registry control, so it remains unavailable in the workbench.
- **Unsupported:** Catalysts and other alternate-quality mechanics. They require their own verified mutations and supporting tables.

No quality currency button is enabled merely from a known description.

### Task 04 core and quality checkpoint

- The current item-state schema is version 5. It preserves generic concrete-base metadata separately from simulator pool identity and keeps `ilvl`/`itemLevel` as synchronized aliases. Every quality record carries `amount`, `type`, `source`, and `cap`; normal legacy quality at or below the verified 20% cap migrates to `cap: 20`, while alternate or above-cap quality preserves an unknown cap instead of inheriting an unverified rule.
- Source-backed core corrections are enforced in both engine and UI: Alchemy is Normal-only; Annulment and Divine reject Normal items; mirrored items cannot be modified or have their item level changed. Greater/Perfect minimum modifier-level floors and their documented below-floor group fallback remain unchanged.
- Vaal Orb is still visible in the Corruption tab for parity, but is disabled and atomically rejected because the retained 0.5.4 evidence does not encode its outcome probabilities/transitions. The former uniform outcome path is no longer reachable through the workbench or engine.
- Eight retained quality records are visible as disabled audit cards with specific blockers: four ordinary currencies lack the exact 0.5.4 item-level increment formula, and four Vaal Infusers remain reserved for the specialized Task 07 audit. Gemcutter's Prism has a verified generic +5/cap-20 engine rule but no normalized Skill Gem workbench target.

### Task 05 Abyss, Breach, Essences, and Omens checkpoint

- The existing Preserved Cranium and Well of Souls flow remains inside the workbench. Preserved Cranium plus Sinistral Necromancy, Dextral Necromancy, Abyssal Echoes, and Omen of Light are declared Jewel-only; Essence of the Abyss carries the 27 normalized equipment classes and rejects Jewels, Flasks, and Charms in both UI and engine validation.
- Unknown Abyssal Bones and conflicting directional Necromancy Omens fail atomically. Omen of Light requires a revealed Desecrated modifier and is consumed once on the successful guarded Annulment path, including Hinekora foresight. The UI uses the engine-returned Echoes reroll count.
- Other Bones, regular/Breach Essences, Catalysts, and target-version Lich guarantees remain blocked with explicit reasons. The retained Desecrated pool is identified as PoE2 0.3 and lacks complete 0.5.4 Well-of-Souls weighting/localization data; option selection and Echoes consumption timing therefore remain limited compatibility behavior rather than a full parity claim.

### Task 06 Sockets, Runes, and Soul Cores checkpoint

- Item state now carries deterministic empty/preserved-unverified socket state. Explicit slots are typed and contiguous, malformed or inconsistent save payloads fail atomically, and the tooltip renders socket state in a dedicated section. Source `socketCount` is retained as metadata and is never reinterpreted as a default or maximum.
- The normalized source retains 295 socketables: 221 Rune records, 34 Soul Cores, 35 Idols, four Abyssal Eyes, and one Congealed Mist (the source classification cohort contains 226 Rune-tagged records). The registry retains 296 socketing definitions, all hidden and blocked/deprecated.
- Artificer's Orb, socket insertion, Rune/Soul Core effects, replacement, and extraction remain disabled because target-version limits, class/effect semantics, localization/scaling, corruption behavior, and removal procedures are not verified. Implemented socket, Rune, Soul Core, and extraction counts remain zero.

### Task 07 Expedition, Temple/Atziri, Vaal, and specialized crafting checkpoint

- The final numbered audit keeps the existing visible Vaal card atomic and probability-blocked. The registry retains 19 Runeforging/Expedition category records, 26 Delirium/Instilling records, and four corruption category records, but the true equipment candidates are 17 Expedition records and three corruption records. Alloy Crossbow, Elemental Conflux, and the Sacrifice skill gem are converter false positives excluded from equipment-operation parity; no specialized operation falls through to ordinary Vaal behavior.
- Fluxes, Alloys, Architect's Orb, Ancient Infuser, Vaal Infusers, extraction candidates, and the named Temple/Atziri records lack verified target-version transitions, limits, outcome weights, destruction/failure, or extraction rules. Missing source identities stay explicit blockers. Delirium/Instilling and Runeforging state categories are not guessed.
- The numbered roadmap is complete. The remaining work is final parity review and future source-backed corrections; no push is performed.

---

## 🛠️ Build & tooling files

| File | What it does | Notes |
|---|---|---|
| `build.cmd` | **Double-click to rebuild.** Runs `build_data.ps1` via PowerShell. | Home PC only (office laptops block PowerShell). Run after editing any JSON. |
| `build_data.ps1` | The actual build script: validates and bundles base/Desecration data, rebuilds normalized and crafting browser bundles, then refreshes registry parity reports. Writes UTF-8 (no BOM). | Edit only if the build process itself needs to change. |
| `tools/build-mod-data.mjs` | Rebuilds and checks the losslessly minified `data/mods.data.js` wrapper. | Development-time only; source pools remain in `data/bases/*.json`. |
| `tools/build-normalized-data.mjs` | Rebuilds the complete `data/normalized.data.js` audit wrapper and the smaller `data/runtime.data.js` browser projection. | `--check` verifies both outputs against repository-owned sources. |
| `tools/build-currency-index.mjs` | Rebuilds the 530-entry source inventory, complete 531-definition registry, classic-script browser wrapper, and coverage report. `--check` fails if generated files are stale. | Development-time only; no runtime fetches. |
| `tools/build-crafting-parity.mjs` | Projects `reports/crafting-parity.json` directly from the authoritative registry without inferring missing mechanics; `docs/crafting-parity.md` explains that generated report. | Run after registry or classification changes. |
| `tools/build-asset-requirements.mjs` | Generates the complete `reports/asset-requirements.json` and `.md` checklist for every mapped concrete-base image and every known crafting icon. | Base art is keyed by numeric base ID; `--check` fails when either report is stale. |
| `tools/browser-smoke.mjs` | Optional real-browser regression harness for explicit `file://` and local-HTTP targets. It clears HTTP service-worker state, executes the actual `index.html` scripts, and click-tests representative outer classes, engine context, concrete defaults, tooltip rendering, and the back button. | Run with an existing Playwright installation; it is not a runtime dependency. |
| `tools/sync-poe2-data.mjs` | Staging-only public-source sync/import utility with HTTPS/public-host checks, rate limits, response limits, hashes, and provenance. `verify` validates the active repository snapshot without downloading. | New fetches are candidates; they do not auto-promote runtime data. |
| `push.cmd` | **Double-click to upload everything to GitHub.** Inits git if needed, then force-pushes the whole folder to `Ri-el/Ri-el.github.io` (`main`). | Home PC only. Force-push overwrites the old version on GitHub — pull/sync first if the repo changed elsewhere. |
| `serve.ps1` | Optional: starts a tiny local web server (only needed if you ever want to test PWA/service-worker features that `file://` can't do). | Not needed for normal play. |
| `.gitignore` | Tells git which files to skip (OS junk, `node_modules/`, the dev-only generator). | — |

---

## 🤖 Dev-only / not shipped

| File | What it does |
|---|---|
| `_scaffold_data.mjs` | One-off Node generator that split the jewel data into per-base files and created the empty scaffolds. Already done its job; kept for reference. Git-ignored. |
| `fuzz.mjs` | **Node fuzz / regression harness for the crafting engine.** It treats malformed data, engine exceptions, malformed item state, zero meaningful mutations, invariant violations, and fixed-seed digest drift as fatal. The current final boundary is `node fuzz.mjs 30000 542026`; the reviewed digest is recorded in `VALIDATION_REPORT.md` after the full runtime check. |
| `validation.mjs` | Deterministic 0.5.4-oriented engine/data regression suite, including injectable crafting RNG, schema-v5 concrete identity/state migration, source overlays, base-specific tags/affix limits, structured quality/socket preservation, Abyss/Essence applicability, explicit socket state, and all 56 populated pools. Current checkpoint: **55/55**. |
| `ui-validation.mjs` | Dependency-free DOM/CSS contract checks for generated registry tabs/cards, shared dispatch, startup isolation, eligibility scope, filters, accessibility, the workbench grid, concrete-base flow, concrete-base artwork/glow, stash markup, item-level slider keyboard/ARIA behavior, marker states, and reduced motion. Current checkpoint: **157/157**. |
| `data-validation.mjs` | Validates normalized schemas, all 1,760 concrete records, the complete crafting registry/parity projection, 31-class base parity, provenance, hashes, browser bundles, socketable cohorts, specialized-crafting cohorts, and explicit blockers using only repository-owned files. Current checkpoint: **82/82**. |

### Validation commands

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-normalized-data.mjs --check
node tools/build-currency-index.mjs --check
node tools/build-crafting-parity.mjs --check
node tools/build-asset-requirements.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

The current final boundary passes **55/55 engine**, **157/157 UI**, and **82/82 data** checks. The fixed-seed fuzz run passes with zero exceptions, harness errors, or invariant violations; its digest is recorded in `VALIDATION_REPORT.md`. `tools/browser-smoke.mjs` performs real-script click-through checks against explicit `file://` or local-HTTP targets when Playwright is already available.

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
