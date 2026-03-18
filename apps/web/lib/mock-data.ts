import type {
  ActivityItem,
  AppDetailData,
  AppLocaleSummary,
  AppPlatformSummary,
  AppSummary,
  AssetSummary,
  DashboardData,
  MetadataEntrySummary,
  ProviderConnectionSummary,
  ReleaseDetailData,
  ReleasePlanItem,
  ReleasePlatformStateSummary,
  ReleaseSummary,
  ValidationIssueSummary,
  WorkspaceSummary
} from "./types";

const workspace: WorkspaceSummary = {
  id: "ws_northstar",
  name: "Northstar Labs",
  slug: "northstar-labs",
  createdAt: "2026-03-01T08:00:00.000Z",
  updatedAt: "2026-03-17T15:20:00.000Z"
};

const apps: AppSummary[] = [
  {
    id: "app_nova",
    workspaceId: workspace.id,
    slug: "nova",
    internalName: "Nova",
    canonicalProductName: "Nova Notes",
    primaryLocale: "en-US",
    status: "active",
    createdAt: "2026-03-02T09:00:00.000Z",
    updatedAt: "2026-03-18T08:40:00.000Z"
  },
  {
    id: "app_signal",
    workspaceId: workspace.id,
    slug: "signal-brief",
    internalName: "Signal Brief",
    canonicalProductName: "Signal Brief",
    primaryLocale: "en-NZ",
    status: "active",
    createdAt: "2026-03-03T09:00:00.000Z",
    updatedAt: "2026-03-16T11:15:00.000Z"
  }
];

const appPlatforms: AppPlatformSummary[] = [
  {
    id: "app_platform_nova_ios",
    appId: "app_nova",
    platform: "ios",
    bundleOrPackageId: "com.northstar.nova",
    remoteAppId: "1234567890",
    defaultTrack: "production",
    status: "connected",
    createdAt: "2026-03-02T09:10:00.000Z",
    updatedAt: "2026-03-17T10:10:00.000Z"
  },
  {
    id: "app_platform_nova_android",
    appId: "app_nova",
    platform: "android",
    bundleOrPackageId: "com.northstar.nova",
    remoteAppId: "nova.android.remote",
    defaultTrack: "internal",
    status: "connected",
    createdAt: "2026-03-02T09:10:00.000Z",
    updatedAt: "2026-03-17T10:10:00.000Z"
  },
  {
    id: "app_platform_signal_ios",
    appId: "app_signal",
    platform: "ios",
    bundleOrPackageId: "com.northstar.signalbrief",
    remoteAppId: "1098765432",
    defaultTrack: "testflight",
    status: "misconfigured",
    createdAt: "2026-03-03T09:15:00.000Z",
    updatedAt: "2026-03-16T11:15:00.000Z"
  }
];

const appLocales: AppLocaleSummary[] = [
  { id: "locale_en_us", appId: "app_nova", localeCode: "en-US", status: "active", createdAt: "2026-03-02T09:20:00.000Z" },
  { id: "locale_en_nz", appId: "app_nova", localeCode: "en-NZ", status: "active", createdAt: "2026-03-02T09:20:00.000Z" },
  { id: "locale_ja_jp", appId: "app_nova", localeCode: "ja-JP", status: "inactive", createdAt: "2026-03-02T09:20:00.000Z" },
  { id: "locale_en_nz_signal", appId: "app_signal", localeCode: "en-NZ", status: "active", createdAt: "2026-03-03T09:20:00.000Z" }
];

const releases: ReleaseSummary[] = [
  {
    id: "release_nova_120",
    appId: "app_nova",
    versionLabel: "1.2.0",
    releaseName: "Spring refresh",
    status: "ready_to_sync",
    freezeState: "frozen",
    sourceReleaseId: "release_nova_110",
    createdBy: "user_ada",
    createdAt: "2026-03-18T07:30:00.000Z",
    updatedAt: "2026-03-18T08:40:00.000Z"
  },
  {
    id: "release_nova_110",
    appId: "app_nova",
    versionLabel: "1.1.0",
    releaseName: "Weekly polish",
    status: "published",
    freezeState: "frozen",
    sourceReleaseId: null,
    createdBy: "user_ada",
    createdAt: "2026-03-10T11:00:00.000Z",
    updatedAt: "2026-03-17T12:00:00.000Z"
  },
  {
    id: "release_signal_210",
    appId: "app_signal",
    versionLabel: "2.1.0",
    releaseName: "Beta cleanup",
    status: "validation_failed",
    freezeState: "mutable",
    sourceReleaseId: null,
    createdBy: "user_ada",
    createdAt: "2026-03-15T12:00:00.000Z",
    updatedAt: "2026-03-16T15:20:00.000Z"
  }
];

