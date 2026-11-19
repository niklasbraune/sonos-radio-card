import { expect, waitUntil } from "@open-wc/testing";
import "../../src/sonos-radio-card.ts";
import type { SonosRadioCard } from "../../src/sonos-radio-card.ts";
import type { SonosRadioCardConfig } from "../../src/types.ts";
import { entity, mockHass } from "./helpers.ts";
import type { MockHass, ServiceCall } from "./helpers.ts";

const STREAM = "https://stream.example.com/example-fm.mp3";

const config: SonosRadioCardConfig = {
  type: "custom:sonos-radio-card",
  title: "Radio",
  speakers: [
    { entity: "media_player.kitchen", name: "Kitchen" },
    { entity: "media_player.living", name: "Living Room" },
  ],
  stations: [
    { name: "Example FM", media_content_id: STREAM, media_content_type: "music" },
    {
      name: "Example Jazz",
      media_content_id: "https://stream.example.com/jazz.mp3",
      media_content_type: "music",
    },
  ],
};

const groupedStates = () => {
  const group = { group_members: ["media_player.kitchen", "media_player.living"] };
  return [
    entity("media_player.kitchen", "playing", {
      ...group,
      media_content_id: STREAM,
      volume_level: 0.4,
    }),
    entity("media_player.living", "playing", {
      ...group,
      media_content_id: STREAM,
      volume_level: 0.2,
    }),
  ];
};

