export type Platform = "ios" | "android";
export type Provider = "app_store_connect" | "google_play";
export type MemberRole = "owner" | "admin" | "editor" | "reviewer" | "viewer";
export type ReleaseStatus =
  | "draft"
  | "preparing"
  | "validation_failed"
  | "ready_to_sync"
  | "sync_in_progress"
  | "synced"
  | "submitted"
  | "in_review"
  | "approved"
  | "published"
  | "rejected"
  | "superseded"
  | "archived";
export type FreezeState = "mutable" | "frozen";
export type SubmissionStatus = "not_submitted" | "draft" | "submitted" | "in_review" | "approved" | "rejected" | "live";
export type SyncJobStatus = "queued" | "running" | "succeeded" | "partially_failed" | "failed" | "cancelled";
export type ValidationSeverity = "error" | "warning" | "info";
export type ValidationCategory = "schema" | "completeness" | "consistency" | "provider" | "screenshots" | "compliance" | "sync";
export type ValidationIssueStatus = "active" | "acknowledged" | "resolved";
export type AssetType =
  | "icon_source"
  | "icon_output"
  | "screenshot_source"
  | "screenshot_output"
  | "screenshot_background"
  | "feature_graphic"
  | "preview_video"
  | "generic";
export type AssetStatus = "pending_upload" | "ready" | "processing" | "stale" | "failed" | "archived";
export type AppStatus = "active" | "archived";
export type AppPlatformStatus = "connected" | "not_connected" | "misconfigured";
export type AppLocaleStatus = "active" | "inactive";
export type ProviderConnectionStatus = "connected" | "expired" | "invalid" | "pending";

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppSummary {
  id: string;
  workspaceId: string;
  slug: string;
  internalName: string;
  canonicalProductName: string;
  primaryLocale: string;
  status: AppStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppPlatformSummary {
  id: string;
  appId: string;
  platform: Platform;
  bundleOrPackageId: string;
  remoteAppId: string | null;
  defaultTrack: string | null;
  status: AppPlatformStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppLocaleSummary {
  id: string;
  appId: string;
  localeCode: string;
  status: AppLocaleStatus;
  createdAt: string;
}

export interface ReleaseSummary {
  id: string;
  appId: string;
  versionLabel: string;
  releaseName: string | null;
  status: ReleaseStatus;
  freezeState: FreezeState;
  sourceReleaseId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReleasePlatformStateSummary {
  id: string;
  releaseId: string;
  platform: Platform;
  targetTrack: string | null;
  desiredVersionName: string | null;
  desiredBuildNumber: string | null;
  attachedBuildId: string | null;
  submissionStatus: SubmissionStatus;
  syncStatus: SyncJobStatus | null;
  reviewStatus: SubmissionStatus | null;
  remoteReleaseId: string | null;
  lastSyncAt: string | null;
}

export interface AssetSummary {
  id: string;
  appId: string;
  releaseId: string | null;
  sourceAssetId: string | null;
  assetType: AssetType;
  status: AssetStatus;
  platform: Platform | null;
  localeCode: string | null;
  deviceClass: string | null;
  mimeType: string;
  objectKey: string;
  checksum: string;
  width: number | null;
  height: number | null;
  fileSizeBytes: number | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationIssueSummary {
  id: string;
  releaseId: string;
  platform: Platform | null;
  localeCode: string | null;
  severity: ValidationSeverity;
  category: ValidationCategory;
  code: string;
  message: string;
  remediationHint: string | null;
  pathReference: string | null;
  status: ValidationIssueStatus;
  detectedAt: string;
  resolvedAt: string | null;
}

export interface ProviderConnectionSummary {
  id: string;
  workspaceId: string;
  provider: Provider;
  status: ProviderConnectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MetadataEntrySummary {
  id: string;
  fieldKey: string;
  value: string;
  localeCode: string | null;
  platform: Platform | null;
  sourceLayer: string;
}

export interface ActivityItem {
  id: string;
  entityType: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface ReleasePlanItem {
  id: string;
  provider: Provider;
  platform: Platform;
  operation: string;
  targetPath: string;
  strategy: "apply_local" | "adopt_remote" | "skip" | "manual";
  blocking: boolean;
}

export interface DashboardData {
  workspace: WorkspaceSummary;
  apps: AppSummary[];
  releases: ReleaseSummary[];
  assets: AssetSummary[];
  providerConnections: ProviderConnectionSummary[];
  validationIssues: ValidationIssueSummary[];
  activity: ActivityItem[];
}

export interface AppDetailData {
  workspace: WorkspaceSummary;
  app: AppSummary;
  platforms: AppPlatformSummary[];
  locales: AppLocaleSummary[];
  releases: ReleaseSummary[];
  metadata: MetadataEntrySummary[];
  assets: AssetSummary[];
  activity: ActivityItem[];
}

export interface ReleaseDetailData {
  workspace: WorkspaceSummary;
  app: AppSummary;
  release: ReleaseSummary;
  platformStates: ReleasePlatformStateSummary[];
  validationIssues: ValidationIssueSummary[];
  assets: AssetSummary[];
  planItems: ReleasePlanItem[];
  activity: ActivityItem[];
}
