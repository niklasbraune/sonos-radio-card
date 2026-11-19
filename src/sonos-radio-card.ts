import { LitElement, css, html, nothing } from "lit";
import type { PropertyValues } from "lit";
import { live } from "lit/directives/live.js";
import type {
  HassEntity,
  HomeAssistant,
  SonosRadioCardConfig,
  SonosSpeakerConfig,
  SonosStationConfig,
} from "./types.js";
import {
  collectNotices,
  coordinatorOf,
  findActiveStationIndex,
  formatGroupName,
  groupMembers,
  groupVolume,
  isActiveState,
  isAvailable,
  planGroupVolume,
  planSpeakerRemoval,
  resolveCoordinator,
  stationIssue,
} from "./sonos.js";
import type { Notice, RemovalPlan } from "./sonos.js";
import { createTranslator, languageOf } from "./localize.js";
import type { Translate } from "./localize.js";
import { VolumeThrottle } from "./volume.js";
import "./editor.js";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

interface Waiter {
  check: (hass: HomeAssistant) => boolean;
  resolve: (matched: boolean) => void;
  timer: number;
}

interface SwipeState {
  pointerId: number;
  startX: number;
  startY: number;
  startTime: number;
  active: boolean;
  offset: number;
}

const MEDIA_SOURCE_PREFIX = "media-source://";
// Unit and component tests load the sources without the Rollup replacement.
export const CARD_VERSION =
  typeof __VERSION__ === "string" ? __VERSION__ : "dev";
const GROUP_VOLUME_KEY = "__group__";
const PENDING_TIMEOUT_MS = 10000;
const VOLUME_THROTTLE_MS = 300;
const VOLUME_HOLD_MS = 2500;
const TOAST_TIMEOUT_MS = 8000;
const GROUP_CHANGE_TIMEOUT_MS = 8000;
const HANDOFF_SETTLE_MS = 3000;
const DRAWER_ANIMATION_MS = 220;
const SWIPE_SLOP_PX = 10;
const SWIPE_CLOSE_RATIO = 0.3;
const SWIPE_CLOSE_VELOCITY = 0.5;

const NOTICE_ICONS: Record<Notice["level"], string> = {
  error: "mdi:alert-circle-outline",
  warning: "mdi:alert-outline",
  info: "mdi:information-outline",
};

/** HA rejects service calls with `{ code, message }` objects, not Errors. */
const errorMessage = (error: unknown): string | undefined => {
  const message =
    error && typeof error === "object" && "message" in error
      ? error.message
      : undefined;
  return typeof message === "string" && message.length > 0
    ? message
    : undefined;
};

export class SonosRadioCard extends LitElement {
  static properties = {
    _config: { state: true },
    _drawerOpen: { state: true },
    _drawerClosing: { state: true },
    _pendingStation: { state: true },
    _membershipTargets: { state: true },
    _coordinatorOverride: { state: true },
    _toast: { state: true },
    _logoUrls: { state: true },
    _brokenLogos: { state: true },
  };

  private _config?: SonosRadioCardConfig;
  private _hass?: HomeAssistant;
  private _drawerOpen = false;
  private _drawerClosing = false;
  private _volume = new VolumeThrottle(
    (key, level) => this._sendVolume(key, level),
    () => this.requestUpdate(),
    { intervalMs: VOLUME_THROTTLE_MS, holdMs: VOLUME_HOLD_MS },
  );
  private _pendingStation?: number;
  private _membershipTargets: Record<string, boolean> = {};
  private _coordinatorOverride?: string;
  private _toast?: Notice;
  private _logoUrls: Record<string, string> = {};
  private _brokenLogos: string[] = [];
  private _resolvingLogos = new Set<string>();
  private _waiters = new Set<Waiter>();
  private _swipe?: SwipeState;
  private _pendingTimer?: number;
  private _toastTimer?: number;
  private _drawerTimer?: number;
  private _translator?: { language: string | undefined; t: Translate };

  setConfig(config: SonosRadioCardConfig): void {
    if (
      !config ||
      config.type !== "custom:sonos-radio-card" ||
      !Array.isArray(config.speakers) ||
      !Array.isArray(config.stations)
    ) {
      throw new Error(
        "Invalid Sonos Radio Card configuration: type, speakers, and stations are required.",
      );
    }

    this._config = config;
    this._coordinatorOverride = undefined;
  }

