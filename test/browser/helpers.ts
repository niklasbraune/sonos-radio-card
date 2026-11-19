import type { HassEntity, HomeAssistant } from "../../src/types.ts";

export interface ServiceCall {
  domain: string;
  service: string;
  data: Record<string, unknown>;
}

export const entity = (
  entity_id: string,
  state: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({
  entity_id,
  state,
  attributes: { friendly_name: entity_id.split(".")[1], ...attributes },
});

export interface MockHass extends HomeAssistant {
  calls: ServiceCall[];
}

export const mockHass = (
  entities: HassEntity[],
  options: {
    language?: string;
    callService?: (call: ServiceCall) => Promise<unknown>;
    callWS?: (message: Record<string, unknown>) => Promise<unknown>;
  } = {},
): MockHass => {
  const calls: ServiceCall[] = [];
  return {
    calls,
    states: Object.fromEntries(entities.map((item) => [item.entity_id, item])),
    locale: { language: options.language ?? "en" },
    callService(domain, service, data = {}) {
      const call = { domain, service, data };
      calls.push(call);
      return options.callService?.(call) ?? Promise.resolve();
    },
    callWS<T>(message: Record<string, unknown>) {
      return (options.callWS?.(message) ??
        Promise.reject(new Error("not mocked"))) as Promise<T>;
    },
    hassUrl: (path = "") => path,
  };
};
