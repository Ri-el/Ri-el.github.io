
# Poe2DB Base Art Acquisition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Resolve every mapped concrete base to an exact Poe2DB artwork path, download missing artwork safely, convert it to valid PNG, and verify complete local coverage without adding a runtime dependency.

**Architecture:** A small importable core owns catalog identity, HTML Type/Icon parsing, URL allowlists, image signatures, and manifest validation. A separate network module applies the repository's public-HTTPS, DNS, redirect, timeout, response-size, retry, and rate-limit rules. A guarded CLI composes those modules into resolve, download, verify, and all commands; conversion is an optional development adapter supplied by a local sharp or Pillow-capable runtime.

**Tech Stack:** Static HTML/CSS/JavaScript application; Node.js ESM development scripts; built-in fetch, node:fs, node:crypto, and node:test-style assertions; optional bundled sharp/Pillow only for WebP-to-PNG conversion; no package.json or shipped runtime dependency.

## Global Constraints

- The shipped application remains static HTML, CSS, and JavaScript, compatible with GitHub Pages and direct file:// use.
- The browser runtime never fetches Poe2DB and does not require a development server or package installation.
- The authoritative destination is assets/item-bases/<numeric-base-id>.png.
- Only the 1,759 IDs in generated mapped asset requirements are processed; unmapped Timeless Jewel ID 613 is excluded.
- Mapping requires an exact, case-sensitive Poe2DB Type metadata key; display-name or inferred-path matches are rejected.
- Existing valid artwork is never overwritten by a normal run.
- WebP bytes are decoded and converted to genuine PNG; changing a file extension is invalid.
- Network requests use public HTTPS only, bounded redirects/timeouts/response sizes, low concurrency, retries, and rate limiting.
- CAPTCHA, bot protection, access denial, or ambiguous identity stops the affected work without bypass attempts.
- Temporary .part files are never accepted as completed assets.
- The existing fan-made, non-affiliation notice remains visible; no artwork license is inferred from Poe2DB wiki licensing.
- Runtime/service-worker behavior is unchanged unless a runtime asset or cache rule is modified.
- At a stable slice boundary, run all repository checks required by AGENTS.md.

---

## File map

| File | Responsibility |
|---|---|
| tools/base-art-core.mjs | Pure catalog projection, slug candidates, HTML Type/Icon extraction, URL allowlists, image signatures, manifest validation, and hashes. |
| tools/base-art-network.mjs | Public-HTTPS fetch, DNS/private-address checks, bounded body reads, pacing, retry/backoff, and response classification. |
| tools/base-art-converter.mjs | Optional sharp/Pillow adapter exposing one WebP-to-PNG interface. |
| tools/convert-webp-to-png.py | Checked-in Pillow fallback helper using one-input/one-output command arguments. |
| tools/sync-base-art.mjs | Guarded resolve/download/verify/all CLI and progress/report orchestration. |
| tools/base-art-validation.mjs | Dependency-free deterministic unit and fixture harness. |
| docs/poe2db-base-art.md | Maintainer commands, converter configuration, provenance, and recovery instructions. |
| .gitignore | Ignores only downloader .part files under assets/item-bases. |
| reports/poe2db-base-art-manifest.json | Generated baseId/metadataKey/page/art/source mapping and source-catalog hash. |
| reports/poe2db-base-art-run.json | Generated counts, failures, hashes, dimensions, and converter metadata. |

---

### Task 1: Build and test the pure identity/parser core

**Files**

- Create: tools/base-art-core.mjs
- Create: tools/base-art-validation.mjs

**Interfaces**

- buildMappedBaseCatalog(baseItems, assetRequirements) returns BaseRecord objects with baseId, metadataKey, displayName, assetPath, and selectable.
- parsePoe2DbSections(html, pageUrl) returns PageSection objects with metadataKey, artPath, sourceImageUrl, and pageUrl.
- matchExactSection(baseRecord, sections) returns one exact section or throws for missing/ambiguous identity.
- buildPoe2DbImageUrl(artPath), isWebp(buffer), isPng(buffer), sha256(buffer), and validateManifest(value) are exported.

