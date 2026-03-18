import { notFound } from "next/navigation";
import { Badge, Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../../lib/api-client";
import { formatDateTime } from "../../../../../lib/format";

type MetadataPageProps = Readonly<{
  params: Promise<{ appId: string }>;
}>;

export default async function MetadataPage({ params }: MetadataPageProps) {
  const { appId } = await params;
  const detail = await webApi.getAppDetail(appId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Metadata"
        title="Draft and snapshot fields"
        description="The shell shows where a value comes from and how it will resolve for the release."
      />

      <div className="anystore-grid-two">
        <Card title="Effective field map" eyebrow="Resolution order" description="Canonical, platform, locale, and release snapshot layers.">
          <div className="anystore-list">
            {detail.metadata.map((entry) => (
              <div key={entry.id} className="anystore-list-item">
                <div className="anystore-list-item-main">
                  <p className="anystore-list-item-title">{entry.fieldKey}</p>
                  <div className="anystore-list-item-meta">
                    <span>{entry.sourceLayer}</span>
                    <span>{entry.localeCode ?? "canonical"}</span>
                    <span>{entry.platform ?? "any platform"}</span>
                  </div>
                </div>
                <span className="anystore-field-value">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Why this matters" eyebrow="Release safety">
          <div className="anystore-list">
            <div className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">Release snapshot is frozen</p>
                <p className="anystore-card-description">The snapshot should never drift after freeze without an explicit unfreeze path.</p>
              </div>
              <Badge tone="success">frozen</Badge>
            </div>
            <div className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">Localized override visibility</p>
                <p className="anystore-card-description">The UI exposes which locale actually owns the field.</p>
              </div>
              <Badge tone="accent">source aware</Badge>
            </div>
            <div className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">Auditability</p>
                <p className="anystore-card-description">Every meaningful metadata mutation should end up in the event log.</p>
              </div>
              <span className="anystore-field-value">{formatDateTime(detail.app.updatedAt)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
