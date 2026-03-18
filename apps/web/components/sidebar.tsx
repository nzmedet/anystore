"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "../lib/navigation";
import { Badge, cn } from "@anystore/ui";

type SidebarProps = {
  workspaceName: string;
  workspaceSlug: string;
};

export function Sidebar({ workspaceName, workspaceSlug }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="anystore-sidebar">
      <div className="anystore-brand">
        <div>
          <p className="anystore-brand-kicker">Anystore</p>
          <h1>{workspaceName}</h1>
        </div>
        <Badge tone="accent">{workspaceSlug}</Badge>
      </div>

      <nav className="anystore-nav">
        {dashboardNav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn("anystore-nav-link", active && "is-active")}>
              <span>{item.label}</span>
              <small>{item.description}</small>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
