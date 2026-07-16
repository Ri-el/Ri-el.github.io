#!/usr/bin/env node

/**
 * Development-only WebP -> PNG boundary and no-overwrite file primitives.
 *
 * Nothing in the browser application imports this module.  A converter is
 * deliberately discovered at runtime so the repository can remain usable
 * without a package installation step.
 */

import { createHash, randomUUID } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateSync } from 'node:zlib';

import { isPng, isWebp } from './base-art-core.mjs';

export const MAX_PIXELS = 4_000_000;
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const execFileAsync = promisify(execFile);

function asBuffer(value, label) {
  if (Buffer.isBuffer(value)) return value;
  if (value instanceof Uint8Array) return Buffer.from(value);
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
  }
  if (value instanceof ArrayBuffer) return Buffer.from(value);
  throw new TypeError(`${label} must be a Buffer or Uint8Array.`);
}

function asPath(value, label) {
  if (typeof value === 'string' && value) return value;
  if (value instanceof URL && value.protocol === 'file:') return fileURLToPath(value);
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) return value.toString();
  throw new TypeError(`${label} must be a file path.`);
}

// PNG uses CRC-32 over the chunk type and data.  Keeping the tiny table here
// avoids relying on a Node-version-specific zlib.crc32 export.
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer, start, end) {
  let value = 0xffffffff;
  for (let index = start; index < end; index += 1) {
    value = CRC_TABLE[(value ^ buffer[index]) & 0xff] ^ (value >>> 8);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function pngError(message) {
  return new Error(`Invalid PNG: ${message}`);
}

/**
 * Validate PNG structure, dimensions, and chunk CRCs.  This is intentionally
 * stricter than a magic-byte check: a .webp renamed to .png, a truncated
 * stream, or a malformed IHDR is rejected before it can reach the asset tree.
 */
export function inspectPng(pngBuffer) {
  const bytes = asBuffer(pngBuffer, 'PNG data');
  if (!isPng(bytes)) throw pngError('missing PNG signature.');

  let offset = PNG_SIGNATURE.length;
  let sawHeader = false;
  let sawData = false;
  let sawEnd = false;
  const idatChunks = [];
  let width = 0;
  let height = 0;

  while (offset < bytes.length) {
    if (offset + 12 > bytes.length) throw pngError('truncated chunk header.');
    const chunkLength = bytes.readUInt32BE(offset);
    const typeStart = offset + 4;
    const dataStart = typeStart + 4;
    const dataEnd = dataStart + chunkLength;
    const crcEnd = dataEnd + 4;
    if (dataEnd < dataStart || crcEnd < dataEnd || crcEnd > bytes.length) {
      throw pngError('chunk exceeds the file boundary.');
    }
    const type = bytes.toString('ascii', typeStart, dataStart);
    if (!/^[A-Za-z]{4}$/.test(type)) throw pngError(`invalid chunk type ${JSON.stringify(type)}.`);
    const expectedCrc = bytes.readUInt32BE(dataEnd);
    const actualCrc = crc32(bytes, typeStart, dataEnd);

    if (!sawHeader) {
      if (type !== 'IHDR') throw pngError('IHDR must be the first chunk.');
      if (chunkLength !== 13) throw pngError('IHDR must contain 13 bytes.');
      width = bytes.readUInt32BE(dataStart);
      height = bytes.readUInt32BE(dataStart + 4);
      if (width <= 0 || height <= 0) throw pngError('dimensions must be positive.');
      if (width > Math.floor(MAX_PIXELS / height)) {
        throw pngError(`dimensions exceed the ${MAX_PIXELS.toLocaleString('en-US')} pixel limit.`);
      }
      const bitDepth = bytes[dataStart + 8];
      const colorType = bytes[dataStart + 9];
      const validDepths = {
        0: [1, 2, 4, 8, 16],
        2: [8, 16],
        3: [1, 2, 4, 8],
        4: [8, 16],
        6: [8, 16],
      };
      if (!validDepths[colorType]?.includes(bitDepth)) {
        throw pngError(`unsupported bit depth/color type (${bitDepth}/${colorType}).`);
      }
      if (bytes[dataStart + 10] !== 0 || bytes[dataStart + 11] !== 0 ||
          ![0, 1].includes(bytes[dataStart + 12])) {
        throw pngError('unsupported compression, filter, or interlace method.');
      }
      // Report malformed dimensions before a stale IHDR CRC so callers get a
      // useful limit/positivity diagnostic for corrupted fixture headers.
      if (expectedCrc !== actualCrc) throw pngError(`CRC mismatch in ${type}.`);
      sawHeader = true;
    } else if (type === 'IHDR') {
      throw pngError('duplicate IHDR chunk.');
    }

    if (expectedCrc !== actualCrc) throw pngError(`CRC mismatch in ${type}.`);

    if (type === 'IDAT' && chunkLength > 0) {
      sawData = true;
      idatChunks.push(bytes.subarray(dataStart, dataEnd));
    }
    if (type === 'IEND') {
      if (chunkLength !== 0) throw pngError('IEND must be empty.');
      sawEnd = true;
      offset = crcEnd;
      if (offset !== bytes.length) throw pngError('trailing bytes follow IEND.');
      break;
    }
    offset = crcEnd;
  }

  if (!sawHeader) throw pngError('missing IHDR chunk.');
  if (!sawData) throw pngError('missing IDAT data.');
  if (!sawEnd) throw pngError('missing IEND chunk.');
  try {
    // A valid PNG IDAT stream is a zlib stream.  Inflate only after the
    // dimension cap has been enforced above, keeping malformed/compressed
    // payloads from being accepted as a signature-plus-header fake.
    const inflated = inflateSync(Buffer.concat(idatChunks), { maxOutputLength: 64 * 1024 * 1024 });
    if (inflated.length === 0) throw new Error('empty scanline stream');
  } catch (error) {
    throw pngError(`IDAT data is not a valid zlib stream (${error.message}).`);
  }
  return { width, height };
}

function assertWebp(buffer) {
  if (!isWebp(buffer)) {
    throw new Error('Invalid WebP: expected a RIFF container with WEBP magic bytes.');
  }
}

function assertPng(buffer) {
  inspectPng(buffer);
  return asBuffer(buffer, 'PNG data');
}

function pathEndsWithPart(filePath) {
  return /\.part$/i.test(filePath);
}

/**
 * Read and verify an existing PNG asset.  Temporary .part files are rejected
 * explicitly so callers cannot accidentally count an interrupted write.
 */
export async function readVerifiedPng(filePath) {
  const destination = asPath(filePath, 'PNG path');
  if (pathEndsWithPart(destination)) {
    throw new Error(`Temporary .part file is not a complete PNG asset: ${destination}`);
  }
  const bytes = await fs.readFile(destination);
  const { width, height } = inspectPng(bytes);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  return {
    width,
    height,
    bytes: bytes.length,
    sha256,
  };
}

function skippedResult(destination, reason = 'exists') {
  return {
    written: false,
    skipped: true,
    reason,
    destination,
  };
}

/**
 * Install a PNG exactly once.  The payload is first fsynced to a unique
 * same-directory .part file; an atomic hard-link creates the final directory
 * entry without replacing a destination that appeared concurrently.
 */
export async function writePngIfAbsent(filePath, pngBuffer) {
  const destination = asPath(filePath, 'PNG destination');
  if (pathEndsWithPart(destination)) {
    throw new Error(`PNG destination must not be a temporary .part path: ${destination}`);
  }

  // Check first so a normal rerun does not reject or process a replacement
  // payload for an already-complete asset.  The atomic link below closes the
  // race where another worker creates the destination after this check.
  try {
    await fs.access(destination);
    return skippedResult(destination);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  const bytes = assertPng(asBuffer(pngBuffer, 'PNG data'));
  const directory = path.dirname(destination);
  await fs.mkdir(directory, { recursive: true });

  let partPath;
  let handle;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = path.join(
      directory,
      `.${path.basename(destination)}.${process.pid}.${randomUUID()}.part`,
    );
    try {
      handle = await fs.open(candidate, 'wx');
      partPath = candidate;
      break;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
    }
  }
  if (!handle || !partPath) throw new Error(`Could not allocate a unique .part file for ${destination}.`);

  try {
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    handle = null;
    try {
      await fs.link(partPath, destination);
    } catch (error) {
      if (error?.code === 'EEXIST') return skippedResult(destination);
      throw new Error(`Atomic PNG install failed for ${destination}: ${error.message}`, { cause: error });
    }
    await fs.unlink(partPath);
    partPath = null;
    return {
      written: true,
      skipped: false,
      destination,
    };
  } finally {
    if (handle) {
      try { await handle.close(); } catch { /* best effort cleanup */ }
    }
    if (partPath) {
      try { await fs.unlink(partPath); } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
    }
  }
}

function optionValue(options, camelName, cliName, environment) {
  const value = options?.[camelName] ?? options?.[cliName] ?? environment;
  if (value instanceof URL) return value.href;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function moduleSpecifier(specifier) {
  if (specifier instanceof URL) return specifier.href;
  const value = String(specifier);
  if (value.startsWith('file:')) return value;
  if (path.isAbsolute(value) || value.startsWith('.') || value.includes(path.sep)) {
    return pathToFileURL(path.resolve(value)).href;
  }
  return value;
}

async function importConverterModule(specifier) {
  return import(moduleSpecifier(specifier));
}

function factoryFromModule(module, specifier) {
  const factory = module?.default ?? module;
  if (typeof factory !== 'function') {
    throw new Error(`Configured sharp module ${specifier} does not export a callable sharp factory.`);
  }
  return factory;
}

function versionFromModule(module) {
  const candidates = [
    module?.version,
    module?.default?.version,
    module?.versions?.sharp,
    module?.default?.versions?.sharp,
  ];
  return candidates.find(value => typeof value === 'string' && value.trim()) || null;
}

async function packageVersionForSpecifier(specifier) {
  let resolved;
  try {
    const value = String(specifier);
    if (value.startsWith('file:')) resolved = fileURLToPath(value);
    else if (path.isAbsolute(value)) resolved = value;
  } catch {
    resolved = null;
  }
  if (!resolved) return null;
  let directory = path.dirname(resolved);
  for (;;) {
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(directory, 'package.json'), 'utf8'));
      if (typeof packageJson.version === 'string' && packageJson.version) return packageJson.version;
    } catch {
      // Walk upward until the module package boundary (or filesystem root).
    }
    const parent = path.dirname(directory);
    if (parent === directory) break;
    directory = parent;
  }
  return null;
}