const releasePlatformStates: ReleasePlatformStateSummary[] = [
  {
    id: "rps_nova_ios",
    releaseId: "release_nova_120",
    platform: "ios",
    targetTrack: "production",
    desiredVersionName: "1.2.0",
    desiredBuildNumber: "142",
    attachedBuildId: "build_nova_ios_142",
    submissionStatus: "draft",
    syncStatus: "queued",
    reviewStatus: "not_submitted",
    remoteReleaseId: "ios.remote.release.78",
    lastSyncAt: "2026-03-18T08:05:00.000Z"
  },
  {
    id: "rps_nova_android",
    releaseId: "release_nova_120",
    platform: "android",
    targetTrack: "production",
    desiredVersionName: "1.2.0",
    desiredBuildNumber: "142",
    attachedBuildId: "build_nova_android_142",
    submissionStatus: "submitted",
    syncStatus: "succeeded",
    reviewStatus: "submitted",
    remoteReleaseId: "android.remote.release.24",
    lastSyncAt: "2026-03-18T08:10:00.000Z"
  },
  {
    id: "rps_signal_ios",
    releaseId: "release_signal_210",
    platform: "ios",
    targetTrack: "testflight",
    desiredVersionName: "2.1.0",
    desiredBuildNumber: "88",
    attachedBuildId: "build_signal_ios_88",
    submissionStatus: "not_submitted",
    syncStatus: "failed",
    reviewStatus: "draft",
    remoteReleaseId: null,
    lastSyncAt: null
  }
];

const assets: AssetSummary[] = [
  {
    id: "asset_nova_icon_source",
    appId: "app_nova",
    releaseId: null,
    sourceAssetId: null,
    assetType: "icon_source",
    status: "ready",
    platform: null,
    localeCode: null,
    deviceClass: null,
    mimeType: "image/png",
    objectKey: "workspaces/ws_northstar/apps/app_nova/assets/asset_nova_icon_source/icon-source.png",
    checksum: "sha256:aa11bb22cc33",
    width: 1024,
    height: 1024,
    fileSizeBytes: 182400,
    createdBy: "user_ada",
    createdAt: "2026-03-05T10:00:00.000Z",
    updatedAt: "2026-03-05T10:00:00.000Z"
  },
  {
    id: "asset_nova_screenshot_1",
    appId: "app_nova",
    releaseId: "release_nova_120",
    sourceAssetId: "asset_nova_icon_source",
    assetType: "screenshot_output",
    status: "ready",
    platform: "ios",
    localeCode: "en-US",
    deviceClass: "6.7-inch",
    mimeType: "image/png",
    objectKey: "workspaces/ws_northstar/apps/app_nova/releases/release_nova_120/renders/render_1/ios/en-us/hero.png",
    checksum: "sha256:ee44ff55gg66",
    width: 1290,
    height: 2796,
    fileSizeBytes: 892000,
    createdBy: "user_ada",
    createdAt: "2026-03-18T08:15:00.000Z",
    updatedAt: "2026-03-18T08:15:00.000Z"
  },
  {
    id: "asset_signal_feature",
    appId: "app_signal",
    releaseId: "release_signal_210",
    sourceAssetId: null,
    assetType: "feature_graphic",
    status: "processing",
    platform: "android",
    localeCode: null,
    deviceClass: null,
    mimeType: "image/png",
    objectKey: "workspaces/ws_northstar/apps/app_signal/assets/asset_signal_feature/feature-graphic.png",
    checksum: "sha256:hh77ii88jj99",
    width: 1024,
    height: 500,
    fileSizeBytes: 301120,
    createdBy: "user_ada",
    createdAt: "2026-03-16T10:40:00.000Z",
    updatedAt: "2026-03-16T10:45:00.000Z"
  }
];

const validationIssues: ValidationIssueSummary[] = [
  {
    id: "issue_signal_review_credentials",
    releaseId: "release_signal_210",
    platform: "ios",
    localeCode: null,
    severity: "error",
    category: "compliance",
    code: "review.demo_credentials.missing",
    message: "iOS review credentials are missing for the staged release.",
    remediationHint: "Add the demo account username and password before freezing the release.",
    pathReference: "review_notes",
    status: "active",
    detectedAt: "2026-03-16T12:10:00.000Z",
    resolvedAt: null
  },
  {
    id: "issue_signal_metadata",
    releaseId: "release_signal_210",
    platform: null,
    localeCode: "en-NZ",
    severity: "warning",
    category: "completeness",
    code: "metadata.short_description.missing",
    message: "The en-NZ short description still inherits the canonical draft.",
    remediationHint: "Add a locale-specific short description before syncing.",
    pathReference: "short_description",
    status: "active",
    detectedAt: "2026-03-16T12:15:00.000Z",
    resolvedAt: null
  }
];

const providerConnections: ProviderConnectionSummary[] = [
  { id: "pc_apple", workspaceId: workspace.id, provider: "app_store_connect", status: "connected", createdAt: "2026-03-02T09:30:00.000Z", updatedAt: "2026-03-18T08:00:00.000Z" },
  { id: "pc_google", workspaceId: workspace.id, provider: "google_play", status: "connected", createdAt: "2026-03-02T09:30:00.000Z", updatedAt: "2026-03-18T08:00:00.000Z" }
];