- [ ] Step 1: Write failing fixture checks.

~~~js
const sections = parsePoe2DbSections(
  '<table><tr><td>Type</td><td>Metadata/Items/Amulets/FourAmulet1</td></tr>' +
  '<tr><td>Icon</td><td>Art/2DItems/Amulets/Basetypes/CrimsonAmulet</td></tr></table>',
  'https://poe2db.tw/us/Crimson_Amulet'
);
assert.equal(
  matchExactSection({metadataKey: 'Metadata/Items/Amulets/FourAmulet1'}, sections).artPath,
  'Art/2DItems/Amulets/Basetypes/CrimsonAmulet'
);
assert.throws(
  () => matchExactSection({metadataKey: 'Metadata/items/Amulets/FourAmulet1'}, sections),
  /missing/i
);
assert.throws(() => buildPoe2DbImageUrl('https://evil.example/x.webp'), /art path/i);
assert.equal(isWebp(Buffer.from('RIFF0000WEBPVP8 ')), true);
assert.equal(isPng(Buffer.from('89504e470d0a1a0a', 'hex')), true);
~~~

- [ ] Step 2: Run the harness and verify the expected failure.

Run: bundled Node tools/base-art-validation.mjs --core-only
Expected: nonzero exit naming the missing exports.

- [ ] Step 3: Implement the minimal pure core.

Parse every HTML table and every base-item data-hover link, pair only a section's own Type and Icon values, decode HTML entities, preserve metadata-key case, and reject non-Art icons. Do not select the first page image.

~~~js
export function buildPoe2DbImageUrl(artPath) {
  if (!/^Art\/[A-Za-z0-9_./-]+$/.test(artPath)) {
    throw new Error('Invalid Poe2DB art path');
  }
  return new URL('https://cdn.poe2db.tw/image/' + artPath + '.webp');
}

export function matchExactSection(base, sections) {
  const matches = sections.filter(section => section.metadataKey === base.metadataKey);
  if (matches.length === 0) throw new Error('Missing Poe2DB identity: ' + base.metadataKey);
  if (matches.length !== 1) throw new Error('Ambiguous Poe2DB identity: ' + base.metadataKey);
  return matches[0];
}
~~~

- [ ] Step 4: Run the core harness and commit.

Run: bundled Node tools/base-art-validation.mjs --core-only
Expected: all core checks pass.

Commit:
~~~text
git add tools/base-art-core.mjs tools/base-art-validation.mjs
git commit -m "feat: add exact Poe2DB base art identity parser"
~~~

### Task 2: Add the protected network module

**Files**

- Create: tools/base-art-network.mjs
- Modify: tools/base-art-validation.mjs

**Interfaces**

- createNetworkClient(options) returns getText(url), getBytes(url), and stats().
- Returned responses contain url, status, headers, and body.
- Defaults are a two-second global interval, 30-second timeout, 32 MiB body cap, three redirects, public DNS, and four attempts with exponential backoff for 408/425/429/5xx and timeouts.

- [ ] Step 1: Add offline policy checks.

~~~js
assert.throws(() => assertAllowedSourceUrl(
  'http://poe2db.tw/us/Crimson_Amulet'
), /HTTPS/);
assert.throws(() => assertAllowedSourceUrl(
  'https://cdn.poe2db.tw/cache2/x'
), /allowlist/);
assert.equal(shouldRetryStatus(429), true);
assert.equal(shouldRetryStatus(404), false);
~~~

- [ ] Step 2: Implement the client by extracting the proven primitives in tools/sync-poe2-data.mjs.

Reuse hostname normalization, private-address detection, manual redirects, bounded streaming reads, and abort timeouts. Add explicit host/path allowlists and one shared limiter so concurrent workers cannot defeat pacing. Do not import the monolithic sync CLI because it executes at module load.

