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

function validManifestFixture() {
  return {
    schemaVersion: 1,
    targetGameVersion: '0.5.4',
    catalog: {
      url: 'https://poe2db.tw/us/autocomplete',
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
    assert.throws(() => validateManifest({ ...validManifestFixture(), entries: [{ ...validManifestFixture().entries[0], sourceImageUrl: 'http://evil.test/x' }] }), /url|https|cdn/i);
    assert.throws(() => validateManifest({ ...validManifestFixture(), entries: [{ ...validManifestFixture().entries[0], metadataKey: 'metadata/items/Amulets/FourAmulet1' }] }), /metadata|case/i);
  }));

  return names;
}

export async function runSelectedChecks() {
  const args = new Set(process.argv.slice(2));
  // Task 1 owns the core suite. Later phases extend this dispatcher with
  // --network-only, --converter-only, and their corresponding checks.
  if (args.size && !args.has('--core-only')) {
    throw new Error(`Unknown validation mode: ${[...args].join(' ')}`);
  }
  return runCoreChecks();
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  runSelectedChecks()
    .then(names => console.log(`base-art core checks passed (${names.length})`))
    .catch(reportFailure);
}
