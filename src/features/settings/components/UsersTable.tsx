import { useEffect, useMemo, useState } from "react";

export type UserStatus = "Active" | "Invited" | "Suspended" | "Inactive";
export type UserAccessLevel = "Full" | "Restricted" | "Read Only";

export type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: UserStatus;
  accessLevel: UserAccessLevel;
  avatar?: string;
  lastActiveAt: string;
  createdAt: string;
  invitedAt?: string;
  reportsTo?: string;
  source?: string;
  isSystemUser?: boolean;
};

type UsersTableProps = {
  users?: UserRecord[];
  loading?: boolean;
  selectedUserIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (user: UserRecord) => void;
  onInviteUser?: () => void;
  onEditUser?: (user: UserRecord) => void;
  onResendInvite?: (user: UserRecord) => void;
  onSuspendUser?: (user: UserRecord) => void;
  onActivateUser?: (user: UserRecord) => void;
  onDeleteUser?: (user: UserRecord) => void;
};

type SortKey =
  | "fullName"
  | "role"
  | "department"
  | "status"
  | "lastActiveAt"
  | "createdAt";

const STORAGE_KEY = "mei-crm-users-table";

const DEFAULT_USERS: UserRecord[] = [
  {
    id: "usr-1001",
    fullName: "Arjun Mehta",
    email: "arjun@mei.com",
    phone: "+91 98765 40001",
    role: "Admin",
    department: "Management",
    status: "Active",
    accessLevel: "Full",
    lastActiveAt: "2026-04-09T12:10:00.000Z",
    createdAt: "2026-01-05T08:00:00.000Z",
    reportsTo: "Founder Office",
    source: "System",
    isSystemUser: true,
  },
  {
    id: "usr-1002",
    fullName: "Priya Nair",
    email: "priya@mei.com",
    phone: "+91 98765 40002",
    role: "Manager",
    department: "Sales",
    status: "Active",
    accessLevel: "Full",
    lastActiveAt: "2026-04-09T11:22:00.000Z",
    createdAt: "2026-01-18T10:30:00.000Z",
    reportsTo: "Arjun Mehta",
    source: "Direct Hire",
  },
  {
    id: "usr-1003",
    fullName: "Rahul Verma",
    email: "rahul@mei.com",
    phone: "+91 98765 40003",
    role: "Sales",
    department: "Sales",
    status: "Active",
    accessLevel: "Restricted",
    lastActiveAt: "2026-04-09T09:05:00.000Z",
    createdAt: "2026-02-04T09:15:00.000Z",
    reportsTo: "Priya Nair",
    source: "Referral",
  },
  {
    id: "usr-1004",
    fullName: "Nisha Kapoor",
    email: "nisha@mei.com",
    phone: "+91 98765 40004",
    role: "Support",
    department: "Operations",
    status: "Invited",
    accessLevel: "Restricted",
    lastActiveAt: "",
    createdAt: "2026-03-10T07:00:00.000Z",
    invitedAt: "2026-04-08T15:40:00.000Z",
    reportsTo: "Priya Nair",
    source: "Invite",
  },
  {
    id: "usr-1005",
    fullName: "Karan Malhotra",
    email: "karan@mei.com",
    phone: "+91 98765 40005",
    role: "Viewer",
    department: "Finance",
    status: "Suspended",
    accessLevel: "Read Only",
    lastActiveAt: "2026-04-03T18:40:00.000Z",
    createdAt: "2026-02-21T11:10:00.000Z",
    reportsTo: "Arjun Mehta",
    source: "Internal",
  },
  {
    id: "usr-1006",
    fullName: "Sneha Iyer",
    email: "sneha@mei.com",
    phone: "+91 98765 40006",
    role: "Sales",
    department: "Sales",
    status: "Inactive",
    accessLevel: "Restricted",
    lastActiveAt: "2026-03-25T10:00:00.000Z",
    createdAt: "2026-02-28T12:30:00.000Z",
    reportsTo: "Priya Nair",
    source: "Campaign",
  },
];

