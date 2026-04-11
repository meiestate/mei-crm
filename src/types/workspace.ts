// src/utils/auth/workspace.ts

export type WorkspaceThemeMode = "light" | "dark" | "system";

export type WorkspacePlan =
  | "free"
  | "starter"
  | "growth"
  | "pro"
  | "enterprise";

export type WorkspaceUserRole =
  | "owner"
  | "admin"
  | "manager"
  | "member"
  | "viewer";

export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceUserRole;
  isActive: boolean;
  avatar?: string;
};

export type WorkspacePreferences = {
  theme: WorkspaceThemeMode;
  timezone: string;
  locale: string;
  currency: string;
  dateFormat: string;
  weekStartsOn: "sunday" | "monday";
};

export type WorkspaceInfo = {
  id: string;
  name: string;
  slug: string;
  plan: WorkspacePlan;
  ownerId: string;
  logo?: string;
  website?: string;
  industry?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  preferences: WorkspacePreferences;
  members: WorkspaceMember[];
};

export type WorkspaceSession = {
  currentWorkspaceId: string;
  workspaces: WorkspaceInfo[];
};

export const WORKSPACE_STORAGE_KEY = "mei-crm-workspace";
export const CURRENT_WORKSPACE_ID_STORAGE_KEY = "mei-crm-current-workspace-id";

export const DEFAULT_WORKSPACE_PREFERENCES: WorkspacePreferences = {
  theme: "light",
  timezone: "Asia/Kolkata",
  locale: "en-IN",
  currency: "INR",
  dateFormat: "DD MMM YYYY",
  weekStartsOn: "monday",
};

