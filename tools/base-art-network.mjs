#!/usr/bin/env node

import { lookup as defaultLookup } from 'node:dns/promises';
import { isIP } from 'node:net';

const PAGE_HOSTS = new Set(['poe2db.tw', 'www.poe2db.tw']);
const CDN_HOST = 'cdn.poe2db.tw';
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const DEFAULT_USER_AGENT =
  'Oishy-Crafting-Forge-base-art-sync/1.0 (development asset acquisition; no runtime requests)';

const DEFAULTS = Object.freeze({
  minimumRequestIntervalMs: 2_000,
  requestTimeoutMs: 30_000,
  maximumResponseBytes: 32 * 1024 * 1024,
  maximumRedirects: 3,
  maximumAttempts: 4,
  backoffBaseMs: 1_000,
  maximumBackoffMs: 8_000,
});

class NetworkPolicyError extends Error {
  constructor(message, code = 'NETWORK_POLICY', options = {}) {
    super(message, options);
    this.name = 'NetworkPolicyError';
    this.code = code;
    this.retryable = false;
    if (options.url != null) this.url = options.url;
    if (options.attempt != null) this.attempt = options.attempt;
    if (options.status != null) this.status = options.status;
  }
}

class NetworkRequestError extends Error {
  constructor(message, code = 'NETWORK_REQUEST', options = {}) {
    super(message, options);
    this.name = 'NetworkRequestError';
    this.code = code;
    this.retryable = options.retryable !== false;
    if (options.status != null) this.status = options.status;
    if (options.url != null) this.url = options.url;
    if (options.attempt != null) this.attempt = options.attempt;
  }
}

function normalizeHostname(value) {
  return String(value).toLowerCase().replace(/^\[/, '').replace(/\]$/, '').split('%', 1)[0];
}

function parseIpv4(value) {
  if (isIP(value) !== 4) return null;
  return value.split('.').map(Number);
}

function ipv6Bytes(value) {
  let source = normalizeHostname(value);
  if (isIP(source) !== 6) return null;
  const ipv4Match = source.match(/(?:^|:)(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Match) {
    const octets = parseIpv4(ipv4Match[1]);
    if (!octets) return null;
    source = source.slice(0, -ipv4Match[1].length) +
      `${((octets[0] << 8) | octets[1]).toString(16)}:${((octets[2] << 8) | octets[3]).toString(16)}`;
  }
  const halves = source.split('::');
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || (halves.length === 2 && missing < 1)) return null;
  const groups = [...left, ...Array(Math.max(0, missing)).fill('0'), ...right];
  if (groups.length !== 8 || groups.some(group => !/^[0-9a-f]{1,4}$/i.test(group))) return null;
  const bytes = Buffer.alloc(16);
  groups.forEach((group, index) => bytes.writeUInt16BE(Number.parseInt(group, 16), index * 2));
  return bytes;
}

