import type { HomeAssistant } from "./types.js";

export interface BrowseMediaItem {
  title: string;
  media_class?: string;
  media_content_id: string;
  media_content_type: string;
  can_expand: boolean;
  can_play: boolean;
  thumbnail?: string | null;
  children?: BrowseMediaItem[];
}

export interface SonosFavorite {
  id: string;
  title: string;
  thumbnail?: string;
}

const FAVORITE_TYPE = "favorite_item_id";

const absoluteUrl = (value: unknown): string | undefined =>
  typeof value === "string" && /^https?:\/\//i.test(value) ? value : undefined;

const browsePlayer = (
  hass: HomeAssistant,
  entityId: string,
  media_content_type: string,
  media_content_id: string,
): Promise<BrowseMediaItem> =>
  hass.callWS<BrowseMediaItem>({
    type: "media_player/browse_media",
    entity_id: entityId,
    media_content_type,
    media_content_id,
  });

const favoritesFromSensor = (hass: HomeAssistant): SonosFavorite[] => {
  for (const [entityId, entity] of Object.entries(hass.states)) {
    const items = entity.attributes.items;
    if (
      entityId.startsWith("sensor.") &&
      entityId.includes("sonos_favorites") &&
      items &&
      typeof items === "object"
    ) {
      return Object.entries(items as Record<string, unknown>).map(
        ([id, title]) => ({ id, title: typeof title === "string" ? title : id }),
      );
    }
  }
  return [];
};

/**
 * Loads the "My Sonos" favorites through the media browser of the first
 * reachable speaker (with artwork), falling back to `sensor.sonos_favorites`.
 */
export const loadSonosFavorites = async (
  hass: HomeAssistant,
  entityIds: string[],
): Promise<SonosFavorite[]> => {
  let lastError: unknown;
  for (const entityId of entityIds) {
    if (!hass.states[entityId]) {
      continue;
    }
    try {
      const root = await browsePlayer(hass, entityId, "favorites", "");
      const items: BrowseMediaItem[] = [];
      for (const child of root.children ?? []) {
        if (child.media_content_type === FAVORITE_TYPE) {
          items.push(child);
        } else if (child.can_expand) {
          const folder = await browsePlayer(
            hass,
            entityId,
            child.media_content_type,
            child.media_content_id,
          );
          items.push(
            ...(folder.children ?? []).filter(
              (item) => item.media_content_type === FAVORITE_TYPE,
            ),
          );
        }
      }
      return items.map((item) => ({
        id: item.media_content_id,
        title: item.title,
        thumbnail: absoluteUrl(item.thumbnail),
      }));
    } catch (error) {
      lastError = error;
    }
  }

  const fromSensor = favoritesFromSensor(hass);
  if (fromSensor.length > 0 || lastError === undefined) {
    return fromSensor;
  }
  throw lastError instanceof Error ? lastError : new Error("Browse failed");
};

/** Browses Home Assistant media sources; omit `id` for the root. */
export const browseMediaSource = (
  hass: HomeAssistant,
  id?: string,
): Promise<BrowseMediaItem> =>
  hass.callWS<BrowseMediaItem>(
    id
      ? { type: "media_source/browse_media", media_content_id: id }
      : { type: "media_source/browse_media" },
  );

export const isImage = (item: BrowseMediaItem): boolean =>
  item.media_class === "image" || item.media_content_type.startsWith("image/");
