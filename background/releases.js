/* global importScripts, WPRelease */
importScripts('../data/release-schedule.js');

const RELEASE_CACHE_KEY = 'wpReleaseCacheV1';
const RELEASE_TTL = 24 * 60 * 60 * 1000;
const RELEASE_RETRY = 5 * 60 * 1000;
const PAGES_API = 'https://make.wordpress.org/core/wp-json/wp/v2/pages';
let pendingRelease;

async function fetchReleaseJson(url) {
  const response = await fetch(url, {
    credentials: 'omit',
    cache: 'no-cache',
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('Release source unavailable');
  return { data: await response.json(), headers: response.headers };
}

async function discoverReleasePages() {
  const pages = [];
  let total = 1;
  for (let page = 1; page <= total; page++) {
    const response = await fetchReleaseJson(`${PAGES_API}?per_page=100&page=${page}&_fields=slug`);
    if (!Array.isArray(response.data)) throw new Error('Invalid release pages');
    pages.push(...response.data);
    total = Number(response.headers.get('X-WP-TotalPages') || 1);
    if (!Number.isInteger(total) || total < 1 || total > 20)
      throw new Error('Unexpected page count');
  }
  return pages;
}

async function loadRelease(force) {
  const stored = await chrome.storage.local.get(RELEASE_CACHE_KEY);
  const cached = stored[RELEASE_CACHE_KEY];
  const now = Date.now();
  if (
    !force &&
    cached &&
    now - cached.attemptedAt < (cached.result.stale ? RELEASE_RETRY : RELEASE_TTL)
  ) {
    return cached.result;
  }
  let fallback = cached?.result;
  try {
    const { data } = await fetchReleaseJson('https://api.wordpress.org/core/version-check/1.7/');
    const stable = data.offers?.find(offer => offer.response === 'upgrade')?.current;
    // Validate before using this version to invalidate cached data.
    WPRelease.nextMajor(stable, []);
    if (fallback?.version && WPRelease.compare(fallback.version, stable) <= 0) fallback = null;
    const pages = await discoverReleasePages();
    const version = WPRelease.nextMajor(stable, pages);
    let result = {
      version,
      checkedAt: now,
      stale: false,
      html: null,
      url: 'https://make.wordpress.org/core/',
      status: 'unannounced'
    };
    if (version) {
      const slug = version.replace('.', '-');
      result = {
        ...result,
        url: `https://make.wordpress.org/core/${slug}/`,
        status: 'calendar-unavailable'
      };
      // Never fall back to the previous cycle after discovering a different one.
      fallback = fallback?.version === version ? fallback : result;
      const { data: entries } = await fetchReleaseJson(
        `${PAGES_API}?slug=${slug}&_fields=slug,content`
      );
      const html = entries.find(entry => entry.slug === slug)?.content?.rendered;
      if (typeof html !== 'string' || !html.length || html.length > 500000) {
        throw new Error('Calendar content unavailable');
      }
      result = { ...result, status: 'available', html };
    }
    await chrome.storage.local.set({ [RELEASE_CACHE_KEY]: { attemptedAt: now, result } });
    return result;
  } catch (_error) {
    const result = {
      ...(fallback || {
        version: null,
        html: null,
        checkedAt: null,
        url: 'https://make.wordpress.org/core/',
        status: 'unavailable'
      }),
      stale: true
    };
    await chrome.storage.local.set({ [RELEASE_CACHE_KEY]: { attemptedAt: now, result } });
    return result;
  }
}

function getRelease(force = false) {
  if (!pendingRelease) {
    pendingRelease = loadRelease(force).finally(() => {
      pendingRelease = null;
    });
  }
  return pendingRelease;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'get-next-major-release' || sender.id !== chrome.runtime.id) return;
  getRelease(message.force === true)
    .then(sendResponse)
    .catch(() => sendResponse({ status: 'unavailable', stale: true }));
  return true;
});