function sharpPipeline(factory) {
  return async function convertWebpToPng(inputBuffer) {
    const input = asBuffer(inputBuffer, 'WebP input');
    assertWebp(input);
    let output;
    try {
      output = await factory(input, { limitInputPixels: MAX_PIXELS })
        .rotate()
        .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
        .toBuffer();
    } catch (error) {
      throw new Error(`sharp WebP conversion failed: ${error instanceof Error ? error.message : error}`, {
        cause: error,
      });
    }
    try {
      return assertPng(asBuffer(output, 'sharp output'));
    } catch (error) {
      throw new Error(`sharp returned invalid PNG output: ${error.message}`, { cause: error });
    }
  };
}

async function loadSharpConverter(specifier) {
  const module = await importConverterModule(specifier);
  const factory = factoryFromModule(module, specifier);
  const version = versionFromModule(module) || await packageVersionForSpecifier(specifier) || 'unknown';
  return Object.freeze({
    name: 'sharp',
    version,
    convertWebpToPng: sharpPipeline(factory),
  });
}

function pythonErrorMessage(error) {
  const stderr = error?.stderr ? String(error.stderr).trim() : '';
  const detail = stderr || (error instanceof Error ? error.message : String(error));
  return detail.replace(/\s+/g, ' ').slice(0, 400);
}