export default function UsersTable({
  users,
  loading = false,
  selectedUserIds,
  onSelectionChange,
  onRowClick,
  onInviteUser,
  onEditUser,
  onResendInvite,
  onSuspendUser,
  onActivateUser,
  onDeleteUser,
}: UsersTableProps) {
  const [internalUsers, setInternalUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("lastActiveAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (users && users.length > 0) {
      setInternalUsers(users);
      return;
    }

    const stored = readUsersFromStorage();
    if (stored.length > 0) {
      setInternalUsers(stored);
    } else {
      setInternalUsers(DEFAULT_USERS);
      writeUsersToStorage(DEFAULT_USERS);
    }
  }, [users]);

  useEffect(() => {
    if (selectedUserIds) {
      setInternalSelectedIds(selectedUserIds);
    }
  }, [selectedUserIds]);

  const departments = useMemo(() => {
    return Array.from(new Set(internalUsers.map((item) => item.department))).sort();
  }, [internalUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    let next = [...internalUsers];

    if (keyword) {
      next = next.filter((user) => {
        const haystack =
          `${user.fullName} ${user.email} ${user.phone} ${user.role} ${user.department} ${user.status}`.toLowerCase();
        return haystack.includes(keyword);
      });
    }

    if (statusFilter !== "All") {
      next = next.filter((user) => user.status === statusFilter);
    }

    if (departmentFilter !== "All") {
      next = next.filter((user) => user.department === departmentFilter);
    }

    next.sort((a, b) => {
      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortKey === "fullName") {
        return a.fullName.localeCompare(b.fullName) * direction;
      }
      if (sortKey === "role") {
        return a.role.localeCompare(b.role) * direction;
      }
      if (sortKey === "department") {
        return a.department.localeCompare(b.department) * direction;
      }
      if (sortKey === "status") {
        return a.status.localeCompare(b.status) * direction;
      }

      const aValue = new Date(a[sortKey] || 0).getTime();
      const bValue = new Date(b[sortKey] || 0).getTime();
      return (aValue - bValue) * direction;
    });

    return next;
  }, [departmentFilter, internalUsers, search, sortDirection, sortKey, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: internalUsers.length,
      active: internalUsers.filter((u) => u.status === "Active").length,
      invited: internalUsers.filter((u) => u.status === "Invited").length,
      suspended: internalUsers.filter((u) => u.status === "Suspended").length,
    };
  }, [internalUsers]);

  const visibleSelectedIds = useMemo(() => {
    const visibleIds = new Set(filteredUsers.map((user) => user.id));
    return internalSelectedIds.filter((id) => visibleIds.has(id));
  }, [filteredUsers, internalSelectedIds]);

  const allVisibleSelected =
    filteredUsers.length > 0 && visibleSelectedIds.length === filteredUsers.length;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "fullName" || key === "role" || key === "department" ? "asc" : "desc");
  };

  const updateSelection = (ids: string[]) => {
    setInternalSelectedIds(ids);
    onSelectionChange?.(ids);
  };

  const toggleSelectOne = (id: string) => {
    const exists = internalSelectedIds.includes(id);
    const next = exists
      ? internalSelectedIds.filter((item) => item !== id)
      : [...internalSelectedIds, id];

    updateSelection(next);
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filteredUsers.map((user) => user.id));
      const next = internalSelectedIds.filter((id) => !visibleSet.has(id));
      updateSelection(next);
      return;
    }

    const merged = new Set([...internalSelectedIds, ...filteredUsers.map((user) => user.id)]);
    updateSelection(Array.from(merged));
  };

  const handleSuspendFallback = (user: UserRecord) => {
    const next = internalUsers.map((item) =>
      item.id === user.id
        ? { ...item, status: "Suspended" as const }
        : item
    );
    setInternalUsers(next);
    writeUsersToStorage(next);
  };

  const handleActivateFallback = (user: UserRecord) => {
    const next = internalUsers.map((item) =>
      item.id === user.id
        ? {
            ...item,
            status: "Active" as const,
            lastActiveAt: new Date().toISOString(),
          }
        : item
    );
    setInternalUsers(next);
    writeUsersToStorage(next);
  };

  const handleDeleteFallback = (user: UserRecord) => {
    const next = internalUsers.filter((item) => item.id !== user.id);
    setInternalUsers(next);
    writeUsersToStorage(next);
    updateSelection(internalSelectedIds.filter((id) => id !== user.id));
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerCard}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.eyebrow}>Team Directory</div>
            <h2 style={styles.title}>Users Table</h2>
            <p style={styles.subtitle}>
              Manage invited members, active operators, suspended accounts, and
              role-based access across your CRM command center.
            </p>
          </div>

          <button type="button" style={styles.primaryButton} onClick={onInviteUser}>
            + Invite User
          </button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Total Users" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Invited" value={stats.invited} />
          <StatCard label="Suspended" value={stats.suspended} />
        </div>

        <div style={styles.toolbar}>
          <input
            type="text"
            placeholder="Search name, email, role, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.toolbarRight}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "All" | UserStatus)}
              style={styles.select}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {internalSelectedIds.length > 0 ? (
          <div style={styles.selectionBar}>
            <span style={styles.selectionText}>
              {internalSelectedIds.length} user{internalSelectedIds.length === 1 ? "" : "s"} selected
            </span>
            <button
              type="button"
              style={styles.clearSelectionButton}
              onClick={() => updateSelection([])}
            >
              Clear Selection
            </button>
          </div>
        ) : null}
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.checkboxTh}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAllVisible}
                    style={styles.checkbox}
                  />
                </th>

                <SortableTh
                  label="User"
                  active={sortKey === "fullName"}
                  direction={sortDirection}
                  onClick={() => toggleSort("fullName")}
                  align="left"
                />
                <SortableTh
                  label="Role"
                  active={sortKey === "role"}
                  direction={sortDirection}
                  onClick={() => toggleSort("role")}
                  align="left"
                />
                <SortableTh
                  label="Department"
                  active={sortKey === "department"}
                  direction={sortDirection}
                  onClick={() => toggleSort("department")}
                  align="left"
                />
                <SortableTh
                  label="Status"
                  active={sortKey === "status"}
                  direction={sortDirection}
                  onClick={() => toggleSort("status")}
                  align="left"
                />
                <th style={{ ...styles.th, textAlign: "left" }}>Access</th>
                <SortableTh
                  label="Last Active"
                  active={sortKey === "lastActiveAt"}
                  direction={sortDirection}
                  onClick={() => toggleSort("lastActiveAt")}
                  align="left"
                />
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td style={styles.checkboxTd}>
                      <div style={styles.skeletonCheckbox} />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.skeletonUserRow}>
                        <div style={styles.skeletonAvatar} />
                        <div>
                          <div style={styles.skeletonBlockLarge} />
                          <div style={styles.skeletonBlockSmall} />
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}><div style={styles.skeletonPill} /></td>
                    <td style={styles.td}><div style={styles.skeletonBlockSmall} /></td>
                    <td style={styles.td}><div style={styles.skeletonPill} /></td>
                    <td style={styles.td}><div style={styles.skeletonPill} /></td>
                    <td style={styles.td}><div style={styles.skeletonBlockSmall} /></td>
                    <td style={styles.tdCenter}><div style={styles.skeletonNumber} /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={styles.emptyCell}>
                    No users found for the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = internalSelectedIds.includes(user.id);

                  return (
                    <tr
                      key={user.id}
                      style={{
                        ...styles.row,
                        ...(isSelected ? styles.rowSelected : {}),
                      }}
                    >
                      <td style={styles.checkboxTd}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(user.id)}
                          style={styles.checkbox}
                        />
                      </td>

                      <td
                        style={styles.td}
                        onClick={() => onRowClick?.(user)}
                      >
                        <div style={styles.userCell}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.fullName}
                              style={styles.avatarImage}
                            />
                          ) : (
                            <div style={styles.avatarFallback}>
                              {getInitials(user.fullName)}
                            </div>
                          )}

                          <div style={{ minWidth: 0 }}>
                            <div style={styles.userTitleRow}>
                              <div style={styles.userName}>{user.fullName}</div>
                              {user.isSystemUser ? (
                                <span style={styles.systemBadge}>System</span>
                              ) : null}
                            </div>

                            <div style={styles.userMeta}>{user.email}</div>
                            <div style={styles.userSubMeta}>{user.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(user)}>
                        <span style={styles.roleBadge}>{user.role}</span>
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(user)}>
                        <div style={styles.departmentText}>{user.department}</div>
                        {user.reportsTo ? (
                          <div style={styles.subDateText}>Reports to {user.reportsTo}</div>
                        ) : null}
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(user)}>
                        <StatusBadge status={user.status} />
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(user)}>
                        <AccessBadge accessLevel={user.accessLevel} />
                      </td>

                      <td style={styles.td} onClick={() => onRowClick?.(user)}>
                        {user.status === "Invited" && user.invitedAt ? (
                          <>
                            <div style={styles.dateText}>
                              Invited {formatDate(user.invitedAt)}
                            </div>
                            <div style={styles.subDateText}>
                              Awaiting acceptance
                            </div>
                          </>
                        ) : user.lastActiveAt ? (
                          <>
                            <div style={styles.dateText}>
                              {formatRelative(user.lastActiveAt)}
                            </div>
                            <div style={styles.subDateText}>
                              Joined {formatDate(user.createdAt)}
                            </div>
                          </>
                        ) : (
                          <div style={styles.subDateText}>No activity yet</div>
                        )}
                      </td>

                      <td style={styles.tdCenter}>
                        <div style={styles.actionWrap}>
                          <button
                            type="button"
                            style={styles.iconButton}
                            onClick={() =>
                              setMenuOpenId((prev) => (prev === user.id ? null : user.id))
                            }
                          >
                            ⋯
                          </button>

                          {menuOpenId === user.id ? (
                            <div style={styles.menu}>
                              <button
                                type="button"
                                style={styles.menuItem}
                                onClick={() => {
                                  setMenuOpenId(null);
                                  onEditUser?.(user);
                                }}
                              >
                                Edit User
                              </button>

                              {user.status === "Invited" ? (
                                <button
                                  type="button"
                                  style={styles.menuItem}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    onResendInvite?.(user);
                                  }}
                                >
                                  Resend Invite
                                </button>
                              ) : null}

                              {user.status === "Suspended" || user.status === "Inactive" ? (
                                <button
                                  type="button"
                                  style={styles.menuItem}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    if (onActivateUser) {
                                      onActivateUser(user);
                                    } else {
                                      handleActivateFallback(user);
                                    }
                                  }}
                                >
                                  Activate User
                                </button>
                              ) : null}

                              {user.status === "Active" ? (
                                <button
                                  type="button"
                                  style={styles.menuItem}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    if (onSuspendUser) {
                                      onSuspendUser(user);
                                    } else {
                                      handleSuspendFallback(user);
                                    }
                                  }}
                                >
                                  Suspend User
                                </button>
                              ) : null}

                              {!user.isSystemUser ? (
                                <button
                                  type="button"
                                  style={{ ...styles.menuItem, ...styles.menuItemDanger }}
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    if (onDeleteUser) {
                                      onDeleteUser(user);
                                    } else {
                                      handleDeleteFallback(user);
                                    }
                                  }}
                                >
                                  Delete User
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

