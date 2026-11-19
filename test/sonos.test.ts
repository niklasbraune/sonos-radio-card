import assert from "node:assert/strict";
import { test } from "node:test";
import {
  collectNotices,
  findActiveStationIndex,
  formatGroupName,
  planGroupVolume,
  planSpeakerRemoval,
  resolveCoordinator,
  stationIssue,
} from "../src/sonos.ts";
import { createTranslator } from "../src/localize.ts";
import type {
  HassEntity,
  HomeAssistant,
  SonosRadioCardConfig,
  SonosStationConfig,
} from "../src/types.ts";

const t = createTranslator("en");

const entity = (
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({ entity_id, state, attributes });

const hassWith = (...entities: HassEntity[]): HomeAssistant =>
  ({
    states: Object.fromEntries(entities.map((e) => [e.entity_id, e])),
  }) as HomeAssistant;

const config = (
  overrides: Partial<SonosRadioCardConfig> = {},
): SonosRadioCardConfig => ({
  type: "custom:sonos-radio-card",
  speakers: [
    { entity: "media_player.kitchen" },
    { entity: "media_player.living" },
  ],
  stations: [],
  ...overrides,
});

const stations: SonosStationConfig[] = [
  {
    name: "Example FM",
    media_content_id: "https://stream.example.com/fm/",
    media_content_type: "music",
  },
  {
    name: "Favorite Radio",
    media_content_id: "FV:2/7",
    media_content_type: "favorite_item_id",
  },
];

test("resolves a configured master to its group coordinator", () => {
  const hass = hassWith(
    entity("media_player.kitchen", "playing", {
      group_members: ["media_player.living", "media_player.kitchen"],
    }),
  );

  assert.equal(
    resolveCoordinator(hass, config({ master_entity: "media_player.kitchen" })),
    "media_player.living",
  );
});

test("prefers a playing group coordinator during auto-detection", () => {
  const hass = hassWith(
    entity("media_player.kitchen", "paused"),
    entity("media_player.living", "playing", {
      group_members: ["media_player.living"],
    }),
  );

  assert.equal(resolveCoordinator(hass, config()), "media_player.living");
});

test("matches stations by rewritten Sonos stream URLs", () => {
  const coordinator = entity("media_player.living", "playing", {
    media_content_id: "x-rincon-mp3radio://stream.example.com/fm",
  });

  assert.equal(findActiveStationIndex(stations, coordinator), 0);
});

test("falls back to matching the station name against media_channel", () => {
  const coordinator = entity("media_player.living", "paused", {
    media_content_id: "x-sonosapi-stream:s1234",
    media_channel: "favorite radio",
  });

  assert.equal(findActiveStationIndex(stations, coordinator), 1);
});

test("does not highlight a station while the group is idle", () => {
  const coordinator = entity("media_player.living", "idle", {
    media_channel: "Example FM",
  });

  assert.equal(findActiveStationIndex(stations, coordinator), -1);
});

test("shifts group volume while keeping per-room differences", () => {
  const hass = hassWith(
    entity("media_player.living", "playing", { volume_level: 0.2 }),
    entity("media_player.kitchen", "playing", { volume_level: 0.4 }),
  );

  assert.deepEqual(
    planGroupVolume(hass, ["media_player.living", "media_player.kitchen"], 0.5),
    [
      { entity_id: "media_player.living", volume_level: 0.4 },
      { entity_id: "media_player.kitchen", volume_level: 0.6 },
    ],
  );
});

test("mutes every group member at zero volume", () => {
  const hass = hassWith(
    entity("media_player.living", "playing", { volume_level: 0.2 }),
    entity("media_player.kitchen", "playing", { volume_level: 0.6 }),
  );

  assert.deepEqual(
    planGroupVolume(hass, ["media_player.living", "media_player.kitchen"], 0),
    [
      { entity_id: "media_player.living", volume_level: 0 },
      { entity_id: "media_player.kitchen", volume_level: 0 },
    ],
  );
});

test("formatGroupName joins room names naturally", () => {
  assert.equal(formatGroupName([]), "");
  assert.equal(formatGroupName(["Kitchen"]), "Kitchen");
  assert.equal(formatGroupName(["Living", "Kitchen"]), "Living & Kitchen");
  assert.equal(
    formatGroupName(["Living", "Kitchen", "Bath"]),
    "Living, Kitchen & Bath",
  );
});

const group = ["media_player.living", "media_player.kitchen", "media_player.bath"];
const groupedHass = (bathState = "playing") =>
  hassWith(
    entity("media_player.living", "playing", { group_members: group }),
    entity("media_player.kitchen", "unavailable", { group_members: group }),
    entity("media_player.bath", bathState, { group_members: group }),
  );

test("planSpeakerRemoval blocks removing the only room", () => {
  const hass = hassWith(entity("media_player.living", "playing"));
  assert.deepEqual(planSpeakerRemoval(hass, "media_player.living"), {
    type: "blocked",
    entity: "media_player.living",
  });
});

test("planSpeakerRemoval unjoins a non-coordinator member", () => {
  assert.deepEqual(planSpeakerRemoval(groupedHass(), "media_player.bath"), {
    type: "unjoin",
    entity: "media_player.bath",
  });
});

test("planSpeakerRemoval hands the group to an available member", () => {
  const plan = planSpeakerRemoval(groupedHass(), "media_player.living", [
    "media_player.kitchen",
    "media_player.bath",
  ]);
  assert.deepEqual(plan, {
    type: "handoff",
    entity: "media_player.living",
    newMaster: "media_player.bath",
    remaining: ["media_player.kitchen", "media_player.bath"],
  });
});

test("resolveCoordinator honours a preferred speaker override", () => {
  const hass = hassWith(
    entity("media_player.kitchen", "idle"),
    entity("media_player.living", "playing"),
  );
  assert.equal(
    resolveCoordinator(hass, config(), "media_player.kitchen"),
    "media_player.kitchen",
  );
});

test("resolveCoordinator skips an unavailable master_entity", () => {
  const hass = hassWith(
    entity("media_player.kitchen", "idle"),
    entity("media_player.living", "unavailable"),
  );
  assert.equal(
    resolveCoordinator(hass, config({ master_entity: "media_player.living" })),
    "media_player.kitchen",
  );
});

test("stationIssue flags missing and malformed stream IDs", () => {
  const station = (media_content_id: string, media_content_type = "music") => ({
    name: "Test",
    media_content_id,
    media_content_type,
  });
  assert.equal(stationIssue(station("https://stream.example.com/a.mp3"), t), undefined);
  assert.equal(stationIssue(station("x-rincon-mp3radio://example.com/a"), t), undefined);
  assert.equal(stationIssue(station('plex://{ "library_name": "Music" }'), t), undefined);
  assert.equal(stationIssue(station("FV:2/12", "favorite_item_id"), t), undefined);
  assert.match(stationIssue(station(""), t)!, /No stream URL/);
  assert.match(stationIssue(station("stream.example.com/a"), t)!, /http/);
  assert.match(stationIssue(station("https://example.com/a b"), t)!, /spaces/);
  assert.match(
    stationIssue(station("https://example.com/a", "favorite_item_id"), t)!,
    /looks like a URL/,
  );
});

test("collectNotices explains configuration and availability problems", () => {
  const name = (id: string) => id;
  const empty = config({ speakers: [] });
  assert.equal(collectNotices(hassWith(), empty, undefined, name, t)[0].level, "error");

  const missing = collectNotices(
    hassWith(entity("media_player.kitchen", "idle")),
    config(),
    "media_player.kitchen",
    name,
    t,
  );
  assert.deepEqual(
    missing.map((notice) => notice.level),
    ["warning"],
  );
  assert.match(missing[0].message, /media_player\.living was not found/);

  const down = collectNotices(
    hassWith(
      entity("media_player.kitchen", "unavailable"),
      entity("media_player.living", "unavailable"),
    ),
    config(),
    "media_player.kitchen",
    name,
    t,
  );
  assert.match(down[0].message, /All Sonos speakers are unavailable/);

  const fallback = collectNotices(
    hassWith(
      entity("media_player.kitchen", "idle"),
      entity("media_player.living", "unavailable"),
    ),
    config({ master_entity: "media_player.living" }),
    "media_player.kitchen",
    name,
    t,
  );
  assert.deepEqual(fallback.map((notice) => notice.level), ["info"]);
});

test("createTranslator localizes with English fallback", () => {
  const german = createTranslator("de-AT");
  assert.equal(german("card.stop"), "Stopp");
  assert.equal(german("card.sonos_group", { name: "K?che" }), "Sonos-Gruppe: K?che");
  assert.equal(createTranslator("fr")("card.stop"), "Stop");
  assert.match(stationIssue({ name: "A", media_content_id: "", media_content_type: "music" }, german)!, /Keine Stream-URL/);
});
