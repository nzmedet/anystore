import { Badge, Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../lib/api-client";
import { formatBytes, formatDate } from "../../../lib/format";

export default async function AssetsPage() {
  const assets = await webApi.getAssets();
  const totalBytes = assets.reduce((sum, asset) => sum + (asset.fileSizeBytes ?? 0), 0);

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Assets"
        title="Source and generated files"
        description="The shell shows lineage, status, and which release an asset belongs to."
      />

      <div className="anystore-kpi-grid">
        <Card title={String(assets.length)} description="Tracked assets" />
        <Card title={formatBytes(totalBytes)} description="Total storage footprint" />
        <Card title={String(assets.filter((asset) => asset.status === "ready").length)} description="Ready for release" />
        <Card title={String(assets.filter((asset) => asset.status === "processing").length)} description="Still processing" />
      </div>

      <Card title="Asset inventory">
        <div className="anystore-list">
          {assets.map((asset) => (
            <div key={asset.id} className="anystore-list-item">
              <div className="anystore-list-item-main">
                <p className="anystore-list-item-title">{asset.assetType}</p>
                <div className="anystore-list-item-meta">
                  <span>{asset.platform ?? "all platforms"}</span>
                  <span>{asset.localeCode ?? "canonical"}</span>
                  <span>{formatDate(asset.createdAt)}</span>
                </div>
              </div>
              <Badge tone={asset.status === "ready" ? "success" : asset.status === "processing" ? "warning" : "neutral"}>
                {asset.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
