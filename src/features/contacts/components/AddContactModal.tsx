import { useEffect, useMemo, useState } from "react";
import { getTheme } from "../../theme";
import type { ThemeMode } from "../../theme";

type ContactFormData = {
  firstName: string;
  lastName: string;
  company: string;
  designation: string;
  email: string;
  phone: string;
  whatsapp: string;
  alternatePhone: string;
  leadSource: string;
  status: string;
  city: string;
  state: string;
  country: string;
  address: string;
  notes: string;
};

type AddContactModalProps = {
  open: boolean;
  mode: ThemeMode;
  onClose: () => void;
  onSave: (contact: ContactFormData & { id: string; createdAt: string }) => void;
};

const initialForm: ContactFormData = {
  firstName: "",
  lastName: "",
  company: "",
  designation: "",
  email: "",
  phone: "",
  whatsapp: "",
  alternatePhone: "",
  leadSource: "",
  status: "Active",
  city: "",
  state: "",
  country: "India",
  address: "",
  notes: "",
};

export default function AddContactModal({
  open,
  mode,
  onClose,
  onSave,
}: AddContactModalProps) {
  const theme = getTheme(mode);

  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const fullNamePreview = useMemo(() => {
    return `${form.firstName} ${form.lastName}`.trim() || "New Contact";
  }, [form.firstName, form.lastName]);

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      ...form,
      id: `contact_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    onSave(payload);
    setIsSubmitting(false);
    onClose();
  };

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 600,
    color: theme.text,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: theme.text,
    margin: "0 0 14px",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2, 6, 23, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 920,
          maxHeight: "90vh",
          overflow: "hidden",
          background: theme.cardBg,
          border: `1px solid ${theme.border}`,
          borderRadius: 24,
          boxShadow: "0 30px 80px rgba(0,0,0,0.30)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "22px 24px 18px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                lineHeight: 1.2,
                color: theme.text,
                fontWeight: 800,
              }}
            >
              Add Contact
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: theme.subText,
              }}
            >
              Create a new contact profile for your CRM.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: `1px solid ${theme.border}`,
              background: theme.cardBgSoft,
              color: theme.text,
              borderRadius: 12,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            padding: 24,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 24,
            }}
          >
            <div
              style={{
                background: theme.cardBgSoft,
                border: `1px solid ${theme.border}`,
                borderRadius: 20,
                padding: 20,
                height: "fit-content",
                position: "sticky",
                top: 0,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: theme.primary,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                {fullNamePreview.charAt(0).toUpperCase()}
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  color: theme.text,
                  fontWeight: 800,
                }}
              >
                {fullNamePreview}
              </h3>

              <p
                style={{
                  margin: "8px 0 0",
                  color: theme.subText,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {form.designation || "Designation not added"}
                {form.company ? ` at ${form.company}` : ""}
              </p>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: `1px solid ${theme.border}`,
                  display: "grid",
                  gap: 10,
                }}
              >
                <InfoRow label="Phone" value={form.phone || "Not added"} theme={theme} />
                <InfoRow label="Email" value={form.email || "Not added"} theme={theme} />
                <InfoRow label="Status" value={form.status || "Not set"} theme={theme} />
                <InfoRow
                  label="Location"
                  value={
                    [form.city, form.state, form.country].filter(Boolean).join(", ") || "Not added"
                  }
                  theme={theme}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: 22 }}>
              <section
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <h4 style={sectionTitleStyle}>Basic Details</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <Field
                    label="First Name *"
                    error={errors.firstName}
                    themeText={theme.text}
                  >
                    <input
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      style={inputStyle}
                    />
                  </Field>

                  <Field
                    label="Last Name"
                    error={errors.lastName}
                    themeText={theme.text}
                  >
                    <input
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Company" error={errors.company} themeText={theme.text}>
                    <input
                      value={form.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Enter company name"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Designation" error={errors.designation} themeText={theme.text}>
                    <input
                      value={form.designation}
                      onChange={(e) => handleChange("designation", e.target.value)}
                      placeholder="Enter designation"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </section>

              <section
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <h4 style={sectionTitleStyle}>Contact Information</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <Field label="Email" error={errors.email} themeText={theme.text}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Enter email address"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Phone *" error={errors.phone} themeText={theme.text}>
                    <input
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="Enter primary phone"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="WhatsApp" error={errors.whatsapp} themeText={theme.text}>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      placeholder="Enter WhatsApp number"
                      style={inputStyle}
                    />
                  </Field>

                  <Field
                    label="Alternate Phone"
                    error={errors.alternatePhone}
                    themeText={theme.text}
                  >
                    <input
                      value={form.alternatePhone}
                      onChange={(e) => handleChange("alternatePhone", e.target.value)}
                      placeholder="Enter alternate number"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </section>

              <section
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <h4 style={sectionTitleStyle}>CRM Details</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <Field label="Lead Source" error={errors.leadSource} themeText={theme.text}>
                    <select
                      value={form.leadSource}
                      onChange={(e) => handleChange("leadSource", e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">Select source</option>
                      <option value="Website">Website</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Referral">Referral</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="Walk-In">Walk-In</option>
                      <option value="Campaign">Campaign</option>
                    </select>
                  </Field>

                  <Field label="Status" error={errors.status} themeText={theme.text}>
                    <select
                      value={form.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      style={inputStyle}
                    >
                      <option value="Active">Active</option>
                      <option value="New">New</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Customer">Customer</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Field>
                </div>
              </section>

              <section
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <h4 style={sectionTitleStyle}>Address</h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 16,
                  }}
                >
                  <Field label="City" error={errors.city} themeText={theme.text}>
                    <input
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      placeholder="Enter city"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="State" error={errors.state} themeText={theme.text}>
                    <input
                      value={form.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      placeholder="Enter state"
                      style={inputStyle}
                    />
                  </Field>

                  <Field label="Country" error={errors.country} themeText={theme.text}>
                    <input
                      value={form.country}
                      onChange={(e) => handleChange("country", e.target.value)}
                      placeholder="Enter country"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={labelStyle}>Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Enter full address"
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: 100,
                    }}
                  />
                </div>
              </section>

              <section
                style={{
                  background: theme.cardBgSoft,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 20,
                  padding: 20,
                }}
              >
                <h4 style={sectionTitleStyle}>Notes</h4>

                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Add notes, preferences, follow-up context, or anything useful..."
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 130,
                  }}
                />
              </section>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: 20,
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              margin: 0,
              color: theme.subText,
              fontSize: 13,
            }}
          >
            Fields marked with * are required.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                background: theme.cardBgSoft,
                color: theme.text,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "none",
                background: theme.primary,
                color: "#ffffff",
                fontWeight: 800,
                cursor: "pointer",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Save Contact"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  themeText: string;
};

function Field({ label, error, children, themeText }: FieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 600,
          color: themeText,
        }}
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 12,
            color: "#ef4444",
            fontWeight: 600,
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  theme: ReturnType<typeof getTheme>;
};

function InfoRow({ label, value, theme }: InfoRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "92px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <span
        style={{
          color: theme.subText,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: theme.text,
          fontSize: 13,
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}