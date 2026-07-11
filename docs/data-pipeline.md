# Reproducible PoE 2 data pipeline

The repository validates its checked-in normalized data without depending on an upload directory or an untracked `data.json`. The active legacy snapshot is described by `data/source-cache/provenance.json`. Its raw export is not available in this workspace, and that absence is intentional and machine-readable rather than hidden behind a failing default path.

## Validation modes

Run the self-contained checks with:

```text
node data-validation.mjs
node tools/build-normalized-data.mjs --check
```

The validator checks normalized schemas, stable IDs, cross-file references, manifest counts, payload hashes, legacy-pool coverage, active provenance, coverage-report consistency, and the browser bundle. It does not claim to have re-run the missing legacy conversion.

If the exact raw export is available separately, add the stronger comparison explicitly:

```text
node data-validation.mjs --source <path-to-data.json>
```

There is deliberately no implicit `../upload/data.json` fallback.

## Provenance and refresh candidates

`data/source-cache/sources.json` separates machine-readable data feeds from official evidence pages:

- Craft of Exile PoE 2 export: `https://www.craftofexile.com/json/poe2/main/poec_data.json`, reported version `0.5.4.1.2`. This is the only configured candidate compatible with the current Craft-of-Exile parser.
- RePoE-fork PoE 2 index: `https://repoe-fork.github.io/poe2/`, reported version `4.5.4.3`, with `base_items.min.json`, `item_classes.min.json`, `mods.min.json`, `mods_by_base.min.json`, and `augments.min.json`. It is recorded as `adapter-required`; its files must not be passed to the Craft-of-Exile parser.
- GGG's official 0.5.0 item changes, 0.5.4 notes, and two 0.5.4 hotfix posts are recorded as evidence URLs. Patch notes can confirm mechanics and versions, but they are not modifier datasets.

Reported versions and observation dates are provenance hints, not proof that a payload matches the game. Every fetched payload receives its own byte hash and metadata.

## Conservative staging

The sync tool performs no network request for `status`, `verify`, or `report`:

```text
node tools/sync-poe2-data.mjs status
node tools/sync-poe2-data.mjs verify
node tools/sync-poe2-data.mjs report
```

An explicit fetch stages a candidate snapshot:

```text
node tools/sync-poe2-data.mjs fetch --source craft-of-exile-poe2
```

The fetcher:

1. accepts public HTTPS only and rejects credentials, local hosts, and private DNS results;
2. sends the configured repository user agent;
3. rate-limits requests and bounds redirects, duration, and response size;
4. sends conditional `If-None-Match` and `If-Modified-Since` headers when cache metadata exists;
5. parses the fixed assignment or JSON without evaluation and validates required source sections before caching;
6. computes a SHA-256 over the exact response bytes;
7. writes an immutable, hash-suffixed snapshot containing raw data, parser/HTTP/version metadata, normalized JSON, a compiled browser bundle, and coverage;
8. never promotes the staged result into `data/normalized/`.

A previously downloaded file can be staged with an explicit public provenance URL:

```text
node tools/sync-poe2-data.mjs import --source-id <id> --file <path> --source-url <public-https-url>
```

Promotion is intentionally a reviewed operation outside the sync command. Compare the staged normalized files and coverage against the active snapshot, verify source usage rights and version claims, then deliberately update repository data and `provenance.json` together.

## Coverage report

`reports/data-coverage.json` is generated from the current repository data. It records legacy and normalized counts plus explicit gaps: empty legacy pools, normalized mappings missing from the legacy engine, pools with collapsed weights, and empty Desecrated pools. It is evidence about coverage, not a claim of complete game parity.
