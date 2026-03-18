import Link from "next/link";
import { Badge, Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../../lib/api-client";
import { formatDate } from "../../../../../lib/format";

type ReleasesPageProps = Readonly<{
  params: Promise<{ appId: string }>;
}>;

export default async function ReleasesPage({ params }: ReleasesPageProps) {
  const { appId } = await params;
  const releases = await webApi.getAppReleases(appId);

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Releases"
        title="Version history"
        description="Freeze state, release labels, and the current sync posture."
      />

      <Card title="App releases">
        <div className="anystore-list">
          {releases.map((release) => (
            <div key={release.id} className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">
                  <Link href={`/apps/${appId}/releases/${release.id}`}>{release.versionLabel}</Link>
                </p>
                <div className="anystore-list-item-meta">
                  <span>{release.releaseName ?? "Untitled"}</span>
                  <span>Created {formatDate(release.createdAt)}</span>
                  <span>{release.freezeState}</span>
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
