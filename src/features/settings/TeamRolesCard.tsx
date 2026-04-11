import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Invited" | "Inactive";
  lastActive: string;
};

type SortField = "name" | "role" | "lastActive";
type SortDirection = "asc" | "desc";

type TeamRolesCardProps = {
  mode?: ThemeMode;
  members: TeamMember[];
  onInviteUser?: () => void;
  onOpenRolesPermissions?: () => void;
  onEditMember?: (member: TeamMember) => void;
  onDeactivateMember?: (member: TeamMember) => void;
  onResendInvite?: (member: TeamMember) => void;
  onBulkDeactivateMembers?: (members: TeamMember[]) => void;
  onBulkResendInvites?: (members: TeamMember[]) => void;
};

const ALL_STATUSES = "All Statuses";
const ALL_ROLES = "All Roles";

export default function TeamRolesCard({
  mode = "light",
  members,
  onInviteUser,
  onOpenRolesPermissions,
  onEditMember,
  onDeactivateMember,
  onResendInvite,
  onBulkDeactivateMembers,
  onBulkResendInvites,
}: TeamRolesCardProps) {
  const theme = getTheme(mode);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES);
  const [roleFilter, setRoleFilter] = useState<string>(ALL_ROLES);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activeCount = members.filter((member) => member.status === "Active").length;
  const invitedCount = members.filter((member) => member.status === "Invited").length;
  const inactiveCount = members.filter((member) => member.status === "Inactive").length;

  const uniqueRoles = useMemo(() => {
    return Array.from(new Set(members.map((member) => member.role))).sort();
  }, [members]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        query.length === 0 ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query) ||
        member.id.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === ALL_STATUSES || member.status === statusFilter;

      const matchesRole =
        roleFilter === ALL_ROLES || member.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [members, search, statusFilter, roleFilter]);

  const sortedMembers = useMemo(() => {
    const sorted = [...filteredMembers];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "role") {
        comparison = a.role.localeCompare(b.role);
      } else if (sortField === "lastActive") {
        comparison = a.lastActive.localeCompare(b.lastActive);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredMembers, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedMembers.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMembers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * rowsPerPage;
    return sortedMembers.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedMembers, safeCurrentPage, rowsPerPage]);

  const selectedMembers = useMemo(() => {
    return members.filter((member) => selectedIds.includes(member.id));
  }, [members, selectedIds]);

  const selectedInvitedMembers = useMemo(() => {
    return selectedMembers.filter((member) => member.status === "Invited");
  }, [selectedMembers]);

  const selectedNonInvitedMembers = useMemo(() => {
    return selectedMembers.filter((member) => member.status !== "Invited");
  }, [selectedMembers]);

  const currentPageIds = paginatedMembers.map((member) => member.id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 &&
    currentPageIds.every((id) => selectedIds.includes(id));

  const startRow = sortedMembers.length === 0 ? 0 : (safeCurrentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(safeCurrentPage * rowsPerPage, sortedMembers.length);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => members.some((m) => m.id === id)));
  }, [members]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter(ALL_STATUSES);
    setRoleFilter(ALL_ROLES);
    setRowsPerPage(5);
    setCurrentPage(1);
    setSortField("name");
    setSortDirection("asc");
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleRowsChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  };

  const handleToggleSelectMember = (memberId: string) => {
    setSelectedIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleToggleSelectAllCurrentPage = () => {
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: theme.text,
          }}
        >
          Team & Roles
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.6,
            color: theme.subText,
          }}
        >
          Manage workspace members, invitations, roles, departments, access visibility, and bulk team actions.
        </div>
      </div>

      <div style={statsGridStyle}>
        <InfoCard title="Total Members" value={String(members.length)} theme={theme} />
        <InfoCard title="Active Users" value={String(activeCount)} theme={theme} />
        <InfoCard title="Pending Invites" value={String(invitedCount)} theme={theme} />
        <InfoCard title="Inactive Users" value={String(inactiveCount)} theme={theme} />
      </div>

      <div style={toolbarStyle}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: theme.text,
            }}
          >
            Team Directory
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.subText,
            }}
          >
            View, sort, filter, and manage all users in your workspace.
          </div>
        </div>

        <div style={actionsRowStyle}>
          <button
            type="button"
            onClick={onInviteUser}
            style={primaryButtonStyle(theme)}
          >
            Invite New User
          </button>

          <button
            type="button"
            onClick={onOpenRolesPermissions}
            style={secondaryButtonStyle(theme)}
          >
            Roles & Permissions
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 16,
          border: `1px solid ${theme.border}`,
          background: theme.cardBgSoft,
        }}
      >
        <div style={filtersGridStyle}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Search</label>
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name, email, role, department..."
              style={inputStyle(theme, mode)}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={selectStyle(theme, mode)}
            >
              {[ALL_STATUSES, "Active", "Invited", "Inactive"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Role</label>
            <select
              value={roleFilter}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={selectStyle(theme, mode)}
            >
              {[ALL_ROLES, ...uniqueRoles].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Rows Per Page</label>
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsChange(Number(e.target.value))}
              style={selectStyle(theme, mode)}
            >
              {[5, 10, 15, 20].map((option) => (
                <option key={option} value={option}>
                  {option} rows
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={filtersFooterStyle}>
          <div
            style={{
              fontSize: 13,
              color: theme.subText,
            }}
          >
            Showing <strong style={{ color: theme.text }}>{sortedMembers.length}</strong> matching member
            {sortedMembers.length === 1 ? "" : "s"}.
          </div>

          <button
            type="button"
            onClick={handleClearFilters}
            style={secondaryButtonStyle(theme)}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 16,
          border: `1px solid ${theme.border}`,
          background: theme.cardBgSoft,
        }}
      >
        <div style={bulkToolbarStyle}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Sort By</label>
            <div style={sortButtonsWrapStyle}>
              <button
                type="button"
                onClick={() => handleSortChange("name")}
                style={sortButtonStyle(theme, sortField === "name")}
              >
                Name {getSortArrow("name", sortField, sortDirection)}
              </button>
              <button
                type="button"
                onClick={() => handleSortChange("role")}
                style={sortButtonStyle(theme, sortField === "role")}
              >
                Role {getSortArrow("role", sortField, sortDirection)}
              </button>
              <button
                type="button"
                onClick={() => handleSortChange("lastActive")}
                style={sortButtonStyle(theme, sortField === "lastActive")}
              >
                Last Active {getSortArrow("lastActive", sortField, sortDirection)}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={fieldLabelStyle(theme)}>Bulk Actions</label>
            <div style={bulkActionsWrapStyle}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${theme.border}`,
                  background: theme.cardBg,
                }}
              >
                {selectedIds.length} selected
              </div>

              <button
                type="button"
                onClick={() => onBulkDeactivateMembers?.(selectedNonInvitedMembers)}
                disabled={selectedNonInvitedMembers.length === 0}
                style={bulkButtonStyle(theme, selectedNonInvitedMembers.length === 0)}
              >
                Bulk Deactivate
              </button>

              <button
                type="button"
                onClick={() => onBulkResendInvites?.(selectedInvitedMembers)}
                disabled={selectedInvitedMembers.length === 0}
                style={bulkButtonStyle(theme, selectedInvitedMembers.length === 0)}
              >
                Bulk Resend Invite
              </button>

              <button
                type="button"
                onClick={handleClearSelection}
                disabled={selectedIds.length === 0}
                style={bulkButtonStyle(theme, selectedIds.length === 0)}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          overflowX: "auto",
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 1060,
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              background: theme.tableHeadBg,
            }}
          >
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "14px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  color: theme.subText,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  borderBottom: `1px solid ${theme.border}`,
                  whiteSpace: "nowrap",
                  width: 50,
                }}
              >
                <input
                  type="checkbox"
                  checked={allCurrentPageSelected}
                  onChange={handleToggleSelectAllCurrentPage}
                  style={{ cursor: "pointer" }}
                />
              </th>

              {[
                "Name",
                "Email",
                "Role",
                "Department",
                "Status",
                "Last Active",
                "Actions",
              ].map((column) => (
                <th
                  key={column}
                  style={{
                    textAlign: "left",
                    padding: "14px 16px",
                    fontSize: 12,
                    fontWeight: 800,
                    color: theme.subText,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    borderBottom: `1px solid ${theme.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => {
                const isSelected = selectedIds.includes(member.id);

                return (
                  <tr
                    key={member.id}
                    style={{
                      background: isSelected ? theme.cardBgSoft : theme.rowBg,
                    }}
                  >
                    <td style={cellStyle(theme)}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectMember(member.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>

                    <td style={cellStyle(theme)}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: "50%",
                            background: theme.cardBgSoft,
                            border: `1px solid ${theme.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            fontWeight: 800,
                            color: theme.text,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(member.name)}
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: theme.text,
                            }}
                          >
                            {member.name}
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 12,
                              color: theme.subText,
                            }}
                          >
                            ID: {member.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={cellStyle(theme)}>{member.email}</td>

                    <td style={cellStyle(theme)}>
                      <RoleBadge role={member.role} theme={theme} />
                    </td>

                    <td style={cellStyle(theme)}>{member.department}</td>

                    <td style={cellStyle(theme)}>
                      <StatusBadge
                        label={member.status}
                        tone={
                          member.status === "Active"
                            ? "success"
                            : member.status === "Invited"
                            ? "warning"
                            : "danger"
                        }
                        theme={theme}
                      />
                    </td>

                    <td style={cellStyle(theme)}>{member.lastActive}</td>

                    <td style={cellStyle(theme)}>
                      <div style={rowActionsStyle}>
                        <button
                          type="button"
                          onClick={() => onEditMember?.(member)}
                          style={miniButtonStyle(theme)}
                        >
                          Edit
                        </button>

                        {member.status === "Invited" ? (
                          <button
                            type="button"
                            onClick={() => onResendInvite?.(member)}
                            style={miniButtonStyle(theme)}
                          >
                            Resend Invite
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDeactivateMember?.(member)}
                            style={miniDangerButtonStyle()}
                          >
                            {member.status === "Inactive" ? "Disabled" : "Deactivate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    fontSize: 14,
                    color: theme.subText,
                    background: theme.rowBg,
                  }}
                >
                  No members matched your search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={paginationBarStyle}>
        <div
          style={{
            fontSize: 13,
            color: theme.subText,
          }}
        >
          Showing <strong style={{ color: theme.text }}>{startRow}</strong> to{" "}
          <strong style={{ color: theme.text }}>{endRow}</strong> of{" "}
          <strong style={{ color: theme.text }}>{sortedMembers.length}</strong> results
        </div>

        <div style={paginationActionsStyle}>
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={safeCurrentPage === 1}
            style={paginationButtonStyle(theme, safeCurrentPage === 1)}
          >
            Previous
          </button>

          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: theme.text,
              minWidth: 80,
              textAlign: "center",
            }}
          >
            Page {safeCurrentPage} / {totalPages}
          </div>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={safeCurrentPage === totalPages}
            style={paginationButtonStyle(theme, safeCurrentPage === totalPages)}
          >
            Next
          </button>
        </div>
      </div>

      {members.length === 0 && (
        <div
          style={{
            marginTop: 16,
            padding: 18,
            borderRadius: 16,
            border: `1px dashed ${theme.border}`,
            background: theme.cardBgSoft,
            color: theme.subText,
            fontSize: 13,
            textAlign: "center",
          }}
        >
          Start by inviting your first team member to collaborate inside the workspace.
        </div>
      )}
    </div>
  );
}

function InfoCard({
  title,
  value,
  theme,
}: {
  title: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: theme.cardBgSoft,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: theme.subText,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 20,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
  theme,
}: {
  label: string;
  tone: "success" | "warning" | "danger";
  theme: ReturnType<typeof getTheme>;
}) {
  const toneMap = {
    success: {
      bg: "rgba(34, 197, 94, 0.14)",
      color: theme.success,
      border: "rgba(34, 197, 94, 0.30)",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.14)",
      color: theme.warning,
      border: "rgba(245, 158, 11, 0.30)",
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.14)",
      color: "#EF4444",
      border: "rgba(239, 68, 68, 0.30)",
    },
  } as const;

  const selected = toneMap[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: selected.bg,
        color: selected.color,
        border: `1px solid ${selected.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function RoleBadge({
  role,
  theme,
}: {
  role: string;
  theme: ReturnType<typeof getTheme>;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: theme.cardBgSoft,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
  marginTop: 18,
  marginBottom: 18,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const filtersGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const filtersFooterStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 16,
};

const bulkToolbarStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const bulkActionsWrapStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const sortButtonsWrapStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const rowActionsStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const paginationBarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 18,
};

const paginationActionsStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

function fieldLabelStyle(theme: ReturnType<typeof getTheme>): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    color: theme.subText,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  };
}

function cellStyle(theme: ReturnType<typeof getTheme>): CSSProperties {
  return {
    padding: "14px 16px",
    fontSize: 14,
    color: theme.text,
    borderBottom: `1px solid ${theme.borderSoft}`,
    verticalAlign: "middle",
  };
}

function inputStyle(
  theme: ReturnType<typeof getTheme>,
  mode: ThemeMode
): CSSProperties {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    outline: "none",
    background: theme.inputBg,
    color: theme.text,
    fontSize: 14,
    boxSizing: "border-box",
    boxShadow:
      mode === "dark"
        ? "inset 0 1px 0 rgba(255,255,255,0.02)"
        : "inset 0 1px 0 rgba(255,255,255,0.6)",
  };
}

function selectStyle(
  theme: ReturnType<typeof getTheme>,
  mode: ThemeMode
): CSSProperties {
  return inputStyle(theme, mode);
}

function primaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: "none",
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.primary,
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function secondaryButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "11px 16px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function miniButtonStyle(
  theme: ReturnType<typeof getTheme>
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "8px 10px",
    background: theme.cardBgSoft,
    color: theme.text,
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function miniDangerButtonStyle(): CSSProperties {
  return {
    border: "none",
    borderRadius: 10,
    padding: "8px 10px",
    background: "rgba(239, 68, 68, 0.12)",
    color: "#DC2626",
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function bulkButtonStyle(
  theme: ReturnType<typeof getTheme>,
  disabled: boolean
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    background: disabled ? theme.cardBgSoft : theme.cardBg,
    color: disabled ? theme.subText : theme.text,
    fontWeight: 700,
    fontSize: 13,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    whiteSpace: "nowrap",
  };
}

function sortButtonStyle(
  theme: ReturnType<typeof getTheme>,
  active: boolean
): CSSProperties {
  return {
    border: `1px solid ${active ? theme.primary : theme.border}`,
    borderRadius: 10,
    padding: "10px 12px",
    background: active ? theme.navActiveBg : theme.cardBg,
    color: active ? theme.navActiveText : theme.text,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function paginationButtonStyle(
  theme: ReturnType<typeof getTheme>,
  disabled: boolean
): CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    borderRadius: 10,
    padding: "9px 12px",
    background: disabled ? theme.cardBgSoft : theme.cardBg,
    color: disabled ? theme.subText : theme.text,
    fontWeight: 700,
    fontSize: 13,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
    whiteSpace: "nowrap",
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getSortArrow(
  field: SortField,
  activeField: SortField,
  direction: SortDirection
): string {
  if (field !== activeField) return "↕";
  return direction === "asc" ? "↑" : "↓";
}