  set hass(hass: HomeAssistant) {
    const previous = this._hass;
    this._hass = hass;
    for (const waiter of [...this._waiters]) {
      if (waiter.check(hass)) {
        this._settleWaiter(waiter, true);
      }
    }
    this.requestUpdate("hass", previous);
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  static getStubConfig(): SonosRadioCardConfig {
    return {
      type: "custom:sonos-radio-card",
      speakers: [],
      stations: [],
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("sonos-radio-card-editor");
  }

  /** Height in 50 px units for the masonry view. */
  getCardSize(): number {
    const height = this.offsetHeight;
    if (height > 0) {
      return Math.max(1, Math.ceil(height / 50));
    }
    // Estimate before the first layout: four 150 px tiles per row plus the
    // control bar and the optional title.
    const rows = Math.ceil((this._config?.stations.length ?? 0) / 4);
    return (this._config?.title ? 1 : 0) + Math.max(rows, 1) * 3 + 2;
  }

  /** Size in the sections view: full width by default, height follows content. */
  getGridOptions(): {
    columns: number;
    rows: "auto";
    min_columns: number;
  } {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }

  private get _t(): Translate {
    const language = languageOf(this._hass);
    if (!this._translator || this._translator.language !== language) {
      this._translator = { language, t: createTranslator(language) };
    }
    return this._translator.t;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._volume.dispose();
    window.clearTimeout(this._pendingTimer);
    window.clearTimeout(this._toastTimer);
    window.clearTimeout(this._drawerTimer);
    for (const waiter of [...this._waiters]) {
      this._settleWaiter(waiter, false);
    }
    window.removeEventListener("keydown", this._handleKeydown);
  }

  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("hass") || changed.has("_config")) {
      this._resolveLogos();
      for (const key of this._volume.keys()) {
        this._volume.reconcile(key, this._actualVolume(key));
      }

      if (
        this._pendingStation !== undefined &&
        this._pendingStation === this._activeStationIndex()
      ) {
        this._clearPending();
      }
    }

    if (changed.has("_drawerOpen")) {
      if (this._drawerOpen) {
        window.addEventListener("keydown", this._handleKeydown);
      } else {
        window.removeEventListener("keydown", this._handleKeydown);
      }
    }
  }

  protected updated(changed: PropertyValues): void {
    // The initial render reports `undefined` as the previous value.
    if (changed.get("_drawerOpen") === undefined) {
      return;
    }
    const target = this._drawerOpen ? ".drawer .close" : ".multiroom";
    this.renderRoot.querySelector<HTMLElement>(target)?.focus();
  }

  private get _coordinatorId(): string | undefined {
    return this._hass && this._config
      ? resolveCoordinator(this._hass, this._config, this._coordinatorOverride)
      : undefined;
  }

  private get _coordinator(): HassEntity | undefined {
    const id = this._coordinatorId;
    return id ? this._hass?.states[id] : undefined;
  }

  private get _members(): string[] {
    const id = this._coordinatorId;
    return id && this._hass ? groupMembers(this._hass, id) : [];
  }

  private _activeStationIndex(): number {
    return this._config
      ? findActiveStationIndex(this._config.stations, this._coordinator)
      : -1;
  }

  private _speakerName(entityId: string, speaker?: SonosSpeakerConfig): string {
    const configured =
      speaker ?? this._config?.speakers.find((item) => item.entity === entityId);
    const friendlyName = this._hass?.states[entityId]?.attributes.friendly_name;
    return (
      configured?.name ??
      (typeof friendlyName === "string" ? friendlyName : undefined) ??
      entityId
    );
  }

  private async _callService(
    service: string,
    data: Record<string, unknown>,
    failure?: string,
  ): Promise<boolean> {
    if (!this._hass) {
      return false;
    }

    try {
      await this._hass.callService("media_player", service, data);
      return true;
    } catch (error) {
      const detail = errorMessage(error);
      const prefix = failure ?? this._t("card.service_failed", { service });
      this._showToast(detail ? `${prefix} ${detail}` : prefix);
      return false;
    }
  }

  private _showToast(message: string, level: Notice["level"] = "error"): void {
    this._toast = { level, message };
    window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(
      () => this._dismissToast(),
      TOAST_TIMEOUT_MS,
    );
  }

  private _dismissToast(): void {
    window.clearTimeout(this._toastTimer);
    this._toast = undefined;
  }

  private _clearPending(): void {
    window.clearTimeout(this._pendingTimer);
    this._pendingStation = undefined;
  }

  private _pendingTimedOut(index: number): void {
    const station = this._config?.stations[index];
    const stillPending = this._pendingStation === index;
    this._clearPending();
    // Matching can fail for streams that Sonos renames, so only complain if
    // nothing is playing at all.
    if (stillPending && station && this._coordinator?.state !== "playing") {
      this._showToast(
        this._t("card.station_timeout", {
          name: station.name || this._t("card.the_station"),
        }),
        "warning",
      );
    }
  }

  private async _playStation(index: number): Promise<void> {
    const station = this._config?.stations[index];
    const entityId = this._coordinatorId;
    if (!station || !entityId) {
      return;
    }
    if (!station.media_content_id?.trim()) {
      this._showToast(
        this._t("card.station_not_set_up", {
          name: station.name || this._t("card.this_station"),
          issue: stationIssue(station, this._t) ?? "",
        }),
        "warning",
      );
      return;
    }

    this._pendingStation = index;
    window.clearTimeout(this._pendingTimer);
    this._pendingTimer = window.setTimeout(
      () => this._pendingTimedOut(index),
      PENDING_TIMEOUT_MS,
    );

    const played = await this._callService(
      "play_media",
      {
        entity_id: entityId,
        media_content_id: station.media_content_id.trim(),
        media_content_type: station.media_content_type || "music",
      },
      this._t("card.station_failed", {
        name: station.name || this._t("card.the_station"),
      }),
    );
    if (!played) {
      this._clearPending();
    }
  }

  private _playPause(): void {
    const entityId = this._coordinatorId;
    if (entityId) {
      void this._callService("media_play_pause", { entity_id: entityId });
    }
  }