const metadata: MetadataEntrySummary[] = [
  { id: "meta_product_name", fieldKey: "product_name", value: "Nova Notes", localeCode: null, platform: null, sourceLayer: "app_draft" },
  { id: "meta_short_description", fieldKey: "short_description", value: "Fast notes for mobile teams.", localeCode: null, platform: null, sourceLayer: "app_draft" },
  { id: "meta_release_notes", fieldKey: "release_notes", value: "Faster search, calmer sync, cleaner screenshots.", localeCode: "en-US", platform: "ios", sourceLayer: "release_snapshot" },
  { id: "meta_ja_description", fieldKey: "full_description", value: "Japanese locale copy pending.", localeCode: "ja-JP", platform: null, sourceLayer: "app_draft" }
];

const activity: ActivityItem[] = [
  {
    id: "activity_release_frozen",
    entityType: "release",
    action: "frozen",
    message: "Release 1.2.0 was frozen for Nova Notes.",
    createdAt: "2026-03-18T07:35:00.000Z"
  },
  {
    id: "activity_validation_failed",
    entityType: "validation",
    action: "failed",
    message: "Signal Brief has two blocking validation issues.",
    createdAt: "2026-03-16T12:10:00.000Z"
  },
  {
    id: "activity_provider_sync",
    entityType: "sync",
    action: "succeeded",
    message: "Android snapshot reconciled against Google Play remote state.",
    createdAt: "2026-03-18T08:10:00.000Z"
  }
];

const planItems: ReleasePlanItem[] = [
  {
    id: "plan_metadata_ios",
    provider: "app_store_connect",
    platform: "ios",
    operation: "upsert_metadata_field",
    targetPath: "short_description",
    strategy: "apply_local",
    blocking: false
  },
  {
    id: "plan_screenshot_ios",
    provider: "app_store_connect",
    platform: "ios",
    operation: "upload_asset",
    targetPath: "screenshots/en-US/6.7-inch/hero.png",
    strategy: "apply_local",
    blocking: false
  },
  {
    id: "plan_release_notes_android",
    provider: "google_play",
    platform: "android",
    operation: "update_release_notes",
    targetPath: "production/release-notes",
    strategy: "apply_local",
    blocking: false
  }
];

function appAssets(appId: string) {
  return assets.filter((asset) => asset.appId === appId);
}

function appReleases(appId: string) {
  return releases.filter((release) => release.appId === appId);
}

function appPlatformsFor(appId: string) {
  return appPlatforms.filter((platform) => platform.appId === appId);
}

function appLocalesFor(appId: string) {
  return appLocales.filter((locale) => locale.appId === appId);
}

function activityForApp(appId: string) {
  if (appId === "app_nova") {
    return activity;
  }
  return activity.slice(0, 2);
}

export function getWorkspaceMock() {
  return workspace;
}

export function getAppsMock() {
  return apps;
}

export function getAppMock(appId: string) {
  return apps.find((app) => app.id === appId) ?? null;
}

export function getDashboardMockData(): DashboardData {
  return {
    workspace,
    apps,
    releases,
    assets,
    providerConnections,
    validationIssues,
    activity
  };
}

export function getAppDetailMockData(appId: string): AppDetailData | null {
  const app = getAppMock(appId);
  if (!app) {
    return null;
  }

  return {
    workspace,
    app,
    platforms: appPlatformsFor(appId),
    locales: appLocalesFor(appId),
    releases: appReleases(appId),
    metadata: metadata.filter((item) => appId === "app_nova" || item.id !== "meta_ja_description"),
    assets: appAssets(appId),
    activity: activityForApp(appId)
  };
}

export function getReleaseDetailMockData(appId: string, releaseId: string): ReleaseDetailData | null {
  const app = getAppMock(appId);
  const release = releases.find((item) => item.id === releaseId && item.appId === appId);
  if (!app || !release) {
    return null;
  }

  return {
    workspace,
    app,
    release,
    platformStates: releasePlatformStates.filter((item) => item.releaseId === releaseId),
    validationIssues: validationIssues.filter((issue) => issue.releaseId === releaseId),
    assets: assets.filter((asset) => asset.releaseId === releaseId),
    planItems: planItems.filter((item) => item.platform === "ios" || item.platform === "android"),
    activity: activityForApp(appId)
  };
}

export function listAppReleasesMock(appId: string) {
  return appReleases(appId);
}

export function listProviderConnectionsMock() {
  return providerConnections;
}

export function listAssetsMock() {
  return assets;
}

export function listActivityMock() {
  return activity;
}

export function listGlobalReleasesMock() {
  return releases;
}

export function listValidationIssuesMock() {
  return validationIssues;
}

export function listPlanItemsMock() {
  return planItems;
}
