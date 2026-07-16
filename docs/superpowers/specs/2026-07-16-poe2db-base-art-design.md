# Poe2DB base-art acquisition design

Date: 2026-07-16
Target game version: 0.5.4
Status: approved for implementation planning

## Objective

Populate the repository's mapped concrete-base artwork without changing the shipped static application architecture or introducing a runtime dependency on Poe2DB.

The authoritative destination contract remains:

```text
assets/item-bases/<numeric-base-id>.png
```

The normalized catalog contains 1,759 mapped base IDs. One valid asset, `2563.png`, already exists, leaving 1,758 missing assets. Existing valid files must never be overwritten by a normal download run.

## Source and identity rules

Poe2DB exposes an exact metadata identity and an `Art/...` icon path on base-item pages. Its CDN serves the corresponding artwork as WebP at:

```text
https://cdn.poe2db.tw/image/<Art path>.webp
```

The repository retains a unique `metadataKey` for every normalized base but does not retain Poe2DB art paths. Display names cannot be the final identity because the mapped catalog contains duplicate display-name groups.

The acquisition process must therefore build and persist a reviewed mapping with these minimum fields:

```text
baseId
metadataKey
displayName
poe2dbPageUrl
artPath
sourceImageUrl
```

A mapping is accepted only when the Poe2DB page identity matches the normalized `metadataKey`. Name-only matches, inferred art paths, and transformed metadata paths are rejected.

## Architecture

The implementation consists of one development-only Node command and repository-owned reports. It does not run in the browser and is not needed to use or deploy the application.

The command has three explicit phases:

1. `resolve` builds or refreshes the exact metadata-to-art manifest without downloading the full artwork collection.
2. `download` reads the verified manifest, downloads missing WebP sources, converts them to PNG, and writes numeric destination files.
3. `verify` validates the manifest and every existing mapped image without network access.

A convenience `all` mode runs `resolve`, `download`, and `verify` in order. Rerunning any phase is safe and resumable.

## Resolver

The resolver reads mapped bases from `data/normalized/base-items.json` and missing destinations from the generated asset requirements. It queries only public HTTPS Poe2DB surfaces and uses exact metadata identity wherever the site exposes it.

Resolver behavior:

- reuse an existing verified manifest entry when its base ID, metadata key, and source URL remain valid;
- resolve duplicate display names independently by metadata key;
- accept only `Art/...` paths and `https://cdn.poe2db.tw/image/` source URLs;
- reject cross-origin redirects, credentials, local/private hosts, or ambiguous page results;
- record unresolved and conflicting bases as structured failures;
- never synthesize an art path from a display name or metadata key;
- throttle requests and use bounded retries with exponential backoff;
- write progress atomically so an interrupted run can resume.

If Poe2DB presents bot protection, a CAPTCHA, or an explicit access denial, the process stops. It must not bypass those controls.

## Downloader and conversion

The downloader operates only on verified manifest entries whose numeric PNG destination is absent or fails offline verification.

For every source image it must:

1. request the public HTTPS CDN URL with a descriptive repository user agent;
2. enforce redirect, timeout, and maximum-response-size limits;
3. require a successful response and an image MIME type;
4. validate WebP or PNG magic bytes before decoding;
5. decode the complete image and reject zero-sized, corrupt, or truncated payloads;
6. convert WebP sources to genuine RGBA PNG data rather than renaming extensions;
7. write to a same-directory `.part` file;
8. validate the PNG signature and decoded dimensions;
9. atomically rename it to `assets/item-bases/<baseId>.png`;
10. record source and output SHA-256 hashes, dimensions, byte sizes, and completion time.

Concurrency is deliberately low and configurable, with a conservative default. Existing checksum-verified PNGs are skipped. A force flag redownloads only explicitly named base IDs; bulk overwrite is not supported.

## Outputs

The pipeline produces two small, reviewable JSON reports:

- a source manifest keyed by numeric base ID;
- a run report containing counts, failures, hashes, dimensions, and source provenance.

Temporary payloads and `.part` files are not committed. Successful output consists of real PNG files under the existing `assets/item-bases/` directory.

The generated `reports/asset-requirements.json` and Markdown report are refreshed after a successful run. Complete coverage is:

```text
required: 1759
existing: 1759
missing: 0
```

## Runtime and repository impact

The application continues to load only the selected base and visible stash images. The full collection is not added to the app shell or precached by the service worker. The bounded runtime image cache remains unchanged, so thousands of repository files do not become thousands of startup requests.

At the user's estimate of 25 KB per file, the complete collection is approximately 42 MiB. Git file count increases substantially, but application startup cost does not. The artwork stays in one purpose-specific directory; the manifest and downloader keep it maintainable and debuggable.

No service-worker cache-version change is required solely for previously absent image files. A cache-version change is required only if runtime or cache behavior changes.

## Rights and attribution

The project remains a non-commercial fan project. Poe2DB is used as a development-time discovery and delivery surface, not as a claimed owner or runtime dependency. Artwork provenance is retained per file.

The existing application already states that it is fan-made and not affiliated with Grinding Gear Games. That notice remains visible. No claim is made that Poe2DB's wiki-content license grants rights to the game artwork.

## Error handling

Failures are isolated per base and do not invalidate completed assets. The command exits nonzero if any requested base remains unresolved, fails download/conversion, or fails offline verification.

The failure report distinguishes at least:

- unresolved page or metadata identity;
- ambiguous identity;
- disallowed URL or redirect;
- HTTP or timeout failure;
- invalid MIME or file signature;
- decode/conversion failure;
- dimension or checksum failure;
- filesystem or atomic-rename failure.

No HTML error page, partial response, or merely renamed WebP may appear as a `.png` asset.

## Testing

Unit-level tests cover URL allowlisting, exact metadata matching, duplicate names, manifest validation, retry classification, magic-byte checks, PNG conversion, skip/resume behavior, atomic writes, and failure-report determinism.

Offline verification checks all mapped numeric files, PNG signatures, successful decode, positive dimensions, duplicate/unknown IDs, leftover `.part` files, and manifest coverage.

At the stable slice boundary, run the repository's full required checks:

```text
node validation.mjs
node ui-validation.mjs
node data-validation.mjs
node tools/build-normalized-data.mjs --check
node tools/build-currency-index.mjs --check
node tools/sync-poe2-data.mjs verify
node fuzz.mjs 30000 542026
```

Also verify direct `file://`, HTTP loading, base switching, stash thumbnails, a dynamically cached image offline, and graceful fallback for an uncached or missing image.

## Acceptance criteria

- Every mapped base has either a verified manifest entry and valid PNG or an explicit failure record.
- A complete successful run reports 1,759 existing assets and zero missing.
- Every source mapping is corroborated by exact metadata identity.
- Existing valid artwork is preserved by default.
- Interrupted runs resume without corrupt files or repeated completed work.
- The shipped application remains static, GitHub Pages compatible, direct-`file://` compatible, and independent of Poe2DB at runtime.
- Full repository checks and browser smoke tests pass.

## Non-goals

- No crafting-currency icon acquisition in this slice.
- No mechanic, probability, modifier, or base-data changes.
- No runtime fetching from Poe2DB.
- No bulk precaching of the artwork collection.
- No inferred or placeholder artwork for unresolved bases.