- [ ] Step 3: Run tests and commit.

Run: bundled Node tools/base-art-validation.mjs --network-only
Expected: all offline network-policy checks pass.

Commit:
~~~text
git add tools/base-art-network.mjs tools/base-art-validation.mjs
git commit -m "feat: add guarded Poe2DB network client"
~~~

### Task 3: Implement conversion and no-overwrite file primitives

**Files**

- Create: tools/base-art-converter.mjs
- Create: tools/convert-webp-to-png.py
- Modify: tools/base-art-validation.mjs
- Modify: .gitignore

**Interfaces**

- loadConverter(options) returns name, version, and convertWebpToPng(buffer).
- writePngIfAbsent(destination, pngBuffer) returns written or skipped.
- readVerifiedPng(path) returns width, height, bytes, and sha256.

- [ ] Step 1: Add converter/file fixture tests.

Use a tiny known PNG and a fake converter. Assert an existing destination remains byte-identical and a .part file never counts as complete.

- [ ] Step 2: Implement optional converter loading.

Resolution order is --sharp-module/POE2_SHARP_MODULE, normal sharp import, then --python/POE2_PYTHON invoking tools/convert-webp-to-png.py with an input path and output path. If no converter is available, fail with the exact command needed to supply one; never install packages automatically.

Sharp conversion uses:

~~~js
await sharp(input, {limitInputPixels: 4_000_000})
  .rotate()
  .png({compressionLevel: 9, adaptiveFiltering: true, palette: false})
  .toBuffer();
~~~

Validate WebP magic before conversion, PNG signature after conversion, positive dimensions, and a maximum of four million pixels.

- [ ] Step 3: Add the .part ignore rule, run tests, and commit.

