const en = {
  "card.description": "Control Sonos speakers and radio stations.",
  "card.unnamed": "Unnamed",
  "card.this_station": "This station",
  "card.the_station": "The station",
  "card.service_failed": "Failed to call media_player.{service}.",
  "card.station_not_set_up": "{name}: {issue} Add it in the card editor.",
  "card.station_failed": "Could not start {name}.",
  "card.station_timeout":
    "{name} did not start. Check that the stream URL is reachable and uses a format Sonos supports (MP3, AAC or HLS).",
  "card.volume_failed": "Could not change the volume of {name}.",
  "card.join_failed": "Could not add {name} to the group.",
  "card.unjoin_failed": "Could not remove {name} from the group.",
  "card.dismiss": "Dismiss",
  "card.empty_title": "No radio stations yet",
  "card.empty_text":
    "Edit the card and add stations with a stream URL or a Sonos favorite.",
  "card.playing": "Playing",
  "card.paused": "Paused",
  "card.starting": "Starting",
  "card.check_url": "Check URL",
  "card.not_set_up": "Not set up",
  "card.unknown_stream": "Unknown stream",
  "card.nothing_playing": "Nothing playing",
  "card.speaker_unavailable": "Speaker unavailable",
  "card.no_speaker_configured": "No speaker configured",
  "card.not_in_station_list": "Not in your station list",
  "card.no_speaker": "No speaker",
  "card.play": "Play",
  "card.pause": "Pause",
  "card.stop": "Stop",
  "card.group_volume": "Group volume",
  "card.multiroom": "Multiroom",
  "card.group_speakers": "Group speakers",
  "card.sonos_group": "Sonos group: {name}",
  "card.no_active_group": "No active group",
  "card.close": "Close",
  "card.room_in_group": "{name} in group",
  "card.room_volume": "{name} volume",
  "room.not_found": "Not found in Home Assistant",
  "room.unavailable": "Unavailable – check power and network",
  "room.leaving": "Leaving group…",
  "room.joining": "Joining group…",
  "room.master_only": "Master · only room in group",
  "room.master": "Group master",
  "room.in_group": "In group",
  "room.not_in_group": "Not in group",
  "issue.no_favorite": "No Sonos favorite selected.",
  "issue.no_url": "No stream URL set.",
  "issue.url_as_favorite":
    "This looks like a URL. Set the type to “Stream URL”.",
  "issue.url_spaces": "The stream URL contains spaces.",
  "issue.url_scheme": "The stream URL should start with http:// or https://.",
  "notice.no_speakers":
    "No Sonos speakers configured. Edit the card to add at least one speaker.",
  "notice.not_media_player":
    "{entity} is not a media player. Pick a Sonos media_player entity in the card editor.",
  "notice.not_found":
    "{entity} was not found in Home Assistant. Check the entity ID in the card editor.",
  "notice.speaker_unavailable":
    "{name} is unavailable. Make sure the speaker is powered on and connected to your network.",
  "notice.all_unavailable":
    "All Sonos speakers are unavailable. Check power, network, and the Sonos integration in Home Assistant.",
  "notice.master_fallback":
    "Default speaker {master} is unavailable, using {name} instead.",
  "editor.general": "General and speakers",
  "editor.title": "Card title",
  "editor.master": "Default master speaker",
  "editor.master_helper":
    "Leave empty to automatically detect the current Sonos group master.",
  "editor.speakers": "Sonos speakers",
  "editor.speaker_n": "Speaker {n}",
  "editor.speaker_up": "Move speaker up",
  "editor.speaker_down": "Move speaker down",
  "editor.speaker_remove": "Remove speaker",
  "editor.speaker_entity": "Speaker entity",
  "editor.display_name": "Display name",
  "editor.icon": "Icon",
  "editor.add_speaker": "Add speaker",
  "editor.stations": "Radio stations",
  "editor.station_n": "Station {n}",
  "editor.station_up": "Move station up",
  "editor.station_down": "Move station down",
  "editor.station_remove": "Remove station",
  "editor.station_name": "Station name",
  "editor.content_type": "Media content type",
  "editor.type_music": "Stream URL (music / Radio Browser)",
  "editor.type_favorite": "Sonos favorite",
  "editor.content_id": "Stream URL / media content ID",
  "editor.content_id_placeholder": "https://... or Sonos favorite ID",
  "editor.logo": "Logo URL or media-source",
  "editor.logo_placeholder": "https://... or media-source://...",
  "editor.helper_favorite":
    "Pick a favorite or enter the Sonos favorite ID (for example FV:2/12).",
  "editor.helper_music":
    "Radio Browser stations use their stream URL with the “music” media content type.",
  "editor.add_station": "Add station",
  "editor.favorite": "Sonos favorite",
  "editor.favorites_loading": "Loading Sonos favorites…",
  "editor.favorites_failed":
    "Could not load Sonos favorites. Enter the favorite ID manually.",
  "editor.favorites_empty":
    "No Sonos favorites found. Add favorites in the Sonos app.",
  "editor.favorites_reload": "Reload favorites",
  "editor.search_title": "Find stations on Radio Browser",
  "editor.search_label": "Station name",
  "editor.search": "Search",
  "editor.search_helper":
    "Searches the public radio-browser.info directory. Only the search term is sent.",
  "editor.search_empty": "No stations found.",
  "editor.search_failed": "Radio Browser is not reachable. Try again later.",
  "editor.search_add": "Add",
  "editor.search_added": "Added",
  "editor.browse_logo": "Pick logo from media",
  "editor.browse_title": "Media",
  "editor.browse_back": "Back",
  "editor.browse_close": "Close media browser",
  "editor.browse_empty": "This folder contains no images.",
  "editor.browse_failed": "Could not open the media browser.",
  "editor.browse_loading": "Loading…",
} as const;

