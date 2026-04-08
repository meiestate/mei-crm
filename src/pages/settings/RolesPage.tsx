import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type RolesPageProps = {
  mode: ThemeMode;
  onToggleTheme?: () => void;
};

type RoleStatus = "Active" | "Inactive";
type AccessLevel = "Super Admin" | "Admin" | "Manager" | "Staff" | "Custom";

type Role = {
  id: string;
  name: string;
  description: string;
  accessLevel: AccessLevel;
  status: RoleStatus;
  userCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

const ROLE_STORAGE_KEY = "mei-crm-roles";

const availablePermissions = [
  "Dashboard View",
  "Leads View",
  "Leads Create",
  "Leads Edit",
  "Leads Delete",
  "Contacts View",
  "Contacts Create",
  "Contacts Edit",
  "Deals View",
  "Deals Create",
  "Deals Edit",
  "Tasks View",
  "Tasks Create",
  "Tasks Edit",
  "Call Logs View",
  "Call Logs Create",
  "Reports View",
  "Reports Export",
  "Billing View",
  "Settings Manage",
  "Users Manage",
  "Roles Manage",
];

const defaultRoles: Role[] = [
  {
    id: "ROLE-1001",
    name: "Super Admin",
    description: "Full control over CRM, billing, users, roles, and system settings.",
    accessLevel: "Super Admin",
    status: "Active",
    userCount: 1,
    permissions: [...availablePermissions],
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-04-08T08:30:00.000Z",
  },
  {
    id: "ROLE-1002",
    name: "Sales Admin",
    description: "Manages sales team, leads, deals, and performance operations.",
    accessLevel: "Admin",
    status: "Active",
    userCount: 3,
    permissions: [
      "Dashboard View",
      "Leads View",
      "Leads Create",
      "Leads Edit",
      "Contacts View",
      "Contacts Create",
      "Contacts Edit",
      "Deals View",
      "Deals Create",
      "Deals Edit",
      "Tasks View",
      "Tasks Create",
      "Tasks Edit",
      "Call Logs View",
      "Reports View",
      "Reports Export",
      "Users Manage",
    ],
    createdAt: "2026-03-05T12:15:00.000Z",
    updatedAt: "2026-04-07T11:20:00.000Z",
  },
  {
    id: "ROLE-1003",
    name: "Team Manager",
    description: "Handles daily team workflow, lead updates, and task tracking.",
    accessLevel: "Manager",
    status: "Active",
    userCount: 5,
    permissions: [
      "Dashboard View",
      "Leads View",
      "Leads Create",
      "Leads Edit",
      "Contacts View",
      "Contacts Create",
      "Deals View",
      "Deals Edit",
      "Tasks View",
      "Tasks Create",
      "Tasks Edit",
      "Call Logs View",
      "Reports View",
    ],
    createdAt: "2026-03-08T09:00:00.000Z",
    updatedAt: "2026-04-06T15:45:00.000Z",
  },
  {
    id: "ROLE-1004",
    name: "Telecaller",
    description: "Focused on lead follow-up, contact updates, and call activity logging.",
    accessLevel: "Staff",
    status: "Active",
    userCount: 8,
    permissions: [
      "Dashboard View",
      "Leads View",
      "Leads Create",
      "Leads Edit",
      "Contacts View",
      "Contacts Create",
      "Tasks View",
      "Tasks Create",
      "Call Logs View",
      "Call Logs Create",
    ],
    createdAt: "2026-03-10T14:30:00.000Z",
    updatedAt: "2026-04-05T09:10:00.000Z",
  },
  {
    id: "ROLE-1005",
    name: "Observer",
    description: "Read-only role for leadership review and monitoring.",
    accessLevel: "Custom",
    status: "Inactive",
    userCount: 2,
    permissions: ["Dashboard View", "Leads View", "Contacts View", "Deals View", "Reports View"],
    createdAt: "2026-03-12T16:00:00.000Z",
    updatedAt: "2026-04-02T13:40:00.000Z",
  },
];

const createEmptyRole = (): Role => ({
  id: `ROLE-${Date.now()}`,
  name: "",
  description: "",
  accessLevel: "Custom",
  status: "Active",
  userCount: 0,
  permissions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const formatDate = (value: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAccessBadgeColor = (accessLevel: AccessLevel) => {
  switch (accessLevel) {
    case "Super Admin":
      return "#7c3aed";
    case "Admin":
      return "#2563eb";
    case "Manager":
      return "#f59e0b";
    case "Staff":
      return "#10b981";
    case "Custom":
      return "#64748b";
    default:
      return "#64748b";
  }
};

export default function RolesPage({
  mode,
  onToggleTheme,
}: RolesPageProps) {
  const theme = getTheme(mode);

  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | RoleStatus>("All");
  const [permissionFilter, setPermissionFilter] = useState("All Permissions");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Role>(createEmptyRole());

  useEffect(() => {
    const storedRoles = localStorage.getItem(ROLE_STORAGE_KEY);

    if (storedRoles) {
      try {
        setRoles(JSON.parse(storedRoles));
      } catch {
        setRoles(defaultRoles);
      }
    } else {
      localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(defaultRoles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(roles));
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        role.name.toLowerCase().includes(keyword) ||
        role.description.toLowerCase().includes(keyword) ||
        role.accessLevel.toLowerCase().includes(keyword);

      const matchStatus =
        statusFilter === "All" || role.status === statusFilter;

      const matchPermission =
        permissionFilter === "All Permissions" ||
        role.permissions.includes(permissionFilter);

      return matchSearch && matchStatus && matchPermission;
    });
  }, [roles, search, statusFilter, permissionFilter]);

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) || filteredRoles[0] || null;

  const stats = useMemo(() => {
    const activeRoles = roles.filter((role) => role.status === "Active");
    const inactiveRoles = roles.filter((role) => role.status === "Inactive");
    const totalUsersCovered = roles.reduce((sum, role) => sum + role.userCount, 0);
    const avgPermissions =
      roles.length > 0
        ? Math.round(
            roles.reduce((sum, role) => sum + role.permissions.length, 0) / roles.length
          )
        : 0;

    return {
      totalRoles: roles.length,
      activeRoles: activeRoles.length,
      inactiveRoles: inactiveRoles.length,
      totalUsersCovered,
      avgPermissions,
    };
  }, [roles]);

  const openAddModal = () => {
    setFormData(createEmptyRole());
    setEditingRole(null);
    setShowAddModal(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData(role);
    setShowAddModal(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingRole(null);
    setFormData(createEmptyRole());
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((item) => item !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSaveRole = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    const payload: Role = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (editingRole) {
      setRoles((prev) =>
        prev.map((role) => (role.id === editingRole.id ? payload : role))
      );
      setSelectedRoleId(editingRole.id);
    } else {
      const newRole = {
        ...payload,
        id: `ROLE-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setRoles((prev) => [newRole, ...prev]);
      setSelectedRoleId(newRole.id);
    }

    closeModal();
  };

  const handleDeleteRole = (roleId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this role?");
    if (!confirmed) return;

    setRoles((prev) => prev.filter((role) => role.id !== roleId));

    if (selectedRoleId === roleId) {
      setSelectedRoleId(null);
    }
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    subText: string,
    icon: string
  ) => (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        boxShadow:
          mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.24)"
            : "0 10px 24px rgba(15,23,42,0.06)",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontSize: 13,
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: theme.text,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.mutedText,
        }}
      >
        {subText}
      </div>
    </div>
  );

  return (
    <AppLayout title="Roles" mode={mode} onToggleTheme={onToggleTheme}>
      <div
        style={{
          padding: 24,
          background: theme.pageBg,
          minHeight: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Roles & Permissions
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: theme.subText,
                fontSize: 14,
              }}
            >
              Control access with structured roles, permission visibility, and user coverage.
            </p>
          </div>

          <button
            onClick={openAddModal}
            style={{
              border: "none",
              background: theme.primary,
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(59,130,246,0.24)",
            }}
          >
            + Add Role
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {renderStatCard(
            "Total Roles",
            stats.totalRoles,
            `${stats.activeRoles} active / ${stats.inactiveRoles} inactive`,
            "🛡️"
          )}
          {renderStatCard(
            "Users Covered",
            stats.totalUsersCovered,
            "Users assigned across all roles",
            "👥"
          )}
          {renderStatCard(
            "Average Permissions",
            stats.avgPermissions,
            "Average access width per role",
            "🔐"
          )}
          {renderStatCard(
            "Active Roles",
            stats.activeRoles,
            "Currently available for assignment",
            "⚡"
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 220px 260px auto",
            gap: 12,
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role name, description, access level"
            style={inputStyle(theme)}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | RoleStatus)
            }
            style={inputStyle(theme)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={permissionFilter}
            onChange={(e) => setPermissionFilter(e.target.value)}
            style={inputStyle(theme)}
          >
            <option value="All Permissions">All Permissions</option>
            {availablePermissions.map((permission) => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setPermissionFilter("All Permissions");
            }}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              padding: "12px 16px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow:
                mode === "dark"
                  ? "0 10px 30px rgba(0,0,0,0.24)"
                  : "0 10px 24px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: `1px solid ${theme.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: theme.text,
                  }}
                >
                  Role Directory
                </h3>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13,
                    color: theme.subText,
                  }}
                >
                  Professional access structure for your CRM team.
                </p>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: theme.subText,
                  background: theme.cardBgSoft,
                  padding: "8px 12px",
                  borderRadius: 999,
                }}
              >
                {filteredRoles.length} roles
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ background: theme.tableHeadBg }}>
                    {["Role", "Access", "Users", "Permissions", "Status", "Actions"].map(
                      (head) => (
                        <th
                          key={head}
                          style={{
                            textAlign: "left",
                            padding: "14px 16px",
                            fontSize: 12,
                            color: theme.subText,
                            borderBottom: `1px solid ${theme.border}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 28,
                          textAlign: "center",
                          color: theme.mutedText,
                        }}
                      >
                        No roles found.
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role) => (
                      <tr
                        key={role.id}
                        onClick={() => setSelectedRoleId(role.id)}
                        style={{
                          background:
                            selectedRole?.id === role.id
                              ? theme.cardBgSoft
                              : theme.rowBg,
                          cursor: "pointer",
                          transition: "0.2s ease",
                        }}
                      >
                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 800,
                              color: theme.text,
                              marginBottom: 4,
                            }}
                          >
                            {role.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: theme.subText,
                              lineHeight: 1.5,
                              maxWidth: 240,
                            }}
                          >
                            {role.description}
                          </div>
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              background: `${getAccessBadgeColor(role.accessLevel)}18`,
                              color: getAccessBadgeColor(role.accessLevel),
                              border: `1px solid ${getAccessBadgeColor(role.accessLevel)}33`,
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {role.accessLevel}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            color: theme.text,
                            fontSize: 13,
                            fontWeight: 700,
                            verticalAlign: "top",
                          }}
                        >
                          {role.userCount}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            color: theme.subText,
                            fontSize: 13,
                            verticalAlign: "top",
                          }}
                        >
                          {role.permissions.length}
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "6px 10px",
                              borderRadius: 999,
                              background:
                                role.status === "Active"
                                  ? "rgba(16,185,129,0.14)"
                                  : "rgba(239,68,68,0.14)",
                              color:
                                role.status === "Active" ? "#10b981" : "#ef4444",
                              border:
                                role.status === "Active"
                                  ? "1px solid rgba(16,185,129,0.25)"
                                  : "1px solid rgba(239,68,68,0.25)",
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {role.status}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.borderSoft}`,
                            verticalAlign: "top",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() => openEditModal(role)}
                              style={miniButton(theme)}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              style={{
                                ...miniButton(theme),
                                color: "#ef4444",
                                background: "transparent",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: 24,
              padding: 20,
              boxShadow:
                mode === "dark"
                  ? "0 10px 30px rgba(0,0,0,0.24)"
                  : "0 10px 24px rgba(15,23,42,0.06)",
              position: "sticky",
              top: 20,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: theme.text,
                marginBottom: 8,
              }}
            >
              Permission Preview
            </h3>

            {selectedRole ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: theme.text,
                        marginBottom: 4,
                      }}
                    >
                      {selectedRole.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: theme.subText,
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedRole.description}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  <InfoTile
                    theme={theme}
                    label="Access Level"
                    value={selectedRole.accessLevel}
                  />
                  <InfoTile
                    theme={theme}
                    label="Users Assigned"
                    value={String(selectedRole.userCount)}
                  />
                  <InfoTile
                    theme={theme}
                    label="Status"
                    value={selectedRole.status}
                  />
                  <InfoTile
                    theme={theme}
                    label="Created"
                    value={formatDate(selectedRole.createdAt)}
                  />
                </div>

                <div
                  style={{
                    marginBottom: 10,
                    fontSize: 13,
                    color: theme.subText,
                    fontWeight: 700,
                  }}
                >
                  Included Permissions ({selectedRole.permissions.length})
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {selectedRole.permissions.map((permission) => (
                    <span
                      key={permission}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 999,
                        background: theme.cardBgSoft,
                        border: `1px solid ${theme.border}`,
                        color: theme.text,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  color: theme.mutedText,
                  fontSize: 14,
                }}
              >
                Select a role to preview permissions.
              </div>
            )}
          </div>
        </div>

        {(showAddModal || editingRole) && (
          <div
            onClick={closeModal}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15,23,42,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 900,
                maxHeight: "90vh",
                overflowY: "auto",
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                borderRadius: 24,
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 24,
                      fontWeight: 800,
                      color: theme.text,
                    }}
                  >
                    {editingRole ? "Edit Role" : "Add New Role"}
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: theme.subText,
                      fontSize: 13,
                    }}
                  >
                    Build controlled access with enterprise-ready permission mapping.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBgSoft,
                    color: theme.text,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Role Name"
                  style={inputStyle(theme)}
                />

                <select
                  value={formData.accessLevel}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accessLevel: e.target.value as AccessLevel,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Staff">Staff</option>
                  <option value="Custom">Custom</option>
                </select>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Role Description"
                  rows={4}
                  style={{
                    ...inputStyle(theme),
                    gridColumn: "1 / -1",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />

                <input
                  type="number"
                  min={0}
                  value={formData.userCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userCount: Number(e.target.value),
                    }))
                  }
                  placeholder="Assigned User Count"
                  style={inputStyle(theme)}
                />

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as RoleStatus,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 16,
                  background: theme.pageBg,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: theme.text,
                    marginBottom: 6,
                  }}
                >
                  Role Permissions
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    marginBottom: 16,
                  }}
                >
                  Select the exact modules and actions this role can access.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {availablePermissions.map((permission) => {
                    const checked = formData.permissions.includes(permission);

                    return (
                      <label
                        key={permission}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 14px",
                          borderRadius: 14,
                          border: `1px solid ${
                            checked ? theme.primary : theme.border
                          }`,
                          background: checked ? `${theme.primary}12` : theme.cardBg,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(permission)}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: theme.text,
                            fontWeight: 600,
                          }}
                        >
                          {permission}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBgSoft,
                    color: theme.text,
                    padding: "12px 16px",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSaveRole}
                  style={{
                    border: "none",
                    background: theme.primary,
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {editingRole ? "Update Role" : "Save Role"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function InfoTile({
  theme,
  label,
  value,
}: {
  theme: ReturnType<typeof getTheme>;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 16,
        border: `1px solid ${theme.border}`,
        background: theme.cardBgSoft,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: theme.subText,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function inputStyle(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    width: "100%",
    background: theme.inputBg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
  };
}

function miniButton(theme: ReturnType<typeof getTheme>): React.CSSProperties {
  return {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    padding: "8px 10px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}