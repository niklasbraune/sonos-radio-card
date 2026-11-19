import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSonosFavorites } from "../src/media.ts";
import { searchRadioBrowser, toRadioBrowserResult } from "../src/radio-browser.ts";
import type { HassEntity, HomeAssistant } from "../src/types.ts";

const response = (body: unknown, ok = true) =>
  ({ ok, status: ok ? 200 : 503, json: () => Promise.resolve(body) }) as Response;

test("toRadioBrowserResult prefers the resolved stream and drops unusable entries", () => {
  assert.deepEqual(
    toRadioBrowserResult({
      stationuuid: "uuid-1",
      name: " Example FM ",
      url: "https://stream.example.com/playlist.m3u",
      url_resolved: "https://stream.example.com/live.mp3",
      favicon: "",
      codec: "MP3",
      bitrate: 128,
      countrycode: "DE",
    }),
    {
      id: "uuid-1",
      name: "Example FM",
      url: "https://stream.example.com/live.mp3",
      favicon: undefined,
      codec: "MP3",
      bitrate: 128,
      country: "DE",
    },
  );
  assert.equal(toRadioBrowserResult({ name: "No URL", url: "ftp://x" }), undefined);
  assert.equal(toRadioBrowserResult({ url: "https://stream.example.com/a" }), undefined);
});

test("searchRadioBrowser falls back to the next mirror and removes duplicates", async () => {
  const requested: string[] = [];
  const fetchFn = (input: RequestInfo | URL) => {
    const url = input instanceof URL ? input.href : input instanceof Request ? input.url : input;
    requested.push(url);
    if (requested.length === 1) {
      return Promise.reject(new Error("offline"));
    }
    const station = { name: "Example", url_resolved: "https://stream.example.com/a.mp3" };
    return Promise.resolve(response([station, station]));
  };

  const results = await searchRadioBrowser("jazz radio", fetchFn);
  assert.equal(results.length, 1);
  assert.equal(requested.length, 2);
  assert.match(requested[1], /name=jazz\+radio/);
  assert.match(requested[1], /hidebroken=true/);
});

const hassWith = (
  states: Record<string, HassEntity>,
  callWS: (message: Record<string, unknown>) => Promise<unknown>,
) =>
  ({
    states,
    callWS,
    callService: () => Promise.resolve(),
    hassUrl: (path = "") => path,
  }) as unknown as HomeAssistant;

const speaker: HassEntity = {
  entity_id: "media_player.kitchen",
  state: "idle",
  attributes: {},
};

test("loadSonosFavorites reads favorites folders from the media browser", async () => {
  const messages: Record<string, unknown>[] = [];
  const hass = hassWith({ [speaker.entity_id]: speaker }, (message) => {
    messages.push(message);
    if (message.media_content_type === "favorites") {
      return Promise.resolve({
        children: [
          {
            title: "Radio",
            media_content_id: "object.item.audioItem.audioBroadcast",
            media_content_type: "favorites_folder",
            can_expand: true,
            can_play: false,
          },
        ],
      });
    }
    return Promise.resolve({
      children: [
        {
          title: "Example FM",
          media_content_id: "FV:2/12",
          media_content_type: "favorite_item_id",
          can_expand: false,
          can_play: true,
          thumbnail: "https://images.example.com/fm.png",
        },
        {
          title: "Proxied",
          media_content_id: "FV:2/13",
          media_content_type: "favorite_item_id",
          can_expand: false,
          can_play: true,
          thumbnail: "/api/media_player_proxy/x",
        },
      ],
    });
  });

  assert.deepEqual(
    await loadSonosFavorites(hass, ["media_player.missing", speaker.entity_id]),
    [
      { id: "FV:2/12", title: "Example FM", thumbnail: "https://images.example.com/fm.png" },
      { id: "FV:2/13", title: "Proxied", thumbnail: undefined },
    ],
  );
  assert.equal(messages.length, 2);
  assert.equal(messages[0].entity_id, speaker.entity_id);
});

test("loadSonosFavorites falls back to the favorites sensor", async () => {
  const hass = hassWith(
    {
      [speaker.entity_id]: speaker,
      "sensor.sonos_favorites": {
        entity_id: "sensor.sonos_favorites",
        state: "1",
        attributes: { items: { "FV:2/7": "Example Jazz" } },
      },
    },
    () => Promise.reject(new Error("not supported")),
  );

  assert.deepEqual(await loadSonosFavorites(hass, [speaker.entity_id]), [
    { id: "FV:2/7", title: "Example Jazz" },
  ]);
});
