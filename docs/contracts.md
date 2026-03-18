# Anystore Contracts Pack

## Purpose

This document defines the **shared contracts** for Anystore so multiple Codex agents can implement the system without inventing competing truths.

This is the source for:

* shared enums
* domain types
* Prisma data model blueprint
* API DTOs
* route map
* event names
* queue payloads
* provider contracts
* validation contracts
* rendering contracts
* file/folder ownership map

Use this as the implementation anchor.

---

# 1. Global contract rules

## 1.1 Naming rules

Use these naming conventions consistently:

* TypeScript types/interfaces: `PascalCase`
* enums: `PascalCase`
* enum values: `snake_case` string literals unless otherwise stated
* Prisma models: `PascalCase`
* Prisma model fields: `camelCase`
* physical database columns: `snake_case` via Prisma `@map` / `@@map`
* API JSON keys: `camelCase`
* event names: `dot.case`
* BullMQ queue names: `kebab-case`
* object storage keys: `/`-separated paths with kebab-case segments

## 1.2 Time rules

All persisted timestamps must be UTC.

Required timestamp columns on almost all tables:

* `created_at`
* `updated_at`

Optional where needed:

* `deleted_at`
* `started_at`
* `completed_at`
* `last_sync_at`
* `fetched_at`
* `resolved_at`

## 1.3 ID rules

Use string IDs consistently.

Recommended format:

* CUID2 or UUIDv7

Do not mix integer IDs into the public contract.

## 1.4 Snapshot rule

Release-facing content must resolve to a frozen snapshot, not mutable draft joins.

That means contracts must support:

* app draft state
* release snapshot state
* effective resolved state

---

# 2. Shared enum contracts

Create these in `packages/domain/src/enums.ts`.

```ts
export const PlatformValues = ['ios', 'android'] as const
export type Platform = (typeof PlatformValues)[number]

export const ProviderValues = ['app_store_connect', 'google_play'] as const
export type Provider = (typeof ProviderValues)[number]

export const MemberRoleValues = ['owner', 'admin', 'editor', 'reviewer', 'viewer'] as const
export type MemberRole = (typeof MemberRoleValues)[number]

export const MetadataScopeTypeValues = ['app_draft', 'release_snapshot'] as const
export type MetadataScopeType = (typeof MetadataScopeTypeValues)[number]

export const ReleaseStatusValues = [
  'draft',
  'preparing',
  'validation_failed',
  'ready_to_sync',
  'sync_in_progress',
  'synced',
  'submitted',
  'in_review',
  'approved',
  'published',
  'rejected',
  'superseded',
  'archived',
] as const
export type ReleaseStatus = (typeof ReleaseStatusValues)[number]

export const FreezeStateValues = ['mutable', 'frozen'] as const
export type FreezeState = (typeof FreezeStateValues)[number]

export const SubmissionStatusValues = [
  'not_submitted',
  'draft',
  'submitted',
  'in_review',
  'approved',
  'rejected',
  'live',
] as const
export type SubmissionStatus = (typeof SubmissionStatusValues)[number]

export const SyncJobStatusValues = [
  'queued',
  'running',
  'succeeded',
  'partially_failed',
  'failed',
  'cancelled',
] as const
export type SyncJobStatus = (typeof SyncJobStatusValues)[number]

export const RenderJobStatusValues = ['queued', 'running', 'succeeded', 'failed', 'cancelled'] as const
export type RenderJobStatus = (typeof RenderJobStatusValues)[number]

export const ValidationSeverityValues = ['error', 'warning', 'info'] as const
export type ValidationSeverity = (typeof ValidationSeverityValues)[number]

export const ValidationCategoryValues = [
  'schema',
  'completeness',
  'consistency',
  'provider',
  'screenshots',
  'compliance',
  'sync',
] as const
export type ValidationCategory = (typeof ValidationCategoryValues)[number]

export const ValidationIssueStatusValues = ['active', 'acknowledged', 'resolved'] as const
export type ValidationIssueStatus = (typeof ValidationIssueStatusValues)[number]

export const AssetTypeValues = [
  'icon_source',
  'icon_output',
  'screenshot_source',
  'screenshot_output',
  'screenshot_background',
  'feature_graphic',
  'preview_video',
  'generic',
] as const
export type AssetType = (typeof AssetTypeValues)[number]

export const AssetStatusValues = ['pending_upload', 'ready', 'processing', 'stale', 'failed', 'archived'] as const
export type AssetStatus = (typeof AssetStatusValues)[number]

export const BuildSourceProviderValues = ['manual', 'eas', 'fastlane', 'github_actions', 'xcode_cloud', 'other'] as const
export type BuildSourceProvider = (typeof BuildSourceProviderValues)[number]

export const RemoteDiffStateValues = ['unchanged', 'local_newer', 'remote_newer', 'conflict', 'missing_local', 'missing_remote'] as const
export type RemoteDiffState = (typeof RemoteDiffStateValues)[number]

export const ReviewSecretAccessLevelValues = ['hidden', 'masked', 'full'] as const
export type ReviewSecretAccessLevel = (typeof ReviewSecretAccessLevelValues)[number]

export const AppStatusValues = ['active', 'archived'] as const
export type AppStatus = (typeof AppStatusValues)[number]

export const AppPlatformStatusValues = ['connected', 'not_connected', 'misconfigured'] as const
export type AppPlatformStatus = (typeof AppPlatformStatusValues)[number]

export const AppLocaleStatusValues = ['active', 'inactive'] as const
export type AppLocaleStatus = (typeof AppLocaleStatusValues)[number]

export const ProviderConnectionStatusValues = ['connected', 'expired', 'invalid', 'pending'] as const
export type ProviderConnectionStatus = (typeof ProviderConnectionStatusValues)[number]
```

