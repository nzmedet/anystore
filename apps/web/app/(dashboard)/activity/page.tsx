import { Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../lib/api-client";
import { formatDateTime } from "../../../lib/format";

export default async function ActivityPage() {
  const activity = await webApi.getActivity();

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Activity"
        title="Workspace activity feed"
        description="All release, validation, and sync events in one place."
      />

      <Card title="Timeline">
        <div className="anystore-timeline">
          {activity.map((item) => (
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
