import { useEffect, useMemo, useState } from "react";

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (payload: InviteUserFormValues) => void;
};

type RoleOption = "Admin" | "Manager" | "Sales" | "Support" | "Viewer";
type DepartmentOption =
  | "Management"
  | "Sales"
  | "Operations"
  | "Support"
  | "Marketing"
  | "Finance";

export type InviteUserFormValues = {
  fullName: string;
  email: string;
  phone: string;
  role: RoleOption;
  department: DepartmentOption;
  sendWelcomeEmail: boolean;
  allowDashboardAccess: boolean;
  allowLeadAccess: boolean;
  allowDealAccess: boolean;
  allowTaskAccess: boolean;
  inviteMessage: string;
};

const defaultFormValues: InviteUserFormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "Sales",
  department: "Sales",
  sendWelcomeEmail: true,
  allowDashboardAccess: true,
  allowLeadAccess: true,
  allowDealAccess: true,
  allowTaskAccess: true,
  inviteMessage:
    "Welcome to MEI CRM. Your account invitation has been created. Please accept the invite and complete your profile setup.",
};

const roleOptions: RoleOption[] = [
  "Admin",
  "Manager",
  "Sales",
  "Support",
  "Viewer",
];

const departmentOptions: DepartmentOption[] = [
  "Management",
  "Sales",
  "Operations",
  "Support",
  "Marketing",
  "Finance",
];

