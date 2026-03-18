import type { ValidationJobQueuePayload } from "@anystore/domain";

export async function processValidationJob(payload: ValidationJobQueuePayload) {
  return {
    status: "queued",
    releaseId: payload.releaseId
  };
}
