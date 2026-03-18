import type {
  AppLocaleStatus,
  AppPlatformStatus,
  AppStatus,
  AssetStatus,
  AssetType,
  BuildSourceProvider,
  FreezeState,
  MemberRole,
  Platform,
  Provider,
  ProviderConnectionStatus,
  ReleaseStatus,
  SubmissionStatus,
  SyncJobStatus,
  ValidationCategory,
  ValidationIssueStatus,
  ValidationSeverity
} from "../enums";

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberSummary {
  id: string;
  workspaceId: string;
  userId: string;
  role: MemberRole;
  createdAt: string;
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

export interface BuildArtifactSummary {
  id: string;
  appId: string;
  platform: Platform;
  versionName: string;
  buildNumber: string;
  artifactUri: string | null;
  sourceProvider: BuildSourceProvider;
  gitCommitSha: string | null;
  gitTag: string | null;
  branch: string | null;
  createdAt: string;
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

export interface RemoteSnapshotSummary {
  id: string;
  appPlatformId: string;
  releaseId: string | null;
  provider: Provider;
  snapshotType: "app_listing" | "release_state" | "assets" | "full";
  checksum: string;
  fetchedAt: string;
}

export interface SyncJobSummary {
  id: string;
  releaseId: string;
  status: SyncJobStatus;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}
