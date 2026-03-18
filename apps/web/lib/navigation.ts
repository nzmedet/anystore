export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const dashboardNav: NavItem[] = [
  { href: "/", label: "Overview", description: "Workspace summary and release health" },
  { href: "/apps", label: "Apps", description: "Canonical app registry" },
  { href: "/releases", label: "Releases", description: "Snapshots and submission readiness" },
  { href: "/assets", label: "Assets", description: "Source files and generated outputs" },
  { href: "/templates", label: "Templates", description: "Screenshot and marketing layouts" },
  { href: "/integrations", label: "Integrations", description: "Apple and Google connections" },
  { href: "/activity", label: "Activity", description: "Audit and event history" },
  { href: "/settings", label: "Settings", description: "Workspace and release defaults" }
];

export const appNav: NavItem[] = [
  { href: "overview", label: "Overview", description: "App summary" },
  { href: "metadata", label: "Metadata", description: "Draft and snapshot fields" },
  { href: "releases", label: "Releases", description: "Version history" },
  { href: "activity", label: "Activity", description: "App-level events" }
];
