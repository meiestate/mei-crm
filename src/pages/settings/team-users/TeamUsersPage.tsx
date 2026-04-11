import { useEffect, useMemo, useState, type CSSProperties } from "react";

type UserRole =
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Sales Executive"
  | "Telecaller"
  | "Support"
  | "Viewer";

type UserStatus = "Active" | "Inactive" | "Pending" | "Suspended";

type TeamUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  joinedAt: string;
  lastActive: string;
};

type SortKey = "name" | "role" | "status" | "department" | "joinedAt" | "lastActive";
type SortDirection = "asc" | "desc";

const STORAGE_KEY = "mei-crm-team-users";

const roleOptions: Array<UserRole | "All Roles"> = [
  "All Roles",
  "Super Admin",
  "Admin",
  "Manager",
  "Sales Executive",
  "Telecaller",
  "Support",
  "Viewer",
];

const statusOptions: Array<UserStatus | "All Status"> = [
  "All Status",
  "Active",
  "Inactive",
  "Pending",
  "Suspended",
];

const departmentOptions = [
  "All Departments",
  "Management",
  "Sales",
  "Field Sales",
  "Inside Sales",
  "Operations",
  "Support",
  "Accounts",
  "Marketing",
];

const seedUsers: TeamUser[] = [
  {
    id: "USR-1001",
    name: "Arun Kumar",
    email: "arun@mei.com",
    phone: "+91 9876543210",
    role: "Super Admin",
    department: "Management",
    status: "Active",
    joinedAt: "2026-01-05",
    lastActive: "2026-04-11 09:40",
  },
  {
    id: "USR-1002",
    name: "Priya Sharma",
    email: "priya@mei.com",
    phone: "+91 9876501234",
    role: "Manager",
    department: "Sales",
    status: "Active",
    joinedAt: "2026-01-14",
    lastActive: "2026-04-11 08:10",
  },
  {
    id: "USR-1003",
    name: "Rahul Verma",
    email: "rahul@mei.com",
    phone: "+91 9988776655",
    role: "Sales Executive",
    department: "Field Sales",
    status: "Pending",
    joinedAt: "2026-02-01",
    lastActive: "2026-04-10 18:45",
  },
  {
    id: "USR-1004",
    name: "Divya Nair",
    email: "divya@mei.com",
    phone: "+91 9345678912",
    role: "Telecaller",
    department: "Inside Sales",
    status: "Active",
    joinedAt: "2026-02-11",
    lastActive: "2026-04-11 11:20",
  },
  {
    id: "USR-1005",
    name: "Karthik Raj",
    email: "karthik@mei.com",
    phone: "+91 9000012345",
    role: "Support",
    department: "Operations",
    status: "Inactive",
    joinedAt: "2026-01-20",
    lastActive: "2026-04-08 16:00",
  },
  {
    id: "USR-1006",
    name: "Meena S",
    email: "meena@mei.com",
    phone: "+91 9555511110",
    role: "Viewer",
    department: "Accounts",
    status: "Suspended",
    joinedAt: "2026-03-02",
    lastActive: "2026-04-04 10:10",
  },
  {
    id: "USR-1007",
    name: "Sanjay R",
    email: "sanjay@mei.com",
    phone: "+91 9898989898",
    role: "Admin",
    department: "Operations",
    status: "Active",
    joinedAt: "2026-02-18",
    lastActive: "2026-04-11 10:30",
  },
  {
    id: "USR-1008",
    name: "Lavanya Devi",
    email: "lavanya@mei.com",
    phone: "+91 9123456789",
    role: "Sales Executive",
    department: "Sales",
    status: "Active",
    joinedAt: "2026-03-12",
    lastActive: "2026-04-10 14:20",
  },
];

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: 24,
};

const containerStyle: CSSProperties = {
  maxWidth: 1440,
  margin: "0 auto",
};

const cardStyle: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  padding: "0 14px",
  fontSize: 14,
  outline: "none",
  color: "#0f172a",
};

const selectStyle: CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
  color: "#0f172a",
};

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 700,
  color: "#334155",
};

const secondaryButtonStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 12,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

