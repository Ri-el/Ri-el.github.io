# PoE2DB data-source research

Target game version: **0.5.4**.

This note records the supplied-file audit plus the read-only network verification authorised on 2026-07-14. No PoE2DB runtime dependency was added, and none of the supplied third-party files was copied into the repository.

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
| `/us/Catalysts`, `/us/Flesh_Catalyst`, and `/us/Refined_Flesh_Catalyst` | Confirmed live pages | Structured HTML item cards and tables | Metadata ID, tags, stack size, target class, affected modifier family, replacement text | All 13 ordinary and 13 Refined Catalysts | Current live `us` locale; checked against target 0.5.4 records | `craftingMechanics.catalystsByItemId`, generated Breach registry records | Build-time evidence only |
| `/us/Alloy` and `/us/<Alloy_Name>` (for example `/us/Runic_Alloy`) | Confirmed live pages | Structured HTML item cards and class/modifier tables | Exact class applicability, affix side, required level, localized modifier lines and ranges | All 13 Alloys | Current live `us` locale; 0.5.0 introduction cross-checked with official notes | normalized Essence type 5, runtime guaranteed-modifier records, Runeforging registry | Build-time evidence only |
| `/us/Omen_of_Catalysing_Exaltation` | Confirmed live page | Structured HTML item card and metadata table | Metadata ID, Exalted trigger text, all-quality consumption text, consume-when-triggered text | Omen source item 4448 | Current live `us` locale; no 0.5.4 patch-note override found | Ritual Omen definition and weighted Exalted operation | Build-time evidence only |
| `/us/Quality` | Confirmed live reference page | Structured HTML mechanics tables | Default quality maximum and Catalyst quality families | Catalyst cap/scaling corroboration | Current live `us` locale | Catalyst cap and display behavior | Build-time evidence only |

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

### Catalogue completeness cross-check

The focused `currencies2` object contains 60 metadata-keyed item-modifier records: 31 `Currency` records and 29 `Omen` records. All **60/60 metadata keys** already exist in both `data/normalized/crafting-items.json` and the authoritative crafting registry. No focused ModsView currency is missing from **All known items**. Before this recheck, Ancient Jawbone, Ancient Rib, and Ancient Collarbone were present but classified as blocked, so Available mode hid them. They are now executable inferred Well operations; Preserved Vertebrae is the only blocked Abyss record because it targets Waystones, which the simulator does not model.

The bundle is not reliable enough to override the normalized source by itself. It labels the Vaal Orb record as “Perfect Exalted Orb” and associates the unqualified/high Rib names with inconsistent metadata keys. The checked-in method records are unambiguous: source items 4857, 4860, and 4863 use `poe2_desecrate_high` with `min_mod_level: 40`. The 0.5.4-targeted normalized modifier export independently contains 32 Jewel Desecrated records at required level 1 and 193 equipment Desecrated records at required level 65. Those class-wide levels cover the retained 20 Jewel and 680 equipment pool rows and make the Ancient level floor enforceable on both parts of the Well pool; the source manifest still records that its original export did not embed a game version.

The broader autocomplete asset is a search catalogue, not a crafting-mechanics catalogue. Of the relevant labels, all **271/271 Augments** match retained definitions by exact display name. It also contains 59 `Stackable Currency` labels and 12 `Omen` labels that do not occur in the checked-in normalized item inventory:

