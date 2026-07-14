# PoE2DB data-source research

Target game version: **0.5.4**.

This note records only what can be established from the supplied files and checked-in provenance. No network request was made, no PoE2DB runtime dependency was added, and none of the supplied third-party files was copied into the repository.

## Supplied artifact audit

| Artifact | Bytes | SHA-256 | Result |
|---|---:|---|---|
| `autocompletecb_us.0387c2cae16eb0c7.json` | 593,734 | `71837cad8ab6987e674c31dade0bbd8f85b1208d09beaf11ea3e6cfad1d63553` | Valid JSON array with 6,748 search records. |
| `ModsView.f39fca410dd746d3.js` | 52,343 | `967efb19b218b4d92a7129fb60ee694ea3fee3a3015dd75cf7dd64d6cbb0a2a5` | Minified client bundle. It consumes a structured object supplied to the `ModsView` constructor; it does not fetch that object itself. |
| `ModsView_prettier.js` | 72,201 | `715348032df909811f87538637cd20e34bce618f04cbdbc4bdbe163f3e028877` | Formatting-only copy of the same bundle, used for inspection. |
| `poe2db.tw_Archive [26-07-14 16-49-03].har` | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` | Empty file. It contains no requests, response bodies, query parameters, headers, or endpoint evidence. |

The bundle and HAR remain external research inputs. Their hashes are recorded so a future capture can be distinguished from this audit.

## Useful routes and payload surfaces

| URL or route | Confidence | Response/payload type | Useful fields | Coverage | Version/filter signal | Repository mapping | Use |
|---|---|---|---|---|---|---|---|
| Captured `autocompletecb_us.0387c2cae16eb0c7.json` asset; origin path was not preserved | Confirmed response artifact; endpoint URL unconfirmed | JSON array | `label`, `value`, `desc`, `class` | Names/slugs for currency, Omens, Augments, bases, wiki pages, and other searchable records | `us` locale appears in the filename; no game-version field | Candidate-name and category cross-check only; never sufficient for a mechanic | Build-time research only |
| Locale-relative `Modifiers` route (the bundle renders an `<a href="Modifiers">`) | Confirmed page route in bundle | HTML document with a server-injected structured JavaScript object passed to `new ModsView(payload)` | Page payload fields listed below | Base-specific explicit modifiers, pools, tags, levels, weights, and Essence-associated rows | The bundle selects PoE2 behavior only when `document.location.host === "poe2db.tw"`; no explicit game-version query was found | `data/normalized/modifiers.json`, modifier overlays, and provenance | Strong candidate for build-time extraction after a response-containing capture; never runtime |
| `?s=Data%5CBaseItemTypes%2F<metadata-key>` | Confirmed request route emitted by the bundle; response not captured | Unverified hover response, likely an HTML fragment | Base-item identity and rendered item text are the intended payload, but exact fields cannot be claimed without a response | Currency, Omen, and other base-item hover records | Metadata key is URL-encoded; no explicit version parameter was found | `metadataKey`, retained item descriptions, item-class applicability | Build-time corroboration only after response verification |
| `https://cdn.poe2db.tw/image/<Art path>` | Confirmed absolute URL construction in bundle | Image binary, usually WebP by referenced paths | Artwork path only | Currency/Omen/base artwork | PoE2 host selected by the same host check | Optional local artwork provenance, not mechanics | No runtime dependency; not needed for this slice |
| Checked-in provenance routes `/us/Crafting`, `/us/Omen`, and `/us/Abyss` | Repository provenance; not verified by the empty HAR | HTML pages | Human-readable item text and category membership | Crafting currency, Omens, Abyss | Locale in path; target-version content still needs capture-level verification | Evidence references in the crafting registry | Build-time/manual verification only |

### Structured `ModsView` page payload

The constructor receives the payload as its argument and immediately deep-copies it. There is no `fetch`, `XMLHttpRequest`, or Axios call in the supplied bundle. This means the useful structured modifier data is most likely serialized into the `Modifiers` document by the server, or supplied by another page script not included here.

Fields directly consumed by the bundle include:

- payload groups: `config`, `opt`, `baseitem`, and modifier-pool arrays such as `normal`, `essence`, `master`, and `delve`;
- base/filter context: `opt.ItemClassesCode`, `baseitem.link_name`, and base-item `code` values;
- modifier identity and grouping: `Code`, `ModGenerationTypeID`, `ModFamilyList`, `mod_no`, and `hover`;
- mechanics data: `DropChance`, `Level`, `str`, `fossil_no`, and `mod_fossil_item`;
- derived client fields: the first `ModFamilyList` entry becomes the conflict group, generation type plus group forms a grouping key, and descending distinct `Level` values determine displayed tier order.

Those fields map naturally to the repository's modifier identity, affix side/generation type, modifier group, required item level, display template, spawn weight, and tag/restriction records. Extraction should happen in a development script that writes a minimal normalized snapshot with provenance. The shipped application must not parse a PoE2DB page or depend on its availability.

### Hard-coded bundle catalogue

The bundle also contains client-side currency, Essence, Abyssal Bone, and Omen objects with fields such as `name`, `code`, `icon`, `type`, `beforeRarity`, `beforePools`, `beforeClassIds`, `afterRarity`, `afterTrigger`, and `afterQuantity`. These are useful discovery leads, not an independently versioned endpoint. The bundle contains spelling inconsistencies and represents frontend behavior, so it was not committed or treated as stronger evidence than the checked-in normalized export.

## Endpoint conclusion

The only confirmed JSON response is the autocomplete asset, and it contains search metadata rather than crafting mechanics. The `ModsView` bundle proves that a rich structured modifier payload exists at page-render time, but it does not reveal a standalone JSON endpoint. Because the HAR is empty, claiming an XHR/fetch URL, response schema, game-version parameter, or filter parameter would be invention.

The highest-value next capture is therefore the complete `Modifiers` document response and any Fetch/XHR requests made while changing base item, modifier pool, and item level. A replacement HAR should be exported with response content after enabling Preserve log and reloading the page. It should include Document and Fetch/XHR entries, not just request names. Until then, the safe integration plan is:

1. keep checked-in normalized data authoritative;
2. use PoE2DB routes only in development-time provenance checks;
3. normalize the minimum required fields into repository-owned JSON;
4. verify all extracted mechanics against target version 0.5.4;
5. keep the browser runtime fully static, offline-capable, and independent of PoE2DB.
