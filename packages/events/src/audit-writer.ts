import type { AuditEventWriteInput } from "@anystore/domain";

export interface AuditWriter {
  write(input: AuditEventWriteInput): Promise<void>;
}

export class NoopAuditWriter implements AuditWriter {
  async write(_input: AuditEventWriteInput): Promise<void> {
    return Promise.resolve();
  }
}
