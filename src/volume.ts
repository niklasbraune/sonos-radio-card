export type VolumeSender = (key: string, level: number) => Promise<boolean>;

export interface VolumeThrottleOptions {
  /** Minimum time between two service calls for the same slider. */
  intervalMs?: number;
  /** Maximum time a released slider waits for Home Assistant to catch up. */
  holdMs?: number;
  /** Difference at which the reported volume counts as "caught up". */
  tolerance?: number;
}

interface Entry {
  draft: number;
  dragging: boolean;
  sent?: number;
  lastSentAt: number;
  inFlight: boolean;
  timer?: ReturnType<typeof setTimeout>;
  holdTimer?: ReturnType<typeof setTimeout>;
}

/**
 * Throttles volume slider changes per slider key.
 *
 * - While dragging, at most one call per interval is sent (leading and
 *   trailing), and never more than one call per slider is in flight.
 * - The dragged value is kept as a draft until Home Assistant reports a
 *   matching volume (or `holdMs` elapses), so the slider does not jump back
 *   to stale state updates.
 */
export class VolumeThrottle {
  private readonly _entries = new Map<string, Entry>();
  private readonly _intervalMs: number;
  private readonly _holdMs: number;
  private readonly _tolerance: number;
  private readonly _send: VolumeSender;
  private readonly _onChange: () => void;

  constructor(
    send: VolumeSender,
    onChange: () => void,
    options: VolumeThrottleOptions = {},
  ) {
    this._send = send;
    this._onChange = onChange;
    this._intervalMs = options.intervalMs ?? 300;
    this._holdMs = options.holdMs ?? 2500;
    this._tolerance = options.tolerance ?? 0.011;
  }

  draft(key: string): number | undefined {
    return this._entries.get(key)?.draft;
  }

  keys(): string[] {
    return [...this._entries.keys()];
  }

  /** Called for every `input` event while the slider is dragged. */
  input(key: string, level: number): void {
    const entry = this._entries.get(key) ?? {
      draft: level,
      dragging: true,
      lastSentAt: Number.NEGATIVE_INFINITY,
      inFlight: false,
    };
    entry.draft = level;
    entry.dragging = true;
    clearTimeout(entry.holdTimer);
    entry.holdTimer = undefined;
    this._entries.set(key, entry);
    this._schedule(key, entry);
    this._onChange();
  }

  /** Called on `change` (slider released): sends the final value right away. */
  commit(key: string, level?: number): void {
    const entry = this._entries.get(key);
    if (!entry) {
      if (level !== undefined) {
        this.input(key, level);
        this.commit(key);
      }
      return;
    }

    if (level !== undefined) {
      entry.draft = level;
    }
    entry.dragging = false;
    clearTimeout(entry.timer);
    entry.timer = undefined;
    this._flush(key, entry);
    this._startHold(key, entry);
  }

  /** Releases the draft once Home Assistant reports the requested volume. */
  reconcile(key: string, actual: number | undefined): void {
    const entry = this._entries.get(key);
    if (
      entry &&
      actual !== undefined &&
      this._settled(entry) &&
      Math.abs(actual - entry.draft) <= this._tolerance
    ) {
      this._release(key);
    }
  }

  dispose(): void {
    for (const entry of this._entries.values()) {
      clearTimeout(entry.timer);
      clearTimeout(entry.holdTimer);
    }
    this._entries.clear();
  }

  private _settled(entry: Entry): boolean {
    return (
      !entry.dragging &&
      !entry.inFlight &&
      entry.timer === undefined &&
      entry.sent === entry.draft
    );
  }

  private _schedule(key: string, entry: Entry): void {
    if (entry.timer !== undefined || entry.inFlight) {
      // The latest draft is picked up by the pending timer or after the
      // in-flight call finishes.
      return;
    }
    const wait = entry.lastSentAt + this._intervalMs - Date.now();
    if (wait <= 0) {
      this._flush(key, entry);
    } else {
      entry.timer = setTimeout(() => {
        entry.timer = undefined;
        this._flush(key, entry);
      }, wait);
    }
  }

  private _flush(key: string, entry: Entry): void {
    if (entry.inFlight || entry.draft === entry.sent) {
      return;
    }

    const level = entry.draft;
    entry.sent = level;
    entry.lastSentAt = Date.now();
    entry.inFlight = true;
    void this._send(key, level)
      .catch(() => false)
      .then((ok) => {
        entry.inFlight = false;
        if (this._entries.get(key) !== entry) {
          return;
        }
        if (!ok && !entry.dragging) {
          // Show the real volume again instead of a value that was rejected.
          this._release(key);
        } else if (entry.draft !== entry.sent) {
          if (entry.dragging) {
            this._schedule(key, entry);
          } else {
            this._flush(key, entry);
          }
        }
      });
  }

  private _startHold(key: string, entry: Entry): void {
    clearTimeout(entry.holdTimer);
    entry.holdTimer = setTimeout(() => {
      entry.holdTimer = undefined;
      if (this._entries.get(key) !== entry) {
        return;
      }
      if (this._settled(entry)) {
        this._release(key);
      } else if (!entry.dragging) {
        this._startHold(key, entry);
      }
    }, this._holdMs);
  }

  private _release(key: string): void {
    const entry = this._entries.get(key);
    if (!entry) {
      return;
    }
    clearTimeout(entry.timer);
    clearTimeout(entry.holdTimer);
    this._entries.delete(key);
    this._onChange();
  }
}
