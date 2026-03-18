import type { MemberRole } from "@anystore/domain";

const permissionsByRole: Record<MemberRole, string[]> = {
  owner: ["*"],
  admin: ["workspace:manage", "app:write", "release:write", "validation:run", "sync:execute"],
  editor: ["app:write", "release:write", "validation:run", "sync:plan"],
  reviewer: ["activity:read", "release:read", "comment:write"],
  viewer: ["activity:read", "release:read", "app:read"]
};

export function hasPermission(role: MemberRole, permission: string): boolean {
  const permissions = permissionsByRole[role];
  return permissions.includes("*") || permissions.includes(permission);
}

export function canViewSensitiveReviewSecrets(role: MemberRole): boolean {
  return role === "owner" || role === "admin" || role === "editor";
}
