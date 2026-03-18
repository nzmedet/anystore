"use client";

import { usePathname } from "next/navigation";
import { Badge } from "@anystore/ui";

type TopbarProps = {
  workspaceName: string;
};

const titles: Record<string, string> = {
  "/": "Overview",
  "/apps": "Apps",
  "/releases": "Releases",
  "/assets": "Assets",
  "/templates": "Templates",
  "/integrations": "Integrations",
  "/activity": "Activity",
  "/settings": "Settings"
};

function resolveTitle(pathname: string) {
  const appPath = pathname.match(/^\/apps\/[^/]+(?:\/[^/]+)?/);
  if (appPath) {
    if (pathname.includes("/metadata")) return "Metadata";
    if (pathname.includes("/activity")) return "Activity";
    if (pathname.includes("/releases/")) return "Release detail";
    if (pathname.endsWith("/releases")) return "Releases";
    return "App detail";
  }

  return titles[pathname] ?? "Dashboard";
}

export function Topbar({ workspaceName }: TopbarProps) {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="anystore-topbar">
      <div>
        <p className="anystore-eyebrow">Control plane</p>
        <h2 className="anystore-topbar-title">{title}</h2>
      </div>

      <div className="anystore-topbar-meta">
        <Badge tone="neutral">{workspaceName}</Badge>
        <Badge tone="success">beta shell</Badge>
      </div>
    </header>
  );
}