---

# 3. Metadata field key contract

Create a closed field-key set in `packages/domain/src/metadata-field-keys.ts`.

```ts
export const MetadataFieldKeyValues = [
  'product_name',
  'subtitle',
  'short_description',
  'full_description',
  'promotional_text',
  'keywords',
  'support_url',
  'marketing_url',
  'privacy_policy_url',
  'primary_category',
  'secondary_category',
  'content_rights_statement',
  'release_notes',
  'review_notes',
  'review_contact_first_name',
  'review_contact_last_name',
  'review_contact_email',
  'review_contact_phone',
  'demo_account_username',
  'demo_account_password',
  'demo_account_notes',
  'customer_support_email',
  'customer_support_website',
  'customer_support_phone',
  'age_rating_answers',
  'in_app_purchase_descriptions',
] as const

export type MetadataFieldKey = (typeof MetadataFieldKeyValues)[number]
```

Notes:

* `keywords` should serialize as `string[]`
* `age_rating_answers` should serialize as structured JSON object
* `in_app_purchase_descriptions` should serialize as structured JSON array/object
* simple text/url fields may serialize as string

---

# 4. Core domain interfaces

Create in `packages/domain/src/contracts/`.

## 4.1 Workspace and app contracts

```ts
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
```

## 4.2 Release contracts

```ts
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
```

## 4.3 Asset contracts

```ts
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
```

## 4.4 Build contracts

```ts
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
```

## 4.5 Validation contracts

```ts
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
```

## 4.6 Provider and sync contracts

```ts
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
```

---

# 5. Prisma schema blueprint

Create in `packages/database/prisma/schema.prisma`.

This is a blueprint, not raw final schema text, but it is close enough that Codex should implement nearly verbatim.

## 5.1 Prisma enums

```prisma
enum Platform {
  ios
  android
}

enum Provider {
  app_store_connect
  google_play
}

enum MemberRole {
  owner
  admin
  editor
  reviewer
  viewer
}

enum MetadataScopeType {
  app_draft
  release_snapshot
}

enum ReleaseStatus {
  draft
  preparing
  validation_failed
  ready_to_sync
  sync_in_progress
  synced
  submitted
  in_review
  approved
  published
  rejected
  superseded
  archived
}

enum FreezeState {
  mutable
  frozen
}

enum SubmissionStatus {
  not_submitted
  draft
  submitted
  in_review
  approved
  rejected
  live
}

enum SyncJobStatus {
  queued
  running
  succeeded
  partially_failed
  failed
  cancelled
}

enum RenderJobStatus {
  queued
  running
  succeeded
  failed
  cancelled
}

enum ValidationSeverity {
  error
  warning
  info
}

enum ValidationCategory {
  schema
  completeness
  consistency
  provider
  screenshots
  compliance
  sync
}

enum ValidationIssueStatus {
  active
  acknowledged
  resolved
}

enum AssetType {
  icon_source
  icon_output
  screenshot_source
  screenshot_output
  screenshot_background
  feature_graphic
  preview_video
  generic
}

enum AssetStatus {
  pending_upload
  ready
  processing
  stale
  failed
  archived
}

enum BuildSourceProvider {
  manual
  eas
  fastlane
  github_actions
  xcode_cloud
  other
}

enum AppStatus {
  active
  archived
}

enum AppPlatformStatus {
  connected
  not_connected
  misconfigured
}

enum AppLocaleStatus {
  active
  inactive
}

enum ProviderConnectionStatus {
  connected
  expired
  invalid
  pending
}
```

## 5.2 Prisma models

### User

```prisma
model User {
  id            String   @id
  email         String   @unique
  passwordHash  String?
  displayName   String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  ownedWorkspaces Workspace[]      @relation("WorkspaceOwner")
  memberships     WorkspaceMember[]
  createdReleases Release[]        @relation("ReleaseCreatedBy")
  auditEvents     AuditEvent[]
  comments        Comment[]
}
```

### Workspace

```prisma
model Workspace {
  id          String   @id
  name        String
  slug        String   @unique
  ownerUserId String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner              User                 @relation("WorkspaceOwner", fields: [ownerUserId], references: [id])
  members            WorkspaceMember[]
  apps               App[]
  providerConnections ProviderConnection[]
  auditEvents        AuditEvent[]
  comments           Comment[]
}
```

### WorkspaceMember

```prisma
model WorkspaceMember {
  id          String     @id
  workspaceId String
  userId      String
  role        MemberRole
  createdAt   DateTime   @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@unique([workspaceId, userId])
}
```

### App

