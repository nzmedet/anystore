export const AuditEventTypeValues = [
  "workspace.created",
  "workspace.member.invited",
  "workspace.member.role_updated",
  "app.created",
  "app.updated",
  "app.archived",
  "app.platform.added",
  "app.locale.added",
  "metadata.entry.upserted",
  "metadata.bulk_upserted",
  "release.created",
  "release.cloned",
  "release.updated",
  "release.frozen",
  "release.unfrozen",
  "release.build.attached",
  "asset.upload_session.created",
  "asset.upload.finalized",
  "template.created",
  "template.version.created",
  "render.job.queued",
  "render.job.completed",
  "validation.run.completed",
  "provider.connection.created",
  "provider.connection.validated",
  "remote_snapshot.fetched",
  "sync.plan.created",
  "sync.job.started",
  "sync.job.completed",
  "review_profile.updated",
  "rejection.recorded",
  "comment.created"
] as const;

export type AuditEventType = (typeof AuditEventTypeValues)[number];

export interface AuditEventWriteInput {
  workspaceId: string;
  appId?: string | null;
  releaseId?: string | null;
  actorUserId?: string | null;
  eventType: AuditEventType;
  payload?: Record<string, unknown>;
}
