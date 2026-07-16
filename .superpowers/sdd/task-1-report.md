# Task 1 implementation report

Status: DONE

Commit: `1baff3c` (`feat: add exact Poe2DB base art identity parser`)

## Scope

Implemented the dependency-free identity/parser core requested by
`.superpowers/sdd/task-1-brief.md`. No network requests were made and no image,
runtime, source-data, report-data, or application files were changed.

## Files

- `tools/base-art-core.mjs` (new)
  - Projects only mapped asset requirements into deterministic base records.
  - Parses each Poe2DB table as an isolated Type/Icon container.
  - Parses live Poe2DB base-item `data-hover` links (`?s=Data\\BaseItemTypes/...`)
    and inline legacy hover-table fragments.
  - Preserves metadata-key case and exact matching semantics.
  - Canonicalizes only allowlisted `Art/...` values to the Poe2DB CDN URL.
  - Exposes WebP/PNG signature checks, SHA-256, and manifest validation.
- `tools/base-art-validation.mjs` (new)
  - Adds a dependency-free deterministic harness and `--core-only` mode.
  - Covers table pairing, case-sensitive identity, ambiguity, entity decoding,
    hero-image rejection, data-hover parsing, mapped-catalog projection, URL
    validation, image signatures, SHA-256, and manifest invariants.

## TDD evidence

Red command:

```text
C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/base-art-validation.mjs --core-only
```

Observed expected nonzero failure before the core existed:

```text
base-art validation failed: Missing module ./base-art-core.mjs: Cannot find module .../tools/base-art-core.mjs
RED_EXIT=1
```

Green command and output:

```text
C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/base-art-validation.mjs --core-only
base-art core checks passed (8)
```

Additional checks:

```text
node --check tools/base-art-core.mjs                  # exit 0
node --check tools/base-art-validation.mjs            # exit 0
git diff --check                                      # exit 0, no output
```

The catalog projection was also exercised against the checked-in normalized
data and generated requirements:

```text
mapped records: 1759
contains base ID 613: false
first record: base 369, exact Metadata/items/... key retained
```

A synthetic Golden Blade page containing two sequential Type/Icon sections was
checked manually; exact `Metadata/items/...` and `Metadata/Items/...` identities
resolved to their own art paths without case folding or first-section selection.

## Self-review

- The parser never selects a general page image. An image participates only as
  an Icon/Image table value or inside a `data-hover` anchor.
- Type and Icon values cannot cross table boundaries. Multiple sequential
  Type/Icon sections in one table are emitted independently.
- Duplicate identical DOM representations are deduplicated, while conflicting
  art paths remain separate so `matchExactSection` reports ambiguity.
- Catalog membership comes from generated asset requirements, not all normalized
  bases, which deterministically excludes unmapped base ID 613.
- Metadata identity comparison is exact and case-sensitive.
- The code uses only Node built-ins and does not affect the shipped static app.

## Concerns / handoff notes

- `validateManifest` defines Task 1's initial manifest contract: schema version
  1, target game version, catalog URL/hash, resolver timestamp, nonempty entries,
  exact numeric destination paths, allowlisted Poe2DB/CDN URLs, unique base IDs,
  and unique metadata keys. Task 4 should keep these field names or extend the
  validator deliberately alongside resolver fixtures.
- The parser is intentionally focused on the observed Poe2DB markup and the
  task fixtures; it is not a general-purpose HTML parser. Live resolver smoke
  tests in Task 4 remain necessary.

## Review fix: nested tables, exact attributes, and target invariant

Fix commit: `4abbe92` (`fix: harden Poe2DB base art parser`)

Review identified that row scanning on an outer table did not emit nested
Type/Icon tables independently, and that the old attribute regex could match
`src=` inside `data-src=`. The follow-up also made the current-target catalog
count/exclusion a core invariant rather than relying only on a manual check.

Regression fixtures were added before implementation. Observed red failures:

```text
# Exact attribute token regression
base-art validation failed: Expected values to be strictly equal:
+ actual - expected
+ 'Art/2DItems/Placeholder'
- 'Art/2DItems/Rings/Ring'
RED_EXIT=1

# Nested-table ownership regression (after exact-attribute fix)
base-art validation failed: Expected values to be strictly equal:
1 !== 2
RED_EXIT=1

# Current-target invariant regression (after nested-table fix)
base-art validation failed: Missing expected exception.
RED_EXIT=1
```

Implementation changes:

- Tokenize full HTML attribute names so `src` and `data-src` cannot alias.
- Parse only top-level rows owned by a table, remove nested-table content from
  those rows, and recursively parse each nested table with independent pairing
  state.
- For target `0.5.4`, require exactly 1,759 mapped records and reject unmapped
  Timeless Jewel ID 613 in `buildMappedBaseCatalog`.
- Read and validate the checked-in normalized catalog/report in the dedicated
  core harness so target drift fails deterministically.

Green verification:

```text
C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/base-art-validation.mjs --core-only
base-art core checks passed (12)
```
