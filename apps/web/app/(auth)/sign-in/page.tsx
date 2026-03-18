import { Badge, Button, Card, SectionHeader } from "@anystore/ui";

export default function SignInPage() {
  return (
    <main className="anystore-login-shell">
      <div className="anystore-login-card">
        <section className="anystore-login-panel">
          <p className="anystore-eyebrow">Anystore</p>
          <h1>Release control for app stores without the spreadsheet tax.</h1>
          <p>
            Define metadata once, freeze release snapshots, inspect diffs, and keep Apple and Google in sync from one
            workspace.
          </p>
          <div className="anystore-topbar-meta">
            <Badge tone="accent">canonical-first</Badge>
            <Badge tone="success">deployable beta</Badge>
            <Badge tone="neutral">dry-run sync</Badge>
          </div>
        </section>

        <form className="anystore-login-form" action="/" method="get">
          <SectionHeader title="Sign in" description="This shell is wired for the future auth provider." />
          <label className="anystore-field">
            <span className="anystore-field-label">Email</span>
            <input className="anystore-input" name="email" type="email" placeholder="founder@northstar.dev" />
          </label>
          <label className="anystore-field">
            <span className="anystore-field-label">Password</span>
            <input className="anystore-input" name="password" type="password" placeholder="••••••••" />
          </label>
          <Button type="submit">Enter workspace</Button>
          <Card title="What this shell includes" description="The UI is connected to mocked data with a swappable API facade.">
            <ul className="anystore-list" style={{ padding: 0, margin: 0, listStyle: "none" }}>
              <li className="anystore-list-item">
                <span className="anystore-list-item-title">Workspace dashboard</span>
                <Badge tone="neutral">ready</Badge>
              </li>
              <li className="anystore-list-item">
                <span className="anystore-list-item-title">App and release detail views</span>
                <Badge tone="neutral">ready</Badge>
              </li>
              <li className="anystore-list-item">
                <span className="anystore-list-item-title">Metadata, activity, and integrations pages</span>
                <Badge tone="neutral">ready</Badge>
              </li>
            </ul>
          </Card>
        </form>
      </div>
    </main>
  );
}
