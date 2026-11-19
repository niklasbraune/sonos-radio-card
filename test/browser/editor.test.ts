import { expect, waitUntil } from "@open-wc/testing";
import "../../src/editor.ts";
import type { SonosRadioCardEditor } from "../../src/editor.ts";
import type { SonosRadioCardConfig } from "../../src/types.ts";
import { entity, mockHass } from "./helpers.ts";
import type { MockHass } from "./helpers.ts";

const baseConfig = (stations: SonosRadioCardConfig["stations"]): SonosRadioCardConfig => ({
  type: "custom:sonos-radio-card",
  speakers: [{ entity: "media_player.kitchen" }],
  stations,
});

const mount = async (config: SonosRadioCardConfig, hass: MockHass) => {
  const editor = document.createElement("sonos-radio-card-editor") as SonosRadioCardEditor;
  editor.hass = hass;
  editor.setConfig(config);
  const changes: SonosRadioCardConfig[] = [];
  editor.addEventListener("config-changed", (event) =>
    changes.push((event as CustomEvent<{ config: SonosRadioCardConfig }>).detail.config),
  );
  document.body.append(editor);
  await editor.updateComplete;
  return { editor, changes };
};

const query = <T extends HTMLElement = HTMLElement>(editor: SonosRadioCardEditor, selector: string) =>
  editor.shadowRoot!.querySelector<T>(selector);

const lastChange = (changes: SonosRadioCardConfig[]) => changes[changes.length - 1];

// <ha-form> is provided by Home Assistant; tests emit its value-changed event.
const changeForm = (
  editor: SonosRadioCardEditor,
  selector: string,
  value: Record<string, unknown>,
) =>
  query(editor, selector)!.dispatchEvent(
    new CustomEvent("value-changed", { detail: { value }, bubbles: true, composed: true }),
  );

const originalFetch = window.fetch;

afterEach(() => {
  window.fetch = originalFetch;
  document.body.querySelectorAll("sonos-radio-card-editor").forEach((editor) => editor.remove());
});

describe("sonos-radio-card-editor", () => {
  it("picks a Sonos favorite and fills empty fields", async () => {
    const hass = mockHass([entity("media_player.kitchen", "idle")], {
      callWS: (message) =>
        Promise.resolve(
          message.media_content_type === "favorites"
            ? {
                children: [
                  {
                    title: "Example FM",
                    media_content_id: "FV:2/12",
                    media_content_type: "favorite_item_id",
                    can_expand: false,
                    can_play: true,
                    thumbnail: "https://images.example.com/fm.png",
                  },
                ],
              }
            : { children: [] },
        ),
    });
    const { editor, changes } = await mount(
      baseConfig([{ name: "", media_content_id: "", media_content_type: "favorite_item_id" }]),
      hass,
    );

    await waitUntil(() => query(editor, ".favorite-form"));
    const form = query<HTMLElement & { schema: { selector: { select: { options: unknown } } }[] }>(
      editor,
      ".favorite-form",
    )!;
    expect(form.schema[0].selector.select.options).to.deep.equal([
      { value: "FV:2/12", label: "Example FM" },
    ]);

    changeForm(editor, ".favorite-form", { favorite: "FV:2/12" });
    expect(lastChange(changes).stations[0]).to.deep.equal({
      name: "Example FM",
      media_content_id: "FV:2/12",
      media_content_type: "favorite_item_id",
      logo: "https://images.example.com/fm.png",
    });
  });

  it("switches the station type and edits the stream URL", async () => {
    const hass = mockHass([entity("media_player.kitchen", "idle")], {
      callWS: () => Promise.resolve({ children: [] }),
    });
    const { editor, changes } = await mount(
      baseConfig([{ name: "Example FM", media_content_id: "", media_content_type: "music" }]),
      hass,
    );
    let outerEvents = 0;
    document.body.addEventListener("value-changed", () => outerEvents++);

    changeForm(editor, ".source-form", { media_content_id: "https://stream.example.com/a.mp3" });
    await editor.updateComplete;
    expect(lastChange(changes).stations[0].media_content_id).to.equal(
      "https://stream.example.com/a.mp3",
    );
    const source = query<HTMLElement & { data: Record<string, unknown> }>(editor, ".source-form")!;
    expect(source.data).to.deep.equal({ media_content_id: "https://stream.example.com/a.mp3" });

    changeForm(editor, ".station-form", { name: "Example FM", media_content_type: "favorite_item_id" });
    await editor.updateComplete;
    expect(lastChange(changes).stations[0].media_content_type).to.equal("favorite_item_id");
    await waitUntil(() => query(editor, ".reload-favorites"));
    expect(outerEvents).to.equal(0);
  });

  it("adds a station from the Radio Browser search", async () => {
    const requests: string[] = [];
    window.fetch = (input: RequestInfo | URL) => {
      requests.push(input instanceof URL ? input.href : input instanceof Request ? input.url : input);
      return Promise.resolve(
        new Response(
          JSON.stringify([
            {
              stationuuid: "uuid-1",
              name: "Example Jazz",
              url_resolved: "https://stream.example.com/jazz.mp3",
              favicon: "https://images.example.com/jazz.png",
            },
          ]),
        ),
      );
    };
    const { editor, changes } = await mount(baseConfig([]), mockHass([]));

    changeForm(editor, ".search-form", { query: "jazz" });
    query(editor, ".search-form")!.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, composed: true }),
    );

    await waitUntil(() => query(editor, ".add-result"));
    expect(requests[0]).to.contain("name=jazz");
    query(editor, ".add-result")!.click();

    expect(lastChange(changes).stations).to.deep.equal([
      {
        name: "Example Jazz",
        media_content_id: "https://stream.example.com/jazz.mp3",
        media_content_type: "music",
        logo: "https://images.example.com/jazz.png",
      },
    ]);
  });

  it("chooses a logo through the media browser", async () => {
    const hass = mockHass([], {
      callWS: (message) =>
        Promise.resolve(
          message.media_content_id === "media-source://media_source/local/logos"
            ? {
                title: "logos",
                media_content_id: "media-source://media_source/local/logos",
                can_expand: true,
                children: [
                  {
                    title: "fm.png",
                    media_class: "image",
                    media_content_type: "image/png",
                    media_content_id: "media-source://media_source/local/logos/fm.png",
                    can_expand: false,
                    can_play: true,
                  },
                ],
              }
            : {
                title: "Media",
                media_content_id: "",
                can_expand: true,
                children: [
                  {
                    title: "logos",
                    media_class: "directory",
                    media_content_type: "",
                    media_content_id: "media-source://media_source/local/logos",
                    can_expand: true,
                    can_play: false,
                  },
                ],
              },
        ),
    });
    const { editor, changes } = await mount(
      baseConfig([{ name: "Example FM", media_content_id: "https://stream.example.com/a.mp3", media_content_type: "music" }]),
      hass,
    );

    query(editor, ".browse-logo")!.click();
    await waitUntil(() => query(editor, ".browser-item"));
    query(editor, ".browser-item")!.click();
    await waitUntil(() => query(editor, ".browser-title")?.textContent?.trim() === "logos");
    query(editor, ".browser-item")!.click();
    await editor.updateComplete;

    expect(lastChange(changes).stations[0].logo).to.equal(
      "media-source://media_source/local/logos/fm.png",
    );
    expect(query(editor, ".browser")).to.equal(null);
  });
});
