export interface SonosRadioCardConfig {
  type: "custom:sonos-radio-card";
  title?: string;
  master_entity?: string;
  speakers: SonosSpeakerConfig[];
  stations: SonosStationConfig[];
}

export interface SonosSpeakerConfig {
  entity: string;
  name?: string;
  icon?: string;
}

export interface SonosStationConfig {
  name: string;
  media_content_id: string;
  media_content_type: string;
  /** An HTTP(S) URL or a Home Assistant media-source URI. */
  logo?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  locale?: { language?: string };
  language?: string;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ): Promise<unknown>;
  callWS<T>(message: { type: string; [key: string]: unknown }): Promise<T>;
  hassUrl(path?: string): string;
}