- Stackable Currency (59): `Albino Rhoa Feather`, `Artificer's Shard`, `Black Scythe Artifact`, `Breach Splinter`, `Broken Circle Artifact`, `Chance Shard`, `Cryptic Key`, `Crystallised Corruption`, `Exceptional Verisium`, `Exotic Coinage`, `Founders Verisium`, `Gemcutter's Prism`, `Greater Jeweller's Orb`, `Kamasa's Orb of Sacrifice`, `Kopec's Orb of Sacrifice`, `Lesser Jeweller's Orb`, `Liquid Verisium`, `Medved's Crest of the Circle`, `Mirror of Kalandra`, `Olroth's Crest of the Sun`, `Orb of Chance`, `Orb of Extraction`, `Order Artifact`, `Perfect Flux`, `Perfect Jeweller's Orb`, `Petition Splinter`, `Regal Shard`, `Revered Starlit Ore`, `Rogue's Marker`, `Runic Splinter`, `Scroll of Wisdom`, `Starlit Ore`, `Sun Artifact`, `Thaumaturgic Flux (Level 4)` through `Thaumaturgic Flux (Level 20)`, `Transmutation Shard`, `Uhtred's Crest of the Chalice`, `Venerable Starlit Ore`, `Veridical Starlit Ore`, `Verisium`, `Vorana's Crest of the Scythe`, `Warding Starlit Ore`, `Yaomac's Orb of Sacrifice`, and `Yugul's Orb of Sacrifice`.
- Omens (12): `Omen of Amelioration`, `Omen of Answered Prayers`, `Omen of Bartering`, `Omen of Chance`, `Omen of Gambling`, `Omen of Recombination`, `Omen of Refreshment`, `Omen of Reinforcements`, `Omen of Resurgence`, `Omen of Secret Compartments`, `Omen of the Ancients`, and `Omen of the Hunt`.

None of those 71 search-only labels appears in the focused ModsView modifier-crafting catalogue. The autocomplete records provide only `label`, slug-like `value`, `desc`, and CSS `class`; they do not provide a source item ID, metadata key, item mutation, target class, rarity gate, trigger, failure behavior, or probability. They are therefore recorded as import candidates rather than fabricated workbench definitions. A future normalized source refresh or non-empty response capture is required to decide which are equipment crafts, Skill Gem operations, encounter resources, fragments, or other non-workbench items.

### Alloy, Catalyst, and Catalysing Omen recheck

These records are present in the authoritative catalogue and are now executable in **Available** mode:

- All 13 Alloys (source item IDs 5049–5061) use their normalized type-5 class mappings, stable modifier IDs, ranges, affix sides, and modifier groups. Current PoE2DB class tables provide the missing localization. The runtime performs one atomic random removable-explicit replacement, excludes fractured modifiers, rejects existing group conflicts, and consumes the registered currency only after success. A socket or Runeforging state is not required by the item text.
- All 26 Catalysts (source item IDs 277–302) use the retained ordinary/Refined distinction and exact family tag. Ordinary Catalysts target Rings/Amulets; Refined Catalysts target Jewels. A different family replaces the previous quality type, matching tagged modifier values scale by 1% per quality point with truncation, and the cap is 20 plus fixed local maximum-quality modifiers. The per-use item-level curve and stochastic rounding remain explicitly classified as an inference from GGG's common quality rework and current published formula rather than an unpublished PoE2DB equation.
- Omen of Catalysing Exaltation (source item 4448) triggers from ordinary, Greater, and Perfect Exalted Orbs. A successful slam consumes all Catalyst quality and the armed Omen; failures are atomic. Matching candidate modifier tags receive the verified 5× multiplier at 20 quality and 7.5× at 40 quality, while modifier groups continue to govern conflicts only. Values between those tested points use a visibly inferred interpolation. Hinekora previews seal and commit the same weighted result.

The supplied in-game screenshot verifies the localization of normalized stat `local_maximum_quality_+` as `+20% to Maximum Quality`. The engine now preserves the stable source stat ID while rendering that exact player-facing line for Essence of the Breach instead of `local_maximum_quality: +20`.

## Endpoint conclusion

The only confirmed standalone JSON response is the autocomplete asset, and it contains search metadata rather than crafting mechanics. The `ModsView` bundle proves that a rich structured modifier payload exists at page-render time, but it does not reveal a standalone JSON endpoint. Current item pages expose useful server-rendered structured item and class/modifier tables; they are the reliable extraction surface used for this slice. Because the HAR is empty, claiming an additional XHR/fetch URL, response schema, game-version parameter, or filter parameter would still be invention.

The highest-value next capture remains the complete `Modifiers` document response and any Fetch/XHR requests made while changing base item, modifier pool, and item level. A replacement HAR should be exported with response content after enabling Preserve log and reloading the page. It should include Document and Fetch/XHR entries, not just request names. The integration boundary remains:

1. keep checked-in normalized data authoritative;
2. use PoE2DB routes only in development-time provenance checks;
3. normalize the minimum required fields into repository-owned JSON;
4. verify all extracted mechanics against target version 0.5.4;
5. keep the browser runtime fully static, offline-capable, and independent of PoE2DB.
