import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, SectionHeader } from "@anystore/ui";
import { webApi } from "../../../../lib/api-client";
import { appNav } from "../../../../lib/navigation";

type AppLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ appId: string }>;
}>;

export default async function AppLayout({ children, params }: AppLayoutProps) {
  const { appId } = await params;
  const detail = await webApi.getAppDetail(appId);

  if (!detail) {
    notFound();
  }

  const { app, platforms, locales } = detail;

  return (
    <div className="anystore-stack">
      <section className="anystore-page-hero">
        <div className="anystore-page-hero-grid">
          <div>
            <p className="anystore-eyebrow">App context</p>
            <h1 className="anystore-page-title">{app.canonicalProductName}</h1>
            <p className="anystore-page-description">
              {app.internalName} is bound to {platforms.length} platform records and {locales.length} active locales.
            </p>
            <div className="anystore-topbar-meta" style={{ marginTop: 18 }}>
              <Badge tone={app.status === "active" ? "success" : "neutral"}>{app.status}</Badge>
              {platforms.map((platform) => (
                <Badge key={platform.id} tone={platform.status === "connected" ? "success" : "warning"}>
                  {platform.platform}:{platform.bundleOrPackageId}
                </Badge>
              ))}
            </div>
          </div>
          <div className="anystore-page-meta">
            <SectionHeader
              eyebrow="Quick links"
              title="App sections"
              description="Use the sub-navigation to move between the core views."
            />
          </div>
        </div>
      </section>

      <nav className="anystore-subnav" aria-label="App sections">
        {appNav.map((item) => (
          <Link key={item.href} href={item.href === "overview" ? `/apps/${appId}` : `/apps/${appId}/${item.href}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