  private _stop(): void {
    const entityId = this._coordinatorId;
    if (entityId) {
      this._clearPending();
      void this._callService("media_stop", { entity_id: entityId });
    }
  }

  private _sliderLevel(event: Event): number {
    return Number((event.target as HTMLInputElement).value) / 100;
  }

  private _volumeInput(key: string, event: Event): void {
    this._volume.input(key, this._sliderLevel(event));
  }

  private _commitVolume(key: string, event: Event): void {
    this._volume.commit(key, this._sliderLevel(event));
  }

  private _actualVolume(key: string): number | undefined {
    if (!this._hass) {
      return undefined;
    }
    if (key === GROUP_VOLUME_KEY) {
      return groupVolume(this._hass, this._members);
    }
    const volume = this._hass.states[key]?.attributes.volume_level;
    return typeof volume === "number" ? volume : undefined;
  }

  private async _sendVolume(key: string, level: number): Promise<boolean> {
    if (!this._hass) {
      return false;
    }
    const commands =
      key === GROUP_VOLUME_KEY
        ? planGroupVolume(this._hass, this._members, level)
        : [{ entity_id: key, volume_level: level }];
    const results = await Promise.all(
      commands.map((command) =>
        this._callService(
          "volume_set",
          { ...command },
          this._t("card.volume_failed", {
            name: this._speakerName(command.entity_id),
          }),
        ),
      ),
    );
    return results.every(Boolean);
  }

