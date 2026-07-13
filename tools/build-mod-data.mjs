#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, '..');
const BASE_DIR = path.join(PROJECT_ROOT, 'data', 'bases');
const SHARED_DIR = path.join(PROJECT_ROOT, 'data', 'shared');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'data', 'mods.data.js');

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function jsonFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).filter(file => file.endsWith('.json')).sort();
}

export function buildModBrowserSource(baseDirectory = BASE_DIR, sharedDirectory = SHARED_DIR) {
  const lines = [
    'window.MOD_BASES=window.MOD_BASES||{};',
    'window.MOD_SHARED=window.MOD_SHARED||{};',
  ];
  for (const file of jsonFiles(baseDirectory)) {
    const id = path.basename(file, '.json');
    lines.push(`window.MOD_BASES[${JSON.stringify(id)}]=${JSON.stringify(readJson(path.join(baseDirectory, file)))};`);
  }
  for (const file of jsonFiles(sharedDirectory)) {
    const id = path.basename(file, '.json');
    lines.push(`window.MOD_SHARED[${JSON.stringify(id)}]=${JSON.stringify(readJson(path.join(sharedDirectory, file)))};`);
  }
  return `${lines.join('\n')}\n`;
}

function normalizeText(value) {
  return String(value).replace(/\r\n?/g, '\n');
}

function runCli() {
  const source = buildModBrowserSource();
  if (process.argv.includes('--check')) {
    if (normalizeText(readFileSync(OUTPUT_FILE, 'utf8')) !== normalizeText(source)) {
      throw new Error('data/mods.data.js is stale; rebuild browser mod data.');
    }
    console.log('data/mods.data.js matches all source base JSON.');
    return;
  }
  writeFileSync(OUTPUT_FILE, source, 'utf8');
  console.log('Generated minified data/mods.data.js');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
