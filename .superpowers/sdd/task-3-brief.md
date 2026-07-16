# Task 3: Implement conversion and no-overwrite file primitives

## Goal

Add an optional development-only WebP-to-PNG converter boundary and safe asset file primitives. The shipped static app must remain dependency-free. Existing valid artwork must never be overwritten by a normal run; temporary `.part` files must never count as complete assets.

## Files in scope

- Create `tools/base-art-converter.mjs`.
- Create `tools/convert-webp-to-png.py`.
- Modify `tools/base-art-validation.mjs`.
- Append `assets/item-bases/*.part` to `.gitignore`.

## Required interface

- `loadConverter(options)` returns `{ name, version, convertWebpToPng(buffer) }`.
- `writePngIfAbsent(destination, pngBuffer)` returns an object indicating `written` or `skipped`; it must use an atomic unique `.part` path and never replace an existing destination.
- `readVerifiedPng(path)` returns width, height, bytes, and SHA-256 after validating a genuine PNG signature, positive dimensions, and no more than four million pixels.

## Converter behavior

Resolution order: explicit `--sharp-module`/`POE2_SHARP_MODULE`, normal `sharp` import if available, then explicit `--python`/`POE2_PYTHON` invoking the checked-in `tools/convert-webp-to-png.py` with one input path and one output path. If unavailable, fail with the exact command/configuration needed; never install packages automatically.

Sharp conversion must validate WebP magic and use the bounded pipeline:

```js
await sharp(input, { limitInputPixels: 4_000_000 })
  .rotate()
  .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
  .toBuffer();
```

Validate WebP magic before conversion, PNG signature after conversion, positive dimensions, and the pixel limit. The Python helper must use Pillow, accept exactly input/output arguments, write a genuine PNG, and produce a clear error when Pillow is unavailable.

## Tests to add/run

Extend `tools/base-art-validation.mjs` with a `--converter-only` mode and deterministic fixtures using a tiny known PNG and a fake converter. Assert an existing destination remains byte-identical, a `.part` file is ignored/not accepted, invalid signatures/dimensions are rejected, and converter discovery gives actionable errors. Existing `--core-only` and `--network-only` checks must remain green. Integration should pass with the bundled sharp module path supplied by the environment, but no package installation is allowed.

## Constraints

- Do not touch application runtime files or download assets in this task.
- Use `apply_patch` for repository edits.
- Run syntax checks and the relevant harness modes with the bundled runtimes.

## Completion report

Write `.superpowers/sdd/task-3-report.md` with red/green evidence, converter metadata behavior, no-overwrite proof, and the commit hash. Commit with:

`feat: add safe WebP conversion and asset writes`