const primaryButtonStyle: CSSProperties = {
  border: "none",
  background: "#0f172a",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateText: string) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateText: string) {
  const date = new Date(dateText.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateText;

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoleBadgeStyle(role: UserRole): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };

  switch (role) {
    case "Super Admin":
      return { ...base, background: "#ede9fe", color: "#6d28d9", borderColor: "#ddd6fe" };
    case "Admin":
      return { ...base, background: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" };
    case "Manager":
      return { ...base, background: "#ecfccb", color: "#4d7c0f", borderColor: "#d9f99d" };
    case "Sales Executive":
      return { ...base, background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" };
    case "Telecaller":
      return { ...base, background: "#fce7f3", color: "#be185d", borderColor: "#fbcfe8" };
    case "Support":
      return { ...base, background: "#e0e7ff", color: "#4338ca", borderColor: "#c7d2fe" };
    default:
      return { ...base, background: "#f1f5f9", color: "#334155", borderColor: "#e2e8f0" };
  }
}

function getStatusBadgeStyle(status: UserStatus): CSSProperties {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };

  switch (status) {
    case "Active":
      return { ...base, background: "#ecfdf3", color: "#15803d", borderColor: "#bbf7d0" };
    case "Inactive":
      return { ...base, background: "#f1f5f9", color: "#64748b", borderColor: "#e2e8f0" };
    case "Pending":
      return { ...base, background: "#fff7ed", color: "#c2410c", borderColor: "#fed7aa" };
    case "Suspended":
      return { ...base, background: "#fef2f2", color: "#b91c1c", borderColor: "#fecaca" };
    default:
      return base;
  }
}

function getStatusDotColor(status: UserStatus) {
  switch (status) {
    case "Active":
      return "#22c55e";
    case "Pending":
      return "#f97316";
    case "Suspended":
      return "#ef4444";
    default:
      return "#94a3b8";
  }
}

function downloadCsv(users: TeamUser[], fileName: string) {
  const headers = [
    "User ID",
    "Name",
    "Email",
    "Phone",
    "Role",
    "Department",
    "Status",
    "Joined Date",
    "Last Active",
  ];

  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.phone,
    user.role,
    user.department,
    user.status,
    user.joinedAt,
    user.lastActive,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getNextUserId(users: TeamUser[]) {
  const max = users.reduce((acc, user) => {
    const num = Number(user.id.replace("USR-", ""));
    return Number.isFinite(num) ? Math.max(acc, num) : acc;
  }, 1000);

  return `USR-${String(max + 1)}`;
}

export default function TeamUsersPage() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "All Roles">("All Roles");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "All Status">("All Status");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Sales Executive" as UserRole,
    department: "Sales",
    status: "Pending" as UserStatus,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TeamUser[];
        setUsers(parsed);
        return;
      } catch {
        setUsers(seedUsers);
      }
    }

    setUsers(seedUsers);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  const editUser = useMemo(
    () => users.find((user) => user.id === editUserId) ?? null,
    [users, editUserId]
  );

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const pendingInvites = users.filter((u) => u.status === "Pending").length;
    const suspendedUsers = users.filter((u) => u.status === "Suspended").length;

    return {
      totalUsers,
      activeUsers,
      pendingInvites,
      suspendedUsers,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const query = searchTerm.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      const matchesRole =
        selectedRole === "All Roles" || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" || user.status === selectedStatus;

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        user.department === selectedDepartment;

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
    });

    const sorted = [...filtered].sort((a, b) => {
      const normalize = (value: string) => value.toLowerCase();

      let comparison = 0;

      if (sortKey === "joinedAt" || sortKey === "lastActive") {
        const aTime = new Date(a[sortKey].replace(" ", "T")).getTime();
        const bTime = new Date(b[sortKey].replace(" ", "T")).getTime();
        comparison = aTime - bTime;
      } else {
        comparison = normalize(a[sortKey]).localeCompare(normalize(b[sortKey]));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [users, searchTerm, selectedRole, selectedStatus, selectedDepartment, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, selectedDepartment, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const allVisibleSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every((user) => selectedIds.includes(user.id));

  const selectedUsers = users.filter((user) => selectedIds.includes(user.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedUsers.some((user) => user.id === id))
      );
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginatedUsers.forEach((user) => next.add(user.id));
      return Array.from(next);
    });
  }

  function toggleSingleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleBulkStatusUpdate(status: UserStatus) {
    if (selectedIds.length === 0) return;

    setUsers((prev) =>
      prev.map((user) =>
        selectedIds.includes(user.id) ? { ...user, status } : user
      )
    );
    setSelectedIds([]);
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected user(s)?`
    );

    if (!confirmed) return;

    setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
    setSelectedIds([]);
  }

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedRole("All Roles");
    setSelectedStatus("All Status");
    setSelectedDepartment("All Departments");
  }

  function handleInviteUser() {
    const name = inviteForm.name.trim();
    const email = inviteForm.email.trim().toLowerCase();

    if (!name || !email) {
      window.alert("Name and email are required.");
      return;
    }

    const duplicate = users.some((user) => user.email.toLowerCase() === email);

    if (duplicate) {
      window.alert("A user with this email already exists.");
      return;
    }

    const newUser: TeamUser = {
      id: getNextUserId(users),
      name,
      email,
      phone: inviteForm.phone.trim(),
      role: inviteForm.role,
      department: inviteForm.department.trim() || "Sales",
      status: inviteForm.status,
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: new Date().toISOString().slice(0, 16).replace("T", " "),
    };

    setUsers((prev) => [newUser, ...prev]);
    setInviteForm({
      name: "",
      email: "",
      phone: "",
      role: "Sales Executive",
      department: "Sales",
      status: "Pending",
    });
    setInviteModalOpen(false);
  }

  function handleEditUserSave() {
    if (!editUser) return;

    const duplicate = users.some(
      (user) =>
        user.id !== editUser.id &&
        user.email.toLowerCase() === editUser.email.toLowerCase()
    );

    if (duplicate) {
      window.alert("Another user already uses this email.");
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === editUser.id ? editUser : user))
    );
    setEditUserId(null);
  }

  function handleSingleDelete(userId: string) {
    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setSelectedIds((prev) => prev.filter((id) => id !== userId));
  }

  function handleSingleStatusChange(userId: string, status: UserStatus) {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status } : user))
    );
  }

  const fromEntry = filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toEntry = Math.min(currentPage * pageSize, filteredUsers.length);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ ...cardStyle, padding: 24, marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                Dashboard / Settings / Team & Users
              </div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Team / Users
              </h1>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "#64748b",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Manage team members, roles, permissions, access control, and workspace security from one place.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => downloadCsv(filteredUsers, "mei-team-users.csv")}
              >
                Export Users
              </button>

              <button
                type="button"
                style={primaryButtonStyle}
                onClick={() => setInviteModalOpen(true)}
              >
                + Invite User
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Users", value: stats.activeUsers },
            { label: "Pending Invites", value: stats.pendingInvites },
            { label: "Suspended Users", value: stats.suspendedUsers },
          ].map((card) => (
            <div key={card.label} style={{ ...cardStyle, padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>
                {card.label}
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginTop: 8,
                }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...cardStyle, padding: 18, marginBottom: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
              gap: 14,
              alignItems: "end",
            }}
          >
            <div>
              <label style={labelStyle}>Search User</label>
              <input
                type="text"
                placeholder="Search by name, email, phone, user ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | "All Roles")}
                style={selectStyle}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as UserStatus | "All Status")
                }
                style={selectStyle}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={selectStyle}
              >
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              style={{ ...secondaryButtonStyle, height: 44 }}
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div
            style={{
              ...cardStyle,
              padding: 14,
              marginBottom: 20,
              position: "sticky",
              top: 16,
              zIndex: 20,
              border: "1px solid #cbd5e1",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                {selectedIds.length} user(s) selected
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => handleBulkStatusUpdate("Active")}
                >
                  Activate
                </button>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => handleBulkStatusUpdate("Inactive")}
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() => handleBulkStatusUpdate("Suspended")}
                >
                  Suspend
                </button>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  onClick={() =>
                    downloadCsv(selectedUsers, "mei-selected-team-users.csv")
                  }
                >
                  Export Selected
                </button>
                <button
                  type="button"
                  style={{
                    ...secondaryButtonStyle,
                    borderColor: "#fecaca",
                    background: "#fff1f2",
                    color: "#b91c1c",
                  }}
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...cardStyle, padding: 18 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                User Directory
              </h2>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                Sort: {sortKey} ({sortDirection})
              </div>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                style={{ ...selectStyle, width: 120 }}
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
            </div>
          </div>

          <div
            style={{
              overflowX: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 1200,
                borderCollapse: "collapse",
                background: "#ffffff",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={tableHeadStyle}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                    />
                  </th>
                  <th style={tableHeadStyle}>User</th>
                  <th style={tableHeadStyle}>Contact</th>
                  <th style={sortableHeadStyle(sortKey, "role")} onClick={() => toggleSort("role")}>
                    Role
                  </th>
                  <th
                    style={sortableHeadStyle(sortKey, "department")}
                    onClick={() => toggleSort("department")}
                  >
                    Department
                  </th>
                  <th
                    style={sortableHeadStyle(sortKey, "status")}
                    onClick={() => toggleSort("status")}
                  >
                    Status
                  </th>
                  <th
                    style={sortableHeadStyle(sortKey, "joinedAt")}
                    onClick={() => toggleSort("joinedAt")}
                  >
                    Joined Date
                  </th>
                  <th
                    style={sortableHeadStyle(sortKey, "lastActive")}
                    onClick={() => toggleSort("lastActive")}
                  >
                    Last Active
                  </th>
                  <th
                    style={sortableHeadStyle(sortKey, "name")}
                    onClick={() => toggleSort("name")}
                  >
                    Sort by Name
                  </th>
                  <th style={tableHeadStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        padding: 32,
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: 14,
                      }}
                    >
                      No users found. Try changing filters or invite a new user.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id);

                    return (
                      <tr
                        key={user.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          background: isSelected ? "#f8fafc" : "#ffffff",
                        }}
                      >
                        <td style={tableCellStyle}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSingleSelect(user.id)}
                          />
                        </td>

                        <td style={tableCellStyle}>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: "50%",
                                background: "#e2e8f0",
                                color: "#0f172a",
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {getInitials(user.name)}
                            </div>

                            <div>
                              <div
                                style={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#0f172a",
                                }}
                              >
                                {user.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  marginTop: 4,
                                }}
                              >
                                {user.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={tableCellStyle}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                            {user.email}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                            {user.phone}
                          </div>
                        </td>

                        <td style={tableCellStyle}>
                          <span style={getRoleBadgeStyle(user.role)}>{user.role}</span>
                        </td>

                        <td style={tableCellStyle}>{user.department}</td>

                        <td style={tableCellStyle}>
                          <span style={getStatusBadgeStyle(user.status)}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: getStatusDotColor(user.status),
                              }}
                            />
                            {user.status}
                          </span>
                        </td>

                        <td style={tableCellStyle}>{formatDate(user.joinedAt)}</td>
                        <td style={tableCellStyle}>{formatDateTime(user.lastActive)}</td>
                        <td style={tableCellStyle}>{user.name}</td>

                        <td style={tableCellStyle}>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              type="button"
                              style={miniButtonStyle}
                              onClick={() => setEditUserId(user.id)}
                            >
                              Edit
                            </button>

                            {user.status !== "Active" && (
                              <button
                                type="button"
                                style={miniButtonStyle}
                                onClick={() => handleSingleStatusChange(user.id, "Active")}
                              >
                                Activate
                              </button>
                            )}

                            {user.status !== "Suspended" && (
                              <button
                                type="button"
                                style={miniButtonStyle}
                                onClick={() => handleSingleStatusChange(user.id, "Suspended")}
                              >
                                Suspend
                              </button>
                            )}

                            <button
                              type="button"
                              style={{
                                ...miniButtonStyle,
                                borderColor: "#fecaca",
                                background: "#fff1f2",
                                color: "#b91c1c",
                              }}
                              onClick={() => handleSingleDelete(user.id)}
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

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
              Showing {fromEntry} to {toEntry} of {filteredUsers.length} entries
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                style={secondaryButtonStyle}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>

              <div
                style={{
                  minWidth: 44,
                  height: 40,
                  borderRadius: 10,
                  background: "#0f172a",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  padding: "0 12px",
                }}
              >
                {currentPage}
              </div>

              <button
                type="button"
                style={secondaryButtonStyle}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {inviteModalOpen && (
          <ModalShell title="Invite User" onClose={() => setInviteModalOpen(false)}>
            <div style={modalGridStyle}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={inputStyle}
                  value={inviteForm.name}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  style={inputStyle}
                  value={inviteForm.phone}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label style={labelStyle}>Role</label>
                <select
                  style={selectStyle}
                  value={inviteForm.role}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                >
                  {roleOptions
                    .filter((role) => role !== "All Roles")
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Department</label>
                <input
                  style={inputStyle}
                  value={inviteForm.department}
                  onChange={(e) =>
                    setInviteForm((prev) => ({ ...prev, department: e.target.value }))
                  }
                  placeholder="Enter department"
                />
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  style={selectStyle}
                  value={inviteForm.status}
                  onChange={(e) =>
                    setInviteForm((prev) => ({
                      ...prev,
                      status: e.target.value as UserStatus,
                    }))
                  }
                >
                  {statusOptions
                    .filter((status) => status !== "All Status")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => setInviteModalOpen(false)}
              >
                Cancel
              </button>
              <button type="button" style={primaryButtonStyle} onClick={handleInviteUser}>
                Save User
              </button>
            </div>
          </ModalShell>
        )}

        {editUser && (
          <ModalShell title={`Edit User - ${editUser.name}`} onClose={() => setEditUserId(null)}>
            <div style={modalGridStyle}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={inputStyle}
                  value={editUser.name}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id ? { ...user, name: e.target.value } : user
                      )
                    )
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  value={editUser.email}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id ? { ...user, email: e.target.value } : user
                      )
                    )
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  style={inputStyle}
                  value={editUser.phone}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id ? { ...user, phone: e.target.value } : user
                      )
                    )
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Role</label>
                <select
                  style={selectStyle}
                  value={editUser.role}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id
                          ? { ...user, role: e.target.value as UserRole }
                          : user
                      )
                    )
                  }
                >
                  {roleOptions
                    .filter((role) => role !== "All Roles")
                    .map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Department</label>
                <input
                  style={inputStyle}
                  value={editUser.department}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id
                          ? { ...user, department: e.target.value }
                          : user
                      )
                    )
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select
                  style={selectStyle}
                  value={editUser.status}
                  onChange={(e) =>
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editUser.id
                          ? { ...user, status: e.target.value as UserStatus }
                          : user
                      )
                    )
                  }
                >
                  {statusOptions
                    .filter((status) => status !== "All Status")
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div style={modalFooterStyle}>
              <button
                type="button"
                style={secondaryButtonStyle}
                onClick={() => setEditUserId(null)}
              >
                Cancel
              </button>
              <button type="button" style={primaryButtonStyle} onClick={handleEditUserSave}>
                Update User
              </button>
            </div>
          </ModalShell>
        )}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            {title}
          </h3>
          <button type="button" style={secondaryButtonStyle} onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const tableHeadStyle: CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 800,
  color: "#334155",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

function sortableHeadStyle(activeSortKey: SortKey, currentKey: SortKey): CSSProperties {
  return {
    ...tableHeadStyle,
    cursor: "pointer",
    color: activeSortKey === currentKey ? "#0f172a" : "#334155",
  };
}

const tableCellStyle: CSSProperties = {
  padding: 16,
  fontSize: 14,
  color: "#334155",
  verticalAlign: "top",
};

const miniButtonStyle: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#0f172a",
  borderRadius: 10,
  padding: "8px 12px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  zIndex: 1000,
};

const modalStyle: CSSProperties = {
  width: "100%",
  maxWidth: 760,
  background: "#ffffff",
  borderRadius: 20,
  padding: 22,
  boxShadow: "0 30px 60px rgba(15, 23, 42, 0.25)",
  border: "1px solid #e2e8f0",
};

const modalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const modalFooterStyle: CSSProperties = {
  marginTop: 20,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  flexWrap: "wrap",
};