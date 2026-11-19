import type { Translate } from "./localize.js";
import type {
  HassEntity,
  HomeAssistant,
  SonosRadioCardConfig,
  SonosStationConfig,
} from "./types.js";

const ACTIVE_STATES = new Set(["playing", "paused", "buffering"]);
const UNAVAILABLE_STATES = new Set(["unavailable", "unknown"]);

export interface VolumeCommand {
  entity_id: string;
  volume_level: number;
}

const unique = <T>(items: T[]): T[] => [...new Set(items)];

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

const stringAttribute = (
  entity: HassEntity | undefined,
  name: string,
): string | undefined => {
  const value = entity?.attributes[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export const isActiveState = (entity: HassEntity | undefined): boolean =>
  !!entity && ACTIVE_STATES.has(entity.state);

export const isAvailable = (entity: HassEntity | undefined): boolean =>
  !!entity && !UNAVAILABLE_STATES.has(entity.state);

/** Sonos lists the group coordinator first in `group_members`. */
export const groupMembers = (hass: HomeAssistant, entityId: string): string[] => {
  const members: unknown = hass.states[entityId]?.attributes.group_members;
  return Array.isArray(members) &&
    members.length > 0 &&
    members.every((member): member is string => typeof member === "string")
    ? members
    : [entityId];
};

export const coordinatorOf = (hass: HomeAssistant, entityId: string): string =>
  groupMembers(hass, entityId)[0];

/**
 * Resolves the entity that should receive playback commands. Commands always
 * target a group coordinator so that existing Sonos groups stay intact.
 * `preferred` overrides the configuration, e.g. after a master handoff.
 */
export const resolveCoordinator = (
  hass: HomeAssistant,
  config: SonosRadioCardConfig,
  preferred?: string,
): string | undefined => {
  if (preferred && isAvailable(hass.states[preferred])) {
    return coordinatorOf(hass, preferred);
  }

  if (config.master_entity && isAvailable(hass.states[config.master_entity])) {
    return coordinatorOf(hass, config.master_entity);
  }

  const coordinators = unique(
    config.speakers
      .map((speaker) => speaker.entity)
      .filter((entityId) => entityId.length > 0)
      .map((entityId) => coordinatorOf(hass, entityId)),
  );

  return (
    coordinators.find((id) => hass.states[id]?.state === "playing") ??
    coordinators.find((id) => isActiveState(hass.states[id])) ??
    coordinators.find((id) => isAvailable(hass.states[id])) ??
    // Nothing is reachable: keep the configured master so the UI can say so.
    (config.master_entity || undefined) ??
    coordinators[0]
  );
};

// Sonos rewrites stream URLs (e.g. to x-rincon-mp3radio://), so compare
// identifiers without their scheme.
const normalizeContentId = (value: string): string =>
  value
    .trim()
    .replace(/^[a-z][a-z0-9+.-]*:(\/\/)?/i, "")
    .replace(/\/+$/, "")
    .toLowerCase();

const normalizeText = (value: string): string => value.trim().toLowerCase();

export const findActiveStationIndex = (
  stations: SonosStationConfig[],
  entity: HassEntity | undefined,
): number => {
  if (!isActiveState(entity)) {
    return -1;
  }

  const contentId = stringAttribute(entity, "media_content_id");
  if (contentId) {
    const normalizedId = normalizeContentId(contentId);
    const index = stations.findIndex(
      (station) =>
        station.media_content_id.length > 0 &&
        normalizeContentId(station.media_content_id) === normalizedId,
    );
    if (index >= 0) {
      return index;
    }
  }

  const titles = ["media_channel", "media_title"]
    .map((name) => stringAttribute(entity, name))
    .filter((title): title is string => !!title)
    .map(normalizeText);

  return stations.findIndex(
    (station) =>
      station.name.trim().length > 0 &&
      titles.includes(normalizeText(station.name)),
  );
};

const volumeOf = (hass: HomeAssistant, entityId: string): number | undefined => {
  const volume = hass.states[entityId]?.attributes.volume_level;
  return typeof volume === "number" ? volume : undefined;
};

export const groupVolume = (
  hass: HomeAssistant,
  members: string[],
): number | undefined => {
  const volumes = members
    .map((member) => volumeOf(hass, member))
    .filter((volume): volume is number => volume !== undefined);
  return volumes.length > 0
    ? volumes.reduce((sum, volume) => sum + volume, 0) / volumes.length
    : undefined;
};

/**
 * Shifts every member by the same offset so that relative volume differences
 * between rooms are preserved. The extremes are applied to all members.
 */
export const planGroupVolume = (
  hass: HomeAssistant,
  members: string[],
  target: number,
): VolumeCommand[] => {
  const level = clamp(target);
  const current = groupVolume(hass, members);

  return members.map((entityId) => {
    const volume = volumeOf(hass, entityId);
    const next =
      level <= 0 || level >= 1 || current === undefined || volume === undefined
        ? level
        : clamp(volume + level - current);
    return { entity_id: entityId, volume_level: Math.round(next * 100) / 100 };
  });
};

export const formatGroupName = (names: string[]): string =>
  names.length <= 1
    ? (names[0] ?? "")
    : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;

export type RemovalPlan =
  | { type: "unjoin"; entity: string }
  | { type: "blocked"; entity: string }
  | {
      type: "handoff";
      entity: string;
      newMaster: string;
      remaining: string[];
    };

/**
 * Plans how to remove a speaker from its group. Removing the coordinator hands
 * the group over to another member so playback continues in the other rooms.
 * `preferredOrder` (usually the configured speakers) decides the new master.
 */
export const planSpeakerRemoval = (
  hass: HomeAssistant,
  entityId: string,
  preferredOrder: string[] = [],
): RemovalPlan => {
  const members = groupMembers(hass, entityId);
  if (members.length <= 1) {
    return { type: "blocked", entity: entityId };
  }
  if (members[0] !== entityId) {
    return { type: "unjoin", entity: entityId };
  }

  const remaining = members.filter((member) => member !== entityId);
  const rank = (id: string): number => {
    const index = preferredOrder.indexOf(id);
    return index === -1 ? preferredOrder.length : index;
  };
  const candidates = [...remaining].sort((a, b) => rank(a) - rank(b));
  const newMaster =
    candidates.find((id) => isAvailable(hass.states[id])) ?? candidates[0];

  return { type: "handoff", entity: entityId, newMaster, remaining };
};

export type NoticeLevel = "error" | "warning" | "info";

export interface Notice {
  level: NoticeLevel;
  message: string;
}

// Sonos accepts many URI schemes (http(s), x-rincon-mp3radio:, plex://,
// media-source://, …), so only IDs without any scheme are flagged.
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

/** Returns a hint when a station cannot (or probably cannot) be played. */
export const stationIssue = (
  station: SonosStationConfig,
  t: Translate,
): string | undefined => {
  const id = station.media_content_id?.trim() ?? "";
  const type = station.media_content_type || "music";
  if (!id) {
    return type === "favorite_item_id"
      ? t("issue.no_favorite")
      : t("issue.no_url");
  }
  if (type === "favorite_item_id") {
    return /^https?:\/\//i.test(id) ? t("issue.url_as_favorite") : undefined;
  }
  if (type === "music") {
    if (/^https?:\/\//i.test(id) && /\s/.test(id)) {
      return t("issue.url_spaces");
    }
    if (!HAS_SCHEME.test(id)) {
      return t("issue.url_scheme");
    }
  }
  return undefined;
};

/**
 * Collects configuration and availability problems that should be shown on
 * the card. `name` maps entity IDs to display names.
 */
export const collectNotices = (
  hass: HomeAssistant,
  config: SonosRadioCardConfig,
  coordinatorId: string | undefined,
  name: (entityId: string) => string,
  t: Translate,
): Notice[] => {
  const notices: Notice[] = [];
  const speakers = config.speakers
    .map((speaker) => speaker.entity)
    .filter((entityId) => entityId.length > 0);
  const configured = unique(
    [config.master_entity ?? "", ...speakers].filter((id) => id.length > 0),
  );

  if (configured.length === 0) {
    return [{ level: "error", message: t("notice.no_speakers") }];
  }

  for (const entityId of configured) {
    if (!entityId.startsWith("media_player.")) {
      notices.push({
        level: "warning",
        message: t("notice.not_media_player", { entity: entityId }),
      });
    } else if (!hass.states[entityId]) {
      notices.push({
        level: "warning",
        message: t("notice.not_found", { entity: entityId }),
      });
    }
  }

  const known = configured.filter((id) => hass.states[id]);
  if (known.length > 0 && !known.some((id) => isAvailable(hass.states[id]))) {
    notices.push({
      level: "error",
      message:
        known.length === 1
          ? t("notice.speaker_unavailable", { name: name(known[0]) })
          : t("notice.all_unavailable"),
    });
    return notices;
  }

  const master = config.master_entity;
  if (
    master &&
    hass.states[master] &&
    !isAvailable(hass.states[master]) &&
    coordinatorId &&
    coordinatorId !== master
  ) {
    notices.push({
      level: "info",
      message: t("notice.master_fallback", {
        master: name(master),
        name: name(coordinatorId),
      }),
    });
  }

  return notices;
};
