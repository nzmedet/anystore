import { Injectable, NotFoundException } from '@nestjs/common'
import { createHash, randomUUID } from 'node:crypto'
import {
  AppLocaleStatus,
  AppPlatformStatus,
  AppStatus,
  ApiSession,
  AssetStatus,
  AssetSummary,
  AssetType,
  AuditEventSummary,
  BuildArtifactSummary,
  CommentSummary,
  FreezeState,
  MetadataDocumentSummary,
  MetadataEntryRecord,
  MetadataScopeType,
  Platform,
  Provider,
  ProviderCapabilities,
  ProviderConnectionSummary,
  ProviderConnectionStatus,
  ReleasePlatformStateSummary,
  ReleaseStatus,
  ReleaseSummary,
  RemoteDiffItem,
  RemoteSnapshotSummary,
  RejectionEventSummary,
  ResolvedMetadataField,
  ReviewProfileSummary,
  ReviewSecretAccessLevel,
  SignedUploadResponse,
  SyncJobStatus,
  SyncJobSummary,
  SyncPlanItem,
  SyncPlanSummary,
  ValidationCategory,
  ValidationIssueStatus,
  ValidationIssueSummary,
  ValidationRunSummary,
  ValidationSeverity,
  WorkspaceMemberSummary,
  WorkspaceSummary,
  AppSummary,
  AppPlatformSummary,
  AppLocaleSummary
} from './types'

interface UserRecord {
  id: string
  email: string
  displayName: string
  workspaceId: string
  role: 'owner'
  createdAt: string
  updatedAt: string
}

interface AppPlatformRecord extends AppPlatformSummary {}
interface AppLocaleRecord extends AppLocaleSummary {}
interface MetadataDocumentRecord extends MetadataDocumentSummary {}
interface ReleasePlatformStateRecord extends ReleasePlatformStateSummary {}
interface ValidationIssueRecord extends ValidationIssueSummary {}
interface ValidationRunRecord extends ValidationRunSummary {}
interface RemoteSnapshotRecord extends RemoteSnapshotSummary {}
interface SyncJobRecord extends SyncJobSummary {}
interface ReviewProfileRecord extends ReviewProfileSummary {}
interface RejectionEventRecord extends RejectionEventSummary {}
interface CommentRecord extends CommentSummary {}
interface AuditEventRecord extends AuditEventSummary {}

interface AppState {
  users: UserRecord[]
  sessions: { token: string; userId: string }[]
  workspaces: WorkspaceSummary[]
  members: WorkspaceMemberSummary[]
  apps: AppSummary[]
  platforms: AppPlatformRecord[]
  locales: AppLocaleRecord[]
  metadataDocuments: MetadataDocumentRecord[]
  metadataEntries: MetadataEntryRecord[]
  releases: ReleaseSummary[]
  releasePlatformStates: ReleasePlatformStateRecord[]
  assets: AssetSummary[]
  buildArtifacts: BuildArtifactSummary[]
  validationIssues: ValidationIssueRecord[]
  validationRuns: ValidationRunRecord[]
  providerConnections: ProviderConnectionSummary[]
  remoteSnapshots: RemoteSnapshotRecord[]
  syncJobs: SyncJobRecord[]
  reviewProfiles: ReviewProfileRecord[]
  rejectionEvents: RejectionEventRecord[]
  comments: CommentRecord[]
  auditEvents: AuditEventRecord[]
}

export interface CreateWorkspaceInput {
  name: string
  slug?: string
}

export interface UpdateWorkspaceInput {
  name?: string
  slug?: string
}

export interface CreateAppInput {
  workspaceId: string
  slug: string
  internalName: string
  canonicalProductName: string
  primaryLocale: string
}

export interface UpdateAppInput {
  slug?: string
  internalName?: string
  canonicalProductName?: string
  primaryLocale?: string
  status?: AppStatus
}

export interface AddPlatformInput {
  platform: Platform
  bundleOrPackageId: string
  remoteAppId?: string | null
  defaultTrack?: string | null
}

export interface AddLocaleInput {
  localeCode: string
}

export interface CreateMetadataDocumentInput {
  appId: string
  scopeType?: MetadataScopeType
  scopeId?: string
}

export interface UpsertMetadataEntriesInput {
  entries: Array<{
    fieldKey: string
    valueJson: unknown
    localeCode?: string | null
    platform?: Platform | null
    sourceLayer?: string
  }>
}

export interface CreateReleaseInput {
  appId: string
  versionLabel: string
  releaseName?: string | null
  createdBy?: string
}

export interface UpdateReleaseInput {
  releaseName?: string | null
  status?: ReleaseStatus
  freezeState?: FreezeState
}

export interface AddReleasePlatformStateInput {
  platform: Platform
  targetTrack?: string | null
  desiredVersionName?: string | null
  desiredBuildNumber?: string | null
  attachedBuildId?: string | null
  submissionStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live'
  reviewStatus?: 'not_submitted' | 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected' | 'live' | null
  syncStatus?: SyncJobStatus | null
  remoteReleaseId?: string | null
}

