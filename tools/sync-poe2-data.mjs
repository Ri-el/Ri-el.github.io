#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { lookup } from 'node:dns/promises';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { isIP } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  normalizeCoeData,
  parseCoeExport,
  writeNormalizedFiles,
} from './convert-coe-data.mjs';
import { buildNormalizedBrowserSource } from './build-normalized-data.mjs';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const CACHE_ROOT = path.join(PROJECT_ROOT, 'data', 'source-cache');
const SNAPSHOT_ROOT = path.join(CACHE_ROOT, 'snapshots');
const REQUEST_ROOT = path.join(CACHE_ROOT, 'requests');
const PROVENANCE_PATH = path.join(CACHE_ROOT, 'provenance.json');
const SOURCES_PATH = path.join(CACHE_ROOT, 'sources.json');
const NORMALIZED_DIR = path.join(PROJECT_ROOT, 'data', 'normalized');
const COVERAGE_PATH = path.join(PROJECT_ROOT, 'reports', 'data-coverage.json');
const CONVERTER_PATH = path.join(TOOL_DIR, 'convert-coe-data.mjs');

const sources = readJson(SOURCES_PATH);
const policy = sources.networkPolicy;

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function atomicWrite(filePath, contents) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.tmp`;
  writeFileSync(temporary, contents);
  try {
    renameSync(temporary, filePath);
  } catch (error) {
    if (!existsSync(filePath)) throw error;
    rmSync(filePath);
    renameSync(temporary, filePath);
  }
}

function atomicWriteJson(filePath, value) {
  atomicWrite(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function parseOptions(argv) {
  const command = argv[0] && !argv[0].startsWith('-') ? argv.shift() : 'status';
  const options = {};
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    if (!argument.startsWith('--')) throw new Error(`Unexpected argument: ${argument}`);
    const key = argument.slice(2);
    if (key === 'help') {
      options.help = true;
      continue;
    }
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`);
    options[key] = value;
  }
  return { command, options };
}

function showHelp() {
  console.log(`PoE 2 repository data sync (staging only)

Usage:
  node tools/sync-poe2-data.mjs status
  node tools/sync-poe2-data.mjs verify
  node tools/sync-poe2-data.mjs report
  node tools/sync-poe2-data.mjs fetch --source craft-of-exile-poe2
  node tools/sync-poe2-data.mjs fetch --source-id <id> --url <public-https-url> [--source-version <version>]
  node tools/sync-poe2-data.mjs import --source-id <id> --file <path> --source-url <public-https-url> [--source-version <version>]

fetch/import validate and stage immutable snapshots under data/source-cache/snapshots/.
They never replace data/normalized/ or change the active provenance snapshot.`);
}

function requireSourceId(value) {
  if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(value || '')) {
    throw new Error('source ID must be 3-64 lowercase letters, digits, dots, underscores, or hyphens');
  }
  return value;
}

