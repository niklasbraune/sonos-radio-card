import type { SonosStationConfig } from "./types.js";

/** A daily time window in which playback starts at a fixed volume. */
export interface QuietPeriod {
  /** Local time "HH:MM". */
  start: string;
  /** Local time "HH:MM". Earlier than `start` means the window spans midnight. */
  end: string;
  /** Start volume in percent (0-100). */
  volume: number;
}

export interface CardSettings {
  /** Upper volume limit in percent (1-100). */
  max_volume: number;
  quiet_hours: QuietPeriod[];
  /** Shuffle Sonos favorite playlists (for example Spotify) when starting them. */
  shuffle_playlists: boolean;
}

export const SETTINGS_KEY = "sonos-radio-card";

export const DEFAULT_SETTINGS: CardSettings = {
  max_volume: 100,
  quiet_hours: [],
  shuffle_playlists: false,
};

export const DEFAULT_QUIET_PERIOD: QuietPeriod = {
  start: "22:00",
  end: "07:00",
  volume: 15,
};

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const percent = (value: unknown, min: number, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.min(100, Math.max(min, Math.round(value)))
    : fallback;

const time = (value: unknown, fallback: string): string =>
  typeof value === "string" && TIME_PATTERN.test(value) ? value : fallback;

/** Turns stored (possibly outdated or hand-edited) data into valid settings. */
export const normalizeSettings = (raw: unknown): CardSettings => {
  const data =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const periods = Array.isArray(data.quiet_hours) ? data.quiet_hours : [];
  return {
    max_volume: percent(data.max_volume, 1, DEFAULT_SETTINGS.max_volume),
    quiet_hours: periods
      .filter((item): item is Record<string, unknown> =>
        Boolean(item && typeof item === "object"),
      )
      .map((item) => ({
        start: time(item.start, DEFAULT_QUIET_PERIOD.start),
        end: time(item.end, DEFAULT_QUIET_PERIOD.end),
        volume: percent(item.volume, 0, DEFAULT_QUIET_PERIOD.volume),
      })),
    shuffle_playlists: data.shuffle_playlists === true,
  };
};

const minutesOf = (value: string): number => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Equal start and end times cover the whole day. */
export const isInPeriod = (period: QuietPeriod, now: Date): boolean => {
  const start = minutesOf(period.start);
  const end = minutesOf(period.end);
  const current = now.getHours() * 60 + now.getMinutes();
  if (start === end) {
    return true;
  }
  return start < end
    ? current >= start && current < end
    : current >= start || current < end;
};

/** The quietest active period wins when windows overlap. */
export const activeQuietPeriod = (
  settings: CardSettings,
  now: Date,
): QuietPeriod | undefined =>
  settings.quiet_hours
    .filter((period) => isInPeriod(period, now))
    .sort((a, b) => a.volume - b.volume)[0];

export const maxLevel = (settings: CardSettings): number =>
  settings.max_volume / 100;

export const capLevel = (level: number, settings: CardSettings): number =>
  Math.min(level, maxLevel(settings));

/**
 * Volume (0-1) a speaker should be set to before playback starts, or
 * `undefined` to leave it alone. Quiet hours only apply when playback starts;
 * the maximum volume always applies.
 */
export const startLevel = (
  current: number | undefined,
  settings: CardSettings,
  now: Date,
  starting: boolean,
): number | undefined => {
  const quiet = starting ? activeQuietPeriod(settings, now) : undefined;
  const target =
    quiet !== undefined
      ? capLevel(quiet.volume / 100, settings)
      : current !== undefined && current > maxLevel(settings)
        ? maxLevel(settings)
        : undefined;
  return target !== undefined &&
    (current === undefined || Math.abs(current - target) >= 0.005)
    ? target
    : undefined;
};

/**
 * Stations that may start a queue (Sonos favorites, playlists, Spotify URIs).
 * Radio streams cannot be shuffled.
 */
export const isShuffleCandidate = (station: SonosStationConfig): boolean => {
  const type = (station.media_content_type || "").toLowerCase();
  const id = station.media_content_id.trim().toLowerCase();
  return (
    type === "favorite_item_id" ||
    type === "playlist" ||
    id.startsWith("spotify:") ||
    id.startsWith("https://open.spotify.com/")
  );
};
