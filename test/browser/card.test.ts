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

const mount = async (hass: MockHass): Promise<SonosRadioCard> => {
  const card = document.createElement("sonos-radio-card") as SonosRadioCard;
  card.setConfig(config);
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
});

describe("sonos-radio-card", () => {
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

  it("uses the Home Assistant language", async () => {
    const card = await mount(mockHass(groupedStates(), { language: "de" }));
    expect(query(card, ".transport .round:not(.primary)")!.getAttribute("aria-label")).to.equal(
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
