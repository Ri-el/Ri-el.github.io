#!/usr/bin/env node

/**
 * Deterministic, dependency-free checks for the base-art acquisition tools.
 *
 * The harness deliberately loads each optional phase lazily.  This keeps the
 * core phase useful before the network/converter modules exist and gives a
 * clear red failure when a required export has not been implemented yet.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const CORE_EXPORTS = [
  'buildMappedBaseCatalog',
  'parsePoe2DbSections',
  'matchExactSection',
  'buildPoe2DbImageUrl',
  'isWebp',
  'isPng',
  'sha256',
  'validateManifest',
];

const NETWORK_EXPORTS = [
  'createNetworkClient',
  'assertAllowedSourceUrl',
  'isPrivateAddress',
  'shouldRetryStatus',
];

const CONVERTER_EXPORTS = [
  'loadConverter',
  'writePngIfAbsent',
  'readVerifiedPng',
  'inspectPng',
];

function reportFailure(error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`base-art validation failed: ${message}`);
  if (process.env.BASE_ART_VALIDATION_STACK === '1' && error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
}

async function loadModule(fileName, requiredExports) {
  const fileUrl = new URL(fileName, import.meta.url);
  let module;
  try {
    module = await import(fileUrl.href);
  } catch (error) {
    throw new Error(`Missing module ${fileName}: ${error instanceof Error ? error.message : error}`);
  }
  const missing = requiredExports.filter(name => typeof module[name] !== 'function');
  if (missing.length) throw new Error(`Missing exports from ${fileName}: ${missing.join(', ')}`);
  return module;
}

function check(name, fn) {
  fn();
  return name;
}

async function checkAsync(name, fn) {
  await fn();
  return name;
}

function validManifestFixture() {
  return {
    schemaVersion: 1,
    targetGameVersion: '0.5.4',
    catalog: {
      url: 'https://cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json',
      sha256: 'a'.repeat(64),
    },
    resolvedAt: '2026-07-16T00:00:00.000Z',
    entries: [{
      baseId: 42,
      metadataKey: 'Metadata/Items/Amulets/FourAmulet1',
      displayName: 'Crimson Amulet',
      assetPath: 'assets/item-bases/42.png',
      poe2dbPageUrl: 'https://poe2db.tw/us/Crimson_Amulet',
      artPath: 'Art/2DItems/Amulets/Basetypes/CrimsonAmulet',
      sourceImageUrl: 'https://cdn.poe2db.tw/image/Art/2DItems/Amulets/Basetypes/CrimsonAmulet.webp',
    }],
    failures: [],
  };
}

function tinyPngFixture() {
  // A deterministic 1x1 grayscale+alpha PNG.  It is intentionally kept
  // inline so converter-boundary checks never depend on a checked-in asset.
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64',
  );
}

function alternatePngFixture() {
  // A second valid 1x1 RGBA PNG, used to prove an existing file is not
  // replaced by a different (but valid) payload.
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==',
    'base64',
  );
}

function fakeWebpFixture() {
  // The fake sharp fixture below only needs the WebP container magic.  A
  // genuine WebP decode is exercised separately when a bundled sharp module
  // is supplied to the harness.
  return Buffer.from('RIFF\u0004\u0000\u0000\u0000WEBPVP8 ', 'ascii');
}

function tinyRealWebpFixture() {
  // 1x1 WebP emitted by the bundled sharp fixture used for the optional
  // integration smoke.  The deterministic unit tests use fakeWebpFixture so
  // they do not depend on a decoder being installed.
  return Buffer.from(
    'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v02aAA=',
    'base64',
  );
}

export async function runCoreChecks() {
  const core = await loadModule('./base-art-core.mjs', CORE_EXPORTS);
  const {
    buildMappedBaseCatalog,
    parsePoe2DbSections,
    matchExactSection,
    buildPoe2DbImageUrl,
    isWebp,
    isPng,
    sha256,
    validateManifest,
  } = core;

  const names = [];

  names.push(check('pairs Type and Icon values from one table', () => {
    const sections = parsePoe2DbSections(
      '<table><tr><td>Type</td><td>Metadata/Items/Amulets/FourAmulet1</td></tr>' +
      '<tr><td>Icon</td><td>Art/2DItems/Amulets/Basetypes/CrimsonAmulet</td></tr></table>',
      'https://poe2db.tw/us/Crimson_Amulet',
    );
    assert.equal(
      matchExactSection({ metadataKey: 'Metadata/Items/Amulets/FourAmulet1' }, sections).artPath,
      'Art/2DItems/Amulets/Basetypes/CrimsonAmulet',
    );
  }));

  names.push(check('preserves metadata-key case for exact matching', () => {
    const sections = parsePoe2DbSections(
      '<table><tr><td>Type</td><td>Metadata/Items/Amulets/FourAmulet1</td></tr>' +
      '<tr><td>Icon</td><td>Art/2DItems/Amulets/Basetypes/CrimsonAmulet</td></tr></table>',
      'https://poe2db.tw/us/Crimson_Amulet',
    );
    assert.throws(
      () => matchExactSection({ metadataKey: 'Metadata/items/Amulets/FourAmulet1' }, sections),
      /missing/i,
    );
  }));

  names.push(check('rejects ambiguous exact identities', () => {
    const base = { metadataKey: 'Metadata/Items/Amulets/FourAmulet1' };
    const sections = [
      { ...base, artPath: 'Art/2DItems/A', sourceImageUrl: 'https://cdn.poe2db.tw/image/Art/2DItems/A.webp', pageUrl: 'https://poe2db.tw/us/A' },
      { ...base, artPath: 'Art/2DItems/B', sourceImageUrl: 'https://cdn.poe2db.tw/image/Art/2DItems/B.webp', pageUrl: 'https://poe2db.tw/us/B' },
    ];
    assert.throws(() => matchExactSection(base, sections), /ambiguous/i);
  }));

  names.push(check('decodes entities and rejects non-Art icons', () => {
    const sections = parsePoe2DbSections(
      '<img src="/image/Art/2DItems/NotTheBase.webp">' +
      '<table>' +
      '<tr><th>Type</th><td>Metadata&#x2F;Items&#x2F;Amulets&#x2F;Four&amp;Amulet1</td></tr>' +
      '<tr><th>Icon</th><td>&quot;Art&#x2F;2DItems&#x2F;Amulets&#x2F;Basetypes&#x2F;CrimsonAmulet&quot;</td></tr>' +
      '</table>' +
      '<table><tr><td>Type</td><td>Metadata/Items/Ignore</td></tr>' +
      '<tr><td>Icon</td><td>https://example.test/not-an-art-path.webp</td></tr></table>',
      'https://poe2db.tw/us/Crimson_Amulet',
    );
    assert.equal(sections.length, 1);
    assert.equal(sections[0].metadataKey, 'Metadata/Items/Amulets/Four&Amulet1');
    assert.equal(sections[0].artPath, 'Art/2DItems/Amulets/Basetypes/CrimsonAmulet');
    assert.equal(sections[0].sourceImageUrl,
      'https://cdn.poe2db.tw/image/Art/2DItems/Amulets/Basetypes/CrimsonAmulet.webp');
  }));

  names.push(check('parses base-item data-hover links without using page hero images', () => {
    const html = '<img class="hero" src="/image/Art/2DItems/Hero.webp">' +
      '<a data-hover="&lt;table&gt;&lt;tr&gt;&lt;td&gt;Type&lt;/td&gt;&lt;td&gt;Metadata/Items/Rings/Ring1&lt;/td&gt;&lt;/tr&gt;' +
      '&lt;tr&gt;&lt;td&gt;Icon&lt;/td&gt;&lt;td&gt;Art/2DItems/Rings/Ring.webp&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;">Ring</a>';
    const sections = parsePoe2DbSections(html, 'https://poe2db.tw/us/Ring');
    assert.equal(sections.length, 1);
    assert.equal(sections[0].metadataKey, 'Metadata/Items/Rings/Ring1');
    assert.equal(sections[0].artPath, 'Art/2DItems/Rings/Ring');
  }));

  names.push(check('matches exact HTML attribute names in hover images', () => {
    const sections = parsePoe2DbSections(
      '<a data-hover="?s=Data%5CBaseItemTypes%5CMetadata%5CItems%5CRings%5CRing1" href="Ring">' +
      '<img data-src="https://cdn.poe2db.tw/image/Art/2DItems/Placeholder.webp" ' +
      'src="https://cdn.poe2db.tw/image/Art/2DItems/Rings/Ring.webp"></a>',
      'https://poe2db.tw/us/Rings',
    );
    assert.equal(sections.length, 1);
    assert.equal(sections[0].artPath, 'Art/2DItems/Rings/Ring');
    assert.equal(sections[0].sourceImageUrl,
      'https://cdn.poe2db.tw/image/Art/2DItems/Rings/Ring.webp');
  }));

  names.push(check('isolates nested table sections from their outer table', () => {
    const sections = parsePoe2DbSections(
      '<table><tr><td>Type</td><td>Metadata/Items/Outer1</td></tr>' +
      '<tr><td>Icon</td><td>Art/2DItems/Outer1</td></tr>' +
      '<tr><td colspan="2"><table>' +
      '<tr><td>Type</td><td>Metadata/Items/Inner1</td></tr>' +
      '<tr><td>Icon</td><td>Art/2DItems/Inner1</td></tr>' +
      '</table></td></tr></table>',
      'https://poe2db.tw/us/Nested_Fixture',
    );
    assert.equal(sections.length, 2);
    assert.equal(matchExactSection({ metadataKey: 'Metadata/Items/Outer1' }, sections).artPath,
      'Art/2DItems/Outer1');
    assert.equal(matchExactSection({ metadataKey: 'Metadata/Items/Inner1' }, sections).artPath,
      'Art/2DItems/Inner1');
  }));

  names.push(check('builds only the mapped concrete-base catalog', () => {
    const baseItems = {
      bases: [
        { id: 42, metadataKey: 'Metadata/Items/Amulets/FourAmulet1', displayName: 'Crimson Amulet', unmodifiable: false },
        { id: 613, metadataKey: 'Metadata/Items/Jewels/Timeless', displayName: 'Unmapped Jewel', unmodifiable: false },
      ],
    };
    const requirements = {
      baseItems: [{
        baseId: 42,
        displayName: 'Crimson Amulet',
        assetPath: 'assets/item-bases/42.png',
        selectable: true,
        metadata: { metadataKey: 'Metadata/Items/Amulets/FourAmulet1' },
      }],
    };
    const catalog = buildMappedBaseCatalog(baseItems, requirements);
    assert.deepEqual(catalog, [{
      baseId: 42,
      metadataKey: 'Metadata/Items/Amulets/FourAmulet1',
      displayName: 'Crimson Amulet',
      assetPath: 'assets/item-bases/42.png',
      selectable: true,
    }]);
  }));

  names.push(check('enforces current-target mapped catalog invariants', () => {
    const baseItems = {
      bases: [
        { id: 42, metadataKey: 'Metadata/Items/Amulets/FourAmulet1', displayName: 'Crimson Amulet', unmodifiable: false },
        { id: 613, metadataKey: 'Metadata/Items/Jewels/Timeless', displayName: 'Timeless Jewel', unmodifiable: false },
      ],
    };
    const requirementFor = baseId => {
      const base = baseItems.bases.find(candidate => candidate.id === baseId);
      return {
        baseId,
        displayName: base.displayName,
        assetPath: `assets/item-bases/${baseId}.png`,
        selectable: true,
        metadata: { metadataKey: base.metadataKey },
      };
    };
    assert.throws(() => buildMappedBaseCatalog(baseItems, {
      targetGameVersion: '0.5.4',
      baseItems: [requirementFor(42)],
    }), /1,?759/);
    assert.throws(() => buildMappedBaseCatalog(baseItems, {
      targetGameVersion: '0.5.4',
      baseItems: [requirementFor(613)],
    }), /613/);
  }));

  names.push(check('validates the checked-in current-target mapped catalog', () => {
    const baseItems = JSON.parse(readFileSync(
      new URL('../data/normalized/base-items.json', import.meta.url),
      'utf8',
    ));
    const requirements = JSON.parse(readFileSync(
      new URL('../reports/asset-requirements.json', import.meta.url),
      'utf8',
    ));
    const catalog = buildMappedBaseCatalog(baseItems, requirements);
    assert.equal(catalog.length, 1759);
    assert.equal(catalog.some(base => base.baseId === 613), false);
  }));

  names.push(check('allowlists Poe2DB art paths and image signatures', () => {
    assert.equal(String(buildPoe2DbImageUrl('Art/2DItems/Amulets/CrimsonAmulet')), 'https://cdn.poe2db.tw/image/Art/2DItems/Amulets/CrimsonAmulet.webp');
    assert.throws(() => buildPoe2DbImageUrl('https://evil.example/x.webp'), /art path/i);
    assert.throws(() => buildPoe2DbImageUrl('../secret'), /art path/i);
    assert.equal(isWebp(Buffer.from('RIFF0000WEBPVP8 ')), true);
    assert.equal(isPng(Buffer.from('89504e470d0a1a0a', 'hex')), true);
    assert.equal(isWebp(Buffer.from('RIFF0000NOPEVP8 ')), false);
    assert.equal(isPng(Buffer.from('89504e470d0a1a00', 'hex')), false);
    assert.equal(sha256(Buffer.from('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  }));

  names.push(check('validates a complete manifest and rejects malformed entries', () => {
    assert.equal(validateManifest(validManifestFixture()), true);
    assert.throws(() => validateManifest({ ...validManifestFixture(), entries: [] }), /entr|base/i);
    assert.throws(() => validateManifest({
      ...validManifestFixture(),
      catalog: { ...validManifestFixture().catalog, url: 'https://cdn.poe2db.tw/cache2/catalog.json' },
    }), /catalog|allowlist|path/i);
    for (const url of [
      'https://cdn.poe2db.tw:8443/json/autocompletecb_us.0387c2cae16eb0c7.json',
      'https://@cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json',
      'https://cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json#fragment',
    ]) assert.throws(() => validateManifest({
      ...validManifestFixture(),
      catalog: { ...validManifestFixture().catalog, url },
    }), /catalog|port|credential|fragment|hash|allowlist/i);
    assert.throws(() => validateManifest({ ...validManifestFixture(), entries: [{ ...validManifestFixture().entries[0], sourceImageUrl: 'http://evil.test/x' }] }), /url|https|cdn/i);
    assert.throws(() => validateManifest({ ...validManifestFixture(), entries: [{ ...validManifestFixture().entries[0], metadataKey: 'metadata/items/Amulets/FourAmulet1' }] }), /metadata|case/i);
  }));

  return names;
}

function fixtureResponse(status, body = '', headers = {}) {
  return {
    status,
    statusText: status === 200 ? 'OK' : `HTTP ${status}`,
    headers: new Headers(headers),
    body: Buffer.isBuffer(body) || body instanceof Uint8Array ? body : Buffer.from(String(body)),
  };
}

function publicLookup() {
  return [{ address: '93.184.216.34', family: 4 }];
}

export async function runNetworkChecks() {
  const network = await loadModule('./base-art-network.mjs', NETWORK_EXPORTS);
  const { createNetworkClient, assertAllowedSourceUrl, isPrivateAddress, shouldRetryStatus } = network;
  const names = [];

  names.push(check('enforces HTTPS and source host/path allowlists', () => {
    assert.throws(() => assertAllowedSourceUrl(
      'http://poe2db.tw/us/Crimson_Amulet',
    ), /HTTPS/i);
    assert.throws(() => assertAllowedSourceUrl(
      'https://cdn.poe2db.tw/cache2/x',
    ), /allowlist/i);
    assert.equal(String(assertAllowedSourceUrl(
      'https://WWW.POE2DB.TW/US/Crimson_Amulet',
    )), 'https://www.poe2db.tw/US/Crimson_Amulet');
    assert.equal(String(assertAllowedSourceUrl(
      'https://CDN.POE2DB.TW/image/Art/2DItems/Ring.webp',
    )), 'https://cdn.poe2db.tw/image/Art/2DItems/Ring.webp');
    assert.equal(String(assertAllowedSourceUrl(
      'https://cdn.poe2db.tw/image/Art/2DItems/Ring.webp?cache=1',
    )), 'https://cdn.poe2db.tw/image/Art/2DItems/Ring.webp?cache=1');
    assert.equal(String(assertAllowedSourceUrl(
      'https://cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json',
    )), 'https://cdn.poe2db.tw/json/autocompletecb_us.0387c2cae16eb0c7.json');
  }));

  names.push(check('rejects credentials, non-default ports, malformed and private literals', () => {
    for (const value of [
      'https://user:pass@poe2db.tw/us/x',
      'https://@poe2db.tw/us/x',
      'https://:@poe2db.tw/us/x',
      'https://poe2db.tw:8443/us/x',
      'https://[::1]/us/x',
      'https://127.0.0.1/us/x',
      'https://poe2db.tw/%2e%2e/private',
      'https://cdn.poe2db.tw/image/Art/a/../b.webp',
      'https://cdn.poe2db.tw/image/Art/a/%2e%2e/b.webp',
      'not a URL',
    ]) {
      assert.throws(() => assertAllowedSourceUrl(value), /URL|credential|port|private|allowlist|path/i);
    }
  }));

  names.push(check('classifies private and reserved DNS answers', () => {
    for (const address of [
      '0.0.0.0', '10.0.0.1', '100.64.0.1', '127.0.0.1', '169.254.1.1',
      '172.16.0.1', '192.0.2.1', '192.168.1.1', '198.51.100.1', '203.0.113.1',
      '224.0.0.1', '::', '::1', 'fc00::1', 'fe80::1', 'ff02::1', 'fec0::1',
      '100::1', '2001:2::1', '2001:20::1', '2001:db8::1', '3fff::1', '::192.0.2.1',
      '2002:c000:0201::1',
    ]) assert.equal(isPrivateAddress(address), true, address);
    assert.equal(isPrivateAddress('93.184.216.34'), false);
    assert.equal(isPrivateAddress('2606:4700::6812:120c'), false);
  }));

  names.push(check('classifies only transient statuses for retry', () => {
    for (const status of [408, 425, 429, 500, 503, 599]) assert.equal(shouldRetryStatus(status), true);
    for (const status of [200, 301, 400, 401, 403, 404, 418]) assert.equal(shouldRetryStatus(status), false);
  }));

  names.push(await checkAsync('returns bounded text and byte fixtures with request stats', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      backoffBaseMs: 0,
      fetchImpl: async () => {
        calls += 1;
        return fixtureResponse(200, 'hello', { 'content-type': 'text/plain' });
      },
      lookup: async () => publicLookup(),
    });
    const text = await client.getText('https://poe2db.tw/us/Fixture');
    assert.equal(text.body, 'hello');
    assert.equal(text.status, 200);
    assert.equal(text.url, 'https://poe2db.tw/us/Fixture');
    const bytes = await client.getBytes('https://cdn.poe2db.tw/image/Art/2DItems/Fixture.webp');
    assert.equal(Buffer.from(bytes.body).toString(), 'hello');
    assert.equal(calls, 2);
    const stats = client.stats();
    assert.equal(stats.requests, 2);
    assert.equal(stats.requestCount, 2);
    assert.equal(stats.bytes, 10);
    assert.equal(stats.byteCount, 10);
    assert.equal(stats.retries, 0);
  }));

  names.push(await checkAsync('validates redirect targets and enforces redirect limits', async () => {
    const seen = [];
    const responses = [
      fixtureResponse(302, '', { location: '/us/Redirected' }),
      fixtureResponse(302, '', { location: 'https://cdn.poe2db.tw/image/Art/2DItems/Redirected.webp' }),
      fixtureResponse(200, 'done'),
    ];
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      fetchImpl: async (url, options) => {
        assert.equal(options.redirect, 'manual');
        seen.push(String(url));
        return responses.shift();
      },
      lookup: async () => publicLookup(),
    });
    const result = await client.getText('https://poe2db.tw/us/Start');
    assert.equal(result.body, 'done');
    assert.deepEqual(seen, [
      'https://poe2db.tw/us/Start',
      'https://poe2db.tw/us/Redirected',
      'https://cdn.poe2db.tw/image/Art/2DItems/Redirected.webp',
    ]);

    const denied = createNetworkClient({
      minimumRequestIntervalMs: 0,
      fetchImpl: async () => fixtureResponse(302, '', { location: 'https://evil.example/x' }),
      lookup: async () => publicLookup(),
    });
    await assert.rejects(() => denied.getText('https://poe2db.tw/us/Start'), /allowlist/i);

    let redirectCount = 0;
    const limited = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumRedirects: 1,
      fetchImpl: async () => {
        redirectCount += 1;
        return fixtureResponse(302, '', { location: '/us/Again' });
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(() => limited.getText('https://poe2db.tw/us/Start'), /redirect/i);
    assert.equal(redirectCount, 2);
  }));

  names.push(await checkAsync('caps response bodies without retrying policy failures', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumResponseBytes: 3,
      fetchImpl: async () => {
        calls += 1;
        return fixtureResponse(200, '1234');
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(() => client.getText('https://poe2db.tw/us/TooBig'), /byte|size|limit/i);
    assert.equal(calls, 1);

    let declaredCanceled = false;
    const declaredTooBig = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumResponseBytes: 3,
      fetchImpl: async () => ({
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-length': '4' }),
        body: new ReadableStream({
          cancel() {
            declaredCanceled = true;
          },
        }),
      }),
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => declaredTooBig.getBytes('https://cdn.poe2db.tw/image/Art/2DItems/DeclaredTooBig.webp'),
      error => /byte|size|limit/i.test(error.message) &&
        error.url === 'https://cdn.poe2db.tw/image/Art/2DItems/DeclaredTooBig.webp' &&
        error.attempt === 1,
    );
    assert.equal(declaredCanceled, true, 'declared oversized streams must be canceled');

    let canceled = false;
    const streaming = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumResponseBytes: 3,
      fetchImpl: async () => ({
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        body: new ReadableStream({
          start(controller) {
            controller.enqueue(Uint8Array.from([1, 2, 3, 4]));
          },
          cancel() {
            canceled = true;
          },
        }),
      }),
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => streaming.getBytes('https://cdn.poe2db.tw/image/Art/2DItems/TooBig.webp'),
      /byte|size|limit/i,
    );
    assert.equal(canceled, true, 'oversized streams must be canceled');
  }));

  names.push(await checkAsync('retries transient statuses and network failures with bounded backoff', async () => {
    let calls = 0;
    const delays = [];
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      backoffBaseMs: 2,
      maximumBackoffMs: 3,
      sleep: async milliseconds => delays.push(milliseconds),
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) return fixtureResponse(503, 'temporary');
        if (calls === 2) throw Object.assign(new Error('socket reset'), { code: 'ECONNRESET' });
        if (calls === 3) return fixtureResponse(429, 'busy');
        return fixtureResponse(200, 'ok');
      },
      lookup: async () => publicLookup(),
    });
    const result = await client.getText('https://poe2db.tw/us/Retry');
    assert.equal(result.body, 'ok');
    assert.equal(calls, 4);
    assert.deepEqual(delays, [2, 3, 3]);
    assert.equal(client.stats().retries, 3);

    let bodyCalls = 0;
    const bodyFailure = createNetworkClient({
      minimumRequestIntervalMs: 0,
      backoffBaseMs: 0,
      fetchImpl: async () => {
        bodyCalls += 1;
        if (bodyCalls === 1) {
          throw Object.assign(new TypeError('terminated'), { cause: { code: 'UND_ERR_SOCKET' } });
        }
        return fixtureResponse(200, 'body recovered');
      },
      lookup: async () => publicLookup(),
    });
    assert.equal((await bodyFailure.getText('https://poe2db.tw/us/BodyFailure')).body, 'body recovered');
    assert.equal(bodyCalls, 2);

    let deniedCalls = 0;
    const denied = createNetworkClient({
      minimumRequestIntervalMs: 0,
      backoffBaseMs: 0,
      fetchImpl: async () => {
        deniedCalls += 1;
        return fixtureResponse(403, '<html>Cloudflare CAPTCHA challenge</html>');
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => denied.getText('https://poe2db.tw/us/Denied'),
      error => /403|CAPTCHA|denied/i.test(error.message) &&
        error.url === 'https://poe2db.tw/us/Denied' && error.attempt === 1,
    );
    assert.equal(deniedCalls, 1);
    assert.equal(denied.stats().retries, 0);

    let plainChallengeCalls = 0;
    const plainChallenge = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumAttempts: 4,
      backoffBaseMs: 0,
      fetchImpl: async () => {
        plainChallengeCalls += 1;
        return fixtureResponse(503, 'CAPTCHA');
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => plainChallenge.getText('https://poe2db.tw/us/PlainChallenge'),
      /captcha|challenge/i,
    );
    assert.equal(plainChallengeCalls, 1);
  }));

  names.push(await checkAsync('classifies transient status before requiring an error body', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumAttempts: 2,
      backoffBaseMs: 0,
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) return { status: 503, headers: new Headers(), body: null };
        return fixtureResponse(200, 'recovered');
      },
      lookup: async () => publicLookup(),
    });
    const result = await client.getText('https://poe2db.tw/us/Empty503');
    assert.equal(result.body, 'recovered');
    assert.equal(calls, 2);
    assert.equal(client.stats().retries, 1);
  }));

  names.push(await checkAsync('retries a timed-out fetch within the bounded attempt count', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      requestTimeoutMs: 5,
      maximumAttempts: 2,
      backoffBaseMs: 0,
      fetchImpl: async (_url, options) => {
        calls += 1;
        if (calls === 2) return fixtureResponse(200, 'recovered');
        return new Promise((_resolve, reject) => {
          options.signal.addEventListener('abort', () => {
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
          }, { once: true });
        });
      },
      lookup: async () => publicLookup(),
    });
    const response = await client.getText('https://poe2db.tw/us/Timeout');
    assert.equal(response.body, 'recovered');
    assert.equal(calls, 2);
    assert.equal(client.stats().retries, 1);
  }));

  names.push(await checkAsync('retains the failing redirect URL and attempt context', async () => {
    const redirectUrl = 'https://cdn.poe2db.tw/image/Art/2DItems/Context.webp';
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumAttempts: 1,
      fetchImpl: async url => {
        if (String(url) === 'https://poe2db.tw/us/Context') {
          return fixtureResponse(302, '', { location: redirectUrl });
        }
        throw Object.assign(new Error('socket reset'), { code: 'ECONNRESET' });
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => client.getBytes('https://poe2db.tw/us/Context'),
      error => error.url === redirectUrl && error.attempt === 1 && /socket reset/i.test(error.message),
    );
  }));

  names.push(await checkAsync('does not retry unexpected fetch/programming errors', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      maximumAttempts: 4,
      fetchImpl: async () => {
        calls += 1;
        throw new Error('programming bug');
      },
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => client.getText('https://poe2db.tw/us/Unexpected'),
      error => calls === 1 && error.retryable === false && /programming bug/i.test(error.message),
    );
  }));

  names.push(await checkAsync('enforces the timeout even when a transport ignores AbortSignal', async () => {
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      requestTimeoutMs: 5,
      maximumAttempts: 1,
      fetchImpl: async () => new Promise(resolve => {
        setTimeout(() => resolve(fixtureResponse(200, 'late')), 20);
      }),
      lookup: async () => publicLookup(),
    });
    await assert.rejects(
      () => client.getText('https://poe2db.tw/us/SlowTransport'),
      /timed out|timeout/i,
    );
  }));

  names.push(await checkAsync('bounds a response body stream that never yields', async () => {
    let canceled = false;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      requestTimeoutMs: 5,
      maximumAttempts: 1,
      fetchImpl: async () => ({
        status: 200,
        headers: new Headers(),
        body: new ReadableStream({
          pull() {
            return new Promise(() => {});
          },
          cancel() {
            canceled = true;
          },
        }),
      }),
      lookup: async () => publicLookup(),
    });
    const outcome = await Promise.race([
      client.getBytes('https://cdn.poe2db.tw/image/Art/2DItems/Stalled.webp')
        .then(() => null, error => error),
      new Promise(resolve => setTimeout(() => resolve(new Error('body timeout test hung')), 100)),
    ]);
    assert(outcome instanceof Error);
    assert.notEqual(outcome.message, 'body timeout test hung');
    assert.match(outcome.message, /timed out|timeout/i);
    assert.equal(canceled, true, 'timed-out streams must be canceled');
  }));

  names.push(await checkAsync('validates shared limiter options and spaces concurrent starts', async () => {
    for (const option of [
      { minimumRequestIntervalMs: -1 },
      { requestTimeoutMs: 0 },
      { maximumResponseBytes: 0 },
      { maximumRedirects: -1 },
      { maximumAttempts: 0 },
    ]) assert.throws(() => createNetworkClient(option), /invalid|positive|non-negative|at least/i);

    let now = 0;
    const starts = [];
    const client = createNetworkClient({
      minimumRequestIntervalMs: 10,
      now: () => now,
      sleep: async milliseconds => { now += milliseconds; },
      fetchImpl: async () => {
        starts.push(now);
        return fixtureResponse(200, 'x');
      },
      lookup: async () => publicLookup(),
    });
    await Promise.all([
      client.getText('https://poe2db.tw/us/One'),
      client.getText('https://poe2db.tw/us/Two'),
      client.getText('https://poe2db.tw/us/Three'),
    ]);
    assert.deepEqual(starts, [0, 10, 20]);
    assert.equal(client.stats().requests, 3);
  }));

  names.push(await checkAsync('rejects private DNS answers before fetching', async () => {
    let calls = 0;
    const client = createNetworkClient({
      minimumRequestIntervalMs: 0,
      lookup: async () => [{ address: '127.0.0.1', family: 4 }],
      fetchImpl: async () => {
        calls += 1;
        return fixtureResponse(200, 'unsafe');
      },
    });
    await assert.rejects(
      () => client.getText('https://poe2db.tw/us/PrivateDns'),
      /public|private|DNS/i,
    );
    assert.equal(calls, 0);
  }));

  return names;
}

export async function runConverterChecks(options = {}) {
  const converter = await loadModule('./base-art-converter.mjs', CONVERTER_EXPORTS);
  const { loadConverter, writePngIfAbsent, readVerifiedPng, inspectPng } = converter;
  const names = [];
  const fixture = tinyPngFixture();
  const webp = fakeWebpFixture();
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'base-art-converter-'));

  try {
    names.push(await checkAsync('writes and verifies a genuine PNG', async () => {
      const destination = path.join(temporaryRoot, 'fresh.png');
      const result = await writePngIfAbsent(destination, fixture);
      assert.equal(result.written, true);
      assert.equal(result.skipped, false);
      const verified = await readVerifiedPng(destination);
      assert.equal(verified.width, 1);
      assert.equal(verified.height, 1);
      assert.equal(verified.bytes, fixture.length);
      assert.match(verified.sha256, /^[0-9a-f]{64}$/);
    }));

    names.push(await checkAsync('never overwrites an existing destination', async () => {
      const destination = path.join(temporaryRoot, 'existing.png');
      const replacement = alternatePngFixture();
      await writeFile(destination, fixture);
      const result = await writePngIfAbsent(destination, replacement);
      assert.equal(result.written, false);
      assert.equal(result.skipped, true);
      assert.deepEqual(await readFile(destination), fixture);
    }));

    names.push(await checkAsync('ignores temporary part files as complete assets', async () => {
      const destination = path.join(temporaryRoot, 'part-only.png');
      const stalePart = `${destination}.stale.part`;
      await writeFile(stalePart, fixture);
      await assert.rejects(() => readVerifiedPng(stalePart), /part|temporary/i);
      const result = await writePngIfAbsent(destination, fixture);
      assert.equal(result.written, true);
      assert.equal((await readFile(destination)).equals(fixture), true);
      const namesOnDisk = await readdir(temporaryRoot);
      assert.equal(namesOnDisk.some(name => name.endsWith('.part') && name !== path.basename(stalePart)), false);
    }));

    names.push(await checkAsync('rejects invalid PNG signatures and dimensions', async () => {
      const invalidSignature = path.join(temporaryRoot, 'invalid-signature.png');
      const invalid = Buffer.from(fixture);
      invalid[0] = 0;
      await writeFile(invalidSignature, invalid);
      await assert.rejects(() => readVerifiedPng(invalidSignature), /PNG|signature/i);

      const zeroDimension = path.join(temporaryRoot, 'zero-dimension.png');
      const zero = Buffer.from(fixture);
      zero.writeUInt32BE(0, 16);
      await writeFile(zeroDimension, zero);
      await assert.rejects(() => readVerifiedPng(zeroDimension), /dimension|positive/i);

      const tooManyPixels = path.join(temporaryRoot, 'too-many-pixels.png');
      const huge = Buffer.from(fixture);
      huge.writeUInt32BE(2001, 16);
      huge.writeUInt32BE(2000, 20);
      await writeFile(tooManyPixels, huge);
      await assert.rejects(() => readVerifiedPng(tooManyPixels), /pixel|dimension|limit/i);
    }));

    names.push(await checkAsync('loads an explicit sharp-shaped fake converter', async () => {
      const fakeModulePath = path.join(temporaryRoot, 'fake-sharp.mjs');
      const encodedPng = fixture.toString('base64');
      await writeFile(fakeModulePath, [
        "export const version = 'fixture-sharp-1.2.3';",
        'export default function sharp(input, options) {',
        "  if (options?.limitInputPixels !== 4000000) throw new Error('pixel limit was not bounded');",
        "  if (Buffer.from(input).subarray(0, 4).toString('ascii') !== 'RIFF') throw new Error('input missing RIFF');",
        "  const chain = { rotate() { return chain; }, png(options) {",
        "    if (options?.compressionLevel !== 9 || options?.adaptiveFiltering !== true || options?.palette !== false) throw new Error('unexpected png options');",
        "    return chain; },",
        `    async toBuffer() { return Buffer.from('${encodedPng}', 'base64'); }`,
        '  };',
        '  return chain;',
        '}',
      ].join('\n'));
      const loaded = await loadConverter({
        sharpModule: fakeModulePath,
        disableDefaultSharp: true,
      });
      assert.equal(loaded.name, 'sharp');
      assert.equal(loaded.version, 'fixture-sharp-1.2.3');
      assert.deepEqual(await loaded.convertWebpToPng(webp), fixture);
    }));

    names.push(await checkAsync('reports actionable converter discovery errors', async () => {
      const missingSharp = path.join(temporaryRoot, 'missing-sharp.mjs');
      const missingPython = path.join(temporaryRoot, 'missing-python.exe');
      await assert.rejects(
        () => loadConverter({
          sharpModule: missingSharp,
          python: missingPython,
          disableDefaultSharp: true,
        }),
        error => /--sharp-module|POE2_SHARP_MODULE/i.test(String(error)) &&
          /--python|POE2_PYTHON/i.test(String(error)),
      );
    }));

    // A caller may opt into a real bundled converter for an integration smoke
    // without making the offline fixture suite depend on package discovery.
    if (options.sharpModule || options.python) {
      names.push(await checkAsync('accepts explicitly configured converter paths', async () => {
        const configured = await loadConverter({
          sharpModule: options.sharpModule,
          python: options.python,
        });
        assert.equal(typeof configured.name, 'string');
        assert.equal(typeof configured.version, 'string');
        assert.equal(typeof configured.convertWebpToPng, 'function');
        const converted = await configured.convertWebpToPng(tinyRealWebpFixture());
        assert.deepEqual(inspectPng(converted), { width: 1, height: 1 });
      }));
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }

  return names;
}

export async function runSelectedChecks() {
  const argv = process.argv.slice(2);
  const modes = new Set(argv.filter(value => value === '--core-only' || value === '--network-only' || value === '--converter-only'));
  const optionValues = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--core-only' || value === '--network-only' || value === '--converter-only') continue;
    const match = value.match(/^(--sharp-module|--python)=(.*)$/);
    if (match) {
      if (!match[2]) throw new Error(`${match[1]} requires a value.`);
      optionValues[match[1]] = match[2];
      continue;
    }
    if (value === '--sharp-module' || value === '--python') {
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) throw new Error(`${value} requires a value.`);
      optionValues[value] = next;
      index += 1;
      continue;
    }
    throw new Error(`Unknown validation mode or option: ${value}`);
  }
  if (modes.size > 1) {
    throw new Error('Choose one validation mode at a time.');
  }
  if (modes.has('--network-only')) return runNetworkChecks();
  if (modes.has('--converter-only')) {
    return runConverterChecks({
      sharpModule: optionValues['--sharp-module'] || process.env.POE2_SHARP_MODULE,
      python: optionValues['--python'] || process.env.POE2_PYTHON,
    });
  }
  return runCoreChecks();
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  runSelectedChecks()
    .then(names => {
      const phase = process.argv.includes('--network-only')
        ? 'network'
        : process.argv.includes('--converter-only') ? 'converter' : 'core';
      console.log(`base-art ${phase} checks passed (${names.length})`);
    })
    .catch(reportFailure);
}