Append to .gitignore:
~~~text
assets/item-bases/*.part
~~~

Run: bundled Node tools/base-art-validation.mjs --converter-only
Expected: converter-boundary checks pass; integration passes when the configured bundled converter is supplied.

Commit:
~~~text
git add tools/base-art-converter.mjs tools/base-art-validation.mjs .gitignore
git commit -m "feat: add safe WebP conversion and asset writes"
~~~

### Task 4: Build the resumable resolver CLI

**Files**

- Create: tools/sync-base-art.mjs
- Modify: tools/base-art-validation.mjs

**Interfaces**

- CLI commands: resolve, download, verify, and all.
- Resolve/download accept --limit, --delay-ms, and --concurrency.
- Download accepts --sharp-module and --python.
- Generated files are reports/poe2db-base-art-manifest.json and reports/poe2db-base-art-run.json.

- [ ] Step 1: Add resolver fixtures.

Use Crimson Amulet and Golden Blade fixtures. Golden Blade contains two Type/Icon sections; assert the exact Metadata/items/...OneHandSwordDemigods1 section is selected, not the first same-name section. Assert the mapped catalog count is 1,759 and ID 613 is absent.

- [ ] Step 2: Implement catalog and slug discovery.

Read reports/asset-requirements.json and data/normalized/base-items.json. Fetch the current US autocomplete catalog once, hash it, and use exact label/value records as slug candidates. Add a deterministic display-name slug (spaces to underscores, apostrophes removed, URL-encode the remainder) only as fallback. Deduplicate page URLs while retaining every expected metadata key.

- [ ] Step 3: Implement page resolution and atomic progress.

For each candidate page, parse all Type/Icon pairs and call matchExactSection. Write a partial manifest atomically after each resolved page; rerun resumes from valid records. A page with no exact identity becomes a structured failure, not a guessed mapping. The final manifest includes catalog hash, target game version, resolver timestamp, and one record per mapped base.

- [ ] Step 4: Run a bounded live resolver smoke test.

Run:
~~~text
bundled Node tools/sync-base-art.mjs resolve --limit 3 --delay-ms 1000 --concurrency 1
~~~

Expected: three records resolve to exact Type/Icon pairs and the partial manifest validates. Inspect records before full resolution. Commit:
~~~text
git add tools/sync-base-art.mjs tools/base-art-validation.mjs
git commit -m "feat: resolve Poe2DB base art manifest"
~~~

### Task 5: Resolve the full manifest and download missing artwork

**Files**

- Generated: reports/poe2db-base-art-manifest.json
- Generated: reports/poe2db-base-art-run.json
- Generated: assets/item-bases/<baseId>.png

- [ ] Step 1: Resolve all mapped records.

Run:
~~~text
bundled Node tools/sync-base-art.mjs resolve --delay-ms 1000 --concurrency 2
~~~

Stop on access denial or CAPTCHA and preserve the failure report; do not lower controls to bypass a block.

- [ ] Step 2: Check manifest invariants before image requests.

Run: bundled Node tools/sync-base-art.mjs verify --manifest-only
Expected: 1,759 unique IDs, unique metadata keys, all page URLs on Poe2DB, all image URLs on the allowlisted CDN, and zero unresolved or ambiguous records.

- [ ] Step 3: Download and convert in resumable batches.

Run with the configured bundled converter:
~~~text
C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/sync-base-art.mjs download --delay-ms 500 --concurrency 4 --sharp-module C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\sharp@0.34.5\node_modules\sharp\lib\index.js
~~~

Skip checksum-verified 2563.png. Write each new image to a unique .part, validate decoded dimensions and PNG bytes, then rename only into an absent destination. Failed IDs remain in the run report for targeted retry.

- [ ] Step 4: Run offline verification and regenerate requirements.

Run:
~~~text
bundled Node tools/sync-base-art.mjs verify
bundled Node tools/build-asset-requirements.mjs
bundled Node tools/build-asset-requirements.mjs --check
~~~

Expected: 1,759 existing, 0 missing; no unknown files, corrupt PNGs, or .part files.

### Task 6: Document and complete repository verification

**Files**

- Create: docs/poe2db-base-art.md
- Modify: README.md
- Generated: reports/asset-requirements.json and reports/asset-requirements.md

- [ ] Step 1: Document exact commands, converter path discovery, non-commercial/non-affiliation notice, no-runtime-dependency rule, resume behavior, provenance, and failed-ID retry.

- [ ] Step 2: Run the dedicated harness.

Run: bundled Node tools/base-art-validation.mjs
Expected: all deterministic parser, network-policy, converter-boundary, manifest, and no-overwrite checks pass.

- [ ] Step 3: Run all required repository checks.

~~~text
bundled Node validation.mjs
bundled Node ui-validation.mjs
bundled Node data-validation.mjs
bundled Node tools/build-normalized-data.mjs --check
bundled Node tools/build-currency-index.mjs --check
bundled Node tools/sync-poe2-data.mjs verify
bundled Node fuzz.mjs 30000 542026
~~~

Expected: every command exits zero. Then verify direct file:// and HTTP browser smoke, including base switching, selected art, stash images, offline visited-image caching, and missing-image fallback.

- [ ] Step 4: Review the final diff and commit.

Run:
~~~text
git diff --check
git status --short
git diff --stat
~~~

Confirm no source data or unrelated runtime files changed, no .part files remain, and generated reports state complete coverage. Commit:
~~~text
git add .gitignore README.md docs/poe2db-base-art.md tools reports assets/item-bases
git commit -m "feat: add verified Poe2DB base artwork"
~~~

## Plan self-review

- Identity mapping is covered by Tasks 1 and 4.
- Network safety is covered by Task 2.
- Conversion and no-overwrite behavior are covered by Task 3.
- Resumability and reports are covered by Tasks 4 and 5.
- Rights, runtime independence, documentation, and required checks are covered by Task 6.
- Duplicate names and case-sensitive metadata are fixture-tested.
- The unmapped Timeless Jewel is excluded by consuming generated mapped requirements.
- No task requires an application dependency, a server, a package installation, or a guessed mechanic.
- Function names and report paths are consistent across tasks.
