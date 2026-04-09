import { useEffect, useMemo, useState } from "react";

type RoleStatus = "Active" | "Draft" | "Archived";

export type RoleRecord = {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
  status: RoleStatus;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
};

type RolesListProps = {
  roles?: RoleRecord[];
  loading?: boolean;
  selectedRoleId?: string | null;
  onSelectRole?: (role: RoleRecord) => void;
  onCreateRole?: () => void;
  onEditRole?: (role: RoleRecord) => void;
  onDuplicateRole?: (role: RoleRecord) => void;
  onArchiveRole?: (role: RoleRecord) => void;
  onDeleteRole?: (role: RoleRecord) => void;
};

type SortKey = "name" | "userCount" | "permissionCount" | "updatedAt";

const STORAGE_KEY = "mei-crm-roles-list";

const DEFAULT_ROLES: RoleRecord[] = [
  {
    id: "role-admin",
    name: "Admin",
    description:
      "Full business access across settings, users, pipeline control, reports, and system-wide decisions.",
    userCount: 2,
    permissionCount: 34,
    status: "Active",
    isSystemRole: true,
    createdAt: "2026-01-02T10:00:00.000Z",
    updatedAt: "2026-04-08T09:30:00.000Z",
  },
  {
    id: "role-manager",
    name: "Manager",
    description:
      "Team oversight, deal visibility, assignment control, approvals, and reporting access.",
    userCount: 5,
    permissionCount: 25,
    status: "Active",
    isSystemRole: true,
    createdAt: "2026-01-05T08:20:00.000Z",
    updatedAt: "2026-04-07T16:20:00.000Z",
  },
  {
    id: "role-sales",
    name: "Sales",
    description:
      "Lead handling, contact updates, deal progression, follow-ups, and daily activity execution.",
    userCount: 14,
    permissionCount: 17,
    status: "Active",
    isSystemRole: true,
    createdAt: "2026-01-08T12:00:00.000Z",
    updatedAt: "2026-04-06T12:10:00.000Z",
  },
  {
    id: "role-support",
    name: "Support",
    description:
      "Operational helpdesk access for tasks, lead assistance, and limited workflow editing.",
    userCount: 4,
    permissionCount: 12,
    status: "Active",
    isSystemRole: false,
    createdAt: "2026-02-11T11:00:00.000Z",
    updatedAt: "2026-04-04T07:45:00.000Z",
  },
  {
    id: "role-viewer",
    name: "Viewer",
    description:
      "Read-only access to selected modules for leadership visibility and reporting review.",
    userCount: 3,
    permissionCount: 7,
    status: "Draft",
    isSystemRole: false,
    createdAt: "2026-03-02T14:30:00.000Z",
    updatedAt: "2026-04-03T14:10:00.000Z",
  },
];

