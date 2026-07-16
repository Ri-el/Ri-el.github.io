# Repository layout

This project is intentionally a static, offline-friendly application. The root
`index.html` is the only required entry point: it can be opened directly with
`file://` and does not require a development server, backend, package manager,
or install step.

## Runtime files

| Area | Files | Responsibility |
| --- | --- | --- |
| Page entry | `index.html` | Loads the runtime styles, classic deferred scripts, local data bundles, and visible workbench markup. |
| UI and flow | `app.js`, `select.js` | Bootstraps the simulator, renders the workbench, handles crafting interactions, stash/history, and the outer class selector plus in-workbench concrete-base picker. |
| Rules | `crafting.js` | Applies the checked-in crafting state schema, validators, and operation handlers. |
| Styles | `style.css`, `select.css`, `overhaul.css`, `header-fix.css`, `desecrate.css` | Visual layout and interaction states for the selector, workbench, stash, and Desecrate flow. |
| Browser data | `data/*.data.js`, `data/crafting/known-items.data.js` | Classic-script projections loaded by the page because a `file://` page cannot fetch raw JSON with `fetch()`. |
| Offline/PWA | `sw.js`, `manifest.json` | Versioned application-shell and artwork caching plus install metadata. |
| Branding/assets | `assets/` | Item artwork, crafting icons, and PWA icons. Visible headers use the compact logo; manifest icons remain separate. |

## What to edit

Edit source modules and source data, then regenerate browser projections when
the repository instructions require it:

- `app.js`, `select.js`, `crafting.js`, and the CSS files are the runtime source.
- `data/bases/*.json`, `data/desecrated-mods.json`, and the normalized JSON under
  `data/normalized/` are editable data sources.
- `data/crafting/runtime-registry.json` and its source/provenance records define
  hand-reviewed crafting metadata. The currency index and parity/status files
  are generated from the authoritative inputs.
- `tools/` contains development-only builders, validators, sync verification,
  and optional browser smoke checks.

Generated browser bundles include `data/mods.data.js`,
`data/desecrated-mods.data.js`, `data/normalized.data.js`,
`data/runtime.data.js`, and the crafting/catalogue `.data.js` wrappers. Reports
under `reports/` and audit documents generated under `docs/` describe coverage,
provenance, and blockers; they are not a second runtime source of truth.

**Debug source modules and source JSON, never generated bundles.** If a bundle
is stale, run the documented builder/check command instead of hand-editing its
output. Keep one target game version and preserve explicit blockers when source
evidence is missing.

## Local assets and repository boundaries

The checked-in `assets/` directory contains shipped artwork. A local
`data/images/` directory may contain user-supplied or not-yet-reviewed images;
it is intentionally preserved as untracked local work and must not be staged,
rewritten, or treated as authoritative runtime data until it has passed the
asset review and mapping workflow.

Keep development artifacts, reports, and source caches separate from the files
loaded by `index.html`. Runtime changes must continue to work when the page is
opened directly from disk, and the service-worker cache version must be bumped
when shipped runtime assets change.

## Verification boundary

At a stable slice, run the repository checks listed in `AGENTS.md` (UI,
engine/data validation, generated-data `--check` commands, sync verification,
and the fixed-seed fuzz run). The optional `tools/browser-smoke.mjs` harness
can exercise both direct `file://` entry and local HTTP service-worker behavior
when a compatible browser runtime is already installed.
