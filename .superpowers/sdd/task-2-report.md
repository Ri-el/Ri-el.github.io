# Task 2 implementation report

Status: DONE

Commit: `169b477` (`feat: add guarded Poe2DB network client`)

Hardening checkpoint: `cac0c14` (`fix: harden Poe2DB network policy and catalog provenance`)

## Scope

Added a dependency-free guarded Poe2DB network client and extended the deterministic base-art harness with offline network-policy tests. No live request, dependency installation, runtime file, source data, report data, or asset change was made.

## Files

- `tools/base-art-network.mjs` (new)
  - exact HTTPS host/path allowlists for Poe2DB US pages, the hashed US autocomplete catalog, and CDN `image/Art/...webp` paths;
  - credentials, non-default ports, path traversal, private/local hosts, and private/reserved DNS answers rejected;
  - manual redirects with validation and a three-hop default limit;
  - one shared request-start limiter across concurrent callers (2,000 ms default);
  - 30-second DNS/request timeouts, 32 MiB bounded streaming reads, and stream cancellation on overflow;
  - four-attempt bounded retry/backoff for 408/425/429/5xx and network/timeouts only;
  - explicit non-retry behavior for access denial, CAPTCHA/bot challenges, malformed policy inputs, and body-limit failures;
  - text/byte responses and request/response/retry/redirect/byte/failure statistics.
- `tools/base-art-validation.mjs`
  - adds `--network-only` with 16 offline checks while preserving 12 `--core-only` checks;
  - injects fake fetch/DNS/clock/sleep primitives, so the harness never contacts the internet.

## TDD evidence

Initial red command:

```text
C:\Users\intern_sts\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tools/base-art-validation.mjs --network-only
```

Observed expected failure before the production module existed:

```text
base-art validation failed: Missing module ./base-art-network.mjs: Cannot find module .../tools/base-art-network.mjs
EXIT=1
```

The first limiter implementation then exposed a real concurrency-order regression:

```text
Expected request starts [0, 10, 20]
Actual request starts   [10, 20, 20]
EXIT=1
```

The limiter now holds its start slot until `fetch` is invoked, without serializing the entire response. A separate streaming fixture then proved an oversized locked stream was not being canceled:

```text
base-art validation failed: oversized streams must be canceled
false !== true
EXIT=1
```

The reader now cancels through its active lock and always releases it.

Final green verification:

```text
base-art core checks passed (12)
base-art network checks passed (16)
node --check tools/base-art-network.mjs      # exit 0
git diff --check                             # exit 0
```

## Policy decisions

- The CDN JSON allowlist is restricted to hashed `autocompletecb_us.<hex>.json` names; general CDN JSON/cache paths remain rejected.
- Every redirect repeats URL allowlist and public-DNS checks.
- A 200 response that contains an HTML CAPTCHA/access challenge is a hard policy failure, not a retry/bypass opportunity.
- DNS answers must all be public. A mixed public/private answer is rejected.
- The module returns successful 2xx responses only; non-2xx results carry URL/status/attempt context in errors.
- Full-response timeout races cover transports and body readers that ignore AbortSignal; stalled streams are canceled through their active reader.
- The manifest validator accepts only the observed hashed CDN autocomplete URL shape and rejects ports, userinfo, fragments, and cache paths.

## Handoff

Task 4 can construct one client and share it across resolver workers, ensuring concurrency cannot bypass pacing. The live smoke remains intentionally deferred until the CLI owns bounded progress/report handling.