```prisma
model App {
  id                   String   @id
  workspaceId          String
  slug                 String
  internalName         String
  canonicalProductName String
  primaryLocale        String
  status               AppStatus
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  archivedAt           DateTime?

  workspace         Workspace          @relation(fields: [workspaceId], references: [id])
  platforms         AppPlatform[]
  locales           AppLocale[]
  metadataDocuments MetadataDocument[]
  assets            Asset[]
  templates         ScreenshotTemplate[]
  builds            BuildArtifact[]
  releases          Release[]
  reviewProfiles    ReviewProfile[]
  auditEvents       AuditEvent[]
  comments          Comment[]

  @@unique([workspaceId, slug])
}
```

### AppPlatform

```prisma
model AppPlatform {
  id                    String   @id
  appId                  String
  platform               Platform
  bundleOrPackageId      String
  storeAccountConnectionId String?
  remoteAppId            String?
  defaultTrack           String?
  status                 AppPlatformStatus
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  app                App               @relation(fields: [appId], references: [id])
  providerConnection ProviderConnection? @relation(fields: [storeAccountConnectionId], references: [id])
  remoteSnapshots    RemoteSnapshot[]

  @@unique([appId, platform])
}
```

### AppLocale

```prisma
model AppLocale {
  id         String   @id
  appId       String
  localeCode  String
  status      AppLocaleStatus
  createdAt   DateTime @default(now())

  app App @relation(fields: [appId], references: [id])

  @@unique([appId, localeCode])
}
```

### MetadataDocument

```prisma
model MetadataDocument {
  id         String            @id
  appId       String
  scopeType   MetadataScopeType
  scopeId     String
  version     Int               @default(1)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  app     App             @relation(fields: [appId], references: [id])
  entries  MetadataEntry[]

  @@unique([appId, scopeType, scopeId])
}
```

### MetadataEntry

```prisma
model MetadataEntry {
  id                 String   @id
  metadataDocumentId String
  localeCode         String?
  platform           Platform?
  fieldKey           String
  valueJson          Json
  sourceLayer        String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  metadataDocument MetadataDocument @relation(fields: [metadataDocumentId], references: [id])

  @@index([metadataDocumentId, localeCode, platform, fieldKey])
}
```

### Release

```prisma
model Release {
  id              String        @id
  appId            String
  versionLabel     String
  releaseName      String?
  status           ReleaseStatus
  freezeState      FreezeState
  sourceReleaseId  String?
  createdBy        String
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  app               App                  @relation(fields: [appId], references: [id])
  creator           User                 @relation("ReleaseCreatedBy", fields: [createdBy], references: [id])
  sourceRelease     Release?             @relation("ReleaseClone", fields: [sourceReleaseId], references: [id])
  clonedReleases    Release[]            @relation("ReleaseClone")
  platformStates    ReleasePlatformState[]
  validationIssues  ValidationIssue[]
  syncJobs          SyncJob[]
  renderJobs        RenderJob[]
  rejectionEvents   RejectionEvent[]
  assets            Asset[]
  comments          Comment[]
  auditEvents       AuditEvent[]

  @@unique([appId, versionLabel])
}
```

### ReleasePlatformState

```prisma
model ReleasePlatformState {
  id                String           @id
  releaseId          String
  platform           Platform
  targetTrack        String?
  desiredVersionName String?
  desiredBuildNumber String?
  attachedBuildId    String?
  submissionStatus   SubmissionStatus
  syncStatus         SyncJobStatus?
  reviewStatus       SubmissionStatus?
  remoteReleaseId    String?
  lastSyncAt         DateTime?

  release Release        @relation(fields: [releaseId], references: [id])
  build   BuildArtifact? @relation(fields: [attachedBuildId], references: [id])

  @@unique([releaseId, platform])
}
```

### Asset

```prisma
model Asset {
  id             String      @id
  appId           String
  releaseId       String?
  sourceAssetId   String?
  assetType       AssetType
  status          AssetStatus
  platform        Platform?
  localeCode      String?
  deviceClass     String?
  mimeType        String
  objectKey       String
  checksum        String
  width           Int?
  height          Int?
  fileSizeBytes   Int?
  lineageJson     Json?
  createdBy       String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  app         App      @relation(fields: [appId], references: [id])
  release     Release? @relation(fields: [releaseId], references: [id])
  sourceAsset Asset?   @relation("AssetLineage", fields: [sourceAssetId], references: [id])
  derivedAssets Asset[] @relation("AssetLineage")

  @@index([appId, assetType, platform, localeCode])
}
```

### ScreenshotTemplate

```prisma
model ScreenshotTemplate {
  id          String   @id
  appId        String
  name         String
  createdBy    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  app      App                        @relation(fields: [appId], references: [id])
  versions ScreenshotTemplateVersion[]
}
```

### ScreenshotTemplateVersion

```prisma
model ScreenshotTemplateVersion {
  id                  String   @id
  templateId           String
  versionNumber        Int
  definitionJson       Json
  checksum             String
  createdBy            String?
  createdAt            DateTime @default(now())

  template ScreenshotTemplate @relation(fields: [templateId], references: [id])

  @@unique([templateId, versionNumber])
}
```

### RenderJob

```prisma
model RenderJob {
  id                 String          @id
  appId               String
  releaseId           String?
  templateVersionId   String
  inputPayloadJson    Json
  status              RenderJobStatus
  outputManifestJson  Json?
  errorJson           Json?
  startedAt           DateTime?
  completedAt         DateTime?
  createdAt           DateTime        @default(now())

  app             App                       @relation(fields: [appId], references: [id])
  release         Release?                  @relation(fields: [releaseId], references: [id])
  templateVersion ScreenshotTemplateVersion @relation(fields: [templateVersionId], references: [id])
}
```