const mount = async (
  hass: MockHass,
  cardConfig: SonosRadioCardConfig = config,
): Promise<SonosRadioCard> => {
  const card = document.createElement("sonos-radio-card") as SonosRadioCard;
  card.setConfig(cardConfig);
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const query = <T extends Element = HTMLElement>(card: SonosRadioCard, selector: string) =>
  card.shadowRoot!.querySelector<T>(selector);

const queryAll = (card: SonosRadioCard, selector: string) => [
  ...card.shadowRoot!.querySelectorAll<HTMLElement>(selector),
];

afterEach(() => {
  document.body.querySelectorAll("sonos-radio-card").forEach((card) => card.remove());
  window.localStorage.clear();
});

describe("sonos-radio-card", () => {
  it("saves settings from the settings panel to the user profile", async () => {
    const saved: Record<string, unknown>[] = [];
    const hass = mockHass(groupedStates(), {
      callWS: (message) => {
        if (message.type === "frontend/set_user_data") {
          saved.push(message);
        }
        return Promise.resolve(null);
      },
    });
    const card = await mount(hass);

    query(card, ".settings-button")!.click();
    await card.updateComplete;
    expect(query(card, "#drawer-title")!.textContent?.trim()).to.equal("Settings");

    query(card, ".add-quiet")!.click();
    await card.updateComplete;
    const start = query<HTMLInputElement>(card, ".quiet-start")!;
    start.value = "21:30";
    start.dispatchEvent(new Event("change"));
    const max = query<HTMLInputElement>(card, ".max-volume input")!;
    max.value = "70";
    max.dispatchEvent(new Event("change"));
    const shuffle = query<HTMLElement & { checked: boolean }>(card, ".shuffle-switch")!;
    shuffle.checked = true;
    shuffle.dispatchEvent(new Event("change"));

    await waitUntil(() => saved.length > 0, "settings were not saved");
    expect(saved).to.have.length(1);
    expect(saved[0]).to.deep.equal({
      type: "frontend/set_user_data",
      key: "sonos-radio-card",
      value: {
        max_volume: 70,
        quiet_hours: [{ start: "21:30", end: "07:00", volume: 15 }],
        shuffle_playlists: true,
      },
    });
  });

  it("starts playback at the quiet-hour volume and shuffles favorites", async () => {
    const hass = mockHass(
      [
        entity("media_player.kitchen", "idle", {
          group_members: ["media_player.kitchen", "media_player.living"],
          volume_level: 0.4,
          shuffle: false,
        }),
        entity("media_player.living", "idle", {
          group_members: ["media_player.kitchen", "media_player.living"],
          volume_level: 0.1,
        }),
      ],
      {
        callWS: (message) =>
          Promise.resolve(
            message.type === "frontend/get_user_data"
              ? {
                  value: {
                    max_volume: 80,
                    quiet_hours: [{ start: "00:00", end: "00:00", volume: 10 }],
                    shuffle_playlists: true,
                  },
                }
              : null,
          ),
      },
    );
    const card = await mount(hass, {
      ...config,
      stations: [
        { name: "Playlist", media_content_id: "FV:2/7", media_content_type: "favorite_item_id" },
      ],
    });
    await waitUntil(
      () => query(card, ".settings-button")?.classList.contains("quiet"),
      "settings were not loaded",
    );
    expect(query(card, ".controls input[type=range]")!.getAttribute("max")).to.equal("80");

    query(card, ".station")!.click();
    await waitUntil(() => hass.calls.length >= 3, "playback was not started");
    expect(hass.calls.map((call) => [call.service, call.data])).to.deep.equal([
      ["volume_set", { entity_id: "media_player.kitchen", volume_level: 0.1 }],
      [
        "play_media",
        {
          entity_id: "media_player.kitchen",
          media_content_id: "FV:2/7",
          media_content_type: "favorite_item_id",
        },
      ],
      ["shuffle_set", { entity_id: "media_player.kitchen", shuffle: true }],
    ]);
  });

  it("starts playback on the speaker chosen in the card", async () => {
    const hass = mockHass([
      entity("media_player.kitchen", "idle", { volume_level: 0.3 }),
      entity("media_player.living", "idle", { volume_level: 0.3 }),
    ]);
    const card = await mount(hass);

    const targets = queryAll(card, ".target");
    expect(targets.map((t) => t.textContent?.trim())).to.deep.equal([
      "Kitchen",
      "Living Room",
    ]);
    expect(targets[0].getAttribute("aria-pressed")).to.equal("true");

    targets[1].click();
    await card.updateComplete;
    expect(queryAll(card, ".target")[1].getAttribute("aria-pressed")).to.equal("true");

    queryAll(card, ".station")[0].click();
    expect(hass.calls[0]).to.deep.include({ service: "play_media" });
    expect(hass.calls[0].data.entity_id).to.equal("media_player.living");
  });

  it("hides the speaker choice while all speakers form one group", async () => {
    const card = await mount(mockHass(groupedStates()));
    expect(queryAll(card, ".target")).to.have.length(0);
  });

  it("highlights the playing station and starts stations on the coordinator", async () => {
    const hass = mockHass(groupedStates());
    const card = await mount(hass);

    const tiles = queryAll(card, ".station");
    expect(tiles).to.have.length(2);
    expect(tiles[0].classList.contains("active")).to.equal(true);
    expect(tiles[0].getAttribute("aria-pressed")).to.equal("true");

    tiles[1].click();
    expect(hass.calls).to.deep.equal([
      {
        domain: "media_player",
        service: "play_media",
        data: {
          entity_id: "media_player.kitchen",
          media_content_id: "https://stream.example.com/jazz.mp3",
          media_content_type: "music",
        },
      },
    ]);
  });

  it("toggles between stop and play with a single button", async () => {
    const hass = mockHass(groupedStates());
    const card = await mount(hass);
    const button = query(card, ".toggle-playback")!;
    expect(queryAll(card, ".transport button")).to.have.length(1);
    expect(button.getAttribute("aria-label")).to.equal("Stop");

    button.click();
    await waitUntil(() => hass.calls.length === 1);
    expect(hass.calls[0]).to.deep.include({ service: "media_stop" });

    card.hass = mockHass([
      entity("media_player.kitchen", "paused", { volume_level: 0.3 }),
      entity("media_player.living", "idle", { volume_level: 0.3 }),
    ]);
    await card.updateComplete;
    expect(button.getAttribute("aria-label")).to.equal("Play");
  });

  it("uses the Home Assistant language", async () => {
    const card = await mount(mockHass(groupedStates(), { language: "de" }));
    expect(query(card, ".toggle-playback")!.getAttribute("aria-label")).to.equal(
      "Stopp",
    );
    expect(query(card, ".station.active .badge")!.textContent.trim()).to.equal("Läuft");
  });

  it("offers sections view grid options", async () => {
    const card = await mount(mockHass(groupedStates()));
    expect(card.getGridOptions()).to.deep.equal({
      columns: 12,
      rows: "auto",
      min_columns: 6,
    });
    expect(card.getCardSize()).to.be.greaterThan(1);
  });

  it("makes the card content inert while the drawer is open", async () => {
    const card = await mount(mockHass(groupedStates()));
    query(card, ".multiroom")!.click();
    await card.updateComplete;

    expect(query(card, ".content")!.hasAttribute("inert")).to.equal(true);
    expect(card.shadowRoot!.activeElement).to.equal(query(card, ".drawer .close"));

    // Tab from the last control wraps around to the first one.
    const focusable = queryAll(card, ".drawer button, .drawer input, .drawer ha-switch").filter(
      (element) => !(element as HTMLElement & { disabled?: boolean }).disabled,
    );
    focusable[focusable.length - 1].focus();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", cancelable: true }));
    expect(card.shadowRoot!.activeElement).to.equal(focusable[0]);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await waitUntil(() => !query(card, ".drawer"));
    expect(query(card, ".content")!.hasAttribute("inert")).to.equal(false);
  });

  it("switches rooms optimistically and reverts on failure", async () => {
    let reject: (error: unknown) => void = () => undefined;
    const hass = mockHass(groupedStates(), {
      callService: (call: ServiceCall) =>
        call.service === "unjoin"
          ? new Promise((_, fail) => (reject = fail))
          : Promise.resolve(),
    });
    const card = await mount(hass);
    query(card, ".multiroom")!.click();
    await card.updateComplete;

    const toggle = () =>
      queryAll(card, ".room ha-switch")[1] as HTMLElement & { checked: boolean };
    expect(toggle().checked).to.equal(true);

    toggle().checked = false;
    toggle().dispatchEvent(new Event("change"));
    await card.updateComplete;

    expect(toggle().checked).to.equal(false);
    expect(queryAll(card, ".room .secondary")[1].textContent).to.equal("Leaving group…");
    expect(hass.calls.at(-1)).to.deep.equal({
      domain: "media_player",
      service: "unjoin",
      data: { entity_id: "media_player.living" },
    });

    reject({ code: "failed", message: "Speaker did not respond" });
    await waitUntil(() => query(card, ".toast"));
    await card.updateComplete;

    expect(toggle().checked).to.equal(true);
    expect(query(card, ".toast")!.textContent).to.contain(
      "Could not remove Living Room from the group. Speaker did not respond",
    );
  });
});
