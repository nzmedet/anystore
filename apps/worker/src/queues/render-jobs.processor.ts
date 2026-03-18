import type { RenderJobQueuePayload } from "@anystore/domain";

export async function processRenderJob(payload: RenderJobQueuePayload) {
  return {
    status: "queued",
    renderJobId: payload.renderJobId
  };
}
