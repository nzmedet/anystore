import type { Provider } from "@anystore/domain";
import type { ProviderCapabilities } from "./types";

export const providerCapabilityMap: Record<Provider, ProviderCapabilities> = {
  app_store_connect: {
    localizedMetadata: true,
    screenshotUpload: true,
    releaseNotes: true,
    buildAssignment: true,
    reviewNotesApi: true,
    draftTransactions: false
  },
  google_play: {
    localizedMetadata: true,
    screenshotUpload: true,
    releaseNotes: true,
    buildAssignment: true,
    reviewNotesApi: false,
    draftTransactions: true
  }
};