/** Return true for local, private, documentation, multicast, and reserved IP space. */
export function isPrivateAddress(address) {
  const host = normalizeHostname(address);
  const ipv4 = parseIpv4(host);
  if (ipv4) {
    const [a, b, c] = ipv4;
    return a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 0 && c === 0) ||
      (a === 192 && b === 0 && c === 2) ||
      (a === 192 && b === 88 && c === 99) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113) ||
      a >= 224;
  }

  const ipv6 = ipv6Bytes(host);
  if (!ipv6) return false;
  const allZero = ipv6.every(byte => byte === 0);
  const loopback = ipv6.subarray(0, 15).every(byte => byte === 0) && ipv6[15] === 1;
  const uniqueLocal = (ipv6[0] & 0xfe) === 0xfc;
  const linkLocal = ipv6[0] === 0xfe && (ipv6[1] & 0xc0) === 0x80;
  const multicast = ipv6[0] === 0xff;
  const documentation = ipv6[0] === 0x20 && ipv6[1] === 0x01 &&
    ipv6[2] === 0x0d && ipv6[3] === 0xb8;
  const ipv4Mapped = ipv6.subarray(0, 10).every(byte => byte === 0) &&
    ipv6[10] === 0xff && ipv6[11] === 0xff;
  if (ipv4Mapped) {
    return isPrivateAddress([...ipv6.subarray(12)].join('.'));
  }
  const ipv4Compatible = ipv6.subarray(0, 12).every(byte => byte === 0);
  const firstGroup = ipv6.readUInt16BE(0);
  const secondGroup = ipv6.readUInt16BE(2);
  const discardOnly = firstGroup === 0x0100 && ipv6.subarray(2, 8).every(byte => byte === 0);
  const reserved2001 = firstGroup === 0x2001 && (
    secondGroup <= 0x0003 || (secondGroup >= 0x0010 && secondGroup <= 0x003f) ||
    secondGroup === 0x0db8
  );
  const deprecatedSiteLocal = ipv6[0] === 0xfe && (ipv6[1] & 0xc0) === 0xc0;
  const documentation3fff = firstGroup >= 0x3fff && firstGroup <= 0x3fff;
  const nat64WellKnown = firstGroup === 0x0064 && secondGroup === 0xff9b;
  const sixToFour = firstGroup === 0x2002;
  if (ipv4Compatible || discardOnly || reserved2001 || deprecatedSiteLocal ||
      documentation3fff || nat64WellKnown || sixToFour) return true;
  // 2001:db8::/32 is already covered above; keep the broad special ranges
  // explicit so future fixtures cannot silently treat documentation space as
  // a public endpoint.
  return allZero || loopback || uniqueLocal || linkLocal || multicast || documentation;
}

function assertSafePath(url) {
  let decoded;
  try {
    decoded = decodeURIComponent(url.pathname);
  } catch {
    throw new NetworkPolicyError(`Source URL contains malformed path encoding: ${url.href}`, 'URL_PATH', {
      url: url.href,
    });
  }
  if (decoded.includes('\\') || decoded.split('/').includes('..') || decoded.includes('\0')) {
    throw new NetworkPolicyError(`Source URL contains path traversal: ${url.href}`, 'URL_PATH', {
      url: url.href,
    });
  }
}

