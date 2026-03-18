import type { RenderJobQueuePayload } from "@anystore/domain";

export function createRenderJobPayload(renderJobId: string): RenderJobQueuePayload {
  return { renderJobId };
}
