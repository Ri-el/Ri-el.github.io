#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const NORMALIZED_DIR = path.join(PROJECT_ROOT, 'data', 'normalized');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'normalized.data.js');

const SOURCES = {
  baseItems: 'base-items.json',
  modifiers: 'modifiers.json',
  craftingItems: 'crafting-items.json',
  essences: 'essences.json',
  manifest: 'version-manifest.json',
};

export function buildNormalizedBrowserSource(directory = NORMALIZED_DIR) {
  const parts = [];
  for (const [key, fileName] of Object.entries(SOURCES)) {
    const raw = readFileSync(path.join(directory, fileName), 'utf8').trimStart().replace(/^\uFEFF/, '').trim();
    JSON.parse(raw);
    parts.push(`${JSON.stringify(key)}:${raw}`);
  }
  return `window.COE_NORMALIZED_DATA={${parts.join(',')}};\n`;
}

function runCli() {
  const checkOnly = process.argv.includes('--check');
  const source = buildNormalizedBrowserSource();
  if (checkOnly) {
    const actual = readFileSync(OUTPUT_FILE, 'utf8');
    if (actual !== source) throw new Error('data/normalized.data.js is stale; rebuild browser data.');
    console.log('data/normalized.data.js matches normalized source JSON.');
    return;
  }
  writeFileSync(OUTPUT_FILE, source, 'utf8');
  console.log('Generated data/normalized.data.js');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
