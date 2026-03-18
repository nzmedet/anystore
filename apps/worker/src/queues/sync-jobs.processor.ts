import type { SyncJobQueuePayload } from "@anystore/domain";

export async function processSyncJob(payload: SyncJobQueuePayload) {
  return {
    status: "queued",
    syncJobId: payload.syncJobId
  };
}