export interface CreateAssetInput {
  appId: string
  releaseId?: string | null
  assetType: AssetType
  platform?: Platform | null
  localeCode?: string | null
  deviceClass?: string | null
  mimeType: string
  fileName: string
  checksum?: string
  width?: number | null
  height?: number | null
  fileSizeBytes?: number | null
  createdBy?: string | null
}

export interface CreateProviderConnectionInput {
  workspaceId: string
  provider: Provider
}

export interface CreateSyncRequest {
  releaseId: string
  provider: Provider
}

@Injectable()
export class ApiStoreService {
  private readonly state: AppState

  constructor() {
    const now = this.now()
    const workspaceId = this.id()
    const appId = this.id()
    const userId = this.id()
    const iosPlatformId = this.id()
    const androidPlatformId = this.id()
    const draftDocumentId = this.id()
    const releaseId = this.id()

    this.state = {
      users: [
        {
          id: userId,
          email: 'demo@anystore.dev',
          displayName: 'Demo User',
          workspaceId,
          role: 'owner',
          createdAt: now,
          updatedAt: now
        }
      ],
      sessions: [{ token: 'demo-session', userId }],
      workspaces: [
        {
          id: workspaceId,
          name: 'Demo Workspace',
          slug: 'demo-workspace',
          createdAt: now,
          updatedAt: now
        }
      ],
      members: [
        {
          id: this.id(),
          workspaceId,
          userId,
          role: 'owner',
          createdAt: now
        }
      ],
      apps: [
        {
          id: appId,
          workspaceId,
          slug: 'anystore-demo',
          internalName: 'Anystore Demo',
          canonicalProductName: 'Anystore Demo',
          primaryLocale: 'en-US',
          status: 'active',
          createdAt: now,
          updatedAt: now
        }
      ],
      platforms: [
        {
          id: iosPlatformId,
          appId,
          platform: 'ios',
          bundleOrPackageId: 'com.demo.anystore.ios',
          remoteAppId: '1234567890',
          defaultTrack: 'production',
          status: 'connected',
          createdAt: now,
          updatedAt: now
        },
        {
          id: androidPlatformId,
          appId,
          platform: 'android',
          bundleOrPackageId: 'com.demo.anystore.android',
          remoteAppId: 'com.demo.anystore',
          defaultTrack: 'production',
          status: 'connected',
          createdAt: now,
          updatedAt: now
        }
      ],
      locales: [
        {
          id: this.id(),
          appId,
          localeCode: 'en-US',
          status: 'active',
          createdAt: now
        },
        {
          id: this.id(),
          appId,
          localeCode: 'en-NZ',
          status: 'active',
          createdAt: now
        }
      ],
      metadataDocuments: [
        {
          id: draftDocumentId,
          appId,
          scopeType: 'app_draft',
          scopeId: appId,
          version: 1,
          createdAt: now,
          updatedAt: now
        }
      ],
      metadataEntries: [
        {
          id: this.id(),
          metadataDocumentId: draftDocumentId,
          localeCode: null,
          platform: null,
          fieldKey: 'product_name',
          valueJson: 'Anystore Demo',
          sourceLayer: 'app_draft',
          createdAt: now,
          updatedAt: now
        },
        {
          id: this.id(),
          metadataDocumentId: draftDocumentId,
          localeCode: null,
          platform: null,
          fieldKey: 'short_description',
          valueJson: 'Release operations control plane',
          sourceLayer: 'app_draft',
          createdAt: now,
          updatedAt: now
        },
        {
          id: this.id(),
          metadataDocumentId: draftDocumentId,
          localeCode: 'en-US',
          platform: null,
          fieldKey: 'release_notes',
          valueJson: 'Initial release notes',
          sourceLayer: 'app_draft',
          createdAt: now,
          updatedAt: now
        }
      ],
      releases: [
        {
          id: releaseId,
          appId,
          versionLabel: '1.0.0',
          releaseName: 'Initial beta',
          status: 'ready_to_sync',
          freezeState: 'frozen',
          sourceReleaseId: null,
          createdBy: userId,
          createdAt: now,
          updatedAt: now
        }
      ],
      releasePlatformStates: [
        {
          id: this.id(),
          releaseId,
          platform: 'ios',
          targetTrack: 'production',
          desiredVersionName: '1.0.0',
          desiredBuildNumber: '1',
          attachedBuildId: null,
          submissionStatus: 'not_submitted',
          syncStatus: null,
          reviewStatus: null,
          remoteReleaseId: 'ios-release-1',
          lastSyncAt: null
        },
        {
          id: this.id(),
          releaseId,
          platform: 'android',
          targetTrack: 'production',
          desiredVersionName: '1.0.0',
          desiredBuildNumber: '1',
          attachedBuildId: null,
          submissionStatus: 'not_submitted',
          syncStatus: null,
          reviewStatus: null,
          remoteReleaseId: 'android-release-1',
          lastSyncAt: null
        }
      ],
      assets: [
        {
          id: this.id(),
          appId,
          releaseId,
          sourceAssetId: null,
          assetType: 'icon_source',
          status: 'ready',
          platform: 'ios',
          localeCode: null,
          deviceClass: null,
          mimeType: 'image/png',
          objectKey: `workspaces/${workspaceId}/apps/${appId}/assets/demo-icon.png`,
          checksum: this.checksum('demo-icon'),
          width: 1024,
          height: 1024,
          fileSizeBytes: 512000,
          createdBy: userId,
          createdAt: now,
          updatedAt: now
        }
      ],
      buildArtifacts: [],
      validationIssues: [],
      validationRuns: [],
      providerConnections: [
        {
          id: this.id(),
          workspaceId,
          provider: 'app_store_connect',
          status: 'connected',
          createdAt: now,
          updatedAt: now
        },
        {
          id: this.id(),
          workspaceId,
          provider: 'google_play',
          status: 'connected',
          createdAt: now,
          updatedAt: now
        }
      ],
      remoteSnapshots: [],
      syncJobs: [],
      reviewProfiles: [
        {
          id: this.id(),
          appId,
          platform: 'ios',
          localeCode: 'en-US',
          accessLevel: 'masked',
          createdAt: now,
          updatedAt: now
        }
      ],
      rejectionEvents: [],
      comments: [],
      auditEvents: []
    }
  }

