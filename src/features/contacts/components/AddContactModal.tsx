import { useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

export type ContactFormData = {
  firstName: string;
  lastName: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone: string;
  source: string;
  status: string;
  ownerName: string;
  location: string;
  budget: string;
  tags: string;
  notes: string;
};

type AddContactModalProps = {
  open: boolean;
  mode?: ThemeMode;
  title?: string;
  initialData?: Partial<ContactFormData>;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void | Promise<void>;
};

const defaultFormData: ContactFormData = {
  firstName: "",
  lastName: "",
  company: "",
  designation: "",
  email: "",
  phone: "",
  alternatePhone: "",
  source: "manual",
  status: "active",
  ownerName: "",
  location: "",
  budget: "",
  tags: "",
  notes: "",
};

export default function AddContactModal({
  open,
  mode = "light",
  title = "Add Contact",
  initialData,
  loading = false,
  onClose,
  onSubmit,
}: AddContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const isDark = mode === "dark";

  const theme = {
    overlay: "rgba(2, 6, 23, 0.72)",
    cardBg: isDark ? "#0f172a" : "#ffffff",
    cardSoft: isDark ? "#111827" : "#f8fafc",
    text: isDark ? "#e5e7eb" : "#0f172a",
    subText: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.10)",
    borderStrong: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.14)",
    inputBg: isDark ? "#111827" : "#ffffff",
    inputBorder: isDark ? "rgba(148,163,184,0.22)" : "rgba(15,23,42,0.12)",
    primary: "#2563eb",
    primarySoft: isDark ? "rgba(37,99,235,0.16)" : "rgba(37,99,235,0.10)",
    danger: "#dc2626",
    shadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.42)"
      : "0 20px 48px rgba(15,23,42,0.16)",
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    setFormData({
      ...defaultFormData,
      ...initialData,
    });

    setErrors({});
  }, [open, initialData]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, loading, onClose]);

  const modalTitle = useMemo(() => {
    const hasInitialData =
      Boolean(initialData?.firstName) ||
      Boolean(initialData?.lastName) ||
      Boolean(initialData?.email);

    return hasInitialData ? "Edit Contact" : title;
  }, [initialData, title]);

  const updateField = <K extends keyof ContactFormData>(
    key: K,
    value: ContactFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        nextErrors.email = "Enter a valid email address.";
      }
    }

    if (formData.phone.trim()) {
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10) {
        nextErrors.phone = "Enter a valid phone number.";
      }
    }

    if (formData.alternatePhone.trim()) {
      const altDigits = formData.alternatePhone.replace(/\D/g, "");
      if (altDigits.length < 10) {
        nextErrors.alternatePhone = "Enter a valid alternate phone number.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    await onSubmit({
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      company: formData.company.trim(),
      designation: formData.designation.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      alternatePhone: formData.alternatePhone.trim(),
      ownerName: formData.ownerName.trim(),
      location: formData.location.trim(),
      budget: formData.budget.trim(),
      tags: formData.tags.trim(),
      notes: formData.notes.trim(),
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={modalTitle}
      onClick={() => {
        if (!loading) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: theme.overlay,
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
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "auto",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          boxShadow: theme.shadow,
        }}
      >
        <div
          style={{
            padding: "20px 22px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 800,
                color: theme.text,
                letterSpacing: "-0.03em",
              }}
            >
              {modalTitle}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: theme.subText,
                lineHeight: 1.6,
              }}
            >
              Capture contact details, ownership, source, and follow-up context.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: `1px solid ${theme.borderStrong}`,
              background: theme.cardSoft,
              color: theme.text,
              fontSize: 18,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: 22,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <Field label="First Name" error={errors.firstName} fullWidth>
            <input
              value={formData.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              placeholder="Enter first name"
              style={getInputStyle(theme, !!errors.firstName)}
            />
          </Field>

          <Field label="Last Name" error={errors.lastName} fullWidth>
            <input
              value={formData.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              placeholder="Enter last name"
              style={getInputStyle(theme, !!errors.lastName)}
            />
          </Field>

          <Field label="Company" error={errors.company}>
            <input
              value={formData.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Company name"
              style={getInputStyle(theme, !!errors.company)}
            />
          </Field>

          <Field label="Designation" error={errors.designation}>
            <input
              value={formData.designation}
              onChange={(event) => updateField("designation", event.target.value)}
              placeholder="Job title / designation"
              style={getInputStyle(theme, !!errors.designation)}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Email address"
              style={getInputStyle(theme, !!errors.email)}
            />
          </Field>

          <Field label="Phone" error={errors.phone}>
            <input
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="Primary phone number"
              style={getInputStyle(theme, !!errors.phone)}
            />
          </Field>

          <Field label="Alternate Phone" error={errors.alternatePhone}>
            <input
              value={formData.alternatePhone}
              onChange={(event) =>
                updateField("alternatePhone", event.target.value)
              }
              placeholder="Alternate phone number"
              style={getInputStyle(theme, !!errors.alternatePhone)}
            />
          </Field>

          <Field label="Source" error={errors.source}>
            <select
              value={formData.source}
              onChange={(event) => updateField("source", event.target.value)}
              style={getInputStyle(theme, !!errors.source)}
            >
              <option value="manual">Manual</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="call">Call</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Status" error={errors.status}>
            <select
              value={formData.status}
              onChange={(event) => updateField("status", event.target.value)}
              style={getInputStyle(theme, !!errors.status)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="archived">Archived</option>
            </select>
          </Field>

          <Field label="Owner Name" error={errors.ownerName}>
            <input
              value={formData.ownerName}
              onChange={(event) => updateField("ownerName", event.target.value)}
              placeholder="Assigned owner"
              style={getInputStyle(theme, !!errors.ownerName)}
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <input
              value={formData.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="City / Area / Region"
              style={getInputStyle(theme, !!errors.location)}
            />
          </Field>

          <Field label="Budget" error={errors.budget}>
            <input
              value={formData.budget}
              onChange={(event) => updateField("budget", event.target.value)}
              placeholder="Budget range"
              style={getInputStyle(theme, !!errors.budget)}
            />
          </Field>

          <Field label="Tags" error={errors.tags}>
            <input
              value={formData.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="Comma separated tags"
              style={getInputStyle(theme, !!errors.tags)}
            />
          </Field>

          <Field label="Notes" error={errors.notes} fullWidth>
            <textarea
              value={formData.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Write notes, context, follow-up details..."
              rows={5}
              style={{
                ...getInputStyle(theme, !!errors.notes),
                height: "auto",
                minHeight: 120,
                paddingTop: 12,
                resize: "vertical",
              }}
            />
          </Field>
        </div>

        <div
          style={{
            padding: "18px 22px 22px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              border: `1px solid ${theme.borderStrong}`,
              background: theme.cardSoft,
              color: theme.text,
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 12,
              border: "none",
              background: theme.primary,
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.72 : 1,
            }}
          >
            {loading ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  fullWidth = false,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#64748b",
        }}
      >
        {label}
      </label>

      {children}

      {error ? (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "#dc2626",
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}

function getInputStyle(
  theme: {
    inputBg: string;
    inputBorder: string;
    text: string;
    danger: string;
  },
  hasError: boolean,
): React.CSSProperties {
  return {
    width: "100%",
    height: 44,
    borderRadius: 14,
    border: `1px solid ${hasError ? theme.danger : theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "0 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  };
}