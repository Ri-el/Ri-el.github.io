#!/usr/bin/env node

import { createHash } from 'node:crypto';

const POE2DB_HOSTS = new Set(['poe2db.tw', 'www.poe2db.tw']);
const CDN_HOST = 'cdn.poe2db.tw';
const METADATA_RE = /^Metadata\/[A-Za-z0-9_./&'()-]+$/;
const ART_RE = /^Art\/[A-Za-z0-9_./-]+$/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function asString(value, field) {
  assert(typeof value === 'string' && value.length > 0, `${field} must be a non-empty string.`);
  return value;
}

function decodeHtmlEntities(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _match;
    })
    .replace(/&#([0-9]+);/g, (_match, decimal) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _match;
    })
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&(?:apos|#39|rsquo);/gi, "'")
    .replace(/&(?:lt|#60);/gi, '<')
    .replace(/&(?:gt|#62);/gi, '>')
    .replace(/&nbsp;/gi, ' ');
}

function stripTags(value) {
  return decodeHtmlEntities(String(value)
    .replace(/<\s*(?:br|\/p|\/div|\/li|\/td|\/th|\/tr)\b[^>]*>/gi, ' ')
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' '))
    .replace(/[\u00a0\s]+/g, ' ')
    .trim();
}

function unquote(value) {
  const trimmed = String(value).trim();
  if (trimmed.length >= 2 && ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Extract balanced HTML elements.  This intentionally does not attempt to be
 * a browser HTML parser; Poe2DB's values are small, regular fragments and a
 * scanner lets the development tools stay dependency-free.
 */
function extractElements(source, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const tokenRe = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
  const elements = [];
  let match;
  while ((match = openRe.exec(source))) {
    const start = match.index;
    const tokenEnd = openRe.lastIndex;
    let depth = 1;
    tokenRe.lastIndex = tokenEnd;
    let token;
    while ((token = tokenRe.exec(source))) {
      if (/^<\//.test(token[0])) {
        depth -= 1;
        if (depth === 0) {
          elements.push({
            html: source.slice(start, tokenRe.lastIndex),
            inner: source.slice(tokenEnd, token.index),
            start,
            end: tokenRe.lastIndex,
          });
          openRe.lastIndex = tokenRe.lastIndex;
          break;
        }
      } else if (!/\/\s*>$/.test(token[0])) {
        depth += 1;
      }
    }
  }
  return elements;
}

function topLevelElements(source, tagName) {
  const all = extractElements(source, tagName);
  return all.filter((candidate, index) => !all.some((other, otherIndex) =>
    otherIndex !== index && other.start <= candidate.start && other.end >= candidate.end));
}

function attributeValue(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`\\b${escapedName}\\s*=\\s*(?:"([\\s\\S]*?)"|'([\\s\\S]*?)'|([^\\s>]+))`, 'i').exec(tag);
  if (!match) return null;
  return decodeHtmlEntities(match[1] ?? match[2] ?? match[3] ?? '');
}

function elementText(element) {
  return stripTags(element);
}

function normalizeMetadataCandidate(value) {
  let text = decodeHtmlEntities(String(value)).trim();
  text = text.replace(/^['"`]+|['"`]+$/g, '').trim();
  // data-hover commonly contains a client-data path such as
  // Data\\BaseItemTypes\\Metadata\\Items\\Amulets\\FourAmulet1.
  const marker = text.search(/Metadata[\\/]/);
  if (marker >= 0) text = text.slice(marker);
  text = text.replace(/\\/g, '/');
  const match = text.match(/Metadata\/[^\s"'<>]+/);
  return match ? match[0] : null;
}

function normalizeArtCandidate(value) {
  let text = decodeHtmlEntities(String(value)).trim();
  text = text.replace(/^['"`]+|['"`]+$/g, '').trim();
  try {
    // Handles both absolute image URLs and src values with escaped paths.
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) {
      const url = new URL(text);
      text = decodeURIComponent(url.pathname);
    } else {
      text = decodeURIComponent(text.split(/[?#]/, 1)[0]);
    }
  } catch {
    // Keep the original text so the allowlist below rejects malformed input.
  }
  const marker = text.search(/(?:^|\/)Art\//);
  if (marker >= 0) text = text.slice(marker + (text[marker] === '/' ? 1 : 0));
  text = text.replace(/^\/+/, '');
  const match = text.match(/Art\/[A-Za-z0-9_./-]+/i);
  if (!match) return null;
  let artPath = match[0].replace(/\.(?:webp|png|jpg|jpeg)$/i, '');
  // The path regex is case-sensitive by contract.  Poe2DB uses `Art` and
  // lowercase image extensions; reject any other top-level spelling.
  if (!ART_RE.test(artPath)) return null;
  return artPath;
}

function sourceUrlForArt(artPath) {
  return String(buildPoe2DbImageUrl(artPath));
}

function rowCells(rowHtml) {
  return extractElements(rowHtml, 'th').concat(extractElements(rowHtml, 'td'))
    .sort((left, right) => left.start - right.start);
}

function rowLabelAndValue(rowHtml) {
  const cells = rowCells(rowHtml);
  if (cells.length >= 2) {
    return {
      label: stripTags(cells[0].inner),
      value: cells.slice(1).map(cell => cell.inner).join(' '),
      valueHtml: cells.slice(1).map(cell => cell.inner).join(' '),
    };
  }
  const text = stripTags(rowHtml);
  const match = text.match(/^([^:]+):\s*(.*)$/);
  return match ? { label: match[1].trim(), value: match[2], valueHtml: rowHtml } : null;
}

function collectCellAttributes(cellHtml, names) {
  const values = [];
  const tagRe = /<([a-z][a-z0-9-]*)\b[^>]*>/gi;
  let tag;
  while ((tag = tagRe.exec(cellHtml))) {
    for (const name of names) {
      const value = attributeValue(tag[0], name);
      if (value != null) values.push(value);
    }
  }
  return values;
}

function sectionsFromTable(tableHtml, pageUrl) {
  const rows = extractElements(tableHtml, 'tr');
  const sections = [];
  let metadataKey = null;
  let artPath = null;
  const emit = () => {
    if (!metadataKey || !artPath) return;
    sections.push({
      metadataKey,
      artPath,
      sourceImageUrl: sourceUrlForArt(artPath),
      pageUrl,
    });
    metadataKey = null;
    artPath = null;
  };

  for (const row of rows) {
    const pair = rowLabelAndValue(row.inner);
    if (!pair) continue;
    const label = pair.label.toLowerCase().replace(/\s+/g, ' ').trim();
    const valueCandidates = [pair.valueHtml, pair.value];
    if (label === 'type' || label === 'metadata' || /^(item )?type$/.test(label)) {
      const candidate = valueCandidates.map(normalizeMetadataCandidate).find(Boolean);
      if (candidate) {
        if (metadataKey && artPath) emit();
        metadataKey = candidate;
      }
    } else if (label === 'icon' || label === 'image') {
      const candidates = [...valueCandidates,
        ...collectCellAttributes(pair.valueHtml, ['src', 'data-src', 'href', 'content'])];
      const candidate = candidates.map(normalizeArtCandidate).find(Boolean);
      if (candidate) artPath = candidate;
    }
  }
  emit();
  return sections;
}

function metadataFromDataHover(value) {
  const decoded = decodeHtmlEntities(String(value));
  let candidate = decoded;
  try {
    // URLSearchParams handles `%5C`, `%2F`, and `+` in the live data-hover
    // query without changing the case of the metadata key.
    const url = new URL(decoded, 'https://poe2db.tw/');
    candidate = url.searchParams.get('s') || decoded;
  } catch {
    // A raw metadata path is also accepted.
  }
  return normalizeMetadataCandidate(candidate);
}

function sectionsFromHoverLink(anchor, pageUrl) {
  const tagMatch = anchor.match(/^<a\b[^>]*>/i);
  if (!tagMatch) return [];
  const tag = tagMatch[0];
  const hover = attributeValue(tag, 'data-hover');
  if (hover == null) return [];
  const metadataKey = metadataFromDataHover(hover);
  const href = attributeValue(tag, 'href');
  let linkPageUrl = pageUrl;
  if (href) {
    try {
      linkPageUrl = new URL(href, pageUrl).href;
    } catch {
      // Preserve the fetched page URL when a malformed href is present.
    }
  }

  // A few older Poe2DB surfaces put the complete hover table in the
  // attribute instead of using the query-string identity used by the current
  // catalogue.  Parse that fragment as its own container so Type/Icon values
  // cannot accidentally pair with rows outside the link.
  if (/<table\b/i.test(hover)) {
    const inlineSections = topLevelElements(hover, 'table')
      .flatMap(table => sectionsFromTable(table.html, linkPageUrl));
    if (inlineSections.length) return inlineSections;
  }
  if (!metadataKey) return [];
  const imageCandidates = [];
  const imageRe = /<img\b[^>]*>/gi;
  let image;
  while ((image = imageRe.exec(anchor))) {
    for (const name of ['src', 'data-src', 'data-original', 'href']) {
      const value = attributeValue(image[0], name);
      if (value != null) imageCandidates.push(value);
    }
  }
  // Some pages put the image URL directly on the anchor rather than img.
  for (const name of ['src', 'data-src', 'data-image']) {
    const value = attributeValue(tag, name);
    if (value != null) imageCandidates.push(value);
  }
  const artPath = imageCandidates.map(normalizeArtCandidate).find(Boolean);
  if (!artPath) return [];
  return [{
    metadataKey,
    artPath,
    sourceImageUrl: sourceUrlForArt(artPath),
    pageUrl: linkPageUrl,
  }];
}

function dedupeSections(sections) {
  const seen = new Set();
  return sections.filter(section => {
    const key = [section.metadataKey, section.artPath, section.sourceImageUrl, section.pageUrl].join('\u0000');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Project only the concrete bases represented by the generated asset report.
 * The report is authoritative for mapping membership; this intentionally does
 * not iterate every normalized base (for example the unmapped Timeless Jewel).
 */
export function buildMappedBaseCatalog(baseItems, assetRequirements) {
  assert(baseItems && typeof baseItems === 'object', 'Base-items source must be an object.');
  assert(Array.isArray(baseItems.bases), 'Base-items source is missing bases.');
  const requirements = Array.isArray(assetRequirements)
    ? assetRequirements
    : assetRequirements?.baseItems || assetRequirements?.requirements;
  assert(Array.isArray(requirements), 'Asset requirements are missing baseItems.');

  const sourceById = new Map();
  for (const base of baseItems.bases) {
    const baseId = Number(base?.id);
    assert(Number.isSafeInteger(baseId), `Normalized base has invalid id: ${base?.id}.`);
    assert(!sourceById.has(baseId), `Normalized base id ${baseId} is duplicated.`);
    sourceById.set(baseId, base);
  }

  const seen = new Set();
  const result = requirements.map((requirement, index) => {
    const baseId = Number(requirement?.baseId);
    assert(Number.isSafeInteger(baseId), `Asset requirement ${index} has invalid baseId.`);
    assert(!seen.has(baseId), `Asset requirements repeat baseId ${baseId}.`);
    seen.add(baseId);
    const source = sourceById.get(baseId);
    assert(source, `Asset requirement references missing normalized base ${baseId}.`);
    const metadataKey = requirement.metadataKey || requirement.metadata?.metadataKey || source.metadataKey;
    assert(typeof metadataKey === 'string' && metadataKey, `Base ${baseId} is missing metadataKey.`);
    assert(metadataKey === source.metadataKey,
      `Base ${baseId} metadataKey does not match normalized source (${metadataKey} vs ${source.metadataKey}).`);
    const displayName = requirement.displayName ?? source.displayName;
    assert(typeof displayName === 'string' && displayName, `Base ${baseId} is missing displayName.`);
    assert(displayName === source.displayName,
      `Base ${baseId} displayName does not match normalized source.`);
    const assetPath = requirement.assetPath || `assets/item-bases/${baseId}.png`;
    assert(assetPath === `assets/item-bases/${baseId}.png`, `Base ${baseId} has unsafe assetPath.`);
    const selectable = requirement.selectable == null ? !source.unmodifiable : Boolean(requirement.selectable);
    return { baseId, metadataKey, displayName, assetPath, selectable };
  });
  return result.sort((left, right) => left.baseId - right.baseId);
}

/**
 * Parse all self-contained Type/Icon pairs in tables and base-item hover
 * links.  A page's hero image is deliberately ignored unless it belongs to a
 * data-hover anchor or an Icon/Image row.
 */
export function parsePoe2DbSections(html, pageUrl) {
  assert(typeof html === 'string', 'Poe2DB HTML must be a string.');
  assert(typeof pageUrl === 'string' && pageUrl, 'Poe2DB pageUrl must be a non-empty string.');
  const sections = [];
  for (const table of topLevelElements(html, 'table')) sections.push(...sectionsFromTable(table.html, pageUrl));
  for (const anchor of extractElements(html, 'a')) sections.push(...sectionsFromHoverLink(anchor.html, pageUrl));
  return dedupeSections(sections);
}

export function matchExactSection(base, sections) {
  const metadataKey = base?.metadataKey;
  assert(typeof metadataKey === 'string' && metadataKey, 'Base is missing metadataKey.');
  assert(Array.isArray(sections), 'Poe2DB sections must be an array.');
  const matches = sections.filter(section => section?.metadataKey === metadataKey);
  if (matches.length === 0) throw new Error(`Missing Poe2DB identity: ${metadataKey}`);
  if (matches.length !== 1) throw new Error(`Ambiguous Poe2DB identity: ${metadataKey}`);
  return matches[0];
}

export function buildPoe2DbImageUrl(artPath) {
  if (typeof artPath !== 'string' || !ART_RE.test(artPath) || artPath.includes('..')) {
    throw new Error(`Invalid Poe2DB art path: ${artPath}`);
  }
  return new URL(`https://${CDN_HOST}/image/${artPath}.webp`);
}

export function isWebp(buffer) {
  if (buffer == null || buffer.length < 12) return false;
  const bytes = Buffer.from(buffer);
  return bytes.subarray(0, 4).toString('ascii') === 'RIFF' &&
    bytes.subarray(8, 12).toString('ascii') === 'WEBP';
}

export function isPng(buffer) {
  if (buffer == null || buffer.length < 8) return false;
  const bytes = Buffer.from(buffer);
  return bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'));
}

export function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function validateHttpsHost(value, allowedHosts, field) {
  assert(typeof value === 'string' && value, `${field} must be a URL.`);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be an absolute URL.`);
  }
  assert(url.protocol === 'https:', `${field} must use HTTPS.`);
  assert(allowedHosts.has(url.hostname.toLowerCase()), `${field} host is not allowlisted.`);
  assert(!url.username && !url.password, `${field} must not contain credentials.`);
  return url;
}

function validateManifestEntry(entry, index) {
  assert(entry && typeof entry === 'object' && !Array.isArray(entry), `Manifest entry ${index} must be an object.`);
  const baseId = Number(entry.baseId);
  assert(Number.isSafeInteger(baseId) && baseId >= 0, `Manifest entry ${index} has invalid baseId.`);
  assert(typeof entry.metadataKey === 'string' && METADATA_RE.test(entry.metadataKey),
    `Manifest entry ${baseId} has invalid metadataKey.`);
  assert(typeof entry.displayName === 'string' && entry.displayName, `Manifest entry ${baseId} is missing displayName.`);
  assert(entry.assetPath === `assets/item-bases/${baseId}.png`, `Manifest entry ${baseId} has invalid assetPath.`);
  validateHttpsHost(entry.poe2dbPageUrl, POE2DB_HOSTS, `Manifest entry ${baseId} page URL`);
  assert(typeof entry.artPath === 'string' && ART_RE.test(entry.artPath) && !entry.artPath.includes('..'),
    `Manifest entry ${baseId} has invalid artPath.`);
  const expectedImageUrl = String(buildPoe2DbImageUrl(entry.artPath));
  assert(entry.sourceImageUrl === expectedImageUrl,
    `Manifest entry ${baseId} sourceImageUrl does not match artPath.`);
  validateHttpsHost(entry.sourceImageUrl, new Set([CDN_HOST]), `Manifest entry ${baseId} source URL`);
}

/**
 * Validate the reviewable resolver manifest.  Returns true for convenient
 * assertion use and throws a descriptive error for the first malformed field.
 */
export function validateManifest(value) {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'Manifest must be an object.');
  assert(value.schemaVersion === 1, 'Manifest schemaVersion must be 1.');
  assert(typeof value.targetGameVersion === 'string' && value.targetGameVersion,
    'Manifest targetGameVersion is missing.');
  const catalog = value.catalog || value.sourceCatalog;
  assert(catalog && typeof catalog === 'object', 'Manifest catalog is missing.');
  validateHttpsHost(catalog.url, POE2DB_HOSTS, 'Manifest catalog URL');
  assert(typeof catalog.sha256 === 'string' && /^[0-9a-f]{64}$/i.test(catalog.sha256),
    'Manifest catalog sha256 is invalid.');
  const resolvedAt = value.resolvedAt || value.resolverTimestamp;
  assert(typeof resolvedAt === 'string' && !Number.isNaN(Date.parse(resolvedAt)),
    'Manifest resolvedAt must be an ISO timestamp.');
  assert(Array.isArray(value.entries) && value.entries.length > 0, 'Manifest entries are missing or empty.');
  const ids = new Set();
  const metadataKeys = new Set();
  value.entries.forEach((entry, index) => {
    validateManifestEntry(entry, index);
    const baseId = Number(entry.baseId);
    assert(!ids.has(baseId), `Manifest repeats baseId ${baseId}.`);
    ids.add(baseId);
    assert(!metadataKeys.has(entry.metadataKey), `Manifest repeats metadataKey ${entry.metadataKey}.`);
    metadataKeys.add(entry.metadataKey);
  });
  if (value.failures != null) assert(Array.isArray(value.failures), 'Manifest failures must be an array.');
  return true;
}
