import type { ReactNode } from "react";
import { AppShell } from "../../components/app-shell";
import { webApi } from "../../lib/api-client";

type DashboardLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const workspace = await webApi.getWorkspace();

  return <AppShell workspace={workspace}>{children}</AppShell>;
}