### BuildArtifact

```prisma
model BuildArtifact {
  id             String              @id
  appId           String
  platform        Platform
  versionName     String
  buildNumber     String
  artifactUri     String?
  sourceProvider  BuildSourceProvider
  metadataJson    Json?
  gitCommitSha    String?
  gitTag          String?
  branch          String?
  createdAt       DateTime            @default(now())

  app               App                    @relation(fields: [appId], references: [id])
  releasePlatforms  ReleasePlatformState[]

  @@index([appId, platform, versionName, buildNumber])
}
```

### ValidationIssue

```prisma
model ValidationIssue {
  id              String                @id
  releaseId        String
  platform         Platform?
  localeCode       String?
  severity         ValidationSeverity
  category         ValidationCategory
  code             String
  message          String
  remediationHint  String?
  pathReference    String?
  status           ValidationIssueStatus
  detectedAt       DateTime              @default(now())
  resolvedAt       DateTime?

  release Release @relation(fields: [releaseId], references: [id])

  @@index([releaseId, severity, status])
}
```

### ProviderConnection

```prisma
model ProviderConnection {
  id                       String   @id
  workspaceId               String
  provider                  Provider
  encryptedCredentialsBlob  String
  status                    ProviderConnectionStatus
  metadataJson              Json?
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt

  workspace    Workspace     @relation(fields: [workspaceId], references: [id])
  appPlatforms AppPlatform[]

  @@unique([workspaceId, provider])
}
```

### RemoteSnapshot

```prisma
model RemoteSnapshot {
  id             String   @id
  appPlatformId   String
  releaseId       String?
  provider        Provider
  snapshotType    String
  payloadJson     Json
  checksum        String
  fetchedAt       DateTime @default(now())

  appPlatform AppPlatform @relation(fields: [appPlatformId], references: [id])
}
```

### SyncJob

```prisma
model SyncJob {
  id              String        @id
  releaseId        String
  scopeJson        Json
  status           SyncJobStatus
  planJson         Json?
  resultJson       Json?
  errorJson        Json?
  startedAt        DateTime?
  completedAt      DateTime?
  createdAt        DateTime      @default(now())

  release Release @relation(fields: [releaseId], references: [id])
}
```

### ReviewProfile

```prisma
model ReviewProfile {
  id                    String   @id
  appId                  String
  encryptedFieldsJson    String
  metadataJson           Json?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  app App @relation(fields: [appId], references: [id])
}
```

### RejectionEvent

```prisma
model RejectionEvent {
  id              String   @id
  releaseId        String
  platform         Platform
  providerMessage  String
  rawPayloadJson   Json?
  createdAt        DateTime @default(now())

  release Release @relation(fields: [releaseId], references: [id])
}
```

### AuditEvent

```prisma
model AuditEvent {
  id           String   @id
  workspaceId   String
  appId         String?
  releaseId     String?
  actorUserId   String?
  eventType     String
  payloadJson   Json?
  createdAt     DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id])
  app       App?      @relation(fields: [appId], references: [id])
  release   Release?  @relation(fields: [releaseId], references: [id])
  actor     User?     @relation(fields: [actorUserId], references: [id])

  @@index([workspaceId, createdAt])
  @@index([appId, createdAt])
  @@index([releaseId, createdAt])
}
```

### Comment

```prisma
model Comment {
  id            String   @id
  workspaceId    String
  appId          String?
  releaseId      String?
  targetType     String
  targetId       String
  authorUserId   String
  body           String
  createdAt      DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id])
  app       App?      @relation(fields: [appId], references: [id])
  release   Release?  @relation(fields: [releaseId], references: [id])
  author    User      @relation(fields: [authorUserId], references: [id])
}
```

---

# 6. DTO contracts

Create in `packages/domain/src/dto/` and mirror in API validators.

## 6.1 Workspace DTOs

```ts
export interface CreateWorkspaceRequest {
  name: string
  slug: string
}

export interface CreateWorkspaceResponse {
  workspace: WorkspaceSummary
}

export interface InviteWorkspaceMemberRequest {
  email: string
  role: MemberRole
}

export interface UpdateWorkspaceMemberRoleRequest {
  role: MemberRole
}
```

## 6.2 App DTOs

```ts
export interface CreateAppRequest {
  workspaceId: string
  internalName: string
  slug: string
  canonicalProductName: string
  primaryLocale: string
  platforms: Array<{
    platform: Platform
    bundleOrPackageId: string
  }>
}

export interface CreateAppResponse {
  app: AppSummary
  platforms: AppPlatformSummary[]
}

export interface UpdateAppRequest {
  internalName?: string
  canonicalProductName?: string
  primaryLocale?: string
  status?: 'active' | 'archived'
}

export interface AddAppLocaleRequest {
  localeCode: string
}
```

## 6.3 Metadata DTOs

