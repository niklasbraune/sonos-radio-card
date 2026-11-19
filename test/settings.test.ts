import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_SETTINGS,
  activeQuietPeriod,
  isInPeriod,
  isShuffleCandidate,
  normalizeSettings,
  startLevel,
} from "../src/settings.ts";
import type { CardSettings } from "../src/settings.ts";

const at = (time: string): Date => new Date(`2026-01-15T${time}:00`);

const settings = (overrides: Partial<CardSettings> = {}): CardSettings => ({
  ...DEFAULT_SETTINGS,
  ...overrides,
});

test("normalizes stored settings and drops invalid values", () => {
  assert.deepEqual(normalizeSettings(undefined), DEFAULT_SETTINGS);
  assert.deepEqual(
    normalizeSettings({
      max_volume: 250,
      quiet_hours: [{ start: "25:00", end: "06:30", volume: -5 }, null],
      shuffle_playlists: "yes",
    }),
    {
      max_volume: 100,
      quiet_hours: [{ start: "22:00", end: "06:30", volume: 0 }],
      shuffle_playlists: false,
    },
  );
});

test("handles quiet periods across midnight and whole days", () => {
  const night = { start: "22:00", end: "07:00", volume: 10 };
  assert.equal(isInPeriod(night, at("23:30")), true);
  assert.equal(isInPeriod(night, at("06:59")), true);
  assert.equal(isInPeriod(night, at("07:00")), false);
  assert.equal(isInPeriod(night, at("12:00")), false);
  assert.equal(isInPeriod({ start: "13:00", end: "15:00", volume: 5 }, at("14:00")), true);
  assert.equal(isInPeriod({ start: "00:00", end: "00:00", volume: 5 }, at("09:00")), true);

  const overlapping = settings({
    quiet_hours: [night, { start: "23:00", end: "01:00", volume: 5 }],
  });
  assert.equal(activeQuietPeriod(overlapping, at("23:30"))?.volume, 5);
});

test("computes start volumes from quiet hours and the maximum", () => {
  const night = settings({
    max_volume: 60,
    quiet_hours: [{ start: "22:00", end: "07:00", volume: 80 }],
  });
  // Quiet volume is capped by the maximum volume.
  assert.equal(startLevel(0.3, night, at("23:00"), true), 0.6);
  // Quiet hours only apply when playback starts.
  assert.equal(startLevel(0.3, night, at("23:00"), false), undefined);
  // Outside quiet hours only louder speakers are turned down.
  assert.equal(startLevel(0.9, night, at("12:00"), true), 0.6);
  assert.equal(startLevel(0.4, night, at("12:00"), true), undefined);
  assert.equal(
    startLevel(0.2, settings({ quiet_hours: [{ start: "00:00", end: "00:00", volume: 20 }] }), at("12:00"), true),
    undefined,
  );
});

test("only shuffles queue-based favorites and playlists", () => {
  const station = (media_content_id: string, media_content_type: string) => ({
    name: "Test",
    media_content_id,
    media_content_type,
  });
  assert.equal(isShuffleCandidate(station("FV:2/7", "favorite_item_id")), true);
  assert.equal(isShuffleCandidate(station("spotify:playlist:abc", "music")), true);
  assert.equal(isShuffleCandidate(station("https://stream.example.com/fm.mp3", "music")), false);
});
