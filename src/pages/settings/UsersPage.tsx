import { useEffect, useMemo, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type UsersPageProps = {
  mode: ThemeMode;
  onToggleTheme?: () => void;
};

type UserStatus = "Active" | "Inactive" | "Invited" | "Suspended";

type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: UserStatus;
  avatarColor: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
};

const USER_STORAGE_KEY = "mei-crm-users";

const roleOptions = [
  "Super Admin",
  "Sales Admin",
  "Team Manager",
  "Telecaller",
  "Sales Executive",
  "Support",
  "Observer",
];

const departmentOptions = [
  "Management",
  "Sales",
  "Operations",
  "Support",
  "Marketing",
  "Accounts",
  "Telecalling",
];

const avatarPalette = [
  "#2563eb",
  "#7c3aed",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#0ea5e9",
  "#14b8a6",
  "#64748b",
];

const defaultUsers: User[] = [
  {
    id: "USR-1001",
    fullName: "Balraj",
    email: "balraj@mei.com",
    phone: "9876543210",
    role: "Super Admin",
    department: "Management",
    status: "Active",
    avatarColor: "#7c3aed",
    lastActiveAt: "2026-04-08T10:15:00.000Z",
    createdAt: "2026-03-01T09:00:00.000Z",
    updatedAt: "2026-04-08T10:15:00.000Z",
  },
  {
    id: "USR-1002",
    fullName: "Priya Sharma",
    email: "priya@mei.com",
    phone: "9123456780",
    role: "Sales Admin",
    department: "Sales",
    status: "Active",
    avatarColor: "#2563eb",
    lastActiveAt: "2026-04-08T09:40:00.000Z",
    createdAt: "2026-03-04T10:30:00.000Z",
    updatedAt: "2026-04-08T09:40:00.000Z",
  },
  {
    id: "USR-1003",
    fullName: "Arun Kumar",
    email: "arun@mei.com",
    phone: "9444411111",
    role: "Team Manager",
    department: "Operations",
    status: "Active",
    avatarColor: "#10b981",
    lastActiveAt: "2026-04-07T18:10:00.000Z",
    createdAt: "2026-03-08T12:00:00.000Z",
    updatedAt: "2026-04-07T18:10:00.000Z",
  },
  {
    id: "USR-1004",
    fullName: "Divya R",
    email: "divya@mei.com",
    phone: "9555512345",
    role: "Telecaller",
    department: "Telecalling",
    status: "Invited",
    avatarColor: "#f59e0b",
    lastActiveAt: "",
    createdAt: "2026-03-12T15:20:00.000Z",
    updatedAt: "2026-03-12T15:20:00.000Z",
  },
  {
    id: "USR-1005",
    fullName: "Rahul S",
    email: "rahul@mei.com",
    phone: "9000011111",
    role: "Sales Executive",
    department: "Sales",
    status: "Inactive",
    avatarColor: "#ef4444",
    lastActiveAt: "2026-04-01T13:00:00.000Z",
    createdAt: "2026-03-15T11:15:00.000Z",
    updatedAt: "2026-04-01T13:00:00.000Z",
  },
  {
    id: "USR-1006",
    fullName: "Karthik M",
    email: "karthik@mei.com",
    phone: "9090909090",
    role: "Observer",
    department: "Management",
    status: "Suspended",
    avatarColor: "#64748b",
    lastActiveAt: "2026-03-28T08:45:00.000Z",
    createdAt: "2026-03-18T09:10:00.000Z",
    updatedAt: "2026-03-28T08:45:00.000Z",
  },
];