function safeJsonParse<T>(value: string | null): T | null {
  try {
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function slugifyWorkspaceName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createWorkspaceId(prefix = "ws"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function createMemberId(prefix = "mem"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function createEmptyWorkspace(
  overrides: Partial<WorkspaceInfo> = {}
): WorkspaceInfo {
  const now = new Date().toISOString();
  const name = overrides.name ?? "MEI Workspace";

  return {
    id: overrides.id ?? createWorkspaceId(),
    name,
    slug: overrides.slug ?? slugifyWorkspaceName(name),
    plan: overrides.plan ?? "growth",
    ownerId: overrides.ownerId ?? "",
    logo: overrides.logo ?? "",
    website: overrides.website ?? "",
    industry: overrides.industry ?? "",
    phone: overrides.phone ?? "",
    email: overrides.email ?? "",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    isActive: overrides.isActive ?? true,
    preferences: {
      ...DEFAULT_WORKSPACE_PREFERENCES,
      ...(overrides.preferences ?? {}),
    },
    members: overrides.members ?? [],
  };
}

export function normalizeWorkspace(
  workspace: Partial<WorkspaceInfo>
): WorkspaceInfo {
  const now = new Date().toISOString();
  const name = workspace.name?.trim() || "MEI Workspace";

  return {
    id: workspace.id || createWorkspaceId(),
    name,
    slug: workspace.slug?.trim() || slugifyWorkspaceName(name),
    plan: workspace.plan ?? "growth",
    ownerId: workspace.ownerId ?? "",
    logo: workspace.logo ?? "",
    website: workspace.website ?? "",
    industry: workspace.industry ?? "",
    phone: workspace.phone ?? "",
    email: workspace.email ?? "",
    createdAt: workspace.createdAt ?? now,
    updatedAt: workspace.updatedAt ?? now,
    isActive: workspace.isActive ?? true,
    preferences: {
      ...DEFAULT_WORKSPACE_PREFERENCES,
      ...(workspace.preferences ?? {}),
    },
    members: Array.isArray(workspace.members) ? workspace.members : [],
  };
}

export function setWorkspaceSession(session: WorkspaceSession): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(session));
  storage.setItem(CURRENT_WORKSPACE_ID_STORAGE_KEY, session.currentWorkspaceId);
}

export function getWorkspaceSession(): WorkspaceSession | null {
  const storage = getStorage();
  if (!storage) return null;

  const rawSession = safeJsonParse<WorkspaceSession>(
    storage.getItem(WORKSPACE_STORAGE_KEY)
  );

  if (!rawSession) return null;

  return {
    currentWorkspaceId: rawSession.currentWorkspaceId,
    workspaces: Array.isArray(rawSession.workspaces)
      ? rawSession.workspaces.map(normalizeWorkspace)
      : [],
  };
}

export function clearWorkspaceSession(): void {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(WORKSPACE_STORAGE_KEY);
  storage.removeItem(CURRENT_WORKSPACE_ID_STORAGE_KEY);
}

export function getCurrentWorkspaceId(): string | null {
  const storage = getStorage();
  if (!storage) return null;

  return (
    storage.getItem(CURRENT_WORKSPACE_ID_STORAGE_KEY) ||
    getWorkspaceSession()?.currentWorkspaceId ||
    null
  );
}

export function setCurrentWorkspaceId(workspaceId: string): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(CURRENT_WORKSPACE_ID_STORAGE_KEY, workspaceId);

  const session = getWorkspaceSession();
  if (!session) return;

  setWorkspaceSession({
    ...session,
    currentWorkspaceId: workspaceId,
  });
}

export function getAllWorkspaces(): WorkspaceInfo[] {
  return getWorkspaceSession()?.workspaces ?? [];
}

export function getWorkspaceById(workspaceId: string): WorkspaceInfo | null {
  const workspaces = getAllWorkspaces();
  return workspaces.find((workspace) => workspace.id === workspaceId) ?? null;
}

export function getWorkspaceBySlug(slug: string): WorkspaceInfo | null {
  const normalizedSlug = slug.trim().toLowerCase();
  const workspaces = getAllWorkspaces();

  return (
    workspaces.find(
      (workspace) => workspace.slug.trim().toLowerCase() === normalizedSlug
    ) ?? null
  );
}

export function getCurrentWorkspace(): WorkspaceInfo | null {
  const currentWorkspaceId = getCurrentWorkspaceId();
  if (!currentWorkspaceId) return null;

  return getWorkspaceById(currentWorkspaceId);
}

export function hasWorkspaceSession(): boolean {
  const session = getWorkspaceSession();
  return Boolean(session && session.workspaces.length > 0);
}

export function saveWorkspace(workspace: WorkspaceInfo): WorkspaceSession {
  const normalized = normalizeWorkspace({
    ...workspace,
    updatedAt: new Date().toISOString(),
  });

  const session = getWorkspaceSession();

  if (!session) {
    const nextSession: WorkspaceSession = {
      currentWorkspaceId: normalized.id,
      workspaces: [normalized],
    };

    setWorkspaceSession(nextSession);
    return nextSession;
  }

  const exists = session.workspaces.some((item) => item.id === normalized.id);

  const nextSession: WorkspaceSession = {
    currentWorkspaceId: session.currentWorkspaceId || normalized.id,
    workspaces: exists
      ? session.workspaces.map((item) =>
          item.id === normalized.id ? normalized : item
        )
      : [...session.workspaces, normalized],
  };

  setWorkspaceSession(nextSession);
  return nextSession;
}

export function createWorkspace(
  workspace: Partial<WorkspaceInfo>
): WorkspaceInfo {
  const normalized = normalizeWorkspace(workspace);
  saveWorkspace(normalized);
  setCurrentWorkspaceId(normalized.id);
  return normalized;
}

export function updateWorkspace(
  workspaceId: string,
  updates: Partial<WorkspaceInfo>
): WorkspaceInfo | null {
  const existing = getWorkspaceById(workspaceId);
  if (!existing) return null;

  const updated = normalizeWorkspace({
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
    preferences: {
      ...existing.preferences,
      ...(updates.preferences ?? {}),
    },
    members: updates.members ?? existing.members,
  });

  saveWorkspace(updated);
  return updated;
}

export function removeWorkspace(workspaceId: string): WorkspaceSession | null {
  const session = getWorkspaceSession();
  if (!session) return null;

  const nextWorkspaces = session.workspaces.filter(
    (workspace) => workspace.id !== workspaceId
  );

  const nextCurrentWorkspaceId =
    session.currentWorkspaceId === workspaceId
      ? nextWorkspaces[0]?.id ?? ""
      : session.currentWorkspaceId;

  const nextSession: WorkspaceSession = {
    currentWorkspaceId: nextCurrentWorkspaceId,
    workspaces: nextWorkspaces,
  };

  if (nextWorkspaces.length === 0) {
    clearWorkspaceSession();
    return {
      currentWorkspaceId: "",
      workspaces: [],
    };
  }

  setWorkspaceSession(nextSession);
  return nextSession;
}

export function addWorkspaceMember(
  workspaceId: string,
  member: Omit<WorkspaceMember, "id"> & { id?: string }
): WorkspaceInfo | null {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return null;

  const nextMember: WorkspaceMember = {
    ...member,
    id: member.id ?? createMemberId(),
  };

  return updateWorkspace(workspaceId, {
    members: [...workspace.members, nextMember],
  });
}

export function updateWorkspaceMember(
  workspaceId: string,
  memberId: string,
  updates: Partial<WorkspaceMember>
): WorkspaceInfo | null {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return null;

  return updateWorkspace(workspaceId, {
    members: workspace.members.map((member) =>
      member.id === memberId ? { ...member, ...updates, id: member.id } : member
    ),
  });
}

export function removeWorkspaceMember(
  workspaceId: string,
  memberId: string
): WorkspaceInfo | null {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return null;

  return updateWorkspace(workspaceId, {
    members: workspace.members.filter((member) => member.id !== memberId),
  });
}

export function getWorkspaceMembers(workspaceId: string): WorkspaceMember[] {
  return getWorkspaceById(workspaceId)?.members ?? [];
}

export function getCurrentWorkspaceMembers(): WorkspaceMember[] {
  return getCurrentWorkspace()?.members ?? [];
}

export function getWorkspaceMemberById(
  workspaceId: string,
  memberId: string
): WorkspaceMember | null {
  return (
    getWorkspaceMembers(workspaceId).find((member) => member.id === memberId) ??
    null
  );
}

export function getMemberDisplayName(
  member: Pick<WorkspaceMember, "name" | "email">
): string {
  return member.name?.trim() || member.email?.trim() || "Unknown Member";
}

export function getWorkspaceOwner(
  workspaceId: string
): WorkspaceMember | null {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return null;

  return (
    workspace.members.find((member) => member.id === workspace.ownerId) ?? null
  );
}

export function isWorkspaceOwner(
  workspace: WorkspaceInfo,
  memberId: string
): boolean {
  return workspace.ownerId === memberId;
}

export function getActiveWorkspaceMembersCount(workspaceId: string): number {
  return getWorkspaceMembers(workspaceId).filter((member) => member.isActive)
    .length;
}

export function canManageWorkspace(role: WorkspaceUserRole): boolean {
  return role === "owner" || role === "admin";
}

export function canEditWorkspaceSettings(role: WorkspaceUserRole): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}

