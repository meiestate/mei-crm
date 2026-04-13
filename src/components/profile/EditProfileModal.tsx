import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type EditProfileFormValues = {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  location: string;
  timezone: string;
  language: string;
  bio: string;
};

type EditProfileModalProps = {
  mode?: ThemeMode;
  open: boolean;
  title?: string;
  subtitle?: string;
  initialValues: EditProfileFormValues;
  saveLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onSave: (values: EditProfileFormValues) => void;
};

export default function EditProfileModal({
  mode = "light",
  open,
  title = "Edit Profile",
  subtitle = "Update personal identity, communication details, and profile preferences.",
  initialValues,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  onClose,
  onSave,
}: EditProfileModalProps) {
  const theme = getTheme(mode);

  const [formValues, setFormValues] =
    useState<EditProfileFormValues>(initialValues);

  useEffect(() => {
    if (open) {
      setFormValues(initialValues);
    }
  }, [initialValues, open]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formValues) !== JSON.stringify(initialValues);
  }, [formValues, initialValues]);

  if (!open) {
    return null;
  }

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: mode === "dark" ? "rgba(2,6,23,0.72)" : "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1000,
  };

  const modalStyle: CSSProperties = {
    width: "100%",
    maxWidth: 860,
    maxHeight: "90vh",
    overflow: "auto",
    background: theme.cardBg,
    border: `1px solid ${theme.border}`,
    borderRadius: 24,
    boxShadow:
      mode === "dark"
        ? "0 24px 80px rgba(0,0,0,0.45)"
        : "0 24px 80px rgba(15,23,42,0.16)",
  };

  const headerStyle: CSSProperties = {
    padding: "22px 22px 18px",
    borderBottom: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.25,
  };

  const subtitleStyle: CSSProperties = {
    margin: "8px 0 0",
    color: theme.subText,
    fontSize: 14,
    lineHeight: 1.7,
    maxWidth: 620,
  };

  const closeButtonStyle: CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    flexShrink: 0,
  };

  const bodyStyle: CSSProperties = {
    padding: 22,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  const sectionCardStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    borderRadius: 18,
    padding: 18,
  };

  const sectionTitleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.3,
  };

  const sectionTextStyle: CSSProperties = {
    margin: "6px 0 0",
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.65,
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 16,
  };

  const fieldWrapStyle: CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const labelStyle: CSSProperties = {
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.35,
    lineHeight: 1.5,
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    minHeight: 44,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    padding: "0 14px",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle: CSSProperties = {
    width: "100%",
    minHeight: 120,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    padding: "12px 14px",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.7,
  };

  const footerStyle: CSSProperties = {
    padding: "18px 22px 22px",
    borderTop: `1px solid ${theme.borderSoft}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  };

  const helperTextStyle: CSSProperties = {
    color: theme.subText,
    fontSize: 13,
    lineHeight: 1.6,
  };

  const actionsStyle: CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const secondaryButtonStyle: CSSProperties = {
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    minHeight: 42,
    padding: "0 16px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };

  const primaryButtonStyle: CSSProperties = {
    ...secondaryButtonStyle,
    border: `1px solid ${theme.primary}`,
    background: theme.primary,
    color: theme.inverseText,
    opacity: isDirty ? 1 : 0.65,
    cursor: isDirty ? "pointer" : "not-allowed",
  };

  const handleChange =
    (field: keyof EditProfileFormValues) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = event.target.value;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleSave = () => {
    if (!isDirty) return;
    onSave(formValues);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} onClick={handleModalClick}>
        <div style={headerStyle}>
          <div style={{ minWidth: 0, flex: "1 1 auto" }}>
            <h2 style={titleStyle}>{title}</h2>
            <p style={subtitleStyle}>{subtitle}</p>
          </div>

          <button type="button" style={closeButtonStyle} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={bodyStyle}>
          <section style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Basic Identity</h3>
            <p style={sectionTextStyle}>
              Keep core personal details accurate so the account stays clear and
              trustworthy across the workspace.
            </p>

            <div style={gridStyle}>
              <Field
                label="Full Name"
                value={formValues.fullName}
                onChange={handleChange("fullName")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Display Name"
                value={formValues.displayName}
                onChange={handleChange("displayName")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Email Address"
                type="email"
                value={formValues.email}
                onChange={handleChange("email")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Phone Number"
                value={formValues.phone}
                onChange={handleChange("phone")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Alternate Phone"
                value={formValues.alternatePhone}
                onChange={handleChange("alternatePhone")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Location"
                value={formValues.location}
                onChange={handleChange("location")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
            </div>
          </section>

          <section style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>Regional Preferences</h3>
            <p style={sectionTextStyle}>
              These values help the product feel local, precise, and easier to
              use every day.
            </p>

            <div style={gridStyle}>
              <Field
                label="Timezone"
                value={formValues.timezone}
                onChange={handleChange("timezone")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
              <Field
                label="Language"
                value={formValues.language}
                onChange={handleChange("language")}
                inputStyle={inputStyle}
                labelStyle={labelStyle}
                wrapStyle={fieldWrapStyle}
              />
            </div>
          </section>

          <section style={sectionCardStyle}>
            <h3 style={sectionTitleStyle}>About Profile</h3>
            <p style={sectionTextStyle}>
              A short bio gives context about role, style, and how this person
              shows up inside the business.
            </p>

            <div style={{ ...fieldWrapStyle, marginTop: 16 }}>
              <label style={labelStyle}>Bio / About</label>
              <textarea
                value={formValues.bio}
                onChange={handleChange("bio")}
                style={textareaStyle}
                placeholder="Write a short profile summary..."
              />
            </div>
          </section>
        </div>

        <div style={footerStyle}>
          <div style={helperTextStyle}>
            {isDirty
              ? "You have unsaved changes."
              : "No changes yet. Update any field to enable saving."}
          </div>

          <div style={actionsStyle}>
            <button type="button" style={secondaryButtonStyle} onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={handleSave}
              disabled={!isDirty}
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputStyle,
  labelStyle,
  wrapStyle,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.HTMLInputTypeAttribute;
  inputStyle: CSSProperties;
  labelStyle: CSSProperties;
  wrapStyle: CSSProperties;
}) {
  return (
    <div style={wrapStyle}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} style={inputStyle} />
    </div>
  );
}