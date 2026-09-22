const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const context = vm.createContext({});
vm.runInContext(
  fs.readFileSync(path.join(__dirname, '../data/release-schedule.js'), 'utf8'),
  context
);
const releases = context.WPRelease;
const pages = ['7-0', '7-1', '7-1-2', '7-2', '8-0', 'roadmap'].map(slug => ({ slug }));

test('regression: follows the next announced major instead of the saved 7.0 target', () => {
  assert.equal(releases.nextMajor('7.1.1', pages), '7.2');
});

test('discovers 8.0 without inventing 7.3 or selecting maintenance releases', () => {
  assert.equal(releases.nextMajor('7.2.4', pages), '8.0');
  assert.equal(releases.nextMajor('8.0', pages), null);
  assert.equal(releases.nextMajor('7.1.1', [{ slug: '7-1-2' }]), null);
  assert.equal(releases.nextMajor('7.9', [{ slug: '8-0' }, { slug: '7-10' }]), '7.10');
});

test('rejects invalid stable version responses', () => {
  assert.throws(() => releases.nextMajor('7.2-beta1', pages));
});

test('preserves official date ranges and rejects approximate or impossible dates', () => {
  const range = releases.parseDateRange('20–22 October 2026');
  assert.equal(range.start, '2026-10-20');
  assert.equal(range.end, '2026-10-22');
  assert.equal(releases.parseDateRange('December 10, 2026').start, '2026-12-10');
  assert.equal(releases.parseDateRange('~August 2026'), null);
  assert.equal(releases.parseDateRange('31 February 2026'), null);
  assert.equal(releases.parseDateRange('22-20 October 2026'), null);
});

test('keeps a milestone current throughout its range, without claiming publication', () => {
  const milestones = [{ name: 'Beta 1', start: '2026-10-20', end: '2026-10-22' }];
  assert.equal(releases.nextMilestone(milestones, '2026-10-21').name, 'Beta 1');
  assert.equal(releases.nextMilestone(milestones, '2026-10-23'), null);
});

test('counts calendar days across daylight-saving changes', () => {
  assert.equal(releases.daysUntil('2026-10-26', '2026-10-24'), 2);
});

function workerHarness(initialCache, handler) {
  const storage = initialCache ? { wpReleaseCacheV1: initialCache } : {};
  const requests = [];
  let listener;
  const worker = vm.createContext({
    WPRelease: releases,
    importScripts() {},
    AbortSignal,
    chrome: {
      runtime: {
        id: 'test-extension',
        onMessage: {
          addListener(fn) {
            listener = fn;
          }
        }
      },
      storage: {
        local: {
          async get() {
            return storage;
          },
          async set(value) {
            Object.assign(storage, value);
          }
        }
      }
    },
    async fetch(url, options) {
      requests.push(url);
      assert.equal(options.credentials, 'omit');
      const value = await handler(url);
      return { ok: true, json: async () => value, headers: { get: () => '1' } };
    }
  });
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, '../background/releases.js'), 'utf8'),
    worker
  );
  return { worker, requests, storage, listener };
}

const oldResult = { version: '7.2', checkedAt: 1, html: '<table>old</table>', status: 'available' };
const oldCache = { attemptedAt: 1, result: oldResult };
function source(url) {
  if (url.includes('version-check')) return { offers: [{ response: 'upgrade', current: '7.1.1' }] };
  if (url.includes('slug=7-2'))
    return [{ slug: '7-2', content: { rendered: '<table>updated</table>' } }];
  return pages;
}

test('fetches the announced major and refreshes its changed calendar', async () => {
  const h = workerHarness(oldCache, source);
  const result = await h.worker.getRelease();
  assert.equal(result.version, '7.2');
  assert.equal(result.html, '<table>updated</table>');
  assert.equal(result.stale, false);
  assert.equal(h.requests.length, 3);
});

test('uses a fresh cache and allows an explicit refresh', async () => {
  const h = workerHarness({ attemptedAt: Date.now(), result: oldResult }, source);
  await h.worker.getRelease();
  assert.equal(h.requests.length, 0);
  await h.worker.getRelease(true);
  assert.equal(h.requests.length, 3);
});

test('retains last verified data offline and throttles retries', async () => {
  const h = workerHarness(oldCache, () => {
    throw new Error('offline');
  });
  const result = await h.worker.getRelease();
  assert.equal(result.version, '7.2');
  assert.equal(result.checkedAt, 1);
  assert.equal(result.stale, true);
  await h.worker.getRelease();
  assert.equal(h.requests.length, 1);
});

test('never reuses a released cycle when discovering the new cycle fails', async () => {
  const h = workerHarness(oldCache, url => {
    if (url.includes('version-check'))
      return { offers: [{ response: 'upgrade', current: '7.2.1' }] };
    throw new Error('offline');
  });
  const result = await h.worker.getRelease();
  assert.equal(result.version, null);
  assert.equal(result.status, 'unavailable');
});

test('keeps the discovered version when its calendar cannot be fetched', async () => {
  const h = workerHarness(null, url => {
    if (url.includes('slug=')) throw new Error('offline');
    return source(url);
  });
  const result = await h.worker.getRelease();
  assert.equal(result.version, '7.2');
  assert.equal(result.status, 'calendar-unavailable');
  assert.equal(result.html, null);
});

test('shows no announced next major instead of inventing one', async () => {
  const h = workerHarness(oldCache, url =>
    url.includes('version-check') ? { offers: [{ response: 'upgrade', current: '8.0' }] } : pages
  );
  const result = await h.worker.getRelease();
  assert.equal(result.version, null);
  assert.equal(result.status, 'unannounced');
});

test('deduplicates simultaneous requests from multiple tickets', async () => {
  const h = workerHarness(null, source);
  const [a, b] = await Promise.all([h.worker.getRelease(), h.worker.getRelease()]);
  assert.equal(a, b);
  assert.equal(h.requests.length, 3);
});

test('ignores messages from other extensions', () => {
  const h = workerHarness(null, source);
  assert.equal(
    h.listener({ type: 'get-next-major-release' }, { id: 'other' }, () => assert.fail()),
    undefined
  );
  assert.equal(h.requests.length, 0);
});
