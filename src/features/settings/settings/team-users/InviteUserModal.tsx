// src/features/settings/settings/team-users/InviteUserModal.tsx

import { useEffect, useMemo, useState } from "react";
import { getTheme, type ThemeMode } from "../../../../theme";

export type InviteUserInput = {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  department?: string;
  message?: string;
  sendEmailInvite?: boolean;
  sendWhatsAppInvite?: boolean;
};

type InviteUserModalProps = {
  open: boolean;
  mode?: ThemeMode;
  loading?: boolean;
  roleOptions?: string[];
  departmentOptions?: string[];
  defaultRole?: string;
  title?: string;
  onClose: () => void;
  onSubmit: (values: InviteUserInput) => void | Promise<void>;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  message: string;
  sendEmailInvite: boolean;
  sendWhatsAppInvite: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const DEFAULT_ROLE_OPTIONS = ["Admin", "Manager", "Agent"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  if (!value) return true;
  return /^\+?[0-9\s\-()]{7,20}$/.test(value);
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

export default function InviteUserModal({
  open,
  mode = "light",
  loading = false,
  roleOptions = DEFAULT_ROLE_OPTIONS,
  departmentOptions = [],
  defaultRole = "Agent",
  title = "Invite User",
  onClose,
  onSubmit,
}: InviteUserModalProps) {
  const theme = getTheme(mode);

  const initialForm = useMemo<FormState>(
    () => ({
      name: "",
      email: "",
      phone: "",
      role: defaultRole,
      department: "",
      message:
        "You have been invited to join the MEI Business OS workspace. Please accept the invitation and complete your profile.",
      sendEmailInvite: true,
      sendWhatsAppInvite: false,
    }),
    [defaultRole]
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
    }
  }, [open, initialForm]);

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
    () => `invite-user-role-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const departmentDatalistId = useMemo(
    () => `invite-user-department-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  if (!open) {
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
      nextErrors.name = "Full name is required.";
    } else if (form.name.trim().length < 2) {
      nextErrors.name = "Full name must be at least 2 characters.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.phone.trim() && !isValidPhone(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!form.sendEmailInvite && !form.sendWhatsAppInvite) {
      nextErrors.sendEmailInvite = "Choose at least one invite delivery method.";
    }

    if (form.sendWhatsAppInvite && !form.phone.trim()) {
      nextErrors.phone = "Phone number is required for WhatsApp invite.";
    }

    if (form.message.trim().length > 1000) {
      nextErrors.message = "Message must be 1000 characters or fewer.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      role: form.role.trim() || undefined,
      department: form.department.trim() || undefined,
      message: form.message.trim() || undefined,
      sendEmailInvite: form.sendEmailInvite,
      sendWhatsAppInvite: form.sendWhatsAppInvite,
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
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={loading ? undefined : onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        background:
          mode === "dark" ? "rgba(2, 6, 23, 0.72)" : "rgba(15, 23, 42, 0.42)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflow: "hidden",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          boxShadow:
            mode === "dark"
              ? "0 24px 60px rgba(0,0,0,0.45)"
              : "0 24px 60px rgba(15, 23, 42, 0.16)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "22px 22px 16px",
            borderBottom: `1px solid ${theme.border}`,
            background: theme.cardBg,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background:
                    mode === "dark"
                      ? "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.18))"
                      : "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                  border: "1px solid rgba(59, 130, 246, 0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                ✉️
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 900,
                    color: theme.text,
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h2>
              </div>
            </div>

            <p
              style={{
                margin: 0,
                color: theme.subText,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Invite a new teammate, assign access, and send onboarding details in one flow.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close invite modal"
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

        <div
          style={{
            padding: 22,
            overflowY: "auto",
            display: "grid",
            gap: 18,
          }}
        >
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
              User Details
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
                  htmlFor="invite-user-name"
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
                  id="invite-user-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Enter full name"
                  style={baseInput}
                />
                {renderError("name")}
              </div>

              <div>
                <label
                  htmlFor="invite-user-email"
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
                  id="invite-user-email"
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
                  htmlFor="invite-user-phone"
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
                  id="invite-user-phone"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="Enter phone number"
                  style={baseInput}
                />
                {renderError("phone")}
              </div>

              <div>
                <label
                  htmlFor="invite-user-role"
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
                  id="invite-user-role"
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
            </div>

            <div>
              <label
                htmlFor="invite-user-department"
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
                id="invite-user-department"
                list={departmentDatalistId}
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="Sales, Operations, Support..."
                style={baseInput}
              />
              <datalist id={departmentDatalistId}>
                {departmentOptions.map((department) => (
                  <option key={department} value={department} />
                ))}
              </datalist>
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
              Invite Delivery
            </div>

            <div
              style={{
                display: "grid",
                gap: 10,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                background: theme.cardBgSoft,
                padding: 14,
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.sendEmailInvite}
                  onChange={(e) => setField("sendEmailInvite", e.target.checked)}
                />
                Send invite via email
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  color: theme.text,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.sendWhatsAppInvite}
                  onChange={(e) => setField("sendWhatsAppInvite", e.target.checked)}
                />
                Send invite via WhatsApp
              </label>

              {renderError("sendEmailInvite")}
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
              Custom Message
            </div>

            <div>
              <label
                htmlFor="invite-user-message"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: theme.text,
                }}
              >
                Invitation Message
              </label>
              <textarea
                id="invite-user-message"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Write a short welcome note..."
                rows={5}
                style={{
                  ...baseInput,
                  resize: "vertical",
                  minHeight: 120,
                  lineHeight: 1.6,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                {renderError("message") ?? <span />}
                <span
                  style={{
                    fontSize: 12,
                    color: theme.mutedText,
                  }}
                >
                  {form.message.length}/1000
                </span>
              </div>
            </div>
          </section>

          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              background: theme.cardBgSoft,
              padding: 14,
              display: "grid",
              gap: 8,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Preview
            </div>
            <div
              style={{
                fontSize: 13,
                color: theme.subText,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: theme.text }}>
                {form.name.trim() || "New User"}
              </strong>{" "}
              will be invited as{" "}
              <strong style={{ color: theme.text }}>
                {form.role.trim() || "Agent"}
              </strong>
              {form.department.trim()
                ? ` in ${form.department.trim()}`
                : ""}.
            </div>
          </section>
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            padding: 18,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            flexWrap: "wrap",
            background: theme.cardBg,
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
              padding: "11px 16px",
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
            onClick={() => void handleSubmit()}
            disabled={loading}
            style={{
              border: "none",
              background: theme.primary,
              color: theme.inverseText ?? "#ffffff",
              borderRadius: 12,
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              minWidth: 140,
            }}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}