import { notFound } from "next/navigation";
import { Badge, Card, MetricCard, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../../../lib/api-client";
import { formatDateTime } from "../../../../../../lib/format";

type ReleasePageProps = Readonly<{
  params: Promise<{ appId: string; releaseId: string }>;
}>;

export default async function ReleasePage({ params }: ReleasePageProps) {
  const { appId, releaseId } = await params;
  const detail = await webApi.getReleaseDetail(appId, releaseId);

  if (!detail) {
    notFound();
  }

  const { app, release, platformStates, validationIssues, planItems, assets } = detail;
  const blockingIssues = validationIssues.filter((issue) => issue.severity === "error").length;

  return (
    <div className="anystore-stack">
      <section className="anystore-page-hero">
        <div className="anystore-page-hero-grid">
          <div>
            <p className="anystore-eyebrow">Release detail</p>
            <h1 className="anystore-page-title">{release.versionLabel}</h1>
            <p className="anystore-page-description">
              {app.canonicalProductName} is currently at {release.status} with a {release.freezeState} snapshot.
            </p>
            <div className="anystore-topbar-meta" style={{ marginTop: 18 }}>
              <Badge tone={release.status === "ready_to_sync" ? "success" : release.status === "validation_failed" ? "danger" : "neutral"}>
                {release.status}
              </Badge>
              <Badge tone={release.freezeState === "frozen" ? "accent" : "warning"}>{release.freezeState}</Badge>
            </div>
          </div>
          <div className="anystore-page-meta">
            <MetricCard label="Blocking issues" value={String(blockingIssues)} detail="Fix before the sync button becomes safe" tone="warning" />
            <MetricCard label="Planned operations" value={String(planItems.length)} detail="Dry-run sync actions already generated" tone="success" />
          </div>
        </div>
      </section>

      <section className="anystore-kpi-grid">
        <MetricCard label="Platforms" value={String(platformStates.length)} detail="Store state per platform" />
        <MetricCard label="Assets" value={String(assets.length)} detail="Bound to this release" />
        <MetricCard label="Last update" value={formatDateTime(release.updatedAt)} detail="Snapshot freshness" />
        <MetricCard label="Source release" value={release.sourceReleaseId ?? "None"} detail="Cloning lineage" tone="accent" />
      </section>

      <div className="anystore-grid-two">
        <Card title="Platform state" eyebrow="Release tracks">
          <div className="anystore-list">
            {platformStates.map((state) => (
              <div key={state.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{state.platform.toUpperCase()}</p>
                  <div className="anystore-list-item-meta">
                    <span>{state.targetTrack ?? "no track"}</span>
                    <span>{state.desiredVersionName}</span>
                    <span>build {state.desiredBuildNumber}</span>
                  </div>
                </div>
                <Badge tone={state.syncStatus === "succeeded" ? "success" : state.syncStatus === "failed" ? "danger" : "neutral"}>
                  {state.syncStatus ?? "idle"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Validation" eyebrow="Release readiness">
          <div className="anystore-list">
            {validationIssues.map((issue) => (
              <div key={issue.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{issue.message}</p>
                  <div className="anystore-list-item-meta">
                    <span>{issue.code}</span>
                    <span>{issue.category}</span>
                  </div>
                </div>
                <Badge tone={issue.severity === "error" ? "danger" : "warning"}>{issue.severity}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="anystore-grid-two">
        <Card title="Dry-run sync plan" eyebrow="Provider projection">
          <div className="anystore-list">
            {planItems.map((item) => (
              <div key={item.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{item.operation}</p>
                  <div className="anystore-list-item-meta">
                    <span>{item.provider}</span>
                    <span>{item.platform}</span>
                    <span>{item.targetPath}</span>
                  </div>
                </div>
                <Badge tone={item.blocking ? "danger" : "success"}>{item.strategy}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Attached assets" eyebrow="Release material">
          <div className="anystore-list">
            {assets.map((asset) => (
              <div key={asset.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{asset.assetType}</p>
                  <div className="anystore-list-item-meta">
                    <span>{asset.deviceClass ?? "general"}</span>
                    <span>{asset.localeCode ?? "canonical"}</span>
                    <span>{asset.mimeType}</span>
                  </div>
                </div>
                <span className="anystore-field-value">{asset.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Activity" eyebrow="Release history">
        <div className="anystore-timeline">
          {detail.activity.map((item) => (
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
