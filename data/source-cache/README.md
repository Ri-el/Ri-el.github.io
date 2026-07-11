# Source cache

This directory stores provenance and deliberately staged source imports for the PoE 2 data pipeline.

`provenance.json` is the repository-owned record for the normalized snapshot currently used by the app. The legacy snapshot records the original export's filename, byte count, SHA-256, wrapper, parser, and target version from `data/normalized/version-manifest.json`. It also states explicitly that the raw export is not present. A hash record is not a substitute for the missing raw bytes, so the validator does not pretend to re-run that conversion.

New imports are created only by an explicit command such as:

```text
node tools/sync-poe2-data.mjs fetch --source-id <id> --url <public-https-url>
node tools/sync-poe2-data.mjs import --source-id <id> --file <local-file> --source-url <public-https-url>
```

Each import is written under its own source ID with raw bytes, HTTP/provenance metadata, normalized staging files, a browser bundle, and a coverage report. Imports are never promoted into `data/normalized/` automatically. Review the staged diff and source rights before deliberately replacing the active snapshot.

The fetcher accepts only public HTTPS endpoints, rejects credentials and private/local network addresses, sends an identifiable user agent, rate-limits requests, bounds response size, uses conditional `ETag`/`Last-Modified` requests, and validates the source schema before caching it.
