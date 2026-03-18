import { QueueNames } from "@anystore/domain";

export function getQueueNames() {
  return Object.values(QueueNames);
}
