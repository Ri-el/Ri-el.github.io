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

