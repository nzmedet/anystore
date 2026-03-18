import { Badge, Card, SectionHeader } from "@anystore/ui";

export default function SettingsPage() {
  return (
    <div className="anystore-stack">
      <SectionHeader
        eyebrow="Settings"
        title="Workspace defaults"
        description="Base configuration for release operations, access, and future automations."
      />

      <div className="anystore-grid-two">
        <Card title="Workspace" description="Northstar Labs is the top-level tenant for this shell.">
          <div className="anystore-field-grid">
            <div className="anystore-field">
              <span className="anystore-field-label">Default locale</span>
              <span className="anystore-field-value">en-US</span>
            </div>
            <div className="anystore-field">
              <span className="anystore-field-label">Policy</span>
              <Badge tone="accent">canonical-first</Badge>
            </div>
          </div>
        </Card>

        <Card title="Beta guardrails" description="The shell is set up to support future auth, audit, and approval settings.">
          <div className="anystore-list">
            <div className="anystore-list-item">
              <span className="anystore-list-item-title">Sensitive fields hidden from viewers</span>
              <Badge tone="success">on</Badge>
            </div>
            <div className="anystore-list-item">
              <span className="anystore-list-item-title">Provider writes gated behind dry-run mode</span>
              <Badge tone="warning">default</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
