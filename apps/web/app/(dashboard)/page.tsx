import Link from "next/link";
import { Badge, Button, Card, MetricCard } from "@anystore/ui";
import { webApi } from "../../lib/api-client";
import { formatDate, formatDateTime, formatBytes } from "../../lib/format";

export default async function DashboardPage() {
  const data = await webApi.getDashboardData();
  const readyReleases = data.releases.filter((release) => release.status === "ready_to_sync" || release.status === "published");
  const blockingIssues = data.validationIssues.filter((issue) => issue.severity === "error").length;
  const latestActivity = data.activity[0];

  return (
    <div className="anystore-stack">
      <section className="anystore-page-hero">
        <div className="anystore-page-hero-grid">
          <div>
            <p className="anystore-eyebrow">Workspace overview</p>
            <h1 className="anystore-page-title">Ship mobile releases without losing the canonical truth.</h1>
            <p className="anystore-page-description">
              Northstar Labs is currently tracking two apps, three releases, and a dry-run sync path ready for the
              first provider write window.
            </p>
            <div className="anystore-topbar-meta" style={{ marginTop: 18 }}>
              <Button href="/apps">Open apps</Button>
              <Button href="/integrations" variant="secondary">
                Review integrations
              </Button>
            </div>
          </div>
          <div className="anystore-page-meta">
            <MetricCard label="Apps" value={String(data.apps.length)} detail="2 active products in the workspace" />
            <MetricCard label="Ready releases" value={String(readyReleases.length)} detail="Frozen snapshots awaiting sync" tone="success" />
          </div>
        </div>
      </section>

      <section className="anystore-kpi-grid">
        <MetricCard label="Blocking issues" value={String(blockingIssues)} detail="Validation items that stop sync" tone="warning" />
        <MetricCard label="Assets tracked" value={String(data.assets.length)} detail={`${formatBytes(data.assets.reduce((sum, asset) => sum + (asset.fileSizeBytes ?? 0), 0))} total storage`} />
        <MetricCard label="Provider connections" value={String(data.providerConnections.length)} detail="Apple and Google both connected" tone="success" />
        <MetricCard
          label="Last activity"
          value={latestActivity ? formatDateTime(latestActivity.createdAt) : "No activity"}
          detail={latestActivity?.message ?? "No release activity recorded yet"}
        />
      </section>

      <div className="anystore-grid-two">
        <Card
          title="Recent releases"
          eyebrow="Release pipeline"
          description="Snapshots, statuses, and the next sync actions."
          actions={<Link href="/releases" className="anystore-button anystore-button-secondary">View all</Link>}
        >
          <div className="anystore-list">
            {data.releases.map((release) => (
              <div key={release.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">
                    <Link href={`/apps/${release.appId}/releases/${release.id}`}>{release.versionLabel}</Link>
                  </p>
                  <div className="anystore-list-item-meta">
                    <span>{release.releaseName ?? "Unnamed release"}</span>
                    <span>Created {formatDate(release.createdAt)}</span>
                    <span className="anystore-mono">{release.freezeState}</span>
                  </div>
                </div>
                <Badge tone={release.status === "ready_to_sync" ? "success" : release.status === "validation_failed" ? "danger" : "neutral"}>
                  {release.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Validation and sync readiness"
          eyebrow="Control surface"
          description="What blocks a safe push to the stores."
        >
          <div className="anystore-list">
            {data.validationIssues.map((issue) => (
              <div key={issue.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{issue.message}</p>
                  <div className="anystore-list-item-meta">
                    <span>{issue.code}</span>
                    <span>{issue.category}</span>
                  </div>
                </div>
                <Badge tone={issue.severity === "error" ? "danger" : issue.severity === "warning" ? "warning" : "neutral"}>
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Activity" eyebrow="Audit trail" description="Recent changes across releases, validation, and sync.">
        <div className="anystore-timeline">
          {data.activity.map((item) => (
            <div key={item.id} className="anystore-timeline-item">
              <p>{item.message}</p>
              <time>{formatDateTime(item.createdAt)}</time>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
