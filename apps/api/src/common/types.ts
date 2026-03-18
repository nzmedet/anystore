export type Provider = 'app_store_connect' | 'google_play'
export type Platform = 'ios' | 'android'
export type MemberRole = 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer'
export type MetadataScopeType = 'app_draft' | 'release_snapshot'
export type ReleaseStatus =
  | 'draft'
  | 'preparing'
  | 'validation_failed'
  | 'ready_to_sync'
  | 'sync_in_progress'
  | 'synced'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'superseded'
  | 'archived'
export type FreezeState = 'mutable' | 'frozen'
export type SubmissionStatus =
  | 'not_submitted'
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'live'
export type SyncJobStatus = 'queued' | 'running' | 'succeeded' | 'partially_failed' | 'failed' | 'cancelled'
export type RenderJobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'
export type ValidationSeverity = 'error' | 'warning' | 'info'
export type ValidationCategory = 'schema' | 'completeness' | 'consistency' | 'provider' | 'screenshots' | 'compliance' | 'sync'
export type ValidationIssueStatus = 'active' | 'acknowledged' | 'resolved'
export type AssetType =
  | 'icon_source'
  | 'icon_output'
  | 'screenshot_source'
  | 'screenshot_output'
  | 'screenshot_background'
  | 'feature_graphic'
  | 'preview_video'
  | 'generic'
export type AssetStatus = 'pending_upload' | 'ready' | 'processing' | 'stale' | 'failed' | 'archived'
export type BuildSourceProvider = 'manual' | 'eas' | 'fastlane' | 'github_actions' | 'xcode_cloud' | 'other'
export type RemoteDiffState = 'unchanged' | 'local_newer' | 'remote_newer' | 'conflict' | 'missing_local' | 'missing_remote'
export type ReviewSecretAccessLevel = 'hidden' | 'masked' | 'full'
export type AppStatus = 'active' | 'archived'
export type AppPlatformStatus = 'connected' | 'not_connected' | 'misconfigured'
export type AppLocaleStatus = 'active' | 'inactive'
export type ProviderConnectionStatus = 'connected' | 'expired' | 'invalid' | 'pending'

export interface ApiSession {
  userId: string
  email: string
  displayName: string
  workspaceId: string
  workspaceName: string
}

