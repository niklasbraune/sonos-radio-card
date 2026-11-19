import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { createTranslator, languageOf } from "./localize.js";
import type { Translate } from "./localize.js";
import { browseMediaSource, isImage, loadSonosFavorites } from "./media.js";
import type { BrowseMediaItem, SonosFavorite } from "./media.js";
import { searchRadioBrowser } from "./radio-browser.js";
import type { RadioBrowserResult } from "./radio-browser.js";
import { stationIssue } from "./sonos.js";
import type {
  HomeAssistant,
  SonosRadioCardConfig,
  SonosSpeakerConfig,
  SonosStationConfig,
} from "./types.js";

type FormData = Record<string, unknown>;

interface FormSchema {
  name: string;
  type?: "grid";
  required?: boolean;
  selector?: Record<string, unknown>;
  schema?: FormSchema[];
}

type LoadState = "idle" | "loading" | "done" | "error";

interface MediaBrowserState {
  index: number;
  stack: BrowseMediaItem[];
  state: LoadState;
}

const FAVORITE_TYPE = "favorite_item_id";

const MEDIA_PLAYER = { entity: { filter: { domain: "media_player" } } };

// All inputs are rendered through <ha-form> selectors. Home Assistant loads
// and maintains these fields itself, while internal elements such as
// <ha-textfield> or <ha-select> change between releases.
const GENERAL_SCHEMA: FormSchema[] = [
  { name: "title", selector: { text: {} } },
  { name: "master_entity", selector: MEDIA_PLAYER },
];

const SPEAKER_SCHEMA: FormSchema[] = [
  { name: "entity", required: true, selector: MEDIA_PLAYER },
  {
    name: "",
    type: "grid",
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
    ],
  },
];

const SOURCE_SCHEMA: FormSchema[] = [
  { name: "media_content_id", required: true, selector: { text: {} } },
];

const LOGO_SCHEMA: FormSchema[] = [{ name: "logo", selector: { text: {} } }];

const SEARCH_SCHEMA: FormSchema[] = [
  { name: "query", selector: { text: { type: "search" } } },
];

const formValue = (event: Event): FormData => {
  // Each sub form is handled here; the card editor only needs config-changed.
  event.stopPropagation();
  const value: unknown = (event as CustomEvent<{ value?: unknown }>).detail?.value;
  return value && typeof value === "object" ? (value as FormData) : {};
};

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

export class SonosRadioCardEditor extends LitElement {
  static properties = {
    _config: { state: true },
    _favorites: { state: true },
    _favoritesState: { state: true },
    _searchQuery: { state: true },
    _searchState: { state: true },
    _searchResults: { state: true },
    _browser: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 24px;
    }

    .section {
      display: grid;
      gap: 16px;
    }

    h3,
    h4 {
      margin: 0;
    }