export default function InviteUserModal({
  isOpen,
  onClose,
  onInvite,
}: InviteUserModalProps) {
  const [form, setForm] = useState<InviteUserFormValues>(defaultFormValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof InviteUserFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(defaultFormValues);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const isFormDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(defaultFormValues);
  }, [form]);

  const updateField = <K extends keyof InviteUserFormValues>(
    key: K,
    value: InviteUserFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof InviteUserFormValues, string>> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.phone.trim() && !/^[0-9+\-\s()]{8,20}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (!form.inviteMessage.trim()) {
      nextErrors.inviteMessage = "Invite message cannot be empty.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRoleChange = (role: RoleOption) => {
    let updatedAccess = {
      allowDashboardAccess: true,
      allowLeadAccess: true,
      allowDealAccess: true,
      allowTaskAccess: true,
    };

    if (role === "Viewer") {
      updatedAccess = {
        allowDashboardAccess: true,
        allowLeadAccess: false,
        allowDealAccess: false,
        allowTaskAccess: false,
      };
    }

    if (role === "Support") {
      updatedAccess = {
        allowDashboardAccess: true,
        allowLeadAccess: true,
        allowDealAccess: false,
        allowTaskAccess: true,
      };
    }

    setForm((prev) => ({
      ...prev,
      role,
      ...updatedAccess,
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: InviteUserFormValues = {
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        inviteMessage: form.inviteMessage.trim(),
      };

      if (onInvite) {
        await Promise.resolve(onInvite(payload));
      } else {
        const storageKey = "mei-crm-user-invitations";
        const existingInvites = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        const newInvite = {
          id: `INV-${Date.now()}`,
          ...payload,
          status: "Pending",
          invitedAt: new Date().toISOString(),
        };

        localStorage.setItem(
          storageKey,
          JSON.stringify([newInvite, ...existingInvites])
        );
      }

      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Invite failed:", error);
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={handleBackdropClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Team Access</div>
            <h2 style={styles.title}>Invite User</h2>
            <p style={styles.subtitle}>
              Add a team member and define their access permissions before
              sending the invite.
            </p>
          </div>

          <button type="button" onClick={onClose} style={styles.closeButton}>
            ✕
          </button>
        </div>

        <div style={styles.body}>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Basic Information</div>

            <div style={styles.gridTwo}>
              <div>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  style={{
                    ...styles.input,
                    ...(errors.fullName ? styles.inputError : {}),
                  }}
                />
                {errors.fullName ? (
                  <div style={styles.errorText}>{errors.fullName}</div>
                ) : null}
              </div>

              <div>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                />
                {errors.email ? (
                  <div style={styles.errorText}>{errors.email}</div>
                ) : null}
              </div>

              <div>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  style={{
                    ...styles.input,
                    ...(errors.phone ? styles.inputError : {}),
                  }}
                />
                {errors.phone ? (
                  <div style={styles.errorText}>{errors.phone}</div>
                ) : null}
              </div>

              <div>
                <label style={styles.label}>Department</label>
                <select
                  value={form.department}
                  onChange={(e) =>
                    updateField(
                      "department",
                      e.target.value as DepartmentOption
                    )
                  }
                  style={styles.select}
                >
                  {departmentOptions.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Role Assignment</div>

            <div style={styles.roleGrid}>
              {roleOptions.map((role) => {
                const isActive = form.role === role;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    style={{
                      ...styles.roleCard,
                      ...(isActive ? styles.roleCardActive : {}),
                    }}
                  >
                    <div style={styles.roleTitle}>{role}</div>
                    <div style={styles.roleDescription}>
                      {getRoleDescription(role)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Permissions</div>

            <div style={styles.permissionGrid}>
              <PermissionToggle
                label="Dashboard Access"
                checked={form.allowDashboardAccess}
                onChange={(checked) =>
                  updateField("allowDashboardAccess", checked)
                }
              />
              <PermissionToggle
                label="Leads Access"
                checked={form.allowLeadAccess}
                onChange={(checked) => updateField("allowLeadAccess", checked)}
              />
              <PermissionToggle
                label="Deals Access"
                checked={form.allowDealAccess}
                onChange={(checked) => updateField("allowDealAccess", checked)}
              />
              <PermissionToggle
                label="Tasks Access"
                checked={form.allowTaskAccess}
                onChange={(checked) => updateField("allowTaskAccess", checked)}
              />
              <PermissionToggle
                label="Send Welcome Email"
                checked={form.sendWelcomeEmail}
                onChange={(checked) =>
                  updateField("sendWelcomeEmail", checked)
                }
              />
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionTitle}>Invite Message</div>

            <textarea
              rows={5}
              placeholder="Write a short welcome note..."
              value={form.inviteMessage}
              onChange={(e) => updateField("inviteMessage", e.target.value)}
              style={{
                ...styles.textarea,
                ...(errors.inviteMessage ? styles.inputError : {}),
              }}
            />

            {errors.inviteMessage ? (
              <div style={styles.errorText}>{errors.inviteMessage}</div>
            ) : null}
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.summaryTitle}>Invite Summary</div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Selected Role</span>
              <span style={styles.summaryValue}>{form.role}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Department</span>
              <span style={styles.summaryValue}>{form.department}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Active Permissions</span>
              <span style={styles.summaryValue}>
                {[
                  form.allowDashboardAccess && "Dashboard",
                  form.allowLeadAccess && "Leads",
                  form.allowDealAccess && "Deals",
                  form.allowTaskAccess && "Tasks",
                ]
                  .filter(Boolean)
                  .join(", ") || "No access"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={onClose} style={styles.secondaryButton}>
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setForm(defaultFormValues)}
            style={styles.ghostButton}
            disabled={!isFormDirty || isSubmitting}
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            style={{
              ...styles.primaryButton,
              ...(isSubmitting ? styles.primaryButtonDisabled : {}),
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Invite..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label style={styles.permissionItem}>
      <div>
        <div style={styles.permissionLabel}>{label}</div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          ...styles.toggle,
          ...(checked ? styles.toggleActive : {}),
        }}
      >
        <span
          style={{
            ...styles.toggleKnob,
            ...(checked ? styles.toggleKnobActive : {}),
          }}
        />
      </button>
    </label>
  );
}

function getRoleDescription(role: RoleOption) {
  switch (role) {
    case "Admin":
      return "Full access across users, settings, leads, deals, and reporting.";
    case "Manager":
      return "Manage team operations, monitor pipelines, and review performance.";
    case "Sales":
      return "Handle leads, pipeline follow-ups, deals, and client activity.";
    case "Support":
      return "Assist with follow-ups, tasks, and customer support workflows.";
    case "Viewer":
      return "Read-only access to limited business information.";
    default:
      return "";
  }
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.72)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: 920,
    maxHeight: "92vh",
    overflow: "hidden",
    borderRadius: 24,
    background: "#FFFFFF",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.28)",
    border: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: "24px 24px 18px",
    borderBottom: "1px solid #E2E8F0",
    background:
      "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#94A3B8",
    marginBottom: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: "#FFFFFF",
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#CBD5E1",
    maxWidth: 600,
  },
  closeButton: {
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#FFFFFF",
    width: 40,
    height: 40,
    borderRadius: 12,
    fontSize: 16,
    cursor: "pointer",
  },
  body: {
    padding: 24,
    overflowY: "auto",
    background: "#F8FAFC",
  },
  section: {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 16,
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    color: "#0F172A",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    color: "#0F172A",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
    color: "#0F172A",
    boxSizing: "border-box",
    minHeight: 120,
  },
  inputError: {
    border: "1px solid #EF4444",
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: "#DC2626",
    fontWeight: 600,
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
  },
  roleCard: {
    textAlign: "left",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  roleCardActive: {
    border: "1px solid #0F172A",
    background: "#EFF6FF",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 13,
    lineHeight: 1.55,
    color: "#475569",
  },
  permissionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  permissionItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: "14px 16px",
    border: "1px solid #E2E8F0",
    borderRadius: 16,
    background: "#FFFFFF",
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 999,
    border: "none",
    background: "#CBD5E1",
    position: "relative",
    cursor: "pointer",
    transition: "all 0.2s ease",
    flexShrink: 0,
  },
  toggleActive: {
    background: "#0F172A",
  },
  toggleKnob: {
    position: "absolute",
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#FFFFFF",
    transition: "all 0.2s ease",
  },
  toggleKnobActive: {
    left: 25,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    border: "1px solid #E2E8F0",
    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#0F172A",
    marginBottom: 12,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "10px 0",
    borderBottom: "1px dashed #E2E8F0",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: 600,
  },
  summaryValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: 700,
    textAlign: "right",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    padding: 20,
    borderTop: "1px solid #E2E8F0",
    background: "#FFFFFF",
    flexWrap: "wrap",
  },
  primaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 12,
    border: "none",
    background: "#0F172A",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  secondaryButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  ghostButton: {
    height: 46,
    padding: "0 18px",
    borderRadius: 12,
    border: "1px dashed #CBD5E1",
    background: "#F8FAFC",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
};