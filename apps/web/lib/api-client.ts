import { webEnv } from "./env";
import {
  getAppsMock,
  getAppDetailMockData,
  getDashboardMockData,
  getReleaseDetailMockData,
  getWorkspaceMock,
  listActivityMock,
  listAppReleasesMock,
  listAssetsMock,
  listGlobalReleasesMock,
  listProviderConnectionsMock,
  listValidationIssuesMock
} from "./mock-data";
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

interface ApiEnvelope<T> {
  data: T;
  meta: Record<string, unknown>;
}

interface ApiSession {
  userId: string;
  email: string;
  displayName: string;
  workspaceId: string;
  workspaceName: string;
}

interface ResolvedMetadataField {
  fieldKey: string;
  platform: "ios" | "android" | null;
  localeCode: string | null;
  value: unknown;
  sourceLayer: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!webEnv.apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${webEnv.apiBaseUrl}${path}`, {
    cache: "no-store",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

async function fetchWithFallback<T>(run: () => Promise<T>, fallback: () => Promise<T> | T): Promise<T> {
  try {
    return await run();
  } catch {
    return fallback();
  }
}

function mapResolvedMetadata(fields: ResolvedMetadataField[]): MetadataEntrySummary[] {
  return fields.map((field, index) => ({
    id: `${field.fieldKey}-${field.platform ?? "all"}-${field.localeCode ?? "base"}-${index}`,
    fieldKey: field.fieldKey,
    value: typeof field.value === "string" ? field.value : JSON.stringify(field.value),
    localeCode: field.localeCode,
    platform: field.platform,
    sourceLayer: field.sourceLayer
  }));
}

async function getWorkspaceFromApi(): Promise<WorkspaceSummary> {
  const session = await request<ApiSession>("/api/auth/session");
  return request<WorkspaceSummary>(`/api/workspaces/${session.workspaceId}`);
}

async function getAppsFromApi(): Promise<AppSummary[]> {
  return request<AppSummary[]>("/api/apps");
}

async function getActivityFromApi(filters?: { appId?: string; releaseId?: string }): Promise<ActivityItem[]> {
  const params = new URLSearchParams();
  if (filters?.appId) {
    params.set("appId", filters.appId);
  }
  if (filters?.releaseId) {
    params.set("releaseId", filters.releaseId);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<ActivityItem[]>(`/api/activity${suffix}`);
}

async function getAssetsFromApi(filters?: { appId?: string; releaseId?: string }): Promise<AssetSummary[]> {
  const params = new URLSearchParams();
  if (filters?.appId) {
    params.set("appId", filters.appId);
  }
  if (filters?.releaseId) {
    params.set("releaseId", filters.releaseId);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return request<AssetSummary[]>(`/api/assets${suffix}`);
}

async function getValidationIssuesFromApi(releaseId?: string): Promise<ValidationIssueSummary[]> {
  const suffix = releaseId ? `?releaseId=${releaseId}` : "";
  return request<ValidationIssueSummary[]>(`/api/validation/issues${suffix}`);
}

async function getProviderConnectionsFromApi(workspaceId?: string): Promise<ProviderConnectionSummary[]> {
  const suffix = workspaceId ? `?workspaceId=${workspaceId}` : "";
  return request<ProviderConnectionSummary[]>(`/api/providers/connections${suffix}`);
}

async function getAppDetailFromApi(appId: string): Promise<AppDetailData | null> {
  const [workspace, app, platforms, locales, releases, metadataDocs, assets, activity] = await Promise.all([
    getWorkspaceFromApi(),
    request<AppSummary>(`/api/apps/${appId}`),
    request<AppPlatformSummary[]>(`/api/apps/${appId}/platforms`),
    request<AppLocaleSummary[]>(`/api/apps/${appId}/locales`),
    request<ReleaseSummary[]>(`/api/releases?appId=${appId}`),
    request<Array<{ id: string; scopeType: string }>>(`/api/metadata/documents?appId=${appId}`),
    getAssetsFromApi({ appId }),
    getActivityFromApi({ appId })
  ]);

  const draftDocument = metadataDocs.find((document) => document.scopeType === "app_draft");
  const resolvedMetadata = draftDocument
    ? await request<ResolvedMetadataField[]>(`/api/metadata/documents/${draftDocument.id}/resolve`, { method: "POST" })
    : [];

  return {
    workspace,
    app,
    platforms,
    locales,
    releases,
    metadata: mapResolvedMetadata(resolvedMetadata),
    assets,
    activity
  };
}

async function getReleaseDetailFromApi(appId: string, releaseId: string): Promise<ReleaseDetailData | null> {
  const [workspace, app, release, platformStates, validationIssues, assets, activity, syncPlan] = await Promise.all([
    getWorkspaceFromApi(),
    request<AppSummary>(`/api/apps/${appId}`),
    request<ReleaseSummary>(`/api/releases/${releaseId}`),
    request<ReleasePlatformStateSummary[]>(`/api/releases/${releaseId}/platform-states`),
    getValidationIssuesFromApi(releaseId),
    getAssetsFromApi({ appId, releaseId }),
    getActivityFromApi({ releaseId }),
    request<{ items: ReleasePlanItem[] }>("/api/sync/plans", {
      method: "POST",
      body: JSON.stringify({ releaseId, provider: "app_store_connect" })
    })
  ]);

  return {
    workspace,
    app,
    release,
    platformStates,
    validationIssues,
    assets,
    planItems: syncPlan.items,
    activity
  };
}

async function getDashboardDataFromApi(): Promise<DashboardData> {
  const workspace = await getWorkspaceFromApi();
  const [apps, releases, assets, providerConnections, validationIssues, activity] = await Promise.all([
    getAppsFromApi(),
    request<ReleaseSummary[]>("/api/releases"),
    getAssetsFromApi(),
    getProviderConnectionsFromApi(workspace.id),
    getValidationIssuesFromApi(),
    getActivityFromApi()
  ]);

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

export interface WebApiClient {
  getDashboardData(): Promise<DashboardData>;
  getAppDetail(appId: string): Promise<AppDetailData | null>;
  getReleaseDetail(appId: string, releaseId: string): Promise<ReleaseDetailData | null>;
  getWorkspace(): Promise<WorkspaceSummary>;
  getApps(): Promise<AppSummary[]>;
  getAppReleases(appId: string): Promise<ReleaseSummary[]>;
  getGlobalReleases(): Promise<ReleaseSummary[]>;
  getAssets(): Promise<AssetSummary[]>;
  getActivity(): Promise<ActivityItem[]>;
  getProviderConnections(): Promise<ProviderConnectionSummary[]>;
  getValidationIssues(): Promise<ValidationIssueSummary[]>;
}

export function createWebApiClient(): WebApiClient {
  return {
    getDashboardData: () => fetchWithFallback(getDashboardDataFromApi, async () => getDashboardMockData()),
    getAppDetail: (appId) => fetchWithFallback(() => getAppDetailFromApi(appId), async () => getAppDetailMockData(appId)),
    getReleaseDetail: (appId, releaseId) =>
      fetchWithFallback(() => getReleaseDetailFromApi(appId, releaseId), async () => getReleaseDetailMockData(appId, releaseId)),
    getWorkspace: () => fetchWithFallback(getWorkspaceFromApi, async () => getWorkspaceMock()),
    getApps: () => fetchWithFallback(getAppsFromApi, async () => getAppsMock()),
    getAppReleases: (appId) =>
      fetchWithFallback(() => request<ReleaseSummary[]>(`/api/releases?appId=${appId}`), async () => listAppReleasesMock(appId)),
    getGlobalReleases: () => fetchWithFallback(() => request<ReleaseSummary[]>("/api/releases"), async () => listGlobalReleasesMock()),
    getAssets: () => fetchWithFallback(() => getAssetsFromApi(), async () => listAssetsMock()),
    getActivity: () => fetchWithFallback(() => getActivityFromApi(), async () => listActivityMock()),
    getProviderConnections: () =>
      fetchWithFallback(() => getProviderConnectionsFromApi(), async () => listProviderConnectionsMock()),
    getValidationIssues: () => fetchWithFallback(() => getValidationIssuesFromApi(), async () => listValidationIssuesMock())
  };
}

export const webApi = createWebApiClient();
