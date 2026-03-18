import type { AppPlatformSummary, ReleaseSummary } from "@anystore/domain";
import type { Platform, Provider } from "@anystore/domain";
import type {
  FetchProviderSnapshotInput,
  NormalizedRemoteSnapshot,
  ProviderExecutionResult,
  SyncDiffItem,
  SyncPlan
} from "@anystore/domain";

export interface ProviderCapabilities {
  localizedMetadata: boolean;
  screenshotUpload: boolean;
  releaseNotes: boolean;
  buildAssignment: boolean;
  reviewNotesApi: boolean;
  draftTransactions: boolean;
}

export interface ProviderConnectionSecretRef {
  connectionId: string;
  provider: Provider;
}

export interface StoreProviderAdapter {
  provider: Provider;
  getCapabilities(): ProviderCapabilities;
  validateConnection(secretRef: ProviderConnectionSecretRef): Promise<{ isValid: boolean; message?: string }>;
  fetchNormalizedSnapshot(input: FetchProviderSnapshotInput): Promise<NormalizedRemoteSnapshot>;
  createSyncPlan(args: {
    release: ReleaseSummary;
    platform: Platform;
    diffItems: SyncDiffItem[];
  }): Promise<SyncPlan>;
  executeSyncPlan(args: {
    plan: SyncPlan;
    secretRef: ProviderConnectionSecretRef;
  }): Promise<ProviderExecutionResult>;
}

export interface ProviderAdapterRegistry {
  get(provider: Provider): StoreProviderAdapter;
  list(): StoreProviderAdapter[];
}
