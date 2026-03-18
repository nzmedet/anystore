import { notFound } from "next/navigation";
import { Card, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../../lib/api-client";
import { formatDateTime } from "../../../../../lib/format";

type ActivityPageProps = Readonly<{
  params: Promise<{ appId: string }>;
}>;

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { appId } = await params;
  const detail = await webApi.getAppDetail(appId);

  if (!detail) {
    notFound();
  }

  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Activity"
        title="App event history"
        description="Audit and operational events for the app context."
      />

      <Card title="Timeline" eyebrow="Audit feed">
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