  getHealth() {
    return {
      service: 'anystore-api',
      status: 'ok' as const,
      timestamp: this.now(),
      uptimeSeconds: Math.floor(process.uptime())
    }
  }

  getSession(): ApiSession {
    const workspace = this.state.workspaces[0]
    const user = this.state.users[0]
    return {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      workspaceId: workspace.id,
      workspaceName: workspace.name
    }
  }

  signIn(email: string, displayName?: string): ApiSession {
    const existingUser = this.state.users.find((user) => user.email === email)
    const user = existingUser ?? this.state.users[0]
    if (displayName && !existingUser) {
      user.displayName = displayName
    }
    this.recordAudit(this.workspaceIdForUser(user.id), null, null, user.id, 'auth.sign_in', { email })
    return this.getSession()
  }

  signOut() {
    return { signedOut: true, timestamp: this.now() }
  }

  listWorkspaces(): WorkspaceSummary[] {
    return this.state.workspaces
  }

  getWorkspace(workspaceId: string): WorkspaceSummary {
    return this.findOrThrow(this.state.workspaces, workspaceId, 'Workspace')
  }

  createWorkspace(input: CreateWorkspaceInput): WorkspaceSummary {
    const now = this.now()
    const workspace: WorkspaceSummary = {
      id: this.id(),
      name: input.name,
      slug: input.slug ?? this.slugify(input.name),
      createdAt: now,
      updatedAt: now
    }
    this.state.workspaces.push(workspace)
    this.recordAudit(workspace.id, null, null, this.currentUserId(), 'workspace.created', { workspace })
    return workspace
  }

  updateWorkspace(workspaceId: string, input: UpdateWorkspaceInput): WorkspaceSummary {
    const workspace = this.getWorkspace(workspaceId)
    const updated = { ...workspace, ...input, updatedAt: this.now() }
    this.replaceById(this.state.workspaces, workspaceId, updated)
    this.recordAudit(workspaceId, null, null, this.currentUserId(), 'workspace.updated', { input })
    return updated
  }

  listWorkspaceMembers(workspaceId: string): WorkspaceMemberSummary[] {
    return this.state.members.filter((member) => member.workspaceId === workspaceId)
  }

  addWorkspaceMember(workspaceId: string, userId: string, role: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer'): WorkspaceMemberSummary {
    const now = this.now()
    const member: WorkspaceMemberSummary = {
      id: this.id(),
      workspaceId,
      userId,
      role,
      createdAt: now
    }
    this.state.members.push(member)
    this.recordAudit(workspaceId, null, null, this.currentUserId(), 'workspace.member.added', { member })
    return member
  }

  listApps(workspaceId?: string): AppSummary[] {
    return workspaceId ? this.state.apps.filter((app) => app.workspaceId === workspaceId) : this.state.apps
  }

  getApp(appId: string): AppSummary {
    return this.findOrThrow(this.state.apps, appId, 'App')
  }

  createApp(input: CreateAppInput): AppSummary {
    const now = this.now()
    const app: AppSummary = {
      id: this.id(),
      workspaceId: input.workspaceId,
      slug: input.slug,
      internalName: input.internalName,
      canonicalProductName: input.canonicalProductName,
      primaryLocale: input.primaryLocale,
      status: 'active',
      createdAt: now,
      updatedAt: now
    }
    this.state.apps.push(app)
    this.state.metadataDocuments.push({
      id: this.id(),
      appId: app.id,
      scopeType: 'app_draft',
      scopeId: app.id,
      version: 1,
      createdAt: now,
      updatedAt: now
    })
    this.recordAudit(input.workspaceId, app.id, null, this.currentUserId(), 'app.created', { app })
    return app
  }

  updateApp(appId: string, input: UpdateAppInput): AppSummary {
    const app = this.getApp(appId)
    const updated = { ...app, ...input, updatedAt: this.now() }
    this.replaceById(this.state.apps, appId, updated)
    this.recordAudit(app.workspaceId, app.id, null, this.currentUserId(), 'app.updated', { input })
    return updated
  }

  archiveApp(appId: string): AppSummary {
    return this.updateApp(appId, { status: 'archived' })
  }

  listPlatforms(appId?: string): AppPlatformSummary[] {
    return appId ? this.state.platforms.filter((platform) => platform.appId === appId) : this.state.platforms
  }

