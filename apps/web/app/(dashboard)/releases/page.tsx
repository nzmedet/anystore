import Link from "next/link";
import { Badge, Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../lib/api-client";
import { formatDate } from "../../../lib/format";

export default async function ReleasesPage() {
  const releases = await webApi.getGlobalReleases();

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Releases"
        title="Workspace release list"
        description="All snapshots across the workspace in one view."
      />

      <Card title="Recent releases">
        <div className="anystore-list">
          {releases.map((release) => (
            <div key={release.id} className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">
                  <Link href={`/apps/${release.appId}/releases/${release.id}`}>{release.versionLabel}</Link>
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
  );
}
