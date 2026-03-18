import type { AppPlatformSummary, ReleaseSummary } from "./contracts";
import type { AssetType, Platform, Provider, RemoteDiffState, SubmissionStatus, SyncJobStatus } from "./enums";
import type { MetadataFieldKey } from "./metadata-field-keys";

export interface NormalizedRemoteField {
  fieldKey: MetadataFieldKey;
  localeCode?: string | null;
  platform?: Platform | null;
  value: unknown;
}

export interface NormalizedRemoteAsset {
  platform: Platform;
  localeCode?: string | null;
  assetType: AssetType;
  deviceClass?: string | null;
  checksum?: string | null;
  remoteId?: string | null;
  orderIndex?: number | null;
}

export interface NormalizedRemoteSnapshot {
  provider: Provider;
  appPlatformId: string;
  fields: NormalizedRemoteField[];
  assets: NormalizedRemoteAsset[];
  releaseState?: {
    versionName?: string | null;
    buildNumber?: string | null;
    submissionStatus?: SubmissionStatus | null;
    remoteReleaseId?: string | null;
  };
}

export interface MetadataDiffItem {
  type: "metadata";
  fieldKey: MetadataFieldKey;
  localeCode?: string | null;
  platform?: Platform | null;
  state: RemoteDiffState;
  localValue: unknown;
  remoteValue: unknown;
}

export interface AssetDiffItem {
  type: "asset";
  assetType: AssetType;
  localeCode?: string | null;
  platform: Platform;
  deviceClass?: string | null;
  state: RemoteDiffState;
  localChecksum?: string | null;
  remoteChecksum?: string | null;
}

export interface ReleaseStateDiffItem {
  type: "release_state";
  platform: Platform;
  key: "version_name" | "build_number" | "submission_status";
  state: RemoteDiffState;
  localValue: unknown;
  remoteValue: unknown;
}

export type SyncDiffItem = MetadataDiffItem | AssetDiffItem | ReleaseStateDiffItem;

export interface SyncPlanItem {
  id: string;
  provider: Provider;
  platform: Platform;
  operation:
    | "upsert_metadata_field"
    | "delete_metadata_field"
    | "upload_asset"
    | "delete_asset"
    | "reorder_assets"
    | "attach_build"
    | "update_release_notes";
  targetPath: string;
  strategy: "apply_local" | "adopt_remote" | "skip" | "manual";
  blocking: boolean;
  payload?: Record<string, unknown>;
}

export interface SyncPlan {
  releaseId: string;
  provider: Provider;
  items: SyncPlanItem[];
  generatedAt: string;
}

export interface ProviderError {
  provider: Provider;
  code: string;
  message: string;
  isRetryable: boolean;
  raw?: unknown;
}

export interface ProviderExecutionResult {
  jobStatus: SyncJobStatus;
  itemResults: Array<{
    itemId: string;
    status: "succeeded" | "failed" | "skipped";
    message?: string | null;
    error?: ProviderError | null;
  }>;
}

export interface FetchProviderSnapshotInput {
  appPlatform: AppPlatformSummary;
  release?: ReleaseSummary | null;
}