function requireIsoDate(value, label) {
  if (value == null) return null;
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be an ISO-8601 date/time`);
  return new Date(value).toISOString();
}

function normalizeHostname(hostname) {
  return hostname.toLowerCase().replace(/^\[/, '').replace(/\]$/, '').split('%')[0];
}

function isPrivateAddress(address) {
  const host = normalizeHostname(address);
  if (isIP(host) === 4) {
    const octets = host.split('.').map(Number);
    return octets[0] === 0 || octets[0] === 10 || octets[0] === 127 ||
      (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) ||
      (octets[0] === 169 && octets[1] === 254) ||
      (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) ||
      (octets[0] === 192 && octets[1] === 168) || octets[0] >= 224;
  }
  if (isIP(host) === 6) {
    return host === '::' || host === '::1' || host.startsWith('fc') || host.startsWith('fd') ||
      /^fe[89ab]/.test(host) || host.startsWith('::ffff:127.') || host.startsWith('::ffff:10.') ||
      host.startsWith('::ffff:192.168.');
  }
  return false;
}

function parsePublicHttpsUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error(`Only HTTPS sources are allowed: ${url.href}`);
  if (url.username || url.password) throw new Error('Source URLs must not contain credentials');
  const hostname = normalizeHostname(url.hostname);
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') || isPrivateAddress(hostname)) {
    throw new Error(`Private or local source endpoints are not allowed: ${url.hostname}`);
  }
  url.hash = '';
  return url;
}

async function assertPublicDns(url) {
  if (isIP(normalizeHostname(url.hostname))) return;
  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (addresses.length === 0 || addresses.some(record => isPrivateAddress(record.address))) {
    throw new Error(`Source host did not resolve exclusively to public addresses: ${url.hostname}`);
  }
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function waitForRateLimit(lastRequestAt) {
  const elapsed = Date.now() - (lastRequestAt || 0);
  const remaining = policy.minimumRequestIntervalMs - elapsed;
  if (remaining > 0) await delay(remaining);
}

async function fetchWithPolicy(initialUrl, headers, previousRequestAt = 0) {
  let url = parsePublicHttpsUrl(initialUrl);
  let redirects = 0;
  let lastRequestAt = previousRequestAt;

  for (;;) {
    await assertPublicDns(url);
    await waitForRateLimit(lastRequestAt);
    lastRequestAt = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), policy.requestTimeoutMs);
    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers,
        redirect: 'manual',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      if (redirects++ >= policy.maximumRedirects) throw new Error('Too many redirects');
      const location = response.headers.get('location');
      if (!location) throw new Error(`Redirect ${response.status} omitted Location`);
      url = parsePublicHttpsUrl(new URL(location, url).href);
      continue;
    }
    return { response, finalUrl: url, lastRequestAt };
  }
}

async function readBoundedResponse(response) {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > policy.maximumResponseBytes) {
    throw new Error(`Response exceeds ${policy.maximumResponseBytes} byte limit`);
  }
  if (!response.body) throw new Error('Response has no body');

  const chunks = [];
  let total = 0;
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > policy.maximumResponseBytes) {
      await reader.cancel();
      throw new Error(`Response exceeds ${policy.maximumResponseBytes} byte limit`);
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

function loadNormalized(directory = NORMALIZED_DIR) {
  return {
    baseItems: readJson(path.join(directory, 'base-items.json')),
    modifiers: readJson(path.join(directory, 'modifiers.json')),
    craftingItems: readJson(path.join(directory, 'crafting-items.json')),
    essences: readJson(path.join(directory, 'essences.json')),
    manifest: readJson(path.join(directory, 'version-manifest.json')),
  };
}

function buildCoverageReport(normalized, activeSnapshotId, generatedAt = new Date().toISOString()) {
  const baseFiles = readdirSync(path.join(PROJECT_ROOT, 'data', 'bases'))
    .filter(file => file.endsWith('.json'))
    .sort();
  const legacyIds = baseFiles.map(file => file.slice(0, -5));
  const normalizedIds = Object.keys(normalized.baseItems.simulatorBaseMap).sort();
  const emptyLegacyPools = [];
  const allOneWeightPools = [];
  let prefixGroups = 0;
  let suffixGroups = 0;
  let prefixTiers = 0;
  let suffixTiers = 0;

  for (const file of baseFiles) {
    const id = file.slice(0, -5);
    const pool = readJson(path.join(PROJECT_ROOT, 'data', 'bases', file));
    const prefixes = pool.prefixes || [];
    const suffixes = pool.suffixes || [];
    const tiers = [...prefixes, ...suffixes].flatMap(group => group.tiers || []);
    prefixGroups += prefixes.length;
    suffixGroups += suffixes.length;
    prefixTiers += prefixes.reduce((sum, group) => sum + (group.tiers || []).length, 0);
    suffixTiers += suffixes.reduce((sum, group) => sum + (group.tiers || []).length, 0);
    if (prefixes.length + suffixes.length === 0) emptyLegacyPools.push(id);
    if (tiers.length > 0 && tiers.every(tier => tier.weight === 1)) allOneWeightPools.push(id);
  }

  const desecrated = readJson(path.join(PROJECT_ROOT, 'data', 'desecrated-mods.json'));
  const emptyDesecratedPools = Object.entries(desecrated.bases)
    .filter(([, pool]) => (pool.prefixes || []).length + (pool.suffixes || []).length === 0)
    .map(([id]) => id)
    .sort();

  return {
    schemaVersion: 1,
    generatedAt,
    activeSnapshotId,
    targetGameVersion: normalized.manifest.targetGameVersion,
    normalizedSourceHash: normalized.manifest.source.sha256,
    counts: {
      legacyPools: legacyIds.length,
      populatedLegacyPools: legacyIds.length - emptyLegacyPools.length,
      legacyPrefixGroups: prefixGroups,
      legacySuffixGroups: suffixGroups,
      legacyPrefixTiers: prefixTiers,
      legacySuffixTiers: suffixTiers,
      normalizedMappings: normalizedIds.length,
      normalizedClasses: normalized.baseItems.classes.length,
      concreteBases: normalized.baseItems.bases.length,
      normalizedModifiers: normalized.modifiers.modifiers.length,
      normalizedDesecratedModifiers: normalized.modifiers.modifiers.filter(modifier => modifier.desecrated).length,
      normalizedEssenceModifiers: normalized.modifiers.modifiers.filter(modifier => modifier.essence).length,
      craftingItems: normalized.craftingItems.items.length,
      essences: normalized.essences.essences.length,
      socketables: normalized.craftingItems.socketables.length,
    },
    gaps: {
      emptyLegacyPools,
      normalizedOnlyMappings: normalizedIds.filter(id => !legacyIds.includes(id)),
      legacyOnlyMappings: legacyIds.filter(id => !normalizedIds.includes(id)),
      allOneWeightPools,
      emptyDesecratedPools,
    },
    normalizedLimitations: normalized.manifest.limitations,
    candidateFeeds: Object.fromEntries(Object.entries(sources.feeds).map(([id, feed]) => [id, {
      status: feed.status,
      reportedVersion: feed.reportedVersion,
      versionObservedAt: feed.versionObservedAt,
      parser: feed.parser,
    }])),
  };
}

function verifyCurrentRepository() {
  const normalized = loadNormalized();
  const provenance = readJson(PROVENANCE_PATH);
  const active = provenance.snapshots.find(snapshot => snapshot.id === provenance.activeSnapshotId);
  if (!active) throw new Error('Active provenance snapshot is missing');
  if (active.source.sha256 !== normalized.manifest.source.sha256) {
    throw new Error('Active provenance source hash does not match normalized manifest');
  }
  for (const key of ['baseItems', 'modifiers', 'craftingItems', 'essences']) {
    const hash = sha256(JSON.stringify(normalized[key]));
    if (hash !== normalized.manifest.outputHashes[key]) {
      throw new Error(`Normalized payload hash mismatch: ${key}`);
    }
  }
  const expectedBundle = buildNormalizedBrowserSource(NORMALIZED_DIR);
  const actualBundle = readFileSync(path.join(PROJECT_ROOT, 'data', 'normalized.data.js'), 'utf8');
  if (actualBundle !== expectedBundle) throw new Error('data/normalized.data.js is stale');
  return { normalized, provenance, active };
}

function sourceFileName(sourceUrl, fallback = 'source-export.data') {
  if (!sourceUrl) return fallback;
  const candidate = path.posix.basename(new URL(sourceUrl).pathname);
  return candidate || fallback;
}

function stageSource(rawBytes, details) {
  const rawText = rawBytes.toString('utf8');
  if (rawText.includes('\uFFFD')) throw new Error('Source is not valid lossless UTF-8');
  const parsed = parseCoeExport(rawText);
  const sourceHash = sha256(rawBytes);
  const snapshotId = `${details.sourceId}-${sourceHash.slice(0, 12)}`;
  const snapshotDir = path.join(SNAPSHOT_ROOT, snapshotId);
  const metadataPath = path.join(snapshotDir, 'metadata.json');

  if (existsSync(snapshotDir)) {
    if (!existsSync(metadataPath)) throw new Error(`Incomplete existing snapshot: ${snapshotId}`);
    const metadata = readJson(metadataPath);
    if (metadata.source.sha256 !== sourceHash) throw new Error(`Snapshot collision: ${snapshotId}`);
    return { snapshotId, snapshotDir, metadata, reused: true };
  }

  const normalized = normalizeCoeData(parsed.data, {
    fileName: sourceFileName(details.sourceUrl, details.fileName),
    bytes: rawBytes.byteLength,
    sha256: sourceHash,
    wrapper: parsed.wrapper,
  });
  if (details.targetGameVersion && details.targetGameVersion !== normalized.manifest.targetGameVersion) {
    throw new Error(`Converter targets ${normalized.manifest.targetGameVersion}, not ${details.targetGameVersion}`);
  }

  mkdirSync(SNAPSHOT_ROOT, { recursive: true });
  mkdirSync(snapshotDir, { recursive: false });
  atomicWrite(path.join(snapshotDir, 'source-export.data'), rawBytes);
  const stagedNormalizedDir = path.join(snapshotDir, 'normalized');
  writeNormalizedFiles(normalized, stagedNormalizedDir);
  atomicWrite(path.join(snapshotDir, 'normalized.data.js'), buildNormalizedBrowserSource(stagedNormalizedDir));
  const coverage = buildCoverageReport(normalized, snapshotId, details.retrievedAt);
  atomicWriteJson(path.join(snapshotDir, 'coverage.json'), coverage);

  const metadata = {
    schemaVersion: 1,
    id: snapshotId,
    status: 'staged-not-promoted',
    source: {
      feedId: details.sourceId,
      url: details.sourceUrl,
      finalUrl: details.finalUrl || details.sourceUrl,
      publishedAt: details.publishedAt || null,
      retrievedAt: details.retrievedAt,
      reportedVersion: details.sourceVersion || null,
      fileName: sourceFileName(details.sourceUrl, details.fileName),
      bytes: rawBytes.byteLength,
      sha256: sourceHash,
      wrapper: parsed.wrapper,
      etag: details.etag || null,
      lastModified: details.lastModified || null,
      rawAvailable: true,
      rawPath: `data/source-cache/snapshots/${snapshotId}/source-export.data`,
    },
    parser: {
      id: 'craft-of-exile-export-v1',
      path: 'tools/convert-coe-data.mjs',
      sha256: sha256(readFileSync(CONVERTER_PATH)),
      schemaVersion: 1,
    },
    normalized: {
      directory: `data/source-cache/snapshots/${snapshotId}/normalized`,
      bundle: `data/source-cache/snapshots/${snapshotId}/normalized.data.js`,
      outputHashes: normalized.manifest.outputHashes,
      counts: normalized.manifest.counts,
    },
    validation: {
      sourceSchemaParsed: true,
      outputHashesRecorded: true,
      browserBundleCompiled: true,
      coverageReportGenerated: true,
    },
    promotion: {
      automatic: false,
      status: 'not-promoted',
      instructions: 'Review the staged source, metadata, coverage, and normalized diff before deliberately replacing the active repository snapshot.',
    },
  };
  atomicWriteJson(metadataPath, metadata);
  return { snapshotId, snapshotDir, metadata, reused: false };
}

function resolveFetchSource(options) {
  if (options.source) {
    const feed = sources.feeds[options.source];
    if (!feed) throw new Error(`Unknown configured source: ${options.source}`);
    if (feed.parser !== 'craft-of-exile-export-v1') {
      throw new Error(`${options.source} cannot be fetched by this importer: ${feed.status}`);
    }
    return {
      sourceId: requireSourceId(options['source-id'] || options.source),
      sourceUrl: parsePublicHttpsUrl(options.url || feed.url).href,
      sourceVersion: options['source-version'] || feed.reportedVersion || null,
    };
  }
  if (!options.url || !options['source-id']) {
    throw new Error('fetch requires --source <configured-id>, or both --source-id and --url');
  }
  return {
    sourceId: requireSourceId(options['source-id']),
    sourceUrl: parsePublicHttpsUrl(options.url).href,
    sourceVersion: options['source-version'] || null,
  };
}

async function fetchSource(options) {
  const resolved = resolveFetchSource(options);
  mkdirSync(REQUEST_ROOT, { recursive: true });
  const requestPath = path.join(REQUEST_ROOT, `${resolved.sourceId}.json`);
  const previous = existsSync(requestPath) ? readJson(requestPath) : null;
  if (previous && previous.sourceUrl !== resolved.sourceUrl) {
    throw new Error(`Source URL changed for ${resolved.sourceId}; choose a new source ID`);
  }

  const headers = {
    'User-Agent': policy.userAgent,
    Accept: 'application/json, text/plain;q=0.9, application/javascript;q=0.8',
  };
  if (previous?.etag) headers['If-None-Match'] = previous.etag;
  if (previous?.lastModified) headers['If-Modified-Since'] = previous.lastModified;

  const { response, finalUrl, lastRequestAt } = await fetchWithPolicy(
    resolved.sourceUrl,
    headers,
    previous?.lastRequestAt ? Date.parse(previous.lastRequestAt) : 0,
  );
  const checkedAt = new Date().toISOString();
  if (response.status === 304) {
    if (!previous?.snapshotId || !existsSync(path.join(SNAPSHOT_ROOT, previous.snapshotId, 'metadata.json'))) {
      throw new Error('Server returned 304 but no complete cached snapshot exists');
    }
    atomicWriteJson(requestPath, { ...previous, lastCheckedAt: checkedAt, lastRequestAt: new Date(lastRequestAt).toISOString() });
    console.log(`Not modified: ${previous.snapshotId}`);
    return;
  }
  if (response.status !== 200) throw new Error(`HTTP ${response.status} ${response.statusText}`);

  const body = await readBoundedResponse(response);
  const staged = stageSource(body, {
    ...resolved,
    finalUrl: finalUrl.href,
    fileName: sourceFileName(finalUrl.href),
    retrievedAt: checkedAt,
    publishedAt: null,
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  });
  atomicWriteJson(requestPath, {
    schemaVersion: 1,
    sourceId: resolved.sourceId,
    sourceUrl: resolved.sourceUrl,
    finalUrl: finalUrl.href,
    snapshotId: staged.snapshotId,
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
    lastCheckedAt: checkedAt,
    lastRequestAt: new Date(lastRequestAt).toISOString(),
    userAgent: policy.userAgent,
    minimumRequestIntervalMs: policy.minimumRequestIntervalMs,
  });
  console.log(`${staged.reused ? 'Reused' : 'Staged'} snapshot: ${staged.snapshotId}`);
  console.log(`No production data was changed. Review: ${path.relative(PROJECT_ROOT, staged.snapshotDir)}`);
}

function importSource(options) {
  if (!options.file || !options['source-id'] || !options['source-url']) {
    throw new Error('import requires --source-id, --file, and --source-url');
  }
  const filePath = path.resolve(PROJECT_ROOT, options.file);
  if (!existsSync(filePath)) throw new Error(`Import file not found: ${filePath}`);
  const sourceUrl = parsePublicHttpsUrl(options['source-url']).href;
  const retrievedAt = requireIsoDate(options['retrieved-at'], '--retrieved-at') || new Date().toISOString();
  const publishedAt = requireIsoDate(options['published-at'], '--published-at');
  const staged = stageSource(readFileSync(filePath), {
    sourceId: requireSourceId(options['source-id']),
    sourceUrl,
    finalUrl: sourceUrl,
    sourceVersion: options['source-version'] || null,
    targetGameVersion: options['target-game-version'] || null,
    fileName: path.basename(filePath),
    retrievedAt,
    publishedAt,
  });
  console.log(`${staged.reused ? 'Reused' : 'Staged'} snapshot: ${staged.snapshotId}`);
  console.log(`No production data was changed. Review: ${path.relative(PROJECT_ROOT, staged.snapshotDir)}`);
}

function showStatus() {
  const { normalized, provenance, active } = verifyCurrentRepository();
  const snapshots = existsSync(SNAPSHOT_ROOT)
    ? readdirSync(SNAPSHOT_ROOT, { withFileTypes: true }).filter(entry => entry.isDirectory()).length
    : 0;
  console.log(`Active snapshot: ${active.id}`);
  console.log(`Raw source cached: ${active.source.rawAvailable ? 'yes' : 'no (explicit legacy provenance only)'}`);
  console.log(`Target game version: ${normalized.manifest.targetGameVersion}`);
  console.log(`Normalized: ${normalized.baseItems.bases.length} bases, ${normalized.modifiers.modifiers.length} modifiers`);
  console.log(`Staged immutable snapshots: ${snapshots}`);
  console.log('\nConfigured refresh candidates:');
  for (const [id, feed] of Object.entries(sources.feeds)) {
    console.log(`  ${id}: ${feed.status}, reported ${feed.reportedVersion}, parser ${feed.parser || 'not implemented'}`);
  }
  console.log(`\nProvenance schema: ${provenance.schemaVersion}`);
}

function writeCoverageReport() {
  const { normalized, provenance } = verifyCurrentRepository();
  const report = buildCoverageReport(normalized, provenance.activeSnapshotId);
  atomicWriteJson(COVERAGE_PATH, report);
  console.log(`Wrote ${path.relative(PROJECT_ROOT, COVERAGE_PATH)}`);
  console.log(`${report.counts.populatedLegacyPools}/${report.counts.legacyPools} legacy pools populated; ${report.counts.normalizedMappings} normalized mappings.`);
}

async function main() {
  const { command, options } = parseOptions(process.argv.slice(2));
  if (options.help || command === 'help') {
    showHelp();
    return;
  }
  if (command === 'status') return showStatus();
  if (command === 'verify') {
    verifyCurrentRepository();
    console.log('Repository provenance, normalized hashes, and browser bundle are current.');
    return;
  }
  if (command === 'report') return writeCoverageReport();
  if (command === 'fetch') return fetchSource(options);
  if (command === 'import') return importSource(options);
  throw new Error(`Unknown command: ${command}`);
}

main().catch(error => {
  console.error(`Data sync failed: ${error.message}`);
  process.exitCode = 1;
});
