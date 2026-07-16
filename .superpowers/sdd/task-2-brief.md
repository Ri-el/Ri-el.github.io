# Task 2: Add the protected network module

## Goal

Create an importable, dependency-free network client for the Poe2DB resolver. It must enforce the repository's public-HTTPS and host/path allowlists, reject private or loopback destinations (including redirect targets), bound response sizes and timeouts, apply one shared pacing limiter across concurrent workers, and retry only transient statuses/timeouts with bounded exponential backoff.

## Files in scope

- Create `tools/base-art-network.mjs`.
- Modify `tools/base-art-validation.mjs` to add deterministic offline policy/fixture checks and a `--network-only` mode.

## Required interface

Export `createNetworkClient(options)`, returning `getText(url)`, `getBytes(url)`, and `stats()`. Returned responses contain `url`, `status`, `headers`, and `body` (text or `Uint8Array`/Buffer as appropriate).

Export or otherwise expose deterministic policy helpers needed by the harness, including `assertAllowedSourceUrl` and `shouldRetryStatus`.

Defaults:

- two-second global request interval (configurable for tests/CLI);
- 30-second abort timeout;
- 32 MiB maximum body size;
- at most three manual redirects;
- public DNS/address checks for every request and redirect target;
- four total attempts with exponential backoff for 408, 425, 429, 5xx, and timeout/network failures only.

Allow only:

- Poe2DB page/catalog sources on `https://poe2db.tw` / `https://www.poe2db.tw` with approved paths;
- artwork sources on `https://cdn.poe2db.tw/image/Art/...`.

Reject HTTP, unknown hosts, unknown CDN paths, credentials, non-default ports, malformed URLs, private/loopback/link-local/multicast/reserved IP literals, and redirects that leave the allowlist. Never follow redirects automatically; inspect and validate each `Location` yourself.

Use built-in Node APIs only. Do not import the monolithic `tools/sync-poe2-data.mjs` because it executes at module load. Do not make network calls from deterministic tests. Preserve errors with status/URL/attempt context, classify access denial/CAPTCHA as non-retryable, and expose enough stats for the CLI to report request/byte/retry counts.

## Tests to add/run

The offline harness must include at least:

```js
assert.throws(() => assertAllowedSourceUrl(
  'http://poe2db.tw/us/Crimson_Amulet'
), /HTTPS/);
assert.throws(() => assertAllowedSourceUrl(
  'https://cdn.poe2db.tw/cache2/x'
), /allowlist/);
assert.equal(shouldRetryStatus(429), true);
assert.equal(shouldRetryStatus(404), false);
```

Also cover host/path case normalization, credentials/ports, private IP literals, redirect limits/policy, body cap, timeout/retry classification, and shared limiter option validation without contacting the internet. Existing `--core-only` checks must remain green.

## Constraints

- Keep the shipped app untouched.
- No dependency installation.
- No bypasses for bot protection/CAPTCHA/access denial.
- Use `apply_patch` for repository edits.
- Run syntax checks, `node tools/base-art-validation.mjs --core-only`, and `--network-only` with the bundled Node runtime before reporting completion.

## Completion report

Report changed files, exact commands and outputs, policy decisions, and any follow-up risks in `.superpowers/sdd/task-2-report.md`. Commit with:

`feat: add guarded Poe2DB network client`