  addPlatform(appId: string, input: AddPlatformInput): AppPlatformSummary {
    const app = this.getApp(appId)
    const now = this.now()
    const platform: AppPlatformSummary = {
      id: this.id(),
      appId,
      platform: input.platform,
      bundleOrPackageId: input.bundleOrPackageId,
      remoteAppId: input.remoteAppId ?? null,
      defaultTrack: input.defaultTrack ?? null,
      status: 'connected',
      createdAt: now,
      updatedAt: now
    }
    this.state.platforms.push(platform)
    this.recordAudit(app.workspaceId, app.id, null, this.currentUserId(), 'app.platform.added', { platform })
    return platform
  }

  addLocale(appId: string, input: AddLocaleInput): AppLocaleSummary {
    const app = this.getApp(appId)
    const now = this.now()
    const locale: AppLocaleSummary = {
      id: this.id(),
      appId,
      localeCode: input.localeCode,
      status: 'active',
      createdAt: now
    }
    this.state.locales.push(locale)
    this.recordAudit(app.workspaceId, app.id, null, this.currentUserId(), 'app.locale.added', { locale })
    return locale
  }

  listLocales(appId?: string): AppLocaleSummary[] {
    return appId ? this.state.locales.filter((locale) => locale.appId === appId) : this.state.locales
  }

  listMetadataDocuments(appId?: string): MetadataDocumentSummary[] {
    return appId ? this.state.metadataDocuments.filter((doc) => doc.appId === appId) : this.state.metadataDocuments
  }

  getMetadataDocument(documentId: string): MetadataDocumentSummary {
    return this.findOrThrow(this.state.metadataDocuments, documentId, 'Metadata document')
  }

  createMetadataDocument(input: CreateMetadataDocumentInput): MetadataDocumentSummary {
    const app = this.getApp(input.appId)
    const now = this.now()
    const document: MetadataDocumentSummary = {
      id: this.id(),
      appId: input.appId,
      scopeType: input.scopeType ?? 'app_draft',
      scopeId: input.scopeId ?? input.appId,
      version: 1,
      createdAt: now,
      updatedAt: now
    }
    this.state.metadataDocuments.push(document)
    this.recordAudit(app.workspaceId, app.id, null, this.currentUserId(), 'metadata.document.created', { document })
    return document
  }

  upsertMetadataEntries(documentId: string, input: UpsertMetadataEntriesInput): MetadataEntryRecord[] {
    const document = this.getMetadataDocument(documentId)
    const now = this.now()
    const updatedEntries: MetadataEntryRecord[] = []

    for (const incoming of input.entries) {
      const existingIndex = this.state.metadataEntries.findIndex(
        (entry) =>
          entry.metadataDocumentId === documentId &&
          entry.fieldKey === incoming.fieldKey &&
          entry.localeCode === (incoming.localeCode ?? null) &&
          entry.platform === (incoming.platform ?? null)
      )

      const entry: MetadataEntryRecord = {
        id: existingIndex >= 0 ? this.state.metadataEntries[existingIndex].id : this.id(),
        metadataDocumentId: documentId,
        localeCode: incoming.localeCode ?? null,
        platform: incoming.platform ?? null,
        fieldKey: incoming.fieldKey,
        valueJson: incoming.valueJson,
        sourceLayer: incoming.sourceLayer ?? document.scopeType,
        createdAt: existingIndex >= 0 ? this.state.metadataEntries[existingIndex].createdAt : now,
        updatedAt: now
      }

      if (existingIndex >= 0) {
        this.state.metadataEntries[existingIndex] = entry
      } else {
        this.state.metadataEntries.push(entry)
      }

      updatedEntries.push(entry)
    }

    const app = this.getApp(document.appId)
    this.recordAudit(app.workspaceId, app.id, null, this.currentUserId(), 'metadata.entries.upserted', {
      documentId,
      count: updatedEntries.length
    })
    return updatedEntries
  }

  resolveMetadata(documentId: string): ResolvedMetadataField[] {
    const document = this.getMetadataDocument(documentId)
    const entries = this.state.metadataEntries.filter((entry) => entry.metadataDocumentId === documentId)
    return this.resolveEntries(entries)
  }

  listReleases(appId?: string): ReleaseSummary[] {
    return appId ? this.state.releases.filter((release) => release.appId === appId) : this.state.releases
  }

  getRelease(releaseId: string): ReleaseSummary {
    return this.findOrThrow(this.state.releases, releaseId, 'Release')
  }

  createRelease(input: CreateReleaseInput): ReleaseSummary {
    const app = this.getApp(input.appId)
    const now = this.now()
    const release: ReleaseSummary = {
      id: this.id(),
      appId: input.appId,
      versionLabel: input.versionLabel,
      releaseName: input.releaseName ?? null,
      status: 'draft',
      freezeState: 'mutable',
      sourceReleaseId: null,
      createdBy: input.createdBy ?? this.currentUserId(),
      createdAt: now,
      updatedAt: now
    }
    this.state.releases.push(release)
    this.state.releasePlatformStates.push(
      ...this.listPlatforms(app.id).map((platform) => ({
        id: this.id(),
        releaseId: release.id,
        platform: platform.platform,
        targetTrack: platform.defaultTrack,
        desiredVersionName: release.versionLabel,
        desiredBuildNumber: null,
        attachedBuildId: null,
        submissionStatus: 'not_submitted' as const,
        syncStatus: null,
        reviewStatus: null,
        remoteReleaseId: platform.remoteAppId,
        lastSyncAt: null
      }))
    )
    this.snapshotReleaseMetadata(release)
    this.recordAudit(app.workspaceId, app.id, release.id, this.currentUserId(), 'release.created', { release })
    return release
  }