```ts
export interface MetadataEntryInput {
  localeCode?: string | null
  platform?: Platform | null
  fieldKey: MetadataFieldKey
  value: unknown
}

export interface BulkUpsertMetadataEntriesRequest {
  appId: string
  entries: MetadataEntryInput[]
}

export interface ResolveMetadataRequest {
  appId: string
  releaseId?: string
  localeCode?: string
  platform?: Platform
}

export interface ResolvedMetadataField {
  fieldKey: MetadataFieldKey
  value: unknown
  resolvedFrom: {
    scopeType: MetadataScopeType
    localeCode: string | null
    platform: Platform | null
  } | null
}

export interface ResolveMetadataResponse {
  fields: ResolvedMetadataField[]
}
```

## 6.4 Release DTOs

```ts
export interface CreateReleaseRequest {
  appId: string
  versionLabel: string
  releaseName?: string | null
  cloneFromReleaseId?: string | null
}

export interface CreateReleaseResponse {
  release: ReleaseSummary
  platformStates: ReleasePlatformStateSummary[]
}

export interface UpdateReleaseRequest {
  releaseName?: string | null
  status?: ReleaseStatus
}

export interface FreezeReleaseRequest {
  freezeState: FreezeState
}

export interface AttachBuildToReleaseRequest {
  platform: Platform
  buildArtifactId: string
  desiredVersionName?: string | null
  desiredBuildNumber?: string | null
}
```

## 6.5 Asset DTOs

```ts
export interface CreateAssetUploadSessionRequest {
  appId: string
  releaseId?: string | null
  assetType: AssetType
  mimeType: string
  fileName: string
  platform?: Platform | null
  localeCode?: string | null
  deviceClass?: string | null
}

export interface CreateAssetUploadSessionResponse {
  assetId: string
  uploadUrl: string
  objectKey: string
  headers?: Record<string, string>
}

export interface FinalizeAssetUploadRequest {
  assetId: string
  checksum: string
  fileSizeBytes: number
  width?: number | null
  height?: number | null
}

export interface FinalizeAssetUploadResponse {
  asset: AssetSummary
}
```

## 6.6 Template and render DTOs

```ts
export interface CreateScreenshotTemplateRequest {
  appId: string
  name: string
}

export interface CreateScreenshotTemplateVersionRequest {
  templateId: string
  definition: ScreenshotTemplateDefinition
}

export interface QueueRenderJobRequest {
  appId: string
  releaseId?: string | null
  templateVersionId: string
  inputs: RenderJobInputPayload
}

export interface QueueRenderJobResponse {
  renderJobId: string
  status: RenderJobStatus
}
```

## 6.7 Validation DTOs

```ts
export interface RunReleaseValidationRequest {
  releaseId: string
}

export interface RunReleaseValidationResponse {
  issues: ValidationIssueSummary[]
  summary: {
    errorCount: number
    warningCount: number
    infoCount: number
  }
}

export interface AcknowledgeValidationIssueRequest {
  issueId: string
}
```

## 6.8 Provider connection DTOs

```ts
export interface CreateProviderConnectionRequest {
  workspaceId: string
  provider: Provider
  credentials: Record<string, unknown>
}

export interface ValidateProviderConnectionResponse {
  connection: ProviderConnectionSummary
  isValid: boolean
  message?: string | null
}
```

## 6.9 Sync DTOs

```ts
export interface FetchRemoteSnapshotRequest {
  appPlatformId: string
  releaseId?: string | null
  snapshotType?: 'app_listing' | 'release_state' | 'assets' | 'full'
}

export interface CreateSyncPlanRequest {
  releaseId: string
  platforms?: Platform[]
}

export interface ExecuteSyncPlanRequest {
  releaseId: string
  plan: SyncPlan
}
```

---

# 7. Rendering contracts

Create in `packages/domain/src/rendering.ts`.

## 7.1 Screenshot template definition

```ts
export interface ScreenshotTemplateDefinition {
  canvas: {
    width: number
    height: number
  }
  background?: {
    type: 'solid' | 'gradient' | 'image'
    value?: string
    assetId?: string
  }
  regions: ScreenshotTemplateRegion[]
  safeZones?: Array<{
    x: number
    y: number
    width: number
    height: number
    label?: string
  }>
  outputTargets: OutputTarget[]
}

export type OutputTarget =
  | 'ios_6_7'
  | 'ios_5_5'
  | 'ios_ipad_13'
  | 'android_phone'
  | 'android_7_tablet'
  | 'android_10_tablet'
  | 'android_feature_graphic'

export type ScreenshotTemplateRegion =
  | ScreenshotImageRegion
  | ScreenshotTextRegion

export interface ScreenshotImageRegion {
  id: string
  type: 'image'
  source: 'screenshot' | 'background_asset' | 'badge_asset'
  x: number
  y: number
  width: number
  height: number
  fit: 'contain' | 'cover' | 'fill'
  borderRadius?: number
}

export interface ScreenshotTextRegion {
  id: string
  type: 'text'
  token: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontWeight?: number
  align?: 'left' | 'center' | 'right'
  color?: string
  lineClamp?: number
}
```

## 7.2 Render input payload

```ts
export interface RenderSlideInput {
  slideKey: string
  sourceAssetId: string
  localeCode?: string | null
  tokens: Record<string, string>
  platform?: Platform | null
}

export interface RenderJobInputPayload {
  slides: RenderSlideInput[]
  outputTargets: OutputTarget[]
  localeCodes: string[]
}
```

## 7.3 Render output manifest

