import Link from "next/link";
import { Badge, Card, MetricCard, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../lib/api-client";
import { formatDate } from "../../../lib/format";

export default async function AppsPage() {
  const apps = await webApi.getApps();
  const data = await webApi.getDashboardData();

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Apps"
        title="App registry"
        description="The canonical inventory of products managed inside this workspace."
        actions={<Link href="/" className="anystore-button anystore-button-secondary">Back to overview</Link>}
      />

      <section className="anystore-kpi-grid">
        <MetricCard label="Active apps" value={String(apps.filter((app) => app.status === "active").length)} detail="Managed by the workspace" />
        <MetricCard label="Connected providers" value={String(data.providerConnections.length)} detail="Apple and Google" tone="success" />
        <MetricCard label="Draft metadata sets" value={String(data.apps.length)} detail="Every app has a canonical source" />
        <MetricCard label="Current release count" value={String(data.releases.length)} detail="Snapshots across all apps" />
      </section>

      <div className="anystore-grid-cards">
        {apps.map((app) => (
          <Card
            key={app.id}
            title={app.canonicalProductName}
            eyebrow={app.internalName}
            description={`Primary locale ${app.primaryLocale} · created ${formatDate(app.createdAt)}`}
            actions={<Link href={`/apps/${app.id}`} className="anystore-button anystore-button-secondary">Open app</Link>}
          >
            <div className="anystore-field-grid">
              <div className="anystore-field">
                <span className="anystore-field-label">Slug</span>
                <span className="anystore-field-value">{app.slug}</span>
              </div>
              <div className="anystore-field">
                <span className="anystore-field-label">Status</span>
                <Badge tone={app.status === "active" ? "success" : "neutral"}>{app.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
