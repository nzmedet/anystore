import type { NormalizedRemoteSnapshot, ProviderExecutionResult, SyncDiffItem, SyncPlan, SyncPlanItem } from "@anystore/domain";
import { providerCapabilityMap } from "../capability-map";
import type { ProviderConnectionSecretRef, StoreProviderAdapter } from "../types";

export class GoogleProviderAdapter implements StoreProviderAdapter {
  readonly provider = "google_play" as const;

  getCapabilities() {
    return providerCapabilityMap[this.provider];
  }

  async validateConnection(_secretRef: ProviderConnectionSecretRef) {
    return { isValid: true, message: "Stub validation succeeded." };
  }

  async fetchNormalizedSnapshot(input: Parameters<StoreProviderAdapter["fetchNormalizedSnapshot"]>[0]): Promise<NormalizedRemoteSnapshot> {
    return {
      provider: this.provider,
      appPlatformId: input.appPlatform.id,
      fields: [],
      assets: [],
      releaseState: input.release
        ? {
            versionName: input.release.versionLabel,
            buildNumber: null,
            submissionStatus: "draft" as const,
            remoteReleaseId: null
          }
        : undefined
    };
  }

  async createSyncPlan(args: Parameters<StoreProviderAdapter["createSyncPlan"]>[0]): Promise<SyncPlan> {
    return {
      releaseId: args.release.id,
      provider: this.provider,
      generatedAt: new Date().toISOString(),
      items: args.diffItems.map((item: SyncDiffItem, index: number): SyncPlanItem => ({
        id: `${this.provider}-${index + 1}`,
        provider: this.provider,
        platform: args.platform,
        operation: item.type === "asset" ? "upload_asset" : "upsert_metadata_field",
        targetPath: item.type === "asset" ? "/assets" : "/metadata",
        strategy: "manual",
        blocking: false
      }))
    };
  }

  async executeSyncPlan(args: Parameters<StoreProviderAdapter["executeSyncPlan"]>[0]): Promise<ProviderExecutionResult> {
    return {
      jobStatus: "succeeded",
      itemResults: args.plan.items.map((item) => ({
        itemId: item.id,
        status: "skipped",
        message: "Execution is disabled in beta dry-run mode."
      }))
    };
  }
}
