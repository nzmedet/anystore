export const PlatformValues = ["ios", "android"] as const;
export type Platform = (typeof PlatformValues)[number];

export const ProviderValues = ["app_store_connect", "google_play"] as const;
export type Provider = (typeof ProviderValues)[number];

export const MemberRoleValues = ["owner", "admin", "editor", "reviewer", "viewer"] as const;
export type MemberRole = (typeof MemberRoleValues)[number];

export const MetadataScopeTypeValues = ["app_draft", "release_snapshot"] as const;
export type MetadataScopeType = (typeof MetadataScopeTypeValues)[number];

export const ReleaseStatusValues = [
  "draft",
  "preparing",
  "validation_failed",
  "ready_to_sync",
  "sync_in_progress",
  "synced",
  "submitted",
  "in_review",
  "approved",
  "published",
  "rejected",
  "superseded",
  "archived"
] as const;
export type ReleaseStatus = (typeof ReleaseStatusValues)[number];

export const FreezeStateValues = ["mutable", "frozen"] as const;
export type FreezeState = (typeof FreezeStateValues)[number];

export const SubmissionStatusValues = [
  "not_submitted",
  "draft",
  "submitted",
  "in_review",
  "approved",
  "rejected",
  "live"
] as const;
export type SubmissionStatus = (typeof SubmissionStatusValues)[number];

export const SyncJobStatusValues = ["queued", "running", "succeeded", "partially_failed", "failed", "cancelled"] as const;
export type SyncJobStatus = (typeof SyncJobStatusValues)[number];

export const RenderJobStatusValues = ["queued", "running", "succeeded", "failed", "cancelled"] as const;
export type RenderJobStatus = (typeof RenderJobStatusValues)[number];

export const ValidationSeverityValues = ["error", "warning", "info"] as const;
export type ValidationSeverity = (typeof ValidationSeverityValues)[number];

export const ValidationCategoryValues = [
  "schema",
  "completeness",
  "consistency",
  "provider",
  "screenshots",
  "compliance",
  "sync"
] as const;
export type ValidationCategory = (typeof ValidationCategoryValues)[number];

export const ValidationIssueStatusValues = ["active", "acknowledged", "resolved"] as const;
export type ValidationIssueStatus = (typeof ValidationIssueStatusValues)[number];

export const AssetTypeValues = [
  "icon_source",
  "icon_output",
  "screenshot_source",
  "screenshot_output",
  "screenshot_background",
  "feature_graphic",
  "preview_video",
  "generic"
] as const;
export type AssetType = (typeof AssetTypeValues)[number];

export const AssetStatusValues = ["pending_upload", "ready", "processing", "stale", "failed", "archived"] as const;
export type AssetStatus = (typeof AssetStatusValues)[number];

export const BuildSourceProviderValues = ["manual", "eas", "fastlane", "github_actions", "xcode_cloud", "other"] as const;
export type BuildSourceProvider = (typeof BuildSourceProviderValues)[number];

export const RemoteDiffStateValues = ["unchanged", "local_newer", "remote_newer", "conflict", "missing_local", "missing_remote"] as const;
export type RemoteDiffState = (typeof RemoteDiffStateValues)[number];

export const ReviewSecretAccessLevelValues = ["hidden", "masked", "full"] as const;
export type ReviewSecretAccessLevel = (typeof ReviewSecretAccessLevelValues)[number];

export const AppStatusValues = ["active", "archived"] as const;
export type AppStatus = (typeof AppStatusValues)[number];

export const AppPlatformStatusValues = ["connected", "not_connected", "misconfigured"] as const;
export type AppPlatformStatus = (typeof AppPlatformStatusValues)[number];

export const AppLocaleStatusValues = ["active", "inactive"] as const;
export type AppLocaleStatus = (typeof AppLocaleStatusValues)[number];

export const ProviderConnectionStatusValues = ["connected", "expired", "invalid", "pending"] as const;
export type ProviderConnectionStatus = (typeof ProviderConnectionStatusValues)[number];