const createEmptyUser = (): User => ({
  id: `USR-${Date.now()}`,
  fullName: "",
  email: "",
  phone: "",
  role: "Sales Executive",
  department: "Sales",
  status: "Invited",
  avatarColor: avatarPalette[Math.floor(Math.random() * avatarPalette.length)],
  lastActiveAt: "",
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

const formatDateTime = (value: string) => {
  if (!value) return "Never active";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getStatusStyles = (status: UserStatus) => {
  switch (status) {
    case "Active":
      return {
        bg: "rgba(16,185,129,0.14)",
        color: "#10b981",
        border: "1px solid rgba(16,185,129,0.25)",
      };
    case "Inactive":
      return {
        bg: "rgba(148,163,184,0.14)",
        color: "#64748b",
        border: "1px solid rgba(148,163,184,0.25)",
      };
    case "Invited":
      return {
        bg: "rgba(59,130,246,0.14)",
        color: "#2563eb",
        border: "1px solid rgba(59,130,246,0.25)",
      };
    case "Suspended":
      return {
        bg: "rgba(239,68,68,0.14)",
        color: "#ef4444",
        border: "1px solid rgba(239,68,68,0.25)",
      };
    default:
      return {
        bg: "rgba(148,163,184,0.14)",
        color: "#64748b",
        border: "1px solid rgba(148,163,184,0.25)",
      };
  }
};

export default function UsersPage({
  mode,
  onToggleTheme,
}: UsersPageProps) {
  const theme = getTheme(mode);

  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<User>(createEmptyUser());

  useEffect(() => {
    const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch {
        setUsers(defaultUsers);
      }
    } else {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase();

    return users.filter((user) => {
      const matchSearch =
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.phone.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword) ||
        user.department.toLowerCase().includes(keyword);

      const matchRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const selectedUser =
    users.find((user) => user.id === selectedUserId) || filteredUsers[0] || null;

  const stats = useMemo(() => {
    const active = users.filter((user) => user.status === "Active").length;
    const invited = users.filter((user) => user.status === "Invited").length;
    const inactive = users.filter((user) => user.status === "Inactive").length;
    const suspended = users.filter((user) => user.status === "Suspended").length;

    const uniqueRoles = new Set(users.map((user) => user.role)).size;
    const uniqueDepartments = new Set(users.map((user) => user.department)).size;

    return {
      totalUsers: users.length,
      active,
      invited,
      inactive,
      suspended,
      uniqueRoles,
      uniqueDepartments,
    };
  }, [users]);

  const openAddModal = () => {
    setFormData(createEmptyUser());
    setEditingUser(null);
    setShowAddModal(true);
  };

  const openEditModal = (user: User) => {
    setFormData(user);
    setEditingUser(user);
    setShowAddModal(false);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setFormData(createEmptyUser());
  };

  const handleSaveUser = () => {
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    const payload: User = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? payload : user))
      );
      setSelectedUserId(editingUser.id);
    } else {
      const newUser: User = {
        ...payload,
        id: `USR-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      setSelectedUserId(newUser.id);
    }

    closeModal();
  };

  const handleDeleteUser = (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    if (selectedUserId === userId) {
      setSelectedUserId(null);
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
    <AppLayout title="Users" mode={mode} onToggleTheme={onToggleTheme}>
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
              User Management
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: theme.subText,
                fontSize: 14,
              }}
            >
              Manage your team, roles, access visibility, and user activity from one place.
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
            + Add User
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
            "Total Users",
            stats.totalUsers,
            `${stats.uniqueRoles} roles across ${stats.uniqueDepartments} departments`,
            "👥"
          )}
          {renderStatCard(
            "Active Users",
            stats.active,
            `${stats.invited} invited pending onboarding`,
            "⚡"
          )}
          {renderStatCard(
            "Inactive Users",
            stats.inactive,
            `${stats.suspended} suspended accounts`,
            "⏸️"
          )}
          {renderStatCard(
            "Departments",
            stats.uniqueDepartments,
            "Cross-functional team visibility",
            "🏢"
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 220px 220px auto",
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
            placeholder="Search name, email, phone, role, department"
            style={inputStyle(theme)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={inputStyle(theme)}
          >
            <option value="All Roles">All Roles</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | UserStatus)
            }
            style={inputStyle(theme)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Invited">Invited</option>
            <option value="Suspended">Suspended</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setRoleFilter("All Roles");
              setStatusFilter("All");
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
            gridTemplateColumns: "1.25fr 0.75fr",
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
                  User Directory
                </h3>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13,
                    color: theme.subText,
                  }}
                >
                  Professional internal user list with quick admin actions.
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
                {filteredUsers.length} users
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
                    {["User", "Role", "Department", "Status", "Last Active", "Actions"].map(
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: 28,
                          textAlign: "center",
                          color: theme.mutedText,
                        }}
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const statusStyle = getStatusStyles(user.status);

                      return (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUserId(user.id)}
                          style={{
                            background:
                              selectedUser?.id === user.id
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
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: "50%",
                                  background: user.avatarColor,
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  fontSize: 14,
                                  flexShrink: 0,
                                }}
                              >
                                {getInitials(user.fullName)}
                              </div>

                              <div>
                                <div
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: theme.text,
                                    marginBottom: 4,
                                  }}
                                >
                                  {user.fullName}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: theme.subText,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {user.email}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: theme.mutedText,
                                    marginTop: 2,
                                  }}
                                >
                                  {user.phone}
                                </div>
                              </div>
                            </div>
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
                            {user.role}
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
                            {user.department}
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
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                border: statusStyle.border,
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              {user.status}
                            </span>
                          </td>

                          <td
                            style={{
                              padding: "16px",
                              borderBottom: `1px solid ${theme.borderSoft}`,
                              color: theme.subText,
                              fontSize: 12,
                              verticalAlign: "top",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDateTime(user.lastActiveAt)}
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
                                onClick={() => openEditModal(user)}
                                style={miniButton(theme)}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
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
                      );
                    })
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
              User Preview
            </h3>

            {selectedUser ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      background: selectedUser.avatarColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(selectedUser.fullName)}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: theme.text,
                        marginBottom: 4,
                      }}
                    >
                      {selectedUser.fullName}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: theme.subText,
                        lineHeight: 1.5,
                      }}
                    >
                      {selectedUser.email}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.mutedText,
                        marginTop: 4,
                      }}
                    >
                      {selectedUser.phone}
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
                  <InfoTile theme={theme} label="Role" value={selectedUser.role} />
                  <InfoTile
                    theme={theme}
                    label="Department"
                    value={selectedUser.department}
                  />
                  <InfoTile
                    theme={theme}
                    label="Status"
                    value={selectedUser.status}
                  />
                  <InfoTile
                    theme={theme}
                    label="Created"
                    value={formatDate(selectedUser.createdAt)}
                  />
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: 16,
                    background: theme.cardBgSoft,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.subText,
                      marginBottom: 6,
                    }}
                  >
                    Last Active
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: theme.text,
                      marginBottom: 10,
                    }}
                  >
                    {formatDateTime(selectedUser.lastActiveAt)}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: theme.subText,
                      marginBottom: 6,
                    }}
                  >
                    User ID
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: theme.text,
                      fontWeight: 700,
                    }}
                  >
                    {selectedUser.id}
                  </div>
                </div>
              </>
            ) : (
              <div
                style={{
                  color: theme.mutedText,
                  fontSize: 14,
                }}
              >
                Select a user to preview details.
              </div>
            )}
          </div>
        </div>

        {(showAddModal || editingUser) && (
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
                maxWidth: 820,
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
                    {editingUser ? "Edit User" : "Add New User"}
                  </h2>
                  <p
                    style={{
                      margin: "8px 0 0",
                      color: theme.subText,
                      fontSize: 13,
                    }}
                  >
                    Create and manage internal CRM users with clean access structure.
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
                }}
              >
                <input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="Full Name"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email Address"
                  style={inputStyle(theme)}
                />

                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone Number"
                  style={inputStyle(theme)}
                />

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  style={inputStyle(theme)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as UserStatus,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Invited">Invited</option>
                  <option value="Suspended">Suspended</option>
                </select>

                <input
                  type="datetime-local"
                  value={toDateTimeLocalValue(formData.lastActiveAt)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastActiveAt: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                  style={inputStyle(theme)}
                />

                <select
                  value={formData.avatarColor}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      avatarColor: e.target.value,
                    }))
                  }
                  style={inputStyle(theme)}
                >
                  {avatarPalette.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    background: theme.cardBgSoft,
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: formData.avatarColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {getInitials(formData.fullName || "User")}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: theme.text,
                      }}
                    >
                      Avatar Preview
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.subText,
                        marginTop: 4,
                      }}
                    >
                      Initials avatar based on selected user name and color.
                    </div>
                  </div>
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
                  onClick={handleSaveUser}
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
                  {editingUser ? "Update User" : "Save User"}
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

function toDateTimeLocalValue(value: string) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}