export function canViewWorkspace(role: WorkspaceUserRole): boolean {
  return (
    role === "owner" ||
    role === "admin" ||
    role === "manager" ||
    role === "member" ||
    role === "viewer"
  );
}

export function getWorkspaceRoleLabel(role: WorkspaceUserRole): string {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "manager":
      return "Manager";
    case "member":
      return "Member";
    case "viewer":
      return "Viewer";
    default:
      return "Member";
  }
}

export function updateWorkspacePreferences(
  workspaceId: string,
  preferences: Partial<WorkspacePreferences>
): WorkspaceInfo | null {
  const workspace = getWorkspaceById(workspaceId);
  if (!workspace) return null;

  return updateWorkspace(workspaceId, {
    preferences: {
      ...workspace.preferences,
      ...preferences,
    },
  });
}

export function getWorkspaceThemeMode(
  workspaceId?: string
): WorkspaceThemeMode {
  const workspace = workspaceId
    ? getWorkspaceById(workspaceId)
    : getCurrentWorkspace();

  return workspace?.preferences.theme ?? DEFAULT_WORKSPACE_PREFERENCES.theme;
}

export function getWorkspaceTimezone(workspaceId?: string): string {
  const workspace = workspaceId
    ? getWorkspaceById(workspaceId)
    : getCurrentWorkspace();

  return workspace?.preferences.timezone ?? DEFAULT_WORKSPACE_PREFERENCES.timezone;
}

export function getWorkspaceLocale(workspaceId?: string): string {
  const workspace = workspaceId
    ? getWorkspaceById(workspaceId)
    : getCurrentWorkspace();

  return workspace?.preferences.locale ?? DEFAULT_WORKSPACE_PREFERENCES.locale;
}

export function getWorkspaceCurrency(workspaceId?: string): string {
  const workspace = workspaceId
    ? getWorkspaceById(workspaceId)
    : getCurrentWorkspace();

  return workspace?.preferences.currency ?? DEFAULT_WORKSPACE_PREFERENCES.currency;
}

export function formatWorkspaceName(workspace: Pick<WorkspaceInfo, "name">): string {
  return workspace.name?.trim() || "Untitled Workspace";
}

export function getWorkspaceInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "WS";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function getWorkspaceSummary(workspace: WorkspaceInfo) {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    plan: workspace.plan,
    ownerId: workspace.ownerId,
    membersCount: workspace.members.length,
    activeMembersCount: workspace.members.filter((member) => member.isActive)
      .length,
    theme: workspace.preferences.theme,
    timezone: workspace.preferences.timezone,
    locale: workspace.preferences.locale,
    isActive: workspace.isActive,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}