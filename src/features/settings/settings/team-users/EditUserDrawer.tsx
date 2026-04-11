// src/features/settings/settings/team-users/EditUserDrawer.tsx

import { useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeMode } from "../../../../theme";

export type EditableUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
  isOwner?: boolean;
};

export type EditUserInput = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  avatarUrl?: string;
  lastActiveAt?: string;
  joinedAt?: string;
  invitedAt?: string;
  isOwner?: boolean;
};

type EditUserDrawerProps = {
  open: boolean;
  user: EditableUser | null;
  mode?: ThemeMode;
  loading?: boolean;
  roleOptions?: string[];
  statusOptions?: string[];
  departmentOptions?: string[];
  onClose: () => void;
  onSave: (userId: string, updates: EditUserInput) => void | Promise<void>;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: string;
  avatarUrl: string;
  lastActiveAt: string;
  joinedAt: string;
  invitedAt: string;
  isOwner: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_ROLE_OPTIONS = ["Admin", "Manager", "Agent"];
const DEFAULT_STATUS_OPTIONS = ["active", "invited", "inactive", "suspended"];

function normalizeString(value?: string): string {
  return typeof value === "string" ? value.trim() : "";
}

function toFormState(user: EditableUser | null): FormState {
  return {
    name: normalizeString(user?.name),
    email: normalizeString(user?.email),
    phone: normalizeString(user?.phone),
    role: normalizeString(user?.role),
    department: normalizeString(user?.department),
    status: normalizeString(user?.status),
    avatarUrl: normalizeString(user?.avatarUrl),
    lastActiveAt: normalizeString(user?.lastActiveAt),
    joinedAt: normalizeString(user?.joinedAt),
    invitedAt: normalizeString(user?.invitedAt),
    isOwner: Boolean(user?.isOwner),
  };
}

function isValidEmail(value: string): boolean {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function inputStyle(theme: ReturnType<typeof getTheme>) {
  return {
    width: "100%",
    border: `1px solid ${theme.border}`,
    background: theme.inputBg ?? theme.cardBgSoft,
    color: theme.text,
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box" as const,
  };
}

export default function EditUserDrawer({
  open,
  user,
  mode = "light",
  loading = false,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  departmentOptions = [],
  onClose,
  onSave,
}: EditUserDrawerProps) {
  const theme = getTheme(mode);

  const [form, setForm] = useState<FormState>(() => toFormState(user));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setForm(toFormState(user));
      setErrors({});
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onClose]);

  const roleDatalistId = useMemo(
    () => `edit-user-role-${Math.random().toString(36).slice(2, 8)}`,
    []
  );
  const departmentDatalistId = useMemo(
    () => `edit-user-department-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  if (!open || !user) {
    return null;
  }

  const baseInput = inputStyle(theme);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: "" };
    });
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "User name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "User name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.phone.trim() && form.phone.trim().length < 7) {
      nextErrors.phone = "Phone number looks too short.";
    }

    if (!form.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!form.status.trim()) {
      nextErrors.status = "Status is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    await onSave(user.id, {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      role: form.role.trim() || undefined,
      department: form.department.trim() || undefined,
      status: form.status.trim() || undefined,
      avatarUrl: form.avatarUrl.trim() || undefined,
      lastActiveAt: form.lastActiveAt.trim() || undefined,
      joinedAt: form.joinedAt.trim() || undefined,
      invitedAt: form.invitedAt.trim() || undefined,
      isOwner: form.isOwner,
    });
  };

  const renderError = (key: keyof FormState) =>
    errors[key] ? (
      <div
        style={{
          color: theme.danger ?? "#dc2626",
          fontSize: 12,
          marginTop: 6,
        }}
      >
        {errors[key]}
      </div>
    ) : null;

  return (
    <div
      onClick={loading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit user drawer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1250,
        background:
          mode === "dark" ? "rgba(2, 6, 23, 0.72)" : "rgba(15, 23, 42, 0.40)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          height: "100%",
          background: theme.cardBg,
          borderLeft: `1px solid ${theme.border}`,
          boxShadow:
            mode === "dark"
              ? "-12px 0 40px rgba(0,0,0,0.34)"
              : "-12px 0 40px rgba(15, 23, 42, 0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            background: theme.cardBg,
            borderBottom: `1px solid ${theme.border}`,
            padding: "20px 18px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 14,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 900,
                  color: theme.text,
                  lineHeight: 1.2,
                }}
              >
                Edit User
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: theme.subText,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Update role, contact info, status, and workspace profile details.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close drawer"
              style={{
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                width: 40,
                height: 40,
                borderRadius: 12,
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
                opacity: loading ? 0.7 : 1,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 18,
            display: "grid",
            gap: 18,
          }}
        >
          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              background: theme.cardBgSoft,
              padding: 16,
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background:
                    mode === "dark"
                      ? "linear-gradient(135deg, rgba(99,102,241,0.24), rgba(59,130,246,0.18))"
                      : "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(59,130,246,0.12))",
                  border: `1px solid ${theme.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.text,
                  fontSize: 18,
                  fontWeight: 900,
                }}
              >
                {(form.name.trim()[0] ?? "U").toUpperCase()}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: theme.text,
                    lineHeight: 1.2,
                  }}
                >
                  {form.name.trim() || "Unnamed User"}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.subText,
                    marginTop: 4,
                    wordBreak: "break-word",
                  }}
                >
                  {form.email.trim() || "No email"}
                </div>
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Basic Information
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="edit-user-name"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Full Name *
                </label>
                <input
                  id="edit-user-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter full name"
                  style={baseInput}
                />
                {renderError("name")}
              </div>

              <div>
                <label
                  htmlFor="edit-user-email"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Email *
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="Enter email address"
                  style={baseInput}
                />
                {renderError("email")}
              </div>

              <div>
                <label
                  htmlFor="edit-user-phone"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Phone
                </label>
                <input
                  id="edit-user-phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="Enter phone number"
                  style={baseInput}
                />
                {renderError("phone")}
              </div>

              <div>
                <label
                  htmlFor="edit-user-avatar"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Avatar URL
                </label>
                <input
                  id="edit-user-avatar"
                  value={form.avatarUrl}
                  onChange={(e) => setField("avatarUrl", e.target.value)}
                  placeholder="https://..."
                  style={baseInput}
                />
              </div>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Role & Access
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="edit-user-role"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Role *
                </label>
                <input
                  id="edit-user-role"
                  list={roleDatalistId}
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value)}
                  placeholder="Select or type role"
                  style={baseInput}
                />
                <datalist id={roleDatalistId}>
                  {roleOptions.map((role) => (
                    <option key={role} value={role} />
                  ))}
                </datalist>
                {renderError("role")}
              </div>

              <div>
                <label
                  htmlFor="edit-user-status"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Status *
                </label>
                <select
                  id="edit-user-status"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  style={baseInput}
                >
                  <option value="">Select status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {renderError("status")}
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-user-department"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Department
              </label>
              <input
                id="edit-user-department"
                list={departmentDatalistId}
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="Sales, Support, Operations..."
                style={baseInput}
              />
              <datalist id={departmentDatalistId}>
                {departmentOptions.map((department) => (
                  <option key={department} value={department} />
                ))}
              </datalist>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: loading ? "not-allowed" : "pointer",
                color: theme.text,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <input
                type="checkbox"
                checked={form.isOwner}
                onChange={(e) => setField("isOwner", e.target.checked)}
                disabled={loading}
              />
              Mark as workspace owner
            </label>
          </section>

          <section
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Timeline Details
            </div>

            <div
              style={{
                display: "grid",
                gap: 14,
              }}
            >
              <div>
                <label
                  htmlFor="edit-user-joined"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Joined At
                </label>
                <input
                  id="edit-user-joined"
                  value={form.joinedAt}
                  onChange={(e) => setField("joinedAt", e.target.value)}
                  placeholder="2026-04-11T10:00:00.000Z"
                  style={baseInput}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-user-invited"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Invited At
                </label>
                <input
                  id="edit-user-invited"
                  value={form.invitedAt}
                  onChange={(e) => setField("invitedAt", e.target.value)}
                  placeholder="2026-04-11T10:00:00.000Z"
                  style={baseInput}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-user-active"
                  style={{
                    display: "block",
                    marginBottom: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    color: theme.text,
                  }}
                >
                  Last Active At
                </label>
                <input
                  id="edit-user-active"
                  value={form.lastActiveAt}
                  onChange={(e) => setField("lastActiveAt", e.target.value)}
                  placeholder="2026-04-11T10:00:00.000Z"
                  style={baseInput}
                />
              </div>
            </div>
          </section>
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            background: theme.cardBg,
            padding: 18,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={loading}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 12,
              padding: "12px 18px",
              fontSize: 14,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              minWidth: 130,
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </aside>
    </div>
  );
}