  updateRelease(releaseId: string, input: UpdateReleaseInput): ReleaseSummary {
    const release = this.getRelease(releaseId)
    const updated = { ...release, ...input, updatedAt: this.now() }
    this.replaceById(this.state.releases, releaseId, updated)
    this.recordAudit(this.workspaceIdForRelease(releaseId), updated.appId, releaseId, this.currentUserId(), 'release.updated', { input })
    return updated
  }

  cloneRelease(releaseId: string): ReleaseSummary {
    const release = this.getRelease(releaseId)
    const cloned = this.createRelease({
      appId: release.appId,
      versionLabel: this.bumpVersionLabel(release.versionLabel),
      releaseName: release.releaseName,
      createdBy: release.createdBy
    })
    this.recordAudit(this.workspaceIdForRelease(releaseId), release.appId, cloned.id, this.currentUserId(), 'release.cloned', {
      sourceReleaseId: releaseId,
      clonedReleaseId: cloned.id
    })
    return cloned
  }

  freezeRelease(releaseId: string): ReleaseSummary {
    const updated = this.updateRelease(releaseId, { freezeState: 'frozen', status: 'ready_to_sync' })
    this.snapshotReleaseMetadata(updated)
    this.recordAudit(this.workspaceIdForRelease(releaseId), updated.appId, releaseId, this.currentUserId(), 'release.frozen', {})
    return updated
  }

  unfreezeRelease(releaseId: string): ReleaseSummary {
    return this.updateRelease(releaseId, { freezeState: 'mutable' })
  }

  listReleasePlatformStates(releaseId?: string): ReleasePlatformStateSummary[] {
    return releaseId
      ? this.state.releasePlatformStates.filter((state) => state.releaseId === releaseId)
      : this.state.releasePlatformStates
  }

  addReleasePlatformState(releaseId: string, input: AddReleasePlatformStateInput): ReleasePlatformStateSummary {
    const release = this.getRelease(releaseId)
    const now = this.now()
    const state: ReleasePlatformStateSummary = {
      id: this.id(),
      releaseId,
      platform: input.platform,
      targetTrack: input.targetTrack ?? null,
      desiredVersionName: input.desiredVersionName ?? release.versionLabel,
      desiredBuildNumber: input.desiredBuildNumber ?? null,
      attachedBuildId: input.attachedBuildId ?? null,
      submissionStatus: input.submissionStatus ?? 'not_submitted',
      syncStatus: input.syncStatus ?? null,
      reviewStatus: input.reviewStatus ?? null,
      remoteReleaseId: input.remoteReleaseId ?? null,
      lastSyncAt: null
    }
    this.state.releasePlatformStates.push(state)
    this.recordAudit(this.workspaceIdForRelease(releaseId), release.appId, releaseId, this.currentUserId(), 'release.platform_state.added', {
      state
    })
    return state
  }

  listAssets(appId?: string, releaseId?: string): AssetSummary[] {
    return this.state.assets.filter((asset) => {
      if (appId && asset.appId !== appId) return false
      if (releaseId && asset.releaseId !== releaseId) return false
      return true
    })
  }

  getAsset(assetId: string): AssetSummary {
    return this.findOrThrow(this.state.assets, assetId, 'Asset')
  }

  createAsset(input: CreateAssetInput): AssetSummary {
    const app = this.getApp(input.appId)
    const now = this.now()
    const assetId = this.id()
    const asset: AssetSummary = {
      id: assetId,
      appId: input.appId,
      releaseId: input.releaseId ?? null,
      sourceAssetId: null,
      assetType: input.assetType,
      status: 'ready',
      platform: input.platform ?? null,
      localeCode: input.localeCode ?? null,
      deviceClass: input.deviceClass ?? null,
      mimeType: input.mimeType,
      objectKey: this.objectKeyForAsset(app.workspaceId, input.appId, assetId, input.fileName),
      checksum: input.checksum ?? this.checksum(input.fileName),
      width: input.width ?? null,
      height: input.height ?? null,
      fileSizeBytes: input.fileSizeBytes ?? null,
      createdBy: input.createdBy ?? this.currentUserId(),
      createdAt: now,
      updatedAt: now
    }
    this.state.assets.push(asset)
    this.recordAudit(app.workspaceId, app.id, input.releaseId ?? null, this.currentUserId(), 'asset.created', { asset })
    return asset
  }

  updateAsset(assetId: string, patch: Partial<AssetSummary>): AssetSummary {
    const asset = this.getAsset(assetId)
    const updated = { ...asset, ...patch, updatedAt: this.now() }
    this.replaceById(this.state.assets, assetId, updated)
    this.recordAudit(this.workspaceIdForApp(asset.appId), asset.appId, asset.releaseId, this.currentUserId(), 'asset.updated', { patch })
    return updated
  }

