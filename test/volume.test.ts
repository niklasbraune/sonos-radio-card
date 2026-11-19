import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { VolumeThrottle } from "../src/volume.ts";

let sent: Array<[string, number]>;
let resolvers: Array<(ok: boolean) => void>;

const flushPromises = async (): Promise<void> => {
  for (let i = 0; i < 5; i++) {
    await Promise.resolve();
  }
};

const create = () =>
  new VolumeThrottle(
    (key, level) => {
      sent.push([key, level]);
      return new Promise<boolean>((resolve) => resolvers.push(resolve));
    },
    () => {},
    { intervalMs: 300, holdMs: 2000 },
  );

const answerAll = async (ok = true): Promise<void> => {
  const pending = resolvers;
  resolvers = [];
  pending.forEach((resolve) => resolve(ok));
  await flushPromises();
};

beforeEach(() => {
  sent = [];
  resolvers = [];
  mock.timers.enable({ apis: ["setTimeout", "Date"] });
});

afterEach(() => mock.timers.reset());

test("throttles a continuous drag to one call per interval", async () => {
  const throttle = create();
  for (let i = 1; i <= 30; i++) {
    throttle.input("a", i / 100);
    mock.timers.tick(20);
    await answerAll();
  }
  throttle.commit("a");
  await answerAll();

  // 600 ms of dragging: leading call, one per 300 ms, plus the final value.
  assert.ok(sent.length <= 4, `sent ${sent.length} calls`);
  assert.deepEqual(sent.at(-1), ["a", 0.3]);
});

test("never has more than one call in flight per slider", async () => {
  const throttle = create();
  throttle.input("a", 0.1);
  mock.timers.tick(1000);
  throttle.input("a", 0.2);
  mock.timers.tick(1000);
  throttle.commit("a", 0.3);
  assert.equal(sent.length, 1);

  await answerAll();
  assert.deepEqual(sent, [
    ["a", 0.1],
    ["a", 0.3],
  ]);
});

test("keeps the draft until Home Assistant reports the new volume", async () => {
  const throttle = create();
  throttle.input("a", 0.5);
  throttle.commit("a");
  await answerAll();

  throttle.reconcile("a", 0.2); // stale state update
  assert.equal(throttle.draft("a"), 0.5);
  throttle.reconcile("a", 0.5);
  assert.equal(throttle.draft("a"), undefined);
});

test("does not release the draft while the slider is still held", async () => {
  const throttle = create();
  throttle.input("a", 0.5);
  await answerAll();
  mock.timers.tick(10000);
  throttle.reconcile("a", 0.5);
  assert.equal(throttle.draft("a"), 0.5);
});

test("falls back to the real volume after the hold time or a failure", async () => {
  const throttle = create();
  throttle.commit("a", 0.5);
  await answerAll();
  mock.timers.tick(2000);
  assert.equal(throttle.draft("a"), undefined);

  throttle.commit("b", 0.7);
  await answerAll(false);
  assert.equal(throttle.draft("b"), undefined);
});
