import { Badge, Card, SectionHeader } from "@anystore/ui";

const templates = [
  {
    id: "template_market_01",
    name: "Launch panel",
    version: "v3",
    status: "ready",
    notes: "Used for product-led launch releases"
  },
  {
    id: "template_story_02",
    name: "Story frame",
    version: "v2",
    status: "stale",
    notes: "Needs a refresh after the last design update"
  }
];

export default async function TemplatesPage() {
  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Templates"
        title="Screenshot and marketing layouts"
        description="The rendering engine will eventually own these definitions. For now the shell exposes the workspace surface."
      />

      <div className="anystore-grid-cards">
        {templates.map((template) => (
          <Card key={template.id} title={template.name} eyebrow={template.version} description={template.notes}>
            <Badge tone={template.status === "ready" ? "success" : "warning"}>{template.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}
