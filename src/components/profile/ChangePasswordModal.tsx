import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { ThemeMode } from "../../theme";
import { getTheme } from "../../theme";

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordModalProps = {
  mode?: ThemeMode;
  open: boolean;
  title?: string;
  subtitle?: string;
  saveLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onSave: (values: ChangePasswordFormValues) => void;
};

export default function ChangePasswordModal({
  mode = "light",
  open,
  title = "Change Password",
  subtitle = "Update your password to keep the account protected and reduce unauthorized access risk.",
  saveLabel = "Update Password",
  cancelLabel = "Cancel",
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const theme = getTheme(mode);

  const [formValues, setFormValues] = useState<ChangePasswordFormValues>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (open) {
      setFormValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    }
  }, [open]);

  const validation = useMemo(() => {
    const errors: Partial<Record<keyof ChangePasswordFormValues, string>> = {};

    if (!formValues.currentPassword.trim()) {
      errors.currentPassword = "Current password is required.";
    }

    if (!formValues.newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (formValues.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    } else if (formValues.newPassword === formValues.currentPassword) {
      errors.newPassword = "New password must be different from current password.";
    }

    if (!formValues.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm the new password.";
    } else if (formValues.confirmPassword !== formValues.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
  }, [formValues]);

  const isDirty =
    formValues.currentPassword.length > 0 ||
    formValues.newPassword.length > 0 ||
    formValues.confirmPassword.length > 0;

  const isValid =
    Object.keys(validation).length === 0 &&
    formValues.currentPassword.trim() !== "" &&
    formValues.newPassword.trim() !== "" &&
    formValues.confirmPassword.trim() !== "";

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
    maxWidth: 680,
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
    maxWidth: 520,
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
    gap: 18,
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

  const fieldWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 16,
  };

  const labelStyle: CSSProperties = {
    color: theme.mutedText,
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.35,
    lineHeight: 1.5,
  };

  const inputRowStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    minHeight: 46,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
    color: theme.text,
    padding: "0 52px 0 14px",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxSizing: "border-box",
  };

  const toggleButtonStyle: CSSProperties = {
    position: "absolute",
    right: 8,
    top: 6,
    bottom: 6,
    minWidth: 38,
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    background: theme.cardBgSoft,
    color: theme.text,
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    padding: "0 10px",
  };

  const errorStyle: CSSProperties = {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.5,
  };

  const passwordRulesWrapStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 14,
  };

  const ruleCardStyle: CSSProperties = {
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: mode === "dark" ? theme.cardBg : "#FFFFFF",
  };

  const ruleTitleStyle: CSSProperties = {
    margin: 0,
    color: theme.text,
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.5,
  };

  const ruleTextStyle: CSSProperties = {
    margin: "4px 0 0",
    color: theme.subText,
    fontSize: 12,
    lineHeight: 1.6,
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
    opacity: isValid ? 1 : 0.65,
    cursor: isValid ? "pointer" : "not-allowed",
  };

  const handleChange =
    (field: keyof ChangePasswordFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const toggleVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    if (!isValid) return;
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
            <h3 style={sectionTitleStyle}>Password Update</h3>
            <p style={sectionTextStyle}>
              Choose a strong password that is hard to guess and easy for you to
              manage safely.
            </p>

            <PasswordField
              label="Current Password"
              value={formValues.currentPassword}
              onChange={handleChange("currentPassword")}
              visible={showPasswords.currentPassword}
              onToggle={() => toggleVisibility("currentPassword")}
              error={validation.currentPassword}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              fieldWrapStyle={fieldWrapStyle}
              inputRowStyle={inputRowStyle}
              toggleButtonStyle={toggleButtonStyle}
              errorStyle={errorStyle}
            />

            <PasswordField
              label="New Password"
              value={formValues.newPassword}
              onChange={handleChange("newPassword")}
              visible={showPasswords.newPassword}
              onToggle={() => toggleVisibility("newPassword")}
              error={validation.newPassword}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              fieldWrapStyle={fieldWrapStyle}
              inputRowStyle={inputRowStyle}
              toggleButtonStyle={toggleButtonStyle}
              errorStyle={errorStyle}
            />

            <PasswordField
              label="Confirm New Password"
              value={formValues.confirmPassword}
              onChange={handleChange("confirmPassword")}
              visible={showPasswords.confirmPassword}
              onToggle={() => toggleVisibility("confirmPassword")}
              error={validation.confirmPassword}
              inputStyle={inputStyle}
              labelStyle={labelStyle}
              fieldWrapStyle={fieldWrapStyle}
              inputRowStyle={inputRowStyle}
              toggleButtonStyle={toggleButtonStyle}
              errorStyle={errorStyle}
            />

            <div style={passwordRulesWrapStyle}>
              <div style={ruleCardStyle}>
                <p style={ruleTitleStyle}>Minimum length</p>
                <p style={ruleTextStyle}>Use at least 8 characters.</p>
              </div>
              <div style={ruleCardStyle}>
                <p style={ruleTitleStyle}>Avoid repetition</p>
                <p style={ruleTextStyle}>
                  Do not reuse your current password.
                </p>
              </div>
              <div style={ruleCardStyle}>
                <p style={ruleTitleStyle}>Better strength</p>
                <p style={ruleTextStyle}>
                  Mix letters, numbers, and symbols when possible.
                </p>
              </div>
              <div style={ruleCardStyle}>
                <p style={ruleTitleStyle}>Keep it private</p>
                <p style={ruleTextStyle}>
                  Never share your password in chat or email.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div style={footerStyle}>
          <div style={helperTextStyle}>
            {!isDirty
              ? "Enter your current and new password to continue."
              : isValid
              ? "Everything looks good. You can update the password now."
              : "Fix the password validation issues before continuing."}
          </div>

          <div style={actionsStyle}>
            <button type="button" style={secondaryButtonStyle} onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={handleSave}
              disabled={!isValid}
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  error,
  inputStyle,
  labelStyle,
  fieldWrapStyle,
  inputRowStyle,
  toggleButtonStyle,
  errorStyle,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  inputStyle: CSSProperties;
  labelStyle: CSSProperties;
  fieldWrapStyle: CSSProperties;
  inputRowStyle: CSSProperties;
  toggleButtonStyle: CSSProperties;
  errorStyle: CSSProperties;
}) {
  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={inputRowStyle}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          style={inputStyle}
        />
        <button type="button" style={toggleButtonStyle} onClick={onToggle}>
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? <div style={errorStyle}>{error}</div> : null}
    </div>
  );
}