    .item {
      display: grid;
      gap: 16px;
      padding: 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .item-header,
    .item-actions,
    .with-action {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-header {
      justify-content: space-between;
    }

    .item-actions {
      justify-content: flex-end;
    }

    .with-action > :first-child {
      flex: 1;
      min-width: 0;
    }

    .helper {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }

    .helper.warning {
      color: var(--warning-color, #ffa600);
    }

    .results,
    .browser-list {
      display: grid;
      gap: 4px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .result,
    .browser-item {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 48px;
      padding: 4px 8px;
      border-radius: var(--ha-border-radius-sm, 6px);
    }

    .result:hover,
    .browser-item:hover {
      background: var(--secondary-background-color);
    }

    .result-logo,
    .browser-thumb {
      flex: none;
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: contain;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      --mdc-icon-size: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .result-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }

    .result-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser {
      display: grid;
      gap: 8px;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .browser-header {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .browser-title {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .browser-item {
      width: 100%;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
  `;

  private _config?: SonosRadioCardConfig;
  private _hass?: HomeAssistant;
  private _favorites: SonosFavorite[] = [];
  private _favoritesState: LoadState = "idle";
  private _searchQuery = "";
  private _searchState: LoadState = "idle";
  private _searchResults: RadioBrowserResult[] = [];
  private _browser?: MediaBrowserState;
  private _searchRun = 0;
  private _translator?: { language: string | undefined; t: Translate };
  private _stationSchemaCache?: { language: string | undefined; schema: FormSchema[] };
  private _favoriteSchemaCache?: { favorites: SonosFavorite[]; schema: FormSchema[] };

  setConfig(config: SonosRadioCardConfig): void {
    this._config = {
      ...config,
      type: "custom:sonos-radio-card",
      speakers: (config.speakers ?? []).map((speaker) => ({ ...speaker })),
      stations: (config.stations ?? []).map((station) => ({ ...station })),
    };
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this.requestUpdate();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private get _t(): Translate {
    const language = languageOf(this._hass);
    if (!this._translator || this._translator.language !== language) {
      this._translator = { language, t: createTranslator(language) };
    }
    return this._translator.t;
  }

  protected willUpdate(_changed: PropertyValues): void {
    if (
      this._favoritesState === "idle" &&
      this._hass &&
      this._config?.stations.some(
        (station) => station.media_content_type === FAVORITE_TYPE,
      )
    ) {
      void this._loadFavorites();
    }
  }

  private _computeLabel = (schema: { name: string }): string => {
    const key = (
      {
        title: "editor.title",
        master_entity: "editor.master",
        entity: "editor.speaker_entity",
        icon: "editor.icon",
        media_content_type: "editor.content_type",
        media_content_id: "editor.content_id",
        logo: "editor.logo",
        favorite: "editor.favorite",
        query: "editor.search_label",
      } as const
    )[schema.name];
    return key ? this._t(key) : schema.name;
  };

  private _speakerLabel = (schema: { name: string }): string =>
    schema.name === "name"
      ? this._t("editor.display_name")
      : this._computeLabel(schema);

  private _stationLabel = (schema: { name: string }): string =>
    schema.name === "name"
      ? this._t("editor.station_name")
      : this._computeLabel(schema);

  private _computeHelper = (schema: { name: string }): string | undefined =>
    schema.name === "master_entity"
      ? this._t("editor.master_helper")
      : schema.name === "media_content_id"
        ? this._t("editor.content_id_placeholder")
        : schema.name === "logo"
          ? this._t("editor.logo_placeholder")
          : undefined;

  private _stationSchema(): FormSchema[] {
    const language = languageOf(this._hass);
    if (!this._stationSchemaCache || this._stationSchemaCache.language !== language) {
      const t = this._t;
      this._stationSchemaCache = {
        language,
        schema: [
          { name: "name", required: true, selector: { text: {} } },
          {
            name: "media_content_type",
            required: true,
            selector: {
              select: {
                mode: "list",
                options: [
                  { value: "music", label: t("editor.type_music") },
                  { value: FAVORITE_TYPE, label: t("editor.type_favorite") },
                ],
              },
            },
          },
        ],
      };
    }
    return this._stationSchemaCache.schema;
  }

  private _favoriteSchema(): FormSchema[] {
    if (!this._favoriteSchemaCache || this._favoriteSchemaCache.favorites !== this._favorites) {
      this._favoriteSchemaCache = {
        favorites: this._favorites,
        schema: [
          {
            name: "favorite",
            selector: {
              select: {
                mode: "dropdown",
                options: this._favorites.map((favorite) => ({
                  value: favorite.id,
                  label: favorite.title,
                })),
              },
            },
          },
        ],
      };
    }
    return this._favoriteSchemaCache.schema;
  }

  private _generalChanged(event: Event): void {
    if (!this._config) {
      return;
    }

    const { title, master_entity } = formValue(event);
    const config: SonosRadioCardConfig = {
      ...this._config,
      title: this._optionalString(title),
      master_entity: this._optionalString(master_entity),
    };
    this._updateConfig(config);
  }

  private _speakerChanged(index: number, event: Event): void {
    const value = formValue(event);
    this._updateSpeaker(index, {
      entity: asString(value.entity),
      name: this._optionalString(value.name),
      icon: this._optionalString(value.icon),
    });
  }

  private _stationChanged(index: number, event: Event): void {
    const station = this._config?.stations[index];
    if (!station) {
      return;
    }
    const value = formValue(event);
    this._updateStation(index, {
      name: asString(value.name),
      media_content_type:
        asString(value.media_content_type) || station.media_content_type,
    });
  }

  private _sourceChanged(index: number, event: Event): void {
    this._updateStation(index, {
      media_content_id: asString(formValue(event).media_content_id),
    });
  }

  private _logoChanged(index: number, event: Event): void {
    this._updateStation(index, {
      logo: this._optionalString(formValue(event).logo),
    });
  }

  private _updateConfig(config: SonosRadioCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _optionalString(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
  }

  private _updateSpeaker(
    index: number,
    updates: Partial<SonosSpeakerConfig>,
  ): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      speakers: this._config.speakers.map((speaker, itemIndex) =>
        itemIndex === index ? { ...speaker, ...updates } : speaker,
      ),
    });
  }

  private _updateStation(
    index: number,
    updates: Partial<SonosStationConfig>,
  ): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      stations: this._config.stations.map((station, itemIndex) =>
        itemIndex === index ? { ...station, ...updates } : station,
      ),
    });
  }

  private _move<T>(items: T[], index: number, offset: number): T[] | undefined {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return undefined;
    }
    const moved = [...items];
    [moved[index], moved[targetIndex]] = [moved[targetIndex], moved[index]];
    return moved;
  }

  private _moveSpeaker(index: number, offset: number): void {
    const speakers = this._config && this._move(this._config.speakers, index, offset);
    if (this._config && speakers) {
      this._updateConfig({ ...this._config, speakers });
    }
  }

  private _moveStation(index: number, offset: number): void {
    const stations = this._config && this._move(this._config.stations, index, offset);
    if (this._config && stations) {
      this._browser = undefined;
      this._updateConfig({ ...this._config, stations });
    }
  }

  private _addSpeaker(): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      speakers: [...this._config.speakers, { entity: "" }],
    });
  }

  private _removeSpeaker(index: number): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      speakers: this._config.speakers.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  private _addStation(station?: SonosStationConfig): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      stations: [
        ...this._config.stations,
        station ?? { name: "", media_content_id: "", media_content_type: "music" },
      ],
    });
  }

  private _removeStation(index: number): void {
    if (!this._config) {
      return;
    }

    this._browser = undefined;
    this._updateConfig({
      ...this._config,
      stations: this._config.stations.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  private _favoriteEntities(): string[] {
    const config = this._config;
    if (!config) {
      return [];
    }
    return [
      ...new Set(
        [config.master_entity ?? "", ...config.speakers.map((s) => s.entity)].filter(
          (id) => id.startsWith("media_player."),
        ),
      ),
    ];
  }

  private async _loadFavorites(): Promise<void> {
    if (!this._hass || this._favoritesState === "loading") {
      return;
    }
    this._favoritesState = "loading";
    try {
      this._favorites = await loadSonosFavorites(
        this._hass,
        this._favoriteEntities(),
      );
      this._favoritesState = "done";
    } catch {
      this._favorites = [];
      this._favoritesState = "error";
    }
  }

  private _pickFavorite(index: number, id: string): void {
    const station = this._config?.stations[index];
    const favorite = this._favorites.find((item) => item.id === id);
    if (!station || !favorite || station.media_content_id === id) {
      return;
    }
    this._updateStation(index, {
      media_content_id: favorite.id,
      name: station.name || favorite.title,
      logo: station.logo || favorite.thumbnail,
    });
  }

  private async _search(): Promise<void> {
    const query = this._searchQuery.trim();
    if (!query) {
      return;
    }
    const run = ++this._searchRun;
    this._searchState = "loading";
    try {
      const results = await searchRadioBrowser(query);
      if (run === this._searchRun) {
        this._searchResults = results;
        this._searchState = "done";
      }
    } catch {
      if (run === this._searchRun) {
        this._searchResults = [];
        this._searchState = "error";
      }
    }
  }

  private _searchKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      void this._search();
    }
  }

  private _addResult(result: RadioBrowserResult): void {
    this._addStation({
      name: result.name,
      media_content_id: result.url,
      media_content_type: "music",
      ...(result.favicon ? { logo: result.favicon } : {}),
    });
  }

  private async _browse(index: number, item?: BrowseMediaItem): Promise<void> {
    const hass = this._hass;
    if (!hass) {
      return;
    }
    const stack = item && this._browser?.index === index ? this._browser.stack : [];
    this._browser = { index, stack, state: "loading" };
    try {
      const result = await browseMediaSource(hass, item?.media_content_id);
      if (this._browser?.index === index) {
        this._browser = { index, stack: [...stack, result], state: "done" };
      }
    } catch {
      if (this._browser?.index === index) {
        this._browser = { index, stack, state: "error" };
      }
    }
  }

  private _browseBack(): void {
    if (this._browser && this._browser.stack.length > 1) {
      this._browser = {
        ...this._browser,
        stack: this._browser.stack.slice(0, -1),
        state: "done",
      };
    }
  }

  private _toggleBrowser(index: number): void {
    if (this._browser?.index === index) {
      this._browser = undefined;
    } else {
      void this._browse(index);
    }
  }

  private _pickLogo(index: number, item: BrowseMediaItem): void {
    this._browser = undefined;
    this._updateStation(index, { logo: item.media_content_id });
  }

  render() {
    const config = this._config;
    if (!config) {
      return nothing;
    }
    const t = this._t;

    return html`
      <div class="editor">
        <section class="section">
          <h3>${t("editor.general")}</h3>
          <ha-form
            .hass=${this._hass}
            .data=${{
              title: config.title,
              master_entity: config.master_entity,
            }}
            .schema=${GENERAL_SCHEMA}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${this._generalChanged}
          ></ha-form>

          <div class="section">
            <h4>${t("editor.speakers")}</h4>
            ${config.speakers.map((speaker, index) =>
              this._renderSpeaker(speaker, index, config.speakers.length),
            )}
            <ha-button @click=${() => this._addSpeaker()}>
              ${t("editor.add_speaker")}
            </ha-button>
          </div>
        </section>

        <section class="section">
          <h3>${t("editor.stations")}</h3>
          ${config.stations.map((station, index) =>
            this._renderStation(station, index, config.stations.length),
          )}
          <ha-button @click=${() => this._addStation()}>
            ${t("editor.add_station")}
          </ha-button>
          ${this._renderSearch()}
        </section>
      </div>
    `;
  }

  private _renderSpeaker(
    speaker: SonosSpeakerConfig,
    index: number,
    count: number,
  ) {
    const t = this._t;
    return html`
      <div class="item">
        <div class="item-header">
          <strong>${t("editor.speaker_n", { n: index + 1 })}</strong>
          <div class="item-actions">
            <ha-icon-button
              .label=${t("editor.speaker_up")}
              .disabled=${index === 0}
              @click=${() => this._moveSpeaker(index, -1)}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.speaker_down")}
              .disabled=${index === count - 1}
              @click=${() => this._moveSpeaker(index, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.speaker_remove")}
              @click=${() => this._removeSpeaker(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </div>
        <ha-form
          class="speaker-form"
          .hass=${this._hass}
          .data=${{ entity: speaker.entity, name: speaker.name, icon: speaker.icon }}
          .schema=${SPEAKER_SCHEMA}
          .computeLabel=${this._speakerLabel}
          @value-changed=${(event: Event) => this._speakerChanged(index, event)}
        ></ha-form>
      </div>
    `;
  }

  private _renderStation(
    station: SonosStationConfig,
    index: number,
    count: number,
  ) {
    const t = this._t;
    const isFavorite = station.media_content_type === FAVORITE_TYPE;
    const issue = station.media_content_id
      ? stationIssue(station, t)
      : undefined;

    return html`
      <div class="item station">
        <div class="item-header">
          <strong>${t("editor.station_n", { n: index + 1 })}</strong>
          <div class="item-actions">
            <ha-icon-button
              .label=${t("editor.station_up")}
              .disabled=${index === 0}
              @click=${() => this._moveStation(index, -1)}
            >
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.station_down")}
              .disabled=${index === count - 1}
              @click=${() => this._moveStation(index, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </ha-icon-button>
            <ha-icon-button
              .label=${t("editor.station_remove")}
              @click=${() => this._removeStation(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        </div>
        <ha-form
          class="station-form"
          .hass=${this._hass}
          .data=${{
            name: station.name,
            media_content_type: station.media_content_type,
          }}
          .schema=${this._stationSchema()}
          .computeLabel=${this._stationLabel}
          @value-changed=${(event: Event) => this._stationChanged(index, event)}
        ></ha-form>
        ${isFavorite ? this._renderFavoritePicker(station, index) : nothing}
        <ha-form
          class="source-form"
          .hass=${this._hass}
          .data=${{ media_content_id: station.media_content_id }}
          .schema=${SOURCE_SCHEMA}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${(event: Event) => this._sourceChanged(index, event)}
        ></ha-form>
        <div class="with-action">
          <ha-form
            class="logo-form"
            .hass=${this._hass}
            .data=${{ logo: station.logo }}
            .schema=${LOGO_SCHEMA}
            .computeLabel=${this._computeLabel}
            .computeHelper=${this._computeHelper}
            @value-changed=${(event: Event) => this._logoChanged(index, event)}
          ></ha-form>
          <ha-icon-button
            class="browse-logo"
            .label=${t("editor.browse_logo")}
            .disabled=${!this._hass}
            @click=${() => this._toggleBrowser(index)}
          >
            <ha-icon icon="mdi:image-search-outline"></ha-icon>
          </ha-icon-button>
        </div>
        ${this._browser?.index === index ? this._renderBrowser(index) : nothing}
        <div class="helper">
          ${isFavorite ? t("editor.helper_favorite") : t("editor.helper_music")}
        </div>
        ${issue
          ? html`<div class="helper warning" role="status">${issue}</div>`
          : nothing}
      </div>
    `;
  }

  private _renderFavoritePicker(station: SonosStationConfig, index: number) {
    const t = this._t;
    if (this._favoritesState === "loading" || this._favoritesState === "idle") {
      return html`<div class="helper">${t("editor.favorites_loading")}</div>`;
    }
    const message =
      this._favoritesState === "error"
        ? t("editor.favorites_failed")
        : this._favorites.length === 0
          ? t("editor.favorites_empty")
          : undefined;

    return html`
      <div class="with-action">
        ${message
          ? html`<div class="helper warning" role="status">${message}</div>`
          : html`<ha-form
              class="favorite-form"
              .hass=${this._hass}
              .data=${{
                favorite: this._favorites.some(
                  (favorite) => favorite.id === station.media_content_id,
                )
                  ? station.media_content_id
                  : undefined,
              }}
              .schema=${this._favoriteSchema()}
              .computeLabel=${this._computeLabel}
              @value-changed=${(event: Event) =>
                this._pickFavorite(index, asString(formValue(event).favorite))}
            ></ha-form>`}
        <ha-icon-button
          class="reload-favorites"
          .label=${t("editor.favorites_reload")}
          @click=${() => {
            this._favoritesState = "idle";
            void this._loadFavorites();
          }}
        >
          <ha-icon icon="mdi:refresh"></ha-icon>
        </ha-icon-button>
      </div>
    `;
  }

  private _renderBrowser(index: number) {
    const t = this._t;
    const browser = this._browser!;
    const current = browser.stack[browser.stack.length - 1];
    const children = (current?.children ?? []).filter(
      (item) => item.can_expand || isImage(item),
    );

    return html`
      <div class="browser">
        <div class="browser-header">
          ${browser.stack.length > 1
            ? html`<ha-icon-button
                .label=${t("editor.browse_back")}
                @click=${() => this._browseBack()}
              >
                <ha-icon icon="mdi:arrow-left"></ha-icon>
              </ha-icon-button>`
            : nothing}
          <span class="browser-title">
            ${current?.title ?? t("editor.browse_title")}
          </span>
          <ha-icon-button
            .label=${t("editor.browse_close")}
            @click=${() => (this._browser = undefined)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </ha-icon-button>
        </div>
        ${browser.state === "loading"
          ? html`<div class="helper">${t("editor.browse_loading")}</div>`
          : browser.state === "error"
            ? html`<div class="helper warning" role="status">
                ${t("editor.browse_failed")}
              </div>`
            : children.length === 0
              ? html`<div class="helper">${t("editor.browse_empty")}</div>`
              : html`<ul class="browser-list">
                  ${children.map(
                    (item) => html`<li>
                      <button
                        class="browser-item"
                        @click=${() =>
                          item.can_expand
                            ? this._browse(index, item)
                            : this._pickLogo(index, item)}
                      >
                        ${item.thumbnail && /^https?:\/\//i.test(item.thumbnail)
                          ? html`<img class="browser-thumb" src=${item.thumbnail} alt="" />`
                          : html`<span class="browser-thumb">
                              <ha-icon
                                icon=${item.can_expand ? "mdi:folder" : "mdi:image"}
                              ></ha-icon>
                            </span>`}
                        <span class="result-name">${item.title}</span>
                      </button>
                    </li>`,
                  )}
                </ul>`}
      </div>
    `;
  }

  private _renderSearch() {
    const t = this._t;
    const added = new Set(
      this._config?.stations.map((station) => station.media_content_id) ?? [],
    );

    return html`
      <div class="section search">
        <h4>${t("editor.search_title")}</h4>
        <div class="with-action" @keydown=${this._searchKeydown}>
          <ha-form
            class="search-form"
            .hass=${this._hass}
            .data=${{ query: this._searchQuery }}
            .schema=${SEARCH_SCHEMA}
            .computeLabel=${this._computeLabel}
            @value-changed=${(event: Event) =>
              (this._searchQuery = asString(formValue(event).query))}
          ></ha-form>
          <ha-button
            class="search-button"
            .disabled=${!this._searchQuery.trim() ||
            this._searchState === "loading"}
            @click=${() => this._search()}
          >
            ${t("editor.search")}
          </ha-button>
        </div>
        <div class="helper">${t("editor.search_helper")}</div>
        ${this._searchState === "loading"
          ? html`<div class="helper">${t("editor.browse_loading")}</div>`
          : this._searchState === "error"
            ? html`<div class="helper warning" role="status">
                ${t("editor.search_failed")}
              </div>`
            : this._searchState === "done" && this._searchResults.length === 0
              ? html`<div class="helper">${t("editor.search_empty")}</div>`
              : nothing}
        ${this._searchResults.length > 0
          ? html`<ul class="results">
              ${this._searchResults.map((result) => {
                const isAdded = added.has(result.url);
                const meta = [
                  result.codec,
                  result.bitrate ? `${result.bitrate} kbps` : undefined,
                  result.country,
                ]
                  .filter(Boolean)
                  .join(" · ");
                return html`<li class="result">
                  ${result.favicon
                    ? html`<img class="result-logo" src=${result.favicon} alt="" />`
                    : html`<span class="result-logo">
                        <ha-icon icon="mdi:radio"></ha-icon>
                      </span>`}
                  <span class="result-text">
                    <span class="result-name">${result.name}</span>
                    <span class="helper">${meta}</span>
                  </span>
                  <ha-button
                    class="add-result"
                    .disabled=${isAdded}
                    @click=${() => this._addResult(result)}
                  >
                    ${isAdded ? t("editor.search_added") : t("editor.search_add")}
                  </ha-button>
                </li>`;
              })}
            </ul>`
          : nothing}
      </div>
    `;
  }
}

if (!customElements.get("sonos-radio-card-editor")) {
  customElements.define("sonos-radio-card-editor", SonosRadioCardEditor);
}
