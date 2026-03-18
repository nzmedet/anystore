export const QueueNames = {
  renderJobs: "render-jobs",
  syncJobs: "sync-jobs",
  remoteSnapshotJobs: "remote-snapshot-jobs",
  validationJobs: "validation-jobs"
} as const;

export interface RenderJobQueuePayload {
  renderJobId: string;
}

export interface SyncJobQueuePayload {
  syncJobId: string;
}

export interface RemoteSnapshotJobQueuePayload {
  appPlatformId: string;
  releaseId?: string | null;
  snapshotType?: "app_listing" | "release_state" | "assets" | "full";
}

export interface ValidationJobQueuePayload {
  releaseId: string;
}
