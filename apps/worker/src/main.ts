import { getQueueNames } from "./lib/queue";
import { workerEnv } from "./lib/env";

async function main() {
  console.log("Anystore worker starting", {
    nodeEnv: workerEnv.NODE_ENV,
    queues: getQueueNames()
  });
}

main().catch((error) => {
  console.error("Worker boot failed", error);
  process.exit(1);
});