function StatusBadge({ status }: { status: UserStatus }) {
  const styleMap: Record<UserStatus, React.CSSProperties> = {
    Active: {
      background: "#ECFDF5",
      color: "#047857",
      border: "1px solid #A7F3D0",
    },
    Invited: {
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #BFDBFE",
    },
    Suspended: {
      background: "#FFF1F2",
      color: "#BE123C",
      border: "1px solid #FECDD3",
    },
    Inactive: {
      background: "#F1F5F9",
      color: "#475569",
      border: "1px solid #CBD5E1",
    },
  };

  return (
    <span style={{ ...styles.statusBadge, ...styleMap[status] }}>
      {status}
    </span>
  );
}

function AccessBadge({ accessLevel }: { accessLevel: UserAccessLevel }) {
  const styleMap: Record<UserAccessLevel, React.CSSProperties> = {
    Full: {
      background: "#ECFDF5",
      color: "#047857",
      border: "1px solid #A7F3D0",
    },
    Restricted: {
      background: "#FFFBEB",
      color: "#B45309",
      border: "1px solid #FDE68A",
    },
    "Read Only": {
      background: "#EEF2FF",
      color: "#4338CA",
      border: "1px solid #C7D2FE",
    },
  };

  return (
    <span style={{ ...styles.accessBadge, ...styleMap[accessLevel] }}>
      {accessLevel}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
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

function formatRelative(value: string) {
  const date = new Date(value).getTime();
  if (!date) return "No recent activity";

  const diffMs = Date.now() - date;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDate(value);
}

function readUsersFromStorage(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsersToStorage(users: UserRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
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
    maxWidth: 380,
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
  selectionBar: {
    marginTop: 16,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  selectionText: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  clearSelectionButton: {
    border: "none",
    background: "transparent",
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
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
    minWidth: 1200,
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
  checkboxTh: {
    background: "#F8FAFC",
    padding: "16px 14px",
    borderBottom: "1px solid #E2E8F0",
    width: 54,
    textAlign: "center",
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
  },
  rowSelected: {
    background: "#F8FAFC",
  },
  td: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    cursor: "pointer",
  },
  tdCenter: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    textAlign: "center",
    position: "relative",
  },
  checkboxTd: {
    padding: "16px 14px",
    borderBottom: "1px solid #EEF2F7",
    verticalAlign: "middle",
    textAlign: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    cursor: "pointer",
  },
  userCell: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    minWidth: 0,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 14,
    objectFit: "cover",
    flexShrink: 0,
  },
  avatarFallback: {
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
  userTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
  },
  userMeta: {
    fontSize: 13,
    lineHeight: 1.5,
    color: "#475569",
  },
  userSubMeta: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },
  systemBadge: {
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
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    background: "#F8FAFC",
    color: "#0F172A",
    border: "1px solid #CBD5E1",
    fontSize: 12,
    fontWeight: 800,
  },
  departmentText: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 86,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  accessBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 92,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
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
  skeletonCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    background: "#E2E8F0",
    margin: "0 auto",
  },
  skeletonUserRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "#E2E8F0",
  },
  skeletonBlockLarge: {
    width: 190,
    maxWidth: "100%",
    height: 16,
    borderRadius: 8,
    background: "#E2E8F0",
    marginBottom: 10,
  },
  skeletonBlockSmall: {
    width: 120,
    maxWidth: "100%",
    height: 12,
    borderRadius: 8,
    background: "#E2E8F0",
  },
  skeletonPill: {
    width: 84,
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