```ts
export interface RenderedAssetDescriptor {
  assetId: string
  objectKey: string
  outputTarget: OutputTarget
  localeCode: string | null
  width: number
  height: number
  checksum: string
}

export interface RenderJobOutputManifest {
  outputs: RenderedAssetDescriptor[]
}
```

---

# 8. Validation contracts

Create in `packages/domain/src/validation.ts`.

```ts
export interface ValidationContext {
  releaseId: string
  app: AppSummary
  platforms: AppPlatformSummary[]
  locales: AppLocaleSummary[]
  release: ReleaseSummary
  releasePlatformStates: ReleasePlatformStateSummary[]
  resolvedMetadata: ResolvedMetadataField[]
  assets: AssetSummary[]
  builds: BuildArtifactSummary[]
  reviewProfilePresent: boolean
}

export interface ValidationRule {
  code: string
  category: ValidationCategory
  evaluate(input: ValidationContext): ValidationIssueDraft[]
}

export interface ValidationIssueDraft {
  platform?: Platform | null
  localeCode?: string | null
  severity: ValidationSeverity
  category: ValidationCategory
  code: string
  message: string
  remediationHint?: string | null
  pathReference?: string | null
}
```

Rule code naming examples:

* `metadata.product_name.missing`
* `metadata.privacy_policy_url.missing`
* `release.build.version_mismatch`
* `assets.screenshots.ios_6_7.missing`
* `review.demo_credentials.missing`

---

# 9. Sync contracts

Create in `packages/domain/src/sync.ts`.

## 9.1 Remote normalized snapshot

```ts
export interface NormalizedRemoteField {
  fieldKey: MetadataFieldKey
  localeCode?: string | null
  platform?: Platform | null
  value: unknown
}

export interface NormalizedRemoteAsset {
  platform: Platform
  localeCode?: string | null
  assetType: AssetType
  deviceClass?: string | null
  checksum?: string | null
  remoteId?: string | null
  orderIndex?: number | null
}

export interface NormalizedRemoteSnapshot {
  provider: Provider
  appPlatformId: string
  fields: NormalizedRemoteField[]
  assets: NormalizedRemoteAsset[]
  releaseState?: {
    versionName?: string | null
    buildNumber?: string | null
    submissionStatus?: SubmissionStatus | null
    remoteReleaseId?: string | null
  }
}
```

## 9.2 Diff model

```ts
export interface MetadataDiffItem {
  type: 'metadata'
  fieldKey: MetadataFieldKey
  localeCode?: string | null
  platform?: Platform | null
  state: RemoteDiffState
  localValue: unknown
  remoteValue: unknown
}

export interface AssetDiffItem {
  type: 'asset'
  assetType: AssetType
  localeCode?: string | null
  platform: Platform
  deviceClass?: string | null
  state: RemoteDiffState
  localChecksum?: string | null
  remoteChecksum?: string | null
}

export interface ReleaseStateDiffItem {
  type: 'release_state'
  platform: Platform
  key: 'version_name' | 'build_number' | 'submission_status'
  state: RemoteDiffState
  localValue: unknown
  remoteValue: unknown
}

export type SyncDiffItem = MetadataDiffItem | AssetDiffItem | ReleaseStateDiffItem
```

## 9.3 Sync plan

```ts
export interface SyncPlanItem {
  id: string
  provider: Provider
  platform: Platform
  operation:
    | 'upsert_metadata_field'
    | 'delete_metadata_field'
    | 'upload_asset'
    | 'delete_asset'
    | 'reorder_assets'
    | 'attach_build'
    | 'update_release_notes'
  targetPath: string
  strategy: 'apply_local' | 'adopt_remote' | 'skip' | 'manual'
  blocking: boolean
  payload?: Record<string, unknown>
}

export interface SyncPlan {
  releaseId: string
  provider: Provider
  items: SyncPlanItem[]
  generatedAt: string
}
```

## 9.4 Provider execution result

```ts
export interface ProviderExecutionResult {
  jobStatus: SyncJobStatus
  itemResults: Array<{
    itemId: string
    status: 'succeeded' | 'failed' | 'skipped'
    message?: string | null
    error?: ProviderError | null
  }>
}

export interface ProviderError {
  provider: Provider
  code: string
  message: string
  isRetryable: boolean
  raw?: unknown
}
```

---

# 10. Provider adapter contracts

Create in `packages/providers/src/types.ts`.

```ts
export interface ProviderCapabilities {
  localizedMetadata: boolean
  screenshotUpload: boolean
  releaseNotes: boolean
  buildAssignment: boolean
  reviewNotesApi: boolean
  draftTransactions: boolean
}

export interface ProviderConnectionSecretRef {
  connectionId: string
  provider: Provider
}

export interface FetchProviderSnapshotInput {
  appPlatform: AppPlatformSummary
  release?: ReleaseSummary | null
}

export interface StoreProviderAdapter {
  provider: Provider
  getCapabilities(): ProviderCapabilities
  validateConnection(secretRef: ProviderConnectionSecretRef): Promise<{ isValid: boolean; message?: string }>
  fetchNormalizedSnapshot(input: FetchProviderSnapshotInput): Promise<NormalizedRemoteSnapshot>
  createSyncPlan(args: {
    release: ReleaseSummary
    platform: Platform
    diffItems: SyncDiffItem[]
  }): Promise<SyncPlan>
  executeSyncPlan(args: {
    plan: SyncPlan
    secretRef: ProviderConnectionSecretRef
  }): Promise<ProviderExecutionResult>
}
```

