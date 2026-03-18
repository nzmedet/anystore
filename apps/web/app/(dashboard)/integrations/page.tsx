import { Badge, Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../lib/api-client";
import { formatDateTime } from "../../../lib/format";

export default async function IntegrationsPage() {
  const connections = await webApi.getProviderConnections();

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Integrations"
        title="Apple and Google connections"
        description="Connection health, provider status, and the current sync posture."
      />

      <div className="anystore-grid-cards">
        {connections.map((connection) => (
          <Card
            key={connection.id}
            title={connection.provider}
            eyebrow={connection.status}
            description={`Updated ${formatDateTime(connection.updatedAt)}`}
          >
            <Badge tone={connection.status === "connected" ? "success" : "warning"}>{connection.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
