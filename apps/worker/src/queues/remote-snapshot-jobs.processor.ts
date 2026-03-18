import type { RemoteSnapshotJobQueuePayload } from "@anystore/domain";

export async function processRemoteSnapshotJob(payload: RemoteSnapshotJobQueuePayload) {
  return {
    status: "queued",
    appPlatformId: payload.appPlatformId,
    snapshotType: payload.snapshotType ?? "full"
  };
}
