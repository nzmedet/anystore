import type { Provider } from "@anystore/domain";
import { AppleProviderAdapter } from "./apple/adapter";
import { GoogleProviderAdapter } from "./google/adapter";
import type { ProviderAdapterRegistry, StoreProviderAdapter } from "./types";

const adapters = [new AppleProviderAdapter(), new GoogleProviderAdapter()] satisfies StoreProviderAdapter[];

export class InMemoryProviderRegistry implements ProviderAdapterRegistry {
  get(provider: Provider): StoreProviderAdapter {
    const adapter = adapters.find((candidate) => candidate.provider === provider);
    if (!adapter) {
      throw new Error(`Unknown provider: ${provider}`);
    }
    return adapter;
  }

  list(): StoreProviderAdapter[] {
    return adapters;
  }
}

export * from "./capability-map";
export * from "./types";