  createSignedUpload(input: { appId: string; fileName: string; mimeType: string }): SignedUploadResponse {
    const app = this.getApp(input.appId)
    const objectKey = this.objectKeyForAsset(app.workspaceId, input.appId, this.id(), input.fileName)
    return {
      uploadUrl: `https://upload.local/${encodeURIComponent(objectKey)}`,
      objectKey,
      headers: {
        'content-type': input.mimeType
      }
    }
  }

  listValidationIssues(releaseId?: string): ValidationIssueSummary[] {
    return releaseId ? this.state.validationIssues.filter((issue) => issue.releaseId === releaseId) : this.state.validationIssues
  }

  getValidationRun(runId: string): ValidationRunSummary {
    return this.findOrThrow(this.state.validationRuns, runId, 'Validation run')
  }

  runValidation(releaseId: string): { run: ValidationRunSummary; issues: ValidationIssueSummary[] } {
    const release = this.getRelease(releaseId)
    const startedAt = this.now()
    const issues = this.buildValidationIssues(release)
    this.state.validationIssues = this.state.validationIssues.filter((issue) => issue.releaseId !== releaseId)
    this.state.validationIssues.push(...issues)
    const run: ValidationRunSummary = {
      id: this.id(),
      releaseId,
      status: issues.some((issue) => issue.severity === 'error') ? 'failed' : 'succeeded',
      startedAt,
      completedAt: this.now(),
      createdAt: startedAt
    }
    this.state.validationRuns.push(run)
    this.recordAudit(this.workspaceIdForRelease(releaseId), release.appId, releaseId, this.currentUserId(), 'validation.run.completed', {
      issueCount: issues.length
    })
    return { run, issues }
  }

  listProviderConnections(workspaceId?: string): ProviderConnectionSummary[] {
    return workspaceId
      ? this.state.providerConnections.filter((connection) => connection.workspaceId === workspaceId)
      : this.state.providerConnections
  }

  getProviderConnection(connectionId: string): ProviderConnectionSummary {
    return this.findOrThrow(this.state.providerConnections, connectionId, 'Provider connection')
  }

  createProviderConnection(input: CreateProviderConnectionInput): ProviderConnectionSummary {
    const now = this.now()
    const connection: ProviderConnectionSummary = {
      id: this.id(),
      workspaceId: input.workspaceId,
      provider: input.provider,
      status: 'connected',
      createdAt: now,
      updatedAt: now
    }
    this.state.providerConnections.push(connection)
    this.recordAudit(input.workspaceId, null, null, this.currentUserId(), 'provider.connection.created', { connection })
    return connection
  }

  updateProviderConnection(connectionId: string, patch: Partial<ProviderConnectionSummary>): ProviderConnectionSummary {
    const connection = this.getProviderConnection(connectionId)
    const updated = { ...connection, ...patch, updatedAt: this.now() }
    this.replaceById(this.state.providerConnections, connectionId, updated)
    this.recordAudit(connection.workspaceId, null, null, this.currentUserId(), 'provider.connection.updated', { patch })
    return updated
  }

  getProviderCapabilities(provider: Provider): ProviderCapabilities {
    return provider === 'app_store_connect'
      ? {
          localizedMetadata: true,
          screenshotUpload: true,
          releaseNotes: true,
          buildAssignment: true,
          reviewNotesApi: true,
          draftTransactions: true
        }
      : {
          localizedMetadata: true,
          screenshotUpload: true,
          releaseNotes: true,
          buildAssignment: true,
          reviewNotesApi: false,
          draftTransactions: false
        }
  }

  createRemoteSnapshot(releaseId: string, provider: Provider, snapshotType: RemoteSnapshotSummary['snapshotType'] = 'full'): RemoteSnapshotSummary {
    const release = this.getRelease(releaseId)
    const appPlatform = this.state.platforms.find((platform) => platform.appId === release.appId && this.providerForPlatform(platform.platform) === provider)
    const fetchedAt = this.now()
    const checksumSource = JSON.stringify({
      releaseId,
      provider,
      snapshotType,
      release: release.versionLabel
    })
    const snapshot: RemoteSnapshotSummary = {
      id: this.id(),
      appPlatformId: appPlatform?.id ?? this.id(),
      releaseId,
      provider,
      snapshotType,
      checksum: this.checksum(checksumSource),
      fetchedAt
    }
    this.state.remoteSnapshots.push(snapshot)
    return snapshot
  }

  listRemoteSnapshots(releaseId?: string): RemoteSnapshotSummary[] {
    return releaseId ? this.state.remoteSnapshots.filter((snapshot) => snapshot.releaseId === releaseId) : this.state.remoteSnapshots
  }

  createSyncPlan(releaseId: string, provider: Provider): SyncPlanSummary {
    const release = this.getRelease(releaseId)
    const items: SyncPlanItem[] = this.listReleasePlatformStates(releaseId).map((state, index) => ({
      id: this.id(),
      provider,
      platform: state.platform,
      operation: 'upsert_metadata_field',
      targetPath: `releases/${release.id}/${state.platform}/metadata`,
      strategy: 'apply_local',
      blocking: false,
      payload: {
        versionLabel: release.versionLabel,
        targetTrack: state.targetTrack
      }
    }))
    return {
      releaseId,
      provider,
      items,
      generatedAt: this.now()
    }
  }