export interface WorkspaceSummary {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceMemberSummary {
  id: string
  workspaceId: string
  userId: string
  role: MemberRole
  createdAt: string
}

export interface AppSummary {
  id: string
  workspaceId: string
  slug: string
  internalName: string
  canonicalProductName: string
  primaryLocale: string
  status: AppStatus
  createdAt: string
  updatedAt: string
}

export interface AppPlatformSummary {
  id: string
  appId: string
  platform: Platform
  bundleOrPackageId: string
  remoteAppId: string | null
  defaultTrack: string | null
  status: AppPlatformStatus
  createdAt: string
  updatedAt: string
}

export interface AppLocaleSummary {
  id: string
  appId: string
  localeCode: string
  status: AppLocaleStatus
  createdAt: string
}

export interface MetadataEntryRecord {
  id: string
  metadataDocumentId: string
  localeCode: string | null
  platform: Platform | null
  fieldKey: string
  valueJson: unknown
  sourceLayer: string
  createdAt: string
  updatedAt: string
}

export interface MetadataDocumentSummary {
  id: string
  appId: string
  scopeType: MetadataScopeType
  scopeId: string
  version: number
  createdAt: string
  updatedAt: string
}

export interface ReleaseSummary {
  id: string
  appId: string
  versionLabel: string
  releaseName: string | null
  status: ReleaseStatus
  freezeState: FreezeState
  sourceReleaseId: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ReleasePlatformStateSummary {
  id: string
  releaseId: string
  platform: Platform
  targetTrack: string | null
  desiredVersionName: string | null
  desiredBuildNumber: string | null
  attachedBuildId: string | null
  submissionStatus: SubmissionStatus
  syncStatus: SyncJobStatus | null
  reviewStatus: SubmissionStatus | null
  remoteReleaseId: string | null
  lastSyncAt: string | null
}

export interface AssetSummary {
  id: string
  appId: string
  releaseId: string | null
  sourceAssetId: string | null
  assetType: AssetType
  status: AssetStatus
  platform: Platform | null
  localeCode: string | null
  deviceClass: string | null
  mimeType: string
  objectKey: string
  checksum: string
  width: number | null
  height: number | null
  fileSizeBytes: number | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

export interface BuildArtifactSummary {
  id: string
  appId: string
  platform: Platform
  versionName: string
  buildNumber: string
  artifactUri: string | null
  sourceProvider: BuildSourceProvider
  gitCommitSha: string | null
  gitTag: string | null
  branch: string | null
  createdAt: string
}

export interface ValidationIssueSummary {
  id: string
  releaseId: string
  platform: Platform | null
  localeCode: string | null
  severity: ValidationSeverity
  category: ValidationCategory
  code: string
  message: string
  remediationHint: string | null
  pathReference: string | null
  status: ValidationIssueStatus
  detectedAt: string
  resolvedAt: string | null
}

export interface ValidationRunSummary {
  id: string
  releaseId: string
  status: 'queued' | 'running' | 'succeeded' | 'failed'
  startedAt: string
  completedAt: string | null
  createdAt: string
}

export interface ProviderConnectionSummary {
  id: string
  workspaceId: string
  provider: Provider
  status: ProviderConnectionStatus
  createdAt: string
  updatedAt: string
}

export interface RemoteSnapshotSummary {
  id: string
  appPlatformId: string
  releaseId: string | null
  provider: Provider
  snapshotType: 'app_listing' | 'release_state' | 'assets' | 'full'
  checksum: string
  fetchedAt: string
}

export interface SyncJobSummary {
  id: string
  releaseId: string
  status: SyncJobStatus
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export interface ReviewProfileSummary {
  id: string
  appId: string
  platform: Platform
  localeCode: string | null
  accessLevel: ReviewSecretAccessLevel
  createdAt: string
  updatedAt: string
}

export interface RejectionEventSummary {
  id: string
  releaseId: string
  platform: Platform
  reason: string
  createdAt: string
}

export interface CommentSummary {
  id: string
  workspaceId: string
  appId: string | null
  releaseId: string | null
  targetId: string
  authorUserId: string | null
  body: string
  createdAt: string
}

export interface AuditEventSummary {
  id: string
  workspaceId: string
  appId: string | null
  releaseId: string | null
  actorUserId: string | null
  eventType: string
  payloadJson: Record<string, unknown>
  createdAt: string
}

export interface ResolvedMetadataField {
  fieldKey: string
  platform: Platform | null
  localeCode: string | null
  value: unknown
  sourceLayer: string
}

export interface RemoteDiffItem {
  type: 'metadata' | 'asset' | 'release_state'
  state: RemoteDiffState
  fieldKey?: string
  assetType?: AssetType
  platform: Platform | null
  localeCode: string | null
  localValue: unknown
  remoteValue: unknown
}

export interface SyncPlanItem {
  id: string
  provider: Provider
  platform: Platform
  operation: string
  targetPath: string
  strategy: 'apply_local' | 'adopt_remote' | 'skip' | 'manual'
  blocking: boolean
  payload?: Record<string, unknown>
}

export interface SyncPlanSummary {
  releaseId: string
  provider: Provider
  items: SyncPlanItem[]
  generatedAt: string
}

export interface ProviderCapabilities {
  localizedMetadata: boolean
  screenshotUpload: boolean
  releaseNotes: boolean
  buildAssignment: boolean
  reviewNotesApi: boolean
  draftTransactions: boolean
}

export interface SignedUploadResponse {
  uploadUrl: string
  objectKey: string
  headers: Record<string, string>
}