  private _waitFor(
    check: (hass: HomeAssistant) => boolean,
    timeoutMs = GROUP_CHANGE_TIMEOUT_MS,
  ): Promise<boolean> {
    if (this._hass && check(this._hass)) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const waiter: Waiter = {
        check,
        resolve,
        timer: window.setTimeout(
          () => this._settleWaiter(waiter, false),
          timeoutMs,
        ),
      };
      this._waiters.add(waiter);
    });
  }

  private _settleWaiter(waiter: Waiter, matched: boolean): void {
    window.clearTimeout(waiter.timer);
    this._waiters.delete(waiter);
    waiter.resolve(matched);
  }

  private _currentMedia():
    | { media_content_id: string; media_content_type: string }
    | undefined {
    const station = this._config?.stations[this._activeStationIndex()];
    if (station?.media_content_id) {
      return {
        media_content_id: station.media_content_id,
        media_content_type: station.media_content_type || "music",
      };
    }

    const attributes = this._coordinator?.attributes ?? {};
    const id = attributes.media_content_id;
    const type = attributes.media_content_type;
    return typeof id === "string" && id.length > 0
      ? {
          media_content_id: id,
          media_content_type: typeof type === "string" ? type : "music",
        }
      : undefined;
  }

  private async _toggleSpeaker(entityId: string, join: boolean): Promise<void> {
    if (entityId in this._membershipTargets) {
      return;
    }

    this._membershipTargets = { ...this._membershipTargets, [entityId]: join };
    try {
      if (join) {
        await this._joinSpeaker(entityId);
      } else {
        await this._removeSpeaker(entityId);
      }
    } finally {
      // Fall back to the real group state: confirmed, reverted or timed out.
      const { [entityId]: _done, ...rest } = this._membershipTargets;
      this._membershipTargets = rest;
    }
  }

  private async _joinSpeaker(entityId: string): Promise<void> {
    const master = this._coordinatorId;
    if (!master || master === entityId) {
      return;
    }

    const joined = await this._callService(
      "join",
      { entity_id: master, group_members: [entityId] },
      this._t("card.join_failed", { name: this._speakerName(entityId) }),
    );
    if (joined) {
      await this._waitFor((hass) =>
        groupMembers(hass, master).includes(entityId),
      );
    }
  }

  private async _removeSpeaker(entityId: string): Promise<void> {
    if (!this._hass || !this._config) {
      return;
    }

    const plan = planSpeakerRemoval(
      this._hass,
      entityId,
      this._config.speakers.map((speaker) => speaker.entity),
    );

    if (plan.type === "unjoin") {
      if (
        await this._callService(
          "unjoin",
          { entity_id: entityId },
          this._t("card.unjoin_failed", { name: this._speakerName(entityId) }),
        )
      ) {
        await this._waitFor(
          (hass) => groupMembers(hass, entityId).length <= 1,
        );
      }
    } else if (plan.type === "handoff") {
      await this._handoffAndRemove(plan);
    }
  }

  /**
   * Removes the group coordinator without silencing the remaining rooms:
   * Sonos usually promotes another member itself; otherwise the remaining
   * rooms are regrouped under the new master and the media is resumed there.
   */
  private async _handoffAndRemove(
    plan: Extract<RemovalPlan, { type: "handoff" }>,
  ): Promise<void> {
    const oldMaster = plan.entity;
    const wasPlaying = this._hass?.states[oldMaster]?.state === "playing";
    const media = this._currentMedia();
    const previousOverride = this._coordinatorOverride;

    this._coordinatorOverride = plan.newMaster;
    if (
      !(await this._callService(
        "unjoin",
        { entity_id: oldMaster },
        this._t("card.unjoin_failed", { name: this._speakerName(oldMaster) }),
      ))
    ) {
      this._coordinatorOverride = previousOverride;
      return;
    }

    await this._waitFor((hass) =>
      plan.remaining.every((id) => !groupMembers(hass, id).includes(oldMaster)),
    );
    if (wasPlaying) {
      await this._waitFor(
        (hass) =>
          plan.remaining.some((id) => hass.states[id]?.state === "playing"),
        HANDOFF_SETTLE_MS,
      );
    }

    const hass = this._hass!;
    const master =
      plan.remaining.find(
        (id) =>
          coordinatorOf(hass, id) === id &&
          hass.states[id]?.state === "playing",
      ) ?? plan.newMaster;
    this._coordinatorOverride = master;

    const missing = plan.remaining.filter(
      (id) =>
        id !== master &&
        !groupMembers(hass, master).includes(id) &&
        isAvailable(hass.states[id]),
    );
    if (missing.length > 0) {
      await this._callService("join", {
        entity_id: master,
        group_members: missing,
      });
    }

    if (wasPlaying && media && hass.states[master]?.state !== "playing") {
      await this._callService("play_media", { entity_id: master, ...media });
    }

    if (this._hass?.states[oldMaster]?.state === "playing") {
      await this._callService("media_stop", { entity_id: oldMaster });
    }
  }

  private _openDrawer(): void {
    window.clearTimeout(this._drawerTimer);
    this._drawerClosing = false;
    this._drawerOpen = true;
  }

  private _closeDrawer = (): void => {
    if (!this._drawerOpen || this._drawerClosing) {
      return;
    }

    this._swipe = undefined;
    const drawer = this._drawerElement;
    if (drawer) {
      drawer.classList.remove("dragging");
      drawer.style.transform = "";
    }
    this._drawerClosing = true;
    this._drawerTimer = window.setTimeout(() => {
      this._drawerOpen = false;
      this._drawerClosing = false;
    }, DRAWER_ANIMATION_MS);
  };

  private get _drawerElement(): HTMLElement | null {
    return this.renderRoot.querySelector(".drawer");
  }

  private _handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      this._closeDrawer();
    } else if (event.key === "Tab") {
      this._trapFocus(event);
    }
  };

  /** Keeps keyboard focus inside the open drawer (modal dialog). */
  private _trapFocus(event: KeyboardEvent): void {
    const focusable = [
      ...(this._drawerElement?.querySelectorAll<HTMLElement>(
        "button, input, ha-switch",
      ) ?? []),
    ].filter(
      (element) =>
        !(element as HTMLElement & { disabled?: boolean }).disabled,
    );
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.shadowRoot?.activeElement;
    const inside = focusable.some((element) => element === active);
    if (event.shiftKey && (active === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  }

  private _swipeStart(event: PointerEvent): void {
    if (
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0) ||
      // Sliders and switches need horizontal drags for themselves.
      event
        .composedPath()
        .some(
          (node) =>
            node instanceof HTMLElement &&
            (node.localName === "input" || node.localName === "ha-switch"),
        )
    ) {
      return;
    }

    this._swipe = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: event.timeStamp,
      active: false,
      offset: 0,
    };
  }

  private _swipeMove(event: PointerEvent): void {
    const swipe = this._swipe;
    const drawer = this._drawerElement;
    if (!swipe || swipe.pointerId !== event.pointerId || !drawer) {
      return;
    }

    const dx = event.clientX - swipe.startX;
    const dy = event.clientY - swipe.startY;
    if (!swipe.active) {
      if (Math.abs(dy) > SWIPE_SLOP_PX && Math.abs(dy) >= Math.abs(dx)) {
        this._swipe = undefined;
        return;
      }
      if (dx <= SWIPE_SLOP_PX || dx < Math.abs(dy)) {
        return;
      }
      swipe.active = true;
      drawer.setPointerCapture(event.pointerId);
      drawer.classList.add("dragging");
    }

    swipe.offset = Math.max(0, dx);
    drawer.style.transform = `translateX(${swipe.offset}px)`;
  }

  private _swipeEnd(event: PointerEvent): void {
    const swipe = this._swipe;
    const drawer = this._drawerElement;
    if (!swipe || swipe.pointerId !== event.pointerId) {
      return;
    }

    this._swipe = undefined;
    if (!swipe.active || !drawer) {
      return;
    }

    drawer.classList.remove("dragging");
    const elapsed = Math.max(1, event.timeStamp - swipe.startTime);
    if (
      event.type === "pointerup" &&
      (swipe.offset > drawer.offsetWidth * SWIPE_CLOSE_RATIO ||
        swipe.offset / elapsed > SWIPE_CLOSE_VELOCITY)
    ) {
      this._closeDrawer();
    } else {
      drawer.style.transform = "";
    }
  }

  private _resolveLogos(): void {
    const hass = this._hass;
    if (!hass || !this._config) {
      return;
    }

    for (const station of this._config.stations) {
      const logo = station.logo;
      if (
        !logo?.startsWith(MEDIA_SOURCE_PREFIX) ||
        logo in this._logoUrls ||
        this._resolvingLogos.has(logo)
      ) {
        continue;
      }

      this._resolvingLogos.add(logo);
      hass
        .callWS<{ url: string }>({
          type: "media_source/resolve_media",
          media_content_id: logo,
        })
        .then((result) => {
          this._logoUrls = { ...this._logoUrls, [logo]: hass.hassUrl(result.url) };
        })
        .catch(() => {
          this._logoUrls = { ...this._logoUrls, [logo]: "" };
        })
        .finally(() => this._resolvingLogos.delete(logo));
    }
  }

  private _logoUrl(station: SonosStationConfig): string | undefined {
    if (!station.logo) {
      return undefined;
    }
    const url = station.logo.startsWith(MEDIA_SOURCE_PREFIX)
      ? this._logoUrls[station.logo]
      : station.logo;
    return url && !this._brokenLogos.includes(url) ? url : undefined;
  }

  private _logoFailed(url: string): void {
    if (!this._brokenLogos.includes(url)) {
      this._brokenLogos = [...this._brokenLogos, url];
    }
  }

  render() {
    if (!this._config) {
      return nothing;
    }

    const coordinator = this._coordinator;
    const available = isAvailable(coordinator);
    const activeIndex = this._activeStationIndex();
    const notices = this._hass
      ? collectNotices(
          this._hass,
          this._config,
          this._coordinatorId,
          (id) => this._speakerName(id),
          this._t,
        )
      : [];

    return html`
      <ha-card class=${this._drawerOpen ? "drawer-open" : ""}>
        <div class="content" ?inert=${this._drawerOpen}>
          ${this._config.title
            ? html`<h1 class="card-header">${this._config.title}</h1>`
            : nothing}
          ${notices.length > 0
            ? html`<div class="notices">
                ${notices.map((notice) => this._renderNotice(notice))}
              </div>`
            : nothing}
          ${this._renderStations(activeIndex, available)}
          ${this._renderControls(coordinator, activeIndex, available)}
          ${this._toast ? this._renderNotice(this._toast, true) : nothing}
        </div>
        ${this._renderDrawer()}
      </ha-card>
    `;
  }

  private _renderNotice(notice: Notice, dismissible = false) {
    return html`
      <div
        class="notice ${notice.level} ${dismissible ? "toast" : ""}"
        role=${notice.level === "info" ? "status" : "alert"}
      >
        <ha-icon icon=${NOTICE_ICONS[notice.level]}></ha-icon>
        <span class="notice-text">${notice.message}</span>
        ${dismissible
          ? html`<button
              class="round small dismiss"
              aria-label=${this._t("card.dismiss")}
              @click=${this._dismissToast}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderStations(activeIndex: number, available: boolean) {
    const stations = this._config!.stations;
    if (stations.length === 0) {
      return html`<div class="empty">
        <ha-icon icon="mdi:radio-off"></ha-icon>
        <div class="empty-title">${this._t("card.empty_title")}</div>
        <div class="secondary">${this._t("card.empty_text")}</div>
      </div>`;
    }

    const playing = this._coordinator?.state === "playing";

    return html`
      <div class="stations">
        ${stations.map((station, index) => {
          const active = index === activeIndex;
          const pending = index === this._pendingStation && !active;
          const logo = this._logoUrl(station);
          const issue = stationIssue(station, this._t);
          return html`
            <button
              class="station ${active ? "active" : ""} ${pending
                ? "pending"
                : ""} ${issue ? "has-issue" : ""}"
              aria-pressed=${active ? "true" : "false"}
              title=${issue ?? station.name}
              ?disabled=${!available}
              @click=${() => this._playStation(index)}
            >
              <div class="logo">
                ${logo
                  ? html`<img
                      src=${logo}
                      alt=""
                      loading="lazy"
                      @error=${() => this._logoFailed(logo)}
                    />`
                  : html`<ha-icon icon="mdi:radio"></ha-icon>`}
              </div>
              <span class="station-name">${station.name || this._t("card.unnamed")}</span>
              ${active
                ? html`<span class="badge">
                    <ha-icon
                      icon=${playing ? "mdi:equalizer" : "mdi:pause"}
                    ></ha-icon>
                    ${playing ? this._t("card.playing") : this._t("card.paused")}
                  </span>`
                : pending
                  ? html`<span class="badge">
                      <ha-icon icon="mdi:loading"></ha-icon>
                      ${this._t("card.starting")}
                    </span>`
                  : issue
                    ? html`<span class="badge warning">
                        <ha-icon icon="mdi:alert-outline"></ha-icon>
                        ${station.media_content_id?.trim()
                          ? this._t("card.check_url")
                          : this._t("card.not_set_up")}
                      </span>`
                    : nothing}
            </button>
          `;
        })}
      </div>
    `;
  }

  private _renderControls(
    coordinator: HassEntity | undefined,
    activeIndex: number,
    available: boolean,
  ) {
    const config = this._config!;
    const hass = this._hass;
    const members = this._members;
    const playing = coordinator?.state === "playing";
    const station = config.stations[activeIndex];
    const attributes = coordinator?.attributes ?? {};
    const channel =
      typeof attributes.media_channel === "string"
        ? attributes.media_channel
        : undefined;
    const title =
      typeof attributes.media_title === "string"
        ? attributes.media_title
        : undefined;
    const artist =
      typeof attributes.media_artist === "string"
        ? attributes.media_artist
        : undefined;

    const unknownStream = !station && isActiveState(coordinator);
    const primary =
      station?.name ??
      channel ??
      title ??
      (unknownStream
        ? this._t("card.unknown_stream")
        : available
          ? this._t("card.nothing_playing")
          : this._coordinatorId
            ? this._t("card.speaker_unavailable")
            : this._t("card.no_speaker_configured"));
    const secondary = [
      unknownStream && config.stations.length > 0
        ? this._t("card.not_in_station_list")
        : undefined,
      artist,
      title,
    ]
      .filter((value) => value && value !== primary)
      .join(" – ");

    const groupVolumeLevel = hass ? groupVolume(hass, members) : undefined;
    const coordinatorName = this._coordinatorId
      ? this._speakerName(this._coordinatorId)
      : undefined;
    const groupLabel = coordinatorName
      ? members.length > 1
        ? `${coordinatorName} + ${members.length - 1}`
        : coordinatorName
      : this._t("card.no_speaker");

    return html`
      <div class="controls">
        <div class="now-playing">
          <div class="now-playing-primary">${primary}</div>
          <div class="now-playing-secondary">
            ${secondary || groupLabel}
          </div>
        </div>

        <div class="transport">
          <button
            class="round primary"
            aria-label=${playing ? this._t("card.pause") : this._t("card.play")}
            ?disabled=${!available}
            @click=${this._playPause}
          >
            <ha-icon icon=${playing ? "mdi:pause" : "mdi:play"}></ha-icon>
          </button>
          <button
            class="round"
            aria-label=${this._t("card.stop")}
            ?disabled=${!available}
            @click=${this._stop}
          >
            <ha-icon icon="mdi:stop"></ha-icon>
          </button>
        </div>

        ${this._renderVolume(
          GROUP_VOLUME_KEY,
          groupVolumeLevel,
          this._t("card.group_volume"),
          !available,
        )}

        <button
          class="multiroom"
          aria-label=${this._t("card.multiroom")}
          aria-haspopup="dialog"
          aria-expanded=${this._drawerOpen ? "true" : "false"}
          ?disabled=${config.speakers.length === 0}
          @click=${this._openDrawer}
        >
          <ha-icon icon="mdi:speaker-multiple"></ha-icon>
          <span class="multiroom-label">${this._t("card.multiroom")}</span>
          ${members.length > 1
            ? html`<span class="count">${members.length}</span>`
            : nothing}
        </button>
      </div>
    `;
  }

  private _renderVolume(
    key: string,
    actual: number | undefined,
    label: string,
    disabled: boolean,
  ) {
    const volume = this._volume.draft(key) ?? actual;
    const percent = Math.round((volume ?? 0) * 100);
    return html`
      <label class="volume">
        <ha-icon
          icon=${percent === 0
            ? "mdi:volume-off"
            : percent < 50
              ? "mdi:volume-medium"
              : "mdi:volume-high"}
        ></ha-icon>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          aria-label=${label}
          .value=${live(String(percent))}
          style="--value: ${percent}%"
          ?disabled=${disabled || volume === undefined}
          @input=${(event: Event) => this._volumeInput(key, event)}
          @change=${(event: Event) => this._commitVolume(key, event)}
        />
        <span class="volume-value">${percent}%</span>
      </label>
    `;
  }

  private _renderDrawer() {
    if (!this._drawerOpen) {
      return nothing;
    }

    const members = this._members;
    const memberSet = new Set(members);
    const coordinatorId = this._coordinatorId;
    const groupName = formatGroupName(
      members.map((id) => this._speakerName(id)),
    );
    const closing = this._drawerClosing ? "closing" : "";

    return html`
      <div class="scrim ${closing}" @click=${this._closeDrawer}></div>
      <aside
        class="drawer ${closing}"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        @pointerdown=${this._swipeStart}
        @pointermove=${this._swipeMove}
        @pointerup=${this._swipeEnd}
        @pointercancel=${this._swipeEnd}
      >
        <div class="drawer-header">
          <div class="drawer-heading">
            <span class="drawer-eyebrow"
              >${this._t("card.group_speakers")}</span
            >
            <h2 id="drawer-title">
              ${groupName
                ? this._t("card.sonos_group", { name: groupName })
                : this._t("card.no_active_group")}
            </h2>
          </div>
          <button
            class="round small close"
            aria-label=${this._t("card.close")}
            @click=${this._closeDrawer}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <ul class="rooms">
          ${this._config!.speakers.map((speaker) =>
            this._renderRoom(
              speaker,
              memberSet,
              members.length,
              coordinatorId,
            ),
          )}
        </ul>
      </aside>
    `;
  }

  private _renderRoom(
    speaker: SonosSpeakerConfig,
    members: Set<string>,
    memberCount: number,
    coordinatorId: string | undefined,
  ) {
    const entityId = speaker.entity;
    const entity = this._hass?.states[entityId];
    const available = isAvailable(entity);
    const target = this._membershipTargets[entityId];
    const pending = target !== undefined;
    // Show the requested state right away; Sonos takes a moment to regroup.
    const inGroup = target ?? members.has(entityId);
    const isMaster = entityId === coordinatorId;
    const soleMember = members.has(entityId) && memberCount <= 1;
    const name = this._speakerName(entityId, speaker);
    const volume = entity?.attributes.volume_level;

    const t = this._t;
    const status = !entity
      ? t("room.not_found")
      : !available
        ? t("room.unavailable")
        : pending
          ? inGroup
            ? t("room.joining")
            : t("room.leaving")
          : isMaster
            ? soleMember
              ? t("room.master_only")
              : t("room.master")
            : inGroup
              ? t("room.in_group")
              : t("room.not_in_group");

    return html`
      <li
        class="room ${inGroup ? "in-group" : ""} ${available
          ? ""
          : "unavailable"}"
      >
        <div class="room-header">
          <ha-icon
            class="room-icon"
            icon=${pending ? "mdi:loading" : (speaker.icon ?? "mdi:speaker")}
          ></ha-icon>
          <div class="room-text">
            <span class="room-name">${name}</span>
            <span class="secondary">${status}</span>
          </div>
          <ha-switch
            .checked=${live(inGroup)}
            .disabled=${!available || pending || soleMember || !coordinatorId}
            aria-label=${t("card.room_in_group", { name })}
            @change=${(event: Event) =>
              this._toggleSpeaker(
                entityId,
                (event.target as HTMLElement & { checked: boolean }).checked,
              )}
          ></ha-switch>
        </div>
        ${this._renderVolume(
          entityId,
          typeof volume === "number" ? volume : undefined,
          t("card.room_volume", { name }),
          !available,
        )}
      </li>
    `;
  }

  static styles = css`
    :host {
      --sonos-radio-tile-min: 128px;
      --sonos-radio-touch: 56px;
      --sonos-radio-radius: var(
        --ha-card-border-radius,
        var(--card-border-radius, 12px)
      );
      display: block;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      container-type: inline-size;
      background: var(--ha-card-background, var(--card-background-color));
      border-radius: var(--sonos-radio-radius);
    }

    button {
      font: inherit;
      color: inherit;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    button:disabled {
      cursor: default;
      opacity: 0.5;
    }

    button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .card-header {
      margin: 0;
      padding: 16px 16px 0;
      color: var(--ha-card-header-color, var(--primary-text-color));
      font-size: var(--ha-card-header-font-size, 24px);
      font-weight: 400;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color);
    }

    .empty > ha-icon {
      --mdc-icon-size: 40px;
      opacity: 0.6;
    }

    .empty-title {
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .stations {
      display: grid;
      grid-template-columns: repeat(
        auto-fill,
        minmax(var(--sonos-radio-tile-min), 1fr)
      );
      gap: 12px;
      padding: 16px;
    }

    .station {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 8px 8px 12px;
      cursor: pointer;
      border: 2px solid var(--divider-color);
      border-radius: var(--sonos-radio-radius);
      background: var(--secondary-background-color, transparent);
      transition:
        border-color 150ms ease,
        box-shadow 150ms ease,
        transform 100ms ease;
    }

    .station:not(:disabled):active {
      transform: scale(0.97);
    }

    .station.active {
      border-color: var(--primary-color);
      box-shadow:
        0 0 0 2px var(--primary-color),
        0 0 18px color-mix(in srgb, var(--primary-color) 45%, transparent);
    }

    .station.pending {
      border-color: var(--primary-color);
      border-style: dashed;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: calc(var(--sonos-radio-radius) - 4px);
      background: var(--card-background-color, #fff);
      color: var(--secondary-text-color);
    }

    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .logo ha-icon {
      --mdc-icon-size: 48px;
    }

    .station-name {
      overflow: hidden;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px 2px 4px;
      border-radius: 999px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge ha-icon {
      --mdc-icon-size: 16px;
    }

    .badge.warning {
      background: var(--warning-color, #ffa600);
      color: #000;
    }

    .station.has-issue:not(.active) .logo {
      opacity: 0.6;
    }

    .room.unavailable .room-header,
    .room.unavailable .volume {
      opacity: 0.55;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 12px 16px 16px;
      border-top: 1px solid var(--divider-color);
    }

    .now-playing {
      flex: 1 1 100%;
      min-width: 0;
    }

    .now-playing-primary,
    .now-playing-secondary {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .now-playing-primary {
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .now-playing-secondary {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }

    .transport {
      display: flex;
      gap: 12px;
    }

    .round {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--sonos-radio-touch);
      height: var(--sonos-radio-touch);
      padding: 0;
      cursor: pointer;
      border: 1px solid var(--divider-color);
      border-radius: 50%;
      background: var(--secondary-background-color, transparent);
      color: var(--primary-text-color);
    }

    .round.primary {
      width: calc(var(--sonos-radio-touch) + 8px);
      height: calc(var(--sonos-radio-touch) + 8px);
      border: none;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    .round.primary ha-icon {
      --mdc-icon-size: 32px;
    }

    .round.small {
      width: 48px;
      height: 48px;
    }

    .volume {
      display: flex;
      flex: 1 1 100px;
      align-items: center;
      gap: 12px;
      min-width: 0;
      min-height: var(--sonos-radio-touch);
      color: var(--secondary-text-color);
    }

    .volume-value {
      min-width: 2.5ch;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    input[type="range"] {
      flex: 1;
      width: 100%;
      min-width: 0;
      height: var(--sonos-radio-touch);
      margin: 0;
      cursor: pointer;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
    }

    input[type="range"]:disabled {
      cursor: default;
      opacity: 0.5;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(
        to right,
        var(--primary-color) var(--value),
        var(--divider-color) var(--value)
      );
    }

    input[type="range"]::-moz-range-track {
      height: 8px;
      border-radius: 4px;
      background: var(--divider-color);
    }

    input[type="range"]::-moz-range-progress {
      height: 8px;
      border-radius: 4px;
      background: var(--primary-color);
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 28px;
      height: 28px;
      margin-top: -10px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      -webkit-appearance: none;
      appearance: none;
    }

    input[type="range"]::-moz-range-thumb {
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }

    .multiroom {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: var(--sonos-radio-touch);
      padding: 0 20px;
      cursor: pointer;
      border: none;
      border-radius: calc(var(--sonos-radio-touch) / 2);
      background: color-mix(in srgb, var(--primary-color) 18%, transparent);
      color: var(--primary-color);
      font-weight: 600;
    }

    .count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      border-radius: 11px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font-size: 0.75rem;
    }

    @container (min-width: 720px) {
      .now-playing {
        flex: 1 1 180px;
      }
    }

    @container (max-width: 600px) {
      .controls {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
      }
    }

    @container (max-width: 420px) {
      .multiroom {
        padding: 0 16px;
      }

      .multiroom-label,
      .volume-value {
        display: none;
      }
    }

    .notices {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 16px 0;
    }

    .notice {
      --notice-color: var(--error-color, #db4437);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--notice-color) 14%, transparent);
      color: var(--primary-text-color);
      font-size: 0.9rem;
      line-height: 1.35;
    }

    .notice > ha-icon {
      flex: none;
      color: var(--notice-color);
    }

    .notice.warning {
      --notice-color: var(--warning-color, #ffa600);
    }

    .notice.info {
      --notice-color: var(--info-color, #039be5);
    }

    .notice-text {
      flex: 1;
      min-width: 0;
    }

    .notice.toast {
      margin: 0 16px 16px;
      padding-right: 4px;
    }

    .notice .dismiss {
      flex: none;
      width: 44px;
      height: 44px;
    }

    ha-card.drawer-open {
      min-height: var(--sonos-radio-drawer-min-height, 440px);
    }

    .scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: rgba(0, 0, 0, 0.45);
      animation: fade-in ${DRAWER_ANIMATION_MS}ms ease-out;
      transition: opacity ${DRAWER_ANIMATION_MS}ms ease-in;
    }

    .scrim.closing {
      opacity: 0;
    }

    .drawer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      width: min(var(--sonos-radio-drawer-width, 380px), 92%);
      overflow-y: auto;
      overscroll-behavior: contain;
      border-radius: var(--sonos-radio-radius) 0 0 var(--sonos-radio-radius);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: -6px 0 24px rgba(0, 0, 0, 0.3);
      touch-action: pan-y;
      animation: slide-in ${DRAWER_ANIMATION_MS}ms ease-out;
      transition: transform ${DRAWER_ANIMATION_MS}ms ease;
    }

    .drawer.dragging {
      transition: none;
    }

    .drawer.closing {
      transform: translateX(100%);
      transition-timing-function: ease-in;
    }

    @keyframes slide-in {
      from {
        transform: translateX(100%);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }

    .drawer-header {
      position: sticky;
      top: 0;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 12px 12px 16px;
      border-bottom: 1px solid var(--divider-color);
      background: inherit;
    }

    .drawer-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .drawer-eyebrow {
      color: var(--primary-color);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .drawer-heading h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 500;
      line-height: 1.3;
      color: var(--primary-text-color);
    }

    .rooms {
      margin: 0;
      padding: 4px 16px 16px;
      list-style: none;
    }

    .room {
      padding: 12px 0 4px;
      border-bottom: 1px solid var(--divider-color);
    }

    .room:last-child {
      border-bottom: none;
    }

    .room-header {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: var(--sonos-radio-touch);
    }

    .room-icon {
      flex: none;
      color: var(--secondary-text-color);
    }

    .room.in-group .room-icon {
      color: var(--primary-color);
    }

    .room-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-width: 0;
    }

    .room-name {
      overflow: hidden;
      font-weight: 500;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--primary-text-color);
    }

    .room ha-switch {
      flex: none;
      --ha-switch-min-touch-size: var(--sonos-radio-touch);
    }

    .room .volume {
      padding-left: 36px;
      min-height: 48px;
    }

    .room .volume-value {
      display: inline;
    }

    .secondary {
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .station,
      .scrim,
      .drawer {
        transition: none;
        animation: none;
      }
    }
  `;
}

if (!customElements.get("sonos-radio-card")) {
  customElements.define("sonos-radio-card", SonosRadioCard);
  console.info(
    `%c SONOS-RADIO-CARD %c ${CARD_VERSION} `,
    "color: #fff; background: #03a9f4; font-weight: 700;",
    "color: #03a9f4; background: #fff; font-weight: 700;",
  );
}

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "sonos-radio-card")) {
  window.customCards.push({
    type: "sonos-radio-card",
    name: "Sonos Radio Card",
    description: createTranslator(navigator.language)("card.description"),
    preview: false,
  });
}