  createSyncJob(releaseId: string): SyncJobSummary {
    const now = this.now()
    const job: SyncJobSummary = {
      id: this.id(),
      releaseId,
      status: 'queued',
      startedAt: null,
      completedAt: null,
      createdAt: now
    }
    this.state.syncJobs.push(job)
    return job
  }

  listSyncJobs(releaseId?: string): SyncJobSummary[] {
    return releaseId ? this.state.syncJobs.filter((job) => job.releaseId === releaseId) : this.state.syncJobs
  }

  createComment(input: {
    workspaceId: string
    body: string
    targetId: string
    appId?: string | null
    releaseId?: string | null
    authorUserId?: string | null
  }): CommentSummary {
    const now = this.now()
    const comment: CommentSummary = {
      id: this.id(),
      workspaceId: input.workspaceId,
      appId: input.appId ?? null,
      releaseId: input.releaseId ?? null,
      targetId: input.targetId,
      authorUserId: input.authorUserId ?? this.currentUserId(),
      body: input.body,
      createdAt: now
    }
    this.state.comments.push(comment)
    this.recordAudit(input.workspaceId, input.appId ?? null, input.releaseId ?? null, this.currentUserId(), 'comment.created', { comment })
    return comment
  }

  listActivity(workspaceId?: string, appId?: string, releaseId?: string) {
    const events = this.state.auditEvents.filter((event) => {
      if (workspaceId && event.workspaceId !== workspaceId) return false
      if (appId && event.appId !== appId) return false
      if (releaseId && event.releaseId !== releaseId) return false
      return true
    })
    const comments = this.state.comments.filter((comment) => {
      if (workspaceId && comment.workspaceId !== workspaceId) return false
      if (appId && comment.appId !== appId) return false
      if (releaseId && comment.releaseId !== releaseId) return false
      return true
    })
    return {
      events: events.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      comments: comments.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
  }

  getStateSnapshot() {
    return {
      workspaces: this.state.workspaces.length,
      apps: this.state.apps.length,
      releases: this.state.releases.length,
      assets: this.state.assets.length,
      validationIssues: this.state.validationIssues.length,
      syncJobs: this.state.syncJobs.length
    }
  }

  private snapshotReleaseMetadata(release: ReleaseSummary) {
    const sourceDocument = this.state.metadataDocuments.find(
      (document) => document.appId === release.appId && document.scopeType === 'app_draft'
    )
    if (!sourceDocument) {
      return
    }

    const existing = this.state.metadataDocuments.find(
      (document) => document.appId === release.appId && document.scopeType === 'release_snapshot' && document.scopeId === release.id
    )
    if (existing) {
      this.state.metadataEntries = this.state.metadataEntries.filter((entry) => entry.metadataDocumentId !== existing.id)
      existing.updatedAt = this.now()
      existing.version += 1
      return
    }

    const now = this.now()
    const snapshotDocument: MetadataDocumentSummary = {
      id: this.id(),
      appId: release.appId,
      scopeType: 'release_snapshot',
      scopeId: release.id,
      version: 1,
      createdAt: now,
      updatedAt: now
    }
    this.state.metadataDocuments.push(snapshotDocument)
    const copiedEntries = this.state.metadataEntries
      .filter((entry) => entry.metadataDocumentId === sourceDocument.id)
      .map((entry) => ({
        ...entry,
        id: this.id(),
        metadataDocumentId: snapshotDocument.id,
        sourceLayer: 'release_snapshot',
        createdAt: now,
        updatedAt: now
      }))
    this.state.metadataEntries.push(...copiedEntries)
  }

  private buildValidationIssues(release: ReleaseSummary): ValidationIssueSummary[] {
    const issues: ValidationIssueSummary[] = []
    const releaseMetadata = this.state.metadataDocuments.find(
      (document) => document.appId === release.appId && document.scopeType === 'release_snapshot' && document.scopeId === release.id
    )
    const releaseAssets = this.state.assets.filter((asset) => asset.releaseId === release.id)
    const releaseStates = this.listReleasePlatformStates(release.id)
    const now = this.now()

    if (!releaseMetadata) {
      issues.push(
        this.buildIssue(release.id, null, null, 'error', 'completeness', 'release.metadata_snapshot.missing', 'Release snapshot metadata is missing', 'Freeze the release to generate snapshot metadata.')
      )
    }

    if (releaseAssets.length === 0) {
      issues.push(
        this.buildIssue(release.id, null, null, 'warning', 'screenshots', 'assets.release.empty', 'No release assets are attached yet', 'Attach screenshots or icon assets before submission.')
      )
    }

    if (releaseStates.length === 0) {
      issues.push(
        this.buildIssue(release.id, null, null, 'error', 'provider', 'release.platform_state.missing', 'No platform release states exist', 'Add iOS and Android release platform states.')
      )
    }

    for (const state of releaseStates) {
      const platformAssets = releaseAssets.filter((asset) => asset.platform === state.platform)
      if (platformAssets.length === 0) {
        issues.push(
          this.buildIssue(
            release.id,
            state.platform,
            null,
            'warning',
            'screenshots',
            `assets.${state.platform}.missing`,
            `No ${state.platform} assets are attached to the release`,
            'Upload assets for this platform before syncing.'
          )
        )
      }
      const capabilities = this.getProviderCapabilities(this.providerForPlatform(state.platform))
      if (!capabilities.reviewNotesApi) {
        issues.push(
          this.buildIssue(
            release.id,
            state.platform,
            null,
            'info',
            'provider',
            `provider.${state.platform}.review_notes_limited`,
            `Review notes are limited on ${state.platform}`,
            'Keep manual review notes for this provider path.'
          )
        )
      }
    }

    if (release.freezeState === 'mutable') {
      issues.push(
        this.buildIssue(release.id, null, null, 'info', 'consistency', 'release.mutable', 'Release is still mutable', 'Freeze the release when the snapshot is ready.')
      )
    }

    this.state.validationIssues = this.state.validationIssues.filter((issue) => issue.releaseId !== release.id)
    this.state.validationIssues.push(...issues)
    return issues
  }

  private buildIssue(
    releaseId: string,
    platform: Platform | null,
    localeCode: string | null,
    severity: ValidationSeverity,
    category: ValidationCategory,
    code: string,
    message: string,
    remediationHint: string
  ): ValidationIssueSummary {
    const now = this.now()
    return {
      id: this.id(),
      releaseId,
      platform,
      localeCode,
      severity,
      category,
      code,
      message,
      remediationHint,
      pathReference: null,
      status: 'active',
      detectedAt: now,
      resolvedAt: null
    }
  }

  private resolveEntries(entries: MetadataEntryRecord[]): ResolvedMetadataField[] {
    const grouped = new Map<string, MetadataEntryRecord[]>()
    for (const entry of entries) {
      const key = `${entry.fieldKey}::${entry.localeCode ?? ''}::${entry.platform ?? ''}`
      const collection = grouped.get(key) ?? []
      collection.push(entry)
      grouped.set(key, collection)
    }

    const resolved = new Map<string, ResolvedMetadataField>()
    for (const entry of entries) {
      const candidateKey = entry.fieldKey
      const current = resolved.get(candidateKey)
      const specificity = this.specificityScore(entry)
      if (!current || specificity > this.specificityScore(current)) {
        resolved.set(candidateKey, {
          fieldKey: entry.fieldKey,
          platform: entry.platform,
          localeCode: entry.localeCode,
          value: entry.valueJson,
          sourceLayer: entry.sourceLayer
        })
      }
    }
    return [...resolved.values()].sort((a, b) => a.fieldKey.localeCompare(b.fieldKey))
  }

  private specificityScore(value: { platform: Platform | null; localeCode: string | null }) {
    return (value.platform ? 1 : 0) + (value.localeCode ? 2 : 0)
  }

  private recordAudit(
    workspaceId: string,
    appId: string | null,
    releaseId: string | null,
    actorUserId: string | null,
    eventType: string,
    payloadJson: Record<string, unknown>
  ) {
    this.state.auditEvents.push({
      id: this.id(),
      workspaceId,
      appId,
      releaseId,
      actorUserId,
      eventType,
      payloadJson,
      createdAt: this.now()
    })
  }

  private currentUserId() {
    return this.state.users[0]?.id ?? 'demo-user'
  }

  private workspaceIdForUser(userId: string) {
    return this.state.users.find((user) => user.id === userId)?.workspaceId ?? this.state.workspaces[0]?.id ?? 'workspace-demo'
  }

  private workspaceIdForApp(appId: string) {
    return this.state.apps.find((app) => app.id === appId)?.workspaceId ?? this.state.workspaces[0]?.id ?? 'workspace-demo'
  }

  private workspaceIdForRelease(releaseId: string) {
    const release = this.state.releases.find((item) => item.id === releaseId)
    return release ? this.workspaceIdForApp(release.appId) : this.state.workspaces[0]?.id ?? 'workspace-demo'
  }

  private providerForPlatform(platform: Platform): Provider {
    return platform === 'ios' ? 'app_store_connect' : 'google_play'
  }

  private objectKeyForAsset(workspaceId: string, appId: string, assetId: string, fileName: string) {
    return `workspaces/${workspaceId}/apps/${appId}/assets/${assetId}/${fileName}`
  }

  private checksum(input: string) {
    return createHash('sha256').update(input).digest('hex')
  }

  private slugify(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  private bumpVersionLabel(versionLabel: string) {
    const parts = versionLabel.split('.').map((part) => Number(part))
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return `${versionLabel}-copy`
    }
    parts[2] += 1
    return parts.join('.')
  }

  private replaceById<T extends { id: string }>(items: T[], id: string, next: T) {
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new NotFoundException(`Entity ${id} not found`)
    }
    items[index] = next
  }

  private findOrThrow<T extends { id: string }>(items: T[], id: string, label: string): T {
    const item = items.find((entry) => entry.id === id)
    if (!item) {
      throw new NotFoundException(`${label} not found`)
    }
    return item
  }

  private id() {
    return randomUUID()
  }

  private now() {
    return new Date().toISOString()
  }
}