async function probePython(python) {
  try {
    const result = await execFileAsync(python, ['-c', 'import PIL; print(PIL.__version__)'], {
      windowsHide: true,
      maxBuffer: 16 * 1024,
    });
    const version = String(result.stdout || '').trim().split(/\s+/)[0];
    if (!version) throw new Error('Pillow version probe returned no version.');
    return version;
  } catch (error) {
    throw new Error(
      `Python converter ${python} is unavailable or Pillow is missing: ${pythonErrorMessage(error)}. ` +
      `Install Pillow in that environment or provide --sharp-module <path>.`,
      { cause: error },
    );
  }
}

async function pythonPipeline(python) {
  const version = await probePython(python);
  const script = fileURLToPath(new URL('./convert-webp-to-png.py', import.meta.url));
  return Object.freeze({
    name: 'Pillow',
    version,
    convertWebpToPng: async inputBuffer => {
      const input = asBuffer(inputBuffer, 'WebP input');
      assertWebp(input);
      const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'poe2-webp-'));
      const inputPath = path.join(temporaryDirectory, 'input.webp');
      const outputPath = path.join(temporaryDirectory, 'output.png');
      try {
        await fs.writeFile(inputPath, input);
        let result;
        try {
          // The helper intentionally receives exactly one input and one output
          // path; no shell interpolation or extra flags are permitted.
          result = await execFileAsync(python, [script, inputPath, outputPath], {
            windowsHide: true,
            maxBuffer: 64 * 1024,
          });
        } catch (error) {
          throw new Error(`Pillow WebP conversion failed: ${pythonErrorMessage(error)}`, { cause: error });
        }
        void result;
        let output;
        try {
          output = await fs.readFile(outputPath);
        } catch (error) {
          throw new Error(`Pillow converter did not produce ${outputPath}: ${error.message}`, { cause: error });
        }
        try {
          return assertPng(output);
        } catch (error) {
          throw new Error(`Pillow returned invalid PNG output: ${error.message}`, { cause: error });
        }
      } finally {
        await fs.rm(temporaryDirectory, { recursive: true, force: true });
      }
    },
  });
}