/** Parse and enforce the exact public Poe2DB sources used by this pipeline. */
export function assertAllowedSourceUrl(value) {
  let rawValue;
  try {
    rawValue = value instanceof URL ? value.href : String(value);
  } catch (error) {
    throw new NetworkPolicyError('Source URL could not be converted to text.', 'URL_INVALID', { cause: error });
  }
  const rawAuthority = rawValue.match(/^[a-z][a-z0-9+.-]*:\/\/([^\/?#]*)/i)?.[1] || '';
  if (rawAuthority.includes('@')) {
    throw new NetworkPolicyError('Source URLs must not contain credentials.', 'URL_CREDENTIALS', {
      url: rawValue,
    });
  }
  const rawPath = rawValue.match(/^[a-z][a-z0-9+.-]*:\/\/[^\/?#]*(\/[^?#]*)?/i)?.[1] || '';
  if (rawPath.includes('\\') || /(?:^|\/)(?:\.{1,2})(?:\/|$)/.test(rawPath) || /%(?:2e|5c)/i.test(rawPath)) {
    throw new NetworkPolicyError(`Source URL contains path traversal: ${rawValue}`, 'URL_PATH', {
      url: rawValue,
    });
  }
  let url;
  try {
    url = new URL(rawValue);
  } catch (error) {
    throw new NetworkPolicyError(`Source URL is malformed: ${value}`, 'URL_INVALID', { cause: error });
  }
  if (url.protocol !== 'https:') {
    throw new NetworkPolicyError(`Only HTTPS source URLs are allowed: ${url.href}`, 'URL_HTTPS', {
      url: url.href,
    });
  }
  if (url.username || url.password) {
    throw new NetworkPolicyError('Source URLs must not contain credentials.', 'URL_CREDENTIALS', {
      url: url.href,
    });
  }
  if (url.port) {
    throw new NetworkPolicyError(`Source URL uses a non-default port: ${url.href}`, 'URL_PORT', {
      url: url.href,
    });
  }
  const hostname = normalizeHostname(url.hostname);
  if (isIP(hostname) || isPrivateAddress(hostname) || hostname === 'localhost' ||
      hostname.endsWith('.localhost') || hostname.endsWith('.local')) {
    throw new NetworkPolicyError(`Private or local source URL is not allowed: ${url.href}`, 'URL_PRIVATE', {
      url: url.href,
    });
  }
  assertSafePath(url);

  if (PAGE_HOSTS.has(hostname)) {
    if (!/^\/us(?:\/|$)/i.test(url.pathname)) {
      throw new NetworkPolicyError(`Poe2DB page path is outside the allowlist: ${url.href}`, 'URL_ALLOWLIST', {
        url: url.href,
      });
    }
  } else if (hostname === CDN_HOST) {
    const isArtwork = /^\/image\/Art\/[A-Za-z0-9_./-]+\.webp$/.test(url.pathname) &&
      !url.pathname.split('/').includes('..');
    const isAutocomplete = /^\/json\/autocompletecb_us\.[0-9a-f]{16,64}\.json$/i.test(url.pathname) &&
      !url.search;
    if (!isArtwork && !isAutocomplete) {
      throw new NetworkPolicyError(`Poe2DB CDN path is outside the allowlist: ${url.href}`, 'URL_ALLOWLIST', {
        url: url.href,
      });
    }
  } else {
    throw new NetworkPolicyError(`Source host is outside the allowlist: ${url.hostname}`, 'URL_ALLOWLIST', {
      url: url.href,
    });
  }
  url.hash = '';
  return url;
}

export function shouldRetryStatus(status) {
  const code = Number(status);
  return code === 408 || code === 425 || code === 429 || (code >= 500 && code <= 599);
}

function asIntegerOption(value, fallback, label, minimum) {
  const result = value == null ? fallback : Number(value);
  if (!Number.isSafeInteger(result) || result < minimum) {
    throw new TypeError(`${label} must be ${minimum === 0 ? 'a non-negative' : 'a positive'} integer.`);
  }
  return result;
}

function headersFor(url, responseKind, userAgent) {
  let accept = 'text/html,application/json,text/plain;q=0.9,*/*;q=0.1';
  if (responseKind === 'bytes' && url.pathname.startsWith('/image/')) {
    accept = 'image/webp,image/png,*/*;q=0.1';
  } else if (url.pathname.startsWith('/json/')) {
    accept = 'application/json,text/plain;q=0.9,*/*;q=0.1';
  }
  return {
    Accept: accept,
    'Accept-Language': 'en-US,en;q=0.8',
    Referer: 'https://poe2db.tw/us/',
    'User-Agent': userAgent,
  };
}

function makeLimiter(minimumIntervalMs, now, sleep) {
  let tail = Promise.resolve();
  let lastStart = null;
  return async function acquire() {
    let release;
    const previous = tail;
    tail = new Promise(resolve => { release = resolve; });
    await previous;
    if (lastStart != null) {
      const remaining = lastStart + minimumIntervalMs - now();
      if (remaining > 0) await sleep(remaining);
    }
    lastStart = now();
    return { startedAt: lastStart, release };
  };
}

function responseHeaders(response) {
  if (response?.headers instanceof Headers) return response.headers;
  return new Headers(response?.headers || {});
}

async function cancelBody(body) {
  if (body && typeof body.cancel === 'function') {
    try {
      await body.cancel();
    } catch {
      // The redirect/error is already authoritative; cancellation is best effort.
    }
  }
}

async function readBoundedBody(response, maximumBytes, signal = null) {
  const headers = responseHeaders(response);
  const declared = headers.get('content-length');
  if (declared != null && declared !== '') {
    const length = Number(declared);
    if (!Number.isFinite(length) || length < 0) {
      throw new NetworkPolicyError('Response has an invalid Content-Length header.', 'BODY_LENGTH');
    }
    if (length > maximumBytes) {
      await cancelBody(response?.body);
      throw new NetworkPolicyError(`Response exceeds the ${maximumBytes} byte limit.`, 'BODY_LIMIT');
    }
  }

  const body = response?.body;
  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    const bytes = Buffer.from(body);
    if (bytes.length > maximumBytes) {
      throw new NetworkPolicyError(`Response exceeds the ${maximumBytes} byte limit.`, 'BODY_LIMIT');
    }
    return bytes;
  }
  if (body instanceof ArrayBuffer) {
    const bytes = Buffer.from(body);
    if (bytes.length > maximumBytes) {
      throw new NetworkPolicyError(`Response exceeds the ${maximumBytes} byte limit.`, 'BODY_LIMIT');
    }
    return bytes;
  }
  // Empty redirect/error responses are valid HTTP and must still be
  // classified by status (for example a body-less 503 must be retried).
  if (!body) return Buffer.alloc(0);

  const chunks = [];
  let total = 0;
  const append = value => {
    const bytes = Buffer.from(value);
    total += bytes.length;
    if (total > maximumBytes) {
      throw new NetworkPolicyError(`Response exceeds the ${maximumBytes} byte limit.`, 'BODY_LIMIT');
    }
    chunks.push(bytes);
  };

  if (typeof body.getReader === 'function') {
    const reader = body.getReader();
    try {
      for (;;) {
        let abortHandler;
        const readResult = reader.read();
        const result = signal
          ? await Promise.race([
            readResult,
            new Promise((_resolve, reject) => {
              abortHandler = () => {
                const error = new Error('The response body read was aborted.');
                error.name = 'AbortError';
                reject(error);
              };
              if (signal.aborted) abortHandler();
              else signal.addEventListener('abort', abortHandler, { once: true });
            }),
          ])
          : await readResult;
        if (signal && abortHandler) signal.removeEventListener('abort', abortHandler);
        const { done, value } = result;
        if (done) break;
        append(value);
      }
    } catch (error) {
      try {
        await reader.cancel(error);
      } catch {
        // Preserve the bounded-read error when the transport is already gone.
      }
      throw error;
    } finally {
      try {
        reader.releaseLock();
      } catch {
        // Some stream implementations release automatically after cancel.
      }
    }
  } else if (typeof body[Symbol.asyncIterator] === 'function') {
    for await (const value of body) append(value);
  } else {
    throw new NetworkPolicyError('Response body is not a readable byte stream.', 'BODY_STREAM');
  }
  return Buffer.concat(chunks, total);
}

function challengeDescription(text, headers, responseKind) {
  const contentType = headers.get('content-type') || '';
  if (responseKind === 'bytes' && /image\//i.test(contentType)) return null;
  const strongMarker = /captcha|cf-chl-|cloudflare ray|just a moment|access denied|attention required|verify (?:that )?you are human/i.test(text);
  if (!/html/i.test(contentType) && !/^\s*</.test(text) && !strongMarker) return null;
  if (/captcha/i.test(text)) return 'CAPTCHA challenge';
  if (/cf-chl-|cloudflare ray|just a moment/i.test(text)) return 'bot-protection challenge';
  if (/access denied|attention required|verify (?:that )?you are human/i.test(text)) {
    return 'access denial challenge';
  }
  return null;
}

const RETRYABLE_TRANSPORT_CODES = new Set([
  'ECONNRESET', 'ECONNREFUSED', 'ECONNABORTED', 'ETIMEDOUT', 'EAI_AGAIN',
  'ENETUNREACH', 'EHOSTUNREACH', 'ENOTFOUND', 'UND_ERR_CONNECT_TIMEOUT',
  'UND_ERR_SOCKET', 'UND_ERR_HEADERS_TIMEOUT', 'UND_ERR_BODY_TIMEOUT',
]);

function isRetryableTransportError(error) {
  if (!error) return false;
  if (error.name === 'AbortError' || RETRYABLE_TRANSPORT_CODES.has(error.code)) return true;
  if (error.cause && error.cause !== error && isRetryableTransportError(error.cause)) return true;
  if (error instanceof TypeError && /fetch|network|socket|connect|dns|undici/i.test(error.message || '')) {
    return true;
  }
  return false;
}

function attachContext(error, url, attempt) {
  if (error && typeof error === 'object') {
    if (error.url == null) error.url = url;
    if (error.attempt == null) error.attempt = attempt;
  }
  return error;
}

function isNonRetryable(error) {
  return error?.retryable === false || error instanceof NetworkPolicyError;
}

function contextualError(error, url, attempt) {
  if (error instanceof NetworkRequestError || error instanceof NetworkPolicyError) {
    return attachContext(error, url, attempt);
  }
  const message = error instanceof Error ? error.message : String(error);
  return new NetworkRequestError(
    `Poe2DB request failed on attempt ${attempt} for ${url}: ${message}`,
    'REQUEST_FAILED',
    { cause: error, url, attempt, retryable: isRetryableTransportError(error) },
  );
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Create one guarded client. The limiter is shared by every method call on the
 * instance, so concurrent resolver workers cannot bypass request pacing.
 */
export function createNetworkClient(options = {}) {
  if (!options || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Network client options must be an object.');
  }
  const minimumRequestIntervalMs = asIntegerOption(
    options.minimumRequestIntervalMs,
    DEFAULTS.minimumRequestIntervalMs,
    'minimum request interval',
    0,
  );
  const requestTimeoutMs = asIntegerOption(
    options.requestTimeoutMs,
    DEFAULTS.requestTimeoutMs,
    'request timeout',
    1,
  );
  const maximumResponseBytes = asIntegerOption(
    options.maximumResponseBytes,
    DEFAULTS.maximumResponseBytes,
    'maximum response bytes',
    1,
  );
  const maximumRedirects = asIntegerOption(
    options.maximumRedirects,
    DEFAULTS.maximumRedirects,
    'maximum redirects',
    0,
  );
  const maximumAttempts = asIntegerOption(
    options.maximumAttempts,
    DEFAULTS.maximumAttempts,
    'maximum attempts',
    1,
  );
  const backoffBaseMs = asIntegerOption(
    options.backoffBaseMs,
    DEFAULTS.backoffBaseMs,
    'backoff base',
    0,
  );
  const maximumBackoffMs = asIntegerOption(
    options.maximumBackoffMs,
    DEFAULTS.maximumBackoffMs,
    'maximum backoff',
    0,
  );
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const lookup = options.lookup || defaultLookup;
  const sleep = options.sleep || delay;
  const now = options.now || Date.now;
  const userAgent = options.userAgent || DEFAULT_USER_AGENT;
  for (const [label, fn] of [
    ['fetchImpl', fetchImpl], ['lookup', lookup], ['sleep', sleep], ['now', now],
  ]) {
    if (typeof fn !== 'function') throw new TypeError(`${label} must be a function.`);
  }
  if (typeof userAgent !== 'string' || !userAgent.trim()) {
    throw new TypeError('userAgent must be a non-empty string.');
  }

  const counters = {
    requests: 0,
    responses: 0,
    retries: 0,
    redirects: 0,
    bytes: 0,
    failures: 0,
    lastRequestAt: null,
  };
  const acquire = makeLimiter(minimumRequestIntervalMs, now, sleep);

  async function resolvePublicDns(url, attempt) {
    let timer;
    const timeout = new Promise((_resolve, reject) => {
      timer = setTimeout(() => reject(new NetworkRequestError(
        `DNS lookup timed out after ${requestTimeoutMs}ms for ${url.hostname}.`,
        'DNS_TIMEOUT',
        { url: url.href, attempt, retryable: true },
      )), requestTimeoutMs);
    });
    let answer;
    try {
      answer = await Promise.race([
        Promise.resolve(lookup(url.hostname, { all: true, verbatim: true })),
        timeout,
      ]);
    } catch (error) {
      if (error instanceof NetworkPolicyError || error instanceof NetworkRequestError) {
        throw attachContext(error, url.href, attempt);
      }
      throw contextualError(error, url.href, attempt);
    } finally {
      clearTimeout(timer);
    }
    const records = Array.isArray(answer) ? answer : answer ? [answer] : [];
    if (!records.length) {
      throw new NetworkRequestError(`DNS returned no addresses for ${url.hostname}.`, 'DNS_EMPTY', {
        url: url.href,
        attempt,
        retryable: true,
      });
    }
    for (const record of records) {
      const address = typeof record === 'string' ? record : record?.address;
      if (!address || !isIP(normalizeHostname(address))) {
        throw new NetworkPolicyError(`DNS returned an invalid address for ${url.hostname}.`, 'DNS_INVALID', {
          url: url.href,
          attempt,
        });
      }
      if (isPrivateAddress(address)) {
        throw new NetworkPolicyError(
          `Source host did not resolve exclusively to public addresses: ${url.hostname} (${address}).`,
          'DNS_PRIVATE',
          { url: url.href, attempt },
        );
      }
    }
  }

  async function fetchHop(url, responseKind, attempt) {
    await resolvePublicDns(url, attempt);
    const slot = await acquire();
    counters.lastRequestAt = slot.startedAt;
    const controller = new AbortController();
    let timedOut = false;
    let rejectTimeout;
    const timeoutPromise = new Promise((_resolve, reject) => {
      rejectTimeout = reject;
    });
    const timeoutError = () => new NetworkRequestError(
      `Poe2DB request timed out after ${requestTimeoutMs}ms on attempt ${attempt}: ${url.href}`,
      'REQUEST_TIMEOUT',
      { url: url.href, attempt, retryable: true },
    );
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
      rejectTimeout(timeoutError());
    }, requestTimeoutMs);
    try {
      let responsePromise;
      try {
        counters.requests += 1;
        responsePromise = Promise.resolve(fetchImpl(url, {
          method: 'GET',
          headers: headersFor(url, responseKind, userAgent),
          redirect: 'manual',
          signal: controller.signal,
        }));
      } finally {
        // Release only after fetch has been invoked. This prevents the next
        // concurrent worker from advancing a shared test/real clock before
        // the current request actually starts, while still allowing overlap.
        slot.release();
      }
      const response = await Promise.race([responsePromise, timeoutPromise]);
      if (timedOut) {
        throw timeoutError();
      }
      counters.responses += 1;
      if (!response || !Number.isInteger(Number(response.status))) {
        throw new NetworkRequestError(`Fetch returned an invalid response for ${url.href}.`, 'RESPONSE_INVALID', {
          url: url.href,
          attempt,
          retryable: false,
        });
      }
      if (REDIRECT_STATUSES.has(Number(response.status))) {
        await cancelBody(response.body);
        return { response, bytes: null };
      }
      let bytes;
      try {
        bytes = await Promise.race([
          readBoundedBody(response, maximumResponseBytes, controller.signal),
          timeoutPromise,
        ]);
      } catch (error) {
        // A transient HTTP status remains retryable even when an origin sends
        // a malformed/absent error body. A declared/streamed body-limit breach
        // is still a hard policy failure and must not be retried.
        if (Number(response.status) < 200 || Number(response.status) > 299) {
          if (!(error instanceof NetworkPolicyError && error.code === 'BODY_LIMIT')) {
            bytes = Buffer.alloc(0);
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      if (timedOut) {
        throw timeoutError();
      }
      counters.bytes += bytes.length;
      return { response, bytes };
    } catch (error) {
      if (timedOut && !(error instanceof NetworkPolicyError) &&
          !(error instanceof NetworkRequestError && error.retryable === false)) {
        throw new NetworkRequestError(
          `Poe2DB request timed out after ${requestTimeoutMs}ms on attempt ${attempt}: ${url.href}`,
          'REQUEST_TIMEOUT',
          { cause: error, url: url.href, attempt, retryable: true },
        );
      }
      if (error instanceof NetworkPolicyError || error instanceof NetworkRequestError) {
        throw attachContext(error, url.href, attempt);
      }
      throw contextualError(error, url.href, attempt);
    } finally {
      clearTimeout(timer);
    }
  }

  async function oneAttempt(initialUrl, responseKind, attempt) {
    let url = assertAllowedSourceUrl(initialUrl);
    let redirects = 0;
    for (;;) {
      const { response, bytes } = await fetchHop(url, responseKind, attempt);
      const status = Number(response.status);
      if (!REDIRECT_STATUSES.has(status)) {
        return { response, bytes, url };
      }
      if (redirects >= maximumRedirects) {
        throw new NetworkPolicyError(
          `Poe2DB request exceeded the ${maximumRedirects} redirect limit: ${initialUrl}`,
          'REDIRECT_LIMIT',
          { url: url.href, attempt },
        );
      }
      const location = responseHeaders(response).get('location');
      if (!location) {
        throw new NetworkPolicyError(`Redirect ${status} omitted Location: ${url.href}`, 'REDIRECT_LOCATION', {
          url: url.href,
          attempt,
        });
      }
      let next;
      try {
        next = new URL(location, url);
      } catch (error) {
        throw new NetworkPolicyError(`Redirect Location is malformed: ${location}`, 'REDIRECT_LOCATION', {
          cause: error,
          url: url.href,
          attempt,
        });
      }
      try {
        url = assertAllowedSourceUrl(next);
      } catch (error) {
        throw attachContext(error, next.href, attempt);
      }
      redirects += 1;
      counters.redirects += 1;
    }
  }

  async function request(initialUrl, responseKind) {
    const approved = assertAllowedSourceUrl(initialUrl);
    let lastError;
    for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
      try {
        const result = await oneAttempt(approved, responseKind, attempt);
        const status = Number(result.response.status);
        const headers = responseHeaders(result.response);
        const text = Buffer.from(result.bytes).toString('utf8');
        const challenge = challengeDescription(text, headers, responseKind);
        if (challenge) {
          throw new NetworkPolicyError(
            `Poe2DB ${challenge} detected at ${result.url.href}; stopping without bypass.`,
            'ACCESS_CHALLENGE',
            { url: result.url.href, attempt },
          );
        }
        if (status < 200 || status > 299) {
          const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 160);
          const retryable = shouldRetryStatus(status);
          const error = new NetworkRequestError(
            `Poe2DB returned HTTP ${status} on attempt ${attempt} for ${result.url.href}` +
              (snippet ? `: ${snippet}` : ''),
            'HTTP_STATUS',
            { status, url: result.url.href, attempt, retryable },
          );
          if (!retryable || attempt === maximumAttempts) throw error;
          lastError = error;
        } else {
          return {
            url: result.url.href,
            status,
            headers,
            body: responseKind === 'text' ? text : Buffer.from(result.bytes),
          };
        }
      } catch (error) {
        if (isNonRetryable(error)) {
          counters.failures += 1;
          throw error;
        }
        lastError = contextualError(error, approved.href, attempt);
        if (attempt === maximumAttempts || lastError.retryable === false) {
          counters.failures += 1;
          throw lastError;
        }
      }
      counters.retries += 1;
      const backoff = Math.min(maximumBackoffMs, backoffBaseMs * (2 ** (attempt - 1)));
      if (backoff > 0) await sleep(backoff);
    }
    counters.failures += 1;
    throw lastError || new NetworkRequestError(`Poe2DB request failed: ${approved.href}`);
  }

  return Object.freeze({
    getText(url) {
      return request(url, 'text');
    },
    getBytes(url) {
      return request(url, 'bytes');
    },
    stats() {
      return Object.freeze({
        ...counters,
        requestCount: counters.requests,
        byteCount: counters.bytes,
      });
    },
  });
}
