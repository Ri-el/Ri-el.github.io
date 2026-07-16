# Task 4: Build the resumable resolver CLI

## Goal

Create the development-only `tools/sync-base-art.mjs` CLI that resolves every mapped concrete base to an exact Poe2DB page identity and art path, writes a resumable manifest, and provides download/verify/all command scaffolding. The resolver must be conservative: no display-name-only acceptance, no inferred art paths, no bypass of access denial/CAPTCHA, and no runtime changes.

## Files in scope

- Create `tools/sync-base-art.mjs`.
- Modify `tools/base-art-validation.mjs` with resolver fixtures and mode dispatch while preserving prior modes.

## Commands/interface

`resolve`, `download`, `verify`, and `all`; resolve/download accept `--limit`, `--delay-ms`, `--concurrency`; download accepts `--sharp-module` and `--python`. Reports:

- `reports/poe2db-base-art-manifest.json`
- `reports/poe2db-base-art-run.json`

`verify --manifest-only` must be offline and validate the manifest contract. Download/verify details may be completed in the next task, but command parsing and clear phase errors must be present.

## Resolver rules

Read `reports/asset-requirements.json` and `data/normalized/base-items.json`; build the exact mapped catalog with `buildMappedBaseCatalog`. Fetch the current US autocomplete catalog once from the observed public endpoint (`https://cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json`, or a current checked-in/source-discovered URL) using the guarded network client, hash the bytes, and retain provenance. Use exact label/value records as slug candidates. A deterministic display-name slug (spaces→underscores, apostrophes removed, URL-encode the remainder) is fallback only; never turn a guessed slug into a successful mapping without exact Type/Icon identity.

The live catalog is a JSON array of `{label, value, desc, class}` records. `value` is already URL-encoded (for example `%2C` and `%C3...`); append it to `/us/` without encoding it a second time. The checked-in mapped set has fallback-only names, including Golden Blade, so always add the deterministic fallback candidate even when no catalog label exists. Golden Blade maps two IDs to one deduplicated page URL; retain both expected metadata keys and resolve each matching Type/Icon section independently.

Deduplicate page URLs while retaining every expected metadata key. For each page, parse all Type/Icon pairs with `parsePoe2DbSections`, call `matchExactSection`, and preserve exact case. Write a valid partial manifest atomically after each resolved page; reruns resume from valid records. Missing, ambiguous, denied, CAPTCHA, invalid URL, or parse failures are structured failures, not guesses. Stop or fail clearly on access denial/CAPTCHA.

Manifest entries contain at least `baseId`, `metadataKey`, `displayName`, `assetPath`, `poe2dbPageUrl`, `artPath`, and `sourceImageUrl`; manifest contains schema version, target game version, catalog URL/hash, resolver timestamp, entries, and failures. Use a deterministic stable sort. Keep a run report with counts/failures/network stats.

## Tests/live smoke

Extend the dependency-free harness with Crimson Amulet and Golden Blade fixtures; Golden Blade must contain two Type/Icon sections and select the exact `Metadata/items/...OneHandSwordDemigods1` section rather than the first same-name section. Assert the mapped catalog is 1,759 and excludes ID 613. Test slug escaping, duplicate page grouping, atomic partial writes, resume/invalid-record rejection, and CLI argument validation without network.

Run the bounded live smoke only after offline tests pass:

`<bundled Node> tools/sync-base-art.mjs resolve --limit 3 --delay-ms 1000 --concurrency 1`

Inspect the partial manifest and report. Do not continue if the site returns access denial, CAPTCHA, non-HTML content, or ambiguous identities. Use apply_patch and write `.superpowers/sdd/task-4-report.md`; commit `feat: resolve Poe2DB base art manifest`.
