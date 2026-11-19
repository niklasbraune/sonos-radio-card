import { LitElement, css, html, nothing } from "lit";
import { stationIssue } from "./sonos.js";
import type {
  HomeAssistant,
  SonosRadioCardConfig,
  SonosSpeakerConfig,
  SonosStationConfig,
} from "./types.js";

interface GeneralFormValue {
  title?: unknown;
  master_entity?: unknown;
}

interface FormValueChangedEvent extends CustomEvent {
  detail: {
    value: GeneralFormValue;
  };
}

const GENERAL_SCHEMA = [
  {
    name: "title",
    selector: {
      text: {},
    },
  },
  {
    name: "master_entity",
    selector: {
      entity: {
        domain: ["media_player"],
      },
    },
  },
];

const GENERAL_LABELS: Record<string, string> = {
  title: "Card title",
  master_entity: "Default master speaker",
};

export class SonosRadioCardEditor extends LitElement {
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

    h3 {
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
    .item-actions {
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

    .fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .helper {
      color: var(--secondary-text-color);
      font-size: 0.9em;
    }

    .helper.warning {
      color: var(--warning-color, #ffa600);
    }

    @media (max-width: 600px) {
      .fields {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `;

  private _config?: SonosRadioCardConfig;
  private _hass?: HomeAssistant;

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

  private _computeLabel = (schema: { name: string }): string =>
    GENERAL_LABELS[schema.name] ?? schema.name;

  private _computeHelper = (schema: { name: string }): string | undefined =>
    schema.name === "master_entity"
      ? "Leave empty to automatically detect the current Sonos group master."
      : undefined;

  private _generalChanged(event: FormValueChangedEvent): void {
    if (!this._config) {
      return;
    }

    const { title, master_entity } = event.detail.value;
    const config: SonosRadioCardConfig = {
      ...this._config,
      title: this._optionalString(title),
      master_entity: this._optionalString(master_entity),
    };
    this._updateConfig(config);
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

  private _eventValue(event: Event): string {
    const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;
    const value =
      detail && typeof detail === "object" && "value" in detail
        ? detail.value
        : undefined;
    if (typeof value === "string") {
      return value;
    }

    const target = event.currentTarget as HTMLElement & { value?: unknown };
    return typeof target.value === "string" ? target.value : "";
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

  private _moveSpeaker(index: number, offset: number): void {
    if (!this._config) {
      return;
    }

    const speakers = [...this._config.speakers];
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= speakers.length) {
      return;
    }

    [speakers[index], speakers[targetIndex]] = [
      speakers[targetIndex],
      speakers[index],
    ];
    this._updateConfig({ ...this._config, speakers });
  }

  private _moveStation(index: number, offset: number): void {
    if (!this._config) {
      return;
    }

    const stations = [...this._config.stations];
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= stations.length) {
      return;
    }

    [stations[index], stations[targetIndex]] = [
      stations[targetIndex],
      stations[index],
    ];
    this._updateConfig({ ...this._config, stations });
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

  private _addStation(): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      stations: [
        ...this._config.stations,
        { name: "", media_content_id: "", media_content_type: "music" },
      ],
    });
  }

  private _removeStation(index: number): void {
    if (!this._config) {
      return;
    }

    this._updateConfig({
      ...this._config,
      stations: this._config.stations.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  render() {
    const config = this._config;
    if (!config) {
      return html``;
    }

    return html`
      <div class="editor">
        <section class="section">
          <h3>General and speakers</h3>
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
            <h4>Sonos speakers</h4>
            ${config.speakers.map(
              (speaker, index) => html`
                <div class="item">
                  <div class="item-header">
                    <strong>Speaker ${index + 1}</strong>
                    <div class="item-actions">
                      <ha-icon-button
                        .label=${"Move speaker up"}
                        .disabled=${index === 0}
                        @click=${() => this._moveSpeaker(index, -1)}
                      >
                        <ha-icon icon="mdi:arrow-up"></ha-icon>
                      </ha-icon-button>
                      <ha-icon-button
                        .label=${"Move speaker down"}
                        .disabled=${index === config.speakers.length - 1}
                        @click=${() => this._moveSpeaker(index, 1)}
                      >
                        <ha-icon icon="mdi:arrow-down"></ha-icon>
                      </ha-icon-button>
                      <ha-icon-button
                        .label=${"Remove speaker"}
                        @click=${() => this._removeSpeaker(index)}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </ha-icon-button>
                    </div>
                  </div>
                  <ha-entity-picker
                    .hass=${this._hass}
                    .value=${speaker.entity}
                    .includeDomains=${["media_player"]}
                    .label=${"Speaker entity"}
                    @value-changed=${(event: Event) =>
                      this._updateSpeaker(index, {
                        entity: this._eventValue(event),
                      })}
                  ></ha-entity-picker>
                  <div class="fields">
                    <ha-textfield
                      .label=${"Display name"}
                      .value=${speaker.name ?? ""}
                      @input=${(event: Event) =>
                        this._updateSpeaker(index, {
                          name: this._optionalString(this._eventValue(event)),
                        })}
                    ></ha-textfield>
                    <ha-icon-picker
                      .label=${"Icon"}
                      .value=${speaker.icon ?? ""}
                      @value-changed=${(event: Event) =>
                        this._updateSpeaker(index, {
                          icon: this._optionalString(this._eventValue(event)),
                        })}
                    ></ha-icon-picker>
                  </div>
                </div>
              `,
            )}
            <ha-button @click=${this._addSpeaker}>Add speaker</ha-button>
          </div>
        </section>

        <section class="section">
          <h3>Radio stations</h3>
          ${config.stations.map(
            (station, index) => html`
              <div class="item">
                <div class="item-header">
                  <strong>Station ${index + 1}</strong>
                  <div class="item-actions">
                    <ha-icon-button
                      .label=${"Move station up"}
                      .disabled=${index === 0}
                      @click=${() => this._moveStation(index, -1)}
                    >
                      <ha-icon icon="mdi:arrow-up"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${"Move station down"}
                      .disabled=${index === config.stations.length - 1}
                      @click=${() => this._moveStation(index, 1)}
                    >
                      <ha-icon icon="mdi:arrow-down"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      .label=${"Remove station"}
                      @click=${() => this._removeStation(index)}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </ha-icon-button>
                  </div>
                </div>
                <div class="fields">
                  <ha-textfield
                    .label=${"Station name"}
                    .value=${station.name}
                    @input=${(event: Event) =>
                      this._updateStation(index, {
                        name: this._eventValue(event),
                      })}
                  ></ha-textfield>
                  <ha-select
                    .label=${"Media content type"}
                    .value=${station.media_content_type}
                    .options=${[
                      {
                        value: "music",
                        label: "Stream URL (music / Radio Browser)",
                      },
                      {
                        value: "favorite_item_id",
                        label: "Sonos favorite",
                      },
                    ]}
                    @selected=${(event: Event) =>
                      this._updateStation(index, {
                        media_content_type: this._eventValue(event),
                      })}
                  ></ha-select>
                </div>
                <ha-textfield
                  .label=${"Stream URL / media content ID"}
                  .value=${station.media_content_id}
                  .placeholder=${"https://... or Sonos favorite ID"}
                  @input=${(event: Event) =>
                    this._updateStation(index, {
                      media_content_id: this._eventValue(event),
                    })}
                ></ha-textfield>
                <ha-textfield
                  .label=${"Logo URL or media-source"}
                  .value=${station.logo ?? ""}
                  .placeholder=${"https://... or media-source://..."}
                  @input=${(event: Event) =>
                    this._updateStation(index, {
                      logo: this._optionalString(this._eventValue(event)),
                    })}
                ></ha-textfield>
                ${station.media_content_type === "favorite_item_id"
                  ? html`<div class="helper">
                      Enter the Sonos favorite ID as the media content ID.
                    </div>`
                  : html`<div class="helper">
                      Radio Browser stations use their stream URL with the
                      “music” media content type.
                    </div>`}
                ${station.media_content_id && stationIssue(station)
                  ? html`<div class="helper warning" role="status">
                      ${stationIssue(station)}
                    </div>`
                  : nothing}
              </div>
            `,
          )}
          <ha-button @click=${this._addStation}>Add station</ha-button>
        </section>
      </div>
    `;
  }
}

if (!customElements.get("sonos-radio-card-editor")) {
  customElements.define("sonos-radio-card-editor", SonosRadioCardEditor);
}
