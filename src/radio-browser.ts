export interface RadioBrowserResult {
  id: string;
  name: string;
  url: string;
  favicon?: string;
  codec?: string;
  bitrate?: number;
  country?: string;
}

// radio-browser.info asks clients to use its DNS-balanced mirrors; the "all"
// host lists the currently active ones.
const MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://all.api.radio-browser.info",
];
const REQUEST_TIMEOUT_MS = 8000;

const httpUrl = (value: unknown): string | undefined =>
  typeof value === "string" && /^https?:\/\//i.test(value.trim())
    ? value.trim()
    : undefined;

/** Maps a raw Radio Browser station to a result, or drops unusable entries. */
export const toRadioBrowserResult = (
  raw: unknown,
): RadioBrowserResult | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined;
  }
  const item = raw as Record<string, unknown>;
  const url = httpUrl(item.url_resolved) ?? httpUrl(item.url);
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!url || !name) {
    return undefined;
  }
  return {
    id: typeof item.stationuuid === "string" ? item.stationuuid : url,
    name,
    url,
    favicon: httpUrl(item.favicon),
    codec:
      typeof item.codec === "string" && item.codec.length > 0
        ? item.codec
        : undefined,
    bitrate:
      typeof item.bitrate === "number" && item.bitrate > 0
        ? item.bitrate
        : undefined,
    country:
      typeof item.countrycode === "string" && item.countrycode.length > 0
        ? item.countrycode
        : undefined,
  };
};

/** Searches radio-browser.info by station name, most popular first. */
export const searchRadioBrowser = async (
  query: string,
  fetchFn: typeof fetch = (input, init) => fetch(input, init),
  limit = 12,
): Promise<RadioBrowserResult[]> => {
  const params = new URLSearchParams({
    name: query.trim(),
    limit: String(limit),
    hidebroken: "true",
    order: "clickcount",
    reverse: "true",
  });

  let lastError: unknown;
  for (const mirror of MIRRORS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetchFn(
        `${mirror}/json/stations/search?${params.toString()}`,
        { signal: controller.signal },
      );
      if (!response.ok) {
        throw new Error(`Radio Browser responded with ${response.status}`);
      }
      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Unexpected Radio Browser response");
      }
      const seen = new Set<string>();
      return data
        .map(toRadioBrowserResult)
        .filter((item): item is RadioBrowserResult => {
          if (!item || seen.has(item.url)) {
            return false;
          }
          seen.add(item.url);
          return true;
        });
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Radio Browser is not reachable");
};
