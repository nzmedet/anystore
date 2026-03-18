import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { WorkspaceSummary } from "../lib/types";

type AppShellProps = {
  workspace: WorkspaceSummary;
  children: ReactNode;
};

export function AppShell({ workspace, children }: AppShellProps) {
  return (
    <div className="anystore-shell">
      <Sidebar workspaceName={workspace.name} workspaceSlug={workspace.slug} />
      <div className="anystore-shell-main">
        <Topbar workspaceName={workspace.name} />
        <main className="anystore-main">{children}</main>
      </div>
    </div>
  );
}