---

# 11. Queue contracts

Create in `packages/domain/src/queues.ts`.

## 11.1 Queue names

```ts
export const QueueNames = {
  renderJobs: 'render-jobs',
  syncJobs: 'sync-jobs',
  remoteSnapshotJobs: 'remote-snapshot-jobs',
  validationJobs: 'validation-jobs',
} as const
```

## 11.2 Queue payloads

```ts
export interface RenderJobQueuePayload {
  renderJobId: string
}

export interface SyncJobQueuePayload {
  syncJobId: string
}

export interface RemoteSnapshotJobQueuePayload {
  appPlatformId: string
  releaseId?: string | null
  snapshotType?: 'app_listing' | 'release_state' | 'assets' | 'full'
}

export interface ValidationJobQueuePayload {
  releaseId: string
}
```

---

# 12. Audit event contract

Create in `packages/domain/src/events.ts`.

## 12.1 Event names

```ts
export const AuditEventTypeValues = [
  'workspace.created',
  'workspace.member.invited',
  'workspace.member.role_updated',
  'app.created',
  'app.updated',
  'app.archived',
  'app.platform.added',
  'app.locale.added',
  'metadata.entry.upserted',
  'metadata.bulk_upserted',
  'release.created',
  'release.cloned',
  'release.updated',
  'release.frozen',
  'release.unfrozen',
  'release.build.attached',
  'asset.upload_session.created',
  'asset.upload.finalized',
  'template.created',
  'template.version.created',
  'render.job.queued',
  'render.job.completed',
  'validation.run.completed',
  'provider.connection.created',
  'provider.connection.validated',
  'remote_snapshot.fetched',
  'sync.plan.created',
  'sync.job.started',
  'sync.job.completed',
  'review_profile.updated',
  'rejection.recorded',
  'comment.created',
] as const

export type AuditEventType = (typeof AuditEventTypeValues)[number]
```

## 12.2 Audit event write contract

```ts
export interface AuditEventWriteInput {
  workspaceId: string
  appId?: string | null
  releaseId?: string | null
  actorUserId?: string | null
  eventType: AuditEventType
  payload?: Record<string, unknown>
}
```

---

# 13. Route map contract

Use these route patterns in `apps/api`.

## 13.1 Workspaces

* `POST /api/workspaces`
* `GET /api/workspaces`
* `GET /api/workspaces/:workspaceId`
* `POST /api/workspaces/:workspaceId/members`
* `PATCH /api/workspaces/:workspaceId/members/:memberId`
* `DELETE /api/workspaces/:workspaceId/members/:memberId`

## 13.2 Apps

* `POST /api/apps`
* `GET /api/apps`
* `GET /api/apps/:appId`
* `PATCH /api/apps/:appId`
* `POST /api/apps/:appId/locales`
* `GET /api/apps/:appId/locales`

## 13.3 Metadata

* `GET /api/apps/:appId/metadata/draft`
* `PUT /api/apps/:appId/metadata/draft/entries`
* `POST /api/apps/:appId/metadata/resolve`

## 13.4 Releases

* `POST /api/releases`
* `GET /api/releases/:releaseId`
* `GET /api/apps/:appId/releases`
* `PATCH /api/releases/:releaseId`
* `POST /api/releases/:releaseId/freeze`
* `POST /api/releases/:releaseId/attach-build`

## 13.5 Assets

* `POST /api/assets/upload-session`
* `POST /api/assets/finalize-upload`
* `GET /api/apps/:appId/assets`

## 13.6 Templates and render

* `POST /api/templates`
* `POST /api/templates/:templateId/versions`
* `GET /api/apps/:appId/templates`
* `POST /api/render-jobs`
* `GET /api/render-jobs/:renderJobId`

## 13.7 Validation

* `POST /api/validation/releases/:releaseId/run`
* `GET /api/validation/releases/:releaseId/issues`
* `POST /api/validation/issues/:issueId/acknowledge`

## 13.8 Providers and sync

* `POST /api/providers/connections`
* `POST /api/providers/connections/:connectionId/validate`
* `POST /api/sync/remote-snapshots`
* `POST /api/sync/plans`
* `POST /api/sync/execute`
* `GET /api/sync/jobs/:syncJobId`

## 13.9 Activity

* `GET /api/apps/:appId/activity`
* `GET /api/releases/:releaseId/activity`

---

# 14. Folder-by-folder ownership map

## `packages/domain`

Owns:

* enums
* interfaces
* DTOs
* queue payloads
* event types
* validation and sync shared contracts

Must not contain:

* database client code
* framework imports

## `packages/database`

Owns:

* Prisma schema
* migrations
* DB client
* seed scripts
* repository helpers if they are persistence-specific

## `packages/providers`

Owns:

* provider adapter contracts
* Apple adapter
* Google adapter
* provider capability maps
* snapshot normalization logic

## `packages/validation`

Owns:

* validation rule implementations
* rule registry
* validation runner

## `packages/rendering`

Owns:

* template schema validation
* render orchestration helpers
* stale detection helpers

## `packages/events`

Owns:

* audit event writer helper
* maybe event payload schemas

## `apps/api`

Owns:

* controllers/routes
* auth/session integration
* RBAC enforcement
* use-case orchestration

