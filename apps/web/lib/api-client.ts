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
import type { AppDetailData, DashboardData, ReleaseDetailData } from "./types";
import type { ActivityItem, AppSummary, AssetSummary, ProviderConnectionSummary, ReleaseSummary, ValidationIssueSummary, WorkspaceSummary } from "./types";

async function fetchJson<T>(path: string, fallback: () => Promise<T> | T): Promise<T> {
  if (!webEnv.apiBaseUrl) {
    return fallback();
  }

  try {
    const response = await fetch(`${webEnv.apiBaseUrl}${path}`, {
      cache: "no-store",
      headers: {
        accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback();
  }
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
    getDashboardData: () => fetchJson("/api/dashboard", async () => getDashboardMockData()),
    getAppDetail: (appId) => fetchJson(`/api/apps/${appId}`, async () => getAppDetailMockData(appId)),
    getReleaseDetail: (appId, releaseId) =>
      fetchJson(`/api/apps/${appId}/releases/${releaseId}`, async () => getReleaseDetailMockData(appId, releaseId)),
    getWorkspace: () => fetchJson("/api/workspaces/current", async () => getWorkspaceMock()),
    getApps: () => fetchJson("/api/apps", async () => getAppsMock()),
    getAppReleases: (appId) => fetchJson(`/api/apps/${appId}/releases`, async () => listAppReleasesMock(appId)),
    getGlobalReleases: () => fetchJson("/api/releases", async () => listGlobalReleasesMock()),
    getAssets: () => fetchJson("/api/assets", async () => listAssetsMock()),
    getActivity: () => fetchJson("/api/activity", async () => listActivityMock()),
    getProviderConnections: () => fetchJson("/api/providers", async () => listProviderConnectionsMock()),
    getValidationIssues: () => fetchJson("/api/validation/issues", async () => listValidationIssuesMock())
  };
}

export const webApi = createWebApiClient();