function discoveryFailure(errors) {
  const details = errors.length
    ? ` Attempts: ${errors.map(({ label, error }) => `${label}: ${error.message}`).join(' | ')}`
    : '';
  return new Error(
    'No WebP converter is available. No packages were installed automatically. ' +
    'Provide a bundled sharp module with --sharp-module <path> or POE2_SHARP_MODULE=<path>, ' +
    'or provide a Python executable with --python <path> or POE2_PYTHON=<path> (Pillow required).' +
    details,
  );
}

/**
 * Discover a converter without installing dependencies.  Explicit sharp,
 * normal module resolution, and explicit Python/Pillow are attempted in that
 * order; failures are retained so the final error remains actionable.
 */
export async function loadConverter(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Converter options must be an object.');
  }
  const environment = options.env && typeof options.env === 'object' ? options.env : process.env;
  const explicitSharp = optionValue(options, 'sharpModule', '--sharp-module', environment.POE2_SHARP_MODULE);
  const explicitPython = optionValue(options, 'python', '--python', environment.POE2_PYTHON);
  const errors = [];

  if (explicitSharp) {
    try {
      return await loadSharpConverter(explicitSharp);
    } catch (error) {
      errors.push({ label: `--sharp-module ${explicitSharp}`, error });
    }
  }

  if (!options.disableDefaultSharp) {
    try {
      return await loadSharpConverter('sharp');
    } catch (error) {
      errors.push({ label: 'normal sharp import', error });
    }
  }

  if (explicitPython) {
    try {
      return await pythonPipeline(explicitPython);
    } catch (error) {
      errors.push({ label: `--python ${explicitPython}`, error });
    }
  }

  throw discoveryFailure(errors);
}
