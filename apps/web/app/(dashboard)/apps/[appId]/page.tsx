import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, MetricCard, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../lib/api-client";
import { formatDate } from "../../../../lib/format";

type AppPageProps = Readonly<{
  params: Promise<{ appId: string }>;
}>;

export default async function AppPage({ params }: AppPageProps) {
  const { appId } = await params;
  const detail = await webApi.getAppDetail(appId);

  if (!detail) {
    notFound();
  }

  const { app, platforms, releases, metadata, assets } = detail;

  return (
    <div className="anystore-stack">
      <section className="anystore-kpi-grid">
        <MetricCard label="Platforms" value={String(platforms.length)} detail="Provider bindings are visible here" />
        <MetricCard label="Locales" value={String(detail.locales.length)} detail="Canonical and localized overlays" />
        <MetricCard label="Releases" value={String(releases.length)} detail="Snapshots attached to this app" tone="success" />
        <MetricCard label="Assets" value={String(assets.length)} detail="Source and generated outputs" />
      </section>

      <div className="anystore-grid-two">
        <Card title="Current metadata snapshot" eyebrow="Canonical state" description="What gets resolved before a release freezes.">
          <div className="anystore-list">
            {metadata.map((entry) => (
              <div key={entry.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{entry.fieldKey}</p>
                  <div className="anystore-list-item-meta">
                    <span>{entry.sourceLayer}</span>
                    <span>{entry.localeCode ?? "canonical"}</span>
                    <span>{entry.platform ?? "all platforms"}</span>
                  </div>
                </div>
                <span className="anystore-field-value">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Release history" eyebrow="Versioned snapshots" description="The current product history and freeze state.">
          <div className="anystore-list">
            {releases.map((release) => (
              <div key={release.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">
                    <Link href={`/apps/${app.id}/releases/${release.id}`}>{release.versionLabel}</Link>
                  </p>
                  <div className="anystore-list-item-meta">
                    <span>{release.releaseName ?? "Untitled"}</span>
                    <span>Created {formatDate(release.createdAt)}</span>
                  </div>
                </div>
                <Badge tone={release.status === "ready_to_sync" ? "success" : release.status === "validation_failed" ? "danger" : "neutral"}>
                  {release.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