## `apps/web`

Owns:

* UI
* query hooks
* forms
* pages
* presentation logic only

## `apps/worker`

Owns:

* queue processors
* background orchestration
* provider sync execution hooks
* render processing

---

# 15. Zod schema generation rule

For all DTOs and important payloads, create matching Zod schemas in `packages/domain/src/schemas/`.

Examples required:

* `CreateWorkspaceRequestSchema`
* `CreateAppRequestSchema`
* `BulkUpsertMetadataEntriesRequestSchema`
* `CreateReleaseRequestSchema`
* `QueueRenderJobRequestSchema`
* `CreateProviderConnectionRequestSchema`
* `CreateSyncPlanRequestSchema`
* `ExecuteSyncPlanRequestSchema`

This prevents every agent from validating payloads differently.

---

# 16. Effective metadata resolution contract

Create resolver in shared domain/service layer with this signature:

```ts
export interface ResolveEffectiveMetadataInput {
  appDraftEntries: MetadataEntryRecord[]
  releaseSnapshotEntries?: MetadataEntryRecord[]
  localeCode?: string | null
  platform?: Platform | null
}

export interface ResolvedEffectiveMetadataOutput {
  fields: ResolvedMetadataField[]
}
```

Resolution order:

1. release snapshot platform+locale override
2. release snapshot locale override
3. release snapshot platform override
4. release snapshot canonical
5. app draft platform+locale override
6. app draft locale override
7. app draft platform override
8. app draft canonical

Do not let this logic get duplicated in API and web separately.

---

# 17. Storage key contract

Use deterministic object storage keys.

Suggested patterns:

```text
workspaces/{workspaceId}/apps/{appId}/assets/{assetId}/{fileName}
workspaces/{workspaceId}/apps/{appId}/templates/{templateId}/versions/{versionNumber}.json
workspaces/{workspaceId}/apps/{appId}/releases/{releaseId}/renders/{renderJobId}/{outputTarget}/{localeCode}/{fileName}
workspaces/{workspaceId}/apps/{appId}/builds/{buildArtifactId}/{fileName}
```

Do not rely on original file names alone.

---

# 18. Seed/demo contract

The seed script should create:

* 1 user
* 1 workspace
* 1 app
* 2 platforms: ios, android
* 2 locales: en-US, en-NZ
* 1 previous release: `1.0.0`
* 1 draft release: `1.1.0`
* draft metadata entries
* at least 4 source screenshot assets
* 1 screenshot template with 1 version
* 1 render job completed
* 2 validation issues
* 1 provider connection per provider in mocked/placeholder state
* a few audit events

This makes the product instantly demoable instead of looking like an abandoned warehouse.

---

# 19. Initial file map

This is the minimum file map Codex should follow.

## `packages/domain/src`

```text
enums.ts
metadata-field-keys.ts
rendering.ts
validation.ts
sync.ts
queues.ts
events.ts
contracts/
  workspace.ts
  app.ts
  metadata.ts
  release.ts
  asset.ts
  build.ts
  provider.ts
  audit.ts
dto/
  workspace.ts
  app.ts
  metadata.ts
  release.ts
  asset.ts
  template.ts
  validation.ts
  provider.ts
  sync.ts
schemas/
  workspace.ts
  app.ts
  metadata.ts
  release.ts
  asset.ts
  template.ts
  validation.ts
  provider.ts
  sync.ts
```

## `packages/database/src`

```text
client.ts
seed.ts
repositories/
  workspace-repository.ts
  app-repository.ts
  metadata-repository.ts
  release-repository.ts
  asset-repository.ts
  validation-repository.ts
  provider-repository.ts
  audit-repository.ts
```

## `packages/providers/src`

```text
index.ts
types.ts
capability-map.ts
apple/
  adapter.ts
  client.ts
  mapper.ts
  fixtures/
google/
  adapter.ts
  client.ts
  mapper.ts
  fixtures/
```

## `packages/validation/src`

```text
index.ts
runner.ts
rules/
  metadata-product-name-missing.ts
  metadata-privacy-policy-missing.ts
  release-build-version-mismatch.ts
  assets-ios-screenshots-missing.ts
  review-demo-credentials-missing.ts
```

## `packages/rendering/src`

```text
index.ts
template-schema.ts
render-service.ts
stale-detector.ts
```

---

# 20. Merge safety checklist

Before merging any agent branch that touches contracts, verify:

* shared enums unchanged or intentionally versioned
* Prisma enum names align with TS enums
* DTO names align with route handlers
* queue payload types align with worker consumers
* audit event names align with emitters
* metadata field keys are not duplicated in random files
* effective metadata resolver remains single-source

If this checklist is ignored, the repo will age like milk in direct sunlight.

---

# 21. Final instruction to Codex agents

Do not improvise the core nouns.

The key nouns are:

* Workspace
* App
* AppPlatform
* AppLocale
* MetadataDocument
* MetadataEntry
* Release
* ReleasePlatformState
* Asset
* ScreenshotTemplate
* ScreenshotTemplateVersion
* RenderJob
* BuildArtifact
* ValidationIssue
* ProviderConnection
* RemoteSnapshot
* SyncJob
* ReviewProfile
* AuditEvent

Use them consistently.

This contracts pack is the law until intentionally changed.