export default function RolesList({
  roles,
  loading = false,
  selectedRoleId,
  onSelectRole,
  onCreateRole,
  onEditRole,
  onDuplicateRole,
  onArchiveRole,
  onDeleteRole,
}: RolesListProps) {
  const [internalRoles, setInternalRoles] = useState<RoleRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RoleStatus>("All");
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (roles && roles.length > 0) {
      setInternalRoles(roles);
      return;
    }

    const storedRoles = readRolesFromStorage();
    if (storedRoles.length > 0) {
      setInternalRoles(storedRoles);
    } else {
      setInternalRoles(DEFAULT_ROLES);
      writeRolesToStorage(DEFAULT_ROLES);
    }
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let next = [...internalRoles];

    if (keyword) {
      next = next.filter((role) => {
        const haystack = `${role.name} ${role.description}`.toLowerCase();
        return haystack.includes(keyword);
      });
    }

    if (statusFilter !== "All") {
      next = next.filter((role) => role.status === statusFilter);
    }

    next.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "name") {
        return a.name.localeCompare(b.name) * direction;
      }

      if (sortKey === "userCount") {
        return (a.userCount - b.userCount) * direction;
      }

      if (sortKey === "permissionCount") {
        return (a.permissionCount - b.permissionCount) * direction;
      }

      return (
        (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
        direction
      );
    });

    return next;
  }, [internalRoles, search, statusFilter, sortKey, sortDirection]);

  const stats = useMemo(() => {
    const total = internalRoles.length;
    const active = internalRoles.filter((role) => role.status === "Active").length;
    const draft = internalRoles.filter((role) => role.status === "Draft").length;
    const archived = internalRoles.filter(
      (role) => role.status === "Archived"
    ).length;

    return { total, active, draft, archived };
  }, [internalRoles]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection(key === "name" ? "asc" : "desc");
  };

  const handleSelect = (role: RoleRecord) => {
    setMenuOpenId(null);
    onSelectRole?.(role);
  };

  const handleDuplicateFallback = (role: RoleRecord) => {
    const duplicated: RoleRecord = {
      ...role,
      id: `role-${Date.now()}`,
      name: `${role.name} Copy`,
      isSystemRole: false,
      status: "Draft",
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const next = [duplicated, ...internalRoles];
    setInternalRoles(next);
    writeRolesToStorage(next);
  };

  const handleArchiveFallback = (role: RoleRecord) => {
    const next = internalRoles.map((item) =>
      item.id === role.id
        ? {
            ...item,
            status: "Archived" as const,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setInternalRoles(next);
    writeRolesToStorage(next);
  };

  const handleDeleteFallback = (role: RoleRecord) => {
    const next = internalRoles.filter((item) => item.id !== role.id);
    setInternalRoles(next);
    writeRolesToStorage(next);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.eyebrow}>Access Governance</div>
            <h2 style={styles.title}>Roles List</h2>
            <p style={styles.subtitle}>
              Manage system roles, team access layers, and the structure of who
              can do what across your CRM universe.
            </p>
          </div>

          <button type="button" style={styles.primaryButton} onClick={onCreateRole}>
            + Create Role
          </button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Total Roles" value={stats.total} />
          <StatCard label="Active Roles" value={stats.active} />
          <StatCard label="Draft Roles" value={stats.draft} />
          <StatCard label="Archived Roles" value={stats.archived} />
        </div>

        <div style={styles.toolbar}>
          <input
            type="text"
            placeholder="Search role name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.toolbarRight}>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "All" | RoleStatus)
              }
              style={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <SortableTh
                  label="Role"
                  active={sortKey === "name"}
                  direction={sortDirection}
                  onClick={() => toggleSort("name")}
                  align="left"
                />
                <th style={{ ...styles.th, textAlign: "left" }}>Status</th>
                <SortableTh
                  label="Users"
                  active={sortKey === "userCount"}
                  direction={sortDirection}
                  onClick={() => toggleSort("userCount")}
                />
                <SortableTh
                  label="Permissions"
                  active={sortKey === "permissionCount"}
                  direction={sortDirection}
                  onClick={() => toggleSort("permissionCount")}
                />
                <SortableTh
                  label="Last Updated"
                  active={sortKey === "updatedAt"}
                  direction={sortDirection}
                  onClick={() => toggleSort("updatedAt")}
                  align="left"
                />
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockLarge} />
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonPill} />
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.skeletonNumber} />
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.skeletonNumber} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonBlockSmall} />
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.skeletonNumber} />
                    </td>
                  </tr>
                ))
              ) : filteredRoles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyCell}>
                    No roles found for the current filters.
                  </td>
                </tr>
              ) : (
                filteredRoles.map((role) => {
                  const isSelected = selectedRoleId === role.id;

                  return (
                    <tr
                      key={role.id}
                      style={{
                        ...styles.row,
                        ...(isSelected ? styles.rowSelected : {}),
                      }}
                    >
                      <td
                        style={styles.td}
                        onClick={() => handleSelect(role)}
                      >
                        <div style={styles.roleCell}>
                          <div style={styles.roleAvatar}>
                            {getRoleInitials(role.name)}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div style={styles.roleTitleRow}>
                              <div style={styles.roleName}>{role.name}</div>
                              {role.isSystemRole ? (
                                <span style={styles.systemRoleBadge}>
                                  System
                                </span>
                              ) : null}
                            </div>

                            <div style={styles.roleDescription}>
                              {role.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td} onClick={() => handleSelect(role)}>
                        <StatusBadge status={role.status} />
                      </td>

                      <td
                        style={styles.tdCenter}
                        onClick={() => handleSelect(role)}
                      >
                        <div style={styles.metricValue}>{role.userCount}</div>
                      </td>

                      <td
                        style={styles.tdCenter}
                        onClick={() => handleSelect(role)}
                      >
                        <div style={styles.metricValue}>
                          {role.permissionCount}
                        </div>
                      </td>

                      <td style={styles.td} onClick={() => handleSelect(role)}>
                        <div style={styles.dateText}>
                          {formatDate(role.updatedAt)}
                        </div>
                        <div style={styles.subDateText}>
                          Created {formatDate(role.createdAt)}
                        </div>
                      </td>

                      <td style={styles.tdCenter}>
                        <div style={styles.actionWrap}>
                          <button
                            type="button"
                            style={styles.iconButton}
                            onClick={() =>
                              setMenuOpenId((prev) =>
                                prev === role.id ? null : role.id
                              )
                            }
                          >
                            ⋯
                          </button>

                          {menuOpenId === role.id ? (
                            <div style={styles.menu}>
                              <button
                                type="button"
                                style={styles.menuItem}
                                onClick={() => {
                                  setMenuOpenId(null);
                                  onEditRole?.(role);
                                }}
                              >
                                Edit Role
                              </button>

                              <button
                                type="button"
                                style={styles.menuItem}
                                onClick={() => {
                                  setMenuOpenId(null);

                                  if (onDuplicateRole) {
                                    onDuplicateRole(role);
                                  } else {
                                    handleDuplicateFallback(role);
                                  }
                                }}
                              >
                                Duplicate
                              </button>

                              <button
                                type="button"
                                style={styles.menuItem}
                                onClick={() => {
                                  setMenuOpenId(null);

                                  if (onArchiveRole) {
                                    onArchiveRole(role);
                                  } else {
                                    handleArchiveFallback(role);
                                  }
                                }}
                              >
                                Archive
                              </button>

                              {!role.isSystemRole ? (
                                <button
                                  type="button"
                                  style={{
                                    ...styles.menuItem,
                                    ...styles.menuItemDanger,
                                  }}
                                  onClick={() => {
                                    setMenuOpenId(null);

                                    if (onDeleteRole) {
                                      onDeleteRole(role);
                                    } else {
                                      handleDeleteFallback(role);
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function SortableTh({
  label,
  active,
  direction,
  onClick,
  align = "center",
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      style={{
        ...styles.th,
        textAlign: align,
      }}
    >
      <button type="button" onClick={onClick} style={styles.sortButton}>
        <span>{label}</span>
        <span style={styles.sortArrow}>
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: RoleStatus }) {
  const statusStyle =
    status === "Active"
      ? styles.statusActive
      : status === "Draft"
      ? styles.statusDraft
      : styles.statusArchived;

  return <span style={{ ...styles.statusBadge, ...statusStyle }}>{status}</span>;
}

function getRoleInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function readRolesFromStorage(): RoleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRolesToStorage(roles: RoleRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
  } catch {
    // ignore storage errors
  }
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  headerCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#64748B",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  subtitle: {
    margin: "8px 0 0",
    maxWidth: 760,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#475569",
  },
  primaryButton: {
    height: 46,
    borderRadius: 12,
    border: "none",
    padding: "0 18px",
    background: "#0F172A",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    borderRadius: 18,
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    padding: "14px 16px",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748B",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#0F172A",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  toolbarRight: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  searchInput: {
    width: "100%",
    maxWidth: 360,
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
    boxSizing: "border-box",
  },
  select: {
    height: 44,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
    background: "#FFFFFF",
    color: "#0F172A",
  },
  tableCard: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.06)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: 1050,
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 13,
    fontWeight: 800,
    padding: "16px 14px",
    borderBottom: "1px solid #E2E8F0",
    whiteSpace: "nowrap",
  },
  sortButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 800,
    color: "#334155",
    cursor: "pointer",
  },
  sortArrow: {
    fontSize: 12,
    color: "#64748B",
  },
  row: {
    background: "#FFFFFF",
    transition: "background 0.2s ease",
  },
  rowSelected: {
    background: "#F8FAFC",
  },
  td: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
  },
  tdCenter: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    textAlign: "center",
    position: "relative",
  },
  roleCell: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    cursor: "pointer",
    minWidth: 0,
  },
  roleAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "#0F172A",
    color: "#FFFFFF",
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    fontWeight: 800,
    flexShrink: 0,
  },
  roleTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  roleName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "#64748B",
    maxWidth: 420,
  },
  systemRoleBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: 24,
    padding: "0 10px",
    borderRadius: 999,
    background: "#EFF6FF",
    color: "#1D4ED8",
    fontSize: 11,
    fontWeight: 800,
    border: "1px solid #BFDBFE",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 84,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  statusActive: {
    background: "#ECFDF5",
    color: "#047857",
    border: "1px solid #A7F3D0",
  },
  statusDraft: {
    background: "#FFFBEB",
    color: "#B45309",
    border: "1px solid #FDE68A",
  },
  statusArchived: {
    background: "#F1F5F9",
    color: "#475569",
    border: "1px solid #CBD5E1",
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
  },
  dateText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  subDateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  actionWrap: {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#334155",
    fontSize: 18,
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: 44,
    right: 0,
    minWidth: 180,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    boxShadow: "0 18px 34px rgba(15, 23, 42, 0.12)",
    overflow: "hidden",
    zIndex: 10,
  },
  menuItem: {
    width: "100%",
    border: "none",
    background: "#FFFFFF",
    padding: "12px 14px",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    cursor: "pointer",
  },
  menuItemDanger: {
    color: "#DC2626",
  },
  emptyCell: {
    padding: 28,
    textAlign: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#64748B",
  },
  skeletonBlockLarge: {
    width: 220,
    maxWidth: "100%",
    height: 16,
    borderRadius: 8,
    background: "#E2E8F0",
    marginBottom: 10,
  },
  skeletonBlockSmall: {
    width: 150,
    maxWidth: "100%",
    height: 12,
    borderRadius: 8,
    background: "#E2E8F0",
  },
  skeletonPill: {
    width: 72,
    height: 28,
    borderRadius: 999,
    background: "#E2E8F0",
  },
  skeletonNumber: {
    width: 38,
    height: 14,
    borderRadius: 8,
    background: "#E2E8F0",
    margin: "0 auto",
  },
};