export type TranslationKey = keyof typeof en;
export type TranslationVars = Record<string, string | number>;
export type Translate = (key: TranslationKey, vars?: TranslationVars) => string;

const de: Record<TranslationKey, string> = {
  "card.description": "Sonos-Lautsprecher und Radiosender steuern.",
  "card.unnamed": "Ohne Namen",
  "card.this_station": "Dieser Sender",
  "card.the_station": "Der Sender",
  "card.service_failed": "media_player.{service} ist fehlgeschlagen.",
  "card.station_not_set_up": "{name}: {issue} Ergänze ihn im Karteneditor.",
  "card.station_failed": "{name} konnte nicht gestartet werden.",
  "card.station_timeout":
    "{name} startet nicht. Prüfe, ob die Stream-URL erreichbar ist und ein von Sonos unterstütztes Format nutzt (MP3, AAC oder HLS).",
  "card.volume_failed": "Die Lautstärke von {name} konnte nicht geändert werden.",
  "card.join_failed": "{name} konnte nicht zur Gruppe hinzugefügt werden.",
  "card.unjoin_failed": "{name} konnte nicht aus der Gruppe entfernt werden.",
  "card.dismiss": "Schließen",
  "card.empty_title": "Noch keine Radiosender",
  "card.empty_text":
    "Bearbeite die Karte und füge Sender mit Stream-URL oder Sonos-Favorit hinzu.",
  "card.playing": "Läuft",
  "card.paused": "Pausiert",
  "card.starting": "Startet",
  "card.check_url": "URL prüfen",
  "card.not_set_up": "Nicht eingerichtet",
  "card.unknown_stream": "Unbekannter Stream",
  "card.nothing_playing": "Keine Wiedergabe",
  "card.speaker_unavailable": "Lautsprecher nicht verfügbar",
  "card.no_speaker_configured": "Kein Lautsprecher eingerichtet",
  "card.not_in_station_list": "Nicht in deiner Senderliste",
  "card.no_speaker": "Kein Lautsprecher",
  "card.play": "Wiedergabe",
  "card.pause": "Pause",
  "card.stop": "Stopp",
  "card.group_volume": "Gruppenlautstärke",
  "card.multiroom": "Multiroom",
  "card.group_speakers": "Lautsprecher gruppieren",
  "card.sonos_group": "Sonos-Gruppe: {name}",
  "card.no_active_group": "Keine aktive Gruppe",
  "card.close": "Schließen",
  "card.room_in_group": "{name} in der Gruppe",
  "card.room_volume": "Lautstärke {name}",
  "room.not_found": "In Home Assistant nicht gefunden",
  "room.unavailable": "Nicht verfügbar – Strom und Netzwerk prüfen",
  "room.leaving": "Verlässt die Gruppe…",
  "room.joining": "Tritt der Gruppe bei…",
  "room.master": "Gruppen-Master",
  "room.master_only": "Master · einziger Raum in der Gruppe",
  "room.in_group": "In der Gruppe",
  "room.not_in_group": "Nicht in der Gruppe",
  "issue.no_favorite": "Kein Sonos-Favorit ausgewählt.",
  "issue.no_url": "Keine Stream-URL angegeben.",
  "issue.url_as_favorite":
    "Das sieht nach einer URL aus. Stelle den Typ auf „Stream-URL“.",
  "issue.url_spaces": "Die Stream-URL enthält Leerzeichen.",
  "issue.url_scheme": "Die Stream-URL sollte mit http:// oder https:// beginnen.",
  "notice.no_speakers":
    "Keine Sonos-Lautsprecher eingerichtet. Bearbeite die Karte und füge mindestens einen Lautsprecher hinzu.",
  "notice.not_media_player":
    "{entity} ist kein Media-Player. Wähle im Karteneditor eine Sonos-media_player-Entität.",
  "notice.not_found":
    "{entity} wurde in Home Assistant nicht gefunden. Prüfe die Entitäts-ID im Karteneditor.",
  "notice.speaker_unavailable":
    "{name} ist nicht verfügbar. Prüfe, ob der Lautsprecher eingeschaltet und mit dem Netzwerk verbunden ist.",
  "notice.all_unavailable":
    "Alle Sonos-Lautsprecher sind nicht verfügbar. Prüfe Strom, Netzwerk und die Sonos-Integration in Home Assistant.",
  "notice.master_fallback":
    "Standard-Lautsprecher {master} ist nicht verfügbar, stattdessen wird {name} verwendet.",
  "editor.general": "Allgemein und Lautsprecher",
  "editor.title": "Kartentitel",
  "editor.master": "Standard-Master-Lautsprecher",
  "editor.master_helper":
    "Leer lassen, um den aktuellen Master der Sonos-Gruppe automatisch zu erkennen.",
  "editor.speakers": "Sonos-Lautsprecher",
  "editor.speaker_n": "Lautsprecher {n}",
  "editor.speaker_up": "Lautsprecher nach oben",
  "editor.speaker_down": "Lautsprecher nach unten",
  "editor.speaker_remove": "Lautsprecher entfernen",
  "editor.speaker_entity": "Lautsprecher-Entität",
  "editor.display_name": "Anzeigename",
  "editor.icon": "Symbol",
  "editor.add_speaker": "Lautsprecher hinzufügen",
  "editor.stations": "Radiosender",
  "editor.station_n": "Sender {n}",
  "editor.station_up": "Sender nach oben",
  "editor.station_down": "Sender nach unten",
  "editor.station_remove": "Sender entfernen",
  "editor.station_name": "Sendername",
  "editor.content_type": "Medientyp",
  "editor.type_music": "Stream-URL (music / Radio Browser)",
  "editor.type_favorite": "Sonos-Favorit",
  "editor.content_id": "Stream-URL / Medien-ID",
  "editor.content_id_placeholder": "https://... oder Sonos-Favoriten-ID",
  "editor.logo": "Logo-URL oder media-source",
  "editor.logo_placeholder": "https://... oder media-source://...",
  "editor.helper_favorite":
    "Wähle einen Favoriten oder gib die Sonos-Favoriten-ID ein (z. B. FV:2/12).",
  "editor.helper_music":
    "Radio-Browser-Sender nutzen ihre Stream-URL mit dem Medientyp „music“.",
  "editor.add_station": "Sender hinzufügen",
  "editor.favorite": "Sonos-Favorit",
  "editor.favorites_loading": "Sonos-Favoriten werden geladen…",
  "editor.favorites_failed":
    "Sonos-Favoriten konnten nicht geladen werden. Gib die Favoriten-ID manuell ein.",
  "editor.favorites_empty":
    "Keine Sonos-Favoriten gefunden. Lege Favoriten in der Sonos-App an.",
  "editor.favorites_reload": "Favoriten neu laden",
  "editor.search_title": "Sender bei Radio Browser suchen",
  "editor.search_label": "Sendername",
  "editor.search": "Suchen",
  "editor.search_helper":
    "Durchsucht das öffentliche Verzeichnis radio-browser.info. Es wird nur der Suchbegriff übertragen.",
  "editor.search_empty": "Keine Sender gefunden.",
  "editor.search_failed":
    "Radio Browser ist nicht erreichbar. Versuche es später erneut.",
  "editor.search_add": "Hinzufügen",
  "editor.search_added": "Hinzugefügt",
  "editor.browse_logo": "Logo aus Medien wählen",
  "editor.browse_title": "Medien",
  "editor.browse_back": "Zurück",
  "editor.browse_close": "Medienbrowser schließen",
  "editor.browse_empty": "Dieser Ordner enthält keine Bilder.",
  "editor.browse_failed": "Der Medienbrowser konnte nicht geöffnet werden.",
  "editor.browse_loading": "Wird geladen…",
};

const TRANSLATIONS: Record<string, Record<TranslationKey, string>> = { en, de };

const format = (template: string, vars?: TranslationVars): string =>
  vars
    ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in vars ? String(vars[name]) : match,
      )
    : template;

/** Returns a translator for `language` (e.g. "de-AT"), falling back to English. */
export const createTranslator = (language?: string): Translate => {
  const base = (language ?? "en").toLowerCase().split("-")[0];
  const strings = TRANSLATIONS[base] ?? en;
  return (key, vars) => format(strings[key] ?? en[key], vars);
};

export const languageOf = (hass?: {
  locale?: { language?: string };
  language?: string;
}): string | undefined => hass?.locale?.language ?? hass?.language;
